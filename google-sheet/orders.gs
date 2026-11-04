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
// El Salvador orders (?country=sv) go to their own tab, created at the first order.
const SALVADOR_SHEET = "Orders El Salvador";
const SALVADOR_HEADERS = [
  "FECHA", "PEDIDO", "NOMBRE", "TELEFONO", "CIUDAD", "DIRECCION", "PRODUCTO", "SKU", "CANTIDAD", "TOTAL USD",
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
    if (o.country === "El Salvador") {
      const sheet = getOrdersSheet_(SALVADOR_SHEET, SALVADOR_HEADERS);
      sheet.appendRow([
        Utilities.formatDate(new Date(o.date || Date.now()), "America/El_Salvador", "yyyy-MM-dd HH:mm"),
        text_(o.number),
        text_(o.customer.fullName),
        localPhone_(o.customer.phone),
        text_(o.customer.town || ""),
        text_(o.customer.street || o.customer.city),
        // the site sends "Name (sku)": the name alone here, the SKU in its own column
        text_(o.product.sku ? o.product.name.replace(" (" + o.product.sku + ")", "") : o.product.name),
        text_(o.product.sku || ""),
        Number(o.product.qty) || 1,
        Number(o.total) || 0,
      ]);
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
    notifyTelegram_(code, o);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
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
    .addToUi();
}

// Rows already sent to COD Services are greyed out in the Lebanon tab (their data stays there).
const SENT_COLOR = "#d9d9d9";

function downloadNewLebanonOrders() { downloadLebanonOrders_(true); }
function downloadAllLebanonOrders() { downloadLebanonOrders_(false); }

// Puts the Lebanon orders (only the ones not sent yet, or all) in a separate file with the
// 9 columns of the COD Services template, shows its download link, then greys those rows out.
// (File → Download would put every tab in the file, with "Orders" first.)
function downloadLebanonOrders_(onlyNew) {
  const ui = SpreadsheetApp.getUi();
  const sheet = getOrdersSheet_(LEBANON_SHEET, LEBANON_HEADERS);
  const n = sheet.getLastRow() - 1;
  const cols = LEBANON_HEADERS.length;
  const range = n > 0 ? sheet.getRange(2, 1, n, cols) : null;
  const values = range ? range.getValues() : [];
  const colors = range ? range.getBackgrounds() : [];
  const rows = [];
  values.forEach((r, i) => {
    if (!r.join("")) return; // empty row
    if (onlyNew && colors[i][0] === SENT_COLOR) return;
    rows.push({ r, i });
  });
  if (!rows.length) return ui.alert("No new Lebanon orders: every order was already downloaded.");

  // The file to import, made fresh each time; the one from last time goes to the trash
  const props = PropertiesService.getScriptProperties();
  const old = props.getProperty("LB_EXPORT_FILE");
  if (old) { try { DriveApp.getFileById(old).setTrashed(true); } catch (err) { /* already gone */ } }
  const out = SpreadsheetApp.create("COD Services import " + Utilities.formatDate(new Date(), "Asia/Beirut", "yyyy-MM-dd HH-mm"));
  props.setProperty("LB_EXPORT_FILE", out.getId());
  const tab = out.getSheets()[0].setName("Orders");
  tab.getRange(1, 1, 1, cols).setValues([LEBANON_HEADERS]).setFontWeight("bold");
  // Text columns stay text (a phone "+961 …" must not turn into a number)
  ["B", "C", "D", "E", "F", "I"].forEach((c) => tab.getRange(c + ":" + c).setNumberFormat("@"));
  tab.getRange(2, 1, rows.length, cols).setValues(rows.map((x) => x.r));
  SpreadsheetApp.flush();

  rows.forEach((x) => sheet.getRange(x.i + 2, 1, 1, cols).setBackground(SENT_COLOR));
  const url = "https://docs.google.com/spreadsheets/d/" + out.getId() + "/export?format=xlsx";
  ui.showModalDialog(
    HtmlService.createHtmlOutput(
      '<p style="font-family:sans-serif">' + rows.length + " order(s) in the file. They are now grey in the tab.</p>" +
      '<p><a href="' + url + '" target="_blank" style="font-family:sans-serif;font-size:16px">⬇️ Download the .xlsx file</a></p>'
    ).setWidth(380).setHeight(150),
    "Lebanon orders"
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
    if (headers === SALVADOR_HEADERS) sheet.getRange("J:J").setNumberFormat("#,##0.00"); // TOTAL USD
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
