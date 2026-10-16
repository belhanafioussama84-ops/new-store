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
        <p style="text-align:center"><a href="index.html" class="btn">Back to shop</a></p>
      </section>`;
    $("#sticky").remove();
    return;
  }

  const images = p.images?.length ? p.images : [p.image];
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
  $("#pCat").textContent = `${p.category ? `${p.category} · ` : ""}${STORE.name}`;
  // Short text under the title, from the product's "description"
  if (p.description) {
    $("#pDesc").textContent = p.description;
    $("#pDesc").hidden = false;
  }

  /* ---------- Gallery ---------- */
  function showImage(i) {
    $("#galleryMain").classList.remove("is-empty");
    $("#galleryMain").innerHTML = `<img src="${esc(images[i])}" alt="${esc(p.name)}"
      onerror="this.parentElement.classList.add('is-empty'); this.parentElement.textContent = '${esc(p.icon || "")}';" />`;
    document.querySelectorAll(".thumb").forEach((t) => t.classList.toggle("is-active", Number(t.dataset.img) === i));
  }
  if (images.length > 1) {
    // A thumbnail whose photo is missing is removed; a single remaining thumbnail is hidden too.
    $("#galleryThumbs").innerHTML = images.map((src, i) => `
      <button type="button" class="thumb" data-img="${i}" aria-label="Photo ${i + 1}">
        <img src="${esc(src)}" alt="" onerror="const box = this.closest('.gallery__thumbs'); this.parentElement.remove(); if (box.children.length < 2) box.innerHTML = '';" />
      </button>`).join("");
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
  // A section without "image" is shown as text only.
  $("#story").innerHTML = sections.map((s) => `
    <section class="wrap about${s.image ? "" : " about--text"}">
      ${s.image ? `<div class="about__media"><img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy" onerror="this.remove()" /></div>` : ""}
      <div class="about__text">
        <h2>${esc(s.title)}</h2>
        <p>${esc(s.text)}</p>
        ${s.list?.length ? `<ul class="checks">${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : ""}
        <a href="#order" class="btn">Order now · Pay on delivery</a>
      </div>
    </section>`).join("");

  /* ---------- Offers ---------- */
  // Small product photos, one per piece (max 3), shown in each offer
  const thumbs = (qty) => `<span class="offer__pics">${
    Array.from({ length: Math.min(qty, 3) }, () => `<img src="${esc(p.image)}" alt="" />`).join("")}</span>`;

  function renderOffers() {
    $("#offers").innerHTML = offers.map((o, i) => {
      const save = unitFull * o.qty - o.price;
      const note = o.qty > 1
        ? `${save > 0 ? `Save ${fmt(save)}<br>` : ""}${fmt(Math.round(o.price / o.qty))} each`
        : "Perfect for you";
      return `
      <label class="offer ${i === offerIndex ? "is-active" : ""}">
        <input type="radio" name="offer" value="${i}" ${i === offerIndex ? "checked" : ""} />
        <span class="offer__dot"></span>
        ${thumbs(o.qty)}
        <span class="offer__main">
          <strong>${esc(o.label || `${o.qty} piece${o.qty > 1 ? "s" : ""}`)}</strong>
          <small${save > 0 ? ' class="is-save"' : ""}>${note}</small>
        </span>
        <span class="offer__price">${fmt(o.price)}${save > 0 ? `<s>${fmt(unitFull * o.qty)}</s>` : ""}</span>
        ${o.tag ? `<span class="offer__tag">${esc(o.tag)}</span>` : ""}
      </label>`;
    }).join("");
  }

  // Big price under the title follows the chosen offer, with the saving
  const renderPrice = () => {
    const o = offer();
    const full = unitFull * o.qty;
    const save = full - o.price;
    $("#pPrice").innerHTML = `<strong>${fmt(o.price)}</strong>${save > 0
      ? `<s>${fmt(full)}</s><span class="buy__save">Save ${fmt(save)}</span>` : ""}`;
  };

  const renderButton = () => {
    renderPrice();
    $("#submitBtn").textContent = `Order now · ${fmt(offer().price)}`;
    $("#sticky").textContent = `Order now · ${fmt(offer().price)}`;
  };

  $("#offers").addEventListener("change", (e) => {
    offerIndex = Number(e.target.value);
    document.querySelectorAll(".offer").forEach((el, i) => el.classList.toggle("is-active", i === offerIndex));
    renderButton();
  });

  /* ---------- Order ---------- */
  $("#orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = $("#submitBtn");
    if (btn.disabled || !validate(form)) return;

    Pixel.track("InitiateCheckout", Pixel.product(p, offer().qty, offer().price));
    const o = createOrder(form, p, offer().qty, offer().price);
    btn.disabled = true;
    btn.textContent = "Sending your order…";
    $("#formError").hidden = true;
    try {
      await sendOrder(o);
    } catch {
      $("#formError").textContent = "We couldn't send your order. Please check your internet connection and try again.";
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
  $("#footerPhone").href = `tel:+${STORE.phone}`;
  $("#footerPhone").textContent = `📞 ${STORE.phoneDisplay}`;
  $("#year").textContent = new Date().getFullYear();
})();
