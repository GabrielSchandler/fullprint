import Link from "next/link";
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
  SeloStatus,
  Tabela,
} from "@/components/painel/ui";
import { Icone } from "@/components/ui/Icone";
import { brl, brlCurto, dataCurta, haQuanto, num } from "@/lib/format";
import { FotoProduto } from "@/components/loja/FotoProduto";
import {
  ETAPAS_B2B,
  FINANCEIRO,
  MES_ANTERIOR,
  MES_ATUAL,
  ORCAMENTOS,
  PEDIDOS,
  STATUS_PEDIDO,
  estoqueCritico,
  maisVendidos,
  pedidosPorDia,
  receitaPorCategoria,
  vendasPorCanal,
} from "@/lib/painel-dados";
import { BotaoExportar } from "@/components/painel/BotaoExportar";
import {
  ETAPAS_PRODUCAO,
  arteTravada,
  atrasados,
  jobsDaEtapa,
  ocupacaoGeral,
} from "@/lib/producao";

const variacao = (atual: number, anterior: number) =>
  Math.round(((atual - anterior) / anterior) * 1000) / 10;

export default function DashboardPage() {
  const serie = pedidosPorDia(30);
  const canais = vendasPorCanal();
  const categorias = receitaPorCategoria();
  const topProdutos = maisVendidos(5);
  const criticos = estoqueCritico().slice(0, 5);
  const recentes = PEDIDOS.slice(0, 7);

  const ticket = MES_ATUAL.receita / MES_ATUAL.pedidos;
  const ticketAnterior = MES_ANTERIOR.receita / MES_ANTERIOR.pedidos;
  const margem = (MES_ATUAL.lucro / MES_ATUAL.receita) * 100;
  const margemAnterior = (MES_ANTERIOR.lucro / MES_ANTERIOR.receita) * 100;

  const funil = ETAPAS_B2B.map((e) => ({
    nome: e.rotulo,
    valor: ORCAMENTOS.filter((o) => o.etapa === e.id).reduce((s, o) => s + o.valor, 0),
  }));

  return (
    <>
      <CabecaPagina
        titulo="Dashboard"
        descricao="Agosto de 2026 · comparado com julho. Os números do mês fecham no dia 31."
        acoes={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.8125rem] font-medium hover:border-linha-forte">
              <Icone nome="calendario" className="size-4" />
              Últimos 30 dias
              <Icone nome="chevronBaixo" className="size-3.5 text-mute-2" />
            </button>
            <BotaoExportar
              nome="resumo-30-dias"
              tom="tinta"
              colunas={["Data", "Pedidos", "Receita"]}
              linhas={serie.map((d) => [d.data, d.qtd, d.valor])}
            />
          </>
        }
      />

      {/* ------------------------------------------------------------- KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Receita do mês"
          valor={brlCurto(MES_ATUAL.receita)}
          variacao={variacao(MES_ATUAL.receita, MES_ANTERIOR.receita)}
          auxiliar={`${brl(MES_ANTERIOR.receita, 0)} em julho`}
          icone="carteira"
          serie={FINANCEIRO.map((m) => m.receita)}
        />
        <Kpi
          rotulo="Pedidos"
          valor={num(MES_ATUAL.pedidos)}
          variacao={variacao(MES_ATUAL.pedidos, MES_ANTERIOR.pedidos)}
          auxiliar={`${PEDIDOS.filter((p) => p.status === "novo").length} aguardando produção`}
          icone="sacola"
          serie={FINANCEIRO.map((m) => m.pedidos)}
          corSerie="var(--color-serie-2)"
        />
        <Kpi
          rotulo="Ticket médio"
          valor={brl(ticket, 0)}
          variacao={variacao(ticket, ticketAnterior)}
          auxiliar="Varejo e B2B somados"
          icone="etiqueta"
          serie={FINANCEIRO.map((m) => m.receita / m.pedidos)}
          corSerie="var(--color-serie-3)"
        />
        <Kpi
          rotulo="Margem líquida"
          valor={`${margem.toFixed(1).replace(".", ",")}%`}
          variacao={variacao(margem, margemAnterior)}
          auxiliar={`Lucro de ${brl(MES_ATUAL.lucro, 0)}`}
          icone="grafico"
          serie={FINANCEIRO.map((m) => (m.lucro / m.receita) * 100)}
          corSerie="var(--color-serie-5)"
        />
      </div>

      {/* ---------------------------------------------- esteira de produção */}
      <div className="mt-5">
        <Cartao
          titulo="Esteira de produção"
          descricao="Onde estão as ordens de serviço abertas agora."
          acao={
            <Link
              href="/painel/producao"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
            >
              Abrir o quadro
              <Icone nome="seta" className="size-3.5" />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ETAPAS_PRODUCAO.map((e) => {
              const lista = jobsDaEtapa(e.id);
              const horas = lista.reduce((s, j) => s + j.horas, 0);
              return (
                <div key={e.id} className="rounded-lg border border-linha bg-papel/50 p-4">
                  <div className="flex items-center gap-2 text-mute">
                    <Icone nome={e.icone} className="size-4" />
                    <p className="spec">{e.rotulo}</p>
                  </div>
                  <p className="mt-2.5 text-[1.5rem] leading-none font-semibold tabular">
                    {num(lista.length)}
                  </p>
                  <p className="mt-1.5 text-[0.6875rem] text-mute-2 tabular">
                    {num(horas, 1)} h de máquina na fila
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-linha pt-4">
            <p className="flex items-center gap-2 text-[0.8125rem]">
              <span className="size-1.5 rounded-full bg-erro" />
              <strong className="font-semibold tabular">{atrasados().length}</strong>
              <span className="text-mute">atrasadas</span>
            </p>
            <p className="flex items-center gap-2 text-[0.8125rem]">
              <span className="size-1.5 rounded-full bg-alerta" />
              <strong className="font-semibold tabular">{arteTravada().length}</strong>
              <span className="text-mute">esperando arte do cliente</span>
            </p>
            <p className="flex items-center gap-2 text-[0.8125rem]">
              <span className="size-1.5 rounded-full bg-serie-1" />
              <strong className="font-semibold tabular">{ocupacaoGeral()}%</strong>
              <span className="text-mute">da capacidade do parque</span>
            </p>
          </div>
        </Cartao>
      </div>

      {/* ------------------------------------------------ receita e canal */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Receita mensal"
          descricao="Últimos 12 meses, com o mesmo período do ano anterior para comparação."
        >
          <GraficoArea
            rotulos={FINANCEIRO.map((m) => m.mes)}
            series={[
              { rotulo: "2026", valores: FINANCEIRO.map((m) => m.receita) },
              { rotulo: "Ano anterior", valores: FINANCEIRO.map((m) => m.receitaAnterior) },
            ]}
          />
        </Cartao>

        <Cartao titulo="Origem da venda" descricao="Participação por canal no período.">
          <Rosca itens={canais} rotuloCentro="Período" />
        </Cartao>
      </div>

      {/* ------------------------------------------- volume e categorias */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Pedidos por dia"
          descricao="Últimos 30 dias. Segunda e terça concentram o volume da semana."
        >
          <GraficoBarras
            rotulos={serie.map((d, i) => (i % 3 === 0 ? dataCurta(d.data) : ""))}
            valores={serie.map((d) => d.qtd)}
            cor="var(--color-serie-2)"
            rotuloValor="Pedidos no dia"
          />
        </Cartao>

        <Cartao titulo="Receita por categoria" descricao="No período selecionado.">
          <BarrasHorizontais
            itens={categorias.slice(0, 6).map((c) => ({ nome: c.nome, valor: c.valor }))}
            formato="brlCurto"
          />
        </Cartao>
      </div>

      {/* ------------------------------------------------ pedidos recentes */}
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          padding={false}
          titulo="Últimos pedidos"
          acao={
            <Link
              href="/painel/pedidos"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
            >
              Ver todos
              <Icone nome="seta" className="size-3.5" />
            </Link>
          }
        >
          <Tabela
            cabecalho={[
              "Pedido",
              "Cliente",
              "Canal",
              "Status",
              { rotulo: "Total", alinhar: "dir" },
            ]}
          >
            {recentes.map((p) => (
              <Linha key={p.id}>
                <Celula>
                  <Link href="/painel/pedidos" className="spec hover:text-magenta-forte">
                    {p.id}
                  </Link>
                  <p className="mt-0.5 text-[0.6875rem] text-mute-2">{haQuanto(p.data)}</p>
                </Celula>
                <Celula>
                  <p className="font-medium">{p.cliente}</p>
                  <p className="text-[0.6875rem] text-mute-2">
                    {p.cidade}/{p.uf}
                  </p>
                </Celula>
                <Celula className="text-mute">{p.canal}</Celula>
                <Celula>
                  <SeloStatus tom={STATUS_PEDIDO[p.status].tom}>
                    {STATUS_PEDIDO[p.status].rotulo}
                  </SeloStatus>
                </Celula>
                <Celula alinhar="dir" className="font-medium tabular">
                  {brl(p.total)}
                </Celula>
              </Linha>
            ))}
          </Tabela>
        </Cartao>

        <Cartao titulo="Mais vendidos" descricao="Por receita no período.">
          <ul className="space-y-4">
            {topProdutos.map((t, i) => (
              <li key={t.produto.sku} className="flex items-center gap-3.5">
                <span className="spec w-4 shrink-0 text-mute-2 tabular">{i + 1}</span>
                <div
                  className="size-12 shrink-0 overflow-hidden rounded-lg border border-linha"
                  style={{ background: fundoDoProduto(t.produto.paleta) }}
                >
                  <FotoProduto produto={t.produto} className="size-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium">{t.produto.nome}</p>
                  <p className="text-[0.6875rem] text-mute-2 tabular">
                    {num(t.qtd)} unidades
                  </p>
                </div>
                <span className="shrink-0 text-[0.8125rem] font-medium tabular">
                  {brlCurto(t.valor)}
                </span>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>

      {/* ------------------------------------------------- estoque e B2B */}
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Cartao
          titulo="Estoque no mínimo"
          descricao="Itens que chegaram ao ponto de reposição."
          acao={
            <Link
              href="/painel/estoque"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
            >
              Repor
              <Icone nome="seta" className="size-3.5" />
            </Link>
          }
        >
          <ul className="divide-y divide-linha">
            {criticos.map((p) => (
              <li key={p.sku} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full ${
                    p.estoque === 0 ? "bg-erro-bg text-erro" : "bg-alerta-bg text-alerta"
                  }`}
                >
                  <Icone nome="alerta" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium">{p.nome}</p>
                  <p className="spec text-mute-2">{p.sku}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[0.8125rem] font-semibold tabular">{p.estoque} un</p>
                  <p className="text-[0.6875rem] text-mute-2 tabular">mín. {p.estoqueMin}</p>
                </div>
              </li>
            ))}
          </ul>
        </Cartao>

        <Cartao
          titulo="Funil B2B"
          descricao="Valor em negociação por etapa."
          acao={
            <Link
              href="/painel/b2b"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
            >
              Abrir pipeline
              <Icone nome="seta" className="size-3.5" />
            </Link>
          }
        >
          <BarrasHorizontais itens={funil} formato="brlCurto" />
          <div className="mt-6 flex items-center justify-between border-t border-linha pt-4">
            <p className="text-[0.8125rem] text-mute">
              {ORCAMENTOS.length} orçamentos abertos
            </p>
            <p className="text-[0.9375rem] font-semibold tabular">
              {brlCurto(ORCAMENTOS.reduce((s, o) => s + o.valor, 0))}
            </p>
          </div>
        </Cartao>
      </div>

      <AvisoPrototipo>
        Todos os números deste painel são fictícios, gerados para a apresentação.
        A escala foi calibrada para uma operação de porte (~R$ 240 mil/mês), mas
        precisa ser substituída pelos dados reais da Full Print antes de virar
        base para qualquer decisão.
      </AvisoPrototipo>
    </>
  );
}
