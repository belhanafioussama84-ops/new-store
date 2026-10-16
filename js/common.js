/* ==========================================================
   Shared helpers — used by the shop (app.js) and the
   product landing pages (landing.js).
   ========================================================== */
const Shop = (() => {
  "use strict";

  const REGIONS = [
    "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi",
    "Kigoma", "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro",
    "Mtwara", "Mwanza", "Njombe", "Pemba North", "Pemba South", "Pwani", "Rukwa",
    "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora", "Tanga",
    "Zanzibar North", "Zanzibar South & Central", "Zanzibar Urban/West",
  ];

  const ORDERS_KEY = "dukabora_orders";
  const MAX_QTY = 10;

  const $ = (sel) => document.querySelector(sel);
  const fmt = (n) => `${STORE.currency} ${Number(n).toLocaleString("en-US")}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

  const storage = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    },
  };

  function productMedia(p, cls = "card__media", src = p.image) {
    return `
      <div class="${cls}" data-icon="${esc(p.icon)}">
        <img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy"
             onerror="this.remove()" />
      </div>`;
  }

  function fillRegions(select) {
    select.innerHTML = `<option value="">Select your region</option>` +
      REGIONS.map((r) => `<option value="${esc(r)}">${esc(r)}</option>`).join("");
  }

  function normalizePhone(raw) {
    let d = raw.replace(/\D/g, "");
    if (d.startsWith("255")) d = d.slice(3);
    if (d.startsWith("0")) d = d.slice(1);
    return d;
  }

  function setError(input, msg) {
    const field = input.closest(".field");
    field.classList.toggle("has-error", !!msg);
    field.querySelector(".error").textContent = msg || "";
  }

  // Checks the fields this form has (the product page asks for an address instead of region + town).
  function validate(form) {
    let ok = true;
    const check = (el, cond, msg) => { if (!el) return; setError(el, cond ? "" : msg); if (!cond) ok = false; };

    check(form.fullName, form.fullName.value.trim().length >= 3, "Please enter your full name.");
    check(form.phone, /^[67]\d{8}$/.test(normalizePhone(form.phone.value)), "Enter a valid Tanzanian number, e.g. 712 345 678.");
    check(form.region, !!form.region?.value, "Please choose your region.");
    check(form.city, form.city?.value.trim().length >= 2, "Please enter your district or town.");
    check(form.address, form.address?.value.trim().length >= 5, "Please enter your city and delivery address.");

    if (!ok) form.querySelector(".has-error input, .has-error select")?.focus();
    return ok;
  }

  // Builds the order from a validated form and keeps a local copy.
  // total defaults to price × qty; pass it for bundle offers (e.g. buy 2 for a lower price).
  function createOrder(form, p, qty, total = p.price * qty) {
    const o = {
      number: "DB" + Date.now().toString().slice(-7),
      date: new Date().toISOString(),
      product: { id: p.id, name: p.name, price: p.price, qty },
      total,
      shipping: 0,
      payment: "Cash on Delivery",
      customer: {
        fullName: form.fullName.value.trim(),
        phone: "+255 " + normalizePhone(form.phone.value),
        region: form.region?.value || "",
        // The product page sends one "City & delivery address" field; it goes in the same sheet column.
        city: (form.address || form.city).value.trim(),
      },
    };

    // Local copy in the customer's browser (the shop owner receives it via sendOrder).
    const orders = storage.get(ORDERS_KEY, []);
    orders.push(o);
    storage.set(ORDERS_KEY, orders);
    return o;
  }

  // Sends the order to the Google Sheet (STORE.ordersUrl, see google-sheet/orders.gs).
  // Throws if the network request fails, so the customer can try again.
  async function sendOrder(o) {
    if (!STORE.ordersUrl) {
      console.warn("STORE.ordersUrl is empty — this order was NOT sent to your Google Sheet.");
      return;
    }
    // "no-cors" + text/plain: the simplest request Google Apps Script accepts from any website.
    await fetch(STORE.ordersUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(o),
    });
  }

  // The order saved in this browser by createOrder, or undefined.
  const findOrder = (number) => storage.get(ORDERS_KEY, []).find((o) => o.number === number);

  // Fade ".reveal" elements in as they scroll into view.
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  return { MAX_QTY, $, fmt, esc, findProduct, productMedia, fillRegions, setError, validate, createOrder, sendOrder, findOrder, initReveal };
})();

/* Meta (Facebook) Pixel — ID in STORE.metaPixel. Pixel.track() does nothing without an ID. */
const Pixel = (() => {
  const id = String(STORE.metaPixel || "").replace(/\D/g, "");
  if (id) {
    /* Official Meta Pixel loader */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", id);
    fbq("track", "PageView");
  }
  const track = (event, data, options) => { if (id && window.fbq) fbq("track", event, data || {}, options); };
  // Product data in the format Meta expects
  const product = (p, qty = 1, value = p.price * qty) => ({
    content_ids: [p.id], content_name: p.name, content_type: "product",
    contents: [{ id: p.id, quantity: qty }], num_items: qty, value, currency: "TZS",
  });
  return { track, product };
})();

/* Floating WhatsApp button on every page (number in STORE.whatsapp) */
(() => {
  const number = String(STORE.whatsapp || "").replace(/\D/g, "");
  if (!number) return;
  const product = Shop.findProduct(new URLSearchParams(location.search).get("id") || "");
  const text = `${STORE.whatsappText || ""}${product ? ` ${product.name}` : ""}`.trim();
  const a = document.createElement("a");
  a.className = "wa-float";
  a.href = `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with us on WhatsApp");
  a.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`;
  document.body.appendChild(a);
})();
