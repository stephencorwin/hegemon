import {useEffect} from 'react';
import {useHegemon} from './useHegemon';
import axios from 'axios';

const HEADERS = {['Content-Type']: 'application/json'};

export function usePersist() {
  const {store} = useHegemon();

  useEffect(() => {
    /**
     * PERSIST DATA
     */
    store.persistData = async () => {
      await axios({
        url: '/data',
        method: 'POST',
        headers: HEADERS,
        data: {
          profile: {
            id: store.profile.id,
            macros: store.profile.macros,
            settings: store.profile.settings,
          },
          // weeklySentiment: store.market.options.sentimentCache,
        },
      });
    };

    /**
     * RESTORE DATA
     */
    store.restoreData = async () => {
      const {
        data: {profile, weeklySentiment},
      } = await axios({
        url: `/data?id=${store.profile.id}`,
        method: 'GET',
        headers: HEADERS,
      });

      store.profile = {...store.profile, ...profile};
      // store.market.options.sentimentCache = weeklySentiment
    };
  }, [store]);

  return null;
}
