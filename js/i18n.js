/* ==========================================================
   Languages: Swahili (default) and English.
   - The site is written in English; SW below gives the Swahili for each text.
     A text missing from SW simply stays in English.
   - The visitor switches with the SW / EN buttons in the header (choice remembered).
   - Ad links can force a language: product?id=reward-watch&lang=en
   - In the HTML, an element with data-sw="..." gets that Swahili HTML instead
     (for sentences whose word order changes around <strong> etc.).
   - In JavaScript, T("English text") returns the text in the current language;
     {name} parts are filled in: T("Save {amount}", { amount: "TSh 1,000" }).
   ========================================================== */
const SW = {
  /* ---------- Header, footer, shared ---------- */
  "Language": "Lugha",
  "Why order from us": "Kwa nini uagize kwetu",
  "Duka Bora home": "Duka Bora mwanzo",
  "Quality you can trust": "Ubora unaoweza kuuamini",
  "Shop": "Bidhaa",
  "Products": "Bidhaa",
  "Home": "Mwanzo",
  "How it works": "Jinsi inavyofanya kazi",
  "Why us": "Kwa nini sisi",
  "Delivery": "Usafirishaji",
  "FAQ": "Maswali",
  "Shop now": "Nunua sasa",
  "Help": "Msaada",
  "Contact": "Mawasiliano",
  "🕗 7 days, 8:00 – 20:00": "🕗 Siku 7, saa 2 asubuhi – saa 2 usiku",
  "💵 Pay on delivery · 🚚 Free shipping": "💵 Lipa ukipokea · 🚚 Usafirishaji bure",
  "Pay on delivery": "Lipa ukipokea",
  "Chat with us on WhatsApp": "Ongea nasi WhatsApp",
  "Order now": "Agiza sasa",
  "Order now · Pay on delivery": "Agiza sasa · Lipa ukipokea",
  "Order now · {price}": "Agiza sasa · {price}",
  "Questions": "Maswali",

  /* ---------- Trust bars ---------- */
  "🚚 Free delivery across Tanzania · Usafirishaji bure": "🚚 Usafirishaji bure Tanzania nzima",
  "💵 Pay on delivery · Lipa ukipokea": "💵 Lipa ukipokea mzigo",
  "📞 We call to confirm every order": "📞 Tunakupigia kuthibitisha kila oda",
  "🔄 30-day replacement": "🔄 Kubadilishiwa ndani ya siku 30",
  "💬 WhatsApp support 7 days a week": "💬 Msaada wa WhatsApp siku 7 kwa wiki",
  "🚚 Fast delivery nationwide": "🚚 Usafirishaji wa haraka nchi nzima",
  "💵 Pay on delivery": "💵 Lipa ukipokea",
  "📞 Phone confirmation before shipping": "📞 Tunakupigia kuthibitisha kabla ya kutuma",
  "🔒 Simple & secure ordering": "🔒 Kuagiza ni rahisi na salama",
  "⭐ Trusted, reliable store": "⭐ Duka la kuaminika",

  /* ---------- Home page ---------- */
  "Duka Bora · Fast Delivery Across Tanzania · Pay on Delivery": "Duka Bora · Usafirishaji wa Haraka Tanzania Nzima · Lipa Ukipokea",
  "Karibu · Delivering all over Tanzania": "Karibu · Tunasafirisha Tanzania nzima",
  "Your order first.": "Pokea oda yako kwanza.",
  "Pay later.": "Lipa baadaye.",
  "Quality products delivered free to your door. Check your order, then pay the agent in cash. No card, no risk.":
    "Bidhaa bora zinazoletwa bure hadi mlangoni kwako. Kagua oda yako, kisha mlipe wakala pesa taslimu. Hakuna kadi, hakuna hatari.",
  "Shop the collection →": "Tazama bidhaa →",
  "✓ Free delivery": "✓ Usafirishaji bure",
  "✓ 30-day replacement": "✓ Kubadilishiwa ndani ya siku 30",
  "We deliver across Tanzania": "Tunasafirisha Tanzania nzima",
  "Delivery map of Tanzania: Dar es Salaam same or next day; Arusha, Dodoma, Mwanza and Mbeya 1–3 days; Zanzibar 2–3 days; Kigoma and Mtwara 3–7 days":
    "Ramani ya usafirishaji Tanzania: Dar es Salaam siku hiyo hiyo au kesho; Arusha, Dodoma, Mwanza na Mbeya siku 1–3; Zanzibar siku 2–3; Kigoma na Mtwara siku 3–7",
  "INDIAN OCEAN": "BAHARI YA HINDI",
  "Same / next day": "Leo / kesho",
  "1–3 days": "Siku 1–3",
  "2–3 days": "Siku 2–3",
  "3–7 days": "Siku 3–7",
  "Dar: same / next day": "Dar: leo / kesho",
  "Big cities: 1–3 days": "Miji mikubwa: siku 1–3",
  "Other regions: 3–7 days": "Mikoa mingine: siku 3–7",
  "🚚 Free delivery": "🚚 Usafirishaji bure",
  "to pay now": "kulipa sasa",
  "delivery to big cities": "kufika miji mikubwa",
  "FREE": "BURE",
  "delivery to your door": "hadi mlangoni kwako",
  "WhatsApp support": "Msaada wa WhatsApp",
  "Our collection": "Bidhaa zetu",
  "Chosen for quality.": "Zimechaguliwa kwa ubora.",
  "Priced for you.": "Kwa bei inayokufaa.",
  "Simple & safe": "Rahisi na salama",
  "How ordering works": "Jinsi ya kuagiza",
  "Order online": "Agiza mtandaoni",
  "Choose your product and leave your name, phone and address.": "Chagua bidhaa yako, kisha andika jina, namba ya simu na anwani.",
  "⏱ 1 minute": "⏱ Dakika 1",
  "We call you": "Tunakupigia simu",
  "Our team calls to confirm your address and delivery time.": "Timu yetu inakupigia kuthibitisha anwani yako na muda wa kukuletea.",
  "📞 Keep your phone ON": "📞 Washa simu yako",
  "We check & pack": "Tunakagua na kufunga",
  "Every order is checked and packed carefully before it leaves.": "Kila oda inakaguliwa na kufungwa kwa uangalifu kabla ya kutumwa.",
  "📦 Checked by hand": "📦 Imekaguliwa kwa mkono",
  "Free delivery": "Usafirishaji bure",
  "The agent brings the parcel to your door, anywhere in Tanzania.": "Wakala analeta mzigo hadi mlangoni kwako, popote Tanzania.",
  "🚚 TSh 0 delivery": "🚚 Usafirishaji TSh 0",
  "Check, then pay": "Kagua, kisha ulipe",
  "Open your order, check it, and pay the agent in cash.": "Fungua oda yako, ikague, kisha mlipe wakala pesa taslimu.",
  "💵 TSh 0 upfront": "💵 TSh 0 kabla",
  "Why Duka Bora": "Kwa nini Duka Bora",
  "Shopping online,": "Nunua mtandaoni,",
  "without the fear.": "bila wasiwasi.",
  "Trust": "Uaminifu",
  "Quality": "Ubora",
  "Service": "Huduma",
  // The small words next to them were already in Swahili: show the English instead
  "· Uaminifu": "· Trust",
  "· Ubora": "· Quality",
  "· Huduma": "· Service",
  "You never pay before you see your order. Cash on delivery, always.": "Hulipi kamwe kabla ya kuona oda yako. Unalipa ukipokea, kila mara.",
  "We choose every product carefully and check each order before shipping.": "Tunachagua kila bidhaa kwa uangalifu na kukagua kila oda kabla ya kuituma.",
  "A real person calls you, and we answer on WhatsApp 7 days a week.": "Mtu halisi anakupigia simu, na tunajibu WhatsApp siku 7 kwa wiki.",
  "Typical online shop": "Duka la kawaida la mtandaoni",
  "When you pay": "Unalipa lini",
  "✗ Before delivery": "✗ Kabla ya kupokea",
  "✓ When it arrives": "✓ Ukipokea",
  "Delivery fee": "Gharama ya usafirishaji",
  "✗ Extra cost": "✗ Gharama ya ziada",
  "✓ Free": "✓ Bure",
  "Check before paying": "Kukagua kabla ya kulipa",
  "✗ No": "✗ Hapana",
  "✓ Yes": "✓ Ndiyo",
  "Problem with product": "Bidhaa ikiwa na tatizo",
  "✗ Hard to solve": "✗ Vigumu kutatua",
  "✓ 30-day replacement": "✓ Kubadilishiwa ndani ya siku 30",
  "Support": "Msaada",
  "✗ Hard to reach": "✗ Vigumu kuwapata",
  "✓ Call & WhatsApp": "✓ Simu na WhatsApp",
  "Example of an order confirmation on WhatsApp": "Mfano wa uthibitisho wa oda kwenye WhatsApp",
  "online": "mtandaoni",
  "Example": "Mfano",
  "Habari Juma! 👋 We received your order. Our agent will call you today to confirm your address.":
    "Habari Juma! 👋 Tumepokea oda yako. Wakala wetu atakupigia leo kuthibitisha anwani yako.",
  "Asante! Can I check it before I pay?": "Asante! Naweza kuikagua kabla ya kulipa?",
  "Yes ✅ You open it, check it, then pay the agent in cash. Delivery is free.":
    "Ndiyo ✅ Unaifungua, unaikagua, kisha unamlipa wakala pesa taslimu. Usafirishaji ni bure.",
  "Perfect 🙏": "Safi sana 🙏",
  "💬 Chat with us on WhatsApp": "💬 Ongea nasi WhatsApp",
  "We come to you.": "Tunakuja kwako.",
  "Everywhere in Tanzania.": "Kila mahali Tanzania.",
  "+ all other regions": "+ mikoa mingine yote",
  "For a fast delivery:": "Ili upokee haraka:",
  "Keep your phone ON after you order": "Washa simu yako baada ya kuagiza",
  "Answer our call to confirm": "Pokea simu yetu ili kuthibitisha",
  "Give a clear landmark near your home": "Taja alama inayojulikana karibu na nyumbani kwako",
  "risk-free": "bila hatari",
  "See it. Check it.": "Ione. Ikague.",
  "Then pay.": "Kisha lipa.",
  "If your product is not as described, contact us within 30 days and we replace it or make it right. No hassle.":
    "Kama bidhaa yako si kama ilivyoelezwa, wasiliana nasi ndani ya siku 30 na tutaibadilisha au kulitatua. Bila usumbufu.",
  "Choose my product →": "Chagua bidhaa yangu →",
  "Frequently asked questions": "Maswali yanayoulizwa mara kwa mara",
  "Ready to order?": "Uko tayari kuagiza?",
  "Free delivery · Lipa ukipokea · We call to confirm": "Usafirishaji bure · Lipa ukipokea · Tunakupigia kuthibitisha",
  "Order now →": "Agiza sasa →",
  "Quality products delivered to your door across Tanzania. You pay only when your order arrives.":
    "Bidhaa bora zinazoletwa hadi mlangoni kwako kote Tanzania. Unalipa tu oda yako inapofika.",
  "✦ New products are coming soon. Check back shortly!": "✦ Bidhaa mpya zinakuja hivi karibuni. Rudi tena baadaye!",
  "2 for {price}": "2 kwa {price}",
  "🔥 Buy 2, save {price}": "🔥 Nunua 2, okoa {price}",

  /* ---------- FAQ ---------- */
  "What payment methods do you accept?": "Mnapokea njia gani za malipo?",
  "We offer Cash on Delivery (COD) only. You pay in cash when your order is delivered to your doorstep.":
    "Tunapokea malipo ukipokea mzigo (COD) pekee. Unalipa pesa taslimu oda yako inapofika mlangoni kwako.",
  "Can I check my order before paying?": "Naweza kukagua oda yangu kabla ya kulipa?",
  "Yes. When the agent arrives, you open your parcel and check it. You pay only after that.":
    "Ndiyo. Wakala akifika, unafungua mzigo wako na kuukagua. Unalipa baada ya hapo tu.",
  "How long does delivery take?": "Usafirishaji unachukua muda gani?",
  "Major cities: 1–3 business days. Other areas: 3–7 days. We call or message you before delivery.":
    "Miji mikubwa: siku 1–3 za kazi. Maeneo mengine: siku 3–7. Tunakupigia au kukutumia ujumbe kabla ya kukuletea.",
  "Is shipping free?": "Je, usafirishaji ni bure?",
  "Yes — standard delivery is free on Duka Bora orders. You only pay the product price in cash at your door.":
    "Ndiyo — usafirishaji ni bure kwa oda zote za Duka Bora. Unalipa bei ya bidhaa tu, pesa taslimu mlangoni kwako.",
  "What if I am not available at delivery time?": "Itakuwaje kama sipo wakati wa kuletewa?",
  "Our agent will try to reach you by phone or WhatsApp to reschedule. You can also contact us anytime to arrange a new time.":
    "Wakala wetu atakutafuta kwa simu au WhatsApp ili kupanga muda mwingine. Unaweza pia kuwasiliana nasi wakati wowote kupanga muda mpya.",
  "What if there is a problem with my product?": "Itakuwaje kama bidhaa yangu ina tatizo?",
  "Contact us within 30 days. If something is wrong or not as described, we will replace it or make it right — no hassle.":
    "Wasiliana nasi ndani ya siku 30. Kama kuna tatizo au si kama ilivyoelezwa, tutaibadilisha au kulitatua — bila usumbufu.",

  /* ---------- Product page ---------- */
  "Previous photo": "Picha iliyotangulia",
  "Next photo": "Picha inayofuata",
  "Photo {n}": "Picha {n}",
  "Selling fast – limited stock at this price": "Inauzwa haraka – idadi ni ndogo kwa bei hii",
  "📞 We call to confirm": "📞 Tunakupigia kuthibitisha",
  "1. Choose your offer": "1. Chagua ofa yako",
  "Choose your offer": "Chagua ofa yako",
  "✓ Delivery FREE": "✓ Usafirishaji BURE",
  "2. Your delivery details": "2. Taarifa za kukuletea",
  "Full name": "Jina kamili",
  "e.g. Juma Hassan": "mf. Juma Hassan",
  "Phone number": "Namba ya simu",
  "Use a number you can answer. We'll call to confirm.": "Tumia namba unayopokea. Tutakupigia kuthibitisha.",
  "City & delivery address": "Mji na anwani ya kukuletea",
  "e.g. Dar es Salaam, Kinondoni, Mikocheni B": "mf. Dar es Salaam, Kinondoni, Mikocheni B",
  "💵 Pay cash when you receive it ·": "💵 Lipa pesa taslimu ukipokea ·",
  "TSh 0 now": "TSh 0 sasa",
  "Secure checkout": "Kuagiza kwa usalama",
  "📞 Phone confirmation": "📞 Uthibitisho kwa simu",
  "🚚 1–3 day delivery": "🚚 Inafika ndani ya siku 1–3",
  "✓ Free shipping": "✓ Usafirishaji bure",
  "100% risk-free": "100% bila hatari",
  "Still thinking?": "Bado unafikiria?",
  "Order now and pay only when it arrives at your door.": "Agiza sasa na ulipe tu ikifika mlangoni kwako.",
  "📞 We call": "📞 Tunakupigia",
  "to confirm": "kuthibitisha",
  "💬 Order on WhatsApp": "💬 Agiza kwa WhatsApp",
  "Back to shop": "Rudi dukani",
  "Real photos": "Picha halisi",
  "✅ Open and check your order before you pay": "✅ Fungua na ukague oda yako kabla ya kulipa",
  "🔒 No payment now": "🔒 Hakuna malipo sasa",
  "🎁 Gift box included": "🎁 Inakuja na boksi la zawadi",
  "What you": "Unachokipokea",
  "receive": "hasa",
  "Photos of the real product, taken in our stock before delivery. What you see is what you receive.":
    "Picha za bidhaa halisi, zimepigwa kwenye stoo yetu kabla ya kusafirishwa. Unachokiona ndicho utakachopokea.",
  "Save {amount}": "Okoa {amount}",
  "{price} each": "{price} kila moja",
  "Perfect for you": "Inakufaa wewe",
  "{n} piece": "Kipande {n}",
  "{n} pieces": "Vipande {n}",
  "You save": "Unaokoa",
  "Total to pay on delivery": "Jumla ya kulipa ukipokea",
  "Sending your order…": "Tunatuma oda yako…",
  "We couldn't send your order. Please check your internet connection and try again.":
    "Hatukuweza kutuma oda yako. Tafadhali angalia intaneti yako kisha ujaribu tena.",
  "Select your region": "Chagua mkoa wako",
  "Please enter your full name.": "Tafadhali andika jina lako kamili.",
  "Enter a valid Tanzanian number, e.g. 712 345 678.": "Andika namba sahihi ya Tanzania, mf. 712 345 678.",
  "Please choose your region.": "Tafadhali chagua mkoa wako.",
  "Please enter your city and delivery address.": "Tafadhali andika mji na anwani ya kukuletea.",

  /* ---------- Thank-you page ---------- */
  "Order confirmed · Duka Bora": "Oda imethibitishwa · Duka Bora",
  "Asante sana · Order confirmed": "Asante sana · Oda imethibitishwa",
  "Thank you!": "Asante!",
  "Asante, {name}!": "Asante, {name}!",
  "Your order is confirmed.": "Oda yako imethibitishwa.",
  "Great choice. Your order is in good hands. We'll call you soon, then bring it to your door. You pay only when it arrives.":
    "Chaguo zuri. Oda yako iko mikononi salama. Tutakupigia hivi karibuni, kisha tutakuletea hadi mlangoni. Unalipa tu ikifika.",
  "Order number": "Namba ya oda",
  "Order date": "Tarehe ya oda",
  "Estimated delivery": "Itafika takriban",
  "Please answer our call": "Tafadhali pokea simu yetu",
  "Our team will call": "Timu yetu itapiga",
  "your phone": "simu yako",
  "in the next few hours to confirm your address. We ship your order only after this call, so keep your phone ON.":
    "ndani ya saa chache zijazo kuthibitisha anwani yako. Tunatuma oda yako baada ya simu hii tu, kwa hiyo washa simu yako.",
  "Order summary": "Muhtasari wa oda",
  "Deliver to": "Mpokeaji",
  "Payment": "Malipo",
  "💵 Cash on delivery": "💵 Pesa taslimu ukipokea",
  "What happens next": "Kinachofuata",
  "Order received": "Oda imepokelewa",
  "We have your order. Nothing to pay now.": "Tumepokea oda yako. Hakuna cha kulipa sasa.",
  "· next": "· inayofuata",
  "A short call to confirm your address and delivery time.": "Simu fupi kuthibitisha anwani yako na muda wa kukuletea.",
  "Packed & on the way": "Imefungwa na iko njiani",
  "Your order is checked, packed and sent with our delivery agent.": "Oda yako inakaguliwa, inafungwa na kutumwa na wakala wetu.",
  "Open your parcel, check it, and pay the agent in cash.": "Fungua mzigo wako, ukague, kisha mlipe wakala pesa taslimu.",
  "Add to your order": "Ongeza kwenye oda yako",
  "Make it a": "Fanya mzigo wako",
  "bigger delivery.": "kuwa mkubwa zaidi.",
  "Same free delivery, same cash payment. Tell us on WhatsApp or during our call, and we add it to your order.":
    "Usafirishaji bure ule ule, malipo ya pesa taslimu yale yale. Tuambie WhatsApp au tukikupigia, na tutaiongeza kwenye oda yako.",
  "Know someone who'd love this?": "Unamjua mtu atakayependa hii?",
  "Share Duka Bora with a friend or family member. Free delivery and they pay only when it arrives.":
    "Mtumie rafiki au ndugu Duka Bora. Usafirishaji ni bure na analipa tu ikifika.",
  "💬 Share on WhatsApp": "💬 Shiriki kwenye WhatsApp",
  "Questions about your order?": "Una maswali kuhusu oda yako?",
  "💬 WhatsApp us": "💬 Tuandikie WhatsApp",
  "7 days a week, 8:00 – 20:00 ·": "Siku 7 kwa wiki, saa 2 asubuhi – saa 2 usiku ·",
  "Continue shopping →": "Endelea kununua →",
  "{n} pieces · {price} each": "Vipande {n} · {price} kila moja",
  "{n} piece · {price} each": "Kipande {n} · {price} kila moja",
  "Subtotal": "Jumla ndogo",
  "Bundle discount": "Punguzo la ofa",
  "Prepare {price} in cash": "Andaa {price} pesa taslimu",
  "Make it {n} pieces for {price} in total: only <b>{extra}</b> more.": "Fanya vipande {n} kwa jumla ya {price}: ongeza <b>{extra}</b> tu.",
  "💬 Add it on WhatsApp": "💬 Ongeza kwa WhatsApp",
  "{price} · delivered together with your order.": "{price} · inaletwa pamoja na oda yako.",
  "I just ordered from Duka Bora 🇹🇿 Free delivery and you pay only when it arrives: {url}":
    "Nimeagiza kutoka Duka Bora 🇹🇿 Usafirishaji ni bure na unalipa tu ukipokea: {url}",

  /* ---------- Products (js/products.js) ---------- */
  "New": "Mpya",
  "Best value": "Bei bora zaidi",
  "Accessories": "Vifaa",
  "Car care": "Utunzaji wa gari",

  // Reward Watch
  "Elegant, durable watch with a premium finish. Perfect for everyday wear or as a gift.":
    "Saa maridadi na imara yenye umaliziaji wa hadhi ya juu. Inafaa kuvaa kila siku au kama zawadi.",
  "Your moment, defined.": "Wakati wako, kwa mtindo wako.",
  "A rose-gold chronograph that completes your look. At the office, in meetings or on your big day, people notice the details.":
    "Saa ya chronograph ya rangi ya rose-gold inayokamilisha muonekano wako. Ofisini, kwenye vikao au siku yako kubwa, watu huona kila undani.",
  "At the office and in business meetings": "Ofisini na kwenye vikao vya biashara",
  "At weddings, parties and special events": "Kwenye harusi, sherehe na matukio maalum",
  "As a gift that will be remembered": "Kama zawadi isiyosahaulika",
  "Strong glass, comfortable strap": "Kioo imara, mkanda mzuri kuvaa",
  "Hardened mineral glass resists scratches and stays crystal clear. The stainless steel and silicone strap is strong, light and comfortable all day.":
    "Kioo kigumu cha madini kinazuia mikwaruzo na kinabaki safi kabisa. Mkanda wa chuma kisichoshika kutu na silikoni ni imara, mwepesi na mzuri kuvaa siku nzima.",
  "Scratch-resistant mineral glass": "Kioo cha madini kisichokwaruzika kirahisi",
  "Stainless steel + soft silicone strap": "Mkanda wa chuma kisichoshika kutu + silikoni laini",
  "Working chronograph and date": "Chronograph inayofanya kazi na tarehe",
  "Made for everyday life": "Imetengenezwa kwa maisha ya kila siku",
  "From the café to the market, from Dar es Salaam to Dodoma: a watch that matches your jeans as well as your suit.":
    "Kutoka mgahawani hadi sokoni, kutoka Dar es Salaam hadi Dodoma: saa inayoendana na jinzi yako na suti yako pia.",
  "Upgrade your style today": "Boresha mtindo wako leo",
  "Premium design, water-resistant and a great gift for men. Order now: free delivery across Tanzania and you pay only when it arrives.":
    "Muundo wa hadhi ya juu, inastahimili maji na ni zawadi nzuri kwa wanaume. Agiza sasa: usafirishaji bure Tanzania nzima na unalipa tu ikifika.",
  "Premium luxury design": "Muundo wa kifahari",
  "Water-resistant": "Inastahimili maji",
  "Great gift for men": "Zawadi nzuri kwa wanaume",

  // Car Nano Repairing Spray
  "Spray, wipe, and your car shines like new. This nano coating cleans without water, hides fine scratches and leaves a water-repellent layer that keeps rain, mud and dust off the paint.":
    "Puliza, futa, na gari lako linang'aa kama jipya. Dawa hii ya nano inasafisha bila maji, inaficha mikwaruzo midogo na kuacha tabaka linalofukuza maji, ili mvua, matope na vumbi visishike kwenye rangi.",
  "See the difference in seconds": "Ona tofauti ndani ya sekunde",
  "Dull paint full of swirl marks? Spray, wipe, and the shine comes back. Fine scratches and marks become much less visible.":
    "Rangi imefifia na ina alama za mizunguko? Puliza, futa, na mng'ao unarudi. Mikwaruzo midogo na alama zinaonekana kidogo sana.",
  "Hides swirl marks and fine scratches": "Inaficha alama za mizunguko na mikwaruzo midogo",
  "Brings back the deep colour of the paint": "Inarudisha rangi halisi ya gari",
  "Results you see straight away": "Matokeo unayaona papo hapo",
  "One spray, one wipe": "Puliza mara moja, futa mara moja",
  "No machine, no polishing, no garage. Spray it on your car, wipe with a cloth, and enjoy a mirror-like shine. It works on a dry or a wet car.":
    "Hakuna mashine, hakuna kung'arisha, hakuna gereji. Puliza kwenye gari lako, futa kwa kitambaa, na ufurahie mng'ao kama kioo. Inafanya kazi gari likiwa kavu au lina maji.",
  "Instant coating, mirror-like shine": "Ulinzi wa papo hapo, mng'ao kama kioo",
  "Use on a dry or wet car": "Tumia gari likiwa kavu au lina maji",
  "Suitable for all vehicles": "Inafaa kwa magari yote",
  "6 protections in one bottle": "Kinga 6 katika chupa moja",
  "A nano coating that protects your paint every day, in the sun, the rain and the dust of the road.":
    "Tabaka la nano linalolinda rangi ya gari lako kila siku, kwenye jua, mvua na vumbi la barabarani.",
  "Water-repellent like a lotus leaf": "Inafukuza maji kama jani la yungiyungi",
  "Mirror-like gloss": "Mng'ao kama kioo",
  "Protects against dirt and bird droppings": "Inalinda dhidi ya uchafu na kinyesi cha ndege",
  "Helps against small scratches": "Inasaidia dhidi ya mikwaruzo midogo",
  "Resists strong sun": "Inastahimili jua kali",
  "Safe for all car paints": "Salama kwa rangi zote za magari",
  "Rain and mud slide off": "Mvua na matope vinateleza",
  "Like water on a lotus leaf, rain forms drops and runs off the car. Muddy water doesn't stick to the paint, so your car stays clean longer and you wash it less often.":
    "Kama maji kwenye jani la yungiyungi, mvua inakuwa matone na kutiririka kutoka kwenye gari. Maji ya matope hayashiki kwenye rangi, kwa hiyo gari lako linabaki safi muda mrefu na unaliosha mara chache.",
  "Water forms beads and slides off": "Maji yanakuwa matone na kuteleza",
  "Mud and dirty water don't stick": "Matope na maji machafu hayashiki",
  "Less washing, more time for you": "Kuosha kidogo, muda zaidi kwako",
  "Mirror-like shine, no waxing": "Mng'ao kama kioo, bila wax",
  "Forget wax and long polishing. One spray and one wipe lock in the shine and leave the paint crystal-clear.":
    "Sahau wax na kung'arisha kwa muda mrefu. Puliza mara moja, futa mara moja: mng'ao unabaki na rangi inakuwa safi kabisa.",
  "A shield against small scratches": "Ngao dhidi ya mikwaruzo midogo",
  "The nano layer gives your paint extra protection against light scratches from branches, leaves and everyday use.":
    "Tabaka la nano linaipa rangi yako kinga ya ziada dhidi ya mikwaruzo midogo ya matawi, majani na matumizi ya kila siku.",
  "For the whole vehicle": "Kwa gari zima",
  "Use it on the body, glass, mirrors, headlights, chrome and tyres. Cars, motorcycles, bajaji and more: the shine comes back like new.":
    "Itumie kwenye bodi, vioo, side mirror, taa za mbele, chrome na matairi. Magari, pikipiki, bajaji na zaidi: mng'ao unarudi kama mpya.",
  "Paint, glass, mirrors and headlights": "Rangi, vioo, side mirror na taa za mbele",
  "Chrome and tyres": "Chrome na matairi",
  "Cars, motorcycles and bajaji": "Magari, pikipiki na bajaji",
  "120 ml bottle with spray trigger": "Chupa ya ml 120 yenye kipulizi",

  /* ---------- Country buttons ---------- */
  "Country": "Nchi",
  "Choose your country:": "Chagua nchi yako:",
};

/* ==========================================================
   Zambia (English only): the texts that talk about Tanzania or
   use Swahili words, and what to show instead.
   ========================================================== */
const ZM = {
  /* ---------- Shared ---------- */
  "🚚 Free delivery across Tanzania · Usafirishaji bure": "🚚 Free delivery across Zambia",
  "💵 Pay on delivery · Lipa ukipokea": "💵 Pay cash on delivery",
  "Duka Bora · Tanzania": "Duka Bora · Zambia",
  "Quality products delivered to your door across Tanzania. You pay only when your order arrives.":
    "Quality products delivered to your door across Zambia. You pay only when your order arrives.",

  /* ---------- Home page ---------- */
  "Duka Bora · Fast Delivery Across Tanzania · Pay on Delivery": "Duka Bora · Fast Delivery Across Zambia · Pay on Delivery",
  "Karibu · Delivering all over Tanzania": "Welcome · Delivering all over Zambia",
  "✓ Lipa ukipokea": "✓ Pay on delivery",
  "💵 Lipa ukipokea": "💵 Pay on delivery",
  "TSh 0": "KW 0",
  "The agent brings the parcel to your door, anywhere in Tanzania.": "The agent brings the parcel to your door, anywhere in Zambia.",
  "🚚 TSh 0 delivery": "🚚 KW 0 delivery",
  "💵 TSh 0 upfront": "💵 KW 0 upfront",
  "· Uaminifu": "",
  "· Ubora": "",
  "· Huduma": "",
  "Habari Juma! 👋 We received your order. Our agent will call you today to confirm your address.":
    "Hello Mwila! 👋 We received your order. Our agent will call you today to confirm your address.",
  "Asante! Can I check it before I pay?": "Thank you! Can I check it before I pay?",
  "Everywhere in Tanzania.": "Everywhere in Zambia.",
  "Free delivery · Lipa ukipokea · We call to confirm": "Free delivery · Pay on delivery · We call to confirm",

  /* ---------- Product page ---------- */
  "e.g. Juma Hassan": "e.g. Mwila Banda",
  "+255 7XX XXX XXX": "+260 9XX XXX XXX",
  "e.g. Dar es Salaam, Kinondoni, Mikocheni B": "e.g. Lusaka, Kabulonga, Leopards Hill Road",
  "TSh 0 now": "KW 0 now",
  "Enter a valid Tanzanian number, e.g. 712 345 678.": "Enter a valid Zambian number, e.g. 971 234 567.",

  /* ---------- Thank-you page ---------- */
  "Asante sana · Order confirmed": "Thank you · Order confirmed",
  "Asante, {name}!": "Thank you, {name}!",
  "I just ordered from Duka Bora 🇹🇿 Free delivery and you pay only when it arrives: {url}":
    "I just ordered from Duka Bora 🇿🇲 Free delivery and you pay only when it arrives: {url}",

  /* ---------- Products (js/products.js) ---------- */
  "From the café to the market, from Dar es Salaam to Dodoma: a watch that matches your jeans as well as your suit.":
    "From the café to the market, from Lusaka to Ndola: a watch that matches your jeans as well as your suit.",
  "Premium design, water-resistant and a great gift for men. Order now: free delivery across Tanzania and you pay only when it arrives.":
    "Premium design, water-resistant and a great gift for men. Order now: free delivery across Zambia and you pay only when it arrives.",
  "Use it on the body, glass, mirrors, headlights, chrome and tyres. Cars, motorcycles, bajaji and more: the shine comes back like new.":
    "Use it on the body, glass, mirrors, headlights, chrome and tyres. Cars, motorcycles, minibuses and more: the shine comes back like new.",
  "Cars, motorcycles and bajaji": "Cars, motorcycles and minibuses",
};

/* ==========================================================
   Lebanon (English only, prices in $): same idea as Zambia.
   ========================================================== */
const LB = {
  /* ---------- Shared ---------- */
  "🚚 Free delivery across Tanzania · Usafirishaji bure": "🚚 Free delivery across Lebanon",
  "💵 Pay on delivery · Lipa ukipokea": "💵 Pay cash on delivery",
  "Duka Bora · Tanzania": "Duka Bora · Lebanon",
  "Quality products delivered to your door across Tanzania. You pay only when your order arrives.":
    "Quality products delivered to your door across Lebanon. You pay only when your order arrives.",

  /* ---------- Home page ---------- */
  "Duka Bora · Fast Delivery Across Tanzania · Pay on Delivery": "Duka Bora · Fast Delivery Across Lebanon · Pay on Delivery",
  "Karibu · Delivering all over Tanzania": "Welcome · Delivering all over Lebanon",
  "✓ Lipa ukipokea": "✓ Pay on delivery",
  "💵 Lipa ukipokea": "💵 Pay on delivery",
  "TSh 0": "$0",
  "The agent brings the parcel to your door, anywhere in Tanzania.": "The agent brings the parcel to your door, anywhere in Lebanon.",
  "🚚 TSh 0 delivery": "🚚 $0 delivery",
  "💵 TSh 0 upfront": "💵 $0 upfront",
  "· Uaminifu": "",
  "· Ubora": "",
  "· Huduma": "",
  "Habari Juma! 👋 We received your order. Our agent will call you today to confirm your address.":
    "Hello Rami! 👋 We received your order. Our agent will call you today to confirm your address.",
  "Asante! Can I check it before I pay?": "Thank you! Can I check it before I pay?",
  "Everywhere in Tanzania.": "Everywhere in Lebanon.",
  "Free delivery · Lipa ukipokea · We call to confirm": "Free delivery · Pay on delivery · We call to confirm",
  "Major cities: 1–3 business days. Other areas: 3–7 days. We call or message you before delivery.":
    "Beirut: same or next day. Other areas: 1–3 days. We call or message you before delivery.",

  /* ---------- Product page ---------- */
  "e.g. Juma Hassan": "e.g. Rami Haddad",
  "+255 7XX XXX XXX": "+961 7X XXX XXX",
  "e.g. Dar es Salaam": "e.g. Beirut",
  "e.g. Kinondoni, Mikocheni B, near the market": "e.g. Achrafieh, Sassine Street, near the pharmacy",
  "TSh 0 now": "$0 now",
  "Enter a valid Tanzanian number, e.g. 712 345 678.": "Enter a valid Lebanese number, e.g. 71 234 567.",

  /* ---------- Thank-you page ---------- */
  "Asante sana · Order confirmed": "Thank you · Order confirmed",
  "Asante, {name}!": "Thank you, {name}!",
  "I just ordered from Duka Bora 🇹🇿 Free delivery and you pay only when it arrives: {url}":
    "I just ordered from Duka Bora 🇱🇧 Free delivery and you pay only when it arrives: {url}",

  /* ---------- Products (js/products.js) ---------- */
  "From the café to the market, from Dar es Salaam to Dodoma: a watch that matches your jeans as well as your suit.":
    "From the café to the souk, from Beirut to Tripoli: a watch that matches your jeans as well as your suit.",
  "Premium design, water-resistant and a great gift for men. Order now: free delivery across Tanzania and you pay only when it arrives.":
    "Premium design, water-resistant and a great gift for men. Order now: free delivery across Lebanon and you pay only when it arrives.",
  "Use it on the body, glass, mirrors, headlights, chrome and tyres. Cars, motorcycles, bajaji and more: the shine comes back like new.":
    "Use it on the body, glass, mirrors, headlights, chrome and tyres. Cars, motorcycles, vans and more: the shine comes back like new.",
  "Cars, motorcycles and bajaji": "Cars, motorcycles and vans",
};

/* ==========================================================
   El Salvador: Spanish (Latin American). Every English text of the site
   with its Spanish, already adapted to El Salvador (cities, currency $).
   A text missing here stays in English.
   ========================================================== */
const ES = {
  /* ---------- Header, footer, shared ---------- */
  "Language": "Idioma",
  "Why order from us": "Por qué comprar con nosotros",
  "Duka Bora home": "Duka Bora inicio",
  "Quality you can trust": "Calidad en la que puedes confiar",
  "Shop": "Tienda",
  "Products": "Productos",
  "Home": "Inicio",
  "How it works": "Cómo funciona",
  "Why us": "Por qué nosotros",
  "Delivery": "Envío",
  "FAQ": "Preguntas",
  "Shop now": "Comprar ahora",
  "Help": "Ayuda",
  "Contact": "Contacto",
  "🕗 7 days, 8:00 – 20:00": "🕗 7 días, 8:00 – 20:00",
  "💵 Pay on delivery · 🚚 Free shipping": "💵 Pago contra entrega · 🚚 Envío gratis",
  "Pay on delivery": "Pago contra entrega",
  "COD": "Pago al recibir",
  "Chat with us on WhatsApp": "Escríbenos por WhatsApp",
  "Order now": "Pedir ahora",
  "Order now · Pay on delivery": "Pedir ahora · Pago al recibir",
  "Order now · {price}": "Pedir ahora · {price}",
  "Questions": "Preguntas",
  "Duka Bora · Tanzania": "Duka Bora · El Salvador",
  "Hello Duka Bora, I want to order:": "Hola Duka Bora, quiero hacer un pedido:",
  "💬 WhatsApp": "💬 WhatsApp",

  /* ---------- Country choice ---------- */
  "Country": "País",
  "Choose your country:": "Elige tu país:",
  "Tanzania": "Tanzania",
  "Zambia": "Zambia",
  "Lebanon": "Líbano",
  "El Salvador": "El Salvador",
  "Where should we deliver?": "¿A dónde enviamos tu pedido?",
  "Choose your country to see prices in your currency.": "Elige tu país para ver los precios en tu moneda.",
  "Prices in TSh · Kiswahili & English": "Precios en TSh · Suajili e inglés",
  "Prices in Kwacha (KW) · English": "Precios en kwacha (KW) · Inglés",
  "Prices in US dollars ($) · English": "Precios en dólares ($) · Inglés",
  "Prices in US dollars ($) · Spanish": "Precios en dólares ($) · Español",
  "🚚 Free delivery · 💵 Pay on delivery": "🚚 Envío gratis · 💵 Pago contra entrega",

  /* ---------- Trust bars ---------- */
  "🚚 Free delivery across Tanzania · Usafirishaji bure": "🚚 Envío gratis a todo El Salvador",
  "💵 Pay on delivery · Lipa ukipokea": "💵 Pagas en efectivo al recibir",
  "📞 We call to confirm every order": "📞 Te llamamos para confirmar cada pedido",
  "🔄 30-day replacement": "🔄 Cambio en 30 días",
  "💬 WhatsApp support 7 days a week": "💬 Atención al cliente los 7 días",
  "🚚 Fast delivery nationwide": "🚚 Envío rápido a todo el país",
  "💵 Pay on delivery": "💵 Pago contra entrega",
  "📞 Phone confirmation before shipping": "📞 Confirmación por teléfono antes del envío",
  "🔒 Simple & secure ordering": "🔒 Pedido fácil y seguro",
  "⭐ Trusted, reliable store": "⭐ Tienda confiable",

  /* ---------- Home page ---------- */
  "Duka Bora · Fast Delivery Across Tanzania · Pay on Delivery": "Duka Bora · Envío rápido a todo El Salvador · Pago contra entrega",
  "Karibu · Delivering all over Tanzania": "Bienvenido · Enviamos a todo El Salvador",
  "Your order first.": "Primero tu pedido.",
  "Pay later.": "Después pagas.",
  "Quality products delivered free to your door. Check your order, then pay the agent in cash. No card, no risk.":
    "Productos de calidad con envío gratis hasta tu puerta. Revisa tu pedido y paga en efectivo al repartidor. Sin tarjeta, sin riesgo.",
  "Shop the collection →": "Ver la colección →",
  "✓ Free delivery": "✓ Envío gratis",
  "✓ Lipa ukipokea": "✓ Pago al recibir",
  "✓ 30-day replacement": "✓ Cambio en 30 días",
  "Welcome!": "¡Bienvenido!",
  "We deliver across El Salvador": "Enviamos a todo El Salvador",
  "PACIFIC OCEAN": "OCÉANO PACÍFICO",
  "Same / next day": "Hoy / mañana",
  "1–2 days": "1–2 días",
  "2–3 days": "2–3 días",
  "1–3 days": "1–3 días",
  "3–7 days": "3–7 días",
  "San Salvador: same / next day": "San Salvador: hoy / mañana",
  "Big cities: 1–2 days": "Ciudades grandes: 1–2 días",
  "Other areas: 2–3 days": "Otras zonas: 2–3 días",
  "💵 Lipa ukipokea": "💵 Pago al recibir",
  "🚚 Free delivery": "🚚 Envío gratis",
  "TSh 0": "$0",
  "to pay now": "a pagar ahora",
  "delivery to big cities": "envío a ciudades grandes",
  "FREE": "GRATIS",
  "delivery to your door": "envío hasta tu puerta",
  "7 / 7": "7 / 7",
  "WhatsApp support": "Atención al cliente",
  "Our collection": "Nuestra colección",
  "Chosen for quality.": "Elegidos por su calidad.",
  "Priced for you.": "Con precios para ti.",
  "Simple & safe": "Fácil y seguro",
  "How ordering works": "Cómo hacer tu pedido",
  "Order online": "Pide en línea",
  "Choose your product and leave your name, phone and address.": "Elige tu producto y déjanos tu nombre, teléfono y dirección.",
  "⏱ 1 minute": "⏱ 1 minuto",
  "We call you": "Te llamamos",
  "Our team calls to confirm your address and delivery time.": "Nuestro equipo te llama para confirmar tu dirección y la hora de entrega.",
  "📞 Keep your phone ON": "📞 Mantén tu teléfono encendido",
  "We check & pack": "Revisamos y empacamos",
  "Every order is checked and packed carefully before it leaves.": "Cada pedido se revisa y se empaca con cuidado antes de salir.",
  "📦 Checked by hand": "📦 Revisado a mano",
  "Free delivery": "Envío gratis",
  "The agent brings the parcel to your door, anywhere in Tanzania.": "El repartidor lleva el paquete hasta tu puerta, en cualquier lugar de El Salvador.",
  "🚚 TSh 0 delivery": "🚚 Envío $0",
  "Check, then pay": "Revisa y después paga",
  "Open your order, check it, and pay the agent in cash.": "Abre tu pedido, revísalo y paga en efectivo al repartidor.",
  "💵 TSh 0 upfront": "💵 $0 por adelantado",
  "Why Duka Bora": "Por qué Duka Bora",
  "Shopping online,": "Compra en línea,",
  "without the fear.": "sin miedo.",
  "Trust": "Confianza",
  "Quality": "Calidad",
  "Service": "Servicio",
  "· Uaminifu": "",
  "· Ubora": "",
  "· Huduma": "",
  "You never pay before you see your order. Cash on delivery, always.": "Nunca pagas antes de ver tu pedido. Siempre pago contra entrega.",
  "We choose every product carefully and check each order before shipping.": "Elegimos cada producto con cuidado y revisamos cada pedido antes de enviarlo.",
  "A real person calls you, and we answer on WhatsApp 7 days a week.": "Una persona real te llama para confirmar tu pedido, los 7 días de la semana.",
  "Typical online shop": "Tienda en línea típica",
  "When you pay": "Cuándo pagas",
  "✗ Before delivery": "✗ Antes de recibir",
  "✓ When it arrives": "✓ Cuando llega",
  "Delivery fee": "Costo de envío",
  "✗ Extra cost": "✗ Costo extra",
  "✓ Free": "✓ Gratis",
  "Check before paying": "Revisar antes de pagar",
  "✗ No": "✗ No",
  "✓ Yes": "✓ Sí",
  "Problem with product": "Problema con el producto",
  "✗ Hard to solve": "✗ Difícil de resolver",
  "✓ 30-day replacement": "✓ Cambio en 30 días",
  "Support": "Atención",
  "✗ Hard to reach": "✗ Difícil de contactar",
  "✓ Call & WhatsApp": "✓ Te llamamos",
  "Example of an order confirmation on WhatsApp": "Ejemplo de confirmación de pedido por WhatsApp",
  "online": "en línea",
  "Example": "Ejemplo",
  "Habari Juma! 👋 We received your order. Our agent will call you today to confirm your address.":
    "¡Hola Carlos! 👋 Recibimos tu pedido. Hoy te llamamos para confirmar tu dirección.",
  "Asante! Can I check it before I pay?": "¡Gracias! ¿Puedo revisarlo antes de pagar?",
  "Yes ✅ You open it, check it, then pay the agent in cash. Delivery is free.":
    "Sí ✅ Lo abres, lo revisas y después pagas en efectivo al repartidor. El envío es gratis.",
  "Perfect 🙏": "Perfecto 🙏",
  "💬 Chat with us on WhatsApp": "💬 Escríbenos por WhatsApp",
  "We come to you.": "Llegamos hasta ti.",
  "Everywhere in Tanzania.": "En todo El Salvador.",
  "+ all other areas": "+ todas las demás zonas",
  "+ all other regions": "+ todos los demás departamentos",
  "For a fast delivery:": "Para una entrega rápida:",
  "Keep your phone ON after you order": "Mantén tu teléfono encendido después de pedir",
  "Answer our call to confirm": "Contesta nuestra llamada para confirmar",
  "Give a clear landmark near your home": "Danos una referencia clara cerca de tu casa",
  "risk-free": "sin riesgo",
  "See it. Check it.": "Míralo. Revísalo.",
  "Then pay.": "Después paga.",
  "If your product is not as described, contact us within 30 days and we replace it or make it right. No hassle.":
    "Si tu producto no es como se describe, contáctanos dentro de 30 días y lo cambiamos o lo solucionamos. Sin complicaciones.",
  "Choose my product →": "Elegir mi producto →",
  "Frequently asked questions": "Preguntas frecuentes",
  "Ready to order?": "¿Listo para pedir?",
  "Free delivery · Lipa ukipokea · We call to confirm": "Envío gratis · Pago al recibir · Te llamamos para confirmar",
  "Order now →": "Pedir ahora →",
  "Quality products delivered to your door across Tanzania. You pay only when your order arrives.":
    "Productos de calidad hasta tu puerta en todo El Salvador. Pagas solo cuando llega tu pedido.",
  "✦ New products are coming soon. Check back shortly!": "✦ Pronto tendremos productos nuevos. ¡Vuelve pronto!",
  "2 for {price}": "2 por {price}",
  "🔥 Buy 2, save {price}": "🔥 Compra 2 y ahorra {price}",

  /* ---------- FAQ ---------- */
  "What payment methods do you accept?": "¿Qué formas de pago aceptan?",
  "We offer Cash on Delivery (COD) only. You pay in cash when your order is delivered to your doorstep.":
    "Solo pago contra entrega. Pagas en efectivo cuando tu pedido llega a tu puerta.",
  "Can I check my order before paying?": "¿Puedo revisar mi pedido antes de pagar?",
  "Yes. When the agent arrives, you open your parcel and check it. You pay only after that.":
    "Sí. Cuando llega el repartidor, abres tu paquete y lo revisas. Pagas solo después.",
  "How long does delivery take?": "¿Cuánto tarda el envío?",
  "Major cities: 1–3 business days. Other areas: 3–7 days. We call or message you before delivery.":
    "San Salvador: el mismo día o al día siguiente. Otras zonas: 1 a 3 días. Te llamamos o escribimos antes de la entrega.",
  "Is shipping free?": "¿El envío es gratis?",
  "Yes — standard delivery is free on Duka Bora orders. You only pay the product price in cash at your door.":
    "Sí, el envío es gratis en los pedidos de Duka Bora. Solo pagas el precio del producto en efectivo en tu puerta.",
  "What if I am not available at delivery time?": "¿Y si no estoy a la hora de la entrega?",
  "Our agent will try to reach you by phone or WhatsApp to reschedule. You can also contact us anytime to arrange a new time.":
    "El repartidor te contactará por teléfono o WhatsApp para acordar otra hora. También puedes escribirnos cuando quieras para cambiarla.",
  "What if there is a problem with my product?": "¿Y si mi producto tiene un problema?",
  "Contact us within 30 days. If something is wrong or not as described, we will replace it or make it right — no hassle.":
    "Contáctanos dentro de 30 días. Si algo está mal o no es como se describe, lo cambiamos o lo solucionamos, sin complicaciones.",

  /* ---------- Product page ---------- */
  "Product not found": "Producto no encontrado",
  "Previous photo": "Foto anterior",
  "Next photo": "Foto siguiente",
  "Photo {n}": "Foto {n}",
  "Selling fast – limited stock at this price": "Se vende rápido: pocas unidades a este precio",
  "✅ Open and check your order before you pay": "✅ Abre y revisa tu pedido antes de pagar",
  "📞 We call to confirm": "📞 Te llamamos para confirmar",
  "1. Choose your offer": "1. Elige tu oferta",
  "Choose your offer": "Elige tu oferta",
  "✓ Delivery FREE": "✓ Envío GRATIS",
  "2. Your delivery details": "2. Tus datos de entrega",
  "Full name": "Nombre y apellido",
  "e.g. Juma Hassan": "Ej.: María José Hernández",
  "Phone number": "Teléfono (WhatsApp)",
  "+255 7XX XXX XXX": "+503 7XXX XXXX",
  "Use a number you can answer. We'll call to confirm.": "Usa un número que contestes. Te llamaremos para confirmar.",
  "Region": "Departamento",
  "City": "Ciudad / Municipio",
  "Select your city": "Selecciona tu ciudad / municipio",
  "Choose your region first": "Primero elige el departamento",
  "e.g. Dar es Salaam": "Ej.: Santa Tecla",
  "Delivery address": "Dirección completa",
  "e.g. Kinondoni, Mikocheni B, near the market": "Dirección exacta y con número",
  "Landmark": "Punto de referencia",
  "e.g. opposite the church, black gate": "Ej.: frente a la iglesia, portón negro",
  "Please enter a landmark near your home.": "Danos un punto de referencia cerca de tu casa.",
  "City & delivery address": "Ciudad y dirección de entrega",
  "e.g. Dar es Salaam, Kinondoni, Mikocheni B": "Ej.: San Salvador, Col. Escalón, calle 3, casa 12",
  "💵 Pay cash when you receive it ·": "💵 Pagas en efectivo al recibir ·",
  "TSh 0 now": "$0 ahora",
  "Secure checkout": "Compra segura",
  "📞 Phone confirmation": "📞 Confirmación telefónica",
  "🚚 1–3 day delivery": "🚚 Entrega en 1–3 días",
  "✓ Free shipping": "✓ Envío gratis",
  "100% risk-free": "100% sin riesgo",
  "Still thinking?": "¿Todavía lo piensas?",
  "Order now and pay only when it arrives at your door.": "Pide ahora y paga solo cuando llegue a tu puerta.",
  "📞 We call": "📞 Te llamamos",
  "to confirm": "para confirmar",
  "Free": "Gratis",
  "delivery": "el envío",
  "30 days": "30 días",
  "replacement": "para cambios",
  "💬 Order on WhatsApp": "💬 Pedir por WhatsApp",
  "Back to shop": "Volver a la tienda",
  "Real photos": "Fotos reales",
  "🔒 No payment now": "🔒 No pagas nada ahora",
  "🎁 Gift box included": "🎁 Incluye estuche de regalo",
  "What you": "Lo que",
  "receive": "recibes",
  "Photos of the real product, taken in our stock before delivery. What you see is what you receive.":
    "Fotos del producto real, tomadas en nuestro almacén antes del envío. Lo que ves es lo que recibes.",
  "Save {amount}": "Ahorras {amount}",
  "{price} each": "{price} c/u",
  "Perfect for you": "Perfecto para ti",
  "{n} piece": "{n} unidad",
  "{n} pieces": "{n} unidades",
  "Piece {n}": "Unidad {n}",
  "You save": "Ahorras",
  "Total to pay on delivery": "Total a pagar al recibir",
  "Sending your order…": "Enviando tu pedido…",
  "We couldn't send your order. Please check your internet connection and try again.":
    "No pudimos enviar tu pedido. Revisa tu conexión a internet e inténtalo de nuevo.",
  "Select your region": "Selecciona tu departamento",
  "Please enter your full name.": "Escribe tu nombre completo.",
  "Enter a valid Tanzanian number, e.g. 712 345 678.": "Escribe un número válido de El Salvador, ej.: 7123 4567.",
  "Please choose your region.": "Selecciona tu departamento.",
  "Please enter your city.": "Selecciona tu ciudad / municipio.",
  "Please enter your delivery address.": "Escribe tu dirección exacta y con número.",
  "Please enter your city and delivery address.": "Escribe tu ciudad y dirección de entrega.",
  "Quality checked": "Calidad revisada",
  "30-day replacement": "Cambio en 30 días",
  "100% free delivery": "Envío 100% gratis",
  "Pay on delivery and quality guarantee": "Pago contra entrega y garantía de calidad",
  "Choose your size": "Elige tu talla",
  "Choose your color": "Elige tu color",
  "Please choose a size for each piece.": "Elige una talla para cada unidad.",
  "Please choose a color for each piece.": "Elige un color para cada unidad.",
  "📏 Size guide": "📏 Guía de tallas",
  "Size guide": "Guía de tallas",
  "In cm, measured flat. Between two sizes? Choose the bigger one.": "En cm, medido en plano. ¿Entre dos tallas? Elige la más grande.",

  "The problem": "El problema",
  "The solution": "La solución",
  "Why you'll love it": "Por qué te va a encantar",
  "Easy to use, in 3 steps": "Fácil de usar, en 3 pasos",
  "Specifications": "Especificaciones",
  "Ordered": "Pedido",
  "On its way": "En camino",
  "Delivered": "Entregado",
  "What's in the box": "Qué incluye",
  "Important": "Importante",
  "⚠️ Important ⚠️": "⚠️ Importante ⚠️",
  "Benefits": "Beneficios",
  "How does it work?": "¿Cómo funciona?",

  /* ---------- Thank-you page ---------- */
  "Order confirmed · Duka Bora": "Pedido confirmado · Duka Bora",
  "Asante sana · Order confirmed": "Muchas gracias · Pedido confirmado",
  "Thank you!": "¡Gracias!",
  "Asante, {name}!": "¡Gracias, {name}!",
  "Your order is confirmed.": "Tu pedido está confirmado.",
  "Great choice. Your order is in good hands. We'll call you soon, then bring it to your door. You pay only when it arrives.":
    "Excelente elección. Tu pedido está en buenas manos. Pronto te llamamos y luego lo llevamos a tu puerta. Pagas solo cuando llega.",
  "Order number": "Número de pedido",
  "Order date": "Fecha del pedido",
  "Estimated delivery": "Entrega estimada",
  "Please answer our call": "Por favor contesta nuestra llamada",
  "Our team will call": "Nuestro equipo llamará al",
  "your phone": "tu teléfono",
  "in the next few hours to confirm your address. We ship your order only after this call, so keep your phone ON.":
    "en las próximas horas para confirmar tu dirección. Enviamos tu pedido solo después de esta llamada, así que mantén tu teléfono encendido.",
  "Order summary": "Resumen del pedido",
  "Deliver to": "Entregar a",
  "Payment": "Pago",
  "💵 Cash on delivery": "💵 Efectivo al recibir",
  "What happens next": "Qué sigue",
  "Order received": "Pedido recibido",
  "We have your order. Nothing to pay now.": "Tenemos tu pedido. No pagas nada ahora.",
  "· next": "· siguiente",
  "A short call to confirm your address and delivery time.": "Una llamada corta para confirmar tu dirección y la hora de entrega.",
  "Packed & on the way": "Empacado y en camino",
  "Your order is checked, packed and sent with our delivery agent.": "Tu pedido se revisa, se empaca y sale con nuestro repartidor.",
  "Open your parcel, check it, and pay the agent in cash.": "Abre tu paquete, revísalo y paga en efectivo al repartidor.",
  "Add to your order": "Agrega a tu pedido",
  "Make it a": "Haz tu envío",
  "bigger delivery.": "más completo.",
  "Same free delivery, same cash payment. Tell us on WhatsApp or during our call, and we add it to your order.":
    "El mismo envío gratis, el mismo pago en efectivo. Dínoslo por WhatsApp o durante la llamada y lo agregamos a tu pedido.",
  "Know someone who'd love this?": "¿Conoces a alguien a quien le encantaría?",
  "Share Duka Bora with a friend or family member. Free delivery and they pay only when it arrives.":
    "Comparte Duka Bora con un amigo o familiar. Envío gratis y paga solo cuando le llega.",
  "💬 Share on WhatsApp": "💬 Compartir por WhatsApp",
  "Questions about your order?": "¿Preguntas sobre tu pedido?",
  "💬 WhatsApp us": "💬 Escríbenos por WhatsApp",
  "7 days a week, 8:00 – 20:00 ·": "7 días a la semana, 8:00 – 20:00 ·",
  "Continue shopping →": "Seguir comprando →",
  "{n} pieces · {price} each": "{n} unidades · {price} c/u",
  "{n} piece · {price} each": "{n} unidad · {price} c/u",
  "Subtotal": "Subtotal",
  "Bundle discount": "Descuento por paquete",
  "Prepare {price} in cash": "Ten listo {price} en efectivo",
  "Make it {n} pieces for {price} in total: only <b>{extra}</b> more.": "Llévate {n} unidades por {price} en total: solo <b>{extra}</b> más.",
  "💬 Add it on WhatsApp": "💬 Agregar por WhatsApp",
  "{price} · delivered together with your order.": "{price} · llega junto con tu pedido.",
  "I just ordered from Duka Bora 🇹🇿 Free delivery and you pay only when it arrives: {url}":
    "Acabo de pedir en Duka Bora 🇸🇻 Envío gratis y pagas solo cuando llega: {url}",

  /* ---------- Products (js/products.js) ---------- */
  "New": "Nuevo",
  "Best value": "Más elegido",
  "Accessories": "Accesorios",
  "Car care": "Cuidado del auto",
  "Fitness": "Deporte",
  "Health & comfort": "Salud y bienestar",
  "Jewelry": "Joyería",

  // Reward Watch
  "Elegant, durable watch with a premium finish. Perfect for everyday wear or as a gift.":
    "Reloj elegante y resistente con acabado premium. Perfecto para usar todos los días o para regalar.",
  "Your moment, defined.": "Tu momento, definido.",
  "A rose-gold chronograph that completes your look. At the office, in meetings or on your big day, people notice the details.":
    "Un cronógrafo en tono oro rosa que completa tu estilo. En la oficina, en reuniones o en tu gran día, la gente nota los detalles.",
  "At the office and in business meetings": "En la oficina y en reuniones de negocios",
  "At weddings, parties and special events": "En bodas, fiestas y eventos especiales",
  "As a gift that will be remembered": "Como un regalo que se recuerda",
  "Strong glass, comfortable strap": "Cristal fuerte, correa cómoda",
  "Hardened mineral glass resists scratches and stays crystal clear. The stainless steel and silicone strap is strong, light and comfortable all day.":
    "El cristal mineral endurecido resiste rayones y se mantiene claro. La correa de acero inoxidable y silicona es fuerte, ligera y cómoda todo el día.",
  "Scratch-resistant mineral glass": "Cristal mineral resistente a rayones",
  "Stainless steel + soft silicone strap": "Correa de acero inoxidable + silicona suave",
  "Working chronograph and date": "Cronógrafo y fecha funcionales",
  "Made for everyday life": "Hecho para tu día a día",
  "From the café to the market, from Dar es Salaam to Dodoma: a watch that matches your jeans as well as your suit.":
    "Del café al mercado, de San Salvador a San Miguel: un reloj que combina con tus jeans y también con tu traje.",
  "Upgrade your style today": "Mejora tu estilo hoy",
  "Premium design, water-resistant and a great gift for men. Order now: free delivery across Tanzania and you pay only when it arrives.":
    "Diseño premium, resistente al agua y un gran regalo para hombre. Pide ahora: envío gratis a todo El Salvador y pagas solo cuando llega.",
  "Premium luxury design": "Diseño de lujo premium",
  "Water-resistant": "Resistente al agua",
  "Great gift for men": "Gran regalo para hombre",
  "Wear your success.": "Lleva tu éxito.",
  "Every single day.": "Todos los días.",

  // Car Nano Repairing Spray
  "Spray, wipe, and your car shines like new. This nano coating cleans without water, hides fine scratches and leaves a water-repellent layer that keeps rain, mud and dust off the paint.":
    "Rocía, limpia y tu auto brilla como nuevo. Este recubrimiento nano limpia sin agua, disimula rayones finos y deja una capa repelente al agua que aleja la lluvia, el lodo y el polvo de la pintura.",
  "See the difference in seconds": "Mira la diferencia en segundos",
  "Dull paint full of swirl marks? Spray, wipe, and the shine comes back. Fine scratches and marks become much less visible.":
    "¿Pintura opaca y llena de marcas? Rocía, limpia y el brillo regresa. Los rayones finos y las marcas se notan mucho menos.",
  "Hides swirl marks and fine scratches": "Disimula marcas y rayones finos",
  "Brings back the deep colour of the paint": "Devuelve el color intenso de la pintura",
  "Results you see straight away": "Resultados que ves al instante",
  "One spray, one wipe": "Un rocío, una pasada",
  "No machine, no polishing, no garage. Spray it on your car, wipe with a cloth, and enjoy a mirror-like shine. It works on a dry or a wet car.":
    "Sin máquina, sin pulir, sin taller. Rocíalo en tu auto, pasa un paño y disfruta un brillo espejo. Funciona con el auto seco o mojado.",
  "Instant coating, mirror-like shine": "Recubrimiento instantáneo, brillo espejo",
  "Use on a dry or wet car": "Úsalo con el auto seco o mojado",
  "Suitable for all vehicles": "Para todo tipo de vehículos",
  "6 protections in one bottle": "6 protecciones en una botella",
  "A nano coating that protects your paint every day, in the sun, the rain and the dust of the road.":
    "Un recubrimiento nano que protege tu pintura todos los días, del sol, la lluvia y el polvo del camino.",
  "Water-repellent like a lotus leaf": "Repele el agua como una hoja de loto",
  "Mirror-like gloss": "Brillo espejo",
  "Protects against dirt and bird droppings": "Protege contra la suciedad y el excremento de pájaros",
  "Helps against small scratches": "Ayuda contra rayones pequeños",
  "Resists strong sun": "Resiste el sol fuerte",
  "Safe for all car paints": "Seguro para todo tipo de pintura",
  "Rain and mud slide off": "La lluvia y el lodo resbalan",
  "Like water on a lotus leaf, rain forms drops and runs off the car. Muddy water doesn't stick to the paint, so your car stays clean longer and you wash it less often.":
    "Como el agua en una hoja de loto, la lluvia forma gotas y se desliza del auto. El agua con lodo no se pega a la pintura: tu auto se mantiene limpio más tiempo y lo lavas menos.",
  "Water forms beads and slides off": "El agua forma gotas y se desliza",
  "Mud and dirty water don't stick": "El lodo y el agua sucia no se pegan",
  "Less washing, more time for you": "Menos lavadas, más tiempo para ti",
  "Mirror-like shine, no waxing": "Brillo espejo, sin cera",
  "Forget wax and long polishing. One spray and one wipe lock in the shine and leave the paint crystal-clear.":
    "Olvídate de la cera y de pulir por horas. Un rocío y una pasada fijan el brillo y dejan la pintura impecable.",
  "A shield against small scratches": "Un escudo contra rayones pequeños",
  "The nano layer gives your paint extra protection against light scratches from branches, leaves and everyday use.":
    "La capa nano le da a tu pintura una protección extra contra rayones ligeros de ramas, hojas y el uso diario.",
  "For the whole vehicle": "Para todo el vehículo",
  "Use it on the body, glass, mirrors, headlights, chrome and tyres. Cars, motorcycles, bajaji and more: the shine comes back like new.":
    "Úsalo en la carrocería, vidrios, espejos, faros, cromados y llantas. Autos, motos, pick-ups y más: el brillo vuelve como nuevo.",
  "Paint, glass, mirrors and headlights": "Pintura, vidrios, espejos y faros",
  "Chrome and tyres": "Cromados y llantas",
  "Cars, motorcycles and bajaji": "Autos, motos y pick-ups",
  "120 ml bottle with spray trigger": "Botella de 120 ml con atomizador",
  "Showroom shine,": "Brillo de agencia,",
  "in minutes": "en minutos",
  "Spray, wipe and drive: your car looks clean and shiny again.": "Rocía, limpia y maneja: tu auto se ve limpio y brillante otra vez.",

  // Sauna Sculpt Leggings
  "📏 Sizes M to 2XL": "📏 Tallas M a 2XL",
  "High-waist leggings with a heat-trapping silver layer inside: you sweat more when you move, and the firm fabric shapes your waist, thighs and hips.":
    "Leggings de tiro alto con una capa plateada interior que retiene el calor: sudas más cuando te mueves, y la tela firme moldea tu cintura, muslos y caderas.",
  "Sweat more in every workout": "Suda más en cada entrenamiento",
  "The silver inner layer keeps the heat in. You warm up faster and sweat more, whether you walk, train or clean the house.":
    "La capa plateada interior retiene el calor. Calientas más rápido y sudas más, ya sea caminando, entrenando o limpiando la casa.",
  "Heat-trapping silver coating inside": "Capa plateada interior que retiene el calor",
  "You feel the warmth in minutes": "Sientes el calor en minutos",
  "Black outside: nobody sees the silver": "Negros por fuera: nadie ve la capa plateada",
  "Adjustable hooks, high waist": "Ganchos ajustables, tiro alto",
  "Close the hooks at the level that is comfortable for you. The high waist holds your belly and stays in place when you move.":
    "Cierra los ganchos al nivel que te resulte cómodo. El tiro alto sostiene el abdomen y no se mueve cuando te mueves.",
  "Adjustable hooks": "Ganchos ajustables",
  "Ultra-stretch fabric": "Tela ultra elástica",
  "High waist that doesn't roll down": "Tiro alto que no se enrolla",
  "A smoother shape, right away": "Una figura más definida, al instante",
  "The firm fabric hugs your waist, thighs and hips. Your silhouette looks smoother the moment you put them on, under a dress or a long top.":
    "La tela firme abraza tu cintura, muslos y caderas. Tu silueta se ve más definida desde que te los pones, bajo un vestido o una blusa larga.",
  "Holds the tummy": "Sostiene el abdomen",
  "Smooths the thighs": "Alisa los muslos",
  "Lifts the hips": "Levanta las caderas",
  "For every kind of sport": "Para todo tipo de deporte",
  "Yoga, running, the gym, cycling or a long walk: they move with you and stay comfortable.":
    "Yoga, correr, el gimnasio, bicicleta o una caminata larga: se mueven contigo y siguen cómodos.",
  "Warm up,": "Calienta,",
  "sweat more": "suda más",
  "Put them on for your workout or your walk and feel the heat straight away.": "Póntelos para entrenar o caminar y siente el calor desde el primer minuto.",

  // Posture Corrector
  "An adjustable back brace with crossed straps that holds your shoulders back and helps you sit and stand straight, at work, at home or on the move.":
    "Un corrector de espalda ajustable con correas cruzadas que lleva tus hombros hacia atrás y te ayuda a sentarte y pararte derecho, en el trabajo, en casa o en movimiento.",
  "Posture corrector": "Corrector de postura",
  "The crossed straps hold your shoulders back and keep your upper back straight. Made for people who work long hours at a desk or spend a lot of time looking down at their phone.":
    "Las correas cruzadas llevan tus hombros hacia atrás y mantienen recta la parte alta de la espalda. Para quienes trabajan muchas horas sentados o pasan mucho tiempo mirando el celular.",
  "Easy to put on": "Fácil de poner",
  "Put it on like a backpack, cross the straps, close the belt with the velcro and adjust. It takes less than a minute.":
    "Póntelo como una mochila, cruza las correas, cierra el cinturón con el velcro y ajusta. Toma menos de un minuto.",
  "Fully adjustable": "Totalmente ajustable",
  "Made for men and women. Pull the side straps until it feels right: it fits sizes S to XXL (24 to 46 inch waist).":
    "Para hombre y mujer. Tira de las correas laterales hasta sentirte cómodo: se adapta de la talla S a la XXL (cintura de 24 a 46 pulgadas).",
  "Smart design": "Diseño inteligente",
  "The woven elastic tape on the back follows your movements, and the breathable fabric keeps you comfortable all day.":
    "La cinta elástica tejida de la espalda sigue tus movimientos y la tela transpirable te mantiene cómodo todo el día.",
  "Discreet and light": "Discreto y ligero",
  "Thin enough to wear under a shirt at the office, at home or in the car. Start with 20 minutes a day, then wear it a little longer each day.":
    "Tan delgado que lo puedes usar bajo la camisa en la oficina, en casa o en el carro. Empieza con 20 minutos al día y úsalo un poco más cada día.",
  "Soft and strong": "Suave y resistente",
  "Soft perforated fabric, a back support plate and a strong velcro closure that you tighten as you like.":
    "Tela suave perforada, placa de soporte en la espalda y un velcro fuerte que ajustas a tu gusto.",
  "Product size": "Medidas del producto",
  "46 cm high and 41 cm wide, adjustable from size S to XXL.": "46 cm de alto y 41 cm de ancho, ajustable de la talla S a la XXL.",
  "Stand tall,": "Párate derecho,",
  "every day": "todos los días",
  "Close it, adjust it, and feel your shoulders go back straight away.": "Ciérralo, ajústalo y siente tus hombros en su lugar al instante.",

  // Layered Arm Chain
  "A thin open arm band with layered chains and small bar pendants. Elegant, light and easy to wear, in gold or silver.":
    "Un brazalete abierto para el brazo con cadenas en capas y pequeños dijes de barra. Elegante, ligero y fácil de usar, en dorado o plateado.",
  "An instant chic look": "Un look chic al instante",
  "A thin open band on the upper arm with layers of fine chains falling like a cascade, finished with small bar pendants. It turns a simple outfit into an elegant look.":
    "Una banda abierta para la parte superior del brazo con cadenas finas que caen en cascada y pequeños dijes de barra. Convierte un atuendo sencillo en un look elegante.",
  "Perfect with summer outfits": "Perfecto con tus looks de verano",
  "With a strapless top, a dress or a sleeveless blouse: at the beach, at a wedding, at a party or for an evening out.":
    "Con un top strapless, un vestido o una blusa sin mangas: en la playa, en una boda, en una fiesta o en una salida de noche.",
  "Delicate layered chains": "Cadenas delicadas en capas",
  "Several fine chains of different lengths move with you and catch the light. A shiny polished finish.":
    "Varias cadenas finas de distintos largos se mueven contigo y reflejan la luz. Acabado pulido brillante.",
  "The band is open: slide it up your arm and press it gently to fit your arm. No clasp to close.":
    "La banda es abierta: deslízala por el brazo y presiónala suavemente para ajustarla. Sin broche.",
  "Gold or silver": "Dorado o plateado",
  "Tell us the color you want when we call to confirm your order. Zinc alloy with a shiny polished finish.":
    "Dinos el color que quieres cuando te llamemos para confirmar tu pedido. Aleación de zinc con acabado pulido brillante.",
  "Size": "Medidas",
  "Band of 22.5 cm, chains from 4.5 to 12.5 cm long.": "Banda de 22.5 cm, cadenas de 4.5 a 12.5 cm de largo.",
  "A gift she will love": "Un regalo que le encantará",
  "For a birthday, an anniversary or just to say thank you.": "Para un cumpleaños, un aniversario o simplemente para decir gracias.",
};

const { LANG, T } = (() => {
  "use strict";

  const KEY = "dukabora_lang";
  const LANGS = COUNTRY.languages; // Zambia, Lebanon: English only
  const asked = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try {
    if (LANGS.includes(asked)) localStorage.setItem(KEY, asked);
    saved = localStorage.getItem(KEY);
  } catch { /* storage unavailable */ }
  const LANG = [asked, saved].find((l) => LANGS.includes(l)) || LANGS[0];
  // Swahili texts, or in Zambia / Lebanon the English texts adapted to that country
  // (El Salvador: Spanish)
  const DICT = LANG === "sw" ? SW : LANG === "es" ? ES : { zm: ZM, lb: LB }[COUNTRY.id] || null;

  const T = (en, vars) => {
    let s = DICT && DICT[en] != null ? DICT[en] : en;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  };

  /* ---------- Parts of the page for one country only (data-country="tz" / "zm" / "lb" / "sv") ---------- */
  document.querySelectorAll("body [data-country]").forEach((el) => { if (el.dataset.country !== COUNTRY.id) el.remove(); });

  /* ---------- Translate the page's own HTML (text written by JavaScript uses T) ---------- */
  if (DICT) {
    document.documentElement.lang = LANG;
    document.title = T(document.title);
    if (LANG === "sw") document.querySelectorAll("[data-sw]").forEach((el) => { el.innerHTML = el.dataset.sw; });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const key = n.nodeValue.replace(/\s+/g, " ").trim();
      if (!key || DICT[key] == null) continue;
      const [, before, after] = n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/);
      n.nodeValue = before + DICT[key] + after;
    }
    document.querySelectorAll("[aria-label], [placeholder]").forEach((el) => {
      ["aria-label", "placeholder"].forEach((a) => {
        if (el.hasAttribute(a)) el.setAttribute(a, T(el.getAttribute(a)));
      });
    });
  }

  /* ---------- SW / EN buttons (in every header: <div class="lang" data-lang></div>) ---------- */
  document.querySelectorAll("[data-lang]").forEach((box) => {
    if (LANGS.length < 2) return box.remove();
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", T("Language"));
    box.innerHTML = LANGS.map((l) =>
      `<button type="button" data-set-lang="${l}" aria-pressed="${l === LANG}"${l === LANG ? ' class="is-active"' : ""}>${l.toUpperCase()}</button>`).join("");
  });
  document.addEventListener("click", (e) => {
    const l = e.target.closest("[data-set-lang]")?.dataset.setLang;
    if (!l || l === LANG) return;
    const url = new URL(location.href);
    url.hash = "";
    url.searchParams.delete("lang");
    try { localStorage.setItem(KEY, l); } catch { url.searchParams.set("lang", l); }
    if (url.href === location.href) location.reload(); else location.assign(url.href);
  });

  return { LANG, T };
})();
