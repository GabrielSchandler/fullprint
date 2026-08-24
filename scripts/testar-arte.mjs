/**
 * Teste funcional do passo "Arte" do checkout.
 * Sobe três arquivos de extensões diferentes e confere o veredito de cada um.
 */
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROMES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const tmp = process.argv[2];
const saida = process.argv[3];
mkdirSync(tmp, { recursive: true });

/* três casos: formato fechado, bitmap de tela e extensão que não entra */
const casos = [
  ["arte-final.pdf", "%PDF-1.7 conteudo falso de teste"],
  ["logo-cliente.png", "PNG falso de teste"],
  ["planilha.xlsx", "nao e arte"],
];
for (const [nome, corpo] of casos) writeFileSync(join(tmp, nome), corpo);

const nav = await puppeteer.launch({
  executablePath: CHROMES.find((p) => existsSync(p)),
  headless: "new",
  protocolTimeout: 120000,
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1440, height: 1200 });
await pag.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

await pag.goto("http://localhost:3000/checkout", { waitUntil: "load", timeout: 60000 });

/* o carrinho vem do localStorage, então o checkout monta só depois da
   hidratação — sem esperar, o botão Continuar ainda não existe */
await pag.waitForFunction(
  () =>
    [...document.querySelectorAll("button")].some((x) =>
      x.textContent.trim().startsWith("Continuar"),
    ),
  { timeout: 30000 },
);

/* `.spec` aplica text-transform: uppercase, então innerText devolve o rótulo
   em caixa alta e a comparação literal falhava. Normaliza os dois lados. */
const texto = async () =>
  (await pag.evaluate(() => document.body.innerText)).toLowerCase();
const tem = (t, s) => t.includes(s.toLowerCase());

/* passo 0 -> 1 */
await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    x.textContent.trim().startsWith("Continuar"),
  );
  b.click();
});
await new Promise((r) => setTimeout(r, 600));

const t1 = await texto();
console.log("passo Arte visivel:", tem(t1, "A arte da sua peça"));
console.log("especificacao visivel:", tem(t1, "Como o arquivo tem que sair"));

/* sobe os tres arquivos */
const input = await pag.$('input[type="file"]');
await input.uploadFile(...casos.map(([n]) => join(tmp, n)));
await new Promise((r) => setTimeout(r, 600));

const t2 = await texto();
for (const [nome] of casos) console.log("listado", nome + ":", tem(t2, nome));
console.log("veredito OK:", tem(t2, "Pronto para impressão"));
console.log("veredito ressalva:", tem(t2, "Serve, com ressalva"));
console.log("veredito recusado:", tem(t2, "Não serve"));
console.log("contagem:", /(\d) de (\d) arquivos seguem/.exec(t2)?.[0] ?? "NAO ACHOU");

/* alterna para o caminho de criacao */
await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    x.textContent.includes("Quero que a Full Print crie"),
  );
  b.click();
});
await new Promise((r) => setTimeout(r, 400));
const t3 = await texto();
console.log("briefing aparece:", tem(t3, "O que você precisa"));
console.log("upload some:", !tem(t3, "Arraste o arquivo aqui"));

/* volta e confere que o passo seguinte ainda e Entrega */
await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    x.textContent.includes("Já tenho a arte pronta"),
  );
  b.click();
});
await new Promise((r) => setTimeout(r, 300));
await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    x.textContent.trim().startsWith("Continuar"),
  );
  b.click();
});
await new Promise((r) => setTimeout(r, 600));
const t4 = await texto();
console.log("passo seguinte e Entrega:", tem(t4, "Onde entregar"));

/* rolagem horizontal na pagina do passo Arte */
await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    x.textContent.trim() === "Voltar",
  );
  b.click();
});
await new Promise((r) => setTimeout(r, 400));
const rola = await pag.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 2,
);
console.log("rolagem horizontal:", rola);

/* o que já foi enviado tem que continuar lá depois de ir e voltar de passo */
const t5 = await texto();
console.log(
  "arquivos sobrevivem ao ir e voltar:",
  casos.every(([n]) => tem(t5, n)),
);

await pag.screenshot({ path: saida, fullPage: false });
await nav.close();
console.log("print em", saida);
