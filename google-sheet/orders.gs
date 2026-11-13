/**
 * Duka Bora — receive website orders in a Google Sheet.
 * The columns follow the Simon Express "import parcels" table, so the sheet can be
 * downloaded as .xlsx (File → Download → Microsoft Excel) and imported there directly.
 *
 * SETUP (one time):
 *  1. Create a new Google Sheet (sheets.new) and name it e.g. "Duka Bora Orders".
 *  2. Menu Extensions → Apps Script. Delete everything in the editor and paste this whole file. Save.
 *  3. Click Deploy → New deployment → gear icon → "Web app".
 *       - Execute as:      Me
 *       - Who has access:  Anyone
 *     Click Deploy, allow the permissions, and copy the "Web app URL" (ends with /exec).
 *  4. Paste that URL in js/products.js → STORE.ordersUrl.
 *
 * Every order then appears as a new row in the "Orders" tab (Lebanon: the "Orders Lebanon" tab,
 * El Salvador: the "Orders El Salvador" tab).
 * If you change this code later: Deploy → Manage deployments → edit → Version: New version → Deploy
 * (the URL stays the same).
 *
 * SOUND ON YOUR PHONE FOR EVERY NEW ORDER (Telegram, free):
 *  1. In Telegram open @BotFather → send /newbot → choose a name → copy the token it gives you.
 *  2. Paste it below in TELEGRAM_TOKEN. Open your new bot in Telegram and press Start.
 *  3. In the Apps Script editor choose "getTelegramChatId" in the function list at the top → Run
 *     (allow the permissions). Copy the number shown in the log into TELEGRAM_CHAT_ID.
 *  4. Choose "testTelegram" → Run: your phone should ring. Then Deploy → Manage deployments →
 *     edit → Version: New version → Deploy.
 *  The token and chat ID are then kept in the script's settings (Project Settings → Script
 *  Properties): when you paste a new version of this file later, leave the two lines empty and
 *  Telegram keeps working.
 *
 * SEND EVERY ORDER TO META TOO (Conversions API: Facebook counts orders even when the
 * customer's phone blocks the pixel; same order number as the pixel, so never counted twice):
 *  1. Meta Events Manager → the pixel (wqw, 2505097906522683) → Settings → Conversions API →
 *     Generate access token. Copy it.
 *  2. Paste it below in META_CAPI_TOKEN (only in Apps Script, never in the GitHub copy).
 *  3. Choose "testMetaCapi" in the function list at the top → Run → allow the permissions.
 *     The log must say "Token OK". Then Deploy → Manage deployments → edit → New version → Deploy.
 *  Like Telegram, the token is then kept in the script's settings: later versions of this file
 *  can be pasted with the line left empty.
 *
 * Rows received before this format: in the Apps Script editor choose "fixOldRows" in the
 * function list at the top and click Run (once).
 */

const SHEET_NAME = "Orders";
// Lebanese orders go to their own tab, with exactly the 9 columns of the COD Services import
// template (created automatically at the first order). Everything else (Tanzania, Zambia) goes
// to SHEET_NAME. To import them: menu Duka Bora → Download Lebanon orders (.xlsx).
const LEBANON_SHEET = "Orders Lebanon";
const LEBANON_HEADERS = [
  "date_order", "full_name", "phone", "address", "city", "sku", "qte", "price", "note",
];
// El Salvador orders (?country=sv) go to their own tab, with exactly the 14 columns of the
// LatinDrop import template (latinedrop-template-SV.xlsx, sheet "Commandes"), created
// automatically at the first order. Code produit and Variante are left empty; SKU = the
// LatinDrop SKU ("LD-P-…", the "sku" of each product's "sv" part in js/products.js).
// To import them: menu Duka Bora → Download El Salvador orders (.xlsx).
// "Qui confirme" column: who calls the customer to confirm, "Latine Drop" or "Moi".
const SALVADOR_CONFIRM = "Latine Drop";
const SALVADOR_SHEET = "Orders El Salvador";
const SALVADOR_HEADERS = [
  "Réf. commande", "Nom du client", "Téléphone", "Département", "Municipalité", "Adresse",
  "Point de repère", "SKU", "Code produit", "Variante", "Quantité", "Prix COD", "Qui confirme", "Note",
];
// Column order of the "Orders" tab = Simon Express import table.
// VILLE and PRODUIT are left empty on purpose; the product name goes in REF.
// PAYS (Tanzania / Zambia, last column) is not in the Simon Express table: PRIX is in TSh
// for Tanzania and in Kwacha for Zambia. Delete that column before importing if Simon Express refuses it.
const HEADERS = [
  "CODE SUIVI", "DESTINATAIRE", "TELEPHONE", "ADRESSE", "PRIX", "VILLE",
  "PRODUIT", "REF", "QTY", "OUVRIR", "REMPLACER", "PAYS",
];
// First CODE SUIVI when the sheet has none yet; after that each order gets the last code + 1.
const FIRST_CODE = 1;
// Telegram message on every new order (setup above). Empty = the ones saved before are used
// (none saved = no message). Never put them in the GitHub copy of this file: it is public.
const TELEGRAM_TOKEN = "";
const TELEGRAM_CHAT_ID = "";
// Meta Conversions API (setup above). Never put the token in the GitHub copy of this file.
const META_PIXEL_ID = "2505097906522683";
const META_CAPI_TOKEN = "";

// The token and chat ID: the ones written above (saved for next time), else the saved ones.
function telegram_() {
  const props = PropertiesService.getScriptProperties();
  if (TELEGRAM_TOKEN) props.setProperty("TELEGRAM_TOKEN", TELEGRAM_TOKEN);
  if (TELEGRAM_CHAT_ID) props.setProperty("TELEGRAM_CHAT_ID", String(TELEGRAM_CHAT_ID));
  return { token: props.getProperty("TELEGRAM_TOKEN") || "", chatId: props.getProperty("TELEGRAM_CHAT_ID") || "" };
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // two orders at the same moment must not get the same code
  try {
    const o = JSON.parse(e.postData.contents);
    // "Add one more" on the thank-you page (El Salvador): changes the order's row
    if (o.upsell) return json_(upsell_(o.upsell));
    if (o.country === "El Salvador") {
      const sheet = getOrdersSheet_(SALVADOR_SHEET, SALVADOR_HEADERS);
      // Already there (sent twice, or its upsell arrived first): nothing to add
      if (salvadorRowOf_(sheet, o.number)) return json_({ ok: true, duplicate: true });
      sheet.appendRow(salvadorRow_(o));
      sendMetaPurchase_(o);
      notifyTelegram_(o.number, o);
      return json_({ ok: true });
    }
    if (o.country === "Lebanon") {
      const sheet = getOrdersSheet_(LEBANON_SHEET, LEBANON_HEADERS);
      sheet.appendRow([
        Utilities.formatDate(new Date(o.date || Date.now()), "Asia/Beirut", "yyyy-MM-dd HH:mm"),
        text_(o.customer.fullName),
        localPhone_(o.customer.phone),
        // Orders from before the City / Address split only have customer.city ("City, address")
        text_(o.customer.town ? o.customer.street : o.customer.city),
        text_(o.customer.town || ""),
        text_(o.product.sku || o.product.name), // products without a SKU: their name
        Number(o.product.qty) || 1,
        Number(o.total) || 0,
        // note: the product name next to its SKU (the site sends "Name (sku)")
        text_(o.product.sku ? o.product.name.replace(" (" + o.product.sku + ")", "") : ""),
      ]);
      sendMetaPurchase_(o);
      notifyTelegram_(sheet.getLastRow() - 1, o);
      return json_({ ok: true });
    }
    const sheet = getOrdersSheet_();
    const code = nextCode_(sheet);
    sheet.appendRow([
      code,
      text_(o.customer.fullName),
      localPhone_(o.customer.phone),
      text_(o.customer.city), // ADRESSE: the "City & delivery address" field
      Number(o.total) || 0,
      "", // VILLE: empty
      "", // PRODUIT: empty
      text_(o.product.name), // REF
      Number(o.product.qty) || 1,
      "OUI",
      "NON",
      text_(o.country || "Tanzania"), // orders sent before the Zambia version have no country
    ]);
    sendMetaPurchase_(o);
    notifyTelegram_(code, o);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// One row of the "Orders El Salvador" tab (the 14 LatinDrop columns).
function salvadorRow_(o) {
  return [
    text_(o.number), // Réf. commande
    text_(o.customer.fullName), // Nom du client
    salvadorPhone_(o.customer.phone), // Téléphone: "7123 4567", like the LatinDrop example
    text_(o.customer.region || ""), // Département
    text_(o.customer.town || ""), // Municipalité
    text_(o.customer.street || o.customer.city), // Adresse
    text_(o.customer.landmark || ""), // Point de repère
    text_(o.product.sku || ""), // SKU
    "", // Code produit
    "", // Variante
    Number(o.product.qty) || 1, // Quantité
    Number(o.total) || 0, // Prix COD
    SALVADOR_CONFIRM, // Qui confirme
    // Note: the product name (the site sends "Name (sku)")
    text_(o.product.sku ? o.product.name.replace(" (" + o.product.sku + ")", "") : o.product.name),
  ];
}

// Row number of an order in the El Salvador tab (column A = Réf. commande), or 0.
function salvadorRowOf_(sheet, number) {
  const last = sheet.getLastRow();
  if (last < 2 || !number) return 0;
  const refs = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = refs.length - 1; i >= 0; i--) if (String(refs[i][0]) === String(number)) return i + 2;
  return 0;
}

// The customer pressed "Yes, add it to my order" on the thank-you page: new Quantité and
// Prix COD in the order's row, "UPSELL" in its Note. If the order is not there yet, the
// whole order is written with the new quantity (the first one is then skipped, see doPost).
// A row already downloaded (grey) is changed too, and Telegram says to fix it in LatinDrop.
function upsell_(o) {
  if (o.country !== "El Salvador") return { ok: false, error: "upsell: El Salvador only" };
  const sheet = getOrdersSheet_(SALVADOR_SHEET, SALVADOR_HEADERS);
  const row = salvadorRowOf_(sheet, o.number);
  const u = o.upsell || {};
  const tag = "UPSELL: " + (u.fromQty || "?") + " → " + o.product.qty + " (+$" + (Number(u.extra) || 0).toFixed(2) + ")";
  let downloaded = false;
  if (row) {
    downloaded = sheet.getRange(row, 1).getBackground() === SENT_COLOR;
    sheet.getRange(row, 11, 1, 2).setValues([[Number(o.product.qty) || 1, Number(o.total) || 0]]);
    const note = sheet.getRange(row, 14);
    note.setValue(text_(String(note.getValue() || "") + " · " + tag));
    sheet.getRange(row, 11, 1, 2).setFontWeight("bold").setFontColor("#b45309");
  } else {
    const r = salvadorRow_(o);
    r[13] = text_(r[13] + " · " + tag);
    sheet.appendRow(r);
    sendMetaPurchase_({ ...o, product: { ...o.product, qty: u.fromQty || o.product.qty }, total: u.fromTotal || o.total });
  }
  const tg = telegram_();
  if (tg.token && tg.chatId) {
    try {
      sendTelegram_([
        "⬆️ Upsell " + o.number + " 🇸🇻 El Salvador",
        o.product.name + " × " + o.product.qty + " (was × " + (u.fromQty || "?") + ")",
        "💰 $ " + (Number(o.total) || 0).toFixed(2) + " (+$" + (Number(u.extra) || 0).toFixed(2) + ")",
        "👤 " + o.customer.fullName,
        downloaded ? "⚠️ This order was already downloaded: change it in LatinDrop too." : "",
      ].filter(Boolean).join("\n"));
    } catch (err) {
      console.error("Telegram: " + err);
    }
  }
  return { ok: true };
}

// Lets you check the URL works by opening it in a browser.
function doGet() {
  return json_({ ok: true, message: "Duka Bora orders endpoint is running." });
}

// "Duka Bora" menu at the top of the sheet (appears when the sheet is opened).
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Duka Bora")
    .addItem("Download NEW Lebanon orders (.xlsx)", "downloadNewLebanonOrders")
    .addItem("Download ALL Lebanon orders (.xlsx)", "downloadAllLebanonOrders")
    .addSeparator()
    .addItem("Download NEW El Salvador orders (.xlsx)", "downloadNewSalvadorOrders")
    .addItem("Download ALL El Salvador orders (.xlsx)", "downloadAllSalvadorOrders")
    .addToUi();
}

// Rows already downloaded are greyed out in their tab (their data stays there).
const SENT_COLOR = "#d9d9d9";

// Lebanon: COD Services import (.xlsx). El Salvador: LatinDrop import (.xlsx, sheet "Commandes").
const EXPORTS_ = {
  lb: {
    sheet: LEBANON_SHEET, headers: LEBANON_HEADERS, label: "Lebanon", format: "xlsx",
    title: "COD Services import ", timeZone: "Asia/Beirut", prop: "LB_EXPORT_FILE",
    textCols: ["B", "C", "D", "E", "F", "I"],
  },
  sv: {
    sheet: SALVADOR_SHEET, headers: SALVADOR_HEADERS, label: "El Salvador", format: "xlsx", tab: "Commandes",
    title: "LatinDrop import ", timeZone: "America/El_Salvador", prop: "SV_EXPORT_FILE",
    textCols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "M", "N"],
  },
};

function downloadNewLebanonOrders() { downloadOrders_(EXPORTS_.lb, true); }
function downloadAllLebanonOrders() { downloadOrders_(EXPORTS_.lb, false); }
function downloadNewSalvadorOrders() { downloadOrders_(EXPORTS_.sv, true); }
function downloadAllSalvadorOrders() { downloadOrders_(EXPORTS_.sv, false); }

// Puts the orders of one tab (only the ones not downloaded yet, or all) in a separate file with
// exactly that tab's columns, shows its download link, then greys those rows out.
// (File → Download would put every tab in the file, with "Orders" first.)
function downloadOrders_(cfg, onlyNew) {
  const ui = SpreadsheetApp.getUi();
  const sheet = getOrdersSheet_(cfg.sheet, cfg.headers);
  const n = sheet.getLastRow() - 1;
  const cols = cfg.headers.length;
  const range = n > 0 ? sheet.getRange(2, 1, n, cols) : null;
  const values = range ? range.getValues() : [];
  const colors = range ? range.getBackgrounds() : [];
  const rows = [];
  values.forEach((r, i) => {
    if (!r.join("")) return; // empty row
    if (onlyNew && colors[i][0] === SENT_COLOR) return;
    rows.push({ r, i });
  });
  if (!rows.length) return ui.alert("No new " + cfg.label + " orders: every order was already downloaded.");

  // The file to import, made fresh each time; the one from last time goes to the trash
  const props = PropertiesService.getScriptProperties();
  const old = props.getProperty(cfg.prop);
  if (old) { try { DriveApp.getFileById(old).setTrashed(true); } catch (err) { /* already gone */ } }
  const out = SpreadsheetApp.create(cfg.title + Utilities.formatDate(new Date(), cfg.timeZone, "yyyy-MM-dd HH-mm"));
  props.setProperty(cfg.prop, out.getId());
  const tab = out.getSheets()[0].setName(cfg.tab || "Orders");
  tab.getRange(1, 1, 1, cols).setValues([cfg.headers]).setFontWeight("bold");
  // Text columns stay text (a phone "+961 …" / "+503 …" must not turn into a number)
  cfg.textCols.forEach((c) => tab.getRange(c + ":" + c).setNumberFormat("@"));
  tab.getRange(2, 1, rows.length, cols).setValues(rows.map((x) => x.r));
  SpreadsheetApp.flush();

  rows.forEach((x) => sheet.getRange(x.i + 2, 1, 1, cols).setBackground(SENT_COLOR));
  const url = "https://docs.google.com/spreadsheets/d/" + out.getId() + "/export?format=" + cfg.format;
  ui.showModalDialog(
    HtmlService.createHtmlOutput(
      '<p style="font-family:sans-serif">' + rows.length + " order(s) in the file. They are now grey in the tab.</p>" +
      '<p><a href="' + url + '" target="_blank" style="font-family:sans-serif;font-size:16px">⬇️ Download the .' + cfg.format + " file</a></p>"
    ).setWidth(380).setHeight(150),
    cfg.label + " orders"
  );
}

// The tab named `name` (default: the main "Orders" tab), created with its headers if missing.
// The main tab gets its headers replaced if they are the old ones (see fixOldRows). Another tab
// whose rows are in other columns is renamed "<name> (old <date>)" and a new one is started.
function getOrdersSheet_(name = SHEET_NAME, headers = HEADERS) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  const same = (s) => s.getRange(1, 1, 1, headers.length).getValues()[0].join("|") === headers.join("|");
  if (sheet && name !== SHEET_NAME && !same(sheet) && sheet.getLastRow() > 1) {
    sheet.setName(name + " (old " + Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd HH-mm") + ")");
    sheet = null;
  }
  sheet = sheet || ss.insertSheet(name);
  if (!same(sheet)) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#0d1f17").setFontColor("#f3c36b");
    sheet.setFrozenRows(1);
    if (headers === SALVADOR_HEADERS) sheet.getRange("L:L").setNumberFormat("0.00"); // Prix COD (USD)
    else sheet.getRange(headers === HEADERS ? "E:E" : "H:H").setNumberFormat("#,##0"); // PRIX / price
  }
  return sheet;
}

// Last numeric CODE SUIVI in column A + 1.
function nextCode_(sheet) {
  const last = sheet.getLastRow();
  if (last < 2) return FIRST_CODE;
  const codes = sheet.getRange(2, 1, last - 1, 1).getValues().map((r) => Number(r[0])).filter((n) => n > 0);
  return codes.length ? Math.max.apply(null, codes) + 1 : FIRST_CODE;
}

// "+255 767967779" → "0767967779" (the local format Simon Express uses), same for Zambia (+260).
// Lebanon stays "+961 71234567" (Lebanese mobile numbers are not written with a 0).
// The leading ' keeps it as text so Sheets does not drop the 0 or the +.
function localPhone_(v) {
  const s = String(v == null ? "" : v);
  if (/^\+?(961|503)/.test(s.trim())) return "'" + s.trim(); // Lebanon, El Salvador: kept as "+503 7000 0000"
  const digits = s.replace(/\D/g, "").replace(/^(255|260)/, "").replace(/^0/, "");
  return digits ? "'0" + digits : "";
}

// "+503 71234567" → "7123 4567" (the format of the LatinDrop example; the ' keeps it as text).
function salvadorPhone_(v) {
  const d = String(v == null ? "" : v).replace(/\D/g, "").replace(/^503(?=\d{8}$)/, "");
  return d.length === 8 ? "'" + d.slice(0, 4) + " " + d.slice(4) : "'" + d;
}

const FLAGS_ = { Tanzania: "🇹🇿", Zambia: "🇿🇲", Lebanon: "🇱🇧", "El Salvador": "🇸🇻" };

// Sends the new order to your Telegram. A failure here never loses the order (the row is already saved).
function notifyTelegram_(code, o) {
  const tg = telegram_();
  if (!tg.token || !tg.chatId) return;
  try {
    sendTelegram_([
      "🛒 New order #" + code + " " + (FLAGS_[o.country || "Tanzania"] || "") + " " + (o.country || "Tanzania"),
      o.product.name + " × " + (Number(o.product.qty) || 1),
      "💰 " + (o.currency || "TSh") + " " + (Number(o.total) || 0).toLocaleString("en-US"),
      "👤 " + o.customer.fullName,
      "📞 " + localPhone_(o.customer.phone).replace(/^'/, ""),
      "📍 " + o.customer.city,
    ].join("\n"));
  } catch (err) {
    console.error("Telegram: " + err);
  }
}

function sendTelegram_(text) {
  const tg = telegram_();
  UrlFetchApp.fetch("https://api.telegram.org/bot" + tg.token + "/sendMessage", {
    method: "post",
    payload: { chat_id: tg.chatId, text: text },
  });
}

// Run by hand once (setup step 3): shows your chat ID after you pressed Start in your bot.
function getTelegramChatId() {
  const res = JSON.parse(UrlFetchApp.fetch("https://api.telegram.org/bot" + telegram_().token + "/getUpdates").getContentText());
  const chats = (res.result || []).map((u) => (u.message || {}).chat).filter(Boolean);
  if (!chats.length) return console.log("No message yet: open your bot in Telegram, press Start, then run this again.");
  console.log("TELEGRAM_CHAT_ID = " + chats[chats.length - 1].id);
}

/* ---------- Meta Conversions API ---------- */

// The token written above (saved for next time), else the saved one.
function metaToken_() {
  const props = PropertiesService.getScriptProperties();
  if (META_CAPI_TOKEN) props.setProperty("META_CAPI_TOKEN", META_CAPI_TOKEN);
  return props.getProperty("META_CAPI_TOKEN") || "";
}

function sha256_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8)
    .map((b) => ((b + 256) % 256).toString(16).padStart(2, "0")).join("");
}

// "Santa Tecla" → "santatecla" (Meta's format for cities: lowercase a-z, no accents or spaces)
const plain_ = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");

const META_COUNTRY_ = { Tanzania: ["tz", "TZS"], Zambia: ["zm", "ZMW"], Lebanon: ["lb", "USD"], "El Salvador": ["sv", "USD"] };

// The Purchase event of one order, with the same event_id (order number) as the pixel on the
// thank-you page: Meta keeps only one of the two. Customer details are hashed (SHA-256).
// testCode: only for testMetaCapi (the event then shows in "Test events" and is not counted).
function metaPurchaseBody_(o, testCode) {
  const [cc, cur] = META_COUNTRY_[o.country || "Tanzania"] || ["", "USD"];
  const m = o.meta || {};
  const names = String(o.customer.fullName || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const qty = Number(o.product.qty) || 1;
  const now = Math.floor(Date.now() / 1000);
  const time = Math.floor(Date.parse(o.date || "") / 1000);
  const ud = { ph: [sha256_(String(o.customer.phone || "").replace(/\D/g, ""))] };
  if (cc) ud.country = [sha256_(cc)];
  if (names[0]) ud.fn = [sha256_(names[0])];
  if (names.length > 1) ud.ln = [sha256_(names[names.length - 1])];
  if (plain_(o.customer.town)) ud.ct = [sha256_(plain_(o.customer.town))];
  if (m.fbp) ud.fbp = m.fbp;
  if (m.fbc) ud.fbc = m.fbc;
  if (m.ua) ud.client_user_agent = m.ua;
  if (m.ip) ud.client_ip_address = m.ip;
  const body = { data: [{
    event_name: "Purchase",
    event_time: time > 0 && time <= now ? time : now,
    event_id: String(o.number),
    action_source: "website",
    event_source_url: m.url || "https://dukaabora.store/",
    user_data: ud,
    custom_data: {
      currency: o.currencyCode || cur, value: Number(o.total) || 0, content_type: "product",
      content_ids: [String(o.product.id || "")], contents: [{ id: String(o.product.id || ""), quantity: qty }], num_items: qty,
    },
  }] };
  if (testCode) body.test_event_code = testCode;
  return body;
}

function postToMeta_(body) {
  return UrlFetchApp.fetch("https://graph.facebook.com/v21.0/" + META_PIXEL_ID + "/events?access_token=" + encodeURIComponent(metaToken_()), {
    method: "post", contentType: "application/json", payload: JSON.stringify(body), muteHttpExceptions: true,
  });
}

// Sends the order to Meta. A failure here never loses the order (the row is already saved).
function sendMetaPurchase_(o) {
  if (!metaToken_() || !o.number) return;
  try {
    const res = postToMeta_(metaPurchaseBody_(o));
    if (res.getResponseCode() !== 200) console.error("Meta CAPI: " + res.getContentText());
  } catch (err) {
    console.error("Meta CAPI: " + err);
  }
}

// Run by hand (setup step 3): checks the token with a test event (shown only in "Test events",
// not counted as a purchase).
function testMetaCapi() {
  if (!metaToken_()) return console.log("Paste the token in META_CAPI_TOKEN first, then run this again.");
  const o = { number: "TEST", country: "El Salvador", total: 1, product: { id: "test", qty: 1 }, customer: { fullName: "Test", phone: "+503 70000000" } };
  const res = postToMeta_(metaPurchaseBody_(o, "TEST12345"));
  console.log(res.getResponseCode() === 200 ? "✅ Token OK: " + res.getContentText() : "❌ " + res.getContentText());
}

// Run by hand (setup step 4) to check your phone rings.
function testTelegram() {
  sendTelegram_("✅ Duka Bora: Telegram notifications are working.");
}

// Converts rows received in the old layout
// (Order ID, Full name, Phone number, Address, Price, City, Product name, Qty) to the new one.
// Run once by hand from the Apps Script editor.
function fixOldRows() {
  const sheet = getOrdersSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const range = sheet.getRange(2, 1, last - 1, HEADERS.length);
  const rows = range.getValues();
  let code = FIRST_CODE;
  rows.forEach((r) => { if (Number(r[0]) >= code) code = Number(r[0]) + 1; });
  const fixed = rows.map((r) => {
    if (!/^DB/.test(String(r[0]))) return r; // already in the new layout
    return [code++, r[1], localPhone_(r[2]), r[3], r[4], r[5], "", r[6], Number(r[7]) || 1, "OUI", "NON", "Tanzania"];
  });
  range.setValues(fixed);
}

// Customer text is stored as plain text: a leading ' stops values like "=..." or "+255…"
// from being treated as formulas or numbers.
function text_(v) {
  const s = String(v == null ? "" : v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
