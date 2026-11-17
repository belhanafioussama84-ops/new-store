/* Home page — product list filled from PRODUCTS (js/products.js) */
(() => {
  "use strict";

  const { $, fmt, esc } = Shop;

  // Every product has its own page with the order form.
  // Short form sv/<id> on the real site (worker.js serves it); the GitHub Pages copy has no worker.
  const short = /(^|\.)dukaabora\.store$|\.workers\.dev$/.test(location.hostname);
  const productUrl = (p) => short ? `${COUNTRY.id}/${encodeURIComponent(p.id)}` : `product?id=${encodeURIComponent(p.id)}`;
  const photo = (p) => `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
    onerror="this.parentElement.classList.add('is-empty'); this.parentElement.dataset.icon = '${esc(p.icon || "")}'; this.remove();" />`;

  /* ---------- Products (those with home: false only have their own page) ---------- */
  const list = PRODUCTS.filter((p) => p.home !== false);
  if (!list.length) {
    $("#productGrid").outerHTML = `<p class="shop__soon">${T("✦ New products are coming soon. Check back shortly!")}</p>`;
  } else $("#productGrid").innerHTML = list.map((p) => {
    return `
    <a class="h-card" href="${esc(productUrl(p))}">
      <div class="h-card__photo">
        ${p.badge ? `<span class="h-card__badge">${esc(T(p.badge))}</span>` : ""}
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
        <span class="btn h-card__btn">${T("Order now · Pay on delivery")}</span>
      </div>
    </a>`;
  }).join("");

  $("#footProducts").innerHTML = list.map((p) =>
    `<li><a href="${esc(productUrl(p))}">${esc(p.name)}</a></li>`).join("");

  /* ---------- Init ---------- */
  if (STORE.phone) {
    $("#footerPhone").href = `tel:+${STORE.phone}`;
    $("#footerPhone").textContent = `📞 ${STORE.phoneDisplay}`;
  } else $("#footerPhone").closest("li").remove();
  const wa = String(STORE.whatsapp || "").replace(/\D/g, "");
  if (wa) {
    const href = `https://wa.me/${wa}${STORE.whatsappText ? `?text=${encodeURIComponent(T(STORE.whatsappText))}` : ""}`;
    ["#chatWa", "#footerWa"].forEach((s) => { $(s).href = href; $(s).hidden = false; });
  }
  $("#year").textContent = new Date().getFullYear();
})();
