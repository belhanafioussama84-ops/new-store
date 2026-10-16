# Duka Bora: Online Store for Tanzania

A fast, mobile-first storefront built for Tanzanian shoppers:

- **Free shipping** to all 31 regions (Zanzibar and Pemba included)
- **Cash on Delivery (COD)** checkout. Customers pay nothing upfront.
- Prices in **Tanzanian Shillings (TSh)**
- Tanzanian phone validation (`+255 6XX / 7XX ...`) and a dropdown of all regions
- Orders are sent to your **WhatsApp** with the full order details
- No cart: each product has one "Order now" button that opens a quick COD checkout with a quantity picker
- Responsive layout built for phones

It's plain HTML, CSS and JavaScript, so there's no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Customize

| What | Where |
|---|---|
| Logo | put `logo.png` in `images/logo/` (shown in the header, footer and browser tab) |
| Store name, WhatsApp number, phone | top of `js/products.js` (`STORE`) |
| Products, prices, descriptions | `js/products.js` (`PRODUCTS`) |
| Product photos | put square images in `images/` (for example `images/earbuds-pro.jpg`). Products without a photo show a styled icon tile. |
| Colours, fonts | variables at the top of `css/style.css` |
| Brand name in the page text | `index.html` (search for "Duka Bora") |

**Set your real WhatsApp number** in `STORE.whatsapp` before going live. Use digits only, for example `255712345678`.

## How orders work

1. The customer fills in name, phone, region, district and landmark.
2. The site shows an order number and a button that opens WhatsApp with the full order already written out.
3. A copy of each order is kept in the customer's browser (`localStorage`).

To collect orders automatically without WhatsApp, connect the `submitOrder` function in `js/app.js` to a backend, Google Sheets (Apps Script) or a form service.

## Deploy for free

Netlify, Vercel, GitHub Pages and Cloudflare Pages can all host it. Upload the folder and it works.
