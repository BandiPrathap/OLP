import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
  <App />
</BrowserRouter>

);
