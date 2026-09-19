import {whatsappUrl,promotionRemaining} from "./logic.js";
document.querySelector("#year").textContent=new Date().getFullYear();
document.querySelectorAll("[data-service]").forEach(link=>{link.href=whatsappUrl(link.dataset.service)});
document.querySelector("#quote-form").addEventListener("submit",event=>{
 event.preventDefault();
 window.location.assign(whatsappUrl(document.querySelector("#service").value,document.querySelector("#neighborhood").value));
});
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
 document.querySelector("#offer-date").textContent=promotion.mode==="daily" ? "Condição diária: contador renovado à meia-noite, no horário de São Paulo." : "Válida até "+new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short",timeZone:"America/Sao_Paulo"}).format(new Date(promotion.expiresAt))+" (horário de São Paulo).";
 section.querySelector("a").href=whatsappUrl("a oferta: "+promotion.title);
 let interval;
 function update(){
  const time=promotionRemaining(promotion);
  if(!time){section.hidden=true;clearInterval(interval);return;}
  section.hidden=false;
  const pad=value=>String(value).padStart(2,"0");
  document.querySelector("#countdown").textContent=(time.days?time.days+"d ":"")+pad(time.hours)+"h "+pad(time.minutes)+"m "+pad(time.seconds)+"s";
 }
 update();interval=setInterval(update,1000);
}).catch(()=>{});
