"use client";

import { useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { baixarCsv, type Celula } from "@/lib/csv";

/**
 * Botão que exporta uma tabela em CSV de verdade.
 *
 * Aceita os dados prontos (colunas + linhas) para poder ser chamado tanto de
 * página de servidor quanto de cliente. Depois de baixar, troca o rótulo por
 * um "pronto" por dois segundos — sem isso o clique não dá retorno nenhum e
 * quem está apresentando fica sem saber se funcionou.
 */
export function BotaoExportar({
  nome,
  colunas,
  linhas,
  rotulo = "Exportar",
  tom = "contorno",
  compacto = false,
}: {
  /** vira o nome do arquivo: fullprint-<nome>-aaaa-mm-dd.csv */
  nome: string;
  colunas: string[];
  linhas: Celula[][];
  rotulo?: string;
  tom?: "contorno" | "tinta" | "texto";
  compacto?: boolean;
}) {
  const [pronto, setPronto] = useState(false);

  const exportar = () => {
    baixarCsv(nome, colunas, linhas);
    setPronto(true);
    setTimeout(() => setPronto(false), 2000);
  };

  const estilo =
    tom === "tinta"
      ? "h-10 rounded-full bg-tinta px-4 text-papel hover:bg-grafite cintila"
      : tom === "texto"
        ? "text-[0.8125rem] font-medium hover:text-magenta-forte"
        : "h-10 rounded-full border border-linha bg-surface px-4 hover:border-linha-forte";

  return (
    <button
      onClick={exportar}
      disabled={linhas.length === 0}
      title={
        linhas.length === 0
          ? "Nada para exportar com os filtros atuais"
          : `${linhas.length} linhas em CSV`
      }
      className={`inline-flex items-center gap-2 text-[0.8125rem] font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 ${estilo}`}
    >
      <Icone
        nome={pronto ? "check" : "baixar"}
        className={compacto ? "size-3.5" : "size-4"}
        strokeWidth={pronto ? 2.4 : 1.6}
      />
      {pronto ? "Baixado" : rotulo}
      {!compacto && linhas.length > 0 && (
        /* pílula, e não número solto: "Exportar 30" se lia como parte do
           rótulo em vez de contagem de linhas */
        <span
          className={`spec rounded-full px-1.5 py-0.5 text-[0.5625rem] ${
            tom === "tinta"
              ? "bg-papel/15 text-papel/70"
              : "bg-papel-2 text-mute-2"
          }`}
        >
          {linhas.length}
        </span>
      )}
    </button>
  );
}
