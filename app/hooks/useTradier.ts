import {useEffect, useMemo} from 'react';
import {sortBy} from 'lodash';
import axios from 'axios';
import {useHegemon} from './useHegemon';
import {
  OPTION_TYPE,
  IStock,
  ACCOUNT_TYPE,
  ILink,
  DeepWriteable,
  ORDER_SIDE,
} from '../types';
import {calcOptionsVolumeSentiment, calcPrices} from '../math';
import {formatNumber} from '../formatters';

export const SANDBOX_URL = 'https://sandbox.tradier.com/v1';
export const PRODUCTION_URL = 'https://api.tradier.com/v1';
export function getTradierBaseURL(isPaper: boolean) {
  return isPaper ? SANDBOX_URL : PRODUCTION_URL;
}
export function getTradierHeaders(apiKey: string) {
  return {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
    ['Content-Type']: 'application/x-www-form-urlencoded',
  };
}

export function useTradier() {
  const {snapshot, store} = useHegemon();
  const {profile: {id, accountId, isPaper, apiKey} = {}} = snapshot;

  const headers = useMemo(() => getTradierHeaders(apiKey), [apiKey]);
  const BASE_URL = useMemo(() => getTradierBaseURL(isPaper), [isPaper]);

  useEffect(() => {
    // used for "pseudo-optimistic UI" feel. It only really works well with orders, because balances
    // take too long to update on the Tradier backend.
    async function refreshOrders() {
      store.account.orders.cache = await store.account.orders.fetch();
    }

    /**
     * MARKET -> LOOKUP SYMBOL
     */
    store.market.lookupSymbol = async (symbol: string) => {
      let url = `${BASE_URL}/markets/lookup`;
      url += `?q=${symbol}`;
      url += '&exchanges=Q,N&types=stock, option, etf, index';
      const {
        data: {securities},
      } = await axios({url, method: 'GET', headers});

      if (!securities?.security) return null;

      return {
        symbol: securities.security.symbol,
        exchange: securities.security.exchange,
        type: securities.security.type,
        description: securities.security.description,
      };
    };

    /**
     * ACCOUNT -> BALANCES -> FETCH
     */
    store.account.balances.fetch = async () => {
      if (!accountId) return;

      const url = `${BASE_URL}/accounts/${accountId}/balances`;
      const {
        data: {balances},
      } = await axios({url, method: 'GET', headers});

      store.status.accountBalancesFetched = true;
      return {
        total: balances.total_equity,
        ...(balances.account_type === ACCOUNT_TYPE.CASH && {
          available: balances.cash.cash_available,
        }),
        ...(balances.account_type === ACCOUNT_TYPE.MARGIN && {
          available: balances.margin.option_buying_power,
        }),
        ...(balances.account_type === ACCOUNT_TYPE.PDT && {
          available: balances.pdt.option_buying_power,
        }),
      };
    };

    /**
     * ACCOUNT -> POSITIONS -> FETCH
     */
    store.account.positions.fetch = async () => {
      if (!accountId) return;

      const url = `${BASE_URL}/accounts/${accountId}/positions`;
      const {
        data: {positions},
      } = await axios({url, method: 'GET', headers});

      // no positions found
      if (!positions.position) return {};

      // positions found, map the properties
      return (
        Array.isArray(positions.position)
          ? positions.position
          : [positions.position]
      ).reduce((acc, position) => {
        let price = position.cost_basis / position.quantity;
        let ask = 0;
        let bid = 0;
        let symbol = position.symbol;
        let optionSymbol = null;
        let optionType = null;
        let optionStrike = null;

        const firstDigitRegex = position.symbol.match(/\d/);
        const isOption = firstDigitRegex && firstDigitRegex.index !== -1;
        if (!isOption) {
          const stockData = store.market.stocks.cache[position.symbol];

          // stockData not available, escape
          if (!stockData) return acc;

          ask = stockData.ask;
          bid = stockData.bid;
        } else {
          price = price * 0.01;
          const optionRootSymbol = position.symbol.slice(
            0,
            firstDigitRegex.index
          );
          const optionInstructionSymbols = position.symbol.slice(
            firstDigitRegex.index
          );
          optionType = optionInstructionSymbols.includes('C')
            ? OPTION_TYPE.CALL
            : OPTION_TYPE.PUT;
          const optionsData =
            store.market.options.cache[optionRootSymbol]?.chain[optionType];

          // optionsData not available, escape
          if (!optionsData) return acc;

          const link = [...optionsData.below, ...optionsData.above].find(
            (link) => link.optionSymbol === position.symbol
          );

          // link data not available, escape
          if (!link) return acc;

          ask = link.ask;
          bid = link.bid;
          symbol = optionRootSymbol;
          optionSymbol = position.symbol;
          optionStrike = link.strike;
        }

        const {midAsk, buyAsk, sellAsk} = calcPrices(bid, ask);
        const change = formatNumber(sellAsk - price);
        const changePercent = formatNumber(sellAsk / price - 1, 3);

        acc[position.id] = {
          id: position.id,
          symbol,
          optionSymbol,
          optionType,
          optionStrike,
          price,
          ask,
          midAsk,
          buyAsk,
          sellAsk,
          bid,
          costBasis: position.cost_basis,
          change,
          changePercent,
          dateAcquired: position.date_acquired,
          quantity: position.quantity,
        };
        return acc;
      }, {});
    };

    /**
     * ACCOUNT -> ORDERS -> FETCH
     */
    store.account.orders.fetch = async () => {
      if (!accountId) return;

      const url = `${BASE_URL}/accounts/${accountId}/orders`;
      const {
        data: {orders},
      } = await axios({url, method: 'GET', headers});

      // no orders found
      if (!orders.order) return {};

      // orders found, map the properties
      return (
        Array.isArray(orders.order) ? orders.order : [orders.order]
      ).reduce((acc, order) => {
        let symbol = order.symbol;
        let optionSymbol = order.option_symbol;
        let optionType = null;
        let optionStrike = null;

        const firstDigitRegex = optionSymbol?.match(/\d/);
        const isOption = firstDigitRegex && firstDigitRegex.index !== -1;

        if (isOption) {
          const optionRootSymbol = optionSymbol.slice(0, firstDigitRegex.index);
          const optionInstructionSymbols = optionSymbol.slice(
            firstDigitRegex.index
          );
          optionType = optionInstructionSymbols.includes('C')
            ? OPTION_TYPE.CALL
            : OPTION_TYPE.PUT;
          const optionsData =
            store.market.options.cache[optionRootSymbol]?.chain[optionType];

          // optionsData not available, escape
          if (!optionsData) return acc;

          const link = [...optionsData.below, ...optionsData.above].find(
            (link) => link.optionSymbol === optionSymbol
          );

          // linkData not available escape
          if (!link) return acc;

          optionStrike = link.strike;
        }

        acc[order.id] = {
          id: order.id,
          type: order.type,
          symbol,
          optionSymbol,
          optionStrike,
          optionType,
          side: order.side,
          duration: order.duration,
          quantity: order.quantity,
          filledQuantity: order.last_fill_quantity,
          remainingQuantity: order.remaining_quantity,
          price: order.price,
          averageFillPrice: order.avg_fill_price,
          class: order.class,
          createDate: order.create_date,
          status: order.status,
        };
        return acc;
      }, {});
    };

    /**
     * ACCOUNT -> ORDERS -> CANCEL
     */
    store.account.orders.cancel = async (id: number) => {
      if (!accountId) return;

      const url = `${BASE_URL}/accounts/${accountId}/orders/${id}`;
      const {
        data: {order},
      } = await axios({url, method: 'DELETE', headers});

      // no order found
      if (!order) return;

      // request an update right away now that the order has been submitted
      await refreshOrders();
    };

    /**
     * STOCKS -> FETCH
     */
    store.market.stocks.fetch = async (symbols: string[]) => {
      let url = `${BASE_URL}/markets/quotes`;
      url += `?symbols=${symbols.join(',')}`;

      const {
        data: {
          quotes: {quote},
        },
      } = await axios({url, method: 'GET', headers});

      return (Array.isArray(quote) ? quote : [quote]).reduce<{
        [symbol: string]: IStock;
      }>((acc, quote) => {
        const {midAsk, buyAsk, sellAsk} = calcPrices(quote.bid, quote.ask);
        acc[quote.symbol] = {
          symbol: quote.symbol,
          last: quote.last,
          change: quote.change,
          open: quote.open,
          high: quote.high,
          low: quote.low,
          close: quote.close,
          bid: quote.bid,
          ask: quote.ask,
          midAsk,
          buyAsk,
          sellAsk,
          changePercentage: quote.change_percentage,
          volume: quote.volume,
          averageVolume: quote.average_volume,
          prevclose: quote.prevclose,
          week52High: quote.week_52_high,
          week52Low: quote.week_52_low,
        };
        return acc;
      }, {});
    };

    /**
     * STOCKS -> BUY
     */
    store.market.stocks.buy = async (
      symbol: string,
      limit: number,
      quantity: number
    ) => {
      let url = `${BASE_URL}/accounts/${accountId}/orders`;

      const {
        data: {order},
      } = await axios({
        url,
        method: 'POST',
        headers,
        data: {
          class: 'equity',
          symbol,
          side: ORDER_SIDE.BUY,
          quantity: Math.floor(quantity),
          type: 'limit',
          duration: 'day',
          price: formatNumber(limit),
        },
      });

      // request an update right away now that the order has been submitted
      await refreshOrders();

      return {
        assetId: order?.id,
        symbol,
        limit,
        quantity,
      };
    };

    /**
     * STOCKS -> SELL
     */
    store.market.stocks.sell = async (
      symbol: string,
      limit: number,
      quantity: number
    ) => {
      let url = `${BASE_URL}/accounts/${accountId}/orders`;

      const {
        data: {order},
      } = await axios({
        url,
        method: 'POST',
        headers,
        data: {
          class: 'equity',
          symbol,
          side: ORDER_SIDE.SELL,
          quantity: Math.floor(quantity),
          type: 'limit',
          duration: 'day',
          price: formatNumber(limit),
        },
      });

      // request an update right away now that the order has been submitted
      await refreshOrders();

      return {
        assetId: order.id,
        symbol,
        limit,
        quantity,
      };
    };

    /**
     * OPTIONS -> FETCH
     */
    store.market.options.fetch = async (symbol: string) => {
      const stock = store.market.stocks.cache[symbol];
      if (!stock) return;

      const upperRange = stock.ask * 1.2;
      const lowerRange = stock.ask * 0.8;
      const rangeCountLimit = 15;
      const expiration = store.profile.settings.optionsExpiration;

      let url = `${BASE_URL}/markets/options/chains`;
      url += `?symbol=${symbol}`;
      url += `&expiration=${expiration}`;

      const {
        data: {
          options: {option},
        },
      } = await axios({url, method: 'GET', headers});

      const chain = {
        [OPTION_TYPE.CALL]: {above: [], below: []},
        [OPTION_TYPE.PUT]: {above: [], below: []},
      } as {[key in OPTION_TYPE]: {above: ILink[]; below: ILink[]}};

      sortBy(option, (link) => link.strike).forEach((link, i) => {
        // filter out the outliers
        if (link.strike > upperRange) return;
        if (link.strike < lowerRange) return;

        const {midAsk, buyAsk, sellAsk} = calcPrices(link.bid, link.ask);

        const newLink: ILink = {
          symbol: symbol,
          optionSymbol: link.symbol,
          strike: link.strike,
          ask: link.ask,
          bid: link.bid,
          midAsk,
          buyAsk,
          sellAsk,
          volume: link.volume,
          openInterest: link.open_interest,
        };

        const chainAbove = chain[link.option_type].above;
        const chainBelow = chain[link.option_type].below;

        // sort the new link into the correct QOL arrays
        if (link.strike > stock.ask) {
          if (chainAbove.length >= rangeCountLimit) return;
          chainAbove.push(newLink);
        } else {
          // if (chainBelow.length >= rangeCountLimit) return;
          chainBelow.unshift(newLink);
        }
      });

      // we have to apply the limit here because of the reverse ordering
      // between above and below
      chain.call.below.splice(rangeCountLimit, chain.call.below.length);
      chain.put.below.splice(rangeCountLimit, chain.put.below.length);

      const {midAsk, buyAsk, sellAsk} = calcPrices(stock.bid, stock.ask);
      return {
        symbol,
        ask: stock.ask,
        midAsk,
        buyAsk,
        sellAsk,
        bid: stock.bid,
        expiration,
        chain,
      };
    };

    /**
     * OPTIONS -> BUY
     */
    store.market.options.buy = async (
      symbol: string,
      optionSymbol,
      limit: number,
      quantity: number
    ) => {
      let url = `${BASE_URL}/accounts/${accountId}/orders`;

      const {
        data: {order},
      } = await axios({
        url,
        method: 'POST',
        headers,
        data: {
          class: 'option',
          symbol,
          option_symbol: optionSymbol,
          side: ORDER_SIDE.BUY_TO_OPEN,
          quantity: Math.floor(quantity),
          type: 'limit',
          duration: 'day',
          price: formatNumber(limit),
        },
      });

      // request an update right away now that the order has been submitted
      await refreshOrders();

      return {
        assetId: order.id,
        symbol,
        limit,
        quantity,
      };
    };

    /**
     * OPTIONS -> SELL
     */
    store.market.options.sell = async (
      symbol: string,
      optionSymbol,
      limit: number,
      quantity: number
    ) => {
      // if the quantity was rounded down to 0, we escape
      // because we can't sell 0 of something
      if (!quantity) return;

      let url = `${BASE_URL}/accounts/${accountId}/orders`;

      const {
        data: {order},
      } = await axios({
        url,
        method: 'POST',
        headers,
        data: {
          class: 'option',
          symbol,
          option_symbol: optionSymbol,
          side: ORDER_SIDE.SELL_TO_CLOSE,
          quantity: Math.floor(quantity),
          type: 'limit',
          duration: 'day',
          price: formatNumber(limit),
        },
      });

      // request an update right away now that the order has been submitted
      await refreshOrders();

      return {
        assetId: order.id,
        symbol,
        limit,
        quantity,
      };
    };

    /**
     * OPTIONS -> SNAPSHOT_SENTIMENT
     */
    store.market.options.snapshotSentiment = async () => {
      const sentimentSnapshot = store.profile.settings.watchlist.reduce(
        (acc, symbol) => {
          const optionsData = store.market.options.cache[symbol];
          const weeklySentiment = calcOptionsVolumeSentiment(
            optionsData?.chain as DeepWriteable<typeof optionsData.chain>
          );
          acc[symbol] = weeklySentiment;
          return acc;
        },
        {}
      );

      store.market.options.sentimentCache = sentimentSnapshot;
      console.log(
        '[EXPORT] Weekly Sentiment Snapshot: ',
        JSON.stringify(sentimentSnapshot)
      );
    };
  }, [store, id, accountId, headers, BASE_URL]);
}
