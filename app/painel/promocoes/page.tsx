"use client";

import { useState } from "react";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import {
  AvisoPrototipo,
  CabecaPagina,
  Cartao,
  Celula,
  Kpi,
  Linha,
  SeloStatus,
  Tabela,
} from "@/components/painel/ui";
import { Icone } from "@/components/ui/Icone";
import { HOJE, brl, brlCurto, data, dataCurta, num } from "@/lib/format";
import { CATEGORIAS, PRODUTOS } from "@/lib/catalogo";
import { PROMOCOES, type Promocao } from "@/lib/painel-dados";
import { FotoProduto } from "@/components/loja/FotoProduto";

const CORES = [
  "var(--color-serie-1)",
  "var(--color-serie-2)",
  "var(--color-serie-3)",
  "var(--color-serie-4)",
];

function estado(p: Promocao) {
  if (p.fim.getTime() < HOJE.getTime()) return { tom: "neutro" as const, rotulo: "Encerrada" };
  if (p.inicio.getTime() > HOJE.getTime()) return { tom: "info" as const, rotulo: "Agendada" };
  return { tom: "ok" as const, rotulo: "No ar" };
}

const entrada =
  "h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none transition-colors placeholder:text-mute-2 focus:border-tinta";

/* ---------------------------------------------------------- linha do tempo */

function LinhaDoTempo() {
  const inicio = Math.min(...PROMOCOES.map((p) => p.inicio.getTime()));
  const fim = Math.max(...PROMOCOES.map((p) => p.fim.getTime()));
  const faixa = fim - inicio;

  const posicao = (t: number) => ((t - inicio) / faixa) * 100;

  return (
    <div>
      <div className="relative">
        {/* marca do dia de hoje */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-magenta"
          style={{ left: `${posicao(HOJE.getTime())}%` }}
        >
          <span className="absolute -top-1 -left-[3px] size-1.5 rounded-full bg-magenta" />
        </div>

        <ul className="space-y-4">
          {PROMOCOES.map((p, i) => {
            const e = estado(p);
            return (
              <li key={p.nome}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="truncate text-[0.8125rem] font-medium">{p.nome}</span>
                  <span className="shrink-0 text-[0.75rem] text-mute-2 tabular">
                    {dataCurta(p.inicio)} – {dataCurta(p.fim)}
                  </span>
                </div>
                <div className="relative mt-2 h-6 rounded-md bg-papel-2/70">
                  <div
                    className="absolute inset-y-0 flex items-center rounded-md px-2.5"
                    style={{
                      left: `${posicao(p.inicio.getTime())}%`,
                      width: `${((p.fim.getTime() - p.inicio.getTime()) / faixa) * 100}%`,
                      background: CORES[i % CORES.length],
                      opacity: e.rotulo === "Encerrada" ? 0.35 : 1,
                    }}
                  >
                    <span className="truncate text-[0.6875rem] font-medium text-white">
                      {p.regra}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-linha pt-4">
        <span className="size-1.5 rounded-full bg-magenta" />
        <p className="text-[0.75rem] text-mute">
          A linha rosa marca hoje, {data(HOJE)}. Barras esmaecidas já encerraram.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- cadastro */

function NovaPromocao({ fechar }: { fechar: () => void }) {
  const [regra, setRegra] = useState("percentual");

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <div className="relative w-[min(560px,100%)] overflow-hidden rounded-2xl border border-linha bg-surface shadow-papel-alta">
        <header className="flex items-start justify-between gap-4 border-b border-linha px-6 py-5">
          <div>
            <p className="spec text-mute-2">Marketing</p>
            <h2 className="mt-1 font-display text-2xl leading-none">Nova promoção</h2>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="grid grid-cols-12 gap-4 p-6">
          <label className="col-span-12 block">
            <span className="spec text-mute-2">Nome da campanha</span>
            <input placeholder="Planners 2027 — pré-venda" className={`mt-1.5 ${entrada}`} />
          </label>

          <label className="col-span-12 block sm:col-span-6">
            <span className="spec text-mute-2">Regra</span>
            <select
              value={regra}
              onChange={(e) => setRegra(e.target.value)}
              className={`mt-1.5 ${entrada}`}
            >
              <option value="percentual">Percentual de desconto</option>
              <option value="leve">Leve 3, pague 2</option>
              <option value="brinde">Brinde na compra</option>
              <option value="progressivo">Desconto progressivo</option>
            </select>
          </label>

          <label className="col-span-12 block sm:col-span-6">
            <span className="spec text-mute-2">
              {regra === "percentual" ? "Desconto (%)" : "Parâmetro"}
            </span>
            <input placeholder={regra === "percentual" ? "10" : "3 por 2"} className={`mt-1.5 ${entrada}`} />
          </label>

          <label className="col-span-12 block">
            <span className="spec text-mute-2">Escopo</span>
            <select className={`mt-1.5 ${entrada}`}>
              <option>Todo o catálogo</option>
              {CATEGORIAS.map((c) => (
                <option key={c.id}>{c.nome}</option>
              ))}
            </select>
          </label>

          <label className="col-span-6 block">
            <span className="spec text-mute-2">Início</span>
            <input type="date" className={`mt-1.5 ${entrada}`} />
          </label>

          <label className="col-span-6 block">
            <span className="spec text-mute-2">Fim</span>
            <input type="date" className={`mt-1.5 ${entrada}`} />
          </label>

          <label className="col-span-12 flex items-center gap-3">
            <input type="checkbox" defaultChecked className="size-4 accent-magenta" />
            <span className="text-[0.8125rem]">Mostrar selo de oferta no card do produto</span>
          </label>
        </div>

        <footer className="flex gap-2 border-t border-linha px-6 py-4">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-sm font-medium text-papel hover:bg-grafite">
            <Icone nome="check" className="size-4" strokeWidth={2.4} />
            Agendar promoção
          </button>
          <button
            onClick={fechar}
            className="inline-flex h-11 items-center justify-center rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta"
          >
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function PromocoesPage() {
  const [nova, setNova] = useState(false);

  const ativas = PROMOCOES.filter((p) => estado(p).rotulo === "No ar");
  const receita = PROMOCOES.reduce((s, p) => s + p.receita, 0);
  const emOferta = PRODUTOS.filter((p) => p.precoDe);
  const descontoMedio =
    emOferta.reduce((s, p) => s + (1 - p.preco / p.precoDe!) * 100, 0) / emOferta.length;

  return (
    <>
      <CabecaPagina
        titulo="Promoções"
        descricao="Campanhas com data marcada. Enquanto estão no ar, o selo de oferta aparece sozinho no card do produto."
        acoes={
          <button
            onClick={() => setNova(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
          >
            <Icone nome="mais" className="size-4" strokeWidth={2.2} />
            Nova promoção
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Campanhas no ar"
          valor={num(ativas.length)}
          auxiliar={`${PROMOCOES.length} no histórico`}
          icone="presente"
        />
        <Kpi
          rotulo="Receita gerada"
          valor={brlCurto(receita)}
          auxiliar="Somando todas as campanhas"
          icone="carteira"
        />
        <Kpi
          rotulo="Itens em oferta"
          valor={num(emOferta.length)}
          auxiliar={`${((emOferta.length / PRODUTOS.length) * 100).toFixed(0)}% do catálogo`}
          icone="etiqueta"
        />
        <Kpi
          rotulo="Desconto médio"
          valor={`${descontoMedio.toFixed(0)}%`}
          auxiliar="Sobre o preço cheio"
          icone="cupom"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Calendário de campanhas"
          descricao="Sobreposição no tempo — evita duas promoções brigando pelo mesmo produto."
        >
          <LinhaDoTempo />
        </Cartao>

        <Cartao titulo="Desempenho" descricao="Receita por campanha.">
          <ul className="space-y-4">
            {[...PROMOCOES]
              .sort((a, b) => b.receita - a.receita)
              .map((p, i) => (
                <li key={p.nome}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[0.8125rem]">{p.nome}</span>
                    <span className="shrink-0 text-[0.8125rem] font-medium tabular">
                      {brlCurto(p.receita)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-papel-3">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(p.receita / Math.max(...PROMOCOES.map((x) => x.receita))) * 100}%`,
                        background: CORES[i % CORES.length],
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[0.6875rem] text-mute-2 tabular">
                    {p.itens} {p.itens === 1 ? "item" : "itens"} ·{" "}
                    {brl(p.receita / p.itens, 0)} por item
                  </p>
                </li>
              ))}
          </ul>
        </Cartao>
      </div>

      <div className="mt-5">
        <Cartao padding={false} titulo="Todas as campanhas">
          <Tabela
            cabecalho={[
              "Campanha",
              "Escopo",
              "Regra",
              "Período",
              { rotulo: "Itens", alinhar: "dir" },
              { rotulo: "Receita", alinhar: "dir" },
              "Situação",
              { rotulo: "", alinhar: "dir" },
            ]}
          >
            {PROMOCOES.map((p) => {
              const e = estado(p);
              return (
                <Linha key={p.nome}>
                  <Celula className="font-medium">{p.nome}</Celula>
                  <Celula className="text-mute">{p.escopo}</Celula>
                  <Celula>
                    <span className="rounded-md bg-papel-2 px-2 py-1 text-[0.75rem]">
                      {p.regra}
                    </span>
                  </Celula>
                  <Celula className="text-mute tabular">
                    {data(p.inicio)} – {data(p.fim)}
                  </Celula>
                  <Celula alinhar="dir" className="tabular">
                    {p.itens}
                  </Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {brlCurto(p.receita)}
                  </Celula>
                  <Celula>
                    <SeloStatus tom={e.tom}>{e.rotulo}</SeloStatus>
                  </Celula>
                  <Celula alinhar="dir">
                    <div className="flex justify-end gap-1">
                      <button
                        className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                        aria-label={`Editar ${p.nome}`}
                      >
                        <Icone nome="lapis" className="size-4" />
                      </button>
                      <button
                        className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-erro"
                        aria-label={`Encerrar ${p.nome}`}
                      >
                        <Icone nome="lixeira" className="size-4" />
                      </button>
                    </div>
                  </Celula>
                </Linha>
              );
            })}
          </Tabela>
        </Cartao>
      </div>

      <div className="mt-5">
        <Cartao
          titulo="Produtos em oferta agora"
          descricao="O que está com preço riscado na vitrine."
        >
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {emOferta.slice(0, 8).map((p) => (
              <li
                key={p.sku}
                className="flex items-center gap-3 rounded-xl border border-linha bg-papel/50 p-3"
              >
                <div
                  className="size-14 shrink-0 overflow-hidden rounded-lg border border-linha"
                  style={{ background: fundoDoProduto(p.paleta) }}
                >
                  <FotoProduto produto={p} className="size-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium">{p.nome}</p>
                  <p className="mt-1 text-[0.8125rem] font-semibold tabular">
                    {brl(p.preco)}
                    <span className="ml-1.5 text-[0.6875rem] font-normal text-mute-2 line-through">
                      {brl(p.precoDe!)}
                    </span>
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-magenta-claro px-2 py-1 text-[0.6875rem] font-semibold text-magenta-forte tabular">
                  −{Math.round((1 - p.preco / p.precoDe!) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>

      <AvisoPrototipo>
        Campanhas fictícias. A regra de preço já está refletida na loja: os produtos com
        preço &ldquo;de/por&rdquo; mostram o selo de oferta no card e o desconto entra no
        carrinho automaticamente.
      </AvisoPrototipo>

      {nova && <NovaPromocao fechar={() => setNova(false)} />}
    </>
  );
}
