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
 * Every order then appears as a new row in the "Orders" tab.
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
 *
 * Rows received before this format: in the Apps Script editor choose "fixOldRows" in the
 * function list at the top and click Run (once).
 */

const SHEET_NAME = "Orders";
// Column order of the sheet = Simon Express import table.
// VILLE and PRODUIT are left empty on purpose; the product name goes in REF.
const HEADERS = [
  "CODE SUIVI", "DESTINATAIRE", "TELEPHONE", "ADRESSE", "PRIX", "VILLE",
  "PRODUIT", "REF", "QTY", "OUVRIR", "REMPLACER",
];
// First CODE SUIVI when the sheet has none yet; after that each order gets the last code + 1.
const FIRST_CODE = 1;
// Telegram message on every new order (setup above). Empty = no message.
const TELEGRAM_TOKEN = "";
const TELEGRAM_CHAT_ID = "";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // two orders at the same moment must not get the same code
  try {
    const o = JSON.parse(e.postData.contents);
    const sheet = getOrdersSheet_();
    const code = nextCode_(sheet);
    sheet.appendRow([
      code,
      text_(o.customer.fullName),
      localPhone_(o.customer.phone),
      text_(o.customer.city), // the "City & delivery address" field
      Number(o.total) || 0,
      "", // VILLE: empty
      "", // PRODUIT: empty
      text_(o.product.name), // REF
      Number(o.product.qty) || 1,
      "OUI",
      "NON",
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

function getOrdersSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  const header = sheet.getRange(1, 1, 1, HEADERS.length);
  // Also replaces the headers of a sheet made with the old column names.
  if (header.getValues()[0].join("|") !== HEADERS.join("|")) {
    header.setValues([HEADERS]).setFontWeight("bold").setBackground("#0d1f17").setFontColor("#f3c36b");
    sheet.setFrozenRows(1);
    sheet.getRange("E:E").setNumberFormat("#,##0"); // PRIX
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

// "+255 767967779" → "0767967779" (the local format Simon Express uses).
// The leading ' keeps it as text so Sheets does not drop the 0.
function localPhone_(v) {
  const digits = String(v == null ? "" : v).replace(/\D/g, "").replace(/^255/, "").replace(/^0/, "");
  return digits ? "'0" + digits : "";
}

// Sends the new order to your Telegram. A failure here never loses the order (the row is already saved).
function notifyTelegram_(code, o) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    sendTelegram_([
      "🛒 New order #" + code,
      o.product.name + " × " + (Number(o.product.qty) || 1),
      "💰 TSh " + (Number(o.total) || 0).toLocaleString("en-US"),
      "👤 " + o.customer.fullName,
      "📞 " + localPhone_(o.customer.phone).replace(/^'/, ""),
      "📍 " + o.customer.city,
    ].join("\n"));
  } catch (err) {
    console.error("Telegram: " + err);
  }
}

function sendTelegram_(text) {
  UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/sendMessage", {
    method: "post",
    payload: { chat_id: TELEGRAM_CHAT_ID, text: text },
  });
}

// Run by hand once (setup step 3): shows your chat ID after you pressed Start in your bot.
function getTelegramChatId() {
  const res = JSON.parse(UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/getUpdates").getContentText());
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
    return [code++, r[1], localPhone_(r[2]), r[3], r[4], r[5], "", r[6], Number(r[7]) || 1, "OUI", "NON"];
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
