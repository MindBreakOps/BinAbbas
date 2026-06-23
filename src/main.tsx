import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
	<AuthProvider>
	  <TenantProvider>
		<App />
	  </TenantProvider>
	</AuthProvider>
  </React.StrictMode>
);