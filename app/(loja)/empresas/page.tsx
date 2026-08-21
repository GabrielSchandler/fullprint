import { FotoProduto } from "@/components/loja/FotoProduto";
import type { Metadata } from "next";
import { FormularioOrcamento } from "@/components/loja/FormularioOrcamento";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import { CabecaSecao, Secao } from "@/components/loja/Trilho";
import { Foto } from "@/components/loja/Foto";
import { Icone } from "@/components/ui/Icone";
import { BotaoLink, Nota, OlhoSecao, TituloSecao } from "@/components/ui/primitivos";
import { porSku } from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "Para empresas",
  description:
    "Caderno, caixa, sacola, crachá e cartão personalizados com a marca da sua empresa. Da arte à tiragem, produzido na gráfica da Full Print.",
};

const PECAS = [
  {
    sku: "FP-EMB-002",
    titulo: "Kit de boas-vindas",
    texto: "Caixa com berço recortado, caderno, caneta e cartão de mensagem.",
  },
  {
    sku: "FP-CAD-003",
    titulo: "Caderno com logo",
    texto: "Capa cartonada com a sua marca em hot stamping ou serigrafia.",
  },
  {
    sku: "FP-BLC-005",
    titulo: "Bloco de reunião",
    texto: "A4 com cabeçalho da empresa e campo de pauta e decisões.",
  },
  {
    sku: "FP-EMB-004",
    titulo: "Sacola de loja",
    texto: "Impressão total, alça reforçada, na cor exata da sua marca.",
  },
  {
    sku: "FP-CRT-002",
    titulo: "Cartão de visita",
    texto: "Papel especial, hot stamping e relevo — para o time inteiro.",
  },
  {
    sku: "FP-ADS-003",
    titulo: "Adesivo e rótulo",
    texto: "Recorte no contorno da arte, em vinil resistente a água e sol.",
  },
];

const ETAPAS = [
  ["01", "Briefing", "Você conta a peça, a tiragem e o prazo. Se já tiver arte, anexa."],
  ["02", "Orçamento", "Volta em até 1 dia útil com preço fechado por tiragem e prazo."],
  ["03", "Arte e prova", "Fechamento de arquivo incluso. Prova física antes de rodar."],
  ["04", "Produção", "Impressão e acabamento na nossa gráfica, sem terceirizar."],
  ["05", "Entrega", "Conferência peça a peça e envio, ou retirada em Guarulhos."],
] as const;

const PERGUNTAS = [
  [
    "Qual a tiragem mínima?",
    "50 unidades na maioria das peças. Em cartão de visita e adesivo, a partir de 100.",
  ],
  [
    "Vocês fecham o arquivo?",
    "Sim, está incluso. Recebemos em PDF, AI, EPS, SVG ou PNG em alta e ajustamos sangria, corte e perfil de cor antes de rodar.",
  ],
  [
    "Consigo ver antes de imprimir tudo?",
    "Sim. Prova física antes da tiragem em qualquer pedido acima de 300 unidades, e prova digital em todos.",
  ],
  [
    "A cor sai igual à da minha marca?",
    "Trabalhamos com referência Pantone quando existe. Em quadricromia há variação — a prova física serve exatamente para você aprovar o resultado real.",
  ],
  [
    "Emitem nota fiscal e vendem para órgão público?",
    "Nota fiscal sim, em todos os pedidos. Para licitação, fale com o comercial sobre a documentação necessária.",
  ],
] as const;

export default function EmpresasPage() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden bg-noite text-papel">
        {/* caixa impressa por trás da trama: dá matéria ao fundo chapado */}
        <div className="absolute inset-0 opacity-30">
          <Foto nome="b2b" sizes="100vw" prioritaria posicao="center 45%" />
          <div className="absolute inset-0 bg-gradient-to-r from-noite via-noite/90 to-noite/45" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #00a3d9 0 2px, transparent 2px 26px), repeating-linear-gradient(45deg, #e6007e 0 2px, transparent 2px 26px), repeating-linear-gradient(90deg, #ffd400 0 2px, transparent 2px 26px)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2">
              <span className="flex gap-1">
                <span className="size-2 rounded-full bg-ciano" />
                <span className="size-2 rounded-full bg-magenta" />
                <span className="size-2 rounded-full bg-amarelo" />
              </span>
              <p className="spec text-papel/60">Full Print para empresas</p>
            </div>

            <h1 className="mt-5 font-display text-[clamp(2.6rem,5.5vw,4.4rem)] leading-[0.98] tracking-[-0.02em]">
              A sua marca impressa
              <br />
              <em className="text-papel/55">como ela merece.</em>
            </h1>

            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-papel/70">
              Duas décadas produzindo material para marcas grandes e para
              escritórios que não podem receber a peça errada. Caderno de
              onboarding, caixa de kit, sacola, crachá e cartão — com o seu logo,
              a sua cor e a sua tiragem.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <BotaoLink href="#orcamento" tom="magenta" tamanho="lg">
                Pedir orçamento
                <Icone nome="seta" className="size-4" />
              </BotaoLink>
              <a
                href="https://wa.me/5511915736214"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/20 px-7 text-[0.9375rem] font-medium transition-colors hover:border-white/50"
              >
                <Icone nome="whatsapp" className="size-4" />
                (11) 91573-6214
              </a>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/12 pt-7">
              {[
                ["Tiragem mínima", "50 un"],
                ["Resposta", "1 dia útil"],
                ["Prova física", "Inclusa"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="spec text-papel/45">{k}</dt>
                  <dd className="mt-1.5 font-display text-2xl">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:col-span-6">
            {["FP-EMB-002", "FP-CAD-003", "FP-EMB-004", "FP-CRT-001"].map((sku, i) => {
              const p = porSku(sku)!;
              return (
                <div
                  key={sku}
                  className={`overflow-hidden rounded-xl border border-white/10 ${
                    i % 2 === 1 ? "translate-y-6" : ""
                  }`}
                  style={{ background: fundoDoProduto(p.paleta) }}
                >
                  <FotoProduto produto={p} className="aspect-square w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- peças */}
      <Secao className="pt-20">
        <CabecaSecao
          olho="O que dá para personalizar"
          titulo="Da papelaria ao kit inteiro"
          descricao="Qualquer item do catálogo pode sair com a sua marca. Estes são os que mais saem para empresa."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PECAS.map((peca) => {
            const p = porSku(peca.sku)!;
            return (
              <article
                key={peca.sku}
                className="group overflow-hidden rounded-xl border border-linha bg-surface transition-all duration-300 hover:border-linha-forte hover:shadow-papel"
              >
                <div
                  className="aspect-[5/3]"
                  style={{ background: fundoDoProduto(p.paleta) }}
                >
                  <FotoProduto produto={p} titulo={peca.titulo} className="size-full transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{peca.titulo}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-mute">{peca.texto}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Secao>

      {/* ---------------------------------------------------------- etapas */}
      <section className="mt-24 bg-papel-2 py-20">
        <Secao>
          <CabecaSecao
            olho="Como funciona"
            titulo="Do briefing à entrega"
            descricao="Cinco etapas. A prova física entre a arte e a produção é o que evita reimpressão — e é ela que faz o prazo valer."
          />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-linha bg-linha md:grid-cols-5">
            {ETAPAS.map(([n, titulo, texto]) => (
              <li key={n} className="bg-surface p-6">
                <span className="spec text-magenta-forte">{n}</span>
                <h3 className="mt-4 font-display text-xl">{titulo}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-mute">{texto}</p>
              </li>
            ))}
          </ol>
        </Secao>
      </section>

      {/* ------------------------------------------------------- orçamento */}
      <Secao id="orcamento" className="pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <OlhoSecao>Orçamento</OlhoSecao>
            <TituloSecao className="mt-2.5">
              Manda o briefing.
              <br />
              <em>A gente responde.</em>
            </TituloSecao>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-mute">
              Resposta em até 1 dia útil com preço fechado por tiragem. Se a peça
              for urgente, escreva no campo de detalhes — temos janela de produção
              reservada para prazo curto.
            </p>

            <div className="mt-8 space-y-3">
              {[
                ["whatsapp", "WhatsApp", "(11) 91573-6214"],
                ["instagram", "Instagram", "@fullprintgraficaoficial"],
                ["predio", "Gráfica", "R. Seg. Ten. Av. Rolando Ritmeister, 35C — Guarulhos/SP"],
              ].map(([icone, rotulo, valor]) => (
                <div key={rotulo} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-linha bg-surface text-mute">
                    <Icone nome={icone} className="size-4" />
                  </span>
                  <div>
                    <p className="spec text-mute-2">{rotulo}</p>
                    <p className="mt-0.5 text-[0.875rem]">{valor}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="spec text-mute-2">Perguntas frequentes</p>
              <dl className="mt-4 divide-y divide-linha border-t border-linha">
                {PERGUNTAS.map(([q, a]) => (
                  <div key={q} className="py-4">
                    <dt className="text-[0.875rem] font-medium">{q}</dt>
                    <dd className="mt-1.5 text-[0.8125rem] leading-relaxed text-mute">{a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7">
            <FormularioOrcamento />
          </div>
        </div>

        <Nota className="mt-10">
          Prazos, tiragens mínimas e condições desta página são de exemplo, para
          demonstrar a estrutura do canal B2B. Precisam ser conferidos com a Full
          Print antes de qualquer publicação.
        </Nota>
      </Secao>
    </>
  );
}
