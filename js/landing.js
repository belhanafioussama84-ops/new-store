/* Product page — product.html?id=<product id>, filled from PRODUCTS (js/products.js) */
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
        <p style="text-align:center"><a href="index.html" class="btn">${T("Back to shop")}</a></p>
      </section>`;
    $("#sticky").remove();
    return;
  }

  // The real photos (taken in stock) also go in the top gallery, after the product photos
  const images = [...(p.images?.length ? p.images : [p.image]), ...(p.realPhotos || [])];
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

  /* ---------- Real photos of the product (taken in stock) ---------- */
  if (p.realPhotos?.length) {
    $("#realGrid").innerHTML = p.realPhotos.map((src) =>
      `<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()" />`).join("");
    $("#real").hidden = false;
  }

  /* ---------- Offers ---------- */
  // Small product photos, one per piece (max 3), shown in each offer
  const thumbs = (qty) => `<span class="offer__pics">${
    Array.from({ length: Math.min(qty, 3) }, () => `<img src="${esc(p.image)}" alt="" />`).join("")}</span>`;

  function renderOffers() {
    $("#offers").innerHTML = offers.map((o, i) => {
      const save = unitFull * o.qty - o.price;
      const note = o.qty > 1
        ? `${save > 0 ? `${T("Save {amount}", { amount: fmt(save) })}<br>` : ""}${T("{price} each", { price: fmt(Math.round(o.price / o.qty)) })}`
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
  const chosenSizes = [];
  function renderSizes() {
    if (!p.sizes?.length) return;
    const qty = offer().qty;
    $("#sizeRows").innerHTML = Array.from({ length: qty }, (_, n) => `
      <div class="sizes__row" role="radiogroup" aria-label="${esc(T("Size of piece {n}", { n: n + 1 }))}">
        ${qty > 1 ? `<span class="sizes__label">${T("Piece {n}", { n: n + 1 })}</span>` : ""}
        ${p.sizes.map((s) => `
          <label class="sizes__chip${chosenSizes[n] === s ? " is-active" : ""}">
            <input type="radio" name="size${n}" value="${esc(s)}"${chosenSizes[n] === s ? " checked" : ""} />${esc(s)}
          </label>`).join("")}
      </div>`).join("");
  }
  if (p.sizes?.length) {
    $("#sizePick").hidden = false;
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
    $("#sizeError").textContent = ok ? "" : T("Please choose a size for each piece.");
    if (!ok) $("#sizePick").scrollIntoView({ behavior: "smooth", block: "center" });
    return ok;
  }

  /* ---------- Order ---------- */
  $("#orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = $("#submitBtn");
    if (btn.disabled || !sizesOk() || !validate(form)) return;

    Pixel.track("InitiateCheckout", Pixel.product(p, offer().qty, offer().price));
    // The sizes travel in the product name, so they show in the sheet (REF) and on Telegram
    const name = p.sizes?.length ? `${p.name} (Size: ${chosenSizes.slice(0, offer().qty).join(", ")})` : p.name;
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
    location.href = `thank-you.html?order=${encodeURIComponent(o.number)}`;
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
  Pixel.track("ViewContent", Pixel.product(p));
  renderOffers();
  renderButton();
  renderSizes();
  const wa = String(STORE.whatsapp || "").replace(/\D/g, "");
  if (wa) {
    $("#closingWa").href = `https://wa.me/${wa}?text=${encodeURIComponent(`${STORE.whatsappText || ""} ${p.name}`.trim())}`;
    $("#closingWa").hidden = false;
  }
  $("#footerPhone").href = `tel:+${STORE.phone}`;
  $("#footerPhone").textContent = `📞 ${STORE.phoneDisplay}`;
  $("#year").textContent = new Date().getFullYear();
})();
