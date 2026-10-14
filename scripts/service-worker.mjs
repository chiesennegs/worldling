import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { basePath } from "./base-path.mjs";
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((f) =>
      f.isDirectory() ? walk(path.join(dir, f.name)) : [path.join(dir, f.name)],
    );
}
const files = walk("dist").filter((f) => !f.endsWith("sw.js"));
const prefix =
  "worldling-" +
  crypto.createHash("sha256").update(basePath).digest("hex").slice(0, 8) +
  "-";
const version = crypto.createHash("sha256");
for (const f of files) version.update(fs.readFileSync(f));
const cache = prefix + version.digest("hex").slice(0, 12);
const urls = files
  .map((f) => basePath + path.relative("dist", f))
  .concat(basePath);
fs.writeFileSync(
  "dist/sw.js",
  `const CACHE=${JSON.stringify(cache)};const PREFIX=${JSON.stringify(prefix)};const BASE=${JSON.stringify(basePath)};const ASSETS=${JSON.stringify(urls)};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(BASE))return;event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request,{ignoreSearch:true});if(cached)return cached;try{return await fetch(event.request)}catch(e){if(event.request.mode==='navigate')return cache.match(BASE+'index.html');throw e}}))});`,
);
console.log(
  `Offline cache: ${cache}, ${urls.length} local assets under ${basePath}`,
);
