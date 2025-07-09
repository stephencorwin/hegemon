import React from 'react';
import clsx from 'clsx';
import {useHegemon} from '../../../hooks';
import {formatPercent, formatCurrency} from '../../../formatters';
import {
  Tile,
  StatusWrapper,
  StatusTextWrapper,
  SellButton,
  SellButtonHalf,
  SellButtonsWrapper,
  EmptyValue,
  FillValue,
  GoalValue,
} from './styles';

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
    (quantity: number, limit: number = sellAsk) =>
    () => {
      if (isOption) {
        market.options.sell(symbol, optionSymbol, limit, quantity);
      } else {
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
          <SellButton
            onClick={handleSell(quantity * 0.1)}
            title="Attempt to sell 10% of the remaining quantity at the current price."
          >
            -10%
          </SellButton>
          <SellButton
            onClick={handleSell(quantity * 0.25)}
            title="Attempt to sell 25% of the remaining quantity at the current price."
          >
            -25%
          </SellButton>
          <SellButton
            onClick={handleSell(quantity * 0.5)}
            title="Attempt to sell 50% of the remaining quantity at the current price."
          >
            -50%
          </SellButton>
          <SellButton
            onClick={handleSell(quantity)}
            title="Attempt to sell 100% of the remaining quantity at the current price."
          >
            -100%
          </SellButton>
        </div>
        <div>
          <SellButtonHalf
            onClick={handleSell(quantity, getGoalValue(0))}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue(0))} (${getGoalLabel(0)} profit)`}
          >
            {getGoalLabel(0)}
          </SellButtonHalf>
          <SellButtonHalf
            onClick={handleSell(quantity, getGoalValue(0.5))}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue())} (${getGoalLabel(0.5)} profit)`}
          >
            {getGoalLabel(0.5)}
          </SellButtonHalf>
          <SellButtonHalf
            onClick={handleSell(quantity, getGoalValue(1))}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue(2))} (${getGoalLabel(1)} profit)`}
          >
            {getGoalLabel(1)}
          </SellButtonHalf>
          <SellButtonHalf
            onClick={handleSell(quantity, getGoalValue(1.5))}
            title={`Sell ${quantity} at ${formatCurrency(getGoalValue(3))} (${getGoalLabel(1.5)} profit)`}
          >
            {getGoalLabel(1.5)}
          </SellButtonHalf>
        </div>
      </SellButtonsWrapper>
    </Tile>
  );
}
