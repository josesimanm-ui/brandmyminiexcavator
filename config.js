/* =============================================================
   BRAND MY FLEET — the historic one.

   Five assets, one auction, 34 surfaces, twelve months:
     Bobcat S570 · Bobcat E35 · Komatsu PC200 · HondaJet · Porsche 911

   Nobody has auctioned brand space across a skid steer AND a private
   jet AND a supercar at the same time. That contrast IS the story:
   a USD 65K machine and a USD 3.5M jet on the same board, priced in
   public, funded by the same eight-or-so brands.

   THE RULE, same as always: every goal is the real price of the asset,
   and the surfaces on it add up to exactly that. Nothing is padded.

   TOTAL FLEET: USD 1,619,000
   ============================================================= */

window.FLEET_PAGES = {
  s570:  { title: "Your brand, on a Bobcat.",   sub: "A Bobcat S570 working across Panama. Six surfaces, every price public, twelve months." },
  e35:   { title: "Your brand, on the digger.", sub: "A Bobcat E35 mini excavator on real job sites. Six surfaces, twelve months." },
  pc200: { title: "Your brand, on 20 tonnes.",  sub: "A Komatsu PC200 that works for a living. Six surfaces, every price public." },
  jet:   { title: "Your brand, at 43,000 feet.", sub: "A HondaJet working the region. Eight surfaces, twelve months." },
  p911:  { title: "Your brand, on my Porsche.",  sub: "A 992 Carrera GTS. Eight surfaces, every price public, twelve months." },
};

window.SITE = {

  site: {
    id: "fleet",
    name: "Brand My Mini Excavator",
    owner: "Jose Siman",
    contactEmail: "josesimanm@gmail.com",
    instagram: "",
    sisters: [{"label": "Porsche 911", "href": "https://brandmysportscar.com/"}, {"label": "HondaJet", "href": "https://brandmyprivatejet.com/"}, {"label": "Bobcat S570", "href": "https://brandmyskidsteer.com/"}, {"label": "Komatsu PC200", "href": "https://brandmyexcavator.com/"}],
  },

  hero: {
    title: "Your brand, on the digger.",
    sub: "A Bobcat E35 mini excavator on real job sites. Six surfaces, twelve months.",
    unit: "asset",
  },

  photo: null,
  zones: [],

  /* ---------- THE FLEET ----------
     Every asset carries its own photo, its own surfaces and its own price.
     ⚠️ Sponsor names are PLACEHOLDERS. Clear them before going live.     */
  markets: [
    {
      /* FOTO OFICIAL de catálogo — grupoconstrumarket.com */
      page: "e35.html", id: "e35", city: "Bobcat E35", country: "Mini excavator · 3.5 t", flag: "⛏️", status: "live",
      art: null, photo: "assets/bobcat-e35.webp",
      vehicle: { model: "Bobcat", trim: "E35 · 3.5 t", year: "2026", paint: "#F26B21" },
      goal: 85000, endsAt: "2026-10-31T23:59:00-05:00",
      baseWatchers: 61, baseVisitors: 7420,
      rental: { monthly: 2600, utilization: 0.60 },
      zones: [
        { id: "cwt",     name: "Counterweight", x: 70, y: 58 },
        { id: "house",   name: "House Side",    x: 64, y: 47 },
        { id: "cabroof", name: "Cab Roof",      x: 55, y: 14 },
        { id: "boom",    name: "Boom",          x: 34, y: 26 },
        { id: "bucket",  name: "Bucket",        x: 26, y: 64 },
        { id: "track",   name: "Track Frame",   x: 56, y: 73 },
      ],
      spots: [
        { id: "house",   price: 23000, status: "open" },
        { id: "boom",    price: 18000, status: "open" },
        { id: "cabroof", price: 15000, status: "open" },
        { id: "bucket",  price: 13000, status: "open" },
        { id: "cwt",     price:  9000, status: "open" },
        { id: "track",   price:  7000, status: "open" },
      ],
    },
  ],

  /* ---------- WHERE THE MONEY GOES ----------
     PRICES (Aug 2026):
       · Bobcat S570 skid steer ....... ~USD 58K new  → 65K landed Panama
       · Bobcat E35 mini excavator .... ~USD 76K new  → 85K landed
       · Komatsu PC200 20 t ........... ~USD 260K new → 290K landed
       · Porsche 911 Carrera GTS ...... USD 181K + 2,350 dest → 229K landed
       · HondaJet HA-420 Elite ........ USD 2.3–4.8M pre-owned (avg 3.7M);
         Elite II factory list USD 6,950,000
     The four ground assets are bought OUTRIGHT. The jet is the one exception:
     its goal is a 20% down payment plus a 12-month reserve on a ~3.5M airframe.
     ⚠️ Panama landing factor ~1.12 on machinery, ~1.25 on the car — estimates.
        Confirm with your dealers before publishing.                          */
  funding: {
    title: "USD 1,619,000. Every number is a real price.",
    lead: "Five assets on one board, from a 65,000-dollar skid steer to a 3.5-million-dollar jet. Every goal is what the thing actually costs, and the surfaces on it add up to exactly that. Sell them all and the fleet exists.",
    rows: [
      { k: "Four are bought outright",
        d: "The S570, the E35, the PC200 and the 911 are paid for in full by their own surfaces. No debt, no lien, no financing." },
      { k: "The jet is the exception, stated openly",
        d: "A HondaJet is USD 2.3–4.8M pre-owned. Eight surfaces can't buy that outright, so its goal is a 20% down payment plus a 12-month reserve. Nobody is pretending otherwise." },
      { k: "Three of them pay you back",
        d: "The machines rent. That income doesn't go to sponsors — it services the jet and buys the next machine. The Porsche and the jet are the marketing; the machines are the engine." },
      { k: "Why this has never been done",
        d: "Sponsorship is normally one category at a time: a race car, a stadium, a team. Nobody has put a skid steer and a private jet on the same board and priced both in public. The contrast is the story." },
      { k: "One brand per industry, across the fleet",
        d: "Take a surface on all five and you own your category on every asset. One conversation, one invoice, five audiences that never overlap." },
      { k: "If it falls short",
        d: "Nothing is bought on a half-funded auction. The deadline extends, or every sponsor is refunded in full." },
    ],
    note: "Machine and car prices are August 2026 references plus an estimated Panama landing factor. HondaJet figures are pre-owned market values. Confirm all of it with your dealers before publishing.",
  },

  steps: [
    { n: "01", title: "Pick an asset and a surface", text: "Five assets, 34 surfaces, every price on the marker. Reserve with a 5% deposit; balance by transfer on signature." },
    { n: "02", title: "Upload your logo",            text: "Drop your file on this page and watch it land on the asset. Vector is best." },
    { n: "03", title: "We install it",               text: "Heavy-duty vinyl on the machines, automotive vinyl on the car, certified decals on the aircraft." },
    { n: "04", title: "Twelve months",               text: "The machines work, the jet flies, the car gets driven. Monthly report on all of it." },
  ],

  engine: {
    title: "Why this is the one people will talk about.",
    lead: "Putting a logo on a supercar has been done. Putting the same logo on a supercar, a private jet and a 20-tonne excavator — in one auction, with every price public — has not.",
    items: [
      { k: "The contrast is the content",
        d: "A USD 6,000 wheel rim and a USD 238,000 tail fin on the same board. That gap is what makes people screenshot it and send it to someone." },
      { k: "Five audiences that never overlap",
        d: "Job sites, private terminals, city streets. One sponsorship reaches contractors, executives and the internet — three worlds that normally need three budgets." },
      { k: "Radical price transparency",
        d: "Every surface shows its number, and every goal equals what the asset costs. No rate card, no discovery call, no negotiation theatre. That alone is unusual enough to travel." },
      { k: "Built for the brands with the biggest budgets",
        d: "AI labs, chipmakers and exchanges don't buy impressions — they buy being talked about. A logo on an excavator next to one on a HondaJet is exactly that kind of purchase." },
      { k: "Three of the five earn",
        d: "The machines rent while they advertise. A campaign that pays part of its own cost back is a very different conversation with a CFO." },
      { k: "It compounds",
        d: "Prove it once and the format repeats: another city, another jet, another fleet. The first one is the hard one — and it's the one that gets remembered." },
    ],
  },

  faq: [
    { q: "Is this real?",
      a: "The model is real and every price on this page is a real market price. The assets are being assembled now — each one gets bought when its surfaces are sold, not before." },
    { q: "Why a skid steer and a private jet in the same auction?",
      a: "Because nobody has done it, and because they reach completely different people. The machines are seen by everyone stuck in traffic beside a job site; the jet is seen on private ramps. Same logo, two worlds." },
    { q: "Can two brands from the same industry share an asset?",
      a: "No. One brand per category, per asset. Whoever moves first locks their competition out of that machine." },
    { q: "Can I take a surface on all five?",
      a: "Yes — that's the fleet package, and it's the best value on the page. One category, five assets, one invoice." },
    { q: "Who keeps the rental income from the machines?",
      a: "The operation does, and it's earmarked for the aircraft reserve and the next machine. Sponsors buy exposure, not equity." },
    { q: "Why would an AI or crypto company sponsor an excavator?",
      a: "Not for the impressions — for the story. A logo on a 20-tonne Komatsu next to one on a HondaJet is the kind of thing people share. That reach costs a fraction of a normal campaign." },
    { q: "How do I actually pay?",
      a: "A 5% deposit holds your surface for 14 days while we agree terms — that is the only card-sized payment. The balance is paid by bank transfer against a signed contract and an invoice your accounting can deduct. No card fees on either side, and no processor sitting on a six-figure sponsorship." },
    { q: "Is the deposit refundable?",
      a: "Yes, in full, if the auction on that asset doesn't close or if we can't agree terms inside the 14 days. Nothing is bought on a half-funded auction, so nobody is left holding a deposit for an asset that never existed." },
    { q: "What happens if an auction doesn't close?",
      a: "That asset doesn't get bought. The deadline extends or every sponsor on it is refunded in full. Nothing gets spent halfway." },
    { q: "Which brands don't you take?",
      a: "No adult content, gambling or politics. Crypto is fine if the brand is a real operating business — exchanges and infrastructure, not tokens looking for exit liquidity." },
  ],

  /* créditos obligatorios de las fotos con licencia CC BY-SA */
  credits: "Machine photos courtesy of Grupo ConstruMarket, authorized Bobcat & Komatsu dealer. HondaJet HA-420 and Porsche 911 (992) photos — Wikimedia Commons, CC BY-SA 4.0.",
};
