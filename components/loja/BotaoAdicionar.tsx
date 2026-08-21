"use client";

import { useState } from "react";
import { useCarrinho } from "@/lib/carrinho";
import { Botao } from "@/components/ui/primitivos";
import { Icone } from "@/components/ui/Icone";

export function BotaoAdicionar({
  sku,
  qtd = 1,
  variacao,
  rotulo = "Adicionar",
  tom = "tinta",
  tamanho = "md",
  className = "",
  esgotado = false,
}: {
  sku: string;
  qtd?: number;
  variacao?: string;
  rotulo?: string;
  tom?: "tinta" | "magenta" | "contorno" | "claro";
  tamanho?: "sm" | "md" | "lg";
  className?: string;
  esgotado?: boolean;
}) {
  const { adicionar } = useCarrinho();
  const [feito, setFeito] = useState(false);

  if (esgotado) {
    return (
      <Botao tom="contorno" tamanho={tamanho} className={className} disabled>
        Esgotado
      </Botao>
    );
  }

  return (
    <Botao
      tom={tom}
      tamanho={tamanho}
      className={className}
      onClick={() => {
        adicionar(sku, qtd, variacao);
        setFeito(true);
        setTimeout(() => setFeito(false), 1600);
      }}
    >
      <Icone nome={feito ? "check" : "sacola"} className="size-4" />
      {feito ? "No carrinho" : rotulo}
    </Botao>
  );
}
