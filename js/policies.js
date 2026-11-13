/* Policies page — policies#privacy, policies#terms, policies#contact
   Texts in the visitor's language (English, Swahili, Spanish), with the visitor's country.
   No returns / refunds are promised (user's choice, 13 Nov 2026): don't add any. */
(() => {
  "use strict";

  const { $, esc } = Shop;
  const UPDATED = { en: "13 November 2026", sw: "13 Novemba 2026", es: "13 de noviembre de 2026" };
  const lang = UPDATED[LANG] ? LANG : "en";
  const country = T(COUNTRY.name);
  const site = "dukaabora.store";

  // Ways to reach us that exist for this country (no phone / WhatsApp in El Salvador)
  const phone = STORE.phone ? `<a href="tel:+${esc(STORE.phone)}">${esc(STORE.phoneDisplay)}</a>` : "";
  const wa = String(STORE.whatsapp || "").replace(/\D/g, "");
  const links = [
    phone && `<li>📞 ${phone}</li>`,
    wa && `<li>💬 <a href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a></li>`,
    STORE.email && `<li>✉️ <a href="mailto:${esc(STORE.email)}">${esc(STORE.email)}</a></li>`,
    STORE.instagram && `<li>📸 <a href="${esc(STORE.instagram)}" target="_blank" rel="noopener">Instagram</a></li>`,
    STORE.facebook && `<li>👍 <a href="${esc(STORE.facebook)}" target="_blank" rel="noopener">Facebook</a></li>`,
  ].filter(Boolean).join("");

  const TEXTS = {
    en: {
      title: "Policies",
      nav: ["Privacy policy", "Terms & conditions", "Contact us"],
      updated: "Last updated",
      privacy: `
        <p>Duka Bora (${site}) sells products online in ${country} with delivery to your door and payment in cash on delivery. This policy explains what information we collect and how we use it.</p>
        <h3>What we collect</h3>
        <ul>
          <li>The details you write in the order form: your name, phone number and delivery address.</li>
          <li>The product, quantity and price of your order.</li>
          <li>Technical information sent by your browser: device type, pages visited, and cookies used to measure our ads (Meta Pixel) and visits (Cloudflare Web Analytics).</li>
        </ul>
        <h3>Why we use it</h3>
        <ul>
          <li>To call you and confirm your order and address.</li>
          <li>To deliver your order and collect the payment on delivery.</li>
          <li>To answer your questions about an order.</li>
          <li>To measure and improve our website and our advertising.</li>
        </ul>
        <h3>Who receives it</h3>
        <p>We share your name, phone number and address only with the people who need them for your order: our order confirmation team and our delivery partner in ${country}. Our service providers process data for us: Cloudflare (website hosting), Google (order storage) and Meta (advertising measurement; the details used to match an order to an ad are encrypted before they are sent). We never sell your personal information.</p>
        <h3>How long we keep it</h3>
        <p>We keep order details for as long as we need them for delivery, customer service and our accounts, then we delete them.</p>
        <h3>Your choices</h3>
        <p>You can ask us to see, correct or delete your personal information at any time: contact us with the details below. You can also block or delete cookies in your browser settings.</p>`,
      terms: `
        <p>By placing an order on ${site} you accept these conditions.</p>
        <h3>Orders</h3>
        <p>To order, fill in the order form with your real name, phone number and address. Our team calls you to confirm the order before it is sent. If we cannot reach you, or if the details are not correct, the order may be cancelled.</p>
        <h3>Prices and payment</h3>
        <p>Prices are shown in the local currency of ${country} and include delivery. You pay the total shown on the order page, in cash, when the order is delivered. Nothing is paid online.</p>
        <h3>Delivery</h3>
        <p>Delivery is free. Delivery times shown on the website are estimates and may change with the place of delivery, holidays or circumstances outside our control. Our delivery partner contacts you before coming.</p>
        <h3>Products</h3>
        <p>We describe and show our products as accurately as we can. Colours may look slightly different on your screen. Use each product as its instructions say. Food supplements do not replace a balanced diet and are not medicines; ask your doctor before using them if you are pregnant, take medicines or have a health condition.</p>
        <h3>Cancelling an order</h3>
        <p>You can cancel your order free of charge before it is sent: tell our team during the confirmation call or contact us.</p>
        <h3>Changes</h3>
        <p>We may update these conditions. The version on this page applies to new orders.</p>`,
      contact: `
        <p>For any question about a product or an order, contact Duka Bora:</p>`,
      contactNote: "Our team is available 7 days a week, 8:00 – 20:00. Please include your order number if you have one.",
    },
    sw: {
      title: "Sera zetu",
      nav: ["Sera ya faragha", "Masharti na vigezo", "Wasiliana nasi"],
      updated: "Ilisasishwa",
      privacy: `
        <p>Duka Bora (${site}) inauza bidhaa mtandaoni ${country}, inazileta hadi mlangoni kwako na unalipa pesa taslimu unapopokea. Sera hii inaeleza taarifa tunazokusanya na jinsi tunavyozitumia.</p>
        <h3>Tunachokusanya</h3>
        <ul>
          <li>Taarifa unazoandika kwenye fomu ya oda: jina lako, namba ya simu na anwani ya kupelekea.</li>
          <li>Bidhaa, idadi na bei ya oda yako.</li>
          <li>Taarifa za kiufundi kutoka kwenye kivinjari chako: aina ya kifaa, kurasa ulizotembelea, na vidakuzi (cookies) vinavyotumika kupima matangazo yetu (Meta Pixel) na wageni (Cloudflare Web Analytics).</li>
        </ul>
        <h3>Kwa nini tunazitumia</h3>
        <ul>
          <li>Kukupigia simu kuthibitisha oda na anwani yako.</li>
          <li>Kukuletea oda yako na kupokea malipo wakati wa kupokea.</li>
          <li>Kujibu maswali yako kuhusu oda.</li>
          <li>Kupima na kuboresha tovuti na matangazo yetu.</li>
        </ul>
        <h3>Nani anazipokea</h3>
        <p>Tunashiriki jina, namba ya simu na anwani yako tu na wanaozihitaji kwa oda yako: timu yetu ya kuthibitisha oda na msafirishaji wetu ${country}. Watoa huduma wetu wanashughulikia taarifa kwa niaba yetu: Cloudflare (tovuti), Google (kuhifadhi oda) na Meta (kupima matangazo; taarifa zinazotumika kuunganisha oda na tangazo hufichwa kwa usimbaji kabla ya kutumwa). Hatuuzi kamwe taarifa zako binafsi.</p>
        <h3>Muda tunaozihifadhi</h3>
        <p>Tunahifadhi taarifa za oda kwa muda tunaouhitaji kwa usafirishaji, huduma kwa wateja na hesabu zetu, kisha tunazifuta.</p>
        <h3>Haki zako</h3>
        <p>Unaweza kutuomba kuona, kurekebisha au kufuta taarifa zako binafsi wakati wowote: wasiliana nasi kupitia njia zilizo hapa chini. Unaweza pia kuzuia au kufuta vidakuzi kwenye mipangilio ya kivinjari chako.</p>`,
      terms: `
        <p>Kwa kuweka oda kwenye ${site} unakubali masharti haya.</p>
        <h3>Oda</h3>
        <p>Kuagiza, jaza fomu ya oda kwa jina lako halisi, namba ya simu na anwani. Timu yetu inakupigia simu kuthibitisha oda kabla haijatumwa. Tusipokupata, au taarifa zikiwa si sahihi, oda inaweza kufutwa.</p>
        <h3>Bei na malipo</h3>
        <p>Bei zinaonyeshwa kwa sarafu ya ${country} na zinajumuisha usafirishaji. Unalipa jumla iliyoonyeshwa kwenye ukurasa wa oda, kwa pesa taslimu, oda inapofika. Hakuna malipo ya mtandaoni.</p>
        <h3>Usafirishaji</h3>
        <p>Usafirishaji ni bure. Muda wa kufikisha ulioonyeshwa kwenye tovuti ni makadirio na unaweza kubadilika kulingana na mahali, sikukuu au mambo yaliyo nje ya uwezo wetu. Msafirishaji wetu anakupigia kabla ya kuja.</p>
        <h3>Bidhaa</h3>
        <p>Tunaeleza na kuonyesha bidhaa zetu kwa usahihi kadri tuwezavyo. Rangi zinaweza kuonekana tofauti kidogo kwenye skrini yako. Tumia kila bidhaa kama maelekezo yake yanavyosema.</p>
        <h3>Kufuta oda</h3>
        <p>Unaweza kufuta oda yako bure kabla haijatumwa: iambie timu yetu wakati wa simu ya kuthibitisha au wasiliana nasi.</p>
        <h3>Mabadiliko</h3>
        <p>Tunaweza kusasisha masharti haya. Toleo lililo kwenye ukurasa huu linatumika kwa oda mpya.</p>`,
      contact: `
        <p>Kwa swali lolote kuhusu bidhaa au oda, wasiliana na Duka Bora:</p>`,
      contactNote: "Timu yetu inapatikana siku 7 kwa wiki, 8:00 – 20:00. Tafadhali taja namba ya oda yako kama unayo.",
    },
    es: {
      title: "Políticas",
      nav: ["Política de privacidad", "Términos y condiciones", "Contacto"],
      updated: "Última actualización",
      privacy: `
        <p>Duka Bora (${site}) vende productos en línea en ${country}, con entrega a domicilio y pago en efectivo al recibir. Esta política explica qué información recopilamos y cómo la usamos.</p>
        <h3>Qué recopilamos</h3>
        <ul>
          <li>Los datos que escribes en el formulario de pedido: tu nombre, número de teléfono y dirección de entrega.</li>
          <li>El producto, la cantidad y el precio de tu pedido.</li>
          <li>Información técnica que envía tu navegador: tipo de dispositivo, páginas visitadas y cookies usadas para medir nuestros anuncios (Meta Pixel) y las visitas (Cloudflare Web Analytics).</li>
        </ul>
        <h3>Para qué la usamos</h3>
        <ul>
          <li>Para llamarte y confirmar tu pedido y tu dirección.</li>
          <li>Para entregar tu pedido y cobrar el pago al recibir.</li>
          <li>Para responder tus preguntas sobre un pedido.</li>
          <li>Para medir y mejorar nuestro sitio web y nuestra publicidad.</li>
        </ul>
        <h3>Quién la recibe</h3>
        <p>Compartimos tu nombre, teléfono y dirección solo con quienes los necesitan para tu pedido: nuestro equipo de confirmación de pedidos y nuestra empresa de entrega en ${country}. Nuestros proveedores de servicios tratan datos por nosotros: Cloudflare (alojamiento del sitio), Google (registro de pedidos) y Meta (medición de anuncios; los datos usados para relacionar un pedido con un anuncio se cifran antes de enviarse). Nunca vendemos tu información personal.</p>
        <h3>Cuánto tiempo la guardamos</h3>
        <p>Guardamos los datos del pedido el tiempo necesario para la entrega, la atención al cliente y nuestra contabilidad; después los eliminamos.</p>
        <h3>Tus derechos</h3>
        <p>Puedes pedirnos ver, corregir o eliminar tu información personal en cualquier momento: contáctanos por los medios indicados abajo. También puedes bloquear o borrar las cookies en la configuración de tu navegador.</p>`,
      terms: `
        <p>Al hacer un pedido en ${site} aceptas estas condiciones.</p>
        <h3>Pedidos</h3>
        <p>Para pedir, completa el formulario con tu nombre real, tu número de teléfono y tu dirección. Nuestro equipo te llama para confirmar el pedido antes de enviarlo. Si no logramos comunicarnos contigo, o si los datos no son correctos, el pedido puede cancelarse.</p>
        <h3>Precios y pago</h3>
        <p>Los precios se muestran en dólares estadounidenses (USD) e incluyen el envío. Pagas el total indicado en la página del pedido, en efectivo, cuando recibes el pedido. No se paga nada en línea.</p>
        <h3>Entrega</h3>
        <p>El envío es gratis. Los plazos de entrega indicados en el sitio son estimados y pueden variar según el lugar de entrega, los días festivos o circunstancias ajenas a nosotros. Nuestra empresa de entrega te contacta antes de llegar.</p>
        <h3>Productos</h3>
        <p>Describimos y mostramos nuestros productos con la mayor exactitud posible. Los colores pueden verse un poco distintos en tu pantalla. Usa cada producto según sus instrucciones. Los suplementos alimenticios no sustituyen una alimentación equilibrada ni son medicamentos; consulta a tu médico antes de usarlos si estás embarazada, tomas medicamentos o tienes una enfermedad.</p>
        <h3>Cancelar un pedido</h3>
        <p>Puedes cancelar tu pedido sin costo antes de que sea enviado: avísale a nuestro equipo durante la llamada de confirmación o contáctanos.</p>
        <h3>Cambios</h3>
        <p>Podemos actualizar estas condiciones. La versión publicada en esta página se aplica a los pedidos nuevos.</p>`,
      contact: `
        <p>Para cualquier pregunta sobre un producto o un pedido, contacta a Duka Bora:</p>`,
      contactNote: "Nuestro equipo atiende los 7 días de la semana, de 8:00 a 20:00. Si tienes un número de pedido, inclúyelo en tu mensaje.",
    },
  };

  const t = TEXTS[lang];
  const ids = ["privacy", "terms", "contact"];
  document.title = `${t.title} · Duka Bora`;
  $("#pTitle").textContent = t.title;
  $("#pUpdated").textContent = `${t.updated}: ${UPDATED[lang]}`;
  $("#pNav").innerHTML = ids.map((id, i) => `<a href="#${id}">${esc(t.nav[i])}</a>`).join("");
  $("#pBody").innerHTML = ids.map((id, i) => `
    <section class="p-sec" id="${id}">
      <h2>${esc(t.nav[i])}</h2>
      ${id === "contact" ? `${t.contact}<ul class="p-contact">${links}</ul><p>${esc(t.contactNote)}</p>` : t[id]}
    </section>`).join("");
  // The browser jumped before the sections existed: go to the one in the link now
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  $("#year").textContent = new Date().getFullYear();
})();
