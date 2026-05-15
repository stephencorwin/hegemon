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
  description: 'Capture a small upward momentum. Low risk.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_FIREBALL: IMacro = {
  id: '2',
  name: 'Fireball',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball02.jpg',
  description: 'Capture upward momentum. Medium risk.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_FIRE_TICKET: IMacro = {
  id: '3',
  name: 'Fire Ticket',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_10_inscription_darkmooncards_fire_blank.jpg',
  description: 'Capture extreme upward momentum. High risk.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_FIRE_STORM: IMacro = {
  id: '4',
  name: 'Fire Storm',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_rainoffire.jpg',
  description:
    'Capture upward momentum through a series of bullish positions. Medium risk.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: +3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_GUESS_OTM: IMacro = {
  id: '5',
  name: 'Guess - OTM',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg',
  description: 'Capture movement in either direction. Medium risk.',
  strategyType: STRATEGY_TYPE.BULL,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: 3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_FROST_BOLT: IMacro = {
  id: '6',
  name: 'Frostbolt',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg',
  description: 'Capture a small downward momentum. Low risk.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_ICE_LANCE: IMacro = {
  id: '7',
  name: 'Ice Lance',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_iceshard.jpg',
  description: 'Capture downward momentum. Medium risk.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_ICE_TICKET: IMacro = {
  id: '8',
  name: 'Ice Ticket',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_10_inscription_darkmooncards_frost_blank.jpg',
  description: 'Capture extreme downward momentum. High risk.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_BLIZZARD: IMacro = {
  id: '9',
  name: 'Blizzard',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_icestorm.jpg',
  description:
    'Capture downward momentum through a series of bearish positions. Medium risk.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -1,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -2,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: -3,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACRO_GUESS_ATM: IMacro = {
  id: '10',
  name: 'Guess - ATM',
  icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg',
  description: 'Capture momentum in either direction. Medium risk.',
  strategyType: STRATEGY_TYPE.BEAR,
  legs: [
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.CALL,
      optionTranche: 0,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
    {
      action: MACRO_ACTION.BUY,
      orderClass: ORDER_CLASS.OPTION,
      optionType: OPTION_TYPE.PUT,
      optionTranche: 0,
      quantity: 1,
      automation: [
        {type: AUTOMATION_TYPE.LIMIT_SELL, quantityPercent: 1, goal: 1.14},
      ],
    },
  ],
};

export const MACROS = {
  [MACRO_FLARE.id]: MACRO_FLARE,
  [MACRO_FIREBALL.id]: MACRO_FIREBALL,
  [MACRO_FIRE_TICKET.id]: MACRO_FIRE_TICKET,
  [MACRO_FIRE_STORM.id]: MACRO_FIRE_STORM,
  [MACRO_GUESS_OTM.id]: MACRO_GUESS_OTM,
  [MACRO_FROST_BOLT.id]: MACRO_FROST_BOLT,
  [MACRO_ICE_LANCE.id]: MACRO_ICE_LANCE,
  [MACRO_ICE_TICKET.id]: MACRO_ICE_TICKET,
  [MACRO_BLIZZARD.id]: MACRO_BLIZZARD,
  [MACRO_GUESS_ATM.id]: MACRO_GUESS_ATM,
};
