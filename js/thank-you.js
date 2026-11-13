/* Thank-you page — thank-you?order=<order number> */
(() => {
  "use strict";

  const { $, fmt, esc, findProduct, findOrder } = Shop;

  const number = new URLSearchParams(location.search).get("order") || "";
  const o = findOrder(number);
  const wa = String(STORE.whatsapp || "").replace(/\D/g, "");
  const waLink = (text) => `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  const day = (d) => d.toLocaleDateString({ sw: "sw-TZ", es: "es-SV" }[LANG] || "en-GB", { weekday: "short", day: "numeric", month: "short" });
  const addDays = (d, n) => new Date(d.getTime() + n * 864e5);

  // Order details (read from this browser's saved copy). Without it the page stays generic.
  if (o) {
    const p = findProduct(o.product.id) || {};
    const unitFull = p.oldPrice || p.price || o.product.price;
    const firstName = o.customer.fullName.split(/\s+/)[0];
    const placed = new Date(o.date);
    // Pixel Purchase below: the order as it was placed (the upsell can change o later)
    const placedQty = o.upsell?.fromQty || o.product.qty;
    const placedTotal = o.upsell?.fromTotal || o.total;

    $("#tTitle").innerHTML = `${T("Asante, {name}!", { name: esc(firstName) })} <span>${T("Your order is confirmed.")}</span>`;
    $("#tNumber").textContent = o.number;
    $("#tDate").textContent = day(placed);
    // Same / next day in Dar es Salaam (Lusaka in Zambia), 1–3 days elsewhere (see the FAQ).
    $("#tEta").textContent = new RegExp(COUNTRY.fastCity, "i").test(o.customer.city)
      ? `${day(addDays(placed, 1))}`
      : `${day(addDays(placed, 1))} – ${day(addDays(placed, 3))}`;
    $("#tMeta").hidden = false;
    $("#tPhone").textContent = o.customer.phone;

    // Order summary (drawn again after an upsell)
    const renderSummary = () => {
      const qty = o.product.qty;
      const full = unitFull * qty;
      const save = full - o.total;
      $("#tPhoto").innerHTML = p.image
        ? `<img src="${esc(p.image)}" alt="" onerror="this.parentElement.textContent = '${esc(p.icon || "")}';" />`
        : esc(p.icon || "");
      $("#tName").textContent = p.name || o.product.name; // without the SKU
      $("#tQty").textContent = T(qty > 1 ? "{n} pieces · {price} each" : "{n} piece · {price} each", { n: qty, price: fmt(unitFull) });
      $("#tLine").textContent = fmt(full);
      $("#tTotals").innerHTML = `
        <div><dt>${T("Subtotal")}</dt><dd>${fmt(full)}</dd></div>
        ${save > 0.004 ? `<div class="is-save"><dt>${T("Bundle discount")}</dt><dd>− ${fmt(save)}</dd></div>` : ""}
        <div><dt>${T("Delivery")}</dt><dd class="is-free">${T("FREE")}</dd></div>
        <div class="is-total"><dt>${T("Total to pay on delivery")}</dt><dd>${fmt(o.total)}</dd></div>`;
      $("#tCustomer").textContent = o.customer.fullName;
      $("#tAddress").textContent = `${o.customer.city}\n${o.customer.phone}`;
      $("#tCash").textContent = T("Prepare {price} in cash", { price: fmt(o.total) });
      $("#tSummary").hidden = false;
    };
    renderSummary();

    /* ---------- One-click upsell (countries with COUNTRY.upsell): one more piece at the next
       offer price, added to the same order (same row of the sheet, see upsell_ in orders.gs).
       Shown once per order: after "yes" or "no thanks" it does not come back. ---------- */
    const up = (p.offers || []).find((x) => x.qty === o.product.qty + 1);
    if (COUNTRY.upsell && up && p.image && !o.upsell) {
      const extra = Math.round((up.price - o.total) * 100) / 100;
      const box = $("#tUp");
      box.innerHTML = `
        <span class="t-up__tag">${T("Only on this page")}</span>
        <div class="t-up__photo"><img src="${esc(p.image)}" alt="" /><span>×${up.qty}</span></div>
        <div class="t-up__body">
          <h2>${T("Add one more {name}?", { name: esc(p.name) })}</h2>
          <p>${T("Get {n} for {price} in total instead of {full}: only <b>{extra}</b> more. It arrives in the same delivery and you pay everything in cash.", { n: up.qty, price: fmt(up.price), full: fmt(unitFull * up.qty), extra: fmt(extra) })}</p>
          <button type="button" class="btn btn--big" id="tUpYes">${T("Yes, add it to my order (+{extra})", { extra: fmt(extra) })}</button>
          <p class="t-up__error" id="tUpError" hidden>${T("We couldn't add it. Check your connection and try again.")}</p>
          <button type="button" class="t-up__no" id="tUpNo">${T("No thanks, keep my order as it is")}</button>
        </div>`;
      box.hidden = false;

      $("#tUpYes").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.textContent = T("Adding…");
        $("#tUpError").hidden = true;
        const before = { qty: o.product.qty, total: o.total };
        const updated = { ...o, product: { ...o.product, qty: up.qty }, total: up.price, upsell: { fromQty: before.qty, fromTotal: before.total, extra } };
        try {
          await Shop.sendOrder({ upsell: updated });
        } catch {
          btn.disabled = false;
          btn.textContent = T("Yes, add it to my order (+{extra})", { extra: fmt(extra) });
          $("#tUpError").hidden = false;
          return;
        }
        Object.assign(o, updated);
        Shop.saveOrder(o);
        Pixel.custom("Upsell", { value: extra, currency: COUNTRY.currencyCode, content_ids: [p.id], num_items: 1 });
        renderSummary();
        box.classList.add("is-done");
        box.innerHTML = `<p class="t-up__ok">✓ ${T("Added! Your order is now {n} pieces: {price} to pay on delivery.", { n: o.product.qty, price: fmt(o.total) })}</p>`;
      });
      $("#tUpNo").addEventListener("click", () => {
        o.upsell = { declined: true };
        Shop.saveOrder(o);
        box.hidden = true;
      });
    }

    /* ---------- Bigger order: one more piece of the same product, then the other products ---------- */
    if (wa) {
      const qty = o.product.qty;
      const cards = [];
      const next = (p.offers || []).find((x) => x.qty === qty + 1);
      if (next && p.image) {
        const extra = next.price - o.total;
        cards.push(`
          <article class="t-offer t-offer--best">
            <span class="t-offer__tag">${T("Best value")}</span>
            <div class="t-offer__photo"><img src="${esc(p.image)}" alt="" /></div>
            <div class="t-offer__body">
              <strong>+1 ${esc(p.name)}</strong>
              <p>${T("Make it {n} pieces for {price} in total: only <b>{extra}</b> more.", { n: next.qty, price: fmt(next.price), extra: fmt(extra) })}</p>
              <a class="btn btn--wa" target="_blank" rel="noopener" href="${esc(waLink(`Hello Duka Bora, order ${o.number}: please make it ${next.qty} × ${p.name} (${fmt(next.price)}).`))}">${T("💬 Add it on WhatsApp")}</a>
            </div>
          </article>`);
      }
      PRODUCTS.filter((x) => x.id !== p.id && x.home !== false).slice(0, 2).forEach((x) => {
        cards.push(`
          <article class="t-offer">
            <div class="t-offer__photo"><img src="${esc(x.image)}" alt="" onerror="this.remove()" /></div>
            <div class="t-offer__body">
              <strong>${esc(x.name)}</strong>
              <p>${T("{price} · delivered together with your order.", { price: fmt(x.price) })}</p>
              <a class="btn btn--wa" target="_blank" rel="noopener" href="${esc(waLink(`Hello Duka Bora, order ${o.number}: please add 1 × ${x.name} (${fmt(x.price)}).`))}">${T("💬 Add it on WhatsApp")}</a>
            </div>
          </article>`);
      });
      if (cards.length) {
        $("#tMoreGrid").innerHTML = cards.join("");
        $("#tMore").hidden = false;
      }
    }

    // Purchase event once per order (a page reload doesn't count it twice).
    // eventID lets Meta drop duplicates too.
    const KEY = "dukabora_pixel_sent";
    let sent = [];
    try { sent = JSON.parse(localStorage.getItem(KEY)) || []; } catch { /* storage unavailable */ }
    if (!sent.includes(o.number)) {
      const item = { id: o.product.id, name: o.product.name, price: placedTotal / placedQty };
      Pixel.track("Purchase", Pixel.product(item, placedQty, placedTotal), { eventID: o.number });
      try { localStorage.setItem(KEY, JSON.stringify([...sent, o.number].slice(-50))); } catch { /* storage unavailable */ }
    }
  } else {
    // The browser kept no copy of the order (private mode, some in-app browsers): send the
    // Purchase from the link (thank-you?order=…&p=<product id>&q=<qty>&v=<total>).
    // Once per page view only; eventID lets Meta drop a duplicate if the page is reloaded.
    const q = new URLSearchParams(location.search);
    const p = findProduct(q.get("p") || "");
    const qty = Math.max(1, Number(q.get("q")) || 1);
    const value = Number(q.get("v")) || 0;
    if (number && p && value > 0) {
      Pixel.track("Purchase", Pixel.product({ id: p.id, name: p.name, price: value / qty }, qty, value), { eventID: number });
    }
  }

  /* ---------- Share, help, footer ---------- */
  const home = `${location.origin}${location.pathname.replace(/thank-you(\.html)?$/, "")}`;
  $("#tShare").href = `https://wa.me/?text=${encodeURIComponent(T("I just ordered from Duka Bora 🇹🇿 Free delivery and you pay only when it arrives: {url}", { url: home }))}`;
  if (wa) {
    $("#tWa").href = waLink(`Hello Duka Bora${o ? `, about my order ${o.number}` : ""}:`);
    $("#tWa").hidden = false;
  }
  $("#tCallUs").href = `tel:+${STORE.phone}`;
  $("#tCallUs").textContent = `📞 ${STORE.phoneDisplay}`;
  $("#year").textContent = new Date().getFullYear();
})();
