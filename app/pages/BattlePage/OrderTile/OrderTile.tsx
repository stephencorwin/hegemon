import React from 'react';
import {useHegemon} from '../../../hooks';
import {Tile} from './styles';
import {formatCurrency} from '../.././../formatters';

export interface IOrderTileProps {
  id: number;
}

export function OrderTile({id}: IOrderTileProps) {
  const {snapshot} = useHegemon();
  const {account} = snapshot;
  const orderData = account.orders.cache[id];
  const {
    quantity,
    filledQuantity,
    symbol,
    optionSymbol,
    optionType,
    optionStrike,
    type,
    price,
    status,
  } = orderData;
  const isOption = !!optionSymbol;

  return (
    <Tile>
      <div>[{orderData.side.toUpperCase()}]</div>
      <div style={{marginTop: 5}}>
        <strong>
          {symbol}
          {isOption && `: ${optionType[0].toUpperCase()}${optionStrike}`}
        </strong>
        <strong style={{marginLeft: 20}}>x{quantity}</strong>
      </div>
      <hr />
      <div>
        Price:{' '}
        <strong style={{marginLeft: 10}}>
          {type === 'market' ? ' market' : formatCurrency(price)}
        </strong>
      </div>
      <div>
        Filled:{' '}
        <strong style={{marginLeft: 10}}>
          {filledQuantity}/{quantity}
        </strong>
      </div>
      <div>
        Status: <strong style={{marginLeft: 10}}>{status}</strong>
      </div>
      <div style={{marginTop: 10}}>
        <button onClick={() => account.orders.cancel(id)}>Cancel</button>
      </div>
    </Tile>
  );
}
