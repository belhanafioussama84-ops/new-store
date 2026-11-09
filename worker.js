/* Cloudflare Worker: only /api/* comes here (see wrangler.jsonc), every other file is served as-is.

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

export default {
  async fetch(request, env, ctx) {
    if (new URL(request.url).pathname !== "/api/order") return json({ ok: false, error: "not found" }, 404);
    if (request.method === "GET") return healthCheck();
    if (request.method !== "POST") return json({ ok: false, error: "method not allowed" }, 405);

    const text = await request.text();
    if (text.length > MAX_ORDER_SIZE) return json({ ok: false, error: "too large" }, 413);
    let order;
    try { order = JSON.parse(text); } catch { return json({ ok: false, error: "invalid" }, 400); }
    if (!order?.number || !order.customer || !order.product) return json({ ok: false, error: "invalid" }, 400);

    // Always Cloudflare's value, never one sent by the browser.
    order.meta = { ...order.meta, ip: request.headers.get("CF-Connecting-IP") || undefined };
    ctx.waitUntil(forward(JSON.stringify(order)));
    return json({ ok: true });
  },
};
