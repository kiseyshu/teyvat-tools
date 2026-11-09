/*
 * ДАННЫЕ СОБЫТИЙ — этот файл ты правишь руками после каждого патча (раз в 6 недель).
 *
 * Формат дат: "ГГГГ-ММ-ДДTЧЧ:ММ" по времени СЕРВЕРА (не твоему). Конец вида "…:59" считается до следующей минуты.
 * kind: banner | event | pass.   approx: true — точное время неизвестно, показывается пометка.
 * title и sub — объекты { ru: '…', en: '…' } для каждого языка сайта.
 * image — необязательный путь к твоей собственной картинке для карточки (например 'images/my-banner.jpg').
 *         Если не указан, подставляется обложка по типу: images/cover-<kind>.svg.
 * Бездна, Театр и Натиск сюда вносить не нужно — они считаются правилами в schedule.js.
 *
 * Источники (сверено 9 ноября 2026): таймлайн GenshinBuilds, расписание баннеров Game8.
 * Это агрегаторы, не официальные анонсы: время начала баннеров у них совпадает с началом патча,
 * на деле баннеры открываются после технических работ.
 */
window.GENSHIN_DATA = {
  updated: '2026-11-09',
  confirmedUntil: '2026-12-15T04:00',

  patch: {
    anchor: '2026-11-04T06:00',   // выход патча 7.2, 06:00 по UTC+8
    cycleDays: 42,
    versions: ['7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '8.0'],
    confirmedPatches: 1            // подтверждён только следующий патч (7.3 — 16 декабря по циклу)
  },

  // Состав Театра по месяцам (ключ — месяц начала цикла)
  theater: {
    '2026-10': {
      elements: { ru: 'Гидро, Крио, Анемо', en: 'Hydro, Cryo, Anemo' },
      opening: 'Neuvillette, Barbara, Citlali, Kaeya, Wanderer, Prune',
      guests: 'Ineffa, Yae Miko, Thoma, Chiori'
    },
    '2026-11': {
      elements: { ru: 'Гидро, Электро, Гео', en: 'Hydro, Electro, Geo' },
      opening: 'Yelan, Aino, Flins, Fischl, Zhongli, Kachina',
      guests: 'Qiqi, Odette, Vesna, Jahoda'
    }
  },

  events: [
    {
      id: 'banner-mitya', kind: 'banner',
      title: { ru: 'Митя (Mitya) — новый 5★', en: 'Mitya — new 5★' },
      sub: {
        ru: '5★ Электро, катализатор. Баннер «Myriad Patterns Unfold». 4★ в апе: Валерий (Valeriy, новый), Розария, Шарлотта.',
        en: '5★ Electro catalyst. Banner “Myriad Patterns Unfold”. Featured 4★: Valeriy (new), Rosaria, Charlotte.'
      },
      start: '2026-11-04T06:00', end: '2026-11-24T17:59'
    },
    {
      id: 'banner-furina', kind: 'banner',
      title: { ru: 'Фурина (Furina) — реран', en: 'Furina — rerun' },
      sub: {
        ru: '5★ Гидро, меч. Баннер «Chanson of Many Waters». 4★ в апе: Валерий, Розария, Шарлотта.',
        en: '5★ Hydro sword. Banner “Chanson of Many Waters”. Featured 4★: Valeriy, Rosaria, Charlotte.'
      },
      start: '2026-11-04T06:00', end: '2026-11-24T17:59'
    },
    {
      id: 'weapon-1', kind: 'banner',
      title: { ru: 'Эпитомическое призвание — фаза 1', en: 'Epitome Invocation — phase 1' },
      sub: {
        ru: 'Оружейный баннер. 5★: Starsealed Edict, Splendor of Tranquil Waters.',
        en: 'Weapon banner. 5★: Starsealed Edict, Splendor of Tranquil Waters.'
      },
      start: '2026-11-04T06:00', end: '2026-11-24T17:59'
    },
    {
      id: 'banner-zibai', kind: 'banner',
      title: { ru: 'Цзыбай (Zibai) — реран', en: 'Zibai — rerun' },
      sub: {
        ru: '5★ Гео. Баннер «Harmonious Abundance». Фаза 2 патча 7.2.',
        en: '5★ Geo. Banner “Harmonious Abundance”. Phase 2 of patch 7.2.'
      },
      start: '2026-11-24T18:00', end: '2026-12-15T14:59', approx: true
    },
    {
      id: 'banner-linnea', kind: 'banner',
      title: { ru: 'Линнея (Linnea) — реран', en: 'Linnea — rerun' },
      sub: {
        ru: '5★ Гео. Баннер «Ya-hoho! Compendium». Фаза 2 патча 7.2.',
        en: '5★ Geo. Banner “Ya-hoho! Compendium”. Phase 2 of patch 7.2.'
      },
      start: '2026-11-24T18:00', end: '2026-12-15T14:59', approx: true
    },
    {
      id: 'weapon-2', kind: 'banner',
      title: { ru: 'Эпитомическое призвание — фаза 2', en: 'Epitome Invocation — phase 2' },
      sub: {
        ru: 'Оружейный баннер второй фазы. Состав уточняется.',
        en: 'Second-phase weapon banner. Lineup to be confirmed.'
      },
      start: '2026-11-24T18:00', end: '2026-12-15T14:59', approx: true
    },
    {
      id: 'event-hour-of-ruin', kind: 'event',
      title: { ru: 'Hour of Ruin', en: 'Hour of Ruin' },
      sub: { ru: 'Событие патча 7.2.', en: 'Patch 7.2 event.' },
      start: '2026-11-04T06:00', end: '2026-12-15T14:59'
    },
    {
      id: 'event-grand-defense', kind: 'event',
      title: { ru: 'The Grand Defense: Defy the Unjust Judgment', en: 'The Grand Defense: Defy the Unjust Judgment' },
      sub: { ru: 'Событие патча 7.2.', en: 'Patch 7.2 event.' },
      start: '2026-11-04T06:00', end: '2026-12-16T05:59'
    },
    {
      id: 'pass-sacred-spirit', kind: 'pass',
      title: { ru: 'Боевой пропуск «Sacred Spirit Chronicle»', en: 'Battle Pass “Sacred Spirit Chronicle”' },
      sub: { ru: 'Пропуск патча 7.2.', en: 'Patch 7.2 battle pass.' },
      start: '2026-11-04T06:00', end: '2026-12-15T14:59'
    }
  ]
};
