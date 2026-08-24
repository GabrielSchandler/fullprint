"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BuscaGlobal } from "@/components/painel/BuscaGlobal";
import { Logo } from "@/components/marca/Logo";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { estoqueCritico, PEDIDOS } from "@/lib/painel-dados";
import { arteTravada, atrasados } from "@/lib/producao";

type Item = { href: string; rotulo: string; icone: NomeIcone | string; sino?: number };

const GRUPOS: { titulo: string; itens: Item[] }[] = [
  {
    titulo: "Visão geral",
    itens: [
      { href: "/painel", rotulo: "Dashboard", icone: "grade" },
      { href: "/painel/relatorios", rotulo: "Relatórios", icone: "grafico" },
    ],
  },
  {
    titulo: "Vendas",
    itens: [
      { href: "/painel/pedidos", rotulo: "Pedidos", icone: "sacola" },
      { href: "/painel/clientes", rotulo: "Clientes", icone: "pessoas" },
      { href: "/painel/b2b", rotulo: "Orçamentos B2B", icone: "predio" },
    ],
  },
  {
    titulo: "Produção",
    itens: [{ href: "/painel/producao", rotulo: "Esteira", icone: "raio" }],
  },
  {
    titulo: "Catálogo",
    itens: [
      { href: "/painel/produtos", rotulo: "Produtos", icone: "etiqueta" },
      { href: "/painel/categorias", rotulo: "Categorias e coleções", icone: "caixa" },
      { href: "/painel/estoque", rotulo: "Estoque", icone: "caixa" },
    ],
  },
  {
    titulo: "Marketing",
    itens: [
      { href: "/painel/cupons", rotulo: "Cupons", icone: "cupom" },
      { href: "/painel/promocoes", rotulo: "Promoções", icone: "presente" },
    ],
  },
  {
    titulo: "Financeiro",
    itens: [{ href: "/painel/financeiro", rotulo: "Financeiro", icone: "carteira" }],
  },
  {
    titulo: "Sistema",
    itens: [{ href: "/painel/configuracoes", rotulo: "Configurações", icone: "engrenagem" }],
  },
];

const TITULOS: Record<string, string> = {
  "/painel": "Dashboard",
  "/painel/relatorios": "Relatórios",
  "/painel/pedidos": "Pedidos",
  "/painel/clientes": "Clientes",
  "/painel/b2b": "Orçamentos B2B",
  "/painel/producao": "Produção",
  "/painel/produtos": "Produtos",
  "/painel/categorias": "Categorias e coleções",
  "/painel/estoque": "Estoque",
  "/painel/cupons": "Cupons",
  "/painel/promocoes": "Promoções",
  "/painel/financeiro": "Financeiro",
  "/painel/configuracoes": "Configurações",
};

function Notificacoes({ fechar }: { fechar: () => void }) {
  const criticos = estoqueCritico();
  const novos = PEDIDOS.filter((p) => p.status === "novo");

  const emAtraso = atrasados();
  const travadas = arteTravada();

  /* aviso de contagem zero é ruído — "0 OS passaram do prazo" ocupa a mesma
     linha de um alerta de verdade e treina quem usa a ignorar o sino */
  const avisos = [
    ...(emAtraso.length
      ? [
          {
            icone: "relogio",
            tom: "text-erro",
            titulo: `${emAtraso.length} ${emAtraso.length === 1 ? "OS passou" : "OS passaram"} do prazo`,
            texto: `A mais antiga é a ${emAtraso[0].os}, de ${emAtraso[0].pedido.cliente}.`,
            href: "/painel/producao",
          },
        ]
      : []),
    ...(travadas.length
      ? [
          {
            icone: "papel",
            tom: "text-alerta",
            titulo: `${travadas.length} ${travadas.length === 1 ? "OS presa" : "OS presas"} na conferência de arte`,
            texto: "A máquina não roda sem o arquivo liberado — o atendimento resolve.",
            href: "/painel/producao",
          },
        ]
      : []),
    {
      icone: "sacola",
      tom: "text-info",
      titulo: `${novos.length} pedidos aguardando produção`,
      texto: "Entraram nas últimas 48 horas e ainda não foram para a esteira.",
      href: "/painel/pedidos",
    },
    {
      icone: "alerta",
      tom: "text-alerta",
      titulo: `${criticos.length} itens no estoque mínimo`,
      texto: `Começando por ${criticos[0]?.nome ?? "—"}.`,
      href: "/painel/estoque",
    },
    {
      icone: "predio",
      tom: "text-magenta",
      titulo: "3 orçamentos B2B parados há mais de 7 dias",
      texto: "Aurora Tecnologia, Studio Norte e Hotel Alvorada.",
      href: "/painel/b2b",
    },
    {
      icone: "carteira",
      tom: "text-erro",
      titulo: "2 contas a pagar vencidas",
      texto: "Confira em Financeiro antes do fechamento do mês.",
      href: "/painel/financeiro",
    },
  ];

  return (
    <>
      <button className="fixed inset-0 z-40 cursor-default" onClick={fechar} aria-label="Fechar" />
      <div className="absolute top-full right-0 z-50 mt-2 w-[min(380px,90vw)] overflow-hidden rounded-xl border border-linha bg-surface shadow-papel-alta">
        <div className="flex items-center justify-between border-b border-linha px-5 py-3.5">
          <p className="text-sm font-semibold">Notificações</p>
          <span className="spec text-mute-2">{avisos.length} novas</span>
        </div>
        <ul className="divide-y divide-linha">
          {avisos.map((a) => (
            <li key={a.titulo}>
              <Link
                href={a.href}
                onClick={fechar}
                className="flex gap-3 px-5 py-3.5 transition-colors hover:bg-papel"
              >
                <Icone nome={a.icone} className={`mt-0.5 size-4 shrink-0 ${a.tom}`} />
                <div>
                  <p className="text-[0.8125rem] font-medium">{a.titulo}</p>
                  <p className="mt-0.5 text-[0.75rem] leading-relaxed text-mute">{a.texto}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Casca({ children }: { children: React.ReactNode }) {
  const rota = usePathname();
  const [aberto, setAberto] = useState(false);
  const [sino, setSino] = useState(false);

  /* fecha menu e notificações na troca de rota — ajuste durante o render */
  const [rotaAnterior, setRotaAnterior] = useState(rota);
  if (rota !== rotaAnterior) {
    setRotaAnterior(rota);
    setAberto(false);
    setSino(false);
  }

  const titulo = TITULOS[rota] ?? "Painel";
  const pendentes = PEDIDOS.filter((p) => p.status === "novo").length;
  const criticos = estoqueCritico().length;

  const emAtraso = atrasados().length;

  const contador = (href: string) =>
    href === "/painel/pedidos"
      ? pendentes
      : href === "/painel/estoque"
        ? criticos
        : href === "/painel/producao"
          ? emAtraso
          : 0;

  /* atraso de produção é o único vermelho da barra — prazo estourado não
     divide atenção com aviso de reposição */
  const tomDoContador = (href: string) =>
    href === "/painel/producao"
      ? "bg-erro text-white"
      : href === "/painel/estoque"
        ? "bg-alerta text-white"
        : "bg-magenta text-white";

  const navegacao = (
    <nav className="flex-1 overflow-y-auto px-3 py-5">
      {GRUPOS.map((g) => (
        <div key={g.titulo} className="mb-5">
          <p className="spec px-3 pb-2 text-[0.5625rem] text-papel/35">{g.titulo}</p>
          <ul className="space-y-0.5">
            {g.itens.map((i) => {
              const ativo = rota === i.href;
              const n = contador(i.href);
              return (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.8125rem] transition-colors ${
                      ativo
                        ? "bg-white/10 font-medium text-papel"
                        : "text-papel/60 hover:bg-white/5 hover:text-papel/90"
                    }`}
                  >
                    <Icone nome={i.icone} className="size-4 shrink-0" />
                    <span className="flex-1 truncate">{i.rotulo}</span>
                    {n > 0 && (
                      <span
                        className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[0.625rem] font-semibold tabular ${tomDoContador(i.href)}`}
                      >
                        {n}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-papel">
      {/* ------------------------------------------------------- sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[248px] flex-col bg-noite lg:flex">
        <div className="flex h-16 items-center border-b border-white/8 px-5">
          <Link href="/painel">
            <Logo variante="inline" fundo="escuro" />
          </Link>
        </div>
        {navegacao}
        <div className="border-t border-white/8 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.8125rem] text-papel/60 transition-colors hover:bg-white/5 hover:text-papel/90"
          >
            <Icone nome="olho" className="size-4" />
            Ver a loja
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-magenta text-[0.6875rem] font-semibold text-white">
              MA
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8125rem] font-medium text-papel">Marcel</p>
              <p className="spec text-[0.5625rem] text-papel/40">Administrador</p>
            </div>
            <Link
              href="/entrar"
              aria-label="Sair do painel"
              title="Sair"
              className="shrink-0 text-papel/40 transition-colors hover:text-papel"
            >
              <Icone nome="sair" className="size-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* -------------------------------------------------- sidebar mobile */}
      {aberto && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            className="absolute inset-0 cursor-default bg-tinta/50"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
          />
          <aside className="relative flex h-full w-[280px] flex-col bg-noite">
            <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
              <Logo variante="inline" fundo="escuro" />
              <button onClick={() => setAberto(false)} className="text-papel/60">
                <Icone nome="fechar" />
              </button>
            </div>
            {navegacao}
          </aside>
        </div>
      )}

      {/* ------------------------------------------------------ conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[248px]">
        <header className="sticky top-0 z-40 border-b border-linha bg-papel/92 backdrop-blur-md">
          <div className="flex h-16 items-center gap-4 px-5 lg:px-8">
            <button
              onClick={() => setAberto(true)}
              className="grid size-9 place-items-center rounded-lg hover:bg-papel-2 lg:hidden"
              aria-label="Abrir menu"
            >
              <Icone nome="menu" />
            </button>

            <div className="min-w-0">
              {/* some no celular: quebrava em duas linhas e espremia o título */}
              <p className="spec hidden truncate text-mute-2 sm:block">Full Print · Painel</p>
              <p className="truncate text-[0.9375rem] font-semibold">{titulo}</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <BuscaGlobal />

              <div className="relative">
                <button
                  onClick={() => setSino((v) => !v)}
                  className="relative grid size-10 place-items-center rounded-full hover:bg-papel-2"
                  aria-label="Notificações"
                >
                  <Icone nome="sino" />
                  <span className="absolute top-2 right-2.5 size-2 rounded-full bg-magenta ring-2 ring-papel" />
                </button>
                {sino && <Notificacoes fechar={() => setSino(false)} />}
              </div>

              <span className="grid size-9 place-items-center rounded-full bg-tinta text-[0.6875rem] font-semibold text-papel lg:hidden">
                MA
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
