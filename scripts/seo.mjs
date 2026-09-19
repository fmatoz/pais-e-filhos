export function escapeHtml(value) {return String(value).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");}
export function resolveSiteUrl(config, env={}) {
 const candidate=env.SITE_URL || config.siteUrl || (env.VERCEL_PROJECT_PRODUCTION_URL ? "https://"+env.VERCEL_PROJECT_PRODUCTION_URL : "");
 if(!candidate)return "";
 const url=new URL(candidate);
 if(url.protocol!=="https:" || url.username || url.password || url.search || url.hash || (url.pathname!=="/"&&url.pathname!==""))throw new Error("SITE_URL must be a public HTTPS origin without credentials, path, query or hash.");
 return url.origin;
}
export function seo(config, env={}) {
 const url=resolveSiteUrl(config,env);
 const indexable=Boolean(url)&&env.VERCEL_ENV!=="preview"&&env.VERCEL_ENV!=="development";
 const image=url ? url+"/assets/ambiente.png" : "";
 const meta=['<meta name="robots" content="'+(indexable?"index,follow,max-image-preview:large":"noindex,nofollow")+'">','<meta property="og:type" content="website">','<meta property="og:locale" content="pt_BR">','<meta property="og:site_name" content="Pais e Filhos — Montadora e Marcenaria">','<meta property="og:title" content="Seu móvel bem montado. Seu ambiente feito para você.">','<meta property="og:description" content="Montagem de móveis e marcenaria em São Paulo. Conheça nossos trabalhos e solicite seu orçamento.">','<meta name="twitter:card" content="summary_large_image">'];
 if(url)meta.push('<link rel="canonical" href="'+escapeHtml(url)+'/">','<meta property="og:url" content="'+escapeHtml(url)+'/">','<meta property="og:image" content="'+escapeHtml(image)+'">','<meta property="og:image:alt" content="Ambiente com painéis de madeira apresentado pela Pais e Filhos">');
 const data={"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"Pais e Filhos — Montadora e Marcenaria",telephone:"+5511967996030",description:"Montagem de móveis e marcenaria em São Paulo.",address:{"@type":"PostalAddress",streetAddress:"Rua Bernardino Antunes, 167, Jardim Soares",addressLocality:"São Paulo",addressRegion:"SP",postalCode:"08460-190",addressCountry:"BR"}};
 if(url){data.url=url+"/";data.image=image;data.logo=url+"/assets/logo.svg";}
 return {url,indexable,meta:meta.join("\n"),structured:'<script type="application/ld+json">'+JSON.stringify(data).replaceAll("<","\\u003c")+'</script>',robots:"User-agent: *\n"+(indexable?"Allow: /\nSitemap: "+url+"/sitemap.xml\n":"Disallow: /\n"),sitemap:indexable?'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+escapeHtml(url)+'/</loc></url></urlset>':null};
}
