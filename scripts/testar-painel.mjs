/**
 * Teste funcional do painel — roda contra o servidor de dev.
 *
 *   node scripts/testar-painel.mjs
 *
 * Confere: busca global por atalho, navegação pelo teclado, conteúdo do CSV
 * exportado e o estado vazio de tabela filtrada.
 *
 * Nota: o download em si sempre sai como "canceled" no Chrome headless — há um
 * teste de controle no fim que prova que isso vale até para um blob trivial.
 * Por isso o CSV é conferido lendo o blob que o app gerou, não o arquivo.
 */
import { existsSync, mkdirSync, readdirSync, rmSync, readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";
const CHROMES = ["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","C:/Program Files/Microsoft/Edge/Application/msedge.exe"];
const BAIXAR = process.cwd() + "/.downloads";
rmSync(BAIXAR, { recursive: true, force: true });
mkdirSync(BAIXAR, { recursive: true });

const nav = await puppeteer.launch({ executablePath: CHROMES.find(p=>existsSync(p)), headless: "new", protocolTimeout: 120000 });
const pag = await nav.newPage();
await pag.setViewport({ width: 1440, height: 960 });
const cdp = await nav.target().createCDPSession();
await cdp.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: BAIXAR, eventsEnabled: true });
cdp.on("Browser.downloadWillBegin", (e) => console.log("   [download começou]", e.suggestedFilename));
cdp.on("Browser.downloadProgress", (e) => { if (e.state !== "inProgress") console.log("   [download]", e.state); });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
pag.on("console", (m) => { if (m.type() === "error") console.log("   [erro no browser]", m.text().slice(0, 120)); });

/* 1. busca global por atalho */
await pag.goto("http://localhost:3000/painel", { waitUntil: "networkidle2" });
await espera(1500); /* espera a hidratação: sem React montado não há listener */
await pag.keyboard.down("Control"); await pag.keyboard.press("k"); await pag.keyboard.up("Control");
await espera(400);
await pag.keyboard.type("bauhaus");
await espera(500);
const busca = await pag.evaluate(() => {
  const itens = [...document.querySelectorAll('ul li button')].map((b) => b.textContent?.trim().slice(0, 60));
  return { aberta: !!document.querySelector('input[placeholder*="Pedido, produto"]'), itens: itens.slice(0, 3) };
});
console.log("busca ⌘K aberta:", busca.aberta, "| achados:", busca.itens);
if (!busca.aberta) {
  const abriu = await pag.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent?.includes("Buscar no painel"));
    if (!b) return false; b.click(); return true;
  });
  await espera(400);
  await pag.keyboard.type("bauhaus");
  await espera(500);
  const r = await pag.evaluate(() => [...document.querySelectorAll("ul li button")].map((b) => b.textContent?.trim().slice(0,50)).slice(0,3));
  console.log("   por clique no gatilho:", abriu, "| achados:", r);
}

/* 2. Enter navega */
await pag.keyboard.press("Enter");
await espera(900);
console.log("navegou para:", new URL(pag.url()).pathname);

/* 3. exportação de CSV */
await pag.goto("http://localhost:3000/painel/pedidos", { waitUntil: "load" });
await espera(600);
/* clique de verdade (mouse), não element.click(): o Chrome cancela download
   que não veio de gesto do usuário */
const caixa = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) => x.textContent?.includes("Exportar CSV"));
  if (!b) return null;
  b.scrollIntoView({ block: "center" });
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
let clicou = false;
if (caixa) { await pag.mouse.click(caixa.x, caixa.y); clicou = true; }

/* o headless cancela o download em si; para provar o conteúdo, intercepta a
   âncora e lê o blob que o app gerou */
/* o botao vira "Baixado" por 2s depois do clique; esperar voltar */
await pag.waitForFunction(
  () => [...document.querySelectorAll('button')].some((x) => x.textContent?.includes('Exportar CSV')),
  { timeout: 8000 },
);
const csv = await pag.evaluate(async () => {
  const original = HTMLAnchorElement.prototype.click;
  let href = null;
  HTMLAnchorElement.prototype.click = function () { href = this.href; };
  const b = [...document.querySelectorAll("button")].find((x) => x.textContent?.includes("Exportar CSV"));
  b.click();
  HTMLAnchorElement.prototype.click = original;
  if (!href) return null;
  const texto = await (await fetch(href)).text();
  const CRLF = String.fromCharCode(13) + String.fromCharCode(10);
  const linhas = texto.split(CRLF);
  /* fetch().text() come o BOM (spec do TextDecoder); conferir nos bytes */
  const bytes = new Uint8Array(await (await fetch(href)).arrayBuffer());
  const bom = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  return { bom, cabecalho: linhas[0], primeira: linhas[1], linhas: linhas.length - 1 };
});
if (csv) {
  console.log("   BOM para o Excel:", csv.bom);
  console.log("   cabeçalho:", csv.cabecalho.slice(0, 80));
  console.log("   1a linha :", csv.primeira.slice(0, 80));
  console.log("   linhas de dados:", csv.linhas);
}
await espera(2500);
console.log("   tudo em .downloads:", readdirSync(BAIXAR));
const arquivos = readdirSync(BAIXAR).filter((f) => f.endsWith(".csv"));
console.log("clicou exportar:", clicou, "| arquivo:", arquivos[0] ?? "NENHUM");
if (arquivos[0]) {
  const linhas = readFileSync(BAIXAR + "/" + arquivos[0], "utf8").split("\r\n");
  console.log("   cabeçalho:", linhas[0].slice(0, 70));
  console.log("   1a linha :", linhas[1]?.slice(0, 70));
  console.log("   total de linhas:", linhas.length - 1);
}

/* 4. estado vazio */
await pag.evaluate(() => {
  const i = [...document.querySelectorAll("input")].find((x) => x.placeholder?.includes("Buscar pedido"));
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(i, "zzzznaoexiste");
  i.dispatchEvent(new Event("input", { bubbles: true }));
});
await espera(700);
const vazio = await pag.evaluate(() => document.body.innerText.includes("Nenhum pedido com esses filtros"));
console.log("estado vazio aparece:", vazio);

/* controle: um download de blob trivial funciona neste headless? */
await pag.evaluate(() => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["teste"], { type: "text/plain" }));
  a.download = "controle.txt";
  document.body.appendChild(a);
  a.click();
});
await espera(2000);
console.log("controle (blob simples) baixou:", readdirSync(BAIXAR).includes("controle.txt"));

/* 5. ordenação por coluna */
await pag.goto("http://localhost:3000/painel/pedidos", { waitUntil: "networkidle2" });
await espera(1200);
const antes = await pag.evaluate(() => document.querySelector("tbody tr td")?.textContent?.trim().slice(0, 12));
const clicouCol = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("th button")].find((x) => x.textContent?.includes("Total"));
  if (!b) return false; b.click(); return true;
});
await espera(600);
const depois = await pag.evaluate(() => {
  /* acha a coluna pelo cabeçalho em vez de fixar o índice — quando a coluna
     Arte entrou antes de Total, o índice fixo passou a ler a coluna errada e
     o teste relatava "—" em vez dos valores */
  const cabs = [...document.querySelectorAll("thead th")];
  const i = cabs.findIndex((th) => th.textContent?.includes("Total"));
  return [...document.querySelectorAll("tbody tr")]
    .slice(0, 3)
    .map((tr) => tr.children[i]?.textContent?.trim());
});
console.log("ordenar por Total:", clicouCol, "| 1a linha antes:", antes, "| totais depois:", depois);

await nav.close();
