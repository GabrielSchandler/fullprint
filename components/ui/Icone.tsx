/**
 * Conjunto de ícones — traço de 1.6, cantos redondos, sem preenchimento.
 * Um arquivo só, sem dependência externa: o protótipo abre em qualquer lugar.
 */

const CAMINHOS: Record<string, React.ReactNode> = {
  busca: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  sacola: (
    <>
      <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.6 20.5a7.4 7.4 0 0 1 14.8 0" />
    </>
  ),
  coracao: <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fechar: <path d="M6 6l12 12M18 6 6 18" />,
  mais: <path d="M12 5v14M5 12h14" />,
  menos: <path d="M5 12h14" />,
  seta: <path d="M5 12h14m-6-6 6 6-6 6" />,
  setaEsq: <path d="M19 12H5m6 6-6-6 6-6" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  chevronBaixo: <path d="m6 9 6 6 6-6" />,
  chevronCima: <path d="m6 15 6-6 6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  filtro: <path d="M4 6h16M7 12h10M10 18h4" />,
  grade: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </>
  ),
  caixa: (
    <>
      <path d="M21 8 12 3.5 3 8l9 4.5L21 8Z" />
      <path d="M3 8v8l9 4.5L21 16V8" />
      <path d="M12 12.5V21" />
    </>
  ),
  etiqueta: (
    <>
      <path d="M11 3h6a2 2 0 0 1 2 2v6a1 1 0 0 1-.3.7l-8 8a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.4l8-8A1 1 0 0 1 11 3Z" />
      <circle cx="15.5" cy="8.5" r="1.3" />
    </>
  ),
  grafico: <path d="M4 20V11M10 20V4M16 20v-6M22 20H2" />,
  pizza: (
    <>
      <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" />
      <path d="M14.5 3.4A9 9 0 0 1 20.6 9.5h-6.1V3.4Z" />
    </>
  ),
  carteira: (
    <>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3" />
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
      <circle cx="16.5" cy="13.5" r="1.3" />
    </>
  ),
  pessoas: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6.1M17.5 14.4A6 6 0 0 1 21 20" />
    </>
  ),
  cupom: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M9 6v12" strokeDasharray="2 2.4" />
    </>
  ),
  presente: (
    <>
      <rect x="3.5" y="8.5" width="17" height="12" rx="1.5" />
      <path d="M3.5 13h17M12 8.5V20.5" />
      <path d="M12 8.5S9.5 3.5 7.5 4.6 9 8.5 12 8.5Zm0 0s2.5-5 4.5-3.9S15 8.5 12 8.5Z" />
    </>
  ),
  engrenagem: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M18 6l-1.4 1.4M7.4 16.6 6 18M18 18l-1.4-1.4M7.4 7.4 6 6" />
    </>
  ),
  caminhao: (
    <>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 10h4l3 3v2.5h-7z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  raio: <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z" />,
  alerta: (
    <>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4.2M12 17.2v.6" />
    </>
  ),
  estrela: <path d="m12 4 2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8L12 4Z" />,
  relogio: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  papel: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  predio: (
    <>
      <path d="M4 21V6.5L12 3v18" />
      <path d="M12 10h7.5V21" />
      <path d="M7.5 8.5v.01M7.5 12v.01M7.5 15.5v.01M15.5 13.5v.01M15.5 17v.01" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.7a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.7Z" />
      <path d="M8.9 8.7c.3-.6.6-.6.9-.6h.6c.2 0 .4 0 .6.5l.7 1.7c0 .2 0 .4-.1.6l-.4.5c-.1.2-.3.4-.1.7a6 6 0 0 0 2.8 2.4c.3.1.5 0 .7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4a1.9 1.9 0 0 1-1.3 1.7 3.5 3.5 0 0 1-2-.1 10 10 0 0 1-5.5-5 3.6 3.6 0 0 1-.1-2.7Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  lixeira: (
    <>
      <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 13h9l1-13" />
      <path d="M10.5 11v5.5M13.5 11v5.5" />
    </>
  ),
  lapis: (
    <>
      <path d="m4 20 .8-3.6L16.4 4.8a2 2 0 0 1 2.8 2.8L7.6 19.2 4 20Z" />
      <path d="m14.8 6.4 2.8 2.8" />
    </>
  ),
  olho: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  baixar: <path d="M12 4v11m0 0 4-4m-4 4-4-4M4.5 19.5h15" />,
  sino: (
    <>
      <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  sair: (
    <>
      <path d="M10 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H10" />
      <path d="M15 8.5 19 12l-4 3.5M19 12H9" />
    </>
  ),
};

export type NomeIcone = keyof typeof CAMINHOS;

export function Icone({
  nome,
  className = "size-5",
  strokeWidth = 1.6,
}: {
  nome: NomeIcone | string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {CAMINHOS[nome] ?? CAMINHOS.papel}
    </svg>
  );
}

export function Estrelas({
  nota,
  className = "",
}: {
  nota: number;
  className?: string;
}) {
  const ESTRELA = "m12 4 2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8L12 4Z";
  const OURO = "#c9a500";

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`Nota ${nota} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        /* cheia · meia · vazia — meia estrela importa: 4,5 exibido como 4 vira nota errada */
        const cheia = nota >= i - 0.1;
        const meia = !cheia && nota >= i - 0.6;
        const idMeia = `meia-${i}`;
        return (
          <svg key={i} viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
            {meia && (
              <defs>
                <linearGradient id={idMeia}>
                  <stop offset="50%" stopColor={OURO} />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              d={ESTRELA}
              fill={cheia ? OURO : meia ? `url(#${idMeia})` : "none"}
              stroke={cheia || meia ? OURO : "#c5c1b9"}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}
