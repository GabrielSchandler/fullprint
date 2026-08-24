/**
 * Captura de tela das páginas do protótipo.
 *
 * Usa o Chrome já instalado na máquina (puppeteer-core, sem baixar browser).
 * Serve para conferir o visual sem abrir o navegador na mão e para gerar
 * imagem de apresentação.
 *
 *   node scripts/capturar.mjs                  # todas as rotas, desktop
 *   node scripts/capturar.mjs --mobile         # 390px
 *   node scripts/capturar.mjs /produtos /painel
 *
 * Precisa do servidor rodando: npm run dev  (ou npm start após o build)
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

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SAIDA = process.env.SAIDA ?? "capturas";

const ROTAS_PADRAO = [
  "/",
  "/produtos",
  "/produto/caderno-bauhaus",
  "/colecao/geometria",
  "/empresas",
  "/checkout",
  "/painel",
  "/painel/pedidos",
  "/painel/producao",
  "/painel/produtos",
  "/painel/estoque",
  "/painel/financeiro",
  "/painel/relatorios",
  "/painel/cupons",
  "/painel/clientes",
  "/painel/b2b",
  "/painel/promocoes",
  "/painel/categorias",
  "/painel/apresentacao",
  "/painel/configuracoes",
];

const args = process.argv.slice(2);
const mobile = args.includes("--mobile");
const inteira = !args.includes("--dobra");
const rotas = args.filter((a) => a.startsWith("/"));
const alvos = rotas.length ? rotas : ROTAS_PADRAO;

const executablePath = CHROMES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("Chrome/Edge não encontrado. Ajuste a lista CHROMES.");
  process.exit(1);
}

if (!existsSync(SAIDA)) mkdirSync(SAIDA, { recursive: true });

const navegador = await puppeteer.launch({
  executablePath,
  headless: "new",
  protocolTimeout: 180_000,
  args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
});

const pagina = await navegador.newPage();
await pagina.setViewport(
  mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true }
    : { width: 1440, height: 960, deviceScaleFactor: 1 },
);
/* o Chrome headless estrangula o requestAnimationFrame e a captura pega os
   contadores no meio da contagem. Emular "menos movimento" faz o site pular
   direto para o estado final — e ainda exercita esse caminho do código. */
await pagina.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);

for (const rota of alvos) {
  const nome =
    (rota === "/" ? "home" : rota.slice(1).replace(/\//g, "-")) +
    (mobile ? "-mobile" : "") +
    ".png";
  try {
    /* "load" e não "networkidle": o prefetch de rota do Next mantém a rede
       ocupada e o networkidle nunca fecha nas páginas com muitos links */
    await pagina.goto(BASE + rota, { waitUntil: "load", timeout: 45000 });
    await pagina.evaluate(() => document.fonts.ready);

    /* rola a página inteira: as fotos usam lazy loading e sem passar por elas
       a captura sai com buraco cinza no lugar da imagem */
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
              setTimeout(resolve, 250);
            }
          };
          passo();
        }),
    );

    /* espera o que ainda estiver baixando */
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

    await new Promise((r) => setTimeout(r, 900));
    await pagina.screenshot({ path: join(SAIDA, nome), fullPage: inteira });
    console.log("ok   " + rota + "  →  " + join(SAIDA, nome));
  } catch (e) {
    console.log("erro " + rota + "  →  " + e.message);
  }
}

await navegador.close();
