"""Gera projetos/sala-caverna/conteudo/apostila-ibge/apostila.json a partir do texto da apostila oficial do IBGE
("Conhecimentos básicos para o 12º Censo Agropecuário, Florestal e Aquícola"), extraído com:
  pdftotext -enc UTF-8 apostila.pdf raw.txt
Uso: python3 -I ferramentas/extrair-apostila.py caminho/raw.txt
O PDF não entra no repositório; só o texto, com a fonte citada. Figuras sem texto recebem a transcrição em FIGURAS."""
import json, re, sys, os
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "projetos/sala-caverna/conteudo/apostila-ibge/apostila.json")
FONTE = "https://ftp.ibge.gov.br/edital/PSS_Censo_Agro/2026_02/Edital_2_2026_AC_ACQ_Apostila_de_Estudo_dos_conhecimentos_tecnicos.pdf"
FIGURAS = {
 33: "Figura (divisão político-administrativa do Brasil): 26 Estados, 1 Distrito Federal e 1 Distrito Estadual (Fernando de Noronha); 5.569 Municípios; 10.744 Distritos; 645 Subdistritos; e os Setores Censitários.",
 34: "Tabela (geocódigo do setor 51 04104 05 00 0016): Estado 51 | Município 04104 | Distrito 05 | Subdistrito 00 | Setor 0016.",
 43: "Figura (componentes do endereço): Logradouro; Localidade; CEP; Número e modificador; Complemento; Ponto de referência; Coordenadas geográficas.",
 47: "Figura (exemplos de endereço): 1) Acesso Guanumbi, 19, Lote 3, Galpão 1 - Cajueiros, 31546-090 (logradouro, número, complemento, localidade, CEP). 2) Fazenda Alegria, 25, em frente ao Açude do Cedro - Povoado de Areia Branca, 65056-000 (logradouro, número, ponto de referência, localidade, CEP). 3) Travessa Mato Alto, 725, Quadra B - Quilombo da Pedreira, 59687-200 (logradouro, número, complemento, localidade, CEP). 4) Rodovia BR-101, 6 Km, Rua interna A, Casa 2 - Nova Canaã, 78414-003 (logradouro, número '6', modificador 'Km', complemento, localidade, CEP).",
 54: "Fluxograma: existe produção ou exploração agropecuária, florestal ou aquícola na propriedade? Se a produção é destinada à comercialização (venda/troca) ou à subsistência vital da família produtora: RECENSEÁVEL. Se é exclusivamente para lazer, passatempo ou deleite dos moradores: NÃO RECENSEÁVEL. Figura: NÃO RECENSEÁVEL a criação exclusiva de pássaros, cães e gatos (animais domésticos) e a criação de animais para experiências de laboratório ou produção de soros, vacinas e produtos similares (fins científicos e médicos).",
 55: "Figura (locais NÃO recenseáveis, independentemente do que cultivam): hortos, postos zootécnicos e estações experimentais; hotéis-fazenda e locais de lazer; conventos e igrejas; hospitais, asilos e orfanatos; escolas profissionalizantes e patronatos; prisões e reformatórios.",
}
TITULOS = ['Estruturas territoriais de Povos e Comunidades Tradicionais (PCTs)', 'Diferença entre propriedade rural e estabelecimento agropecuário', 'Setores censitários de Povos e Comunidades Tradicionais (PCTs)', 'Estabelecimentos agropecuários pertencentes a indústrias', 'Objetivo do Censo Agropecuário, Florestal e Aquícola', 'Orientações de navegação para o trabalho em campo', 'Estabelecimentos em sucessão, partilha ou litígio', 'O Instituto Brasileiro de Geografia Estatística', 'Estabelecimentos em mais de um setor censitário', 'O 12º Censo Agropecuário, Florestal e Aquícola', 'Áreas não contínuas em municípios diferentes', 'Como identificar se há unidade recenseável?', 'O Censo Agropecuário, Florestal e Aquícola', '4.Estruturas territoriais não setorizadas', 'Divisão político-administrativa do Brasil', 'Conceito de Estabelecimento Agropecuário', 'Estabelecimentos com áreas não contínuas', 'Estabelecimentos novos ou sem produção', 'Áreas de Interesse Operacional (AIOs)', '4. Dispositivo Móvel de Coleta (DMC)', 'Como interpretar imagens de satélite', 'Atividades e locais não recenseáveis', 'Estrutura Organizacional Censitária', '3. Mapa Municipal Estatístico (MME)', 'Centro Nacional de Qualidade (CNQ)', 'Centro Estadual de Qualidade (CEQ)', 'Conhecendo a Estrutura Censitária', 'Mapa do Setor Censitário digital:', 'Exemplos de produtores sem área:', '5. Acessibilidade e Observações', 'Exemplo 2 - Áreas não contínuas', '1. Ponto Inicial e Ponto Final', 'Imagem de satélite ou orbital', 'Geocódigo do Setor Censitário', 'Multiplicidade de Identidades', 'Confinamento de gado (boitel)', 'Agente Censitário Supervisor', '3. Setores a serem excluídos', 'Tipos de setores censitários', 'Estabelecimento Agropecuário', '1. Mapa do Setor Censitário', 'Unidades da Federação (UFs)', 'Exemplo 1 - Áreas contínuas', 'Agente Censitário Regional', 'Acesso aos setores de PCTs', '2. Descrição do Perímetro', 'Unidades não recenseáveis', 'Instrumentos de trabalho', '5. Manual do Recenseador', 'Produção de subsistência', 'Estruturas Territoriais', 'Coordenadas Geográficas', '2. Descritivo do setor', 'Exploração comunitária', 'Trabalhando conceitos', 'Unidades Recenseáveis', 'Estrutura permanente', 'Estrutura temporária', 'Número e modificador', 'Lista de Endereços:', 'Descritivo do setor', 'Ponto de referência', 'Produtores sem área', 'Situações especiais', 'Postos censitários', 'Elementos do mapa', 'Posto censitário', 'Questionários:', 'Apresentação', 'Subdistritos', 'Encerramento', 'Abrangência', 'Concepção', 'Impactos', 'Legenda']
CAB = re.compile(r"Conhecimentos básicos para o 12\s*[oº]\s*Censo Agropecuário, Florestal e Aquícola")

def limpar(pg, txt):
    txt = txt.replace("\x08", " ").replace("­", "")
    txt = CAB.sub("", txt)
    linhas = [l.strip() for l in txt.split("\n")]
    if linhas and linhas[0] == str(pg): linhas = linhas[1:]
    linhas = [l for l in linhas if l != str(pg) and not re.fullmatch(r"\d{1,2}\s+\d{1,2}", l)]
    pars, cur = [], []
    for l in linhas:
        if not l:
            if cur: pars.append(" ".join(cur)); cur = []
            continue
        cur.append(l)
    if cur: pars.append(" ".join(cur))
    pars = [re.sub(r"\s+", " ", re.sub(r"(\w)- (\w)", r"\1\2", p)).strip() for p in pars]
    out = []
    for p in pars:
        if not p: continue
        p2 = p.replace("12o ", "12º ")
        h = next((t for t in TITULOS if p2 == t or p2.startswith(t + " ")), None)
        if h:
            out.append("# " + h)
            resto = p2[len(h):].strip()
            if resto: out.append(resto)
        else:
            out.append(p)
    return out

def main():
    raw = open(sys.argv[1], encoding="utf-8").read().split("\f")
    paginas = []
    for i, t in enumerate(raw):
        pg = i + 1
        pars = limpar(pg, t)
        if pg in FIGURAS: pars.append("[Conteúdo da figura] " + FIGURAS[pg])
        if pars: paginas.append({"p": pg, "t": pars})
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    out = {"titulo": "Conhecimentos básicos para o 12º Censo Agropecuário, Florestal e Aquícola",
           "autor": "IBGE · ENCE · Coordenação de Treinamento e Aperfeiçoamento", "fonte": FONTE, "paginas": paginas}
    with open(SAIDA, "w", encoding="utf-8") as f: json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"{len(paginas)} páginas, {sum(len(' '.join(p['t'])) for p in paginas)//1000} mil caracteres → {os.path.relpath(SAIDA, RAIZ)}")

if __name__ == "__main__":
    main()
