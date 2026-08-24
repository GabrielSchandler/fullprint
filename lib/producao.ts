import { PEDIDOS, type Pedido } from "./painel-dados";
import { HOJE, escolher, semente } from "./format";

/**
 * Chão de fábrica.
 *
 * O resto do painel enxerga o pedido pelo lado do comércio — entrou, pagou,
 * saiu. Esta camada enxerga pelo lado da produção, que é o dia real de uma
 * gráfica: cada pedido vira uma OS que ocupa uma máquina, tem prazo próprio e
 * só anda quando a arte está liberada.
 *
 * ⚠️ Fictício, derivado dos mesmos PEDIDOS por PRNG com semente fixa.
 */

/* ---------------------------------------------------------------- etapas */

export const ETAPAS_PRODUCAO = [
  {
    id: "pre",
    rotulo: "Pré-impressão",
    resumo: "Conferência de arte, imposição e prova.",
    icone: "papel",
  },
  {
    id: "impressao",
    rotulo: "Impressão",
    resumo: "Offset e digital.",
    icone: "raio",
  },
  {
    id: "acabamento",
    rotulo: "Acabamento",
    resumo: "Corte, vinco, laminação e encadernação.",
    icone: "caixa",
  },
  {
    id: "expedicao",
    rotulo: "Expedição",
    resumo: "Conferência final, embalagem e etiqueta.",
    icone: "caminhao",
  },
] as const;

export type EtapaProducao = (typeof ETAPAS_PRODUCAO)[number]["id"];

/* -------------------------------------------------------------- máquinas */

/**
 * Parque gráfico.
 *
 * `capacidade` é em horas úteis por dia — é o que transforma a fila em carga.
 * Sem isso o quadro mostra quantos jobs existem, mas não se cabem no dia.
 */
export const MAQUINAS = [
  { id: "offset", nome: "Offset Heidelberg SM 52", etapa: "impressao", capacidade: 16 },
  { id: "digital", nome: "Digital HP Indigo 7900", etapa: "impressao", capacidade: 20 },
  { id: "plotter", nome: "Plotter de recorte", etapa: "acabamento", capacidade: 8 },
  { id: "laminadora", nome: "Laminadora BOPP", etapa: "acabamento", capacidade: 8 },
  { id: "wireo", nome: "Wire-o e costura", etapa: "acabamento", capacidade: 12 },
  { id: "guilhotina", nome: "Guilhotina e vinco", etapa: "acabamento", capacidade: 10 },
  /* pré-impressão é trabalho de estação, não de máquina: duas pessoas em
     turno dão 16 h, e sem isso a etapa inteira caía numa capacidade só e
     aparecia em 244% — número que só denuncia o modelo */
  { id: "prova", nome: "Mesa de prova e imposição", etapa: "pre", capacidade: 16 },
  { id: "ctp", nome: "CTP · gravação de chapa", etapa: "pre", capacidade: 10 },
  { id: "expedicao", nome: "Bancada de expedição", etapa: "expedicao", capacidade: 12 },
] as const;

export type MaquinaId = (typeof MAQUINAS)[number]["id"];

export const maquina = (id: MaquinaId) => MAQUINAS.find((m) => m.id === id)!;

/* ------------------------------------------------------------------ arte */

/**
 * Pré-flight.
 *
 * Ordem importa: nada passa de pré-impressão sem arte aprovada. É a regra que
 * faz o quadro parecer uma gráfica de verdade em vez de um kanban genérico.
 */
export const STATUS_ARTE = {
  aprovada: { rotulo: "Arte aprovada", tom: "ok", curto: "Liberada" },
  analise: { rotulo: "Em conferência", tom: "info", curto: "Conferindo" },
  ajuste: { rotulo: "Ajuste pedido", tom: "erro", curto: "Ajuste" },
  pendente: { rotulo: "Aguardando arquivo", tom: "alerta", curto: "Sem arte" },
} as const;

export type StatusArte = keyof typeof STATUS_ARTE;

/** Defeito que a conferência aponta — o que o atendimento repassa ao cliente. */
export const APONTAMENTOS = [
  "Sangria de 3 mm ausente nas quatro bordas",
  "Fonte não convertida em curvas",
  "Imagem em 96 dpi — abaixo dos 300 dpi de impressão",
  "Arquivo em RGB, precisa vir em CMYK",
  "Texto fora da margem de segurança",
  "Faca de corte na mesma camada da arte",
];

const OPERADORES = [
  "Marcel",
  "Rita",
  "Anderson",
  "Cleide",
  "Jefferson",
  "Solange",
  "Wesley",
];

/* -------------------------------------------------------------------- OS */

export type Job = {
  os: string;
  pedido: Pedido;
  etapa: EtapaProducao;
  maquina: MaquinaId;
  arte: StatusArte;
  apontamento?: string;
  operador: string;
  /** horas de máquina estimadas para o job */
  horas: number;
  entrada: Date;
  prazo: Date;
  tiragem: number;
};

/**
 * Prazo prometido ao cliente.
 *
 * Sai da página de ajuda da loja — 3 dias para item de catálogo, 10 a 15 para
 * personalizado. Não é estimativa de produção, é a promessa que a OS tem que
 * cumprir; é justamente por isso que ela pode estourar, e é o estouro que o
 * quadro precisa mostrar.
 *
 * Tiragem alta não é proporcionalmente mais lenta — a preparação domina o
 * tempo —, então a faixa do personalizado cresce devagar.
 */
function prazoEmDias(tiragem: number, canal: string): number {
  if (canal !== "B2B") return 3;
  return tiragem >= 2000 ? 15 : tiragem >= 1000 ? 13 : tiragem >= 300 ? 12 : 10;
}

function horasDeMaquina(tiragem: number): number {
  /* acerto de máquina custa fixo; a tiragem entra depois, e rasa */
  return Math.round((1.5 + Math.pow(tiragem, 0.42) / 3) * 10) / 10;
}

function gerarJobs(): Job[] {
  const r = semente("producao-fullprint");
  const naEsteira = PEDIDOS.filter((p) => p.status === "novo" || p.status === "producao");

  return naEsteira.map((pedido, i) => {
    const tiragem = pedido.itens.reduce((s, it) => s + it.qtd, 0);
    const prazo = new Date(pedido.data);
    prazo.setDate(prazo.getDate() + prazoEmDias(tiragem, pedido.canal));
    prazo.setHours(18, 0, 0, 0);

    /* pedido novo ainda está na conferência; em produção já andou na esteira */
    const e = r();
    const etapa: EtapaProducao =
      pedido.status === "novo"
        ? "pre"
        : e < 0.1
          ? "pre"
          : e < 0.4
            ? "impressao"
            : e < 0.75
              ? "acabamento"
              : "expedicao";

    /* a regra física: máquina só roda com arte liberada */
    const a = r();
    const arte: StatusArte =
      etapa === "pre"
        ? a < 0.34
          ? "pendente"
          : a < 0.62
            ? "analise"
            : a < 0.82
              ? "ajuste"
              : "aprovada"
        : "aprovada";

    const candidatas = MAQUINAS.filter((m) => m.etapa === etapa);
    const escolhida = escolher(r, candidatas);

    return {
      os: `OS-${String(2600 + i).padStart(4, "0")}`,
      pedido,
      etapa,
      maquina: escolhida.id,
      arte,
      apontamento: arte === "ajuste" ? escolher(r, APONTAMENTOS) : undefined,
      operador: escolher(r, OPERADORES),
      horas: horasDeMaquina(tiragem),
      entrada: pedido.data,
      prazo,
      tiragem,
    };
  });
}

export const JOBS = gerarJobs();

/* ------------------------------------------------------------- consultas */

/**
 * A OS de um pedido, quando ele está na esteira.
 *
 * É o que deixa a tela de Pedidos mostrar a situação da arte sem repetir a
 * regra: pedido entregue ou cancelado não tem OS aberta e devolve `undefined`.
 */
const POR_PEDIDO = new Map(JOBS.map((j) => [j.pedido.id, j]));
export const jobDoPedido = (id: string) => POR_PEDIDO.get(id);

/**
 * Dias até o prazo. Negativo = atrasado.
 *
 * Conta em dia de calendário, não em horas. O prazo vence às 18h, e subtrair
 * os instantes crus dava −0,25 dia para uma OS que estourou ontem — o
 * arredondamento devolvia 0 e o quadro dizia "vence hoje" para algo já
 * atrasado. Zerar a hora dos dois lados resolve.
 */
const soData = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export const diasDePrazo = (j: Job) =>
  Math.round((soData(j.prazo) - soData(HOJE)) / 86_400_000);

export const atrasados = () =>
  JOBS.filter((j) => diasDePrazo(j) < 0).sort((a, b) => diasDePrazo(a) - diasDePrazo(b));

/** Vence hoje ou amanhã — o que decide a ordem do dia. */
export const noLimite = () => JOBS.filter((j) => diasDePrazo(j) >= 0 && diasDePrazo(j) <= 1);

export const arteTravada = () =>
  JOBS.filter((j) => j.arte === "pendente" || j.arte === "ajuste");

export const jobsDaEtapa = (etapa: EtapaProducao) =>
  JOBS.filter((j) => j.etapa === etapa).sort((a, b) => diasDePrazo(a) - diasDePrazo(b));

/**
 * Carga por máquina: horas na fila contra a capacidade de um dia.
 * Acima de 100% a máquina não fecha o dia — é o alerta que interessa.
 */
export const cargaPorMaquina = () =>
  MAQUINAS.map((m) => {
    const fila = JOBS.filter((j) => j.maquina === m.id);
    const horas = Math.round(fila.reduce((s, j) => s + j.horas, 0) * 10) / 10;
    return {
      id: m.id as MaquinaId,
      nome: m.nome,
      etapa: m.etapa as EtapaProducao,
      jobs: fila.length,
      horas,
      capacidade: m.capacidade,
      ocupacao: Math.round((horas / m.capacidade) * 100),
    };
  }).sort((a, b) => b.ocupacao - a.ocupacao);

/** Entregas previstas por dia nos próximos dias — a curva de saída. */
export const entregasPrevistas = (dias = 10) => {
  const serie: { data: Date; qtd: number }[] = [];
  for (let d = 0; d < dias; d++) {
    const dia = new Date(HOJE);
    dia.setDate(dia.getDate() + d);
    serie.push({
      data: dia,
      qtd: JOBS.filter(
        (j) =>
          j.prazo.getDate() === dia.getDate() &&
          j.prazo.getMonth() === dia.getMonth() &&
          j.prazo.getFullYear() === dia.getFullYear(),
      ).length,
    });
  }
  return serie;
};

export const horasNaEsteira = () =>
  Math.round(JOBS.reduce((s, j) => s + j.horas, 0) * 10) / 10;

export const ocupacaoGeral = () => {
  const cap = MAQUINAS.reduce((s, m) => s + m.capacidade, 0);
  return Math.round((horasNaEsteira() / cap) * 100);
};
