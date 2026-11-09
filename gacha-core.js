/*
 * Ядро калькулятора круток. Чистая математика, без DOM — работает и в браузере, и в Node.
 *
 * Модель (данные сообщества по датамайнам; официально HoYoverse публикует только «гарантию»):
 *  - Баннер персонажа: базовый шанс 5★ = 0,6 %, «мягкий пити» с 74-й крутки (+6 % за крутку), гарантия на 90-й.
 *  - Оружейный баннер: базовый шанс 5★ = 0,7 %, «мягкий пити» с 63-й крутки (+7 % за крутку), в игре заявлена гарантия на 80-й.
 *  - 50/50: шанс, что первая 5★ окажется целевым персонажем. После проигрыша следующая 5★ гарантированно целевая.
 *    С версии 5.0 действует «Захват сияния» (Capturing Radiance): итоговый шанс заявлен как «55/45».
 *    Точный механизм не раскрыт, поэтому здесь он упрощён до независимых 55 % на каждый 50/50.
 *  - Оружие: 75 % 5★ — «рекомендованные» (по 37,5 % на каждое из двух). С 5.0 для гарантии
 *    выбранного оружия достаточно ОДНОГО очка судьбы (Fate Point), очки сбрасываются при смене баннера.
 *
 * Если HoYoverse изменит правила — правь константы MODELS и WEAPON_FEATURED ниже.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.GachaCore = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MODELS = {
    character: { base: 0.006, softStart: 74, step: 0.06, hard: 90 },
    weapon:    { base: 0.007, softStart: 63, step: 0.07, hard: 80 }
  };
  var WEAPON_FEATURED = 0.375; // шанс именно выбранного оружия, если очка судьбы ещё нет

  // Шанс 5★ на n-й крутке после последней 5★ (n считается с 1)
  function rate(type, n) {
    var m = MODELS[type];
    if (n >= m.hard) { return 1; }
    if (n < m.softStart) { return m.base; }
    return Math.min(1, m.base + m.step * (n - m.softStart + 1));
  }

  /*
   * Точное распределение (динамическое программирование, без симуляции).
   * opts: { type, pity, guaranteed, copies, winProb, maxPulls }
   *   guaranteed — для персонажа: следующая 5★ гарантированно целевая; для оружия: есть очко судьбы.
   * Возвращает cdf[n] — вероятность получить нужное число копий не позже чем за n круток.
   */
  function distribution(opts) {
    var m = MODELS[opts.type];
    var K = opts.copies;
    var hard = m.hard;
    var win = opts.type === 'weapon' ? WEAPON_FEATURED : opts.winProb;
    var maxPulls = opts.maxPulls || K * 2 * hard;
    var size = hard * 2 * K; // индекс состояния: ((pity * 2) + guar) * K + copies
    var cur = new Float64Array(size);
    var nxt = new Float64Array(size);
    var cdf = new Float64Array(maxPulls + 1);
    var done = 0;
    cur[((opts.pity * 2) + (opts.guaranteed ? 1 : 0)) * K] = 1;

    for (var n = 1; n <= maxPulls; n++) {
      nxt.fill(0);
      for (var p = 0; p < hard; p++) {
        var r = rate(opts.type, p + 1);
        for (var g = 0; g < 2; g++) {
          var base = ((p * 2) + g) * K;
          for (var c = 0; c < K; c++) {
            var mass = cur[base + c];
            if (!mass) { continue; }
            var hit = mass * r;
            var miss = mass - hit;
            if (miss > 0 && p + 1 < hard) { nxt[(((p + 1) * 2) + g) * K + c] += miss; }
            if (hit > 0) {
              if (g === 1) {
                if (c + 1 === K) { done += hit; } else { nxt[c + 1] += hit; }
              } else {
                var w = hit * win;
                var l = hit - w;
                if (c + 1 === K) { done += w; } else { nxt[c + 1] += w; }
                nxt[K + c] += l; // проиграли 50/50: pity=0, гарантия=1, копий столько же
              }
            }
          }
        }
      }
      var tmp = cur; cur = nxt; nxt = tmp;
      cdf[n] = done;
    }
    return cdf;
  }

  function mean(cdf) {
    var s = 0;
    for (var n = 0; n < cdf.length; n++) { s += 1 - cdf[n]; }
    return s;
  }

  function quantile(cdf, q) {
    for (var n = 1; n < cdf.length; n++) { if (cdf[n] >= q - 1e-12) { return n; } }
    return null;
  }

  function probWithin(cdf, pulls) {
    if (pulls <= 0) { return 0; }
    return cdf[Math.min(pulls, cdf.length - 1)];
  }

  // Гарантированный максимум круток (только для баннера персонажа: 100 % на 90-й крутке)
  function worstCase(type, pity, guaranteed, copies) {
    var hard = MODELS[type].hard;
    var first = guaranteed ? (hard - pity) : (hard - pity) + hard;
    return first + (copies - 1) * 2 * hard;
  }

  return {
    MODELS: MODELS,
    WEAPON_FEATURED: WEAPON_FEATURED,
    rate: rate,
    distribution: distribution,
    mean: mean,
    quantile: quantile,
    probWithin: probWithin,
    worstCase: worstCase
  };
});
