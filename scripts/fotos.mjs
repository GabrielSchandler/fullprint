/**
 * Baixa as fotos do protótipo (Pexels) para public/fotos e gera lib/fotos.ts.
 *
 *   node scripts/fotos.mjs
 *
 * As fotos são de banco, escolhidas a dedo em scripts/fotos-contato.mjs e
 * revisadas em scripts/fotos-revisar.mjs. Elas seguram a apresentação, mas o
 * site final tem que usar foto da Full Print — é gráfica, a prova de qualidade
 * é o material dela, não o de terceiro.
 *
 * Regra da curadoria: nenhuma foto pode ter marca de outra empresa legível.
 * Duas candidatas boas caíram por isso (parque com logo na parede, offset
 * rodando rótulo de autopeça).
 *
 * Licença Pexels: uso livre, inclusive comercial, sem exigir atribuição.
 * Ainda assim guardamos o crédito de cada fotógrafo em lib/fotos.ts.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ESCOLHIDAS = [
  {
    slug: "hero",
    id: 8250905,
    largura: 2000,
    alt: "Cadernos de capa kraft e papel quadriculado sobre superfície clara",
  },
  {
    slug: "impressos",
    id: 10897656,
    largura: 1600,
    alt: "Pilhas de impressos tipográficos empilhadas em estúdio",
  },
  {
    slug: "acabamento",
    id: 6620970,
    largura: 1400,
    alt: "Mãos conferindo uma pilha de folhas recém-impressas",
  },
  {
    slug: "tinta",
    id: 6620997,
    largura: 1400,
    alt: "Mão aplicando tinta no rolo de uma impressora",
  },
  {
    slug: "papelaria",
    id: 8250900,
    largura: 1400,
    alt: "Envelopes e cartões de papel kraft dispostos sobre fundo claro",
  },
  {
    slug: "embalagem",
    id: 19363687,
    largura: 1400,
    alt: "Pacote embrulhado em papel kraft e amarrado com barbante",
  },
  {
    slug: "b2b",
    id: 31438304,
    largura: 1600,
    alt: "Caixas de papelão empilhadas com marca aplicada",
  },
  {
    slug: "kraft",
    id: 17260157,
    largura: 1200,
    alt: "Detalhe da textura de uma caixa de papel kraft",
  },
];

const DESTINO = "public/fotos";
if (!existsSync(DESTINO)) mkdirSync(DESTINO, { recursive: true });

const url = (id, w) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const registro = [];

for (const f of ESCOLHIDAS) {
  const destino = join(DESTINO, `${f.slug}.jpg`);
  try {
    const r = await fetch(url(f.id, f.largura));
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const bytes = Buffer.from(await r.arrayBuffer());
    writeFileSync(destino, bytes);
    registro.push(f);
    console.log(`ok   ${f.slug.padEnd(12)} ${(bytes.length / 1024).toFixed(0)} KB`);
  } catch (e) {
    console.log(`erro ${f.slug.padEnd(12)} ${e.message}`);
  }
}

const ts = `/**
 * Fotos do protótipo — geradas por scripts/fotos.mjs, não editar na mão.
 *
 * ⚠️ Banco de imagem (Pexels). Servem para a apresentação; a versão final
 * precisa de foto do material impresso pela própria Full Print.
 */

export type Foto = {
  src: string;
  alt: string;
  /** página da foto no Pexels — de lá sai o crédito, se um dia for exibir */
  fonte: string;
};

export const FOTOS = {
${registro
  .map(
    (f) => `  ${f.slug}: {
    src: "/fotos/${f.slug}.jpg",
    alt: "${f.alt}",
    fonte: "https://www.pexels.com/photo/${f.id}/",
  },`,
  )
  .join("\n")}
} satisfies Record<string, Foto>;

export type NomeFoto = keyof typeof FOTOS;

/** Links das fotos, para montar o crédito se a versão final mantiver banco de imagem. */
export const FONTES = Object.values(FOTOS).map((f) => f.fonte);
`;

writeFileSync("lib/fotos.ts", ts);
console.log(`\n${registro.length} fotos → ${DESTINO} · lib/fotos.ts atualizado`);
