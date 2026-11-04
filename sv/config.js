/* ==========================================================================
   EL SALVADOR STORE — every setting and every product is in THIS file.
   Live at https://dukaabora.store/sv/  (push to GitHub main = live)
   - Change a price, a text or a photo: edit the product below.
   - Add a product: copy one { ... } block in PRODUCTS, give it a new "id".
   - Remove a product: delete its block (or set hidden: true).
   ========================================================================== */

// The copies on workers.dev / github.io / www open the same page on the official address.
if (/\.workers\.dev$|\.github\.io$|^www\.dukaabora\.store$/.test(location.hostname)) {
  location.replace("https://dukaabora.store" + location.pathname.replace(/^\/new-store/, "") + location.search + location.hash);
}

const CONFIG = {
  brand: "Duka Bora",
  tagline: "Productos seleccionados, pago al recibir",
  country: "El Salvador",
  currency: "USD",
  locale: "es-SV",

  // Phone shown on the site and WhatsApp button (digits only, with country code). Empty = hidden.
  whatsapp: "212672511063",
  whatsappText: "Hola Duka Bora, quiero hacer un pedido:",
  phoneDisplay: "+212 672 511 063",
  email: "", // e.g. "ventas@dukaabora.store". Empty = not shown.
  instagram: "https://www.instagram.com/dukaabora/",
  facebook: "https://www.facebook.com/profile.php?id=100070066074275",

  // Google Sheet that receives the orders (google-sheet/orders.gs). Empty = the checkout
  // refuses orders (it never pretends an order was sent).
  ordersUrl: "https://script.google.com/macros/s/AKfycbxrx2C83Ns29ULrZWcvHh2EgiJTBEjTDvsinnvz81WAV8ODzpkwsm_Z6V1An7w54lEiRQ/exec",

  // Meta Pixel IDs (digits only). Events: PageView, ViewContent, AddToCart, InitiateCheckout,
  // Purchase (only after the Google Sheet confirms the order). Empty list = no pixel.
  metaPixels: ["2505097906522683"],

  // Delivery — TO CONFIRM (these are starting values).
  shipping: {
    price: 0,               // 0 = "Gratis"; e.g. 3.5 = $3.50 per order
    freeFrom: 0,            // order total from which delivery is free (0 = not used)
    nationwide: true,       // "Envíos a todo El Salvador"
    time: "24 a 72 horas",  // delivery time shown on the site
    fastArea: "San Salvador",
    fastTime: "24 horas",
  },

  // Announcement bar at the top (one or more messages that rotate)
  announcements: [
    "Envío a todo El Salvador · Pagas al recibir tu pedido",
    "Confirmamos cada pedido por teléfono antes de enviarlo",
    "Atención al cliente por WhatsApp",
  ],

  // Phone numbers accepted at checkout: 8 digits, mobile 6/7, landline 2
  phonePrefix: "503",
  phonePattern: /^[267]\d{7}$/,

  departamentos: [
    "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", "La Paz", "La Unión",
    "Morazán", "San Miguel", "San Salvador", "San Vicente", "Santa Ana", "Sonsonate", "Usulután",
  ],

  // Categories, in the order shown on the home page. "image": photo of the category tile.
  categories: [
    { id: "relojes", name: "Relojes", text: "Elegancia en cada detalle", image: "../images/rw1.webp" },
    { id: "joyeria", name: "Joyería", text: "Accesorios que brillan", image: "../images/armchain-gold-arm.jpg" },
    { id: "bienestar", name: "Bienestar", text: "Cuida tu postura y tu cuerpo", image: "../images/posture-1.jpg" },
    { id: "deporte", name: "Deporte", text: "Entrena con estilo", image: "../images/sauna-1.jpg" },
    { id: "auto", name: "Cuidado del auto", text: "Brillo de agencia en minutos", image: "../images/car-nano-spray.jpg" },
  ],

  // Questions on the home page (each product page adds its own)
  faq: [
    { q: "¿Cómo funciona el pago contra entrega?", a: "Haces tu pedido sin pagar nada en línea. Te llamamos para confirmarlo y pagas en efectivo al repartidor cuando recibes el producto en tus manos." },
    { q: "¿Hacen envíos a todo El Salvador?", a: "Sí, enviamos a los 14 departamentos. El tiempo de entrega habitual es de {time}." },
    { q: "¿Cuánto cuesta el envío?", a: "{shippingText}" },
    { q: "¿Cómo confirman mi pedido?", a: "Después de recibir tu pedido te llamamos o escribimos por WhatsApp al número que nos diste para confirmar la dirección, el producto y la cantidad." },
    { q: "¿Puedo cambiar o cancelar mi pedido?", a: "Sí. Escríbenos por WhatsApp antes de que tu pedido salga a entrega y lo modificamos o cancelamos sin costo." },
    { q: "¿Necesito tarjeta o cuenta bancaria?", a: "No. No pedimos datos de tarjeta ni pagos por adelantado: pagas solo cuando recibes tu pedido." },
  ],
};

/* ==========================================================================
   PRODUCTS — prices in US dollars. Prices are starting values: TO CONFIRM.
   Fields:
     id            unique, used in the link: producto.html?id=<id>
     name, short   title and one-line summary
     category      one of the CONFIG.categories ids
     price         price of 1 unit; oldPrice: crossed-out price (null = none)
     offers        bundle prices, e.g. { qty: 2, price: 69 } = 2 units for $69
     featured / bestSeller / hidden   where it is shown
     options       choices the customer picks (e.g. Color), sent with the order
     images        gallery photos (first = main photo)
     reviews       REAL customer reviews only: { name, city, rating (1-5), text, date }
   ========================================================================== */
const PRODUCTS = [
  {
    id: "reloj-reward",
    sku: "",
    name: "Reloj Reward Cronógrafo",
    short: "Cronógrafo en tono oro rosa con estuche de regalo",
    category: "relojes",
    price: 39,
    oldPrice: null,
    offers: [
      { qty: 1, price: 39 },
      { qty: 2, price: 69, tag: "Más elegido" },
      { qty: 3, price: 95 },
    ],
    featured: true,
    bestSeller: true,
    badge: "Nuevo",
    images: ["../images/rw1.webp", "../images/rw-front.webp", "../images/rw2.webp", "../images/rw3.webp", "../images/rw4.webp", "../images/rw5.webp"],
    description: "Un cronógrafo en tono oro rosa que completa tu estilo. En la oficina, en una reunión o en un día especial, la gente nota los detalles. Llega en su estuche, listo para regalar.",
    hero: { title: "Tu momento, definido.", text: "Un reloj que acompaña tus logros, todos los días." },
    benefits: [
      { icon: "sparkle", title: "Acabado premium", text: "Un diseño limpio y elegante que destaca en el trabajo, en eventos o el fin de semana." },
      { icon: "shield", title: "Cristal resistente", text: "Cristal mineral endurecido que resiste rayones y se mantiene claro." },
      { icon: "watch", title: "Cómodo todo el día", text: "Correa de acero inoxidable y silicona suave, ligera y fácil de ajustar." },
      { icon: "gift", title: "Regalo perfecto", text: "Incluye estuche de regalo: cumpleaños, aniversarios, graduaciones." },
    ],
    problem: { title: "Los detalles hablan por ti", text: "Un buen atuendo pierde fuerza con un reloj que no está a la altura, y los relojes de marca cuestan una fortuna." },
    solution: { title: "Estilo de lujo a un precio justo", text: "El Reloj Reward te da el look de un cronógrafo premium, con cristal resistente y correa cómoda, y lo pagas solo cuando lo recibes." },
    features: [
      { image: "../images/rw2.webp", title: "Para cada ocasión", text: "Un cronógrafo oro rosa que combina con tu traje y también con tus jeans.", list: ["En la oficina y reuniones de negocios", "En bodas, fiestas y eventos especiales", "Como un regalo que se recuerda"] },
      { image: "../images/rw3.webp", title: "Cristal fuerte, correa cómoda", text: "El cristal mineral endurecido resiste rayones. La correa de acero inoxidable y silicona es fuerte, ligera y cómoda todo el día.", list: ["Cristal mineral resistente a rayones", "Acero inoxidable + silicona suave", "Cronógrafo y fecha funcionales"] },
      { image: "../images/rw4.webp", title: "Hecho para tu día a día", text: "Del café a la reunión, del trabajo a la cena: un reloj que te acompaña en todo momento." },
    ],
    howItWorks: [
      { title: "Haz tu pedido", text: "Elige la cantidad y completa el formulario en menos de un minuto." },
      { title: "Te llamamos", text: "Confirmamos tu pedido y tu dirección por teléfono." },
      { title: "Recibe y paga", text: "Pagas en efectivo cuando el reloj llega a tus manos." },
    ],
    specs: {
      "Estilo": "Cronógrafo, tono oro rosa",
      "Cristal": "Mineral endurecido, resistente a rayones",
      "Correa": "Acero inoxidable y silicona",
      "Funciones": "Cronógrafo y fecha",
      "Resistencia": "Resistente a salpicaduras de agua",
      "Incluye": "Reloj + estuche de regalo",
    },
    faq: [
      { q: "¿Se puede ajustar la correa?", a: "Sí, la correa se ajusta fácilmente a la medida de tu muñeca." },
      { q: "¿Puedo mojarlo?", a: "Resiste salpicaduras y lluvia ligera. No lo uses para nadar ni bajo la ducha." },
    ],
    reviews: [],
  },
  {
    id: "brazalete-cadenas",
    sku: "ln3-89",
    name: "Brazalete de Brazo con Cadenas",
    short: "Brazalete abierto con cadenas en cascada, dorado o plateado",
    category: "joyeria",
    price: 22,
    oldPrice: null,
    offers: [
      { qty: 1, price: 22 },
      { qty: 2, price: 39, tag: "Más elegido" },
      { qty: 3, price: 55 },
    ],
    featured: true,
    bestSeller: true,
    badge: "Tendencia",
    options: [{ name: "Color", values: ["Dorado", "Plateado"] }],
    images: ["../images/armchain-gold-arm.jpg", "../images/armchain-silver-arm.jpg", "../images/armchain-gold.jpg", "../images/armchain-silver.jpg", "../images/armchain-silver-close.jpg", "../images/armchain-detail.jpg"],
    description: "Un brazalete abierto para la parte superior del brazo, con varias cadenas finas que caen en cascada y pequeños dijes de barra. Convierte un atuendo sencillo en un look elegante.",
    hero: { title: "Un look chic al instante.", text: "Cadenas finas que se mueven contigo y atrapan la luz." },
    benefits: [
      { icon: "sparkle", title: "Brilla en cada movimiento", text: "Cadenas de distintos largos con acabado pulido brillante." },
      { icon: "heart", title: "Ligero y cómodo", text: "Lo llevas durante horas sin darte cuenta." },
      { icon: "check", title: "Fácil de poner", text: "Banda abierta: deslízala por el brazo y ajústala con suavidad." },
      { icon: "gift", title: "Un regalo que encanta", text: "Para un cumpleaños, un aniversario o para decir gracias." },
    ],
    problem: { title: "El mismo atuendo, sin brillo", text: "Un vestido o una blusa sin mangas se ven simples sin el accesorio correcto." },
    solution: { title: "El detalle que lo cambia todo", text: "Un brazalete con cadenas en cascada que da elegancia a cualquier look, de la playa a una boda." },
    features: [
      { image: "../images/armchain-silver-close.jpg", title: "Perfecto con tus looks de verano", text: "Con un top strapless, un vestido o una blusa sin mangas: en la playa, en una boda, en una fiesta o una salida de noche." },
      { image: "../images/armchain-silver-light.jpg", title: "Cadenas delicadas en capas", text: "Varias cadenas finas de diferentes largos que se mueven contigo y reflejan la luz." },
      { image: "../images/armchain-detail.jpg", title: "Sin broche", text: "La banda es abierta: deslízala hasta la altura que te guste y presiónala suavemente para ajustarla a tu brazo." },
    ],
    howItWorks: [
      { title: "Elige tu color", text: "Dorado o plateado, y la cantidad que quieras." },
      { title: "Confirma por teléfono", text: "Te llamamos para confirmar tu pedido y tu dirección." },
      { title: "Recibe y paga", text: "Pagas en efectivo cuando lo recibes." },
    ],
    specs: {
      "Material": "Aleación de zinc, acabado pulido brillante",
      "Colores": "Dorado o plateado",
      "Banda": "22.5 cm, abierta y ajustable",
      "Cadenas": "De 4.5 a 12.5 cm de largo",
    },
    faq: [
      { q: "¿Se adapta a cualquier brazo?", a: "Sí, la banda es abierta: la presionas suavemente para ajustarla a tu brazo." },
    ],
    reviews: [],
  },
  {
    id: "corrector-postura",
    sku: "sfy20",
    name: "Corrector de Postura Ajustable",
    short: "Mantiene tus hombros hacia atrás y tu espalda recta",
    category: "bienestar",
    price: 29,
    oldPrice: null,
    offers: [
      { qty: 1, price: 29 },
      { qty: 2, price: 49, tag: "Más elegido" },
      { qty: 3, price: 69 },
    ],
    featured: true,
    bestSeller: true,
    badge: "Bienestar",
    images: ["../images/posture-1.jpg", "../images/posture-side.jpg", "../images/posture-straps.jpg", "../images/posture-adjust.jpg", "../images/posture-features.jpg", "../images/posture-fabric.jpg"],
    description: "Un corrector de espalda con correas cruzadas que mantiene tus hombros hacia atrás y te ayuda a sentarte y estar de pie con la espalda recta, en el trabajo, en casa o en movimiento.",
    hero: { title: "Párate derecho, todos los días.", text: "Ciérralo, ajústalo y siente tus hombros en su lugar." },
    benefits: [
      { icon: "user", title: "Mejor postura", text: "Las correas cruzadas llevan tus hombros hacia atrás." },
      { icon: "feather", title: "Discreto y ligero", text: "Lo bastante delgado para usarlo bajo la camisa." },
      { icon: "sliders", title: "Totalmente ajustable", text: "Para hombre y mujer, de talla S a XXL." },
      { icon: "wind", title: "Tela transpirable", text: "Tela suave y perforada, cómoda todo el día." },
    ],
    problem: { title: "Horas frente a la pantalla", text: "Trabajar sentado o mirar el celular durante horas encorva los hombros y la espalda." },
    solution: { title: "Un recordatorio constante", text: "Sus correas cruzadas sostienen tus hombros hacia atrás y mantienen recta la parte alta de la espalda mientras trabajas o caminas." },
    features: [
      { image: "../images/posture-howto.jpg", title: "Fácil de poner", text: "Póntelo como una mochila, cruza las correas, cierra el cinturón con el velcro y ajusta. Toma menos de un minuto." },
      { image: "../images/posture-features.jpg", title: "Diseño inteligente", text: "La cinta elástica tejida de la espalda sigue tus movimientos y la tela transpirable te mantiene cómodo todo el día." },
      { image: "../images/posture-fabric.jpg", title: "Suave y resistente", text: "Tela suave perforada, placa de soporte en la espalda y un velcro fuerte que ajustas a tu gusto." },
    ],
    howItWorks: [
      { title: "Póntelo como una mochila", text: "Pasa los brazos por las correas." },
      { title: "Cruza y cierra", text: "Cierra el cinturón con el velcro a la altura de la cintura." },
      { title: "Ajusta", text: "Tira de las correas laterales hasta sentirte cómodo. Empieza con 20 minutos al día." },
    ],
    specs: {
      "Tallas": "Ajustable de S a XXL (cintura de 24 a 46 pulgadas)",
      "Medidas": "46 cm de alto × 41 cm de ancho",
      "Material": "Tela perforada transpirable, cinta elástica, velcro",
      "Para": "Hombre y mujer",
    },
    faq: [
      { q: "¿Cuántas horas al día lo uso?", a: "Empieza con unos 20 minutos al día y aumenta el tiempo poco a poco." },
      { q: "¿Se nota bajo la ropa?", a: "Es delgado: puedes usarlo bajo una camisa en la oficina o en casa." },
    ],
    reviews: [],
  },
  {
    id: "spray-nano-auto",
    sku: "",
    name: "Spray Nano Reparador para Auto",
    short: "Brillo espejo y protección repelente al agua en minutos",
    category: "auto",
    price: 19,
    oldPrice: null,
    offers: [
      { qty: 1, price: 19 },
      { qty: 2, price: 35, tag: "Más elegido" },
      { qty: 3, price: 49 },
    ],
    featured: true,
    bestSeller: false,
    badge: "Nuevo",
    images: ["../images/car-nano-spray.jpg", "../images/cns-instant.webp", "../images/cns-benefits.webp", "../images/cns-water.webp", "../images/cns-shine.webp", "../images/cns-surfaces.webp"],
    description: "Rocía, pasa un paño y tu auto brilla como nuevo. Este recubrimiento nano disimula rayones finos y deja una capa repelente al agua que aleja la lluvia, el lodo y el polvo de la pintura.",
    hero: { title: "Brillo de agencia, en minutos.", text: "Rocía, limpia y maneja: tu auto se ve limpio y brillante otra vez." },
    benefits: [
      { icon: "drop", title: "Repele el agua", text: "La lluvia forma gotas y resbala como en una hoja de loto." },
      { icon: "sparkle", title: "Brillo espejo", text: "Sin cera ni pulidora: un rocío y un paño." },
      { icon: "shield", title: "Protege la pintura", text: "Contra el sol, el polvo, la suciedad y rayones ligeros." },
      { icon: "car", title: "Para todo el vehículo", text: "Pintura, vidrios, espejos, faros, cromados y llantas." },
    ],
    problem: { title: "Pintura opaca y llena de marcas", text: "El sol, la lluvia y el polvo apagan el color de tu auto y dejan marcas y rayones finos." },
    solution: { title: "Un recubrimiento nano en una botella", text: "Rocía y limpia con un paño: el brillo vuelve, las marcas finas se disimulan y la capa protectora repele el agua y el lodo." },
    features: [
      { image: "../images/cns-instant.webp", title: "Un rocío, un paño", text: "Sin máquina, sin pulir, sin taller. Funciona con el auto seco o mojado.", list: ["Recubrimiento instantáneo", "Úsalo en seco o en mojado", "Para todo tipo de vehículos"] },
      { image: "../images/cns-water.webp", title: "La lluvia y el lodo resbalan", text: "El agua forma gotas y se desliza. El lodo no se pega a la pintura: tu auto se mantiene limpio más tiempo." },
      { image: "../images/cns-surfaces.webp", title: "Para todo el vehículo", text: "Carrocería, vidrios, espejos, faros, cromados y llantas. Autos, motos y más.", list: ["Pintura, vidrios, espejos y faros", "Cromados y llantas", "Botella de 120 ml con atomizador"] },
    ],
    howItWorks: [
      { title: "Rocía", text: "Aplica el spray sobre la superficie, seca o mojada." },
      { title: "Limpia", text: "Pasa un paño de microfibra en movimientos circulares." },
      { title: "Disfruta", text: "Brillo espejo y una capa que repele el agua." },
    ],
    specs: {
      "Contenido": "120 ml, botella con atomizador",
      "Superficies": "Pintura, vidrio, espejos, faros, cromados, llantas",
      "Vehículos": "Autos, motos y más",
      "Uso": "En seco o en mojado",
    },
    faq: [
      { q: "¿Daña la pintura?", a: "No, es apto para todo tipo de pintura automotriz." },
      { q: "¿Elimina rayones profundos?", a: "No. Disimula marcas y rayones finos; los rayones profundos necesitan un taller." },
    ],
    reviews: [],
  },
  {
    id: "leggings-sauna",
    sku: "os4-39",
    name: "Leggings Sauna Sculpt",
    short: "Tiro alto con capa térmica interior: sudas más al moverte",
    category: "deporte",
    price: 38,
    oldPrice: null,
    offers: [
      { qty: 1, price: 38 },
      { qty: 2, price: 69, tag: "Más elegido" },
      { qty: 3, price: 95 },
    ],
    featured: false,
    bestSeller: true,
    badge: "Nuevo",
    options: [{ name: "Talla", values: ["M", "L", "XL", "2XL"] }],
    images: ["../images/sauna-1.jpg", "../images/sauna-shape.jpg", "../images/sauna-features.jpg", "../images/sauna-sweat.jpg", "../images/sauna-sports.jpg"],
    description: "Leggings de tiro alto con una capa plateada interior que retiene el calor: sudas más cuando te mueves, y la tela firme moldea tu cintura, muslos y caderas.",
    hero: { title: "Calienta, suda más.", text: "Póntelos para entrenar o caminar y siente el calor desde el primer minuto." },
    benefits: [
      { icon: "flame", title: "Efecto sauna", text: "La capa plateada interior retiene el calor del cuerpo." },
      { icon: "user", title: "Silueta moldeada", text: "Sostiene el abdomen, alisa los muslos y levanta las caderas." },
      { icon: "sliders", title: "Ganchos ajustables", text: "Tiro alto que se ajusta y no se enrolla." },
      { icon: "heart", title: "Para todo deporte", text: "Yoga, correr, gimnasio, bicicleta o caminar." },
    ],
    problem: { title: "Entrenas y no ves resultados", text: "Caminar o hacer ejercicio sin sudar lo suficiente puede ser desmotivador." },
    solution: { title: "Calor desde el primer minuto", text: "La capa interior retiene el calor para que sudes más en cada entrenamiento, mientras la tela firme moldea tu figura." },
    features: [
      { image: "../images/sauna-sweat.jpg", title: "Suda más en cada entrenamiento", text: "La capa plateada interior retiene el calor. Por fuera son negros: nadie ve la capa plateada.", list: ["Capa térmica plateada interior", "Sientes el calor en minutos", "Negros por fuera"] },
      { image: "../images/sauna-features.jpg", title: "Ganchos ajustables, tiro alto", text: "Cierra los ganchos al nivel que te resulte cómodo. El tiro alto sostiene el abdomen y no se mueve." },
      { image: "../images/sauna-shape.jpg", title: "Una figura más definida", text: "La tela firme abraza tu cintura, muslos y caderas desde el momento en que te los pones." },
    ],
    howItWorks: [
      { title: "Elige tu talla", text: "De M a 2XL, y la cantidad que quieras." },
      { title: "Confirma por teléfono", text: "Te llamamos para confirmar tu pedido y tu dirección." },
      { title: "Recibe y paga", text: "Pagas en efectivo cuando los recibes." },
    ],
    specs: {
      "Tallas": "M, L, XL, 2XL",
      "Interior": "Capa plateada que retiene el calor",
      "Cintura": "Tiro alto con ganchos ajustables",
      "Tela": "Ultra elástica",
      "Color": "Negro",
    },
    faq: [
      { q: "¿Qué talla elijo?", a: "Elige tu talla habitual. Si dudas, escríbenos por WhatsApp o dínoslo cuando te llamemos para confirmar." },
    ],
    reviews: [],
  },
];
