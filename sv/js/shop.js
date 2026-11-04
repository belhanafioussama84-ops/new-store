/* El Salvador store — shared code for every page: cart, header, footer, cart drawer,
   WhatsApp button, Meta Pixel, product cards. Settings and products: sv/config.js */
const Shop = (() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => {
    const v = Math.round(Number(n || 0) * 100) / 100;
    return "$" + (Number.isInteger(v) ? v.toLocaleString("en-US") : v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };
  const storage = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  };
  const S = CONFIG.shipping;
  const fillText = (s) => String(s)
    .replace("{time}", S.time)
    .replace("{shippingText}", shippingText());
  function shippingText() {
    if (!S.price) return "El envío es gratis a todo El Salvador.";
    return `El envío cuesta ${money(S.price)} por pedido` + (S.freeFrom ? ` y es gratis en pedidos desde ${money(S.freeFrom)}.` : ".");
  }

  /* ---------------- Icons (inline SVG, stroke = currentColor) ---------------- */
  const ICONS = {
    truck: '<path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    chat: '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    watch: '<circle cx="12" cy="12" r="5.5"/><path d="M12 9.5V12l1.6 1.2M9 6.8 9.6 3h4.8l.6 3.8M9 17.2l.6 3.8h4.8l.6-3.8"/>',
    gift: '<rect x="3.5" y="9" width="17" height="11" rx="1"/><path d="M2.5 9h19v-3h-19zM12 6v14M12 6c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3.5-2-5 1"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    user: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
    feather: '<path d="M20 4c-8 0-14 6-14 14v2"/><path d="M6 14h7M9 10h8"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    wind: '<path d="M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3"/>',
    flame: '<path d="M12 21c-4 0-7-2.8-7-6.6C5 10 9 8 9 3c3 1.5 6 5 6 8.5 1-1 1.4-2.3 1.5-3.5C18 9.5 19 12 19 14.4 19 18.2 16 21 12 21z"/>',
    drop: '<path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11z"/>',
    car: '<path d="M4 16v-4l2-5h12l2 5v4z"/><path d="M4 12h16"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    whatsapp: '<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"/><path d="M9 9.2c0 3 2.6 5.6 5.8 5.8l1-1.5-1.8-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-1.8z"/>',
  };
  const icon = (name, cls = "ico") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.check}</svg>`;
  const stars = (r) => `<span class="stars" aria-label="${r} de 5">${[1, 2, 3, 4, 5].map((i) =>
    `<svg viewBox="0 0 24 24" class="${i <= Math.round(r) ? "on" : ""}" aria-hidden="true"><path d="${"M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"}"/></svg>`).join("")}</span>`;

  /* ---------------- Products ---------------- */
  const products = PRODUCTS.filter((p) => !p.hidden);
  const findProduct = (id) => products.find((p) => p.id === id);
  const category = (id) => CONFIG.categories.find((c) => c.id === id);
  // Price of `qty` units with the bundle offers (largest bundles first), e.g. 3 = $95, 4 = $95 + $39.
  function priceFor(p, qty) {
    const tiers = (p.offers || []).filter((o) => o.qty > 0).sort((a, b) => b.qty - a.qty);
    let left = qty, total = 0;
    for (const t of tiers) { while (left >= t.qty) { total += t.price; left -= t.qty; } }
    return total + left * p.price;
  }
  const discountPct = (p) => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);
  const rating = (p) => {
    const r = (p.reviews || []).filter((x) => x.rating);
    return r.length ? { avg: r.reduce((s, x) => s + Number(x.rating), 0) / r.length, count: r.length } : null;
  };
  const productUrl = (p) => `producto.html?id=${encodeURIComponent(p.id)}`;

  /* ---------------- Cart (kept in this browser) ---------------- */
  const CART_KEY = "sv_cart";
  const MAX_QTY = 10;
  const listeners = [];
  const cart = {
    items() {
      return storage.get(CART_KEY, []).filter((i) => findProduct(i.id) && i.qty > 0);
    },
    save(items) { storage.set(CART_KEY, items); listeners.forEach((fn) => fn()); },
    key: (id, option) => id + "|" + (option || ""),
    add(id, qty = 1, option = "") {
      const items = cart.items();
      const k = cart.key(id, option);
      const it = items.find((i) => cart.key(i.id, i.option) === k);
      if (it) it.qty = Math.min(MAX_QTY, it.qty + qty); else items.push({ id, option, qty: Math.min(MAX_QTY, qty) });
      cart.save(items);
    },
    setQty(k, qty) {
      const items = cart.items();
      const it = items.find((i) => cart.key(i.id, i.option) === k);
      if (!it) return;
      it.qty = Math.max(0, Math.min(MAX_QTY, qty));
      cart.save(items.filter((i) => i.qty > 0));
    },
    remove(k) { cart.save(cart.items().filter((i) => cart.key(i.id, i.option) !== k)); },
    clear() { cart.save([]); },
    count() { return cart.items().reduce((s, i) => s + i.qty, 0); },
    // Lines + totals. Bundle offers apply to the total quantity of a product (all colors / sizes).
    summary() {
      const lines = cart.items().map((i) => {
        const p = findProduct(i.id);
        return { ...i, key: cart.key(i.id, i.option), product: p, unit: p.price, total: p.price * i.qty };
      });
      const regular = lines.reduce((s, l) => s + l.total, 0);
      const perProduct = {};
      lines.forEach((l) => { perProduct[l.id] = (perProduct[l.id] || 0) + l.qty; });
      const subtotal = Object.entries(perProduct).reduce((s, [id, q]) => s + priceFor(findProduct(id), q), 0);
      const shipping = !lines.length || !S.price || (S.freeFrom && subtotal >= S.freeFrom) ? 0 : S.price;
      return { lines, regular, savings: regular - subtotal, subtotal, shipping, total: subtotal + shipping, count: lines.reduce((s, l) => s + l.qty, 0) };
    },
    onChange(fn) { listeners.push(fn); },
  };
  // Another tab changed the cart
  window.addEventListener("storage", (e) => { if (e.key === CART_KEY) listeners.forEach((fn) => fn()); });

  /* ---------------- Meta Pixel ---------------- */
  const Pixel = (() => {
    const ids = [...new Set((CONFIG.metaPixels || []).map((x) => String(x).replace(/\D/g, "")).filter(Boolean))];
    if (ids.length) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      ids.forEach((id) => fbq("init", id));
      fbq("track", "PageView");
    }
    const track = (event, data, options) => { if (ids.length && window.fbq) fbq("track", event, data || {}, options); };
    const product = (p, qty = 1, value = priceFor(p, qty)) => ({
      content_ids: [p.id], content_name: p.name, content_type: "product",
      contents: [{ id: p.id, quantity: qty }], num_items: qty, value, currency: CONFIG.currency,
    });
    const order = (sum) => ({
      content_ids: sum.lines.map((l) => l.id), content_type: "product",
      contents: sum.lines.map((l) => ({ id: l.id, quantity: l.qty })), num_items: sum.count,
      value: sum.total, currency: CONFIG.currency,
    });
    return { track, product, order };
  })();

  /* ---------------- Header, footer, cart drawer, WhatsApp ---------------- */
  const waLink = (text = CONFIG.whatsappText) =>
    CONFIG.whatsapp ? `https://wa.me/${String(CONFIG.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(text)}` : "";

  function renderHeader() {
    const el = $("#site-header");
    if (!el) return;
    const page = document.body.dataset.page;
    const link = (href, label, key) => `<a href="${href}" class="${page === key ? "is-active" : ""}">${label}</a>`;
    el.innerHTML = `
      <div class="announce" role="region" aria-label="Avisos">
        <div class="announce__track">${CONFIG.announcements.map((a, i) => `<p class="${i ? "" : "is-on"}">${esc(a)}</p>`).join("")}</div>
      </div>
      <div class="nav">
        <div class="container nav__in">
          <button class="nav__burger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileMenu">${icon("menu")}</button>
          <a href="index.html" class="brand" aria-label="${esc(CONFIG.brand)} — inicio">
            <span class="brand__mark">${esc(CONFIG.brand.charAt(0))}</span>
            <span class="brand__name">${esc(CONFIG.brand)}</span>
          </a>
          <nav class="nav__links" aria-label="Principal">
            ${link("index.html", "Inicio", "home")}
            ${link("tienda.html", "Tienda", "shop")}
            ${link("index.html#categorias", "Categorías")}
            ${link("index.html#ofertas", "Ofertas")}
            ${link("index.html#envios", "Envíos")}
            ${link("index.html#preguntas", "Preguntas")}
          </nav>
          <button class="nav__cart" type="button" data-open-cart aria-label="Abrir carrito">
            ${icon("bag")}<span class="nav__count" data-cart-count hidden>0</span>
          </button>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu" hidden>
        <nav aria-label="Menú móvil">
          <a href="index.html">Inicio</a><a href="tienda.html">Tienda</a>
          ${CONFIG.categories.map((c) => `<a href="tienda.html?cat=${c.id}" class="sub">${esc(c.name)}</a>`).join("")}
          <a href="index.html#ofertas">Ofertas</a><a href="index.html#envios">Envíos y pago</a><a href="index.html#preguntas">Preguntas frecuentes</a>
        </nav>
      </div>`;
    // Rotating announcement
    const msgs = $$(".announce p", el);
    if (msgs.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let n = 0;
      setInterval(() => { msgs[n].classList.remove("is-on"); n = (n + 1) % msgs.length; msgs[n].classList.add("is-on"); }, 4200);
    }
    const burger = $(".nav__burger", el), menu = $("#mobileMenu");
    burger.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
      burger.innerHTML = icon(open ? "close" : "menu");
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.hidden = true; burger.innerHTML = icon("menu"); }));
    // Shadow once scrolled
    const onScroll = () => el.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  function renderFooter() {
    const el = $("#site-footer");
    if (!el) return;
    const year = new Date().getFullYear();
    el.innerHTML = `
      <div class="footer__trust">
        <div class="container trust-row">
          ${trustItem("cash", "Pago al recibir", "Pagas en efectivo cuando recibes")}
          ${trustItem("truck", CONFIG.shipping.nationwide ? "Envíos a todo El Salvador" : "Envíos en El Salvador", `Entrega en ${CONFIG.shipping.time}`)}
          ${trustItem("phone", "Confirmación telefónica", "Te llamamos antes de enviar")}
          ${trustItem("chat", "Atención al cliente", "Por WhatsApp, de lunes a sábado")}
        </div>
      </div>
      <div class="container footer__grid">
        <div>
          <a href="index.html" class="brand brand--light"><span class="brand__mark">${esc(CONFIG.brand.charAt(0))}</span><span class="brand__name">${esc(CONFIG.brand)}</span></a>
          <p class="footer__about">${esc(CONFIG.tagline)}. Seleccionamos cada producto y lo enviamos a tu puerta en todo El Salvador.</p>
          <div class="footer__social">
            ${CONFIG.instagram ? `<a href="${esc(CONFIG.instagram)}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/></svg></a>` : ""}
            ${CONFIG.facebook ? `<a href="${esc(CONFIG.facebook)}" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"/></svg></a>` : ""}
          </div>
        </div>
        <div>
          <h3>Tienda</h3>
          <ul>${CONFIG.categories.map((c) => `<li><a href="tienda.html?cat=${c.id}">${esc(c.name)}</a></li>`).join("")}<li><a href="tienda.html">Todos los productos</a></li></ul>
        </div>
        <div>
          <h3>Ayuda</h3>
          <ul>
            <li><a href="index.html#envios">Envíos y pago contra entrega</a></li>
            <li><a href="index.html#preguntas">Preguntas frecuentes</a></li>
            <li><a href="checkout.html">Finalizar compra</a></li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <ul>
            ${CONFIG.whatsapp ? `<li><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp: ${esc(CONFIG.phoneDisplay)}</a></li>` : ""}
            ${CONFIG.email ? `<li><a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a></li>` : ""}
            <li>Envíos a los 14 departamentos</li>
          </ul>
        </div>
      </div>
      <div class="container footer__bottom">
        <p>© ${year} ${esc(CONFIG.brand)} · El Salvador</p>
        <p class="footer__pay">${icon("cash")} Pago contra entrega en efectivo</p>
      </div>`;
  }
  const trustItem = (ic, title, text) =>
    `<div class="trust-item">${icon(ic)}<div><strong>${esc(title)}</strong><span>${esc(text)}</span></div></div>`;

  function renderWhatsApp() {
    if (!CONFIG.whatsapp || document.body.dataset.noWa != null) return;
    const p = findProduct(new URLSearchParams(location.search).get("id") || "");
    const a = document.createElement("a");
    a.className = "wa-float";
    a.href = waLink(CONFIG.whatsappText + (p ? " " + p.name : ""));
    a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Escríbenos por WhatsApp");
    a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.8 1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';
    document.body.appendChild(a);
  }

  /* Cart drawer (slides from the right on every page) */
  function renderDrawer() {
    const d = document.createElement("div");
    d.className = "drawer";
    d.id = "cartDrawer";
    d.hidden = true;
    d.innerHTML = `
      <div class="drawer__veil" data-close-cart></div>
      <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
        <header class="drawer__head">
          <h2 id="drawerTitle">Tu carrito</h2>
          <button type="button" class="icon-btn" data-close-cart aria-label="Cerrar carrito">${icon("close")}</button>
        </header>
        <div class="drawer__body" data-cart-lines></div>
        <footer class="drawer__foot" data-cart-foot></footer>
      </aside>`;
    document.body.appendChild(d);
    $$("[data-close-cart]", d).forEach((b) => b.addEventListener("click", closeCart));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !d.hidden) closeCart(); });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openCart(); } });
    d.addEventListener("click", (e) => {
      const b = e.target.closest("[data-qty]");
      if (b) { const it = cart.items().find((i) => cart.key(i.id, i.option) === b.dataset.key); if (it) cart.setQty(b.dataset.key, it.qty + Number(b.dataset.qty)); }
      const r = e.target.closest("[data-remove]");
      if (r) cart.remove(r.dataset.remove);
    });
    cart.onChange(updateCartUI);
    updateCartUI();
  }
  let lastFocus = null;
  function openCart() {
    const d = $("#cartDrawer");
    lastFocus = document.activeElement;
    d.hidden = false;
    document.documentElement.classList.add("no-scroll");
    requestAnimationFrame(() => { d.classList.add("is-open"); $(".drawer__head .icon-btn", d).focus(); });
  }
  function closeCart() {
    const d = $("#cartDrawer");
    d.classList.remove("is-open");
    document.documentElement.classList.remove("no-scroll");
    setTimeout(() => { d.hidden = true; }, 320);
    lastFocus?.focus?.();
  }
  const lineHtml = (l, compact) => `
    <div class="line">
      <a href="${productUrl(l.product)}" class="line__img"><img src="${esc(l.product.images[0])}" alt="" loading="lazy" /></a>
      <div class="line__info">
        <a href="${productUrl(l.product)}" class="line__name">${esc(l.product.name)}</a>
        ${l.option ? `<span class="line__opt">${esc(l.option)}</span>` : ""}
        <span class="line__price">${money(l.unit)} c/u</span>
        <div class="line__row">
          <div class="stepper stepper--sm">
            <button type="button" data-qty="-1" data-key="${esc(l.key)}" aria-label="Quitar uno">${icon("minus")}</button>
            <span aria-live="polite">${l.qty}</span>
            <button type="button" data-qty="1" data-key="${esc(l.key)}" aria-label="Agregar uno" ${l.qty >= MAX_QTY ? "disabled" : ""}>${icon("plus")}</button>
          </div>
          ${compact ? "" : `<button type="button" class="line__remove" data-remove="${esc(l.key)}">Eliminar</button>`}
        </div>
      </div>
      <strong class="line__total">${money(l.total)}</strong>
    </div>`;
  const totalsHtml = (s) => `
    <dl class="totals">
      <div><dt>Subtotal</dt><dd>${money(s.regular)}</dd></div>
      ${s.savings > 0 ? `<div class="totals__save"><dt>Descuento por paquete</dt><dd>−${money(s.savings)}</dd></div>` : ""}
      <div><dt>Envío</dt><dd>${s.shipping ? money(s.shipping) : '<span class="free">Gratis</span>'}</dd></div>
      <div class="totals__grand"><dt>Total a pagar</dt><dd>${money(s.total)} <small>${CONFIG.currency}</small></dd></div>
    </dl>`;
  function updateCartUI() {
    const s = cart.summary();
    $$("[data-cart-count]").forEach((c) => { c.textContent = s.count; c.hidden = !s.count; });
    const lines = $("[data-cart-lines]"), foot = $("[data-cart-foot]");
    if (!lines) return;
    if (!s.lines.length) {
      lines.innerHTML = `<div class="empty">${icon("bag", "ico empty__ico")}<p>Tu carrito está vacío.</p><a href="tienda.html" class="btn btn--dark">Ver productos</a></div>`;
      foot.innerHTML = "";
      return;
    }
    lines.innerHTML = s.lines.map((l) => lineHtml(l)).join("");
    foot.innerHTML = `${totalsHtml(s)}
      <a href="checkout.html" class="btn btn--gold btn--block">Finalizar pedido · ${money(s.total)}</a>
      <p class="drawer__note">${icon("cash")} Pagas en efectivo al recibir. Sin tarjeta.</p>`;
  }

  /* ---------------- Product card ---------------- */
  function card(p) {
    const r = rating(p), off = discountPct(p);
    const best = (p.offers || []).find((o) => o.qty > 1);
    return `
      <article class="card reveal">
        <a href="${productUrl(p)}" class="card__media">
          <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" width="600" height="600" />
          ${p.images[1] ? `<img class="card__alt" src="${esc(p.images[1])}" alt="" loading="lazy" width="600" height="600" />` : ""}
          ${off ? `<span class="tag tag--sale">−${off}%</span>` : p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ""}
        </a>
        <div class="card__body">
          <span class="card__cat">${esc(category(p.category)?.name || "")}</span>
          <h3 class="card__title"><a href="${productUrl(p)}">${esc(p.name)}</a></h3>
          ${r ? `<div class="card__rating">${stars(r.avg)}<span>(${r.count})</span></div>` : ""}
          <div class="price">
            <span class="price__now">${money(p.price)}</span>
            ${p.oldPrice ? `<s class="price__old">${money(p.oldPrice)}</s>` : ""}
          </div>
          ${best ? `<p class="card__deal">${best.qty} por ${money(best.price)}</p>` : ""}
          <div class="card__actions">
            ${p.options?.length
              ? `<a href="${productUrl(p)}" class="btn btn--dark btn--sm">Elegir ${esc(p.options[0].name.toLowerCase())}</a>`
              : `<button type="button" class="btn btn--dark btn--sm" data-quick-add="${esc(p.id)}">Agregar al carrito</button>`}
          </div>
        </div>
      </article>`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-quick-add]");
    if (!b) return;
    const p = findProduct(b.dataset.quickAdd);
    cart.add(p.id, 1);
    Pixel.track("AddToCart", Pixel.product(p, 1));
    toast(`${p.name} se agregó a tu carrito`, true);
  });

  /* ---------------- Small helpers ---------------- */
  function toast(msg, withCart) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = `${icon("check")}<span>${esc(msg)}</span>${withCart ? '<button type="button" data-open-cart>Ver carrito</button>' : ""}`;
    t.classList.add("is-on");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("is-on"), 3600);
  }
  function initReveal() {
    const els = $$(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-in")); return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }
  function faqHtml(list) {
    return list.map((f) => `
      <details class="faq__item">
        <summary>${esc(fillText(f.q))}<span class="faq__plus" aria-hidden="true"></span></summary>
        <p>${esc(fillText(f.a))}</p>
      </details>`).join("");
  }

  // Shared page parts
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderDrawer();
    renderWhatsApp();
    initReveal();
  });

  return {
    $, $$, esc, money, storage, icon, stars, products, findProduct, category, priceFor, discountPct, rating,
    productUrl, cart, Pixel, card, toast, initReveal, faqHtml, fillText, shippingText, trustItem, waLink,
    lineHtml, totalsHtml, openCart, MAX_QTY,
  };
})();
