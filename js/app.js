/* Home page — product list filled from PRODUCTS (js/products.js) */
(() => {
  "use strict";

  const { $, fmt, esc } = Shop;

  // Every product has its own page with the order form.
  const productUrl = (p) => `product.html?id=${encodeURIComponent(p.id)}`;
  const photo = (p) => `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
    onerror="this.parentElement.classList.add('is-empty'); this.parentElement.dataset.icon = '${esc(p.icon || "")}'; this.remove();" />`;

  // The "2 pieces" offer of a product and what it saves, or null.
  const bundle = (p) => {
    const o = (p.offers || []).find((x) => x.qty === 2);
    if (!o) return null;
    return { price: o.price, save: (p.oldPrice || p.price) * 2 - o.price };
  };

  /* ---------- Products (those with home: false only have their own page) ---------- */
  const list = PRODUCTS.filter((p) => p.home !== false);
  if (!list.length) {
    $("#productGrid").outerHTML = `<p class="shop__soon">${T("✦ New products are coming soon. Check back shortly!")}</p>`;
  } else $("#productGrid").innerHTML = list.map((p) => {
    const b = bundle(p);
    return `
    <a class="h-card" href="${esc(productUrl(p))}">
      <div class="h-card__photo">
        ${p.badge ? `<span class="h-card__badge">${esc(T(p.badge))}</span>` : ""}
        ${b ? `<span class="h-card__duo">${T("2 for {price}", { price: fmt(b.price) })}</span>` : ""}
        ${photo(p)}
      </div>
      <div class="h-card__body">
        ${p.category ? `<p class="h-card__cat">${esc(T(p.category))}</p>` : ""}
        <h3>${esc(p.name)}</h3>
        <p class="h-card__desc">${esc(T(p.description))}</p>
        <div class="h-card__price">
          <strong>${fmt(p.price)}</strong>
          ${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ""}
        </div>
        ${b && b.save > 0 ? `<p class="h-card__save">${T("🔥 Buy 2, save {price}", { price: fmt(b.save) })}</p>` : ""}
        <span class="btn h-card__btn">${T("Order now · Pay on delivery")}</span>
      </div>
    </a>`;
  }).join("");

  $("#footProducts").innerHTML = list.map((p) =>
    `<li><a href="${esc(productUrl(p))}">${esc(p.name)}</a></li>`).join("");

  /* ---------- Init ---------- */
  $("#footerPhone").href = `tel:+${STORE.phone}`;
  $("#footerPhone").textContent = `📞 ${STORE.phoneDisplay}`;
  const wa = String(STORE.whatsapp || "").replace(/\D/g, "");
  if (wa) {
    const href = `https://wa.me/${wa}${STORE.whatsappText ? `?text=${encodeURIComponent(STORE.whatsappText)}` : ""}`;
    ["#chatWa", "#footerWa"].forEach((s) => { $(s).href = href; $(s).hidden = false; });
  }
  $("#year").textContent = new Date().getFullYear();
})();
