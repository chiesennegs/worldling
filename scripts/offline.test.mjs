import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import { basePath } from "./base-path.mjs";

test("production precache installs local assets and serves app, map, and fonts offline within its deployment scope", async () => {
  const source = readFileSync("dist/sw.js", "utf8");
  const prefix = JSON.parse(source.match(/const PREFIX=("[^"]+")/)[1]);
  const oldCache = prefix + "old";
  const listeners = new Map();
  const stores = new Map([
    [oldCache, new Map()],
    ["worldling-other-project", new Map()],
  ]);
  let online = true;
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (key) => stores.delete(key),
    open: async (key) => {
      if (!stores.has(key)) stores.set(key, new Map());
      const store = stores.get(key);
      return {
        addAll: async (urls) => {
          for (const url of urls) {
            assert.ok(url.startsWith(basePath), url);
            const relative = url.slice(basePath.length) || "index.html";
            const file = "dist/" + relative;
            assert.ok(existsSync(file), file);
            store.set(url, readFileSync(file, "utf8"));
          }
        },
        match: async (request) =>
          store.get(
            typeof request === "string"
              ? request
              : new URL(request.url).pathname,
          ),
      };
    },
  };
  const self = {
    location: { origin: "https://example.github.io" },
    addEventListener: (name, fn) => listeners.set(name, fn),
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  };
  vm.runInNewContext(source, {
    self,
    caches,
    URL,
    fetch: async () => {
      if (!online) throw Error("offline");
      return "network";
    },
  });
  let pending;
  listeners.get("install")({ waitUntil: (p) => (pending = p) });
  await pending;
  listeners.get("activate")({ waitUntil: (p) => (pending = p) });
  await pending;
  assert.ok(!stores.has(oldCache));
  assert.ok(stores.has("worldling-other-project"));
  online = false;
  async function request(path, mode = "cors") {
    let result;
    listeners.get("fetch")({
      request: { method: "GET", url: "https://example.github.io" + path, mode },
      respondWith: (p) => (result = p),
    });
    return result;
  }
  assert.match(await request(basePath + "index.html"), /Worldling/);
  assert.equal(
    JSON.parse(await request(basePath + "data/world.json")).features.length,
    177,
  );
  assert.match(
    await request(basePath + "unvisited-page", "navigate"),
    /Worldling/,
  );
  assert.ok(await request(basePath + "manifest.webmanifest"));
  assert.ok(await request(basePath + "fonts/GveretLevin-Regular.woff2"));
  if (basePath !== "/")
    assert.equal(await request("/another-project/"), undefined);
  const html = readFileSync("dist/index.html", "utf8");
  assert.ok(html.includes(`href="${basePath}manifest.webmanifest"`));
  const cssAsset = html.match(/href="([^"]+\.css)"/)[1];
  const css = readFileSync("dist/" + cssAsset.slice(basePath.length), "utf8");
  assert.ok(css.includes(basePath + "fonts/MarckScript-Regular.woff2"));
  const manifest = JSON.parse(
    readFileSync("dist/manifest.webmanifest", "utf8"),
  );
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.icons[0].src, "icon.svg");
});
