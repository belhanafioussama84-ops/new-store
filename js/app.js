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
  if (COUNTRY.id === "sv" && list.length) svHome(list);
  else if (!list.length) {
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

  /* ---------- El Salvador home, like the user's reference (cuelhome.com):
     a slider with one banner per product, categories, and shop cards with "Ver oferta".
     No discounts at all (user, 20 Nov 2026): only the price. ---------- */
  function svHome(items) {
    const short2 = (s, n) => (s.length > n ? `${s.slice(0, n).replace(/\s+\S*$/, "")}…` : s);

    // Slider: one banner per product
    $("#svTrack").innerHTML = items.map((p, i) => `
      <a class="svh__slide" href="${esc(productUrl(p))}" aria-label="${esc(p.name)}"${i ? ` aria-hidden="true" tabindex="-1"` : ""}>
        <div class="svh__copy">
          <p class="svh__kicker">${esc(T(p.category || ""))}</p>
          <h2>${esc(p.name)}</h2>
          <p class="svh__text">${esc(short2(p.claim || T(p.description || ""), 120))}</p>
          <p class="svh__price"><strong>${fmt(p.price)}</strong><span>Envío gratis</span></p>
          <span class="svh__btn">Lo quiero →</span>
        </div>
        <div class="svh__img"><img src="${esc(p.image)}" alt="" ${i ? `loading="lazy"` : `fetchpriority="high"`} /></div>
      </a>`).join("");
    $("#svDots").innerHTML = items.map((p, i) =>
      `<button type="button" aria-label="${i + 1}"${i ? "" : ` class="is-on"`}></button>`).join("");
    let cur = 0, timer;
    const go = (n) => {
      cur = (n + items.length) % items.length;
      $("#svTrack").style.transform = `translateX(-${cur * 100}%)`;
      document.querySelectorAll("#svDots button").forEach((b, i) => b.classList.toggle("is-on", i === cur));
      document.querySelectorAll(".svh__slide").forEach((s, i) => {
        s.toggleAttribute("aria-hidden", i !== cur);
        if (i === cur) s.removeAttribute("tabindex"); else s.setAttribute("tabindex", "-1");
      });
    };
    const auto = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); };
    $("#svPrev").onclick = () => { go(cur - 1); auto(); };
    $("#svNext").onclick = () => { go(cur + 1); auto(); };
    document.querySelectorAll("#svDots button").forEach((b, i) => { b.onclick = () => { go(i); auto(); }; });
    // swipe on phones
    let x0 = null;
    const track = $("#svTrack");
    track.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); auto(); }
    });
    if (items.length > 1) auto();
    else $(".svh__nav").remove();

    // Shop title, like the reference
    $("#shop .label").textContent = "Lo más pedido";
    $("#shop .h-title").innerHTML = "Nuestros productos";
    $("#shop .h-title").insertAdjacentHTML("afterend",
      `<p class="svh__sub">Envío gratis a todo El Salvador y pagas al recibir.</p>`);

    // Shop cards
    const grid = $("#productGrid");
    grid.classList.add("svg");
    const card = (p) => `
      <a class="svc" href="${esc(productUrl(p))}" data-cat="${esc(p.category || "")}">
        <div class="svc__photo">
          ${p.badge ? `<span class="svc__tag svc__tag--new">${esc(T(p.badge))}</span>` : ""}
          ${photo(p)}
        </div>
        <div class="svc__body">
          <h3>${esc(p.name)}</h3>
          <p class="svc__price"><strong>${fmt(p.price)}</strong></p>
          <p class="svc__pack">🚚 Envío gratis · Pagas al recibir</p>
          <span class="svc__btn">Ver oferta</span>
        </div>
      </a>`;
    grid.innerHTML = items.map(card).join("");

    // Categories: round photo of the first product of each one; a tap shows only that category
    const cats = [...new Set(items.map((p) => p.category).filter(Boolean))];
    if (cats.length < 2) { $(".svh__head").remove(); $("#svCats").remove(); return; }
    const first = (c) => items.find((p) => p.category === c);
    $("#svCats").innerHTML = [
      `<button type="button" class="svh__cat is-on" data-cat=""><span class="svh__cat-img svh__cat-img--all">🛍️</span><b>Todo</b></button>`,
      ...cats.map((c) => `<button type="button" class="svh__cat" data-cat="${esc(c)}">
        <span class="svh__cat-img"><img src="${esc(first(c).image)}" alt="" loading="lazy" /></span><b>${esc(T(c))}</b></button>`),
    ].join("");
    document.querySelectorAll(".svh__cat").forEach((b) => {
      b.onclick = () => {
        document.querySelectorAll(".svh__cat").forEach((x) => x.classList.toggle("is-on", x === b));
        grid.querySelectorAll(".svc").forEach((c) => { c.hidden = !!b.dataset.cat && c.dataset.cat !== b.dataset.cat; });
        $("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
  }
})();
