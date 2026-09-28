import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {readFileSync} from "node:fs";
const code=readFileSync(new URL("../public/conversion.js",import.meta.url),"utf8");
function fixture(mode="available"){
 const events=[],handlers={},navigations=[],timers=[];
 const window={location:{assign:url=>navigations.push(url)}};
 if(mode==="available")window.gtag=(...args)=>events.push(args);
 if(mode==="throws")window.gtag=()=>{throw Error("blocked");};
 const context={window,URL,document:{addEventListener:(name,fn)=>handlers[name]=fn},setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout:()=>{}};
 vm.runInNewContext(code,context);
 function click(href="https://wa.me/5511967996030?text=teste",target="_blank",type="click",button=0){
  let prevented=false;const link={href,target};
  handlers[type]({type,button,defaultPrevented:false,target:{closest:()=>link},preventDefault:()=>{prevented=true;}});
  return prevented;
 }
 return{events,navigations,timers,click};
}
test("WhatsApp conversion fires only on click and keeps new-tab navigation",()=>{
 const f=fixture();assert.equal(f.events.length,0);
 assert.equal(f.click(),false);assert.equal(f.events.length,1);
 const [kind,name,payload]=f.events[0];assert.equal(kind,"event");assert.equal(name,"conversion");
 assert.equal(payload.send_to,"AW-1005276118/937TCL6nuokdENaXrd8D");assert.equal(payload.value,1);assert.equal(payload.currency,"BRL");
 payload.event_callback();assert.equal(f.navigations.length,0);
 f.click("https://www.google.com/maps");f.click("tel:+5511967996030");assert.equal(f.events.length,1);
});
test("same-tab fallback opens WhatsApp exactly once if tracking never responds",()=>{
 const f=fixture();assert.equal(f.click("https://wa.me/5511967996030",""),true);
 f.timers[0]();f.events[0][2].event_callback();assert.equal(f.navigations.length,1);
});
test("blocked or missing Google tag does not prevent WhatsApp navigation",()=>{
 for(const mode of ["missing","throws"]){const f=fixture(mode);assert.equal(f.click(),false);f.click("https://wa.me/5511967996030","");assert.equal(f.navigations.length,1);}
});
test("middle-click tracks once; right-click does not count",()=>{
 const f=fixture();f.click(undefined,undefined,"auxclick",1);assert.equal(f.events.length,1);f.click(undefined,undefined,"auxclick",2);assert.equal(f.events.length,1);
});
