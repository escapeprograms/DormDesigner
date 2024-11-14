import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import { ClerkProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY='pk_test_YWNlLXBpZ2Vvbi0yOS5jbGVyay5hY2NvdW50cy5kZXYk';

ReactDOM.render(
  <React.StrictMode>
   <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
  document.getElementById('root')
);