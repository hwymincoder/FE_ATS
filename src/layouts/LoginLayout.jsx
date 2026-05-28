import React from 'react';
import { Outlet } from 'react-router-dom';

const LoginLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ padding: 40, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: 400 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default LoginLayout;
