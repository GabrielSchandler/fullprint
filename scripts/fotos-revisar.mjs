/** Contato das fotos já baixadas — para revisar corte, marca de terceiro e tom. */
import { existsSync, readdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const arquivos = readdirSync("public/fotos").filter((f) => f.endsWith(".jpg"));
const html = `<!doctype html><meta charset="utf-8">
<style>
 body{margin:0;padding:16px;background:#f6f3ee;font:12px system-ui}
 .g{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
 figure{margin:0}
 img{width:100%;height:230px;object-fit:cover;border-radius:6px;display:block}
 figcaption{margin-top:4px;font-weight:700}
</style>
<div class="g">${arquivos
  .map((f) => `<figure><img src="fotos/${f}"><figcaption>${f.replace(".jpg", "")}</figcaption></figure>`)
  .join("")}</div>`;

const CHROMES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const nav = await puppeteer.launch({
  executablePath: CHROMES.find((p) => existsSync(p)),
  headless: "new",
  protocolTimeout: 120_000,
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1300, height: 900 });
/* setContent roda em about:blank, então o caminho tem que ser absoluto */
await pag.setContent(
  html.replace(/src="fotos\//g, 'src="http://localhost:3000/fotos/'),
  { waitUntil: "networkidle0", timeout: 90_000 },
);
await pag.screenshot({ path: "revisao.png", fullPage: true });
await nav.close();
console.log("ok → revisao.png");
