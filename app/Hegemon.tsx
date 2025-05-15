import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {
  useCreateStore,
  StoreContext,
  useDataAutoPoll,
  useTradier,
  useHegemon,
  useAuth,
  usePersist,
  useIsAuthenticated,
} from './hooks';
import {GlobalStyles} from './styles';
import {theme} from './theme.styles';
import {BattlePage} from './pages/BattlePage';
import {LoginPage} from './pages/LoginPage';
import {PrivateComponent} from './components/PrivateComponent';

function HooksAfterInitialization() {
  useDataAutoPoll();
  return null;
}

function HegemonInner() {
  const {snapshot} = useHegemon();
  const {status} = snapshot;
  const isAuthenticated = useIsAuthenticated();
  useAuth();
  usePersist();
  useTradier();

  return (
    <>
      {isAuthenticated && status.initialized && <HooksAfterInitialization />}
      <Routes>
        <Route index element={<Navigate to={'/battle'} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/battle"
          element={
            <PrivateComponent>
              <BattlePage />
            </PrivateComponent>
          }
        />
      </Routes>
    </>
  );
}

export function Hegemon() {
  const store = useCreateStore();
  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyles />
          <HegemonInner />
        </>
      </ThemeProvider>
    </StoreContext.Provider>
  );
}
