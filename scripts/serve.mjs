import http from "node:http";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../dist/",import.meta.url));
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".txt":"text/plain; charset=utf-8",".xml":"application/xml"};
http.createServer(async(req,res)=>{
 try {
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const target=path.resolve(root,"."+pathname+(pathname.endsWith("/")?"index.html":""));
  if(!target.startsWith(root)){res.writeHead(403);res.end();return;}
  const content=await readFile(target);
  res.writeHead(200,{"Content-Type":mime[path.extname(target)]||"application/octet-stream"});res.end(content);
 }catch{res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});res.end("Página não encontrada.");}
}).listen(Number(process.env.PORT)||4173,"127.0.0.1",()=>console.log("Preview: http://localhost:"+(process.env.PORT||4173)));
