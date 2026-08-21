"use client";

import { useMemo, useState } from "react";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import { BarrasHorizontais } from "@/components/painel/graficos";
import {
  AvisoPrototipo,
  CabecaPagina,
  Cartao,
  Celula,
  Kpi,
  Linha,
  SeloStatus,
  Tabela,
  Vazio,
} from "@/components/painel/ui";
import { Icone } from "@/components/ui/Icone";
import { brl, brlCurto, dataCurta, entre, escolher, num, semente } from "@/lib/format";
import { CATEGORIAS, PRODUTOS, type Produto } from "@/lib/catalogo";
import { PEDIDOS, valorEmEstoque } from "@/lib/painel-dados";
import { FotoProduto } from "@/components/loja/FotoProduto";
import { BotaoExportar } from "@/components/painel/BotaoExportar";

const POR_PAGINA = 12;

const ABAS = [
  { id: "todos", rotulo: "Todos" },
  { id: "repor", rotulo: "No mínimo" },
  { id: "zerado", rotulo: "Sem estoque" },
  { id: "parado", rotulo: "Parado" },
] as const;

type Aba = (typeof ABAS)[number]["id"];

/** Dias de estoque restantes no ritmo de venda dos últimos 30 dias. */
const cobertura = (p: Produto) => (p.vendas30d > 0 ? p.estoque / (p.vendas30d / 30) : Infinity);

function classe(p: Produto) {
  if (p.estoque === 0) return { tom: "erro" as const, rotulo: "Sem estoque" };
  if (p.estoque <= p.estoqueMin) return { tom: "alerta" as const, rotulo: "Repor" };
  if (cobertura(p) > 120) return { tom: "neutro" as const, rotulo: "Parado" };
  return { tom: "ok" as const, rotulo: "Saudável" };
}

/* ------------------------------------------------------- movimentações */

type Movimento = {
  id: string;
  data: Date;
  produto: Produto;
  tipo: "entrada" | "saida" | "ajuste";
  qtd: number;
  origem: string;
};

function gerarMovimentos(): Movimento[] {
  const r = semente("estoque-fullprint");
  const lista: Movimento[] = [];

  /* saídas reais: cada item vendido baixa do estoque */
  PEDIDOS.slice(0, 14).forEach((p, i) => {
    const item = p.itens[0];
    lista.push({
      id: `MOV-${9000 + i}`,
      data: p.data,
      produto: item.produto,
      tipo: "saida",
      qtd: item.qtd,
      origem: `Pedido ${p.id}`,
    });
  });

  /* entradas: ordens de produção fechadas na semana */
  const fornecedores = ["Produção interna", "Suzano · papel", "Terceirizado · Gráfica Sul"];
  for (let i = 0; i < 8; i++) {
    const produto = escolher(r, PRODUTOS);
    const dias = entre(r, 0, 12);
    const d = new Date(PEDIDOS[0].data);
    d.setDate(d.getDate() - dias);
    lista.push({
      id: `MOV-${8000 + i}`,
      data: d,
      produto,
      tipo: r() < 0.16 ? "ajuste" : "entrada",
      qtd: entre(r, 40, 900),
      origem: escolher(r, fornecedores),
    });
  }

  return lista.sort((a, b) => b.data.getTime() - a.data.getTime()).slice(0, 16);
}

const MOVIMENTOS = gerarMovimentos();

const TIPO_MOV = {
  entrada: { rotulo: "Entrada", tom: "ok", icone: "chevronCima", sinal: "+" },
  saida: { rotulo: "Saída", tom: "info", icone: "chevronBaixo", sinal: "−" },
  ajuste: { rotulo: "Ajuste", tom: "alerta", icone: "lapis", sinal: "±" },
} as const;

/* ------------------------------------------------------------- entrada */

function NovaEntrada({ fechar }: { fechar: () => void }) {
  const [sku, setSku] = useState(PRODUTOS[0].sku);
  const [qtd, setQtd] = useState("");
  const produto = PRODUTOS.find((p) => p.sku === sku)!;

  const entrada =
    "h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none focus:border-tinta";

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <div className="relative w-[min(520px,100%)] overflow-hidden rounded-2xl border border-linha bg-surface shadow-papel-alta">
        <header className="flex items-start justify-between gap-4 border-b border-linha px-6 py-5">
          <div>
            <p className="spec text-mute-2">Movimentação</p>
            <h2 className="mt-1 font-display text-2xl leading-none">Entrada de estoque</h2>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="p-6">
          <div className="flex items-center gap-4 rounded-xl border border-linha bg-papel/60 p-4">
            <div
              className="size-16 shrink-0 overflow-hidden rounded-lg border border-linha"
              style={{ background: fundoDoProduto(produto.paleta) }}
            >
              <FotoProduto produto={produto} className="size-full" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.875rem] font-medium">{produto.nome}</p>
              <p className="spec mt-0.5 text-mute-2">{produto.sku}</p>
              <p className="mt-1.5 text-[0.75rem] text-mute tabular">
                Em estoque: {num(produto.estoque)} un · mínimo {num(produto.estoqueMin)}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="spec text-mute-2">Produto</span>
              <select
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={`mt-1.5 ${entrada}`}
              >
                {PRODUTOS.map((p) => (
                  <option key={p.sku} value={p.sku}>
                    {p.nome} · {p.sku}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="spec text-mute-2">Quantidade</span>
                <input
                  value={qtd}
                  onChange={(e) => setQtd(e.target.value)}
                  inputMode="numeric"
                  placeholder="0"
                  className={`mt-1.5 ${entrada}`}
                />
              </label>
              <label className="block">
                <span className="spec text-mute-2">Custo unitário</span>
                <input
                  defaultValue={produto.custo.toFixed(2).replace(".", ",")}
                  inputMode="decimal"
                  className={`mt-1.5 ${entrada}`}
                />
              </label>
            </div>

            <label className="block">
              <span className="spec text-mute-2">Origem</span>
              <select className={`mt-1.5 ${entrada}`}>
                <option>Produção interna</option>
                <option>Suzano · papel</option>
                <option>Terceirizado · Gráfica Sul</option>
                <option>Devolução de pedido</option>
              </select>
            </label>

            {Number(qtd) > 0 && (
              <p className="rounded-lg bg-ok-bg px-4 py-3 text-[0.8125rem] text-ok tabular">
                Novo saldo: {num(produto.estoque + Number(qtd))} un ·{" "}
                {brl((produto.estoque + Number(qtd)) * produto.custo, 0)} imobilizados
              </p>
            )}
          </div>
        </div>

        <footer className="flex gap-2 border-t border-linha px-6 py-4">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-sm font-medium text-papel hover:bg-grafite">
            <Icone nome="check" className="size-4" strokeWidth={2.4} />
            Lançar entrada
          </button>
          <button
            onClick={fechar}
            className="inline-flex h-11 items-center justify-center rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta"
          >
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function EstoquePage() {
  const [aba, setAba] = useState<Aba>("todos");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const [entrada, setEntrada] = useState(false);

  const filtrados = useMemo(() => {
    const lista = PRODUTOS.filter((p) => {
      if (aba === "repor" && !(p.estoque <= p.estoqueMin && p.estoque > 0)) return false;
      if (aba === "zerado" && p.estoque !== 0) return false;
      if (aba === "parado" && !(cobertura(p) > 120 && p.estoque > 0)) return false;
      if (busca.trim()) {
        const t = busca.trim().toLowerCase();
        if (!(p.nome + p.sku).toLowerCase().includes(t)) return false;
      }
      return true;
    });
    return lista.sort((a, b) => cobertura(a) - cobertura(b));
  }, [aba, busca]);

  const paginas = Math.ceil(filtrados.length / POR_PAGINA);
  const visiveis = filtrados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

  const unidades = PRODUTOS.reduce((s, p) => s + p.estoque, 0);
  const imobilizado = valorEmEstoque();
  const criticos = PRODUTOS.filter((p) => p.estoque <= p.estoqueMin);
  const parados = PRODUTOS.filter((p) => cobertura(p) > 120 && p.estoque > 0);

  const porCategoria = CATEGORIAS.map((c) => ({
    nome: c.nome,
    valor: PRODUTOS.filter((p) => p.categoria === c.id).reduce(
      (s, p) => s + p.estoque * p.custo,
      0,
    ),
  })).sort((a, b) => b.valor - a.valor);

  /* curva ABC por valor de venda dos últimos 30 dias */
  const abc = useMemo(() => {
    const ordenados = [...PRODUTOS].sort((a, b) => b.vendas30d * b.preco - a.vendas30d * a.preco);
    const total = ordenados.reduce((s, p) => s + p.vendas30d * p.preco, 0);
    let acumulado = 0;
    const faixas = { A: 0, B: 0, C: 0 };
    for (const p of ordenados) {
      acumulado += p.vendas30d * p.preco;
      const share = acumulado / total;
      if (share <= 0.8) faixas.A += 1;
      else if (share <= 0.95) faixas.B += 1;
      else faixas.C += 1;
    }
    return faixas;
  }, []);

  const contar = (id: Aba) =>
    id === "todos"
      ? PRODUTOS.length
      : id === "repor"
        ? criticos.filter((p) => p.estoque > 0).length
        : id === "zerado"
          ? PRODUTOS.filter((p) => p.estoque === 0).length
          : parados.length;

  return (
    <>
      <CabecaPagina
        titulo="Estoque"
        descricao="Saldo, cobertura e giro de cada SKU. A cobertura é calculada no ritmo de venda dos últimos 30 dias."
        acoes={
          <>
            <BotaoExportar
              nome="inventario"
              rotulo="Inventário"
              colunas={[
                "SKU",
                "Produto",
                "Categoria",
                "Saldo",
                "Mínimo",
                "Cobertura (dias)",
                "Giro 30d",
                "Custo unitário",
                "Valor imobilizado",
                "Situação",
              ]}
              linhas={filtrados.map((p) => [
                p.sku,
                p.nome,
                p.sub,
                p.estoque,
                p.estoqueMin,
                cobertura(p) === Infinity ? "—" : Math.round(cobertura(p)),
                p.vendas30d,
                p.custo,
                Math.round(p.estoque * p.custo * 100) / 100,
                classe(p).rotulo,
              ])}
            />
            <button
              onClick={() => setEntrada(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
            >
              <Icone nome="mais" className="size-4" strokeWidth={2.2} />
              Nova entrada
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Valor imobilizado"
          valor={brlCurto(imobilizado)}
          auxiliar="A preço de custo"
          icone="caixa"
        />
        <Kpi rotulo="Unidades em estoque" valor={num(unidades)} icone="grade" />
        <Kpi
          rotulo="No ponto de reposição"
          valor={num(criticos.length)}
          auxiliar={`${PRODUTOS.filter((p) => p.estoque === 0).length} já zerados`}
          icone="alerta"
        />
        <Kpi
          rotulo="Itens parados"
          valor={num(parados.length)}
          auxiliar="Mais de 120 dias de cobertura"
          icone="relogio"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Capital parado por categoria"
          descricao="Onde o dinheiro do estoque está guardado."
        >
          <BarrasHorizontais itens={porCategoria} formato="brlCurto" />
        </Cartao>

        <Cartao titulo="Curva ABC" descricao="Classificação por receita nos últimos 30 dias.">
          <ul className="space-y-4">
            {[
              { faixa: "A", qtd: abc.A, texto: "80% da receita", cor: "var(--color-serie-1)" },
              { faixa: "B", qtd: abc.B, texto: "os 15% seguintes", cor: "var(--color-serie-3)" },
              { faixa: "C", qtd: abc.C, texto: "os últimos 5%", cor: "var(--color-serie-4)" },
            ].map((f) => (
              <li key={f.faixa} className="flex items-center gap-4">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-lg text-[0.9375rem] font-semibold text-white"
                  style={{ background: f.cor }}
                >
                  {f.faixa}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.875rem] font-medium tabular">{f.qtd} SKUs</p>
                  <p className="text-[0.75rem] text-mute">Geram {f.texto}</p>
                </div>
                {/* dois percentuais lado a lado sem rótulo se liam como
                    contradição ("80% da receita" ao lado de "32%") — este é
                    a fatia do catálogo, e agora diz isso */}
                <span className="shrink-0 text-right text-[0.75rem] text-mute-2">
                  <span className="block text-[0.8125rem] tabular">
                    {((f.qtd / PRODUTOS.length) * 100).toFixed(0)}%
                  </span>
                  do catálogo
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-linha pt-4 text-[0.75rem] leading-relaxed text-mute">
            Os {abc.A} itens da faixa A merecem estoque de segurança maior — são eles que
            seguram o faturamento do mês.
          </p>
        </Cartao>
      </div>

      {/* --------------------------------------------------------- inventário */}
      <div className="mt-5">
        <Cartao padding={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-linha px-6 py-4">
            <div className="scroll-x sem-barra -mx-1 flex gap-1 px-1">
              {ABAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAba(a.id);
                    setPagina(0);
                  }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors ${
                    aba === a.id
                      ? "bg-tinta font-medium text-papel"
                      : "text-mute hover:bg-papel-2 hover:text-tinta"
                  }`}
                >
                  {a.rotulo}
                  <span
                    className={`text-[0.6875rem] tabular ${
                      aba === a.id ? "text-papel/60" : "text-mute-2"
                    }`}
                  >
                    {contar(a.id)}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative ml-auto">
              <Icone
                nome="busca"
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-mute-2"
              />
              <input
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(0);
                }}
                placeholder="Buscar produto ou SKU"
                className="h-9 w-56 rounded-full border border-linha bg-surface pr-3.5 pl-9 text-[0.8125rem] outline-none focus:border-tinta"
              />
            </div>
          </div>

          {visiveis.length === 0 ? (
            <Vazio
              icone="caixa"
              titulo="Nenhum item nesta situação"
              texto="Quando a aba é a de itens zerados, isso é boa notícia. Troque a aba ou limpe a busca para ver o resto do inventário."
              aoLimpar={() => {
                setAba("todos");
                setBusca("");
                setPagina(0);
              }}
            />
          ) : (
            <Tabela
              cabecalho={[
                "Produto",
                { rotulo: "Saldo", alinhar: "dir" },
                { rotulo: "Mínimo", alinhar: "dir" },
                { rotulo: "Cobertura", alinhar: "dir" },
                { rotulo: "Giro 30d", alinhar: "dir" },
                { rotulo: "Imobilizado", alinhar: "dir" },
                "Situação",
                { rotulo: "", alinhar: "dir" },
              ]}
            >
              {visiveis.map((p) => {
                const c = classe(p);
                const dias = cobertura(p);
                return (
                  <Linha key={p.sku}>
                    <Celula>
                      <div className="flex items-center gap-3">
                        <div
                          className="size-11 shrink-0 overflow-hidden rounded-md border border-linha"
                          style={{ background: fundoDoProduto(p.paleta) }}
                        >
                          <FotoProduto produto={p} className="size-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.nome}</p>
                          <p className="spec text-mute-2">{p.sku}</p>
                        </div>
                      </div>
                    </Celula>
                    <Celula alinhar="dir" className="font-medium tabular">
                      {num(p.estoque)}
                    </Celula>
                    <Celula alinhar="dir" className="text-mute tabular">
                      {num(p.estoqueMin)}
                    </Celula>
                    <Celula alinhar="dir" className="tabular">
                      {dias === Infinity ? (
                        <span className="text-mute-2">—</span>
                      ) : (
                        <span className={dias < 15 ? "text-erro" : dias < 30 ? "text-alerta" : ""}>
                          {Math.round(dias)} dias
                        </span>
                      )}
                    </Celula>
                    <Celula alinhar="dir" className="text-mute tabular">
                      {num(p.vendas30d)}
                    </Celula>
                    <Celula alinhar="dir" className="tabular">
                      {brl(p.estoque * p.custo, 0)}
                    </Celula>
                    <Celula>
                      <SeloStatus tom={c.tom}>{c.rotulo}</SeloStatus>
                    </Celula>
                    <Celula alinhar="dir">
                      <button
                        onClick={() => setEntrada(true)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-linha px-3 text-[0.75rem] font-medium hover:border-tinta"
                      >
                        <Icone nome="mais" className="size-3.5" strokeWidth={2.2} />
                        Repor
                      </button>
                    </Celula>
                  </Linha>
                );
              })}
            </Tabela>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linha px-6 py-4">
            <p className="text-[0.75rem] text-mute tabular">
              {filtrados.length === 0
                ? "Nenhum item"
                : `${pagina * POR_PAGINA + 1}–${Math.min(
                    (pagina + 1) * POR_PAGINA,
                    filtrados.length,
                  )} de ${filtrados.length}`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina((v) => Math.max(0, v - 1))}
                disabled={pagina === 0}
                className="grid size-9 place-items-center rounded-full border border-linha hover:border-tinta disabled:opacity-35"
                aria-label="Página anterior"
              >
                <Icone nome="setaEsq" className="size-4" />
              </button>
              <span className="px-3 text-[0.8125rem] tabular">
                {pagina + 1} / {Math.max(paginas, 1)}
              </span>
              <button
                onClick={() => setPagina((v) => Math.min(paginas - 1, v + 1))}
                disabled={pagina >= paginas - 1}
                className="grid size-9 place-items-center rounded-full border border-linha hover:border-tinta disabled:opacity-35"
                aria-label="Próxima página"
              >
                <Icone nome="seta" className="size-4" />
              </button>
            </div>
          </div>
        </Cartao>
      </div>

      {/* ------------------------------------------------------ movimentações */}
      <div className="mt-5">
        <Cartao
          padding={false}
          titulo="Últimas movimentações"
          descricao="Entradas de produção, saídas por venda e ajustes de inventário."
        >
          <Tabela
            cabecalho={[
              "Data",
              "Produto",
              "Tipo",
              "Origem",
              { rotulo: "Quantidade", alinhar: "dir" },
            ]}
          >
            {MOVIMENTOS.map((m) => {
              const t = TIPO_MOV[m.tipo];
              return (
                <Linha key={m.id}>
                  <Celula className="text-mute tabular">{dataCurta(m.data)}</Celula>
                  <Celula>
                    <p className="truncate font-medium">{m.produto.nome}</p>
                    <p className="spec text-mute-2">{m.produto.sku}</p>
                  </Celula>
                  <Celula>
                    <SeloStatus tom={t.tom}>{t.rotulo}</SeloStatus>
                  </Celula>
                  <Celula className="text-mute">{m.origem}</Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {t.sinal}
                    {num(m.qtd)}
                  </Celula>
                </Linha>
              );
            })}
          </Tabela>
        </Cartao>
      </div>

      <AvisoPrototipo>
        Saldos fictícios derivados do catálogo. Quando o estoque estiver ligado ao banco,
        cada pedido pago baixa automaticamente e o alerta de reposição vira notificação no
        sino — o cálculo de cobertura já é o mesmo mostrado aqui.
      </AvisoPrototipo>

      {entrada && <NovaEntrada fechar={() => setEntrada(false)} />}
    </>
  );
}
