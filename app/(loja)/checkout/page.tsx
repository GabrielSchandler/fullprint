"use client";

import Link from "next/link";
import { useState } from "react";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import { Icone } from "@/components/ui/Icone";
import { Botao, BotaoLink, Nota, Selo } from "@/components/ui/primitivos";
import { CUPONS, useCarrinho } from "@/lib/carrinho";
import { brl } from "@/lib/format";
import { FotoProduto } from "@/components/loja/FotoProduto";

const PASSOS = ["Identificação", "Entrega", "Pagamento"] as const;

const ENTREGAS = [
  { id: "pac", nome: "PAC · Correios", prazo: "6 a 9 dias úteis", valor: 24.9 },
  { id: "sedex", nome: "SEDEX · Correios", prazo: "2 a 3 dias úteis", valor: 41.5 },
  { id: "retirada", nome: "Retirar em Guarulhos", prazo: "A partir de 3 dias úteis", valor: 0 },
];

const PAGAMENTOS = [
  { id: "pix", nome: "Pix", detalhe: "5% de desconto · aprovação na hora", icone: "raio" },
  { id: "cartao", nome: "Cartão de crédito", detalhe: "Até 3× sem juros", icone: "carteira" },
  { id: "boleto", nome: "Boleto bancário", detalhe: "Compensa em até 2 dias úteis", icone: "papel" },
];

/* classes completas no fonte — Tailwind não enxerga nome de classe montado em runtime */
const COLUNAS: Record<number, string> = {
  3: "col-span-6 sm:col-span-3",
  4: "col-span-6 sm:col-span-4",
  6: "col-span-12 sm:col-span-6",
  8: "col-span-12 sm:col-span-8",
  12: "col-span-12",
};

function Campo({
  rotulo,
  span = 6,
  ...props
}: React.ComponentProps<"input"> & { rotulo: string; span?: number }) {
  return (
    <label className={COLUNAS[span] ?? COLUNAS[6]}>
      <span className="spec text-mute-2">{rotulo}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-sm outline-none transition-colors placeholder:text-mute-2 focus:border-tinta"
        {...props}
      />
    </label>
  );
}

export default function CheckoutPage() {
  const {
    resolvidos, subtotal, desconto, cupom, aplicarCupom, tirarCupom, pronto,
  } = useCarrinho();

  const [passo, setPasso] = useState(0);
  /* PAC por padrão: acima de R$ 199 ele sai de graça, que é a promessa da
     tarja do topo. Abrir no SEDEX fazia o resumo cobrar frete de cara. */
  const [entrega, setEntrega] = useState("pac");
  const [pagamento, setPagamento] = useState("pix");
  const [codigo, setCodigo] = useState("");
  const [aviso, setAviso] = useState<{ ok: boolean; msg: string } | null>(null);
  const [feito, setFeito] = useState(false);

  const opcaoEntrega = ENTREGAS.find((e) => e.id === entrega)!;
  const freteEscolhido = subtotal >= 199 && entrega !== "sedex" ? 0 : opcaoEntrega.valor;
  const descontoPix = pagamento === "pix" ? (subtotal - desconto) * 0.05 : 0;
  const totalFinal = Math.max(0, subtotal - desconto - descontoPix) + freteEscolhido;

  if (!pronto) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-24">
        <p className="spec text-mute-2">Carregando…</p>
      </div>
    );
  }

  if (feito) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-ok-bg text-ok">
          <Icone nome="check" className="size-8" strokeWidth={2} />
        </div>
        <h1 className="mt-7 font-display text-4xl">Pedido registrado</h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-mute">
          Número <span className="spec text-tinta">#FP-2026-4193</span>. No sistema real,
          aqui sairia o e-mail de confirmação e o pedido cairia no painel para produção.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <BotaoLink href="/painel/pedidos" tom="tinta">
            Ver no painel
            <Icone nome="seta" className="size-4" />
          </BotaoLink>
          <BotaoLink href="/produtos" tom="contorno">
            Continuar comprando
          </BotaoLink>
        </div>
      </div>
    );
  }

  if (resolvidos.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <Icone nome="sacola" className="mx-auto size-10 text-mute-2" />
        <h1 className="mt-6 font-display text-4xl">Carrinho vazio</h1>
        <p className="mt-3 text-sm text-mute">Adicione um produto para seguir para o checkout.</p>
        <BotaoLink href="/produtos" tom="tinta" className="mt-7">
          Ver catálogo
        </BotaoLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <Link href="/produtos" className="inline-flex items-center gap-1.5 text-[0.8125rem] text-mute hover:text-tinta">
        <Icone nome="setaEsq" className="size-3.5" />
        Continuar comprando
      </Link>

      <h1 className="mt-5 font-display text-[clamp(2.2rem,4vw,3rem)] leading-none">Checkout</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* ------------------------------------------------------ passos */}
        <div>
          <ol className="flex items-center gap-2">
            {PASSOS.map((p, i) => (
              <li key={p} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => i < passo && setPasso(i)}
                  className={`flex items-center gap-2.5 ${i <= passo ? "" : "opacity-45"}`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-[0.6875rem] font-semibold tabular ${
                      i < passo
                        ? "bg-ok text-white"
                        : i === passo
                          ? "bg-tinta text-papel"
                          : "border border-linha-forte text-mute"
                    }`}
                  >
                    {i < passo ? <Icone nome="check" className="size-3.5" strokeWidth={2.4} /> : i + 1}
                  </span>
                  <span className="hidden text-[0.8125rem] font-medium sm:block">{p}</span>
                </button>
                {i < PASSOS.length - 1 && <span className="h-px flex-1 bg-linha" />}
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-linha bg-surface p-7">
            {passo === 0 && (
              <div className="sobe">
                <h2 className="font-display text-2xl">Quem está comprando</h2>
                <div className="mt-6 grid grid-cols-12 gap-4">
                  <Campo rotulo="Nome completo" span={12} placeholder="Marcel de Araújo" />
                  <Campo rotulo="E-mail" span={6} type="email" placeholder="voce@email.com" />
                  <Campo rotulo="Telefone" span={6} placeholder="(11) 90000-0000" />
                  <Campo rotulo="CPF / CNPJ" span={6} placeholder="000.000.000-00" />
                </div>
                <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-[0.8125rem] text-mute">
                  <input type="checkbox" defaultChecked className="size-4 accent-[#1c1b1a]" />
                  Quero receber novidades e cupons por e-mail
                </label>
              </div>
            )}

            {passo === 1 && (
              <div className="sobe">
                <h2 className="font-display text-2xl">Onde entregar</h2>
                <div className="mt-6 grid grid-cols-12 gap-4">
                  <Campo rotulo="CEP" span={4} placeholder="07042-080" inputMode="numeric" />
                  <Campo rotulo="Endereço" span={8} placeholder="Rua, avenida…" />
                  <Campo rotulo="Número" span={3} placeholder="35C" />
                  <Campo rotulo="Complemento" span={4} placeholder="Sala, bloco…" />
                  <Campo rotulo="Bairro" span={4} placeholder="Centro" />
                  <Campo rotulo="Cidade" span={6} placeholder="Guarulhos" />
                  <Campo rotulo="Estado" span={3} placeholder="SP" />
                </div>

                <p className="spec mt-8 text-mute-2">Forma de envio</p>
                <div className="mt-3 space-y-2.5">
                  {ENTREGAS.map((e) => (
                    <label
                      key={e.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                        entrega === e.id ? "border-tinta bg-papel" : "border-linha hover:border-linha-forte"
                      }`}
                    >
                      <input
                        type="radio"
                        name="entrega"
                        checked={entrega === e.id}
                        onChange={() => setEntrega(e.id)}
                        className="size-4 accent-[#1c1b1a]"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{e.nome}</p>
                        <p className="text-[0.75rem] text-mute">{e.prazo}</p>
                      </div>
                      <span className="text-sm font-semibold tabular">
                        {subtotal >= 199 && e.id !== "sedex" ? "Grátis" : brl(e.valor)}
                      </span>
                    </label>
                  ))}
                </div>

                <Nota className="mt-5">
                  Tabela de exemplo. A cotação real vem da API dos Correios na
                  próxima fase — o valor vai variar por CEP, peso e dimensão da caixa.
                </Nota>
              </div>
            )}

            {passo === 2 && (
              <div className="sobe">
                <h2 className="font-display text-2xl">Como pagar</h2>
                <div className="mt-6 space-y-2.5">
                  {PAGAMENTOS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                        pagamento === p.id ? "border-tinta bg-papel" : "border-linha hover:border-linha-forte"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pagamento"
                        checked={pagamento === p.id}
                        onChange={() => setPagamento(p.id)}
                        className="size-4 accent-[#1c1b1a]"
                      />
                      <Icone nome={p.icone} className="size-5 text-mute" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.nome}</p>
                        <p className="text-[0.75rem] text-mute">{p.detalhe}</p>
                      </div>
                      {p.id === "pix" && <Selo tom="ok">−5%</Selo>}
                    </label>
                  ))}
                </div>

                {pagamento === "cartao" && (
                  <div className="mt-6 grid grid-cols-12 gap-4 rounded-lg border border-linha bg-papel p-5">
                    <Campo rotulo="Número do cartão" span={12} placeholder="0000 0000 0000 0000" />
                    <Campo rotulo="Nome impresso" span={6} placeholder="Como está no cartão" />
                    <Campo rotulo="Validade" span={3} placeholder="MM/AA" />
                    <Campo rotulo="CVV" span={3} placeholder="123" />
                    <label className="col-span-12">
                      <span className="spec text-mute-2">Parcelas</span>
                      <select className="mt-2 h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-sm outline-none">
                        {[1, 2, 3].map((n) => (
                          <option key={n}>
                            {n}× de {brl(totalFinal / n)} sem juros
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                <Nota className="mt-5">
                  Nenhum dado é enviado a lugar nenhum. O processamento entra na
                  próxima fase, via Mercado Pago — inclusive o Pix com QR Code.
                </Nota>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-linha pt-6">
              <Botao
                tom="fantasma"
                onClick={() => setPasso((v) => Math.max(0, v - 1))}
                disabled={passo === 0}
              >
                <Icone nome="setaEsq" className="size-4" />
                Voltar
              </Botao>
              <Botao
                tom="tinta"
                tamanho="lg"
                onClick={() => (passo === 2 ? setFeito(true) : setPasso((v) => v + 1))}
              >
                {passo === 2 ? "Finalizar pedido" : "Continuar"}
                <Icone nome="seta" className="size-4" />
              </Botao>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ resumo */}
        <aside>
          <div className="sticky top-32 rounded-xl border border-linha bg-surface p-6">
            <p className="spec">Resumo do pedido</p>

            <ul className="mt-5 space-y-4">
              {resolvidos.map((i) => (
                <li key={i.sku + (i.variacao ?? "")} className="flex gap-3.5">
                  <div
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-linha"
                    style={{ background: fundoDoProduto(i.produto.paleta) }}
                  >
                    <FotoProduto produto={i.produto} className="size-full" />
                    <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-tinta text-[0.625rem] font-semibold text-papel tabular">
                      {i.qtd}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.8125rem] font-medium">{i.produto.nome}</p>
                    <p className="spec mt-0.5 text-mute-2">{i.variacao ?? i.produto.sub}</p>
                  </div>
                  <span className="text-[0.8125rem] tabular">{brl(i.subtotal)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-linha pt-5">
              {cupom ? (
                <div className="flex items-center justify-between rounded-lg bg-ok-bg px-3.5 py-2.5">
                  <div>
                    <p className="spec text-ok">{cupom.codigo}</p>
                    <p className="mt-0.5 text-[0.75rem] text-ok">{cupom.descricao}</p>
                  </div>
                  <button onClick={tirarCupom} className="text-ok hover:opacity-70" aria-label="Remover cupom">
                    <Icone nome="fechar" className="size-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                      placeholder="Cupom de desconto"
                      className="h-10 flex-1 rounded-full border border-linha bg-papel px-4 text-[0.8125rem] outline-none placeholder:text-mute-2 focus:border-tinta"
                    />
                    <Botao
                      tom="contorno"
                      tamanho="sm"
                      onClick={() => setAviso(aplicarCupom(codigo))}
                    >
                      Aplicar
                    </Botao>
                  </div>
                  {aviso && (
                    <p className={`mt-2 text-[0.75rem] ${aviso.ok ? "text-ok" : "text-erro"}`}>
                      {aviso.msg}
                    </p>
                  )}
                  <p className="mt-2.5 text-[0.6875rem] text-mute-2">
                    Teste com <span className="spec text-tinta">{CUPONS[0].codigo}</span>
                  </p>
                </>
              )}
            </div>

            <dl className="mt-6 space-y-2 border-t border-linha pt-5 text-[0.8125rem]">
              <div className="flex justify-between">
                <dt className="text-mute">Subtotal</dt>
                <dd className="tabular">{brl(subtotal)}</dd>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-ok">
                  <dt>Cupom</dt>
                  <dd className="tabular">−{brl(desconto)}</dd>
                </div>
              )}
              {descontoPix > 0 && (
                <div className="flex justify-between text-ok">
                  <dt>Desconto Pix (5%)</dt>
                  <dd className="tabular">−{brl(descontoPix)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-mute">Frete · {opcaoEntrega.nome.split(" ·")[0]}</dt>
                <dd className="tabular">{freteEscolhido === 0 ? "Grátis" : brl(freteEscolhido)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-linha pt-3">
                <dt className="font-medium">Total</dt>
                <dd className="text-xl font-semibold tabular">{brl(totalFinal)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-start gap-2 rounded-lg bg-papel px-3.5 py-3">
              <Icone nome="caminhao" className="mt-0.5 size-4 shrink-0 text-mute" />
              <p className="text-[0.75rem] leading-relaxed text-mute">
                Produção em Guarulhos/SP · envio em até 3 dias úteis após a aprovação
                do pagamento.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
