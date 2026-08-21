"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * Camada de movimento do projeto.
 *
 * Repertório inspirado no 21st.dev — scroll reveal, marquee, spotlight card e
 * number ticker — mas escrito à mão com IntersectionObserver, rAF e CSS. Sem
 * biblioteca de animação: são quatro efeitos, não justificam o peso de uma.
 *
 * Todos respeitam `prefers-reduced-motion` (o corte está no globals.css e,
 * onde é JS, na checagem `semMovimento`).
 */

const CONSULTA = "(prefers-reduced-motion: reduce)";

const assinarMovimento = (aoMudar: () => void) => {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
};

/**
 * Lê a preferência por menos movimento sem efeito colateral.
 *
 * useSyncExternalStore porque o servidor não tem matchMedia: ele renderiza
 * `false` e o navegador corrige no render seguinte, sem setState em efeito e
 * sem divergência de hidratação.
 */
function useSemMovimento() {
  return useSyncExternalStore(
    assinarMovimento,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}

/* ------------------------------------------------------------- revelar */

/**
 * Sobe e revela o bloco quando ele entra na viewport. `atraso` escalona os
 * irmãos, que é o que faz uma grade parecer coreografada em vez de piscar.
 */
export function Revelar({
  children,
  atraso = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** milissegundos de espera antes de revelar — para escalonar irmãos */
  atraso?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const reduzido = useSemMovimento();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduzido) return;
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      /* dispara um pouco antes de aparecer: a animação termina junto com a
         chegada do bloco, em vez de começar depois que ele já está à vista */
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduzido]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`revelar ${visivel || reduzido ? "visivel" : ""} ${className}`}
      style={{ "--atraso": `${atraso}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------- desfile */

/** Faixa que corre sem fim. O conteúdo é duplicado para o laço não ter emenda. */
export function Desfile({
  children,
  duracao = 32,
  className = "",
}: {
  children: ReactNode;
  /** segundos para uma volta completa */
  duracao?: number;
  className?: string;
}) {
  return (
    <div className={`desfile-pai group relative overflow-hidden ${className}`}>
      <div
        className="desfile flex w-max"
        style={{ "--duracao": `${duracao}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ holofote */

/**
 * Cartão com brilho que segue o cursor. O componente só alimenta as variáveis
 * `--mx`/`--my`; o gradiente em si mora no CSS (.holofote).
 */
export function Holofote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`holofote ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ contador */

/** Quebra "R$ 220,1 mil" em prefixo, número e sufixo. */
function partir(texto: string) {
  const m = texto.match(/^(\D*?)(-?[\d.]*\d(?:,\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefixo, cru, sufixo] = m;
  const decimais = cru.includes(",") ? cru.split(",")[1].length : 0;
  const valor = Number(cru.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(valor)) return null;
  return { prefixo, valor, decimais, sufixo };
}

function formatar(n: number, decimais: number) {
  const [inteiro, decimal] = Math.abs(n).toFixed(decimais).split(".");
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${n < 0 ? "−" : ""}${comPontos}${decimal ? "," + decimal : ""}`;
}

/**
 * Number ticker: conta do zero até o valor quando o número aparece na tela.
 *
 * Recebe o texto já formatado (é o que os KPIs têm em mãos) e devolve o mesmo
 * texto — só anima a parte numérica. Se não houver número, mostra o texto e
 * não faz nada.
 */
export function Contador({
  texto,
  duracao = 900,
  className = "",
}: {
  texto: string;
  duracao?: number;
  className?: string;
}) {
  const partes = useMemo(() => partir(texto), [texto]);
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const reduzido = useSemMovimento();

  useEffect(() => {
    const el = ref.current;
    if (!el || !partes || reduzido) return;

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / duracao);
          /* desaceleração forte no fim: o número "assenta" em vez de parar seco */
          setN(partes.valor * (1 - Math.pow(1 - t, 4)));
          if (t < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [partes, duracao, reduzido]);

  /* sem número no texto (ex.: "Planners & Agendas") não há o que animar */
  if (!partes) return <span className={className}>{texto}</span>;

  return (
    <span ref={ref} className={className}>
      {partes.prefixo}
      {formatar(reduzido ? partes.valor : n, partes.decimais)}
      {partes.sufixo}
    </span>
  );
}
