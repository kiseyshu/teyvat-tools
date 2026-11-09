/*
 * ПРОМОКОДЫ — правь руками. Код живёт от нескольких часов (стримовые) до нескольких недель.
 * status: active | permanent | expired.   reward — объект { ru, en }.
 * Список собран из публичных источников (GIGA от 4 ноября 2026, GenshinBuilds) и НЕ проверялся напрямую в игре.
 * Перед публикацией проверяй каждый код сам и переноси неработающие в expired.
 */
(function () {
  var SEE_IN_GAME = { ru: 'Награду покажет игра при активации', en: 'The game shows the reward when you redeem' };
  var EXP_MAIL = { ru: 'Опыт приключений ×5 и другое — смотри в игровой почте', en: 'Adventurer’s EXP ×5 and more — check your in-game mail' };

  window.GENSHIN_CODES = {
    checked: '2026-11-09',
    codes: [
      { code: 'KeepUpWithMitya', status: 'active', added: '2026-11-04', source: 'GIGA, 04.11.2026', reward: SEE_IN_GAME },
      { code: 'CDOF4X83H7X2',    status: 'active', added: '2026-11-04', source: 'GIGA, 04.11.2026', reward: SEE_IN_GAME },
      { code: 'MIJIQ23V2437',    status: 'active', added: '2026-11-04', source: 'GIGA, 04.11.2026', reward: SEE_IN_GAME },
      { code: 'PJ2KEBRAYSRM',    status: 'active', added: null, source: 'GIGA, GenshinBuilds', reward: EXP_MAIL },
      { code: 'Y6JYMKV6JKSL',    status: 'active', added: null, source: 'GIGA, GenshinBuilds', reward: EXP_MAIL },
      { code: 'PNKZ3WLNN8G6',    status: 'active', added: null, source: 'GIGA', reward: SEE_IN_GAME },
      {
        code: 'GENSHINGIFT', status: 'permanent', added: null, source: 'GenshinBuilds',
        reward: {
          ru: 'Постоянный код, обычно только для новых аккаунтов. Hero’s Wit ×3 и другое',
          en: 'Permanent code, usually for new accounts only. Hero’s Wit ×3 and more'
        }
      },

      { code: 'HourofRuin',  status: 'expired', added: '2026-10-23', source: 'GenshinBuilds (7.2 stream)', reward: { ru: 'Mystic Enhancement Ore ×10', en: 'Mystic Enhancement Ore ×10' } },
      { code: 'ExpertMitya', status: 'expired', added: '2026-10-23', source: 'GenshinBuilds (7.2 stream)', reward: { ru: 'Hero’s Wit ×5', en: 'Hero’s Wit ×5' } },
      { code: 'PhotoTime',   status: 'expired', added: '2026-10-23', source: 'GenshinBuilds (7.2 stream)', reward: { ru: 'Награда не указана', en: 'Reward not listed' } }
    ]
  };
})();
