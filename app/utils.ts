import {formatNumber} from './formatters';
import {
  IMacro,
  IMacroHydrated,
  IMacroLegHydrated,
  IOptions,
  IStock,
  ORDER_CLASS,
} from './types';

export function getStrikePriceFromOptionsId(id) {
  let result = id.substr(id.length - 8, 7);
  result = removeLeadingZeroes(result);
  result = insertDecimal(result, result.length - 2);
  return result;
}

export function removeLeadingZeroes(str) {
  return str.replace(/^0+/, '');
}

export function insertDecimal(str, index) {
  return str.slice(0, index) + '.' + str.slice(index);
}

export function hydrateMacro(
  macro: IMacro,
  data: {
    stocksData: IStock;
    optionsData: IOptions;
  },
  limitBreak: number = 1
): IMacroHydrated {
  let macroHydratedLimit = 0;
  return {
    ...macro,
    legs: macro.legs.reduce((acc, leg) => {
      if (!data.optionsData || !data.stocksData) return acc;

      const legQuantity = leg.quantity * (limitBreak ?? 1);

      switch (leg.orderClass) {
        case ORDER_CLASS.EQUITY: {
          const newLeg: IMacroLegHydrated = {
            ...leg,
            symbol: data.stocksData.symbol,
            quantity: legQuantity,
            limit: formatNumber(
              data.stocksData.buyAsk +
                (leg.limitPercent
                  ? data.stocksData.buyAsk * (1 - leg.limitPercent)
                  : 0) +
                (leg.limitOffset ?? 0)
            ),
            label: `${data.stocksData.symbol}: ${data.stocksData.ask}`,
            automation: leg.automation.reduce((acc2, auto) => {
              acc2.push({
                ...auto,
                limit: data.stocksData.buyAsk * auto.goal,
                quantity: auto.quantityPercent
                  ? Math.floor(legQuantity * auto.quantityPercent)
                  : auto.quantity * limitBreak,
              });
              return acc2;
            }, []),
          };

          macroHydratedLimit += newLeg.limit * newLeg.quantity;
          acc.push(newLeg);
          break;
        }
        case ORDER_CLASS.OPTION: {
          let netOptionTranche = leg.optionTranche;

          // if the requested tranche is ATM, then we need to determin the closest tranche
          // to pivot to because a tranche is extremely RARELY ever ATM
          const trancheIsATM = leg.optionTranche === 0;
          const trancheDataFirstAbove =
            data.optionsData.chain[leg.optionType].above[0];
          const trancheDataFirstBelow =
            data.optionsData.chain[leg.optionType].below[0];
          if (trancheIsATM) {
            netOptionTranche =
              Math.abs(data.stocksData.ask - trancheDataFirstAbove.strike) <=
              Math.abs(data.stocksData.ask - trancheDataFirstBelow.strike)
                ? 1
                : -1;
          }

          const trancheIsAbove = netOptionTranche > 0;
          const trancheDataChain = trancheIsAbove
            ? data.optionsData.chain[leg.optionType].above
            : data.optionsData.chain[leg.optionType].below;
          // limit the tranche to the furthest chain in that direction instead of overshooting
          netOptionTranche = trancheIsAbove
            ? Math.min(trancheDataChain.length, netOptionTranche)
            : Math.max(-trancheDataChain.length, netOptionTranche);
          const trancheData = trancheDataChain[Math.abs(netOptionTranche) - 1];

          if (!trancheData) return acc;

          const trancheAsk = trancheData?.buyAsk;
          const newLeg: IMacroLegHydrated = {
            ...leg,
            symbol: trancheData.symbol,
            optionSymbol: trancheData.optionSymbol,
            quantity: legQuantity,
            limit: formatNumber(
              trancheAsk +
                (leg.limitPercent ? trancheAsk * (1 - leg.limitPercent) : 0) +
                (leg.limitOffset ?? 0)
            ),
            label: `${trancheIsAbove ? '+' : ''}${netOptionTranche}: ${trancheAsk}`,
            automation: leg.automation.reduce((acc2, auto) => {
              acc2.push({
                ...auto,
                limit: trancheAsk * auto.goal,
                quantity: auto.quantityPercent
                  ? Math.floor(legQuantity * auto.quantityPercent)
                  : auto.quantity * limitBreak,
              });
              return acc2;
            }, []),
          };

          // multiply by 100 because each contract is 100 shares
          macroHydratedLimit += newLeg.limit * newLeg.quantity * 100;
          acc.push(newLeg);
          break;
        }
      }
      return acc;
    }, []),
    limit: formatNumber(Math.ceil(macroHydratedLimit)),
  };
}

/**
 * Returns the maximum interval allowed within a minute
 */
export function getRPMInterval(
  rpm: number,
  maxRPM: number,
  buffer: number = 0.05,
  isPaper: boolean = false
) {
  const netMaxRPM = Math.floor(maxRPM * (1 - buffer) * (isPaper ? 0.5 : 1));
  return (60 / (netMaxRPM * rpm)) * 1000;
}
