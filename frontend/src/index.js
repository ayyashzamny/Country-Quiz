import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';


const clerkFrontendApi = "pk_test_dHJ1c3R5LXB1Zy0zNS5jbGVyay5hY2NvdW50cy5kZXYk";
// const clerkFrontendApi =process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
 


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
); 


reportWebVitals();
