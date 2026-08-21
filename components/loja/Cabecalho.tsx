"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/marca/Logo";
import { Icone } from "@/components/ui/Icone";
import { CATEGORIAS, COLECOES, PRODUTOS, porCategoria } from "@/lib/catalogo";
import { brl } from "@/lib/format";
import { useCarrinho } from "@/lib/carrinho";
import { fundoDoProduto } from "./ProdutoCard";
import { FotoProduto } from "@/components/loja/FotoProduto";

const AVISOS = [
  "Frete grátis em compras acima de R$ 199",
  "Produção própria em Guarulhos · envio em até 3 dias úteis",
  "Personalização com a sua marca a partir de 50 unidades",
];

function BarraAviso() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % AVISOS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-tinta text-papel">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center px-5">
        <p key={i} className="spec sobe text-center text-[0.625rem] text-papel/85">
          {AVISOS[i]}
        </p>
      </div>
    </div>
  );
}

function MegaMenu({ id }: { id: (typeof CATEGORIAS)[number]["id"] }) {
  const cat = CATEGORIAS.find((c) => c.id === id)!;
  const itens = porCategoria(id).slice(0, 2);

  return (
    <div className="absolute top-full left-0 z-40 w-full pt-px">
      <div className="border-t border-linha bg-surface shadow-papel-alta">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-10 px-5 py-9">
          <div className="col-span-3">
            <p className="spec text-magenta-forte">{cat.nome}</p>
            <p className="mt-3 text-sm leading-relaxed text-mute">{cat.resumo}</p>
            <Link
              href={`/produtos?categoria=${cat.id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
            >
              Ver tudo em {cat.nome}
              <Icone nome="seta" className="size-3.5" />
            </Link>
          </div>

          <div className="col-span-3">
            <p className="spec text-mute-2">Linhas</p>
            <ul className="mt-3 space-y-2">
              {cat.sub.map((s) => (
                <li key={s}>
                  <Link
                    href={`/produtos?categoria=${cat.id}&linha=${encodeURIComponent(s)}`}
                    className="text-sm text-tinta/80 hover:text-magenta-forte"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="spec mt-6 text-mute-2">Coleções</p>
            <ul className="mt-3 space-y-2">
              {COLECOES.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/colecao/${c.id}`}
                    className="text-sm text-tinta/80 hover:text-magenta-forte"
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 grid grid-cols-2 gap-5">
            {itens.map((p) => (
              <Link key={p.sku} href={`/produto/${p.slug}`} className="group flex gap-4">
                <div
                  className="size-24 shrink-0 overflow-hidden rounded-lg border border-linha"
                  style={{ background: fundoDoProduto(p.paleta) }}
                >
                  <FotoProduto produto={p} className="size-full transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="min-w-0 pt-1">
                  <p className="spec text-mute-2">{p.sub}</p>
                  <p className="mt-1 text-sm font-medium group-hover:text-magenta-forte">
                    {p.nome}
                  </p>
                  <p className="mt-1 text-sm tabular">{brl(p.preco)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Busca({ fechar }: { fechar: () => void }) {
  const [q, setQ] = useState("");
  const achados = q.trim().length > 1
    ? PRODUTOS.filter((p) =>
        (p.nome + " " + p.resumo + " " + p.sub)
          .toLowerCase()
          .includes(q.trim().toLowerCase()),
      ).slice(0, 6)
    : [];

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        className="absolute inset-0 cursor-default bg-tinta/35 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar busca"
      />
      <div className="relative mx-auto mt-24 w-[min(680px,92vw)] overflow-hidden rounded-2xl border border-linha bg-surface shadow-papel-alta">
        <div className="flex items-center gap-3 border-b border-linha px-5">
          <Icone nome="busca" className="size-5 text-mute" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar caderno, planner, adesivo…"
            className="h-16 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-mute-2"
          />
          <button onClick={fechar} className="spec text-mute-2 hover:text-tinta">
            Esc
          </button>
        </div>
        {achados.length > 0 ? (
          <ul className="max-h-[52vh] overflow-y-auto p-2">
            {achados.map((p) => (
              <li key={p.sku}>
                <Link
                  href={`/produto/${p.slug}`}
                  onClick={fechar}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-papel"
                >
                  <div
                    className="size-12 shrink-0 overflow-hidden rounded-md border border-linha"
                    style={{ background: fundoDoProduto(p.paleta) }}
                  >
                    <FotoProduto produto={p} className="size-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.nome}</p>
                    <p className="spec text-mute-2">{p.sub}</p>
                  </div>
                  <span className="text-sm tabular">{brl(p.preco)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-6">
            <p className="spec text-mute-2">Buscas frequentes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Planner 2027", "Caderno capa dura", "Cartão de visita", "Adesivo", "Caixa-berço"].map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setQ(t)}
                    className="rounded-full border border-linha px-3 py-1.5 text-[0.8125rem] text-mute hover:border-tinta hover:text-tinta"
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Cabecalho() {
  const { qtdTotal, abrir, pronto } = useCarrinho();
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [rolou, setRolou] = useState(false);
  const rota = usePathname();

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  /* fecha tudo quando a rota muda — ajuste durante o render, que o React
     aplica antes de pintar, em vez de efeito com setState em cascata */
  const [rotaAnterior, setRotaAnterior] = useState(rota);
  if (rota !== rotaAnterior) {
    setRotaAnterior(rota);
    setMobile(false);
    setMenuAberto(null);
    setBuscaAberta(false);
  }

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBuscaAberta(false);
        setMobile(false);
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setBuscaAberta(true);
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  const principais = CATEGORIAS.slice(0, 5);

  return (
    <>
      <BarraAviso />

      <header
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          rolou ? "shadow-[0_1px_0_rgb(28_27_26/0.08)]" : ""
        }`}
        onMouseLeave={() => setMenuAberto(null)}
      >
        <div className="border-b border-linha bg-papel/92 backdrop-blur-md">
          <div className="mx-auto flex h-18 max-w-[1400px] items-center gap-6 px-5">
            <button
              className="grid size-9 place-items-center lg:hidden"
              onClick={() => setMobile((v) => !v)}
              aria-label="Abrir menu"
            >
              <Icone nome={mobile ? "fechar" : "menu"} />
            </button>

            <Link href="/" aria-label="Full Print — início" className="shrink-0">
              <Logo variante="inline" assinatura />
            </Link>

            <nav className="ml-4 hidden items-center gap-1 lg:flex">
              {principais.map((c) => (
                <Link
                  key={c.id}
                  href={`/produtos?categoria=${c.id}`}
                  onMouseEnter={() => setMenuAberto(c.id)}
                  className={`rounded-full px-3 py-2 text-[0.8125rem] font-medium transition-colors ${
                    menuAberto === c.id ? "bg-papel-2 text-tinta" : "text-tinta/75 hover:text-tinta"
                  }`}
                >
                  {c.nome}
                </Link>
              ))}
              <Link
                href="/produtos"
                onMouseEnter={() => setMenuAberto(null)}
                className="rounded-full px-3 py-2 text-[0.8125rem] font-medium text-tinta/75 hover:text-tinta"
              >
                Tudo
              </Link>
              <Link
                href="/empresas"
                onMouseEnter={() => setMenuAberto(null)}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-magenta/30 bg-magenta-claro px-3 py-2 text-[0.8125rem] font-medium text-magenta-forte transition-colors hover:bg-magenta hover:text-white"
              >
                <Icone nome="predio" className="size-3.5" />
                Para empresas
              </Link>
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setBuscaAberta(true)}
                className="grid size-10 place-items-center rounded-full text-tinta/80 hover:bg-papel-2 hover:text-tinta"
                aria-label="Buscar"
              >
                <Icone nome="busca" />
              </button>
              <Link
                href="/entrar"
                className="hidden size-10 place-items-center rounded-full text-tinta/80 hover:bg-papel-2 hover:text-tinta sm:grid"
                aria-label="Entrar no painel"
                title="Entrar no painel"
              >
                <Icone nome="usuario" />
              </Link>
              <button
                onClick={abrir}
                className="relative grid size-10 place-items-center rounded-full text-tinta/80 hover:bg-papel-2 hover:text-tinta"
                aria-label="Abrir carrinho"
              >
                <Icone nome="sacola" />
                {pronto && qtdTotal > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid size-[18px] place-items-center rounded-full bg-magenta text-[0.625rem] font-semibold text-white tabular">
                    {qtdTotal}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {menuAberto && (
          <div onMouseEnter={() => setMenuAberto(menuAberto)}>
            <MegaMenu id={menuAberto as (typeof CATEGORIAS)[number]["id"]} />
          </div>
        )}

        {mobile && (
          <div className="border-b border-linha bg-surface lg:hidden">
            <nav className="mx-auto max-w-[1400px] px-5 py-4">
              <ul className="divide-y divide-linha">
                {CATEGORIAS.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/produtos?categoria=${c.id}`}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      {c.nome}
                      <Icone nome="chevron" className="size-4 text-mute-2" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/produtos" className="flex items-center justify-between py-3 text-sm">
                    Ver tudo
                    <Icone nome="chevron" className="size-4 text-mute-2" />
                  </Link>
                </li>
              </ul>
              <Link
                href="/empresas"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-magenta px-4 py-3 text-sm font-medium text-white"
              >
                <Icone nome="predio" className="size-4" />
                Personalizar para minha empresa
              </Link>
            </nav>
          </div>
        )}
      </header>

      {buscaAberta && <Busca fechar={() => setBuscaAberta(false)} />}
    </>
  );
}
