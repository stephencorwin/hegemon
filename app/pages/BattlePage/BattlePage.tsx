import React, {useEffect, useState} from 'react';
import {useHegemon} from '../../hooks';
import {formatCurrency, formatPercent} from '../../formatters';
import {DeepWriteable, IOrder, IPosition, ORDER_STATUS} from '../../types';
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

export function BattlePage() {
  const {snapshot, store} = useHegemon();
  const {status, profile, market, account} = snapshot;
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
  const relatedOrders = Object.values(account.orders.cache).reduce(
    (acc, order) => {
      // filter out unrelated symbols
      if (showOnlyTargetRelated && !order.symbol.includes(target)) return acc;
      if (order.status === ORDER_STATUS.CANCELED) return acc;
      if (order.status === ORDER_STATUS.REJECTED) return acc;
      if (order.status === ORDER_STATUS.FILLED) return acc;
      if (order.status === ORDER_STATUS.EXPIRED) return acc;
      acc.push(order);
      return acc;
    },
    [] as IOrder[]
  );

  const relatedPositions = Object.values(account.positions.cache).reduce(
    (acc, position) => {
      // filter out unrelated symbols
      if (showOnlyTargetRelated && !position.symbol.includes(target)) {
        return acc;
      }
      acc.push(position);
      return acc as IPosition[];
    },
    []
  );

  // the the initial mount, snapshot the account balance values
  // to use for the max health/mana of the resource globe.
  const [maxHealth, setMaxHealth] = useState(0);
  const [maxMana, setMaxMana] = useState(0);
  useEffect(() => {
    if (!status.accountBalancesFetched) return;
    setMaxHealth(store.account.balances.total);
    setMaxMana(store.account.balances.available);
  }, [status.accountBalancesFetched]);

  return (
    <Main>
      <LogoutButton onClick={() => snapshot.logout()}>Logout</LogoutButton>
      <MacroBarLeft macroIds={macroIds.slice(0, 5)} />
      <LimitBreakLeft />
      <MacroBarRight macroIds={macroIds.slice(5, 10)} />
      <ResourceGlobe
        health={{current: account.balances.total, max: maxHealth}}
        mana={{current: account.balances.available, max: maxMana}}
      />
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
