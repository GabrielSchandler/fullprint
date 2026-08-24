"use client";

import { useRef, useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { Nota, Selo } from "@/components/ui/primitivos";

/**
 * Envio de arte.
 *
 * É o passo que separa uma loja de gráfica de uma loja comum: a peça não
 * existe até o cliente mandar o arquivo. Deixar isso para o e-mail depois da
 * compra é onde o prazo começa a escorrer — metade das OS que atrasam ficam
 * paradas esperando arte, e o cliente nem sabe que a bola está com ele.
 *
 * A conferência aqui é local e superficial (extensão e tamanho). O pré-flight
 * de verdade — dpi, CMYK, sangria, fonte em curvas — roda no servidor, na fase
 * seguinte. O que este passo entrega hoje é o hábito certo: o arquivo entra
 * junto do pedido e o cliente vê na hora se ele serve.
 */

/* ------------------------------------------------------------ pré-flight */

type Veredito = "ok" | "atencao" | "recusado";

const VEREDITOS: Record<Veredito, { tom: "ok" | "alerta" | "erro"; rotulo: string }> = {
  ok: { tom: "ok", rotulo: "Pronto para impressão" },
  atencao: { tom: "alerta", rotulo: "Serve, com ressalva" },
  recusado: { tom: "erro", rotulo: "Não serve" },
};

/** Formatos fechados que preservam vetor e perfil de cor — o que a máquina quer. */
const FECHADOS = ["pdf", "ai", "eps", "cdr", "psd", "tif", "tiff", "indd"];
/** Bitmap de tela: imprime, mas o risco de sair borrado é do cliente. */
const BITMAP = ["png", "jpg", "jpeg", "webp"];

const LIMITE_MB = 120;

export type Arquivo = {
  id: string;
  nome: string;
  bytes: number;
  extensao: string;
  veredito: Veredito;
  recado: string;
};

function conferir(file: File): Arquivo {
  const extensao = (file.name.split(".").pop() ?? "").toLowerCase();
  const mb = file.size / 1_048_576;

  const base = {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    nome: file.name,
    bytes: file.size,
    extensao,
  };

  if (mb > LIMITE_MB)
    return {
      ...base,
      veredito: "recusado",
      recado: `Arquivo de ${mb.toFixed(0)} MB — o limite por envio é ${LIMITE_MB} MB. Mande por link do Drive ou WeTransfer no campo de observação.`,
    };

  if (FECHADOS.includes(extensao))
    return {
      ...base,
      veredito: "ok",
      recado: "Formato fechado, com vetor e perfil de cor preservados.",
    };

  if (BITMAP.includes(extensao))
    return {
      ...base,
      veredito: "atencao",
      recado:
        "Imagem de tela. A pré-impressão vai conferir a resolução e avisa se sair borrado no tamanho final.",
    };

  return {
    ...base,
    veredito: "recusado",
    recado: `.${extensao || "sem extensão"} não entra na máquina. Exporte em PDF fechado, com as fontes em curvas.`,
  };
}

function tamanho(bytes: number): string {
  const mb = bytes / 1_048_576;
  if (mb >= 1) return `${mb.toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/* --------------------------------------------------------- especificação */

const ESPECIFICACAO = [
  "PDF fechado, em CMYK — arquivo em RGB muda de cor na impressão",
  "300 dpi no tamanho final da peça",
  "3 mm de sangria em cada borda, com as marcas de corte",
  "Fontes convertidas em curvas",
  "Faca de corte e verniz em camadas separadas, quando houver",
];

/* ------------------------------------------------------------ o componente */

/**
 * Os arquivos e a escolha do caminho moram no checkout, não aqui.
 *
 * Cada passo do checkout monta e desmonta, então guardar a lista neste
 * componente apagava tudo assim que o cliente avançava para a Entrega e
 * voltava — subia três arquivos e encontrava a área vazia na volta.
 */
export function EnvioDeArte({
  arquivos,
  setArquivos,
  criacao,
  setCriacao,
}: {
  arquivos: Arquivo[];
  setArquivos: React.Dispatch<React.SetStateAction<Arquivo[]>>;
  criacao: boolean;
  setCriacao: (v: boolean) => void;
}) {
  const [arrastando, setArrastando] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  function receber(lista: FileList | null) {
    if (!lista) return;
    const novos = Array.from(lista).map(conferir);
    setArquivos((atuais) => {
      /* mesmo arquivo arrastado duas vezes não vira duas linhas */
      const vistos = new Set(atuais.map((a) => a.id));
      return [...atuais, ...novos.filter((n) => !vistos.has(n.id))];
    });
  }

  const servem = arquivos.filter((a) => a.veredito !== "recusado");

  return (
    <div className="sobe">
      <h2 className="font-display text-2xl">A arte da sua peça</h2>
      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-mute">
        Mande agora o arquivo que vai para a máquina. A conferência começa junto
        com o pedido, e o prazo de produção passa a contar do aceite da arte.
      </p>

      {/* ------------------------------------------------------- escolha */}
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <button
          onClick={() => setCriacao(false)}
          className={`rounded-lg border p-4 text-left transition-colors ${
            !criacao ? "border-tinta bg-papel" : "border-linha hover:border-linha-forte"
          }`}
        >
          <Icone nome="baixar" className="size-5 text-mute" />
          <p className="mt-2.5 text-sm font-medium">Já tenho a arte pronta</p>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-mute">
            Envie o arquivo fechado e a gente confere antes de imprimir.
          </p>
        </button>

        <button
          onClick={() => setCriacao(true)}
          className={`rounded-lg border p-4 text-left transition-colors ${
            criacao ? "border-tinta bg-papel" : "border-linha hover:border-linha-forte"
          }`}
        >
          <Icone nome="lapis" className="size-5 text-mute" />
          <p className="mt-2.5 text-sm font-medium">
            Quero que a Full Print crie
            <Selo tom="b2b" className="ml-2 align-middle">
              orçamento
            </Selo>
          </p>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-mute">
            Nosso estúdio desenha a peça. O valor entra depois, no orçamento.
          </p>
        </button>
      </div>

      {/* -------------------------------------------------------- criação */}
      {criacao ? (
        <div className="mt-6">
          <label className="block">
            <span className="spec text-mute-2">O que você precisa</span>
            <textarea
              rows={5}
              placeholder="Descreva a peça: o que vai escrito, as cores da marca, referências que você gosta. Se tiver logo, mande no campo abaixo."
              className="mt-2 w-full resize-y rounded-lg border border-linha bg-surface px-3.5 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-mute-2 focus:border-tinta"
            />
          </label>
          <Nota className="mt-4">
            O estúdio responde em até 1 dia útil com o orçamento da criação e a
            primeira proposta. A produção só começa depois que você aprova.
          </Nota>
        </div>
      ) : (
        <>
          {/* ------------------------------------------------ área de envio */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastando(false);
              receber(e.dataTransfer.files);
            }}
            className={`mt-6 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              arrastando ? "border-tinta bg-papel" : "border-linha bg-papel/40"
            }`}
          >
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-surface text-mute">
              <Icone nome="baixar" className="size-5" />
            </span>
            <p className="mt-4 text-[0.9375rem] font-medium">
              Arraste o arquivo aqui
            </p>
            <p className="mt-1 text-[0.8125rem] text-mute">
              PDF, AI, EPS, CDR, PSD ou TIFF · até {LIMITE_MB} MB por arquivo
            </p>
            <button
              onClick={() => entrada.current?.click()}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-linha bg-surface px-5 text-[0.8125rem] font-medium transition-colors hover:border-tinta"
            >
              <Icone nome="mais" className="size-4" />
              Escolher do computador
            </button>
            <input
              ref={entrada}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                receber(e.target.files);
                /* zera para que escolher o mesmo arquivo de novo dispare o onChange */
                e.target.value = "";
              }}
            />
          </div>

          {/* ------------------------------------------------- conferência */}
          {arquivos.length > 0 && (
            <ul className="mt-4 space-y-2.5">
              {arquivos.map((a) => {
                const v = VEREDITOS[a.veredito];
                return (
                  <li
                    key={a.id}
                    className="flex items-start gap-3.5 rounded-lg border border-linha bg-surface p-4"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-papel-2 text-[0.5625rem] font-semibold tracking-wide text-mute uppercase">
                      {a.extensao.slice(0, 4) || "?"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[0.8125rem] font-medium">{a.nome}</p>
                        <Selo tom={v.tom}>{v.rotulo}</Selo>
                      </div>
                      <p className="mt-1 text-[0.75rem] leading-relaxed text-mute">
                        {tamanho(a.bytes)} · {a.recado}
                      </p>
                    </div>

                    <button
                      onClick={() => setArquivos((l) => l.filter((x) => x.id !== a.id))}
                      className="grid size-8 shrink-0 place-items-center rounded-full text-mute-2 transition-colors hover:bg-papel-2 hover:text-tinta"
                      aria-label={`Remover ${a.nome}`}
                    >
                      <Icone nome="lixeira" className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {arquivos.length > 0 && (
            <p className="mt-3 text-[0.8125rem] text-mute">
              {servem.length} de {arquivos.length}{" "}
              {arquivos.length === 1 ? "arquivo segue" : "arquivos seguem"} para a
              pré-impressão.
            </p>
          )}

          {/* ----------------------------------------------- especificação */}
          <div className="mt-7 rounded-xl border border-linha bg-papel/50 p-5">
            <p className="spec text-mute-2">Como o arquivo tem que sair</p>
            <ul className="mt-3.5 space-y-2">
              {ESPECIFICACAO.map((e) => (
                <li key={e} className="flex items-start gap-2.5">
                  <Icone
                    nome="check"
                    className="mt-0.5 size-3.5 shrink-0 text-ok"
                    strokeWidth={2.4}
                  />
                  <span className="text-[0.8125rem] leading-relaxed text-tinta/85">{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <Nota className="mt-4">
            Nesta demonstração o arquivo não sai do seu computador — a
            conferência olha só a extensão e o tamanho. O pré-flight de verdade
            (dpi, CMYK, sangria e fonte em curvas) roda no servidor, junto com o
            armazenamento, na fase seguinte.
          </Nota>
        </>
      )}
    </div>
  );
}
