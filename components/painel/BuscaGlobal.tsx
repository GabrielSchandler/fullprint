"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { PRODUTOS } from "@/lib/catalogo";
import { brl, data, num } from "@/lib/format";
import { CLIENTES, ORCAMENTOS, PEDIDOS, STATUS_PEDIDO } from "@/lib/painel-dados";

/**
 * Busca global do painel (⌘K).
 *
 * Um só campo para pedido, produto, cliente, orçamento e navegação — é como
 * quem opera o painel o dia inteiro trabalha: sabe o número do pedido, não
 * lembra em que tela ele está.
 *
 * A busca roda sobre os arrays em memória; com banco de dados isto vira uma
 * chamada com debounce, mas a interface não muda.
 */

type Achado = {
  id: string;
  grupo: string;
  titulo: string;
  subtitulo: string;
  detalhe?: string;
  href: string;
  icone: NomeIcone;
};

const PAGINAS: { titulo: string; href: string; icone: NomeIcone; termos: string }[] = [
  { titulo: "Dashboard", href: "/painel", icone: "grade", termos: "visão geral início" },
  { titulo: "Relatórios", href: "/painel/relatorios", icone: "grafico", termos: "análise ranking praça" },
  { titulo: "Pedidos", href: "/painel/pedidos", icone: "sacola", termos: "vendas esteira produção" },
  { titulo: "Clientes", href: "/painel/clientes", icone: "pessoas", termos: "base compradores vip" },
  { titulo: "Orçamentos B2B", href: "/painel/b2b", icone: "predio", termos: "empresa pipeline funil" },
  { titulo: "Produtos", href: "/painel/produtos", icone: "etiqueta", termos: "catálogo sku cadastro" },
  { titulo: "Categorias e coleções", href: "/painel/categorias", icone: "caixa", termos: "vitrine linha estampa" },
  { titulo: "Estoque", href: "/painel/estoque", icone: "caixa", termos: "saldo inventário reposição" },
  { titulo: "Cupons", href: "/painel/cupons", icone: "cupom", termos: "desconto código" },
  { titulo: "Promoções", href: "/painel/promocoes", icone: "presente", termos: "campanha oferta" },
  { titulo: "Financeiro", href: "/painel/financeiro", icone: "carteira", termos: "dre caixa contas receita" },
  { titulo: "Configurações", href: "/painel/configuracoes", icone: "engrenagem", termos: "ajustes equipe integração fiscal" },
];

const normalizar = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const LIMITE_GRUPO = 4;

function buscar(consulta: string): Achado[] {
  const q = normalizar(consulta.trim());
  if (!q) return [];
  const bate = (...campos: string[]) => normalizar(campos.join(" ")).includes(q);

  const pedidos = PEDIDOS.filter((p) => bate(p.id, p.cliente, p.cidade, p.uf))
    .slice(0, LIMITE_GRUPO)
    .map<Achado>((p) => ({
      id: p.id,
      grupo: "Pedidos",
      titulo: p.id,
      subtitulo: `${p.cliente} · ${p.cidade}/${p.uf}`,
      detalhe: `${brl(p.total)} · ${STATUS_PEDIDO[p.status].rotulo}`,
      href: "/painel/pedidos",
      icone: "sacola",
    }));

  const produtos = PRODUTOS.filter((p) => bate(p.nome, p.sku, p.sub))
    .slice(0, LIMITE_GRUPO)
    .map<Achado>((p) => ({
      id: p.sku,
      grupo: "Produtos",
      titulo: p.nome,
      subtitulo: `${p.sku} · ${p.sub}`,
      detalhe: `${brl(p.preco)} · ${num(p.estoque)} un`,
      href: "/painel/produtos",
      icone: "etiqueta",
    }));

  const clientes = CLIENTES.filter((c) => bate(c.nome, c.email, c.cidade))
    .slice(0, LIMITE_GRUPO)
    .map<Achado>((c) => ({
      id: c.id,
      grupo: "Clientes",
      titulo: c.nome,
      subtitulo: `${c.email} · ${c.cidade}/${c.uf}`,
      detalhe: `${num(c.pedidos)} pedidos · ${brl(c.gasto, 0)}`,
      href: "/painel/clientes",
      icone: "pessoas",
    }));

  const orcamentos = ORCAMENTOS.filter((o) => bate(o.id, o.empresa, o.peca, o.contato))
    .slice(0, LIMITE_GRUPO)
    .map<Achado>((o) => ({
      id: o.id,
      grupo: "Orçamentos B2B",
      titulo: o.empresa,
      subtitulo: `${o.id} · ${o.peca}`,
      detalhe: `${brl(o.valor, 0)} · entrega ${data(o.prazo)}`,
      href: "/painel/b2b",
      icone: "predio",
    }));

  const paginas = PAGINAS.filter((p) => bate(p.titulo, p.termos))
    .slice(0, LIMITE_GRUPO)
    .map<Achado>((p) => ({
      id: p.href,
      grupo: "Ir para",
      titulo: p.titulo,
      subtitulo: p.href,
      href: p.href,
      icone: p.icone,
    }));

  return [...pedidos, ...produtos, ...clientes, ...orcamentos, ...paginas];
}

/* ------------------------------------------------------------------ atalho */

function Tecla({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="spec rounded border border-linha bg-papel px-1.5 py-0.5 text-[0.625rem] text-mute-2">
      {children}
    </kbd>
  );
}

export function BuscaGlobal() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [indice, setIndice] = useState(0);
  const campo = useRef<HTMLInputElement>(null);

  const achados = useMemo(() => buscar(consulta), [consulta]);
  const recentes = useMemo(
    () =>
      PAGINAS.slice(0, 5).map<Achado>((p) => ({
        id: p.href,
        grupo: "Ir para",
        titulo: p.titulo,
        subtitulo: p.href,
        href: p.href,
        icone: p.icone,
      })),
    [],
  );
  const lista = consulta.trim() ? achados : recentes;

  const abrir = useCallback(() => {
    setConsulta("");
    setIndice(0);
    setAberto(true);
  }, []);

  /* ⌘K / Ctrl+K de qualquer lugar do painel */
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAberto((v) => !v);
        setConsulta("");
        setIndice(0);
      }
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  /* foca o campo quando abre — é efeito de DOM, não de estado */
  useEffect(() => {
    if (aberto) campo.current?.focus();
  }, [aberto]);

  const ir = useCallback(
    (achado: Achado) => {
      setAberto(false);
      router.push(achado.href);
    },
    [router],
  );

  const navegar = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndice((i) => (i + 1) % Math.max(lista.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndice((i) => (i - 1 + lista.length) % Math.max(lista.length, 1));
    } else if (e.key === "Enter" && lista[indice]) {
      e.preventDefault();
      ir(lista[indice]);
    }
  };

  return (
    <>
      {/* gatilho no cabeçalho */}
      <button
        onClick={abrir}
        className="hidden h-10 w-64 items-center gap-2.5 rounded-full border border-linha bg-surface pr-2 pl-3.5 text-left transition-colors hover:border-linha-forte md:flex"
      >
        <Icone nome="busca" className="size-4 shrink-0 text-mute-2" />
        <span className="flex-1 truncate text-[0.8125rem] text-mute-2">
          Buscar no painel
        </span>
        <Tecla>⌘K</Tecla>
      </button>

      <button
        onClick={abrir}
        className="grid size-10 place-items-center rounded-full hover:bg-papel-2 md:hidden"
        aria-label="Buscar no painel"
      >
        <Icone nome="busca" />
      </button>

      {aberto && (
        <div className="fixed inset-0 z-[90]">
          <button
            className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
            onClick={() => setAberto(false)}
            aria-label="Fechar busca"
          />

          <div className="relative mx-auto mt-[12vh] w-[min(680px,92vw)] overflow-hidden rounded-2xl border border-linha bg-surface shadow-papel-alta">
            <div className="flex items-center gap-3 border-b border-linha px-5">
              <Icone nome="busca" className="size-5 shrink-0 text-mute" />
              <input
                ref={campo}
                value={consulta}
                onChange={(e) => {
                  setConsulta(e.target.value);
                  setIndice(0);
                }}
                onKeyDown={navegar}
                placeholder="Pedido, produto, cliente, empresa ou tela…"
                className="h-16 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-mute-2"
              />
              <button
                onClick={() => setAberto(false)}
                className="spec text-mute-2 hover:text-tinta"
              >
                Esc
              </button>
            </div>

            {lista.length > 0 ? (
              <ul className="max-h-[56vh] overflow-y-auto p-2">
                {lista.map((a, i) => {
                  const primeiroDoGrupo = i === 0 || lista[i - 1].grupo !== a.grupo;
                  return (
                    <li key={`${a.grupo}-${a.id}`}>
                      {primeiroDoGrupo && (
                        <p className="spec px-3 pt-3 pb-1.5 text-mute-2">{a.grupo}</p>
                      )}
                      <button
                        onClick={() => ir(a)}
                        onPointerMove={() => setIndice(i)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          i === indice ? "bg-papel" : ""
                        }`}
                      >
                        <span
                          className={`grid size-8 shrink-0 place-items-center rounded-full ${
                            i === indice ? "bg-tinta text-papel" : "bg-papel-2 text-mute"
                          }`}
                        >
                          <Icone nome={a.icone} className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.8125rem] font-medium">
                            {a.titulo}
                          </span>
                          <span className="block truncate text-[0.6875rem] text-mute-2">
                            {a.subtitulo}
                          </span>
                        </span>
                        {a.detalhe && (
                          <span className="hidden shrink-0 text-[0.75rem] text-mute tabular sm:block">
                            {a.detalhe}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-[0.875rem] font-medium">
                  Nada encontrado para “{consulta}”
                </p>
                <p className="mt-1.5 text-[0.8125rem] text-mute">
                  Tente o número do pedido (FP-2026-…), um SKU, o nome do cliente ou
                  da empresa.
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 border-t border-linha px-5 py-3">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-mute-2">
                <Tecla>↑</Tecla>
                <Tecla>↓</Tecla>
                navegar
              </span>
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-mute-2">
                <Tecla>↵</Tecla>
                abrir
              </span>
              <span className="ml-auto text-[0.6875rem] text-mute-2 tabular">
                {consulta.trim() ? `${lista.length} resultados` : "Atalhos"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
