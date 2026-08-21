/**
 * Varredura de defeito visual e de acessibilidade em todas as rotas.
 *
 *   node scripts/auditar.mjs          # desktop (1440)
 *   node scripts/auditar.mjs 390      # celular
 *
 * Aponta: imagem que deixa vão no cartão (foi assim que apareceu a galeria
 * esticada da página de produto), imagem que falhou, imagem sem alt, rolagem
 * horizontal e botão/link sem rótulo acessível. Precisa do servidor rodando.
 *
 * Falso positivo conhecido: cartão com foto em cima e texto embaixo (as etapas
 * da home) sempre acusa "vão", porque o texto entra na conta do pai.
 */
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROMES = ["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe","C:/Program Files/Microsoft/Edge/Application/msedge.exe"];
const ROTAS = ["/","/produtos","/produto/caderno-bauhaus","/colecao/geometria","/empresas","/checkout","/ajuda","/painel","/painel/pedidos","/painel/produtos","/painel/estoque","/painel/financeiro","/painel/relatorios","/painel/cupons","/painel/clientes","/painel/b2b","/painel/promocoes","/painel/categorias","/painel/configuracoes"];

const nav = await puppeteer.launch({ executablePath: CHROMES.find(p=>existsSync(p)), headless: "new", protocolTimeout: 180000 });
const pag = await nav.newPage();
const largura = Number(process.argv[2] ?? 1440);
await pag.setViewport({ width: largura, height: 900, isMobile: largura < 700 });
console.log("viewport", largura);
await pag.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

for (const rota of ROTAS) {
  await pag.goto("http://localhost:3000" + rota, { waitUntil: "load", timeout: 60000 });
  await pag.evaluate(() => new Promise((r) => { let n=0; const p=()=>{window.scrollBy(0,innerHeight); if(++n<30 && scrollY+innerHeight<document.body.scrollHeight) setTimeout(p,60); else {scrollTo(0,0); setTimeout(r,200);} }; p(); }));

  const achados = await pag.evaluate(() => {
    const saida = [];
    /* imagem menor que o cartão que a segura: sobra fundo, parece quebrado */
    for (const img of document.images) {
      const pai = img.closest("span,div")?.parentElement;
      if (!pai) continue;
      const ri = img.getBoundingClientRect();
      const rp = pai.getBoundingClientRect();
      if (ri.width < 40 || rp.height < 40) continue;
      const sobra = rp.height - ri.height;
      if (sobra > Math.max(80, ri.height * 0.25)) {
        saida.push(`vão de ${Math.round(sobra)}px sob imagem ${Math.round(ri.width)}x${Math.round(ri.height)} · pai ${pai.className.toString().slice(0,50)}`);
      }
      if (!img.alt) saida.push(`imagem sem alt: ${decodeURIComponent(img.src).split("/").pop()?.slice(0,40)}`);
      /* só é falha se terminou de carregar e mesmo assim não tem pixel;
         imagem ainda pendente (lazy que não entrou na viewport) não conta */
      if (img.complete && img.naturalWidth === 0)
        saida.push(`imagem falhou: ${decodeURIComponent(img.currentSrc || img.src).slice(-52)}`);
    }
    /* overflow horizontal: o clássico que só aparece no celular */
    if (document.documentElement.scrollWidth > innerWidth + 2)
      saida.push(`rolagem horizontal: ${document.documentElement.scrollWidth}px > ${innerWidth}px`);
    /* botão/link sem rótulo acessível */
    for (const b of document.querySelectorAll("button,a")) {
      const texto = (b.textContent ?? "").trim();
      if (!texto && !b.getAttribute("aria-label") && !b.querySelector("img[alt]:not([alt=''])"))
        saida.push(`controle sem rótulo: <${b.tagName.toLowerCase()} class="${b.className.toString().slice(0,40)}">`);
    }
    return [...new Set(saida)];
  });

  if (achados.length) {
    console.log(`\n${rota}`);
    for (const a of achados.slice(0, 6)) console.log("   " + a);
  }
}
await nav.close();
console.log("\nvarredura concluída");
