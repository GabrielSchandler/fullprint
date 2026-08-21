"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icone } from "@/components/ui/Icone";
import { BotaoLink } from "@/components/ui/primitivos";
import { FRETE_GRATIS_A_PARTIR, sugestoes, useCarrinho } from "@/lib/carrinho";
import { brl } from "@/lib/format";
import { fundoDoProduto } from "./ProdutoCard";
import { FotoProduto } from "@/components/loja/FotoProduto";

export function GavetaCarrinho() {
  const {
    aberto, fechar, resolvidos, subtotal, desconto, frete, total, qtdTotal,
    mudarQtd, remover, adicionar, itens,
  } = useCarrinho();

  useEffect(() => {
    if (!aberto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const f = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", f);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener("keydown", f);
    };
  }, [aberto, fechar]);

  if (!aberto) return null;

  const falta = Math.max(0, FRETE_GRATIS_A_PARTIR - subtotal);
  const progresso = Math.min(100, (subtotal / FRETE_GRATIS_A_PARTIR) * 100);
  const extras = sugestoes(itens, 2);

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar carrinho"
      />

      <aside className="absolute top-0 right-0 flex h-full w-[min(460px,100vw)] flex-col bg-papel shadow-papel-alta">
        <header className="flex items-center justify-between border-b border-linha px-5 py-4">
          <div>
            <h2 className="font-display text-2xl leading-none">Seu carrinho</h2>
            <p className="spec mt-1.5 text-mute-2">
              {qtdTotal} {qtdTotal === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        {resolvidos.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <Icone nome="sacola" className="size-10 text-mute-2" />
            <p className="text-sm text-mute">
              Seu carrinho está vazio. Comece pelos cadernos — é por onde a maioria começa.
            </p>
            <BotaoLink href="/produtos" onClick={fechar} tom="tinta" tamanho="sm">
              Ver catálogo
            </BotaoLink>
          </div>
        ) : (
          <>
            <div className="border-b border-linha bg-surface px-5 py-3">
              {falta > 0 ? (
                <p className="text-[0.8125rem] text-mute">
                  Faltam <strong className="font-semibold text-tinta tabular">{brl(falta)}</strong>{" "}
                  para o frete sair de graça
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-ok">
                  <Icone nome="check" className="size-4" />
                  Frete grátis liberado
                </p>
              )}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-papel-3">
                <div
                  className="h-full rounded-full bg-magenta transition-[width] duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-linha overflow-y-auto px-5">
              {resolvidos.map((i) => (
                <li key={i.sku + (i.variacao ?? "")} className="flex gap-4 py-4">
                  <Link
                    href={`/produto/${i.produto.slug}`}
                    onClick={fechar}
                    className="size-22 shrink-0 overflow-hidden rounded-lg border border-linha"
                    style={{ background: fundoDoProduto(i.produto.paleta) }}
                  >
                    <FotoProduto produto={i.produto} className="size-full" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/produto/${i.produto.slug}`}
                        onClick={fechar}
                        className="text-sm font-medium hover:text-magenta-forte"
                      >
                        {i.produto.nome}
                      </Link>
                      <button
                        onClick={() => remover(i.sku, i.variacao)}
                        className="shrink-0 text-mute-2 hover:text-erro"
                        aria-label={`Remover ${i.produto.nome}`}
                      >
                        <Icone nome="lixeira" className="size-4" />
                      </button>
                    </div>
                    <p className="spec mt-1 text-mute-2">
                      {i.produto.sku}
                      {i.variacao ? ` · ${i.variacao}` : ""}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-linha bg-surface">
                        <button
                          onClick={() => mudarQtd(i.sku, i.qtd - 1, i.variacao)}
                          className="grid size-8 place-items-center rounded-full hover:bg-papel-2"
                          aria-label="Diminuir"
                        >
                          <Icone nome="menos" className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm tabular">{i.qtd}</span>
                        <button
                          onClick={() => mudarQtd(i.sku, i.qtd + 1, i.variacao)}
                          className="grid size-8 place-items-center rounded-full hover:bg-papel-2"
                          aria-label="Aumentar"
                        >
                          <Icone nome="mais" className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold tabular">{brl(i.subtotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {extras.length > 0 && (
              <div className="border-t border-linha bg-surface px-5 py-4">
                <p className="spec text-mute-2">Combina com o seu pedido</p>
                <ul className="mt-3 space-y-2.5">
                  {extras.map((p) => (
                    <li key={p.sku} className="flex items-center gap-3">
                      <div
                        className="size-11 shrink-0 overflow-hidden rounded-md border border-linha"
                        style={{ background: fundoDoProduto(p.paleta) }}
                      >
                        <FotoProduto produto={p} className="size-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.8125rem] font-medium">{p.nome}</p>
                        <p className="text-[0.75rem] text-mute tabular">{brl(p.preco)}</p>
                      </div>
                      <button
                        onClick={() => adicionar(p.sku)}
                        className="spec rounded-full border border-linha px-2.5 py-1.5 hover:border-tinta"
                      >
                        + Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <footer className="border-t border-linha bg-papel px-5 py-4">
              <dl className="space-y-1.5 text-[0.8125rem]">
                <div className="flex justify-between">
                  <dt className="text-mute">Subtotal</dt>
                  <dd className="tabular">{brl(subtotal)}</dd>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between text-ok">
                    <dt>Desconto</dt>
                    <dd className="tabular">−{brl(desconto)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-mute">Frete</dt>
                  <dd className="tabular">{frete === 0 ? "Grátis" : brl(frete)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-linha pt-2.5">
                  <dt className="font-medium">Total</dt>
                  <dd className="text-lg font-semibold tabular">{brl(total)}</dd>
                </div>
              </dl>

              <BotaoLink
                href="/checkout"
                onClick={fechar}
                tom="tinta"
                tamanho="lg"
                className="mt-4 w-full"
              >
                Finalizar compra
                <Icone nome="seta" className="size-4" />
              </BotaoLink>
              <button
                onClick={fechar}
                className="mt-2 w-full py-2 text-[0.8125rem] text-mute hover:text-tinta"
              >
                Continuar comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
