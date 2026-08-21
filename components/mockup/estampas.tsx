/**
 * Estampas — padrões de capa gerados em SVG.
 *
 * Cada produto do catálogo combina um PADRÃO com uma PALETA. As duas listas
 * são curtas e curadas de propósito: variedade sem virar cor aleatória.
 * Ver ../FullPrint/identidade/design-guide.md → "Fotografia e imagem de produto".
 */

/**
 * Paleta de capa.
 *
 * - `base` é o fundo da estampa e pode ser escuro (capa escura dá o contraste
 *   que uma grade só de tom pastel não tem).
 * - `a` e `b` são as cores do desenho.
 * - `c` é SEMPRE o tom mais escuro: lombada, faces laterais e o texto aplicado
 *   sobre a placa cor de creme. Se `c` clarear, o título fica ilegível.
 * - `amb` é o fundo do card na vitrine — sempre claro, mesmo em paleta escura,
 *   porque o produto precisa se destacar do ambiente e não sumir nele.
 */
export const PALETAS = {
  areia: { base: "#efe4d4", a: "#dcc7a9", b: "#bb9d76", c: "#6f5b41", amb: "#ecdfc9" },
  oceano: { base: "#dfe8f0", a: "#b6cadc", b: "#7794b3", c: "#2e4a63", amb: "#d8e5f1" },
  magenta: { base: "#fbe3ef", a: "#f4b6d5", b: "#e6007e", c: "#7d0a47", amb: "#fbdcea" },
  ciano: { base: "#e0f1f9", a: "#a8d9ec", b: "#00a3d9", c: "#075a78", amb: "#d6eefa" },
  mostarda: { base: "#fbf0cd", a: "#f0d787", b: "#d2a400", c: "#7d6212", amb: "#faebbe" },
  mata: { base: "#e2eadf", a: "#b7cbaf", b: "#6c8f63", c: "#31462e", amb: "#dbe7d6" },
  terracota: { base: "#f7e5dc", a: "#e6bda6", b: "#c1704c", c: "#6f3b26", amb: "#f6dfd1" },
  grafite: { base: "#eae7e1", a: "#c5c1b9", b: "#78746d", c: "#2b2a28", amb: "#e6e2da" },
  vinho: { base: "#f3e3e5", a: "#d9aeb4", b: "#9e3a4c", c: "#54202b", amb: "#f2dde0" },
  kraft: { base: "#e6d5bd", a: "#d0b691", b: "#a8845a", c: "#5c452b", amb: "#e4d1b5" },
  menta: { base: "#dcece8", a: "#a9d0c7", b: "#4f9c8b", c: "#22463f", amb: "#d3eae4" },
  /* --- capas escuras --- */
  noite: { base: "#23273f", a: "#3c4362", b: "#8390c4", c: "#14162a", amb: "#dde0ea" },
  carvao: { base: "#26262a", a: "#3d3d44", b: "#8f8f99", c: "#131315", amb: "#e5e2dc" },
} as const;

export type PaletaNome = keyof typeof PALETAS;
export const NOMES_PALETA = Object.keys(PALETAS) as PaletaNome[];

export const PADROES = [
  "leque",
  "losango",
  "arco",
  "grade",
  "terrazzo",
  "linha",
  "onda",
  "ponto",
  "raio",
  "liso",
] as const;
export type PadraoNome = (typeof PADROES)[number];

/** id determinístico: mesma combinação = mesmo <pattern>, sem colisão útil */
export function idEstampa(padrao: PadraoNome, paleta: PaletaNome) {
  return `es-${padrao}-${paleta}`;
}

export function DefEstampa({
  padrao,
  paleta,
}: {
  padrao: PadraoNome;
  paleta: PaletaNome;
}) {
  const p = PALETAS[paleta];
  const id = idEstampa(padrao, paleta);

  const conteudo = (() => {
    switch (padrao) {
      case "leque":
        return (
          <>
            <rect width="40" height="40" fill={p.base} />
            <polygon points="20,40 0,0 10,0" fill={p.a} />
            <polygon points="20,40 10,0 20,0" fill={p.b} />
            <polygon points="20,40 20,0 30,0" fill={p.a} />
            <polygon points="20,40 30,0 40,0" fill={p.c} opacity="0.75" />
            <path d="M0 40 H40" stroke={p.c} strokeWidth="0.5" opacity="0.35" />
          </>
        );
      case "losango":
        return (
          <>
            <rect width="32" height="32" fill={p.base} />
            <polygon points="16,1 31,16 16,31 1,16" fill={p.a} />
            <polygon points="16,8 24,16 16,24 8,16" fill={p.b} />
            <polygon points="16,13 19,16 16,19 13,16" fill={p.c} />
          </>
        );
      case "arco":
        return (
          <>
            <rect width="40" height="24" fill={p.base} />
            <path d="M0 24 A20 20 0 0 1 40 24 Z" fill={p.a} />
            <path d="M8 24 A12 12 0 0 1 32 24 Z" fill={p.b} />
            <path d="M16 24 A4 4 0 0 1 24 24 Z" fill={p.c} />
          </>
        );
      case "grade":
        return (
          <>
            <rect width="28" height="28" fill={p.base} />
            <path d="M0 0 H28 M0 0 V28" stroke={p.a} strokeWidth="1.4" />
            <path d="M14 0 V28 M0 14 H28" stroke={p.a} strokeWidth="0.5" opacity="0.7" />
            <rect x="-1.6" y="-1.6" width="3.2" height="3.2" fill={p.c} />
          </>
        );
      case "terrazzo":
        return (
          <>
            <rect width="48" height="48" fill={p.base} />
            <circle cx="9" cy="12" r="3.2" fill={p.b} />
            <rect x="26" y="6" width="7" height="4" rx="1.6" fill={p.a} transform="rotate(24 29 8)" />
            <polygon points="40,22 45,29 35,29" fill={p.c} opacity="0.8" />
            <circle cx="18" cy="34" r="2.2" fill={p.c} opacity="0.7" />
            <rect x="6" y="38" width="9" height="3.4" rx="1.7" fill={p.a} transform="rotate(-15 10 39)" />
            <circle cx="36" cy="43" r="3" fill={p.b} opacity="0.85" />
            <polygon points="22,17 27,22 20,24" fill={p.a} />
          </>
        );
      case "linha":
        return (
          <>
            <rect width="20" height="20" fill={p.base} />
            <path d="M-6 26 L26 -6" stroke={p.a} strokeWidth="5" />
            <path d="M-6 34 L34 -6" stroke={p.b} strokeWidth="1.6" />
            <path d="M-6 18 L18 -6" stroke={p.c} strokeWidth="0.8" opacity="0.6" />
          </>
        );
      case "onda":
        return (
          <>
            <rect width="48" height="20" fill={p.base} />
            <path d="M0 14 q12 -12 24 0 t24 0" fill="none" stroke={p.a} strokeWidth="3" />
            <path d="M0 7 q12 -12 24 0 t24 0" fill="none" stroke={p.b} strokeWidth="1.5" />
            <path d="M0 20 q12 -12 24 0 t24 0" fill="none" stroke={p.c} strokeWidth="0.8" opacity="0.55" />
          </>
        );
      case "ponto":
        return (
          <>
            <rect width="24" height="24" fill={p.base} />
            <circle cx="6" cy="6" r="3" fill={p.b} />
            <circle cx="18" cy="18" r="3" fill={p.a} />
            <circle cx="18" cy="6" r="1.2" fill={p.c} />
            <circle cx="6" cy="18" r="1.2" fill={p.c} />
          </>
        );
      case "raio":
        return (
          <>
            <rect width="44" height="44" fill={p.base} />
            <polygon points="0,44 0,0 11,0" fill={p.a} />
            <polygon points="0,44 16,0 24,0" fill={p.b} opacity="0.9" />
            <polygon points="0,44 30,0 36,0" fill={p.c} opacity="0.65" />
            <polygon points="0,44 41,0 44,0" fill={p.a} />
          </>
        );
      case "liso":
      default:
        return (
          <>
            <rect width="8" height="8" fill={p.base} />
            <path d="M0 0 V8" stroke={p.a} strokeWidth="0.6" opacity="0.5" />
            <path d="M4 0 V8" stroke={p.a} strokeWidth="0.3" opacity="0.3" />
          </>
        );
    }
  })();

  const tamanho: Record<PadraoNome, [number, number]> = {
    leque: [40, 40],
    losango: [32, 32],
    arco: [40, 24],
    grade: [28, 28],
    terrazzo: [48, 48],
    linha: [20, 20],
    onda: [48, 20],
    ponto: [24, 24],
    raio: [44, 44],
    liso: [8, 8],
  };
  const [w, h] = tamanho[padrao];

  return (
    <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
      {conteudo}
    </pattern>
  );
}

/** Amostra quadrada da estampa — usada em filtros, seletor de capa e painel. */
export function AmostraEstampa({
  padrao,
  paleta,
  className = "",
}: {
  padrao: PadraoNome;
  paleta: PaletaNome;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <DefEstampa padrao={padrao} paleta={paleta} />
      </defs>
      <rect width="48" height="48" rx="6" fill={`url(#${idEstampa(padrao, paleta)})`} />
      <rect
        width="48"
        height="48"
        rx="6"
        fill="none"
        stroke="#1c1b1a"
        strokeOpacity="0.12"
      />
    </svg>
  );
}
