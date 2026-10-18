/* Live site: https://dukaabora.netlify.app/ (Netlify deploys every push to GitHub main) */
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
  instagram: "",
  facebook: "",
  currency: "TSh",
  // Google Sheet that receives every order — paste your Apps Script web app URL here
  // (setup steps: google-sheet/orders.gs). Empty = orders are NOT sent to you.
  ordersUrl: "https://script.google.com/macros/s/AKfycbxrx2C83Ns29ULrZWcvHh2EgiJTBEjTDvsinnvz81WAV8ODzpkwsm_Z6V1An7w54lEiRQ/exec",
};

/* ==========================================================
   PRODUCTS — add, remove or edit products here.
   - price / oldPrice are in Tanzanian Shillings (TZS)
   - image: put photos in the /images folder (square, ~800x800).
     If an image is missing, a styled placeholder is shown instead.
   - Every product gets its own landing page: product.html?id=<id>
     (use that link in your Facebook / TikTok / Instagram ads).
   - home: false  hides a product from the home page (its own page still works)
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
        image: "images/cns-before-after.gif",
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
    description: "Spray, wipe, and your car shines like new. This nano coating cleans without water, hides fine scratches and leaves a water-repellent layer that keeps rain, mud and dust off the paint.",
    landing: {
      showcaseTitle: ["Showroom shine,", "in minutes"],
      showcaseText: "Spray, wipe and drive: your car looks clean and shiny again.",
    },
  },
];
