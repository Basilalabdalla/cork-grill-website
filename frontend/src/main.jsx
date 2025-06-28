import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // <-- IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  {/* <-- ADD AuthProvider here */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider> {/* <-- And close it here */}
  </React.StrictMode>,
);