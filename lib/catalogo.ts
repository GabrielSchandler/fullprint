import type { FormatoNome } from "@/components/mockup/ProdutoMockup";
import type { PadraoNome, PaletaNome } from "@/components/mockup/estampas";
import { entre, semente } from "./format";
import { GALERIA_PRODUTO } from "./fotos-produtos";

/**
 * Catálogo do protótipo.
 *
 * ⚠️ Preço, prazo, gramatura e estoque são FICTÍCIOS. Nada aqui foi
 * confirmado com o Marcel — ver ../FullPrint/_memoria/estrategia.md.
 * Números de venda, avaliação e estoque são derivados do SKU por PRNG
 * determinístico: variam entre produtos, mas nunca entre renderizações
 * (servidor e cliente batem, sem erro de hidratação).
 */

export type CategoriaId =
  | "cadernos"
  | "cadernetas"
  | "planners"
  | "blocos"
  | "cartoes"
  | "adesivos"
  | "embalagens"
  | "acessorios";

export type ColecaoId = "geometria" | "kraft" | "noturno" | "botanica" | "tipografia";

export type Categoria = {
  id: CategoriaId;
  nome: string;
  resumo: string;
  sub: string[];
};

export const CATEGORIAS: Categoria[] = [
  {
    id: "cadernos",
    nome: "Cadernos",
    resumo: "Capa dura, costura aparente e miolo 90g. O carro-chefe da casa.",
    sub: ["Capa dura", "Costurado", "Espiral", "Refil"],
  },
  {
    id: "cadernetas",
    nome: "Cadernetas",
    resumo: "Formato de bolso, elástico e canto redondo. Para andar junto.",
    sub: ["Bolso", "Média", "Kit"],
  },
  {
    id: "planners",
    nome: "Planners & Agendas",
    resumo: "Wire-o, datado e permanente. Planejamento que dura o ano.",
    sub: ["Planner 2027", "Agenda diária", "Agenda semanal", "Permanente"],
  },
  {
    id: "blocos",
    nome: "Blocos & Papéis",
    resumo: "Bloco colado, pauta e papel de carta. Papel para o dia a dia.",
    sub: ["Bloco de tarefas", "Bloco de notas", "Papel de carta"],
  },
  {
    id: "cartoes",
    nome: "Cartões & Postais",
    resumo: "Papel especial, corte reto e acabamento fino.",
    sub: ["Cartão de visita", "Postal", "Convite"],
  },
  {
    id: "adesivos",
    nome: "Adesivos",
    resumo: "Cartela kiss-cut, recorte especial e vinil resistente.",
    sub: ["Cartela", "Recorte especial", "Vinil"],
  },
  {
    id: "embalagens",
    nome: "Embalagens",
    resumo: "Caixa-berço, sacola e envelope forrado. A primeira impressão.",
    sub: ["Caixa-berço", "Sacola", "Envelope"],
  },
  {
    id: "acessorios",
    nome: "Acessórios",
    resumo: "Marca-página, kits e o que completa a mesa.",
    sub: ["Marca-página", "Kit"],
  },
];

export const COLECOES: { id: ColecaoId; nome: string; resumo: string }[] = [
  {
    id: "geometria",
    nome: "Geometria",
    resumo:
      "Leque art déco, losango e arco. Repetição rigorosa impressa em offset, sem sobra de registro.",
  },
  {
    id: "kraft",
    nome: "Kraft & Cru",
    resumo:
      "Papel sem branqueamento, textura à vista e tinta única. O oposto do brilho.",
  },
  {
    id: "noturno",
    nome: "Noturno",
    resumo: "Azul profundo, grafite e um corte de cor. Para quem escreve tarde.",
  },
  {
    id: "botanica",
    nome: "Botânica",
    resumo: "Verde mata, menta e terracota. Padrão orgânico sobre papel natural.",
  },
  {
    id: "tipografia",
    nome: "Tipografia",
    resumo: "Sem estampa. Só papel, filete e hot stamping. A coleção mais sóbria.",
  },
];

export type Produto = {
  sku: string;
  slug: string;
  nome: string;
  categoria: CategoriaId;
  sub: string;
  colecao: ColecaoId;
  preco: number;
  precoDe?: number;
  formato: FormatoNome;
  padrao: PadraoNome;
  paleta: PaletaNome;
  resumo: string;
  descricao: string;
  specs: [string, string][];
  variacao?: { rotulo: string; opcoes: string[] };
  b2b: boolean;
  novo?: boolean;
  destaque?: boolean;
  /* derivados */
  /** foto de banco da categoria — ver scripts/fotos-produtos.mjs */
  foto: string;
  custo: number;
  estoque: number;
  estoqueMin: number;
  vendas30d: number;
  avaliacao: number;
  qtdAvaliacoes: number;
};

type Base = Omit<
  Produto,
  | "slug"
  | "foto"
  | "custo"
  | "estoque"
  | "estoqueMin"
  | "vendas30d"
  | "avaliacao"
  | "qtdAvaliacoes"
>;

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const BASE: Base[] = [
  /* ------------------------------------------------------------ cadernos */
  {
    sku: "FP-CAD-001",
    nome: "Caderno Bauhaus",
    categoria: "cadernos",
    sub: "Capa dura",
    colecao: "geometria",
    preco: 149.9,
    formato: "caderno",
    padrao: "leque",
    paleta: "oceano",
    b2b: true,
    destaque: true,
    resumo: "Capa dura cartonada, costura aparente e miolo pólen soft 90g.",
    descricao:
      "A capa é impressa em offset sobre papel de revestimento e cartonada à mão. A lombada é reta, com costura aparente em linha encerada — abre a 180° e fica aberto sozinho na mesa. Miolo em pólen soft 90g, que não deixa a caneta traspassar.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Miolo", "192 páginas · pólen soft 90g"],
      ["Capa", "Cartonada 2,5 mm · revestimento offset 4/0"],
      ["Costura", "Aparente, linha encerada"],
      ["Acabamento", "Elástico, marcador de fita, bolso interno"],
    ],
    variacao: { rotulo: "Miolo", opcoes: ["Pautado", "Pontilhado", "Liso"] },
  },
  {
    sku: "FP-CAD-002",
    nome: "Caderno Ateliê",
    categoria: "cadernos",
    sub: "Capa dura",
    colecao: "botanica",
    preco: 149.9,
    precoDe: 179.9,
    formato: "caderno",
    padrao: "terrazzo",
    paleta: "terracota",
    b2b: true,
    destaque: true,
    resumo: "Capa cartonada com laminação fosca aveludada e miolo pontilhado.",
    descricao:
      "Impressão em chapa cheia, sem retícula visível no acabamento. A capa leva laminação fosca com toque aveludado e resiste à mochila. Miolo pontilhado 5 mm, o preferido de quem faz bullet journal.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Miolo", "192 páginas · pólen soft 90g · pontilhado 5 mm"],
      ["Capa", "Cartonada 2,5 mm · laminação fosca"],
      ["Costura", "Aparente"],
      ["Acabamento", "Elástico, marcador de fita"],
    ],
    variacao: { rotulo: "Miolo", opcoes: ["Pontilhado", "Pautado", "Liso"] },
  },
  {
    sku: "FP-CAD-003",
    nome: "Caderno Grafite",
    categoria: "cadernos",
    sub: "Capa dura",
    colecao: "tipografia",
    preco: 139.9,
    formato: "caderno",
    padrao: "linha",
    paleta: "grafite",
    b2b: true,
    resumo: "Uma cor só, papel cinza e hot stamping fosco no título.",
    descricao:
      "Uma cor só, papel cinza claro e hot stamping preto fosco no título. Foi desenhado para a mesa de escritório — sóbrio o bastante para reunião, bonito o bastante para não parecer material de brinde.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Miolo", "160 páginas · offset 90g · pautado"],
      ["Capa", "Cartonada · impressão 1/0 + hot stamping fosco"],
      ["Costura", "Aparente"],
      ["Acabamento", "Elástico"],
    ],
  },
  {
    sku: "FP-CAD-004",
    nome: "Caderno Meia-Noite",
    categoria: "cadernos",
    sub: "Capa dura",
    colecao: "noturno",
    preco: 159.9,
    formato: "caderno",
    padrao: "raio",
    paleta: "noite",
    b2b: true,
    novo: true,
    destaque: true,
    resumo: "Capa escura com filete metalizado e miolo liso 120g.",
    descricao:
      "Capa em azul-noite com filete metalizado aplicado a quente. O miolo é liso, papel 120g — grosso o suficiente para nanquim e aquarela leve.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Miolo", "128 páginas · offset 120g · liso"],
      ["Capa", "Cartonada · 4/0 + hot stamping prata"],
      ["Costura", "Aparente"],
      ["Acabamento", "Elástico, marcador de fita, corte pintado"],
    ],
  },
  {
    sku: "FP-CAD-005",
    nome: "Caderno Kraft Cru",
    categoria: "cadernos",
    sub: "Costurado",
    colecao: "kraft",
    preco: 89.9,
    formato: "caderno",
    padrao: "liso",
    paleta: "kraft",
    b2b: true,
    resumo: "Capa kraft sem branqueamento, costura à vista.",
    descricao:
      "Cartão kraft 300g puro, sem revestimento e sem branqueamento óptico. A tipografia é aplicada em serigrafia de uma cor. Capa flexível, costura aparente e miolo reciclado — pesa pouco e envelhece bem.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Miolo", "144 páginas · reciclato 90g"],
      ["Capa", "Kraft 300g · serigrafia 1 cor"],
      ["Costura", "Aparente, linha crua"],
      ["Origem", "Papel de fibra reciclada"],
    ],
  },
  {
    sku: "FP-CAD-006",
    nome: "Caderno Pauta Larga",
    categoria: "cadernos",
    sub: "Espiral",
    colecao: "botanica",
    preco: 79.9,
    formato: "caderno",
    padrao: "grade",
    paleta: "menta",
    b2b: false,
    resumo: "Espiral preto, pauta larga e capa em polipropileno.",
    descricao:
      "Feito para uso pesado: capa e contracapa em polipropileno rígido, espiral preto e picote nas folhas. A pauta larga de 8 mm dá espaço para letra grande e anotação rápida.",
    specs: [
      ["Formato", "17 × 24 cm"],
      ["Miolo", "160 folhas · offset 75g · pauta 8 mm"],
      ["Capa", "Polipropileno 0,6 mm"],
      ["Encadernação", "Espiral preto"],
      ["Extras", "Picote e furação 2 furos"],
    ],
  },
  {
    sku: "FP-CAD-007",
    nome: "Caderno Sketch A5",
    categoria: "cadernos",
    sub: "Costurado",
    colecao: "kraft",
    preco: 99.9,
    formato: "caderno",
    padrao: "ponto",
    paleta: "areia",
    b2b: false,
    resumo: "Miolo liso 150g para grafite, nanquim e marcador.",
    descricao:
      "Papel de 150g com leve granulação, o único do catálogo que aguenta marcador à base de álcool sem sombra do outro lado. Capa flexível com dobra reforçada e costura aparente.",
    specs: [
      ["Formato", "A5 · 14,8 × 21 cm"],
      ["Miolo", "96 páginas · 150g · liso granulado"],
      ["Capa", "Cartão 300g flexível"],
      ["Costura", "Aparente"],
      ["Indicado para", "Grafite, nanquim, marcador"],
    ],
  },
  {
    sku: "FP-CAD-008",
    nome: "Refil Caderno Argolado",
    categoria: "cadernos",
    sub: "Refil",
    colecao: "tipografia",
    preco: 44.9,
    formato: "bloco",
    padrao: "liso",
    paleta: "areia",
    b2b: false,
    resumo: "Reposição furada, compatível com a linha argolada.",
    descricao:
      "Bloco de reposição com furação padrão de 6 furos, papel pólen soft 90g e picote. Vem em três pautas para trocar conforme o uso do caderno muda ao longo do ano.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Conteúdo", "80 folhas · pólen soft 90g"],
      ["Furação", "6 furos padrão"],
      ["Extras", "Picote"],
    ],
    variacao: { rotulo: "Pauta", opcoes: ["Pautado", "Pontilhado", "Liso"] },
  },

  /* ---------------------------------------------------------- cadernetas */
  {
    sku: "FP-CDN-001",
    nome: "Caderneta de Bolso Deco",
    categoria: "cadernetas",
    sub: "Bolso",
    colecao: "geometria",
    preco: 49.9,
    formato: "caderneta",
    padrao: "losango",
    paleta: "vinho",
    b2b: true,
    resumo: "9 × 13 cm, canto redondo e elástico.",
    descricao:
      "Cabe no bolso de trás e no bolso interno do casaco. Canto redondo cortado em faca própria, elástico na mesma cor da capa e miolo pautado fino de 6 mm.",
    specs: [
      ["Formato", "9 × 13 cm"],
      ["Miolo", "96 páginas · pólen soft 80g · pauta 6 mm"],
      ["Capa", "Cartonada · canto redondo"],
      ["Acabamento", "Elástico, bolso interno"],
    ],
  },
  {
    sku: "FP-CDN-002",
    nome: "Caderneta Ondas",
    categoria: "cadernetas",
    sub: "Média",
    colecao: "geometria",
    preco: 54.9,
    formato: "caderneta",
    padrao: "onda",
    paleta: "oceano",
    b2b: true,
    resumo: "Impressão que corre da capa para a contracapa sem quebrar no vinco.",
    descricao:
      "A impressão corre da capa para a contracapa sem quebrar no vinco — registro fechado, coisa que só sai bem em máquina calibrada. Miolo pontilhado.",
    specs: [
      ["Formato", "11,5 × 16 cm"],
      ["Miolo", "112 páginas · pólen soft 80g · pontilhado"],
      ["Capa", "Cartonada · 4/0"],
      ["Acabamento", "Elástico, marcador de fita"],
    ],
  },
  {
    sku: "FP-CDN-003",
    nome: "Caderneta Pontilhada",
    categoria: "cadernetas",
    sub: "Média",
    colecao: "botanica",
    preco: 54.9,
    formato: "caderneta",
    padrao: "ponto",
    paleta: "mata",
    b2b: false,
    resumo: "Verde mata, ponto seco e miolo 5 mm.",
    descricao:
      "Capa em verde mata com pontos aplicados em relevo seco — sem tinta, só pressão. Miolo pontilhado 5 mm e numeração de página impressa, para índice.",
    specs: [
      ["Formato", "11,5 × 16 cm"],
      ["Miolo", "112 páginas · pontilhado 5 mm · páginas numeradas"],
      ["Capa", "Cartonada · relevo seco"],
      ["Acabamento", "Elástico"],
    ],
  },
  {
    sku: "FP-CDN-004",
    nome: "Kit 3 Cadernetas",
    categoria: "cadernetas",
    sub: "Kit",
    colecao: "geometria",
    preco: 129.9,
    precoDe: 149.7,
    formato: "caderneta",
    padrao: "arco",
    paleta: "mostarda",
    b2b: true,
    destaque: true,
    resumo: "Três cadernetas grampeadas, três pautas.",
    descricao:
      "Trio no formato 9 × 13 cm com capa flexível grampeada: uma pautada, uma pontilhada e uma lisa. Sai mais barato que comprar as três separadas e vem em cinta de papel kraft.",
    specs: [
      ["Formato", "9 × 13 cm · 3 unidades"],
      ["Miolo", "48 páginas cada · offset 90g"],
      ["Capa", "Cartão 250g flexível · grampo canoa"],
      ["Embalagem", "Cinta kraft"],
    ],
  },
  {
    sku: "FP-CDN-005",
    nome: "Caderneta Terrazzo",
    categoria: "cadernetas",
    sub: "Média",
    colecao: "geometria",
    preco: 59.9,
    formato: "caderneta",
    padrao: "terrazzo",
    paleta: "magenta",
    b2b: false,
    novo: true,
    resumo: "Corte do miolo pintado na cor da capa. Miolo liso 90g.",
    descricao:
      "O corte do miolo é pintado na mesma cor da capa — acabamento que fecha o objeto quando ele está parado na mesa. Miolo liso 90g.",
    specs: [
      ["Formato", "11,5 × 16 cm"],
      ["Miolo", "112 páginas · 90g · liso"],
      ["Capa", "Cartonada · 4/0"],
      ["Acabamento", "Corte pintado, elástico"],
    ],
  },

  /* ------------------------------------------------------------ planners */
  {
    sku: "FP-PLN-001",
    nome: "Planner Anual 2027",
    categoria: "planners",
    sub: "Planner 2027",
    colecao: "geometria",
    preco: 219.9,
    formato: "planner",
    padrao: "leque",
    paleta: "ciano",
    b2b: true,
    destaque: true,
    novo: true,
    resumo: "Wire-o preto, 12 meses e visão anual desdobrável.",
    descricao:
      "Doze meses datados, cada um abrindo com uma página de metas e fechando com uma de revisão. A visão anual é uma folha desdobrável de 42 cm que cabe o ano inteiro em uma tela só. Wire-o preto duplo, que deixa o planner virar 360°.",
    specs: [
      ["Formato", "17 × 24 cm"],
      ["Miolo", "224 páginas · offset 90g"],
      ["Encadernação", "Wire-o duplo preto"],
      ["Extras", "Página anual desdobrável 42 cm, adesivos, régua-marcador"],
      ["Período", "Janeiro a dezembro de 2027"],
    ],
    variacao: { rotulo: "Capa", opcoes: ["Ciano", "Terracota", "Grafite"] },
  },
  {
    sku: "FP-PLN-002",
    nome: "Planner Semanal Wire-o",
    categoria: "planners",
    sub: "Planner 2027",
    colecao: "botanica",
    preco: 189.9,
    formato: "planner",
    padrao: "arco",
    paleta: "menta",
    b2b: true,
    resumo: "Uma semana por abertura, com coluna de anotação.",
    descricao:
      "A semana inteira em uma abertura, com sete colunas de dia e uma oitava livre para o que não tem dia certo. Papel 90g, que aguarela leve não atravessa.",
    specs: [
      ["Formato", "17 × 24 cm"],
      ["Miolo", "160 páginas · offset 90g"],
      ["Encadernação", "Wire-o duplo"],
      ["Layout", "Semanal horizontal + coluna livre"],
      ["Período", "Janeiro a dezembro de 2027"],
    ],
  },
  {
    sku: "FP-PLN-003",
    nome: "Planner Financeiro",
    categoria: "planners",
    sub: "Permanente",
    colecao: "tipografia",
    preco: 179.9,
    formato: "planner",
    padrao: "grade",
    paleta: "carvao",
    b2b: true,
    resumo: "Sem data. Orçamento, contas e fechamento mensal.",
    descricao:
      "Não é datado, então começa em qualquer mês. Traz doze blocos de orçamento, controle de contas fixas, registro de gastos por categoria e uma página de fechamento com espaço para o saldo do mês.",
    specs: [
      ["Formato", "17 × 24 cm"],
      ["Miolo", "144 páginas · offset 90g"],
      ["Encadernação", "Wire-o duplo"],
      ["Layout", "12 ciclos mensais · sem data"],
    ],
  },
  {
    sku: "FP-PLN-004",
    nome: "Agenda Diária 2027",
    categoria: "planners",
    sub: "Agenda diária",
    colecao: "geometria",
    preco: 199.9,
    formato: "agenda",
    padrao: "losango",
    paleta: "vinho",
    b2b: true,
    destaque: true,
    resumo: "Uma página por dia, capa cartonada e fita marcadora.",
    descricao:
      "Uma página cheia por dia útil, sábado e domingo dividindo uma. Capa cartonada com losangos impressos em quatro cores, elástico e duas fitas marcadoras de cor diferente.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Miolo", "400 páginas · pólen soft 70g"],
      ["Capa", "Cartonada · 4/0 · laminação fosca"],
      ["Acabamento", "Elástico, 2 fitas, bolso interno"],
      ["Período", "Janeiro a dezembro de 2027"],
    ],
  },
  {
    sku: "FP-PLN-005",
    nome: "Agenda Semanal Office",
    categoria: "planners",
    sub: "Agenda semanal",
    colecao: "noturno",
    preco: 169.9,
    formato: "agenda",
    padrao: "linha",
    paleta: "noite",
    b2b: true,
    resumo: "Formato de reunião: semana à esquerda, pauta à direita.",
    descricao:
      "Feita para quem sai de reunião em reunião. À esquerda, a semana com horário marcado de 7h às 20h; à direita, uma página pautada inteira para a ata. Capa azul-noite com listra fina.",
    specs: [
      ["Formato", "17 × 24 cm"],
      ["Miolo", "160 páginas · offset 90g"],
      ["Capa", "Cartonada · 2/0"],
      ["Layout", "Semanal com grade de horário + pauta"],
      ["Período", "Janeiro a dezembro de 2027"],
    ],
  },
  {
    sku: "FP-PLN-006",
    nome: "Planner Permanente",
    categoria: "planners",
    sub: "Permanente",
    colecao: "kraft",
    preco: 149.9,
    formato: "planner",
    padrao: "liso",
    paleta: "kraft",
    b2b: false,
    resumo: "Kraft, sem data, para começar em qualquer semana.",
    descricao:
      "Capa kraft 300g com serigrafia de uma cor e miolo sem data — as semanas vêm em branco para você preencher. Some a culpa de comprar planner em julho.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Miolo", "128 páginas · reciclato 90g · sem data"],
      ["Capa", "Kraft 300g · serigrafia 1 cor"],
      ["Encadernação", "Wire-o preto"],
    ],
  },
  {
    sku: "FP-PLN-007",
    nome: "Agenda Compacta 2027",
    categoria: "planners",
    sub: "Agenda semanal",
    colecao: "botanica",
    preco: 139.9,
    precoDe: 159.9,
    formato: "agenda",
    padrao: "ponto",
    paleta: "terracota",
    b2b: false,
    resumo: "Semanal em formato pequeno, para bolsa.",
    descricao:
      "A menor agenda datada do catálogo. Semanal vertical, capa cartonada com pontos em terracota e elástico. Pesa 180 g, some dentro da bolsa.",
    specs: [
      ["Formato", "11,5 × 16 cm"],
      ["Miolo", "144 páginas · pólen soft 70g"],
      ["Capa", "Cartonada · 4/0"],
      ["Acabamento", "Elástico, fita"],
      ["Período", "Janeiro a dezembro de 2027"],
    ],
  },

  /* -------------------------------------------------------------- blocos */
  {
    sku: "FP-BLC-001",
    nome: "Bloco de Tarefas Diário",
    categoria: "blocos",
    sub: "Bloco de tarefas",
    colecao: "geometria",
    preco: 39.9,
    formato: "bloco",
    padrao: "leque",
    paleta: "mostarda",
    b2b: true,
    destaque: true,
    resumo: "50 folhas destacáveis com as três prioridades do dia.",
    descricao:
      "Cada folha começa com três linhas de prioridade e desce para a lista solta. Cola na cabeça, destaca folha a folha e cabe ao lado do teclado sem competir com o monitor.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Conteúdo", "50 folhas destacáveis · offset 90g"],
      ["Acabamento", "Colado na cabeça · base cartonada"],
    ],
  },
  {
    sku: "FP-BLC-002",
    nome: "Bloco de Notas A6",
    categoria: "blocos",
    sub: "Bloco de notas",
    colecao: "geometria",
    preco: 29.9,
    formato: "bloco",
    padrao: "ponto",
    paleta: "ciano",
    b2b: true,
    resumo: "Bloco pequeno de recado, 80 folhas.",
    descricao:
      "O bloco de recado que fica no balcão. Formato A6, 80 folhas coladas e base rígida para escrever em pé.",
    specs: [
      ["Formato", "A6 · 10,5 × 14,8 cm"],
      ["Conteúdo", "80 folhas · offset 75g"],
      ["Acabamento", "Colado na cabeça · base cartonada"],
    ],
  },
  {
    sku: "FP-BLC-003",
    nome: "Bloco Quadriculado",
    categoria: "blocos",
    sub: "Bloco de notas",
    colecao: "tipografia",
    preco: 34.9,
    formato: "bloco",
    padrao: "grade",
    paleta: "oceano",
    b2b: false,
    resumo: "Quadrícula 5 mm, para cálculo e diagrama.",
    descricao:
      "Quadrícula de 5 mm impressa em azul claro — aparece o suficiente para guiar e some o suficiente para não competir com a caneta. Bom para esboço técnico e fluxograma.",
    specs: [
      ["Formato", "14 × 21 cm"],
      ["Conteúdo", "60 folhas · offset 90g · quadrícula 5 mm"],
      ["Acabamento", "Colado na cabeça"],
    ],
  },
  {
    sku: "FP-BLC-004",
    nome: "Papel de Carta Deco",
    categoria: "blocos",
    sub: "Papel de carta",
    colecao: "geometria",
    preco: 44.9,
    formato: "bloco",
    padrao: "arco",
    paleta: "areia",
    b2b: false,
    resumo: "Kit com 20 folhas e 10 envelopes combinando.",
    descricao:
      "Vinte folhas com arco impresso no rodapé e dez envelopes com o mesmo padrão no forro. Papel 120g, encorpado o suficiente para caneta tinteiro.",
    specs: [
      ["Formato", "A5 · 14,8 × 21 cm"],
      ["Conteúdo", "20 folhas + 10 envelopes"],
      ["Papel", "Offset 120g"],
      ["Embalagem", "Cinta kraft"],
    ],
  },
  {
    sku: "FP-BLC-005",
    nome: "Bloco Reunião A4",
    categoria: "blocos",
    sub: "Bloco de tarefas",
    colecao: "tipografia",
    preco: 49.9,
    formato: "bloco",
    padrao: "linha",
    paleta: "grafite",
    b2b: true,
    resumo: "A4 com campo de pauta, decisões e próximos passos.",
    descricao:
      "Formato A4 dividido em três faixas: pauta, decisões e próximos passos com responsável e data. É o bloco que a gráfica mais vende para empresa — costuma sair personalizado com a marca do cliente.",
    specs: [
      ["Formato", "A4 · 21 × 29,7 cm"],
      ["Conteúdo", "50 folhas · offset 90g"],
      ["Acabamento", "Colado na cabeça · base cartonada"],
    ],
  },

  /* ------------------------------------------------------------- cartões */
  {
    sku: "FP-CRT-001",
    nome: "Cartão de Visita Algodão",
    categoria: "cartoes",
    sub: "Cartão de visita",
    colecao: "tipografia",
    preco: 189.9,
    formato: "cartao",
    padrao: "liso",
    paleta: "areia",
    b2b: true,
    destaque: true,
    resumo: "100 unidades em papel algodão 600g com relevo.",
    descricao:
      "Papel de algodão puro, 600 g, com o texto aplicado em baixo-relevo (letterpress). É o cartão que se sente antes de se ler. Corte reto, sem laminação — o papel fica exposto de propósito.",
    specs: [
      ["Formato", "9 × 5 cm"],
      ["Tiragem", "100 unidades"],
      ["Papel", "Algodão 600g"],
      ["Impressão", "Letterpress · até 2 cores"],
      ["Prazo", "7 dias úteis"],
    ],
    variacao: { rotulo: "Tiragem", opcoes: ["100 un", "250 un", "500 un"] },
  },
  {
    sku: "FP-CRT-002",
    nome: "Cartão de Visita Colorplus",
    categoria: "cartoes",
    sub: "Cartão de visita",
    colecao: "noturno",
    preco: 219.9,
    formato: "cartao",
    padrao: "losango",
    paleta: "noite",
    b2b: true,
    resumo: "Papel colorido na massa com hot stamping.",
    descricao:
      "Colorplus tem cor na massa: o corte do papel sai da mesma cor da superfície, sem miolo branco aparecendo. Sobre ele, hot stamping metálico aplicado a quente.",
    specs: [
      ["Formato", "9 × 5 cm"],
      ["Tiragem", "100 unidades"],
      ["Papel", "Colorplus 240g · dupla camada 480g"],
      ["Impressão", "Hot stamping · 1 cor metálica"],
      ["Prazo", "7 dias úteis"],
    ],
    variacao: { rotulo: "Tiragem", opcoes: ["100 un", "250 un", "500 un"] },
  },
  {
    sku: "FP-CRT-003",
    nome: "Postal Coleção Geometria",
    categoria: "cartoes",
    sub: "Postal",
    colecao: "geometria",
    preco: 24.9,
    formato: "postal",
    padrao: "leque",
    paleta: "terracota",
    b2b: false,
    resumo: "Set de 6 postais, um padrão em cada.",
    descricao:
      "Seis postais, seis padrões da coleção Geometria. Verso dividido com pauta para mensagem e campo de selo. Papel 300g com verso não laminado, para caneta pegar.",
    specs: [
      ["Formato", "10 × 15 cm · 6 unidades"],
      ["Papel", "Couché 300g · verso offset"],
      ["Impressão", "4/1"],
      ["Embalagem", "Cinta kraft"],
    ],
  },
  {
    sku: "FP-CRT-004",
    nome: "Convite Deco",
    categoria: "cartoes",
    sub: "Convite",
    colecao: "geometria",
    preco: 12.9,
    formato: "postal",
    padrao: "arco",
    paleta: "vinho",
    b2b: true,
    resumo: "Preço por unidade, mínimo de 30.",
    descricao:
      "Convite em papel especial com arco impresso e nome dos anfitriões em hot stamping. Vem com envelope forrado no mesmo padrão. Preço por unidade, pedido mínimo de 30.",
    specs: [
      ["Formato", "11 × 16 cm"],
      ["Papel", "Colorplus 240g"],
      ["Impressão", "4/0 + hot stamping"],
      ["Inclui", "Envelope forrado"],
      ["Mínimo", "30 unidades"],
    ],
  },
  {
    sku: "FP-CRT-005",
    nome: "Cartão de Agradecimento",
    categoria: "cartoes",
    sub: "Postal",
    colecao: "botanica",
    preco: 59.9,
    formato: "postal",
    padrao: "ponto",
    paleta: "menta",
    b2b: true,
    resumo: "Kit com 20 cartões e envelopes.",
    descricao:
      "Vinte cartões com o interior em branco e vinte envelopes. É o que loja compra para mandar junto com o pedido — sai personalizado com a marca no verso quando é para empresa.",
    specs: [
      ["Formato", "10 × 15 cm · 20 unidades"],
      ["Papel", "Offset 300g"],
      ["Inclui", "20 envelopes"],
    ],
  },

  /* ------------------------------------------------------------ adesivos */
  {
    sku: "FP-ADS-001",
    nome: "Cartela Geometria",
    categoria: "adesivos",
    sub: "Cartela",
    colecao: "geometria",
    preco: 22.9,
    formato: "adesivo",
    padrao: "leque",
    paleta: "magenta",
    b2b: false,
    destaque: true,
    resumo: "Kiss-cut, 24 adesivos por cartela.",
    descricao:
      "Corte kiss-cut: a faca corta o adesivo mas não o liner, então dá para descolar um a um sem estragar a cartela. Vinil branco com laminação fosca — não amarela na capa do notebook.",
    specs: [
      ["Formato", "A6 · 24 adesivos"],
      ["Material", "Vinil branco · laminação fosca"],
      ["Corte", "Kiss-cut"],
      ["Resistência", "Interno · resiste a atrito"],
    ],
  },
  {
    sku: "FP-ADS-002",
    nome: "Cartela Botânica",
    categoria: "adesivos",
    sub: "Cartela",
    colecao: "botanica",
    preco: 22.9,
    formato: "adesivo",
    padrao: "terrazzo",
    paleta: "mata",
    b2b: false,
    resumo: "Formas orgânicas em verde e terracota.",
    descricao:
      "Cartela da linha Botânica, com formas orgânicas recortadas em faca própria. Boa para marcar página de planner sem fechar o papel.",
    specs: [
      ["Formato", "A6 · 20 adesivos"],
      ["Material", "Vinil branco · laminação fosca"],
      ["Corte", "Kiss-cut"],
    ],
  },
  {
    sku: "FP-ADS-003",
    nome: "Adesivo Vinil Recorte",
    categoria: "adesivos",
    sub: "Recorte especial",
    colecao: "tipografia",
    preco: 39.9,
    formato: "adesivo",
    padrao: "liso",
    paleta: "ciano",
    b2b: true,
    resumo: "Corte no contorno da arte, resistente à água.",
    descricao:
      "Recorte eletrônico no contorno exato da arte, sem sobra de fundo. Vinil resistente a água e a sol — o mesmo usado em vitrine e em caixa de transporte.",
    specs: [
      ["Formato", "Até 10 × 10 cm"],
      ["Tiragem", "50 unidades"],
      ["Material", "Vinil polimérico"],
      ["Corte", "Recorte eletrônico no contorno"],
      ["Resistência", "Água e UV · uso externo"],
    ],
    variacao: { rotulo: "Tiragem", opcoes: ["50 un", "100 un", "250 un"] },
  },
  {
    sku: "FP-ADS-004",
    nome: "Cartela Marcadores",
    categoria: "adesivos",
    sub: "Cartela",
    colecao: "geometria",
    preco: 19.9,
    formato: "adesivo",
    padrao: "linha",
    paleta: "mostarda",
    b2b: false,
    resumo: "Índice adesivo para dividir o caderno.",
    descricao:
      "Abas adesivas para transformar qualquer caderno em fichário: cola na borda da página e cria o índice lateral. Papel adesivo com verniz, aceita escrita a caneta.",
    specs: [
      ["Formato", "A7 · 36 abas"],
      ["Material", "Papel adesivo com verniz"],
      ["Extras", "Aceita caneta esferográfica"],
    ],
  },

  /* --------------------------------------------------------- embalagens */
  {
    sku: "FP-EMB-001",
    nome: "Caixa-Berço Presente",
    categoria: "embalagens",
    sub: "Caixa-berço",
    colecao: "geometria",
    preco: 34.9,
    formato: "caixa",
    padrao: "leque",
    paleta: "areia",
    b2b: true,
    resumo: "Berço interno recortado sob medida.",
    descricao:
      "Caixa rígida com berço interno em EVA recortado no contorno do produto — o item não anda dentro da caixa no transporte. Tampa e fundo revestidos com a estampa.",
    specs: [
      ["Formato", "23 × 17 × 5 cm"],
      ["Material", "Papelão 2 mm revestido"],
      ["Berço", "EVA recortado sob medida"],
      ["Impressão", "4/0 · laminação fosca"],
    ],
  },
  {
    sku: "FP-EMB-002",
    nome: "Caixa Kit Corporativo",
    categoria: "embalagens",
    sub: "Caixa-berço",
    colecao: "noturno",
    preco: 59.9,
    formato: "caixa",
    padrao: "losango",
    paleta: "noite",
    b2b: true,
    destaque: true,
    resumo: "Caixa de onboarding para até 5 itens.",
    descricao:
      "A caixa que sai nos kits de boas-vindas. Berço com cinco nichos, fita de cetim e espaço para um cartão de mensagem na tampa. Vai personalizada com a marca do cliente — é peça de B2B.",
    specs: [
      ["Formato", "32 × 24 × 8 cm"],
      ["Material", "Papelão 2,5 mm revestido"],
      ["Berço", "5 nichos · EVA"],
      ["Extras", "Fita de cetim, porta-cartão na tampa"],
      ["Mínimo", "50 unidades (personalizado)"],
    ],
  },
  {
    sku: "FP-EMB-003",
    nome: "Sacola Kraft",
    categoria: "embalagens",
    sub: "Sacola",
    colecao: "kraft",
    preco: 14.9,
    formato: "sacola",
    padrao: "liso",
    paleta: "kraft",
    b2b: true,
    resumo: "Kraft 180g com alça de cadarço.",
    descricao:
      "Kraft puro 180g, fole lateral e alça de cadarço de algodão passada por ilhós. Suporta 4 kg. Serigrafia de uma cor inclusa quando for personalizada.",
    specs: [
      ["Formato", "26 × 32 × 10 cm"],
      ["Material", "Kraft 180g"],
      ["Alça", "Cadarço de algodão com ilhós"],
      ["Carga", "Até 4 kg"],
    ],
  },
  {
    sku: "FP-EMB-004",
    nome: "Sacola Especial Deco",
    categoria: "embalagens",
    sub: "Sacola",
    colecao: "geometria",
    preco: 18.9,
    formato: "sacola",
    padrao: "arco",
    paleta: "magenta",
    b2b: true,
    resumo: "Impressão total, alça de fita.",
    descricao:
      "Estampa impressa em toda a superfície, inclusive no fole, com registro fechado nas quinas. Alça de fita de gorgurão e reforço de cartão na boca da sacola.",
    specs: [
      ["Formato", "26 × 32 × 10 cm"],
      ["Material", "Couché 170g · laminação fosca"],
      ["Alça", "Fita de gorgurão"],
      ["Impressão", "4/0 total"],
    ],
  },
  {
    sku: "FP-EMB-005",
    nome: "Envelope Forrado Deco",
    categoria: "embalagens",
    sub: "Envelope",
    colecao: "geometria",
    preco: 9.9,
    formato: "envelope",
    padrao: "terrazzo",
    paleta: "vinho",
    b2b: false,
    resumo: "Forro estampado por dentro da aba.",
    descricao:
      "Por fora, papel liso. Por dentro, a estampa aparece quando a aba abre — o truque de acabamento que faz o convite parecer mais caro do que custou.",
    specs: [
      ["Formato", "11,4 × 16,2 cm (C6)"],
      ["Papel", "Offset 120g · forro couché"],
      ["Fecho", "Aba reta · cola de umedecer"],
    ],
  },
  {
    sku: "FP-EMB-006",
    nome: "Envelope Convite Forrado",
    categoria: "embalagens",
    sub: "Envelope",
    colecao: "geometria",
    preco: 11.9,
    formato: "envelope",
    padrao: "leque",
    paleta: "oceano",
    b2b: false,
    resumo: "Aba pontuda e forro em leque azul.",
    descricao:
      "Aba pontuda, formato de convite, com o leque azul aplicado no forro. Combina com o Convite Deco e com o kit de papel de carta.",
    specs: [
      ["Formato", "12 × 17,5 cm"],
      ["Papel", "Colorplus 180g · forro couché"],
      ["Fecho", "Aba pontuda"],
    ],
  },

  /* --------------------------------------------------------- acessórios */
  {
    sku: "FP-ACS-001",
    nome: "Marca-Página Metalizado",
    categoria: "acessorios",
    sub: "Marca-página",
    colecao: "tipografia",
    preco: 16.9,
    formato: "marcador",
    padrao: "linha",
    paleta: "mostarda",
    b2b: true,
    resumo: "Hot stamping dourado sobre papel 300g.",
    descricao:
      "Papel 300g com listra impressa e filete aplicado em hot stamping dourado. Furo com ilhós e cordão de algodão encerado.",
    specs: [
      ["Formato", "5 × 18 cm"],
      ["Papel", "Offset 300g"],
      ["Impressão", "1/0 + hot stamping dourado"],
      ["Extras", "Ilhós e cordão encerado"],
    ],
  },
  {
    sku: "FP-ACS-002",
    nome: "Marca-Página Deco",
    categoria: "acessorios",
    sub: "Marca-página",
    colecao: "geometria",
    preco: 14.9,
    formato: "marcador",
    padrao: "losango",
    paleta: "terracota",
    b2b: false,
    resumo: "Losango terracota, corte em V.",
    descricao:
      "Corte em V na base e losangos impressos em quatro cores. Laminação fosca nos dois lados — não marca a dobra do livro.",
    specs: [
      ["Formato", "5 × 18 cm"],
      ["Papel", "Couché 300g · laminação fosca"],
      ["Impressão", "4/4"],
    ],
  },
  {
    sku: "FP-ACS-003",
    nome: "Kit Marca-Páginas",
    categoria: "acessorios",
    sub: "Kit",
    colecao: "geometria",
    preco: 39.9,
    precoDe: 47.6,
    formato: "marcador",
    padrao: "ponto",
    paleta: "oceano",
    b2b: false,
    resumo: "Quatro marcadores, quatro padrões.",
    descricao:
      "Quatro marca-páginas da coleção Geometria em cartela única, cada um com um padrão. Vem em cinta kraft, bom para presente pequeno.",
    specs: [
      ["Formato", "5 × 18 cm · 4 unidades"],
      ["Papel", "Couché 300g"],
      ["Embalagem", "Cartela e cinta kraft"],
    ],
  },
  {
    sku: "FP-ACS-004",
    nome: "Kit Papelaria Completo",
    categoria: "acessorios",
    sub: "Kit",
    colecao: "botanica",
    preco: 289.9,
    precoDe: 339.5,
    formato: "caixa",
    padrao: "terrazzo",
    paleta: "menta",
    b2b: true,
    destaque: true,
    resumo: "Caderno, caderneta, bloco e marcador em caixa-berço.",
    descricao:
      "O kit que a gráfica monta para presente e para onboarding de empresa: um caderno capa dura, uma caderneta, um bloco de tarefas e dois marca-páginas, tudo da mesma coleção, dentro de caixa-berço com berço recortado.",
    specs: [
      ["Conteúdo", "1 caderno + 1 caderneta + 1 bloco + 2 marcadores"],
      ["Caixa", "32 × 24 × 8 cm · berço recortado"],
      ["Coleção", "Botânica"],
      ["Economia", "15% frente aos itens avulsos"],
    ],
  },
];

/** Deriva estoque, venda, custo e avaliação a partir do SKU — sempre igual. */
function derivar(b: Base): Produto {
  const r = semente(b.sku);
  const giro = entre(r, 8, 140);
  return {
    ...b,
    slug: slugify(b.nome),
    /* a foto de verdade é atribuída abaixo, em rodízio pela categoria */
    foto: GALERIA_PRODUTO[b.categoria][0],
    custo: Math.round(b.preco * (0.38 + r() * 0.12) * 100) / 100,
    estoque: entre(r, 0, 260),
    estoqueMin: entre(r, 12, 40),
    vendas30d: b.destaque ? giro + entre(r, 40, 90) : giro,
    avaliacao: Math.round((4.2 + r() * 0.8) * 10) / 10,
    qtdAvaliacoes: entre(r, 6, 240),
  };
}

export const PRODUTOS: Produto[] = (() => {
  const lista = BASE.map(derivar);
  /* Rodízio da galeria dentro de cada categoria. Sorteio por SKU repetia foto
     em produtos vizinhos da vitrine, o que parecia bug; o rodízio só repete
     depois de esgotar a galeria. */
  const usados = new Map<CategoriaId, number>();
  for (const p of lista) {
    const galeria = GALERIA_PRODUTO[p.categoria];
    const i = usados.get(p.categoria) ?? 0;
    p.foto = galeria[i % galeria.length];
    usados.set(p.categoria, i + 1);
  }
  return lista;
})();

/**
 * Fotos da página de produto.
 *
 * Começa pela foto do próprio produto e completa com as vizinhas da mesma
 * categoria. Serve para a galeria ter três imagens diferentes de verdade em
 * vez de repetir a mesma com zoom — enquanto o Marcel não manda o catálogo
 * fotografado, é o mais honesto que dá para montar.
 */
export function fotosDoProduto(p: Produto, qtd = 3): string[] {
  const galeria = GALERIA_PRODUTO[p.categoria];
  const inicio = Math.max(0, galeria.indexOf(p.foto));
  return Array.from({ length: Math.min(qtd, galeria.length) }, (_, k) =>
    galeria[(inicio + k) % galeria.length],
  );
}

export const porSlug = (slug: string) => PRODUTOS.find((p) => p.slug === slug);
export const porSku = (sku: string) => PRODUTOS.find((p) => p.sku === sku);
export const porCategoria = (id: CategoriaId) =>
  PRODUTOS.filter((p) => p.categoria === id);
export const porColecao = (id: ColecaoId) => PRODUTOS.filter((p) => p.colecao === id);
export const destaques = () => PRODUTOS.filter((p) => p.destaque);
export const lancamentos = () => PRODUTOS.filter((p) => p.novo);
export const personalizaveis = () => PRODUTOS.filter((p) => p.b2b);

export const categoriaDe = (id: CategoriaId) =>
  CATEGORIAS.find((c) => c.id === id)!;
export const colecaoDe = (id: ColecaoId) => COLECOES.find((c) => c.id === id)!;

/** Relacionados: mesma coleção primeiro, completa com a mesma categoria. */
export function relacionados(p: Produto, qtd = 4): Produto[] {
  const mesmaColecao = PRODUTOS.filter(
    (o) => o.sku !== p.sku && o.colecao === p.colecao,
  );
  const mesmaCategoria = PRODUTOS.filter(
    (o) => o.sku !== p.sku && o.categoria === p.categoria && o.colecao !== p.colecao,
  );
  return [...mesmaColecao, ...mesmaCategoria].slice(0, qtd);
}

export const FAIXAS_PRECO = [
  { id: "ate-50", rotulo: "Até R$ 50", teste: (p: Produto) => p.preco <= 50 },
  { id: "50-100", rotulo: "R$ 50 a R$ 100", teste: (p: Produto) => p.preco > 50 && p.preco <= 100 },
  { id: "100-200", rotulo: "R$ 100 a R$ 200", teste: (p: Produto) => p.preco > 100 && p.preco <= 200 },
  { id: "200-mais", rotulo: "Acima de R$ 200", teste: (p: Produto) => p.preco > 200 },
];
