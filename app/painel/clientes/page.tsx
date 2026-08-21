"use client";

import { useMemo, useState } from "react";
import { ProximaFase } from "@/components/painel/ProximaFase";
import { GraficoBarras, Rosca } from "@/components/painel/graficos";
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
import { HOJE, brl, brlCurto, data, haQuanto, num } from "@/lib/format";
import { CLIENTES, PEDIDOS, STATUS_PEDIDO, type Cliente } from "@/lib/painel-dados";
import { BotaoExportar } from "@/components/painel/BotaoExportar";
import { useOrdenacao } from "@/components/painel/ordenacao";

const POR_PAGINA = 12;

const TAGS = ["VIP", "Recorrente", "Novo", "Inativo"] as const;

const TOM_TAG = {
  VIP: "destaque",
  Recorrente: "ok",
  Novo: "info",
  Inativo: "neutro",
} as const;

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/* -------------------------------------------------------------- detalhe */

function Ficha({ cliente, fechar }: { cliente: Cliente; fechar: () => void }) {
  const pedidos = PEDIDOS.filter((p) => p.cliente === cliente.nome);
  const iniciais = cliente.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <aside className="absolute top-0 right-0 flex h-full w-[min(560px,100vw)] flex-col bg-papel shadow-papel-alta">
        <header className="flex items-start justify-between gap-4 border-b border-linha bg-surface px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-tinta text-sm font-semibold text-papel">
              {iniciais}
            </span>
            <div className="min-w-0">
              <p className="spec text-mute-2">{cliente.id}</p>
              <h2 className="mt-1 truncate font-display text-2xl leading-none">{cliente.nome}</h2>
              <p className="mt-1.5 truncate text-[0.8125rem] text-mute">{cliente.email}</p>
            </div>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { rotulo: "Pedidos", valor: num(cliente.pedidos) },
              { rotulo: "Gasto total", valor: brlCurto(cliente.gasto) },
              { rotulo: "Ticket médio", valor: brl(cliente.ticket, 0) },
              { rotulo: "Perfil", valor: cliente.tag },
            ].map((k) => (
              <div key={k.rotulo} className="rounded-lg border border-linha bg-surface p-4">
                <p className="spec text-mute-2">{k.rotulo}</p>
                <p className="mt-1.5 text-[0.9375rem] font-semibold tabular">{k.valor}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-linha bg-surface p-4">
              <p className="spec text-mute-2">Cadastro</p>
              <p className="mt-2 text-sm font-medium">
                {cliente.tipo === "PJ" ? "Pessoa jurídica" : "Pessoa física"}
              </p>
              <p className="mt-0.5 text-[0.75rem] text-mute">
                Cliente desde {data(cliente.primeira)}
              </p>
            </div>
            <div className="rounded-lg border border-linha bg-surface p-4">
              <p className="spec text-mute-2">Praça</p>
              <p className="mt-2 text-sm font-medium">
                {cliente.cidade}/{cliente.uf}
              </p>
              <p className="mt-0.5 text-[0.75rem] text-mute">
                Última compra {haQuanto(cliente.ultima)}
              </p>
            </div>
          </div>

          <p className="spec mt-7 text-mute-2">Pedidos na amostra</p>
          <ul className="mt-3 divide-y divide-linha rounded-lg border border-linha bg-surface">
            {pedidos.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="spec">{p.id}</p>
                  <p className="mt-0.5 text-[0.75rem] text-mute">
                    {data(p.data)} · {p.itens.length} {p.itens.length === 1 ? "item" : "itens"} ·{" "}
                    {p.canal}
                  </p>
                </div>
                <SeloStatus tom={STATUS_PEDIDO[p.status].tom}>
                  {STATUS_PEDIDO[p.status].rotulo}
                </SeloStatus>
                <span className="w-24 shrink-0 text-right text-[0.8125rem] font-semibold tabular">
                  {brl(p.total)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.75rem] text-mute">
            A amostra guarda {pedidos.length} de {cliente.pedidos} pedidos deste cliente — o
            histórico completo vem do banco.
          </p>
        </div>

        <footer className="flex gap-2 border-t border-linha bg-surface px-6 py-4">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-sm font-medium text-papel hover:bg-grafite">
            <Icone nome="whatsapp" className="size-4" />
            Falar no WhatsApp
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta">
            <Icone nome="cupom" className="size-4" />
            Enviar cupom
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function ClientesPage() {
  const [tag, setTag] = useState<string>("todos");
  const [tipo, setTipo] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const [aberto, setAberto] = useState<Cliente | null>(null);
  const [campanha, setCampanha] = useState(false);
  const { ordem, alternar, ordenar } = useOrdenacao("gasto");

  const filtrados = useMemo(
    () =>
      CLIENTES.filter((c) => {
        if (tag !== "todos" && c.tag !== tag) return false;
        if (tipo !== "todos" && c.tipo !== tipo) return false;
        if (busca.trim()) {
          const t = busca.trim().toLowerCase();
          if (!(c.nome + c.email + c.cidade).toLowerCase().includes(t)) return false;
        }
        return true;
      }),
    [tag, tipo, busca],
  );

  const ordenados = ordenar(filtrados, (c, chave) =>
    chave === "nome"
      ? c.nome
      : chave === "cidade"
        ? `${c.uf} ${c.cidade}`
        : chave === "tipo"
          ? c.tipo
          : chave === "pedidos"
            ? c.pedidos
            : chave === "ticket"
              ? c.ticket
              : chave === "ultima"
                ? c.ultima
                : chave === "tag"
                  ? c.tag
                  : c.gasto,
  );

  const paginas = Math.ceil(ordenados.length / POR_PAGINA);
  const visiveis = ordenados.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

  const gastoTotal = CLIENTES.reduce((s, c) => s + c.gasto, 0);
  const ltv = gastoTotal / CLIENTES.length;
  const vips = CLIENTES.filter((c) => c.tag === "VIP");
  const inativos = CLIENTES.filter((c) => c.tag === "Inativo");

  const porTag = TAGS.map((t) => ({
    nome: t,
    valor: CLIENTES.filter((c) => c.tag === t).reduce((s, c) => s + c.gasto, 0),
  }));

  /* aquisição: quantos clientes fizeram a primeira compra em cada um dos 12 meses */
  const aquisicao = useMemo(() => {
    /* CLIENTES vem ordenado por gasto, então CLIENTES[0].ultima é a data de
       um cliente qualquer — a janela ficava dois meses atrás do mês corrente */
    const hoje = HOJE;
    const meses: { rotulo: string; qtd: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        rotulo: MESES[d.getMonth()],
        qtd: CLIENTES.filter(
          (c) =>
            c.primeira.getMonth() === d.getMonth() &&
            c.primeira.getFullYear() === d.getFullYear(),
        ).length,
      });
    }
    return meses;
  }, []);

  const reset = () => setPagina(0);

  return (
    <>
      <CabecaPagina
        titulo="Clientes"
        descricao="Quem compra, quanto gasta e há quanto tempo não aparece. O perfil é recalculado a cada pedido."
        acoes={
          <>
            <BotaoExportar
              nome="clientes"
              rotulo="Exportar base"
              colunas={[
                "Código",
                "Nome",
                "E-mail",
                "Tipo",
                "Cidade",
                "UF",
                "Pedidos",
                "Gasto total",
                "Ticket médio",
                "Primeira compra",
                "Última compra",
                "Perfil",
              ]}
              linhas={ordenados.map((c) => [
                c.id,
                c.nome,
                c.email,
                c.tipo,
                c.cidade,
                c.uf,
                c.pedidos,
                c.gasto,
                c.ticket,
                c.primeira,
                c.ultima,
                c.tag,
              ])}
            />
            <button
              onClick={() => setCampanha(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
            >
              <Icone nome="cupom" className="size-4" />
              Campanha de reativação
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Base de clientes"
          valor={num(CLIENTES.length)}
          auxiliar={`${CLIENTES.filter((c) => c.tipo === "PJ").length} com CNPJ`}
          icone="pessoas"
        />
        <Kpi
          rotulo="Gasto médio (LTV)"
          valor={brl(ltv, 0)}
          auxiliar={`${brlCurto(gastoTotal)} na base inteira`}
          icone="carteira"
        />
        <Kpi
          rotulo="Clientes VIP"
          valor={num(vips.length)}
          auxiliar={`${((vips.reduce((s, c) => s + c.gasto, 0) / gastoTotal) * 100).toFixed(0)}% da receita`}
          icone="estrela"
        />
        <Kpi
          rotulo="Inativos"
          valor={num(inativos.length)}
          auxiliar="Sem comprar há mais de 60 dias"
          icone="relogio"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          titulo="Aquisição de clientes"
          descricao="Primeira compra registrada em cada mês."
        >
          {/* mais alto que o padrão: ao lado da rosca o cartão estica, e com
              200px de gráfico sobrava meia altura de espaço morto embaixo */}
          <GraficoBarras
            rotulos={aquisicao.map((m) => m.rotulo)}
            valores={aquisicao.map((m) => m.qtd)}
            altura={300}
            cor="var(--color-serie-2)"
            rotuloValor="Novos clientes"
          />
        </Cartao>

        <Cartao titulo="Receita por perfil" descricao="Quanto cada grupo representa.">
          <Rosca itens={porTag} rotuloCentro="Base" />
        </Cartao>
      </div>

      <div className="mt-5">
        <Cartao padding={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-linha px-6 py-4">
            <div className="scroll-x sem-barra -mx-1 flex gap-1 px-1">
              {[{ id: "todos", rotulo: "Todos" }, ...TAGS.map((t) => ({ id: t, rotulo: t }))].map(
                (t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTag(t.id);
                      reset();
                    }}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors ${
                      tag === t.id
                        ? "bg-tinta font-medium text-papel"
                        : "text-mute hover:bg-papel-2 hover:text-tinta"
                    }`}
                  >
                    {t.rotulo}
                    <span
                      className={`text-[0.6875rem] tabular ${
                        tag === t.id ? "text-papel/60" : "text-mute-2"
                      }`}
                    >
                      {t.id === "todos"
                        ? CLIENTES.length
                        : CLIENTES.filter((c) => c.tag === t.id).length}
                    </span>
                  </button>
                ),
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <select
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value);
                  reset();
                }}
                className="h-9 rounded-full border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none hover:border-linha-forte"
              >
                <option value="todos">PF e PJ</option>
                <option value="PF">Só pessoa física</option>
                <option value="PJ">Só pessoa jurídica</option>
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
                    reset();
                  }}
                  placeholder="Buscar cliente"
                  className="h-9 w-52 rounded-full border border-linha bg-surface pr-3.5 pl-9 text-[0.8125rem] outline-none focus:border-tinta"
                />
              </div>
            </div>
          </div>

          {visiveis.length === 0 ? (
            <Vazio
              icone="pessoas"
              titulo="Nenhum cliente com esse recorte"
              texto="Nenhum comprador da base combina o perfil, o tipo de cadastro e a busca ao mesmo tempo."
              aoLimpar={() => {
                setTag("todos");
                setTipo("todos");
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
                { rotulo: "Cliente", chave: "nome" },
                { rotulo: "Praça", chave: "cidade" },
                { rotulo: "Tipo", chave: "tipo" },
                { rotulo: "Pedidos", alinhar: "dir", chave: "pedidos" },
                { rotulo: "Gasto total", alinhar: "dir", chave: "gasto" },
                { rotulo: "Ticket", alinhar: "dir", chave: "ticket" },
                { rotulo: "Última compra", chave: "ultima" },
                { rotulo: "Perfil", chave: "tag" },
                { rotulo: "", alinhar: "dir" },
              ]}
            >
              {visiveis.map((c) => (
                <Linha key={c.id}>
                  <Celula>
                    <p className="font-medium">{c.nome}</p>
                    <p className="text-[0.6875rem] text-mute-2">{c.email}</p>
                  </Celula>
                  <Celula className="text-mute">
                    {c.cidade}/{c.uf}
                  </Celula>
                  <Celula className="text-mute">{c.tipo}</Celula>
                  <Celula alinhar="dir" className="tabular">
                    {num(c.pedidos)}
                  </Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {brl(c.gasto, 0)}
                  </Celula>
                  <Celula alinhar="dir" className="text-mute tabular">
                    {brl(c.ticket, 0)}
                  </Celula>
                  <Celula className="text-mute">{haQuanto(c.ultima)}</Celula>
                  <Celula>
                    <SeloStatus tom={TOM_TAG[c.tag]}>{c.tag}</SeloStatus>
                  </Celula>
                  <Celula alinhar="dir">
                    <button
                      onClick={() => setAberto(c)}
                      className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                      aria-label={`Abrir ficha de ${c.nome}`}
                    >
                      <Icone nome="olho" className="size-4" />
                    </button>
                  </Celula>
                </Linha>
              ))}
            </Tabela>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linha px-6 py-4">
            <p className="text-[0.75rem] text-mute tabular">
              {ordenados.length === 0
                ? "Nenhum cliente"
                : `${pagina * POR_PAGINA + 1}–${Math.min(
                    (pagina + 1) * POR_PAGINA,
                    ordenados.length,
                  )} de ${ordenados.length}`}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina((v) => Math.max(0, v - 1))}
                disabled={pagina === 0}
                className="grid size-9 place-items-center rounded-full border border-linha hover:border-tinta disabled:opacity-35"
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
                className="grid size-9 place-items-center rounded-full border border-linha hover:border-tinta disabled:opacity-35"
                aria-label="Próxima página"
              >
                <Icone nome="seta" className="size-4" />
              </button>
            </div>
          </div>
        </Cartao>
      </div>

      <AvisoPrototipo>
        Base fictícia montada a partir da amostra de pedidos. Com o cadastro real ligado, o
        perfil (novo, recorrente, VIP, inativo) é recalculado sozinho e alimenta as campanhas
        de e-mail e cupom.
      </AvisoPrototipo>

      {aberto && <Ficha cliente={aberto} fechar={() => setAberto(null)} />}
          {campanha && (
        <ProximaFase
          contexto="Marketing"
          titulo="Campanha de reativação"
          fechar={() => setCampanha(false)}
          itens={[
            "Selecionar o público pelo perfil já calculado aqui — inativos há mais de 60 dias, VIPs sem comprar no mês, quem comprou uma vez só.",
            "Gerar um cupom exclusivo para a campanha, com validade e limite de uso próprios.",
            "Disparar por e-mail e por WhatsApp, com o texto montado a partir do último produto comprado.",
            "Medir o retorno na própria tela: quantos voltaram, quanto faturou e qual foi o custo do desconto.",
          ]}
        />
      )}
</>
  );
}
