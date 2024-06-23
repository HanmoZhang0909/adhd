// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css'; // 引入全局样式

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
