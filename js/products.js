/* Live site: https://dukaabora.store/ (Cloudflare publishes every push to GitHub main; copies on
   dukabora-tz.belhanafioussama84.workers.dev and GitHub Pages send visitors to dukaabora.store) */
// dukaabora.store is the official address (the only one the Meta Pixel accepts):
// links to the copies and to www.dukaabora.store open the same page there.
if (/\.workers\.dev$|\.github\.io$|^www\.dukaabora\.store$/.test(location.hostname)) {
  location.replace("https://dukaabora.store" + location.pathname.replace(/^\/new-store/, "") + location.search + location.hash);
}
/* ==========================================================
   STORE SETTINGS — edit these to match your business
   ========================================================== */
const STORE = {
  name: "Duka Bora",
  // Phone number in international format, digits only (no + or spaces) — used for "Call" links
  phone: "212672511063",
  phoneDisplay: "+212 672 511 063",
  // WhatsApp number, international format, digits only (e.g. "255712345678").
  // Shows a green WhatsApp button on every page. Empty = no button.
  whatsapp: "212672511063",
  whatsappText: "Hello Duka Bora, I want to order:",
  // Facebook / Meta Pixel ID (digits only, from Meta Events Manager). Empty = no pixel.
  // Events sent: PageView (every page), ViewContent (product page),
  // InitiateCheckout (order button), Purchase (thank-you page, once per order).
  metaPixel: "2505097906522683",
  // Extra pixels for one country only (e.g. a partner's pixel): they get the same events,
  // only when the visitor is in that country. tz: Yasse's pixel.
  countryPixels: { tz: ["1652578138950300"] },
  // Instagram / Facebook page links (full https:// address). Shown as icons at the bottom of every page.
  // Empty = no icon.
  instagram: "https://www.instagram.com/dukaabora/",
  facebook: "https://www.facebook.com/profile.php?id=100070066074275",
  // Google Sheet that receives every order — paste your Apps Script web app URL here
  // (setup steps: google-sheet/orders.gs). Empty = orders are NOT sent to you.
  ordersUrl: "https://script.google.com/macros/s/AKfycbxrx2C83Ns29ULrZWcvHh2EgiJTBEjTDvsinnvz81WAV8ODzpkwsm_Z6V1An7w54lEiRQ/exec",
};

/* ==========================================================
   COUNTRIES — the same site sells in Tanzania, Zambia, Lebanon and El Salvador.
   - El Salvador (?country=sv): Spanish (ES in js/i18n.js), US dollars, blue and white
     colours (:root[data-country="sv"] in css/product.css). Product names in Spanish: "name"
     in each product's "sv" part.
   - The visitor's country: ?country=zm or ?country=lb in the link (use it in
     Zambian / Lebanese ads, e.g. product.html?id=reward-watch&country=lb), else
     the one chosen before with the buttons at the top of the page or on the
     welcome screen of the home page, else the country of the phone's time
     zone (Zambia, Lebanon), else Tanzania.
   - Local prices: the "zm" / "lb" part of each product. A product without it is
     not shown in that country.
   - Texts that change: ZM and LB in js/i18n.js. HTML shown in one country
     only: data-country="tz", "zm" or "lb".
   - Lebanon has its own colours (red, white and cedar green): see
     :root[data-country="lb"] at the end of css/product.css.
   ========================================================== */
const COUNTRIES = {
  tz: {
    id: "tz", name: "Tanzania", currency: "TSh", currencyCode: "TZS",
    dial: "255", phone: /^[67]\d{8}$/, // mobile numbers: 6XX / 7XX XXX XXX
    languages: ["sw", "en"],
    fastCity: "dar", // same / next day delivery
  },
  zm: {
    id: "zm", name: "Zambia", currency: "KW", currencyCode: "ZMW",
    dial: "260", phone: /^[79]\d{8}$/, // mobile numbers: 9XX / 7XX XXX XXX
    languages: ["en"],
    fastCity: "lusaka",
  },
  lb: {
    id: "lb", name: "Lebanon", currency: "$", currencyCode: "USD",
    dial: "961", phone: /^(3\d{6}|(7\d|8[16])\d{6})$/, // mobile numbers: 3 XXX XXX / 7X XXX XXX / 81 XXX XXX
    languages: ["en"],
    fastCity: "beirut",
    splitAddress: true, // the order form asks for the city and the address in two fields
  },
  sv: {
    id: "sv", name: "El Salvador", currency: "$", currencyCode: "USD",
    dial: "503", phone: /^[267]\d{7}$/, // 8 digits: mobile 6XXX / 7XXX XXXX, landline 2XXX XXXX
    languages: ["es"], // Spanish only: ES in js/i18n.js
    fastCity: "san salvador",
    splitAddress: true,
    // The order form also asks for the departamento (list) and a landmark, the columns of the
    // LatinDrop import file (google-sheet/orders.gs)
    regions: [
      "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", "La Paz", "La Unión",
      "Morazán", "San Miguel", "San Salvador", "San Vicente", "Santa Ana", "Sonsonate", "Usulután",
    ],
    landmark: true,
  },
};
// Phones set to these time zones get that country until the visitor picks one.
const ZONES = { "Africa/Lusaka": "zm", "Asia/Beirut": "lb", "America/El_Salvador": "sv" };

// COUNTRY_CHOSEN: false when the visitor has not picked a country yet (the home page then asks).
const { COUNTRY, COUNTRY_CHOSEN } = (() => {
  const KEY = "dukabora_country";
  const asked = new URLSearchParams(location.search).get("country");
  let saved = null;
  try {
    if (COUNTRIES[asked]) localStorage.setItem(KEY, asked);
    saved = localStorage.getItem(KEY);
  } catch { /* storage unavailable */ }
  let zone = "";
  try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* old browser */ }
  const chosen = COUNTRIES[asked] || COUNTRIES[saved];
  return {
    COUNTRY: chosen || COUNTRIES[ZONES[zone]] || COUNTRIES.tz,
    COUNTRY_CHOSEN: !!chosen,
  };
})();
// Country colours (css/product.css). The <head> of each page sets it early too, so Lebanon doesn't flash green.
document.documentElement.dataset.country = COUNTRY.id;
if (COUNTRY.id === "lb") document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#c8102e");
if (COUNTRY.id === "sv") document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#0b3a82");

/* ==========================================================
   PRODUCTS — add, remove or edit products here.
   - price / oldPrice / offers are in Tanzanian Shillings (TZS);
     zm: { price, oldPrice, offers } gives the same in Zambian Kwacha (ZMW),
     lb: { ... } in US dollars (USD) for Lebanon;
     zm.sectionImages / lb.sectionImages: other photos for the "sections" there (same order)
   - image: put photos in the /images folder (square, ~800x800).
     If an image is missing, a styled placeholder is shown instead.
   - Every product gets its own landing page: product.html?id=<id>
     (use that link in your Facebook / TikTok / Instagram ads).
   - home: false  hides a product from the home page (its own page still works)
   - countries: ["lb"]  sells it in those countries only, with price / offers in their money
     (see "sauna-leggings")
   - sizes: ["M", "L", ...]  the customer picks a size for each piece;
     sizeChart: { columns, rows, image } is shown under the size buttons;
     sizeWord: "color" makes the same buttons a color choice (e.g. sizes: ["Gold", "Silver"])
   Optional fields for the landing page (see "reward-watch" below):
   - images:  extra photos for the gallery
   - sections: photos shown under the order form, each with its text:
              [{ image, title, text, list: ["point", ...] }]
   - offers:  bundle prices the customer chooses from, e.g.
              [{ qty: 1, price: 199000 }, { qty: 2, price: 355000, tag: "Best value" }]
              (without offers, the customer picks a quantity instead)
   - specs:   { "Label": "Value", ... } table of specifications
   - landing: texts — tagline, featuresTitle, features (icon: sparkle,
     shield, watch, gift, truck, bolt, heart, star, home, battery),
     showcaseTitle, showcaseText, showcaseList, finalTitle.
     Titles are ["normal part", "gold italic part"].
     Anything left out uses a general text that fits any product.
   Swahili: add the Swahili of every new text in js/i18n.js
   (texts without a translation show in English).
   ========================================================== */
const PRODUCTS = [
  {
    id: "reward-watch",
    name: "Reward Watch",
    category: "Accessories",
    price: 230000,
    // Usual price, shown crossed out next to the promotion price 230,000.
    // When the promotion ends, put price back to 249000 and oldPrice to null.
    oldPrice: 249000,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "⌚",
    image: "images/rw1.webp",
    // Photos at the top of the product page (‹ › arrows to go from one to the next)
    images: ["images/rw1.webp", "images/rw-front.webp"],
    // Real photos of the product in stock (section "What you receive" under the photos).
    // Removed 2026-11-03 at the owner's request; files stay in images/ (rw-real-1/2/3.webp) to put back.
    // realPhotos: ["images/rw-real-1.webp", "images/rw-real-2.webp", "images/rw-real-3.webp"],
    // Extra badges next to "Free delivery" etc. on this product's page
    perks: ["🎁 Gift box included"],
    // Photos shown under the order form, each with its explanation
    sections: [
      {
        image: "images/rw2-tz.jpg",
        title: "Your moment, defined.",
        text: "A rose-gold chronograph that completes your look. At the office, in meetings or on your big day, people notice the details.",
        list: ["At the office and in business meetings", "At weddings, parties and special events", "As a gift that will be remembered"],
      },
      {
        image: "images/rw3-tz.jpg",
        title: "Strong glass, comfortable strap",
        text: "Hardened mineral glass resists scratches and stays crystal clear. The stainless steel and silicone strap is strong, light and comfortable all day.",
        list: ["Scratch-resistant mineral glass", "Stainless steel + soft silicone strap", "Working chronograph and date"],
      },
      {
        image: "images/rw4-tz.jpg",
        title: "Made for everyday life",
        text: "From the café to the market, from Dar es Salaam to Dodoma: a watch that matches your jeans as well as your suit.",
      },
      {
        image: "images/rw5-tz.jpg",
        title: "Upgrade your style today",
        text: "Premium design, water-resistant and a great gift for men. Order now: free delivery across Tanzania and you pay only when it arrives.",
        list: ["Premium luxury design", "Water-resistant", "Great gift for men"],
      },
    ],
    offers: [
      { qty: 1, price: 230000 },
      { qty: 2, price: 430000, tag: "Best value" },
      { qty: 3, price: 615000 },
    ],
    zm: {
      price: 1399,
      oldPrice: null, // the 249,000 above is in TSh: no crossed-out price here
      offers: [
        { qty: 1, price: 1399 },
        { qty: 2, price: 2499, tag: "Best value" },
        { qty: 3, price: 3899 },
      ],
      // Photos made for Zambia (the -tz ones show a Tanzanian newspaper and flag), same order as "sections"
      sectionImages: ["images/rw2.webp", "images/rw3.webp", "images/rw4.webp", "images/rw5.webp"],
    },
    lb: {
      price: 39,
      oldPrice: null,
      offers: [
        { qty: 1, price: 39 },
        { qty: 2, price: 69, tag: "Best value" },
        { qty: 3, price: 95 },
      ],
      sectionImages: ["images/rw2.webp", "images/rw3.webp", "images/rw4.webp", "images/rw5.webp"],
    },
    description: "Elegant, durable watch with a premium finish. Perfect for everyday wear or as a gift.",
    // specs: {
    //   "Case": "Stainless steel, 42 mm",
    //   "Strap": "Leather, adjustable",
    //   "Water resistance": "Splash resistant",
    //   "In the box": "Watch + gift box",
    // },
    landing: {
      tagline: ["Wear your success.", "Every single day."],
      featuresTitle: ["Crafted to", "impress"],
      features: [
        { icon: "sparkle", title: "Premium finish", text: "A clean, classy look that stands out at work, at events or on the weekend." },
        { icon: "shield", title: "Built to last", text: "Strong materials made for everyday wear, year after year." },
        { icon: "watch", title: "Comfortable fit", text: "Light on the wrist and easy to adjust to your size." },
        { icon: "gift", title: "The perfect gift", text: "For birthdays, anniversaries, graduation or Eid." },
      ],
      showcaseTitle: ["A watch that says", "you made it"],
      showcaseText: "Whether it's a reward for yourself or a gift for someone special, the Reward Watch is made for the moments that matter.",
      showcaseList: [
        "At the office and in business meetings",
        "At weddings, parties and special events",
        "As a gift that will be remembered",
      ],
      finalTitle: ["You've earned it.", "Reward yourself."],
    },
  },
  {
    id: "car-nano-spray",
    name: "Car Nano Repairing Spray",
    category: "Car care",
    price: 81000,
    oldPrice: null,
    rating: 4.7,
    reviews: 0,
    badge: "New",
    icon: "🚗",
    image: "images/car-nano-spray.jpg",
    // Photos shown under the order form, each with its explanation
    sections: [
      {
        image: "images/cns-before-after.mp4",
        title: "See the difference in seconds",
        text: "Dull paint full of swirl marks? Spray, wipe, and the shine comes back. Fine scratches and marks become much less visible.",
        list: ["Hides swirl marks and fine scratches", "Brings back the deep colour of the paint", "Results you see straight away"],
      },
      {
        image: "images/cns-instant.webp",
        title: "One spray, one wipe",
        text: "No machine, no polishing, no garage. Spray it on your car, wipe with a cloth, and enjoy a mirror-like shine. It works on a dry or a wet car.",
        list: ["Instant coating, mirror-like shine", "Use on a dry or wet car", "Suitable for all vehicles"],
      },
      {
        image: "images/cns-benefits.webp",
        title: "6 protections in one bottle",
        text: "A nano coating that protects your paint every day, in the sun, the rain and the dust of the road.",
        list: ["Water-repellent like a lotus leaf", "Mirror-like gloss", "Protects against dirt and bird droppings", "Helps against small scratches", "Resists strong sun", "Safe for all car paints"],
      },
      {
        image: "images/cns-water.webp",
        title: "Rain and mud slide off",
        text: "Like water on a lotus leaf, rain forms drops and runs off the car. Muddy water doesn't stick to the paint, so your car stays clean longer and you wash it less often.",
        list: ["Water forms beads and slides off", "Mud and dirty water don't stick", "Less washing, more time for you"],
      },
      {
        image: "images/cns-shine.webp",
        title: "Mirror-like shine, no waxing",
        text: "Forget wax and long polishing. One spray and one wipe lock in the shine and leave the paint crystal-clear.",
      },
      {
        image: "images/cns-scratch.webp",
        title: "A shield against small scratches",
        text: "The nano layer gives your paint extra protection against light scratches from branches, leaves and everyday use.",
      },
      {
        image: "images/cns-surfaces.webp",
        title: "For the whole vehicle",
        text: "Use it on the body, glass, mirrors, headlights, chrome and tyres. Cars, motorcycles, bajaji and more: the shine comes back like new.",
        list: ["Paint, glass, mirrors and headlights", "Chrome and tyres", "Cars, motorcycles and bajaji", "120 ml bottle with spray trigger"],
      },
    ],
    offers: [
      { qty: 1, price: 81000 },
      { qty: 2, price: 150000, tag: "Best value" },
      { qty: 3, price: 210000 },
    ],
    zm: {
      price: 579,
      offers: [
        { qty: 1, price: 579 },
        { qty: 2, price: 1059, tag: "Best value" },
        { qty: 3, price: 1479 },
      ],
    },
    lb: {
      price: 19,
      offers: [
        { qty: 1, price: 19 },
        { qty: 2, price: 35, tag: "Best value" },
        { qty: 3, price: 49 },
      ],
    },
    description: "Spray, wipe, and your car shines like new. This nano coating cleans without water, hides fine scratches and leaves a water-repellent layer that keeps rain, mud and dust off the paint.",
    landing: {
      showcaseTitle: ["Showroom shine,", "in minutes"],
      showcaseText: "Spray, wipe and drive: your car looks clean and shiny again.",
    },
  },
  {
    id: "sauna-leggings",
    name: "Sauna Sculpt Leggings",
    // Supplier's reference: shown in the sheet next to the name (REF column), not on the site
    sku: "os4-39",
    // Sold in Lebanon only: its prices below are in US dollars (no "lb" part needed)
    countries: ["lb"],
    category: "Fitness",
    price: 38,
    oldPrice: null,
    rating: 4.7,
    reviews: 0,
    badge: "New",
    icon: "🔥",
    image: "images/sauna-1.jpg",
    images: ["images/sauna-1.jpg", "images/sauna-shape.jpg", "images/sauna-features.jpg", "images/sauna-sweat.jpg"],
    perks: ["📏 Sizes M to 2XL"],
    sections: [
      {
        image: "images/sauna-sweat.jpg",
        title: "Sweat more in every workout",
        text: "The silver inner layer keeps the heat in. You warm up faster and sweat more, whether you walk, train or clean the house.",
        list: ["Heat-trapping silver coating inside", "You feel the warmth in minutes", "Black outside: nobody sees the silver"],
      },
      {
        image: "images/sauna-features.jpg",
        title: "Adjustable hooks, high waist",
        text: "Close the hooks at the level that is comfortable for you. The high waist holds your belly and stays in place when you move.",
        list: ["Adjustable hooks", "Ultra-stretch fabric", "High waist that doesn't roll down"],
      },
      {
        image: "images/sauna-shape.jpg",
        title: "A smoother shape, right away",
        text: "The firm fabric hugs your waist, thighs and hips. Your silhouette looks smoother the moment you put them on, under a dress or a long top.",
        list: ["Holds the tummy", "Smooths the thighs", "Lifts the hips"],
      },
      {
        image: "images/sauna-sports.jpg",
        title: "For every kind of sport",
        text: "Yoga, running, the gym, cycling or a long walk: they move with you and stay comfortable.",
      },
    ],
    offers: [
      { qty: 1, price: 38 },
      { qty: 2, price: 69, tag: "Best value" },
      { qty: 3, price: 95 },
    ],
    description: "High-waist leggings with a heat-trapping silver layer inside: you sweat more when you move, and the firm fabric shapes your waist, thighs and hips.",
    landing: {
      showcaseTitle: ["Warm up,", "sweat more"],
      showcaseText: "Put them on for your workout or your walk and feel the heat straight away.",
    },
  },
  {
    id: "posture-corrector",
    name: "Posture Corrector Back Brace",
    sku: "sfy20", // supplier's reference, shown in the sheet (sku column)
    // Sold in Lebanon and El Salvador only: its prices below are in US dollars
    countries: ["lb", "sv"],
    sv: { name: "Corrector de Postura", sku: "" }, // sku: LatinDrop SKU ("LD-P-…")
    category: "Health & comfort",
    price: 29,
    oldPrice: null,
    rating: 4.7,
    reviews: 0,
    badge: "New",
    icon: "🧍",
    image: "images/posture-1.jpg",
    images: ["images/posture-1.jpg", "images/posture-side.jpg", "images/posture-straps.jpg", "images/posture-adjust.jpg"],
    // Plain page like the big COD shops: big photos one under the other (see js/landing.js)
    layout: "simple",
    sections: [
      {
        image: "images/posture-anim1.mp4",
        title: "Posture corrector",
        text: "The crossed straps hold your shoulders back and keep your upper back straight. Made for people who work long hours at a desk or spend a lot of time looking down at their phone.",
      },
      {
        image: "images/posture-howto.jpg",
        title: "Easy to put on",
        text: "Put it on like a backpack, cross the straps, close the belt with the velcro and adjust. It takes less than a minute.",
      },
      {
        image: "images/posture-anim2.mp4",
        title: "Fully adjustable",
        text: "Made for men and women. Pull the side straps until it feels right: it fits sizes S to XXL (24 to 46 inch waist).",
      },
      {
        image: "images/posture-features.jpg",
        title: "Smart design",
        text: "The woven elastic tape on the back follows your movements, and the breathable fabric keeps you comfortable all day.",
      },
      {
        image: "images/posture-anim3.mp4",
        title: "Discreet and light",
        text: "Thin enough to wear under a shirt at the office, at home or in the car. Start with 20 minutes a day, then wear it a little longer each day.",
      },
      {
        image: "images/posture-fabric.jpg",
        title: "Soft and strong",
        text: "Soft perforated fabric, a back support plate and a strong velcro closure that you tighten as you like.",
      },
      {
        image: "images/posture-size.jpg",
        title: "Product size",
        text: "46 cm high and 41 cm wide, adjustable from size S to XXL.",
      },
    ],
    offers: [
      { qty: 1, price: 29 },
      { qty: 2, price: 49, tag: "Best value" },
      { qty: 3, price: 69 },
    ],
    description: "An adjustable back brace with crossed straps that holds your shoulders back and helps you sit and stand straight, at work, at home or on the move.",
    landing: {
      showcaseTitle: ["Stand tall,", "every day"],
      showcaseText: "Close it, adjust it, and feel your shoulders go back straight away.",
    },
  },
  {
    id: "arm-chain",
    name: "Layered Arm Chain Bracelet",
    sku: "ln3-89", // supplier's reference, shown in the sheet (sku column)
    // Sold in Lebanon only: its prices below are in US dollars
    countries: ["lb"],
    category: "Jewelry",
    price: 22,
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "✨",
    image: "images/armchain-gold-arm.jpg",
    images: ["images/armchain-gold-arm.jpg", "images/armchain-silver-arm.jpg", "images/armchain-gold.jpg", "images/armchain-silver.jpg", "images/armchain-silver-close.jpg"],
    // No color buttons: the color (gold / silver) is asked on the confirmation call
    layout: "simple",
    sections: [
      {
        image: "images/armchain-gold-arm.jpg",
        title: "An instant chic look",
        text: "A thin open band on the upper arm with layers of fine chains falling like a cascade, finished with small bar pendants. It turns a simple outfit into an elegant look.",
      },
      {
        image: "images/armchain-silver-close.jpg",
        title: "Perfect with summer outfits",
        text: "With a strapless top, a dress or a sleeveless blouse: at the beach, at a wedding, at a party or for an evening out.",
      },
      {
        image: "images/armchain-silver-light.jpg",
        title: "Delicate layered chains",
        text: "Several fine chains of different lengths move with you and catch the light. A shiny polished finish.",
      },
      {
        image: "images/armchain-detail.jpg",
        title: "Easy to put on",
        text: "The band is open: slide it up your arm and press it gently to fit your arm. No clasp to close.",
      },
      {
        image: "images/armchain-gold.jpg",
        title: "Gold or silver",
        text: "Tell us the color you want when we call to confirm your order. Zinc alloy with a shiny polished finish.",
      },
      {
        image: "images/armchain-size.jpg",
        title: "Size",
        text: "Band of 22.5 cm, chains from 4.5 to 12.5 cm long.",
      },
      {
        image: "images/armchain-silver-stand.jpg",
        title: "A gift she will love",
        text: "For a birthday, an anniversary or just to say thank you.",
      },
    ],
    offers: [
      { qty: 1, price: 22 },
      { qty: 2, price: 39, tag: "Best value" },
      { qty: 3, price: 55 },
    ],
    description: "A thin open arm band with layered chains and small bar pendants. Elegant, light and easy to wear, in gold or silver.",
  },
  {
    id: "foot-massager",
    // El Salvador only: texts written in Spanish here, prices in US dollars
    name: "Masajeador de Pies EMS",
    sku: "LD-P-19524", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    home: false, // not on the home page until it has its photos (its own page works)
    category: "Health & comfort",
    price: 40, // 2 and 3 pieces: TO CONFIRM
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🦶",
    image: "images/foot-massager-1.jpg",
    images: ["images/foot-massager-1.jpg"],
    description: "Una alfombrilla de masaje con estimulación eléctrica (EMS) para relajar tus pies en casa. Te sientas, pones los pies encima y eliges la intensidad que te gusta.",
    offers: [
      { qty: 1, price: 40 },
      { qty: 2, price: 70, tag: "Best value" },
      { qty: 3, price: 95 },
    ],
    // Extra blocks of the product page (js/landing.js)
    problem: {
      title: "Pies cansados al final del día",
      text: "Horas de pie en el trabajo, caminar mucho o estar sentado todo el día: al llegar a casa, tus pies solo piden descanso.",
    },
    solution: {
      title: "Un momento de masaje, sin salir de casa",
      text: "Pon los pies sobre la alfombrilla, enciéndela y relájate mientras ves la tele, lees o trabajas. Tú eliges la intensidad.",
    },
    benefits: [
      { icon: "⚡", title: "Masaje EMS", text: "Pequeños impulsos eléctricos que se sienten como un hormigueo relajante." },
      { icon: "🎚️", title: "Tú eliges", text: "Varios modos e intensidades: de suave a más fuerte." },
      { icon: "🏠", title: "Cuando quieras", text: "En casa, en la oficina o viendo la tele, sin citas ni filas." },
      { icon: "🧳", title: "Delgada y ligera", text: "Se guarda en un cajón o en la maleta." },
    ],
    sections: [
      {
        title: "Relájate después de un día largo",
        text: "Unos minutos sobre la alfombrilla y sientes cómo tus pies se relajan. Ideal después del trabajo o de una caminata larga.",
        list: ["Para pies cansados", "Úsala sentado, sin esfuerzo", "Sesiones cortas, cuando quieras"],
      },
      {
        title: "Fácil de usar",
        text: "Enciéndela, elige el modo y la intensidad, y listo. Sin aplicaciones ni instalaciones complicadas.",
      },
      {
        title: "Un regalo que se agradece",
        text: "Para tu mamá, tu papá o tus abuelos, o para ti: un momento de descanso cada día.",
      },
    ],
    steps: [
      { title: "Siéntate", text: "Coloca la alfombrilla en el piso, frente a tu silla o sofá." },
      { title: "Pon los pies encima", text: "Descalzo, con los pies bien apoyados sobre la alfombrilla." },
      { title: "Elige la intensidad", text: "Empieza suave y súbela poco a poco hasta sentirte cómodo." },
    ],
    // Specs: only what is sure. Add the real ones (modes, levels, battery) from the supplier.
    specs: {
      "Tipo": "Alfombrilla de masaje con estimulación eléctrica (EMS)",
      "Uso": "Pies, sentado",
      "Para": "Hombres y mujeres",
    },
    faq: [
      { q: "¿Duele?", a: "No. Se siente como un hormigueo. Empieza con la intensidad más baja y súbela poco a poco hasta que te sientas cómodo." },
      { q: "¿Cuánto tiempo la uso?", a: "Unos 15 a 20 minutos por sesión son suficientes. Puedes usarla todos los días." },
      { q: "¿Quién no debe usarla?", a: "No la uses si tienes marcapasos u otro implante electrónico, si estás embarazada o si tienes heridas en los pies. Si tienes una enfermedad, consulta a tu médico antes de usarla." },
    ],
  },
];

// A link to a product sold in other countries only (e.g. an ad link without &country=lb, opened
// on a phone that chose Zambia before) reopens the same page in the product's country.
{
  const p = PRODUCTS.find((x) => x.id === new URLSearchParams(location.search).get("id"));
  if (p?.countries && !p.countries.includes(COUNTRY.id)) {
    const url = new URL(location.href);
    url.searchParams.set("country", p.countries[0]);
    location.replace(url.href);
  }
}

// A product with "countries" is only sold there, at its own prices.
for (let i = PRODUCTS.length - 1; i >= 0; i--) {
  if (PRODUCTS[i].countries && !PRODUCTS[i].countries.includes(COUNTRY.id)) PRODUCTS.splice(i, 1);
}

// Outside Tanzania each product takes its local prices; a product without them is not sold there.
if (COUNTRY.id !== "tz") {
  for (let i = PRODUCTS.length - 1; i >= 0; i--) {
    // "countries" products are already in that country's prices; their local part only changes the name etc.
    if (PRODUCTS[i].countries) { Object.assign(PRODUCTS[i], PRODUCTS[i][COUNTRY.id] || {}); continue; }
    const local = PRODUCTS[i][COUNTRY.id];
    if (!local) { PRODUCTS.splice(i, 1); continue; }
    const { sectionImages, ...rest } = local;
    Object.assign(PRODUCTS[i], rest);
    if (sectionImages) {
      PRODUCTS[i].sections = PRODUCTS[i].sections.map((s, n) => ({ ...s, image: sectionImages[n] || s.image }));
    }
  }
}
