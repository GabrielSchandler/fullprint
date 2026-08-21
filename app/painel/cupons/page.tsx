"use client";

import { useState } from "react";
import { BarrasHorizontais } from "@/components/painel/graficos";
import {
  AvisoPrototipo,
  CabecaPagina,
  Cartao,
  Celula,
  Kpi,
  Linha,
  SeloStatus,
  Tabela,
} from "@/components/painel/ui";
import { Icone } from "@/components/ui/Icone";
import { HOJE, brl, brlCurto, data, num } from "@/lib/format";
import { CATEGORIAS } from "@/lib/catalogo";
import { CUPONS_PAINEL, type CupomPainel } from "@/lib/painel-dados";

const situacao = (c: CupomPainel) => {
  if (c.validade.getTime() < HOJE.getTime())
    return { tom: "neutro" as const, rotulo: "Expirado" };
  if (!c.ativo) return { tom: "alerta" as const, rotulo: "Pausado" };
  return { tom: "ok" as const, rotulo: "Ativo" };
};

const entrada =
  "h-11 w-full rounded-lg border border-linha bg-surface px-3.5 text-[0.8125rem] outline-none transition-colors placeholder:text-mute-2 focus:border-tinta";

/* ------------------------------------------------------------ cadastro */

function NovoCupom({ fechar }: { fechar: () => void }) {
  const [codigo, setCodigo] = useState("");
  const [tipo, setTipo] = useState<CupomPainel["tipo"]>("Percentual");
  const [valor, setValor] = useState("");

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        className="absolute inset-0 cursor-default bg-tinta/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-label="Fechar"
      />
      <div className="relative w-[min(560px,100%)] overflow-hidden rounded-2xl border border-linha bg-surface shadow-papel-alta">
        <header className="flex items-start justify-between gap-4 border-b border-linha px-6 py-5">
          <div>
            <p className="spec text-mute-2">Marketing</p>
            <h2 className="mt-1 font-display text-2xl leading-none">Novo cupom</h2>
          </div>
          <button
            onClick={fechar}
            className="grid size-9 place-items-center rounded-full hover:bg-papel-2"
            aria-label="Fechar"
          >
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="p-6">
          {/* prévia do cupom */}
          <div className="relative overflow-hidden rounded-xl border border-dashed border-magenta/40 bg-magenta-claro px-5 py-6 text-center">
            <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-surface" />
            <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-surface" />
            <p className="spec text-magenta-forte">Cupom da loja</p>
            <p className="mt-2 font-display text-2xl text-magenta-forte">
              {codigo.toUpperCase() || "SEUCUPOM"}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-magenta-forte/80">
              {tipo === "Frete grátis"
                ? "Frete grátis em qualquer compra"
                : tipo === "Percentual"
                  ? `${valor || "0"}% de desconto`
                  : `${brl(Number(valor) || 0)} de desconto`}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-4">
            <label className="col-span-12 block sm:col-span-7">
              <span className="spec text-mute-2">Código</span>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="VOLTAASAULAS"
                className={`mt-1.5 ${entrada} uppercase`}
              />
            </label>

            <label className="col-span-12 block sm:col-span-5">
              <span className="spec text-mute-2">Tipo</span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as CupomPainel["tipo"])}
                className={`mt-1.5 ${entrada}`}
              >
                <option>Percentual</option>
                <option>Valor fixo</option>
                <option>Frete grátis</option>
              </select>
            </label>

            {tipo !== "Frete grátis" && (
              <label className="col-span-6 block">
                <span className="spec text-mute-2">
                  {tipo === "Percentual" ? "Desconto (%)" : "Desconto (R$)"}
                </span>
                <input
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                  className={`mt-1.5 ${entrada}`}
                />
              </label>
            )}

            <label className="col-span-6 block">
              <span className="spec text-mute-2">Compra mínima</span>
              <input inputMode="decimal" placeholder="0,00" className={`mt-1.5 ${entrada}`} />
            </label>

            <label className="col-span-6 block">
              <span className="spec text-mute-2">Limite de usos</span>
              <input inputMode="numeric" placeholder="Sem limite" className={`mt-1.5 ${entrada}`} />
            </label>

            <label className="col-span-6 block">
              <span className="spec text-mute-2">Validade</span>
              <input type="date" className={`mt-1.5 ${entrada}`} />
            </label>

            <label className="col-span-12 block">
              <span className="spec text-mute-2">Aplica em</span>
              <select className={`mt-1.5 ${entrada}`}>
                <option>Todo o catálogo</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.id}>{c.nome}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-5 flex items-center gap-3">
            <input type="checkbox" defaultChecked className="size-4 accent-magenta" />
            <span className="text-[0.8125rem]">Somente para a primeira compra do cliente</span>
          </label>
        </div>

        <footer className="flex gap-2 border-t border-linha px-6 py-4">
          <button className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-tinta text-sm font-medium text-papel hover:bg-grafite">
            <Icone nome="check" className="size-4" strokeWidth={2.4} />
            Criar cupom
          </button>
          <button
            onClick={fechar}
            className="inline-flex h-11 items-center justify-center rounded-full border border-linha px-5 text-sm font-medium hover:border-tinta"
          >
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function CuponsPage() {
  const [novo, setNovo] = useState(false);

  const ativos = CUPONS_PAINEL.filter((c) => situacao(c).rotulo === "Ativo");
  const usos = CUPONS_PAINEL.reduce((s, c) => s + c.usos, 0);
  const receita = CUPONS_PAINEL.reduce((s, c) => s + c.receita, 0);

  return (
    <>
      <CabecaPagina
        titulo="Cupons"
        descricao="Códigos de desconto da loja. A receita mostrada é a dos pedidos em que o cupom foi aplicado."
        acoes={
          <button
            onClick={() => setNovo(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-tinta px-4 text-[0.8125rem] font-medium text-papel hover:bg-grafite"
          >
            <Icone nome="mais" className="size-4" strokeWidth={2.2} />
            Novo cupom
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          rotulo="Cupons ativos"
          valor={num(ativos.length)}
          auxiliar={`${CUPONS_PAINEL.length} criados no total`}
          icone="cupom"
        />
        <Kpi rotulo="Usos acumulados" valor={num(usos)} icone="sacola" />
        <Kpi
          rotulo="Receita influenciada"
          valor={brlCurto(receita)}
          auxiliar="Pedidos com cupom aplicado"
          icone="carteira"
        />
        <Kpi
          rotulo="Ticket com cupom"
          valor={brl(receita / usos, 0)}
          auxiliar="Contra R$ 253 sem cupom"
          icone="etiqueta"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Cartao
          className="xl:col-span-2"
          padding={false}
          titulo="Todos os cupons"
          descricao="Uso, alcance e validade de cada código."
        >
          <Tabela
            cabecalho={[
              "Código",
              "Tipo",
              "Desconto",
              "Uso",
              { rotulo: "Receita", alinhar: "dir" },
              "Validade",
              "Situação",
              { rotulo: "", alinhar: "dir" },
            ]}
          >
            {CUPONS_PAINEL.map((c) => {
              const s = situacao(c);
              const pct = c.limite > 0 ? Math.min(100, (c.usos / c.limite) * 100) : null;
              return (
                <Linha key={c.codigo}>
                  <Celula>
                    <span className="spec rounded-md bg-papel-2 px-2 py-1 text-tinta">
                      {c.codigo}
                    </span>
                  </Celula>
                  <Celula className="text-mute">{c.tipo}</Celula>
                  <Celula className="font-medium tabular">{c.valor}</Celula>
                  <Celula>
                    <p className="text-[0.75rem] tabular">
                      {num(c.usos)}
                      {c.limite > 0 ? ` / ${num(c.limite)}` : " · sem limite"}
                    </p>
                    {pct !== null && (
                      <div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-papel-3">
                        <div
                          className="h-full rounded-full bg-magenta"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </Celula>
                  <Celula alinhar="dir" className="font-medium tabular">
                    {brlCurto(c.receita)}
                  </Celula>
                  <Celula className="text-mute tabular">{data(c.validade)}</Celula>
                  <Celula>
                    <SeloStatus tom={s.tom}>{s.rotulo}</SeloStatus>
                  </Celula>
                  <Celula alinhar="dir">
                    <div className="flex justify-end gap-1">
                      <button
                        className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-tinta"
                        aria-label={`Editar ${c.codigo}`}
                      >
                        <Icone nome="lapis" className="size-4" />
                      </button>
                      <button
                        className="grid size-8 place-items-center rounded-full text-mute hover:bg-papel-2 hover:text-erro"
                        aria-label={`Excluir ${c.codigo}`}
                      >
                        <Icone nome="lixeira" className="size-4" />
                      </button>
                    </div>
                  </Celula>
                </Linha>
              );
            })}
          </Tabela>
        </Cartao>

        <div className="space-y-5">
          <Cartao titulo="Receita por cupom" descricao="Do maior para o menor.">
            <BarrasHorizontais
              itens={[...CUPONS_PAINEL]
                .sort((a, b) => b.receita - a.receita)
                .map((c) => ({ nome: c.codigo, valor: c.receita }))}
              formato="brlCurto"
            />
          </Cartao>

          <Cartao titulo="Como o cliente usa" descricao="Onde o código é digitado.">
            <ul className="space-y-3.5">
              {[
                { canal: "Carrinho", pct: 62 },
                { canal: "Checkout", pct: 29 },
                { canal: "Link direto", pct: 9 },
              ].map((c) => (
                <li key={c.canal}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.8125rem] text-tinta/85">{c.canal}</span>
                    <span className="text-[0.8125rem] font-medium tabular">{c.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-papel-3">
                    <div
                      className="h-full rounded-full bg-serie-1"
                      style={{ width: `${c.pct}%`, background: "var(--color-serie-1)" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-linha pt-4 text-[0.75rem] leading-relaxed text-mute">
              O campo de cupom já existe na gaveta do carrinho e no checkout da loja — os dois
              validam o código na hora.
            </p>
          </Cartao>
        </div>
      </div>

      <AvisoPrototipo>
        Cupons fictícios. Os códigos <strong>PRIMEIRACOMPRA</strong>,{" "}
        <strong>FRETEGRATIS</strong> e <strong>PAPEL50</strong> funcionam de verdade no
        checkout do protótipo — vale testar na apresentação.
      </AvisoPrototipo>

      {novo && <NovoCupom fechar={() => setNovo(false)} />}
    </>
  );
}
