/*
 * Общий скрипт сайта: шапка, выбор сервера, живые таймеры, главная, события, промокоды.
 * Тексты берутся из i18n.js (t / pick). Калькулятор — в calc.js.
 */
(function () {
  'use strict';

  var S = window.Schedule, D = window.GENSHIN_DATA, C = window.GENSHIN_CODES, I = window.I18N;
  var t = I.t, pick = I.pick;

  var NAV = [
    ['index.html', 'nav.home'], ['events.html', 'nav.events'],
    ['calculator.html', 'nav.calc'], ['codes.html', 'nav.codes']
  ];
  var KIND_KEY = { banner: 'kind.banner', endgame: 'kind.endgame', event: 'kind.event', pass: 'kind.pass' };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Сервер ---------- */
  function getServer() {
    try { var v = localStorage.getItem('gs_server'); if (v && S.SERVERS[v]) { return v; } } catch (e) { /* нет доступа */ }
    return 'eu';
  }
  function setServer(v) { try { localStorage.setItem('gs_server', v); } catch (e) { /* ок */ } }
  function offset() { return S.SERVERS[getServer()].offset; }
  function srvName(id) { return t('srv.' + id); }

  var GS = { getServer: getServer, rerender: null };
  window.GS = GS;

  /* ---------- Время ---------- */
  function fmtLocal(ms) {
    try {
      return new Intl.DateTimeFormat(I.getLang() === 'ru' ? 'ru-RU' : 'en-GB',
        { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
    } catch (e) { return new Date(ms).toLocaleString(); }
  }
  function userTz() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'local'; } catch (e) { return 'local'; }
  }

  /* ---------- Шапка ---------- */
  function renderHeader() {
    var h = $('#site-header');
    if (!h) { return; }
    var page = document.body.getAttribute('data-page');
    var nav = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + esc(t(n[1])) + '</a>';
    }).join('');
    var cur = getServer();
    var opts = Object.keys(S.SERVERS).map(function (k) {
      var o = S.SERVERS[k].offset;
      return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + esc(srvName(k)) + ' (UTC' + (o >= 0 ? '+' : '') + o + ')</option>';
    }).join('');
    h.innerHTML = '<div class="container bar">' +
      '<a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">◆</span>Teyvat Tools</a>' +
      '<nav aria-label="' + esc(t('nav.aria')) + '">' + nav + '</nav>' +
      '<label class="server">' + esc(t('server')) + ' <select id="server-select">' + opts + '</select></label></div>';
    $('#server-select').addEventListener('change', function (e) {
      setServer(e.target.value);
      renderHeader();
      if (GS.rerender) { GS.rerender(); }
      document.dispatchEvent(new CustomEvent('gs:server'));
    });
  }

  /* ---------- Живые таймеры ---------- */
  var dirty = false;
  function tick() {
    var now = Date.now();
    $$('[data-cd]').forEach(function (el) {
      var ms = (+el.getAttribute('data-cd')) - now;
      if (ms <= 0) {
        el.textContent = S.formatDuration(0);
        if (!el.__done) { el.__done = true; dirty = true; }
      } else { el.textContent = S.formatDuration(ms); }
    });
    $$('[data-progress]').forEach(function (el) {
      var p = el.getAttribute('data-progress').split(',');
      el.style.width = Math.max(0, Math.min(100, ((now - +p[0]) / (+p[1] - +p[0])) * 100)).toFixed(1) + '%';
    });
    if (dirty) { dirty = false; if (GS.rerender) { GS.rerender(); } }
  }

  /* ---------- Плитки и карточки ---------- */
  function tile(label, chip, target, sub, predicted) {
    return '<div class="tile"><span class="tile-label">' + esc(label) +
      (chip ? ' <em class="chip' + (predicted ? ' pred' : '') + '">' + esc(chip) + '</em>' : '') + '</span>' +
      '<b class="tile-cd" data-cd="' + target + '">…</b><span class="tile-sub">' + esc(sub) + '</span></div>';
  }

  function egTile(evs, group, title, off) {
    var cur = evs.filter(function (e) { return e.group === group && e.status === 'current'; })[0];
    var next = evs.filter(function (e) { return e.group === group && e.status === 'upcoming'; })
      .sort(function (a, b) { return a.start - b.start; })[0];
    if (cur) {
      return tile(title, cur.predicted ? t('chip.pred') : t('chip.end'), cur.end, t('t.reset', { d: S.fmtWall(cur.end, off) }), cur.predicted);
    }
    if (next) {
      return tile(title, next.predicted ? t('chip.pred') : t('chip.start'), next.start, t('t.startat', { d: S.fmtWall(next.start, off) }), next.predicted);
    }
    return '<div class="tile"><span class="tile-label">' + esc(title) + '</span><span class="tile-sub">' + esc(t('t.nodata')) + '</span></div>';
  }

  function coverOf(ev) { return ev.image || ('images/cover-' + ev.kind + '.svg'); }

  function card(ev, off) {
    var timer;
    if (ev.status === 'current') {
      timer = '<div class="cd-row"><span class="cd-label">' + esc(t('cd.end')) + '</span><b data-cd="' + ev.end + '">…</b></div>' +
        '<div class="bar-progress" aria-hidden="true"><i data-progress="' + ev.start + ',' + ev.end + '"></i></div>';
    } else if (ev.status === 'upcoming') {
      timer = '<div class="cd-row"><span class="cd-label">' + esc(t('cd.start')) + '</span><b data-cd="' + ev.start + '">…</b></div>';
    } else {
      timer = '<div class="cd-row"><span class="cd-label">' + esc(t('cd.ended', { d: S.fmtWall(ev.end, off) })) + '</span></div>';
    }
    var d = ev.details;
    var details = d ? '<dl class="details">' +
      '<div><dt>' + esc(t('d.elements')) + '</dt><dd>' + esc(pick(d.elements)) + '</dd></div>' +
      '<div><dt>' + esc(t('d.opening')) + '</dt><dd>' + esc(pick(d.opening)) + '</dd></div>' +
      '<div><dt>' + esc(t('d.guests')) + '</dt><dd>' + esc(pick(d.guests)) + '</dd></div></dl>' : '';
    var badges = '<span class="badge">' + esc(t(KIND_KEY[ev.kind] || 'kind.event')) + '</span>' +
      (ev.status === 'current' ? '<span class="badge live">' + esc(t('badge.live')) + '</span>' : '') +
      (ev.predicted ? '<span class="badge pred" title="' + esc(t('badge.pred.t')) + '">' + esc(t('badge.pred')) + '</span>' : '') +
      (ev.approx ? '<span class="badge approx" title="' + esc(t('badge.approx.t')) + '">' + esc(t('badge.approx')) + '</span>' : '');
    var sub = pick(ev.sub);
    return '<article class="card" data-kind="' + esc(ev.kind) + '" data-status="' + ev.status + '">' +
      '<img class="cover" src="' + esc(coverOf(ev)) + '" alt="" loading="lazy" width="800" height="320">' +
      '<div class="card-body"><div class="card-top">' + badges + '</div>' +
      '<h3>' + esc(pick(ev.title)) + '</h3>' +
      (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') +
      timer + details +
      '<p class="times"><span>' + esc(t('card.server', { s: srvName(getServer()) })) + ': ' + esc(S.fmtWall(ev.start, off)) + ' → ' + esc(S.fmtWall(ev.end, off)) + '</span>' +
      '<span>' + esc(userTz()) + ': ' + esc(fmtLocal(ev.start)) + ' → ' + esc(fmtLocal(ev.end)) + '</span></p></div></article>';
  }

  function byEnd(a, b) { return a.end - b.end; }
  function byStart(a, b) { return a.start - b.start; }
  function dataNote() { return t('datanote', { u: D.updated }); }

  /* ---------- Главная ---------- */
  function renderHome() {
    var now = Date.now(), sid = getServer(), off = offset();
    var evs = S.buildEvents(D, now, sid);
    var pi = S.patchInfo(D, now);
    $('#tiles').innerHTML = [
      tile(t('t.daily'), '', S.nextDaily(now, sid), t('t.daily.sub'), false),
      tile(t('t.weekly'), '', S.nextWeekly(now, sid), t('t.weekly.sub'), false),
      egTile(evs, 'abyss', t('g.abyss'), off),
      egTile(evs, 'theater', t('g.theater'), off),
      egTile(evs, 'stygian', t('g.stygian'), off),
      tile(t('t.patch', { v: pi.next || '?' }), pi.confirmed ? '' : t('chip.pred'), pi.at,
        t('t.patch.sub', { d: S.fmtWall(pi.at, S.GLOBAL_OFFSET) }), !pi.confirmed)
    ].join('');

    var current = evs.filter(function (e) { return e.status === 'current' && e.kind !== 'endgame'; });
    var banners = current.filter(function (e) { return e.kind === 'banner'; }).sort(byEnd);
    var others = current.filter(function (e) { return e.kind !== 'banner'; }).sort(byEnd);
    var nowList = banners.concat(others);
    $('#now').innerHTML = nowList.length ? nowList.map(function (e) { return card(e, off); }).join('')
      : '<p class="empty">' + esc(t('empty.now')) + '</p>';

    var soon = evs.filter(function (e) {
      return e.status === 'upcoming' && e.kind !== 'endgame' && (e.start - now) < 30 * S.DAY;
    }).sort(byStart);
    $('#soon').innerHTML = soon.length ? soon.map(function (e) { return card(e, off); }).join('')
      : '<p class="empty">' + esc(t('empty.soon')) + '</p>';

    $('#data-note').innerHTML = (banners.length === 0
      ? '<span class="warn-box" style="display:block;margin-bottom:12px">' + esc(t('stale')) + '</span>' : '') + esc(dataNote());
    tick();
  }

  /* ---------- События ---------- */
  var evState = { status: 'current', kind: 'all' };
  function renderEvents() {
    var now = Date.now(), sid = getServer(), off = offset();
    var evs = S.buildEvents(D, now, sid).filter(function (e) {
      if (e.status === 'ended' && now - e.end > 60 * S.DAY) { return false; }
      if (evState.kind !== 'all' && e.kind !== evState.kind) { return false; }
      return evState.status === 'all' || e.status === evState.status;
    });
    var order = { current: 0, upcoming: 1, ended: 2 };
    evs.sort(function (a, b) {
      if (order[a.status] !== order[b.status]) { return order[a.status] - order[b.status]; }
      if (a.status === 'upcoming') { return a.start - b.start; }
      if (a.status === 'ended') { return b.end - a.end; }
      return a.end - b.end;
    });
    $('#events-list').innerHTML = evs.length ? evs.map(function (e) { return card(e, off); }).join('')
      : '<p class="empty">' + esc(t('empty.filter')) + '</p>';
    $$('#status-seg button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === evState.status));
    });
    $('#data-note').textContent = dataNote();
    tick();
  }
  function initEvents() {
    $('#status-seg').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) { return; }
      evState.status = b.getAttribute('data-v'); renderEvents();
    });
    $('#kind-select').addEventListener('change', function (e) { evState.kind = e.target.value; renderEvents(); });
    GS.rerender = renderEvents;
    renderEvents();
  }

  /* ---------- Промокоды ---------- */
  function renderCodes() {
    var showExpired = $('#show-expired').checked;
    var items = C.codes.filter(function (c) { return showExpired || c.status !== 'expired'; });
    $('#codes-list').innerHTML = items.length ? items.map(function (c) {
      var url = 'https://genshin.hoyoverse.com/en/gift?code=' + encodeURIComponent(c.code);
      return '<div class="code-row" data-status="' + esc(c.status) + '">' +
        '<div class="code-main"><code>' + esc(c.code) + '</code>' +
        '<p>' + esc(pick(c.reward)) + '</p>' +
        '<p>' + esc(t('codes.st.' + c.status)) + (c.added ? ' · ' + esc(t('codes.added', { d: c.added })) : '') + ' · ' + esc(c.source) + '</p></div>' +
        '<div class="code-actions">' +
        '<button class="btn ghost" type="button" data-copy="' + esc(c.code) + '">' + esc(t('codes.copy')) + '</button>' +
        (c.status !== 'expired' ? '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(t('codes.go')) + '</a>' : '') +
        '</div></div>';
    }).join('') : '<p class="empty">' + esc(t('codes.empty')) + '</p>';
    $('#codes-lead').textContent = t('codes.lead', { date: C.checked });
  }
  function copyText(text, btn) {
    function done() {
      btn.textContent = t('codes.copied');
      setTimeout(function () { btn.textContent = t('codes.copy'); }, 1500);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* не вышло */ }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fallback); }
    else { fallback(); }
  }
  function initCodes() {
    $('#show-expired').addEventListener('change', renderCodes);
    $('#codes-list').addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (b) { copyText(b.getAttribute('data-copy'), b); }
    });
    GS.rerender = renderCodes;
    renderCodes();
  }

  /* ---------- Старт ---------- */
  var page = document.body.getAttribute('data-page');
  renderHeader();
  if (page === 'index.html') { GS.rerender = renderHome; renderHome(); }
  else if (page === 'events.html') { initEvents(); }
  else if (page === 'codes.html') { initCodes(); }

  document.addEventListener('gs:lang', function () {
    renderHeader();
    if (GS.rerender) { GS.rerender(); }
  });
  setInterval(tick, 1000);
  tick();
})();
