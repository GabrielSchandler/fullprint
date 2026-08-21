import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AmostraEstampa } from "@/components/mockup/estampas";
import { ProdutoCard } from "@/components/loja/ProdutoCard";
import { Secao } from "@/components/loja/Trilho";
import { Icone } from "@/components/ui/Icone";
import { OlhoSecao, TituloSecao } from "@/components/ui/primitivos";
import { COLECOES, porColecao, type ColecaoId } from "@/lib/catalogo";

export function generateStaticParams() {
  return COLECOES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = COLECOES.find((x) => x.id === slug);
  if (!c) return { title: "Coleção não encontrada" };
  return { title: `Coleção ${c.nome}`, description: c.resumo };
}

export default async function ColecaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const colecao = COLECOES.find((c) => c.id === slug);
  if (!colecao) notFound();

  const itens = porColecao(colecao.id as ColecaoId);
  const amostras = [...new Set(itens.map((p) => `${p.padrao}|${p.paleta}`))].slice(0, 8);

  return (
    <>
      <section className="border-b border-linha bg-papel-2">
        <div className="mx-auto max-w-[1400px] px-5 py-16">
          <nav className="flex items-center gap-1.5 text-[0.75rem] text-mute">
            <Link href="/" className="hover:text-tinta">Início</Link>
            <Icone nome="chevron" className="size-3" />
            <span className="text-tinta">Coleção {colecao.nome}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <OlhoSecao>Coleção</OlhoSecao>
              <TituloSecao as="h1" className="mt-2.5">
                {colecao.nome}
              </TituloSecao>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-mute">
                {colecao.resumo}
              </p>
              <p className="spec mt-6 text-mute-2">
                {itens.length} {itens.length === 1 ? "produto" : "produtos"} nesta coleção
              </p>
            </div>

            <div className="lg:col-span-5">
              <p className="spec text-mute-2">Estampas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {amostras.map((a) => {
                  const [padrao, paleta] = a.split("|");
                  return (
                    <AmostraEstampa
                      key={a}
                      padrao={padrao as never}
                      paleta={paleta as never}
                      className="size-14 rounded-lg"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Secao className="py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
          {itens.map((p, i) => (
            <ProdutoCard key={p.sku} produto={p} prioritaria={i < 4} />
          ))}
        </div>
      </Secao>

      <Secao className="pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-linha bg-surface px-7 py-6">
          <div>
            <p className="spec text-mute-2">Outras coleções</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {COLECOES.filter((c) => c.id !== colecao.id).map((c) => (
                <Link
                  key={c.id}
                  href={`/colecao/${c.id}`}
                  className="rounded-full border border-linha px-3.5 py-1.5 text-[0.8125rem] transition-colors hover:border-tinta"
                >
                  {c.nome}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
          >
            Ver catálogo completo
            <Icone nome="seta" className="size-3.5" />
          </Link>
        </div>
      </Secao>
    </>
  );
}
