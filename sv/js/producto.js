/* Product page — producto.html?id=<product id>, filled from PRODUCTS (sv/config.js) */
(() => {
  "use strict";
  const { $, $$, esc, money, icon, stars, products, findProduct, category, priceFor, discountPct, rating, cart, Pixel, card, toast, faqHtml, initReveal, MAX_QTY } = Shop;
  const S = CONFIG.shipping;

  const p = findProduct(new URLSearchParams(location.search).get("id") || "");
  if (!p) {
    $("#main").innerHTML = `<section class="section"><div class="container empty">
      <h1 class="title">Producto no encontrado</h1><p>Puede que ya no esté disponible.</p>
      <a href="tienda.html" class="btn btn--dark">Ver la tienda</a></div></section>`;
    return;
  }

  const cat = category(p.category);
  const r = rating(p);
  const off = discountPct(p);
  const url = `https://dukaabora.store/sv/producto.html?id=${encodeURIComponent(p.id)}`;

  /* ---------- SEO ---------- */
  document.title = `${p.name} · ${CONFIG.brand} El Salvador`;
  const meta = (attr, key, val) => {
    let m = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!m) { m = document.createElement("meta"); m.setAttribute(attr, key); document.head.appendChild(m); }
    m.setAttribute("content", val);
  };
  meta("name", "description", `${p.short}. ${money(p.price)} · Envío a todo El Salvador · Pago contra entrega.`);
  meta("property", "og:title", p.name);
  meta("property", "og:description", p.short);
  meta("property", "og:image", new URL(p.images[0], location.href).href);
  meta("property", "og:url", url);
  const canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon);
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    image: p.images.map((i) => new URL(i, location.href).href), sku: p.sku || p.id, brand: { "@type": "Brand", name: CONFIG.brand },
    offers: { "@type": "Offer", price: p.price, priceCurrency: CONFIG.currency, availability: "https://schema.org/InStock", url },
    ...(r ? { aggregateRating: { "@type": "AggregateRating", ratingValue: r.avg.toFixed(1), reviewCount: r.count } } : {}),
  });
  document.head.appendChild(ld);

  $("#crumbs").innerHTML = `<a href="index.html">Inicio</a><span aria-hidden="true">/</span>
    ${cat ? `<a href="tienda.html?cat=${cat.id}">${esc(cat.name)}</a><span aria-hidden="true">/</span>` : ""}<span>${esc(p.name)}</span>`;

  /* ---------- Gallery ---------- */
  let current = 0;
  $("#gallery").innerHTML = `
    <div class="gallery__main" id="gMain">
      <div class="gallery__track" id="gTrack">${p.images.map((src, i) =>
        `<img src="${esc(src)}" alt="${esc(p.name)} — foto ${i + 1}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} width="800" height="800" />`).join("")}</div>
      ${off ? `<span class="tag tag--sale">−${off}%</span>` : p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ""}
      ${p.images.length > 1 ? `
        <button type="button" class="gallery__nav gallery__nav--prev" aria-label="Foto anterior">${icon("left")}</button>
        <button type="button" class="gallery__nav gallery__nav--next" aria-label="Foto siguiente">${icon("right")}</button>
        <span class="gallery__count" id="gCount">1 / ${p.images.length}</span>` : ""}
    </div>
    ${p.images.length > 1 ? `<div class="gallery__thumbs">${p.images.map((src, i) =>
      `<button type="button" class="${i ? "" : "is-on"}" data-thumb="${i}" aria-label="Ver foto ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy" /></button>`).join("")}</div>` : ""}`;
  const track = $("#gTrack");
  function show(i) {
    current = (i + p.images.length) % p.images.length;
    track.scrollTo({ left: current * track.clientWidth, behavior: "smooth" });
    sync();
  }
  function sync() {
    $$("[data-thumb]").forEach((b, n) => b.classList.toggle("is-on", n === current));
    const c = $("#gCount"); if (c) c.textContent = `${current + 1} / ${p.images.length}`;
  }
  // Swipe = native scroll-snap; keep the counter in sync
  track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== current) { current = i; sync(); }
  }, { passive: true });
  $(".gallery__nav--prev")?.addEventListener("click", () => show(current - 1));
  $(".gallery__nav--next")?.addEventListener("click", () => show(current + 1));
  $$("[data-thumb]").forEach((b) => b.addEventListener("click", () => show(Number(b.dataset.thumb))));

  /* ---------- Buy box ---------- */
  const tiers = (p.offers || []).slice().sort((a, b) => a.qty - b.qty);
  let qty = 1;
  const choice = {}; // option name -> value
  $("#buy").innerHTML = `
    <span class="eyebrow">${esc(cat?.name || "")}</span>
    <h1 class="buy__title">${esc(p.name)}</h1>
    ${r ? `<a href="#reviewsSec" class="buy__rating">${stars(r.avg)} <span>${r.avg.toFixed(1)} · ${r.count} ${r.count === 1 ? "opinión" : "opiniones"}</span></a>` : ""}
    <div class="price price--lg">
      <span class="price__now">${money(p.price)}</span>
      ${p.oldPrice ? `<s class="price__old">${money(p.oldPrice)}</s><span class="price__off">Ahorras ${money(p.oldPrice - p.price)}</span>` : ""}
    </div>
    <p class="buy__short">${esc(p.description)}</p>
    ${(p.benefits || []).length ? `<ul class="buy__list">${p.benefits.map((b) => `<li>${icon("check")}${esc(b.title)}</li>`).join("")}</ul>` : ""}

    ${(p.options || []).map((o) => `
      <fieldset class="opt" data-opt="${esc(o.name)}">
        <legend>${esc(o.name)}: <strong data-opt-label>Elige una opción</strong></legend>
        <div class="opt__row">${o.values.map((v) => `<button type="button" class="opt__btn" data-value="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join("")}</div>
        <p class="field__err" hidden>Elige ${esc(o.name.toLowerCase())}.</p>
      </fieldset>`).join("")}

    ${tiers.length > 1 ? `
      <div class="bundles" role="radiogroup" aria-label="Elige tu paquete">
        ${tiers.map((t) => {
          const save = t.qty * p.price - t.price;
          return `<button type="button" class="bundle" role="radio" aria-checked="${t.qty === 1}" data-bundle="${t.qty}">
            ${t.tag ? `<span class="bundle__tag">${esc(t.tag)}</span>` : ""}
            <span class="bundle__qty">${t.qty} ${t.qty === 1 ? "unidad" : "unidades"}</span>
            <span class="bundle__price">${money(t.price)}</span>
            <span class="bundle__save">${save > 0 ? `Ahorras ${money(save)}` : "Precio normal"}</span>
          </button>`;
        }).join("")}
      </div>` : ""}

    <div class="buy__qty">
      <span class="buy__label">Cantidad</span>
      <div class="stepper">
        <button type="button" data-step="-1" aria-label="Quitar uno">${icon("minus")}</button>
        <output id="qty" aria-live="polite">1</output>
        <button type="button" data-step="1" aria-label="Agregar uno">${icon("plus")}</button>
      </div>
      <div class="buy__total"><span>Total</span><strong id="total"></strong><small id="save"></small></div>
    </div>

    <div class="buy__ctas" id="ctas">
      <button type="button" class="btn btn--ghost btn--lg" id="addBtn">${icon("bag")} Agregar al carrito</button>
      <button type="button" class="btn btn--gold btn--lg" id="buyBtn">Comprar ahora</button>
    </div>

    <div class="buy__trust">
      <div>${icon("cash")}<span><strong>Pago contra entrega</strong>Pagas en efectivo al recibir</span></div>
      <div>${icon("truck")}<span><strong>${S.price ? "Envío " + money(S.price) : "Envío gratis"}</strong>${S.nationwide ? "A todo El Salvador" : "En El Salvador"} · ${esc(S.time)}</span></div>
      <div>${icon("phone")}<span><strong>Confirmación telefónica</strong>Te llamamos antes de enviar</span></div>
    </div>`;

  const setQty = (n) => {
    qty = Math.max(1, Math.min(MAX_QTY, n));
    $("#qty").textContent = qty;
    const total = priceFor(p, qty), save = qty * p.price - total;
    $("#total").textContent = money(total);
    $("#save").textContent = save > 0 ? `Ahorras ${money(save)}` : "";
    $$("[data-bundle]").forEach((b) => b.setAttribute("aria-checked", String(Number(b.dataset.bundle) === qty)));
    $$("[data-step]").forEach((b) => { b.disabled = (b.dataset.step === "-1" && qty <= 1) || (b.dataset.step === "1" && qty >= MAX_QTY); });
    const sp = $("#stickyPrice"); if (sp) sp.textContent = money(total);
  };
  $$("[data-step]").forEach((b) => b.addEventListener("click", () => setQty(qty + Number(b.dataset.step))));
  $$("[data-bundle]").forEach((b) => b.addEventListener("click", () => setQty(Number(b.dataset.bundle))));
  $$(".opt").forEach((fs) => {
    fs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-value]");
      if (!b) return;
      choice[fs.dataset.opt] = b.dataset.value;
      $$("[data-value]", fs).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      $("[data-opt-label]", fs).textContent = b.dataset.value;
      fs.classList.remove("has-error"); $(".field__err", fs).hidden = true;
    });
  });

  // Options must be chosen before adding to the cart
  function optionText() {
    const missing = (p.options || []).filter((o) => !choice[o.name]);
    if (missing.length) {
      const fs = $(`.opt[data-opt="${CSS.escape(missing[0].name)}"]`);
      fs.classList.add("has-error"); $(".field__err", fs).hidden = false;
      fs.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }
    return (p.options || []).map((o) => (p.options.length > 1 ? `${o.name}: ` : "") + choice[o.name]).join(", ");
  }
  function add() {
    const opt = optionText();
    if (opt === null) return false;
    cart.add(p.id, qty, opt);
    Pixel.track("AddToCart", Pixel.product(p, qty));
    const c = $(".nav__cart"); c?.classList.remove("bump"); void c?.offsetWidth; c?.classList.add("bump");
    return true;
  }
  $("#addBtn").addEventListener("click", () => { if (add()) toast(`${qty} × ${p.name} en tu carrito`, true); });
  $("#buyBtn").addEventListener("click", () => { if (add()) location.href = "checkout.html"; });
  setQty(1);

  /* ---------- Sticky bar (mobile) ---------- */
  const sticky = $("#stickyBuy");
  sticky.innerHTML = `
    <img src="${esc(p.images[0])}" alt="" />
    <div class="sticky-buy__info"><span>${esc(p.name)}</span><strong id="stickyPrice">${money(priceFor(p, qty))}</strong></div>
    <button type="button" class="btn btn--gold" id="stickyBtn">Agregar al carrito</button>`;
  $("#stickyBtn").addEventListener("click", () => {
    if ((p.options || []).some((o) => !choice[o.name])) { optionText(); return; }
    if (add()) toast(`${qty} × ${p.name} en tu carrito`, true);
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      const on = !e.isIntersecting && e.boundingClientRect.top < 0;
      sticky.classList.toggle("is-on", on);
      sticky.setAttribute("aria-hidden", String(!on));
    }).observe($("#ctas"));
  }

  /* ---------- Landing sections ---------- */
  const hide = (id) => { $(id).hidden = true; };

  // 2. Benefits
  if (p.benefits?.length) {
    $("#benefitsTitle").innerHTML = p.hero ? esc(p.hero.title).replace(/,\s*(.+)$/, ", <em>$1</em>") : "Por qué te va a <em>encantar</em>";
    $("#benefits").innerHTML = p.benefits.map((b) =>
      `<div class="why__item reveal"><div class="why__icon">${icon(b.icon)}</div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div>`).join("");
  } else hide("#benefitsSec");

  // 3. Problem / solution
  if (p.problem && p.solution) {
    $("#ps").innerHTML = `
      <figure class="ps__img reveal"><img src="${esc(p.images[1] || p.images[0])}" alt="${esc(p.name)}" loading="lazy" /></figure>
      <div class="ps__copy">
        <div class="ps__block reveal"><span class="ps__label ps__label--problem">El problema</span><h2>${esc(p.problem.title)}</h2><p>${esc(p.problem.text)}</p></div>
        <div class="ps__block ps__block--solution reveal"><span class="ps__label">La solución</span><h2>${esc(p.solution.title)}</h2><p>${esc(p.solution.text)}</p>
          <a href="#main" class="btn btn--dark" data-scroll-buy>Lo quiero</a></div>
      </div>`;
  } else hide("#psSec");

  // 4. Features
  if (p.features?.length) {
    $("#features").innerHTML = p.features.map((f) => `
      <article class="feature reveal">
        <figure>${/\.mp4$/i.test(f.image)
          ? `<video src="${esc(f.image)}" autoplay muted loop playsinline preload="metadata"></video>`
          : `<img src="${esc(f.image)}" alt="${esc(f.title)}" loading="lazy" />`}</figure>
        <div class="feature__copy">
          <h3>${esc(f.title)}</h3><p>${esc(f.text)}</p>
          ${f.list ? `<ul class="buy__list">${f.list.map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul>` : ""}
        </div>
      </article>`).join("");
  } else hide("#featuresSec");

  // 5. Gallery mosaic (opens the photo in the top gallery)
  if (p.images.length > 1) {
    $("#mosaic").innerHTML = p.images.slice(0, 6).map((src, i) =>
      `<button type="button" class="reveal" data-zoom="${i}" aria-label="Ver foto ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy" /></button>`).join("");
    $("#mosaic").addEventListener("click", (e) => {
      const b = e.target.closest("[data-zoom]");
      if (!b) return;
      scrollTo({ top: $("#gallery").getBoundingClientRect().top + scrollY - 120, behavior: "smooth" });
      show(Number(b.dataset.zoom));
    });
  } else hide("#gallerySec");

  // 6. How it works
  if (p.howItWorks?.length) {
    $("#how").innerHTML = p.howItWorks.map((s, i) =>
      `<div class="how__step reveal"><span class="how__n">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("");
  } else hide("#howSec");

  // 7. Specs
  const specs = Object.entries(p.specs || {});
  if (specs.length) $("#specs").innerHTML = specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  else hide("#specsSec");

  // 8. Reviews (real ones only)
  $("#reviews").innerHTML = (p.reviews || []).length
    ? `<div class="reviews">${p.reviews.map((x) => `
        <figure class="review reveal">${stars(x.rating || 5)}<p>“${esc(x.text)}”</p>
          <footer><strong>${esc(x.name)}</strong>${x.city ? ` · ${esc(x.city)}` : ""}${x.date ? ` · ${esc(x.date)}` : ""}</footer></figure>`).join("")}</div>`
    : `<div class="reviews-empty reveal">${icon("star")}
        <h3>Aún no hay opiniones de este producto</h3>
        <p>Solo publicamos opiniones reales de clientes que recibieron su pedido en El Salvador. ¡Sé de los primeros en contarnos tu experiencia!</p>
      </div>`;

  // 9. FAQ: product questions + the general ones
  $("#faq").innerHTML = faqHtml([...(p.faq || []), ...CONFIG.faq.slice(0, 4)]);

  // 10. CTA
  $("#cta").innerHTML = `
    <span class="eyebrow">${S.nationwide ? "Envío a todo El Salvador" : "Envío en El Salvador"}</span>
    <h2>${p.hero ? esc(p.hero.title) : esc(p.name)}</h2>
    <p>${p.hero ? esc(p.hero.text) + " " : ""}Pide hoy y paga en efectivo cuando lo recibas.</p>
    <button type="button" class="btn btn--gold btn--lg" data-scroll-buy>Pedir ahora · ${money(p.price)}</button>`;
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-scroll-buy]")) return;
    e.preventDefault();
    scrollTo({ top: $("#buy").getBoundingClientRect().top + scrollY - 110, behavior: "smooth" });
  });

  // Related: same category first, then the others
  const related = [...products.filter((x) => x.id !== p.id && x.category === p.category), ...products.filter((x) => x.id !== p.id && x.category !== p.category)].slice(0, 4);
  if (related.length) $("#related").innerHTML = related.map(card).join("");
  else hide("#relatedSec");

  initReveal();
  Pixel.track("ViewContent", Pixel.product(p));
})();
