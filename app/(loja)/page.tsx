import Link from "next/link";
import { Foto } from "@/components/loja/Foto";
import { Desfile, Revelar } from "@/components/ui/movimento";
import type { NomeFoto } from "@/lib/fotos";
import { AmostraEstampa } from "@/components/mockup/estampas";
import { CabecaSecao, Secao, TrilhoProdutos } from "@/components/loja/Trilho";
import { fundoDoProduto } from "@/components/loja/ProdutoCard";
import { Estrelas, Icone } from "@/components/ui/Icone";
import { BotaoLink, Nota, OlhoSecao, Selo, TituloSecao } from "@/components/ui/primitivos";
import {
  CATEGORIAS,
  PRODUTOS,
  destaques,
  lancamentos,
  porCategoria,
  porColecao,
  porSku,
  colecaoDe,
} from "@/lib/catalogo";
import { brl } from "@/lib/format";
import { FotoProduto } from "@/components/loja/FotoProduto";

/** Marcas de registro — o detalhe de prova de impressão que ninguém repara e todo mundo sente. */
function MarcaRegistro({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M20 0v14M20 26v14M0 20h14M26 20h14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const ETAPAS: {
  n: string;
  titulo: string;
  foto: NomeFoto;
  /** corte da foto, quando o enquadramento padrão pega o que não deve */
  posicao?: string;
  texto: string;
  spec: string;
  icone: string;
}[] = [
  {
    n: "01",
    titulo: "Papel",
    foto: "papelaria",
    texto:
      "Pólen soft, offset, colorplus, kraft e algodão. O papel é escolhido pelo uso — não pelo que sobrou no estoque.",
    spec: "90g a 600g",
    icone: "papel",
  },
  {
    n: "02",
    titulo: "Impressão",
    foto: "tinta",
    posicao: "40% 45%",
    texto:
      "Offset para tiragem, digital para prazo curto, letterpress e hot stamping para o que precisa ser sentido no toque.",
    spec: "Offset · digital · relevo",
    icone: "raio",
  },
  {
    n: "03",
    titulo: "Acabamento",
    foto: "acabamento",
    texto:
      "Corte em faca própria, costura aparente, wire-o, laminação e corte pintado. É aqui que o produto para de parecer impresso.",
    spec: "Faca própria",
    icone: "etiqueta",
  },
  {
    n: "04",
    titulo: "Expedição",
    foto: "embalagem",
    posicao: "35% 78%",
    texto:
      "Conferência peça a peça, embalagem que protege a quina e postagem no mesmo dia da liberação.",
    spec: "Até 3 dias úteis",
    icone: "caminhao",
  },
];

/**
 * ⚠️ Prova social: Nescau e Sucrilhos são contas reais que o Marcel atendeu,
 * mas o uso público do nome depende de contrato/NDA — confirmar com ele antes
 * de publicar. No protótipo interno, pode. Ver ../FullPrint/_memoria/empresa.md
 */
const CONTAS = ["Nescau", "Sucrilhos", "Agências de publicidade", "Escritórios", "Editoras"];

const DEPOIMENTOS = [
  {
    nome: "Renata M.",
    contexto: "Comprou o Caderno Bauhaus",
    nota: 5,
    texto:
      "A costura aparente aguenta abrir o caderno na mesa o dia inteiro. Já usei outros dessa faixa de preço e nenhum ficava plano assim.",
  },
  {
    nome: "Diego A.",
    contexto: "Cartão de visita algodão",
    nota: 5,
    texto:
      "O relevo do letterpress no papel de algodão fez o cartão virar assunto na reunião. Chegou dentro do prazo e com a cor exata da prova.",
  },
  {
    nome: "Camila F.",
    contexto: "Kit corporativo · 120 unidades",
    nota: 4.5,
    texto:
      "Montaram a caixa com berço recortado pro nosso kit de boas-vindas. Cuidaram do fechamento de arquivo que a gente mandou errado.",
  },
];

export default function Home() {
  const heroPrincipal = porSku("FP-CAD-001")!;

  const maisVendidos = [...PRODUTOS].sort((a, b) => b.vendas30d - a.vendas30d).slice(0, 8);
  /* produto pode ser lançamento E destaque: sem deduplicar, entra duas vezes */
  const novidades = [
    ...new Map([...lancamentos(), ...destaques()].map((p) => [p.sku, p])).values(),
  ].slice(0, 8);
  const geometria = porColecao("geometria").slice(0, 3);
  const colecao = colecaoDe("geometria");

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-linha">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 72% 34%, #ffffff 0%, #f6f3ee 55%, #ede8e0 100%)",
          }}
        />
        <MarcaRegistro className="pointer-events-none absolute top-8 left-6 size-8 text-tinta/12" />
        <MarcaRegistro className="pointer-events-none absolute right-6 bottom-8 size-8 text-tinta/12" />

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-16 lg:grid-cols-12 lg:py-24">
          <div className="sobe lg:col-span-6">
            <div className="flex items-center gap-2">
              <span className="flex gap-1">
                <span className="size-2 rounded-full bg-ciano" />
                <span className="size-2 rounded-full bg-magenta" />
                <span className="size-2 rounded-full bg-amarelo" />
              </span>
              <p className="spec text-mute">Gráfica própria · Guarulhos/SP</p>
            </div>

            <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98] tracking-[-0.02em]">
              Papel que vale
              <br />
              ser <em className="text-magenta-forte">guardado</em>.
            </h1>

            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-mute">
              Cadernos, planners e cadernetas produzidos da chapa ao acabamento na
              nossa gráfica. Sem terceirizar o miolo, sem terceirizar a costura —
              e sem surpresa de cor na hora que chega.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <BotaoLink href="/produtos" tom="tinta" tamanho="lg">
                Ver catálogo
                <Icone nome="seta" className="size-4" />
              </BotaoLink>
              <BotaoLink href="/empresas" tom="contorno" tamanho="lg">
                <Icone nome="predio" className="size-4" />
                Personalizar com minha marca
              </BotaoLink>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-5 border-t border-linha pt-6">
              {[
                ["Produção", "Própria"],
                ["Envio", "Até 3 dias"],
                ["Frete grátis", "Acima de R$ 199"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="spec text-mute-2">{k}</dt>
                  <dd className="mt-1 text-[0.8125rem] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* foto da casa + o produto por cima dela */}
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-linha bg-papel-2 shadow-papel-alta sm:aspect-[16/10] lg:aspect-auto lg:h-[580px]">
              <Foto
                nome="hero"
                sizes="(max-width: 1024px) 100vw, 55vw"
                prioritaria
                posicao="center 30%"
              />
              {/* véu quente: aproxima a foto do papel da marca */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-tinta/25 via-transparent to-transparent" />
            </div>

            {/* produto em destaque, encostado na foto */}
            <div className="absolute -bottom-10 left-2 w-[46%] max-w-[300px] rotate-[-5deg] transition-transform duration-700 hover:rotate-[-2deg] sm:left-6 lg:-left-10">
              <div
                className="overflow-hidden rounded-xl shadow-papel-alta ring-1 ring-tinta/5"
                style={{ background: fundoDoProduto(heroPrincipal.paleta) }}
              >
                {/* o SVG tem margem própria; sem a escala o caderno fica
                    perdido no meio de um cartão branco */}
                <FotoProduto
                  produto={heroPrincipal}
                  sizes="(max-width: 1024px) 46vw, 300px"
                  prioritaria
                  className="aspect-[4/5] w-full"
                />
              </div>
            </div>

            {/* etiqueta de spec */}
            <div className="absolute top-5 right-5 rounded-lg border border-linha bg-surface/95 px-3.5 py-2.5 shadow-papel backdrop-blur">
              <p className="spec text-mute-2">Miolo</p>
              <p className="mt-0.5 text-[0.8125rem] font-medium">Pólen soft 90g</p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- prova social */}
      <section className="border-b border-linha bg-surface">
        <div className="mx-auto flex max-w-[1400px] items-center gap-8 px-5 py-6">
          <p className="spec shrink-0 text-mute-2">Duas décadas imprimindo para</p>
          {/* faixa correndo: para no hover, para dar tempo de ler */}
          <Desfile duracao={38} className="min-w-0 flex-1">
            {CONTAS.map((c) => (
              <span
                key={c}
                className="flex items-center gap-8 pr-8 font-display text-lg whitespace-nowrap text-tinta/45 transition-colors hover:text-tinta/80"
              >
                {c}
                <span className="size-1 rounded-full bg-linha-forte" />
              </span>
            ))}
          </Desfile>
        </div>
      </section>

      {/* ---------------------------------------------------- categorias */}
      <Secao className="pt-20">
        <CabecaSecao
          olho="Catálogo"
          titulo="Por onde começar"
          descricao="Oito linhas, uma gráfica. Tudo o que está aqui sai da mesma casa — o que garante a mesma cor entre o caderno e a caixa que vai com ele."
          href="/produtos"
        />

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIAS.map((c, i) => {
            const amostra = porCategoria(c.id)[0];
            return (
              <Revelar key={c.id} atraso={i * 55}>
              <Link
                href={`/produtos?categoria=${c.id}`}
                className="group relative overflow-hidden rounded-xl border border-linha bg-surface transition-all duration-300 hover:border-linha-forte hover:shadow-papel"
              >
                <div
                  className="aspect-[5/4]"
                  style={{ background: fundoDoProduto(amostra.paleta) }}
                >
                  <FotoProduto produto={amostra} titulo={c.nome} className="size-full transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-linha px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.nome}</p>
                    <p className="spec mt-0.5 text-mute-2">
                      {porCategoria(c.id).length} itens
                    </p>
                  </div>
                  <Icone
                    nome="seta"
                    className="size-4 shrink-0 text-mute-2 transition-transform group-hover:translate-x-0.5 group-hover:text-magenta"
                  />
                </div>
              </Link>
              </Revelar>
            );
          })}
        </div>
      </Secao>

      {/* -------------------------------------------------- mais vendidos */}
      <Secao className="pt-20">
        <CabecaSecao
          olho="Últimos 30 dias"
          titulo="O que mais sai"
          href="/produtos?ordem=vendidos"
          hrefRotulo="Ver ranking completo"
        />
        <TrilhoProdutos produtos={maisVendidos} />
      </Secao>

      {/* ----------------------------------------------- coleção destaque */}
      <section className="mt-24 bg-papel-2 py-20">
        <Secao>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <OlhoSecao>Coleção</OlhoSecao>
              <TituloSecao className="mt-2.5">{colecao.nome}</TituloSecao>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-mute">
                {colecao.resumo}
              </p>

              <div className="mt-7">
                <p className="spec text-mute-2">Padrões da coleção</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(
                    [
                      ["leque", "oceano"],
                      ["losango", "vinho"],
                      ["arco", "mostarda"],
                      ["terrazzo", "magenta"],
                      ["onda", "ciano"],
                      ["ponto", "terracota"],
                    ] as const
                  ).map(([padrao, paleta]) => (
                    <AmostraEstampa
                      key={padrao + paleta}
                      padrao={padrao}
                      paleta={paleta}
                      className="size-11 rounded-lg"
                    />
                  ))}
                </div>
              </div>

              <BotaoLink href="/colecao/geometria" tom="tinta" className="mt-8">
                Ver a coleção
                <Icone nome="seta" className="size-4" />
              </BotaoLink>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 lg:col-span-8">
              {geometria.map((p) => (
                <Link key={p.sku} href={`/produto/${p.slug}`} className="group">
                  <div
                    className="overflow-hidden rounded-xl border border-linha bg-surface shadow-cartao transition-shadow duration-300 group-hover:shadow-papel"
                    style={{ background: fundoDoProduto(p.paleta) }}
                  >
                    <FotoProduto produto={p} className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-3.5 text-sm font-medium group-hover:text-magenta-forte">
                    {p.nome}
                  </p>
                  <p className="mt-1 text-sm text-mute tabular">{brl(p.preco)}</p>
                </Link>
              ))}
            </div>
          </div>
        </Secao>
      </section>

      {/* ------------------------------------------------------ como é feito */}
      <Secao className="pt-24">
        <CabecaSecao
          olho="Dentro da gráfica"
          titulo="Como o produto fica pronto"
          descricao="Quatro etapas na mesma casa. Terceirizar qualquer uma delas é onde a cor muda e o prazo escorrega."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ETAPAS.map((e, i) => (
            <Revelar key={e.n} atraso={i * 90} as="article"
              className="group overflow-hidden rounded-xl border border-linha bg-surface shadow-cartao transition-shadow duration-300 hover:shadow-papel"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-papel-2">
                <Foto
                  nome={e.foto}
                  posicao={e.posicao}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-tinta/45 to-transparent" />
                <span className="spec absolute bottom-3 left-4 text-papel/90">{e.n}</span>
                <Icone
                  nome={e.icone}
                  className="absolute right-4 bottom-3 size-5 text-papel/80"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl">{e.titulo}</h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-mute">{e.texto}</p>
                <p className="spec mt-5 border-t border-linha pt-4 text-mute-2">{e.spec}</p>
              </div>
            </Revelar>
          ))}
        </div>
      </Secao>

      {/* --------------------------------------------------------- a casa */}
      {/* ⚠️ Os números aqui são os fatos que o briefing trouxe (produção própria,
          Guarulhos, contas atendidas). Nada de volume inventado: se for entrar
          "x mil impressões/mês", tem que sair da boca do Marcel primeiro. */}
      <section className="relative mt-24 overflow-hidden">
        <div className="absolute inset-0">
          <Foto
            nome="impressos"
            sizes="100vw"
            className="grayscale"
            posicao="center 55%"
          />
          <div className="absolute inset-0 bg-tinta/80" />
        </div>

        <Secao className="relative py-24 text-papel">
          <div className="max-w-2xl">
            <p className="spec text-amarelo">A casa</p>
            <TituloSecao className="mt-3 text-papel">
              Vinte e oito anos
              <br />
              <em className="text-papel/60">rodando a própria chapa.</em>
            </TituloSecao>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-papel/70">
              A Full Print começou em 1998 em Guarulhos e nunca terceirizou o miolo
              do serviço. O mesmo parque que atendeu campanha de marca grande roda
              hoje a tiragem de cinquenta cadernos — com a mesma prova de cor antes
              de entrar na máquina.
            </p>
          </div>

          <dl className="mt-14 grid gap-8 border-t border-papel/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["1998", "Ano em que a primeira máquina entrou no galpão de Guarulhos."],
              ["Da chapa ao corte", "Impressão, costura e faca na mesma casa, sem intermediário."],
              ["Nescau · Sucrilhos", "Contas que já passaram pelo parque gráfico."],
              ["50 unidades", "Tiragem mínima para produzir com a sua marca."],
            ].map(([titulo, texto]) => (
              <div key={titulo}>
                <dt className="font-display text-[1.75rem] leading-none text-papel">
                  {titulo}
                </dt>
                <dd className="mt-3 text-[0.8125rem] leading-relaxed text-papel/60">
                  {texto}
                </dd>
              </div>
            ))}
          </dl>
        </Secao>
      </section>

      {/* ------------------------------------------------------------- B2B */}
      <section className="relative mt-0 overflow-hidden bg-noite text-papel">
        <div className="absolute inset-0 opacity-25">
          <Foto nome="b2b" sizes="100vw" posicao="center 40%" />
          <div className="absolute inset-0 bg-gradient-to-r from-noite via-noite/85 to-noite/40" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #00a3d9 0 2px, transparent 2px 22px), repeating-linear-gradient(45deg, #e6007e 0 2px, transparent 2px 22px)",
          }}
        />
        <Secao className="relative py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="spec text-amarelo">Full Print para empresas</p>
              <TituloSecao className="mt-3 text-papel">
                A sua marca impressa
                <br />
                <em className="text-papel/60">com o mesmo cuidado.</em>
              </TituloSecao>
              <p className="mt-5 max-w-lg text-[0.9375rem] leading-relaxed text-papel/70">
                Caderno de onboarding, caixa de kit, sacola de loja, crachá,
                cartão e bloco de reunião — produzidos com o seu logo, a sua cor
                e a sua tiragem. Você manda o briefing, a gente devolve a arte e
                a prova antes de rodar.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["Tiragem mínima", "50 unidades"],
                  ["Prova de cor", "Física, antes de rodar"],
                  ["Fechamento de arquivo", "Incluso"],
                  ["Prazo médio", "10 a 15 dias úteis"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3"
                  >
                    <p className="spec text-papel/45">{k}</p>
                    <p className="mt-1 text-sm">{v}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <BotaoLink href="/empresas" tom="magenta" tamanho="lg">
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
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 lg:col-span-6">
              {["FP-EMB-002", "FP-EMB-004", "FP-BLC-005", "FP-CRT-002"].map((sku) => {
                const p = porSku(sku)!;
                return (
                  <div
                    key={sku}
                    className="overflow-hidden rounded-xl border border-white/10"
                    style={{ background: fundoDoProduto(p.paleta) }}
                  >
                    <FotoProduto produto={p} className="aspect-square w-full" />
                  </div>
                );
              })}
            </div>
          </div>
        </Secao>
      </section>

      {/* ------------------------------------------------------ novidades */}
      <Secao className="pt-24">
        <CabecaSecao
          olho="Chegou agora"
          titulo="Novidades e destaques"
          href="/produtos?ordem=novidades"
        />
        <TrilhoProdutos produtos={novidades} />
      </Secao>

      {/* ---------------------------------------------------- depoimentos */}
      <Secao className="pt-24">
        <CabecaSecao olho="Quem já comprou" titulo="O que dizem" />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {DEPOIMENTOS.map((d) => (
            <figure
              key={d.nome}
              className="flex flex-col rounded-xl border border-linha bg-surface p-7 shadow-cartao"
            >
              <Estrelas nota={d.nota} />
              <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-tinta/85">
                “{d.texto}”
              </blockquote>
              <figcaption className="mt-5 border-t border-linha pt-4">
                <p className="text-sm font-medium">{d.nome}</p>
                <p className="spec mt-1 text-mute-2">{d.contexto}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <Nota className="mt-5">
          Depoimentos de exemplo, escritos para o protótipo. Substituir por
          avaliações reais antes de qualquer publicação.
        </Nota>
      </Secao>

      {/* ----------------------------------------------------- newsletter */}
      <Secao className="pt-24">
        <div className="overflow-hidden rounded-2xl border border-linha bg-surface">
          <div className="grid gap-8 p-10 lg:grid-cols-12 lg:items-center lg:p-14">
            <div className="lg:col-span-7">
              <Selo tom="b2b">
                <Icone nome="presente" className="size-3" />
                10% na primeira compra
              </Selo>
              <TituloSecao className="mt-4">
                Entre para a lista e veja
                <br />
                <em>a coleção antes.</em>
              </TituloSecao>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-mute">
                Lançamento, reposição de esgotado e o cupom da primeira compra.
                Um e-mail por mês, no máximo.
              </p>
            </div>

            <form className="lg:col-span-5">
              <label htmlFor="email" className="spec text-mute-2">
                Seu e-mail
              </label>
              <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
                <input
                  id="email"
                  type="email"
                  placeholder="voce@email.com"
                  className="h-12 flex-1 rounded-full border border-linha bg-papel px-5 text-sm outline-none transition-colors placeholder:text-mute-2 focus:border-tinta"
                />
                <button
                  type="button"
                  className="h-12 rounded-full bg-tinta px-6 text-sm font-medium text-papel transition-colors hover:bg-grafite"
                >
                  Quero receber
                </button>
              </div>
              <p className="mt-3 text-[0.6875rem] text-mute-2">
                Formulário do protótipo — ainda não envia nada.
              </p>
            </form>
          </div>
        </div>
      </Secao>
    </>
  );
}
