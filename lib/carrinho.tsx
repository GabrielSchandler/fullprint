"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { PRODUTOS, porSku, type Produto } from "./catalogo";

/**
 * Carrinho do protótipo — Context + localStorage.
 *
 * Sem backend de propósito: o objetivo desta fase é apresentar a jornada,
 * não persistir venda. Quando entrar Mercado Pago, este módulo vira a
 * camada de leitura de um carrinho servido pelo servidor.
 */

export type ItemCarrinho = {
  sku: string;
  qtd: number;
  variacao?: string;
};

export type ItemResolvido = ItemCarrinho & {
  produto: Produto;
  subtotal: number;
};

export type Cupom = {
  codigo: string;
  tipo: "percentual" | "valor" | "frete";
  valor: number;
  descricao: string;
  minimo?: number;
};

export const CUPONS: Cupom[] = [
  {
    codigo: "PRIMEIRACOMPRA",
    tipo: "percentual",
    valor: 10,
    descricao: "10% de desconto na primeira compra",
  },
  {
    codigo: "FRETEGRATIS",
    tipo: "frete",
    valor: 0,
    descricao: "Frete grátis acima de R$ 199",
    minimo: 199,
  },
  {
    codigo: "PAPEL50",
    tipo: "valor",
    valor: 50,
    descricao: "R$ 50 off acima de R$ 300",
    minimo: 300,
  },
  {
    codigo: "GEOMETRIA15",
    tipo: "percentual",
    valor: 15,
    descricao: "15% na coleção Geometria",
  },
];

export const FRETE_GRATIS_A_PARTIR = 199;

type Ctx = {
  itens: ItemCarrinho[];
  resolvidos: ItemResolvido[];
  qtdTotal: number;
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  cupom: Cupom | null;
  aberto: boolean;
  pronto: boolean;
  adicionar: (sku: string, qtd?: number, variacao?: string) => void;
  remover: (sku: string, variacao?: string) => void;
  mudarQtd: (sku: string, qtd: number, variacao?: string) => void;
  limpar: () => void;
  aplicarCupom: (codigo: string) => { ok: boolean; msg: string };
  tirarCupom: () => void;
  abrir: () => void;
  fechar: () => void;
};

const CarrinhoCtx = createContext<Ctx | null>(null);
const CHAVE = "fullprint:carrinho";

/** Nada muda depois da hidratação, então a assinatura é um no-op. */
const assinarHidratacao = () => () => {};

function lerDoNavegador(): { itens: ItemCarrinho[]; cupom: Cupom | null } {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) {
      /* protótipo começa com itens para a apresentação não abrir vazia */
      return {
        itens: [
          { sku: "FP-CAD-001", qtd: 1, variacao: "Pontilhado" },
          { sku: "FP-BLC-001", qtd: 2 },
        ],
        cupom: null,
      };
    }
    const dados = JSON.parse(bruto) as { itens?: ItemCarrinho[]; cupom?: string };
    return {
      itens: Array.isArray(dados.itens) ? dados.itens.filter((i) => porSku(i.sku)) : [],
      cupom: dados.cupom ? (CUPONS.find((c) => c.codigo === dados.cupom) ?? null) : null,
    };
  } catch {
    /* localStorage indisponível — segue com carrinho vazio */
    return { itens: [], cupom: null };
  }
}

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [cupom, setCupom] = useState<Cupom | null>(null);
  const [aberto, setAberto] = useState(false);
  const [pronto, setPronto] = useState(false);

  /* O servidor não tem localStorage, então ele renderiza o carrinho vazio e o
     navegador carrega o salvo logo depois da hidratação. useSyncExternalStore
     é o mecanismo que o React oferece para essa diferença: durante a
     hidratação vale o retorno do servidor (false), e no render seguinte o do
     cliente (true) — sem divergência de HTML e sem setState dentro de efeito. */
  const hidratado = useSyncExternalStore(
    assinarHidratacao,
    () => true,
    () => false,
  );

  if (hidratado && !pronto) {
    const salvo = lerDoNavegador();
    setPronto(true);
    if (salvo.itens.length) setItens(salvo.itens);
    if (salvo.cupom) setCupom(salvo.cupom);
  }

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ itens, cupom: cupom?.codigo }));
    } catch {
      /* ignora cota cheia / modo privado */
    }
  }, [itens, cupom, pronto]);

  const mesmo = (i: ItemCarrinho, sku: string, variacao?: string) =>
    i.sku === sku && (i.variacao ?? "") === (variacao ?? "");

  const adicionar = useCallback((sku: string, qtd = 1, variacao?: string) => {
    setItens((atual) => {
      const i = atual.findIndex((it) => mesmo(it, sku, variacao));
      if (i >= 0) {
        const copia = [...atual];
        copia[i] = { ...copia[i], qtd: Math.min(copia[i].qtd + qtd, 99) };
        return copia;
      }
      return [...atual, { sku, qtd, variacao }];
    });
    setAberto(true);
  }, []);

  const remover = useCallback((sku: string, variacao?: string) => {
    setItens((atual) => atual.filter((it) => !mesmo(it, sku, variacao)));
  }, []);

  const mudarQtd = useCallback((sku: string, qtd: number, variacao?: string) => {
    setItens((atual) =>
      qtd <= 0
        ? atual.filter((it) => !mesmo(it, sku, variacao))
        : atual.map((it) =>
            mesmo(it, sku, variacao) ? { ...it, qtd: Math.min(qtd, 99) } : it,
          ),
    );
  }, []);

  const limpar = useCallback(() => {
    setItens([]);
    setCupom(null);
  }, []);

  const resolvidos = useMemo<ItemResolvido[]>(
    () =>
      itens.flatMap((i) => {
        const produto = porSku(i.sku);
        if (!produto) return [];
        return [{ ...i, produto, subtotal: produto.preco * i.qtd }];
      }),
    [itens],
  );

  const subtotal = useMemo(
    () => resolvidos.reduce((s, i) => s + i.subtotal, 0),
    [resolvidos],
  );
  const qtdTotal = useMemo(() => resolvidos.reduce((s, i) => s + i.qtd, 0), [resolvidos]);

  const desconto = useMemo(() => {
    if (!cupom) return 0;
    if (cupom.minimo && subtotal < cupom.minimo) return 0;
    if (cupom.tipo === "percentual") {
      if (cupom.codigo === "GEOMETRIA15") {
        const base = resolvidos
          .filter((i) => i.produto.colecao === "geometria")
          .reduce((s, i) => s + i.subtotal, 0);
        return Math.round(base * (cupom.valor / 100) * 100) / 100;
      }
      return Math.round(subtotal * (cupom.valor / 100) * 100) / 100;
    }
    if (cupom.tipo === "valor") return Math.min(cupom.valor, subtotal);
    return 0;
  }, [cupom, subtotal, resolvidos]);

  const frete = useMemo(() => {
    if (subtotal === 0) return 0;
    if (cupom?.tipo === "frete" && (!cupom.minimo || subtotal >= cupom.minimo)) return 0;
    if (subtotal >= FRETE_GRATIS_A_PARTIR) return 0;
    return 24.9;
  }, [subtotal, cupom]);

  const total = Math.max(0, subtotal - desconto) + frete;

  const aplicarCupom = useCallback(
    (codigo: string) => {
      const achado = CUPONS.find(
        (c) => c.codigo.toLowerCase() === codigo.trim().toLowerCase(),
      );
      if (!achado) return { ok: false, msg: "Cupom não encontrado." };
      if (achado.minimo && subtotal < achado.minimo) {
        return {
          ok: false,
          msg: `Este cupom vale a partir de R$ ${achado.minimo.toFixed(2).replace(".", ",")}.`,
        };
      }
      setCupom(achado);
      return { ok: true, msg: achado.descricao };
    },
    [subtotal],
  );

  const valor = useMemo<Ctx>(
    () => ({
      itens,
      resolvidos,
      qtdTotal,
      subtotal,
      desconto,
      frete,
      total,
      cupom,
      aberto,
      pronto,
      adicionar,
      remover,
      mudarQtd,
      limpar,
      aplicarCupom,
      tirarCupom: () => setCupom(null),
      abrir: () => setAberto(true),
      fechar: () => setAberto(false),
    }),
    [
      itens, resolvidos, qtdTotal, subtotal, desconto, frete, total, cupom,
      aberto, pronto, adicionar, remover, mudarQtd, limpar, aplicarCupom,
    ],
  );

  return <CarrinhoCtx.Provider value={valor}>{children}</CarrinhoCtx.Provider>;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoCtx);
  if (!ctx) throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
  return ctx;
}

/** Sugestão de "compre junto" — itens da mesma coleção fora do carrinho. */
export function sugestoes(itens: ItemCarrinho[], qtd = 3): Produto[] {
  const dentro = new Set(itens.map((i) => i.sku));
  const colecoes = new Set(
    itens.map((i) => porSku(i.sku)?.colecao).filter(Boolean) as string[],
  );
  const mesmas = PRODUTOS.filter((p) => !dentro.has(p.sku) && colecoes.has(p.colecao));
  const resto = PRODUTOS.filter((p) => !dentro.has(p.sku) && !colecoes.has(p.colecao));
  return [...mesmas, ...resto].slice(0, qtd);
}
