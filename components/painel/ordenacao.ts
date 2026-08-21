"use client";

import { useState } from "react";

/**
 * Estado de ordenação de tabela.
 *
 * `ordenar` recebe a lista e uma função que devolve o valor comparável de cada
 * item para a coluna atual — string entra em localeCompare (acento importa em
 * pt-BR), número e data entram em subtração.
 */
export function useOrdenacao(inicial: string, direcaoInicial: "asc" | "desc" = "desc") {
  const [chave, setChave] = useState(inicial);
  const [direcao, setDirecao] = useState<"asc" | "desc">(direcaoInicial);

  const alternar = (nova: string) => {
    if (nova === chave) {
      setDirecao((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setChave(nova);
      setDirecao("desc");
    }
  };

  function ordenar<T>(lista: T[], valor: (item: T, chave: string) => string | number | Date) {
    const sinal = direcao === "asc" ? 1 : -1;
    return [...lista].sort((a, b) => {
      const va = valor(a, chave);
      const vb = valor(b, chave);
      if (typeof va === "string" && typeof vb === "string") {
        return va.localeCompare(vb, "pt-BR") * sinal;
      }
      return (Number(va) - Number(vb)) * sinal;
    });
  }

  return { chave, direcao, alternar, ordenar, ordem: { chave, direcao } };
}
