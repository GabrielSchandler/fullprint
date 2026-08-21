/**
 * Formatação pt-BR feita à mão de propósito.
 *
 * `Intl` pode divergir entre o Node do servidor e o navegador (espaço fino
 * vs. espaço rígido depois do "R$"), e divergência vira erro de hidratação
 * no React. Formatar na mão elimina a classe inteira de problema.
 */

export function brl(valor: number, casas = 2): string {
  const negativo = valor < 0;
  const [inteiro, decimal] = Math.abs(valor).toFixed(casas).split(".");
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negativo ? "−" : ""}R$ ${comPontos}${decimal ? "," + decimal : ""}`;
}

/** Valor compacto para KPI: R$ 48,2 mil / R$ 1,24 mi */
export function brlCurto(valor: number): string {
  const abs = Math.abs(valor);
  const sinal = valor < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sinal}R$ ${(abs / 1_000_000).toFixed(2).replace(".", ",")} mi`;
  if (abs >= 1_000) return `${sinal}R$ ${(abs / 1_000).toFixed(1).replace(".", ",")} mil`;
  return brl(valor);
}

export function num(valor: number, casas = 0): string {
  const [inteiro, decimal] = Math.abs(valor).toFixed(casas).split(".");
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${valor < 0 ? "−" : ""}${comPontos}${decimal ? "," + decimal : ""}`;
}

export function pct(valor: number, casas = 1): string {
  return `${valor > 0 ? "+" : valor < 0 ? "−" : ""}${Math.abs(valor)
    .toFixed(casas)
    .replace(".", ",")}%`;
}

/** "Hoje" fixo — protótipo precisa ser determinístico entre servidor e cliente. */
export const HOJE = new Date(2026, 7, 20);

const MESES = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

const MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function data(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function dataCurta(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]}`;
}

export function dataHora(d: Date): string {
  return `${data(d)} · ${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
}

export function mesAno(d: Date): string {
  return `${MESES_LONGOS[d.getMonth()]} de ${d.getFullYear()}`;
}

export function diasAtras(dias: number): Date {
  const d = new Date(HOJE);
  d.setDate(d.getDate() - dias);
  return d;
}

export function haQuanto(d: Date): string {
  const dias = Math.round((HOJE.getTime() - d.getTime()) / 86_400_000);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 30) return `há ${dias} dias`;
  const meses = Math.round(dias / 30);
  return meses === 1 ? "há 1 mês" : `há ${meses} meses`;
}

/** PRNG determinístico a partir de uma string — mesma semente, mesmo número. */
export function semente(txt: string): () => number {
  let h = 1779033703 ^ txt.length;
  for (let i = 0; i < txt.length; i++) {
    h = Math.imul(h ^ txt.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function entre(rnd: () => number, min: number, max: number): number {
  return Math.floor(rnd() * (max - min + 1)) + min;
}

export function escolher<T>(rnd: () => number, lista: readonly T[]): T {
  return lista[Math.floor(rnd() * lista.length)];
}
