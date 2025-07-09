import React from 'react';
import clsx from 'clsx';
import {
  Container,
  MacroButton,
  MacroButtonEmpty,
  Cost,
  TrancheCirclesWrapper,
  TrancheCircle,
} from './styles';
import {useHegemon} from '../../../hooks';
import {hydrateMacro} from '../../../utils';
import {formatNumberAsString} from '../../../formatters';
import {
  IMacroLegHydrated,
  IOptions,
  IStock,
  ORDER_CLASS,
  IMacroHydrated,
  AUTOMATION_TYPE,
  ORDER_SIDE,
  OPTION_TYPE,
} from '../../../types';

export interface IMacroBarProps {
  style?: React.CSSProperties;
  className?: string;
  macroIds?: string[];
}

export function MacroBar({style, className, macroIds = []}: IMacroBarProps) {
  const {snapshot, store} = useHegemon();
  const {profile, market, account} = snapshot;
  const {settings} = profile;
  const {limitBreak} = settings;
  const macros = macroIds.map((id) => profile.macros[id], []);

  const optionsData = market.options.cache[snapshot.market.subscribed.target];
  const stocksData = market.stocks.cache[snapshot.market.subscribed.target];

  // bypass typing issues and reduce redundancy
  function hydrateMacroCoerced(macro: any, limitBreak: number) {
    return hydrateMacro(
      macro,
      {stocksData, optionsData} as {stocksData: IStock; optionsData: IOptions},
      limitBreak
    );
  }

  const handleBuy = (macroHydrated: IMacroHydrated) => async () => {
    macroHydrated.legs.forEach(async (leg: IMacroLegHydrated) => {
      switch (leg.orderClass) {
        case ORDER_CLASS.OPTION: {
          await market.options.buy(
            leg.symbol,
            leg.optionSymbol,
            leg.limit,
            leg.quantity
          );
          break;
        }
        case ORDER_CLASS.EQUITY: {
          await market.stocks.buy(leg.symbol, leg.limit, leg.quantity);
          break;
        }
      }

      leg.automation.forEach((auto) => {
        if (auto.type === AUTOMATION_TYPE.LIMIT_SELL) {
          store.market.queue.setLimitSell.push({
            symbol: leg.symbol,
            optionSymbol: leg.optionSymbol,
            side: leg.optionSymbol ? ORDER_SIDE.SELL_TO_CLOSE : ORDER_SIDE.SELL,
            limit: auto.limit,
            quantity: auto.quantity,
          });
        }
      });
    });
  };
  return (
    <Container style={style} className={className}>
      {macros.map((macro) => {
        let macroHydrated = hydrateMacroCoerced(macro, limitBreak.current);

        if (limitBreak.maxOverride) {
          const macroHydratedLB1 = hydrateMacroCoerced(macro, 1);
          const potentialContactCost = macroHydratedLB1.legs.reduce(
            (acc, leg) => {
              acc += leg.quantity * 0.4;
              return acc;
            },
            0.4
          );
          const limitBreakPotential = Math.floor(
            account.balances.available /
              (macroHydratedLB1.limit + potentialContactCost)
          );
          macroHydrated = hydrateMacroCoerced(macro, limitBreakPotential);
        }

        const disabled = macroHydrated.limit <= 0;

        return (
          <MacroButton
            key={macro.id}
            style={{backgroundImage: `url('${macro.icon}')`}}
            title={`${macro.name}: ${macro.description}`}
            disabled={disabled}
            {...(!disabled && {onClick: handleBuy(macroHydrated)})}
          >
            <Cost>
              {disabled ? 'N/A' : macroHydrated.limit.toLocaleString()}
            </Cost>
            <TrancheCirclesWrapper>
              {macroHydrated.legs.map(
                (leg, i) =>
                  leg.optionTranche !== undefined && (
                    <TrancheCircle
                      key={i}
                      className={clsx({
                        call: leg.optionType === OPTION_TYPE.CALL,
                        put: leg.optionType === OPTION_TYPE.PUT,
                      })}
                    >
                      {formatNumberAsString(leg.optionTranche, 0)}
                    </TrancheCircle>
                  )
              )}
            </TrancheCirclesWrapper>
          </MacroButton>
        );
      })}
      {Array(5 - macroIds.length)
        .fill({})
        .map((_, i) => (
          <MacroButtonEmpty key={i} />
        ))}
    </Container>
  );
}
