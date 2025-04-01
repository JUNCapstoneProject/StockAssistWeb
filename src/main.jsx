/**
 * 애플리케이션의 진입점
 * React 앱을 초기화하고 Redux Provider를 설정
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store'; // Redux 스토어 설정
import './index.css';
import App from './App.jsx';

// React 앱을 DOM에 마운트
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
