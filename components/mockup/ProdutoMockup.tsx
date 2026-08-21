import {
  DefEstampa,
  idEstampa,
  PALETAS,
  type PadraoNome,
  type PaletaNome,
} from "./estampas";

/**
 * Mockup de produto renderizado em SVG.
 *
 * Substitui foto de catálogo enquanto o Marcel não manda as imagens reais.
 * Cada formato carrega o acabamento que identifica o produto — lombada,
 * wire-o, elástico, borda de página, vinco de caixa.
 */

export const FORMATOS = [
  "caderno",
  "caderneta",
  "planner",
  "agenda",
  "bloco",
  "cartao",
  "caixa",
  "sacola",
  "adesivo",
  "postal",
  "envelope",
  "marcador",
] as const;
export type FormatoNome = (typeof FORMATOS)[number];

export const ROTULO_FORMATO: Record<FormatoNome, string> = {
  caderno: "Caderno",
  caderneta: "Caderneta",
  planner: "Planner wire-o",
  agenda: "Agenda",
  bloco: "Bloco",
  cartao: "Cartão",
  caixa: "Caixa-berço",
  sacola: "Sacola",
  adesivo: "Cartela de adesivo",
  postal: "Postal",
  envelope: "Envelope",
  marcador: "Marca-página",
};

function quebrar(texto: string, max = 14): string[] {
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let atual = "";
  for (const p of palavras) {
    if ((atual + " " + p).trim().length > max && atual) {
      linhas.push(atual.trim());
      atual = p;
    } else {
      atual = (atual + " " + p).trim();
    }
  }
  if (atual) linhas.push(atual);
  return linhas.slice(0, 2);
}

/** Placa de título aplicada na capa — hot stamping / serigrafia */
function Placa({
  x,
  y,
  w,
  h,
  titulo,
  cor,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  titulo: string;
  cor: string;
}) {
  const linhas = quebrar(titulo, w > 130 ? 15 : 12);
  const inicio = h / 2 - ((linhas.length - 1) * 15) / 2 + 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fdfbf7" opacity="0.94" />
      <rect
        x={x + 5}
        y={y + 5}
        width={w - 10}
        height={h - 10}
        fill="none"
        stroke={cor}
        strokeWidth="0.8"
        opacity="0.45"
      />
      {linhas.map((l, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + inicio + i * 15}
          textAnchor="middle"
          fill={cor}
          fontSize="11"
          letterSpacing="1.6"
          fontFamily="var(--font-mono)"
          fontWeight="500"
        >
          {l.toUpperCase()}
        </text>
      ))}
      <circle cx={x + w / 2} cy={y + h - 15} r="1.6" fill={cor} opacity="0.6" />
    </g>
  );
}

export function ProdutoMockup({
  formato,
  padrao,
  paleta,
  titulo = "",
  className = "",
}: {
  formato: FormatoNome;
  padrao: PadraoNome;
  paleta: PaletaNome;
  titulo?: string;
  className?: string;
}) {
  const p = PALETAS[paleta];
  const fill = `url(#${idEstampa(padrao, paleta)})`;
  const gid = `${formato}-${paleta}`;
  const luz = `url(#luz-${gid})`;

  const corpo = (() => {
    switch (formato) {
      /* ------------------------------------------------ caderno capa dura */
      case "caderno":
        return (
          <>
            <rect x="286" y="52" width="9" height="276" rx="1.5" fill="#f5f1e8" />
            <path d="M288 58 V322 M291 56 V324 M294 60 V320" stroke="#d9d3c6" strokeWidth="0.8" />
            <rect x="112" y="44" width="176" height="292" rx="5" fill={fill} />
            <rect x="112" y="44" width="20" height="292" rx="5" fill={p.c} opacity="0.88" />
            <rect x="130" y="44" width="2" height="292" fill="#fff" opacity="0.22" />
            <Placa x={148} y={148} w={118} h={84} titulo={titulo} cor={p.c} />
            <rect x="250" y="44" width="9" height="292" fill={p.c} opacity="0.55" />
            <rect x="250" y="44" width="2.5" height="292" fill="#fff" opacity="0.25" />
            <rect x="112" y="44" width="176" height="292" rx="5" fill={luz} />
          </>
        );

      /* -------------------------------------------------------- caderneta */
      case "caderneta":
        return (
          <>
            <rect x="278" y="88" width="8" height="216" rx="1.5" fill="#f5f1e8" />
            <rect x="126" y="82" width="152" height="228" rx="14" fill={fill} />
            <rect x="126" y="82" width="14" height="228" rx="7" fill={p.c} opacity="0.85" />
            <Placa x={158} y={158} w={104} h={72} titulo={titulo} cor={p.c} />
            <rect x="248" y="82" width="7" height="228" fill={p.c} opacity="0.5" />
            <rect x="126" y="82" width="152" height="228" rx="14" fill={luz} />
          </>
        );

      /* ---------------------------------------------------- planner wire-o */
      case "planner":
        return (
          <>
            <rect x="286" y="76" width="9" height="252" rx="1.5" fill="#f5f1e8" />
            <rect x="110" y="68" width="180" height="260" rx="4" fill={fill} />
            <Placa x={144} y={166} w={112} h={80} titulo={titulo} cor={p.c} />
            <rect x="110" y="68" width="180" height="260" rx="4" fill={luz} />
            {Array.from({ length: 11 }).map((_, i) => (
              <g key={i}>
                <rect
                  x={122 + i * 15.6}
                  y="50"
                  width="9"
                  height="30"
                  rx="4.5"
                  fill="none"
                  stroke="#a8a49c"
                  strokeWidth="3.2"
                />
                <rect
                  x={122 + i * 15.6}
                  y="50"
                  width="9"
                  height="30"
                  rx="4.5"
                  fill="none"
                  stroke="#e6e3dc"
                  strokeWidth="1"
                />
              </g>
            ))}
          </>
        );

      /* ------------------------------------------------------------ agenda */
      case "agenda":
        return (
          <>
            <rect x="284" y="50" width="10" height="272" rx="1.5" fill="#f5f1e8" />
            <path d="M287 56 V316 M290 54 V318" stroke="#d9d3c6" strokeWidth="0.8" />
            <path d="M186 320 h20 v52 l-10 -12 l-10 12 Z" fill={p.b} />
            <rect x="114" y="42" width="172" height="286" rx="6" fill={fill} />
            <rect x="114" y="42" width="16" height="286" rx="6" fill={p.c} opacity="0.88" />
            <Placa x={150} y={142} w={112} h={92} titulo={titulo} cor={p.c} />
            <rect x="114" y="42" width="172" height="286" rx="6" fill={luz} />
          </>
        );

      /* ------------------------------------------------------------- bloco */
      case "bloco":
        return (
          <>
            <rect x="124" y="78" width="164" height="248" rx="3" fill="#ece7dc" />
            <rect x="120" y="74" width="164" height="248" rx="3" fill="#f6f2e9" />
            <rect x="116" y="70" width="164" height="248" rx="3" fill="#fdfbf6" />
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M132 ${146 + i * 19} H264`} stroke="#ddd7c9" strokeWidth="1" />
            ))}
            <rect x="116" y="70" width="164" height="54" rx="3" fill={fill} />
            <text
              x="198"
              y="103"
              textAnchor="middle"
              fill="#fdfbf7"
              fontSize="11"
              letterSpacing="2"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              {quebrar(titulo, 18)[0]?.toUpperCase()}
            </text>
            <path d="M116 124 H280" stroke={p.c} strokeWidth="1" opacity="0.35" />
            <path d="M280 292 l-26 26 h26 Z" fill="#efe9dc" />
            <path d="M280 292 l-26 26" stroke="#d9d3c6" strokeWidth="1" />
          </>
        );

      /* -------------------------------------------------- cartão de visita */
      case "cartao":
        return (
          <>
            <g transform="rotate(-7 200 210)">
              <rect x="96" y="158" width="208" height="122" rx="5" fill="#f2ede2" />
            </g>
            <g transform="rotate(-3 200 205)">
              <rect x="100" y="152" width="208" height="122" rx="5" fill="#faf7f0" />
            </g>
            <g transform="rotate(3 200 200)">
              <rect x="98" y="142" width="208" height="122" rx="5" fill={fill} />
              <rect x="98" y="142" width="208" height="122" rx="5" fill={luz} />
              <rect x="122" y="176" width="160" height="54" fill="#fdfbf7" opacity="0.94" />
              <text
                x="202"
                y="200"
                textAnchor="middle"
                fill={p.c}
                fontSize="11"
                letterSpacing="2"
                fontFamily="var(--font-mono)"
                fontWeight="600"
              >
                {quebrar(titulo, 16)[0]?.toUpperCase()}
              </text>
              <path d="M170 210 H234" stroke={p.b} strokeWidth="1.4" />
              <text
                x="202"
                y="223"
                textAnchor="middle"
                fill="#8d887f"
                fontSize="7.5"
                letterSpacing="1.6"
                fontFamily="var(--font-mono)"
              >
                FULL PRINT
              </text>
            </g>
          </>
        );

      /* ------------------------------------------------------ caixa-berço */
      case "caixa":
        return (
          <>
            <polygon points="132,150 172,110 322,110 282,150" fill={p.a} opacity="0.55" />
            <polygon points="112,196 152,156 302,156 262,196" fill={fill} />
            <polygon points="112,196 152,156 302,156 262,196" fill="#fff" opacity="0.16" />
            <rect x="112" y="196" width="150" height="120" fill={fill} />
            <rect x="112" y="196" width="150" height="120" fill={luz} />
            <polygon points="262,196 302,156 302,276 262,316" fill={p.c} opacity="0.82" />
            <rect x="146" y="228" width="82" height="56" fill="#fdfbf7" opacity="0.95" />
            <text
              x="187"
              y="252"
              textAnchor="middle"
              fill={p.c}
              fontSize="9.5"
              letterSpacing="1.6"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              {quebrar(titulo, 13)[0]?.toUpperCase()}
            </text>
            <path d="M164 262 H210" stroke={p.b} strokeWidth="1.2" />
            <text
              x="187"
              y="274"
              textAnchor="middle"
              fill="#8d887f"
              fontSize="6.5"
              letterSpacing="1.4"
              fontFamily="var(--font-mono)"
            >
              FULL PRINT
            </text>
          </>
        );

      /* ------------------------------------------------------------ sacola */
      case "sacola":
        return (
          <>
            <path
              d="M158 138 C158 96 176 84 200 84 C224 84 242 96 242 138"
              fill="none"
              stroke={p.c}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />
            <polygon points="118,132 272,132 272,330 118,330" fill={fill} />
            <polygon points="118,132 272,132 272,330 118,330" fill={luz} />
            <polygon points="272,132 306,110 306,308 272,330" fill={p.c} opacity="0.78" />
            <polygon points="118,132 272,132 306,110 152,110" fill={p.a} />
            <path d="M118 158 H272" stroke={p.c} strokeWidth="1" opacity="0.28" />
            <rect x="150" y="196" width="90" height="70" fill="#fdfbf7" opacity="0.94" />
            <text
              x="195"
              y="228"
              textAnchor="middle"
              fill={p.c}
              fontSize="10"
              letterSpacing="1.8"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              {quebrar(titulo, 13)[0]?.toUpperCase()}
            </text>
            <path d="M172 240 H218" stroke={p.b} strokeWidth="1.2" />
          </>
        );

      /* ----------------------------------------------------------- adesivo */
      case "adesivo":
        return (
          <>
            <rect x="110" y="56" width="180" height="288" rx="4" fill="#fdfbf7" />
            <rect
              x="110"
              y="56"
              width="180"
              height="288"
              rx="4"
              fill="none"
              stroke="#e0dace"
              strokeWidth="1"
            />
            <circle cx="152" cy="104" r="26" fill={fill} stroke="#fff" strokeWidth="3" />
            <rect x="196" y="80" width="76" height="48" rx="8" fill={fill} stroke="#fff" strokeWidth="3" />
            <rect x="128" y="152" width="64" height="64" rx="10" fill={fill} stroke="#fff" strokeWidth="3" />
            <circle cx="238" cy="184" r="32" fill={fill} stroke="#fff" strokeWidth="3" />
            <polygon points="152,240 190,306 114,306" fill={fill} stroke="#fff" strokeWidth="3" />
            <rect x="200" y="240" width="72" height="66" rx="33" fill={fill} stroke="#fff" strokeWidth="3" />
            <text
              x="200"
              y="332"
              textAnchor="middle"
              fill="#8d887f"
              fontSize="7.5"
              letterSpacing="2"
              fontFamily="var(--font-mono)"
            >
              {quebrar(titulo, 24)[0]?.toUpperCase()}
            </text>
          </>
        );

      /* ------------------------------------------------------------ postal */
      case "postal":
        return (
          <>
            <g transform="rotate(-6 200 200)">
              <rect x="86" y="118" width="228" height="152" rx="3" fill="#fbf8f1" />
              <path d="M200 134 V254" stroke="#e0dace" strokeWidth="1" />
              <rect
                x="266"
                y="132"
                width="34"
                height="28"
                fill="none"
                stroke="#d9d3c6"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              {Array.from({ length: 4 }).map((_, i) => (
                <path key={i} d={`M214 ${190 + i * 16} H302`} stroke="#e0dace" strokeWidth="1" />
              ))}
            </g>
            <g transform="rotate(4 200 214)">
              <rect x="92" y="146" width="228" height="152" rx="3" fill={fill} />
              <rect x="92" y="146" width="228" height="152" rx="3" fill={luz} />
              <rect x="128" y="192" width="156" height="60" fill="#fdfbf7" opacity="0.94" />
              <text
                x="206"
                y="218"
                textAnchor="middle"
                fill={p.c}
                fontSize="11"
                letterSpacing="2"
                fontFamily="var(--font-mono)"
                fontWeight="500"
              >
                {quebrar(titulo, 16)[0]?.toUpperCase()}
              </text>
              <path d="M174 230 H238" stroke={p.b} strokeWidth="1.4" />
              <text
                x="206"
                y="244"
                textAnchor="middle"
                fill="#8d887f"
                fontSize="7"
                letterSpacing="1.6"
                fontFamily="var(--font-mono)"
              >
                POSTAL · FULL PRINT
              </text>
            </g>
          </>
        );

      /* ---------------------------------------------------------- envelope */
      case "envelope":
        return (
          <>
            <polygon points="90,182 200,72 310,182" fill={fill} />
            <polygon points="90,182 200,72 310,182" fill={luz} />
            <polygon points="90,182 200,72 310,182" fill="none" stroke={p.c} strokeWidth="1" opacity="0.3" />
            <rect x="90" y="182" width="220" height="146" rx="3" fill="#fbf8f1" />
            <path d="M90 182 L200 268 L310 182" fill="none" stroke="#e0dace" strokeWidth="1.2" />
            <path d="M90 328 L166 240 M310 328 L234 240" stroke="#efe9dc" strokeWidth="1.2" />
            <rect x="252" y="196" width="40" height="32" fill={p.b} opacity="0.9" />
            <rect
              x="256"
              y="200"
              width="32"
              height="24"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <text
              x="118"
              y="300"
              fill="#8d887f"
              fontSize="8"
              letterSpacing="1.8"
              fontFamily="var(--font-mono)"
            >
              {quebrar(titulo, 20)[0]?.toUpperCase()}
            </text>
          </>
        );

      /* ------------------------------------------------------ marca-página */
      case "marcador":
        return (
          <>
            <path d="M200 46 q-12 16 -6 34" fill="none" stroke={p.c} strokeWidth="2" />
            <circle cx="194" cy="82" r="5" fill={p.b} />
            <g transform="rotate(-4 200 210)">
              <path d="M158 70 h84 v250 l-42 -26 l-42 26 Z" fill={fill} />
              <path d="M158 70 h84 v250 l-42 -26 l-42 26 Z" fill={luz} />
              <circle cx="200" cy="86" r="6" fill="#fdfbf7" />
              <rect x="170" y="152" width="60" height="96" fill="#fdfbf7" opacity="0.94" />
              <text
                x="200"
                y="204"
                textAnchor="middle"
                fill={p.c}
                fontSize="10"
                letterSpacing="2"
                fontFamily="var(--font-mono)"
                fontWeight="500"
                transform="rotate(-90 200 204)"
              >
                {quebrar(titulo, 16)[0]?.toUpperCase()}
              </text>
            </g>
          </>
        );

      default:
        return <rect x="120" y="90" width="160" height="220" rx="6" fill={fill} />;
    }
  })();

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={titulo}>
      <defs>
        <DefEstampa padrao={padrao} paleta={paleta} />
        <linearGradient id={`luz-${gid}`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.26" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1c1b1a" stopOpacity="0.1" />
        </linearGradient>
        <filter id="sombra-chao" x="-30%" y="-60%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <ellipse
        cx="204"
        cy="348"
        rx="104"
        ry="12"
        fill="#1c1b1a"
        opacity="0.16"
        filter="url(#sombra-chao)"
      />
      {corpo}
    </svg>
  );
}
