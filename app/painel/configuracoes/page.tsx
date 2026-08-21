"use client";

import { useState } from "react";
import { Logo } from "@/components/marca/Logo";
import {
  AvisoPrototipo,
  CabecaPagina,
  Cartao,
  Celula,
  Linha,
  SeloStatus,
  Tabela,
} from "@/components/painel/ui";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { brl } from "@/lib/format";

const ABAS = [
  { id: "loja", rotulo: "Loja", icone: "predio" },
  { id: "entrega", rotulo: "Entrega", icone: "caminhao" },
  { id: "pagamento", rotulo: "Pagamento", icone: "carteira" },
  { id: "fiscal", rotulo: "Fiscal", icone: "papel" },
  { id: "equipe", rotulo: "Equipe", icone: "pessoas" },
  { id: "integracoes", rotulo: "Integrações", icone: "raio" },
] as const;

type Aba = (typeof ABAS)[number]["id"];

const entrada =
  "h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none transition-colors placeholder:text-mute-2 focus:border-tinta";

function Campo({
  rotulo,
  ajuda,
  span = 12,
  children,
}: {
  rotulo: string;
  ajuda?: string;
  span?: number;
  children: React.ReactNode;
}) {
  return (
    <label className="block" style={{ gridColumn: `span ${span} / span ${span}` }}>
      <span className="spec text-mute-2">{rotulo}</span>
      <div className="mt-1.5">{children}</div>
      {ajuda && <p className="mt-1.5 text-[0.6875rem] text-mute">{ajuda}</p>}
    </label>
  );
}

function Chave({
  titulo,
  texto,
  ligado = false,
}: {
  titulo: string;
  texto: string;
  ligado?: boolean;
}) {
  const [on, setOn] = useState(ligado);
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-[0.8125rem] font-medium">{titulo}</p>
        <p className="mt-0.5 text-[0.75rem] leading-relaxed text-mute">{texto}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        role="switch"
        aria-checked={on}
        aria-label={titulo}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          on ? "bg-magenta" : "bg-papel-3"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-surface shadow-cartao transition-all ${
            on ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function Salvar() {
  return (
    <div className="mt-5 flex items-center justify-end gap-2">
      <button className="inline-flex h-11 items-center justify-center rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta">
        Descartar
      </button>
      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-tinta px-6 text-sm font-medium text-papel hover:bg-grafite">
        <Icone nome="check" className="size-4" strokeWidth={2.4} />
        Salvar alterações
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ abas */

function Loja() {
  return (
    <>
      <Cartao titulo="Identidade" descricao="O que aparece no cabeçalho, no rodapé e no e-mail.">
        <div className="flex flex-wrap items-center gap-5 rounded-xl border border-linha bg-papel/60 p-5">
          <div className="grid h-20 w-32 place-items-center rounded-lg border border-linha bg-surface">
            <Logo variante="inline" />
          </div>
          <div>
            <p className="text-[0.8125rem] font-medium">Logotipo da loja</p>
            <p className="mt-0.5 text-[0.75rem] text-mute">SVG ou PNG, fundo transparente.</p>
            <button className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.75rem] font-medium hover:border-tinta">
              <Icone nome="baixar" className="size-3.5" />
              Trocar arquivo
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4">
          <Campo rotulo="Nome da loja" span={6}>
            <input defaultValue="Full Print" className={entrada} />
          </Campo>
          <Campo rotulo="Razão social" span={6}>
            <input defaultValue="Full Print Gráfica e Editora Ltda" className={entrada} />
          </Campo>
          <Campo rotulo="CNPJ" span={6}>
            <input defaultValue="00.000.000/0001-00" className={entrada} />
          </Campo>
          <Campo rotulo="Inscrição estadual" span={6}>
            <input defaultValue="Isento" className={entrada} />
          </Campo>
          <Campo rotulo="E-mail de contato" span={6}>
            <input defaultValue="contato@fullprintgrafica.com.br" className={entrada} />
          </Campo>
          <Campo rotulo="WhatsApp" span={6}>
            <input defaultValue="(11) 91573-6214" className={entrada} />
          </Campo>
          <Campo rotulo="Endereço da gráfica" ajuda="Usado no cálculo de frete e na nota fiscal.">
            <input defaultValue="R. Segundo Tenente Aviador Rolando Ritmeister, 35C — Guarulhos/SP, 07042-080" className={entrada} />
          </Campo>
          <Campo rotulo="Frase do rodapé">
            <textarea
              rows={2}
              defaultValue="Papelaria impressa em gráfica própria, em Guarulhos."
              className={`${entrada} h-auto py-3 leading-relaxed`}
            />
          </Campo>
        </div>
      </Cartao>

      <div className="mt-5">
        <Cartao titulo="Vitrine" descricao="Comportamento da loja para quem está navegando.">
          <div className="divide-y divide-linha">
            <Chave
              titulo="Mostrar avaliações nos produtos"
              texto="Estrelas e número de avaliações no card e na página do produto."
              ligado
            />
            <Chave
              titulo="Exibir selo de oferta"
              texto="Produtos com preço de/por ganham etiqueta de desconto."
              ligado
            />
            <Chave
              titulo="Aviso de estoque baixo"
              texto="Mostra “últimas unidades” quando o saldo fica abaixo do mínimo."
              ligado
            />
            <Chave
              titulo="Modo manutenção"
              texto="Tira a loja do ar e mostra uma página de aviso. O painel continua acessível."
            />
          </div>
        </Cartao>
      </div>

      <Salvar />
    </>
  );
}

function Entrega() {
  return (
    <>
      <Cartao titulo="Origem e prazos" descricao="De onde sai a encomenda e quanto tempo leva.">
        <div className="grid grid-cols-12 gap-4">
          <Campo rotulo="CEP de origem" span={4}>
            <input defaultValue="07000-000" className={entrada} />
          </Campo>
          <Campo rotulo="Prazo de produção" ajuda="Somado ao prazo do Correios." span={4}>
            <input defaultValue="2 dias úteis" className={entrada} />
          </Campo>
          <Campo rotulo="Corte de expedição" span={4}>
            <input defaultValue="14h" className={entrada} />
          </Campo>
          <Campo
            rotulo="Frete grátis a partir de"
            ajuda="Vale para PAC. SEDEX sempre é cobrado."
            span={6}
          >
            <input defaultValue="199,00" className={entrada} />
          </Campo>
          <Campo rotulo="Peso médio por item" span={6}>
            <input defaultValue="320 g" className={entrada} />
          </Campo>
        </div>
      </Cartao>

      <div className="mt-5">
        <Cartao
          padding={false}
          titulo="Modalidades"
          descricao="Tabela de exemplo enquanto a API dos Correios não está ligada."
        >
          <Tabela
            cabecalho={[
              "Modalidade",
              "Prazo",
              { rotulo: "Valor", alinhar: "dir" },
              "Situação",
              { rotulo: "", alinhar: "dir" },
            ]}
          >
            {[
              { nome: "PAC · Correios", prazo: "6 a 9 dias úteis", valor: 24.9, ativo: true },
              { nome: "SEDEX · Correios", prazo: "2 a 3 dias úteis", valor: 41.5, ativo: true },
              { nome: "Retirada em Guarulhos", prazo: "A partir de 24h", valor: 0, ativo: true },
              { nome: "Motoboy · Grande SP", prazo: "Mesmo dia", valor: 34.0, ativo: false },
            ].map((m) => (
              <Linha key={m.nome}>
                <Celula className="font-medium">{m.nome}</Celula>
                <Celula className="text-mute">{m.prazo}</Celula>
                <Celula alinhar="dir" className="tabular">
                  {m.valor === 0 ? "Grátis" : brl(m.valor)}
                </Celula>
                <Celula>
                  <SeloStatus tom={m.ativo ? "ok" : "neutro"}>
                    {m.ativo ? "Ativa" : "Desativada"}
                  </SeloStatus>
                </Celula>
                <Celula alinhar="dir">
                  <button
                    className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                    aria-label={`Editar ${m.nome}`}
                  >
                    <Icone nome="lapis" className="size-4" />
                  </button>
                </Celula>
              </Linha>
            ))}
          </Tabela>
        </Cartao>
      </div>

      <Salvar />
    </>
  );
}

function Pagamento() {
  return (
    <>
      <Cartao titulo="Formas aceitas" descricao="O que aparece na última etapa do checkout.">
        <div className="divide-y divide-linha">
          <Chave titulo="Pix" texto="Aprovação na hora, com 5% de desconto no total." ligado />
          <Chave titulo="Cartão de crédito" texto="Até 3× sem juros a partir de R$ 150." ligado />
          <Chave titulo="Boleto bancário" texto="Compensa em até 2 dias úteis." ligado />
          <Chave
            titulo="Faturado 30 dias (B2B)"
            texto="Liberado por cliente, para empresas com cadastro aprovado."
          />
        </div>
      </Cartao>

      <div className="mt-5">
        <Cartao titulo="Regras" descricao="Parcelamento e descontos.">
          <div className="grid grid-cols-12 gap-4">
            <Campo rotulo="Desconto no Pix" span={4}>
              <input defaultValue="5%" className={entrada} />
            </Campo>
            <Campo rotulo="Parcela mínima" span={4}>
              <input defaultValue="50,00" className={entrada} />
            </Campo>
            <Campo rotulo="Máximo de parcelas" span={4}>
              <select defaultValue="3" className={entrada}>
                {[1, 2, 3, 4, 6, 10, 12].map((n) => (
                  <option key={n} value={n}>
                    {n}× sem juros
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-linha bg-alerta-bg/60 px-4 py-3.5">
            <Icone nome="alerta" className="mt-0.5 size-4 shrink-0 text-alerta" />
            <p className="text-[0.75rem] leading-relaxed text-alerta">
              O gateway ainda não está conectado. Enquanto o Mercado Pago não entrar, o
              checkout registra o pedido e devolve a instrução de pagamento por e-mail.
            </p>
          </div>
        </Cartao>
      </div>

      <Salvar />
    </>
  );
}

function Fiscal() {
  return (
    <>
      <Cartao titulo="Regime e emissão" descricao="Como a nota sai depois do pedido pago.">
        <div className="grid grid-cols-12 gap-4">
          <Campo rotulo="Regime tributário" span={6}>
            <select className={entrada}>
              <option>Simples Nacional</option>
              <option>Lucro Presumido</option>
              <option>Lucro Real</option>
            </select>
          </Campo>
          <Campo rotulo="CFOP padrão" span={6}>
            <input defaultValue="5102 · venda de mercadoria" className={entrada} />
          </Campo>
          <Campo rotulo="NCM padrão da papelaria" span={6}>
            <input defaultValue="4820.10.00" className={entrada} />
          </Campo>
          <Campo rotulo="Série da NF-e" span={6}>
            <input defaultValue="1" className={entrada} />
          </Campo>
        </div>

        <div className="mt-6 divide-y divide-linha border-t border-linha pt-2">
          <Chave
            titulo="Emitir NF-e automaticamente"
            texto="Dispara a emissão assim que o pagamento é confirmado."
            ligado
          />
          <Chave
            titulo="Enviar XML por e-mail"
            texto="O cliente recebe o PDF e o XML junto do código de rastreio."
            ligado
          />
        </div>
      </Cartao>

      <div className="mt-5">
        <Cartao titulo="Certificado digital" descricao="A1, renovado anualmente.">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-linha bg-papel/60 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ok-bg text-ok">
              <Icone nome="check" className="size-5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.8125rem] font-medium">Certificado A1 instalado</p>
              <p className="mt-0.5 text-[0.75rem] text-mute">
                Válido até 14/03/2027 · emitido para Full Print Gráfica e Editora Ltda
              </p>
            </div>
            <button className="inline-flex h-9 items-center gap-2 rounded-full border border-linha bg-surface px-4 text-[0.75rem] font-medium hover:border-tinta">
              Substituir
            </button>
          </div>
        </Cartao>
      </div>

      <Salvar />
    </>
  );
}

function Equipe() {
  const pessoas = [
    {
      nome: "Marcel",
      email: "marcel@fullprintgrafica.com.br",
      papel: "Administrador",
      acesso: "Tudo, incluindo financeiro e configurações",
      tom: "destaque" as const,
    },
    {
      nome: "Renata",
      email: "renata@fullprintgrafica.com.br",
      papel: "Comercial",
      acesso: "Pedidos, clientes e orçamentos B2B",
      tom: "info" as const,
    },
    {
      nome: "Douglas",
      email: "douglas@fullprintgrafica.com.br",
      papel: "Produção",
      acesso: "Pedidos e estoque",
      tom: "ok" as const,
    },
    {
      nome: "Contabilidade",
      email: "fiscal@escritoriolemos.com.br",
      papel: "Somente leitura",
      acesso: "Financeiro e relatórios",
      tom: "neutro" as const,
    },
  ];

  return (
    <>
      <Cartao
        padding={false}
        titulo="Quem tem acesso"
        descricao="Cada papel enxerga apenas o que precisa."
        acao={
          <button className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium hover:text-magenta-forte">
            <Icone nome="mais" className="size-3.5" strokeWidth={2.2} />
            Convidar
          </button>
        }
      >
        <Tabela
          cabecalho={["Pessoa", "Papel", "Enxerga", { rotulo: "", alinhar: "dir" }]}
        >
          {pessoas.map((p) => (
            <Linha key={p.email}>
              <Celula>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-papel-2 text-[0.6875rem] font-semibold text-grafite">
                    {p.nome.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{p.nome}</p>
                    <p className="text-[0.6875rem] text-mute-2">{p.email}</p>
                  </div>
                </div>
              </Celula>
              <Celula>
                <SeloStatus tom={p.tom}>{p.papel}</SeloStatus>
              </Celula>
              <Celula className="text-mute">{p.acesso}</Celula>
              <Celula alinhar="dir">
                <div className="flex justify-end gap-1">
                  <button
                    className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                    aria-label={`Editar ${p.nome}`}
                  >
                    <Icone nome="lapis" className="size-4" />
                  </button>
                  <button
                    className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-erro"
                    aria-label={`Remover ${p.nome}`}
                  >
                    <Icone nome="lixeira" className="size-4" />
                  </button>
                </div>
              </Celula>
            </Linha>
          ))}
        </Tabela>
      </Cartao>

      <div className="mt-5">
        <Cartao titulo="Segurança" descricao="Regras de entrada no painel.">
          <div className="divide-y divide-linha">
            <Chave
              titulo="Verificação em duas etapas"
              texto="Código por aplicativo autenticador na hora do login."
              ligado
            />
            <Chave
              titulo="Encerrar sessão por inatividade"
              texto="Desconecta depois de 8 horas sem uso."
              ligado
            />
            <Chave
              titulo="Registrar histórico de ações"
              texto="Guarda quem alterou preço, estoque e status de pedido."
              ligado
            />
          </div>
        </Cartao>
      </div>

      <Salvar />
    </>
  );
}

function Integracoes() {
  const itens: {
    nome: string;
    texto: string;
    icone: NomeIcone;
    situacao: "conectado" | "pendente" | "disponivel";
  }[] = [
    {
      nome: "Correios",
      texto: "Cotação de frete, etiqueta e rastreio automático.",
      icone: "caminhao",
      situacao: "pendente",
    },
    {
      nome: "Mercado Pago",
      texto: "Pix com QR Code, cartão e boleto, com repasse semanal.",
      icone: "carteira",
      situacao: "pendente",
    },
    {
      nome: "WhatsApp Business",
      texto: "Aviso de pedido enviado e atendimento pelo número da loja.",
      icone: "whatsapp",
      situacao: "disponivel",
    },
    {
      nome: "Instagram Shopping",
      texto: "Sincroniza o catálogo com a loja do @fullprintgraficaoficial.",
      icone: "instagram",
      situacao: "disponivel",
    },
    {
      nome: "Google Analytics",
      texto: "Origem do tráfego e funil de compra.",
      icone: "grafico",
      situacao: "conectado",
    },
    {
      nome: "Emissor de NF-e",
      texto: "Emissão automática após a confirmação do pagamento.",
      icone: "papel",
      situacao: "conectado",
    },
  ];

  const SELO = {
    conectado: { tom: "ok" as const, rotulo: "Conectado", botao: "Configurar" },
    pendente: { tom: "alerta" as const, rotulo: "Próxima fase", botao: "Saiba mais" },
    disponivel: { tom: "neutro" as const, rotulo: "Disponível", botao: "Conectar" },
  };

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {itens.map((i) => {
          const s = SELO[i.situacao];
          return (
            <li
              key={i.nome}
              className="flex gap-4 rounded-xl border border-linha bg-surface p-5 shadow-cartao"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-papel text-grafite">
                <Icone nome={i.icone} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[0.875rem] font-semibold">{i.nome}</h3>
                  <SeloStatus tom={s.tom}>{s.rotulo}</SeloStatus>
                </div>
                <p className="mt-1.5 text-[0.75rem] leading-relaxed text-mute">{i.texto}</p>
                <button className="mt-3.5 inline-flex h-9 items-center gap-2 rounded-full border border-linha px-4 text-[0.75rem] font-medium hover:border-tinta">
                  {s.botao}
                  <Icone nome="seta" className="size-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5">
        <Cartao titulo="Chaves de API" descricao="Credenciais usadas pelas integrações.">
          <div className="grid grid-cols-12 gap-4">
            <Campo rotulo="Token público" span={6}>
              <input
                defaultValue="pk_live_••••••••••••••••4f2a"
                readOnly
                className={`${entrada} text-mute`}
              />
            </Campo>
            <Campo rotulo="Token privado" span={6}>
              <input
                defaultValue="sk_live_••••••••••••••••9c71"
                readOnly
                className={`${entrada} text-mute`}
              />
            </Campo>
            <Campo rotulo="Webhook de pagamento" span={12}>
              <input
                defaultValue="https://fullprintgrafica.com.br/api/webhook/pagamento"
                readOnly
                className={`${entrada} text-mute`}
              />
            </Campo>
          </div>
        </Cartao>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ página */

export default function ConfiguracoesPage() {
  const [aba, setAba] = useState<Aba>("loja");

  return (
    <>
      <CabecaPagina
        titulo="Configurações"
        descricao="Os ajustes que mudam o comportamento da loja e do painel."
      />

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* menu lateral */}
        <nav className="lg:w-56 lg:shrink-0">
          <div className="scroll-x sem-barra -mx-1 flex gap-1 px-1 lg:mx-0 lg:flex-col lg:px-0">
            {ABAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.8125rem] transition-colors ${
                  aba === a.id
                    ? "bg-surface font-medium shadow-cartao"
                    : "text-mute hover:bg-papel-2 hover:text-tinta"
                }`}
              >
                <Icone nome={a.icone} className="size-4 shrink-0" />
                {a.rotulo}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          {aba === "loja" && <Loja />}
          {aba === "entrega" && <Entrega />}
          {aba === "pagamento" && <Pagamento />}
          {aba === "fiscal" && <Fiscal />}
          {aba === "equipe" && <Equipe />}
          {aba === "integracoes" && <Integracoes />}
        </div>
      </div>

      <AvisoPrototipo>
        Nada aqui é gravado — os campos vêm preenchidos com dados de exemplo para mostrar o
        alcance do painel. CNPJ, endereço e telefone precisam ser confirmados com o Marcel
        antes de irem para o ar.
      </AvisoPrototipo>
    </>
  );
}
