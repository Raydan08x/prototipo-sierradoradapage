import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// Using a fallback for dev if env is missing, but it won't work for real Google Auth without a valid ID.
// For the user request, we prepare the structure.
const clientId = "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
