import React from 'react';
import clsx from 'clsx';
import {useHegemon} from '../../../hooks';
import {formatPercent, formatCurrency} from '../../../formatters';
import {
  Tile,
  StatusWrapper,
  StatusTextWrapper,
  SellButton,
  SellAllButton,
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

  const handleSell = (quantity: number) => () => {
    if (isOption) {
      market.options.sell(symbol, optionSymbol, sellAsk, quantity);
    } else {
      market.stocks.sell(symbol, sellAsk, quantity);
    }
  };

  // const changePercent = 0.15;
  const goalPercent =
    changePercent <= 0
      ? 0
      : changePercent / settings.thresholds.profit.positionGoal;
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
          <SellButton onClick={handleSell(quantity * 0.1)}>-10%</SellButton>
          <SellButton onClick={handleSell(quantity * 0.2)}>-20%</SellButton>
          <SellButton onClick={handleSell(quantity * 0.33)}>-33%</SellButton>
          <SellButton onClick={handleSell(quantity * 0.5)}>-50%</SellButton>
        </div>
        <SellAllButton onClick={handleSell(quantity)}>SELL 100%</SellAllButton>
      </SellButtonsWrapper>
    </Tile>
  );
}
