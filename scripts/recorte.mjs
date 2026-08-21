/**
 * Recorte de uma faixa da página, para conferir detalhe de design.
 *
 *   node scripts/recorte.mjs /rota 1200 900     # y inicial e altura
 *   node scripts/recorte.mjs /rota "#id"        # ou um seletor
 *
 * Precisa do servidor rodando.
 */

import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROMES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const [rota = "/", a = "0", b = "900"] = process.argv.slice(2);
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SAIDA = "capturas/recortes";
if (!existsSync(SAIDA)) mkdirSync(SAIDA, { recursive: true });

const navegador = await puppeteer.launch({
  executablePath: CHROMES.find((p) => existsSync(p)),
  headless: "new",
  protocolTimeout: 180_000,
  args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
});
const pagina = await navegador.newPage();
await pagina.setViewport({ width: 1440, height: 960 });
/* o Chrome headless estrangula o requestAnimationFrame e a captura pega os
   contadores no meio da contagem. Emular "menos movimento" faz o site pular
   direto para o estado final — e ainda exercita esse caminho do código. */
await pagina.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);
await pagina.goto(BASE + rota, { waitUntil: "load", timeout: 45000 });
await pagina.evaluate(() => document.fonts.ready);

await pagina.evaluate(
  () =>
    new Promise((resolve) => {
      let y = 0;
      let voltas = 0;
      const passo = () => {
        window.scrollBy(0, window.innerHeight);
        y += window.innerHeight;
        voltas += 1;
        if (y < document.body.scrollHeight && voltas < 40) setTimeout(passo, 90);
        else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 300);
        }
      };
      passo();
    }),
);
await pagina.evaluate(() =>
  Promise.all(
    [...document.images]
      .filter((i) => !i.complete)
      .map(
            (i) =>
              /* imagem que nunca entrou na viewport não dispara evento nenhum:
                 sem o prazo, a espera trava para sempre */
              new Promise((r) => {
                i.onload = i.onerror = r;
                setTimeout(r, 2500);
              }),
          ),
  ),
);

const nome = (rota === "/" ? "home" : rota.slice(1).replace(/\//g, "-")) + `-${a}.png`;
const destino = join(SAIDA, nome);

if (a.startsWith("#") || a.startsWith(".")) {
  const el = await pagina.$(a);
  if (!el) throw new Error(`seletor não encontrado: ${a}`);
  await el.screenshot({ path: destino });
} else {
  const altura = Number(b);
  await pagina.screenshot({
    path: destino,
    clip: { x: 0, y: Number(a), width: 1440, height: altura },
  });
}

await navegador.close();
console.log("ok → " + destino);
