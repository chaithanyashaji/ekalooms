import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import ShopContextProvider from './context/shopcontext.jsx';
import logger from "./logger";

if (process.env.NODE_ENV === "production") {
  console.error = (message) => logger.error(message);
  console.warn = (message) => logger.warn(message);
  console.log = (message) => logger.info(message); // Optional: Handle general logs
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ShopContextProvider>
  <App />
  </ShopContextProvider>
   
  </BrowserRouter>,
)
