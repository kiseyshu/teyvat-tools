/*
 * Мультиязычность. Языки: RU и EN. Чтобы добавить ещё один (например, украинский):
 *  1) добавь { id: 'uk', label: 'UK', name: 'Українська' } в LANGS;
 *  2) скопируй блок `en: {…}` в DICT под именем `uk` и переведи значения;
 *  3) в schedule.js добавь названия месяцев и единиц времени для нового языка (MONTHS_ALL, UNITS_ALL);
 *  4) в events-data.js и codes-data.js добавь поле `uk` в объекты {ru, en}.
 * Незаполненный ключ автоматически берётся из русского словаря.
 */
(function () {
  'use strict';

  var LANGS = [
    { id: 'ru', label: 'RU', name: 'Русский' },
    { id: 'en', label: 'EN', name: 'English' }
  ];

  var DICT = {
    ru: {
      'lang.label': 'Язык',
      'nav.home': 'Главная', 'nav.events': 'События и таймеры', 'nav.calc': 'Калькулятор круток', 'nav.codes': 'Промокоды',
      'nav.aria': 'Разделы сайта',
      'server': 'Сервер',
      'srv.eu': 'Европа', 'srv.asia': 'Азия', 'srv.am': 'Америка',
      'skip': 'К содержимому',
      'footer': 'Неофициальный фанатский сайт. Не связан с HoYoverse и не одобрен ею. Genshin Impact — товарный знак HoYoverse. Сайт ничего не читает из игры и не запрашивает данные аккаунта.',

      'title.home': 'Teyvat Tools — таймеры Genshin Impact, калькулятор круток, промокоды',
      'title.events': 'События и таймеры Genshin Impact — Бездна, Театр, Натиск, баннеры',
      'title.calc': 'Калькулятор круток Genshin Impact — шанс получить персонажа и оружие',
      'title.codes': 'Промокоды Genshin Impact',

      'home.h1': 'Genshin Impact: таймеры, баннеры и калькулятор круток',
      'home.lead': 'Сколько осталось до сброса Бездны, Театра и Натиска, какие баннеры идут сейчас и хватит ли круток на нужного персонажа. Сервер выбирается в шапке, время показывается и по серверу, и по твоему часовому поясу.',
      'home.timers': 'Таймеры', 'home.now': 'Сейчас идёт', 'home.soon': 'Скоро',
      'cta.calc.t': 'Калькулятор круток', 'cta.calc.d': 'Шанс получить персонажа или оружие и сколько примогемов копить.',
      'cta.events.t': 'Все события', 'cta.events.d': 'Баннеры, пропуск, события и эндгейм с фильтрами.',
      'cta.codes.t': 'Промокоды', 'cta.codes.d': 'Рабочие коды с кнопкой копирования и ссылкой на активацию.',

      't.daily': 'Ежедневный сброс', 't.daily.sub': 'каждый день в 04:00 сервера',
      't.weekly': 'Еженедельный сброс', 't.weekly.sub': 'по понедельникам в 04:00 сервера',
      'g.abyss': 'Витая Бездна', 'g.theater': 'Театр', 'g.stygian': 'Натиск',
      'g.abyss.sub': 'Сброс 16-го числа в 04:00 по времени сервера',
      'g.theater.sub': 'Сброс 1-го числа в 04:00 по времени сервера',
      'g.stygian.sub': 'Идёт со 2-й недели патча до 04:00 перед следующим патчем',
      'chip.end': 'до конца', 'chip.start': 'до старта', 'chip.pred': 'прогноз',
      't.reset': 'сброс: {d}', 't.startat': 'старт: {d}',
      't.patch': 'Патч {v}', 't.patch.sub': 'выход {d} по UTC+8', 't.nodata': 'нет данных',

      'kind.banner': 'Баннер', 'kind.endgame': 'Эндгейм', 'kind.event': 'Событие', 'kind.pass': 'Пропуск',
      'badge.live': 'идёт',
      'badge.pred': 'прогноз', 'badge.pred.t': 'Дата посчитана по обычному циклу, официально не подтверждена',
      'badge.approx': 'время ориентировочно', 'badge.approx.t': 'Время окончания взято по шаблону прошлых патчей',
      'cd.end': 'До конца', 'cd.start': 'До начала', 'cd.ended': 'Завершено {d}',
      'card.server': 'Сервер {s}',
      'd.elements': 'Стихии', 'd.opening': 'Открывающие персонажи', 'd.guests': 'Приглашённые гости',
      'empty.now': 'Сейчас в данных нет активных баннеров и событий. Обнови events-data.js.',
      'empty.soon': 'Ближайшие 30 дней в данных ничего не запланировано.',
      'empty.filter': 'По этому фильтру ничего нет.',
      'stale': 'Данные о баннерах устарели. Открой events-data.js и добавь баннеры нового патча.',
      'datanote': 'Данные актуальны на {u}. Расписание сверено по открытым агрегаторам (GenshinBuilds, Game8), а не по официальным анонсам. Время указано по серверу выбранного региона и в твоём часовом поясе. Перед важными решениями сверяйся с игрой.',

      'ev.h1': 'События и таймеры',
      'ev.lead': 'Что идёт сейчас, что начнётся скоро и что уже закончилось. Метка «прогноз» значит, что дата посчитана по обычному циклу и официально ещё не объявлена.',
      'f.status': 'Статус', 'f.current': 'Идут', 'f.upcoming': 'Скоро', 'f.ended': 'Прошли', 'f.all': 'Все',
      'f.type': 'Тип', 'f.any': 'Любой', 'f.banner': 'Баннеры', 'f.endgame': 'Эндгейм (Бездна, Театр, Натиск)', 'f.event': 'События', 'f.pass': 'Боевой пропуск',

      'codes.h1': 'Промокоды',
      'codes.lead': 'Список обновлён {date}. Коды собраны из публичных источников и не проверялись напрямую в игре. Они живут от нескольких часов до нескольких недель: если код не сработал, он, скорее всего, истёк.',
      'codes.show': 'Показать истёкшие', 'codes.copy': 'Копировать', 'codes.copied': 'Скопировано', 'codes.go': 'Активировать',
      'codes.added': 'добавлен {d}',
      'codes.st.active': 'активен по данным источников', 'codes.st.permanent': 'постоянный', 'codes.st.expired': 'истёк',
      'codes.empty': 'Кодов нет.',
      'codes.how': 'Как активировать',
      'codes.s1': 'Нужен Ранг приключений 10 или выше.',
      'codes.s2': 'Нажми «Активировать», войди в аккаунт HoYoverse на официальной странице и выбери свой сервер.',
      'codes.s3': 'Введи ник персонажа и вставь код (кнопка «Копировать» поможет).',
      'codes.s4': 'Забери награду в игровой почте.',
      'codes.note': 'Вводи пароль только на официальном сайте HoYoverse. Эта страница сама ничего не активирует и не запрашивает данные аккаунта.',

      'calc.h1': 'Калькулятор круток',
      'calc.lead': 'Выбери, кого крутишь, введи, сколько у тебя круток и какой пити, и получишь шанс. Всё считается в браузере, к игре и аккаунту сайт не обращается.',
      'calc.step1': 'Кого крутим?', 'calc.char': 'Персонаж', 'calc.weapon': 'Оружие',
      'calc.step2': 'Что у тебя есть', 'calc.fates': 'Крутки', 'calc.primos': 'Примогемы',
      'calc.have.hint': 'Примогемы пересчитываются в крутки по 160 за штуку.',
      'calc.step3': 'Твой пити', 'calc.pity': 'Крутки с последней 5★',
      'calc.pity.hint.c': 'Число от 0 до 89. Пити общий для всех баннеров персонажей.',
      'calc.pity.hint.w': 'Число от 0 до 79. Пити переносится между оружейными баннерами.',
      'calc.guar.c': 'Гарантия: прошлая 5★ была не целевым персонажем (проиграл 50/50)',
      'calc.guar.w': 'Есть очко судьбы: выбран курс, а прошлая 5★ оказалась не выбранным оружием',
      'calc.adv': 'Дополнительно: копии, шанс 50/50, накопления',
      'calc.copies.c': 'Копий (C0 = 1)', 'calc.copies.w': 'Копий (R1 = 1)',
      'calc.copies.hint.c': 'C0 — одна копия, C6 — семь.', 'calc.copies.hint.w': 'R1 — одна копия, R5 — пять.',
      'calc.win': 'Шанс выиграть 50/50',
      'calc.win55': '55 % (с «Захватом сияния», как в игре с 5.0)', 'calc.win50': '50 % (без «Захвата сияния»)',
      'calc.save.h': 'Накопления до цели',
      'calc.banner': 'Копить до конца баннера', 'calc.manual': 'Ввести вручную',
      'calc.until': 'до {d}', 'calc.days.short': 'дн.',
      'calc.days': 'Дней до цели', 'calc.income': 'Примогемов в день',
      'calc.welkin': 'Есть «Благословение полой луны» (+90 примогемов в день)',
      'calc.oneoff': 'Разовые награды до цели, примогемов (события, Бездна, Театр, Натиск)',
      'calc.income.hint': 'Доход в день и разовые награды — оценка. Поставь свои числа по тому, что реально получаешь в игре.',

      'res.chance': 'Шанс получить {x} твоими крутками',
      'res.v.99': 'Практически гарантированно хватит', 'res.v.90': 'Хватит с хорошим запасом',
      'res.v.50': 'Шансы есть, но риск остаться без цели заметный', 'res.v.low': 'Скорее всего не хватит',
      'res.have': 'У тебя {n} круток.', 'res.mean': 'В среднем нужно около {n}.',
      'res.short': 'Чтобы быть уверенным на 90 %, нужно {q} круток. Не хватает {n} (около {p} примогемов).',
      'res.enough': 'Твоего запаса хватает для 90 % уверенности (нужно {q}).',
      'res.more': 'Подробности и график',
      'res.th.conf': 'Уверенность', 'res.th.pulls': 'Нужно круток', 'res.th.primos': 'Примогемов', 'res.th.have': 'С твоим запасом',
      'res.ok': 'хватает', 'res.lack': 'не хватает {n}',
      'res.worst': 'Гарантированный максимум: {n} круток ({p} примогемов).',
      'res.future': 'Из будущего дохода: {n} круток.',
      'res.chart.h': 'Вероятность по числу круток',
      'res.chart.alt': 'График вероятности получить цель в зависимости от числа круток',
      'res.chart.hint': 'По горизонтали число круток, по вертикали шанс получить цель. Жёлтая линия — твой запас.',
      'chart.have': 'твой запас: {n}',
      'm.title': 'Как это считается и что не гарантировано',
      'm.1': 'Баннер персонажа: базовый шанс 5★ 0,6 %, мягкий пити с 74-й крутки (+6 % за крутку), гарантия на 90-й.',
      'm.2': 'Оружейный баннер: базовый шанс 0,7 %, мягкий пити с 63-й крутки (+7 % за крутку), в игре заявлена гарантия на 80-й.',
      'm.3': 'Расчёт точный, это не случайная симуляция. Проверен сравнением с симуляцией на 200 000 прогонов.',
      'm.4': 'Пороги и шаги пити — данные сообщества, HoYoverse публикует только «гарантию». Если правила изменятся, константы лежат в начале gacha-core.js.',
      'm.5': '«Захват сияния» (с версии 5.0) заявлен как итоговые 55/45. Точный механизм не раскрыт, поэтому здесь это независимые 55 % на каждый 50/50. Для осторожной оценки выбери 50 %.',
      'm.6': 'Оружие: шанс выбранного оружия без очка судьбы 37,5 %, с очком судьбы оно гарантировано. Очки сбрасываются при смене баннера.'
    },

    en: {
      'lang.label': 'Language',
      'nav.home': 'Home', 'nav.events': 'Events & timers', 'nav.calc': 'Wish calculator', 'nav.codes': 'Codes',
      'nav.aria': 'Site sections',
      'server': 'Server',
      'srv.eu': 'Europe', 'srv.asia': 'Asia', 'srv.am': 'America',
      'skip': 'Skip to content',
      'footer': 'Unofficial fan site. Not affiliated with or endorsed by HoYoverse. Genshin Impact is a trademark of HoYoverse. This site reads nothing from the game and asks for no account data.',

      'title.home': 'Teyvat Tools — Genshin Impact timers, wish calculator, codes',
      'title.events': 'Genshin Impact events & timers — Abyss, Theater, Onslaught, banners',
      'title.calc': 'Genshin Impact wish calculator — chance to get a character or weapon',
      'title.codes': 'Genshin Impact redeem codes',

      'home.h1': 'Genshin Impact: timers, banners and a wish calculator',
      'home.lead': 'See how long until Abyss, Theater and Onslaught reset, which banners are live, and whether your pulls are enough for the character you want. Pick your server in the header; times show in server time and in your own time zone.',
      'home.timers': 'Timers', 'home.now': 'Live now', 'home.soon': 'Coming soon',
      'cta.calc.t': 'Wish calculator', 'cta.calc.d': 'Your chance at a character or weapon and how many primogems to save.',
      'cta.events.t': 'All events', 'cta.events.d': 'Banners, battle pass, events and endgame with filters.',
      'cta.codes.t': 'Redeem codes', 'cta.codes.d': 'Working codes with a copy button and a link to redeem.',

      't.daily': 'Daily reset', 't.daily.sub': 'every day at 04:00 server time',
      't.weekly': 'Weekly reset', 't.weekly.sub': 'Mondays at 04:00 server time',
      'g.abyss': 'Spiral Abyss', 'g.theater': 'Imaginarium Theater', 'g.stygian': 'Stygian Onslaught',
      'g.abyss.sub': 'Resets on the 16th at 04:00 server time',
      'g.theater.sub': 'Resets on the 1st at 04:00 server time',
      'g.stygian.sub': 'Runs from week 2 of a patch until 04:00 before the next patch',
      'chip.end': 'until end', 'chip.start': 'until start', 'chip.pred': 'forecast',
      't.reset': 'resets: {d}', 't.startat': 'starts: {d}',
      't.patch': 'Patch {v}', 't.patch.sub': 'releases {d} (UTC+8)', 't.nodata': 'no data',

      'kind.banner': 'Banner', 'kind.endgame': 'Endgame', 'kind.event': 'Event', 'kind.pass': 'Pass',
      'badge.live': 'live',
      'badge.pred': 'forecast', 'badge.pred.t': 'Date is estimated from the usual cycle and not officially confirmed',
      'badge.approx': 'time approximate', 'badge.approx.t': 'End time is taken from the pattern of past patches',
      'cd.end': 'Ends in', 'cd.start': 'Starts in', 'cd.ended': 'Ended {d}',
      'card.server': '{s} server',
      'd.elements': 'Elements', 'd.opening': 'Opening characters', 'd.guests': 'Guest stars',
      'empty.now': 'No active banners or events in the data right now. Update events-data.js.',
      'empty.soon': 'Nothing planned in the next 30 days in the data.',
      'empty.filter': 'Nothing matches this filter.',
      'stale': 'Banner data is out of date. Open events-data.js and add the new patch banners.',
      'datanote': 'Data is current as of {u}. The schedule is cross-checked against public trackers (GenshinBuilds, Game8), not official announcements. Times are shown in the chosen server region and in your time zone. Double-check in game before important decisions.',

      'ev.h1': 'Events & timers',
      'ev.lead': 'What is live, what starts soon and what has ended. The “forecast” label means the date is estimated from the usual cycle and not yet officially announced.',
      'f.status': 'Status', 'f.current': 'Live', 'f.upcoming': 'Soon', 'f.ended': 'Ended', 'f.all': 'All',
      'f.type': 'Type', 'f.any': 'Any', 'f.banner': 'Banners', 'f.endgame': 'Endgame (Abyss, Theater, Onslaught)', 'f.event': 'Events', 'f.pass': 'Battle pass',

      'codes.h1': 'Redeem codes',
      'codes.lead': 'List updated {date}. Codes are collected from public sources and were not tested in game directly. They last from a few hours to a few weeks: if a code fails, it has most likely expired.',
      'codes.show': 'Show expired', 'codes.copy': 'Copy', 'codes.copied': 'Copied', 'codes.go': 'Redeem',
      'codes.added': 'added {d}',
      'codes.st.active': 'active per sources', 'codes.st.permanent': 'permanent', 'codes.st.expired': 'expired',
      'codes.empty': 'No codes.',
      'codes.how': 'How to redeem',
      'codes.s1': 'You need Adventure Rank 10 or higher.',
      'codes.s2': 'Press “Redeem”, sign in to your HoYoverse account on the official page and pick your server.',
      'codes.s3': 'Enter your character nickname and paste the code (the “Copy” button helps).',
      'codes.s4': 'Collect the reward from your in-game mail.',
      'codes.note': 'Only enter your password on the official HoYoverse site. This page redeems nothing by itself and asks for no account data.',

      'calc.h1': 'Wish calculator',
      'calc.lead': 'Choose who you are pulling for, enter how many pulls and what pity you have, and get your chance. Everything runs in your browser; the site never touches the game or your account.',
      'calc.step1': 'Who are you pulling for?', 'calc.char': 'Character', 'calc.weapon': 'Weapon',
      'calc.step2': 'What you have', 'calc.fates': 'Pulls', 'calc.primos': 'Primogems',
      'calc.have.hint': 'Primogems are converted to pulls at 160 each.',
      'calc.step3': 'Your pity', 'calc.pity': 'Pulls since last 5★',
      'calc.pity.hint.c': 'A number from 0 to 89. Pity is shared across all character banners.',
      'calc.pity.hint.w': 'A number from 0 to 79. Pity carries over between weapon banners.',
      'calc.guar.c': 'Guaranteed: your last 5★ was not the featured character (you lost the 50/50)',
      'calc.guar.w': 'Have a Fate Point: a course is set and your last 5★ was not the chosen weapon',
      'calc.adv': 'More options: copies, 50/50 odds, savings',
      'calc.copies.c': 'Copies (C0 = 1)', 'calc.copies.w': 'Copies (R1 = 1)',
      'calc.copies.hint.c': 'C0 is one copy, C6 is seven.', 'calc.copies.hint.w': 'R1 is one copy, R5 is five.',
      'calc.win': '50/50 win chance',
      'calc.win55': '55% (with Capturing Radiance, as in game since 5.0)', 'calc.win50': '50% (without Capturing Radiance)',
      'calc.save.h': 'Savings until your target',
      'calc.banner': 'Save until the banner ends', 'calc.manual': 'Enter manually',
      'calc.until': 'until {d}', 'calc.days.short': 'd',
      'calc.days': 'Days until target', 'calc.income': 'Primogems per day',
      'calc.welkin': 'I have Blessing of the Welkin Moon (+90 primogems per day)',
      'calc.oneoff': 'One-off rewards before the target, primogems (events, Abyss, Theater, Onslaught)',
      'calc.income.hint': 'Daily income and one-off rewards are estimates. Enter the numbers you actually get in game.',

      'res.chance': 'Chance to get {x} with your pulls',
      'res.v.99': 'Practically guaranteed to be enough', 'res.v.90': 'Enough with a comfortable margin',
      'res.v.50': 'There is a chance, but the risk of falling short is real', 'res.v.low': 'Most likely not enough',
      'res.have': 'You have {n} pulls.', 'res.mean': 'On average you need about {n}.',
      'res.short': 'To be 90% sure you need {q} pulls. You are short by {n} (about {p} primogems).',
      'res.enough': 'Your pulls cover 90% confidence (you need {q}).',
      'res.more': 'Details and chart',
      'res.th.conf': 'Confidence', 'res.th.pulls': 'Pulls needed', 'res.th.primos': 'Primogems', 'res.th.have': 'With your pulls',
      'res.ok': 'enough', 'res.lack': 'short by {n}',
      'res.worst': 'Guaranteed maximum: {n} pulls ({p} primogems).',
      'res.future': 'From future income: {n} pulls.',
      'res.chart.h': 'Probability by number of pulls',
      'res.chart.alt': 'Chart of the chance to get your target by number of pulls',
      'res.chart.hint': 'Horizontal: number of pulls, vertical: chance to get the target. The gold line is your stock.',
      'chart.have': 'your pulls: {n}',
      'm.title': 'How this is calculated and what is not guaranteed',
      'm.1': 'Character banner: base 5★ rate 0.6%, soft pity from pull 74 (+6% per pull), guaranteed at 90.',
      'm.2': 'Weapon banner: base rate 0.7%, soft pity from pull 63 (+7% per pull), the game states a guarantee at 80.',
      'm.3': 'The calculation is exact, not a random simulation. It was checked against a 200,000-run simulation.',
      'm.4': 'Pity thresholds and steps come from community data; HoYoverse only publishes the guarantee. If the rules change, the constants are at the top of gacha-core.js.',
      'm.5': 'Capturing Radiance (since 5.0) is stated as a combined 55/45. The exact mechanism is not disclosed, so here it is an independent 55% per 50/50. Pick 50% for a cautious estimate.',
      'm.6': 'Weapons: the chosen weapon is 37.5% without a Fate Point and guaranteed with one. Fate Points reset when the banner changes.'
    }
  };

  var lang = 'ru';
  function detect() {
    try {
      var s = localStorage.getItem('gs_lang');
      if (s && DICT[s]) { return s; }
    } catch (e) { /* нет доступа к хранилищу */ }
    var n = (navigator.language || 'ru').toLowerCase();
    return n.indexOf('ru') === 0 ? 'ru' : 'en';
  }

  function t(key, vars) {
    var s = (DICT[lang] && DICT[lang][key]);
    if (s === undefined) { s = DICT.ru[key]; }
    if (s === undefined) { s = key; }
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    }
    return s;
  }

  // Берёт строку нужного языка из объекта {ru, en}; обычную строку возвращает как есть
  function pick(v) {
    if (v && typeof v === 'object') { return v[lang] || v.ru || v.en || ''; }
    return v || '';
  }

  function apply() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length === 2) { el.setAttribute(p[0].trim(), t(p[1].trim())); }
      });
    });
    var tk = document.body.getAttribute('data-title');
    if (tk) { document.title = t(tk); }
    document.documentElement.setAttribute('lang', lang);
    Array.prototype.forEach.call(document.querySelectorAll('.lang-side button'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-l') === lang));
    });
  }

  function setLang(l, silent) {
    if (!DICT[l]) { return; }
    lang = l;
    try { localStorage.setItem('gs_lang', l); } catch (e) { /* ничего страшного */ }
    if (window.Schedule && window.Schedule.setLang) { window.Schedule.setLang(l); }
    apply();
    if (!silent) { document.dispatchEvent(new CustomEvent('gs:lang')); }
  }

  function buildSwitcher() {
    var box = document.createElement('aside');
    box.className = 'lang-side';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Language / Язык');
    box.innerHTML = LANGS.map(function (l) {
      return '<button type="button" data-l="' + l.id + '" title="' + l.name + '" aria-pressed="false">' + l.label + '</button>';
    }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-l]');
      if (b) { setLang(b.getAttribute('data-l')); }
    });
    document.body.appendChild(box);
  }

  lang = detect();
  if (window.Schedule && window.Schedule.setLang) { window.Schedule.setLang(lang); }
  buildSwitcher();
  apply();

  window.I18N = { t: t, pick: pick, apply: apply, setLang: setLang, getLang: function () { return lang; } };
})();
