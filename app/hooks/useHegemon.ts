import {useContext} from 'react';
import {useSnapshot} from 'valtio';
import {StoreContext} from './useCreateStore';

export function useHegemon() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('DollhouseViewer store was not initialized before access.');
  }

  // create a snapshot of the proxy-state which can be used to trigger rerenders
  const snapshot = useSnapshot(store);

  // If this internal token is updated, all consumers of this API will re-render.
  // Also, by selecting a value on snapshot we avoid the gotcha of re-rendering
  // if snapshot is not referenced by a consumer.
  if (snapshot.__forceRenderUniqueToken) {
    // do nothing
  }

  return {snapshot, store} as const;
}
