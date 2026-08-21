import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ------------------------------------------------------------------ botão */

type Tom = "tinta" | "magenta" | "contorno" | "fantasma" | "claro";
type Tamanho = "sm" | "md" | "lg";

const TONS: Record<Tom, string> = {
  tinta: "bg-tinta text-papel hover:bg-grafite border border-tinta",
  magenta: "bg-magenta text-white hover:bg-magenta-forte border border-magenta hover:border-magenta-forte",
  contorno: "bg-transparent text-tinta border border-linha-forte hover:border-tinta hover:bg-surface",
  fantasma: "bg-transparent text-tinta border border-transparent hover:bg-papel-2",
  claro: "bg-surface text-tinta border border-linha hover:border-linha-forte shadow-cartao",
};

const TAMANHOS: Record<Tamanho, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.9375rem]",
};

const BASE_BOTAO =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap cursor-pointer";

/* varredura de brilho só nos tons cheios — em botão de contorno o brilho
   passaria por cima do papel e sujaria o fundo */
const CINTILAM: Tom[] = ["tinta", "magenta"];
const brilho = (tom: Tom) => (CINTILAM.includes(tom) ? "cintila" : "");

export function Botao({
  tom = "tinta",
  tamanho = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { tom?: Tom; tamanho?: Tamanho }) {
  return (
    <button
      className={`${BASE_BOTAO} ${TONS[tom]} ${TAMANHOS[tamanho]} ${brilho(tom)} ${className}`}
      {...props}
    />
  );
}

export function BotaoLink({
  tom = "tinta",
  tamanho = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { tom?: Tom; tamanho?: Tamanho }) {
  return (
    <Link
      className={`${BASE_BOTAO} ${TONS[tom]} ${TAMANHOS[tamanho]} ${brilho(tom)} ${className}`}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------- selo */

const SELOS = {
  novo: "bg-tinta text-papel",
  oferta: "bg-magenta text-white",
  b2b: "bg-ciano-claro text-ciano-forte border border-ciano/25",
  neutro: "bg-papel-2 text-mute border border-linha",
  ok: "bg-ok-bg text-ok",
  alerta: "bg-alerta-bg text-alerta",
  erro: "bg-erro-bg text-erro",
  info: "bg-info-bg text-info",
} as const;

export function Selo({
  tom = "neutro",
  children,
  className = "",
}: {
  tom?: keyof typeof SELOS;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`spec inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${SELOS[tom]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- títulos */

export function OlhoSecao({ children }: { children: ReactNode }) {
  return <p className="spec text-magenta-forte">{children}</p>;
}

export function TituloSecao({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.01em] ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------- placa de aviso */

export function Nota({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`spec rounded-lg border border-linha bg-papel-2/60 px-3 py-2 leading-relaxed text-mute normal-case tracking-normal ${className}`}
      style={{ fontSize: "0.6875rem", letterSpacing: "0.01em" }}
    >
      {children}
    </p>
  );
}
