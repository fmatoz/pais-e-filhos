import test from "node:test";
import assert from "node:assert/strict";
import {readFile,access} from "node:fs/promises";
import {whatsappUrl,promotionRemaining} from "../public/logic.js";
import {seo,resolveSiteUrl} from "../scripts/seo.mjs";
test("WhatsApp preserves accented input and uses the correct recipient",()=>{
 const url=new URL(whatsappUrl("Montagem & reparos","São Miguel"));
 assert.equal(url.pathname,"/5511967996030");
 assert.match(url.searchParams.get("text"),/Montagem & reparos/);
 assert.match(url.searchParams.get("text"),/São Miguel/);
});
test("offer expires once and never restarts at midnight",()=>{
 const promo={title:"Oferta real",terms:"Condições acordadas",expiresAt:"2030-01-02T00:00:00-03:00"};
 const deadline=Date.parse(promo.expiresAt);
 assert.deepEqual(promotionRemaining(promo,deadline-1000),{days:0,hours:0,minutes:0,seconds:1});
 assert.equal(promotionRemaining(promo,deadline),null);
 assert.equal(promotionRemaining(promo,deadline+86400000),null);
 assert.equal(promotionRemaining(null),null);
 assert.equal(promotionRemaining({...promo,expiresAt:"2030-01-02T00:00:00"}),null);
});
test("production SEO uses the configured domain and previews stay excluded",()=>{
 const live=seo({siteUrl:"https://paisfilhosmontadora.com"},{VERCEL_ENV:"production"});
 assert.equal(live.indexable,true);assert.match(live.meta,/rel="canonical"/);assert.match(live.sitemap,/https:\/\/paisfilhosmontadora.com\//);
 const preview=seo({siteUrl:"https://paisfilhosmontadora.com"},{VERCEL_ENV:"preview"});
 assert.equal(preview.indexable,false);assert.match(preview.robots,/Disallow: \//);assert.equal(preview.sitemap,null);
 assert.equal(seo({},{}).indexable,false);
 assert.equal(resolveSiteUrl({}, {VERCEL_PROJECT_PRODUCTION_URL:"pais-e-filhos.vercel.app"}),"https://pais-e-filhos.vercel.app");
 assert.throws(()=>resolveSiteUrl({siteUrl:"javascript:alert(1)"}));
 assert.throws(()=>resolveSiteUrl({siteUrl:"https://user:password@example.com"}));
});
test("content has one main heading, working anchors and all referenced local assets",async()=>{
 const html=await readFile(new URL("../public/index.html",import.meta.url),"utf8");
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes('id="'+match[1]+'"'),"Missing anchor "+match[1]);
 for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g))await access(new URL("../public"+match[1],import.meta.url));
 assert.ok(html.includes("5511967996030"));
 assert.ok(!html.includes("lorem ipsum"));
});

test("daily condition resets at Sao Paulo midnight, independent of visitor timezone",()=>{
 const promo={mode:"daily",title:"Condição diária",terms:"Renovada diariamente",timeZone:"America/Sao_Paulo"};
 assert.deepEqual(promotionRemaining(promo,Date.parse("2030-01-01T23:59:59-03:00")),{days:0,hours:0,minutes:0,seconds:1});
 assert.deepEqual(promotionRemaining(promo,Date.parse("2030-01-02T00:00:00-03:00")),{days:1,hours:0,minutes:0,seconds:0});
 assert.equal(promotionRemaining(promo,Date.parse("2030-01-02T02:00:00Z")).hours,1);
});
