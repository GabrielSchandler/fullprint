"use client";

import { useCallback, useEffect, useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { Botao, Selo } from "@/components/ui/primitivos";
import { Revelar } from "@/components/ui/movimento";
import { Celula, Linha, Tabela } from "@/components/painel/ui";
import { brl } from "@/lib/format";
import {
  COMPARATIVO,
  CONDICOES,
  MENSALIDADES,
  PACOTES,
  PUBLICOS,
  RECURSOS,
  type Pacote,
} from "@/lib/apresentacao";

/* ------------------------------------------------------------ marca */

/** Os três pontos CMYK da marca — mesmo olho usado na página /empresas. */
function OlhoCmyk({ children }: { children: string }) {
  return (
    <p className="spec flex items-center gap-2 text-mute-2">
      <span className="flex gap-1">
        <span className="size-1.5 rounded-full bg-ciano" />
        <span className="size-1.5 rounded-full bg-magenta" />
        <span className="size-1.5 rounded-full bg-amarelo" />
      </span>
      {children}
    </p>
  );
}

function Secao({
  olho,
  titulo,
  descricao,
  children,
}: {
  olho: string;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <Revelar as="section" className="mt-16 print:mt-10 print:break-inside-avoid">
      <OlhoCmyk>{olho}</OlhoCmyk>
      <h2 className="mt-2.5 font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.1]">
        {titulo}
      </h2>
      {descricao && (
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-mute">
          {descricao}
        </p>
      )}
      <div className="mt-7">{children}</div>
    </Revelar>
  );
}

/* -------------------------------------------------------- card do pacote */

function CardPacote({
  pacote,
  escolhido,
  aoEscolher,
}: {
  pacote: Pacote;
  escolhido: boolean;
  aoEscolher?: () => void;
}) {
  const destaque = pacote.recomendado;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-surface p-6 transition-shadow print:break-inside-avoid ${
        destaque
          ? "border-magenta shadow-papel lg:-mt-3 lg:pb-9"
          : "border-linha shadow-cartao"
      } ${escolhido ? "ring-2 ring-tinta ring-offset-2 ring-offset-papel" : ""}`}
    >
      {destaque && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-magenta px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-white uppercase">
          <Icone nome="estrela" className="size-3" />
          Recomendado
        </span>
      )}

      <h3 className="font-display text-2xl leading-none">{pacote.nome}</h3>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-mute">{pacote.resumo}</p>

      <div className="mt-6 border-y border-linha py-5">
        <p className="spec text-mute-2">Implantação</p>
        <p className="mt-1 text-[2rem] leading-none font-semibold tracking-tight tabular">
          {brl(pacote.implantacao, 0)}
        </p>
        <p className="mt-3 text-[0.875rem] text-mute">
          <span className="font-semibold text-tinta tabular">
            {brl(pacote.mensalidade, 0)}
          </span>{" "}
          por mês
        </p>
      </div>

      {pacote.heranca && (
        <p className="mt-5 text-[0.8125rem] font-medium text-magenta-forte">
          {pacote.heranca}
        </p>
      )}

      <ul className={`space-y-2.5 ${pacote.heranca ? "mt-3" : "mt-5"}`}>
        {pacote.itens.map((i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Icone
              nome="check"
              className="mt-0.5 size-3.5 shrink-0 text-ok"
              strokeWidth={2.4}
            />
            <span className="text-[0.8125rem] leading-relaxed text-tinta/85">{i}</span>
          </li>
        ))}
      </ul>

      {aoEscolher && (
        <Botao
          tom={destaque ? "magenta" : "contorno"}
          onClick={aoEscolher}
          className="mt-6 w-full print:hidden"
        >
          {escolhido ? "Pacote selecionado" : "Escolher este"}
          <Icone nome={escolhido ? "check" : "seta"} className="size-4" />
        </Botao>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- a página */

export default function ApresentacaoPage() {
  const [apresentando, setApresentando] = useState(false);
  const [modal, setModal] = useState(false);
  const [escolhido, setEscolhido] = useState<Pacote["id"] | null>(null);

  const sair = useCallback(() => {
    setApresentando(false);
    /* o navegador recusa exitFullscreen quando já saiu — o if evita o erro */
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  async function entrar() {
    setApresentando(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* tela cheia nativa pode ser recusada; o overlay sozinho já esconde
         o menu e o cabeçalho do painel, que é o que a apresentação precisa */
    }
  }

  /* sair pelo ESC do navegador (que encerra a tela cheia por conta própria) */
  useEffect(() => {
    const aoTrocar = () => {
      if (!document.fullscreenElement) setApresentando(false);
    };
    document.addEventListener("fullscreenchange", aoTrocar);
    return () => document.removeEventListener("fullscreenchange", aoTrocar);
  }, []);

  /* e pelo ESC direto, para o caso de a tela cheia nativa ter sido recusada */
  useEffect(() => {
    if (!apresentando) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && sair();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [apresentando, sair]);

  const pacoteEscolhido = PACOTES.find((p) => p.id === escolhido);

  /* ------------------------------------------------------------ corpo */

  const corpo = (
    <>
      {/* --------------------------------------------------- 1. abertura */}
      <Revelar as="section" className="print:break-inside-avoid">
        <div className="rounded-2xl border border-linha bg-surface p-8 shadow-cartao sm:p-12">
          <OlhoCmyk>Proposta comercial</OlhoCmyk>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.02] tracking-[-0.01em]">
            Full Print no digital
          </h1>
          <p className="mt-5 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-relaxed text-tinta/80">
            Uma estrutura completa para vender produtos personalizados no varejo
            e atender empresas em grande escala.
          </p>
          <p className="mt-5 max-w-3xl text-[0.9375rem] leading-relaxed text-mute">
            A proposta é criar um novo canal de vendas para a Full Print,
            aproveitando sua experiência, estrutura própria de produção e
            histórico no mercado gráfico para alcançar também o consumidor
            online.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {PUBLICOS.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-linha bg-papel/50 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-tinta shadow-cartao">
                    <Icone nome={p.icone} className="size-4.5" />
                  </span>
                  <Selo tom={p.id === "b2b" ? "b2b" : "novo"}>{p.selo}</Selo>
                </div>
                <p className="mt-4 text-[0.9375rem] font-semibold">{p.titulo}</p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-mute">
                  {p.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Revelar>

      {/* ----------------------------------------------------- 2. visão */}
      <Secao
        olho="Visão do projeto"
        titulo="O que entra na operação"
        descricao="A loja e o painel cobrem o ciclo inteiro — da vitrine ao pedido produzido."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RECURSOS.map((r) => (
            <div
              key={r.nome}
              className="flex items-center gap-3 rounded-xl border border-linha bg-surface px-4 py-3.5 shadow-cartao"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-papel text-mute">
                <Icone nome={r.icone} className="size-4" />
              </span>
              <span className="text-[0.8125rem] font-medium">{r.nome}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-ciano/25 bg-ciano-claro px-5 py-4">
          <Icone nome="caixa" className="mt-0.5 size-4 shrink-0 text-ciano-forte" />
          <p className="text-[0.875rem] leading-relaxed text-tinta/85">
            <strong className="font-semibold">Cadastro dos produtos</strong> —
            realizado pela própria Full Print, com o painel e o treinamento
            entregues para isso.
          </p>
        </div>
      </Secao>

      {/* ---------------------------------------------------- 3. pacotes */}
      <Secao
        olho="Pacotes"
        titulo="Três formas de começar"
        descricao="Todos entregam a loja vendendo. A diferença está em quanto da gestão e da marca entra junto."
      >
        <div className="grid items-start gap-5 lg:grid-cols-3">
          {PACOTES.map((p) => (
            <CardPacote
              key={p.id}
              pacote={p}
              escolhido={escolhido === p.id}
              aoEscolher={() => setEscolhido(p.id)}
            />
          ))}
        </div>
      </Secao>

      {/* ------------------------------------------------ 4. comparativo */}
      <Secao olho="Comparativo" titulo="Lado a lado">
        <div className="overflow-hidden rounded-xl border border-linha bg-surface shadow-cartao">
          <Tabela
            minimo={640}
            cabecalho={[
              "Recurso",
              { rotulo: "Inicial", alinhar: "centro" },
              { rotulo: "Intermediário", alinhar: "centro" },
              { rotulo: "Completo", alinhar: "centro" },
            ]}
          >
            {COMPARATIVO.map((l) => (
              <Linha key={l.recurso}>
                <Celula className="font-medium">{l.recurso}</Celula>
                {l.valores.map((v, i) => (
                  <Celula key={i} alinhar="centro">
                    {v === true ? (
                      <Icone
                        nome="check"
                        className="mx-auto size-4 text-ok"
                        strokeWidth={2.4}
                      />
                    ) : v === null ? (
                      <span className="text-mute-2">—</span>
                    ) : (
                      <span className="text-mute">{v}</span>
                    )}
                  </Celula>
                ))}
              </Linha>
            ))}

            <Linha>
              <Celula className="font-medium">Implantação</Celula>
              {PACOTES.map((p) => (
                <Celula key={p.id} alinhar="centro" className="font-semibold tabular">
                  {brl(p.implantacao, 0)}
                </Celula>
              ))}
            </Linha>
            <Linha>
              <Celula className="font-medium">Mensalidade</Celula>
              {PACOTES.map((p) => (
                <Celula key={p.id} alinhar="centro" className="font-semibold tabular">
                  {brl(p.mensalidade, 0)}
                </Celula>
              ))}
            </Linha>
          </Tabela>
        </div>
      </Secao>

      {/* ----------------------------------------------- 5. mensalidade */}
      <Secao
        olho="Mensalidade"
        titulo="O que a mensalidade cobre"
        descricao="Cada plano acompanha o pacote correspondente e mantém a loja no ar."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {MENSALIDADES.map((m) => (
            <div
              key={m.valor}
              className="rounded-xl border border-linha bg-surface p-6 shadow-cartao print:break-inside-avoid"
            >
              <p className="spec text-mute-2">{m.pacote}</p>
              <p className="mt-2 text-[1.75rem] leading-none font-semibold tracking-tight tabular">
                {brl(m.valor, 0)}
                <span className="ml-1.5 text-[0.875rem] font-normal text-mute">
                  por mês
                </span>
              </p>

              {m.heranca && (
                <p className="mt-5 text-[0.8125rem] font-medium text-magenta-forte">
                  {m.heranca}
                </p>
              )}

              <ul className={`space-y-2.5 ${m.heranca ? "mt-3" : "mt-5"}`}>
                {m.itens.map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Icone
                      nome="check"
                      className="mt-0.5 size-3.5 shrink-0 text-ok"
                      strokeWidth={2.4}
                    />
                    <span className="text-[0.8125rem] leading-relaxed text-tinta/85">
                      {i}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Secao>

      {/* ------------------------------------------------- 6. condições */}
      <Secao olho="Condições comerciais" titulo="Como funciona o acordo">
        <div className="grid gap-4 sm:grid-cols-2">
          {CONDICOES.map((c) => (
            <div
              key={c.titulo}
              className="rounded-xl border border-linha bg-surface p-5 shadow-cartao print:break-inside-avoid"
            >
              <div className="flex items-center gap-2.5">
                <Icone nome={c.icone} className="size-4 text-mute" />
                <p className="text-[0.9375rem] font-semibold">{c.titulo}</p>
              </div>
              <ul className="mt-3.5 space-y-2">
                {c.itens.map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-magenta" />
                    <span className="text-[0.8125rem] leading-relaxed text-tinta/85">
                      {i}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Secao>

      {/* ----------------------------------------------- 7. encerramento */}
      <Revelar
        as="section"
        className="mt-16 rounded-2xl border border-linha bg-tinta p-10 text-center sm:p-14 print:mt-10 print:break-inside-avoid"
      >
        <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.1] text-papel">
          Prontos para transformar a experiência da Full Print em uma operação
          digital?
        </h2>

        {pacoteEscolhido && (
          <p className="mt-5 text-[0.9375rem] text-papel/70">
            Pacote selecionado:{" "}
            <strong className="font-semibold text-papel">
              {pacoteEscolhido.nome}
            </strong>{" "}
            · {brl(pacoteEscolhido.implantacao, 0)} +{" "}
            {brl(pacoteEscolhido.mensalidade, 0)} por mês
          </p>
        )}

        <Botao
          tom="magenta"
          tamanho="lg"
          onClick={() => setModal(true)}
          className="mt-8 print:hidden"
        >
          Escolher pacote
          <Icone nome="seta" className="size-4" />
        </Botao>
      </Revelar>
    </>
  );

  /* ------------------------------------------------ modo apresentação */

  if (apresentando) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-papel">
        <button
          onClick={sair}
          className="fixed top-5 right-5 z-10 inline-flex h-10 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.8125rem] font-medium shadow-papel transition-colors hover:border-tinta"
        >
          <Icone nome="fechar" className="size-4" />
          Sair da apresentação
          <kbd className="spec ml-1 rounded border border-linha px-1.5 py-0.5 text-[0.5625rem] text-mute-2">
            Esc
          </kbd>
        </button>

        <div className="mx-auto max-w-[1100px] px-6 py-14">{corpo}</div>

        {modal && (
          <ModalPacotes
            escolhido={escolhido}
            aoEscolher={setEscolhido}
            fechar={() => setModal(false)}
          />
        )}
      </div>
    );
  }

  /* --------------------------------------------------- modo painel */

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 print:hidden">
        <div>
          <h1 className="font-display text-[2rem] leading-none">Minha apresentação</h1>
          <p className="mt-2 text-[0.875rem] text-mute">
            A proposta comercial da loja, pronta para mostrar ao cliente.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={entrar}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.8125rem] font-medium transition-colors hover:border-linha-forte"
          >
            <Icone nome="olho" className="size-4" />
            Modo apresentação
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel transition-colors hover:bg-grafite"
          >
            <Icone nome="baixar" className="size-4" />
            Imprimir ou salvar PDF
          </button>
        </div>
      </div>

      <div className="mt-6">{corpo}</div>

      {modal && (
        <ModalPacotes
          escolhido={escolhido}
          aoEscolher={setEscolhido}
          fechar={() => setModal(false)}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- modal */

function ModalPacotes({
  escolhido,
  aoEscolher,
  fechar,
}: {
  escolhido: Pacote["id"] | null;
  aoEscolher: (id: Pacote["id"]) => void;
  fechar: () => void;
}) {
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [fechar]);

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center p-4 print:hidden">
      <button
        className="absolute inset-0 cursor-default bg-tinta/50 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Escolher pacote"
        className="relative flex max-h-[90dvh] w-[min(1000px,100%)] flex-col overflow-hidden rounded-2xl border border-linha bg-papel shadow-papel-alta"
      >
        <header className="flex items-start justify-between gap-4 border-b border-linha bg-surface px-6 py-5">
          <div>
            <OlhoCmyk>Seleção</OlhoCmyk>
            <h2 className="mt-1 font-display text-2xl leading-none">
              Escolher pacote
            </h2>
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
          <div className="grid items-start gap-4 lg:grid-cols-3">
            {PACOTES.map((p) => (
              <CardPacote
                key={p.id}
                pacote={p}
                escolhido={escolhido === p.id}
                aoEscolher={() => aoEscolher(p.id)}
              />
            ))}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-linha bg-surface px-6 py-4">
          <p className="text-[0.8125rem] text-mute">
            {escolhido
              ? `Selecionado: ${PACOTES.find((p) => p.id === escolhido)!.nome}`
              : "Nenhum pacote selecionado ainda."}
          </p>
          <Botao tom="tinta" onClick={fechar}>
            Concluir
            <Icone nome="check" className="size-4" />
          </Botao>
        </footer>
      </div>
    </div>
  );
}
