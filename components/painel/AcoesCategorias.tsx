"use client";

import { useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { ProximaFase } from "./ProximaFase";

/**
 * Ações do cabeçalho de Categorias.
 *
 * Componente próprio porque a página é de servidor e estes dois botões
 * precisam de estado — separar aqui evita transformar a página inteira em
 * componente de cliente só por causa de dois cliques.
 */
export function AcoesCategorias() {
  const [modal, setModal] = useState<"vitrine" | "categoria" | null>(null);

  return (
    <>
      <button
        onClick={() => setModal("vitrine")}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.8125rem] font-medium hover:border-linha-forte"
      >
        <Icone nome="filtro" className="size-4" />
        Reordenar vitrine
      </button>
      <button
        onClick={() => setModal("categoria")}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
      >
        <Icone nome="mais" className="size-4" strokeWidth={2.2} />
        Nova categoria
      </button>

      {modal === "vitrine" && (
        <ProximaFase
          contexto="Catálogo"
          titulo="Reordenar vitrine"
          fechar={() => setModal(null)}
          itens={[
            "Arrastar categorias e coleções para definir a ordem em que aparecem no menu e na home.",
            "Fixar até quatro coleções em destaque na primeira dobra da loja.",
            "Esconder da vitrine uma linha que saiu de produção, sem apagar os produtos nem quebrar os links.",
            "Agendar a troca de vitrine — útil para virar a home de volta às aulas na data certa.",
          ]}
        />
      )}

      {modal === "categoria" && (
        <ProximaFase
          contexto="Catálogo"
          titulo="Nova categoria"
          fechar={() => setModal(null)}
          itens={[
            "Criar categoria e subcategorias (linhas), com nome, resumo e imagem de capa.",
            "Definir a URL da categoria e o texto de SEO que o Google mostra.",
            "Mover produtos entre categorias em lote, sem editar um a um.",
            "Escolher a ordem padrão da listagem — mais vendidos, lançamentos ou manual.",
          ]}
        />
      )}
    </>
  );
}
