"use client";

import { Icone } from "@/components/ui/Icone";

/**
 * Resposta para as ações que ainda não existem.
 *
 * Botão que não faz nada é o pior detalhe de um protótipo: quem está vendo
 * clica, não acontece nada, e a confiança na tela inteira cai. Aqui o clique
 * devolve o escopo da função — vira momento de conversa sobre a próxima fase
 * em vez de silêncio.
 */
export function ProximaFase({
  titulo,
  contexto,
  itens,
  fechar,
}: {
  titulo: string;
  contexto: string;
  /** o que a tela vai fazer quando existir */
  itens: string[];
  fechar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <div className="relative w-[min(520px,100%)] overflow-hidden rounded-2xl border border-linha bg-surface shadow-papel-alta">
        <header className="flex items-start justify-between gap-4 border-b border-linha px-6 py-5">
          <div>
            <p className="spec text-magenta-forte">{contexto}</p>
            <h2 className="mt-1 font-display text-2xl leading-none">{titulo}</h2>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="p-6">
          <div className="flex items-start gap-3 rounded-lg border border-linha bg-papel/60 px-4 py-3.5">
            <Icone nome="relogio" className="mt-0.5 size-4 shrink-0 text-mute" />
            <p className="text-[0.8125rem] leading-relaxed text-mute">
              Esta tela não entrou no protótipo — está no escopo da fase seguinte.
              O que ela vai fazer:
            </p>
          </div>

          <ul className="mt-5 space-y-3">
            {itens.map((i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-magenta" />
                <span className="text-[0.875rem] leading-relaxed text-tinta/85">{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-linha px-6 py-4">
          <button
            onClick={fechar}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-tinta text-[0.8125rem] font-medium text-papel hover:bg-grafite"
          >
            Entendi
          </button>
        </footer>
      </div>
    </div>
  );
}
