/*
 * Интерфейс калькулятора круток. Математика — в gacha-core.js.
 * Ничего не читает из игры: все числа вводятся вручную, данные никуда не отправляются.
 */
(function () {
  'use strict';

  var G = window.GachaCore;
  var S = window.Schedule;
  var D = window.GENSHIN_DATA;
  var PRIMO = 160;
  var lastCdf = null, lastPulls = 0;

  function $(id) { return document.getElementById(id); }
  function readInt(id, min, max, def) {
    var v = parseInt($(id).value, 10);
    if (isNaN(v)) { v = def; }
    return Math.max(min, Math.min(max, v));
  }
  function fmtInt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function pct(p) {
    var ru = window.I18N.getLang() === 'ru';
    var d = ru ? ',' : '.', sp = ru ? ' ' : '';
    if (p >= 0.9995) { return '>99' + d + '9' + sp + '%'; }
    if (p < 0.0005) { return '<0' + d + '1' + sp + '%'; }
    return (p * 100).toFixed(1).replace('.', d) + sp + '%';
  }

  var type = 'character';
  var I = window.I18N, t = I.t;

  function syncType() {
    var weapon = type === 'weapon';
    var k = weapon ? 'w' : 'c';
    $('pity').max = String(G.MODELS[type].hard - 1);
    $('copies').max = weapon ? '5' : '7';
    $('win-row').hidden = weapon;
    $('guar-label').textContent = t('calc.guar.' + k);
    $('copies-label').textContent = t('calc.copies.' + k);
    $('copies-hint').textContent = t('calc.copies.hint.' + k);
    $('pity-hint').textContent = t('calc.pity.hint.' + k);
    Array.prototype.forEach.call(document.querySelectorAll('#type-seg button'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === type));
    });
  }

  function fillBanners() {
    var sid = window.GS ? window.GS.getServer() : 'eu';
    var off = S.SERVERS[sid].offset;
    var now = Date.now();
    var evs = S.buildEvents(D, now, sid).filter(function (e) { return e.kind === 'banner' && e.status !== 'ended'; })
      .sort(function (a, b) { return a.end - b.end; });
    var seen = {};
    var html = '<option value="">' + t('calc.manual') + '</option>';
    evs.forEach(function (e) {
      var title = I.pick(e.title);
      var key = e.end + '|' + title;
      if (seen[key]) { return; }
      seen[key] = true;
      var days = Math.max(0, Math.ceil((e.end - now) / S.DAY));
      html += '<option value="' + days + '">' + title.replace(/</g, '&lt;') + ' — ' + t('calc.until', { d: S.fmtWall(e.end, off) }) + ' (' + days + ' ' + t('calc.days.short') + ')</option>';
    });
    $('banner').innerHTML = html;
  }

  function run() {
    var weapon = type === 'weapon';
    var hard = G.MODELS[type].hard;
    var pity = readInt('pity', 0, hard - 1, 0);
    var copies = readInt('copies', 1, weapon ? 5 : 7, 1);
    var guar = $('guar').checked;
    var win = weapon ? G.WEAPON_FEATURED : (+$('win').value) / 100;
    var fates = readInt('fates', 0, 5000, 0);
    var primos = readInt('primos', 0, 2000000, 0);
    var days = readInt('days', 0, 400, 0);
    var income = readInt('income', 0, 1000, 60);
    var oneoff = readInt('oneoff', 0, 200000, 0);
    var welkin = $('welkin').checked;

    var extra = days * income + (welkin ? days * 90 : 0) + oneoff;
    var pulls = fates + Math.floor((primos + extra) / PRIMO);

    var cdf = G.distribution({ type: type, pity: pity, guaranteed: guar, copies: copies, winProb: win });
    lastCdf = cdf;
    lastPulls = pulls;

    var p = G.probWithin(cdf, pulls);
    var q90 = G.quantile(cdf, 0.9) || cdf.length - 1;
    var cls = p >= 0.9 ? 'ok' : (p >= 0.5 ? 'warn' : 'bad');
    var vk = p >= 0.99 ? 'res.v.99' : p >= 0.9 ? 'res.v.90' : p >= 0.5 ? 'res.v.50' : 'res.v.low';
    var target = weapon ? 'R' + copies : 'C' + (copies - 1);
    var meanPulls = G.mean(cdf);

    var lines = ['<div>' + t('res.have', { n: '<b>' + fmtInt(pulls) + '</b>' }) + ' ' + t('res.mean', { n: '<b>' + meanPulls.toFixed(0) + '</b>' }) + '</div>'];
    if (pulls < q90) {
      lines.push('<div>' + t('res.short', { q: '<b>' + q90 + '</b>', n: '<b>' + (q90 - pulls) + '</b>', p: fmtInt((q90 - pulls) * PRIMO) }) + '</div>');
    } else {
      lines.push('<div>' + t('res.enough', { q: '<b>' + q90 + '</b>' }) + '</div>');
    }

    $('result').innerHTML =
      '<div class="muted">' + t('res.chance', { x: target }) + '</div>' +
      '<div class="big-prob">' + pct(p) + '</div>' +
      '<div class="verdict ' + cls + '">' + t(vk) + '</div>' +
      '<div class="muted" style="margin-top:10px">' + lines.join('') + '</div>';

    var rows = [0.5, 0.75, 0.9, 0.95, 0.99].map(function (q) {
      var n = G.quantile(cdf, q);
      var enough = pulls >= n;
      return '<tr><td>' + Math.round(q * 100) + '%</td><td>' + n + '</td><td>' + fmtInt(n * PRIMO) + '</td>' +
        '<td class="' + (enough ? 'yes' : 'no') + '">' + (enough ? t('res.ok') : t('res.lack', { n: n - pulls })) + '</td></tr>';
    }).join('');
    var extraLines = '';
    if (!weapon) {
      var worst = G.worstCase(type, pity, guar, copies);
      extraLines += '<p class="muted hint">' + t('res.worst', { n: worst, p: fmtInt(worst * PRIMO) }) + '</p>';
    }
    if (extra > 0) { extraLines += '<p class="muted hint">' + t('res.future', { n: fmtInt(Math.floor(extra / PRIMO)) }) + '</p>'; }
    $('more-table').innerHTML = '<table><thead><tr><th>' + t('res.th.conf') + '</th><th>' + t('res.th.pulls') + '</th><th>' +
      t('res.th.primos') + '</th><th>' + t('res.th.have') + '</th></tr></thead><tbody>' + rows + '</tbody></table>' + extraLines;
    drawChart();
  }

  function drawChart() {
    var cv = $('chart');
    if (!cv || !lastCdf || !cv.getContext) { return; }
    var cdf = lastCdf;
    var dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth || 600, h = 240;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var css = getComputedStyle(document.documentElement);
    var cLine = css.getPropertyValue('--line').trim() || '#2c3563';
    var cMuted = css.getPropertyValue('--muted').trim() || '#9ba4cc';
    var cGold = css.getPropertyValue('--gold').trim() || '#f3c86d';
    var cAccent = css.getPropertyValue('--accent').trim() || '#7ea6ff';

    var xMax = G.quantile(cdf, 0.999) || (cdf.length - 1);
    xMax = Math.max(10, Math.min(cdf.length - 1, Math.max(xMax, Math.min(lastPulls + 5, cdf.length - 1))));
    var L = 44, R = 12, T = 12, B = 28;
    var pw = w - L - R, ph = h - T - B;
    function X(n) { return L + (n / xMax) * pw; }
    function Y(p) { return T + (1 - p) * ph; }

    ctx.font = '12px system-ui, sans-serif';
    ctx.lineWidth = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach(function (g) {
      ctx.strokeStyle = cLine;
      ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(w - R, Y(g)); ctx.stroke();
      ctx.fillStyle = cMuted;
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(g * 100) + '%', L - 6, Y(g) + 4);
    });
    var step = xMax > 300 ? 60 : (xMax > 150 ? 30 : 20);
    ctx.textAlign = 'center';
    for (var n = 0; n <= xMax; n += step) {
      ctx.fillStyle = cMuted;
      ctx.fillText(String(n), X(n), h - 8);
    }

    ctx.strokeStyle = cAccent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= xMax; i++) {
      if (i === 0) { ctx.moveTo(X(0), Y(0)); } else { ctx.lineTo(X(i), Y(cdf[i])); }
    }
    ctx.stroke();

    if (lastPulls > 0) {
      var xp = X(Math.min(lastPulls, xMax));
      ctx.strokeStyle = cGold;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(xp, T); ctx.lineTo(xp, T + ph); ctx.stroke();
      ctx.setLineDash([]);
      var py = Y(G.probWithin(cdf, lastPulls));
      ctx.fillStyle = cGold;
      ctx.beginPath(); ctx.arc(xp, py, 4, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = xp > w - 120 ? 'right' : 'left';
      ctx.fillText(window.I18N.t('chart.have', { n: lastPulls }), xp + (xp > w - 120 ? -8 : 8), T + 12);
    }
  }

  function init() {
    syncType();
    fillBanners();
    $('type-seg').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) { return; }
      type = b.getAttribute('data-v');
      syncType(); run();
    });
    $('banner').addEventListener('change', function (e) {
      if (e.target.value !== '') { $('days').value = e.target.value; }
      run();
    });
    ['pity', 'copies', 'guar', 'win', 'fates', 'primos', 'days', 'income', 'oneoff', 'welkin'].forEach(function (id) {
      $(id).addEventListener('input', run);
      $(id).addEventListener('change', run);
    });
    window.addEventListener('resize', drawChart);
    document.addEventListener('gs:server', fillBanners);
    document.addEventListener('gs:lang', function () { syncType(); fillBanners(); run(); });
    run();
  }

  init();
})();
