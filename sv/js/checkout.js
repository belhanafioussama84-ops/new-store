/* Checkout — cash on delivery. The order is sent to the Google Sheet (CONFIG.ordersUrl) and the
   thank-you page opens ONLY when the sheet answers {"ok": true}. */
(() => {
  "use strict";
  const { $, esc, money, icon, storage, cart, Pixel, lineHtml, totalsHtml } = Shop;
  const S = CONFIG.shipping;
  const form = $("#orderForm");
  const DRAFT_KEY = "sv_customer";

  $("#badges").innerHTML = [
    ["cash", "Pago contra entrega"],
    ["truck", S.nationwide ? "Envío disponible en todo El Salvador" : "Envío disponible en El Salvador"],
    ["phone", "Confirmación telefónica del pedido"],
  ].map(([ic, t]) => `<span>${icon(ic)}${esc(t)}</span>`).join("");
  $("#payIco").innerHTML = icon("cash");
  $("#departamento").insertAdjacentHTML("beforeend", CONFIG.departamentos.map((d) => `<option>${esc(d)}</option>`).join(""));

  // Order number: the same one while the customer retries, so a retry can't look like a new order
  const NUM_KEY = "sv_pending_number";
  let number = sessionStorage.getItem(NUM_KEY);
  if (!number) {
    number = "SV" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);
    try { sessionStorage.setItem(NUM_KEY, number); } catch { /* private mode */ }
  }

  /* ---------- Summary (quantities editable here) ---------- */
  function render() {
    const s = cart.summary();
    const empty = !s.lines.length;
    $("#coGrid").hidden = empty;
    $("#emptyCart").hidden = !empty;
    if (empty) return;
    $("#lines").innerHTML = s.lines.map((l) => lineHtml(l)).join("");
    $("#totals").innerHTML = totalsHtml(s);
    $("#submitBtn").textContent = `CONFIRMAR MI PEDIDO · ${money(s.total)}`;
    $("#fine").innerHTML = `${icon("lock")} Total a pagar al recibir: <strong>${money(s.total)} ${CONFIG.currency}</strong>. No pagas nada ahora.`;
  }
  $(".co__summary").addEventListener("click", (e) => {
    const b = e.target.closest("[data-qty]");
    if (b) { const it = cart.items().find((i) => cart.key(i.id, i.option) === b.dataset.key); if (it) cart.setQty(b.dataset.key, it.qty + Number(b.dataset.qty)); }
    const r = e.target.closest("[data-remove]");
    if (r) cart.remove(r.dataset.remove);
  });
  cart.onChange(render);
  render();
  if (cart.count()) Pixel.track("InitiateCheckout", Pixel.order(cart.summary()));

  /* ---------- Saved details from a previous order (this browser only) ---------- */
  const draft = storage.get(DRAFT_KEY, {});
  ["fullName", "phone", "departamento", "municipio", "street", "reference"].forEach((k) => { if (draft[k] && form[k]) form[k].value = draft[k]; });

  /* ---------- Validation ---------- */
  const phoneDigits = (v) => {
    let d = String(v).replace(/\D/g, "");
    if (d.length === 11 && d.startsWith(CONFIG.phonePrefix)) d = d.slice(3);
    return d;
  };
  const rules = {
    fullName: (v) => v.trim().length >= 5 && /\s/.test(v.trim()),
    phone: (v) => CONFIG.phonePattern.test(phoneDigits(v)),
    departamento: (v) => !!v,
    municipio: (v) => v.trim().length >= 2,
    street: (v) => v.trim().length >= 6,
    reference: (v) => v.trim().length >= 3,
  };
  function check(name) {
    const el = form[name];
    const ok = rules[name](el.value);
    const field = el.closest(".field");
    field.classList.toggle("has-error", !ok);
    $(".field__err", field).hidden = ok;
    el.setAttribute("aria-invalid", String(!ok));
    return ok;
  }
  Object.keys(rules).forEach((name) => {
    form[name].addEventListener("blur", () => { if (form[name].value) check(name); });
    form[name].addEventListener("input", () => { if (form[name].closest(".field").classList.contains("has-error")) check(name); });
  });
  // "70001234" → "7000 1234"
  form.phone.addEventListener("input", () => {
    const d = phoneDigits(form.phone.value).slice(0, 8);
    form.phone.value = d.length > 4 ? d.slice(0, 4) + " " + d.slice(4) : d;
  });

  /* ---------- Send ---------- */
  const showError = (msg) => { const e = $("#formError"); e.innerHTML = msg; e.hidden = false; e.scrollIntoView({ behavior: "smooth", block: "center" }); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#formError").hidden = true;
    const bad = Object.keys(rules).filter((n) => !check(n));
    if (bad.length) { form[bad[0]].focus(); return; }
    const s = cart.summary();
    if (!s.lines.length) { render(); return; }
    if (!CONFIG.ordersUrl) {
      showError("Los pedidos en línea no están disponibles en este momento. Escríbenos por WhatsApp para hacer tu pedido.");
      return;
    }
    const c = Object.fromEntries(["fullName", "departamento", "municipio", "street", "reference"].map((k) => [k, form[k].value.trim()]));
    const phone = "+503 " + phoneDigits(form.phone.value);
    storage.set(DRAFT_KEY, { ...c, phone: form.phone.value });

    const items = s.lines.map((l) => ({
      id: l.id, sku: l.product.sku || "", name: l.product.name, option: l.option || "", qty: l.qty, unitPrice: l.unit,
    }));
    const itemText = items.map((i) => `${i.name}${i.option ? ` (${i.option})` : ""} × ${i.qty}`).join(" + ");
    const order = {
      number, date: new Date().toISOString(), country: "El Salvador", currency: "$",
      subtotal: s.subtotal, shipping: s.shipping, discount: s.savings, total: s.total,
      items,
      // "product" + "customer.city": the fields the older version of the sheet script reads
      product: { name: itemText, qty: s.count, sku: [...new Set(items.map((i) => i.sku).filter(Boolean))].join(", ") },
      customer: {
        fullName: c.fullName, phone,
        departamento: c.departamento, municipio: c.municipio, street: c.street, reference: c.reference,
        city: `${c.street}, ${c.municipio}, ${c.departamento} (Ref.: ${c.reference})`,
      },
    };

    const btn = $("#submitBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Enviando tu pedido…';
    let res = null;
    try {
      if (navigator.onLine === false) throw new Error("offline");
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30000);
      // text/plain = no CORS preflight; Google Apps Script answers with JSON readable from any site
      const r = await fetch(CONFIG.ordersUrl, {
        method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(order), signal: ctrl.signal,
      });
      clearTimeout(timer);
      res = await r.json();
    } catch (err) {
      res = { ok: false, network: true };
    }

    if (res && res.ok === true) {
      storage.set("sv_last_order", { ...order, confirmedAt: new Date().toISOString() });
      try { sessionStorage.removeItem(NUM_KEY); } catch { /* ignore */ }
      cart.clear();
      location.replace("gracias.html?n=" + encodeURIComponent(number));
      return;
    }
    btn.disabled = false;
    render();
    const wa = CONFIG.whatsapp ? ` o <a href="${Shop.waLink(`Hola, quiero hacer el pedido ${number}: ${itemText}. Total ${money(s.total)}.`)}" target="_blank" rel="noopener">haz tu pedido por WhatsApp</a>` : "";
    showError(res.network
      ? `No pudimos confirmar tu pedido (${esc(number)}). Revisa tu conexión a internet e inténtalo de nuevo${wa}.`
      : `No pudimos registrar tu pedido (${esc(number)}). Inténtalo de nuevo en unos segundos${wa}.`);
  });
})();
