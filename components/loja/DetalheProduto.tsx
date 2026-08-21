"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { ROTULO_FORMATO } from "@/components/mockup/ProdutoMockup";
import { Estrelas, Icone } from "@/components/ui/Icone";
import { Botao, Nota, Selo } from "@/components/ui/primitivos";
import { useCarrinho } from "@/lib/carrinho";
import { categoriaDe, colecaoDe, fotosDoProduto, type Produto } from "@/lib/catalogo";
import { brl } from "@/lib/format";
import { fundoDoProduto } from "./ProdutoCard";
import { FotoProduto } from "@/components/loja/FotoProduto";

const ROTULO_VISTA = ["Produto", "Detalhe", "Em uso"];

function Galeria({ produto }: { produto: Produto }) {
  const [vista, setVista] = useState(0);
  const fundo = fundoDoProduto(produto.paleta);
  const fotos = fotosDoProduto(produto, 3);

  return (
    /* self-start: sem isso a coluna estica até a altura da ficha do produto e
       sobra um vão de fundo embaixo do quadrado da foto. Com a altura natural
       dá para grudar a galeria enquanto a ficha rola. */
    <div className="flex flex-col-reverse gap-4 self-start lg:sticky lg:top-24 lg:flex-row">
      <div className="flex gap-3 lg:flex-col">
        {fotos.map((foto, i) => (
          <button
            key={foto}
            onClick={() => setVista(i)}
            className={`relative size-20 overflow-hidden rounded-lg border transition-colors ${
              vista === i ? "border-tinta" : "border-linha hover:border-linha-forte"
            }`}
            style={{ background: fundo }}
            aria-label={ROTULO_VISTA[i]}
            aria-current={vista === i}
          >
            <Image
              src={foto}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div
        className="relative flex-1 overflow-hidden rounded-2xl border border-linha"
        style={{ background: fundo }}
      >
        <div className="relative aspect-square">
          <Image
            src={fotos[vista]}
            alt={produto.nome}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        <div className="absolute bottom-4 left-4 rounded-lg border border-linha bg-surface/95 px-3 py-2 backdrop-blur">
          <p className="spec text-mute-2">{ROTULO_FORMATO[produto.formato]}</p>
          <p className="mt-0.5 text-[0.8125rem] font-medium">{produto.specs[0]?.[1]}</p>
        </div>
      </div>
    </div>
  );
}

function Acordeao({
  titulo,
  children,
  aberto = false,
}: {
  titulo: string;
  children: React.ReactNode;
  aberto?: boolean;
}) {
  const [on, setOn] = useState(aberto);
  return (
    <div className="border-b border-linha">
      <button
        onClick={() => setOn((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium">{titulo}</span>
        <Icone nome={on ? "menos" : "mais"} className="size-4 text-mute" />
      </button>
      {on && <div className="pb-5 text-[0.875rem] leading-relaxed text-mute">{children}</div>}
    </div>
  );
}

function CalculadoraFrete() {
  const [cep, setCep] = useState("");
  const [resultado, setResultado] = useState<
    { nome: string; prazo: string; valor: number }[] | null
  >(null);

  const calcular = () => {
    if (cep.replace(/\D/g, "").length !== 8) {
      setResultado(null);
      return;
    }
    setResultado([
      { nome: "PAC", prazo: "6 a 9 dias úteis", valor: 24.9 },
      { nome: "SEDEX", prazo: "2 a 3 dias úteis", valor: 41.5 },
      { nome: "Retirada em Guarulhos", prazo: "A partir de 3 dias úteis", valor: 0 },
    ]);
  };

  return (
    <div className="rounded-xl border border-linha bg-surface p-5">
      <div className="flex items-center gap-2">
        <Icone nome="caminhao" className="size-4 text-mute" />
        <p className="spec">Prazo e frete</p>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite seu CEP"
          inputMode="numeric"
          className="h-10 flex-1 rounded-full border border-linha bg-papel px-4 text-sm outline-none placeholder:text-mute-2 focus:border-tinta"
        />
        <Botao tom="contorno" tamanho="sm" onClick={calcular}>
          Calcular
        </Botao>
      </div>

      {resultado && (
        <ul className="mt-4 divide-y divide-linha">
          {resultado.map((r) => (
            <li key={r.nome} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-[0.8125rem] font-medium">{r.nome}</p>
                <p className="text-[0.75rem] text-mute">{r.prazo}</p>
              </div>
              <span className="text-[0.8125rem] font-semibold tabular">
                {r.valor === 0 ? "Grátis" : brl(r.valor)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Nota className="mt-4">
        Valores de exemplo. A integração com os Correios entra na próxima fase —
        hoje qualquer CEP válido devolve a mesma tabela.
      </Nota>
    </div>
  );
}

export function DetalheProduto({ produto }: { produto: Produto }) {
  const { adicionar } = useCarrinho();
  const [variacao, setVariacao] = useState(produto.variacao?.opcoes[0]);
  const [qtd, setQtd] = useState(1);
  const [feito, setFeito] = useState(false);

  const cat = categoriaDe(produto.categoria);
  const col = colecaoDe(produto.colecao);
  const emOferta = !!produto.precoDe && produto.precoDe > produto.preco;
  const esgotado = produto.estoque === 0;
  const poucos = !esgotado && produto.estoque <= produto.estoqueMin;

  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <nav aria-label="Trilha" className="flex flex-wrap items-center gap-1.5 py-6 text-[0.75rem] text-mute">
        <Link href="/" className="hover:text-tinta">Início</Link>
        <Icone nome="chevron" className="size-3" />
        <Link href="/produtos" className="hover:text-tinta">Catálogo</Link>
        <Icone nome="chevron" className="size-3" />
        <Link href={`/produtos?categoria=${cat.id}`} className="hover:text-tinta">{cat.nome}</Link>
        <Icone nome="chevron" className="size-3" />
        <span className="text-tinta">{produto.nome}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Galeria produto={produto} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/colecao/${col.id}`}>
              <Selo tom="neutro">Coleção {col.nome}</Selo>
            </Link>
            {produto.novo && <Selo tom="novo">Novo</Selo>}
            {emOferta && (
              <Selo tom="oferta">
                −{Math.round((1 - produto.preco / produto.precoDe!) * 100)}%
              </Selo>
            )}
            {produto.b2b && (
              <Selo tom="b2b">
                <Icone nome="predio" className="size-3" />
                Personalizável
              </Selo>
            )}
          </div>

          <h1 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-[1.02] tracking-[-0.015em]">
            {produto.nome}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <Estrelas nota={produto.avaliacao} />
            <span className="text-[0.8125rem] text-mute tabular">
              {produto.avaliacao.toFixed(1).replace(".", ",")} · {produto.qtdAvaliacoes} avaliações
            </span>
            <span className="spec ml-2 text-mute-2">{produto.sku}</span>
          </div>

          <p className="mt-5 text-[1.0625rem] leading-relaxed text-mute">{produto.resumo}</p>

          <div className="mt-7 flex items-end gap-3">
            {emOferta && (
              <span className="text-lg text-mute-2 line-through tabular">
                {brl(produto.precoDe!)}
              </span>
            )}
            <span className="text-4xl font-semibold tracking-tight tabular">
              {brl(produto.preco)}
            </span>
          </div>
          <p className="mt-1.5 text-[0.8125rem] text-mute">
            em até 3× de <span className="tabular">{brl(produto.preco / 3)}</span> sem juros
            <span className="mx-2 text-linha-forte">|</span>
            <span className="font-medium text-ok">{brl(produto.preco * 0.95)} no Pix</span>
          </p>

          {produto.variacao && (
            <div className="mt-7">
              <p className="spec text-mute-2">{produto.variacao.rotulo}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {produto.variacao.opcoes.map((o) => (
                  <button
                    key={o}
                    onClick={() => setVariacao(o)}
                    className={`rounded-full border px-4 py-2 text-[0.8125rem] transition-colors ${
                      variacao === o
                        ? "border-tinta bg-tinta text-papel"
                        : "border-linha bg-surface hover:border-linha-forte"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex h-13 items-center rounded-full border border-linha bg-surface">
              <button
                onClick={() => setQtd((v) => Math.max(1, v - 1))}
                className="grid size-11 place-items-center rounded-full hover:bg-papel-2"
                aria-label="Diminuir quantidade"
              >
                <Icone nome="menos" className="size-4" />
              </button>
              <span className="w-9 text-center text-sm font-medium tabular">{qtd}</span>
              <button
                onClick={() => setQtd((v) => Math.min(99, v + 1))}
                className="grid size-11 place-items-center rounded-full hover:bg-papel-2"
                aria-label="Aumentar quantidade"
              >
                <Icone nome="mais" className="size-4" />
              </button>
            </div>

            <Botao
              tom="tinta"
              tamanho="lg"
              className="flex-1"
              disabled={esgotado}
              onClick={() => {
                adicionar(produto.sku, qtd, variacao);
                setFeito(true);
                setTimeout(() => setFeito(false), 1800);
              }}
            >
              <Icone nome={feito ? "check" : "sacola"} className="size-4" />
              {esgotado ? "Esgotado" : feito ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
            </Botao>

            <button
              className="grid size-13 shrink-0 place-items-center rounded-full border border-linha bg-surface text-mute transition-colors hover:border-magenta hover:text-magenta"
              aria-label="Salvar nos favoritos"
            >
              <Icone nome="coracao" className="size-5" />
            </button>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-[0.8125rem]">
            {esgotado ? (
              <span className="text-erro">Sem estoque — avise-me quando voltar</span>
            ) : poucos ? (
              <>
                <Icone nome="alerta" className="size-4 text-alerta" />
                <span className="text-alerta">
                  Últimas <span className="tabular">{produto.estoque}</span> unidades
                </span>
              </>
            ) : (
              <>
                <Icone nome="check" className="size-4 text-ok" />
                <span className="text-ok">Em estoque · pronto para envio</span>
              </>
            )}
          </p>

          <div className="mt-8">
            <CalculadoraFrete />
          </div>

          {produto.b2b && (
            <div className="mt-4 rounded-xl border border-ciano/25 bg-ciano-claro/60 p-5">
              <div className="flex items-center gap-2">
                <Icone nome="predio" className="size-4 text-ciano-forte" />
                <p className="spec text-ciano-forte">Para empresa</p>
              </div>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-tinta/80">
                Este item sai personalizado com a sua marca a partir de 50 unidades —
                logo aplicado na capa, cor da coleção trocada pela sua e caixa com o
                seu nome.
              </p>
              <Link
                href="/empresas"
                className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ciano-forte hover:underline"
              >
                Pedir orçamento
                <Icone nome="seta" className="size-3.5" />
              </Link>
            </div>
          )}

          <div className="mt-9">
            <Acordeao titulo="Descrição" aberto>
              <p>{produto.descricao}</p>
            </Acordeao>

            <Acordeao titulo="Ficha técnica">
              <dl className="divide-y divide-linha">
                {produto.specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-2.5">
                    <dt className="spec shrink-0 text-mute-2">{k}</dt>
                    <dd className="text-right text-[0.8125rem] text-tinta">{v}</dd>
                  </div>
                ))}
              </dl>
            </Acordeao>

            <Acordeao titulo="Envio, troca e devolução">
              <p>
                Produção própria em Guarulhos/SP. Pedidos aprovados até as 14h saem
                em até 3 dias úteis. Troca ou devolução em até 7 dias corridos após
                o recebimento, com o produto sem uso e na embalagem original.
              </p>
            </Acordeao>

            <Acordeao titulo="Cuidados com o papel">
              <p>
                Guarde longe de sol direto e umidade. A laminação fosca marca com
                unha e anel — é característica do acabamento, não defeito. Corte
                pintado pode transferir um leve pigmento no primeiro uso.
              </p>
            </Acordeao>
          </div>
        </div>
      </div>
    </div>
  );
}
