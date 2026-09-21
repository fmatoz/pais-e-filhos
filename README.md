# Pais e Filhos — Montadora e Marcenaria

Landing page responsiva em HTML, CSS e JavaScript, sem dependências de produção.

## Publicar na Vercel
Importe este repositório. O arquivo vercel.json configura:
- Framework: Other
- Build: npm run build
- Output: dist
- Root directory: raiz do repositório

Defina SITE_URL com a URL HTTPS final, sem caminhos (ex.: https://paisfilhosmontadora.com, somente se esse domínio for conectado ao projeto). Sem SITE_URL, o build usa VERCEL_PROJECT_PRODUCTION_URL quando disponível. Previews recebem noindex e robots Disallow. Depois de conectar um domínio próprio, atualize SITE_URL e faça novo deploy. Envie /sitemap.xml ao Google Search Console depois da publicação; isso depende da verificação da propriedade.

## Desenvolvimento e validação
Node 22 ou superior:
```
npm test
npm run build
npm start
```
Preview em http://localhost:4173. Não é preciso instalar pacotes.

## Promoção e contador
A condição diária está configurada em site.config.json: orçamento com possibilidade de até 5% de desconto, conforme serviço e projeto. A interface apresenta o incentivo para pedir orçamento hoje e as condições do desconto; não afirma que o benefício termina definitivamente à meia-noite. O contador usa America/Sao_Paulo e reinicia à meia-noite dessa região, independentemente do fuso do visitante. Confirme com o cliente que o benefício será honrado antes de publicar. Para desativar, defina promotion como null.
Também há suporte a prazo fixo usando expiresAt com data ISO e fuso; nesse modo não há reinício.

## Conteúdo e fontes
- Telefone: +55 11 96799-6030.
- Endereço: Rua Bernardino Antunes, 167, Jardim Soares, São Paulo/SP, 08460-190.
- Nota 5,0 e 243 avaliações: capturas fornecidas pelo cliente em setembro de 2026, sem verificação em tempo real. Trechos sem atribuição nominal pois os nomes não estão legíveis nos recortes. Atualize quando necessário.
- Fotos: fornecidas pelo cliente e tratadas por IA; revisar detalhes antes da publicação. As imagens de painéis mostram o mesmo ambiente. A cozinha é identificada como registro durante a execução.
- Logo: símbolo PF com encaixe reconstruído em SVG a partir da versão aprovada, com nome da empresa em texto no cabeçalho.
- Não foram inventados anos de experiência, garantias, preços, número de projetos ou condições promocionais.
- O endereço é a base da empresa; cobertura por bairro deve ser confirmada no WhatsApp.

## SEO e privacidade
Title e description locais, canonical no build, Open Graph, robots.txt, sitemap.xml e dados estruturados HomeAndConstructionBusiness. Sem marcação de avaliações autorreferentes nem promessa de estrelas no Google. Imagens de galeria com lazy loading e dimensões declaradas. Fontes locais do sistema, navegação por teclado, suporte a movimento reduzido. Nenhum pixel de anúncios ou analytics está instalado. Contato abre o WhatsApp com texto pronto; não há coleta em banco de dados.

As fotos PNG foram preservadas para revisão. Para reduzir o peso do site, podem ser convertidas para WebP/AVIF mantendo a fidelidade e atualizando as referências no HTML, app e SEO.

## Validação
A integração contínua executa testes de links, arquivos, WhatsApp, SEO e expiração do contador, além do build. Verificação visual em celular/desktop deve ser feita no preview da Vercel.

## Experiência e satisfação
A primeira seção apresenta mais de 25 anos de experiência e 99% de satisfação, confirmados pelo responsável pelo site na conversa em 21/09/2026. Esses indicadores são separados da nota 5,0 e das 243 avaliações do Google; não foram calculados a partir delas.
