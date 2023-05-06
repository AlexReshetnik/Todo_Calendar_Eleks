import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import {store} from './store/store';
import {Provider} from 'react-redux';
import { AuthProvider } from './firebase/AuthProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>
);
