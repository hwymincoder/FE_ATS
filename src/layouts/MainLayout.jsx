import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const collapsed = useSelector((state) => state.sidebarCollapsed);

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: '/category', icon: <AppstoreOutlined />, label: 'Danh mục', children: [
      { key: '/category/goods', label: <Link to="/category/goods">Hàng hóa</Link> },
    ]},
    { key: '/sale', icon: <ShoppingOutlined />, label: 'Bán hàng' },
    { key: '/user', icon: <UserOutlined />, label: <Link to="/user">Người dùng</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          {collapsed ? 'FE' : 'FE_ATS'}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16 }}>Hệ thống quản lý</span>
          <span>{localStorage.getItem('USER_NAME') || 'User'}</span>
        </Header>
        <Content style={{ margin: 16 }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{location.pathname}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
