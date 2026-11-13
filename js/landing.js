/* Product page — product?id=<product id>, filled from PRODUCTS (js/products.js) */
(() => {
  "use strict";

  const { $, fmt, esc, findProduct, setError, validate, createOrder, sendOrder } = Shop;

  const id = new URLSearchParams(location.search).get("id") || "";
  const p = findProduct(id);
  if (!p) {
    $("main").innerHTML = `
      <section class="wrap faq">
        <h2>Product not found</h2>
        <p class="muted" style="text-align:center">No product in js/products.js has the id "${esc(id)}".</p>
        <p style="text-align:center"><a href="./" class="btn">${T("Back to shop")}</a></p>
      </section>`;
    $("#sticky").remove();
    return;
  }

  // The real photos (taken in stock) also go in the top gallery, after the product photos
  const images = [...(p.images?.length ? p.images : [p.image]), ...(p.realPhotos || [])];
  // squarePhotos: true shows the top photos whole (square box, nothing cut off)
  if (p.squarePhotos) document.body.classList.add("gallery-square");
  const unitFull = p.oldPrice || p.price; // price per item before any discount
  // Bundle offers: [{ qty, price, tag? }]. Without them there is a single "1 piece" offer.
  const offers = p.offers?.length ? p.offers : [{ qty: 1, price: p.price }];
  let offerIndex = 0;
  const offer = () => offers[offerIndex];
  const join = (parts) => (Array.isArray(parts) ? parts.join(" ") : parts || "");

  /* ---------- Product info ---------- */
  document.title = `${p.name} · ${STORE.name}`;
  $("#crumbName").textContent = p.name;
  $("#pName").textContent = p.name;
  $("#pCat").textContent = `${p.category ? `${T(p.category)} · ` : ""}${STORE.name}`;
  // Short text under the title, from the product's "description"
  if (p.description) {
    $("#pDesc").textContent = T(p.description);
    $("#pDesc").hidden = false;
  }
  // Extra badges for this product only, e.g. "🎁 Gift box included"
  (p.perks || []).forEach((text) => {
    $(".buy__perks").insertAdjacentHTML("beforeend", `<li>${esc(T(text))}</li>`);
  });

  // Delivery timeline with real dates, for products with "timeline": [ship days, delivery from, delivery to]
  // e.g. [1, 1, 3]: ordered today → on its way tomorrow → delivered between day +1 and +3
  if (p.timeline) {
    const [ship, from, to] = p.timeline;
    const loc = { sw: "sw-TZ", es: "es-SV" }[LANG] || "en-GB";
    const d = (n) => new Date(Date.now() + n * 864e5).toLocaleDateString(loc, { day: "numeric", month: "short" });
    $(".buy__perks").insertAdjacentHTML("afterend", `
      <ol class="eta">
        <li><span>🛒</span><strong>${T("Ordered")}</strong><small>${d(0)}</small></li>
        <li><span>🚚</span><strong>${T("On its way")}</strong><small>${d(ship)}</small></li>
        <li><span>📦</span><strong>${T("Delivered")}</strong><small>${d(from)} – ${d(to)}</small></li>
      </ol>`);
  }

  /* ---------- Gallery ---------- */
  let current = 0;
  function showImage(i) {
    current = (i + images.length) % images.length; // the arrows loop from the last photo to the first
    i = current;
    $("#galleryMain").classList.remove("is-empty");
    $("#galleryMain").innerHTML = `<img src="${esc(images[i])}" alt="${esc(p.name)}"
      onerror="this.parentElement.classList.add('is-empty'); this.parentElement.textContent = '${esc(p.icon || "")}';" />`;
    document.querySelectorAll(".thumb").forEach((t) => t.classList.toggle("is-active", Number(t.dataset.img) === i));
    $("#galleryCount").textContent = `${i + 1} / ${images.length}`;
  }
  if (images.length > 1) {
    // A thumbnail whose photo is missing is removed; a single remaining thumbnail is hidden too.
    $("#galleryThumbs").innerHTML = images.map((src, i) => `
      <button type="button" class="thumb" data-img="${i}" aria-label="${T("Photo {n}", { n: i + 1 })}">
        <img src="${esc(src)}" alt="" onerror="const box = this.closest('.gallery__thumbs'); this.parentElement.remove(); if (box.children.length < 2) box.innerHTML = '';" />
      </button>`).join("");
    // ‹ › arrows on the big photo, and swipe left / right on phones
    $("#galleryPrev").hidden = $("#galleryNext").hidden = $("#galleryCount").hidden = false;
    $("#galleryPrev").addEventListener("click", () => showImage(current - 1));
    $("#galleryNext").addEventListener("click", () => showImage(current + 1));
    let startX = null;
    $("#galleryMain").addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    $("#galleryMain").addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (startX !== null && Math.abs(dx) > 40) showImage(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }
  showImage(0);

  /* ---------- Photos with their explanation ---------- */
  // From the product's "sections"; without them, one section with the second photo and the description.
  const L = p.landing || {};
  const sections = p.sections?.length ? p.sections : [{
    image: images[1] || p.image,
    title: join(L.showcaseTitle) || p.name,
    text: L.showcaseText || p.description,
    list: L.showcaseList,
  }];
  // A section without "image" is shown as text only. Swahili texts: js/i18n.js
  // An .mp4 "image" plays as a silent looping video (much lighter than a GIF);
  // the .jpg with the same name is shown while it loads.
  const media = (s) => /\.mp4$/i.test(s.image)
    ? `<video src="${esc(s.image)}" poster="${esc(s.image.replace(/\.mp4$/i, ".jpg"))}" autoplay muted loop playsinline preload="metadata" aria-label="${esc(T(s.title))}"></video>`
    : `<img src="${esc(s.image)}" alt="${esc(T(s.title))}" loading="lazy" onerror="this.remove()" />`;
  if (p.layout === "simple") {
    // layout: "simple" — like the big COD shops: 3 trust icons under the title, the order form
    // straight after, then big photos one under the other, each with a short "Title: text" line.
    document.body.classList.add("layout-simple");
    $("#pDesc").insertAdjacentHTML("afterend", `
      <ul class="trust3">
        <li><span>⭐</span>${T("Quality checked")}</li>
        <li><span>🔄</span>${T("30-day replacement")}</li>
        <li><span>🚚</span>${T("Free delivery")}</li>
      </ul>`);
    $("#story").innerHTML = `
      <section class="wrap simple-story">
        <p class="simple-story__intro">${T("100% free delivery")}<br>${T("Pay on delivery and quality guarantee")}</p>
        ${sections.map((s) => `
          <figure>
            ${s.image ? media(s) : ""}
            <figcaption>${s.title ? `<strong>${esc(T(s.title))}:</strong> ` : ""}${esc(T(s.text || ""))}</figcaption>
          </figure>`).join("")}
        <a href="#order" class="btn btn--big">${T("Order now · Pay on delivery")}</a>
      </section>`;
  } else {
    $("#story").innerHTML = sections.map((s) => `
      <section class="wrap about${s.image ? "" : " about--text"}">
        ${s.image ? `<div class="about__media">${media(s)}</div>` : ""}
        <div class="about__text">
          <h2>${esc(T(s.title))}</h2>
          <p>${esc(T(s.text))}</p>
          ${s.list?.length ? `<ul class="checks">${s.list.map((li) => `<li>${esc(T(li))}</li>`).join("")}</ul>` : ""}
          <a href="#order" class="btn">${T("Order now · Pay on delivery")}</a>
        </div>
      </section>`).join("");
  }

  /* ---------- Real photos of the product (taken in stock) ---------- */
  if (p.realPhotos?.length) {
    $("#realGrid").innerHTML = p.realPhotos.map((src) =>
      `<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()" />`).join("");
    // realText: another sentence under the title (the default one says "taken in our stock")
    if (p.realText) $("#real .muted").textContent = T(p.realText);
    $("#real").hidden = false;
  }

  /* ---------- Extra landing blocks (optional, from products.js) ----------
     problem / solution: { title, text }   → two cards before the photos
     benefits: [{ icon, title, text }]     → icon grid before the photos
     steps: [{ title, text }]              → "How to use it" after the photos
     specs: { "Label": "value" }           → table after the photos
     faq: [{ q, a }]                       → added on top of the questions
     headline: "Big title"                  → banner before everything else
     inBox: ["…"]                           → "What's in the box" after the photos
     warning: "…"                           → ⚠️ "Important" box after the photos */
  if (p.layout === "ritual") {
    // layout: "ritual" — feature cards before the offers, timeline in a card, open "about" panel and
    // accordions, lavender band with big graphics, comparison table, FAQ, numbered cards.
    document.body.classList.add("layout-ritual");
    const E = (s) => esc(T(s));
    if (p.eyebrow) $("#pCat").textContent = T(p.eyebrow);
    $("#pDesc").hidden = true;
    $("#order").insertAdjacentHTML("beforebegin", `
      <ul class="rt-features">${(p.features || []).map((f) => `
        <li><span>${E(f.mark)}</span><strong>${E(f.title)}</strong><small>${E(f.text)}</small></li>`).join("")}
      </ul>`);
    const below = document.createElement("div");
    below.className = "buy__after";
    [".buy__check", ".buy__perks", ".eta"].forEach((s) => { const el = $(s); if (el) below.appendChild(el); });
    $("#order").after(below);
    const panel = (title, body, open) => `<details class="rt-acc"${open ? " open" : ""}><summary>${E(title)}</summary>${body}</details>`;
    const a = p.about || {}, b = p.band, c = p.compare;
    $("#story").innerHTML = `
      <section class="wrap rt-info">
        ${panel(a.title, `
          <p><strong>${E(a.lead)}</strong></p><p>${E(a.text)}</p>
          <h3>${E("Por qué te va a gustar")}</h3>
          <ul>${(p.why || []).map((w) => `<li><strong>${E(w.title)}:</strong> ${E(w.text)}</li>`).join("")}</ul>
          <h3>${E("Información importante")}</h3><p>${E(p.warning)}</p>`, true)}
        ${(p.accordions || []).map((x) => panel(x.title, `<p>${E(x.text)}</p>`)).join("")}
      </section>
      ${b ? `<section class="rt-band"><div class="wrap">
        <p class="rt-eye">${E(b.eyebrow)}</p><h2>${E(b.title)}</h2><p class="rt-sub">${E(b.text)}</p>
        ${b.images.map((src) => `<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()" />`).join("")}
      </div></section>` : ""}
      ${p.video ? `<section class="wrap rt-video"><h2>${E(p.video.title)}</h2>
        <video src="${esc(p.video.src)}" poster="${esc(p.video.src.replace(/\.mp4$/i, ".jpg"))}" autoplay muted loop playsinline preload="metadata" aria-label="${E(p.video.title)}"></video>
      </section>` : ""}
      ${c ? `<section class="wrap rt-compare">
        <p class="rt-eye">${E(c.eyebrow)}</p><h2>${E(c.title)}</h2>
        <table><thead><tr>${c.head.map((h) => `<th>${E(h)}</th>`).join("")}</tr></thead>
        <tbody>${c.rows.map(([k, v]) => `<tr><td>${E(k)}</td><td class="rt-yes">✓</td><td>${E(v)}</td></tr>`).join("")}</tbody></table>
      </section>` : ""}`;
    if (p.cards) $("#faq").insertAdjacentHTML("afterend", `
      <section class="rt-band rt-cards"><div class="wrap">
        <p class="rt-eye">${E(p.cards.eyebrow)}</p><h2>${E(p.cards.title)}</h2><p class="rt-sub">${E(p.cards.text)}</p>
        ${p.cards.items.map((x, i) => `<article><small>0${i + 1}</small><h3>${E(x.title)}</h3><p>${E(x.text)}</p></article>`).join("")}
      </div></section>`);
  } else if (p.layout === "glam") {
    // layout: "glam" — pink and dark blocks like the user's creatine reference page: customer videos,
    // big stat, "tap a card" watch, how it works, myths to flip, nutrition table, 60-day route with a
    // 1 / 2 jar switch, feature cards around a round video, "is it for me?" cards, safe purchase.
    document.body.classList.add("layout-glam");
    const E = (s) => esc(T(s));
    const two = (t) => `${E(t[0])} <em>${E(t[1])}</em>`; // title with its pink part
    const eye = (s, dark) => `<p class="gl-eye${dark ? " gl-eye--dark" : ""}">${E(s)}</p>`;
    const vid = (src, cls = "") => `<video class="${cls}" src="${esc(src)}" poster="${esc(src.replace(/\.mp4$/i, ".jpg"))}" muted loop playsinline preload="none"></video>`;
    if (p.promo) $("#pName").insertAdjacentHTML("beforebegin", `<p class="gl-promo">🎉 ${E(p.promo)}</p>`);
    const below = document.createElement("div");
    below.className = "buy__after";
    ["#pDesc", ".buy__hot", ".buy__check", ".buy__perks", ".eta"].forEach((s) => { const el = $(s); if (el) below.appendChild(el); });
    $("#order").after(below);
    $("#pDesc").hidden = true;
    $("#pName").insertAdjacentHTML("afterend", `<p class="gl-sub">${E(p.description)}</p>`);

    const s = p.stat, pa = p.pains, h = p.how, m = p.myths, n = p.nutrition, r = p.route, sp = p.special, ide = p.ideal, sf = p.safe;
    const parts = [];
    if (p.videos?.length) parts.push(`
      <section class="gl-videos"><div class="gl-videos__row">${p.videos.map((v) => `
        <figure>${vid(v)}<button type="button" class="gl-sound" aria-label="${E("Sonido")}">🔇</button></figure>`).join("")}
      </div></section>`);
    if (s) parts.push(`
      <section class="gl-dark"><div class="wrap gl-stat">
        ${eye(s.eyebrow, true)}
        <p class="gl-stat__big"><small>${E(s.before)}</small><b>${E(s.value)}<sup>${E(s.unit)}</sup></b><small class="is-strong">${E(s.after)}</small></p>
        <h2>${E(s.text).replace(E(s.highlight), `<u>${E(s.highlight)}</u>`)}</h2>
        <div class="gl-vs">
          ${[s.him, s.her].map((x) => `<figure${x.badge ? ' class="is-her"' : ""}><div><img src="${esc(x.image)}" alt="" loading="lazy" />${x.badge ? `<span>${E(x.badge)}<small>${E("de reservas")}</small></span>` : ""}</div>
            <figcaption><strong>${E(x.label)}</strong><small>${E(x.note)}</small></figcaption></figure>`).join("")}
        </div>
        ${s.lines.map((l, i) => `<p class="gl-line${i ? " is-pink" : ""}">${E(l)}</p>`).join("")}
        <p class="gl-source">${E(s.source)}</p>
      </div></section>`);
    if (pa) parts.push(`
      <section class="gl-light"><div class="wrap gl-pains">
        ${eye(pa.eyebrow)}<h2 class="gl-title">${two(pa.title)}</h2><p class="gl-text">${E(pa.text)}</p>
        <div class="gl-watch" aria-live="polite"><div class="gl-watch__screen">
          <span class="gl-watch__label" id="glWLabel"></span><span class="gl-watch__time">6:45</span>
          <div class="gl-watch__ring"><b id="glWValue"></b><small id="glWSmall"></small></div>
          <p id="glWCaption"></p>
        </div></div>
        <div class="gl-cards">${pa.items.map((x, i) => `
          <button type="button" class="gl-card${i === 1 ? " is-on" : ""}" data-pain="${i}"><small>0${i + 1}</small><span>${esc(x.icon)}</span><strong>${E(x.title)}</strong></button>`).join("")}
        </div>
        <p class="gl-strike">✕ <s>${E(pa.strike)}</s></p>
        <h2 class="gl-title gl-title--dark">${two(pa.answer)}</h2>
        <div class="gl-battery" aria-hidden="true"><i></i></div>
        <a href="#glHow" class="btn gl-btn">${E(pa.button)} ↓</a>
      </div></section>`);
    if (h) parts.push(`
      <section class="gl-dark" id="glHow"><div class="wrap gl-how">
        ${eye(h.eyebrow, true)}<h2 class="gl-title gl-title--white">${two(h.title)}</h2><p class="gl-text">${E(h.text)}</p>
        <ol>${h.steps.map((x) => `<li><span class="gl-how__icon">${esc(x.icon)}</span><div><strong>${E(x.title)}</strong><p>${E(x.text)}</p><small>${E(x.tag)}</small></div></li>`).join("")}</ol>
        <p class="gl-formula">${h.formula.map((x, i) => `<span${i === h.formula.length - 1 ? ' class="is-pink"' : ""}>${E(x)}</span>`).join(`<b>+</b>`).replace(/<b>\+<\/b>(?=<span class="is-pink")/, "<b>=</b>")}</p>
        <p class="gl-note">${E(h.note)}</p>
      </div></section>`);
    if (m) parts.push(`
      <section class="gl-light"><div class="wrap gl-myths">
        ${eye(m.eyebrow)}<h2 class="gl-title gl-title--plain">${E(m.title[0])} <em class="gl-script">${E(m.title[1])}</em></h2><p class="gl-text">${E(m.text)}</p>
        <p class="gl-count"><span id="glHearts">${"♡".repeat(m.items.length)}</span> <b id="glDone">0</b>/${m.items.length} ${E("mitos desmentidos")}</p>
        ${m.items.map((x, i) => `
          <button type="button" class="gl-myth" data-myth="${i}">
            <span class="gl-myth__x">✕</span>
            <span class="gl-myth__body"><small>${E("Mito")} 0${i + 1}</small><strong>${E(x.myth)}</strong>
              <span class="gl-myth__truth"><b>${E("Realidad")}:</b> ${E(x.truth)}</span></span>
          </button>`).join("")}
        <button type="button" class="gl-ghost" id="glAllMyths">${E(m.button)}</button>
      </div></section>`);
    if (n) parts.push(`
      <section class="wrap gl-nutri">
        ${eye(n.eyebrow)}<h2 class="gl-title gl-title--plain">${E(n.title)}</h2>
        <div class="gl-label"><h3>${E(n.head)}</h3><p>${E(n.serving)}</p>
          <div class="gl-label__head"><span>${E("Contenido")}</span><span>${E("Por porción")}</span></div>
          ${n.rows.map(([a, b]) => `<div class="gl-label__row"><i></i><strong>${E(a)}</strong><small>${E(b)}</small></div>`).join("")}
          <div class="gl-label__foot"><span>${E(n.sugar[0])}</span><strong>${E(n.sugar[1])}</strong></div>
        </div>
        <div class="gl-chips">${n.chips.map(([i, t]) => `<span><b>${esc(i)}</b>${E(t)}</span>`).join("")}</div>
        <p class="gl-gift">🎁 ${E(n.gift)}</p>
      </section>`);
    if (r) parts.push(`
      <section class="gl-dark"><div class="wrap gl-route">
        ${eye(r.eyebrow, true)}<h2 class="gl-title gl-title--white">${two(r.title)}</h2><p class="gl-text">${E(r.text)}</p>
        <div class="gl-switch" role="group"><button type="button" data-jars="1">${E("Con 1 tarro")}</button><button type="button" data-jars="2" class="is-on">${E("Con 2 tarros")}</button></div>
        <div class="gl-weeks" id="glWeeks">
          <div class="gl-weeks__days"><span>${E("Día 1")}</span><span>${E("Día 30")}</span><span>${E("Día 60")}</span></div>
          <div class="gl-weeks__row">${Array.from({ length: 8 }, (_, i) => `<span class="${i < 4 ? "is-1" : "is-2"}">S${i + 1}</span>`).join("")}</div>
          <div class="gl-weeks__jars"><span class="is-1">🫙 ${E("Tarro 1")}</span><span class="is-2" data-on="🫙 ${E("Tarro 2")}" data-off="🔒 ${E("Sin tarro 2")}">🫙 ${E("Tarro 2")}</span></div>
        </div>
        <ol class="gl-phases">${r.phases.map((x, i) => `<li data-phase="${i}"><span>${esc(x.icon)}</span><div><small>📅 ${E(x.weeks)}</small><strong>${E(x.text)}</strong>${i ? `<i class="gl-cut">${i === 1 ? `⚠️ ${E("Se corta")}` : `🔒 ${E("No llegas")}`}</i>` : ""}</div></li>`).join("")}</ol>
        <blockquote class="gl-quote">🫙🫙 <span>${E(r.quote)}<small>${E(r.quoteSmall)}</small></span></blockquote>
        <p class="gl-note">${E(r.note)}</p>
      </div></section>`);
    if (sp) parts.push(`
      <section class="wrap gl-special">
        ${eye(sp.eyebrow)}<h2 class="gl-title gl-title--plain">${E(sp.title[0])} <em class="gl-script">${E(sp.title[1])}</em></h2>
        <div class="gl-orbit">${vid(sp.video)}<span class="gl-orbit__badge"><small>${E(sp.badge[0])}</small>${E(sp.badge[1])}</span><span class="gl-orbit__tag">${E(sp.tag)}</span></div>
        <div class="gl-feats">${sp.items.map(([i, t, x]) => `<article><span>${esc(i)}</span><strong>${E(t)}</strong><p>${E(x)}</p></article>`).join("")}</div>
        <p class="gl-note gl-note--dark">${E(sp.note)}</p>
      </section>`);
    if (ide) parts.push(`
      <section class="wrap gl-ideal">
        ${eye(ide.eyebrow)}<h2 class="gl-title gl-title--plain">${E(ide.title[0])} <em class="gl-script">${E(ide.title[1])}</em></h2><p class="gl-text">${E(ide.text)}</p>
        <div class="gl-ideal__grid">${ide.items.map(([i, t, x]) => `
          <button type="button" class="gl-ideal__card"><span class="gl-ideal__icon">${esc(i)}</span><em>${E(ide.chosen)}</em><strong>${E(t)}</strong><small>${E(x)}</small></button>`).join("")}
        </div>
        <p class="gl-note gl-note--dark">${E(ide.note)}</p>
      </section>`);
    if (sf) parts.push(`
      <section class="wrap gl-safe">
        ${eye(sf.eyebrow)}<h2 class="gl-title gl-title--plain">${E(sf.title[0])} <em>${E(sf.title[1])}</em></h2>
        <div class="gl-safe__grid">${sf.items.map(([i, t, x]) => `<div><span>${esc(i)}</span><strong>${E(t)}</strong><small>${E(x)}</small></div>`).join("")}</div>
        <h3>${E(sf.stepsTitle)}</h3>
        <ol>${sf.steps.map((x) => `<li>${E(x)}</li>`).join("")}</ol>
      </section>`);
    if (p.warning) parts.push(`<section class="wrap warn gl-warn"><strong>⚠️ ${T("Important")}</strong><p>${E(p.warning)}</p></section>`);
    $("#story").innerHTML = parts.join("");
    if (p.finalCta) $("#faq").insertAdjacentHTML("afterend", `
      <section class="wrap gl-final"><a href="#order" class="gl-final__box">
        <span>${E(p.finalCta[0])}</span><strong>${E(p.finalCta[1])}</strong><small>${E(p.finalCta[2])}</small>
        <b class="btn btn--big">${T("Order now · {price}", { price: fmt(offers[offers.length - 1].price) })}</b>
      </a></section>`);

    // Videos: load and play only when on screen (they are heavy); 🔇 button = sound on / off
    const vids = document.querySelectorAll("#story video");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((ens) => ens.forEach((en) => {
        if (en.isIntersecting) en.target.play().catch(() => {}); else en.target.pause();
      }), { threshold: .35 });
      vids.forEach((v) => io.observe(v));
    } else vids.forEach((v) => { v.preload = "metadata"; v.autoplay = true; });
    document.querySelectorAll(".gl-sound").forEach((b) => b.addEventListener("click", () => {
      const v = b.previousElementSibling;
      const on = v.muted;
      vids.forEach((x) => { x.muted = true; });
      document.querySelectorAll(".gl-sound").forEach((x) => { x.textContent = "🔇"; });
      v.muted = !on;
      b.textContent = on ? "🔊" : "🔇";
      if (on) v.play().catch(() => {});
    }));
    // Watch: the card tapped shows its number
    const showPain = (i) => {
      const x = pa.items[i];
      $("#glWLabel").textContent = T(x.label);
      $("#glWValue").textContent = T(x.value);
      $("#glWSmall").textContent = x.small ? T(x.small) : "";
      $("#glWCaption").textContent = T(x.caption);
      document.querySelectorAll(".gl-card").forEach((c) => c.classList.toggle("is-on", Number(c.dataset.pain) === i));
    };
    if (pa) {
      showPain(1);
      document.querySelectorAll(".gl-card").forEach((c) => c.addEventListener("click", () => showPain(Number(c.dataset.pain))));
    }
    // Myths: tap = the truth, the hearts fill up
    const flip = (b) => {
      b.classList.add("is-open");
      const done = document.querySelectorAll(".gl-myth.is-open").length;
      $("#glDone").textContent = done;
      $("#glHearts").textContent = "♥".repeat(done) + "♡".repeat(m.items.length - done);
    };
    document.querySelectorAll(".gl-myth").forEach((b) => b.addEventListener("click", () => flip(b)));
    $("#glAllMyths")?.addEventListener("click", () => document.querySelectorAll(".gl-myth").forEach(flip));
    // Route: 1 jar = weeks 5-8 cut off
    document.querySelectorAll("[data-jars]").forEach((b) => b.addEventListener("click", () => {
      const one = b.dataset.jars === "1";
      document.querySelectorAll("[data-jars]").forEach((x) => x.classList.toggle("is-on", x === b));
      $("#glWeeks").classList.toggle("is-one", one);
      document.querySelector(".gl-route").classList.toggle("is-one", one);
      const jar2 = document.querySelector(".gl-weeks__jars .is-2");
      jar2.textContent = one ? jar2.dataset.off : jar2.dataset.on;
    }));
    // "Is it for me?": tap to choose
    document.querySelectorAll(".gl-ideal__card").forEach((c) => c.addEventListener("click", () => c.classList.toggle("is-on")));
  } else if (p.layout === "story") {
    // layout: "story" — one long centred column like the big COD landing pages: big uppercase
    // titles, text, full-width photos, ✓ lists, ⚠️ box, what's in the box. Same product fields.
    document.body.classList.add("layout-story");
    // The order form comes right after the price: description, "selling fast", perks and the
    // delivery timeline move under the form.
    const below = document.createElement("div");
    below.className = "buy__after";
    ["#pDesc", ".buy__hot", ".buy__check", ".buy__perks", ".eta"].forEach((s) => { const el = $(s); if (el) below.appendChild(el); });
    $("#order").after(below);
    const H = (s, cls = "") => `<h2 class="st-h${cls}">${esc(T(s))}</h2>`;
    const P = (s) => `<p>${esc(T(s))}</p>`;
    const list = (items) => `<ul class="st-list">${items.join("")}</ul>`;
    const parts = [];
    if (p.headline) parts.push(H(p.headline, " st-h--big"), p.subheadline ? `<p class="st-lead">${esc(T(p.subheadline))}</p>` : "");
    if (p.problem) parts.push(H(p.problem.title), P(p.problem.text));
    if (p.solution) parts.push(`<p><strong>${esc(T(p.solution.title))}.</strong> ${esc(T(p.solution.text))}</p>`);
    // Extra blocks slotted in after the 1st, 2nd, 3rd and 4th photo
    const extras = [
      p.benefits?.length ? H("Benefits") + list(p.benefits.map((x) => `<li><strong>${esc(T(x.title))}:</strong> ${esc(T(x.text))}</li>`)) : "",
      p.steps?.length ? H("How does it work?") + `<ol class="st-steps">${p.steps.map((x) => `<li><strong>${esc(T(x.title))}</strong> ${esc(T(x.text))}</li>`).join("")}</ol>` : "",
      p.warning ? `<div class="st-warn">${H("⚠️ Important ⚠️")}${P(p.warning)}</div>` : "",
      Object.keys(p.specs || {}).length ? H("Specifications") + `<dl class="st-specs">${Object.entries(p.specs).map(([k, v]) => `<div><dt>${esc(T(k))}</dt><dd>${esc(T(v))}</dd></div>`).join("")}</dl>` : "",
    ];
    sections.forEach((s, i) => {
      parts.push(s.image ? `<figure class="st-img">${media(s)}</figure>` : "", H(s.title), P(s.text || ""));
      if (s.list?.length) parts.push(list(s.list.map((x) => `<li>${esc(T(x))}</li>`)));
      if (extras[i]) { parts.push(extras[i]); extras[i] = ""; }
    });
    parts.push(...extras);
    if (p.inBox?.length) parts.push(H("What's in the box"), list(p.inBox.map((x) => `<li>${esc(T(x))}</li>`)));
    $("#story").innerHTML = `
      <section class="wrap story">
        ${parts.join("")}
        <a href="#order" class="btn btn--big">${T("Order now · Pay on delivery")}</a>
      </section>`;
  } else {
    const before = [], after = [];
    if (p.headline) before.push(`
      <section class="wrap headline"><h2>${esc(T(p.headline))}</h2>${p.subheadline ? `<p>${esc(T(p.subheadline))}</p>` : ""}</section>`);
    if (p.problem && p.solution) before.push(`
      <section class="wrap ps">
        <div class="ps__card ps__card--problem"><p class="label">${T("The problem")}</p><h2>${esc(T(p.problem.title))}</h2><p>${esc(T(p.problem.text))}</p></div>
        <div class="ps__card ps__card--solution"><p class="label">${T("The solution")}</p><h2>${esc(T(p.solution.title))}</h2><p>${esc(T(p.solution.text))}</p>
          <a href="#order" class="btn btn--line">${T("Order now · Pay on delivery")}</a></div>
      </section>`);
    if (p.benefits?.length) before.push(`
      <section class="wrap benefits">
        <p class="label label--center">${T("Why you'll love it")}</p>
        <div class="benefits__grid">${p.benefits.map((b) => `
          <article><span class="benefits__icon" aria-hidden="true">${esc(b.icon || "✓")}</span><h3>${esc(T(b.title))}</h3><p>${esc(T(b.text))}</p></article>`).join("")}
        </div>
      </section>`);
    if (p.steps?.length) after.push(`
      <section class="wrap steps3">
        <p class="label label--center">${T("How it works")}</p>
        <h2>${T("Easy to use, in 3 steps")}</h2>
        <ol>${p.steps.map((s, i) => `<li><span>${i + 1}</span><h3>${esc(T(s.title))}</h3><p>${esc(T(s.text))}</p></li>`).join("")}</ol>
      </section>`);
    if (p.inBox?.length) after.push(`
      <section class="wrap inbox">
        <p class="label label--center">${T("What's in the box")}</p>
        <ul>${p.inBox.map((x) => `<li>✅ ${esc(T(x))}</li>`).join("")}</ul>
      </section>`);
    if (p.warning) after.push(`
      <section class="wrap warn"><strong>⚠️ ${T("Important")}</strong><p>${esc(T(p.warning))}</p></section>`);
    const specs = Object.entries(p.specs || {});
    if (specs.length) after.push(`
      <section class="wrap specs">
        <p class="label label--center">${T("Specifications")}</p>
        <dl>${specs.map(([k, v]) => `<div><dt>${esc(T(k))}</dt><dd>${esc(T(v))}</dd></div>`).join("")}</dl>
      </section>`);
    $("#story").insertAdjacentHTML("beforebegin", before.join(""));
    $("#real").insertAdjacentHTML("afterend", after.join(""));
  }
  if (p.faq?.length) {
    $("#faq h2").insertAdjacentHTML("afterend", p.faq.map((f) =>
      `<details><summary>${esc(T(f.q))}</summary><p>${esc(T(f.a))}</p></details>`).join(""));
  }

  /* ---------- Offers ---------- */
  // Small product photos, one per piece (max 3), shown in each offer
  const thumbs = (qty) => `<span class="offer__pics">${
    Array.from({ length: Math.min(qty, 3) }, () => `<img src="${esc(p.image)}" alt="" />`).join("")}</span>`;

  function renderOffers() {
    $("#offers").innerHTML = offers.map((o, i) => {
      const save = unitFull * o.qty - o.price;
      const note = o.qty > 1
        ? `${save > 0 ? `<span>${T("Save {amount}", { amount: fmt(save) })}</span><br>` : ""}<span>${T("{price} each", { price: fmt(Number.isInteger(o.price) ? Math.round(o.price / o.qty) : o.price / o.qty) })}</span>`
        : T("Perfect for you");
      return `
      <label class="offer ${i === offerIndex ? "is-active" : ""}">
        <input type="radio" name="offer" value="${i}" ${i === offerIndex ? "checked" : ""} />
        <span class="offer__dot"></span>
        ${thumbs(o.qty)}
        <span class="offer__main">
          <strong>${esc(o.label ? T(o.label) : T(o.qty > 1 ? "{n} pieces" : "{n} piece", { n: o.qty }))}</strong>
          <small${save > 0 ? ' class="is-save"' : ""}>${note}</small>
        </span>
        <span class="offer__price">${fmt(o.price)}${save > 0 ? `<s>${fmt(unitFull * o.qty)}</s>` : ""}</span>
        ${o.tag ? `<span class="offer__tag">${esc(T(o.tag))}</span>` : ""}
      </label>`;
    }).join("");
  }

  // Big price under the title follows the chosen offer, with the saving
  const renderPrice = () => {
    const o = offer();
    const full = unitFull * o.qty;
    const save = full - o.price;
    $("#pPrice").innerHTML = `<strong>${fmt(o.price)}</strong>${save > 0
      ? `<s>${fmt(full)}</s><span class="buy__save">${T("Save {amount}", { amount: fmt(save) })}</span>` : ""}`;
  };

  // Order summary inside the form
  const renderRecap = () => {
    const o = offer();
    const save = unitFull * o.qty - o.price;
    $("#recap").innerHTML = `
      <div><span>${esc(p.name)} × ${o.qty}</span><span>${fmt(unitFull * o.qty)}</span></div>
      ${save > 0 ? `<div class="recap__save"><span>${T("You save")}</span><span>− ${fmt(save)}</span></div>` : ""}
      <div><span>${T("Delivery")}</span><span class="recap__free">${T("FREE")}</span></div>
      <div class="recap__total"><span>${T("Total to pay on delivery")}</span><strong>${fmt(o.price)}</strong></div>`;
  };

  const renderButton = () => {
    renderPrice();
    renderRecap();
    const label = T("Order now · {price}", { price: fmt(offer().price) });
    ["#submitBtn", "#sticky", "#closingOrder"].forEach((s) => { $(s).textContent = label; });
  };

  $("#offers").addEventListener("change", (e) => {
    offerIndex = Number(e.target.value);
    document.querySelectorAll(".offer").forEach((el, i) => el.classList.toggle("is-active", i === offerIndex));
    renderButton();
    renderSizes();
  });

  /* ---------- Sizes (products with "sizes"): one choice per piece ---------- */
  // sizeWord: what is chosen, "size" by default (e.g. "color" for ["Gold", "Silver"])
  const sizeWord = p.sizeWord || "size";
  const chosenSizes = [];
  function renderSizes() {
    if (!p.sizes?.length) return;
    const qty = offer().qty;
    $("#sizeRows").innerHTML = Array.from({ length: qty }, (_, n) => `
      <div class="sizes__row" role="radiogroup" aria-label="${esc(`${T(`Choose your ${sizeWord}`)} · ${T("Piece {n}", { n: n + 1 })}`)}">
        ${qty > 1 ? `<span class="sizes__label">${T("Piece {n}", { n: n + 1 })}</span>` : ""}
        ${p.sizes.map((s) => `
          <label class="sizes__chip${chosenSizes[n] === s ? " is-active" : ""}">
            <input type="radio" name="size${n}" value="${esc(s)}"${chosenSizes[n] === s ? " checked" : ""} />${esc(s)}
          </label>`).join("")}
      </div>`).join("");
  }
  if (p.sizes?.length) {
    $("#sizePick").hidden = false;
    $("#sizePick h2").textContent = T(`Choose your ${sizeWord}`);
    $("#sizeRows").addEventListener("change", (e) => {
      const n = Number(e.target.name.slice(4));
      chosenSizes[n] = e.target.value;
      e.target.closest(".sizes__row").querySelectorAll(".sizes__chip").forEach((c) => c.classList.toggle("is-active", c.contains(e.target)));
      if (chosenSizes.slice(0, offer().qty).every(Boolean)) $("#sizeError").textContent = "";
    });
    const chart = p.sizeChart;
    if (chart) {
      $("#sizeGuide .size-guide__body").innerHTML = `
        ${chart.rows ? `<table>
          <thead><tr>${chart.columns.map((c) => `<th>${esc(T(c))}</th>`).join("")}</tr></thead>
          <tbody>${chart.rows.map((r) => `<tr>${r.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
        <p>${T("In cm, measured flat. Between two sizes? Choose the bigger one.")}</p>` : ""}
        ${chart.image ? `<img src="${esc(chart.image)}" alt="${esc(T("Size guide"))}" loading="lazy" onerror="this.remove()" />` : ""}`;
      $("#sizeGuide").hidden = false;
    }
  }
  // True when every piece of the chosen offer has a size; otherwise shows the error.
  function sizesOk() {
    if (!p.sizes?.length) return true;
    const ok = chosenSizes.slice(0, offer().qty).filter(Boolean).length === offer().qty;
    $("#sizeError").textContent = ok ? "" : T(`Please choose a ${sizeWord} for each piece.`);
    if (!ok) $("#sizePick").scrollIntoView({ behavior: "smooth", block: "center" });
    return ok;
  }

  // Region and landmark fields: only in the countries that have them (El Salvador).
  // The customer types the departamento and the city/municipio (no lists to pick from: user's choice).
  if (COUNTRY.regions) {
    const inp = document.createElement("input");
    inp.id = "region"; inp.name = "region"; inp.type = "text"; inp.required = true;
    inp.autocomplete = "address-level1";
    inp.placeholder = T("e.g. San Salvador");
    $("#region").replaceWith(inp);
  } else $("#regionField").remove();
  if (!COUNTRY.landmark) $("#landmarkField").remove();

  // One "City & delivery address" field, except in countries with splitAddress (Lebanon, El Salvador)
  if (!COUNTRY.splitAddress) {
    $("#cityField").remove();
    $("#addressLabel").textContent = T("City & delivery address");
    $("#address").placeholder = T("e.g. Dar es Salaam, Kinondoni, Mikocheni B");
  }

  /* ---------- Order ---------- */
  // FormStart: the visitor clicked into the order form for the first time (once per page view).
  // Compared with ViewContent and InitiateCheckout in Events Manager, it shows whether people
  // stop before the form (price, page) or inside it (form).
  $("#orderForm").addEventListener("focusin", () => {
    Pixel.custom("FormStart", { content_ids: [p.id], country: COUNTRY.id });
  }, { once: true });

  $("#orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = $("#submitBtn");
    if (btn.disabled) return;
    if (!sizesOk() || !validate(form)) {
      // FormError: which fields were refused (e.g. "phone,city"), to see where people get stuck
      const fields = [...form.querySelectorAll(".has-error input, .has-error select")].map((el) => el.name);
      if ($("#sizeError")?.textContent) fields.push("size");
      Pixel.custom("FormError", { fields: fields.join(",") || "unknown", content_ids: [p.id], country: COUNTRY.id });
      return;
    }

    Pixel.track("InitiateCheckout", Pixel.product(p, offer().qty, offer().price));
    // The sizes travel in the product name, so they show in the sheet (REF) and on Telegram
    const word = sizeWord[0].toUpperCase() + sizeWord.slice(1);
    const name = p.sizes?.length ? `${p.name} (${word}: ${chosenSizes.slice(0, offer().qty).join(", ")})` : p.name;
    const o = createOrder(form, { ...p, name }, offer().qty, offer().price);
    btn.disabled = true;
    btn.textContent = T("Sending your order…");
    $("#formError").hidden = true;
    try {
      await sendOrder(o);
    } catch {
      $("#formError").textContent = T("We couldn't send your order. Please check your internet connection and try again.");
      $("#formError").hidden = false;
      btn.disabled = false;
      renderButton();
      return;
    }
    // The product, quantity and total travel in the link too: the thank-you page can then send the
    // Purchase event even when this browser refuses to save the order (private mode, some in-app browsers)
    location.href = `thank-you?order=${encodeURIComponent(o.number)}&p=${encodeURIComponent(p.id)}&q=${o.product.qty}&v=${o.total}&country=${COUNTRY.id}`;
  });

  $("#orderForm").addEventListener("input", (e) => {
    if (e.target.closest(".has-error")) setError(e.target, "");
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest(".thumb");
    if (t) showImage(Number(t.dataset.img));
  });

  // Sticky button (phones): hidden while the order form is on screen.
  if ("IntersectionObserver" in window) {
    document.body.classList.add("has-sticky");
    new IntersectionObserver(([en]) => {
      $("#sticky").classList.toggle("is-visible", !en.isIntersecting);
    }).observe($("#order"));
  }

  /* ---------- Init ---------- */
  // The order button is disabled in the HTML until this script runs (slow connections)
  $("#submitBtn").disabled = false;
  Pixel.track("ViewContent", Pixel.product(p));
  renderOffers();
  renderButton();
  renderSizes();
  const wa = String(STORE.whatsapp || "").replace(/\D/g, "");
  if (wa) {
    $("#closingWa").href = `https://wa.me/${wa}?text=${encodeURIComponent(`${T(STORE.whatsappText || "")} ${p.name}`.trim())}`;
    $("#closingWa").hidden = false;
  }
  if (STORE.phone) {
    $("#footerPhone").href = `tel:+${STORE.phone}`;
    $("#footerPhone").textContent = `📞 ${STORE.phoneDisplay}`;
  } else $("#footerPhone").remove();
  $("#year").textContent = new Date().getFullYear();
})();
