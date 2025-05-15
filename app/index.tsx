import React from 'react';
import ReactDOM from 'react-dom/client';
import {MemoryRouter as Router} from 'react-router-dom';
import {Hegemon} from './Hegemon';

function AppContainer() {
  return (
    <Router>
      <Hegemon />
    </Router>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<AppContainer />);
