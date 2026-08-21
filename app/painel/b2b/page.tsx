"use client";

import { useState } from "react";
import { NovoOrcamento } from "@/components/painel/NovoOrcamento";
import { BarrasHorizontais } from "@/components/painel/graficos";
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
import { HOJE, brl, brlCurto, data, haQuanto, num } from "@/lib/format";
import {
  ETAPAS_B2B,
  ORCAMENTOS,
  PEDIDOS,
  type EtapaB2b,
  type Orcamento,
} from "@/lib/painel-dados";

const TOM_ETAPA = {
  briefing: "neutro",
  orcamento: "info",
  arte: "destaque",
  producao: "alerta",
  entregue: "ok",
} as const;

const rotuloEtapa = (id: EtapaB2b) => ETAPAS_B2B.find((e) => e.id === id)!.rotulo;

const diasAte = (d: Date) => Math.round((d.getTime() - HOJE.getTime()) / 86_400_000);

const iniciais = (nome: string) =>
  nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

/* ------------------------------------------------------------- cartão */

function CartaoOrcamento({
  orcamento,
  abrir,
}: {
  orcamento: Orcamento;
  abrir: () => void;
}) {
  const dias = diasAte(orcamento.prazo);
  const parado = Math.round((HOJE.getTime() - orcamento.atualizado.getTime()) / 86_400_000) > 7;

  return (
    <button
      onClick={abrir}
      className="w-full rounded-xl border border-linha bg-surface p-4 text-left shadow-cartao transition-colors hover:border-linha-forte"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.8125rem] font-semibold">{orcamento.empresa}</p>
        {parado && (
          <span
            className="mt-1 size-2 shrink-0 rounded-full bg-alerta"
            title="Sem movimento há mais de 7 dias"
          />
        )}
      </div>
      <p className="mt-1 text-[0.75rem] text-mute">{orcamento.peca}</p>

      <p className="mt-3 text-[1.0625rem] leading-none font-semibold tabular">
        {brlCurto(orcamento.valor)}
      </p>
      <p className="mt-1.5 spec text-mute-2">
        {num(orcamento.tiragem)} un · {brl(orcamento.valor / orcamento.tiragem)}/un
      </p>

      <div className="mt-4 flex items-center gap-2 border-t border-linha pt-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-papel-2 text-[0.5625rem] font-semibold text-grafite">
          {iniciais(orcamento.responsavel)}
        </span>
        <span className="flex-1 truncate text-[0.6875rem] text-mute">
          {orcamento.responsavel}
        </span>
        <span
          className={`text-[0.6875rem] tabular ${
            dias <= 7 ? "font-medium text-erro" : "text-mute-2"
          }`}
        >
          {dias <= 0 ? "vencido" : `${dias}d`}
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------ detalhe */

function Detalhe({ orcamento, fechar }: { orcamento: Orcamento; fechar: () => void }) {
  const indice = ETAPAS_B2B.findIndex((e) => e.id === orcamento.etapa);

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <aside className="absolute top-0 right-0 flex h-full w-[min(560px,100vw)] flex-col bg-papel shadow-papel-alta">
        <header className="flex items-start justify-between gap-4 border-b border-linha bg-surface px-6 py-5">
          <div>
            <p className="spec text-mute-2">{orcamento.id}</p>
            <h2 className="mt-1 font-display text-2xl leading-none">{orcamento.empresa}</h2>
            <p className="mt-2 text-[0.8125rem] text-mute">
              {orcamento.peca} · {num(orcamento.tiragem)} unidades
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

        <div className="flex-1 overflow-y-auto p-6">
          <ol className="flex items-center">
            {ETAPAS_B2B.map((e, i) => (
              <li key={e.id} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={`grid size-8 place-items-center rounded-full text-[0.6875rem] font-semibold ${
                      i <= indice ? "bg-tinta text-papel" : "border border-linha-forte text-mute-2"
                    }`}
                  >
                    {i < indice ? (
                      <Icone nome="check" className="size-4" strokeWidth={2.4} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`spec text-center whitespace-nowrap ${
                      i <= indice ? "text-tinta" : "text-mute-2"
                    }`}
                  >
                    {e.rotulo}
                  </span>
                </div>
                {i < ETAPAS_B2B.length - 1 && (
                  <span className={`mx-2 mb-6 h-px flex-1 ${i < indice ? "bg-tinta" : "bg-linha"}`} />
                )}
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-linha bg-surface p-4">
              <p className="spec text-mute-2">Contato</p>
              <p className="mt-2 text-sm font-medium">{orcamento.contato}</p>
              <p className="mt-0.5 text-[0.75rem] text-mute">Comprador</p>
            </div>
            <div className="rounded-lg border border-linha bg-surface p-4">
              <p className="spec text-mute-2">Responsável</p>
              <p className="mt-2 text-sm font-medium">{orcamento.responsavel}</p>
              <p className="mt-0.5 text-[0.75rem] text-mute">
                Atualizado {haQuanto(orcamento.atualizado)}
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-2.5 rounded-lg border border-linha bg-surface p-5 text-[0.8125rem]">
            <div className="flex justify-between">
              <dt className="text-mute">Tiragem</dt>
              <dd className="tabular">{num(orcamento.tiragem)} unidades</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Preço unitário</dt>
              <dd className="tabular">{brl(orcamento.valor / orcamento.tiragem)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Entrega prevista</dt>
              <dd className="tabular">{data(orcamento.prazo)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-linha pt-3">
              <dt className="font-medium">Valor do orçamento</dt>
              <dd className="text-lg font-semibold tabular">{brl(orcamento.valor)}</dd>
            </div>
          </dl>

          <p className="spec mt-7 text-mute-2">Histórico</p>
          <ul className="mt-3 space-y-3">
            {ETAPAS_B2B.slice(0, indice + 1)
              .reverse()
              .map((e, i) => (
                <li key={e.id} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-tinta" />
                  <div>
                    <p className="text-[0.8125rem] font-medium">{e.rotulo}</p>
                    <p className="text-[0.75rem] text-mute">
                      {i === 0
                        ? `Etapa atual · ${haQuanto(orcamento.atualizado)}`
                        : `Concluída por ${orcamento.responsavel}`}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <footer className="flex gap-2 border-t border-linha bg-surface px-6 py-4">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-sm font-medium text-papel hover:bg-grafite">
            <Icone nome="seta" className="size-4" />
            Avançar etapa
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta">
            <Icone nome="baixar" className="size-4" />
            Proposta PDF
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function B2bPage() {
  const [vista, setVista] = useState<"quadro" | "lista">("quadro");
  const [aberto, setAberto] = useState<Orcamento | null>(null);
  const [novo, setNovo] = useState(false);

  const total = ORCAMENTOS.reduce((s, o) => s + o.valor, 0);
  const fechados = ORCAMENTOS.filter((o) => o.etapa === "entregue");
  const emAberto = ORCAMENTOS.filter((o) => o.etapa !== "entregue");
  const parados = ORCAMENTOS.filter(
    (o) => Math.round((HOJE.getTime() - o.atualizado.getTime()) / 86_400_000) > 7,
  );

  /* comparação honesta: orçamento B2B contra pedido de varejo da amostra */
  const varejo = PEDIDOS.filter((p) => p.canal !== "B2B");
  const ticketVarejo = varejo.reduce((s, p) => s + p.total, 0) / varejo.length;
  const multiplo = Math.round(total / ORCAMENTOS.length / ticketVarejo);

  const funil = ETAPAS_B2B.map((e) => ({
    nome: e.rotulo,
    valor: ORCAMENTOS.filter((o) => o.etapa === e.id).reduce((s, o) => s + o.valor, 0),
  }));

  return (
    <>
      <CabecaPagina
        titulo="Orçamentos B2B"
        descricao="O pipeline dos pedidos personalizados que entram pela página Para empresas. Do briefing à entrega."
        acoes={
          <>
            <div className="flex gap-1 rounded-full border border-linha bg-surface p-1">
              {(["quadro", "lista"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVista(v)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors ${
                    vista === v ? "bg-tinta font-medium text-papel" : "text-mute hover:text-tinta"
                  }`}
                >
                  <Icone nome={v === "quadro" ? "grade" : "menu"} className="size-3.5" />
                  {v === "quadro" ? "Quadro" : "Lista"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setNovo(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
            >
              <Icone nome="mais" className="size-4" strokeWidth={2.2} />
              Novo orçamento
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Em negociação"
          valor={brlCurto(emAberto.reduce((s, o) => s + o.valor, 0))}
          auxiliar={`${emAberto.length} orçamentos abertos`}
          icone="predio"
        />
        <Kpi
          rotulo="Ticket médio B2B"
          valor={brlCurto(total / ORCAMENTOS.length)}
          auxiliar={`${multiplo}× o ticket do varejo`}
          icone="carteira"
        />
        <Kpi
          rotulo="Fechados no período"
          valor={num(fechados.length)}
          auxiliar={`${brlCurto(fechados.reduce((s, o) => s + o.valor, 0))} entregues`}
          icone="check"
        />
        <Kpi
          rotulo="Parados há 7+ dias"
          valor={num(parados.length)}
          auxiliar="Precisam de follow-up"
          icone="relogio"
        />
      </div>

      {vista === "quadro" ? (
        <div className="scroll-x mt-5 -mx-5 px-5 pb-2 lg:-mx-8 lg:px-8">
          <div className="flex min-w-[1100px] gap-4">
            {ETAPAS_B2B.map((etapa) => {
              const daEtapa = ORCAMENTOS.filter((o) => o.etapa === etapa.id);
              const valor = daEtapa.reduce((s, o) => s + o.valor, 0);
              return (
                <section key={etapa.id} className="flex-1">
                  <header className="flex items-center gap-2 rounded-lg bg-papel-2/70 px-3.5 py-3">
                    <SeloStatus tom={TOM_ETAPA[etapa.id]} ponto={false}>
                      {etapa.rotulo}
                    </SeloStatus>
                    <span className="ml-auto text-[0.6875rem] text-mute-2 tabular">
                      {daEtapa.length}
                    </span>
                  </header>
                  <p className="mt-2 px-1 text-[0.75rem] text-mute tabular">{brlCurto(valor)}</p>

                  <div className="mt-2 space-y-3">
                    {daEtapa.map((o) => (
                      <CartaoOrcamento key={o.id} orcamento={o} abrir={() => setAberto(o)} />
                    ))}
                    {daEtapa.length === 0 && (
                      <p className="rounded-xl border border-dashed border-linha px-4 py-8 text-center text-[0.75rem] text-mute-2">
                        Nenhum orçamento
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <Cartao padding={false}>
            <Tabela
              cabecalho={[
                "Orçamento",
                "Empresa",
                "Peça",
                { rotulo: "Tiragem", alinhar: "dir" },
                { rotulo: "Valor", alinhar: "dir" },
                "Etapa",
                "Responsável",
                "Entrega",
                { rotulo: "", alinhar: "dir" },
              ]}
            >
              {[...ORCAMENTOS]
                .sort((a, b) => b.valor - a.valor)
                .map((o) => {
                  const dias = diasAte(o.prazo);
                  return (
                    <Linha key={o.id}>
                      <Celula className="spec">{o.id}</Celula>
                      <Celula>
                        <p className="font-medium">{o.empresa}</p>
                        <p className="text-[0.6875rem] text-mute-2">{o.contato}</p>
                      </Celula>
                      <Celula className="text-mute">{o.peca}</Celula>
                      <Celula alinhar="dir" className="tabular">
                        {num(o.tiragem)}
                      </Celula>
                      <Celula alinhar="dir" className="font-medium tabular">
                        {brl(o.valor, 0)}
                      </Celula>
                      <Celula>
                        <SeloStatus tom={TOM_ETAPA[o.etapa]}>{rotuloEtapa(o.etapa)}</SeloStatus>
                      </Celula>
                      <Celula className="text-mute">{o.responsavel}</Celula>
                      <Celula className="tabular">
                        <span className={dias <= 7 ? "font-medium text-erro" : "text-mute"}>
                          {data(o.prazo)}
                        </span>
                      </Celula>
                      <Celula alinhar="dir">
                        <button
                          onClick={() => setAberto(o)}
                          className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                          aria-label={`Abrir ${o.id}`}
                        >
                          <Icone nome="olho" className="size-4" />
                        </button>
                      </Celula>
                    </Linha>
                  );
                })}
            </Tabela>
          </Cartao>
        </div>
      )}

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Valor por etapa"
          descricao="Quanto está parado em cada fase do funil."
        >
          <BarrasHorizontais itens={funil} formato="brlCurto" />
        </Cartao>

        <Cartao titulo="Precisa de follow-up" descricao="Sem movimento há mais de uma semana.">
          <ul className="divide-y divide-linha">
            {parados.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-alerta-bg text-alerta">
                  <Icone nome="relogio" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium">{o.empresa}</p>
                  <p className="text-[0.6875rem] text-mute-2">
                    {rotuloEtapa(o.etapa)} · {haQuanto(o.atualizado)}
                  </p>
                </div>
                <span className="shrink-0 text-[0.8125rem] font-medium tabular">
                  {brlCurto(o.valor)}
                </span>
              </li>
            ))}
            {parados.length === 0 && (
              <li className="py-6 text-center text-[0.8125rem] text-mute">
                Nenhum orçamento parado. Pipeline em dia.
              </li>
            )}
          </ul>
        </Cartao>
      </div>

      <AvisoPrototipo>
        Pipeline fictício com {ORCAMENTOS.length} orçamentos. No sistema real, cada envio do
        formulário da página <strong>Para empresas</strong> cria um card na coluna Briefing e
        dispara e-mail para o responsável.
      </AvisoPrototipo>

      {aberto && <Detalhe orcamento={aberto} fechar={() => setAberto(null)} />}
          {novo && <NovoOrcamento fechar={() => setNovo(false)} />}
</>
  );
}
