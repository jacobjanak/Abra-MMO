import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import './index.css';

if (localStorage.getItem('id_token')) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('id_token')}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);

registerServiceWorker();
