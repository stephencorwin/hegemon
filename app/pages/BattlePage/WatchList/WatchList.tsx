import React from 'react';
import clsx from 'clsx';
import {
  StyledWrapper,
  Tile,
  Symbol,
  SubText,
  SubTextPropertyLabel,
  SubTextsWrapper,
} from './styles';
import {useHegemon} from '../../../hooks';
import {formatCurrency, formatPercent} from '../../../formatters';
import {DeepWriteable} from '../../../types';
import {calcOptionsVolumeSentiment} from '../../../math';

export interface IWatchListProps {
  symbols: readonly string[];
}

export function WatchList({symbols = []}: IWatchListProps) {
  const {snapshot, store} = useHegemon();
  const {market, profile} = snapshot;
  const {
    settings: {thresholds},
  } = profile;
  return (
    <StyledWrapper>
      {symbols.map((symbol) => {
        const optionsData = market.options.cache[symbol];
        const stocksData = market.stocks.cache[symbol];
        const sentimentCache = market.options.sentimentCache[symbol] ?? 0;

        const weeklySentiment = calcOptionsVolumeSentiment(
          optionsData?.chain as DeepWriteable<typeof optionsData.chain>
        );
        const weeklySentimentIsHighlyPositive =
          weeklySentiment >=
          thresholds.sentiment.weekly.changePercentIsHighlyPositive;
        const weeklySentimentIsHighlyNegative =
          weeklySentiment <=
          thresholds.sentiment.weekly.changePercentIsHighlyNegative;
        const dailySentiment = weeklySentiment - sentimentCache;
        const dailySentimentIsHighlyPositive =
          dailySentiment >=
          thresholds.sentiment.daily.changePercentIsHighlyPositive;
        const dailySentimentIsHighlyNegative =
          dailySentiment <=
          thresholds.sentiment.daily.changePercentIsHighlyNegative;
        const changePercentageIsHighlyPositive =
          stocksData?.changePercentage / 100 >=
          thresholds.stock.changePercentIsHighlyPositive;
        const changePercentageIsHighlyNegative =
          stocksData?.changePercentage / 100 <=
          thresholds.stock.changePercentIsHighlyNegative;

        const analysisHighlyPositive =
          [
            optionsData && weeklySentimentIsHighlyPositive,
            optionsData && dailySentimentIsHighlyPositive,
            changePercentageIsHighlyPositive,
          ].filter((indicator) => indicator).length >= 2;
        const analysisHighlyNegative =
          [
            optionsData && weeklySentimentIsHighlyNegative,
            optionsData && dailySentimentIsHighlyNegative,
            changePercentageIsHighlyNegative,
          ].filter((indicator) => indicator).length >= 2;
        return (
          <Tile
            key={symbol}
            onClick={() => {
              store.market.subscribed.target = symbol;
            }}
            className={clsx({
              positive: analysisHighlyPositive,
              negative: analysisHighlyNegative,
              neutral: !analysisHighlyPositive && !analysisHighlyNegative,
            })}
          >
            <Symbol>{symbol}</Symbol>
            <hr />
            <SubTextsWrapper>
              <SubText
                className={clsx({
                  positive: changePercentageIsHighlyPositive,
                  negative: changePercentageIsHighlyNegative,
                  neutral:
                    !changePercentageIsHighlyPositive &&
                    !changePercentageIsHighlyNegative,
                })}
              >
                <SubTextPropertyLabel>ASK: </SubTextPropertyLabel>
                {formatCurrency(stocksData?.ask)}
              </SubText>

              {/* WEEKLY SENTIMENT */}
              <SubText
                className={clsx({
                  positive: weeklySentimentIsHighlyPositive,
                  negative: weeklySentimentIsHighlyNegative,
                  neutral:
                    !optionsData ||
                    (!weeklySentimentIsHighlyPositive &&
                      !weeklySentimentIsHighlyNegative),
                })}
              >
                <SubTextPropertyLabel>WS: </SubTextPropertyLabel>
                {optionsData ? formatPercent(weeklySentiment, 0) : <>&mdash;</>}
              </SubText>

              {/* DAILY SENTIMENT */}
              <SubText
                className={clsx({
                  positive: dailySentimentIsHighlyPositive,
                  negative: dailySentimentIsHighlyNegative,
                  neutral:
                    !optionsData ||
                    (!dailySentimentIsHighlyPositive &&
                      !dailySentimentIsHighlyNegative),
                })}
              >
                <SubTextPropertyLabel>DS: </SubTextPropertyLabel>
                {optionsData ? formatPercent(dailySentiment, 0) : <>&mdash;</>}
              </SubText>
            </SubTextsWrapper>
          </Tile>
        );
      })}
    </StyledWrapper>
  );
}
