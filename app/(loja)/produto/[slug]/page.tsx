import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetalheProduto } from "@/components/loja/DetalheProduto";
import { CabecaSecao, Secao, TrilhoProdutos } from "@/components/loja/Trilho";
import { Estrelas, Icone } from "@/components/ui/Icone";
import { Nota } from "@/components/ui/primitivos";
import { PRODUTOS, porSlug, relacionados } from "@/lib/catalogo";
import { diasAtras, entre, escolher, haQuanto, semente } from "@/lib/format";

export function generateStaticParams() {
  return PRODUTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = porSlug(slug);
  if (!p) return { title: "Produto não encontrado" };
  return { title: p.nome, description: p.resumo };
}

const NOMES = [
  "Ana P.", "Bruno L.", "Carla M.", "Diego R.", "Elisa F.", "Felipe S.",
  "Gabriela T.", "Henrique A.", "Isabela C.", "João V.", "Karina D.", "Lucas B.",
  "Mariana O.", "Nicolas G.", "Patrícia N.", "Rafael Q.",
];

const FRASES = [
  "Chegou antes do prazo e muito bem embalado. O acabamento é melhor do que a foto mostra.",
  "Uso todo dia há dois meses e a capa não descascou. Vale o preço.",
  "O papel é o ponto alto — caneta gel não traspassa e não borra.",
  "Comprei de novo pra presentear. A embalagem já vem pronta pra dar de presente.",
  "A cor bate com a do site, o que é raro em papelaria online.",
  "Bonito e resistente. Só achei que podia ter mais opção de pauta.",
  "Segunda compra na loja. Atendimento no WhatsApp respondeu em minutos.",
  "Pedi personalizado com o logo da empresa e o resultado ficou impecável.",
];

function Avaliacoes({ sku, nota, total }: { sku: string; nota: number; total: number }) {
  const r = semente(sku + "-reviews");
  const lista = Array.from({ length: 4 }).map(() => ({
    nome: escolher(r, NOMES),
    nota: Math.min(5, Math.round((nota + (r() - 0.35)) * 2) / 2),
    texto: escolher(r, FRASES),
    dias: entre(r, 3, 180),
    verificada: r() > 0.2,
  }));

  const dist = [5, 4, 3, 2, 1].map((estrela) => {
    const peso = estrela === Math.round(nota) ? 0.62 : estrela > nota ? 0.08 : 0.1;
    return { estrela, qtd: Math.max(0, Math.round(total * peso)) };
  });
  const maior = Math.max(...dist.map((d) => d.qtd), 1);

  return (
    <Secao className="pt-24">
      <CabecaSecao olho="Avaliações" titulo="O que quem comprou achou" />

      <div className="mt-10 grid gap-12 lg:grid-cols-[300px_1fr]">
        <div>
          <div className="flex items-end gap-3">
            <span className="font-display text-6xl leading-none tabular">
              {nota.toFixed(1).replace(".", ",")}
            </span>
            <div className="pb-2">
              <Estrelas nota={nota} />
              <p className="mt-1 text-[0.75rem] text-mute tabular">{total} avaliações</p>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {dist.map((d) => (
              <li key={d.estrela} className="flex items-center gap-3">
                <span className="w-3 text-[0.75rem] text-mute tabular">{d.estrela}</span>
                <Icone nome="estrela" className="size-3 text-mute-2" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-papel-3">
                  <div
                    className="h-full rounded-full bg-amarelo-forte"
                    style={{ width: `${(d.qtd / maior) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[0.75rem] text-mute-2 tabular">{d.qtd}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="divide-y divide-linha">
          {lista.map((a, i) => (
            <article key={i} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-center gap-3">
                <Estrelas nota={a.nota} />
                <p className="text-sm font-medium">{a.nome}</p>
                {a.verificada && (
                  <span className="spec inline-flex items-center gap-1 text-ok">
                    <Icone nome="check" className="size-3" />
                    Compra verificada
                  </span>
                )}
                <span className="spec ml-auto text-mute-2">
                  {haQuanto(diasAtras(a.dias))}
                </span>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-tinta/85">{a.texto}</p>
            </article>
          ))}
        </div>
      </div>

      <Nota className="mt-6">
        Avaliações geradas para o protótipo. No sistema real elas vêm de compra
        confirmada e passam pela moderação no painel.
      </Nota>
    </Secao>
  );
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produto = porSlug(slug);
  if (!produto) notFound();

  const outros = relacionados(produto, 6);

  return (
    <>
      <DetalheProduto produto={produto} />

      <Avaliacoes
        sku={produto.sku}
        nota={produto.avaliacao}
        total={produto.qtdAvaliacoes}
      />

      <Secao className="pt-24">
        <CabecaSecao
          olho="Combina com"
          titulo="Da mesma casa"
          descricao="Itens da mesma coleção saem com a mesma cor e o mesmo papel — dá para montar um conjunto sem risco de destoar."
          href="/produtos"
        />
        <TrilhoProdutos produtos={outros} />
      </Secao>
    </>
  );
}
