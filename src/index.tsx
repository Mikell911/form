import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';

const wrapper = ReactDOM.createRoot(
  document.getElementById('wrapper') as HTMLElement
)
wrapper.render(<App />)