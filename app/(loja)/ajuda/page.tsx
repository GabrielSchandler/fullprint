import type { Metadata } from "next";
import { Secao } from "@/components/loja/Trilho";
import { Icone } from "@/components/ui/Icone";
import { Nota, OlhoSecao, TituloSecao } from "@/components/ui/primitivos";

export const metadata: Metadata = {
  title: "Ajuda",
  description: "Prazos, frete, trocas, devoluções e fechamento de arquivo na Full Print.",
};

const BLOCOS = [
  {
    icone: "caminhao",
    titulo: "Prazos e frete",
    itens: [
      ["Produção", "Pedidos aprovados até as 14h saem em até 3 dias úteis. Itens personalizados levam de 10 a 15 dias úteis."],
      ["Envio", "PAC e SEDEX pelos Correios, com código de rastreio por e-mail."],
      ["Frete grátis", "Automático em compras acima de R$ 199 no PAC."],
      ["Retirada", "Disponível na gráfica em Guarulhos, mediante agendamento."],
    ],
  },
  {
    icone: "sacola",
    titulo: "Trocas e devoluções",
    itens: [
      ["Arrependimento", "7 dias corridos após o recebimento, produto sem uso e na embalagem original."],
      ["Defeito", "30 dias para relatar. Trocamos ou devolvemos o valor integral, incluindo o frete."],
      ["Personalizado", "Peça com a marca do cliente não tem devolução por arrependimento — por isso a prova antes de rodar."],
    ],
  },
  {
    icone: "papel",
    titulo: "Fechamento de arquivo",
    itens: [
      ["Formatos", "PDF, AI, EPS, SVG ou PNG em alta resolução."],
      ["Sangria", "3 mm em cada lado, com marcas de corte."],
      ["Cor", "CMYK para impressão. Arquivo em RGB é convertido e pode mudar de tom."],
      ["Resolução", "300 dpi no tamanho final da peça."],
      ["Fontes", "Convertidas em curvas, ou enviadas junto com o arquivo."],
    ],
  },
  {
    icone: "carteira",
    titulo: "Pagamento",
    itens: [
      ["Pix", "5% de desconto, aprovação na hora."],
      ["Cartão", "Até 3× sem juros no varejo. Para empresa, condição negociada com o comercial."],
      ["Boleto", "Compensação em até 2 dias úteis; a produção começa após a aprovação."],
      ["Nota fiscal", "Emitida em todos os pedidos."],
    ],
  },
] as const;

export default function AjudaPage() {
  return (
    <>
      <Secao className="pt-14 pb-10">
        <OlhoSecao>Central de ajuda</OlhoSecao>
        <TituloSecao as="h1" className="mt-2.5">
          O que costuma ser dúvida
        </TituloSecao>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-mute">
          Se não estiver aqui, chame no WhatsApp (11) 91573-6214 — é o canal mais
          rápido, atendido por quem produz.
        </p>
      </Secao>

      <Secao className="pb-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {BLOCOS.map((b) => (
            <section key={b.titulo} className="rounded-xl border border-linha bg-surface p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-papel text-mute">
                  <Icone nome={b.icone} className="size-5" />
                </span>
                <h2 className="font-display text-2xl">{b.titulo}</h2>
              </div>

              <dl className="mt-6 divide-y divide-linha border-t border-linha">
                {b.itens.map(([k, v]) => (
                  <div key={k} className="py-3.5">
                    <dt className="spec text-mute-2">{k}</dt>
                    <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-tinta/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <Nota className="mt-8">
          Conteúdo de exemplo do protótipo. Prazos, políticas e condições precisam
          ser revisados e aprovados pela Full Print antes de entrar no ar.
        </Nota>
      </Secao>
    </>
  );
}
