/**
 * Conteúdo da apresentação comercial.
 *
 * Fica separado da tela pelo mesmo motivo dos outros dados do painel: preço e
 * escopo mudam de proposta para proposta, e mexer em número no meio de JSX é
 * como se erra vírgula. Aqui está tudo em um lugar só, conferível de uma
 * olhada antes de mostrar para o cliente.
 *
 * ⚠️ Nada aqui é dado de operação — é proposta comercial. A página não exibe
 * venda, cliente nem resultado, porque número inventado numa apresentação de
 * preço é o jeito mais rápido de perder a conversa.
 */

/* ------------------------------------------------------------- públicos */

export const PUBLICOS = [
  {
    id: "b2c",
    selo: "B2C",
    titulo: "Venda direta ao consumidor",
    texto:
      "Cadernos, planners, papelaria e produtos premium vendidos pela loja, com carrinho, checkout e pagamento on-line.",
    icone: "sacola",
  },
  {
    id: "b2b",
    selo: "B2B",
    titulo: "Atendimento a empresas",
    texto:
      "Solicitação de orçamento para produtos personalizados e pedidos em quantidade, com a tiragem e o prazo tratados caso a caso.",
    icone: "predio",
  },
] as const;

/* --------------------------------------------------------------- visão */

export const RECURSOS = [
  { nome: "Loja virtual responsiva", icone: "grade" },
  { nome: "Operação B2C e B2B", icone: "pessoas" },
  { nome: "Catálogo de produtos", icone: "etiqueta" },
  { nome: "Carrinho e checkout", icone: "sacola" },
  { nome: "Pagamento com Mercado Pago", icone: "carteira" },
  { nome: "Configuração de frete", icone: "caminhao" },
  { nome: "Painel administrativo", icone: "engrenagem" },
  { nome: "Pedidos, produtos, categorias e estoque", icone: "caixa" },
  { nome: "Cupons e promoções", icone: "cupom" },
  { nome: "Integração com WhatsApp", icone: "whatsapp" },
] as const;

/* -------------------------------------------------------------- pacotes */

export type Pacote = {
  id: "inicial" | "intermediario" | "completo";
  nome: string;
  resumo: string;
  implantacao: number;
  mensalidade: number;
  recomendado?: boolean;
  /** o que este pacote acrescenta ao anterior */
  heranca?: string;
  itens: string[];
};

export const PACOTES: Pacote[] = [
  {
    id: "inicial",
    nome: "Pacote Inicial",
    resumo: "A loja no ar, vendendo, com o painel do dia a dia.",
    implantacao: 2000,
    mensalidade: 150,
    itens: [
      "Loja virtual B2C",
      "Área B2B para solicitação de orçamento",
      "Carrinho e checkout",
      "Integração com Mercado Pago",
      "Configuração de frete",
      "Painel administrativo simples",
      "Gestão de produtos, categorias e pedidos",
      "Controle de estoque",
      "Cupons e promoções",
      "Treinamento para utilização",
    ],
  },
  {
    id: "intermediario",
    nome: "Pacote Intermediário",
    resumo: "A loja com os números na mão para decidir o que vender.",
    implantacao: 3500,
    mensalidade: 250,
    recomendado: true,
    heranca: "Tudo do Pacote Inicial, mais:",
    itens: [
      "Painel administrativo mais completo",
      "Dashboard de vendas",
      "Indicadores de faturamento",
      "Ticket médio",
      "Produtos mais vendidos",
      "Indicadores de pedidos",
      "Indicadores de estoque",
      "Relatórios gerenciais",
      "Configuração ou otimização do Google Meu Negócio",
    ],
  },
  {
    id: "completo",
    nome: "Pacote Completo",
    resumo: "A marca redesenhada e a presença aberta nos marketplaces.",
    implantacao: 5000,
    mensalidade: 400,
    heranca: "Tudo do Pacote Intermediário, mais:",
    itens: [
      "Redefinição da identidade visual",
      "Criação ou modernização do logo",
      "Definição da paleta de cores",
      "Definição da tipografia",
      "Aplicação da nova identidade na loja",
      "Consultoria para entrada na Shopee",
      "Consultoria para entrada no Mercado Livre",
      "Orientação sobre títulos e descrições",
      "Orientação sobre preços e anúncios",
      "Estratégia inicial para marketplaces",
    ],
  },
];

/* ---------------------------------------------------------- comparativo */

/**
 * Linha da tabela: `true` vira check, `null` vira traço, string aparece como
 * texto. Guardar assim (em vez de já formatado) deixa a tabela desenhar o
 * ícone certo sem precisar interpretar texto.
 */
export type ValorComparativo = true | null | string;

export const COMPARATIVO: { recurso: string; valores: ValorComparativo[] }[] = [
  { recurso: "Loja B2C e B2B", valores: [true, true, true] },
  { recurso: "Painel administrativo", valores: ["Simples", "Completo", "Completo"] },
  { recurso: "Dashboard e relatórios", valores: [null, true, true] },
  { recurso: "Google Meu Negócio", valores: [null, true, true] },
  { recurso: "Identidade visual", valores: [null, null, true] },
  { recurso: "Consultoria de marketplaces", valores: [null, null, true] },
];

/* ---------------------------------------------------------- mensalidade */

export const MENSALIDADES = [
  {
    valor: 150,
    pacote: "Pacote Inicial",
    heranca: undefined as string | undefined,
    itens: ["Manutenção", "Monitoramento", "Backup", "Correções de funcionamento"],
  },
  {
    valor: 250,
    pacote: "Pacote Intermediário",
    heranca: "Tudo do plano anterior, mais:",
    itens: ["Pequenas alterações", "Suporte ao painel administrativo"],
  },
  {
    valor: 400,
    pacote: "Pacote Completo",
    heranca: "Tudo do plano anterior, mais:",
    itens: ["Reunião mensal", "Acompanhamento estratégico"],
  },
];

/* ------------------------------------------------------------ condições */

export const CONDICOES = [
  {
    titulo: "Pagamento da implantação",
    itens: [
      "50% do valor no início do projeto",
      "50% na entrega e publicação da loja",
    ],
    icone: "carteira",
  },
  {
    titulo: "Mensalidade",
    itens: [
      "Primeira cobrança 30 dias após a publicação",
      "Não inclui novas funcionalidades ou alterações de grande porte",
    ],
    icone: "calendario",
  },
  {
    titulo: "Responsabilidade da Full Print",
    itens: ["Cadastro dos produtos realizado pela própria Full Print"],
    icone: "caixa",
  },
  {
    titulo: "Não incluído",
    itens: [
      "Domínio, anúncios e ferramentas pagas",
      "Taxas do Mercado Pago",
      "Novas funcionalidades — avaliadas e orçadas separadamente",
    ],
    icone: "alerta",
  },
] as const;
