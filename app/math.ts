import {formatNumber} from './formatters';
import {ILink, IOptions, IOrder, OPTION_TYPE, ORDER_SIDE} from './types';

/**
 * Compares the near strike volume for calls and puts in an effort
 * to determine sentiment for innate momentum
 */
export function calcOptionsVolumeSentiment(
  chain: IOptions['chain'] = {
    [OPTION_TYPE.CALL]: {all: [], above: [], below: []},
    [OPTION_TYPE.PUT]: {all: [], above: [], below: []},
  }
) {
  // for fairness, we want to make sure we are only using
  // the same number of available tranches in each direction
  const limit = Math.min(
    Math.min(
      chain[OPTION_TYPE.CALL].below.length,
      chain[OPTION_TYPE.PUT].below.length
    ),
    Math.min(
      chain[OPTION_TYPE.CALL].above.length,
      chain[OPTION_TYPE.PUT].above.length
    )
  );

  // not enough data to continue
  if (!limit) return 0;

  function joinLinks(below: ILink[], above: ILink[]) {
    return [...below.slice(0, limit), ...above.slice(0, limit)];
  }

  const calls = joinLinks(
    chain[OPTION_TYPE.CALL].below,
    chain[OPTION_TYPE.CALL].above
  );
  const puts = joinLinks(
    chain[OPTION_TYPE.PUT].below,
    chain[OPTION_TYPE.PUT].above
  );

  const cv = calls.reduce((acc, call) => {
    acc += call.volume + call.openInterest;
    return acc;
  }, 0);
  const pv = puts.reduce((acc, put) => {
    acc += put.volume + put.openInterest;
    return acc;
  }, 0);
  const tv = cv + pv;

  const sentiment = formatNumber(cv / tv - pv / tv, 3);
  return sentiment;
}

/**
 * Calculates the amount of buying power to hold account all buying orders
 */
export function getOrdersBalanceHoldingValue(orders: {
  [symbol: string]: IOrder;
}): number {
  return Object.values(orders).reduce((acc, order) => {
    const isOption = !!order.optionSymbol;
    const isBuy = !!(
      order.side === ORDER_SIDE.BUY_TO_OPEN || order.side === ORDER_SIDE.BUY
    );
    const value =
      order.price * order.quantity * (isOption ? 100 : 1) * (isBuy ? -1 : 0);
    return acc + value;
  }, 0);
}

/**
 * Calculates various prices used for buying, selling, and comparisons
 * Bias the direction of each slightly towards each side for execution speed.
 */
export function calcPrices(bid: number, ask: number) {
  const range = ask - bid;
  const midAsk = bid + range * 0.5;
  const buyAsk = bid + range * 0.8;
  const sellAsk = bid + range * 0.2;
  return {
    range: formatNumber(range),
    midAsk: formatNumber(midAsk),
    buyAsk: formatNumber(buyAsk),
    sellAsk: formatNumber(sellAsk),
  };
}
