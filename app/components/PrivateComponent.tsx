import React, {ReactNode} from 'react';
import {useIsAuthenticated} from '../hooks';
import {Navigate} from 'react-router-dom';

export function PrivateComponent({children}: {children: ReactNode}) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to={'/login'} />;
}
