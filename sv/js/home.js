/* Home page — everything comes from sv/config.js */
(() => {
  "use strict";
  const { $, esc, money, icon, products, card, faqHtml, trustItem, waLink, productUrl } = Shop;
  const S = CONFIG.shipping;

  // Hero: three product photos + points
  const heroProducts = products.filter((p) => p.featured).slice(0, 3);
  $("#heroVisual").innerHTML = heroProducts.map((p, i) => `
      <figure><a href="${productUrl(p)}" aria-label="${esc(p.name)}"><img src="${esc(p.images[0])}" alt="${esc(p.name)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} width="600" height="750" /></a></figure>`).join("") +
    `<div class="hero__badge">${icon("cash")}<div><strong>Pago al recibir</strong>Sin tarjeta, sin adelantos</div></div>`;
  $("#heroPoints").innerHTML = [
    ["truck", S.nationwide ? "Envíos a todo El Salvador" : "Envíos en El Salvador"],
    ["phone", "Confirmación por teléfono"],
    ["shield", "Compra segura"],
  ].map(([ic, t]) => `<span>${icon(ic)}${esc(t)}</span>`).join("");

  $("#trustRow").innerHTML = [
    trustItem("cash", "Pago contra entrega", "Pagas en efectivo al recibir"),
    trustItem("truck", S.price ? `Entrega en ${S.time}` : "Envío gratis", S.nationwide ? "A los 14 departamentos" : `Entrega en ${S.time}`),
    trustItem("phone", "Te llamamos", "Confirmamos cada pedido"),
    trustItem("chat", "Atención por WhatsApp", "Respuesta rápida y personal"),
  ].join("");

  // Categories that have products
  const cats = CONFIG.categories.filter((c) => products.some((p) => p.category === c.id));
  $("#cats").innerHTML = cats.map((c) => `
    <a href="tienda.html?cat=${encodeURIComponent(c.id)}" class="cat reveal">
      <img src="${esc(c.image)}" alt="" loading="lazy" />
      <span class="cat__txt"><strong>${esc(c.name)}</strong><span>${esc(c.text)}</span></span>
    </a>`).join("");

  // Featured / best sellers
  const featured = products.filter((p) => p.featured);
  $("#featured").innerHTML = (featured.length ? featured : products).slice(0, 4).map(card).join("");
  const best = products.filter((p) => p.bestSeller);
  if (best.length) $("#best").innerHTML = best.slice(0, 4).map(card).join("");
  else $("#mas-vendidos").hidden = true;

  // Bundle offers
  const withOffers = products.filter((p) => (p.offers || []).some((o) => o.qty > 1)).slice(0, 4);
  if (withOffers.length) {
    $("#offers").innerHTML = withOffers.map((p) => {
      const tiers = p.offers.slice().sort((a, b) => a.qty - b.qty);
      const top = tiers[tiers.length - 1];
      const save = top.qty * p.price - top.price;
      return `
        <a href="${productUrl(p)}" class="offer-card reveal">
          <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" />
          <div>
            <h3>${esc(p.name)}</h3>
            <div class="tiers">${tiers.map((o) => `<span class="${o.tag ? "hot" : ""}">${o.qty} × ${money(o.price)}</span>`).join("")}</div>
            ${save > 0 ? `<p class="save">Ahorra hasta ${money(save)} llevando ${top.qty}</p>` : ""}
          </div>
        </a>`;
    }).join("");
  } else {
    $("#ofertas").hidden = true;
  }

  // Why us
  $("#why").innerHTML = [
    ["cash", "Pagas al recibir", "No pedimos tarjeta ni pagos por adelantado. Pagas en efectivo cuando tienes tu pedido."],
    ["sparkle", "Productos seleccionados", "Elegimos cada producto por su calidad, su diseño y su utilidad en tu día a día."],
    ["phone", "Confirmación personal", "Te llamamos para confirmar cada pedido. Una persona real, no un robot."],
    ["truck", "Entrega en todo el país", `Enviamos a los 14 departamentos. Entrega habitual en ${S.time}.`],
  ].map(([ic, t, d]) => `<div class="why__item reveal"><div class="why__icon">${icon(ic)}</div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join("");

  // Reviews: only real reviews from the products (none are invented)
  const all = products.flatMap((p) => (p.reviews || []).map((r) => ({ ...r, product: p })));
  $("#reviews").innerHTML = all.length
    ? `<div class="reviews">${all.slice(0, 6).map((r) => `
        <figure class="review reveal">
          ${Shop.stars(r.rating || 5)}
          <p>“${esc(r.text)}”</p>
          <footer><strong>${esc(r.name)}</strong>${r.city ? ` · ${esc(r.city)}` : ""} · <a href="${productUrl(r.product)}">${esc(r.product.name)}</a></footer>
        </figure>`).join("")}</div>`
    : `<div class="reviews-empty reveal">${icon("star")}
        <h3>Tu opinión construye nuestra tienda</h3>
        <p>Acabamos de llegar a El Salvador y solo publicamos opiniones reales de clientes que recibieron su pedido. ¿Ya compraste? Cuéntanos tu experiencia.</p>
        ${CONFIG.whatsapp ? `<a class="btn btn--ghost" href="${waLink("Hola, quiero dejar mi opinión sobre mi pedido:")}" target="_blank" rel="noopener">Dejar mi opinión</a>` : ""}
      </div>`;

  // Shipping
  $("#shipLead").textContent = `${Shop.shippingText()} Entregamos en ${S.time}${S.fastArea ? ` (${S.fastArea}: ${S.fastTime})` : ""}, y pagas en efectivo cuando recibes tu pedido.`;
  $("#shipFacts").innerHTML = [
    ["14", "departamentos con entrega"],
    [S.price ? money(S.price) : "Gratis", "costo de envío"],
    [S.time.replace(" horas", "h"), "tiempo de entrega"],
    ["$0", "pagas por adelantado"],
  ].map(([n, t]) => `<div><strong>${esc(n)}</strong><span>${esc(t)}</span></div>`).join("");

  // FAQ
  $("#faq").innerHTML = faqHtml(CONFIG.faq);
  const wa = $("#faqWa");
  if (CONFIG.whatsapp) wa.href = waLink("Hola, tengo una pregunta:"); else wa.hidden = true;

  // Structured data for search engines
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "OnlineStore", name: CONFIG.brand + " El Salvador",
    url: "https://dukaabora.store/sv/", areaServed: "SV", currenciesAccepted: "USD", paymentAccepted: "Cash",
  });
  document.head.appendChild(ld);
})();
