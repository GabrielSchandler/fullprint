import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogo } from "@/components/loja/Catalogo";
import { Secao } from "@/components/loja/Trilho";
import { OlhoSecao, TituloSecao } from "@/components/ui/primitivos";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Cadernos, cadernetas, planners, blocos, cartões, adesivos e embalagens produzidos na gráfica da Full Print.",
};

export default function ProdutosPage() {
  return (
    <>
      <Secao className="pt-14 pb-10">
        <OlhoSecao>Catálogo completo</OlhoSecao>
        <TituloSecao as="h1" className="mt-2.5">
          Tudo o que sai da gráfica
        </TituloSecao>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-mute">
          Papelaria de linha produzida em Guarulhos. Filtre por categoria, coleção
          ou faixa de preço — e marque “personalizável” para ver o que pode sair
          com a sua marca.
        </p>
      </Secao>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1400px] px-5 py-20">
            <p className="spec text-mute-2">Carregando catálogo…</p>
          </div>
        }
      >
        <Catalogo />
      </Suspense>
    </>
  );
}
