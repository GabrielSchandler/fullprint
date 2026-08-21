import Link from "next/link";
import { Logo } from "@/components/marca/Logo";
import { Icone } from "@/components/ui/Icone";
import { CATEGORIAS, COLECOES } from "@/lib/catalogo";

const ATENDIMENTO = [
  { rotulo: "Rastrear pedido", href: "/painel/pedidos" },
  { rotulo: "Prazos e frete", href: "/ajuda" },
  { rotulo: "Trocas e devoluções", href: "/ajuda" },
  { rotulo: "Fechamento de arquivo", href: "/ajuda" },
  { rotulo: "Fale no WhatsApp", href: "https://wa.me/5511915736214" },
];

export function Rodape() {
  return (
    <footer className="mt-24 bg-noite text-papel/70">
      {/* faixa CMYK — as quatro chapas da impressão */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-ciano" />
        <div className="flex-1 bg-magenta" />
        <div className="flex-1 bg-amarelo" />
        <div className="flex-1 bg-noite-3" />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variante="inline" fundo="escuro" assinatura />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Gráfica própria em Guarulhos. Papelaria de linha para quem gosta de
              papel — e personalização com a sua marca para quem precisa de
              tiragem.
            </p>

            <div className="mt-6 flex gap-2">
              <a
                href="https://www.instagram.com/fullprintgraficaoficial/"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:text-papel"
                aria-label="Instagram da Full Print"
              >
                <Icone nome="instagram" />
              </a>
              <a
                href="https://wa.me/5511915736214"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:text-papel"
                aria-label="WhatsApp da Full Print"
              >
                <Icone nome="whatsapp" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="spec text-papel/45">Catálogo</p>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIAS.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/produtos?categoria=${c.id}`}
                    className="text-sm transition-colors hover:text-papel"
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="spec text-papel/45">Coleções</p>
            <ul className="mt-4 space-y-2.5">
              {COLECOES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/colecao/${c.id}`}
                    className="text-sm transition-colors hover:text-papel"
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="spec text-papel/45">Atendimento</p>
            <ul className="mt-4 space-y-2.5">
              {ATENDIMENTO.map((a) => (
                <li key={a.rotulo}>
                  <Link href={a.href} className="text-sm transition-colors hover:text-papel">
                    {a.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="spec text-papel/45">Empresas</p>
            <p className="mt-4 text-sm leading-relaxed">
              Caderno, caixa e kit com a sua marca, a partir de 50 unidades.
            </p>
            <Link
              href="/empresas"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-magenta px-4 py-2.5 text-[0.8125rem] font-medium text-white transition-colors hover:bg-magenta-forte"
            >
              Pedir orçamento
              <Icone nome="seta" className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-12">
          <address className="spec leading-loose text-papel/45 not-italic lg:col-span-5">
            Full Print · Gráfica rápida
            <br />
            R. Segundo Tenente Aviador Rolando Ritmeister, 35C — Guarulhos/SP
            <br />
            WhatsApp (11) 91573-6214
          </address>

          <div className="lg:col-span-4">
            <p className="spec text-papel/45">Pagamento</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Pix", "Visa", "Master", "Elo", "Amex", "Boleto"].map((m) => (
                <span
                  key={m}
                  className="spec rounded border border-white/12 px-2 py-1 text-[0.5625rem] text-papel/55"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="spec text-papel/45">Entrega</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Correios", "Sedex", "Retirada"].map((m) => (
                <span
                  key={m}
                  className="spec rounded border border-white/12 px-2 py-1 text-[0.5625rem] text-papel/55"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-[0.6875rem] leading-relaxed text-papel/35">
          Protótipo de apresentação. Preço, prazo, gramatura e estoque exibidos são
          fictícios e servem para demonstrar a jornada — nada foi confirmado com a
          Full Print. As fotos de ambiente são de banco de imagem e precisam ser
          trocadas por material impresso pela própria gráfica antes de publicar.
          Integração de frete (Correios) e pagamento (Mercado Pago) ainda não
          implementada.
        </p>
      </div>
    </footer>
  );
}
