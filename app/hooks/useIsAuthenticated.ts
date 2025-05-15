import {useHegemon} from './useHegemon';

export function useIsAuthenticated() {
  const {snapshot} = useHegemon();
  const {profile} = snapshot;
  return !!profile;
}
