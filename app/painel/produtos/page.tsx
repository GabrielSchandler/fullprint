"use client";

import { useMemo, useState } from "react";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import { NOMES_PALETA, PADROES, type PadraoNome, type PaletaNome } from "@/components/mockup/estampas";
import {
  FORMATOS,
  ProdutoMockup,
  ROTULO_FORMATO,
  type FormatoNome,
} from "@/components/mockup/ProdutoMockup";
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
import { brl, num } from "@/lib/format";
import { CATEGORIAS, COLECOES, PRODUTOS, type Produto } from "@/lib/catalogo";
import { FotoProduto } from "@/components/loja/FotoProduto";
import { BotaoExportar } from "@/components/painel/BotaoExportar";

const POR_PAGINA = 10;

const ORDENS = [
  { id: "vendas", rotulo: "Mais vendidos" },
  { id: "nome", rotulo: "Nome (A–Z)" },
  { id: "preco", rotulo: "Maior preço" },
  { id: "margem", rotulo: "Maior margem" },
  { id: "estoque", rotulo: "Menor estoque" },
] as const;

const margemDe = (p: Produto) => ((p.preco - p.custo) / p.preco) * 100;

function selo(p: Produto) {
  if (p.estoque === 0) return { tom: "erro" as const, rotulo: "Sem estoque" };
  if (p.estoque <= p.estoqueMin) return { tom: "alerta" as const, rotulo: "Repor" };
  return { tom: "ok" as const, rotulo: "Ativo" };
}

/* ------------------------------------------------------------ formulário */

function Campo({
  rotulo,
  span = 12,
  children,
}: {
  rotulo: string;
  span?: number;
  children: React.ReactNode;
}) {
  return (
    <label className="block" style={{ gridColumn: `span ${span} / span ${span}` }}>
      <span className="spec text-mute-2">{rotulo}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const entrada =
  "h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none transition-colors placeholder:text-mute-2 focus:border-tinta";

function Cadastro({ fechar }: { fechar: () => void }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0].id);
  const [formato, setFormato] = useState<FormatoNome>("caderno");
  const [padrao, setPadrao] = useState<PadraoNome>("leque");
  const [paleta, setPaleta] = useState<PaletaNome>("magenta");
  const [preco, setPreco] = useState("");
  const [custo, setCusto] = useState("");

  const cat = CATEGORIAS.find((c) => c.id === categoria)!;
  const margem =
    Number(preco) > 0 && Number(custo) > 0
      ? ((Number(preco) - Number(custo)) / Number(preco)) * 100
      : null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <aside className="absolute top-0 right-0 flex h-full w-[min(620px,100vw)] flex-col bg-papel shadow-papel-alta">
        <header className="flex items-start justify-between gap-4 border-b border-linha bg-surface px-6 py-5">
          <div>
            <p className="spec text-mute-2">Catálogo</p>
            <h2 className="mt-1 font-display text-3xl leading-none">Novo produto</h2>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* prévia ao vivo */}
          <div className="flex items-center gap-5 rounded-xl border border-linha bg-surface p-5">
            <div
              className="size-28 shrink-0 overflow-hidden rounded-lg border border-linha"
              style={{ background: fundoDoProduto(paleta) }}
            >
              <ProdutoMockup
                formato={formato}
                padrao={padrao}
                paleta={paleta}
                titulo={nome || "Nome do produto"}
                className="size-full"
              />
            </div>
            <div className="min-w-0">
              <p className="spec text-mute-2">Prévia da vitrine</p>
              <p className="mt-1.5 truncate text-[0.9375rem] font-medium">
                {nome || "Nome do produto"}
              </p>
              <p className="mt-0.5 text-[0.8125rem] text-mute">
                {cat.nome} · {ROTULO_FORMATO[formato]}
              </p>
              <p className="mt-2 text-lg font-semibold tabular">
                {Number(preco) > 0 ? brl(Number(preco)) : "R$ —"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-4">
            <Campo rotulo="Nome do produto">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Caderno Bauhaus A5"
                className={entrada}
              />
            </Campo>

            <Campo rotulo="Categoria" span={6}>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as typeof categoria)}
                className={entrada}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Linha" span={6}>
              <select className={entrada}>
                {cat.sub.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Coleção" span={6}>
              <select className={entrada}>
                {COLECOES.map((c) => (
                  <option key={c.id}>{c.nome}</option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Formato do mockup" span={6}>
              <select
                value={formato}
                onChange={(e) => setFormato(e.target.value as FormatoNome)}
                className={entrada}
              >
                {FORMATOS.map((f) => (
                  <option key={f} value={f}>
                    {ROTULO_FORMATO[f]}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Estampa" span={6}>
              <select
                value={padrao}
                onChange={(e) => setPadrao(e.target.value as PadraoNome)}
                className={entrada}
              >
                {PADROES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Paleta" span={6}>
              <select
                value={paleta}
                onChange={(e) => setPaleta(e.target.value as PaletaNome)}
                className={entrada}
              >
                {NOMES_PALETA.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Preço de venda" span={4}>
              <input
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className={entrada}
              />
            </Campo>

            <Campo rotulo="Custo" span={4}>
              <input
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className={entrada}
              />
            </Campo>

            <Campo rotulo="Margem" span={4}>
              <div
                className={`flex h-11 items-center rounded-lg border border-linha px-3.5 text-[0.8125rem] tabular ${
                  margem === null ? "text-mute-2" : margem > 50 ? "text-ok" : "text-alerta"
                }`}
              >
                {margem === null ? "—" : `${margem.toFixed(0)}%`}
              </div>
            </Campo>

            <Campo rotulo="Estoque inicial" span={6}>
              <input inputMode="numeric" placeholder="0" className={entrada} />
            </Campo>

            <Campo rotulo="Estoque mínimo" span={6}>
              <input inputMode="numeric" placeholder="0" className={entrada} />
            </Campo>

            <Campo rotulo="Resumo da vitrine">
              <textarea
                rows={3}
                placeholder="Uma frase que aparece no card do produto."
                className={`${entrada} h-auto py-3 leading-relaxed`}
              />
            </Campo>
          </div>

          <div className="mt-5 space-y-3 rounded-xl border border-linha bg-surface p-5">
            {[
              ["Disponível para personalização B2B", true],
              ["Marcar como lançamento", false],
              ["Destacar na home", false],
            ].map(([rotulo, marcado]) => (
              <label key={String(rotulo)} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={Boolean(marcado)}
                  className="size-4 accent-magenta"
                />
                <span className="text-[0.8125rem]">{rotulo}</span>
              </label>
            ))}
          </div>
        </div>

        <footer className="flex gap-2 border-t border-linha bg-surface px-6 py-4">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-sm font-medium text-papel hover:bg-grafite">
            <Icone nome="check" className="size-4" strokeWidth={2.4} />
            Publicar produto
          </button>
          <button
            onClick={fechar}
            className="inline-flex h-11 items-center justify-center rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta"
          >
            Cancelar
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function ProdutosPage() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [colecao, setColecao] = useState("todas");
  const [ordem, setOrdem] = useState<(typeof ORDENS)[number]["id"]>("vendas");
  const [pagina, setPagina] = useState(0);
  const [cadastro, setCadastro] = useState(false);

  const filtrados = useMemo(() => {
    const lista = PRODUTOS.filter((p) => {
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      if (colecao !== "todas" && p.colecao !== colecao) return false;
      if (busca.trim()) {
        const t = busca.trim().toLowerCase();
        if (!(p.nome + p.sku + p.sub).toLowerCase().includes(t)) return false;
      }
      return true;
    });

    switch (ordem) {
      case "nome":
        return [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
      case "preco":
        return [...lista].sort((a, b) => b.preco - a.preco);
      case "margem":
        return [...lista].sort((a, b) => margemDe(b) - margemDe(a));
      case "estoque":
        return [...lista].sort((a, b) => a.estoque - b.estoque);
      default:
        return [...lista].sort((a, b) => b.vendas30d - a.vendas30d);
    }
  }, [busca, categoria, colecao, ordem]);

  const paginas = Math.ceil(filtrados.length / POR_PAGINA);
  const visiveis = filtrados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

  const semEstoque = PRODUTOS.filter((p) => p.estoque === 0).length;
  const margemMedia =
    PRODUTOS.reduce((s, p) => s + margemDe(p), 0) / PRODUTOS.length;
  const precoMedio = PRODUTOS.reduce((s, p) => s + p.preco, 0) / PRODUTOS.length;

  const reset = () => setPagina(0);

  return (
    <>
      <CabecaPagina
        titulo="Produtos"
        descricao="O catálogo inteiro da loja. Preço, custo, margem e estoque no mesmo lugar."
        acoes={
          <>
            <BotaoExportar
              nome="catalogo"
              colunas={[
                "SKU",
                "Produto",
                "Categoria",
                "Linha",
                "Coleção",
                "Preço",
                "Preço de",
                "Custo",
                "Margem %",
                "Estoque",
                "Mínimo",
                "Vendas 30d",
                "B2B",
              ]}
              linhas={filtrados.map((p) => [
                p.sku,
                p.nome,
                p.categoria,
                p.sub,
                p.colecao,
                p.preco,
                p.precoDe ?? "",
                p.custo,
                Math.round(margemDe(p)),
                p.estoque,
                p.estoqueMin,
                p.vendas30d,
                p.b2b,
              ])}
            />
            <button
              onClick={() => setCadastro(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
            >
              <Icone nome="mais" className="size-4" strokeWidth={2.2} />
              Novo produto
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi rotulo="SKUs no catálogo" valor={num(PRODUTOS.length)} icone="etiqueta" />
        <Kpi
          rotulo="Preço médio"
          valor={brl(precoMedio, 0)}
          auxiliar={`${PRODUTOS.filter((p) => p.precoDe).length} itens em promoção`}
          icone="carteira"
        />
        <Kpi
          rotulo="Margem média"
          valor={`${margemMedia.toFixed(0)}%`}
          auxiliar="Sobre o preço de tabela"
          icone="grafico"
        />
        <Kpi
          rotulo="Sem estoque"
          valor={num(semEstoque)}
          auxiliar={`${PRODUTOS.filter((p) => p.estoque <= p.estoqueMin).length} no ponto de reposição`}
          icone="alerta"
        />
      </div>

      <div className="mt-5">
        <Cartao padding={false}>
          {/* filtros */}
          <div className="flex flex-wrap items-center gap-2 border-b border-linha px-6 py-4">
            <div className="relative">
              <Icone
                nome="busca"
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-mute-2"
              />
              <input
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  reset();
                }}
                placeholder="Buscar produto ou SKU"
                className="h-9 w-56 rounded-full border border-linha bg-surface pr-3.5 pl-9 text-[0.8125rem] outline-none focus:border-tinta"
              />
            </div>

            <select
              value={categoria}
              onChange={(e) => {
                setCategoria(e.target.value);
                reset();
              }}
              className="h-9 rounded-full border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none hover:border-linha-forte"
            >
              <option value="todas">Todas as categorias</option>
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <select
              value={colecao}
              onChange={(e) => {
                setColecao(e.target.value);
                reset();
              }}
              className="h-9 rounded-full border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none hover:border-linha-forte"
            >
              <option value="todas">Todas as coleções</option>
              {COLECOES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as typeof ordem)}
              className="ml-auto h-9 rounded-full border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none hover:border-linha-forte"
            >
              {ORDENS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>

          {visiveis.length === 0 ? (
            <Vazio
              icone="etiqueta"
              titulo="Nenhum produto encontrado"
              texto="Nenhum item do catálogo bate com a busca, a categoria e a coleção escolhidas ao mesmo tempo."
              aoLimpar={() => {
                setBusca("");
                setCategoria("todas");
                setColecao("todas");
                setPagina(0);
              }}
            />
          ) : (
            <Tabela
              cabecalho={[
                "Produto",
                "Categoria",
                "Coleção",
                { rotulo: "Preço", alinhar: "dir" },
                { rotulo: "Custo", alinhar: "dir" },
                { rotulo: "Margem", alinhar: "dir" },
                { rotulo: "Estoque", alinhar: "dir" },
                { rotulo: "30 dias", alinhar: "dir" },
                "Situação",
                { rotulo: "", alinhar: "dir" },
              ]}
            >
              {visiveis.map((p) => {
                const s = selo(p);
                const m = margemDe(p);
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
                          <p className="spec text-mute-2">
                            {p.sku}
                            {p.b2b && " · B2B"}
                          </p>
                        </div>
                      </div>
                    </Celula>
                    <Celula className="text-mute">{p.sub}</Celula>
                    <Celula className="text-mute">
                      {COLECOES.find((c) => c.id === p.colecao)?.nome}
                    </Celula>
                    <Celula alinhar="dir" className="font-medium tabular">
                      {brl(p.preco)}
                      {p.precoDe && (
                        <p className="text-[0.6875rem] text-mute-2 line-through">
                          {brl(p.precoDe)}
                        </p>
                      )}
                    </Celula>
                    <Celula alinhar="dir" className="text-mute tabular">
                      {brl(p.custo)}
                    </Celula>
                    <Celula alinhar="dir" className="tabular">
                      <span className={m >= 55 ? "text-ok" : m >= 45 ? "" : "text-alerta"}>
                        {m.toFixed(0)}%
                      </span>
                    </Celula>
                    <Celula alinhar="dir" className="tabular">
                      {num(p.estoque)}
                      <p className="text-[0.6875rem] text-mute-2">mín. {p.estoqueMin}</p>
                    </Celula>
                    <Celula alinhar="dir" className="text-mute tabular">
                      {num(p.vendas30d)}
                    </Celula>
                    <Celula>
                      <SeloStatus tom={s.tom}>{s.rotulo}</SeloStatus>
                    </Celula>
                    <Celula alinhar="dir">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`/produto/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                          aria-label={`Ver ${p.nome} na loja`}
                        >
                          <Icone nome="olho" className="size-4" />
                        </a>
                        <button
                          className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                          aria-label={`Editar ${p.nome}`}
                        >
                          <Icone nome="lapis" className="size-4" />
                        </button>
                      </div>
                    </Celula>
                  </Linha>
                );
              })}
            </Tabela>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linha px-6 py-4">
            <p className="text-[0.75rem] text-mute tabular">
              {filtrados.length === 0
                ? "Nenhum produto"
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

      <AvisoPrototipo>
        Catálogo fictício de {PRODUTOS.length} SKUs com mockups gerados em SVG — nenhuma
        foto de produto foi usada. No sistema real, publicar grava no banco e a foto entra
        por upload; aqui os botões são de demonstração.
      </AvisoPrototipo>

      {cadastro && <Cadastro fechar={() => setCadastro(false)} />}
    </>
  );
}
