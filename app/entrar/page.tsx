"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/marca/Logo";
import { Icone } from "@/components/ui/Icone";
import { FOTOS } from "@/lib/fotos";

/**
 * Entrada do painel.
 *
 * Protótipo: não autentica ninguém. Existe porque a apresentação começa aqui —
 * é a primeira tela que o Marcel vê quando abre o sistema, e sem ela o painel
 * parece um site aberto em vez de uma ferramenta da empresa. Qualquer senha
 * entra; o botão de acesso rápido evita digitação na hora da demonstração.
 */
export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("marcel@fullprintgrafica.com.br");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [entrando, setEntrando] = useState(false);

  const entrar = () => {
    setEntrando(true);
    /* meio segundo de espera: sem isso a transição parece um link comum */
    setTimeout(() => router.push("/painel"), 550);
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* ------------------------------------------------------ formulário */}
      <div className="flex flex-col justify-between bg-papel px-6 py-8 lg:px-14">
        <Link href="/" className="inline-flex w-fit items-center gap-2">
          <Logo variante="inline" assinatura />
        </Link>

        <main className="mx-auto w-full max-w-sm py-12">
          <p className="spec text-magenta-forte">Painel administrativo</p>
          <h1 className="mt-3 font-display text-[2.75rem] leading-[1.02]">
            Bem-vindo
            <br />
            de volta.
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-mute">
            Pedidos, produção, estoque e financeiro da Full Print em um lugar só.
          </p>

          <form
            className="mt-9 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              entrar();
            }}
          >
            <label className="block">
              <span className="spec text-mute-2">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-linha bg-surface px-4 text-sm outline-none transition-colors focus:border-tinta"
              />
            </label>

            <label className="block">
              <span className="spec text-mute-2">Senha</span>
              <div className="relative mt-2">
                <input
                  type={verSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-linha bg-surface px-4 pr-12 text-sm outline-none transition-colors placeholder:text-mute-2 focus:border-tinta"
                />
                <button
                  type="button"
                  onClick={() => setVerSenha((v) => !v)}
                  className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-mute-2 hover:bg-papel-2 hover:text-tinta"
                  aria-label={verSenha ? "Esconder senha" : "Mostrar senha"}
                >
                  <Icone nome="olho" className="size-4" />
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2.5 text-[0.8125rem] text-mute">
                <input type="checkbox" defaultChecked className="size-4 accent-[#1c1b1a]" />
                Manter conectado
              </label>
              <button type="button" className="text-[0.8125rem] text-magenta-forte hover:underline">
                Esqueci a senha
              </button>
            </div>

            <button
              type="submit"
              disabled={entrando}
              className="mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-tinta text-[0.9375rem] font-medium text-papel transition-colors hover:bg-grafite disabled:opacity-60"
            >
              {entrando ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-papel/30 border-t-papel" />
                  Entrando…
                </>
              ) : (
                <>
                  Entrar no painel
                  <Icone nome="seta" className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-linha bg-surface p-5">
            <p className="spec text-mute-2">Demonstração</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-mute">
              Protótipo de apresentação: não há autenticação de verdade e nenhuma
              senha é conferida. Entre direto.
            </p>
            <button
              onClick={entrar}
              className="mt-3.5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte"
            >
              Acessar como Marcel
              <Icone nome="seta" className="size-3.5" />
            </button>
          </div>
        </main>

        <p className="text-[0.6875rem] text-mute-2">
          Full Print · Gráfica rápida — Guarulhos/SP
        </p>
      </div>

      {/* ------------------------------------------------------------ arte */}
      <div className="relative hidden overflow-hidden bg-noite lg:block">
        <Image
          src={FOTOS.tinta.src}
          alt={FOTOS.tinta.alt}
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-55"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(200deg, rgba(20,19,19,0.25) 0%, rgba(20,19,19,0.88) 72%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-ciano" />
            <span className="size-2.5 rounded-full bg-magenta" />
            <span className="size-2.5 rounded-full bg-amarelo" />
          </span>
          <p className="mt-6 max-w-md font-display text-[2.5rem] leading-[1.08] text-papel">
            Da chapa ao acabamento,
            <br />
            <em className="text-papel/60">sem terceirizar.</em>
          </p>
          <p className="mt-4 max-w-sm text-[0.875rem] leading-relaxed text-papel/55">
            O painel acompanha o pedido desde a entrada até a expedição — a mesma
            esteira que roda no chão da gráfica.
          </p>
        </div>
      </div>
    </div>
  );
}
