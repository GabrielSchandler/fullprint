import { CATEGORIAS, PRODUTOS, type CategoriaId, type Produto } from "./catalogo";
import { HOJE, diasAtras, entre, escolher, semente } from "./format";

/**
 * Dados do painel.
 *
 * ⚠️ Tudo fictício, gerado por PRNG com semente fixa. Mesma semente = mesmos
 * números em toda renderização, então servidor e cliente batem e o Marcel vê
 * a mesma tela em duas visitas seguidas.
 *
 * Escala calibrada para uma operação de porte: ~R$ 240 mil/mês e ~950 pedidos
 * no varejo, mais o B2B, que tem ticket alto e volume baixo.
 */

/* ---------------------------------------------------------------- pedidos */

export const STATUS_PEDIDO = {
  novo: { rotulo: "Novo", tom: "info" },
  producao: { rotulo: "Em produção", tom: "alerta" },
  enviado: { rotulo: "Enviado", tom: "neutro" },
  entregue: { rotulo: "Entregue", tom: "ok" },
  cancelado: { rotulo: "Cancelado", tom: "erro" },
} as const;
export type StatusPedido = keyof typeof STATUS_PEDIDO;

export const CANAIS = ["Loja virtual", "B2B", "Instagram", "Balcão"] as const;
export const PAGAMENTOS = ["Pix", "Cartão", "Boleto"] as const;

export type ItemPedido = { produto: Produto; qtd: number; preco: number };

/**
 * Preço unitário no B2B.
 *
 * Gráfica não dá desconto fixo: o unitário cai conforme a tiragem dilui a
 * preparação (chapa, acerto de máquina, faca). Uma peça a 2.000 unidades sai
 * por menos de um terço do preço de balcão; a 50 unidades, o acerto ainda pesa
 * e o desconto é modesto. Esta curva é o que faz o pipeline B2B parecer real
 * para quem conhece o ramo.
 */
export function precoB2b(precoVarejo: number, qtd: number): number {
  const fator =
    qtd >= 2000 ? 0.28 : qtd >= 1000 ? 0.34 : qtd >= 500 ? 0.42 : qtd >= 200 ? 0.5 : 0.6;
  return Math.round(precoVarejo * fator * 100) / 100;
}

export type Pedido = {
  id: string;
  numero: number;
  data: Date;
  cliente: string;
  email: string;
  cidade: string;
  uf: string;
  itens: ItemPedido[];
  subtotal: number;
  frete: number;
  desconto: number;
  total: number;
  status: StatusPedido;
  pagamento: (typeof PAGAMENTOS)[number];
  canal: (typeof CANAIS)[number];
};

const PRIMEIROS = [
  "Ana", "Bruno", "Carla", "Diego", "Elisa", "Felipe", "Gabriela", "Henrique",
  "Isabela", "João", "Karina", "Lucas", "Mariana", "Nicolas", "Patrícia",
  "Rafael", "Sofia", "Thiago", "Vanessa", "Wagner", "Beatriz", "Caio",
  "Daniela", "Eduardo", "Fernanda", "Gustavo", "Helena", "Igor",
];
const SOBRENOMES = [
  "Almeida", "Barbosa", "Cardoso", "Duarte", "Esteves", "Ferreira", "Gomes",
  "Henriques", "Ibrahim", "Jardim", "Klein", "Lima", "Machado", "Nogueira",
  "Oliveira", "Pereira", "Queiroz", "Ramos", "Santos", "Teixeira",
];
const CIDADES: [string, string][] = [
  ["Guarulhos", "SP"], ["São Paulo", "SP"], ["Campinas", "SP"], ["Santo André", "SP"],
  ["Rio de Janeiro", "RJ"], ["Niterói", "RJ"], ["Belo Horizonte", "MG"],
  ["Curitiba", "PR"], ["Porto Alegre", "RS"], ["Florianópolis", "SC"],
  ["Salvador", "BA"], ["Recife", "PE"], ["Fortaleza", "CE"], ["Brasília", "DF"],
  ["Goiânia", "GO"], ["Vitória", "ES"],
];

function gerarPedidos(qtd: number): Pedido[] {
  const r = semente("pedidos-fullprint");
  const lista: Pedido[] = [];

  for (let i = 0; i < qtd; i++) {
    const dias = Math.floor(Math.pow(r(), 1.35) * 88);
    const data = diasAtras(dias);
    data.setHours(entre(r, 8, 20), entre(r, 0, 59), 0, 0);

    const nome = `${escolher(r, PRIMEIROS)} ${escolher(r, SOBRENOMES)}`;
    const [cidade, uf] = escolher(r, CIDADES);
    const canal = r() < 0.08 ? "B2B" : r() < 0.14 ? "Instagram" : r() < 0.2 ? "Balcão" : "Loja virtual";

    const nItens = canal === "B2B" ? 1 : entre(r, 1, 4);
    const itens: ItemPedido[] = [];
    for (let j = 0; j < nItens; j++) {
      const produto = escolher(r, PRODUTOS);
      if (itens.some((it) => it.produto.sku === produto.sku)) continue;
      const qtd = canal === "B2B" ? entre(r, 50, 400) : entre(r, 1, 3);
      itens.push({
        produto,
        qtd,
        preco: canal === "B2B" ? precoB2b(produto.preco, qtd) : produto.preco,
      });
    }
    if (!itens.length) continue;

    const subtotal = itens.reduce((s, it) => s + it.preco * it.qtd, 0);
    const desconto = r() < 0.28 ? Math.round(subtotal * escolher(r, [0.05, 0.1, 0.15]) * 100) / 100 : 0;
    const frete = canal === "Balcão" || subtotal >= 199 ? 0 : escolher(r, [24.9, 41.5]);

    /* pedido novo ainda está no começo da esteira; pedido antigo já fechou */
    const st = r();
    const status: StatusPedido =
      dias < 2 ? (st < 0.6 ? "novo" : "producao")
        : dias < 6 ? (st < 0.45 ? "producao" : st < 0.9 ? "enviado" : "novo")
          : dias < 14 ? (st < 0.25 ? "enviado" : st < 0.96 ? "entregue" : "cancelado")
            : st < 0.965 ? "entregue" : "cancelado";

    const numero = 4200 - i;
    lista.push({
      id: `FP-2026-${numero}`,
      numero,
      data,
      cliente: nome,
      email: `${nome.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, ".")}@email.com`,
      cidade,
      uf,
      itens,
      subtotal: Math.round(subtotal * 100) / 100,
      frete,
      desconto,
      total: Math.round((subtotal - desconto + frete) * 100) / 100,
      status,
      pagamento: escolher(r, PAGAMENTOS),
      canal,
    });
  }

  return lista.sort((a, b) => b.data.getTime() - a.data.getTime());
}

export const PEDIDOS = gerarPedidos(180);

/* --------------------------------------------------------------- clientes */

export type Cliente = {
  id: string;
  nome: string;
  email: string;
  tipo: "PF" | "PJ";
  cidade: string;
  uf: string;
  pedidos: number;
  gasto: number;
  ticket: number;
  primeira: Date;
  ultima: Date;
  tag: "Novo" | "Recorrente" | "VIP" | "Inativo";
};

function gerarClientes(): Cliente[] {
  const r = semente("clientes-fullprint");
  const porNome = new Map<string, Pedido[]>();
  for (const p of PEDIDOS) {
    porNome.set(p.cliente, [...(porNome.get(p.cliente) ?? []), p]);
  }

  return [...porNome.entries()]
    .map(([nome, ps], i) => {
      const gasto = ps.reduce((s, p) => s + p.total, 0);
      /* Papelaria recompra, mas não tanto: cerca de um terço da base volta.
         Dar 0–6 pedidos extras a todo mundo levava a taxa de recompra a 89%,
         número que não existe em e-commerce e entrega o dado como inventado. */
      const extras = r() < 0.3 ? entre(r, 1, 4) : 0;
      const pedidos = ps.length + extras;
      const gastoTotal = gasto * (1 + extras * 0.7);
      const datas = ps.map((p) => p.data.getTime());
      const ultima = new Date(Math.max(...datas));
      /* Data da primeira compra.
         Quem tem histórico extra é cliente antigo. Quem não tem se distribui
         pelos últimos 11 meses com viés para o recente (expoente 1.8), o que
         desenha uma curva de crescimento. Duas tentativas anteriores erraram:
         fixar 90+ dias zerava os três meses mais recentes, e usar o primeiro
         pedido da amostra empilhava tudo nos últimos três meses, como se a
         loja tivesse nascido em junho. */
      const primeira =
        extras > 0
          ? diasAtras(entre(r, 150, 900))
          : diasAtras(Math.floor(Math.pow(r(), 1.8) * 330) + 4);
      const diasSemComprar = Math.round((HOJE.getTime() - ultima.getTime()) / 86_400_000);

      const tag: Cliente["tag"] =
        gastoTotal > 4000 ? "VIP"
          : diasSemComprar > 60 ? "Inativo"
            : pedidos > 2 ? "Recorrente"
              : "Novo";

      return {
        id: `CLI-${String(1000 + i)}`,
        nome,
        email: ps[0].email,
        tipo: ps.some((p) => p.canal === "B2B") ? ("PJ" as const) : ("PF" as const),
        cidade: ps[0].cidade,
        uf: ps[0].uf,
        pedidos,
        gasto: Math.round(gastoTotal * 100) / 100,
        ticket: Math.round((gastoTotal / pedidos) * 100) / 100,
        primeira,
        ultima,
        tag,
      };
    })
    .sort((a, b) => b.gasto - a.gasto);
}

export const CLIENTES = gerarClientes();

/* ------------------------------------------------------------- financeiro */

export type MesFinanceiro = {
  mes: string;
  data: Date;
  receita: number;
  receitaAnterior: number;
  custo: number;
  despesa: number;
  lucro: number;
  pedidos: number;
};

function gerarFinanceiro(): MesFinanceiro[] {
  const r = semente("financeiro-fullprint");
  const meses: MesFinanceiro[] = [];
  const rotulos = ["set", "out", "nov", "dez", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago"];

  for (let i = 0; i < 12; i++) {
    const data = new Date(HOJE.getFullYear(), HOJE.getMonth() - (11 - i), 1);
    /* papelaria tem pico em nov/dez (presente) e jan (volta às aulas/planner) */
    const sazonal = [1, 1.12, 1.42, 1.55, 1.34, 0.92, 0.96, 1, 1.04, 0.98, 1.02, 1.08][i];
    const tendencia = 1 + i * 0.017;
    const receita = Math.round(178_000 * sazonal * tendencia * (0.94 + r() * 0.12));
    const custo = Math.round(receita * (0.36 + r() * 0.05));
    const despesa = Math.round(receita * (0.29 + r() * 0.04));

    meses.push({
      mes: rotulos[i],
      data,
      receita,
      receitaAnterior: Math.round(receita / (1.14 + r() * 0.16)),
      custo,
      despesa,
      lucro: receita - custo - despesa,
      pedidos: Math.round(receita / (238 + r() * 40)),
    });
  }
  return meses;
}

export const FINANCEIRO = gerarFinanceiro();
export const MES_ATUAL = FINANCEIRO[FINANCEIRO.length - 1];
export const MES_ANTERIOR = FINANCEIRO[FINANCEIRO.length - 2];

export const DESPESAS = [
  { nome: "Papel e insumo", valor: 84_200, cor: "var(--color-serie-1)" },
  { nome: "Folha de pagamento", valor: 61_500, cor: "var(--color-serie-2)" },
  { nome: "Tinta e chapa", valor: 23_800, cor: "var(--color-serie-3)" },
  { nome: "Aluguel e energia", valor: 18_400, cor: "var(--color-serie-4)" },
  { nome: "Frete e logística", valor: 14_900, cor: "var(--color-serie-5)" },
  { nome: "Marketing", valor: 11_200, cor: "var(--color-mute-2)" },
  { nome: "Manutenção", valor: 7_600, cor: "var(--color-linha-forte)" },
];

export type Lancamento = {
  id: string;
  descricao: string;
  categoria: string;
  vencimento: Date;
  valor: number;
  tipo: "receber" | "pagar";
  situacao: "pago" | "aberto" | "atrasado";
};

function gerarLancamentos(): Lancamento[] {
  const r = semente("lancamentos-fullprint");
  const receber = [
    ["Kit onboarding · Aurora Tecnologia", "B2B"],
    ["Cadernos personalizados · Colégio Vértice", "B2B"],
    ["Sacolas · Rede Bom Preço", "B2B"],
    ["Repasse Mercado Pago · semana 33", "Varejo"],
    ["Repasse Mercado Pago · semana 34", "Varejo"],
    ["Cartões de visita · Escritório Lemos", "B2B"],
    ["Agendas 2027 · Construtora Pilar", "B2B"],
  ];
  const pagar = [
    ["Papel pólen soft · Suzano", "Insumo"],
    ["Tinta offset · Flint Group", "Insumo"],
    ["Folha de pagamento · agosto", "Pessoal"],
    ["Aluguel do galpão", "Fixo"],
    ["Energia elétrica", "Fixo"],
    ["Manutenção impressora Heidelberg", "Manutenção"],
    ["Correios · fatura mensal", "Logística"],
    ["Google Ads", "Marketing"],
  ];

  const lista: Lancamento[] = [];
  receber.forEach(([descricao, categoria], i) => {
    const dias = entre(r, -18, 22);
    lista.push({
      id: `REC-${900 + i}`,
      descricao,
      categoria,
      vencimento: diasAtras(dias),
      valor: entre(r, 4_200, 68_000),
      tipo: "receber",
      situacao: dias > 4 ? (r() < 0.75 ? "pago" : "atrasado") : "aberto",
    });
  });
  pagar.forEach(([descricao, categoria], i) => {
    const dias = entre(r, -20, 18);
    lista.push({
      id: `PAG-${700 + i}`,
      descricao,
      categoria,
      vencimento: diasAtras(dias),
      valor: entre(r, 3_100, 62_000),
      tipo: "pagar",
      situacao: dias > 3 ? (r() < 0.86 ? "pago" : "atrasado") : "aberto",
    });
  });

  return lista.sort((a, b) => a.vencimento.getTime() - b.vencimento.getTime());
}

export const LANCAMENTOS = gerarLancamentos();

/* -------------------------------------------------------------- pipeline B2B */

export const ETAPAS_B2B = [
  { id: "briefing", rotulo: "Briefing" },
  { id: "orcamento", rotulo: "Orçamento enviado" },
  { id: "arte", rotulo: "Arte e prova" },
  { id: "producao", rotulo: "Em produção" },
  { id: "entregue", rotulo: "Entregue" },
] as const;
export type EtapaB2b = (typeof ETAPAS_B2B)[number]["id"];

export type Orcamento = {
  id: string;
  empresa: string;
  contato: string;
  peca: string;
  tiragem: number;
  valor: number;
  etapa: EtapaB2b;
  responsavel: string;
  atualizado: Date;
  prazo: Date;
};

function gerarOrcamentos(): Orcamento[] {
  const r = semente("b2b-fullprint");
  /**
   * [empresa, peça, preço de balcão da peça, tiragens plausíveis].
   *
   * O preço de balcão ancora o unitário do orçamento — sem ele o gerador
   * cospe marca-página a R$ 34 a unidade, número que qualquer gráfico
   * identifica como falso na hora. A tiragem também é específica da peça:
   * ninguém pede 5.000 caixas-berço nem 50 rótulos adesivos.
   */
  const empresas: [string, string, number, number[]][] = [
    ["Aurora Tecnologia", "Kit de boas-vindas", 289.9, [100, 200, 300]],
    ["Colégio Vértice", "Caderno personalizado", 139.9, [300, 500, 1000]],
    ["Rede Bom Preço", "Sacola de loja", 18.9, [1000, 2500, 5000]],
    ["Escritório Lemos", "Cartão de visita", 1.9, [1000, 2500, 5000]],
    ["Construtora Pilar", "Agenda 2027", 169.9, [200, 300, 500]],
    ["Clínica Vida", "Bloco de receituário", 39.9, [200, 500, 1000]],
    ["Editora Margem", "Marca-página", 14.9, [1000, 2500, 5000]],
    ["Studio Norte", "Caixa-berço", 34.9, [200, 300, 500]],
    ["Banco Cordilheira", "Bloco de reunião", 49.9, [300, 500, 1000]],
    ["Café Serrano", "Rótulo adesivo", 2.4, [2500, 5000]],
    ["Instituto Ponte", "Crachá de evento", 6.9, [500, 1000, 2500]],
    ["Academia Fôlego", "Sacola e adesivo", 21.9, [500, 1000]],
    ["Hotel Alvorada", "Papelaria de quarto", 12.9, [1000, 2500]],
    ["Marca Própria Ltda", "Caderno com logo", 149.9, [200, 300, 500]],
  ];
  const responsaveis = ["Marcel", "Renata", "Douglas"];

  return empresas.map(([empresa, peca, balcao, tiragens], i) => {
    const tiragem = escolher(r, tiragens);
    const etapa = escolher(r, ETAPAS_B2B).id;
    /* variação de ±8% simula a negociação em cima da tabela */
    const unitario = precoB2b(balcao, tiragem) * (0.92 + r() * 0.16);
    return {
      id: `ORC-${480 + i}`,
      empresa,
      contato: `${escolher(r, PRIMEIROS)} ${escolher(r, SOBRENOMES)}`,
      peca,
      tiragem,
      valor: Math.round(tiragem * unitario * 100) / 100,
      etapa,
      responsavel: escolher(r, responsaveis),
      atualizado: diasAtras(entre(r, 0, 21)),
      prazo: diasAtras(-entre(r, 4, 40)),
    };
  });
}

export const ORCAMENTOS = gerarOrcamentos();

/* ------------------------------------------------------------- agregações */

export const receitaPorCategoria = (): { id: CategoriaId; nome: string; valor: number }[] => {
  const mapa = new Map<CategoriaId, number>();
  for (const p of PEDIDOS) {
    for (const i of p.itens) {
      mapa.set(i.produto.categoria, (mapa.get(i.produto.categoria) ?? 0) + i.preco * i.qtd);
    }
  }
  return [...mapa.entries()]
    .map(([id, valor]) => ({
      id,
      /* nome de verdade, não o id capitalizado — senão o gráfico exibe
         "Cartoes" e "Acessorios", sem acento, e denuncia dado montado */
      nome: CATEGORIAS.find((c) => c.id === id)?.nome ?? id,
      valor: Math.round(valor),
    }))
    .sort((a, b) => b.valor - a.valor);
};

/**
 * Participação de cada canal na receita.
 *
 * Declarada, e não somada da tabela de PEDIDOS: a tabela guarda uma amostra de
 * 180 pedidos, e como pedido B2B tem tiragem alta ele domina qualquer soma
 * feita em cima dessa amostra — dava 81% da receita, o que descreveria uma
 * gráfica sem varejo, o oposto do negócio. O mix abaixo é aplicado sobre a
 * receita real do mês, então bate com o financeiro.
 */
export const MIX_CANAL = [
  { nome: "Loja virtual", fatia: 0.49 },
  { nome: "B2B", fatia: 0.32 },
  { nome: "Balcão", fatia: 0.12 },
  { nome: "Instagram", fatia: 0.07 },
];

export const vendasPorCanal = () =>
  MIX_CANAL.map((c) => ({
    nome: c.nome,
    valor: Math.round(MES_ATUAL.receita * c.fatia),
  }));

export const pedidosPorDia = (dias = 30) => {
  const serie: { data: Date; qtd: number; valor: number }[] = [];
  for (let d = dias - 1; d >= 0; d--) {
    const dia = diasAtras(d);
    const doDia = PEDIDOS.filter(
      (p) =>
        p.data.getDate() === dia.getDate() &&
        p.data.getMonth() === dia.getMonth() &&
        p.data.getFullYear() === dia.getFullYear(),
    );
    /* a tabela guarda uma amostra; o volume real do dia é ~7× isso */
    serie.push({
      data: dia,
      qtd: doDia.length * 7 + ((dia.getDate() * 13) % 9),
      valor: Math.round(doDia.reduce((s, p) => s + p.total, 0) * 7),
    });
  }
  return serie;
};

export const maisVendidos = (qtd = 8) => {
  const mapa = new Map<string, { produto: Produto; qtd: number; valor: number }>();
  for (const p of PEDIDOS) {
    for (const i of p.itens) {
      const atual = mapa.get(i.produto.sku) ?? { produto: i.produto, qtd: 0, valor: 0 };
      atual.qtd += i.qtd;
      atual.valor += i.preco * i.qtd;
      mapa.set(i.produto.sku, atual);
    }
  }
  return [...mapa.values()].sort((a, b) => b.valor - a.valor).slice(0, qtd);
};

export const estoqueCritico = () =>
  PRODUTOS.filter((p) => p.estoque <= p.estoqueMin).sort((a, b) => a.estoque - b.estoque);

export const valorEmEstoque = () =>
  PRODUTOS.reduce((s, p) => s + p.estoque * p.custo, 0);

/* ------------------------------------------------------------------ cupons */

export type CupomPainel = {
  codigo: string;
  tipo: "Percentual" | "Valor fixo" | "Frete grátis";
  valor: string;
  usos: number;
  limite: number;
  receita: number;
  validade: Date;
  ativo: boolean;
};

export const CUPONS_PAINEL: CupomPainel[] = [
  { codigo: "PRIMEIRACOMPRA", tipo: "Percentual", valor: "10%", usos: 412, limite: 1000, receita: 68_940, validade: diasAtras(-120), ativo: true },
  { codigo: "FRETEGRATIS", tipo: "Frete grátis", valor: "—", usos: 1_284, limite: 0, receita: 214_300, validade: diasAtras(-45), ativo: true },
  { codigo: "PAPEL50", tipo: "Valor fixo", valor: "R$ 50", usos: 96, limite: 300, receita: 41_720, validade: diasAtras(-18), ativo: true },
  { codigo: "GEOMETRIA15", tipo: "Percentual", valor: "15%", usos: 178, limite: 500, receita: 33_150, validade: diasAtras(-62), ativo: true },
  { codigo: "VOLTAASAULAS", tipo: "Percentual", valor: "20%", usos: 645, limite: 800, receita: 89_400, validade: diasAtras(24), ativo: false },
  { codigo: "BLACKPRINT", tipo: "Percentual", valor: "25%", usos: 892, limite: 1500, receita: 148_600, validade: diasAtras(263), ativo: false },
];

export type Promocao = {
  nome: string;
  escopo: string;
  regra: string;
  inicio: Date;
  fim: Date;
  itens: number;
  receita: number;
  ativa: boolean;
};

export const PROMOCOES: Promocao[] = [
  { nome: "Planners 2027 — pré-venda", escopo: "Planners & Agendas", regra: "10% off + brinde", inicio: diasAtras(12), fim: diasAtras(-32), itens: 7, receita: 96_400, ativa: true },
  { nome: "Leve 3, pague 2 — Cadernetas", escopo: "Cadernetas", regra: "3 por 2", inicio: diasAtras(5), fim: diasAtras(-16), itens: 5, receita: 28_900, ativa: true },
  { nome: "Kits com 15%", escopo: "Acessórios · Kits", regra: "15% off", inicio: diasAtras(30), fim: diasAtras(-4), itens: 2, receita: 41_300, ativa: true },
  { nome: "Queima de estampa antiga", escopo: "Coleção Botânica", regra: "30% off", inicio: diasAtras(78), fim: diasAtras(48), itens: 9, receita: 52_700, ativa: false },
];
