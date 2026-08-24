/**
 * Teste funcional da aba "Minha apresentação".
 *
 *   node scripts/testar-apresentacao.mjs
 *
 * Confere: as sete seções, os valores dos três pacotes, o selo de
 * recomendado, o modo apresentação (que precisa esconder o menu do painel),
 * o modal de seleção e a ausência de rolagem horizontal no celular.
 *
 * Precisa do servidor rodando em http://localhost:3000.
 */
import { existsSync, readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROMES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const URL = "http://localhost:3000/painel/apresentacao";
let falhas = 0;

const ok = (nome, valor) => {
  if (!valor) falhas++;
  console.log(`${valor ? "  ok  " : " FALHA"}  ${nome}`);
};

const nav = await puppeteer.launch({
  executablePath: CHROMES.find((p) => existsSync(p)),
  headless: "new",
  protocolTimeout: 120000,
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1440, height: 1000 });
await pag.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
pag.on("console", (m) => {
  if (m.type() === "error") console.log("   [erro no browser]", m.text().slice(0, 140));
});

await pag.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await espera(800);

/* `.spec` aplica uppercase, então tudo é comparado em caixa baixa */
const texto = async () => (await pag.evaluate(() => document.body.innerText)).toLowerCase();
const tem = (t, s) => t.includes(s.toLowerCase());

const t = await texto();

console.log("\n— conteúdo —");
ok("título de abertura", tem(t, "Full Print no digital"));
ok("subtítulo", tem(t, "Uma estrutura completa para vender produtos personalizados"));
ok("B2C descrito", tem(t, "Venda direta ao consumidor"));
ok("B2B descrito", tem(t, "Atendimento a empresas"));
ok("seção visão", tem(t, "O que entra na operação"));
ok("cadastro pela Full Print", tem(t, "realizado pela própria Full Print"));
ok("seção pacotes", tem(t, "Três formas de começar"));
ok("seção comparativo", tem(t, "Lado a lado"));
ok("seção mensalidade", tem(t, "O que a mensalidade cobre"));
ok("seção condições", tem(t, "Como funciona o acordo"));
ok("encerramento", tem(t, "Prontos para transformar a experiência da Full Print"));

console.log("\n— valores —");
ok("Inicial R$ 2.000", tem(t, "R$ 2.000"));
ok("Intermediário R$ 3.500", tem(t, "R$ 3.500"));
ok("Completo R$ 5.000", tem(t, "R$ 5.000"));
ok("mensalidade R$ 150", tem(t, "R$ 150"));
ok("mensalidade R$ 250", tem(t, "R$ 250"));
ok("mensalidade R$ 400", tem(t, "R$ 400"));
ok("selo Recomendado", tem(t, "Recomendado"));

/* O requisito proíbe dado fictício de venda/cliente nesta página. Procurar por
   palavra dava falso positivo — "Ticket médio" aparece como NOME de um recurso
   do Pacote Intermediário, não como número inventado. A checagem que vale é na
   origem: se a página não importa os dados do painel, não há como exibi-los. */
console.log("\n— sem dado fictício de operação —");
const fontes = [
  readFileSync("app/painel/apresentacao/page.tsx", "utf8"),
  readFileSync("lib/apresentacao.ts", "utf8"),
];
const proibidos = /from "@\/lib\/(painel-dados|producao|catalogo)"/;
ok(
  "não importa dados de operação (painel-dados / producao / catalogo)",
  fontes.every((f) => !proibidos.test(f)),
);

console.log("\n— comparativo —");
const comparativo = await pag.evaluate(() => {
  const linhas = [...document.querySelectorAll("table tbody tr")];
  return linhas.map((tr) => [...tr.children].map((td) => td.textContent.trim()));
});
ok("tabela tem 8 linhas", comparativo.length === 8);
ok("4 colunas por linha", comparativo.every((l) => l.length === 4));
ok(
  "linha de implantação com os 3 valores",
  comparativo.some(
    (l) => l[0] === "Implantação" && l[1].includes("2.000") && l[3].includes("5.000"),
  ),
);
ok(
  "traço nas células vazias",
  comparativo.some((l) => l.includes("—")),
);

console.log("\n— modal de seleção —");
await pag.evaluate(() => {
  [...document.querySelectorAll("button")]
    .find((b) => b.textContent.includes("Escolher pacote"))
    .click();
});
await espera(500);
ok("modal abriu", await pag.$('[role="dialog"]') !== null);

await pag.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"]');
  [...dlg.querySelectorAll("button")]
    .filter((b) => b.textContent.includes("Escolher este"))[1]
    .click();
});
await espera(400);
const tModal = await texto();
ok("seleção registrada no rodapé", tem(tModal, "Selecionado: Pacote Intermediário"));

await pag.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"]');
  [...dlg.querySelectorAll("button")].find((b) => b.textContent.includes("Concluir")).click();
});
await espera(400);
ok("modal fechou", (await pag.$('[role="dialog"]')) === null);
ok("escolha aparece no encerramento", tem(await texto(), "Pacote selecionado: Pacote Intermediário"));

console.log("\n— modo apresentação —");
const menuAntes = await pag.evaluate(
  () => !!document.querySelector("aside a[href='/painel/produtos']"),
);
ok("menu do painel visível antes", menuAntes);

await pag.evaluate(() => {
  [...document.querySelectorAll("button")]
    .find((b) => b.textContent.includes("Modo apresentação"))
    .click();
});
await espera(700);

const naApresentacao = await pag.evaluate(() => {
  const overlay = document.querySelector(".fixed.inset-0.z-\\[100\\]");
  if (!overlay) return { overlay: false };
  const menu = document.querySelector("aside a[href='/painel/produtos']");
  /* o menu segue no DOM, mas precisa estar coberto pelo overlay */
  const coberto = !menu || overlay.getBoundingClientRect().width >= window.innerWidth;
  return { overlay: true, coberto, temSair: overlay.textContent.includes("Sair da apresentação") };
});
ok("overlay de tela cheia abriu", naApresentacao.overlay);
ok("cobre a interface do painel", naApresentacao.coberto);
ok("tem botão de sair", naApresentacao.temSair);
ok("conteúdo continua na tela", tem(await texto(), "Full Print no digital"));

await pag.keyboard.press("Escape");
await espera(500);
ok("ESC saiu da apresentação", (await pag.$(".fixed.inset-0.z-\\[100\\]")) === null);

console.log("\n— responsivo —");
for (const largura of [1440, 768, 390]) {
  await pag.setViewport({ width: largura, height: 900, isMobile: largura < 700 });
  await espera(500);
  const rola = await pag.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  );
  ok(`sem rolagem horizontal em ${largura}px`, !rola);
}

console.log("\n— impressão —");
await pag.setViewport({ width: 1440, height: 1000 });
await pag.emulateMediaType("print");
await espera(400);
const naImpressao = await pag.evaluate(() => {
  /* getClientRects fica vazio quando o próprio elemento OU qualquer ancestral
     está com display:none. getComputedStyle do filho ainda devolveria "flex" e
     dava falso positivo no botão dentro da barra já escondida. */
  const vis = (el) => !!el && el.getClientRects().length > 0;
  return {
    menu: vis(document.querySelector("aside")),
    cabecalho: vis(document.querySelector("header")),
    botaoImprimir: [...document.querySelectorAll("button")].some(
      (b) => b.textContent.includes("Imprimir") && vis(b),
    ),
    revelarOpaco: [...document.querySelectorAll(".revelar")].every(
      (e) => getComputedStyle(e).opacity === "1",
    ),
    conteudo: document.body.innerText.includes("Pacote Inicial"),
  };
});
ok("menu lateral oculto", !naImpressao.menu);
ok("cabeçalho oculto", !naImpressao.cabecalho);
ok("botões de ação ocultos", !naImpressao.botaoImprimir);
ok("seções reveladas (não saem em branco)", naImpressao.revelarOpaco);
ok("conteúdo da proposta presente", naImpressao.conteudo);

await nav.close();
console.log(falhas === 0 ? "\nTUDO OK" : `\n${falhas} FALHA(S)`);
process.exit(falhas === 0 ? 0 : 1);
