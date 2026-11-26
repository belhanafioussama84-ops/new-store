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
    // No phone number shown (footer, thank-you page): the Moroccan number is no use here
    noPhone: true,
    // No WhatsApp button or link anywhere (user, 20 Nov 2026)
    noWhatsApp: true,
    // Thank-you page: "add one more" button (next offer price), added to the same order
    // in the sheet (upsell_ in google-sheet/orders.gs). Off for now (user, 13 Nov 2026): to turn it
    // on, deploy the new orders.gs in Apps Script first, then put true here.
    upsell: false,
    // Order form as LatinDrop asked: Departamento (list), then Ciudad/Municipio (list of the
    // departamento's municipios), then the full address. Columns of the LatinDrop import file
    // (google-sheet/orders.gs). The 263 municipios, by departamento, as LatinDrop's coverage page (18 Nov 2026):
    municipios: {
      "San Salvador": ["Aguilares", "Apopa", "Ayutuxtepeque", "Delgado", "Cuscatancingo", "El Paisnal", "Guazapa", "Ilopango", "Mejicanos", "Nejapa", "Panchimalco", "Rosario de Mora", "San Marcos", "San Martín", "San Salvador", "Santiago Texacuangos", "Santo Tomás", "Soyapango", "Tonacatepeque"],
      "Ahuachapán": ["Ahuachapán", "Apaneca", "Atiquizaya", "Concepción de Ataco", "El Refugio", "Guaymango", "Jujutla", "San Francisco Menéndez", "San Lorenzo", "San Pedro Puxtla", "Tacuba", "Turín"],
      "Cabañas": ["Cinquera", "Dolores", "Guacotecti", "Ilobasco", "Jutiapa", "San Isidro", "Sensuntepeque", "Tejutepeque", "Victoria"],
      "Chalatenango": ["Agua Caliente", "Arcatao", "Azacualpa", "Cancasque", "Chalatenango", "Citalá", "Comalapa", "Concepción Quezaltepeque", "Dulce Nombre de María", "El Carrizal", "El Paraíso", "La Laguna", "La Palma", "La Reina", "Las Flores", "Las Vueltas", "Nombre de Jesús", "Nueva Concepción", "Nueva Trinidad", "Ojos de Agua", "Potonico", "San Antonio de la Cruz", "San Antonio Los Ranchos", "San Fernando", "San Francisco Lempa", "San Francisco Morazán", "San Ignacio", "San Isidro Labrador", "San Luis del Carmen", "San Miguel de Mercedes", "San Rafael", "Santa Rita", "Tejutla"],
      "Cuscatlán": ["Candelaria", "Cojutepeque", "El Carmen", "El Rosario", "Monte San Juan", "Oratorio de Concepción", "San Bartolomé Perulapía", "San Cristóbal", "San José Guayabal", "San Pedro Perulapán", "San Rafael Cedros", "San Ramón", "Santa Cruz Analquito", "Santa Cruz Michapa", "Suchitoto", "Tenancingo"],
      "La Libertad": ["Antiguo Cuscatlán", "Chiltiupán", "Ciudad Arce", "Colón", "Comasagua", "Huizúcar", "Jayaque", "Jicalapa", "La Libertad", "Nuevo Cuscatlán", "Puerto La Libertad", "Quezaltepeque", "Sacacoyo", "San José Villanueva", "San Juan Opico", "San Matías", "San Pablo Tacachico", "Santa Tecla", "Talnique", "Tamanique", "Teotepeque", "Tepecoyo", "Zaragoza"],
      "La Paz": ["Cuyultitán", "El Rosario", "Jerusalén", "Mercedes La Ceiba", "Olocuilta", "Paraíso de Osorio", "San Antonio Masahuat", "San Emigdio", "San Francisco Chinameca", "San Juan Nonualco", "San Juan Talpa", "San Juan Tepezontes", "San Luis La Herradura", "San Luis Talpa", "San Miguel Tepezontes", "San Pedro Masahuat", "San Pedro Nonualco", "San Rafael Obrajuelo", "Santa María Ostuma", "Santiago Nonualco", "Tapalhuaca", "Zacatecoluca"],
      "La Unión": ["Anamorós", "Bolívar", "Concepción de Oriente", "Conchagua", "El Carmen", "El Sauce", "Intipucá", "La Unión", "Lislique", "Meanguera del Golfo", "Nueva Esparta", "Pasaquina", "Polorós", "San Alejo", "San José", "Santa Rosa de Lima", "Yayantique", "Yucuaiquín"],
      "Morazán": ["Arambala", "Cacaopera", "Chilanga", "Corinto", "Delicias de Concepción", "El Divisadero", "El Rosario", "Gualococti", "Guatajiagua", "Joateca", "Jocoaitique", "Jocoro", "Lolotiquillo", "Meanguera", "Osicala", "Perquín", "San Carlos", "San Fernando", "San Francisco Gotera", "San Isidro", "San Simón", "Sensembra", "Sociedad", "Torola", "Yamabal", "Yoloaiquín"],
      "San Miguel": ["Carolina", "Chapeltique", "Chinameca", "Chirilagua", "Ciudad Barrios", "Comacarán", "El Tránsito", "Lolotique", "Moncagua", "Nueva Guadalupe", "Nuevo Edén de San Juan", "Quelepa", "San Antonio del Mosco", "San Gerardo", "San Jorge", "San Luis de la Reina", "San Miguel", "San Rafael Oriente", "Sesori", "Uluazapa"],
      "San Vicente": ["Apastepeque", "Guadalupe", "San Cayetano Istepeque", "San Esteban Catarina", "San Ildefonso", "San Lorenzo", "San Sebastián", "San Vicente", "Santa Clara", "Santo Domingo", "Tecoluca", "Tepetitán", "Verapaz"],
      "Santa Ana": ["Candelaria de La Frontera", "Chalchuapa", "Coatepeque", "El Congo", "El Porvenir", "Masahuat", "Metapán", "San Antonio Pajonal", "San Sebastián Salitrillo", "Santa Ana", "Santa Rosa Guachipilín", "Santiago de la Frontera", "Texistepeque"],
      "Sonsonate": ["Acajutla", "Armenia", "Caluco", "Cuisnahuat", "Izalco", "Juayúa", "Nahuizalco", "Nahulingo", "Salcoatitán", "San Antonio del Monte", "San Julián", "Santa Catarina Masahuat", "Santa Isabel Ishuatán", "Santo Domingo de Guzmán", "Sonsonate", "Sonzacate"],
      "Usulután": ["Alegría", "Berlín", "California", "Concepción Batres", "El Triunfo", "Ereguayquín", "Estanzuelas", "Jiquilisco", "Jucuapa", "Jucuarán", "Mercedes Umaña", "Nueva Granada", "Ozatlán", "Puerto El Triunfo", "San Agustín", "San Buenaventura", "San Dionisio", "San Francisco Javier", "Santa Elena", "Santa María", "Santiago de María", "Tecapán", "Usulután"],
    },
  },
  gt: {
    // Guatemala (user, 24 Nov 2026): same design and same products as El Salvador (look: "sv":
    // its colours, its home page and its Spanish texts), prices in quetzales.
    id: "gt", look: "sv", name: "Guatemala", currency: "Q", currencyCode: "GTQ",
    dial: "502", phone: /^[2-7]\d{7}$/, // 8 digits: mobile 3/4/5XXX XXXX, landline 2/6/7XXX XXXX
    languages: ["es"],
    fastCity: "guatemala",
    splitAddress: true,
    noPhone: true,
    noWhatsApp: true,
    upsell: false,
    // Order form: "Zona / aldea" field (a list from "zones" below), for the "Zone / village" column of LatinDrop Guatemala
    zone: true,
    // Like LatinDrop's own Guatemala form: "Punto de referencia (opcional)", and lists with a search box
    landmark: "optional",
    searchLists: true,
    // Products of El Salvador ("countries": ["sv"]) are sold here too. Their price in quetzales:
    // the product's "gt" part (gt: { price, offers }) when it has one, else the dollar price × usdRate,
    // rounded up to the next Q..9 (e.g. $36.99 → Q289). To confirm with the user.
    usdRate: 7.7,
    // The El Salvador Spanish texts, said for Guatemala (js/i18n.js and product texts)
    replace: [
      [/de San Salvador a San Miguel/g, "de la capital a Quetzaltenango"],
      [/(a|en) todo El Salvador/g, "$1 toda Guatemala"],
      [/todo El Salvador/g, "toda Guatemala"],
      [/San Salvador/g, "Ciudad de Guatemala"],
      [/El Salvador/g, "Guatemala"],
      [/Col\. Escalón/g, "zona 10"],
      [/\+503 7XXX XXXX/g, "+502 5XXX XXXX"],
      [/7123 4567/g, "5123 4567"],
      [/dólares estadounidenses \(USD\)/g, "quetzales (GTQ)"],
      [/(en|los) dólares/g, "$1 quetzales"],
    ],
    // Departamentos, municipios and zones exactly as the "Zones" sheet of the LatinDrop Guatemala template
    // (latinedrop-template-GT.xlsx, user 24 Nov 2026): its import only accepts those names. 341 municipios
    // (Petatán and San Miguel Sigüilá left out until LatinDrop covers them, user). The zones of each
    // municipio ("Zona / aldea" list of the order form) are in js/gt-zones.json, loaded by js/landing.js.
    zones: "js/gt-zones.json",
    municipios: {
      "Guatemala": ["Guatemala", "Amatitlán", "Chinautla", "Chuarrancho", "Fraijanes", "Mixco", "Palencia", "San José del Golfo", "San José Pinula", "San Juan Sacatepéquez", "San Miguel Petapa", "San Pedro Ayampuc", "San Pedro Sacatepéquez", "San Raymundo", "Santa Catarina Pinula", "Villa Canales", "Villa Nueva"],
      "Alta Verapaz": ["Chahal", "Chisec", "Cobán", "Fray Bartolomé de Las Casas", "Lanquín", "Panzos", "Raxruhá", "San Cristóbal Verapaz", "San Juan Chamelco", "San Pedro Carchá", "Santa Catalina La Tinta", "Santa Cruz Verapaz", "Santa María Cahabón", "Senahú", "Tactic", "Tamahú", "Tucurú"],
      "Baja Verapaz": ["Cubulco", "Granados", "Purulhá", "Rabinal", "Salamá", "San Jerónimo", "San Miguel Chicaj", "Santa Cruz El Chol"],
      "Chimaltenango": ["Chimaltenango", "Acatenango", "El Tejar", "Parramos", "Patzicía", "Patzún", "Pochuta", "San Andrés Itzapa", "San José Poaquil", "San Juan Comalapa", "San Martín Jilotepeque", "San Pedro Yepocapa", "Santa Apolonia", "Santa Cruz Balanyá", "Tecpán", "Zaragoza"],
      "Chiquimula": ["Chiquimula", "Camotán", "Concepción Las Minas", "Esquipulas", "Ipala", "Jocotán", "Olopa", "Quezaltepeque", "San Jacinto", "San José La Arada", "San Juan Ermita"],
      "El Progreso": ["El Jícaro", "Guastatoya", "Morazán", "San Agustín Acasaguastlán", "San Antonio La Paz", "San Cristóbal Acasaguastlán", "Sanarate", "Sansare"],
      "Escuintla": ["Escuintla", "Guanagazapa", "Iztapa", "La Democracia", "La Gomera", "Masagua", "Nueva Concepción", "Palín", "Puerto San José", "San Vicente Pacaya", "Santa Lucía Cotzumalguapa", "Sipacate", "Siquinalá", "Tiquisate"],
      "Huehuetenango": ["Huehuetenango", "Aguacatán", "Chiantla", "Colotenango", "Concepción Huista", "Cuilco", "Jacaltenango", "La Democracia", "La Libertad", "Malacatancito", "Nentón", "San Antonio Huista", "San Gaspar Ixchil", "San Ildefonso Ixtahuacán", "San Juan Atitán", "San Juan Ixcoy", "San Mateo Ixtatán", "San Miguel Acatán", "San Pedro Necta", "San Pedro Soloma", "San Rafael La Independencia", "San Rafael Pétzal", "San Sebastián Coatán", "San Sebastián Huehuetenango", "Santa Ana Huista", "Santa Bárbara", "Santa Cruz Barillas", "Santa Eulalia", "Santiago Chimaltenango", "Soloma", "Tectitán", "Todos Santos Cuchumatán", "Unión Cantinil"],
      "Izabal": ["El Estor", "Lívingston", "Los Amates", "Morales", "Puerto Barrios"],
      "Jalapa": ["Jalapa", "Mataquescuintla", "Monjas", "San Carlos Alzatate", "San Luis Jilotepeque", "San Manuel Chaparrón", "San Pedro Pinula"],
      "Jutiapa": ["Jutiapa", "Agua Blanca", "Asunción Mita", "Atescatempa", "Comapa", "Conguaco", "El Adelanto", "El Progreso", "Jalpatagua", "Jerez", "Moyuta", "Pasaco", "Quesada", "San José Acatempa", "Santa Catarina Mita", "Yupiltepeque", "Zapotitlán"],
      "Petén": ["Dolores", "El Chal", "Flores", "La Libertad", "Las Cruces", "Melchor de Mencos", "Poptún", "San Andrés", "San Benito", "San Francisco", "San José", "San Luis", "Santa Ana", "Sayaxché"],
      "Quetzaltenango": ["Quetzaltenango", "Almolonga", "Cabricán", "Cajolá", "Cantel", "Coatepeque", "Colomba", "Concepción Chiquirichapa", "El Palmar", "Flores Costa Cuca", "Génova", "Huitán", "La Esperanza", "Olintepeque", "Palestina de los Altos", "Salcajá", "San Carlos Sija", "San Francisco la Unión", "San Juan Ostuncalco", "San Martín Sacatepéquez", "San Mateo", "Sibilia", "Zunil"],
      "Quiché": ["Canillá", "Chajul", "Chicamán", "Chiché", "Chichicastenango", "Chinique", "Cunén", "Ixcán", "Joyabaj", "Nebaj", "Pachalum", "Patzité", "Sacapulas", "San Andrés Sajcabajá", "San Antonio Ilotenango", "San Bartolomé Jocotenango", "San Juan Cotzal", "San Pédro Jocopilas", "Santa Cruz del Quiché", "Santa María Nebaj", "Uspantán", "Zacualpa"],
      "Retalhuleu": ["Retalhuleu", "Champerico", "El Asintal", "Nuevo San Carlos", "San Andrés Villa Seca", "San Felipe", "San Martín Zapotitlán", "San Sebastián", "Santa Cruz Muluá"],
      "Sacatepéquez": ["Alotenango", "Antigua Guatemala", "Ciudad Vieja", "Jocotenango", "Magdalena Milpas Altas", "Pastores", "San Antonio Aguas Calientes", "San Bartolomé Milpas Altas", "San Juan Alotenango", "San Lucas Sacatepéquez", "San Miguel Dueñas", "Santa Catarina Barahona", "Santa Lucía Milpas Altas", "Santa María de Jesús", "Santiago Sacatepéquez", "Santo Domingo Xenacoj", "Sumpango"],
      "San Marcos": ["San Marcos", "Ayutla", "Catarina", "Comitancillo", "Concepción Tutuapa", "El Quetzal", "El Rodeo", "El Tumbador", "Esquipulas Palo Gordo", "Ixchiguán", "La Blanca", "La Reforma", "Malacatán", "Nuevo Progreso", "Ocós", "Pajapita", "Rio Blanco", "San Antonio Sacatepéquez", "San Cristóbal Cucho", "San José Ojetenam", "San Lorenzo", "San Miguel Ixtahuacán", "San Pablo", "San Pedro Sacatepéquez", "San Rafael Pie de la Cuesta", "Sibinal", "Sipacapa", "Tacaná", "Tajumulco", "Tejutla"],
      "Santa Rosa": ["Barberena", "Casillas", "Chiquimulilla", "Cuilapa", "Guazacapán", "Nueva Santa Rosa", "Oratorio", "Pueblo Nuevo Viñas", "San Juan Tecuaco", "San Rafael Las Flores", "Santa Cruz Naranjo", "Santa María Ixhuatán", "Santa Rosa de Lima", "Taxisco"],
      "Solola": ["Concepción", "Nahualá", "Panajachel", "San Andrés Semetabaj", "San Antonio Palopó", "San José Chacayá", "San Juan La Laguna", "San Lucas Tolimán", "San Marcos La Laguna", "San Pablo La Laguna", "San Pedro La Laguna", "Santa Catarina Ixtahuacán", "Santa Catarina Palopó", "Santa Clara La Laguna", "Santa Cruz La Laguna", "Santa Lucía Utatlán", "Santa María Visitación", "Santiago Atitlán", "Sololá"],
      "Suchitepéquez": ["Chicacao", "Cuyotenango", "Mazatenango", "Patulul", "Pueblo Nuevo", "Río Bravo", "Samayac", "San Antonio Suchitepéquez", "San Bernardino", "San Francisco Zapotitlán", "San Gabriel", "San José El Ídolo", "San José La Máquina", "San Juan Bautista", "San Lorenzo Suchitepéquez", "San Miguel Panán", "San Pablo Jocopilas", "Santa Bárbara", "Santo Domingo Suchitepéquez", "Santo Tomás La Unión", "Zunilito"],
      "Totonicapán": ["Totonicapán", "Momostenango", "San Andrés Xecul", "San Bartolo", "San Cristóbal Totonicapán", "San Francisco El Alto", "Santa Lucia La Reforma", "Santa María Chiquimula"],
      "Zacapa": ["Zacapa", "Cabañas", "Estanzuela", "Gualán", "Huité", "La Unión", "Rio Hondo", "San Diego", "San Jorge", "Teculután", "Usumatlán"],
    },
  },
};
// Phones set to these time zones get that country until the visitor picks one.
// A country with "municipios" gets its departamento list from them
for (const c of Object.values(COUNTRIES)) if (c.municipios) c.regions = Object.keys(c.municipios);
// Lebanon store closed (user, 10 Nov 2026): its settings stay above, delete this line to reopen it.
delete COUNTRIES.lb;
const ZONES = { "Africa/Lusaka": "zm", "America/El_Salvador": "sv", "America/Guatemala": "gt" };

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
// look: a country dressed like another one (Guatemala = El Salvador's colours, home and texts)
COUNTRY.look = COUNTRY.look || COUNTRY.id;
document.documentElement.dataset.country = COUNTRY.look;
// Texts of the look's country said for this one (COUNTRY.replace), and "$12" → "Q99" (usdRate)
const toLocalPrice = (usd) => Math.ceil(usd * COUNTRY.usdRate / 10) * 10 - 1;
function localize(s) {
  if (!COUNTRY.replace || typeof s !== "string" || s === "El Salvador") return s;
  for (const [re, by] of COUNTRY.replace) s = s.replace(re, by);
  if (COUNTRY.usdRate) s = s.replace(/\$(\d+(?:\.\d+)?)/g, (m, n) => `${COUNTRY.currency}${Number(n) ? toLocalPrice(Number(n)) : 0}`);
  return s;
}
// Countries with noWhatsApp: no WhatsApp number = every WhatsApp button and link is hidden
if (COUNTRY.noWhatsApp) STORE.whatsapp = "";
// Countries with noPhone: no "Call" links (each page removes them when STORE.phone is empty)
if (COUNTRY.noPhone) STORE.phone = "";
if (COUNTRY.id === "lb") document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#c8102e");
if (COUNTRY.look === "sv") document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#0b3a82");

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
    images: ["images/mini-main.jpg", "images/mini-espalda.jpg", "images/mini-pantalla.jpg", "images/mini-parche.jpg", "images/mini-zonas.jpg", "images/mini-carga.jpg", "images/mini-modos.webp", "images/mini-uso.jpg", "images/mini-regalo.jpg"],
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
        image: "images/mini-modos.webp",
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
  {
    id: "creatina-mujer",
    // El Salvador only: texts in Spanish, prices in US dollars. Page made like the user's reference
    // (guateexpresso.online/products/creatinaparamujeres): layout "glam", pink and dark blocks.
    // Without its reviews / "+8,750 clientas", its Guatemala prices or its "si llega dañado te lo cambiamos".
    name: "Creatina Monohidratada Para Mujer 240g",
    sku: "LD-P-4187448", // LatinDrop SKU (El Salvador tab of the sheet)
    gt: { sku: "LD-P-5635388" }, // LatinDrop Guatemala SKU (user, 24 Nov 2026)
    countries: ["sv"],
    category: "Health & comfort",
    price: 39.99, // user's price (40.99 until 14 Nov 2026); 2 tarros is my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "💪",
    // Photos of the reference page, original files (the 1st one cut above its Guatemala prices)
    image: "images/crea-main.webp",
    images: ["images/crea-main.webp", "images/crea-casa.webp", "images/crea-medida.webp", "images/crea-batido.webp", "images/crea-cocina.webp"],
    description: "El suplemento más estudiado del mundo, ahora pensado para ti. Creatina + colágeno + BCAAs en una medida. Sin sabor y sin azúcar.",
    // The user wants 2 choices: 1 or 2 tarros
    offers: [
      { qty: 1, price: 39.99, label: "1 tarro · 30 días" },
      { qty: 2, price: 69.99, label: "2 tarros · 60 días", tag: "Best value" },
    ],
    layout: "glam",
    // Order form like the user's screenshot (14 Nov 2026): dark purple box, uppercase labels,
    // Departamento and Ciudad/Municipio picked from lists, "Completar pedido" button (js/landing.js, css/glam.css)
    darkForm: true,
    timeline: [1, 1, 3],
    // Customer videos, side by side under the order form (tap = sound)
    videos: ["images/crea-ugc1.mp4", "images/crea-ugc2.mp4", "images/crea-ugc3.mp4"],
    videosTitle: ["🎥 En video", "Así la toman", "ellas", "Sin sabor: se mezcla con agua, jugo o tu batido."],
    // Reviews of REAL customers only (screenshot of their WhatsApp message in images/ if you have it), e.g.
    // { name: "Karla M.", place: "Santa Tecla", stars: 5, text: "…", image: "images/crea-review1.jpg" }
    // Empty = the reviews block is not shown. Never invented ones (user agreed, 13 Nov 2026).
    customerReviews: [],
    stat: {
      eyebrow: "🧠 ¿Sabías que…?",
      before: "Hasta", value: "80", unit: "%", after: "menos",
      text: "Las mujeres tienen hasta 80% menos reservas naturales de creatina que los hombres.",
      highlight: "reservas naturales de creatina",
      him: { image: "images/crea-ellos.jpg", label: "♂ Ellos", note: "Reservas naturales" },
      her: { image: "images/crea-ellas.jpg", label: "♀ Ellas", note: "Reservas naturales", badge: "−80%" },
      lines: ["🏋️ Por eso a ellos les funciona “solo entrenar”…", "💪 …y nosotras necesitamos un apoyo extra."],
      source: "Fuente: Smith-Ryan AE y col. “Creatine Supplementation in Women's Health: A Lifespan Perspective”. Nutrients, 2021.",
    },
    pains: {
      eyebrow: "Tu entrenamiento",
      title: ["Si entrenas,", "esto te suena"],
      text: "Toca cada una y mira tu reloj.",
      items: [
        { icon: "🏋️", title: "Llevas meses con el mismo peso", label: "Peso", value: "=", caption: "Mismo peso" },
        { icon: "🔋", title: "Sientes que terminas sin fuerza", label: "Energía", value: "18%", small: "al terminar", caption: "Sin fuerza para la última serie" },
        { icon: "🔁", title: "Te esfuerzas, pero el avance se ve lento", label: "Avance", value: "22%", small: "de tu meta", caption: "Mucho esfuerzo, poco avance" },
        { icon: "👀", title: "Ves que otras avanzan más rápido", label: "Comparar", value: "¿Por qué?", caption: "Ellas tienen un apoyo extra" },
      ],
      strike: "No es falta de ganas",
      answer: ["Es que tu músculo necesita", "más energía"],
      button: "Ver la solución",
    },
    how: {
      eyebrow: "⚙️ La ciencia, fácil",
      title: ["Cómo", "funciona"],
      text: "Tres pasos, de la energía al avance.",
      steps: [
        { icon: "🔋", title: "⚡ Recarga", text: "La creatina recarga la energía de tu músculo.", tag: "Energía" },
        { icon: "🏋️", title: "💪 Rinde", text: "Tu músculo rinde más en cada serie.", tag: "Fuerza" },
        { icon: "📈", title: "📈 Avanza", text: "Más repeticiones = mejor avance con tu rutina.", tag: "Progreso" },
      ],
      formula: ["⚡ Energía", "💪 Rendimiento", "📈 Avance"],
      note: "Con 1 medida al día, junto a tu entrenamiento. Los resultados varían en cada persona.",
    },
    myths: {
      eyebrow: "¿Te da miedo probarla?",
      title: ["Mitos de la creatina", "que te frenan"],
      text: "Te contamos la verdad",
      items: [
        { myth: "“Me voy a poner musculosa”", truth: "Ganar mucho músculo requiere años de entrenamiento y una dieta específica. Lo que vas a notar es más fuerza en tus rutinas." },
        { myth: "“Me va a hinchar”", truth: "Algunas personas suben un poco de peso al inicio, pero es agua dentro del músculo, no grasa." },
        { myth: "“Es solo para hombres”", truth: "Es uno de los suplementos más estudiados del mundo, y también en mujeres." },
        { myth: "“Tengo que tomar mucho”", truth: "No necesitas “fase de carga”. Con 1 medida al día es suficiente." },
      ],
      button: "Ver todas las verdades",
    },
    nutrition: {
      eyebrow: "Sin secretos",
      title: "Esto es lo que tomas en cada medida",
      head: "Información por porción",
      serving: "1 medida (8 g) · 30 porciones por tarro",
      rows: [
        ["Creatina monohidratada", "Fuerza y rendimiento"],
        ["Colágeno hidrolizado", "Complemento para tu rutina"],
        ["BCAAs", "Aminoácidos para la recuperación"],
      ],
      sugar: ["Azúcar añadida", "0 g"],
      chips: [["🚫", "Sin azúcar"], ["🥤", "Sin sabor"], ["📅", "30 días por tarro"]],
    },
    route: {
      eyebrow: "📅 La constancia es la clave",
      title: ["Tu ruta de", "60 días"],
      text: "Mira lo que pasa con 1 tarro y con 2.",
      phases: [
        { weeks: "Semanas 1-3", text: "Tu músculo se va cargando de creatina", icon: "🫙" },
        { weeks: "Semanas 4-6", text: "Empiezas a notar más fuerza en tus series", icon: "🏋️" },
        { weeks: "Semanas 7-8", text: "Tus entrenamientos rinden más", icon: "📈" },
      ],
      quote: "“Por eso se venden en pareja: 1 tarro no alcanza para ver el cambio completo.”",
      quoteSmall: "Con 2 tarros completas tu ruta sin cortes.",
      note: "Tomándola todos los días y entrenando con constancia. Los resultados varían en cada persona.",
    },
    special: {
      eyebrow: "¿Qué hace especial a Creatine for Women?",
      title: ["Apoya la fuerza y el rendimiento físico", "en cada porción"],
      video: "images/crea-tarro.mp4",
      tag: "Tu mejor versión ♡",
      items: [
        ["⚡", "Creatina monohidratada", "Apoya el rendimiento muscular."],
        ["💪", "Fuerza física", "Contribuye al desarrollo de la fuerza."],
        ["✨", "Energía muscular", "Favorece la producción de energía durante el ejercicio."],
        ["❤️", "Recuperación", "Complementa la recuperación después del entrenamiento."],
        ["🍃", "Sin sabor", "Fácil de mezclar con agua o bebidas."],
        ["✓", "30 porciones", "Ideal para complementar tu rutina de entrenamiento."],
      ],
      note: "Suplemento alimenticio. Acompáñalo de ejercicio y una alimentación variada.",
    },
    ideal: {
      eyebrow: "¿Es para mí?",
      title: ["Ideal si", "entrenas…"],
      text: "Toca las que van contigo ♡",
      items: [["🏋️", "En el gimnasio", "Más fuerza en tus series"], ["🏠", "En casa", "Con pesas o tu propio peso"], ["🍑", "Pierna y glúteo", "Fuerza para tu rutina"], ["👩‍👧", "Mamás activas", "Aunque sean 30 minutos"]],
      chosen: "¡Esa soy yo!",
      note: "No importa tu nivel: para mujeres mayores de 18 años.",
    },
    safe: {
      eyebrow: "Compra segura",
      title: ["No pagas nada", "hasta recibirlo."],
      items: [["💵", "Pagas al recibir", "En efectivo, en tu puerta"], ["🚚", "Envío gratis", "A todo El Salvador, en 1 a 3 días"], ["📞", "Te llamamos", "Confirmamos tu pedido antes de enviarlo"]],
      stepsTitle: "Así de fácil es pedir",
      steps: ["Escribe tu nombre, teléfono y dirección", "Te llamamos para confirmar tu pedido", "Lo recibes y pagas en ese momento"],
    },
    warning: "Suplemento alimenticio, no es un medicamento. Para mayores de 18 años. Si estás embarazada, amamantando, tomas medicamentos o tienes una enfermedad (por ejemplo de los riñones), consulta a tu médico antes de usarlo. No exceder la porción recomendada.",
    faq: [
      { q: "¿Cuánto tarda en llegar?", a: "Entre 1 y 3 días hábiles, según tu departamento." },
      { q: "¿Cómo pago?", a: "Pagas en efectivo cuando recibes tu pedido. No necesitas tarjeta." },
      { q: "¿Y si no estoy en casa?", a: "Te contactamos antes de la entrega. Puedes indicar que lo reciba otra persona o coordinar otro día." },
      { q: "¿Me equivoqué en mis datos?", a: "No te preocupes: cuando te llamemos para confirmar, los corregimos." },
      { q: "¿Puedo pedirlo para otra persona?", a: "Sí. Pon el nombre, teléfono y dirección de esa persona, y ella paga al recibir." },
      { q: "¿Con qué la puedo mezclar?", a: "Como no tiene sabor, puedes mezclarla con agua, jugo, café, batido o tu proteína. Lo ideal es tomarla recién preparada." },
      { q: "¿Cuánto tomo al día?", a: "1 medida (8 g) al día, todos los días, también los días que no entrenas. Sigue las indicaciones de la etiqueta." },
    ],
  },
  {
    id: "destapador-flexible",
    // El Salvador only: texts in Spanish (tú, El Salvador words), prices in US dollars.
    // Page made like the user's reference (mundotecno.shop/products/pinza-garra-flexible-desagote,
    // saved by the user on 17 Nov 2026): layout "pro", navy and green blocks (css/pro.css).
    // All its photos and both GIFs (as MP4). Without its customer reviews, its fake "sold / watching /
    // only 3 left" counters, its fake 40% discount, its Colombian prices or its "GARRA PRO" name.
    name: "Destapador Flexible",
    sku: "LD-P-19538", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Home & cleaning",
    price: 31.99, // user's price; 2 and 3 pieces are my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🪠",
    image: "images/garra-main.webp",
    squarePhotos: true,
    images: ["images/garra-main.webp", "images/garra-packshot.webp", "images/garra-pelo.webp"],
    description: "Una pinza flexible con 4 garras en la punta: entra por el desagüe, agarra el pelo y la suciedad que lo tapan y los saca. Sin químicos y sin llamar al fontanero.",
    offers: [
      { qty: 1, price: 31.99, label: "1 pinza · Para un desagüe" },
      { qty: 2, price: 54.99, label: "2 pinzas · Ducha y cocina", tag: "Best value" },
      { qty: 3, price: 74.99, label: "3 pinzas · Ducha, baño y cocina" },
    ],
    layout: "pro",
    timeline: [1, 1, 3],
    claim: "No metas la mano. No llames al fontanero.",
    strip: "🚚 Envío GRATIS a todo El Salvador · 💵 Pagas al recibir",
    ctaText: "Lo quiero · Pago al recibir",
    ctaNote: "🚚 Envío gratis a todo El Salvador · 💵 Pagas cuando te llega",
    finalText: "Lo quiero ahora",
    blocks: [
      { img: "images/garra-anim1.mp4" },
      { img: "images/garra-pelo-mano.jpg" },
      { img: "images/garra-fregadero.webp" },
      { h: "✋ No metas la mano.", big: true },
      { h: "❌ No llames al fontanero", big: true },
      { p: "60 cm de cable flexible que entran donde tu mano no llega. Aprietas, agarra y sacas el tapón de pelos de una. **En dos minutos, sin desarmar nada. 💫**" },
      // The plumber price is my estimate for El Salvador: the user should confirm it
      { anchor: { them: "Un fontanero por una destapada", themPrice: "$30", us: "Esta pinza, una sola vez", note: "Y te queda en casa **para siempre**." } },
      { ba: {
        title: "El mismo desagüe, dos minutos después",
        video: "images/garra-anim2.mp4",
        before: { img: "images/garra-antes.webp", label: "Antes 😣", text: "El agua no baja y el olor sube" },
        after: { img: "images/garra-despues.webp", label: "Después 😌", text: "Traga como el primer día" },
      } },
      { feats: [
        ["🪝", "Garras que agarran de verdad", "No empujan la suciedad para adentro como el destapador de hule: la **enganchan y la sacan**."],
        ["🐍", "60 cm que se doblan en cualquier codo", "El cable es flexible: entra por la rejilla y sigue la curva de la tubería sin trabarse."],
        ["🚫", "Sin químicos y sin desarmar el sifón", "Nada de ácidos que dañan la tubería ni cubetas debajo del lavamanos."],
      ] },
      { cta: true },
      { img: "images/garra-pelo.webp", alt: "La pinza sacando un tapón de pelo del desagüe" },
      { h: "Ya sabes cómo termina" },
      { img: "images/garra-mano.webp" },
      { p: "🫧 Te bañas y el agua te llega a los tobillos. Echas el líquido destapacaños, esperas, y a los tres días está igual. Porque el problema no se disuelve: es un **tapón de pelo enredado** agarrado ahí abajo, y hay que **sacarlo**." },
      { img: "images/garra-agua.jpg" },
      { p: "💪 Esto hace exactamente eso. Metes el cable, aprietas el botón rojo, las cuatro garras se abren, sueltas y se cierran sobre el tapón. Jalas para arriba y sale todo junto. **Lo vas a ver salir.**" },
      { img: "images/garra-tubo.jpg" },
      { table: {
        head: ["Sin la pinza", "Con la pinza"],
        rows: [
          ["Fontanero: **cada vez que se tapa**", "Lo haces tú, cuantas veces quieras"],
          ["Químicos que dañan la tubería", "Solo acero, cero producto"],
          ["Meter la mano o un alambre", "Ni te ensucias los dedos"],
          ["Vuelve a taparse a los 3 días", "Sacas la causa, no el síntoma"],
          ["Desarmar el sifón con cubeta", "Entra por la rejilla, sin tocar nada"],
        ],
      } },
      { cta: true },
      { img: "images/garra-duradero.webp" },
      { h: "Y no es solo para el desagüe" },
      { p: "La mayoría la compra por la ducha y después la usa para todo lo que se cae donde no entra la mano:" },
      { img: "images/garra-lugares.jpg" },
      { tiles: [
        ["💍 El anillo en el lavamanos", "Antes de que se vaya por la tubería"],
        ["🔑 Las llaves en el carro", "Esa ranura entre el asiento y la consola"],
        ["🧦 Detrás de la lavadora", "Sin moverla ni pedir ayuda"],
        ["🍽️ El fregadero de la cocina", "Restos de comida y grasa acumulada"],
        ["📱 Debajo de la refri", "Donde solo llega un cable delgadito"],
        ["🛋️ Debajo del sofá", "El control, la moneda, el juguete"],
      ] },
      { h: "Cómo se usa — 4 pasos" },
      { p: "No tiene instrucciones que leer. Se entiende a la primera. 💪" },
      { img: "images/garra-usos.webp" },
      { steps: [
        { text: "Aprietas el botón rojo y las 4 garras se abren." },
        { text: "Metes el cable por la rejilla, todo lo que haga falta." },
        { img: "images/garra-paso3.webp", text: "Sueltas el botón: las garras se cierran y agarran." },
        { img: "images/garra-paso4.webp", text: "Jalas para arriba y sale todo el tapón." },
      ] },
      { cta: true },
      { img: "images/garra-boton.jpg" },
      // Specs from the reference page (same product): the user should check the 60 cm with LatinDrop
      { dark: { title: "Ficha técnica", items: [
        ["Largo del cable", "60 cm, flexible"],
        ["Punta", "resorte de acero con **4 garras** de acero"],
        ["Funcionamiento", "botón con resorte en el mango: aprietas y abre, sueltas y cierra"],
        ["Cable", "alma de acero forrada en plástico, se dobla sin quebrarse"],
        ["Mango", "plástico rígido con apoyo para dos dedos"],
        ["Se guarda enrollado", "ocupa lo que un rollo de cinta"],
        ["Sirve en", "ducha, lavamanos, fregadero, lavadero, rejillas del patio, ranuras y huecos"],
      ] } },
      { img: "images/garra-completo.jpg" },
      { img: "images/garra-garras.webp", alt: "Las 4 garras de acero" },
      // Photos of the claw in use (from the reference page's review photos, without names or texts;
      // the one with a branded glove left out)
      { h: "Así se ve en casa" },
      { gallery: ["images/garra-casa-banera.jpg", "images/garra-casa-rejilla.jpg", "images/garra-casa-suciedad.jpg", "images/garra-casa-alfombra.jpg", "images/garra-casa-mesa.jpg", "images/garra-casa-producto.jpg"] },
      { cta: true },
    ],
    // Real reviews from the user's own customers only: { name, place, text, stars, image }.
    // Empty = the block doesn't show.
    customerReviews: [],
    box: { title: "Estamos para ayudarte", text: "Si te llega algo mal o no entiendes cómo usarla, te ayudamos a resolverlo. Antes de enviarte el pedido te llamamos para confirmarlo." },
    faq: [
      { q: "¿Sirve para mi desagüe?", a: "Sí, siempre que la rejilla se pueda quitar o tenga una ranura por donde pase el cable. La punta es delgada (poco más de 1 cm): entra en desagües de ducha, lavamanos, fregaderos y rejillas del patio." },
      { q: "¿Raya o rompe la tubería?", a: "No. El cable va forrado en plástico y las garras son pequeñas, de acero fino. A diferencia de los líquidos destapacaños, no ataca el material de la tubería." },
      { q: "¿Se puede lavar?", a: "Sí. La pasas por agua, la secas y la guardas enrollada." },
      { q: "¿Cómo pago?", a: "Pagas en efectivo cuando te llega, a la persona que te lo entrega. No necesitas tarjeta." },
      { q: "¿Cuánto cuesta el envío?", a: "El envío es GRATIS a todo El Salvador. Te llega en 1 a 3 días hábiles, según tu departamento." },
    ],
  },
  {
    id: "aceite-comino-negro",
    // El Salvador only: texts in Spanish, prices in US dollars. Page made like the user's reference
    // (kenku.pe, black seed oil): layout "violet", purple and white (css/violet.css).
    // All its 7 photos (user's choice, 17 Nov 2026). Without its disease claims (parasites, fungi,
    // chronic inflammation), its "89% / 87% … clinical studies", its "+20,000 clientes", its fake 40%
    // discount or its Peru prices.
    name: "SUPER HUMAN Ethiopian Black Seed Oil Aceite de Comino Negro - 60 Cápsulas",
    sku: "LD-P-4953470", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Health & comfort",
    price: 37.99, // user's price; 2 and 3 frascos are my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🌿",
    image: "images/comino-main.jpg",
    images: ["images/comino-main.jpg", "images/comino-campo.webp", "images/comino-especias.webp", "images/comino-mano.webp", "images/comino-como-usar.webp"],
    description: "Aceite de semilla negra (comino negro) de Etiopía, en cápsulas fáciles de tomar. 60 cápsulas por frasco: 2 al día, para 30 días.",
    offers: [
      { qty: 1, price: 37.99, label: "1 frasco · 30 días" },
      { qty: 2, price: 64.99, label: "2 frascos · 60 días", tag: "Best value" },
      { qty: 3, price: 89.99, label: "3 frascos · 90 días", tag: "¡Mejor oferta!" },
    ],
    layout: "violet",
    timeline: [1, 1, 3],
    topChecks: [
      ["✓", "Aceite de semilla negra etíope"],
      ["✓", "60 cápsulas · 30 días"],
      ["✓", "2 cápsulas al día"],
      ["🚚", "Envío gratis"],
      ["💵", "Pagas al recibir"],
      ["🔒", "Compra segura"],
    ],
    ctaText: "Comprar ahora · Pago al recibir",
    ctaNote: "🚚 Envío gratis a todo El Salvador",
    finalText: "Comprar ahora",
    blocks: [
      // Same order as the reference page. Health texts written as "supports" (no cure / disease claims);
      // left out: parasites, fungi, chronic inflammation, "9 times stronger" and the clinical percentages.
      { band: ["SUPER HUMAN – Ethiopian Black Seed Oil", "Renueva tu rutina desde adentro", "Potencia natural"] },
      { lead: { h: "Más energía, más equilibrio", p: "Un suplemento de aceite de semilla negra etíope para acompañar **tu energía, tu digestión y tus defensas**, como parte de una rutina saludable." } },
      { img: "images/comino-campo.webp", alt: "Frasco de aceite de semilla negra etíope" },
      { lead: { h: "¡El producto que buscabas!", p: "Solo aceite de semilla negra etíope, cultivada a 8,000 pies de altura, con **hasta 4.64% de timoquinona** según el fabricante." } },
      { feats: [
        ["🎯", "Alta potencia:", "Semilla negra de las tierras altas de Etiopía, con alta concentración de timoquinona."],
        ["💊", "Un solo ingrediente:", "100% aceite de semilla negra, sin rellenos ni aditivos, en cápsulas: se conserva mejor y tomas siempre la misma cantidad."],
      ] },
      { img: "images/comino-especias.webp", alt: "Aceite de semilla negra etíope y especias" },
      { feats: [
        ["🌙", "Fácil de incorporar:", "Solo 2 cápsulas antes de dormir."],
        ["🌿", "Apoyo integral:", "Acompaña tu energía, tu digestión y tus defensas."],
      ] },
      { band: ["Calidad premium", "SUPER HUMAN – Ethiopian Black Seed Oil", "Renueva tu rutina desde adentro"] },
      { lead: { h: "Energía, defensas y equilibrio natural", p: "Desde hace más de 3,000 años, el aceite de semilla negra se usa para cuidar la salud en general. La semilla etíope crece en clima extremo y suelo volcánico." } },
      { img: "images/comino-mano.webp", alt: "Cápsulas de aceite de semilla negra" },
      { pills: ["Hasta 4.64% de timoquinona", "Cultivado a 8,000 pies de altura", "Sin rellenos ni aditivos"] },
      { feats: [
        ["⚡", "Energía:", "Apoya tu energía del día a día."],
        ["⚖️", "Equilibrio natural:", "Acompaña el equilibrio natural de tu cuerpo."],
        ["🛡️", "Digestión y defensas:", "Apoya tu digestión y las defensas de tu cuerpo."],
      ] },
      { lead: { h: "¿Por qué elegir SUPER HUMAN Ethiopian Black Seed Oil?", p: "No todos los aceites de semilla negra son iguales. Según el fabricante, la mayoría tiene entre 0.7% y 1.2% de timoquinona, y SUPER HUMAN hasta 4.64%, gracias a la altura, el suelo volcánico y el clima de las tierras altas de Etiopía." } },
      { img: "images/comino-antes-despues.webp" },
      { img: "images/comino-antes-despues-2.webp" },
      { lead: { h: "¿Qué contiene?", p: "La timoquinona es el compuesto principal de la semilla negra. El aceite trae también antioxidantes y ácidos grasos omega 3, 6 y 9." } },
      { checks: ["Apoya tus defensas", "Apoya tu digestión", "Acompaña tu energía del día a día"] },
      { img: "images/comino-como-usar.webp", alt: "Cómo usar: 2 cápsulas con agua" },
      { lead: { h: "SUPER HUMAN – Potencia natural en su máxima expresión", p: "¿Listo para cuidarte desde adentro? Agrégalo a tu rutina de la noche:" } },
      { checks: ["💪 Para acompañar tu energía", "🛡️ Para apoyar tus defensas", "🌿 Para apoyar tu digestión", "🌙 2 cápsulas antes de dormir, todos los días"] },
      { cta: true },
      { safe: { eyebrow: "Compra sin riesgo", title: "Pagas cuando lo recibes", items: [
        ["💵", "Pagas al recibir", "Pagas en efectivo cuando recibes tu pedido. Sin adelantos."],
        ["🚚", "Envío gratis", "A todo El Salvador, en 1 a 3 días hábiles."],
        ["📞", "Te llamamos", "Antes de enviarlo te llamamos para confirmar tu pedido y tu dirección."],
        ["🔄", "Cambio sin costo", "Si llega dañado o no es el que pediste, te lo cambiamos."],
      ] } },
    ],
    warning: "Suplemento alimenticio, no es un medicamento. No lo uses si estás embarazada o amamantando. Si tomas medicamentos (por ejemplo para la presión, el azúcar o la sangre) o tienes una enfermedad, consulta a tu médico antes de usarlo. No exceder la porción recomendada. Mantener fuera del alcance de los niños.",
    // Real reviews from the user's own customers only: { name, place, text, stars, image }.
    customerReviews: [],
    faq: [
      { q: "¿Cómo se toma?", a: "2 cápsulas al día con un vaso de agua, por ejemplo antes de dormir. Sigue las indicaciones de la etiqueta." },
      { q: "¿Cuánto dura un frasco?", a: "Cada frasco trae 60 cápsulas: tomando 2 al día, te dura 30 días." },
      { q: "¿Tiene sabor?", a: "No. Al venir en cápsulas no sientes el sabor fuerte del aceite." },
      { q: "¿Cómo pago?", a: "Pagas en efectivo cuando recibes tu pedido. No necesitas tarjeta." },
      { q: "¿Cuánto tarda en llegar?", a: "Entre 1 y 3 días hábiles, según tu departamento. El envío es gratis." },
    ],
  },
  {
    id: "esquinero-bano",
    // El Salvador only: texts in Spanish, prices in US dollars. Page like the user's reference
    // (cuelhome.com/products/esquinero-de-bano-ajustable-multifuncional), model = baston-plegable
    // (layout "story"). Its photos and its GIF (as MP4), without its Peru-only images (shipping
    // agencies, Yape/Plin payments), its "garantía de 1 año" badges or its "pocas unidades" GIF.
    name: "Esquinero de Baño Ajustable Multifuncional",
    sku: "LD-P-5100244", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Home & cleaning",
    price: 39.99, // user's price; 2 pieces is my suggestion (no 3: user, 18 Nov 2026)
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🚿",
    image: "images/esquinero-main.webp",
    squarePhotos: true,
    images: ["images/esquinero-main.webp", "images/esquinero-medidas.webp", "images/esquinero-partes.webp", "images/esquinero-ducha.webp"],
    description: "Un organizador de esquina para la ducha con 4 bandejas. Se instala a presión entre el piso y el techo, sin perforar la pared, y se ajusta a la altura de tu baño.",
    offers: [
      { qty: 1, price: 39.99, label: "1 esquinero" },
      { qty: 2, price: 69.99, label: "2 esquineros · Para 2 baños", tag: "Best value" },
    ],
    layout: "story",
    timeline: [1, 1, 3],
    headline: "¡Tu baño ordenado en minutos, sin perforar la pared!",
    subheadline: "Esquinero de acero inoxidable con 4 bandejas: shampoos, cremas, jabones y toallas en su lugar.",
    inBox: ["Poste ajustable de acero inoxidable", "4 bandejas organizadoras", "Toallero", "Bases de silicona antideslizante"],
    problem: {
      title: "¿Tu baño se ve desordenado aunque limpies todos los días?",
      text: "Botes en el piso, jabones en la orilla de la ducha y nada en su lugar: el baño se ve pequeño y la humedad lo ensucia todo.",
    },
    solution: {
      title: "Cada cosa en su lugar, desde el primer día",
      text: "Shampoos, cremas, jabones, cepillos y accesorios quedan ordenados, a la mano y lejos de la humedad del piso. Tu baño se ve más limpio, más amplio y más elegante.",
    },
    benefits: [
      { icon: "🔩", title: "Sin perforaciones", text: "Se instala a presión entre el piso y el techo. No maltrata tus paredes." },
      { icon: "↕️", title: "Altura ajustable", text: "El poste se alarga hasta unos 3.20 metros para adaptarse a tu baño." },
      { icon: "🧴", title: "4 niveles", text: "4 bandejas para todo lo que usas en la ducha, más un toallero." },
      { icon: "💧", title: "Resiste la humedad", text: "Acero inoxidable y bandejas de ABS, hechos para el agua del baño." },
    ],
    sections: [
      {
        image: "images/esquinero-antes-despues.webp",
        title: "¿Qué cambia cuando lo instalas?",
        text: "Del desorden en el piso a un baño ordenado: cada producto tiene su lugar, a la altura de tu mano.",
      },
      {
        image: "images/esquinero-instalar.mp4",
        title: "Se instala en minutos",
        text: "Pon el poste en la esquina, ajusta la altura hasta que toque el techo y gira para apretar. Luego coloca las bandejas donde las quieras.",
      },
      {
        image: "images/esquinero-partes.webp",
        title: "Firme, sin moverse",
        text: "Su sistema de presión ajustable, el resorte reforzado y las bases de silicona antideslizante mantienen toda la estructura firme y estable en el uso diario.",
        list: ["Silicona antideslizante arriba y abajo", "Resorte fuerte y flexible", "Altura del poste ajustable", "Base con toallero"],
      },
      {
        image: "images/esquinero-beneficios.webp",
        title: "Aprovecha cada rincón",
        text: "Su diseño vertical usa esa esquina que normalmente está vacía y la convierte en espacio útil, sin ocupar más lugar en el piso.",
      },
      {
        image: "images/esquinero-medidas.webp",
        title: "Se adapta a tu baño",
        text: "El poste se alarga hasta unos 3.20 metros: queda bien en baños de casa, apartamentos y espacios pequeños.",
      },
      {
        image: "images/esquinero-ducha.webp",
        title: "Ideal para baños pequeños, modernos y funcionales",
        text: "Si te gusta que tu casa se vea limpia y ordenada, es de esos productos que después piensas: \"¿Cómo no lo compré antes?\"",
      },
      {
        image: "images/esquinero-proceso.webp",
        title: "Así de fácil es pedirlo",
        text: "Haces tu pedido aquí, te llamamos para confirmarlo y te lo llevamos a tu puerta. Pagas en efectivo cuando lo recibes.",
      },
    ],
    steps: [
      { title: "Colócalo en la esquina", text: "Pon la base de silicona en el piso de la esquina de tu ducha." },
      { title: "Ajusta la altura", text: "Alarga el poste hasta que toque el techo y gíralo para que quede firme." },
      { title: "Acomoda las bandejas", text: "Pon las 4 bandejas a la altura que quieras y llénalas con tus cosas." },
    ],
    // Specs: from the reference page's text and photos
    specs: {
      "Material": "Acero inoxidable + bandejas de ABS",
      "Altura": "Ajustable, hasta 3.20 metros aprox.",
      "Niveles": "4 bandejas organizadoras",
      "Extras": "Toallero en la base",
      "Instalación": "A presión, sin perforaciones",
    },
    faq: [
      { q: "¿Tengo que perforar la pared?", a: "No. Se instala a presión entre el piso y el techo, sin tornillos ni taladro." },
      { q: "¿Sirve para la altura de mi baño?", a: "El poste es ajustable y se alarga hasta unos 3.20 metros. Mide la altura de tu baño, del piso al techo, antes de instalarlo." },
      { q: "¿Se oxida con el agua?", a: "Está hecho de acero inoxidable con bandejas de ABS, materiales pensados para la humedad del baño." },
      { q: "¿Cómo pago?", a: "Pagas en efectivo cuando recibes tu pedido. No necesitas tarjeta." },
      { q: "¿Cuánto tarda en llegar?", a: "Entre 1 y 3 días hábiles, según tu departamento. El envío es gratis." },
    ],
  },
  {
    id: "aspiradora-recargable",
    // El Salvador only: texts in Spanish, prices in US dollars. Page like the user's reference
    // (cuelhome.com/products/aspiradora-inalambrica-4-en-1), model = baston-plegable (layout "story").
    // Its photos and its GIF (as MP4). The user sells it as "2 en 1" (floor + hand): the reference's
    // "4 en 1" title is cropped off the uses photo and no text says 4 en 1 / 4 modos. Without its Peru
    // shipping/payment images, its warranty badges or its "pocas unidades" GIF.
    name: "Aspiradora Recargable 2 En 1",
    sku: "LD-P-5170622", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Home & cleaning",
    price: 47.99, // user's price; the 2-piece price is my suggestion (user: 2 offers only)
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🌪️",
    image: "images/aspiradora-main.webp",
    squarePhotos: true,
    images: ["images/aspiradora-main.webp", "images/aspiradora-2en1.webp", "images/aspiradora-sala.webp", "images/aspiradora-accesorios.webp"],
    description: "Una aspiradora inalámbrica y recargable 2 en 1: úsala como aspiradora vertical para el piso o quita el tubo y úsala de mano en sofás, esquinas y el carro.",
    offers: [
      { qty: 1, price: 47.99, label: "1 aspiradora" },
      { qty: 2, price: 84.99, label: "2 aspiradoras · Casa y carro", tag: "Best value" },
    ],
    layout: "story",
    timeline: [1, 1, 3],
    headline: "¡Limpieza en cada rincón, sin cables!",
    subheadline: "Aspiradora recargable 2 en 1: vertical para el piso y de mano para muebles, esquinas y el carro.",
    inBox: ["Aspiradora de mano", "Tubo largo", "Cepillo para piso", "Boquillas y cepillos para rincones y tapicería", "Cable de carga USB tipo C"],
    problem: {
      title: "¿Sacar la aspiradora es todo un problema?",
      text: "Aspiradoras pesadas, cables que no llegan y un enchufe en cada cuarto: por unas migajas en la mesa o pelos en el sofá, terminas dejándolo para después.",
    },
    solution: {
      title: "Una aspiradora ligera, siempre lista",
      text: "Sin cable y recargable: la tomas, limpias y la guardas. Para el piso, con el tubo largo, o de mano, para los muebles, las esquinas o el interior del carro.",
    },
    benefits: [
      { icon: "🔋", title: "Sin cables", text: "Recargable con cable USB tipo C. Limpia donde quieras, sin buscar enchufe." },
      { icon: "🔄", title: "2 en 1", text: "Vertical para el piso o de mano para muebles y el carro." },
      { icon: "🌪️", title: "Buena succión", text: "Motor de 120W para migajas, polvo, tierra y pelos." },
      { icon: "🪶", title: "Ligera", text: "Fácil de llevar por toda la casa y por las escaleras." },
    ],
    sections: [
      {
        image: "images/aspiradora-antes-despues.webp",
        title: "¿Cómo cambia tu limpieza diaria?",
        text: "Una aspiradora ligera y lista en segundos: limpiar deja de ser una tarea pesada y la casa se mantiene limpia todos los días.",
      },
      {
        image: "images/aspiradora-uso.mp4",
        title: "Del piso a la cama, en segundos",
        text: "Con el tubo largo limpias el piso sin agacharte. Quítalo y tienes una aspiradora de mano para la cama, los muebles o los estantes.",
      },
      {
        image: "images/aspiradora-usos.webp",
        title: "Fácil de usar",
        text: "Se arma en segundos y sin herramientas. Sus boquillas se cambian fácil para llegar a los rincones más estrechos.",
        list: ["Fácil armado", "Piso, rincones, tapicería y carro", "Diseño ligero y cómodo"],
      },
      {
        image: "images/aspiradora-accesorios.webp",
        title: "Accesorios para cada lugar",
        text: "Cepillo para el piso, boquilla larga para esquinas y cepillos para sofás, alfombras y asientos del carro.",
      },
      {
        image: "images/aspiradora-sala.webp",
        title: "Ideal para un hogar más limpio",
        text: "Migajas en la mesa, tierra en la entrada o pelos de tu mascota en la alfombra: lo limpias en segundos, sin sacar aparatos gigantes.",
      },
      {
        image: "images/aspiradora-medidas.webp",
        title: "Ligera y fácil de guardar",
        text: "Mide unos 105 cm de alto con el tubo puesto. La guardas en cualquier rincón, sin ocupar espacio.",
      },
    ],
    steps: [
      { title: "Cárgala", text: "Conecta el cable USB tipo C hasta que esté cargada." },
      { title: "Elige el modo", text: "Pon el tubo y el cepillo para el piso, o úsala de mano con la boquilla que necesites." },
      { title: "Vacía el depósito", text: "Al terminar, abre el depósito transparente y bótalo en la basura." },
    ],
    // Specs: from the reference page's text and photos
    specs: {
      "Potencia": "120W",
      "Uso": "2 en 1: vertical para piso y de mano",
      "Carga": "Recargable, USB tipo C",
      "Accesorios": "Cepillo para piso, boquillas y cepillos",
      "Medidas": "Aprox. 105.5 cm de alto, cepillo de 21 cm",
    },
    faq: [
      { q: "¿Necesita cable para funcionar?", a: "No. Es recargable: la cargas con el cable USB tipo C y la usas sin cable por toda la casa." },
      { q: "¿Sirve para el carro?", a: "Sí. Quítale el tubo y úsala de mano con las boquillas para los asientos y los rincones del carro." },
      { q: "¿Sirve para pelos de mascota?", a: "Sí, en sofás, camas y alfombras, con el cepillo para tapicería." },
      { q: "¿Cómo pago?", a: "Pagas en efectivo cuando recibes tu pedido. No necesitas tarjeta." },
      { q: "¿Cuánto tarda en llegar?", a: "Entre 1 y 3 días hábiles, según tu departamento. El envío es gratis." },
    ],
  },
  {
    id: "lonchera-electrica",
    // El Salvador only: texts in Spanish, prices in US dollars. Page like the user's reference
    // (importamostodoecuador.myshopify.com/products/lonchera-electrica-portatil, saved by the user):
    // its 7 tall images minus the "Opiniones de nuestros clientes" one (made-up reviews, not ours).
    // Their price box ($35.99, "Antes $59.98", "Garantía de 30 días") replaced by $45.99 + "Envío
    // gratis" on the hero and offer images. The reference page has no GIF.
    name: "Lonchera Eléctrica Portátil",
    sku: "LD-P-6537152", // LatinDrop SKU (El Salvador tab of the sheet)
    countries: ["sv"],
    category: "Home & kitchen",
    price: 45.99, // user's price; the 2-piece price is my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🍱",
    image: "images/lonchera-main.webp",
    squarePhotos: true,
    images: ["images/lonchera-main.webp"], // blue: the user sells it in blue only
    description: "Una lonchera eléctrica que calienta tu comida donde estés: la conectas, esperas unos minutos y comes caliente en el trabajo, sin hacer fila en el microondas.",
    offers: [
      { qty: 1, price: 45.99, label: "1 lonchera" },
      { qty: 2, price: 79.99, label: "2 loncheras · Para ti y tu pareja", tag: "Best value" },
    ],
    layout: "story",
    timeline: [1, 1, 3],
    headline: "Tu almuerzo frío ya no te quita la tarde",
    subheadline: "Lonchera eléctrica portátil: calienta tu comida en minutos, en la oficina o donde estés.",
    inBox: ["Lonchera eléctrica", "Bandeja interior con divisor", "Cable de corriente", "Cuchara"],
    problem: {
      title: "¿Comida fría o filas en el microondas?",
      text: "Llevas tu comida de casa, pero a la hora del almuerzo el microondas está ocupado o hay fila. Al final comes frío, o gastas en comida rápida cara cada día.",
    },
    solution: {
      title: "Tu propio calentador, en tu escritorio",
      text: "Pones tu comida en la lonchera, la conectas y en unos minutos está caliente. Sin filas, sin microondas, sin gastar de más.",
    },
    benefits: [
      { icon: "🔥", title: "Calienta rápido", text: "Comida caliente en minutos, lista cuando tienes hambre." },
      { icon: "🔌", title: "Solo conéctala", text: "Se conecta a cualquier enchufe de la oficina o la casa." },
      { icon: "🍱", title: "Dos compartimentos", text: "Bandeja con divisor para el plato fuerte y el acompañamiento." },
      { icon: "💼", title: "Fácil de llevar", text: "Diseño compacto con asa y seguros laterales." },
      { icon: "💵", title: "Ahorras cada día", text: "Comes casero y dejas de gastar en comida rápida." },
    ],
    sections: [
      {
        image: "images/lonchera-hero.webp",
        title: "Come caliente todos los días",
        text: "Gastar cada día en comida rápida cara te deja con hambre y sin presupuesto. Con tu lonchera eléctrica llevas tu comida de casa y la comes caliente.",
      },
      {
        image: "images/lonchera-microondas.webp",
        title: "Adiós a las filas del microondas",
        text: "Tu comida se calienta en tu escritorio mientras trabajas. La luz LAMP te avisa que está calentando.",
        list: ["Comida fría en tu escritorio → caliente", "Calienta de manera rápida", "Compacta y fácil de transportar"],
      },
      {
        image: "images/lonchera-comida-fria.webp",
        title: "Comer frío te quita la energía",
        text: "Perder tiempo esperando el microondas o comer frío te deja sin ganas para el resto del día. Una comida caliente lo cambia todo.",
      },
      {
        image: "images/lonchera-pasos.webp",
        title: "Fácil en 3 pasos",
        text: "Coloca la comida en la bandeja, conecta la lonchera y en minutos disfrutas tu comida caliente.",
      },
      {
        image: "images/lonchera-preguntas.webp",
        title: "Rápida y compacta",
        text: "Calienta rápido y se lleva fácil en tu bolso o mochila. Te llega en color azul.",
      },
      {
        image: "images/lonchera-oferta.webp",
        title: "Tu comida caliente donde estés",
        text: "Pídela hoy, la recibes en casa y pagas en efectivo al recibirla. Envío gratis.",
      },
    ],
    steps: [
      { title: "Coloca la comida", text: "Pon tus alimentos en la bandeja interior con divisor y cierra los seguros." },
      { title: "Conecta y calienta", text: "Con la lonchera sobre la mesa, conéctala al enchufe. La luz LAMP se enciende." },
      { title: "Disfruta", text: "Después de unos minutos, desconéctala, abre los seguros laterales y sirve tu comida caliente." },
    ],
    warning: "Antes de calentar, abre la válvula de la tapa para dejar salir el vapor (así lo indica la etiqueta \"Tips\" de la tapa).",
    specs: {
      "Uso": "Calentar comida ya preparada",
      "Conexión": "Enchufe de pared",
      "Interior": "Bandeja con 2 compartimentos",
      "Color": "Azul",
    },
    faq: [
      { q: "¿Cuánto tarda en calentar?", a: "Unos minutos, según la comida y la cantidad. Conéctala un rato antes de tu hora de almuerzo." },
      { q: "¿Cocina la comida cruda?", a: "No. Está hecha para calentar comida ya preparada, como tu almuerzo de casa." },
      { q: "¿De qué color es?", a: "Te llega en color azul." },
      { q: "¿Cómo pago?", a: "Pagas en efectivo cuando recibes tu pedido. No necesitas tarjeta." },
      { q: "¿Cuánto tarda en llegar?", a: "Entre 1 y 3 días hábiles, según tu departamento. El envío es gratis." },
    ],
  },
  {
    id: "clearzal-fast",
    // El Salvador only, NOT Guatemala (user, 26 Nov 2026): Spanish, US dollars.
    // Page = the user's reference landing page, copied whole (user: "hez lia dik landing page kamla"):
    // ofertazogt.com/products/gel-pain-relief-clearzal-fast-acting-x-60-ml, saved by the user with
    // Ctrl+S. Layout "clear" (css/clear.css): its dark "Black Friday" moving bar, hero image, green
    // "¡PIDE AHORA Y PAGA AL RECIBIR! 🚛" button, then its ad images one under the other.
    // Changes to their images: Q price boxes cut off the hero and offer images; FAQ image says
    // "en todo El Salvador" (was Guatemala) and "producto original" (was "dispositivo médico").
    // Their customer-reviews image (Diego M., Andrés P., Carlos R.) left out: not our customers.
    name: "Clearzal Fast",
    sku: "LD-P-19240", // LatinDrop SKU (user, 26 Nov 2026)
    countries: ["sv"],
    notIn: ["gt"],
    category: "Health & comfort",
    price: 39, // user's price; 2 and 3 pieces are my suggestion
    oldPrice: null,
    rating: 4.8,
    reviews: 0,
    badge: "New",
    icon: "🧴",
    image: "images/clearzal-hero.webp",
    images: ["images/clearzal-hero.webp"],
    description: "Gel frío Clearzal Fast de 60 ml para músculos y articulaciones: fórmula con mentol, se absorbe rápido y no mancha la ropa.",
    offers: [
      { qty: 1, price: 39, label: "1 unidad" },
      { qty: 2, price: 69, label: "2 unidades", tag: "Best value" },
      { qty: 3, price: 89, label: "3 unidades" },
    ],
    layout: "clear",
    ticker: ["⚡ VE LAS OFERTAS BLACK FRIDAY", "🔥 ENTRA Y COMPRA A PRECIO BLACK FRIDAY", "RECIBE TU PEDIDO CON ENVÍO GRATIS"],
    buyText: "¡PIDE AHORA Y PAGA AL RECIBIR! 🚛",
    buyNote: "🔒 Pago Seguro · 🚚 Envío Gratis",
    ctaText: "¡PIDE AHORA Y PAGA AL RECIBIR! 🚛",
    blocks: [
      { img: "images/clearzal-antes-despues.webp", alt: "Antes y después" },
      { img: "images/clearzal-beneficios.webp", alt: "Crioterapia con mentol, absorción rápida, extractos naturales" },
      { img: "images/clearzal-como-funciona.webp", alt: "Cómo funciona en 3 pasos" },
      { img: "images/clearzal-faq.webp", alt: "Preguntas frecuentes" },
      { img: "images/clearzal-oferta.webp", alt: "Clearzal Fast 60 ml" },
      { cta: true },
    ],
    faq: [
      { q: "¿Mancha la ropa?", a: "No. Se absorbe rápido y no deja residuo grasoso." },
      { q: "¿Cuántas veces al día lo uso?", a: "De 2 a 3 veces al día, o cuando lo necesites. Solo uso externo: no en ojos, mucosas ni heridas." },
      { q: "¿Cómo pago?", a: "Pagas en efectivo cuando recibes tu pedido. No necesitas tarjeta." },
      { q: "¿Cuánto tarda en llegar?", a: "Entre 1 y 3 días hábiles, según tu departamento. El envío es gratis." },
    ],
  },
];

// A link to a product sold in other countries only (e.g. an ad link without &country=lb, opened
// on a phone that chose Zambia before) reopens the same page in the product's country.
{
  const p = PRODUCTS.find((x) => x.id === new URLSearchParams(location.search).get("id"));
  const open = p?.countries?.filter((c) => COUNTRIES[c]) || [];
  if (open.length && ((!open.includes(COUNTRY.id) && !open.includes(COUNTRY.look)) || p.notIn?.includes(COUNTRY.id))) {
    const url = new URL(location.href);
    url.searchParams.set("country", open[0]);
    location.replace(url.href);
  }
}

// A product with "countries" is only sold there, at its own prices.
for (let i = PRODUCTS.length - 1; i >= 0; i--) {
  const c = PRODUCTS[i].countries;
  // notIn: ["gt"] = not sold in that country even if it has the look of one in "countries"
  if ((c && !c.includes(COUNTRY.id) && !c.includes(COUNTRY.look)) || PRODUCTS[i].notIn?.includes(COUNTRY.id)) PRODUCTS.splice(i, 1);
}

// A country with a look (Guatemala): the look country's products, in its own money and words.
if (COUNTRY.look !== COUNTRY.id) {
  const deep = (v) => typeof v === "string" ? localize(v)
    : Array.isArray(v) ? v.map(deep)
    : v && typeof v === "object" && !(v instanceof RegExp) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)]))
    : v;
  const keep = new Set(["id", "sku", "price", "oldPrice", "countries"]);
  for (const p of PRODUCTS) {
    const own = p[COUNTRY.id];
    if (!p.countries?.includes(COUNTRY.id)) {
      // Prices: the product's own (gt: { price, offers }) or the dollar ones × usdRate
      if (!own?.price) {
        const conv = (n) => (n ? toLocalPrice(n) : n);
        p.price = conv(p.price);
        p.oldPrice = conv(p.oldPrice);
        if (p.offers) p.offers = p.offers.map((o) => ({ ...o, price: conv(o.price) }));
      }
      Object.assign(p, p[COUNTRY.look] || {}, own || {});
    }
    for (const k of Object.keys(p)) if (!keep.has(k)) p[k] = deep(p[k]);
  }
}

// Outside Tanzania each product takes its local prices; a product without them is not sold there.
if (COUNTRY.id !== "tz") {
  for (let i = PRODUCTS.length - 1; i >= 0; i--) {
    // "countries" products are already in that country's prices; their local part only changes the name etc.
    if (PRODUCTS[i].countries) { if (COUNTRY.look === COUNTRY.id) Object.assign(PRODUCTS[i], PRODUCTS[i][COUNTRY.id] || {}); continue; }
    const local = PRODUCTS[i][COUNTRY.id];
    if (!local) { PRODUCTS.splice(i, 1); continue; }
    const { sectionImages, ...rest } = local;
    Object.assign(PRODUCTS[i], rest);
    if (sectionImages) {
      PRODUCTS[i].sections = PRODUCTS[i].sections.map((s, n) => ({ ...s, image: sectionImages[n] || s.image }));
    }
  }
}
