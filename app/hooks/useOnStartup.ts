import {useEffect} from 'react';
import {
  isAfter,
  nextFriday,
  setHours,
  startOfYesterday,
  subDays,
} from 'date-fns';
import axios from 'axios';
import {isEmpty} from 'lodash';
import {useHegemon} from './useHegemon';
import {formatDate} from '../formatters';

const HEADERS = {['Content-Type']: 'application/json'};

export function useOnStartup() {
  const {store} = useHegemon();

  /**
   * Options Expiration Date
   */
  useEffect(() => {
    store.status.optionsExpiration = formatDate(nextFriday(new Date()));

    console.info(
      `[Hegemon] Options expiration date was automatically set to ${store.status.optionsExpiration}`
    );
  }, [store]);

  /**
   * Weekly Sentiment Cache
   */
  useEffect(() => {
    (async () => {
      const {
        data: {weeklySentiment},
      } = await axios({
        url: '/data',
        method: 'GET',
        headers: HEADERS,
      });

      const now = new Date();
      const today = formatDate(now);
      const yesterday = formatDate(subDays(now, 1));
      if (weeklySentiment) {
        const todaysCache = weeklySentiment[today];
        const yesterdaysCache = weeklySentiment[yesterday];

        if (todaysCache) {
          store.market.options.sentimentCache = todaysCache;
          store.market.options.sentimentCacheLastUpdatedDate = today;
        } else if (yesterdaysCache) {
          store.market.options.sentimentCache = yesterdaysCache;
          store.market.options.sentimentCacheLastUpdatedDate = yesterday;
        }
      }
    })();

    // periodically check if it is after yesterday's market close (4pm est / 16:00).
    // if it is and the market sentiment has not been cached,
    // take a snapshot and save it.
    const interval = setInterval(async () => {
      const sentimentSnapshot = store.market.options.snapshotSentiment();

      if (isEmpty(sentimentSnapshot)) return;

      // still waiting for all symbols to be fetched and cached.
      if (
        !store.profile.settings.watchlist.find(
          (symbol) => store.market.options.cache[symbol]
        )
      ) {
        return;
      }

      const now = new Date();
      const today = formatDate(now);
      const marketLapsedSinceYesterday = isAfter(
        now,
        setHours(startOfYesterday(), 16)
      );

      if (
        marketLapsedSinceYesterday &&
        store.market.options.sentimentCacheLastUpdatedDate !== today
      ) {
        await axios({
          url: '/data',
          method: 'POST',
          headers: HEADERS,
          data: {
            weeklySentiment: {
              [today]: sentimentSnapshot,
            },
          },
        });
        store.market.options.sentimentCacheLastUpdatedDate = today;
        store.market.options.sentimentCache = sentimentSnapshot;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [store]);
}
