import React from 'react';
import clsx from 'clsx';
import {useHegemon} from '../../../hooks';
import {formatPercent, formatCurrency} from '../../../formatters';
import {
  Tile,
  StatusWrapper,
  StatusTextWrapper,
  SellButtonFull,
  SellButtonHalf,
  SellButtonsWrapper,
  EmptyValue,
  FillValue,
  GoalValue,
} from './styles';
import {ORDER_SIDE} from '../../../types';

export interface IPositionTileProps {
  id: number;
}

export function PositionTile({id}: IPositionTileProps) {
  const {snapshot} = useHegemon();
  const {profile, account, market} = snapshot;
  const {settings} = profile;
  const positionData = account.positions.cache[id];
  const {
    quantity,
    symbol,
    optionSymbol,
    optionType,
    optionStrike,
    sellAsk,
    price,
    change,
    changePercent,
  } = positionData;
  const isOption = !!positionData.optionSymbol;

  const handleSell =
    (quantity: number, limit: number, replacePreviousOrders: boolean = false) =>
    async () => {
      if (isOption) {
        if (replacePreviousOrders) {
          await Promise.all(
            Object.values(account.orders.cache).map(async (order) => {
              if (order.symbol !== symbol) return;
              if (order.side !== ORDER_SIDE.SELL_TO_CLOSE) return;
              if (order.optionSymbol !== optionSymbol) return;
              if (order.optionType !== optionType) return;
              if (order.optionStrike !== optionStrike) return;

              await account.orders.cancel(order.id);
            })
          );
        }

        market.options.sell(symbol, optionSymbol, limit, quantity);
      } else {
        if (replacePreviousOrders) {
          await Promise.all(
            Object.values(account.orders.cache).map(async (order) => {
              if (order.symbol !== symbol) return;
              if (order.side !== ORDER_SIDE.SELL) return;
              if (!!order.optionSymbol) return;

              await account.orders.cancel(order.id);
            })
          );
        }

        market.stocks.sell(symbol, limit, quantity);
      }
    };

  function getGoalValue(multiplier: number = 1) {
    return (
      price * (1 + (settings.thresholds.profit.positionGoal - 1) * multiplier)
    );
  }

  function getGoalLabel(multiplier: number = 1) {
    return formatPercent(
      (settings.thresholds.profit.positionGoal - 1) * multiplier
    );
  }

  const goalPercent =
    changePercent <= 0
      ? 0
      : changePercent / (settings.thresholds.profit.positionGoal - 1);

  return (
    <Tile>
      <StatusWrapper>
        <StatusTextWrapper>
          <div>
            {formatCurrency((isOption ? 100 : 1) * quantity * change, true)}
          </div>
          <div>
            <div>
              {symbol}
              {isOption && `: ${optionType[0].toUpperCase()}${optionStrike}`}
            </div>
          </div>
          <div>{`x${quantity}`}</div>
          <div className={clsx({smallerText: sellAsk >= 100})}>
            {formatCurrency(sellAsk)}
            {' / '}
            {formatCurrency(price)}
          </div>
          <div className={clsx({smallerText: changePercent >= 1})}>
            {formatPercent(changePercent)}
          </div>
        </StatusTextWrapper>
        <EmptyValue>
          <FillValue style={{width: `${(1 + changePercent) * 100}%`}} />
          <GoalValue style={{width: `${goalPercent * 100}%`}} />
        </EmptyValue>
      </StatusWrapper>

      <SellButtonsWrapper>
        <div>
          <SellButtonHalf
            onClick={handleSell(
              quantity,
              getGoalValue(0.5),
              settings.positions.profitGoalsReplacePreviousOrders
            )}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue(0.5))} (${getGoalLabel(0.5)} profit)`}
          >
            {getGoalLabel(0.5)}
          </SellButtonHalf>
          <SellButtonHalf
            onClick={handleSell(
              quantity,
              getGoalValue(1),
              settings.positions.profitGoalsReplacePreviousOrders
            )}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue(1))} (${getGoalLabel(1)} profit)`}
          >
            {getGoalLabel(1)}
          </SellButtonHalf>
          <SellButtonHalf
            onClick={handleSell(
              quantity,
              getGoalValue(1.5),
              settings.positions.profitGoalsReplacePreviousOrders
            )}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue(1.5))} (${getGoalLabel(1.5)} profit)`}
          >
            {getGoalLabel(1.5)}
          </SellButtonHalf>
          <SellButtonHalf
            onClick={handleSell(
              quantity,
              getGoalValue(2),
              settings.positions.profitGoalsReplacePreviousOrders
            )}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue(2))} (${getGoalLabel(2)} profit)`}
          >
            {getGoalLabel(2)}
          </SellButtonHalf>
        </div>
        <div>
          {/* <SellButton
            onClick={handleSell(
              quantity * 0.1,
              sellAsk,
              settings.positions.sellPercentagesReplacePreviousOrders
            )}
            title="Attempt to sell 10% of the remaining quantity at the current price."
          >
            -10%
          </SellButton>
          <SellButton
            onClick={handleSell(
              quantity * 0.25,
              sellAsk,
              settings.positions.sellPercentagesReplacePreviousOrders
            )}
            title="Attempt to sell 25% of the remaining quantity at the current price."
          >
            -25%
          </SellButton>
          <SellButton
            onClick={handleSell(
              quantity * 0.5,
              sellAsk,
              settings.positions.sellPercentagesReplacePreviousOrders
            )}
            title="Attempt to sell 50% of the remaining quantity at the current price."
          >
            -50%
          </SellButton> */}
          <SellButtonFull
            onClick={handleSell(
              quantity,
              sellAsk,
              settings.positions.sellPercentagesReplacePreviousOrders
            )}
            title="Attempt to sell 100% of the remaining quantity at the current price."
          >
            Liquidate
          </SellButtonFull>
        </div>
      </SellButtonsWrapper>
    </Tile>
  );
}
