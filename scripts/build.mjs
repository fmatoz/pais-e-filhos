import {readFile,writeFile,mkdir,cp,rm} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {seo} from "./seo.mjs";
const root=fileURLToPath(new URL("../",import.meta.url));
const config=JSON.parse(await readFile(path.join(root,"site.config.json"),"utf8"));
const output=path.join(root,"dist");
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(path.join(root,"public"),output,{recursive:true});
const result=seo(config,process.env);
let html=await readFile(path.join(output,"index.html"),"utf8");
html=html.replace("<!-- SEO_META -->",result.meta).replace("<!-- STRUCTURED_DATA -->",result.structured);
await writeFile(path.join(output,"index.html"),html);
await writeFile(path.join(output,"robots.txt"),result.robots);
if(result.sitemap)await writeFile(path.join(output,"sitemap.xml"),result.sitemap);
const promo=config.promotion;
if(promo){
 if(!promo.title||!promo.terms)throw Error("Promotion needs title and terms.");
 if(promo.mode==="daily")new Intl.DateTimeFormat("pt-BR",{timeZone:promo.timeZone||"America/Sao_Paulo"});
 else if(!promo.expiresAt||!/(?:Z|[+-]\d{2}:\d{2})$/.test(promo.expiresAt)||!Number.isFinite(Date.parse(promo.expiresAt)))throw Error("Fixed promotion needs ISO expiresAt with timezone.");
}
await writeFile(path.join(output,"promotion.json"),JSON.stringify(promo??null));
console.log("Build complete. SEO: "+(result.indexable?result.url:"noindex — configure SITE_URL for production"));
