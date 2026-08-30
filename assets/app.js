/* ===== BRAND MY — shared engine for the 911 and the jet pages ===== */
(function () {
  'use strict';

  const S = window.SITE;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const short = n => n >= 1000 ? '$' + Math.round(n / 1000) + 'K' : '$' + n;
  const initials = s => (s || '?').trim().charAt(0).toUpperCase();
  const zoneOf = id => (((market && market.zones) || S.zones || [])
    .find(z => z.id === id)) || { name: id, x: 50, y: 50 };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const LS_LOGOS = 'brandmy-logos-' + S.site.id;
  const LS_THEME = 'brandmy-theme';

  /* ---------- uploaded logos (browser-side preview only) ---------- */
  let logos = {};
  try { logos = JSON.parse(localStorage.getItem(LS_LOGOS) || '{}'); } catch (e) { logos = {}; }
  const logoKey = (m, sp) => m.id + ':' + sp.id;
  const saveLogos = () => {
    try { localStorage.setItem(LS_LOGOS, JSON.stringify(logos)); }
    catch (e) { /* quota — the preview still works this session */ }
  };

  /* ---------- market maths ---------- */
  const totals = m => {
    const sold = m.spots.filter(s => s.status === 'sold');
    const raised = sold.reduce((a, s) => a + s.price, 0);
    return { sold, open: m.spots.filter(s => s.status !== 'sold'), raised,
             pct: Math.min(100, (raised / m.goal) * 100) };
  };

  function shade(hex, amt) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    const cl = v => Math.max(0, Math.min(255, v));
    const r = cl((n >> 16) + amt), g = cl(((n >> 8) & 255) + amt), b = cl((n & 255) + amt);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ---------- state ---------- */
  let market = S.markets.find(m => m.status === 'live') || S.markets[0];
  let clockTimer = null, liveTimer = null;

  /* ---------- static copy ---------- */
  $('#navBrandName').textContent = S.site.name;
  $('#footBrand').textContent = S.site.name;
  $('#footOwner').textContent = S.site.owner;
  $('#heroTitle').innerHTML = S.hero.title;
  $('#heroSub').textContent = S.hero.sub;
  $('#engineTitle').textContent = S.engine.title;
  $('#engineLead').textContent = S.engine.lead;
  if (S.funding) {
    $('#fundTitle').textContent = S.funding.title;
    $('#fundLead').textContent = S.funding.lead;
    $('#fundNote').textContent = S.funding.note || '';
    $('#fundRows').innerHTML = S.funding.rows.map(r =>
      '<div><dt>' + esc(r.k) + '</dt><dd>' + esc(r.d) + '</dd></div>').join('');
  }
  const sisters = S.site.sisters ||
    (S.site.sisterHref ? [{ label: S.site.sisterLabel, href: S.site.sisterHref }] : []);
  ['#sisterLink', '#sisterLinkM', '#sisterLinkF'].forEach(sel => {
    const a = $(sel);
    if (!a || !sisters.length) return;
    a.href = sisters[0].href;
    a.textContent = sisters[0].label + ' ↗';
    sisters.slice(1).forEach(x => {
      const b = a.cloneNode(false);
      b.href = x.href; b.textContent = x.label + ' \u2197'; b.removeAttribute('id');
      a.parentNode.insertBefore(b, a.nextSibling);
    });
  });
  if (S.site.instagram) { const ig = $('#footIg'); ig.href = S.site.instagram; ig.hidden = false; }
  if (S.credits) {
    const f = $('.foot__inner');
    if (f) { const p = document.createElement('p'); p.className = 'foot__credits'; p.textContent = S.credits; f.parentNode.appendChild(p); }
  }

  /* ---------- real photo instead of the vector ---------- */
  if (S.photo) {
    $('#carHost').innerHTML =
      '<img class="car" src="' + esc(S.photo) + '" alt="' + esc(S.site.name) + '">';
  }

  /* ---------- city tabs (hidden when there is only one market) ---------- */
  const tabs = $('#cityTabs');
  if (S.markets.length < 2) {
    tabs.hidden = true;
  } else {
    S.markets.forEach(m => {
      const b = document.createElement('button');
      b.className = 'city';
      b.dataset.id = m.id;
      b.setAttribute('role', 'tab');
      const live = m.status === 'live';
      b.innerHTML =
        '<span class="city__flag">' + m.flag + '</span>' + esc(m.city) +
        '<span class="city__badge' + (live ? '' : ' city__badge--soon') + '">' +
          (live ? 'LIVE' : 'SOON') + '</span>';
      b.addEventListener('click', () => selectMarket(m.id));
      tabs.appendChild(b);
    });
  }

  /* ---------- markets grid ---------- */
  const mGrid = $('#marketsGrid');
  S.markets.forEach(m => {
    const t = totals(m);
    const b = document.createElement('button');
    b.className = 'market';
    b.dataset.id = m.id;
    b.innerHTML =
      '<div class="market__top">' +
        '<span class="market__city">' + m.flag + ' ' + esc(m.city) + '</span>' +
        '<span class="market__chip" style="background:' + m.vehicle.paint + '"></span>' +
      '</div>' +
      '<p class="market__trim">' + esc(m.vehicle.trim) + '</p>' +
      '<div class="market__bar"><div class="market__fill" style="width:' + t.pct + '%"></div></div>' +
      '<div class="market__nums">' +
        '<span><b>' + short(t.raised) + '</b> of ' + short(m.goal) + '</span>' +
        '<span>' + t.open.length + ' open</span>' +
      '</div>' +
      '<span class="spot__tag ' + (m.status === 'live' ? 'spot__tag--open' : 'spot__tag--sold') + '">' +
        (m.status === 'live' ? 'AUCTION OPEN' : 'COMING SOON') + '</span>';
    b.addEventListener('click', () => {
      if (m.page && !window.FLEET_SOLO) { location.href = m.page; return; }
      selectMarket(m.id);
      document.getElementById('spots').scrollIntoView({ behavior: 'smooth' });
    });
    mGrid.appendChild(b);
  });

  /* ---------- static sections ---------- */
  $('#stepsGrid').innerHTML = S.steps.map(s =>
    '<div class="step"><div class="step__n">' + s.n + '</div>' +
    '<h3 class="step__t">' + esc(s.title) + '</h3>' +
    '<p class="step__d">' + esc(s.text) + '</p></div>').join('');

  $('#engineGrid').innerHTML = S.engine.items.map(i =>
    '<div><h3 class="eng__k">' + esc(i.k) + '</h3><p class="eng__d">' + esc(i.d) + '</p></div>').join('');

  $('#faqList').innerHTML = S.faq.map(f =>
    '<div class="faq__item"><button class="faq__q">' + esc(f.q) +
    '<svg class="faq__ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
    '</button><div class="faq__a"><p>' + esc(f.a) + '</p></div></div>').join('');

  $$('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement, panel = $('.faq__a', item);
      const wasOpen = item.classList.contains('is-open');
      $$('.faq__item').forEach(i => {
        i.classList.remove('is-open');
        $('.faq__a', i).style.maxHeight = null;
      });
      if (!wasOpen) { item.classList.add('is-open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });

  /* ---------- render ---------- */
  function selectMarket(id) {
    market = S.markets.find(m => m.id === id) || market;
    render();
  }

  function render() {
    const m = market, t = totals(m), v = m.vehicle;

    $$('.city').forEach(b => b.classList.toggle('is-active', b.dataset.id === m.id));
    $$('.market').forEach(b => b.classList.toggle('is-active', b.dataset.id === m.id));

    const p = v.paint;
    document.documentElement.style.setProperty('--paint', p);
    document.documentElement.style.setProperty('--paint-hi', shade(p, 62));
    document.documentElement.style.setProperty('--paint-lo', shade(p, -68));

    $('#carLine').textContent = m.flag + '  ' + m.city + ' · ' + v.year + ' ' + v.model + ' ' + v.trim;
    $('#carTitle').textContent = v.model;
    $('#carTrim').textContent = [v.year, v.trim].filter(Boolean).join(' · ');
    $('#carCityName').textContent = m.city;
    $('#spotsCity').textContent = m.city;
    $('#goalAmount').textContent = money(m.goal);
    $('#statSold').textContent = t.sold.length + '/' + m.spots.length;
    $('#openCount').textContent = t.sold.length + ' taken, ' +
      (t.open.length === 1 ? '1 open.' : t.open.length + ' open.');
    $('#openCount2').textContent = t.open.length;

    animate($('#raisedAmount'), t.raised, money);
    animate($('#statRaised'), t.raised, money);
    animate($('#pct'), t.pct, x => Math.round(x) + '%');
    animate($('#statPct'), t.pct, x => Math.round(x) + '%');
    setTimeout(() => { $('#barFill').style.width = t.pct + '%'; }, 120);

    $('#specsList').innerHTML = [
      { label: 'Based in', value: m.city },
      { label: 'Spec',     value: v.trim.replace(/\s*\(.*\)/, '') },
      { label: 'Goal',     value: money(m.goal) },
      { label: 'Open',     value: t.open.length + ' of ' + m.spots.length },
    ].map(s => '<div><dt>' + s.label + '</dt><dd>' + esc(s.value) + '</dd></div>').join('');

    /* the maths board — the goal IS the asset */
    if (S.funding) {
      $('#fundAssetLabel').textContent = v.year + ' ' + v.model + ' ' + v.trim.replace(/\s*\(.*\)/, '') +
        (S.site.id === 'car' ? ' · landed in ' + m.city : ' · ' + m.city);
      $('#fundAsset').textContent = money(m.goal);
      $('#fundRaised').textContent = money(t.raised);
      $('#fundGap').textContent = money(Math.max(0, m.goal - t.raised));
      const rent = $('#fundRent');
      if (rent) {
        const rent2 = $('#fundRent2');
        if (m.rental) {
          const perMonth = m.rental.monthly * m.rental.utilization;
          rent.hidden = false; if (rent2) rent2.hidden = false;
          $('#fundRentVal').textContent = money(m.rental.monthly) + '/mo';
          $('#fundPayback').textContent = Math.round(m.goal / perMonth) + ' months';
        } else { rent.hidden = true; if (rent2) rent2.hidden = true; }
      }
      setTimeout(() => { $('#fundBar').style.width = t.pct + '%'; }, 140);
    }

    const host = $('#carHost');
    let img = $('#carPhoto');
    if (m.photo) {
      if (!img) {
        img = document.createElement('img');
        img.id = 'carPhoto'; img.className = 'car car--photo';
        host.insertBefore(img, host.firstChild);
      }
      img.src = m.photo; img.alt = v.model + ' ' + v.trim; img.hidden = false;
      $$('[data-art]').forEach(el => showArt(el, false));
    } else {
      if (img) img.hidden = true;
      if (m.art) $$('[data-art]').forEach(el => showArt(el, el.dataset.art === m.art));
    }

    renderHotspots(m);
    renderSpotCards(m);
    renderMini();
    startClock(m);
    startLive(m);
  }

  /* OJO: en SVG, el.hidden = true NO escribe el atributo (hidden sólo existe
     en HTMLElement, y SVGElement no hereda de él). Hay que usar el atributo. */
  function showArt(el, show) {
    if (show) el.removeAttribute('hidden'); else el.setAttribute('hidden', '');
  }

  /* logo box: uploaded image if present, otherwise the initial */
  function badge(m, sp, cls) {
    const up = logos[logoKey(m, sp)];
    if (up) return '<div class="' + cls + ' ' + cls + '--img"><img src="' + up + '" alt=""></div>';
    const sold = sp.status === 'sold';
    return '<div class="' + cls + '" style="background:' + (sold ? sp.color : '#9aa3ae') + '">' +
           (sold ? initials(sp.brand) : '+') + '</div>';
  }

  function labelFor(m, sp) {
    if (logos[logoKey(m, sp)]) return 'Your brand';
    return sp.status === 'sold' ? sp.brand : 'Available';
  }

  function renderHotspots(m) {
    const host = $('#carHost');
    $$('.hot', host).forEach(e => e.remove());
    m.spots.forEach(sp => {
      const z = zoneOf(sp.id);
      const mine = !!logos[logoKey(m, sp)];
      const el = document.createElement('div');
      el.className = 'hot' + (z.y > 55 ? ' hot--below' : '') + (mine ? ' hot--mine' : '');
      el.style.left = z.x + '%';
      el.style.top = z.y + '%';
      el.innerHTML =
        '<div class="hot__dot" style="background:' +
          (mine ? 'var(--green)' : sp.status === 'sold' ? sp.color : 'var(--ink-2)') + '"></div>' +
        '<div class="hot__card' + (sp.status === 'sold' || mine ? '' : ' hot__open') + '">' +
          badge(m, sp, 'hot__logo') +
          '<div><div class="hot__name">' + esc(labelFor(m, sp)) + '</div>' +
          '<div class="hot__pos">' + esc(z.name) +
            (sp.status === 'sold' ? '' : ' · <b>' + money(sp.price) + '</b>') + '</div></div>' +
        '</div>';
      el.addEventListener('click', () => openModal(sp, z));
      host.appendChild(el);
    });
    requestAnimationFrame(() => $('#stage').classList.add('is-ready'));
  }

  function renderSpotCards(m) {
    const grid = $('#spotsGrid');
    grid.innerHTML = '';
    m.spots.forEach(sp => {
      const z = zoneOf(sp.id);
      const sold = sp.status === 'sold';
      const mine = !!logos[logoKey(m, sp)];
      const b = document.createElement('button');
      b.className = 'spot' + (mine ? ' spot--mine' : '');
      b.innerHTML =
        '<div class="spot__top">' + badge(m, sp, 'spot__logo') +
          '<span class="spot__tag ' + (mine ? 'spot__tag--mine' : sold ? 'spot__tag--sold' : 'spot__tag--open') + '">' +
            (mine ? 'YOUR LOGO' : sold ? 'TAKEN' : 'OPEN') + '</span>' +
        '</div>' +
        '<div class="spot__name">' + esc(z.name) + '</div>' +
        '<div class="spot__meta">' +
          (sold ? 'By <b>' + esc(sp.brand) + '</b>' : 'From <b>' + money(sp.price) + '</b>') +
        '</div>';
      b.addEventListener('click', () => openModal(sp, z));
      grid.appendChild(b);
    });
  }

  function renderMini() {
    const mini = $('#carMini');
    const svg = $$('#carHost [data-art]').find(e => !e.hasAttribute('hidden')) || $('#carSvg');
    if (!mini) return;
    const ph = market.photo || S.photo;
    if (ph) { mini.innerHTML = '<img src="' + esc(ph) + '" alt="">'; return; }
    if (!svg) return;
    mini.innerHTML = svg.outerHTML
      .replace('id="carSvg"', '')
      .replace(/id="g/g, 'id="m')
      .replace(/url\(#g/g, 'url(#m');
    $$('.hot', mini).forEach(e => e.remove());
  }

  function animate(el, target, fmt) {
    if (!el) return;
    const dur = 900, t0 = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function startClock(m) {
    clearInterval(clockTimer);
    const end = new Date(m.endsAt).getTime();
    const tick = () => {
      const d = end - Date.now();
      let txt;
      if (isNaN(end)) txt = 'check endsAt in config';
      else if (m.status !== 'live') txt = 'not open yet';
      else if (d <= 0) txt = 'auction closed';
      else {
        const dd = Math.floor(d / 864e5), hh = Math.floor(d / 36e5) % 24,
              mm = Math.floor(d / 6e4) % 60, ss = Math.floor(d / 1e3) % 60;
        txt = (dd ? dd + 'd ' : '') + hh + 'h ' + mm + 'm ' + ss + 's';
      }
      $('#countdown').textContent = txt;
      $('#countdown2').textContent = txt;
    };
    tick(); clockTimer = setInterval(tick, 1000);
  }

  function startLive(m) {
    clearInterval(liveTimer);
    let drift = 0;
    const tick = () => {
      drift = Math.max(-22, Math.min(22, drift + (Math.random() - 0.5) * 6));
      const wave = Math.sin(Date.now() / 42000) * 12;
      $('#watchers').textContent =
        Math.max(7, Math.round(m.baseWatchers + wave + drift)).toLocaleString('en-US');
      $('#visitors').textContent =
        Math.round(m.baseVisitors + (Date.now() / 1000 % 100000) / 42).toLocaleString('en-US');
    };
    tick(); liveTimer = setInterval(tick, 4200);
  }

  /* ---------- modal + logo upload ---------- */
  const modal = $('#modal'), form = $('#mForm'), soldBox = $('#mSold');
  const drop = $('#drop'), input = $('#logoInput');
  const preview = $('#dropPreview'), dropImg = $('#dropImg'),
        dropEmpty = $('#dropEmpty'), dropClear = $('#dropClear');
  let current = null, currentZone = null;

  function showPreview(dataUrl) {
    if (dataUrl) {
      dropImg.src = dataUrl;
      preview.hidden = false; dropEmpty.hidden = true; dropClear.hidden = false;
    } else {
      dropImg.removeAttribute('src');
      preview.hidden = true; dropEmpty.hidden = false; dropClear.hidden = true;
    }
  }

  function readLogo(file) {
    if (!file || !/^image\//.test(file.type)) return;
    if (file.size > 2 * 1024 * 1024) { alert('Please keep the logo under 2 MB.'); return; }
    const fr = new FileReader();
    fr.onload = () => {
      logos[logoKey(market, current)] = fr.result;
      saveLogos();
      showPreview(fr.result);
      renderHotspots(market);
      renderSpotCards(market);
    };
    fr.readAsDataURL(file);
  }

  drop.addEventListener('click', e => { if (e.target !== dropClear) input.click(); });
  input.addEventListener('change', () => readLogo(input.files[0]));
  ['dragenter', 'dragover'].forEach(ev =>
    drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(ev =>
    drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', e => readLogo(e.dataTransfer.files[0]));
  dropClear.addEventListener('click', e => {
    e.stopPropagation();
    delete logos[logoKey(market, current)];
    saveLogos(); showPreview(null);
    renderHotspots(market); renderSpotCards(market);
  });

  function openModal(sp, z) {
    current = sp; currentZone = z;
    const sold = sp.status === 'sold';
    $('#mTitle').textContent = z.name;
    $('#mEyebrow').textContent = (sold ? 'Taken' : 'Available') + ' · ' + market.city;
    $('#mPrice').textContent = money(sp.price);
    form.hidden = sold;
    soldBox.hidden = !sold;

    if (sold) {
      $('#mSoldBrand').textContent = sp.brand;
      $('#mWait').href = 'mailto:' + S.site.contactEmail +
        '?subject=' + encodeURIComponent('Waiting list — ' + z.name + ' (' + market.city + ')') +
        '&body=' + encodeURIComponent(
          'Hi,\n\nI\'d like to join the waiting list for the "' + z.name +
          '" spot on the ' + market.city + ' ' + market.vehicle.model + '.\n\nBrand:\nIndustry:\nName:\n');
    } else {
      $('#mBid').value = sp.price;
      const dep = Math.max(500, Math.round(sp.price * 0.05 / 100) * 100);
      const d1 = $('#mDeposit'), d2 = $('#mBalance');
      if (d1) d1.textContent = money(dep);
      if (d2) d2.textContent = money(sp.price - dep);
      showPreview(logos[logoKey(market, sp)] || null);
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  $$('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const hasLogo = !!logos[logoKey(market, current)];
    const offer = Number(f.get('bid'));
    const dep = Math.max(500, Math.round(offer * 0.05 / 100) * 100);
    const body =
      'Hi,\n\nI want to reserve the "' + currentZone.name + '" surface on the ' +
      market.city + ' ' + market.vehicle.model + ' ' + market.vehicle.trim + '.\n\n' +
      'Brand: ' + f.get('brand') + '\n' +
      'Industry: ' + f.get('industry') + '\n' +
      'Contact: ' + f.get('name') + '\n' +
      'Email: ' + f.get('email') + '\n' +
      'Offer: ' + money(offer) + ' USD (12 months)\n' +
      'Reservation deposit (5%): ' + money(dep) + ' USD\n' +
      'Balance on signature: ' + money(offer - dep) + ' USD by bank transfer\n\n' +
      (hasLogo
        ? 'I previewed my logo on the site — please attach it to this email before sending.\n\n'
        : '') +
      'Please send the contract and wire instructions.\n\nThanks.\n';
    window.location.href = 'mailto:' + S.site.contactEmail +
      '?subject=' + encodeURIComponent('Reservation · ' + currentZone.name + ' · ' + market.city + ' — ' + f.get('brand')) +
      '&body=' + encodeURIComponent(body);
  });

  /* hero shortcut: open the first available spot */
  const tryBtn = $('#tryLogoBtn');
  if (tryBtn) tryBtn.addEventListener('click', () => {
    const sp = market.spots.find(s => s.status !== 'sold') || market.spots[0];
    openModal(sp, zoneOf(sp.id));
  });

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const navMobile = $('#navMobile');
  $('#burgerBtn').addEventListener('click', () => navMobile.classList.toggle('is-open'));
  $$('#navMobile a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('is-open')));

  /* ---------- theme ---------- */
  document.documentElement.dataset.theme = localStorage.getItem(LS_THEME) || 'light';
  $('#themeBtn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(LS_THEME, next);
  });

  render();
})();
