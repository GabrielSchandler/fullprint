import { data as dataBr } from "./format";

/**
 * Exportação de tabela em CSV.
 *
 * Ponto-e-vírgula como separador e vírgula decimal porque o Excel em pt-BR
 * abre assim sem pedir nada; com vírgula de separador ele joga a linha toda
 * numa célula só. O BOM na frente é o que faz o acento aparecer certo.
 */

export type Celula = string | number | Date | boolean | null | undefined;

function escapar(valor: Celula): string {
  if (valor === null || valor === undefined) return "";
  if (valor instanceof Date) return dataBr(valor);
  if (typeof valor === "boolean") return valor ? "sim" : "não";
  if (typeof valor === "number") {
    return Number.isInteger(valor)
      ? String(valor)
      : valor.toFixed(2).replace(".", ",");
  }
  const texto = String(valor);
  /* aspas, quebra de linha ou o próprio separador exigem célula entre aspas */
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function montarCsv(colunas: string[], linhas: Celula[][]): string {
  return [colunas, ...linhas].map((l) => l.map(escapar).join(";")).join("\r\n");
}

/** Nome de arquivo com data, para não sobrescrever a exportação de ontem. */
function comData(nome: string) {
  const hoje = new Date();
  const carimbo = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");
  return `fullprint-${nome}-${carimbo}.csv`;
}

export function baixarCsv(nome: string, colunas: string[], linhas: Celula[][]) {
  const conteudo = "﻿" + montarCsv(colunas, linhas);
  const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = comData(nome);
  document.body.appendChild(a);
  a.click();
  /* tirar a âncora ou revogar a URL logo depois do clique cancela o download
     em andamento — some com a origem do blob antes do navegador terminar de
     ler. Limpar depois, com folga. */
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 2000);
}
