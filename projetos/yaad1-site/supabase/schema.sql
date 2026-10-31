-- Yaad1 (Supabase "yaad1", sa-east-1): esquema aplicado pelas migrações yaad1_base, registrar_uso_ia e mfa_obrigatorio_e_teto_global.
-- Mantido aqui para consulta e para recriar o banco. Não contém dados nem segredos.

create table public.user_docs (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null check (char_length(id) between 1 and 64),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.user_docs enable row level security;
create policy "ler os proprios docs" on public.user_docs for select to authenticated using ((select auth.uid()) = user_id);
create policy "criar os proprios docs" on public.user_docs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "alterar os proprios docs" on public.user_docs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "apagar os proprios docs" on public.user_docs for delete to authenticated using ((select auth.uid()) = user_id);

create table public.app_owner (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.app_owner enable row level security;
create policy "cada um ve se e dono" on public.app_owner for select to authenticated using ((select auth.uid()) = user_id);

create table public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  dia date not null default current_date,
  chamadas int not null default 0,
  primary key (user_id, dia)
);
alter table public.ai_usage enable row level security;
create policy "ver o proprio uso" on public.ai_usage for select to authenticated using ((select auth.uid()) = user_id);
-- (sem política de escrita: só a função registrar_uso grava)

insert into storage.buckets (id, name, public, file_size_limit) values ('fotos', 'fotos', false, 5242880) on conflict (id) do nothing;
create policy "ler as proprias fotos" on storage.objects for select to authenticated using (bucket_id = 'fotos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "enviar as proprias fotos" on storage.objects for insert to authenticated with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "apagar as proprias fotos" on storage.objects for delete to authenticated using (bucket_id = 'fotos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Quem ativou a verificação em 2 etapas só acessa os dados com sessão aal2
create or replace function public.aal_ok() returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((auth.jwt() ->> 'aal') = 'aal2', false)
      or not exists (select 1 from auth.mfa_factors f where f.user_id = auth.uid() and f.status = 'verified');
$$;
create policy "2 etapas quando ativada" on public.user_docs as restrictive for all to authenticated using (public.aal_ok()) with check (public.aal_ok());
create policy "2 etapas quando ativada" on public.app_owner as restrictive for select to authenticated using (public.aal_ok());
create policy "2 etapas quando ativada" on public.ai_usage as restrictive for select to authenticated using (public.aal_ok());
create policy "2 etapas nas fotos" on storage.objects as restrictive for all to authenticated using (bucket_id <> 'fotos' or public.aal_ok()) with check (bucket_id <> 'fotos' or public.aal_ok());

-- Uso da IA: limite por pessoa (no máximo 200), teto global de 1.500 por dia e 2 etapas exigidas quando ativadas
create or replace function public.registrar_uso(limite int) returns boolean language plpgsql security definer set search_path = '' as $$
declare n int; total int; hoje date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if auth.uid() is null or not public.aal_ok() then return false; end if;
  select coalesce(sum(chamadas),0) into total from public.ai_usage where dia = hoje;
  if total >= 1500 then return false; end if;
  insert into public.ai_usage (user_id, dia, chamadas) values (auth.uid(), hoje, 1)
  on conflict (user_id, dia) do update set chamadas = public.ai_usage.chamadas + 1
  returning chamadas into n;
  return n <= least(greatest(limite, 1), 200);
end; $$;
revoke all on function public.registrar_uso(int) from public, anon;
grant execute on function public.registrar_uso(int) to authenticated;

-- A dona é marcada à mão, sem e-mail no código: insert into public.app_owner (user_id) values ('<id da conta>');
