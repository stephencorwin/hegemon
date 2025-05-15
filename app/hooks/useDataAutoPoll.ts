import {useCallback, useEffect, useRef, useState} from 'react';
import {useHegemon} from './useHegemon';
import {MAX_RPM} from '../types';
import {getRPMInterval} from '../utils';

/**
 * Automatically polls for data and caches the results
 */
export function useDataAutoPoll() {
  const {snapshot, store} = useHegemon();
  const {profile, market, account} = snapshot;
  const {
    isPaper,
    settings: {pollingDistribution, watchlist},
  } = profile;
  const [stockDataReady, setStockDataReady] = useState(false);
  const lastOptionFetched = useRef<string | null>(null);

  // auto subscribe to watch list
  useEffect(() => {
    // set initial subscribe targets
    const defaultSymbol = watchlist[0];
    if (defaultSymbol) {
      store.market.subscribed.target = watchlist[0];
      store.market.subscribed.options = [defaultSymbol];
    }

    store.market.subscribed.stocks = [...watchlist];
    store.market.subscribed.options = [...watchlist];
  }, [watchlist]);

  /**
   * MARKET_STOCKS
   */
  const marketStocksCB = useCallback(async () => {
    console.debug('[market.stocks] polling data');
    const stocksData = await market.stocks.fetch(
      store.market.subscribed.stocks
    );
    store.market.stocks.cache = stocksData;
    setStockDataReady(true);

    return () => {
      setStockDataReady(false);
    };
  }, [store, market.stocks.fetch]);
  useEffect(() => {
    if (!stockDataReady) return;

    const intervalId = setInterval(
      marketStocksCB,
      getRPMInterval(
        pollingDistribution.market.stocks,
        MAX_RPM.MARKETS,
        null,
        isPaper
      )
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [
    store,
    stockDataReady,
    marketStocksCB,
    pollingDistribution.market.stocks,
    isPaper,
  ]);
  useEffect(() => {
    marketStocksCB();
  }, [marketStocksCB]);

  /**
   * MARKET_OPTIONS
   */
  const marketOptionsCB = useCallback(async () => {
    console.debug('[market.options] polling data');

    // always fetch the target data
    if (market.subscribed.target) {
      store.market.options.cache[market.subscribed.target] =
        await market.options.fetch(market.subscribed.target);
    }

    // we don't need to double fetch the subscribed target
    const filteredSubscribedOptions = market.subscribed.options.filter(
      (symbol) => symbol !== market.subscribed.target
    );

    // cycle through the subscribed options
    const lastOptionFetchedIndex = filteredSubscribedOptions.findIndex(
      (symbol) => symbol === lastOptionFetched.current
    );
    const nextOptionToFetchSymbol =
      filteredSubscribedOptions[lastOptionFetchedIndex + 1];

    store.market.options.cache[nextOptionToFetchSymbol] =
      await market.options.fetch(nextOptionToFetchSymbol);

    // track the option that was just fetched for the next cycle
    lastOptionFetched.current = nextOptionToFetchSymbol;
  }, [
    market.options.fetch,
    market.subscribed.options,
    market.subscribed.target,
  ]);
  useEffect(() => {
    if (!stockDataReady) return;

    const intervalId = setInterval(
      marketOptionsCB,

      // we make 2 requests per each interval call
      getRPMInterval(
        pollingDistribution.market.options / 2,
        MAX_RPM.MARKETS,
        null,
        isPaper
      )
    );
    return () => {
      clearInterval(intervalId);
    };
  }, [
    store,
    stockDataReady,
    marketOptionsCB,
    pollingDistribution.market.options,
    isPaper,
  ]);
  useEffect(() => {
    if (!stockDataReady) return;

    marketOptionsCB();
  }, [stockDataReady, marketOptionsCB]);

  /**
   * ACCOUNT_BALANCES
   */
  const accountBalancesCB = useCallback(async () => {
    console.debug('[account.balances] polling data');
    const balancesData = await account.balances.fetch();
    if (!balancesData) return;

    store.account.balances.total = balancesData.total;
    store.account.balances.available = balancesData.available;
    store.account.balances.unsettled = balancesData.unsettled;
  }, [account.balances.fetch]);
  useEffect(() => {
    const intervalId = setInterval(
      accountBalancesCB,
      getRPMInterval(
        pollingDistribution.account.balances,
        MAX_RPM.ACCOUNTS,
        null,
        isPaper
      )
    );
    return () => {
      clearInterval(intervalId);
    };
  }, [store, accountBalancesCB, pollingDistribution.account, isPaper]);
  useEffect(() => {
    accountBalancesCB();
  }, [accountBalancesCB]);

  /**
   * ACCOUNT_POSITIONS
   */
  const positionsCB = useCallback(async () => {
    console.debug('[account.positions] polling data');
    const positionsData = await account.positions.fetch();
    if (!positionsData) return;

    store.account.positions.cache = positionsData;
  }, [account.positions.fetch]);
  useEffect(() => {
    const intervalId = setInterval(
      positionsCB,
      getRPMInterval(
        pollingDistribution.account.positions,
        MAX_RPM.ACCOUNTS,
        null,
        isPaper
      )
    );
    return () => {
      clearInterval(intervalId);
    };
  }, [store, positionsCB, pollingDistribution.account.positions, isPaper]);
  useEffect(() => {
    positionsCB();
  }, [positionsCB]);

  /**
   * ACCOUNT_ORDERS
   */
  const ordersCB = useCallback(async () => {
    console.debug('[account.orders] polling data');
    const ordersData = await account.orders.fetch();
    if (!ordersData) return;

    store.account.orders.cache = ordersData;
  }, [account.orders.fetch]);
  useEffect(() => {
    const intervalId = setInterval(
      ordersCB,
      getRPMInterval(
        pollingDistribution.account.orders,
        MAX_RPM.ACCOUNTS,
        null,
        isPaper
      )
    );
    return () => {
      clearInterval(intervalId);
    };
  }, [store, ordersCB, pollingDistribution.account.orders, isPaper]);
  useEffect(() => {
    ordersCB();
  }, [ordersCB]);
}
