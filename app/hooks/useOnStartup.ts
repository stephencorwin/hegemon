import {useEffect} from 'react';
import {nextFriday, format} from 'date-fns';
import {useHegemon} from './useHegemon';

export function useOnStartup() {
  const {store} = useHegemon();

  /**
   * Options Expiration Date
   */
  useEffect(() => {
    store.status.optionsExpiration = format(
      nextFriday(new Date()),
      'yyyy-MM-dd'
    );

    console.info(
      `[Hegemon] Options expiration date was automatically set to ${store.status.optionsExpiration}`
    );
  }, [store]);
}
