import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {NextUIProvider} from "@nextui-org/system";

// React 18 createRoot method
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NextUIProvider>
     <main className="dark text-foreground bg-background">
    <App />
    </main>
  </NextUIProvider>
);
