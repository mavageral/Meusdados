"""Modelo preditivo da prova de Recenseador IBGE 2027 (Cesgranrio).
Prova: 30 técnicas, 15 de Matemática, 15 de Português, 5 letras, sem penalidade.
Aprovação: >= 18 e >= 1 em cada matéria. Vaga: ordem de nota na área de trabalho.
Tudo aqui é simulação com hipóteses declaradas; nada é dado real de candidatos."""
import numpy as np
rng = np.random.default_rng(2027)
Q = {"tec": 30, "mat": 15, "por": 15}

def prova(p, n, kappa=12):
    """n provas de quem tem acerto médio p por matéria. Dificuldade varia por questão
    (Beta com concentração kappa): algumas fáceis, outras difíceis. Chute = 20%."""
    tot = np.zeros(n, int); zero = np.zeros(n, bool)
    for d, q in Q.items():
        a, b = p[d] * kappa, (1 - p[d]) * kappa
        pq = rng.beta(a, b, size=(n, q))
        acertos = (rng.random((n, q)) < pq).sum(1)
        tot += acertos; zero |= acertos == 0
    return tot, zero

def chance_corte(p, n=200_000):
    t, z = prova(p, n); ok = (t >= 18) & ~z
    return ok.mean(), t.mean(), np.percentile(t, [10, 50, 90])

def concorrentes(n, perfil):
    """Notas dos concorrentes presentes. Mistura de 3 grupos (hipótese):
    sem preparo (acerto ~ chute a 35%), preparo médio (~50%), bem preparados (~70%)."""
    g = rng.choice(3, size=n, p=perfil)
    m = np.array([0.32, 0.50, 0.70])[g] + rng.normal(0, 0.06, n)
    m = np.clip(m, 0.2, 0.97)
    t = np.zeros(n, int); z = np.zeros(n, bool)
    for d, q in Q.items():
        pq = np.clip(m[:, None] + rng.normal(0, 0.05, (n, 1)), 0.2, 0.98)  # força varia por matéria
        ac = rng.binomial(q, pq[:, 0]); t += ac; z |= ac == 0
    return np.where((t >= 18) & ~z, t, -1)

PERFIL=(0.45, 0.40, 0.15)
def chance_vaga(p, cand_vaga, vagas=20, faltas=0.35, perfil=None, rodadas=4000):
    perfil = perfil or PERFIL
    """Probabilidade de ficar entre os 'vagas' primeiros da área."""
    inscritos = int(round(cand_vaga * vagas)); n = max(1, int(round(inscritos * (1 - faltas))) - 1)
    minha, zero = prova(p, rodadas); minha = np.where((minha >= 18) & ~zero, minha, -1)
    ganhou = 0; cortes = []
    for i in range(rodadas):
        c = concorrentes(n, perfil)
        aprovados = np.sort(c[c >= 0])[::-1]
        corte_class = aprovados[vagas - 1] if len(aprovados) >= vagas else 18
        cortes.append(corte_class)
        if minha[i] < 0: continue
        acima = (c > minha[i]).sum(); empate = (c == minha[i]).sum()
        # empate: o edital desempata por idade e depois por Técnicos; aqui, meio a meio
        pos = acima + 1 + rng.integers(0, empate + 1)
        ganhou += pos <= vagas
    return ganhou / rodadas, np.median(cortes), np.percentile(cortes, [10, 90])

import sys
if len(sys.argv)>1: PERFIL=tuple(map(float,sys.argv[1].split(",")))
if __name__ == "__main__":
    print("== 1. Chance de passar do corte (18 e 1 por matéria), por nível de acerto")
    for nome, p in [("Chute puro (20%)", dict(tec=.2, mat=.2, por=.2)),
                    ("Iniciante (30%)", dict(tec=.3, mat=.3, por=.3)), ("Quase lá (35%)", dict(tec=.35, mat=.3, por=.35)),
                    ("Base (45%)", dict(tec=.45, mat=.4, por=.45)),
                    ("Competitiva (60%)", dict(tec=.65, mat=.55, por=.6)),
                    ("Forte (75%)", dict(tec=.8, mat=.65, por=.75)),
                    ("Excelente (85%)", dict(tec=.9, mat=.75, por=.85))]:
        c, m, pc = chance_corte(p)
        print(f"{nome:20s} corte {c*100:5.1f}%  nota média {m:4.1f}  faixa 80%: {pc[0]:.0f} a {pc[2]:.0f}")
    print("\n== 2. Chance de pegar a vaga (área com 20 vagas), por concorrência e nível")
    niveis = [("Base (45%)", dict(tec=.45, mat=.4, por=.45)), ("Competitiva (60%)", dict(tec=.65, mat=.55, por=.6)),
              ("Forte (75%)", dict(tec=.8, mat=.65, por=.75)), ("Excelente (85%)", dict(tec=.9, mat=.75, por=.85))]
    for cv in (3, 8, 15, 30, 60):
        linha = []
        for nome, p in niveis:
            g, corte, _ = chance_vaga(p, cv, rodadas=1500)
            linha.append(f"{g*100:5.1f}%")
        _, corte, faixa = chance_vaga(niveis[0][1], cv, rodadas=400)
        print(f"{cv:3d} candidatos/vaga: " + "  ".join(f"{n.split()[0]} {v}" for (n, _), v in zip(niveis, linha)) + f"   | nota da última vaga ~{corte:.0f} ({faixa[0]:.0f}-{faixa[1]:.0f})")
