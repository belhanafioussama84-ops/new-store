/* Live site: https://dukaabora.store/ (Cloudflare publishes every push to GitHub main; copies on
   dukabora-tz.belhanafioussama84.workers.dev and GitHub Pages send visitors to dukaabora.store) */
// dukaabora.store is the official address (the only one the Meta Pixel accepts):
// links to the copies and to www.dukaabora.store open the same page there.
// Only when dukaabora.store answers: if the domain is down (e.g. suspended by Namecheap),
// the copy stays open so visitors can still order.
if (/\.workers\.dev$|\.github\.io$|^www\.dukaabora\.store$/.test(location.hostname)) {
  const target = "https://dukaabora.store" + location.pathname.replace(/^\/new-store/, "") + location.search + location.hash;
  fetch("https://dukaabora.store/robots.txt", { mode: "no-cors", cache: "no-store" })
    .then(() => location.replace(target), () => { /* domain down: stay on this copy */ });
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
     Zambian / Lebanese ads, e.g. product?id=reward-watch&country=lb), else
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
    // No WhatsApp buttons: customers must order with the form, not by message (user's choice)
    noWhatsApp: true,
    // Order form as LatinDrop asked: Departamento (list), then Ciudad/Municipio (list of the
    // departamento's municipios), then the full address. Columns of the LatinDrop import file
    // (google-sheet/orders.gs). The 262 municipios, by departamento:
    municipios: {
      "Ahuachapán": ["Ahuachapán", "Apaneca", "Atiquizaya", "Concepción de Ataco", "El Refugio", "Guaymango", "Jujutla", "San Francisco Menéndez", "San Lorenzo", "San Pedro Puxtla", "Tacuba", "Turín"],
      "Cabañas": ["Cinquera", "Dolores", "Guacotecti", "Ilobasco", "Jutiapa", "San Isidro", "Sensuntepeque", "Tejutepeque", "Victoria"],
      "Chalatenango": ["Agua Caliente", "Arcatao", "Azacualpa", "Chalatenango", "Citalá", "Comalapa", "Concepción Quezaltepeque", "Dulce Nombre de María", "El Carrizal", "El Paraíso", "La Laguna", "La Palma", "La Reina", "Las Vueltas", "Nombre de Jesús", "Nueva Concepción", "Nueva Trinidad", "Ojos de Agua", "Potonico", "San Antonio de la Cruz", "San Antonio Los Ranchos", "San Fernando", "San Francisco Lempa", "San Francisco Morazán", "San Ignacio", "San Isidro Labrador", "San José Cancasque", "San José Las Flores", "San Luis del Carmen", "San Miguel de Mercedes", "San Rafael", "Santa Rita", "Tejutla"],
      "Cuscatlán": ["Candelaria", "Cojutepeque", "El Carmen", "El Rosario", "Monte San Juan", "Oratorio de Concepción", "San Bartolomé Perulapía", "San Cristóbal", "San José Guayabal", "San Pedro Perulapán", "San Rafael Cedros", "San Ramón", "Santa Cruz Analquito", "Santa Cruz Michapa", "Suchitoto", "Tenancingo"],
      "La Libertad": ["Antiguo Cuscatlán", "Chiltiupán", "Ciudad Arce", "Colón", "Comasagua", "Huizúcar", "Jayaque", "Jicalapa", "La Libertad", "Nuevo Cuscatlán", "Quezaltepeque", "Sacacoyo", "San José Villanueva", "San Juan Opico", "San Matías", "San Pablo Tacachico", "Santa Tecla", "Talnique", "Tamanique", "Teotepeque", "Tepecoyo", "Zaragoza"],
      "La Paz": ["Cuyultitán", "El Rosario", "Jerusalén", "Mercedes La Ceiba", "Olocuilta", "Paraíso de Osorio", "San Antonio Masahuat", "San Emigdio", "San Francisco Chinameca", "San Juan Nonualco", "San Juan Talpa", "San Juan Tepezontes", "San Luis La Herradura", "San Luis Talpa", "San Miguel Tepezontes", "San Pedro Masahuat", "San Pedro Nonualco", "San Rafael Obrajuelo", "Santa María Ostuma", "Santiago Nonualco", "Tapalhuaca", "Zacatecoluca"],
      "La Unión": ["Anamorós", "Bolívar", "Concepción de Oriente", "Conchagua", "El Carmen", "El Sauce", "Intipucá", "La Unión", "Lislique", "Meanguera del Golfo", "Nueva Esparta", "Pasaquina", "Polorós", "San Alejo", "San José", "Santa Rosa de Lima", "Yayantique", "Yucuaiquín"],
      "Morazán": ["Arambala", "Cacaopera", "Chilanga", "Corinto", "Delicias de Concepción", "El Divisadero", "El Rosario", "Gualococti", "Guatajiagua", "Joateca", "Jocoaitique", "Jocoro", "Lolotiquillo", "Meanguera", "Osicala", "Perquín", "San Carlos", "San Fernando", "San Francisco Gotera", "San Isidro", "San Simón", "Sensembra", "Sociedad", "Torola", "Yamabal", "Yoloaiquín"],
      "San Miguel": ["Carolina", "Chapeltique", "Chinameca", "Chirilagua", "Ciudad Barrios", "Comacarán", "El Tránsito", "Lolotique", "Moncagua", "Nueva Guadalupe", "Nuevo Edén de San Juan", "Quelepa", "San Antonio del Mosco", "San Gerardo", "San Jorge", "San Luis de la Reina", "San Miguel", "San Rafael Oriente", "Sesori", "Uluazapa"],
      "San Salvador": ["Aguilares", "Apopa", "Ayutuxtepeque", "Ciudad Delgado", "Cuscatancingo", "El Paisnal", "Guazapa", "Ilopango", "Mejicanos", "Nejapa", "Panchimalco", "Rosario de Mora", "San Marcos", "San Martín", "San Salvador", "Santiago Texacuangos", "Santo Tomás", "Soyapango", "Tonacatepeque"],
      "San Vicente": ["Apastepeque", "Guadalupe", "San Cayetano Istepeque", "San Esteban Catarina", "San Ildefonso", "San Lorenzo", "San Sebastián", "San Vicente", "Santa Clara", "Santo Domingo", "Tecoluca", "Tepetitán", "Verapaz"],
      "Santa Ana": ["Candelaria de la Frontera", "Chalchuapa", "Coatepeque", "El Congo", "El Porvenir", "Masahuat", "Metapán", "San Antonio Pajonal", "San Sebastián Salitrillo", "Santa Ana", "Santa Rosa Guachipilín", "Santiago de la Frontera", "Texistepeque"],
      "Sonsonate": ["Acajutla", "Armenia", "Caluco", "Cuisnahuat", "Izalco", "Juayúa", "Nahuizalco", "Nahulingo", "Salcoatitán", "San Antonio del Monte", "San Julián", "Santa Catarina Masahuat", "Santa Isabel Ishuatán", "Santo Domingo de Guzmán", "Sonsonate", "Sonzacate"],
      "Usulután": ["Alegría", "Berlín", "California", "Concepción Batres", "El Triunfo", "Ereguayquín", "Estanzuelas", "Jiquilisco", "Jucuapa", "Jucuarán", "Mercedes Umaña", "Nueva Granada", "Ozatlán", "Puerto El Triunfo", "San Agustín", "San Buenaventura", "San Dionisio", "San Francisco Javier", "Santa Elena", "Santa María", "Santiago de María", "Tecapán", "Usulután"],
    },
  },
};
// Phones set to these time zones get that country until the visitor picks one.
// A country with "municipios" gets its departamento list from them
for (const c of Object.values(COUNTRIES)) if (c.municipios) c.regions = Object.keys(c.municipios);
// Lebanon store closed (user, 10 Nov 2026): its settings stay above, delete this line to reopen it.
delete COUNTRIES.lb;
const ZONES = { "Africa/Lusaka": "zm", "America/El_Salvador": "sv" };

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
// Countries with noWhatsApp: no WhatsApp number = every WhatsApp button and link is hidden
if (COUNTRY.noWhatsApp) STORE.whatsapp = "";
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
   - Every product gets its own landing page: product?id=<id>
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
    category: "Health & comfort",
    price: 36.99, // user's price; 2 and 3 pieces are my suggestion
    // Cost: $5.10 product + about $10 delivery (LatinDrop)
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🦶",
    image: "images/foot-massager-feet.jpg",
    // Supplier photos (600 x 600)
    images: ["images/foot-massager-feet.jpg", "images/foot-massager-remote.jpg", "images/foot-massager-led.jpg", "images/foot-massager-usb.jpg", "images/foot-massager-night.jpg"],
    // The user's own photos of the product (section "Fotos reales", also at the end of the top gallery)
    realPhotos: ["images/foot-massager-real-1.jpg", "images/foot-massager-real-2.jpg", "images/foot-massager-real-3.jpg"],
    realText: "Fotos reales del producto: así es el masajeador que recibes en tu casa.",
    description: "Una alfombrilla de masaje con estimulación eléctrica (EMS) para relajar tus pies en casa. Te sientas, pones los pies encima y eliges la intensidad que te gusta.",
    offers: [
      { qty: 1, price: 36.99 },
      { qty: 2, price: 62.99, tag: "Best value" },
      { qty: 3, price: 84.99 },
    ],
    // One long centred column like the big COD landing pages (js/landing.js)
    layout: "story",
    // Extra blocks of the product page (js/landing.js)
    timeline: [1, 1, 3], // on its way tomorrow, delivered in 1 to 3 days
    headline: "¡Dale a tus pies el descanso que se merecen!",
    subheadline: "Un masaje relajante en casa, en solo 10 a 20 minutos al día.",
    // TO CONFIRM with LatinDrop: what exactly comes in their box
    inBox: ["Alfombrilla de masaje EMS", "Pantalla de control LED desmontable", "Control remoto", "Cable de carga USB-C"],
    warning: "No la uses si tienes marcapasos u otro implante electrónico, si estás embarazada, si tienes trombosis, presión alta o una enfermedad del corazón, o heridas en los pies. Si tienes diabetes u otra enfermedad, consulta a tu médico antes de usarla.",
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
      { icon: "🎚️", title: "8 modos, 19 niveles", text: "De suave a más fuerte: tú eliges en la pantalla LED." },
      { icon: "🏠", title: "Cuando quieras", text: "En casa, en la oficina o viendo la tele, sin citas ni filas." },
      { icon: "🔋", title: "Recargable por USB", text: "Cárgala en la computadora, un power bank, la pared o el carro." },
    ],
    sections: [
      {
        image: "images/foot-massager-night.jpg",
        title: "Relájate después de un día largo",
        text: "Unos minutos sobre la alfombrilla y sientes cómo tus pies se relajan. Ideal después del trabajo o de una caminata larga.",
        list: ["Para pies cansados", "Úsala sentado, sin esfuerzo", "Sesiones cortas, cuando quieras"],
      },
      {
        image: "images/foot-massager-remote.jpg",
        title: "Con control remoto",
        text: "Cambia el modo y la intensidad desde el control remoto, sin agacharte. La pantalla es desmontable y se fija con imanes.",
      },
      {
        image: "images/foot-massager-led.jpg",
        title: "Pantalla LED: 8 modos y 19 niveles",
        text: "Botón + para encender y subir la intensidad, botón M para cambiar de modo, botón − para bajarla o apagar.",
        list: ["8 modos de masaje", "19 niveles de intensidad", "Pantalla LED fácil de leer"],
      },
      {
        image: "images/foot-massager-usb.jpg",
        title: "Recargable por USB",
        text: "Viene con su cable USB-C. Cárgala donde quieras: computadora, power bank, cargador de pared o carro. Mide 27.6 × 31.5 cm.",
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
    // Specs: from the supplier's photos
    specs: {
      "Tipo": "Alfombrilla de masaje con estimulación eléctrica (EMS)",
      "Modos": "8",
      "Niveles de intensidad": "19",
      "Pantalla": "LED, desmontable (fijación magnética)",
      "Control": "Botones + control remoto RF",
      "Carga": "USB (cable USB-C incluido)",
      "Medidas": "27.6 × 31.5 cm",
    },
    faq: [
      { q: "¿Duele?", a: "No. Se siente como un hormigueo. Empieza con la intensidad más baja y súbela poco a poco hasta que te sientas cómodo." },
      { q: "¿Cuánto tiempo la uso?", a: "De 10 a 20 minutos por sesión. Puedes usarla todos los días." },
      { q: "¿Cómo se carga?", a: "Con el cable USB-C incluido, en una computadora, un power bank, un cargador de pared o el carro." },
      { q: "¿Quién no debe usarla?", a: "No la uses si tienes marcapasos u otro implante electrónico, si estás embarazada o si tienes heridas en los pies. Si tienes una enfermedad, consulta a tu médico antes de usarla." },
    ],
  },
  {
    id: "baston-plegable",
    // El Salvador only: texts in Spanish, prices in US dollars
    name: "Bastón plegable con luz LED",
    sku: "LD-P-3876535", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Health & comfort",
    price: 43.99, // user's price; 2 pieces is my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🦯",
    image: "images/baston-main.webp",
    // Supplier photos (713 px, Spanish text)
    squarePhotos: true, // top photos shown whole (they have text up to the edges)
    images: ["images/baston-main.webp", "images/baston-led.webp", "images/baston-base.webp", "images/baston-mango.webp", "images/baston-plegable.webp"],
    description: "Un bastón de aluminio plegable con linterna LED y alarma. Se ajusta a tu altura, se mantiene de pie solo gracias a su base pivotante y cabe en una bolsa.",
    // The user wants 2 choices only: 1 or 2 bastones
    offers: [
      { qty: 1, price: 43.99 },
      { qty: 2, price: 74.99, tag: "Best value" },
    ],
    layout: "story",
    timeline: [1, 1, 3], // on its way tomorrow, delivered in 1 to 3 days
    headline: "¡Camina con más seguridad, de día y de noche!",
    subheadline: "Bastón plegable con luz LED, alarma y base estable que se mantiene de pie sola.",
    inBox: ["Bastón plegable de 4 secciones", "Linterna LED (6 luces) con alarma", "Baterías incluidas", "Correa para la muñeca"],
    warning: "Este bastón es una ayuda para caminar, no un dispositivo médico. Si tienes problemas de equilibrio o te estás recuperando de una operación o lesión, pregunta a tu médico o fisioterapeuta qué tipo de apoyo te conviene.",
    problem: {
      title: "¿Cada paso ya no es tan firme como antes?",
      text: "Levantarte, subir una grada o caminar de noche por un pasillo oscuro: cuando el paso ya no es tan seguro, salir de casa da miedo.",
    },
    solution: {
      title: "Un apoyo que te acompaña a todas partes",
      text: "Un bastón ligero y ajustable, con una base amplia que se mantiene de pie sola y una linterna para ver dónde pisas.",
    },
    benefits: [
      { icon: "💡", title: "Luz LED", text: "6 luces LED en el mango, orientables 45°, para caminar de noche." },
      { icon: "🔔", title: "Alarma", text: "Un botón en el mango para llamar la atención si necesitas ayuda." },
      { icon: "🦶", title: "Base pivotante", text: "Gira 360° y se queda plana en el suelo: el bastón se mantiene de pie solo." },
      { icon: "🎒", title: "Plegable", text: "Se dobla en 4 partes y pesa solo 1 libra. Cabe en una mochila." },
    ],
    sections: [
      {
        image: "images/baston-levantarse.mp4",
        title: "Levantarte ya no tiene que ser difícil",
        text: "Levantarte del sofá o de la cama sin apoyo cuesta. Con un bastón firme a tu lado, tienes de dónde agarrarte y dependes menos de los demás.",
      },
      {
        image: "images/baston-caminar.mp4",
        title: "Recupera tu libertad al caminar",
        text: "Sal a caminar, ve a la tienda o a visitar a tu familia con un apoyo firme en cada paso.",
      },
      {
        image: "images/baston-led.webp",
        title: "Ilumina tu camino en la oscuridad",
        text: "La linterna del mango tiene 6 luces LED y se inclina 45° para alumbrar el suelo delante de ti: en la noche, en pasillos oscuros o en la calle.",
        list: ["6 luces LED", "Ángulo ajustable de 45°", "Fácil de instalar: se enrosca en el mango"],
      },
      {
        image: "images/baston-base.webp",
        title: "Base pivotante y estable",
        text: "Su base ancha con 4 apoyos de goma gira 360° y se mantiene plana en el suelo: en la banqueta, en gradas, en la playa o con lluvia. Y el bastón se queda de pie solo, sin apoyarlo en la pared.",
      },
      {
        image: "images/baston-base-anim.mp4",
        title: "Se adapta al suelo en cada paso",
        text: "La base gira con tu movimiento y sus 4 apoyos de goma quedan siempre en contacto con el suelo.",
      },
      {
        image: "images/baston-compara.mp4",
        title: "Más estable que un bastón normal",
        text: "Un bastón normal se apoya en una sola punta. Esta base ancha se queda firme en piedras, adoquines o suelo mojado.",
      },
      {
        image: "images/baston-mango.webp",
        title: "Mango ergonómico de goma",
        text: "Un mango en forma de T, cómodo para la mano, con una correa para la muñeca para que no se te caiga.",
      },
      {
        image: "images/baston-altura.mp4",
        title: "Altura ajustable",
        text: "Ajusta el largo del bastón a tu altura en segundos: de 85 a 95 cm.",
      },
      {
        image: "images/baston-plegable.webp",
        title: "Plegable y ligero",
        text: "Se dobla en 4 partes y queda de 30 × 20 cm. Pesa solo 1 libra: llévalo en la cartera, la mochila o la maleta.",
        list: ["Aluminio ligero", "Altura ajustable", "Se arma en segundos"],
      },
      {
        title: "Un regalo para quien más quieres",
        text: "Para tu papá, tu mamá o tus abuelos, o para ti: más confianza al salir de casa.",
      },
    ],
    steps: [
      { title: "Despliégalo", text: "Las 4 partes se unen solas: el bastón queda armado en segundos." },
      { title: "Ajusta la altura", text: "Ponlo a la altura de tu muñeca, con el brazo relajado." },
      { title: "Camina con confianza", text: "Enciende la luz en la noche y usa la alarma si necesitas ayuda." },
    ],
    // Specs: from the supplier's photos and text
    specs: {
      "Material": "Aleación de aluminio",
      "Mango": "En forma de T, de goma, con correa",
      "Secciones": "4 (plegable)",
      "Altura": "Ajustable, de 85 a 95 cm",
      "Base": "Pivotante 360°, 4 apoyos de goma",
      "Luz": "6 LED, orientable 45°",
      "Peso": "Aprox. 1 libra",
      "Plegado": "30 × 20 cm",
    },
    faq: [
      { q: "¿Se ajusta a mi altura?", a: "Sí, la altura se ajusta de 85 a 95 cm. Lo ideal es que el mango quede a la altura de tu muñeca con el brazo relajado." },
      { q: "¿Se queda de pie solo?", a: "Sí. Su base ancha se mantiene plana en el suelo, así que puedes soltarlo sin apoyarlo en la pared." },
      { q: "¿La luz necesita baterías?", a: "Sí, y ya vienen incluidas. Antes del primer uso, retira la lámina aislante y vuelve a enroscar la linterna." },
      { q: "¿Cuánto pesa?", a: "Aproximadamente 1 libra. Plegado mide unos 30 × 20 cm." },
    ],
  },
  {
    id: "mini-masajeador",
    // El Salvador only: texts in Spanish (from the user's reference page, without its medical claims), prices in US dollars
    name: "Mini masajeador eléctrico 8 modos y 18 intensidades",
    sku: "LD-P-3680298", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Health & comfort",
    price: 36.99, // user's price; 2 pieces is my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "💆",
    image: "images/mini-main.jpg",
    squarePhotos: true, // top photos shown whole
    // Photos of the reference page, original files (no re-compression)
    images: ["images/mini-main.jpg", "images/mini-espalda.jpg", "images/mini-pantalla.jpg", "images/mini-parche.jpg", "images/mini-zonas.jpg", "images/mini-carga.jpg", "images/mini-modos.png", "images/mini-uso.jpg", "images/mini-regalo.jpg"],
    description: "Un mini masajeador eléctrico con parche adhesivo: lo pegas en la espalda, el cuello, los hombros o las piernas y te da un masaje relajante en solo 15 minutos.",
    // The user wants 2 choices only: 1 or 2 pieces
    offers: [
      { qty: 1, price: 36.99 },
      { qty: 2, price: 62.99, tag: "Best value" },
    ],
    layout: "story",
    timeline: [1, 1, 3], // on its way tomorrow, delivered in 1 to 3 days
    headline: "¡Un masaje de 15 minutos al día, donde y cuando quieras!",
    subheadline: "Ayuda a aliviar la tensión muscular y te relaja después de un día largo.",
    inBox: ["1 Mini masajeador eléctrico", "Parche de gel adhesivo", "Cable de carga USB"],
    warning: "No lo uses si tienes marcapasos u otro implante electrónico, si estás embarazada, si tienes una enfermedad del corazón o epilepsia, ni sobre heridas, la cabeza, la garganta o el pecho. Si tienes una enfermedad, consulta a tu médico antes de usarlo.",
    problem: {
      title: "¿Espalda, cuello u hombros tensos?",
      text: "Horas sentado frente a la computadora, cargando cosas o de pie todo el día: al final del día los músculos se sienten cargados y no te dejan descansar.",
    },
    solution: {
      title: "Un masaje real, sin salir de casa",
      text: "Solo tienes que encenderlo, colocarlo en la zona tensa y dejar que sus impulsos relajantes trabajen mientras descansas, trabajas o ves la tele.",
    },
    benefits: [
      { icon: "💆", title: "8 modos de masaje", text: "8 técnicas diferentes: golpeteo, amasado, presión y más." },
      { icon: "🎚️", title: "18 intensidades", text: "De suave a más fuerte: sube o baja la intensidad con los botones y la ves en la pantalla." },
      { icon: "🩹", title: "Parche adhesivo", text: "Se pega solo al cuerpo, sin cables: tienes las manos libres." },
      { icon: "🔋", title: "Recargable por USB", text: "Carga rápida y batería de larga duración." },
    ],
    sections: [
      {
        image: "images/mini-alivio.mp4",
        title: "Ayuda a aliviar la tensión muscular",
        text: "Este masajeador te da una sensación de masaje real en los músculos cargados: piernas, brazos, espalda o cuello.",
      },
      {
        image: "images/mini-musculos.mp4",
        title: "Úsalo en diferentes zonas del cuerpo",
        text: "Pantorrillas, muslos, brazos, espalda baja, hombros o cuello: lo pegas donde lo necesitas.",
      },
      {
        image: "images/mini-espalda.jpg",
        title: "Relájate después de un día largo",
        text: "Colócalo en la espalda, acuéstate y deja que el masaje te relaje. Úsalo 15 minutos al día.",
      },
      {
        image: "images/mini-modos.png",
        title: "8 modos de masaje",
        text: "Masaje, golpeteo, presión, amasado y más: cambia de modo con un botón hasta encontrar el que más te gusta.",
      },
      {
        image: "images/mini-pantalla.jpg",
        title: "Fácil de usar",
        text: "Botones para subir y bajar la intensidad, un botón para cambiar de modo y una pantalla que te muestra la fuerza del masaje.",
      },
      {
        image: "images/mini-real.mp4",
        title: "Pequeño y fácil de llevar",
        text: "Mide solo 7.4 cm de diámetro y 1.8 cm de grosor: cabe en tu cartera para relajarte en cualquier momento, en la casa, la oficina o de viaje.",
      },
      {
        image: "images/mini-parche.jpg",
        title: "Diseño de parche adhesivo",
        text: "Después de usarlo, cubre el parche de gel con su protector para que siga pegando bien.",
      },
      {
        image: "images/mini-uso.jpg",
        title: "Para todos",
        text: "Para quien trabaja sentado, para quien hace ejercicio, para quien carga peso o pasa el día de pie.",
      },
      {
        image: "images/mini-mano.mp4",
        title: "Recargable por USB",
        text: "Se carga en unas 2.5 horas con su cable USB. Carga rápida y batería de larga duración.",
      },
      {
        image: "images/mini-regalo.jpg",
        title: "Perfecto para un regalo 🎁",
        text: "Una forma fácil y cómoda de relajarse: un buen regalo para tu mamá, tu papá, tu pareja o tus amigos.",
      },
    ],
    steps: [
      { title: "Prepara el parche", text: "Gira el dispositivo con el parche de gel y retira la película transparente." },
      { title: "Colócalo", text: "Pégalo en la zona que quieres relajar." },
      { title: "Enciéndelo", text: "Pulsa ON/INC para encender y empezar, y el botón de programa para elegir el modo." },
    ],
    // Specs: from the reference page and its photos
    specs: {
      "Tipo": "Mini masajeador eléctrico con parche de gel adhesivo",
      "Modos": "8",
      "Niveles de intensidad": "18",
      "Medidas": "7.4 cm de diámetro, 1.8 cm de grosor",
      "Pantalla": "Digital, muestra la intensidad",
      "Carga": "USB, unas 2.5 horas",
      "Uso recomendado": "15 minutos al día",
    },
    faq: [
      { q: "¿Duele?", a: "No. Se siente como un hormigueo o pequeños golpecitos. Empieza con la intensidad más baja y súbela poco a poco." },
      { q: "¿Cuánto tiempo lo uso?", a: "Unos 15 minutos por sesión." },
      { q: "¿Dónde lo puedo usar?", a: "En la espalda, el cuello, los hombros, los brazos o las piernas. No lo uses en la cabeza, la garganta, el pecho ni sobre heridas." },
      { q: "¿Cómo se carga?", a: "Con su cable USB, en unas 2.5 horas." },
      { q: "¿El parche se puede volver a usar?", a: "Sí. Después de usarlo, cúbrelo con su protector para que siga pegando bien." },
    ],
  },
  {
    id: "multi-collagen",
    // El Salvador only: texts in Spanish (from the user's own page), prices in US dollars
    name: "Multi Collagen Complex, 90 caps",
    sku: "LD-P-19492", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Health & comfort",
    price: 40.99, // user's price; 2 and 3 bottles are my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "💊",
    image: "images/collagen-main.jpg",
    // Graphics made for this page with the 90-capsule bottle (Spanish text, style of the user's reference page)
    images: ["images/collagen-main.jpg", "images/collagen-8en1.jpg", "images/collagen-guia.jpg", "images/collagen-capsulas.jpg"],
    description: "Pensado para tu rutina de belleza: cabello, piel, uñas y articulaciones. 5 tipos de colágeno con biotina, vitamina C y ácido hialurónico. 90 cápsulas.",
    offers: [
      { qty: 1, price: 40.99 },
      { qty: 2, price: 69.99, tag: "Best value" },
      { qty: 3, price: 94.99 },
    ],
    layout: "ritual", // same order of blocks as the reference page the user chose (js/landing.js)
    timeline: [1, 1, 3], // on its way tomorrow, delivered in 1 to 3 days
    eyebrow: "Belleza y bienestar",
    // Facts about the ingredients only, no promised result. Dose: the label, we don't have it for 90 caps.
    features: [
      { mark: "5", title: "Cinco tipos de colágeno", text: "Tipos I, II, III, V y X en una sola fórmula." },
      { mark: "✦", title: "Tu rutina de belleza", text: "Pensado para acompañar el cuidado de tu piel, cabello y uñas." },
      { mark: "◐", title: "Ácido hialurónico", text: "Presente de forma natural en la piel." },
      { mark: "✓", title: "Articulaciones", text: "Incluye colágeno tipo II, el que se encuentra en el cartílago." },
      { mark: "C", title: "Vitamina C y biotina", text: "Nutrientes añadidos a la fórmula." },
      { mark: "90", title: "Cápsulas prácticas", text: "90 cápsulas, sin mezclar y sin sabor." },
    ],
    about: {
      title: "Sobre este colágeno",
      lead: "Colágeno en cápsulas, fácil de incluir en tu día a día.",
      text: "Multi Collagen Complex reúne colágeno hidrolizado tipos I, II, III, V y X de origen bovino, marino, de pollo y de membrana de huevo, junto con biotina, vitamina C y ácido hialurónico.",
    },
    why: [
      { title: "Para tu piel", text: "El colágeno es una de las principales proteínas de la piel, y el ácido hialurónico también está presente en ella de forma natural." },
      { title: "Para tu cabello y uñas", text: "Con biotina (vitamina B7), la vitamina que muchas mujeres buscan para su rutina de cabello y uñas." },
      { title: "Para tus articulaciones", text: "Incluye colágeno tipo II, el tipo que se encuentra en el cartílago de las articulaciones." },
      { title: "Con vitamina C", text: "Contribuye a la formación normal de colágeno en el cuerpo." },
      { title: "Cápsulas", text: "Sin mezclar y sin sabor." },
    ],
    // Sources are on the supplier's photo: allergy warning
    warning: "Contiene pescado y huevo. Complemento alimenticio: no sustituye una alimentación equilibrada ni un estilo de vida saludable. Si estás embarazada, amamantando, tomas medicamentos, tienes una enfermedad o alguna alergia alimentaria, consulta a tu médico antes de usarlo. Mantener fuera del alcance de los niños.",
    accordions: [
      { title: "Cómo tomarlo", text: "Sigue las indicaciones de la etiqueta del producto. Consulta a un profesional de salud si tienes dudas sobre su uso." },
      { title: "Envío y entrega", text: "Envío gratis en El Salvador. Tu pedido llega en 1 a 3 días." },
      { title: "Pago contra entrega", text: "No pagas nada ahora. Te llamamos para confirmar y pagas en efectivo cuando recibes tu pedido." },
    ],
    band: {
      eyebrow: "Un hábito para ti",
      title: "Cabello, piel, uñas y articulaciones: cuídalos cada día.",
      text: "Con los años, tu cuerpo produce menos colágeno de forma natural. Aquí tienes cinco tipos de colágeno con vitamina C, biotina y ácido hialurónico, en un solo frasco.",
      images: ["images/collagen-8en1.jpg", "images/collagen-guia.jpg", "images/collagen-capsulas.jpg"],
    },
    compare: {
      eyebrow: "Por qué este producto",
      title: "Más en una sola fórmula.",
      head: ["Contenido", "Incluido", "Detalle"],
      rows: [
        ["Colágeno tipos I, II, III, V y X", "5 tipos"],
        ["Vitamina C, biotina y ácido hialurónico", "Añadidos"],
        ["Sin mezclar y sin sabor", "Cápsulas"],
        ["Presentación", "90 cápsulas"],
      ],
    },
    cards: {
      eyebrow: "Cada día",
      title: "Constancia, sin complicaciones.",
      text: "Un formato en cápsulas, sin sabor, fácil de añadir a tu rutina diaria.",
      items: [
        { title: "Cinco tipos de colágeno", text: "Tipos I, II, III, V y X." },
        { title: "Nutrientes añadidos", text: "Vitamina C, biotina y ácido hialurónico." },
        { title: "Pagas al recibir", text: "Pides hoy y pagas en efectivo cuando llega a tu casa." },
      ],
    },
    faq: [
      { q: "¿Qué contiene el producto?", a: "Contiene cinco tipos de colágeno (I, II, III, V y X), biotina, vitamina C y ácido hialurónico." },
      { q: "¿Cuántas cápsulas contiene?", a: "El frasco contiene 90 cápsulas." },
      { q: "¿Cuándo voy a notar algo?", a: "Cada cuerpo es diferente y no podemos prometerte un resultado. Lo importante es la constancia: tómalo como indica la etiqueta y acompáñalo de una alimentación equilibrada." },
      { q: "¿Cómo debo consumirlo?", a: "Sigue las indicaciones de la etiqueta del producto. Consulta a un profesional de salud si tienes dudas sobre su uso." },
      { q: "¿Quién no debe tomarlo?", a: "No lo tomes si eres alérgica al pescado, al huevo o a otro de sus ingredientes. Si estás embarazada, amamantando, tomas medicamentos o tienes una enfermedad, consulta a tu médico antes de usarlo." },
    ],
  },
];

// A link to a product sold in other countries only (e.g. an ad link without &country=lb, opened
// on a phone that chose Zambia before) reopens the same page in the product's country.
{
  const p = PRODUCTS.find((x) => x.id === new URLSearchParams(location.search).get("id"));
  const open = p?.countries?.filter((c) => COUNTRIES[c]) || [];
  if (open.length && !open.includes(COUNTRY.id)) {
    const url = new URL(location.href);
    url.searchParams.set("country", open[0]);
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
