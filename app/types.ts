export type Writeable<T> = {-readonly [P in keyof T]: T[P]};
export type DeepWriteable<T> = {-readonly [P in keyof T]: DeepWriteable<T[P]>};

export enum MAX_RPM {
  ACCOUNTS = 120,
  MARKETS = 120,
  SANDBOX = 60,
}

export enum ACCOUNT_TYPE {
  CASH = 'cash',
  MARGIN = 'margin',
  PDT = 'pdt', // pattern day trader
}

export enum ORDER_CLASS {
  EQUITY = 'equity',
  OPTION = 'option',
}

export enum ORDER_STATUS {
  CANCELED = 'canceled',
  REJECTED = 'rejected',
  PENDING = 'pending',
  FILLED = 'filled',
  EXPIRED = 'expired',
}

export enum OPTION_TYPE {
  CALL = 'call',
  PUT = 'put',
}

export enum ORDER_SIDE {
  BUY = 'buy',
  SELL = 'sell',
  BUY_TO_OPEN = 'buy_to_open',
  SELL_TO_CLOSE = 'sell_to_close',
}

export interface ILink {
  symbol: string;
  optionSymbol: string;
  strike: number;
  ask: number;
  bid: number;
  midAsk: number;
  buyAsk: number;
  sellAsk: number;
  volume: number;
  openInterest: number;
}

export interface IOptions {
  symbol: string;
  ask: number;
  bid: number;
  midAsk: number;
  expiration: string;
  chain: {
    [OPTION_TYPE.CALL]: {
      above: ILink[];
      below: ILink[];
    };
    [OPTION_TYPE.PUT]: {
      above: ILink[];
      below: ILink[];
    };
  };
}

export interface IOptionsOrderReceipt {
  assetId: string;
  symbol: string;
  limit: number;
  quantity: number;
}

export interface IStocksOrderReceipt {
  assetId: string;
  symbol: string;
  limit: number;
  quantity: number;
}

export interface IStock {
  symbol: string;
  last: number;
  open: number;
  high: number;
  low: number;
  close: number;
  bid: number;
  ask: number;
  midAsk: number;
  buyAsk: number;
  sellAsk: number;
  change: number;
  changePercentage: number;
  volume: number;
  averageVolume: number;
  prevclose: number;
  week52High: number;
  week52Low: number;
}

export interface IPosition {
  id: number;
  symbol: string;
  optionSymbol?: string;
  optionType?: OPTION_TYPE;
  optionStrike?: number;
  ask?: number;
  bid?: number;
  midAsk?: number;
  buyAsk?: number;
  sellAsk?: number;
  price: number;
  costBasis: number;
  change?: number;
  changePercent?: number;
  dateAcquired: string;
  quantity: number;
}

export interface IOrder {
  id: number;
  type: string;
  symbol: string;
  optionSymbol?: string;
  optionType?: OPTION_TYPE;
  optionStrike?: number;
  side: string;
  duration: string;
  quantity: number;
  filledQuantity: number;
  remainingQuantity: number;
  price: number;
  averageFillPrice: number;
  class: string;
  createDate: string;
  status: string;
}

export interface ISymbol {
  symbol: string;
  exchange: string;
  type: string;
  description: string;
}

export enum MACRO_ACTION {
  BUY = 'buy',
  SELL = 'sell',
}

export enum AUTOMATION_TYPE {
  LIMIT_SELL = 'limit_sell',
  TRAILING_LIMIT_SELL = 'trailing_limit_sell',
}

export interface IMacroLeg {
  action: MACRO_ACTION;
  orderClass: ORDER_CLASS;
  optionType?: OPTION_TYPE;
  optionTranche?: number;
  limitPercent?: number;
  limitOffset?: number;
  quantity: number;
  stopLoss?: number; // NOT IMPLEMENTED
  automation: {
    type: AUTOMATION_TYPE;
    quantity?: number;
    quantityPercent?: number;
    goal: number;
  }[];
}

export interface IMacroLegHydrated {
  symbol: string;
  optionSymbol?: string;
  limit: number;
  label: string;
  action: MACRO_ACTION;
  orderClass: ORDER_CLASS;
  optionType?: OPTION_TYPE;
  optionTranche?: number;
  quantity: number;
  stopLoss?: number;
  automation: {
    type: AUTOMATION_TYPE;
    quantity: number;
    goal: number;
    limit: number;
  }[];
}

export enum STRATEGY_TYPE {
  BULL = 'bull',
  BEAR = 'bear',
  CRAB = 'crab',
}

export interface IMacro {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  strategyType: STRATEGY_TYPE;
  legs: IMacroLeg[];
}

export interface IMacroHydrated {
  id: string;
  name: string;
  description?: string;
  limit: number;
  legs: IMacroLegHydrated[];
}

export interface IProfileData {
  id: string;
  name: string;
  account: {id: string; dayTrader: boolean; type: ACCOUNT_TYPE};
}

export interface IHegemonStore {
  __forceRenderUniqueToken: number;
  status: {
    // application was just opened and we have retrieved
    // the required starting information
    initialized?: boolean;

    // order was placed, modified, etc...
    // we want to only process one order at a time
    // to prevent accidentally double clicking
    loading?: boolean;

    // track whether the account balances have been fetched yet or not
    accountBalancesFetched?: boolean;
  };
  registerProfile: (apiKey: string, isPaper?: boolean) => Promise<void>;
  unregisterProfile: (id: string) => Promise<void>;
  login: (id: string, apiKey: string, isPaper: boolean) => Promise<void>;
  logout: () => Promise<void>;
  fetchSavedProfiles: () => Promise<void>;
  persistData: () => Promise<void>;
  restoreData: () => Promise<void>;
  savedProfiles: IFileProfiles;
  profile?: {
    id?: string;
    apiKey?: string;
    isPaper?: boolean;
    name?: string;
    accountId?: string;
    dayTrader?: boolean;
    type?: ACCOUNT_TYPE;
    macros: {[id: string]: IMacro};
    settings: {
      watchlist: string[];
      optionsExpiration: string;
      limitBreak: {
        maxOverride?: boolean;
        current: number;
        levels: number[];
      };
      thresholds: {
        profit: {
          dailyGoal: number;
          positionGoal: number;
        };
        stock: {
          changePercentIsHighlyPositive: number;
          changePercentIsHighlyNegative: number;
        };
        sentiment: {
          daily: {
            changePercentIsHighlyPositive: number;
            changePercentIsHighlyNegative: number;
          };
          weekly: {
            changePercentIsHighlyPositive: number;
            changePercentIsHighlyNegative: number;
          };
        };
      };
      pollingDistribution: {
        profile: number;
        account: {
          balances: number;
          positions: number;
          orders: number;
        };
        market: {
          stocks: number;
          options: number;
        };
      };
    };
  };
  account: {
    balances: {
      total: number;
      available: number;
      fetch: () => Promise<{
        total: number;
        available: number;
      }>;
    };
    positions: {
      cache: {[id: number]: IPosition};
      fetch: () => Promise<{[id: number]: IPosition}>;
      sell: (id: number, quantity: number, limit: number) => Promise<void>;
      // gain/loss
    };
    orders: {
      cache: {[id: number]: IOrder};
      fetch: () => Promise<{[id: number]: IOrder}>;
      cancel: (id: number) => Promise<void>;
    };
  };
  market: {
    limitBreak?: number; // to do
    subscribed: {
      target?: string;
      stocks: string[];
      options: string[];
    };
    lookupSymbol: (symbol: string) => Promise<ISymbol | null>;
    stocks: {
      cache: {[symbol: string]: IStock};
      fetch: (symbols: string[]) => Promise<{[symbol: string]: IStock}>;
      buy: (
        symbol: string,
        limit: number,
        quantity: number
      ) => Promise<IStocksOrderReceipt>;
      sell: (
        symbol: string,
        limit: number,
        quantity: number
      ) => Promise<IStocksOrderReceipt>;
    };
    options: {
      cache: {[symbol: string]: IOptions};
      sentimentCache: {[symbol: string]: number};
      snapshotSentiment: () => Promise<void>;
      fetch: (symbol: string) => Promise<IOptions>;
      buy: (
        symbol: string,
        optionSymbol: string,
        limit: number,
        quantity: number
      ) => Promise<IOptionsOrderReceipt>;
      sell: (
        symbol: string,
        optionSymbol: string,
        limit: number,
        quantity: number
      ) => Promise<IOptionsOrderReceipt>;
    };
    queue: {
      setLimitSell: {
        symbol: string;
        optionSymbol?: string;
        side: ORDER_SIDE;
        quantity: number;
        limit: number;
      }[];
    };
  };
}

export interface ISingleFileProfile {
  id: string;
  apiKey: string;
  isPaper?: boolean;
}

export type IFileProfiles = ISingleFileProfile[];

export interface IFileProfile {
  id?: IHegemonStore['profile']['id'];
  macros: IHegemonStore['profile']['macros'];
  settings: IHegemonStore['profile']['settings'];
}

export interface IFileWeeklySentiment {
  [date: string]: {
    [symbol: string]: number;
  };
}
