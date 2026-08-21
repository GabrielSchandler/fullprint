"use client";

import { useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { Botao, Nota } from "@/components/ui/primitivos";

const PECAS = [
  "Caderno / caderneta",
  "Planner / agenda",
  "Bloco de reunião",
  "Cartão de visita",
  "Caixa-berço / kit",
  "Sacola",
  "Crachá",
  "Adesivo / rótulo",
  "Banner / sinalização",
  "Outro",
];

const TIRAGENS = ["50 a 100", "100 a 300", "300 a 1.000", "1.000 a 5.000", "Acima de 5.000"];
const PRAZOS = ["Sem pressa", "Até 30 dias", "Até 15 dias", "Urgente (até 7 dias)"];

export function FormularioOrcamento() {
  const [pecas, setPecas] = useState<string[]>([]);
  const [enviado, setEnviado] = useState(false);

  const alternar = (p: string) =>
    setPecas((v) => (v.includes(p) ? v.filter((x) => x !== p) : [...v, p]));

  if (enviado) {
    return (
      <div className="rounded-2xl border border-linha bg-surface p-10 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-ok-bg text-ok">
          <Icone nome="check" className="size-7" strokeWidth={2} />
        </div>
        <h3 className="mt-6 font-display text-3xl">Briefing recebido</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-mute">
          No sistema real, o pedido entraria como oportunidade no painel e o
          comercial responderia em até 1 dia útil com a proposta.
        </p>
        <Botao tom="contorno" className="mt-7" onClick={() => setEnviado(false)}>
          Enviar outro briefing
        </Botao>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-linha bg-surface p-7 lg:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        setEnviado(true);
      }}
    >
      <p className="spec text-magenta-forte">Briefing</p>
      <h3 className="mt-2.5 font-display text-3xl">Conte o que você precisa</h3>
      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-mute">
        Quanto mais específico, mais rápido volta o orçamento. Se já tiver a arte,
        anexe — a gente confere o fechamento antes de orçar.
      </p>

      <div className="mt-8 grid grid-cols-12 gap-4">
        <label className="col-span-12 sm:col-span-6">
          <span className="spec text-mute-2">Empresa</span>
          <input
            required
            placeholder="Razão social ou nome fantasia"
            className="mt-2 h-11 w-full rounded-lg border border-linha bg-papel px-3.5 text-sm outline-none placeholder:text-mute-2 focus:border-tinta"
          />
        </label>
        <label className="col-span-12 sm:col-span-6">
          <span className="spec text-mute-2">Quem fala</span>
          <input
            required
            placeholder="Seu nome"
            className="mt-2 h-11 w-full rounded-lg border border-linha bg-papel px-3.5 text-sm outline-none placeholder:text-mute-2 focus:border-tinta"
          />
        </label>
        <label className="col-span-12 sm:col-span-6">
          <span className="spec text-mute-2">E-mail</span>
          <input
            required
            type="email"
            placeholder="voce@empresa.com.br"
            className="mt-2 h-11 w-full rounded-lg border border-linha bg-papel px-3.5 text-sm outline-none placeholder:text-mute-2 focus:border-tinta"
          />
        </label>
        <label className="col-span-12 sm:col-span-6">
          <span className="spec text-mute-2">WhatsApp</span>
          <input
            placeholder="(11) 90000-0000"
            className="mt-2 h-11 w-full rounded-lg border border-linha bg-papel px-3.5 text-sm outline-none placeholder:text-mute-2 focus:border-tinta"
          />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="spec text-mute-2">Peças de interesse</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PECAS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => alternar(p)}
              className={`rounded-full border px-3.5 py-2 text-[0.8125rem] transition-colors ${
                pecas.includes(p)
                  ? "border-tinta bg-tinta text-papel"
                  : "border-linha bg-papel hover:border-linha-forte"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid grid-cols-12 gap-4">
        <label className="col-span-12 sm:col-span-6">
          <span className="spec text-mute-2">Tiragem estimada</span>
          <select className="mt-2 h-11 w-full rounded-lg border border-linha bg-papel px-3.5 text-sm outline-none focus:border-tinta">
            {TIRAGENS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="col-span-12 sm:col-span-6">
          <span className="spec text-mute-2">Prazo</span>
          <select className="mt-2 h-11 w-full rounded-lg border border-linha bg-papel px-3.5 text-sm outline-none focus:border-tinta">
            {PRAZOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="col-span-12">
          <span className="spec text-mute-2">Detalhes</span>
          <textarea
            rows={4}
            placeholder="Formato, cor, acabamento, data de entrega, para que serve a peça…"
            className="mt-2 w-full resize-y rounded-lg border border-linha bg-papel px-3.5 py-3 text-sm outline-none placeholder:text-mute-2 focus:border-tinta"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-lg border border-dashed border-linha-forte bg-papel px-4 py-5">
        <Icone nome="baixar" className="size-5 shrink-0 text-mute" />
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-medium">Anexar logo ou arte</p>
          <p className="text-[0.75rem] text-mute">
            PDF, AI, EPS, SVG ou PNG em alta — até 25 MB
          </p>
        </div>
        <span className="spec ml-auto shrink-0 rounded-full border border-linha px-3 py-1.5 text-mute-2">
          Selecionar
        </span>
      </div>

      <Botao type="submit" tom="magenta" tamanho="lg" className="mt-7 w-full">
        Enviar briefing
        <Icone nome="seta" className="size-4" />
      </Botao>

      <Nota className="mt-4">
        Formulário do protótipo — não envia nem armazena nada. Na próxima fase
        cai direto no pipeline de orçamentos do painel.
      </Nota>
    </form>
  );
}
