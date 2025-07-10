import {
  AUTOMATION_TYPE,
  IMacro,
  MACRO_ACTION,
  OPTION_TYPE,
  ORDER_CLASS,
  STRATEGY_TYPE,
} from '../types';

// use https://www.wowhead.com/icons for placeholder icons

export const MACRO_FLARE: IMacro = {
  id: '1',
  name: 'Flare',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_elemental_mote_fire01.jpg',
  description:
    'Market has a small upward trend. Create a small bullish position.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: -1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_FIREBALL: IMacro = {
  id: '2',
  name: 'Fireball',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball02.jpg',
  description:
    'Market is trending upwards. Create a moderate bullish position to capture upward momentum.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_EXPLOSION: IMacro = {
  id: '3',
  name: 'Explosion',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shaman_improvedfirenova.jpg',
  description:
    'Market is aggressively trending upwards. Create an extremely bullish position.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_FIRE_TICKET: IMacro = {
  id: '4',
  name: 'Fire Ticket',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_10_inscription_darkmooncards_fire_blank.jpg',
  description:
    'Create a far out of the money bullish position to capture extreme momentum. High risk.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_FIRE_STORM: IMacro = {
  id: '5',
  name: 'Fire Storm',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_rainoffire.jpg',
  description:
    'Market is extremely volatile, but trending upwards. Create a series of bullish positions to dilute risk while capturing momentum.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_FROST_BOLT: IMacro = {
  id: '6',
  name: 'Frostbolt',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg',
  description:
    'Market has a small downward trend. Create a small bearish position.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: +1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_ICE_LANCE: IMacro = {
  id: '7',
  name: 'Ice Lance',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_iceshard.jpg',
  description:
    'Market is trending downwards. Create a moderate bearish position to capture downward momentum.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_BLACK_HOLE: IMacro = {
  id: '8',
  name: 'Black Hole',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_engineering_90_blackhole.jpg',
  description:
    'Market is aggressively trending downwards. Create an extremely bearish position.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_ICE_TICKET: IMacro = {
  id: '9',
  name: 'Ice Ticket',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_10_inscription_darkmooncards_frost_blank.jpg',
  description:
    'Create a far out of the money bearish position to capture extreme momentum. High risk.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

export const MACRO_BLIZZARD: IMacro = {
  id: '10',
  name: 'Blizzard',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_icestorm.jpg',
  description:
    'Market is extremely volatile, but trending downwards. Create a series of bearish positions to dilute risk while capturing momentum.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
      ],
    },
  ],
};

// export const MACRO_STRADDLE: IMacro = {
//   id: '7',
//   name: 'Straddle',
//   icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_horse3saddle003_brown.jpg',
//   description:
//     'Market is volatile. Create two opposing positions to hedge against movement, but capture volatility.',
//   strategyType: STRATEGY_TYPE.CRAB,
//   legs: [
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.CALL,
//       optionTranche: 0,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.PUT,
//       optionTranche: 0,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//   ],
// };

// export const MACRO_STRANGLE: IMacro = {
//   id: '8',
//   name: 'Strangle',
//   icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_strangulate.jpg',
//   description:
//     'Market is volatile. Create two opposing positions to try and capture large movements and volatility.',
//   strategyType: STRATEGY_TYPE.CRAB,
//   legs: [
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.CALL,
//       optionTranche: +2,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.PUT,
//       optionTranche: -2,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//   ],
// };

// export const MACRO_BUTTERFLY: IMacro = {
//   id: '9',
//   name: 'Butterfly',
//   icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_cape_special_butterfly_c_01.jpg',
//   description:
//     'Market is volatile. Create multiple opposing positions to try and capture large movements and volatility.',
//   strategyType: STRATEGY_TYPE.CRAB,
//   legs: [
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.CALL,
//       optionTranche: +2,
//       quantity: 2,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.CALL,
//       optionTranche: 0,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.PUT,
//       optionTranche: 0,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.PUT,
//       optionTranche: -2,
//       quantity: 2,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//   ],
// };

// export const MACRO_NET: IMacro = {
//   id: '10',
//   name: 'Net',
//   icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_staff_2h_butterflynet_a_01.jpg',
//   description:
//     'Market is NOT volatile. Create multiple opposing positions to try and capture stability in movement.',
//   strategyType: STRATEGY_TYPE.BEAR,
//   legs: [
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.CALL,
//       optionTranche: -2,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 3, goal: 1.1},
//       ],
//     },
//     {
//       action: MACRO_ACTION.BUY,
//       orderClass: ORDER_CLASS.OPTION,
//       optionType: OPTION_TYPE.PUT,
//       optionTranche: +2,
//       quantity: 1,
//       automation: [
//         {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.1},
//       ],
//     },
//   ],
// };

export const MACROS = {
  [MACRO_FLARE.id]: MACRO_FLARE,
  [MACRO_FIREBALL.id]: MACRO_FIREBALL,
  [MACRO_EXPLOSION.id]: MACRO_EXPLOSION,
  [MACRO_FIRE_TICKET.id]: MACRO_FIRE_TICKET,
  [MACRO_FIRE_STORM.id]: MACRO_FIRE_STORM,
  [MACRO_FROST_BOLT.id]: MACRO_FROST_BOLT,
  [MACRO_ICE_LANCE.id]: MACRO_ICE_LANCE,
  [MACRO_BLACK_HOLE.id]: MACRO_BLACK_HOLE,
  [MACRO_ICE_TICKET.id]: MACRO_ICE_TICKET,
  [MACRO_BLIZZARD.id]: MACRO_BLIZZARD,
  // [MACRO_STRADDLE.id]: MACRO_STRADDLE,
  // [MACRO_STRANGLE.id]: MACRO_STRANGLE,
  // [MACRO_BUTTERFLY.id]: MACRO_BUTTERFLY,
  // [MACRO_NET.id]: MACRO_NET,
};
