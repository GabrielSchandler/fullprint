"use client";

import { useMemo, useState } from "react";
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
  Vazio,
} from "@/components/painel/ui";
import { Icone } from "@/components/ui/Icone";
import { STATUS_ARTE, jobDoPedido } from "@/lib/producao";
import { brl, brlCurto, dataHora, num } from "@/lib/format";
import { FotoProduto } from "@/components/loja/FotoProduto";
import {
  CANAIS,
  PEDIDOS,
  STATUS_PEDIDO,
  type Pedido,
  type StatusPedido,
} from "@/lib/painel-dados";
import { BotaoExportar } from "@/components/painel/BotaoExportar";
import { useOrdenacao } from "@/components/painel/ordenacao";

const ABAS: { id: StatusPedido | "todos"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "novo", rotulo: "Novos" },
  { id: "producao", rotulo: "Em produção" },
  { id: "enviado", rotulo: "Enviados" },
  { id: "entregue", rotulo: "Entregues" },
  { id: "cancelado", rotulo: "Cancelados" },
];

const POR_PAGINA = 12;

function Detalhe({ pedido, fechar }: { pedido: Pedido; fechar: () => void }) {
  const etapas: StatusPedido[] = ["novo", "producao", "enviado", "entregue"];
  const indice = etapas.indexOf(pedido.status);

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
            <p className="spec text-mute-2">Pedido</p>
            <h2 className="mt-1 font-display text-3xl leading-none">{pedido.id}</h2>
            <p className="mt-2 text-[0.8125rem] text-mute">{dataHora(pedido.data)}</p>
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
          {/* esteira */}
          {pedido.status !== "cancelado" ? (
            <ol className="flex items-center">
              {etapas.map((e, i) => (
                <li key={e} className="flex flex-1 items-center last:flex-none">
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
                      className={`spec whitespace-nowrap ${
                        i <= indice ? "text-tinta" : "text-mute-2"
                      }`}
                    >
                      {STATUS_PEDIDO[e].rotulo}
                    </span>
                  </div>
                  {i < etapas.length - 1 && (
                    <span
                      className={`mx-2 mb-6 h-px flex-1 ${i < indice ? "bg-tinta" : "bg-linha"}`}
                    />
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-lg bg-erro-bg px-4 py-3">
              <p className="text-[0.8125rem] font-medium text-erro">Pedido cancelado</p>
              <p className="mt-1 text-[0.75rem] text-erro/80">
                Estorno processado. O estoque foi devolvido automaticamente.
              </p>
            </div>
          )}

          {/* cliente */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-linha bg-surface p-4">
              <p className="spec text-mute-2">Cliente</p>
              <p className="mt-2 text-sm font-medium">{pedido.cliente}</p>
              <p className="mt-0.5 text-[0.75rem] text-mute">{pedido.email}</p>
            </div>
            <div className="rounded-lg border border-linha bg-surface p-4">
              <p className="spec text-mute-2">Entrega</p>
              <p className="mt-2 text-sm font-medium">
                {pedido.cidade}/{pedido.uf}
              </p>
              <p className="mt-0.5 text-[0.75rem] text-mute">
                {pedido.frete === 0 ? "Frete grátis" : `Frete ${brl(pedido.frete)}`}
              </p>
            </div>
          </div>

          {/* itens */}
          <p className="spec mt-7 text-mute-2">Itens</p>
          <ul className="mt-3 divide-y divide-linha rounded-lg border border-linha bg-surface">
            {pedido.itens.map((i) => (
              <li key={i.produto.sku} className="flex items-center gap-3.5 p-4">
                <div
                  className="size-14 shrink-0 overflow-hidden rounded-lg border border-linha"
                  style={{ background: fundoDoProduto(i.produto.paleta) }}
                >
                  <FotoProduto produto={i.produto} className="size-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium">{i.produto.nome}</p>
                  <p className="spec mt-0.5 text-mute-2">
                    {i.produto.sku} · {num(i.qtd)} × {brl(i.preco)}
                  </p>
                </div>
                <span className="shrink-0 text-[0.8125rem] font-semibold tabular">
                  {brl(i.preco * i.qtd)}
                </span>
              </li>
            ))}
          </ul>

          {/* totais */}
          <dl className="mt-5 space-y-2 rounded-lg border border-linha bg-surface p-4 text-[0.8125rem]">
            <div className="flex justify-between">
              <dt className="text-mute">Subtotal</dt>
              <dd className="tabular">{brl(pedido.subtotal)}</dd>
            </div>
            {pedido.desconto > 0 && (
              <div className="flex justify-between text-ok">
                <dt>Desconto</dt>
                <dd className="tabular">−{brl(pedido.desconto)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-mute">Frete</dt>
              <dd className="tabular">{pedido.frete === 0 ? "Grátis" : brl(pedido.frete)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-linha pt-2.5">
              <dt className="font-medium">Total · {pedido.pagamento}</dt>
              <dd className="text-lg font-semibold tabular">{brl(pedido.total)}</dd>
            </div>
          </dl>
        </div>

        <footer className="flex gap-2 border-t border-linha bg-surface px-6 py-4">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-sm font-medium text-papel hover:bg-grafite">
            <Icone nome="caixa" className="size-4" />
            Avançar etapa
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta">
            <Icone nome="baixar" className="size-4" />
            Etiqueta
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default function PedidosPage() {
  const [aba, setAba] = useState<StatusPedido | "todos">("todos");
  const [canal, setCanal] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const [aberto, setAberto] = useState<Pedido | null>(null);
  const { ordem, alternar, ordenar } = useOrdenacao("data");

  const filtrados = useMemo(() => {
    return PEDIDOS.filter((p) => {
      if (aba !== "todos" && p.status !== aba) return false;
      if (canal !== "todos" && p.canal !== canal) return false;
      if (busca.trim()) {
        const t = busca.trim().toLowerCase();
        if (!(p.id + p.cliente + p.cidade).toLowerCase().includes(t)) return false;
      }
      return true;
    });
  }, [aba, canal, busca]);

  const ordenados = ordenar(filtrados, (p, chave) =>
    chave === "cliente"
      ? p.cliente
      : chave === "itens"
        ? p.itens.reduce((s, i) => s + i.qtd, 0)
        : chave === "canal"
          ? p.canal
          : chave === "pagamento"
            ? p.pagamento
            : chave === "status"
              ? STATUS_PEDIDO[p.status].rotulo
              : chave === "total"
                ? p.total
                : p.data,
  );

  const paginas = Math.ceil(ordenados.length / POR_PAGINA);
  const visiveis = ordenados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

  const faturado = PEDIDOS.filter((p) => p.status !== "cancelado").reduce(
    (s, p) => s + p.total,
    0,
  );
  const cancelados = PEDIDOS.filter((p) => p.status === "cancelado");

  const contar = (id: StatusPedido | "todos") =>
    id === "todos" ? PEDIDOS.length : PEDIDOS.filter((p) => p.status === id).length;

  return (
    <>
      <CabecaPagina
        titulo="Pedidos"
        descricao="Amostra dos últimos 90 dias. A esteira vai de novo a entregue; cancelamento devolve o estoque."
        acoes={
          <BotaoExportar
            nome="pedidos"
            rotulo="Exportar CSV"
            colunas={[
              "Pedido",
              "Data",
              "Cliente",
              "E-mail",
              "Cidade",
              "UF",
              "Canal",
              "Pagamento",
              "Status",
              "Itens",
              "Subtotal",
              "Desconto",
              "Frete",
              "Total",
            ]}
            linhas={ordenados.map((p) => [
              p.id,
              p.data,
              p.cliente,
              p.email,
              p.cidade,
              p.uf,
              p.canal,
              p.pagamento,
              STATUS_PEDIDO[p.status].rotulo,
              p.itens.reduce((s, i) => s + i.qtd, 0),
              p.subtotal,
              p.desconto,
              p.frete,
              p.total,
            ])}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi rotulo="Pedidos na amostra" valor={num(PEDIDOS.length)} icone="sacola" />
        <Kpi rotulo="Faturado" valor={brlCurto(faturado)} icone="carteira" />
        <Kpi
          rotulo="Ticket médio"
          valor={brl(faturado / (PEDIDOS.length - cancelados.length), 0)}
          icone="etiqueta"
        />
        <Kpi
          rotulo="Taxa de cancelamento"
          valor={`${((cancelados.length / PEDIDOS.length) * 100).toFixed(1).replace(".", ",")}%`}
          variacao={-0.4}
          invertido
          icone="alerta"
        />
      </div>

      <div className="mt-5">
        <Cartao padding={false}>
          {/* filtros */}
          <div className="flex flex-wrap items-center gap-3 border-b border-linha px-6 py-4">
            <div className="scroll-x sem-barra -mx-1 flex gap-1 px-1">
              {ABAS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAba(a.id);
                    setPagina(0);
                  }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors ${
                    aba === a.id
                      ? "bg-tinta font-medium text-papel"
                      : "text-mute hover:bg-papel-2 hover:text-tinta"
                  }`}
                >
                  {a.rotulo}
                  <span
                    className={`text-[0.6875rem] tabular ${
                      aba === a.id ? "text-papel/60" : "text-mute-2"
                    }`}
                  >
                    {contar(a.id)}
                  </span>
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <select
                value={canal}
                onChange={(e) => {
                  setCanal(e.target.value);
                  setPagina(0);
                }}
                className="h-9 rounded-full border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none hover:border-linha-forte"
              >
                <option value="todos">Todos os canais</option>
                {CANAIS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Icone
                  nome="busca"
                  className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-mute-2"
                />
                <input
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setPagina(0);
                  }}
                  placeholder="Buscar pedido ou cliente"
                  className="h-9 w-52 rounded-full border border-linha bg-surface pr-3.5 pl-9 text-[0.8125rem] outline-none focus:border-tinta"
                />
              </div>
            </div>
          </div>

          {visiveis.length === 0 ? (
            <Vazio
              icone="sacola"
              titulo="Nenhum pedido com esses filtros"
              texto="Ajuste a aba de status, o canal ou a busca. A amostra tem 180 pedidos dos últimos 90 dias."
              aoLimpar={() => {
                setAba("todos");
                setCanal("todos");
                setBusca("");
                setPagina(0);
              }}
            />
          ) : (
            <Tabela
              ordem={ordem}
              aoOrdenar={(c) => {
                alternar(c);
                setPagina(0);
              }}
              cabecalho={[
                { rotulo: "Pedido", chave: "data" },
                { rotulo: "Cliente", chave: "cliente" },
                { rotulo: "Itens", chave: "itens" },
                { rotulo: "Canal", chave: "canal" },
                { rotulo: "Pagamento", chave: "pagamento" },
                { rotulo: "Status", chave: "status" },
                { rotulo: "Arte" },
                { rotulo: "Total", alinhar: "dir", chave: "total" },
                { rotulo: "", alinhar: "dir" },
              ]}
            >
              {visiveis.map((p) => (
                <Linha key={p.id}>
                  <Celula>
                    <span className="spec">{p.id}</span>
                    <p className="mt-0.5 text-[0.6875rem] text-mute-2">{dataHora(p.data)}</p>
                  </Celula>
                  <Celula>
                    <p className="font-medium">{p.cliente}</p>
                    <p className="text-[0.6875rem] text-mute-2">
                      {p.cidade}/{p.uf}
                    </p>
                  </Celula>
                  <Celula className="text-mute tabular">
                    {p.itens.reduce((s, i) => s + i.qtd, 0)}
                  </Celula>
                  <Celula className="text-mute">{p.canal}</Celula>
                  <Celula className="text-mute">{p.pagamento}</Celula>
                  <Celula>
                    <SeloStatus tom={STATUS_PEDIDO[p.status].tom}>
                      {STATUS_PEDIDO[p.status].rotulo}
                    </SeloStatus>
                  </Celula>
                  <Celula>
                    {/* só pedido na esteira tem OS aberta; entregue e cancelado
                        não mostram arte nenhuma, e o traço diz isso */}
                    {(() => {
                      const j = jobDoPedido(p.id);
                      if (!j) return <span className="text-mute-2">—</span>;
                      return (
                        <SeloStatus tom={STATUS_ARTE[j.arte].tom}>
                          {STATUS_ARTE[j.arte].curto}
                        </SeloStatus>
                      );
                    })()}
                  </Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {brl(p.total)}
                  </Celula>
                  <Celula alinhar="dir">
                    <button
                      onClick={() => setAberto(p)}
                      className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                      aria-label={`Abrir ${p.id}`}
                    >
                      <Icone nome="olho" className="size-4" />
                    </button>
                  </Celula>
                </Linha>
              ))}
            </Tabela>
          )}

          {/* paginação */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linha px-6 py-4">
            <p className="text-[0.75rem] text-mute tabular">
              {ordenados.length === 0
                ? "Nenhum pedido"
                : `${pagina * POR_PAGINA + 1}–${Math.min(
                    (pagina + 1) * POR_PAGINA,
                    ordenados.length,
                  )} de ${ordenados.length}`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina((v) => Math.max(0, v - 1))}
                disabled={pagina === 0}
                className="grid size-9 place-items-center rounded-full border border-linha disabled:opacity-35 hover:border-tinta"
                aria-label="Página anterior"
              >
                <Icone nome="setaEsq" className="size-4" />
              </button>
              <span className="px-3 text-[0.8125rem] tabular">
                {pagina + 1} / {Math.max(paginas, 1)}
              </span>
              <button
                onClick={() => setPagina((v) => Math.min(paginas - 1, v + 1))}
                disabled={pagina >= paginas - 1}
                className="grid size-9 place-items-center rounded-full border border-linha disabled:opacity-35 hover:border-tinta"
                aria-label="Próxima página"
              >
                <Icone nome="seta" className="size-4" />
              </button>
            </div>
          </div>
        </Cartao>
      </div>

      <AvisoPrototipo>
        Pedidos fictícios. “Avançar etapa” e “Etiqueta” são botões de demonstração —
        a integração com os Correios (etiqueta e rastreio) entra na fase seguinte.
      </AvisoPrototipo>

      {aberto && <Detalhe pedido={aberto} fechar={() => setAberto(null)} />}
    </>
  );
}
