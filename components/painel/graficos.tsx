"use client";

import { useRef, useState } from "react";
import { brl, brlCurto, num } from "@/lib/format";

/**
 * Gráficos do painel — SVG puro, sem biblioteca.
 *
 * Regras seguidas (skill dataviz):
 * - paleta categórica validada (CVD, contraste ≥3:1, banda de luminância),
 *   atribuída em ordem fixa, nunca ciclada
 * - um eixo só, nunca eixo duplo
 * - marca fina, grade recessiva, rótulo direto seletivo
 * - camada de hover em todo gráfico com plotagem
 * - legenda sempre presente a partir de 2 séries; série única não leva legenda
 * - texto usa cor de texto, nunca a cor da série
 */

export const SERIES = [
  "var(--color-serie-1)",
  "var(--color-serie-2)",
  "var(--color-serie-3)",
  "var(--color-serie-4)",
  "var(--color-serie-5)",
];

const GRADE = "var(--color-linha)";
const EIXO = "var(--color-mute-2)";

/**
 * Formatador do eixo/rótulo.
 *
 * Aceita função OU nome. O nome existe porque página de servidor não consegue
 * passar função para componente de cliente — o React não serializa função.
 */
export type Formatador = ((n: number) => string) | "brl" | "brl0" | "brlCurto" | "num";

const NOMEADOS: Record<string, (n: number) => string> = {
  brl: (n) => brl(n),
  brl0: (n) => brl(n, 0),
  brlCurto,
  num: (n) => num(n),
};

const resolver = (f: Formatador) => (typeof f === "function" ? f : NOMEADOS[f]);

/**
 * Marcação do eixo: mesmo formato, sem o "R$".
 *
 * O prefixo repetido em cinco marcações não informa nada — o título do cartão
 * já diz que é dinheiro — e é ele que estourava a margem esquerda, cortando o
 * primeiro dígito ("R$ 299,5 mil" virava "?99,5 mil"). O valor cheio, com
 * moeda, continua no balão de hover.
 */
const noEixo = (f: Formatador) => (n: number) =>
  resolver(f)(n).replace(/^R\$\s*/, "").replace(/^−R\$\s*/, "−");

function Legenda({ itens }: { itens: { rotulo: string; cor: string }[] }) {
  if (itens.length < 2) return null;
  return (
    <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      {itens.map((i) => (
        <li key={i.rotulo} className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px]" style={{ background: i.cor }} />
          <span className="text-[0.75rem] text-mute">{i.rotulo}</span>
        </li>
      ))}
    </ul>
  );
}

function Balao({
  x,
  y,
  largura,
  children,
}: {
  x: number;
  y: number;
  largura: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg border border-linha bg-surface px-3 py-2 shadow-papel"
      style={{
        left: `${x}%`,
        top: y,
        width: largura,
        transform: `translateX(${x > 62 ? "-105%" : "5%"})`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ área/linha */

export type SerieArea = { rotulo: string; valores: number[] };

export function GraficoArea({
  rotulos,
  series,
  altura = 260,
  formato = "brlCurto",
}: {
  rotulos: string[];
  series: SerieArea[];
  altura?: number;
  formato?: Formatador;
}) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const L = 68, R = 10, T = 14, B = 28;
  const W = 800, H = altura;
  const iw = W - L - R;
  const ih = H - T - B;

  const todos = series.flatMap((s) => s.valores);
  const max = Math.max(...todos) * 1.08;
  const passo = series[0].valores.length > 1 ? iw / (series[0].valores.length - 1) : iw;

  const px = (i: number) => L + i * passo;
  const py = (v: number) => T + ih - (v / max) * ih;

  const linhas = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: T + ih - f * ih,
    valor: max * f,
  }));

  return (
    <div className="relative" ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: altura }}
        onMouseLeave={() => setAtivo(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round((rel - L) / passo);
          setAtivo(i >= 0 && i < rotulos.length ? i : null);
        }}
      >
        <defs>
          {series.map((_, i) => (
            <linearGradient key={i} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES[i]} stopOpacity="0.16" />
              <stop offset="100%" stopColor={SERIES[i]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {linhas.map((l, i) => (
          <g key={i}>
            <line x1={L} x2={W - R} y1={l.y} y2={l.y} stroke={GRADE} strokeWidth="1" />
            <text
              x={L - 12}
              y={l.y + 3.5}
              textAnchor="end"
              fill={EIXO}
              fontSize="10.5"
              fontFamily="var(--font-sans)"
            >
              {noEixo(formato)(l.valor)}
            </text>
          </g>
        ))}

        {series.map((s, si) => {
          const pontos = s.valores.map((v, i) => `${px(i)},${py(v)}`).join(" ");
          const area = `M${px(0)},${T + ih} L${pontos.replace(/ /g, " L")} L${px(s.valores.length - 1)},${T + ih} Z`;
          return (
            <g key={s.rotulo}>
              {si === 0 && <path d={area} fill={`url(#area-${si})`} />}
              <polyline
                points={pontos}
                fill="none"
                stroke={SERIES[si]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={si > 0 ? "5 4" : undefined}
              />
            </g>
          );
        })}

        {ativo !== null && (
          <>
            <line
              x1={px(ativo)}
              x2={px(ativo)}
              y1={T}
              y2={T + ih}
              stroke="var(--color-mute-2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {series.map((s, si) => (
              <circle
                key={si}
                cx={px(ativo)}
                cy={py(s.valores[ativo])}
                r="4.5"
                fill={SERIES[si]}
                stroke="var(--color-surface)"
                strokeWidth="2"
              />
            ))}
          </>
        )}

        {rotulos.map((r, i) => (
          <text
            key={i}
            x={px(i)}
            y={H - 8}
            textAnchor="middle"
            fill={ativo === i ? "var(--color-tinta)" : EIXO}
            fontSize="10.5"
            fontFamily="var(--font-sans)"
          >
            {r}
          </text>
        ))}
      </svg>

      {ativo !== null && (
        <Balao x={(px(ativo) / W) * 100} y={12} largura={180}>
          <p className="spec text-mute-2">{rotulos[ativo]}</p>
          <ul className="mt-1.5 space-y-1">
            {series.map((s, si) => (
              <li key={s.rotulo} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[0.75rem] text-mute">
                  <span className="size-2 rounded-[2px]" style={{ background: SERIES[si] }} />
                  {s.rotulo}
                </span>
                <span className="text-[0.75rem] font-medium tabular">
                  {brl(s.valores[ativo], 0)}
                </span>
              </li>
            ))}
          </ul>
        </Balao>
      )}

      <Legenda itens={series.map((s, i) => ({ rotulo: s.rotulo, cor: SERIES[i] }))} />
    </div>
  );
}

/* ------------------------------------------------------------ barras */

export function GraficoBarras({
  rotulos,
  valores,
  altura = 200,
  cor = SERIES[0],
  formato = "num",
  rotuloValor = "Pedidos",
}: {
  rotulos: string[];
  valores: number[];
  altura?: number;
  cor?: string;
  formato?: Formatador;
  rotuloValor?: string;
}) {
  const [ativo, setAtivo] = useState<number | null>(null);

  const L = 56, R = 8, T = 12, B = 26;
  const W = 800, H = altura;
  const iw = W - L - R;
  const ih = H - T - B;
  const max = Math.max(...valores) * 1.1;
  const larguraCol = iw / valores.length;
  const larguraBarra = Math.max(2, larguraCol - 2); /* 2px de respiro entre barras */

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: altura }}
        onMouseLeave={() => setAtivo(null)}
      >
        {[0, 0.5, 1].map((f, i) => (
          <g key={i}>
            <line
              x1={L}
              x2={W - R}
              y1={T + ih - f * ih}
              y2={T + ih - f * ih}
              stroke={GRADE}
              strokeWidth="1"
            />
            <text
              x={L - 8}
              y={T + ih - f * ih + 3.5}
              textAnchor="end"
              fill={EIXO}
              fontSize="10.5"
              fontFamily="var(--font-sans)"
            >
              {noEixo(formato)(max * f)}
            </text>
          </g>
        ))}

        {valores.map((v, i) => {
          const h = (v / max) * ih;
          return (
            <g key={i} onMouseEnter={() => setAtivo(i)}>
              <rect
                x={L + i * larguraCol}
                y={T}
                width={larguraCol}
                height={ih}
                fill="transparent"
              />
              <rect
                x={L + i * larguraCol + 1}
                y={T + ih - h}
                width={larguraBarra}
                height={Math.max(h, 1)}
                rx="3"
                fill={cor}
                opacity={ativo === null || ativo === i ? 1 : 0.35}
              />
            </g>
          );
        })}

        {rotulos.map((r, i) =>
          r ? (
            <text
              key={i}
              x={L + i * larguraCol + larguraCol / 2}
              y={H - 8}
              textAnchor="middle"
              fill={EIXO}
              fontSize="10"
              fontFamily="var(--font-sans)"
            >
              {r}
            </text>
          ) : null,
        )}
      </svg>

      {ativo !== null && (
        <Balao x={((L + ativo * larguraCol) / W) * 100} y={8} largura={150}>
          <p className="spec text-mute-2">{rotulos[ativo] || `#${ativo + 1}`}</p>
          <p className="mt-1 text-sm font-semibold tabular">{num(valores[ativo])}</p>
          <p className="text-[0.6875rem] text-mute">{rotuloValor}</p>
        </Balao>
      )}
    </div>
  );
}

/* -------------------------------------------------- barras horizontais */

export function BarrasHorizontais({
  itens,
  formato = "brl",
  cores,
}: {
  itens: { nome: string; valor: number }[];
  formato?: Formatador;
  cores?: string[];
}) {
  const max = Math.max(...itens.map((i) => i.valor));
  return (
    <ul className="space-y-3.5">
      {itens.map((i, idx) => (
        <li key={i.nome} className="group">
          <div className="flex items-baseline justify-between gap-4">
            <span className="truncate text-[0.8125rem] text-tinta/85">{i.nome}</span>
            <span className="shrink-0 text-[0.8125rem] font-medium tabular">
              {resolver(formato)(i.valor)}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-papel-3">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${(i.valor / max) * 100}%`,
                /* Ranking de UMA medida é magnitude, não identidade: uma cor
                   só, escurecendo por posição. Ciclar a paleta categórica
                   fazia o 6º item repetir a cor do 1º e sugeria parentesco
                   entre categorias que não têm nenhum. */
                background: cores?.[idx] ?? SERIES[0],
                opacity: cores ? 1 : Math.max(0.4, 1 - idx * 0.09),
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------- rosca */

export function Rosca({
  itens,
  total,
  rotuloCentro = "Total",
}: {
  itens: { nome: string; valor: number }[];
  total?: number;
  rotuloCentro?: string;
}) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const soma = total ?? itens.reduce((s, i) => s + i.valor, 0);

  const R = 68, r = 44, cx = 90, cy = 90;

  const fatias = itens.map((item, i) => {
    /* offset vem das fatias anteriores; sem acumulador mutável no render */
    const anteriores = itens.slice(0, i).reduce((s, x) => s + x.valor, 0);
    const inicio = -Math.PI / 2 + (anteriores / soma) * Math.PI * 2;
    const fracao = item.valor / soma;
    /* 2px de respiro entre fatias — o vão faz a leitura, não a borda */
    const fim = inicio + fracao * Math.PI * 2 - 0.024;

    /* arredondado: Math.cos/sin diferem no último bit entre Node e navegador,
       e a diferença virava erro de hidratação no path do SVG */
    const ponto = (raio: number, a: number) =>
      `${(cx + raio * Math.cos(a)).toFixed(3)},${(cy + raio * Math.sin(a)).toFixed(3)}`;
    const grande = fim - inicio > Math.PI ? 1 : 0;

    return {
      ...item,
      fracao,
      cor: SERIES[i % SERIES.length],
      d: `M${ponto(R, inicio)} A${R},${R} 0 ${grande} 1 ${ponto(R, fim)} L${ponto(r, fim)} A${r},${r} 0 ${grande} 0 ${ponto(r, inicio)} Z`,
    };
  });

  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="relative">
        <svg viewBox="0 0 180 180" className="size-[180px]" onMouseLeave={() => setAtivo(null)}>
          {fatias.map((f, i) => (
            <path
              key={f.nome}
              d={f.d}
              fill={f.cor}
              opacity={ativo === null || ativo === i ? 1 : 0.35}
              onMouseEnter={() => setAtivo(i)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          {ativo === null ? (
            <div>
              <p className="spec text-mute-2">{rotuloCentro}</p>
              <p className="mt-1 text-lg font-semibold tabular">{brlCurto(soma)}</p>
            </div>
          ) : (
            <div>
              <p className="spec text-mute-2">
                {(fatias[ativo].fracao * 100).toFixed(0)}%
              </p>
              <p className="mt-1 text-[0.9375rem] font-semibold tabular">
                {brlCurto(fatias[ativo].valor)}
              </p>
            </div>
          )}
        </div>
      </div>

      <ul className="min-w-[160px] flex-1 space-y-2.5">
        {fatias.map((f, i) => (
          <li
            key={f.nome}
            className="flex cursor-default items-center gap-2.5"
            onMouseEnter={() => setAtivo(i)}
            onMouseLeave={() => setAtivo(null)}
          >
            <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: f.cor }} />
            <span className="flex-1 truncate text-[0.8125rem] text-mute">{f.nome}</span>
            <span className="text-[0.8125rem] font-medium tabular">
              {(f.fracao * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------- sparkline */

export function Sparkline({
  valores,
  cor = "var(--color-serie-1)",
  className = "h-9 w-24",
}: {
  valores: number[];
  cor?: string;
  className?: string;
}) {
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const faixa = max - min || 1;
  const pontos = valores
    .map((v, i) => `${(i / (valores.length - 1)) * 100},${28 - ((v - min) / faixa) * 24}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" className={className} preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={pontos}
        fill="none"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
