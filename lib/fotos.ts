/**
 * Fotos do protótipo — geradas por scripts/fotos.mjs, não editar na mão.
 *
 * ⚠️ Banco de imagem (Pexels). Servem para a apresentação; a versão final
 * precisa de foto do material impresso pela própria Full Print.
 */

export type Foto = {
  src: string;
  alt: string;
  /** página da foto no Pexels — de lá sai o crédito, se um dia for exibir */
  fonte: string;
};

export const FOTOS = {
  hero: {
    src: "/fotos/hero.jpg",
    alt: "Cadernos de capa kraft e papel quadriculado sobre superfície clara",
    fonte: "https://www.pexels.com/photo/8250905/",
  },
  impressos: {
    src: "/fotos/impressos.jpg",
    alt: "Pilhas de impressos tipográficos empilhadas em estúdio",
    fonte: "https://www.pexels.com/photo/10897656/",
  },
  acabamento: {
    src: "/fotos/acabamento.jpg",
    alt: "Mãos conferindo uma pilha de folhas recém-impressas",
    fonte: "https://www.pexels.com/photo/6620970/",
  },
  tinta: {
    src: "/fotos/tinta.jpg",
    alt: "Mão aplicando tinta no rolo de uma impressora",
    fonte: "https://www.pexels.com/photo/6620997/",
  },
  papelaria: {
    src: "/fotos/papelaria.jpg",
    alt: "Envelopes e cartões de papel kraft dispostos sobre fundo claro",
    fonte: "https://www.pexels.com/photo/8250900/",
  },
  embalagem: {
    src: "/fotos/embalagem.jpg",
    alt: "Pacote embrulhado em papel kraft e amarrado com barbante",
    fonte: "https://www.pexels.com/photo/19363687/",
  },
  b2b: {
    src: "/fotos/b2b.jpg",
    alt: "Caixas de papelão empilhadas com marca aplicada",
    fonte: "https://www.pexels.com/photo/31438304/",
  },
  kraft: {
    src: "/fotos/kraft.jpg",
    alt: "Detalhe da textura de uma caixa de papel kraft",
    fonte: "https://www.pexels.com/photo/17260157/",
  },
} satisfies Record<string, Foto>;

export type NomeFoto = keyof typeof FOTOS;

/** Links das fotos, para montar o crédito se a versão final mantiver banco de imagem. */
export const FONTES = Object.values(FOTOS).map((f) => f.fonte);
