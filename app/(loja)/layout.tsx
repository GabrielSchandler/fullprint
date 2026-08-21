import { Cabecalho } from "@/components/loja/Cabecalho";
import { GavetaCarrinho } from "@/components/loja/GavetaCarrinho";
import { Rodape } from "@/components/loja/Rodape";
import { CarrinhoProvider } from "@/lib/carrinho";

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <CarrinhoProvider>
      <div className="flex min-h-dvh flex-col">
        <Cabecalho />
        <main className="flex-1">{children}</main>
        <Rodape />
      </div>
      <GavetaCarrinho />
    </CarrinhoProvider>
  );
}
