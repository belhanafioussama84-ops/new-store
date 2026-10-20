/* Thank-you page — thank-you.html?order=<order number> */
(() => {
  "use strict";

  const { $, fmt, esc, findProduct, findOrder } = Shop;

  const number = new URLSearchParams(location.search).get("order") || "";
  const o = findOrder(number);
  const wa = String(STORE.whatsapp || "").replace(/\D/g, "");
  const waLink = (text) => `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  const day = (d) => d.toLocaleDateString(LANG === "sw" ? "sw-TZ" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  const addDays = (d, n) => new Date(d.getTime() + n * 864e5);

  // Order details (read from this browser's saved copy). Without it the page stays generic.
  if (o) {
    const p = findProduct(o.product.id) || {};
    const qty = o.product.qty;
    const unitFull = p.oldPrice || p.price || o.product.price;
    const full = unitFull * qty;
    const save = full - o.total;
    const firstName = o.customer.fullName.split(/\s+/)[0];
    const placed = new Date(o.date);

    $("#tTitle").innerHTML = `${T("Asante, {name}!", { name: esc(firstName) })} <span>${T("Your order is confirmed.")}</span>`;
    $("#tNumber").textContent = o.number;
    $("#tDate").textContent = day(placed);
    // Same / next day in Dar es Salaam (Lusaka in Zambia), 1–3 days elsewhere (see the FAQ).
    $("#tEta").textContent = new RegExp(COUNTRY.fastCity, "i").test(o.customer.city)
      ? `${day(addDays(placed, 1))}`
      : `${day(addDays(placed, 1))} – ${day(addDays(placed, 3))}`;
    $("#tMeta").hidden = false;
    $("#tPhone").textContent = o.customer.phone;

    $("#tPhoto").innerHTML = p.image
      ? `<img src="${esc(p.image)}" alt="" onerror="this.parentElement.textContent = '${esc(p.icon || "")}';" />`
      : esc(p.icon || "");
    $("#tName").textContent = o.product.name;
    $("#tQty").textContent = T(qty > 1 ? "{n} pieces · {price} each" : "{n} piece · {price} each", { n: qty, price: fmt(unitFull) });
    $("#tLine").textContent = fmt(full);
    $("#tTotals").innerHTML = `
      <div><dt>${T("Subtotal")}</dt><dd>${fmt(full)}</dd></div>
      ${save > 0 ? `<div class="is-save"><dt>${T("Bundle discount")}</dt><dd>− ${fmt(save)}</dd></div>` : ""}
      <div><dt>${T("Delivery")}</dt><dd class="is-free">${T("FREE")}</dd></div>
      <div class="is-total"><dt>${T("Total to pay on delivery")}</dt><dd>${fmt(o.total)}</dd></div>`;
    $("#tCustomer").textContent = o.customer.fullName;
    $("#tAddress").textContent = `${o.customer.city}\n${o.customer.phone}`;
    $("#tCash").textContent = T("Prepare {price} in cash", { price: fmt(o.total) });
    $("#tSummary").hidden = false;

    /* ---------- Bigger order: one more piece of the same product, then the other products ---------- */
    if (wa) {
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
      const item = { id: o.product.id, name: o.product.name, price: o.total / o.product.qty };
      Pixel.track("Purchase", Pixel.product(item, o.product.qty, o.total), { eventID: o.number });
      try { localStorage.setItem(KEY, JSON.stringify([...sent, o.number].slice(-50))); } catch { /* storage unavailable */ }
    }
  }

  /* ---------- Share, help, footer ---------- */
  const home = `${location.origin}${location.pathname.replace(/thank-you\.html$/, "")}`;
  $("#tShare").href = `https://wa.me/?text=${encodeURIComponent(T("I just ordered from Duka Bora 🇹🇿 Free delivery and you pay only when it arrives: {url}", { url: home }))}`;
  if (wa) {
    $("#tWa").href = waLink(`Hello Duka Bora${o ? `, about my order ${o.number}` : ""}:`);
    $("#tWa").hidden = false;
  }
  $("#tCallUs").href = `tel:+${STORE.phone}`;
  $("#tCallUs").textContent = `📞 ${STORE.phoneDisplay}`;
  $("#year").textContent = new Date().getFullYear();
})();
