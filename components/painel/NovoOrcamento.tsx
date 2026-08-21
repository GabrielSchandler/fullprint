"use client";

import { useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { brl, num } from "@/lib/format";
import { precoB2b } from "@/lib/painel-dados";

/**
 * Abertura de orçamento B2B pelo painel.
 *
 * O comercial nem sempre recebe o briefing pela página Para empresas — muita
 * coisa entra por WhatsApp e ligação. Esta é a porta manual para o mesmo
 * pipeline, com o cálculo do unitário por tiragem feito na hora, que é o que
 * o vendedor precisa ver antes de mandar o preço.
 */

const PECAS = [
  { nome: "Kit de boas-vindas", balcao: 289.9 },
  { nome: "Caderno personalizado", balcao: 149.9 },
  { nome: "Agenda ou planner", balcao: 169.9 },
  { nome: "Bloco de reunião", balcao: 49.9 },
  { nome: "Caixa-berço", balcao: 34.9 },
  { nome: "Sacola de loja", balcao: 18.9 },
  { nome: "Marca-página", balcao: 14.9 },
  { nome: "Crachá de evento", balcao: 6.9 },
  { nome: "Rótulo adesivo", balcao: 2.4 },
  { nome: "Cartão de visita", balcao: 1.9 },
];

const TIRAGENS = [50, 100, 200, 300, 500, 1000, 2500, 5000];
const RESPONSAVEIS = ["Marcel", "Renata", "Douglas"];

const entrada =
  "h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none focus:border-tinta";

export function NovoOrcamento({ fechar }: { fechar: () => void }) {
  const [empresa, setEmpresa] = useState("");
  const [peca, setPeca] = useState(PECAS[0].nome);
  const [tiragem, setTiragem] = useState(300);
  const [salvo, setSalvo] = useState(false);

  const escolhida = PECAS.find((p) => p.nome === peca)!;
  const unitario = precoB2b(escolhida.balcao, tiragem);
  const total = unitario * tiragem;
  const desconto = 1 - unitario / escolhida.balcao;

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
            <p className="spec text-mute-2">Pipeline B2B</p>
            <h2 className="mt-1 font-display text-2xl leading-none">Novo orçamento</h2>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        {salvo ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-ok-bg text-ok">
              <Icone nome="check" className="size-7" strokeWidth={2} />
            </div>
            <h3 className="mt-5 font-display text-2xl">Orçamento aberto</h3>
            <p className="mx-auto mt-2.5 max-w-sm text-[0.8125rem] leading-relaxed text-mute">
              {empresa || "A empresa"} entrou no pipeline na etapa Briefing. No
              sistema real, o comercial receberia a tarefa de responder em 1 dia útil.
            </p>
            <button
              onClick={fechar}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-tinta px-6 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
            >
              Voltar ao quadro
            </button>
          </div>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {/* prévia do cálculo — é o que o vendedor olha antes de tudo */}
              <div className="rounded-xl border border-linha bg-papel/60 p-5">
                <p className="spec text-mute-2">Preço sugerido</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[1.75rem] leading-none font-semibold tabular">
                    {brl(total, 0)}
                  </span>
                  <span className="text-[0.8125rem] text-mute tabular">
                    {brl(unitario)} por unidade
                  </span>
                </div>
                <p className="mt-2.5 text-[0.75rem] text-mute">
                  {(desconto * 100).toFixed(0)}% abaixo do balcão ({brl(escolhida.balcao)}) —
                  a tiragem dilui o acerto de máquina.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="spec text-mute-2">Empresa</span>
                  <input
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Razão social ou nome fantasia"
                    className={`mt-1.5 ${entrada}`}
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="spec text-mute-2">Contato</span>
                    <input placeholder="Quem pediu" className={`mt-1.5 ${entrada}`} />
                  </label>
                  <label className="block">
                    <span className="spec text-mute-2">Responsável</span>
                    <select className={`mt-1.5 ${entrada}`}>
                      {RESPONSAVEIS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="spec text-mute-2">Peça</span>
                  <select
                    value={peca}
                    onChange={(e) => setPeca(e.target.value)}
                    className={`mt-1.5 ${entrada}`}
                  >
                    {PECAS.map((p) => (
                      <option key={p.nome} value={p.nome}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <span className="spec text-mute-2">Tiragem</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TIRAGENS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTiragem(t)}
                        className={`rounded-full border px-3.5 py-2 text-[0.8125rem] tabular transition-colors ${
                          tiragem === t
                            ? "border-tinta bg-tinta text-papel"
                            : "border-linha hover:border-linha-forte"
                        }`}
                      >
                        {num(t)}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="spec text-mute-2">Observações do briefing</span>
                  <textarea
                    rows={3}
                    placeholder="Cor da marca, prazo, se já tem arte fechada…"
                    className="mt-1.5 w-full resize-y rounded-lg border border-linha bg-surface px-3.5 py-3 text-[0.8125rem] outline-none focus:border-tinta"
                  />
                </label>
              </div>
            </div>

            <footer className="flex gap-2 border-t border-linha px-6 py-4">
              <button
                onClick={fechar}
                className="inline-flex h-11 items-center rounded-full border border-linha px-5 text-[0.8125rem] font-medium hover:border-tinta"
              >
                Cancelar
              </button>
              <button
                onClick={() => setSalvo(true)}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-[0.8125rem] font-medium text-papel hover:bg-grafite"
              >
                <Icone nome="check" className="size-4" />
                Abrir no pipeline
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
