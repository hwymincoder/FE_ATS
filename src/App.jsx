import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import store from './stores/store.js';
import AppRouter from './routes/AppRouter.jsx';
import './locales/i18n.js';

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
