import Link from "next/link";
import { PALETAS } from "@/components/mockup/estampas";
import { Estrelas, Icone } from "@/components/ui/Icone";
import { Selo } from "@/components/ui/primitivos";
import { categoriaDe, type Produto } from "@/lib/catalogo";
import { brl } from "@/lib/format";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { FotoProduto } from "@/components/loja/FotoProduto";

/**
 * Fundo do mockup tingido pela própria capa — cada card ganha o seu ambiente.
 * Usa `amb` (sempre claro) e não `base`, porque capa escura sobre fundo escuro
 * apaga o produto.
 */
export function fundoDoProduto(paleta: Produto["paleta"]) {
  const p = PALETAS[paleta];
  return `radial-gradient(130% 100% at 28% 8%, ${p.amb} 0%, ${p.amb}66 42%, #fdfcfa 78%)`;
}

export function ProdutoCard({
  produto,
  compacto = false,
  prioritaria = false,
}: {
  produto: Produto;
  compacto?: boolean;
  /** true na primeira fileira da grade — é a imagem que o navegador mede como LCP */
  prioritaria?: boolean;
}) {
  const esgotado = produto.estoque === 0;
  const emOferta = !!produto.precoDe && produto.precoDe > produto.preco;
  const parcela = produto.preco / 3;

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/produto/${produto.slug}`}
        className="relative block overflow-hidden rounded-xl border border-linha bg-surface transition-all duration-300 group-hover:border-linha-forte group-hover:shadow-papel"
      >
        <div
          className="relative aspect-square"
          style={{ background: fundoDoProduto(produto.paleta) }}
        >
          <FotoProduto produto={produto} prioritaria={prioritaria} sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 300px" className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
          {esgotado && (
            <div className="absolute inset-0 grid place-items-center bg-papel/70 backdrop-blur-[1px]">
              <span className="spec rounded-full bg-tinta px-3 py-1.5 text-papel">
                Esgotado
              </span>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {produto.novo && <Selo tom="novo">Novo</Selo>}
          {emOferta && (
            <Selo tom="oferta">
              −{Math.round((1 - produto.preco / produto.precoDe!) * 100)}%
            </Selo>
          )}
        </div>

        <span
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-full border border-linha bg-surface/90 text-mute opacity-0 backdrop-blur transition-all duration-200 group-hover:opacity-100 hover:text-magenta"
          aria-hidden="true"
        >
          <Icone nome="coracao" className="size-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="spec text-mute-2">{categoriaDe(produto.categoria).nome}</p>

        <h3 className="mt-1.5 text-[0.9375rem] leading-snug font-medium">
          <Link href={`/produto/${produto.slug}`} className="hover:text-magenta-forte">
            {produto.nome}
          </Link>
        </h3>

        {!compacto && (
          <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-mute">
            {produto.resumo}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1.5">
          <Estrelas nota={produto.avaliacao} />
          <span className="text-[0.6875rem] text-mute-2 tabular">
            {produto.avaliacao.toFixed(1).replace(".", ",")} ({produto.qtdAvaliacoes})
          </span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            {emOferta && (
              <span className="text-[0.8125rem] text-mute-2 line-through tabular">
                {brl(produto.precoDe!)}
              </span>
            )}
            <span className="text-[1.0625rem] font-semibold tabular">
              {brl(produto.preco)}
            </span>
          </div>
          <p className="mt-0.5 text-[0.6875rem] text-mute">
            ou 3× de <span className="tabular">{brl(parcela)}</span> sem juros
          </p>

          <BotaoAdicionar
            sku={produto.sku}
            esgotado={esgotado}
            tom="contorno"
            tamanho="sm"
            rotulo="Adicionar"
            className="mt-3 w-full"
          />
        </div>
      </div>
    </article>
  );
}
