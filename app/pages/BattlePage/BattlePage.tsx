import React, {useState} from 'react';
import {useHegemon} from '../../hooks';
import {formatCurrency, formatPercent} from '../../formatters';
import {DeepWriteable, IOrder, IPosition} from '../../types';
import {calcOptionsVolumeSentiment} from '../../math';
import {
  Main,
  MacroBarLeft,
  MacroBarRight,
  LimitBreakLeft,
  TileWrapper,
  ScrollContainer,
  LogoutButton,
} from './styles';
import {ResourceGlobe} from './ResourceGlobe';
import {WatchList} from './WatchList';
import {OrderTile} from './OrderTile';
import {PositionTile} from './PositionTile';
import {sortBy} from 'lodash';

export function BattlePage() {
  const {snapshot} = useHegemon();
  const {status, profile, market, account, logout} = snapshot;
  const {health, mana} = status;
  const macroIds = Object.keys(profile.macros);
  const target = snapshot.market.subscribed.target;
  const optionsData = market.options.cache[target];
  const stocksData = market.stocks.cache[target];
  const [collapseOrders, setCollapseOrders] = useState(false);
  const sentimentCache = market.options.sentimentCache[target] ?? 0;
  const weeklySentiment = calcOptionsVolumeSentiment(
    optionsData?.chain as DeepWriteable<typeof optionsData.chain>
  );
  const dailySentiment = weeklySentiment - sentimentCache;

  const [showOnlyTargetRelated, setShowOnlyTargetRelated] = useState(false);
  const relatedOrders = sortBy(
    Object.values(account.orders.cache).reduce((acc, order) => {
      // filter out unrelated symbols
      if (showOnlyTargetRelated && !order.symbol.includes(target)) return acc;

      acc.push(order);
      return acc;
    }, [] as IOrder[]),
    ['optionSymbol', 'optionType', 'optionStrike']
  );

  const relatedPositions = sortBy(
    Object.values(account.positions.cache).reduce<IPosition[]>(
      (acc, position) => {
        // filter out unrelated symbols
        if (showOnlyTargetRelated && !position.symbol.includes(target))
          return acc;

        acc.push(position);
        return acc;
      },
      []
    ),
    ['optionSymbol', 'optionType', 'optionStrike']
  );

  return (
    <Main>
      <LogoutButton onClick={() => logout()}>Logout</LogoutButton>
      <LimitBreakLeft />
      <MacroBarLeft macroIds={macroIds.slice(0, 5)} />
      <MacroBarRight macroIds={macroIds.slice(5, 10)} />
      <ResourceGlobe health={health} mana={mana} />
      <WatchList symbols={profile.settings.watchlist} />

      {target && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 240px 0px 240px',
            height: 'calc(100vh - 140px)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{margin: '0 150px', background: '#939393', padding: 5}}
            onClick={() => setShowOnlyTargetRelated((prev) => !prev)}
          >
            <span>
              {target}
              {showOnlyTargetRelated && '*'}
            </span>
            <span style={{marginLeft: 120}}>
              ASK: {formatCurrency(stocksData?.ask)}
            </span>
            <span style={{marginLeft: 40}}>
              WS: {formatPercent(weeklySentiment)}
            </span>
            <span style={{marginLeft: 40}}>
              DS: {formatPercent(dailySentiment)}
            </span>
          </h1>

          {/* ORDERS / POSITIONS */}
          <ScrollContainer>
            {relatedOrders.length > 0 && (
              <>
                <h2
                  style={{margin: '5px 0'}}
                  onClick={() => setCollapseOrders((prev) => !prev)}
                >
                  Orders ({relatedOrders.length}
                  {collapseOrders ? ' - Hidden' : ''}):
                </h2>
                {!collapseOrders && (
                  <TileWrapper>
                    {relatedOrders.map((order) => (
                      <OrderTile key={order.id} id={order.id} />
                    ))}
                  </TileWrapper>
                )}
                <hr style={{margin: '20px 0'}} />
              </>
            )}

            <TileWrapper>
              {relatedPositions.map((position) => (
                <PositionTile key={position.id} id={position.id} />
              ))}
            </TileWrapper>
          </ScrollContainer>
        </div>
      )}
    </Main>
  );
}
