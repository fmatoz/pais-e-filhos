export function whatsappUrl(service, neighborhood = "") {
 const message = "Olá! Vim pelo site da Pais e Filhos. Gostaria de um orçamento para " + String(service).trim() + "." + (String(neighborhood).trim() ? " Meu bairro é " + String(neighborhood).trim().slice(0,100) + "." : "");
 return "https://wa.me/5511967996030?text=" + encodeURIComponent(message);
}
export function nextMidnight(now, timeZone = "America/Sao_Paulo") {
 const formatter = new Intl.DateTimeFormat("en-CA",{timeZone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
 const parts = timestamp => Object.fromEntries(formatter.formatToParts(new Date(timestamp)).filter(part=>part.type!=="literal").map(part=>[part.type,Number(part.value)]));
 const local = parts(now);
 const wallMidnight = Date.UTC(local.year,local.month-1,local.day+1);
 let target = wallMidnight;
 for(let i=0;i<3;i++){
  const p=parts(target);
  const offset=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-target;
  target=wallMidnight-offset;
 }
 return target;
}
export function promotionRemaining(promotion, now = Date.now()) {
 if (!promotion || !promotion.title || !promotion.terms) return null;
 let end;
 if(promotion.mode==="daily") end=nextMidnight(now,promotion.timeZone||"America/Sao_Paulo");
 else {
  if(!promotion.expiresAt || !/(?:Z|[+-]\d{2}:\d{2})$/.test(promotion.expiresAt))return null;
  end=Date.parse(promotion.expiresAt);
 }
 const seconds = Math.ceil((end - now) / 1000);
 if (!Number.isFinite(seconds) || seconds <= 0) return null;
 return {days:Math.floor(seconds/86400),hours:Math.floor(seconds%86400/3600),minutes:Math.floor(seconds%3600/60),seconds:seconds%60};
}
