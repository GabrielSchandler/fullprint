import type { ReactNode } from "react";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Contador, Holofote, Revelar } from "@/components/ui/movimento";
import { pct } from "@/lib/format";
import { Sparkline } from "./graficos";

/* ------------------------------------------------------------ cartão */

export function Cartao({
  titulo,
  descricao,
  acao,
  children,
  className = "",
  padding = true,
}: {
  titulo?: string;
  descricao?: string;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <Revelar
      as="section"
      className={`rounded-xl border border-linha bg-surface shadow-cartao ${className}`}
    >
      {(titulo || acao) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-linha px-6 py-4">
          <div>
            {titulo && <h2 className="text-[0.9375rem] font-semibold">{titulo}</h2>}
            {descricao && <p className="mt-1 text-[0.8125rem] text-mute">{descricao}</p>}
          </div>
          {acao}
        </header>
      )}
      <div className={padding ? "p-6" : ""}>{children}</div>
    </Revelar>
  );
}

/* --------------------------------------------------------------- KPI */

export function Kpi({
  rotulo,
  valor,
  variacao,
  auxiliar,
  icone,
  serie,
  corSerie,
  invertido = false,
}: {
  rotulo: string;
  valor: string;
  variacao?: number;
  auxiliar?: string;
  icone?: NomeIcone | string;
  serie?: number[];
  corSerie?: string;
  /** true quando subir é ruim (custo, cancelamento) */
  invertido?: boolean;
}) {
  const bom = variacao === undefined ? null : invertido ? variacao < 0 : variacao > 0;

  return (
    <Holofote className="rounded-xl border border-linha bg-surface p-5 shadow-cartao transition-shadow duration-300 hover:shadow-papel">
      <div className="flex items-start justify-between gap-3">
        <p className="spec text-mute-2">{rotulo}</p>
        {icone && (
          <span className="grid size-8 place-items-center rounded-full bg-papel text-mute">
            <Icone nome={icone} className="size-4" />
          </span>
        )}
      </div>

      <p className="mt-3 text-[1.75rem] leading-none font-semibold tracking-tight tabular">
        <Contador texto={valor} />
      </p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          {variacao !== undefined && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium tabular ${
                bom ? "bg-ok-bg text-ok" : "bg-erro-bg text-erro"
              }`}
            >
              <Icone
                nome={variacao > 0 ? "chevronCima" : "chevronBaixo"}
                className="size-3"
                strokeWidth={2.4}
              />
              {pct(variacao)}
            </span>
          )}
          {auxiliar && <p className="mt-1.5 text-[0.6875rem] text-mute">{auxiliar}</p>}
        </div>

        {serie && <Sparkline valores={serie} cor={corSerie} className="h-8 w-20" />}
      </div>
    </Holofote>
  );
}

/* ------------------------------------------------------------- selos */

const TONS = {
  ok: "bg-ok-bg text-ok",
  alerta: "bg-alerta-bg text-alerta",
  erro: "bg-erro-bg text-erro",
  info: "bg-info-bg text-info",
  neutro: "bg-papel-2 text-mute",
  destaque: "bg-magenta-claro text-magenta-forte",
} as const;

export function SeloStatus({
  tom = "neutro",
  children,
  ponto = true,
}: {
  tom?: keyof typeof TONS;
  children: ReactNode;
  ponto?: boolean;
}) {
  const PONTOS = {
    ok: "bg-ok",
    alerta: "bg-alerta",
    erro: "bg-erro",
    info: "bg-info",
    neutro: "bg-mute-2",
    destaque: "bg-magenta",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium whitespace-nowrap ${TONS[tom]}`}
    >
      {ponto && <span className={`size-1.5 rounded-full ${PONTOS[tom]}`} />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ tabela */

export type Coluna = {
  rotulo: string;
  alinhar?: "esq" | "dir" | "centro";
  /** quando presente, o cabeçalho vira botão de ordenação */
  chave?: string;
};

export function Tabela({
  cabecalho,
  children,
  className = "",
  minimo = 720,
  ordem,
  aoOrdenar,
}: {
  cabecalho: (string | Coluna)[];
  children: ReactNode;
  className?: string;
  /** largura mínima em px — abaixo disso a tabela rola na horizontal */
  minimo?: number;
  /** coluna e sentido em vigor, para desenhar a seta */
  ordem?: { chave: string; direcao: "asc" | "desc" };
  aoOrdenar?: (chave: string) => void;
}) {
  return (
    <div className={`scroll-x group/tabela ${className}`}>
      <table
        className="w-full border-collapse text-left"
        style={{ minWidth: `${minimo}px` }}
      >
        <thead>
          <tr className="border-b border-linha">
            {cabecalho.map((c, i) => {
              const item: Coluna = typeof c === "string" ? { rotulo: c, alinhar: "esq" } : c;
              const ordenavel = !!item.chave && !!aoOrdenar;
              const ativa = ordem?.chave === item.chave;
              const alinhamento =
                item.alinhar === "dir"
                  ? "text-right"
                  : item.alinhar === "centro"
                    ? "text-center"
                    : "";
              return (
                <th
                  key={i}
                  scope="col"
                  aria-sort={
                    ativa ? (ordem?.direcao === "asc" ? "ascending" : "descending") : undefined
                  }
                  className={`spec px-4 py-3 font-medium whitespace-nowrap text-mute-2 first:pl-6 last:pr-6 ${alinhamento}`}
                >
                  {ordenavel ? (
                    <button
                      onClick={() => aoOrdenar(item.chave!)}
                      className={`spec inline-flex items-center gap-1 transition-colors hover:text-tinta ${
                        ativa ? "text-tinta" : ""
                      } ${item.alinhar === "dir" ? "flex-row-reverse" : ""}`}
                    >
                      {item.rotulo}
                      <Icone
                        nome={ativa && ordem?.direcao === "asc" ? "chevronCima" : "chevronBaixo"}
                        className={`size-3 transition-opacity ${ativa ? "opacity-100" : "opacity-0 group-hover/tabela:opacity-40"}`}
                        strokeWidth={2.2}
                      />
                    </button>
                  ) : (
                    item.rotulo
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-linha">{children}</tbody>
      </table>
    </div>
  );
}

export function Celula({
  children,
  alinhar,
  className = "",
  colSpan,
}: {
  children: ReactNode;
  alinhar?: "esq" | "dir" | "centro";
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`px-4 py-3.5 text-[0.8125rem] whitespace-nowrap first:pl-6 last:pr-6 ${
        alinhar === "dir" ? "text-right" : alinhar === "centro" ? "text-center" : ""
      } ${className}`}
    >
      {children}
    </td>
  );
}

export function Linha({ children }: { children: ReactNode }) {
  return <tr className="transition-colors hover:bg-papel">{children}</tr>;
}

/* ------------------------------------------------------------- vazio */

/**
 * Estado vazio de tabela.
 *
 * Filtro que não acha nada deixava a tabela em branco, sem dizer se o filtro
 * é apertado demais ou se o sistema quebrou. Aqui a saída explica e oferece a
 * ação de limpar.
 */
export function Vazio({
  icone = "busca",
  titulo,
  texto,
  aoLimpar,
}: {
  icone?: NomeIcone | string;
  titulo: string;
  texto: string;
  /** quando existe, mostra o botão de limpar os filtros */
  aoLimpar?: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-papel-2 text-mute-2">
        <Icone nome={icone} className="size-5" />
      </span>
      <p className="mt-4 text-[0.9375rem] font-medium">{titulo}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-[0.8125rem] leading-relaxed text-mute">
        {texto}
      </p>
      {aoLimpar && (
        <button
          onClick={aoLimpar}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.8125rem] font-medium hover:border-tinta"
        >
          <Icone nome="fechar" className="size-3.5" />
          Limpar filtros
        </button>
      )}
    </div>
  );
}

/* --------------------------------------------------- cabeçalho de página */

export function CabecaPagina({
  titulo,
  descricao,
  acoes,
}: {
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <h1 className="font-display text-[2rem] leading-none">{titulo}</h1>
        {descricao && <p className="mt-2.5 max-w-2xl text-[0.875rem] text-mute">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  );
}

/* ------------------------------------------------------------- aviso */

export function AvisoPrototipo({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 flex items-start gap-2 rounded-lg border border-linha bg-papel-2/60 px-4 py-3 text-[0.75rem] leading-relaxed text-mute">
      <Icone nome="alerta" className="mt-0.5 size-4 shrink-0 text-alerta" />
      <span>{children}</span>
    </p>
  );
}
