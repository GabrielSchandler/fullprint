"use client";

import Link from "next/link";
import { useState } from "react";
import { GraficoBarras } from "@/components/painel/graficos";
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
import { BotaoExportar } from "@/components/painel/BotaoExportar";
import { Icone } from "@/components/ui/Icone";
import { brl, dataCurta, dataHora, num } from "@/lib/format";
import {
  ETAPAS_PRODUCAO,
  JOBS,
  STATUS_ARTE,
  type EtapaProducao,
  type Job,
  arteTravada,
  atrasados,
  cargaPorMaquina,
  diasDePrazo,
  entregasPrevistas,
  horasNaEsteira,
  jobsDaEtapa,
  maquina,
  noLimite,
  ocupacaoGeral,
} from "@/lib/producao";

/* ------------------------------------------------------------ prazo */

/**
 * O prazo em uma palavra.
 *
 * Data crua obriga quem olha a fazer a conta de cabeça, job por job. O quadro
 * só serve se o atraso salta aos olhos antes da leitura.
 */
function selosPrazo(j: Job) {
  const d = diasDePrazo(j);
  if (d < 0)
    return { tom: "erro" as const, texto: d === -1 ? "1 dia atrasado" : `${-d} dias atrasado` };
  if (d === 0) return { tom: "alerta" as const, texto: "Vence hoje" };
  if (d === 1) return { tom: "alerta" as const, texto: "Vence amanhã" };
  return { tom: "neutro" as const, texto: `${d} dias` };
}

/* ------------------------------------------------------- ficha da OS */

function Ficha({ job, fechar }: { job: Job; fechar: () => void }) {
  const prazo = selosPrazo(job);
  const arte = STATUS_ARTE[job.arte];
  const m = maquina(job.maquina);

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <aside className="relative flex h-full w-[min(480px,100%)] flex-col overflow-y-auto bg-surface shadow-papel-alta">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-linha bg-surface px-6 py-5">
          <div>
            <p className="spec text-magenta-forte">{job.os}</p>
            <h2 className="mt-1 font-display text-2xl leading-none">{job.pedido.cliente}</h2>
            <p className="mt-1.5 text-[0.8125rem] text-mute">
              Pedido {job.pedido.id} · {job.pedido.cidade}/{job.pedido.uf}
            </p>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="flex-1 px-6 py-5">
          <div className="flex flex-wrap gap-2">
            <SeloStatus tom={prazo.tom}>{prazo.texto}</SeloStatus>
            <SeloStatus tom={arte.tom}>{arte.rotulo}</SeloStatus>
          </div>

          {job.apontamento && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-erro/25 bg-erro-bg px-4 py-3.5">
              <Icone nome="alerta" className="mt-0.5 size-4 shrink-0 text-erro" />
              <div>
                <p className="text-[0.8125rem] font-medium text-erro">
                  A conferência barrou o arquivo
                </p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-tinta/85">
                  {job.apontamento}
                </p>
              </div>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
            {[
              ["Etapa", ETAPAS_PRODUCAO.find((e) => e.id === job.etapa)!.rotulo],
              ["Máquina", m.nome],
              ["Operador", job.operador],
              ["Tiragem", `${num(job.tiragem)} peças`],
              ["Horas de máquina", `${num(job.horas, 1)} h`],
              ["Canal", job.pedido.canal],
              ["Entrada", dataHora(job.entrada)],
              ["Prazo", dataHora(job.prazo)],
            ].map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt className="spec text-mute-2">{rotulo}</dt>
                <dd className="mt-1 text-[0.875rem] font-medium">{valor}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 text-[0.9375rem] font-semibold">Itens da OS</h3>
          <ul className="mt-3 divide-y divide-linha border-y border-linha">
            {job.pedido.itens.map((it) => (
              <li key={it.produto.sku} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium">{it.produto.nome}</p>
                  <p className="spec text-mute-2">{it.produto.sku}</p>
                </div>
                <span className="shrink-0 text-[0.8125rem] tabular text-mute">
                  {num(it.qtd)} un
                </span>
                <span className="w-24 shrink-0 text-right text-[0.8125rem] font-medium tabular">
                  {brl(it.preco * it.qtd)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[0.8125rem] text-mute">Valor do pedido</p>
            <p className="text-[0.9375rem] font-semibold tabular">{brl(job.pedido.total)}</p>
          </div>
        </div>

        <footer className="sticky bottom-0 border-t border-linha bg-surface px-6 py-4">
          <p className="text-[0.75rem] leading-relaxed text-mute">
            Mover a OS de etapa, trocar a máquina e avisar o cliente entram junto
            com o cadastro real — aqui a ficha é de leitura.
          </p>
        </footer>
      </aside>
    </div>
  );
}

/* ----------------------------------------------------- cartão do job */

function CartaoJob({ job, aoAbrir }: { job: Job; aoAbrir: () => void }) {
  const prazo = selosPrazo(job);
  const arte = STATUS_ARTE[job.arte];
  const travada = job.arte === "pendente" || job.arte === "ajuste";

  return (
    <button
      onClick={aoAbrir}
      className={`w-full rounded-lg border bg-surface p-3.5 text-left transition-all hover:-translate-y-px hover:shadow-cartao ${
        prazo.tom === "erro" ? "border-erro/35" : "border-linha hover:border-linha-forte"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="spec text-mute-2">{job.os}</span>
        <SeloStatus tom={prazo.tom} ponto={false}>
          {prazo.texto}
        </SeloStatus>
      </div>

      <p className="mt-2 truncate text-[0.8125rem] font-medium">{job.pedido.cliente}</p>
      <p className="mt-0.5 truncate text-[0.75rem] text-mute">
        {num(job.tiragem)} peças · {maquina(job.maquina).nome}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-linha pt-2.5">
        {/* cor vem da variável do tom — classe montada em template literal o
            Tailwind não gera, e o selo saía sempre sem cor */}
        <span
          className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium"
          style={{ color: travada ? `var(--color-${arte.tom})` : "var(--color-mute-2)" }}
        >
          {travada && <Icone nome="alerta" className="size-3" />}
          {arte.curto}
        </span>
        <span className="text-[0.6875rem] text-mute-2 tabular">{num(job.horas, 1)} h</span>
      </div>
    </button>
  );
}

/* --------------------------------------------------------- a página */

export default function ProducaoPage() {
  const [aberto, setAberto] = useState<Job | null>(null);
  const [foco, setFoco] = useState<"todos" | "atrasados" | "arte">("todos");

  const carga = cargaPorMaquina().filter((c) => c.jobs > 0);
  const entregas = entregasPrevistas(7);
  const emAtraso = atrasados();
  const travados = arteTravada();
  const limite = noLimite();

  const filtrar = (lista: Job[]) =>
    foco === "atrasados"
      ? lista.filter((j) => diasDePrazo(j) < 0)
      : foco === "arte"
        ? lista.filter((j) => j.arte === "pendente" || j.arte === "ajuste")
        : lista;

  const FOCOS = [
    { id: "todos", rotulo: "Tudo na esteira", n: JOBS.length },
    { id: "atrasados", rotulo: "Atrasados", n: emAtraso.length },
    { id: "arte", rotulo: "Arte travada", n: travados.length },
  ] as const;

  return (
    <>
      <CabecaPagina
        titulo="Produção"
        descricao="A esteira da gráfica em tempo real: o que está em cada máquina, o que vence primeiro e o que não pode rodar porque a arte não passou."
        acoes={
          <BotaoExportar
            nome="ordens-de-servico"
            tom="tinta"
            colunas={["OS", "Pedido", "Cliente", "Etapa", "Máquina", "Tiragem", "Arte", "Prazo"]}
            linhas={JOBS.map((j) => [
              j.os,
              j.pedido.id,
              j.pedido.cliente,
              ETAPAS_PRODUCAO.find((e) => e.id === j.etapa)!.rotulo,
              maquina(j.maquina).nome,
              j.tiragem,
              STATUS_ARTE[j.arte].rotulo,
              j.prazo,
            ])}
          />
        }
      />

      {/* ------------------------------------------------------------- KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="OS na esteira"
          valor={num(JOBS.length)}
          auxiliar={`${num(horasNaEsteira(), 1)} h de máquina na fila`}
          icone="caixa"
        />
        <Kpi
          rotulo="Atrasadas"
          valor={num(emAtraso.length)}
          auxiliar={
            emAtraso.length
              ? `A mais antiga venceu ${-diasDePrazo(emAtraso[0]) === 1 ? "1 dia" : `${-diasDePrazo(emAtraso[0])} dias`} atrás`
              : "Nenhuma OS passou do prazo"
          }
          icone="relogio"
        />
        <Kpi
          rotulo="Arte travada"
          valor={num(travados.length)}
          auxiliar={`${travados.filter((j) => j.arte === "pendente").length} sem arquivo, ${travados.filter((j) => j.arte === "ajuste").length} com ajuste pedido`}
          icone="papel"
        />
        <Kpi
          rotulo="Ocupação do parque"
          valor={`${ocupacaoGeral()}%`}
          auxiliar="Horas na fila sobre a capacidade de um dia"
          icone="raio"
        />
      </div>

      {/* ----------------------------------------------------------- alerta */}
      {(emAtraso.length > 0 || limite.length > 0) && (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-alerta/30 bg-alerta-bg/50 px-5 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-alerta-bg text-alerta">
            <Icone nome="relogio" className="size-4" />
          </span>
          <p className="flex-1 text-[0.875rem] leading-relaxed">
            <strong className="font-semibold">A ordem do dia:</strong>{" "}
            {emAtraso.length > 0 && (
              <>
                {emAtraso.length}{" "}
                {emAtraso.length === 1 ? "OS já passou" : "OS já passaram"} do prazo
                {limite.length > 0 && " e "}
              </>
            )}
            {limite.length > 0 && (
              <>
                {limite.length} {limite.length === 1 ? "vence" : "vencem"} até amanhã
              </>
            )}
            . Começar pelas que estão presas na pré-impressão — sem arte liberada
            a máquina não roda.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------ quadro */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl leading-none">Quadro da esteira</h2>
        <div className="flex flex-wrap gap-1.5">
          {FOCOS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFoco(f.id)}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[0.8125rem] font-medium transition-colors ${
                foco === f.id
                  ? "border-tinta bg-tinta text-papel"
                  : "border-linha bg-surface hover:border-linha-forte"
              }`}
            >
              {f.rotulo}
              <span
                className={`rounded-full px-1.5 text-[0.6875rem] tabular ${
                  foco === f.id ? "bg-papel/20" : "bg-papel-2 text-mute"
                }`}
              >
                {f.n}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* items-start: sem isso a coluna de 1 card estica ate a altura da de 9 e
          abre um vao que parece defeito */}
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {ETAPAS_PRODUCAO.map((etapa) => {
          const lista = filtrar(jobsDaEtapa(etapa.id as EtapaProducao));
          const horas = Math.round(lista.reduce((s, j) => s + j.horas, 0) * 10) / 10;

          return (
            <section
              key={etapa.id}
              className="flex flex-col rounded-xl border border-linha bg-papel/50 p-3"
            >
              <header className="px-1.5 pb-3">
                <div className="flex items-center gap-2">
                  <Icone nome={etapa.icone} className="size-4 text-mute" />
                  <h3 className="flex-1 text-[0.875rem] font-semibold">{etapa.rotulo}</h3>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[0.6875rem] font-medium tabular text-mute">
                    {lista.length}
                  </span>
                </div>
                <p className="mt-1 text-[0.6875rem] leading-relaxed text-mute-2">
                  {lista.length ? `${num(horas, 1)} h na fila` : etapa.resumo}
                </p>
              </header>

              <div className="flex flex-col gap-2.5">
                {lista.length ? (
                  lista.map((j) => (
                    <CartaoJob key={j.os} job={j} aoAbrir={() => setAberto(j)} />
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-linha px-3 py-8 text-center text-[0.75rem] text-mute-2">
                    Nada aqui
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* -------------------------------------------------- carga e entregas */}
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Cartao
          titulo="Carga por máquina"
          descricao="Horas na fila sobre a capacidade de um dia útil. Acima de 100% a máquina não fecha o dia."
        >
          <ul className="space-y-4">
            {carga.map((m) => (
              <li key={m.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="truncate text-[0.8125rem] text-tinta/85">{m.nome}</span>
                  <span
                    className={`shrink-0 text-[0.8125rem] font-medium tabular ${
                      m.ocupacao > 100 ? "text-erro" : ""
                    }`}
                  >
                    {m.ocupacao}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-papel-3">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${Math.min(m.ocupacao, 100)}%`,
                      background:
                        m.ocupacao > 100
                          ? "var(--color-erro)"
                          : m.ocupacao > 80
                            ? "var(--color-alerta)"
                            : "var(--color-serie-1)",
                    }}
                  />
                </div>
                <p className="mt-1 text-[0.6875rem] text-mute-2 tabular">
                  {m.jobs} {m.jobs === 1 ? "OS" : "OS"} · {num(m.horas, 1)} h de{" "}
                  {m.capacidade} h
                </p>
              </li>
            ))}
          </ul>
        </Cartao>

        <Cartao
          titulo="Entregas previstas"
          descricao="Quantas OS vencem em cada dia da próxima semana."
        >
          <GraficoBarras
            rotulos={entregas.map((e) => dataCurta(e.data))}
            valores={entregas.map((e) => e.qtd)}
            cor="var(--color-serie-3)"
            rotuloValor="OS com prazo no dia"
          />
        </Cartao>
      </div>

      {/* ------------------------------------------------------ arte travada */}
      <div className="mt-5">
        <Cartao
          padding={false}
          titulo="Arte travada"
          descricao="Cada uma dessas OS está parada esperando o cliente — é a fila que o atendimento resolve, não a produção."
          acao={
            <Link
              href="/painel/pedidos"
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
            >
              Ver pedidos
              <Icone nome="seta" className="size-3.5" />
            </Link>
          }
        >
          {travados.length ? (
            <Tabela
              minimo={860}
              cabecalho={[
                "OS",
                "Cliente",
                "Situação da arte",
                "O que falta",
                { rotulo: "Prazo", alinhar: "dir" },
              ]}
            >
              {travados.map((j) => {
                const prazo = selosPrazo(j);
                return (
                  <Linha key={j.os}>
                    <Celula>
                      <button
                        onClick={() => setAberto(j)}
                        className="spec hover:text-magenta-forte"
                      >
                        {j.os}
                      </button>
                    </Celula>
                    <Celula>
                      <p className="font-medium">{j.pedido.cliente}</p>
                      <p className="text-[0.6875rem] text-mute-2">{j.pedido.canal}</p>
                    </Celula>
                    <Celula>
                      <SeloStatus tom={STATUS_ARTE[j.arte].tom}>
                        {STATUS_ARTE[j.arte].rotulo}
                      </SeloStatus>
                    </Celula>
                    <Celula className="max-w-[280px] truncate text-mute">
                      {j.apontamento ?? "O cliente ainda não enviou o arquivo de impressão."}
                    </Celula>
                    <Celula alinhar="dir">
                      <SeloStatus tom={prazo.tom} ponto={false}>
                        {prazo.texto}
                      </SeloStatus>
                    </Celula>
                  </Linha>
                );
              })}
            </Tabela>
          ) : (
            <Vazio
              icone="check"
              titulo="Nenhuma arte travada"
              texto="Todos os arquivos passaram na conferência. A esteira pode rodar sem espera."
            />
          )}
        </Cartao>
      </div>

      <AvisoPrototipo>
        As OS são derivadas dos mesmos pedidos fictícios do painel — cada pedido
        em aberto vira uma ordem com prazo, máquina e conferência de arte. O
        parque gráfico listado aqui (Heidelberg, Indigo, plotter, laminadora)
        é um exemplo: precisa ser trocado pelas máquinas reais da Full Print,
        com a capacidade de cada uma em horas, para a carga significar alguma
        coisa.
      </AvisoPrototipo>

      {aberto && <Ficha job={aberto} fechar={() => setAberto(null)} />}
    </>
  );
}
