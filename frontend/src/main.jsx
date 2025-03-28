import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import ShopContextProvider from './context/shopcontext.jsx';

if (import.meta.env.MODE === 'production') {
  console.log = () => {}; // Suppress console.log
  console.error = () => {}; // Suppress console.error
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ShopContextProvider>
  <App />
  </ShopContextProvider>
   
  </BrowserRouter>,
)
