/* ==========================================================
   Languages: Swahili (default) and English.
   - The site is written in English; SW below gives the Swahili for each text.
     A text missing from SW simply stays in English.
   - The visitor switches with the SW / EN buttons in the header (choice remembered).
   - Ad links can force a language: product.html?id=reward-watch&lang=en
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
  "Please enter your district or town.": "Tafadhali andika wilaya au mji wako.",
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

const { LANG, T } = (() => {
  "use strict";

  const KEY = "dukabora_lang";
  const LANGS = COUNTRY.languages; // Zambia: English only
  const asked = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try {
    if (LANGS.includes(asked)) localStorage.setItem(KEY, asked);
    saved = localStorage.getItem(KEY);
  } catch { /* storage unavailable */ }
  const LANG = [asked, saved].find((l) => LANGS.includes(l)) || LANGS[0];
  // Swahili texts, or in Zambia the English texts adapted to Zambia
  const DICT = LANG === "sw" ? SW : COUNTRY.id === "zm" ? ZM : null;

  const T = (en, vars) => {
    let s = DICT && DICT[en] != null ? DICT[en] : en;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  };

  /* ---------- Parts of the page for one country only (data-country="tz" / "zm") ---------- */
  document.querySelectorAll("[data-country]").forEach((el) => { if (el.dataset.country !== COUNTRY.id) el.remove(); });

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
