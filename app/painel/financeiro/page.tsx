"use client";

import { useState } from "react";
import { BarrasHorizontais, GraficoArea } from "@/components/painel/graficos";
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
import { brl, brlCurto, data, num, pct } from "@/lib/format";
import {
  DESPESAS,
  FINANCEIRO,
  LANCAMENTOS,
  MES_ANTERIOR,
  MES_ATUAL,
  type Lancamento,
} from "@/lib/painel-dados";
import { BotaoExportar } from "@/components/painel/BotaoExportar";

const variacao = (atual: number, anterior: number) =>
  Math.round(((atual - anterior) / anterior) * 1000) / 10;

const SITUACAO = {
  pago: { rotulo: "Pago", tom: "ok" },
  aberto: { rotulo: "Em aberto", tom: "info" },
  atrasado: { rotulo: "Atrasado", tom: "erro" },
} as const;

/** Régua de composição: a receita do mês fatiada em custo, despesa e lucro. */
function Regua({ mes }: { mes: (typeof FINANCEIRO)[number] }) {
  const fatias = [
    { nome: "Custo de produção", valor: mes.custo, cor: "var(--color-serie-3)" },
    { nome: "Despesa operacional", valor: mes.despesa, cor: "var(--color-serie-4)" },
    { nome: "Lucro líquido", valor: mes.lucro, cor: "var(--color-serie-5)" },
  ];

  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
        {fatias.map((f) => (
          <div
            key={f.nome}
            style={{ width: `${(f.valor / mes.receita) * 100}%`, background: f.cor }}
          />
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {fatias.map((f) => (
          <li key={f.nome} className="flex items-center gap-2.5">
            <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: f.cor }} />
            <span className="flex-1 truncate text-[0.8125rem] text-mute">{f.nome}</span>
            <span className="text-[0.8125rem] text-mute-2 tabular">
              {((f.valor / mes.receita) * 100).toFixed(0)}%
            </span>
            <span className="w-24 text-right text-[0.8125rem] font-medium tabular">
              {brlCurto(f.valor)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FinanceiroPage() {
  const [fluxo, setFluxo] = useState<Lancamento["tipo"]>("receber");

  const margem = (MES_ATUAL.lucro / MES_ATUAL.receita) * 100;
  const margemAnterior = (MES_ANTERIOR.lucro / MES_ANTERIOR.receita) * 100;
  const anoReceita = FINANCEIRO.reduce((s, m) => s + m.receita, 0);
  const anoLucro = FINANCEIRO.reduce((s, m) => s + m.lucro, 0);

  const lista = LANCAMENTOS.filter((l) => l.tipo === fluxo);

  const somar = (tipo: Lancamento["tipo"], situacao: Lancamento["situacao"]) =>
    LANCAMENTOS.filter((l) => l.tipo === tipo && l.situacao === situacao).reduce(
      (s, l) => s + l.valor,
      0,
    );

  const aReceber = somar("receber", "aberto") + somar("receber", "atrasado");
  const aPagar = somar("pagar", "aberto") + somar("pagar", "atrasado");
  const atrasados = LANCAMENTOS.filter((l) => l.situacao === "atrasado");

  return (
    <>
      <CabecaPagina
        titulo="Financeiro"
        descricao="Resultado de agosto de 2026 e o caixa das próximas semanas. O fechamento contábil sai no dia 5 do mês seguinte."
        acoes={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.8125rem] font-medium hover:border-linha-forte">
              <Icone nome="calendario" className="size-4" />
              Agosto de 2026
              <Icone nome="chevronBaixo" className="size-3.5 text-mute-2" />
            </button>
            <BotaoExportar
              nome="dre"
              rotulo="Exportar DRE"
              tom="tinta"
              colunas={[
                "Mês",
                "Ano",
                "Receita",
                "Custo",
                "Despesa",
                "Lucro",
                "Margem %",
                "Pedidos",
                "Receita ano anterior",
              ]}
              linhas={[...FINANCEIRO].reverse().map((m) => [
                m.mes,
                m.data.getFullYear(),
                m.receita,
                m.custo,
                m.despesa,
                m.lucro,
                Math.round((m.lucro / m.receita) * 1000) / 10,
                m.pedidos,
                m.receitaAnterior,
              ])}
            />
          </>
        }
      />

      {/* -------------------------------------------------------------- KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Receita do mês"
          valor={brlCurto(MES_ATUAL.receita)}
          variacao={variacao(MES_ATUAL.receita, MES_ANTERIOR.receita)}
          auxiliar={`${brlCurto(anoReceita)} nos últimos 12 meses`}
          icone="carteira"
          serie={FINANCEIRO.map((m) => m.receita)}
        />
        <Kpi
          rotulo="Custo de produção"
          valor={brlCurto(MES_ATUAL.custo)}
          variacao={variacao(MES_ATUAL.custo, MES_ANTERIOR.custo)}
          invertido
          auxiliar={`${((MES_ATUAL.custo / MES_ATUAL.receita) * 100).toFixed(0)}% da receita`}
          icone="caixa"
          serie={FINANCEIRO.map((m) => m.custo)}
          corSerie="var(--color-serie-3)"
        />
        <Kpi
          rotulo="Despesa operacional"
          valor={brlCurto(MES_ATUAL.despesa)}
          variacao={variacao(MES_ATUAL.despesa, MES_ANTERIOR.despesa)}
          invertido
          auxiliar={`${((MES_ATUAL.despesa / MES_ATUAL.receita) * 100).toFixed(0)}% da receita`}
          icone="predio"
          serie={FINANCEIRO.map((m) => m.despesa)}
          corSerie="var(--color-serie-4)"
        />
        <Kpi
          rotulo="Lucro líquido"
          valor={brlCurto(MES_ATUAL.lucro)}
          variacao={variacao(margem, margemAnterior)}
          auxiliar={`Margem de ${margem.toFixed(1).replace(".", ",")}%`}
          icone="grafico"
          serie={FINANCEIRO.map((m) => m.lucro)}
          corSerie="var(--color-serie-5)"
        />
      </div>

      {/* ------------------------------------------------- resultado 12 meses */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Receita, custo e lucro"
          descricao="Últimos 12 meses. O pico de novembro a janeiro é presente e volta às aulas."
        >
          <GraficoArea
            rotulos={FINANCEIRO.map((m) => m.mes)}
            series={[
              { rotulo: "Receita", valores: FINANCEIRO.map((m) => m.receita) },
              { rotulo: "Custo + despesa", valores: FINANCEIRO.map((m) => m.custo + m.despesa) },
              { rotulo: "Lucro líquido", valores: FINANCEIRO.map((m) => m.lucro) },
            ]}
          />
        </Cartao>

        <Cartao titulo="Para onde vai cada real" descricao="Composição da receita de agosto.">
          <Regua mes={MES_ATUAL} />
          <div className="mt-6 border-t border-linha pt-4">
            <p className="text-[0.75rem] leading-relaxed text-mute">
              A cada R$ 100 faturados, {brl(MES_ATUAL.lucro / (MES_ATUAL.receita / 100))} sobram em
              caixa. No acumulado de 12 meses o lucro é de {brlCurto(anoLucro)}.
            </p>
          </div>
        </Cartao>
      </div>

      {/* ---------------------------------------------------- despesas e caixa */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          titulo="Despesas por natureza"
          descricao="Rateio de agosto, do maior para o menor."
          className="xl:col-span-2"
        >
          <BarrasHorizontais
            itens={DESPESAS.map((d) => ({ nome: d.nome, valor: d.valor }))}
            cores={DESPESAS.map((d) => d.cor)}
            formato="brl0"
          />
        </Cartao>

        <Cartao titulo="Caixa a realizar" descricao="Somando aberto e atrasado.">
          <ul className="space-y-4">
            <li className="rounded-lg border border-linha bg-papel/60 p-4">
              <div className="flex items-center gap-2">
                <Icone nome="chevronCima" className="size-4 text-ok" strokeWidth={2.4} />
                <p className="spec text-mute-2">A receber</p>
              </div>
              <p className="mt-2 text-2xl leading-none font-semibold text-ok tabular">
                {brlCurto(aReceber)}
              </p>
              <p className="mt-2 text-[0.75rem] text-mute">
                {LANCAMENTOS.filter((l) => l.tipo === "receber" && l.situacao !== "pago").length}{" "}
                títulos em aberto
              </p>
            </li>
            <li className="rounded-lg border border-linha bg-papel/60 p-4">
              <div className="flex items-center gap-2">
                <Icone nome="chevronBaixo" className="size-4 text-erro" strokeWidth={2.4} />
                <p className="spec text-mute-2">A pagar</p>
              </div>
              <p className="mt-2 text-2xl leading-none font-semibold text-erro tabular">
                {brlCurto(aPagar)}
              </p>
              <p className="mt-2 text-[0.75rem] text-mute">
                {LANCAMENTOS.filter((l) => l.tipo === "pagar" && l.situacao !== "pago").length}{" "}
                títulos em aberto
              </p>
            </li>
            <li className="flex items-baseline justify-between border-t border-linha pt-4">
              <p className="text-[0.8125rem] font-medium">Saldo projetado</p>
              <p className="text-[0.9375rem] font-semibold tabular">{brlCurto(aReceber - aPagar)}</p>
            </li>
          </ul>
        </Cartao>
      </div>

      {/* --------------------------------------------------------------- DRE */}
      <div className="mt-5">
        <Cartao
          padding={false}
          titulo="Demonstrativo mensal"
          descricao="Receita, custo, despesa, lucro e margem — mês a mês."
          acao={
            <BotaoExportar
              nome="lancamentos"
              rotulo="Baixar planilha"
              tom="texto"
              compacto
              colunas={["Título", "Descrição", "Categoria", "Vencimento", "Tipo", "Situação", "Valor"]}
              linhas={LANCAMENTOS.map((l) => [
                l.id,
                l.descricao,
                l.categoria,
                l.vencimento,
                l.tipo === "receber" ? "A receber" : "A pagar",
                SITUACAO[l.situacao].rotulo,
                l.valor,
              ])}
            />
          }
        >
          <Tabela
            cabecalho={[
              "Mês",
              { rotulo: "Receita", alinhar: "dir" },
              { rotulo: "Custo", alinhar: "dir" },
              { rotulo: "Despesa", alinhar: "dir" },
              { rotulo: "Lucro", alinhar: "dir" },
              { rotulo: "Margem", alinhar: "dir" },
              { rotulo: "Pedidos", alinhar: "dir" },
              { rotulo: "vs. ano anterior", alinhar: "dir" },
            ]}
          >
            {[...FINANCEIRO].reverse().map((m) => {
              const mg = (m.lucro / m.receita) * 100;
              const vs = variacao(m.receita, m.receitaAnterior);
              return (
                <Linha key={`${m.mes}-${m.data.getFullYear()}`}>
                  <Celula className="font-medium">
                    {m.mes}
                    <span className="ml-1.5 text-[0.6875rem] text-mute-2">
                      {m.data.getFullYear()}
                    </span>
                  </Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {brl(m.receita, 0)}
                  </Celula>
                  <Celula alinhar="dir" className="text-mute tabular">
                    {brl(m.custo, 0)}
                  </Celula>
                  <Celula alinhar="dir" className="text-mute tabular">
                    {brl(m.despesa, 0)}
                  </Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {brl(m.lucro, 0)}
                  </Celula>
                  <Celula alinhar="dir" className="tabular">
                    {mg.toFixed(1).replace(".", ",")}%
                  </Celula>
                  <Celula alinhar="dir" className="text-mute tabular">
                    {num(m.pedidos)}
                  </Celula>
                  <Celula alinhar="dir">
                    <span
                      className={`text-[0.8125rem] tabular ${vs > 0 ? "text-ok" : "text-erro"}`}
                    >
                      {pct(vs)}
                    </span>
                  </Celula>
                </Linha>
              );
            })}
          </Tabela>
        </Cartao>
      </div>

      {/* ----------------------------------------------------- contas do mês */}
      <div className="mt-5">
        <Cartao padding={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-linha px-6 py-4">
            <div className="flex gap-1">
              {(["receber", "pagar"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFluxo(t)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors ${
                    fluxo === t
                      ? "bg-tinta font-medium text-papel"
                      : "text-mute hover:bg-papel-2 hover:text-tinta"
                  }`}
                >
                  Contas a {t}
                  <span
                    className={`text-[0.6875rem] tabular ${
                      fluxo === t ? "text-papel/60" : "text-mute-2"
                    }`}
                  >
                    {LANCAMENTOS.filter((l) => l.tipo === t).length}
                  </span>
                </button>
              ))}
            </div>

            {atrasados.length > 0 && (
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-erro-bg px-3 py-1.5 text-[0.75rem] font-medium text-erro">
                <Icone nome="alerta" className="size-3.5" />
                {atrasados.length}{" "}
                {atrasados.length === 1 ? "título vencido" : "títulos vencidos"}
              </span>
            )}
          </div>

          <Tabela
            cabecalho={[
              "Título",
              "Descrição",
              "Categoria",
              "Vencimento",
              "Situação",
              { rotulo: "Valor", alinhar: "dir" },
            ]}
          >
            {lista.map((l) => (
              <Linha key={l.id}>
                <Celula className="spec">{l.id}</Celula>
                <Celula className="font-medium">{l.descricao}</Celula>
                <Celula className="text-mute">{l.categoria}</Celula>
                <Celula className="text-mute tabular">{data(l.vencimento)}</Celula>
                <Celula>
                  <SeloStatus tom={SITUACAO[l.situacao].tom}>
                    {SITUACAO[l.situacao].rotulo}
                  </SeloStatus>
                </Celula>
                <Celula
                  alinhar="dir"
                  className={`font-medium tabular ${l.tipo === "receber" ? "text-ok" : ""}`}
                >
                  {l.tipo === "receber" ? brl(l.valor, 0) : `−${brl(l.valor, 0)}`}
                </Celula>
              </Linha>
            ))}
          </Tabela>

          <div className="flex items-baseline justify-between border-t border-linha px-6 py-4">
            <p className="text-[0.75rem] text-mute">
              {lista.length} títulos · {lista.filter((l) => l.situacao === "pago").length} já
              liquidados
            </p>
            <p className="text-[0.9375rem] font-semibold tabular">
              {brl(
                lista.reduce((s, l) => s + l.valor, 0),
                0,
              )}
            </p>
          </div>
        </Cartao>
      </div>

      <AvisoPrototipo>
        Números fictícios, com escala calibrada para uma operação de ~R$ 240 mil/mês. O
        demonstrativo real vem da contabilidade; o fluxo de caixa passa a ser alimentado
        automaticamente quando o Mercado Pago for integrado, na fase seguinte.
      </AvisoPrototipo>
    </>
  );
}
