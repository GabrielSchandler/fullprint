/** Folha de contato a partir de IDs do Pexels, para escolher olhando. */
import { existsSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const GRUPOS = {
  cadernos: [3622342, 8702211, 7718812, 8850766, 335253, 7718825, 7718857, 7718633, 7718861, 1983013, 273034, 10024578, 6373406],
  cadernetas: [32759887, 8489932, 17219305, 1166636, 7657382, 17042547, 7657397, 5712483, 35768598],
  planners: [29509453, 29509452, 29509450, 29509451, 29509506, 29509503, 5706225, 6446318, 29509502, 29509374],
  blocos: [8099581, 8099377, 6192125, 7657602, 6991500, 8947777, 8250901, 8947772, 7319175],
  cartoes: [5706020, 5706018, 9878733, 5706015, 8489955, 8066713, 9878725, 4466448, 8059661],
  adesivos: [19919394, 16605271, 16605272, 30101199, 30101191, 36650027, 30101190, 30101194],
  embalagens: [17260157, 19363687, 595910, 11348488, 17260158, 31438304, 9594423, 12039675],
  acessorios: [7718794, 8250900, 7718715, 7718884, 8489930, 5478183, 6991807],
};

const thumb = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=420&h=300&fit=crop`;

const html = `<!doctype html><meta charset="utf-8">
<style>
  body{margin:0;padding:20px;background:#f6f3ee;font:12px system-ui;color:#1c1b1a}
  h2{font-size:13px;margin:18px 0 8px;text-transform:uppercase;letter-spacing:.08em}
  .g{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}
  figure{margin:0}
  img{width:100%;height:104px;object-fit:cover;border-radius:5px;display:block;background:#ddd}
  figcaption{margin-top:3px;font-size:11px;font-weight:700}
</style>
${Object.entries(GRUPOS)
  .map(
    ([nome, ids]) =>
      `<h2>${nome}</h2><div class="g">${ids
        .map((id) => `<figure><img src="${thumb(id)}"><figcaption>${id}</figcaption></figure>`)
        .join("")}</div>`,
  )
  .join("")}`;

const dir = process.cwd();
writeFileSync(dir + "/contato.html", html);

const CHROMES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const navegador = await puppeteer.launch({
  executablePath: CHROMES.find((p) => existsSync(p)),
  headless: "new",
  args: ["--hide-scrollbars"],
});
const pagina = await navegador.newPage();
await pagina.setViewport({ width: 1500, height: 900 });
await pagina.goto("file://" + (dir + "/contato.html").replace(/\\/g, "/"), {
  waitUntil: "networkidle0",
  timeout: 90000,
});
await pagina.screenshot({ path: dir + "/contato.png", fullPage: true });
await navegador.close();
console.log("ok → contato.png");
