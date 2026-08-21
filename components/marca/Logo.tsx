/**
 * Marca Full Print — recriação em SVG do bico de pena + círculos CMYK.
 *
 * ⚠️ É recriação a partir do PNG do site atual, não do vetor original.
 * Pedir o .ai/.svg pro Marcel antes de qualquer material impresso.
 * Ver ../FullPrint/identidade/design-guide.md
 */

type Variante = "inline" | "empilhada" | "marca";

const TONS = {
  claro: { escuro: "#3a3a3c", medio: "#5f5f62", vazio: "#ffffff" },
  escuro: { escuro: "#f2f0ec", medio: "#a5a29d", vazio: "#141313" },
} as const;

export function MarcaNib({
  className = "",
  fundo = "claro",
  title,
}: {
  className?: string;
  fundo?: keyof typeof TONS;
  title?: string;
}) {
  const t = TONS[fundo];
  return (
    <svg
      viewBox="0 0 140 214"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* metade esquerda do bico */}
      <path
        d="M67 6 L67 174 L42 174 C31 159 13 129 16 103 C20 70 55 25 67 6 Z"
        fill={t.escuro}
      />
      {/* metade direita, mais clara */}
      <path
        d="M73 6 L73 174 L98 174 C109 159 127 129 124 103 C120 70 85 25 73 6 Z"
        fill={t.medio}
      />
      {/* cunha de luz — o vazio característico da direita do bico */}
      <path d="M76 174 L98 174 C104 166 110 156 114 146 Z" fill={t.vazio} />

      {/* círculos CMYK sobrepostos, com mistura subtrativa como tinta no papel */}
      <g style={{ mixBlendMode: "multiply" }}>
        <circle cx="70" cy="106" r="15" fill="#00a3d9" />
        <circle cx="79" cy="122" r="15" fill="#e6007e" />
        <circle cx="61" cy="122" r="15" fill="#ffd400" />
      </g>

      {/* colar e base */}
      <rect x="52" y="182" width="16" height="15" fill={t.escuro} />
      <rect x="72" y="182" width="16" height="15" fill={t.medio} />
      <rect x="38" y="201" width="30" height="5" rx="1.5" fill={t.escuro} />
      <rect x="72" y="201" width="30" height="5" rx="1.5" fill={t.medio} />
    </svg>
  );
}

export function Logo({
  variante = "inline",
  fundo = "claro",
  className = "",
  assinatura = false,
}: {
  variante?: Variante;
  fundo?: keyof typeof TONS;
  className?: string;
  assinatura?: boolean;
}) {
  const t = TONS[fundo];

  if (variante === "marca") {
    return <MarcaNib className={className} fundo={fundo} title="Full Print" />;
  }

  const wordmark = (
    <span className="leading-none">
      <span
        className="block font-sans font-extrabold tracking-[-0.03em]"
        style={{ color: t.escuro }}
      >
        FULL PRINT
      </span>
      {assinatura && (
        <span
          className="spec mt-1 block text-[0.5625rem] tracking-[0.3em]"
          style={{ color: fundo === "claro" ? "#8d887f" : "#8a8680" }}
        >
          Gráfica rápida
        </span>
      )}
    </span>
  );

  if (variante === "empilhada") {
    return (
      <span className={`inline-flex flex-col items-center gap-3 ${className}`}>
        <MarcaNib className="h-16 w-auto" fundo={fundo} title="Full Print" />
        <span className="text-center text-2xl">{wordmark}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <MarcaNib className="h-8 w-auto shrink-0" fundo={fundo} title="Full Print" />
      <span className="text-[1.0625rem]">{wordmark}</span>
    </span>
  );
}
