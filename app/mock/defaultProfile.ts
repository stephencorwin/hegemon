import {IHegemonStore} from '../types';
import {MACROS} from './macros';

export const DEFAULT_PROFILE: IHegemonStore['profile'] = {
  macros: MACROS,
  settings: {
    watchlist: [
      'GOOGL',
      'SPY',
      'NVDA',
      'PLTR',
      'AMD',
      'SMCI',
      'UNH',
      'TSLA',
      'AMZN',
      'MSFT',
    ],
    positions: {
      sellPercentagesReplacePreviousOrders: true,
      profitGoalsReplacePreviousOrders: true,
    },
    thresholds: {
      profit: {
        dailyGoal: 1.14,
        positionGoal: 1.14,
      },
      stock: {
        changePercentIsHighlyPositive: 0.015,
        changePercentIsHighlyNegative: -0.015,
      },
      sentiment: {
        daily: {
          changePercentIsHighlyPositive: 0.1,
          changePercentIsHighlyNegative: -0.1,
        },
        weekly: {
          changePercentIsHighlyPositive: 0.25,
          changePercentIsHighlyNegative: -0.25,
        },
      },
    },
    limitBreak: {
      current: 1,
      levels: [1, 2, 3, 5, 10, 15],
    },
    // https://documentation.tradier.com/brokerage-api/overview/rate-limiting
    // total rpm (Requests Per Minute) not to exceed:
    // [120 production / 60 paper] /accounts, /watchlists/, /users, /orders
    // [120 production / 60 paper] /markets
    // The distribution below is a percentage of the total allowed requests
    pollingDistribution: {
      profile: 1,
      account: {
        balances: 0.1,
        positions: 0.5,
        orders: 0.4,
      },
      market: {
        stocks: 0.5,
        options: 0.5,
      },
    },
  },
};
