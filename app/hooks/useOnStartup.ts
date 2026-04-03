import {useEffect} from 'react';
import {
  isAfter,
  isFriday,
  nextFriday,
  setHours,
  startOfYesterday,
  subDays,
} from 'date-fns';
import axios from 'axios';
import {isEmpty} from 'lodash';
import {useHegemon} from './useHegemon';
import {formatDate} from '../formatters';
import {isHoliday} from 'nyse-holidays';

const HEADERS = {['Content-Type']: 'application/json'};

export function useOnStartup() {
  const {store, snapshot} = useHegemon();
  const {
    status: {allowZeroDTE},
  } = snapshot;
  /**
   * Options Expiration Date
   */
  useEffect(() => {
    const now = new Date();

    let nextFridayDate = nextFriday(now);

    // in order to support 0 day DTE, but a default of the next Friday,
    // we need to check to see if today is Friday and adjust accordingly
    if (allowZeroDTE && isFriday(now)) {
      nextFridayDate = now;
    }

    // account for market holidays by skipping to the next Friday in a loop until a non-holiday is found
    while (isHoliday(nextFridayDate)) {
      console.info(
        `[Hegemon] Options expiration date candidate ${formatDate(nextFridayDate)} was skipped due to it being a market holiday`
      );
      nextFridayDate = nextFriday(nextFridayDate);
    }

    // update the optionsExpiration with a formatted date now that an acceptable one has been found
    store.status.optionsExpiration = formatDate(nextFridayDate);

    console.info(
      `[Hegemon] Options expiration date was automatically set to ${store.status.optionsExpiration}`
    );
  }, [allowZeroDTE, store]);

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
      const todayFormatted = formatDate(now);
      const yesterdayFormatted = formatDate(subDays(now, 1));
      if (weeklySentiment) {
        const todaysCache = weeklySentiment[todayFormatted];
        const yesterdaysCache = weeklySentiment[yesterdayFormatted];

        if (todaysCache) {
          store.market.options.sentimentCache = todaysCache;
          store.market.options.sentimentCacheLastUpdatedDate = todayFormatted;
        } else if (yesterdaysCache) {
          store.market.options.sentimentCache = yesterdaysCache;
          store.market.options.sentimentCacheLastUpdatedDate =
            yesterdayFormatted;
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
      const todayFormatted = formatDate(now);
      const marketLapsedSinceYesterday = isAfter(
        now,
        setHours(startOfYesterday(), 16)
      );

      if (
        marketLapsedSinceYesterday &&
        store.market.options.sentimentCacheLastUpdatedDate !== todayFormatted
      ) {
        await axios({
          url: '/data',
          method: 'POST',
          headers: HEADERS,
          data: {
            weeklySentiment: {
              [todayFormatted]: sentimentSnapshot,
            },
          },
        });
        store.market.options.sentimentCacheLastUpdatedDate = todayFormatted;
        store.market.options.sentimentCache = sentimentSnapshot;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [store]);
}
