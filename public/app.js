import {whatsappUrl,promotionRemaining} from "./logic.js";
document.querySelector("#year").textContent=new Date().getFullYear();
document.querySelectorAll("[data-service]").forEach(link=>{link.href=whatsappUrl(link.dataset.service)});
const dialog=document.querySelector("#lightbox");
let opener=null;
document.querySelectorAll("[data-photo]").forEach(button=>button.addEventListener("click",()=>{
 opener=button;
 document.querySelector("#lightbox-image").src=button.dataset.photo;
 document.querySelector("#lightbox-image").alt=button.dataset.caption;
 document.querySelector("#lightbox-caption").textContent=button.dataset.caption;
 dialog.showModal();
}));
document.querySelector("#close-lightbox").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener("close",()=>{opener?.focus()});
fetch("/promotion.json").then(response=>{if(!response.ok)throw Error("Promotion unavailable");return response.json()}).then(promotion=>{
 const section=document.querySelector("#oferta");
 if(!promotionRemaining(promotion))return;
 document.querySelector("#offer-title").textContent=promotion.title;
 document.querySelector("#offer-terms").textContent=promotion.terms;
 document.querySelector("#offer-date").textContent=promotion.mode==="daily" ? "Horário de São Paulo." : "Válida até "+new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short",timeZone:"America/Sao_Paulo"}).format(new Date(promotion.expiresAt))+" (horário de São Paulo).";
 section.querySelector("a").href=whatsappUrl("a oferta: "+promotion.title);
 let interval;
 function update(){
  const time=promotionRemaining(promotion);
  if(!time){section.hidden=true;clearInterval(interval);return;}
  section.hidden=false;
  const pad=value=>String(value).padStart(2,"0");
  document.querySelector("#countdown").textContent=pad(time.days*24+time.hours)+"h "+pad(time.minutes)+"m "+pad(time.seconds)+"s";
 }
 update();interval=setInterval(update,1000);
}).catch(()=>{});

const carousel=document.querySelector("[data-review-carousel]");
if(carousel){
 const viewport=carousel.querySelector(".review-viewport");
 const track=carousel.querySelector(".review-track");
 const group=carousel.querySelector(".review-group");
 const toggle=carousel.querySelector(".review-toggle");
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
 const duplicate=group.cloneNode(true);
 duplicate.setAttribute("aria-hidden","true");
 duplicate.querySelectorAll("img").forEach(img=>{img.alt="";});
 track.append(duplicate);
 let userPaused=reduced.matches,hovered=false,focused=false,visible=true;
 let previous=0,position=viewport.scrollLeft,scrollPauseUntil=0;
 const label=()=>{toggle.textContent=userPaused?"Retomar movimento":"Pausar movimento";toggle.setAttribute("aria-pressed",String(userPaused));};
 label();
 toggle.addEventListener("click",()=>{userPaused=!userPaused;label();});
 viewport.addEventListener("pointerenter",event=>{if(event.pointerType==="mouse")hovered=true;});
 viewport.addEventListener("pointerleave",()=>{hovered=false;});
 viewport.addEventListener("pointerdown",event=>{
  if(event.pointerType!=="mouse"){userPaused=true;label();}
 });
 viewport.addEventListener("focusin",()=>{focused=true;});
 viewport.addEventListener("focusout",()=>{focused=false;});
 viewport.addEventListener("wheel",()=>{scrollPauseUntil=performance.now()+3000;},{passive:true});
 viewport.addEventListener("keydown",event=>{
  if(["ArrowLeft","ArrowRight","Home","End","PageUp","PageDown"].includes(event.key)){userPaused=true;label();}
 });
 reduced.addEventListener("change",event=>{if(event.matches){userPaused=true;label();}});
 if("IntersectionObserver" in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0}).observe(viewport);
 function animate(now){
  const elapsed=previous?Math.min(now-previous,50):0;previous=now;
  const cycle=group.getBoundingClientRect().width;
  if(userPaused||hovered||focused||!visible||document.hidden||now<scrollPauseUntil){position=viewport.scrollLeft;}
  else if(cycle>0){
   position+=elapsed*.025;
   if(position>=cycle)position%=cycle;
   viewport.scrollLeft=position;
  }
  requestAnimationFrame(animate);
 }
 requestAnimationFrame(animate);
}
