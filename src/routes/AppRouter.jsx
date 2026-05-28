import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout.jsx';
import LoginLayout from '../layouts/LoginLayout.jsx';
import Dashboard from '../containers/Dashboard.jsx';
import Login from '../containers/Login.jsx';
import GoodsList from '../containers/category/goods/GoodsList.jsx';
import GoodsForm from '../containers/category/goods/GoodsForm.jsx';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category/goods" element={<GoodsList />} />
            <Route path="/category/goods/new" element={<GoodsForm />} />
            <Route path="/category/goods/:id" element={<GoodsForm />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
