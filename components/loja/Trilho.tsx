import Link from "next/link";
import { Icone } from "@/components/ui/Icone";
import { OlhoSecao, TituloSecao } from "@/components/ui/primitivos";
import type { Produto } from "@/lib/catalogo";
import { ProdutoCard } from "./ProdutoCard";

export function CabecaSecao({
  olho,
  titulo,
  descricao,
  href,
  hrefRotulo = "Ver tudo",
}: {
  olho?: string;
  titulo: string;
  descricao?: string;
  href?: string;
  hrefRotulo?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        {olho && <OlhoSecao>{olho}</OlhoSecao>}
        <TituloSecao className="mt-2.5">{titulo}</TituloSecao>
        {descricao && (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-mute">{descricao}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-2 border-b border-linha-forte pb-1 text-[0.8125rem] font-medium transition-colors hover:border-magenta hover:text-magenta-forte"
        >
          {hrefRotulo}
          <Icone
            nome="seta"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}

/** Trilho horizontal — no desktop vira grade quando cabe. */
export function TrilhoProdutos({ produtos }: { produtos: Produto[] }) {
  return (
    <div className="scroll-x -mx-5 mt-10 px-5 pb-4">
      <div className="grid grid-flow-col auto-cols-[minmax(230px,1fr)] gap-6 xl:auto-cols-fr">
        {produtos.map((p) => (
          <ProdutoCard key={p.sku} produto={p} compacto />
        ))}
      </div>
    </div>
  );
}

export function Secao({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-[1400px] px-5 ${className}`}>
      {children}
    </section>
  );
}
