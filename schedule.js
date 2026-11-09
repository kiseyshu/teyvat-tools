/*
 * Расписание: превращает данные из events-data.js в список событий с реальными моментами времени.
 *
 * Все даты в events-data.js записаны по времени СЕРВЕРА (Genshin сбрасывает всё по серверному времени):
 *   Европа UTC+1, Азия UTC+8, Америка UTC-5 — часы одинаковые, а моменты во времени разные.
 * Исключение — выход патча: он глобальный, 06:00 по UTC+8 (флаг global).
 *
 * Повторяющиеся циклы считаются правилами (их не нужно вносить руками):
 *   Бездна — каждое 16-е число 04:00 сервера; Театр — каждое 1-е число 04:00;
 *   Натиск — от +7 дней после патча (10:00) до 04:00 дня перед следующим патчем; патч — каждые 42 дня.
 * События после data.confirmedUntil помечаются как «прогноз».
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.Schedule = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var HOUR = 3600000, MIN = 60000, DAY = 86400000;
  var GLOBAL_OFFSET = 8;
  var SERVERS = {
    eu:   { id: 'eu',   name: 'Европа',  offset: 1 },
    asia: { id: 'asia', name: 'Азия',    offset: 8 },
    am:   { id: 'am',   name: 'Америка', offset: -5 }
  };
  var MONTHS_ALL = {
    ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  var UNITS_ALL = {
    ru: { d: 'д', h: 'ч', m: 'мин', s: 'с' },
    en: { d: 'd', h: 'h', m: 'min', s: 's' }
  };
  var LANG = 'ru';
  function setLang(l) { LANG = MONTHS_ALL[l] ? l : 'ru'; }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function parseWall(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s);
    if (!m) { throw new Error('Неверная дата: ' + s + ' (нужен формат ГГГГ-ММ-ДДTЧЧ:ММ)'); }
    return { y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5] };
  }

  // «Стенные» часы сервера -> момент времени (мс). Конец вида ЧЧ:59 округляется до следующей минуты.
  function wallToMs(s, offsetH, isEnd) {
    var p = parseWall(s);
    var t = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi) - offsetH * HOUR;
    if (isEnd && p.mi === 59) { t += MIN; }
    return t;
  }

  function fmtWall(ms, offsetH) {
    var d = new Date(ms + offsetH * HOUR);
    var mon = MONTHS_ALL[LANG][d.getUTCMonth()];
    var time = pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
    return LANG === 'en' ? mon + ' ' + d.getUTCDate() + ', ' + time : d.getUTCDate() + ' ' + mon + ', ' + time;
  }

  function formatDuration(ms) {
    var u = UNITS_ALL[LANG];
    if (ms <= 0) { return '0 ' + u.m; }
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    if (d > 0) { return d + ' ' + u.d + ' ' + h + ' ' + u.h + ' ' + m + ' ' + u.m; }
    if (h > 0) { return h + ' ' + u.h + ' ' + m + ' ' + u.m + ' ' + s + ' ' + u.s; }
    return m + ' ' + u.m + ' ' + s + ' ' + u.s;
  }

  function statusOf(now, start, end) {
    if (now < start) { return 'upcoming'; }
    if (now >= end) { return 'ended'; }
    return 'current';
  }

  function monthKey(year, month0) {
    var d = new Date(Date.UTC(year, month0, 1));
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1);
  }

  function make(base, start, end, predicted, now) {
    var ev = {};
    for (var k in base) { if (Object.prototype.hasOwnProperty.call(base, k)) { ev[k] = base[k]; } }
    ev.start = start;
    ev.end = end;
    ev.predicted = !!predicted;
    ev.status = statusOf(now, start, end);
    return ev;
  }

  function buildEvents(data, now, serverId) {
    var off = SERVERS[serverId].offset;
    var confirmedUntil = wallToMs(data.confirmedUntil, off, false);
    var list = [];

    data.events.forEach(function (e) {
      var o = e.global ? GLOBAL_OFFSET : off;
      list.push(make(e, wallToMs(e.start, o, false), wallToMs(e.end, o, true), false, now));
    });

    var local = new Date(now + off * HOUR);
    var Y = local.getUTCFullYear(), M = local.getUTCMonth();
    var k;
    for (k = -2; k <= 3; k++) {
      var key = monthKey(Y, M + k);
      var a0 = Date.UTC(Y, M + k, 16, 4) - off * HOUR;
      var a1 = Date.UTC(Y, M + k + 1, 16, 4) - off * HOUR;
      list.push(make({
        id: 'abyss-' + key, group: 'abyss', kind: 'endgame',
        title: { ru: 'Витая Бездна', en: 'Spiral Abyss' }, sub: { ru: 'Сброс 16-го числа в 04:00 по времени сервера', en: 'Resets on the 16th at 04:00 server time' }
      }, a0, a1, a0 > confirmedUntil, now));

      var t0 = Date.UTC(Y, M + k, 1, 4) - off * HOUR;
      var t1 = Date.UTC(Y, M + k + 1, 1, 4) - off * HOUR;
      var tkey = monthKey(Y, M + k);
      list.push(make({
        id: 'theater-' + tkey, group: 'theater', kind: 'endgame',
        title: { ru: 'Театр (Imaginarium Theater)', en: 'Imaginarium Theater' }, sub: { ru: 'Сброс 1-го числа в 04:00 по времени сервера', en: 'Resets on the 1st at 04:00 server time' },
        details: (data.theater && data.theater[tkey]) || null
      }, t0, t1, t0 > confirmedUntil, now));
    }

    var p = parseWall(data.patch.anchor);
    var cyc = data.patch.cycleDays;
    for (k = -2; k <= 3; k++) {
      var s0 = Date.UTC(p.y, p.mo - 1, p.d + k * cyc + 7, 10, 0) - off * HOUR;
      var s1 = Date.UTC(p.y, p.mo - 1, p.d + (k + 1) * cyc - 1, 4, 0) - off * HOUR;
      list.push(make({
        id: 'stygian-' + k, group: 'stygian', kind: 'endgame',
        title: { ru: 'Натиск (Stygian Onslaught)', en: 'Stygian Onslaught' }, sub: { ru: 'Идёт со 2-й недели патча до 04:00 перед следующим патчем', en: 'Runs from week 2 of a patch until 04:00 before the next patch' }
      }, s0, s1, s0 > confirmedUntil, now));
    }
    return list;
  }

  function nextDaily(now, serverId) {
    var off = SERVERS[serverId].offset;
    var l = new Date(now + off * HOUR);
    var t = Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate(), 4) - off * HOUR;
    while (t <= now) { t += DAY; }
    return t;
  }

  function nextWeekly(now, serverId) {
    var off = SERVERS[serverId].offset;
    var l = new Date(now + off * HOUR);
    var t0 = Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate(), 4) - off * HOUR;
    for (var i = 0; i < 8; i++) {
      var t = t0 + i * DAY;
      if (t > now && new Date(t + off * HOUR).getUTCDay() === 1) { return t; }
    }
    return t0 + 7 * DAY;
  }

  // Следующий патч (глобальный момент) и номера версий по списку data.patch.versions
  function patchInfo(data, now) {
    var p = parseWall(data.patch.anchor);
    var anchor = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi) - GLOBAL_OFFSET * HOUR;
    var cyc = data.patch.cycleDays * DAY;
    var n = now < anchor ? 0 : Math.floor((now - anchor) / cyc) + 1;
    var v = data.patch.versions || [];
    return {
      at: anchor + n * cyc,
      current: n > 0 ? v[n - 1] : null,
      next: v[n] || null,
      confirmed: n <= (data.patch.confirmedPatches || 0)
    };
  }

  return {
    SERVERS: SERVERS,
    GLOBAL_OFFSET: GLOBAL_OFFSET,
    HOUR: HOUR, DAY: DAY,
    setLang: setLang,
    wallToMs: wallToMs,
    fmtWall: fmtWall,
    formatDuration: formatDuration,
    buildEvents: buildEvents,
    nextDaily: nextDaily,
    nextWeekly: nextWeekly,
    patchInfo: patchInfo
  };
});
