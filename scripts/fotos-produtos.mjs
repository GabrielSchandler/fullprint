/**
 * Fotos de produto (Pexels) — uma pequena galeria por categoria.
 *
 *   node scripts/fotos-produtos.mjs
 *
 * Cada categoria do catálogo tem um punhado de fotos; o produto pega uma delas
 * por sorteio determinístico a partir do SKU (ver lib/catalogo.ts). Não é foto
 * do produto de verdade — é banco de imagem coerente com a linha, para a
 * apresentação não depender só do mockup vetorial.
 *
 * ⚠️ Antes de publicar, isto vira sessão de foto do material da Full Print.
 *
 * Curadoria: sem marca de terceiro legível, fundo neutro, tom quente de papel.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GALERIAS = {
  cadernos: [7718812, 7718857, 335253, 7718825, 8850766, 6373406],
  cadernetas: [8489932, 7657397, 5712483, 7657382, 35768598],
  planners: [5706225, 6446318, 29509506, 29509503, 29509374],
  blocos: [8099581, 6991500, 8250901, 8947772, 7657602],
  cartoes: [5706020, 9878733, 8489955, 9878725, 4466448],
  adesivos: [30101199, 36650027, 30101190, 19919394],
  embalagens: [17260157, 19363687, 17260158, 9594423, 31438304],
  acessorios: [7718794, 8250900, 7718715, 8489930],
};

const LARGURA = 1100;
const DESTINO = "public/fotos/produtos";
if (!existsSync(DESTINO)) mkdirSync(DESTINO, { recursive: true });

const url = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${LARGURA}`;

const registro = {};
let total = 0;

for (const [categoria, ids] of Object.entries(GALERIAS)) {
  registro[categoria] = [];
  for (const [i, id] of ids.entries()) {
    const nome = `${categoria}-${i + 1}.jpg`;
    try {
      const r = await fetch(url(id));
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const bytes = Buffer.from(await r.arrayBuffer());
      writeFileSync(join(DESTINO, nome), bytes);
      registro[categoria].push({ arquivo: nome, id });
      total += 1;
      console.log(`ok   ${nome.padEnd(18)} ${(bytes.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log(`erro ${nome.padEnd(18)} ${e.message}`);
    }
  }
}

const ts = `/**
 * Galeria de fotos por categoria — gerado por scripts/fotos-produtos.mjs.
 * Não editar na mão.
 *
 * ⚠️ Banco de imagem (Pexels), não é o produto real da Full Print.
 */

import type { CategoriaId } from "./catalogo";

export const GALERIA_PRODUTO: Record<CategoriaId, string[]> = {
${Object.entries(registro)
  .map(
    ([categoria, fotos]) =>
      `  ${categoria}: [${fotos.map((f) => `"/fotos/produtos/${f.arquivo}"`).join(", ")}],`,
  )
  .join("\n")}
};

/** Páginas das fotos no Pexels, para crédito se a versão final mantiver banco. */
export const FONTES_PRODUTO = [
${Object.values(registro)
  .flat()
  .map((f) => `  "https://www.pexels.com/photo/${f.id}/",`)
  .join("\n")}
];
`;

writeFileSync("lib/fotos-produtos.ts", ts);
console.log(`\n${total} fotos → ${DESTINO} · lib/fotos-produtos.ts atualizado`);
