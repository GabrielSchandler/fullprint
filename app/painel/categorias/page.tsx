import Link from "next/link";
import { AcoesCategorias } from "@/components/painel/AcoesCategorias";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import { AmostraEstampa } from "@/components/mockup/estampas";
import { BarrasHorizontais } from "@/components/painel/graficos";
import {
  AvisoPrototipo,
  CabecaPagina,
  Cartao,
  Celula,
  Kpi,
  Linha,
  Tabela,
} from "@/components/painel/ui";
import { Icone } from "@/components/ui/Icone";
import { brl, brlCurto, num } from "@/lib/format";
import {
  CATEGORIAS,
  COLECOES,
  PRODUTOS,
  porCategoria,
  porColecao,
} from "@/lib/catalogo";
import { receitaPorCategoria } from "@/lib/painel-dados";
import { FotoProduto } from "@/components/loja/FotoProduto";

export const metadata = { title: "Categorias e coleções" };

export default function CategoriasPage() {
  const receitas = receitaPorCategoria();
  const receitaDe = (id: string) => receitas.find((r) => r.id === id)?.valor ?? 0;
  const lider = [...CATEGORIAS].sort((a, b) => receitaDe(b.id) - receitaDe(a.id))[0];

  const linhas = CATEGORIAS.flatMap((c) =>
    c.sub.map((s) => ({
      categoria: c.nome,
      linha: s,
      produtos: PRODUTOS.filter((p) => p.categoria === c.id && p.sub === s),
    })),
  ).sort((a, b) => b.produtos.length - a.produtos.length);

  return (
    <>
      <CabecaPagina
        titulo="Categorias e coleções"
        descricao="A arrumação da vitrine. Categoria é o que o produto é; coleção é a estampa que ele veste."
        acoes={
          <>
            <AcoesCategorias />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi rotulo="Categorias" valor={num(CATEGORIAS.length)} icone="grade" />
        <Kpi
          rotulo="Linhas de produto"
          valor={num(linhas.length)}
          auxiliar="Subdivisões dentro das categorias"
          icone="filtro"
        />
        <Kpi rotulo="Coleções" valor={num(COLECOES.length)} icone="pizza" />
        <Kpi
          rotulo="Categoria líder"
          valor={lider.nome}
          auxiliar={`${brlCurto(receitaDe(lider.id))} no período`}
          icone="estrela"
        />
      </div>

      {/* ------------------------------------------------------- categorias */}
      <div className="mt-5 grid items-start gap-5 xl:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
          {CATEGORIAS.map((c) => {
            const produtos = porCategoria(c.id);
            const semEstoque = produtos.filter((p) => p.estoque === 0).length;
            const capa = produtos[0];

            return (
              <article
                key={c.id}
                className="flex gap-4 rounded-xl border border-linha bg-surface p-5 shadow-cartao"
              >
                {capa && (
                  <div
                    className="size-16 shrink-0 overflow-hidden rounded-lg border border-linha"
                    style={{ background: fundoDoProduto(capa.paleta) }}
                  >
                    <FotoProduto produto={capa} titulo={c.nome} className="size-full" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[0.9375rem] font-semibold">{c.nome}</h3>
                    <Link
                      href={`/produtos?categoria=${c.id}`}
                      target="_blank"
                      className="grid size-8 shrink-0 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                      aria-label={`Ver ${c.nome} na loja`}
                    >
                      <Icone nome="olho" className="size-4" />
                    </Link>
                  </div>
                  <p className="mt-1 text-[0.75rem] leading-relaxed text-mute">{c.resumo}</p>

                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {c.sub.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-papel-2 px-2.5 py-1 text-[0.6875rem] text-grafite"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-linha pt-3.5">
                    <div>
                      <dt className="spec text-mute-2">SKUs</dt>
                      <dd className="text-[0.8125rem] font-medium tabular">{produtos.length}</dd>
                    </div>
                    <div>
                      <dt className="spec text-mute-2">Receita</dt>
                      <dd className="text-[0.8125rem] font-medium tabular">
                        {brlCurto(receitaDe(c.id))}
                      </dd>
                    </div>
                    <div>
                      <dt className="spec text-mute-2">Sem estoque</dt>
                      <dd
                        className={`text-[0.8125rem] font-medium tabular ${
                          semEstoque > 0 ? "text-alerta" : ""
                        }`}
                      >
                        {semEstoque}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <Cartao titulo="Receita por categoria" descricao="Participação no período.">
          <BarrasHorizontais
            itens={receitas.map((r) => ({ nome: r.nome, valor: r.valor }))}
            formato="brlCurto"
          />
        </Cartao>
      </div>

      {/* --------------------------------------------------------- coleções */}
      <div className="mt-5">
        <Cartao
          titulo="Coleções"
          descricao="A estampa que atravessa as categorias — o mesmo padrão vira caderno, sacola e adesivo."
        >
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {COLECOES.map((col) => {
              const produtos = porColecao(col.id);
              const amostra = produtos.slice(0, 4);
              return (
                <li
                  key={col.id}
                  className="rounded-xl border border-linha bg-papel/50 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {amostra.map((p) => (
                        <AmostraEstampa
                          key={p.sku}
                          padrao={p.padrao}
                          paleta={p.paleta}
                          className="size-9 rounded-md ring-2 ring-papel"
                        />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[0.875rem] font-semibold">{col.nome}</h3>
                      <p className="spec text-mute-2">{produtos.length} produtos</p>
                    </div>
                  </div>

                  <p className="mt-3.5 text-[0.75rem] leading-relaxed text-mute">{col.resumo}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-linha pt-3.5">
                    <span className="text-[0.8125rem] font-medium tabular">
                      {brl(
                        produtos.reduce((s, p) => s + p.preco, 0) / produtos.length,
                        0,
                      )}
                      <span className="ml-1 text-[0.6875rem] font-normal text-mute-2">
                        preço médio
                      </span>
                    </span>
                    <Link
                      href={`/colecao/${col.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium hover:text-magenta-forte"
                    >
                      Ver na loja
                      <Icone nome="seta" className="size-3.5" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </Cartao>
      </div>

      {/* ----------------------------------------------------------- linhas */}
      <div className="mt-5">
        <Cartao
          padding={false}
          titulo="Linhas de produto"
          descricao="A subdivisão que aparece no filtro do catálogo."
        >
          <Tabela
            cabecalho={[
              "Linha",
              "Categoria",
              { rotulo: "SKUs", alinhar: "dir" },
              { rotulo: "Preço médio", alinhar: "dir" },
              { rotulo: "Estoque", alinhar: "dir" },
              { rotulo: "Vendas 30d", alinhar: "dir" },
              { rotulo: "", alinhar: "dir" },
            ]}
          >
            {linhas.map((l) => (
              <Linha key={`${l.categoria}-${l.linha}`}>
                <Celula className="font-medium">{l.linha}</Celula>
                <Celula className="text-mute">{l.categoria}</Celula>
                <Celula alinhar="dir" className="tabular">
                  {l.produtos.length}
                </Celula>
                <Celula alinhar="dir" className="tabular">
                  {l.produtos.length > 0
                    ? brl(l.produtos.reduce((s, p) => s + p.preco, 0) / l.produtos.length, 0)
                    : "—"}
                </Celula>
                <Celula alinhar="dir" className="text-mute tabular">
                  {num(l.produtos.reduce((s, p) => s + p.estoque, 0))}
                </Celula>
                <Celula alinhar="dir" className="text-mute tabular">
                  {num(l.produtos.reduce((s, p) => s + p.vendas30d, 0))}
                </Celula>
                <Celula alinhar="dir">
                  <button
                    className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                    aria-label={`Editar ${l.linha}`}
                  >
                    <Icone nome="lapis" className="size-4" />
                  </button>
                </Celula>
              </Linha>
            ))}
          </Tabela>
        </Cartao>
      </div>

      <AvisoPrototipo>
        A árvore de categorias é a mesma usada pelo filtro da loja — mexer aqui muda a
        navegação da vitrine na hora. As coleções existem só no visual: são estampas
        geradas em SVG, sem custo de foto.
      </AvisoPrototipo>
    </>
  );
}
