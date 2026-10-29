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
  // Instagram / Facebook page links (full https:// address). Shown as icons at the bottom of every page.
  // Empty = no icon.
  instagram: "https://www.instagram.com/dukaabora/",
  facebook: "https://www.facebook.com/profile.php?id=100070066074275",
  // Google Sheet that receives every order — paste your Apps Script web app URL here
  // (setup steps: google-sheet/orders.gs). Empty = orders are NOT sent to you.
  ordersUrl: "https://script.google.com/macros/s/AKfycbxrx2C83Ns29ULrZWcvHh2EgiJTBEjTDvsinnvz81WAV8ODzpkwsm_Z6V1An7w54lEiRQ/exec",
};

/* ==========================================================
   COUNTRIES — the same site sells in Tanzania, Zambia and Lebanon.
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
  },
};
// Phones set to these time zones get that country until the visitor picks one.
const ZONES = { "Africa/Lusaka": "zm", "Asia/Beirut": "lb" };

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
     sizeChart: { columns, rows, image } is shown under the size buttons
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
    price: 199000,
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "⌚",
    image: "images/rw1.webp",
    // Photos at the top of the product page (‹ › arrows to go from one to the next)
    images: ["images/rw1.webp", "images/rw-front.webp"],
    // Real photos of the product in stock (section "What you receive" under the photos)
    realPhotos: ["images/rw-real-1.webp", "images/rw-real-2.webp", "images/rw-real-3.webp"],
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
      { qty: 1, price: 199000 },
      { qty: 2, price: 355000, tag: "Best value" },
      { qty: 3, price: 555000 },
    ],
    zm: {
      price: 1399,
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
    // The customer picks a size for each piece; the sizes go in the sheet with the product name
    sizes: ["M", "L", "XL", "2XL"],
    // Supplier's size chart, in cm, measured flat (shown under the size buttons)
    sizeChart: {
      columns: ["Size", "Length", "Upper waist", "Lower waist", "Hip"],
      rows: [
        ["M", 94.5, 29.7, 27.7, 33.7],
        ["L", 95.5, 31.4, 29.4, 35.4],
        ["XL", 96.5, 33.1, 33.1, 37.1],
        ["2XL", 97.5, 34.8, 32.8, 38.8],
      ],
      image: "images/sauna-sizes.jpg",
    },
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
];

// A product with "countries" is only sold there, at its own prices.
for (let i = PRODUCTS.length - 1; i >= 0; i--) {
  if (PRODUCTS[i].countries && !PRODUCTS[i].countries.includes(COUNTRY.id)) PRODUCTS.splice(i, 1);
}

// Outside Tanzania each product takes its local prices; a product without them is not sold there.
if (COUNTRY.id !== "tz") {
  for (let i = PRODUCTS.length - 1; i >= 0; i--) {
    if (PRODUCTS[i].countries) continue; // already in that country's prices
    const local = PRODUCTS[i][COUNTRY.id];
    if (!local) { PRODUCTS.splice(i, 1); continue; }
    const { sectionImages, ...rest } = local;
    Object.assign(PRODUCTS[i], rest);
    if (sectionImages) {
      PRODUCTS[i].sections = PRODUCTS[i].sections.map((s, n) => ({ ...s, image: sectionImages[n] || s.image }));
    }
  }
}
