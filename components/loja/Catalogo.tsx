"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { Botao, Selo } from "@/components/ui/primitivos";
import {
  CATEGORIAS,
  COLECOES,
  FAIXAS_PRECO,
  PRODUTOS,
  type CategoriaId,
  type ColecaoId,
  type Produto,
} from "@/lib/catalogo";
import { ProdutoCard } from "./ProdutoCard";

const ORDENS = [
  { id: "relevancia", rotulo: "Relevância" },
  { id: "vendidos", rotulo: "Mais vendidos" },
  { id: "novidades", rotulo: "Novidades" },
  { id: "menor", rotulo: "Menor preço" },
  { id: "maior", rotulo: "Maior preço" },
  { id: "avaliacao", rotulo: "Melhor avaliados" },
] as const;

function Grupo({
  titulo,
  children,
  aberto = true,
}: {
  titulo: string;
  children: React.ReactNode;
  aberto?: boolean;
}) {
  const [on, setOn] = useState(aberto);
  return (
    <div className="border-b border-linha py-5">
      <button
        onClick={() => setOn((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="spec text-tinta">{titulo}</span>
        <Icone nome={on ? "chevronCima" : "chevronBaixo"} className="size-4 text-mute-2" />
      </button>
      {on && <div className="mt-4 space-y-2.5">{children}</div>}
    </div>
  );
}

function Caixa({
  marcado,
  onChange,
  children,
  contagem,
}: {
  marcado: boolean;
  onChange: () => void;
  children: React.ReactNode;
  contagem?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[0.8125rem] text-tinta/80 hover:text-tinta">
      <span
        className={`grid size-4 shrink-0 place-items-center rounded border transition-colors ${
          marcado ? "border-tinta bg-tinta text-papel" : "border-linha-forte bg-surface"
        }`}
      >
        {marcado && <Icone nome="check" className="size-3" strokeWidth={2.4} />}
      </span>
      <input type="checkbox" checked={marcado} onChange={onChange} className="sr-only" />
      <span className="flex-1">{children}</span>
      {contagem !== undefined && (
        <span className="text-[0.6875rem] text-mute-2 tabular">{contagem}</span>
      )}
    </label>
  );
}

export function Catalogo() {
  const params = useSearchParams();
  const router = useRouter();

  const catInicial = params.get("categoria");
  const linhaInicial = params.get("linha");
  const ordemInicial = params.get("ordem") ?? "relevancia";

  const [categorias, setCategorias] = useState<CategoriaId[]>(
    catInicial ? [catInicial as CategoriaId] : [],
  );
  const [linhas, setLinhas] = useState<string[]>(linhaInicial ? [linhaInicial] : []);
  const [colecoes, setColecoes] = useState<ColecaoId[]>([]);
  const [faixas, setFaixas] = useState<string[]>([]);
  const [soB2b, setSoB2b] = useState(false);
  const [soOferta, setSoOferta] = useState(false);
  const [ordem, setOrdem] = useState<string>(ordemInicial);
  const [filtrosMobile, setFiltrosMobile] = useState(false);

  const alternar = <T,>(lista: T[], set: (v: T[]) => void, v: T) =>
    set(lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);

  const filtrados = useMemo(() => {
    let r: Produto[] = PRODUTOS.filter((p) => {
      if (categorias.length && !categorias.includes(p.categoria)) return false;
      if (linhas.length && !linhas.includes(p.sub)) return false;
      if (colecoes.length && !colecoes.includes(p.colecao)) return false;
      if (soB2b && !p.b2b) return false;
      if (soOferta && !p.precoDe) return false;
      if (faixas.length) {
        const passa = faixas.some((f) => FAIXAS_PRECO.find((x) => x.id === f)?.teste(p));
        if (!passa) return false;
      }
      return true;
    });

    switch (ordem) {
      case "vendidos":
        r = [...r].sort((a, b) => b.vendas30d - a.vendas30d);
        break;
      case "novidades":
        r = [...r].sort((a, b) => Number(!!b.novo) - Number(!!a.novo) || b.vendas30d - a.vendas30d);
        break;
      case "menor":
        r = [...r].sort((a, b) => a.preco - b.preco);
        break;
      case "maior":
        r = [...r].sort((a, b) => b.preco - a.preco);
        break;
      case "avaliacao":
        r = [...r].sort((a, b) => b.avaliacao - a.avaliacao || b.qtdAvaliacoes - a.qtdAvaliacoes);
        break;
      default:
        r = [...r].sort(
          (a, b) =>
            Number(!!b.destaque) - Number(!!a.destaque) || b.vendas30d - a.vendas30d,
        );
    }
    return r;
  }, [categorias, linhas, colecoes, faixas, soB2b, soOferta, ordem]);

  const contarCategoria = (id: CategoriaId) =>
    PRODUTOS.filter((p) => p.categoria === id).length;

  const linhasDisponiveis = useMemo(() => {
    const base = categorias.length
      ? CATEGORIAS.filter((c) => categorias.includes(c.id))
      : CATEGORIAS;
    return [...new Set(base.flatMap((c) => c.sub))];
  }, [categorias]);

  const ativos =
    categorias.length + linhas.length + colecoes.length + faixas.length +
    (soB2b ? 1 : 0) + (soOferta ? 1 : 0);

  const limpar = () => {
    setCategorias([]);
    setLinhas([]);
    setColecoes([]);
    setFaixas([]);
    setSoB2b(false);
    setSoOferta(false);
    router.replace("/produtos");
  };

  const painelFiltros = (
    <>
      <Grupo titulo="Categoria">
        {CATEGORIAS.map((c) => (
          <Caixa
            key={c.id}
            marcado={categorias.includes(c.id)}
            onChange={() => alternar(categorias, setCategorias, c.id)}
            contagem={contarCategoria(c.id)}
          >
            {c.nome}
          </Caixa>
        ))}
      </Grupo>

      <Grupo titulo="Linha">
        {linhasDisponiveis.map((s) => (
          <Caixa key={s} marcado={linhas.includes(s)} onChange={() => alternar(linhas, setLinhas, s)}>
            {s}
          </Caixa>
        ))}
      </Grupo>

      <Grupo titulo="Coleção">
        {COLECOES.map((c) => (
          <Caixa
            key={c.id}
            marcado={colecoes.includes(c.id)}
            onChange={() => alternar(colecoes, setColecoes, c.id)}
          >
            {c.nome}
          </Caixa>
        ))}
      </Grupo>

      <Grupo titulo="Preço">
        {FAIXAS_PRECO.map((f) => (
          <Caixa
            key={f.id}
            marcado={faixas.includes(f.id)}
            onChange={() => alternar(faixas, setFaixas, f.id)}
          >
            {f.rotulo}
          </Caixa>
        ))}
      </Grupo>

      <Grupo titulo="Outros">
        <Caixa marcado={soB2b} onChange={() => setSoB2b((v) => !v)}>
          Personalizável com marca
        </Caixa>
        <Caixa marcado={soOferta} onChange={() => setSoOferta((v) => !v)}>
          Em promoção
        </Caixa>
      </Grupo>
    </>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-8">
      <div className="grid gap-10 lg:grid-cols-[248px_1fr]">
        {/* --------------------------------------------------- filtros */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <div className="flex items-center justify-between">
              <p className="spec">Filtros</p>
              {ativos > 0 && (
                <button onClick={limpar} className="text-[0.75rem] text-magenta-forte hover:underline">
                  Limpar ({ativos})
                </button>
              )}
            </div>
            <div className="mt-1 max-h-[calc(100dvh-11rem)] overflow-y-auto pr-1">
              {painelFiltros}
            </div>
          </div>
        </aside>

        {/* ---------------------------------------------------- grade */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha pb-4">
            <p className="text-[0.8125rem] text-mute">
              <span className="font-semibold text-tinta tabular">{filtrados.length}</span>{" "}
              {filtrados.length === 1 ? "produto" : "produtos"}
            </p>

            <div className="flex items-center gap-2">
              <Botao
                tom="contorno"
                tamanho="sm"
                className="lg:hidden"
                onClick={() => setFiltrosMobile(true)}
              >
                <Icone nome="filtro" className="size-4" />
                Filtros{ativos > 0 ? ` (${ativos})` : ""}
              </Botao>

              <label className="flex items-center gap-2">
                <span className="spec hidden text-mute-2 sm:block">Ordenar</span>
                <select
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value)}
                  className="h-9 cursor-pointer rounded-full border border-linha bg-surface px-3.5 pr-8 text-[0.8125rem] outline-none hover:border-linha-forte"
                >
                  {ORDENS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.rotulo}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {ativos > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categorias.map((c) => (
                <button key={c} onClick={() => alternar(categorias, setCategorias, c)}>
                  <Selo tom="neutro">
                    {CATEGORIAS.find((x) => x.id === c)!.nome}
                    <Icone nome="fechar" className="size-3" />
                  </Selo>
                </button>
              ))}
              {linhas.map((l) => (
                <button key={l} onClick={() => alternar(linhas, setLinhas, l)}>
                  <Selo tom="neutro">
                    {l}
                    <Icone nome="fechar" className="size-3" />
                  </Selo>
                </button>
              ))}
              {colecoes.map((c) => (
                <button key={c} onClick={() => alternar(colecoes, setColecoes, c)}>
                  <Selo tom="neutro">
                    {COLECOES.find((x) => x.id === c)!.nome}
                    <Icone nome="fechar" className="size-3" />
                  </Selo>
                </button>
              ))}
              {soB2b && (
                <button onClick={() => setSoB2b(false)}>
                  <Selo tom="b2b">
                    Personalizável
                    <Icone nome="fechar" className="size-3" />
                  </Selo>
                </button>
              )}
              {soOferta && (
                <button onClick={() => setSoOferta(false)}>
                  <Selo tom="oferta">
                    Em promoção
                    <Icone nome="fechar" className="size-3" />
                  </Selo>
                </button>
              )}
            </div>
          )}

          {filtrados.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <Icone nome="busca" className="size-8 text-mute-2" />
              <p className="text-sm text-mute">
                Nenhum produto com essa combinação de filtros.
              </p>
              <Botao tom="contorno" tamanho="sm" onClick={limpar}>
                Limpar filtros
              </Botao>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((p, i) => (
                <ProdutoCard key={p.sku} produto={p} prioritaria={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------ filtros mobile */}
      {filtrosMobile && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            className="absolute inset-0 cursor-default bg-tinta/40"
            onClick={() => setFiltrosMobile(false)}
            aria-label="Fechar filtros"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-papel px-5 pb-8">
            <div className="sticky top-0 flex items-center justify-between bg-papel py-4">
              <p className="font-display text-2xl">Filtros</p>
              <button
                onClick={() => setFiltrosMobile(false)}
                className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
              >
                <Icone nome="fechar" />
              </button>
            </div>
            {painelFiltros}
            <div className="mt-6 flex gap-3">
              <Botao tom="contorno" className="flex-1" onClick={limpar}>
                Limpar
              </Botao>
              <Botao tom="tinta" className="flex-1" onClick={() => setFiltrosMobile(false)}>
                Ver {filtrados.length} produtos
              </Botao>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
