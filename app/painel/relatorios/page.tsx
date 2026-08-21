"use client";

import { useMemo, useState } from "react";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import {
  BarrasHorizontais,
  GraficoArea,
  GraficoBarras,
  Rosca,
} from "@/components/painel/graficos";
import {
  AvisoPrototipo,
  CabecaPagina,
  Cartao,
  Celula,
  Kpi,
  Linha,
  Tabela,
} from "@/components/painel/ui";
import { Icone } from "@/components/ui/Icone";
import { brl, brlCurto, dataCurta, num, pct } from "@/lib/format";
import { FotoProduto } from "@/components/loja/FotoProduto";
import {
  CLIENTES,
  FINANCEIRO,
  MES_ANTERIOR,
  MES_ATUAL,
  PEDIDOS,
  maisVendidos,
  pedidosPorDia,
  receitaPorCategoria,
  vendasPorCanal,
} from "@/lib/painel-dados";
import { BotaoExportar } from "@/components/painel/BotaoExportar";

const variacao = (atual: number, anterior: number) =>
  Math.round(((atual - anterior) / anterior) * 1000) / 10;

const PERIODOS = [
  { dias: 7, rotulo: "7 dias" },
  { dias: 30, rotulo: "30 dias" },
  { dias: 90, rotulo: "90 dias" },
] as const;

/** Praças: para onde a Full Print mais despacha. */
function porEstado() {
  const mapa = new Map<string, { pedidos: number; receita: number; cidade: string }>();
  for (const p of PEDIDOS) {
    const atual = mapa.get(p.uf) ?? { pedidos: 0, receita: 0, cidade: p.cidade };
    atual.pedidos += 1;
    atual.receita += p.total;
    mapa.set(p.uf, atual);
  }
  return [...mapa.entries()]
    .map(([uf, v]) => ({ uf, ...v }))
    .sort((a, b) => b.receita - a.receita);
}

export default function RelatoriosPage() {
  const [dias, setDias] = useState<number>(30);

  const serie = useMemo(() => pedidosPorDia(dias), [dias]);
  const canais = vendasPorCanal();
  const categorias = receitaPorCategoria();
  const ranking = maisVendidos(10);
  const pracas = porEstado();

  const receitaAno = FINANCEIRO.reduce((s, m) => s + m.receita, 0);
  const receitaAnoAnterior = FINANCEIRO.reduce((s, m) => s + m.receitaAnterior, 0);
  const pedidosAno = FINANCEIRO.reduce((s, m) => s + m.pedidos, 0);
  const ticket = receitaAno / pedidosAno;
  const ticketAnterior = MES_ANTERIOR.receita / MES_ANTERIOR.pedidos;

  const recorrentes = CLIENTES.filter((c) => c.pedidos > 1).length;
  const recompra = (recorrentes / CLIENTES.length) * 100;

  const perfil = (["VIP", "Recorrente", "Novo", "Inativo"] as const).map((tag) => ({
    nome: tag,
    valor: CLIENTES.filter((c) => c.tag === tag).reduce((s, c) => s + c.gasto, 0),
  }));

  /* quanto o ticket do B2B é maior que o do varejo, medido na amostra */
  const pedidosB2b = PEDIDOS.filter((p) => p.canal === "B2B");
  const pedidosVarejo = PEDIDOS.filter((p) => p.canal !== "B2B");
  const multiploB2b = Math.round(
    pedidosB2b.reduce((s, p) => s + p.total, 0) /
      pedidosB2b.length /
      (pedidosVarejo.reduce((s, p) => s + p.total, 0) / pedidosVarejo.length),
  );

  const receitaTotalCategoria = categorias.reduce((s, c) => s + c.valor, 0);
  const receitaTotalRanking = ranking.reduce((s, r) => s + r.valor, 0);

  return (
    <>
      <CabecaPagina
        titulo="Relatórios"
        descricao="Onde a receita nasce: período, canal, categoria, produto e praça. Tudo no mesmo recorte de tempo."
        acoes={
          <>
            <div className="flex gap-1 rounded-full border border-linha bg-surface p-1">
              {PERIODOS.map((p) => (
                <button
                  key={p.dias}
                  onClick={() => setDias(p.dias)}
                  className={`rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors ${
                    dias === p.dias
                      ? "bg-tinta font-medium text-papel"
                      : "text-mute hover:text-tinta"
                  }`}
                >
                  {p.rotulo}
                </button>
              ))}
            </div>
            <BotaoExportar
              nome={`receita-${dias}-dias`}
              tom="tinta"
              colunas={["Data", "Pedidos", "Receita"]}
              linhas={serie.map((d) => [d.data, d.qtd, d.valor])}
            />
          </>
        }
      />

      {/* -------------------------------------------------------------- KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Receita 12 meses"
          valor={brlCurto(receitaAno)}
          variacao={variacao(receitaAno, receitaAnoAnterior)}
          auxiliar={`${brlCurto(receitaAnoAnterior)} no período anterior`}
          icone="carteira"
          serie={FINANCEIRO.map((m) => m.receita)}
        />
        <Kpi
          rotulo="Pedidos 12 meses"
          valor={num(pedidosAno)}
          variacao={variacao(MES_ATUAL.pedidos, MES_ANTERIOR.pedidos)}
          auxiliar={`${num(MES_ATUAL.pedidos)} só em agosto`}
          icone="sacola"
          serie={FINANCEIRO.map((m) => m.pedidos)}
          corSerie="var(--color-serie-2)"
        />
        <Kpi
          rotulo="Ticket médio"
          valor={brl(ticket, 0)}
          variacao={variacao(MES_ATUAL.receita / MES_ATUAL.pedidos, ticketAnterior)}
          auxiliar="Varejo e B2B somados"
          icone="etiqueta"
          serie={FINANCEIRO.map((m) => m.receita / m.pedidos)}
          corSerie="var(--color-serie-3)"
        />
        <Kpi
          rotulo="Taxa de recompra"
          valor={`${recompra.toFixed(1).replace(".", ",")}%`}
          variacao={2.8}
          auxiliar={`${num(recorrentes)} clientes com 2+ pedidos`}
          icone="pessoas"
          serie={FINANCEIRO.map((m) => m.pedidos / 10)}
          corSerie="var(--color-serie-4)"
        />
      </div>

      {/* ---------------------------------------------------- receita x ano */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Receita contra o ano anterior"
          descricao="Mesma janela de 12 meses, sobreposta ao ano passado."
        >
          <GraficoArea
            rotulos={FINANCEIRO.map((m) => m.mes)}
            series={[
              { rotulo: "Este ano", valores: FINANCEIRO.map((m) => m.receita) },
              { rotulo: "Ano anterior", valores: FINANCEIRO.map((m) => m.receitaAnterior) },
            ]}
          />
        </Cartao>

        <Cartao titulo="Canal de venda" descricao="Participação na receita do período.">
          <Rosca itens={canais} rotuloCentro="Receita" />
        </Cartao>
      </div>

      {/* ------------------------------------------------ volume e categoria */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo={`Pedidos por dia · ${dias} dias`}
          descricao="Segunda e terça concentram o volume — o B2B fecha no começo da semana."
        >
          <GraficoBarras
            rotulos={serie.map((d, i) =>
              i % Math.ceil(serie.length / 10) === 0 ? dataCurta(d.data) : "",
            )}
            valores={serie.map((d) => d.qtd)}
            cor="var(--color-serie-1)"
            rotuloValor="Pedidos no dia"
          />
        </Cartao>

        <Cartao titulo="Perfil do cliente" descricao="Receita por tipo de comprador.">
          <Rosca itens={perfil} rotuloCentro="Base" />
        </Cartao>
      </div>

      {/* ---------------------------------------------------------- categoria */}
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Cartao titulo="Receita por categoria" descricao="Todas as oito linhas do catálogo.">
          <BarrasHorizontais
            itens={categorias.map((c) => ({ nome: c.nome, valor: c.valor }))}
            formato="brlCurto"
          />
          <p className="mt-6 border-t border-linha pt-4 text-[0.75rem] leading-relaxed text-mute">
            As três primeiras categorias respondem por{" "}
            {(
              (categorias.slice(0, 3).reduce((s, c) => s + c.valor, 0) / receitaTotalCategoria) *
              100
            ).toFixed(0)}
            % da receita. Cadernos seguem sendo o carro-chefe.
          </p>
        </Cartao>

        <Cartao
          padding={false}
          titulo="Praças de entrega"
          descricao="Estados que mais compram, por receita."
        >
          <Tabela
            minimo={520}
            cabecalho={[
              "UF",
              "Praça principal",
              { rotulo: "Pedidos", alinhar: "dir" },
              { rotulo: "Receita", alinhar: "dir" },
              { rotulo: "Ticket", alinhar: "dir" },
            ]}
          >
            {pracas.slice(0, 8).map((p) => (
              <Linha key={p.uf}>
                <Celula>
                  <span className="inline-flex size-7 items-center justify-center rounded-md bg-papel-2 text-[0.6875rem] font-semibold">
                    {p.uf}
                  </span>
                </Celula>
                <Celula className="text-mute">{p.cidade}</Celula>
                <Celula alinhar="dir" className="tabular">
                  {num(p.pedidos)}
                </Celula>
                <Celula alinhar="dir" className="font-medium tabular">
                  {brlCurto(p.receita)}
                </Celula>
                <Celula alinhar="dir" className="text-mute tabular">
                  {brl(p.receita / p.pedidos, 0)}
                </Celula>
              </Linha>
            ))}
          </Tabela>
        </Cartao>
      </div>

      {/* ------------------------------------------------------------ ranking */}
      <div className="mt-5">
        <Cartao
          padding={false}
          titulo="Ranking de produtos"
          descricao="Os dez itens que mais faturam na amostra."
          acao={
            <BotaoExportar
              nome="ranking-produtos"
              rotulo="Exportar ranking"
              tom="texto"
              compacto
              colunas={["#", "SKU", "Produto", "Linha", "Unidades", "Receita", "Participação %", "Margem %"]}
              linhas={ranking.map((r, i) => [
                i + 1,
                r.produto.sku,
                r.produto.nome,
                r.produto.sub,
                r.qtd,
                Math.round(r.valor),
                Math.round((r.valor / receitaTotalRanking) * 1000) / 10,
                Math.round(((r.produto.preco - r.produto.custo) / r.produto.preco) * 100),
              ])}
            />
          }
        >
          <Tabela
            cabecalho={[
              "#",
              "Produto",
              "Categoria",
              { rotulo: "Unidades", alinhar: "dir" },
              { rotulo: "Receita", alinhar: "dir" },
              { rotulo: "Participação", alinhar: "dir" },
              { rotulo: "Margem", alinhar: "dir" },
            ]}
          >
            {ranking.map((r, i) => {
              const margem = ((r.produto.preco - r.produto.custo) / r.produto.preco) * 100;
              return (
                <Linha key={r.produto.sku}>
                  <Celula className="spec text-mute-2 tabular">{i + 1}</Celula>
                  <Celula>
                    <div className="flex items-center gap-3">
                      <div
                        className="size-10 shrink-0 overflow-hidden rounded-md border border-linha"
                        style={{ background: fundoDoProduto(r.produto.paleta) }}
                      >
                        <FotoProduto produto={r.produto} className="size-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{r.produto.nome}</p>
                        <p className="spec text-mute-2">{r.produto.sku}</p>
                      </div>
                    </div>
                  </Celula>
                  <Celula className="text-mute">{r.produto.sub}</Celula>
                  <Celula alinhar="dir" className="tabular">
                    {num(r.qtd)}
                  </Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {brlCurto(r.valor)}
                  </Celula>
                  <Celula alinhar="dir" className="text-mute tabular">
                    {((r.valor / receitaTotalRanking) * 100).toFixed(1).replace(".", ",")}%
                  </Celula>
                  <Celula alinhar="dir" className="tabular">
                    <span className={margem > 55 ? "text-ok" : "text-mute"}>
                      {margem.toFixed(0)}%
                    </span>
                  </Celula>
                </Linha>
              );
            })}
          </Tabela>
        </Cartao>
      </div>

      {/* ----------------------------------------------------------- destaques */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icone: "grafico",
            titulo: "Melhor mês",
            valor: [...FINANCEIRO].sort((a, b) => b.receita - a.receita)[0].mes,
            texto: `${brlCurto(
              [...FINANCEIRO].sort((a, b) => b.receita - a.receita)[0].receita,
            )} de receita`,
          },
          {
            icone: "predio",
            titulo: "Peso do B2B",
            valor: `${((canais.find((c) => c.nome === "B2B")!.valor / canais.reduce((s, c) => s + c.valor, 0)) * 100).toFixed(0)}%`,
            texto: `da receita, com ticket ${multiploB2b}× maior`,
          },
          {
            icone: "caminhao",
            titulo: "Concentração SP",
            valor: `${((pracas.find((p) => p.uf === "SP")!.receita / pracas.reduce((s, p) => s + p.receita, 0)) * 100).toFixed(0)}%`,
            texto: "da receita sai para São Paulo",
          },
          {
            icone: "estrela",
            titulo: "Crescimento anual",
            valor: pct(variacao(receitaAno, receitaAnoAnterior)),
            texto: "contra os 12 meses anteriores",
          },
        ].map((d) => (
          <div key={d.titulo} className="rounded-xl border border-linha bg-surface p-5 shadow-cartao">
            <span className="grid size-9 place-items-center rounded-full bg-papel text-mute">
              <Icone nome={d.icone} className="size-4" />
            </span>
            <p className="spec mt-3.5 text-mute-2">{d.titulo}</p>
            <p className="mt-1.5 text-xl font-semibold tabular">{d.valor}</p>
            <p className="mt-1 text-[0.75rem] text-mute">{d.texto}</p>
          </div>
        ))}
      </div>

      <AvisoPrototipo>
        Relatórios montados sobre a amostra fictícia de 180 pedidos, multiplicada para
        refletir o volume real da operação. Com o banco de dados ligado, cada recorte aqui
        vira consulta ao vivo e o botão de exportar entrega CSV e PDF.
      </AvisoPrototipo>
    </>
  );
}
