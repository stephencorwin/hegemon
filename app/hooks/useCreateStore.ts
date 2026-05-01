import React, {useRef} from 'react';
import {proxy} from 'valtio';
import type {IHegemonStore} from '../types';

export function useCreateStore(overrides?: IHegemonStore) {
  const ref = useRef<IHegemonStore>(null);

  // Avoid re-creating store during re-renders.
  if (!ref.current) {
    ref.current = createStore(overrides);
  }

  return ref.current;
}

/**
 * Creates a handler that throws an error if called before it is defined.
 * This is useful for functions that are are defined by children components at runtime
 */
function defaultHandler(name: string, hideMessage = false) {
  return (): void => {
    // eslint-disable-next-line no-console
    if (!hideMessage) {
      console.error(`${name} was used before it was defined`);
    }
  };
}

export function createStore(overrides?: {
  [K in keyof IHegemonStore]?: IHegemonStore[K];
}) {
  const HegemonStore: IHegemonStore = proxy<IHegemonStore>({
    __forceRenderUniqueToken: 0,
    status: {
      initialized: false,
      loading: false,
      accountBalancesFetched: false,
      health: {
        current: 0,
        max: 0,
      },
      mana: {
        current: 0,
        max: 0,
      },
      optionsExpiration: null,
    },
    //@ts-ignore
    registerProfile: defaultHandler('[registerProfile] registerProfile'),
    //@ts-ignore
    unregisterProfile: defaultHandler('[unregisterProfile] unregisterProfile'),
    //@ts-ignore
    login: defaultHandler('[login] login'),
    //@ts-ignore
    logout: defaultHandler('[logout] logout'),
    //@ts-ignore
    fetchSavedProfiles: defaultHandler(
      '[fetchSavedProfiles] fetchSavedProfiles'
    ),
    //@ts-ignore
    persistData: defaultHandler('[persistData] persistData'),
    //@ts-ignore
    fetch: defaultHandler('[restoreData] restoreData'),
    savedProfiles: [],
    account: {
      balances: {
        total: 0,
        available: 0,
        //@ts-ignore
        fetch: defaultHandler('[account.balances] fetch'),
      },
      positions: {
        cache: {},
        //@ts-ignore
        fetch: defaultHandler('[account.positions] fetch'),
      },
      orders: {
        cache: {},
        //@ts-ignore
        fetch: defaultHandler('[account.orders] fetch'),
        //@ts-ignore
        cancel: defaultHandler('[account.orders] cancel'),
      },
    },
    market: {
      subscribed: {
        stocks: [],
        options: [],
      },
      //@ts-ignore
      lookupSymbol: defaultHandler('[market] lookupSymbol'),
      stocks: {
        cache: {},
        //@ts-ignore
        fetch: defaultHandler('[market.stocks] fetch'),
        //@ts-ignore
        buy: defaultHandler('[market.stocks] buy'),
        //@ts-ignore
        sell: defaultHandler('[market.stocks] sell'),
      },
      options: {
        cache: {},
        sentimentCache: {},
        //@ts-ignore
        snapshotSentiment: defaultHandler('[market.options] snapshotSentiment'),
        //@ts-ignore
        fetch: defaultHandler('[market.options] fetch'),
        //@ts-ignore
        buy: defaultHandler('[market.options] buy'),
        //@ts-ignore
        sell: defaultHandler('[market.options] sell'),
      },
      queue: {
        setLimitSell: [],
      },
    },
  });

  // create a global reference for debugging purposes
  window['HEGEMON'] = HegemonStore;

  return HegemonStore;
}

export const StoreContext = React.createContext<IHegemonStore | null>(null);
