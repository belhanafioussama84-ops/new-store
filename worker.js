/* Cloudflare Worker: only /api/* and the short links /sv/<id> etc. come here (see wrangler.jsonc),
   every other file is served as-is.

   POST /api/order  The site sends the order here. The customer gets an answer at once, and the
                    order goes on to the Google Sheet in the background, with the visitor's IP
                    (only Cloudflare can see it) for the Meta Conversions API in orders.gs.
   GET  /api/order  Health check: says whether Google accepts requests from this Worker. It sends
                    a text that isn't an order, so nothing is written and nothing goes to Meta. */

// Same address as STORE.ordersUrl in js/products.js: change both together.
const ORDERS_URL = "https://script.google.com/macros/s/AKfycbxrx2C83Ns29ULrZWcvHh2EgiJTBEjTDvsinnvz81WAV8ODzpkwsm_Z6V1An7w54lEiRQ/exec";
const MAX_ORDER_SIZE = 20000;

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

const postToSheet = (body, redirect) => fetch(ORDERS_URL, {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body,
  redirect,
});

// Apps Script saves the order, then answers with a redirect to its reply: a 302 means it ran, so
// the redirect is not followed. One more try only when Google failed (never after a 302 or a 4xx,
// which could write the order twice).
async function forward(body) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await postToSheet(body, "manual");
      if (res.status < 400) return;
      console.error(`Order not saved: Google answered ${res.status}`);
      if (res.status < 500) return;
    } catch (err) {
      console.error(`Order not saved: ${err}`);
    }
  }
}

async function healthCheck() {
  const res = await postToSheet("health-check", "follow");
  const text = await res.text();
  return json({ google: res.status, reachedScript: text.includes('"ok":false') });
}

// Short ad link: /sv/creatina-mujer = /product?id=creatina-mujer&country=sv. Served at once (200,
// never a redirect: a redirect broke Meta tracking). The page's first script switches to the full
// address while the page's code reads it, then shows the short one again once the page is built.
// fbclid etc. are kept. Files the page asks for from there (/sv/images/…, /sv/thank-you?…) are
// served from the site root (shortFile).
async function shortLink(request, env, url, cc, id) {
  const full = new URLSearchParams({ id, country: cc });
  url.searchParams.forEach((v, k) => { if (k !== "id" && k !== "country") full.append(k, v); });
  const long = JSON.stringify(`/product?${full}${url.hash}`);
  const short = JSON.stringify(url.pathname + url.search);
  const page = await env.ASSETS.fetch(new Request(new URL("/product", url), request));
  return withPreview(env, url, id, cc, new HTMLRewriter().on("head", {
    element(el) {
      el.prepend(`<script>history.replaceState(null,"",${long});addEventListener("DOMContentLoaded",function(){history.replaceState(null,"",${short}+location.hash)})</script>`, { html: true });
    },
  }).transform(page));
}

// Link preview (WhatsApp, Facebook…): these apps don't run the page's code, they only read the
// <title> and <meta> tags. product.html has a general text, so each product link gets here its own
// name, text and photo from js/products.js — never the name of another country.
const PREVIEW_TEXT = {
  sv: "Envío gratis · Pagas al recibir",
  tz: "Free delivery · Pay on delivery",
  zm: "Free delivery · Pay on delivery",
  lb: "Free delivery · Pay on delivery",
};
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
async function productInfo(env, url, id, cc) {
  const res = await env.ASSETS.fetch(new Request(new URL("/js/products.js", url)));
  const code = await res.text();
  const start = code.indexOf(`\n    id: "${id}",`);
  if (start < 0) return null;
  const next = code.indexOf('\n    id: "', start + 5);
  const block = code.slice(start, next < 0 ? undefined : next);
  // Product's own fields only (4 spaces in): not the names inside its offers or sections.
  const field = (k) => block.match(new RegExp(`\\n    ${k}: "((?:[^"\\\\]|\\\\.)*)"`))?.[1]?.replace(/\\(.)/g, "$1");
  // The country's own name, e.g. sv: { name: "Corrector de Postura" }
  const local = cc && block.match(new RegExp(`\\n    ${cc}: \\{[^\\n]*?name: "((?:[^"\\\\]|\\\\.)*)"`))?.[1]?.replace(/\\(.)/g, "$1");
  return { name: local || field("name"), description: field("description"), image: field("image") };
}
async function withPreview(env, url, id, cc, page) {
  let info = null;
  try { info = await productInfo(env, url, id, cc); } catch {}
  if (!info?.name) return page;
  const title = `${info.name} · ${PREVIEW_TEXT[cc] || PREVIEW_TEXT.tz}`;
  const text = info.description || PREVIEW_TEXT[cc] || PREVIEW_TEXT.tz;
  const image = info.image ? new URL(`/${info.image}`, url).href : "";
  const tags = `<meta property="og:type" content="product" /><meta property="og:site_name" content="Duka Bora" />`
    + `<meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(text)}" />`
    + `<meta property="og:url" content="${esc(url.origin + url.pathname + url.search)}" />`
    + (image ? `<meta property="og:image" content="${esc(image)}" /><meta name="twitter:card" content="summary_large_image" />` : "");
  return new HTMLRewriter()
    .on("title", { element(el) { el.setInnerContent(title); } })
    .on('meta[name="description"]', { element(el) { el.setAttribute("content", text); } })
    .on("head", { element(el) { el.append(tags, { html: true }); } })
    .transform(page);
}
const shortFile = (request, env, url, rest) => env.ASSETS.fetch(new Request(new URL(`/${rest}${url.search}`, url), request));
const PAGES = ["index", "product", "thank-you", "policies"];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cc = url.pathname.match(/^\/(tz|zm|lb|sv)(?:\/(.*))?$/);
    if (cc) {
      const rest = cc[2] || "";
      if (!rest) return Response.redirect(`${url.origin}/?country=${cc[1]}`, 302);
      const id = rest.replace(/\/$/, "");
      if (/^[a-z0-9-]+$/.test(id) && !PAGES.includes(id)) return shortLink(request, env, url, cc[1], id);
      return shortFile(request, env, url, rest);
    }
    // Full product links (product?id=..&country=..) get the same link preview as the short ones.
    if (url.pathname === "/product") {
      const page = await env.ASSETS.fetch(request);
      const id = url.searchParams.get("id");
      if (!id || !page.ok || !(page.headers.get("Content-Type") || "").includes("text/html")) return page;
      return withPreview(env, url, id, url.searchParams.get("country") || "", page);
    }
    if (url.pathname !== "/api/order") return json({ ok: false, error: "not found" }, 404);
    if (request.method === "GET") return healthCheck();
    if (request.method !== "POST") return json({ ok: false, error: "method not allowed" }, 405);

    const text = await request.text();
    if (text.length > MAX_ORDER_SIZE) return json({ ok: false, error: "too large" }, 413);
    let order;
    try { order = JSON.parse(text); } catch { return json({ ok: false, error: "invalid" }, 400); }
    // { upsell: order } = an order changed on the thank-you page (upsell_ in orders.gs)
    const o = order?.upsell || order;
    if (!o?.number || !o.customer || !o.product) return json({ ok: false, error: "invalid" }, 400);

    // Always Cloudflare's value, never one sent by the browser.
    o.meta = { ...o.meta, ip: request.headers.get("CF-Connecting-IP") || undefined };
    ctx.waitUntil(forward(JSON.stringify(order)));
    return json({ ok: true });
  },
};
