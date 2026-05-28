import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../stores/actions.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log('Login:', values);
    // Mock login - replace with actual API call
    dispatch(setToken('mock-token'));
    dispatch(setUser({ username: values.username, name: 'Người dùng' }));
    localStorage.setItem('TOKEN', 'mock-token');
    localStorage.setItem('USER_NAME', values.username);
    navigate('/');
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>FE_ATS - Đăng nhập</h2>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item name="username" rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}>
          <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
