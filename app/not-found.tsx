import Link from "next/link";
import { Logo } from "@/components/marca/Logo";
import { Icone } from "@/components/ui/Icone";
import { CATEGORIAS } from "@/lib/catalogo";

/**
 * 404 da loja.
 *
 * Fica na raiz e não dentro de (loja) porque o not-found precisa valer também
 * para rota inexistente fora do grupo — por isso traz o próprio cabeçalho
 * mínimo em vez de herdar o da loja.
 */
export default function NaoEncontrado() {
  return (
    <div className="flex min-h-dvh flex-col bg-papel">
      <header className="border-b border-linha px-5 py-5">
        <Link href="/" className="inline-block">
          <Logo variante="inline" assinatura />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-20">
        {/* marca de corte: a página que não existe é a folha que não foi impressa */}
        <svg viewBox="0 0 40 40" className="size-9 text-tinta/20" aria-hidden="true">
          <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M20 0v14M20 26v14M0 20h14M26 20h14" stroke="currentColor" strokeWidth="1" />
        </svg>

        <p className="spec mt-8 text-magenta-forte">Erro 404</p>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,7vw,4rem)] leading-[1]">
          Essa página não
          <br />
          <em>saiu da máquina.</em>
        </h1>
        <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-mute">
          O endereço não existe ou o produto saiu de linha. O catálogo inteiro
          continua a um clique.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/produtos"
            className="inline-flex h-13 items-center gap-2 rounded-full bg-tinta px-7 text-[0.9375rem] font-medium text-papel transition-colors hover:bg-grafite"
          >
            Ver catálogo
            <Icone nome="seta" className="size-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-13 items-center gap-2 rounded-full border border-linha-forte px-7 text-[0.9375rem] font-medium transition-colors hover:border-tinta"
          >
            Voltar ao início
          </Link>
        </div>

        <nav className="mt-14 border-t border-linha pt-7">
          <p className="spec text-mute-2">Ou vá direto para</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/produtos?categoria=${c.id}`}
                  className="inline-block rounded-full border border-linha bg-surface px-3.5 py-2 text-[0.8125rem] transition-colors hover:border-tinta"
                >
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
