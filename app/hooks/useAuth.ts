import {useEffect} from 'react';
import {useNavigate} from 'react-router';
import axios from 'axios';
import {useHegemon} from './useHegemon';
import {IFileProfiles, IHegemonStore} from '../types';
import {getTradierBaseURL, getTradierHeaders} from './useTradier';

const HEADERS = {['Content-Type']: 'application/json'};

export function useAuth() {
  const {store} = useHegemon();
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * fetchSavedProfiles
     */
    store.fetchSavedProfiles = async () => {
      const {
        data: {profiles},
      }: {data: {profiles: IFileProfiles}} = await axios({
        url: '/profiles',
        method: 'GET',
        headers: HEADERS,
      });

      store.savedProfiles = profiles;
    };

    /**
     * registerProfile
     */
    store.registerProfile = async (
      apiKey: string,
      isPaper: boolean = false,
      overwrite: boolean = false
    ) => {
      const url = `${getTradierBaseURL(isPaper)}/user/profile`;

      const {
        data: {profile},
      } = await axios({url, method: 'GET', headers: getTradierHeaders(apiKey)});

      await axios({
        url: '/profile/register',
        method: 'POST',
        headers: HEADERS,
        data: {
          id: profile.id,
          apiKey,
          isPaper,
          overwrite,
        },
      });

      await store.fetchSavedProfiles();
    };

    /**
     * unregisterProfile
     */
    store.unregisterProfile = async (id: string) => {
      await axios({
        url: '/profile/unregister',
        method: 'POST',
        headers: HEADERS,
        data: {
          id,
        },
      });

      // update saved profiles now that we removed one
      await store.fetchSavedProfiles();

      // conditionally logout if we need to
      if (store.profile?.id === id) store.logout();
    };

    /**
     * LOGIN
     */
    store.login = async (id: string, apiKey: string, isPaper: boolean) => {
      const url = `${getTradierBaseURL(isPaper)}/user/profile`;

      const {
        data: {profile},
      } = await axios({url, method: 'GET', headers: getTradierHeaders(apiKey)});

      const account = Array.isArray(profile.account)
        ? profile.account.find((acc) => acc.classification === 'individual')
        : profile.account;

      // sets the profile data which flags us as authenticated
      store.profile = {
        id,
        apiKey,
        isPaper,
        name: profile.name,
        accountId: account.account_number,
        dayTrader: account.day_trader,
        type: account.type,
      } as IHegemonStore['profile'];

      await store.restoreData();

      // initialize the app now that we have "logged in"
      store.status.initialized = true;
    };

    /**
     * LOGOUT
     */
    store.logout = async () => {
      await navigate('/login');
      store.profile = undefined;
      store.status.initialized = false;
      store.status.accountBalancesFetched = false;
      store.status.health = {current: 0, max: 0};
      store.status.mana = {current: 0, max: 0};
      store.account.balances.total = 0;
      store.account.balances.available = 0;
      store.account.orders.cache = {};
      store.account.positions.cache = {};
      store.market.subscribed.stocks = [];
      store.market.subscribed.options = [];
      store.market.stocks.cache = {};
      store.market.options.cache = {};
      store.market.queue.setLimitSell = [];
    };
  }, [store]);

  return null;
}
