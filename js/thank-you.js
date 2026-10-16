/* Thank-you page — thank-you.html?order=<order number> */
(() => {
  "use strict";

  const { $, fmt, esc, findProduct, findOrder } = Shop;

  const number = new URLSearchParams(location.search).get("order") || "";
  const o = findOrder(number);

  // Order summary (the order is read from this browser's saved copy).
  if (o) {
    const p = findProduct(o.product.id) || {};
    $("#sMedia").innerHTML = p.image
      ? `<img src="${esc(p.image)}" alt="" onerror="this.parentElement.textContent = '${esc(p.icon || "")}';" />`
      : esc(p.icon || "");
    $("#sName").textContent = o.product.name;
    $("#sOffer").textContent = `${o.product.qty} piece${o.product.qty > 1 ? "s" : ""}`;
    $("#sQty").textContent = `Order ${o.number}`;
    $("#sTotal").textContent = fmt(o.total);
    $("#summary").hidden = false;

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

  $("#footerPhone").href = `tel:+${STORE.phone}`;
  $("#footerPhone").textContent = `📞 ${STORE.phoneDisplay}`;
  $("#year").textContent = new Date().getFullYear();
})();
