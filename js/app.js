/* Home page — product list filled from PRODUCTS (js/products.js) */
(() => {
  "use strict";

  const { $, fmt, esc } = Shop;

  // Every product has its own page with the order form.
  const productUrl = (p) => `product.html?id=${encodeURIComponent(p.id)}`;
  const photo = (p) => `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
    onerror="this.parentElement.classList.add('is-empty'); this.parentElement.dataset.icon = '${esc(p.icon || "")}'; this.remove();" />`;

  /* ---------- Products (those with home: false only have their own page) ---------- */
  const list = PRODUCTS.filter((p) => p.home !== false);
  if (!list.length) {
    $("#productGrid").outerHTML = `<p class="shop__soon">✦ New products are coming soon. Check back shortly!</p>`;
  } else $("#productGrid").innerHTML = list.map((p) => {
    const url = esc(productUrl(p));
    return `
    <a class="item" href="${url}">
      <div class="item__photo">
        ${p.badge ? `<span class="item__badge">${esc(p.badge)}</span>` : ""}
        ${photo(p)}
        <span class="item__tag">${fmt(p.price)}</span>
      </div>
      <div class="item__body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        <div class="item__price">
          <strong>${fmt(p.price)}</strong>
          ${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ""}
        </div>
        <span class="btn item__btn">Order now</span>
      </div>
    </a>`;
  }).join("");

  /* ---------- Init ---------- */
  ["#footerPhone", "#ctaPhone"].forEach((s) => {
    $(s).href = `tel:+${STORE.phone}`;
    $(s).textContent = `📞 ${STORE.phoneDisplay}`;
  });
  $("#year").textContent = new Date().getFullYear();
})();
