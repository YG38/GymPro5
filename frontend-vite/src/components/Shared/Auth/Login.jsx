import React, { useState } from 'react';
import { Form, Input, Button, Select, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../../api/api';

const { Title } = Typography;
const { Option } = Select;

const ADMIN_EMAIL = 'ymebratu64@gmail.com';
const ADMIN_PASSWORD = 'YoniReact@1';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Hardcoded admin authentication
      if (
        values.email === ADMIN_EMAIL && 
        values.password === ADMIN_PASSWORD && 
        values.role === 'admin'
      ) {
        const userData = {
          token: 'admin-token',
          role: 'admin',
          email: ADMIN_EMAIL
        };

        // Store in session storage
        sessionStorage.setItem('authToken', userData.token);
        sessionStorage.setItem('role', userData.role);
        sessionStorage.setItem('email', userData.email);

        // Update auth context
        login(userData);

        // Explicitly navigate to admin dashboard
        navigate('/admin/dashboard');
        return;
      }

      // Normal login for non-admin users through API
      const response = await apiLogin(values);
      
      const { token, user, gym } = response;
      
      const userData = { 
        token, 
        role: user.role,
        email: user.email,
        gym 
      };

      // Store in session storage
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('role', user.role);
      sessionStorage.setItem('email', user.email);
      if (gym) {
        sessionStorage.setItem('gymData', JSON.stringify(gym));
      }

      // Update auth context
      login(userData);

      // Navigate based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'trainer':
          navigate('/trainer/dashboard');
          break;
        default:
          message.error('Invalid user role');
      }
    } catch (error) {
      message.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        width: 400,
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          GymPro Login
        </Title>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ 
              required: true, 
              message: 'Please input your email!',
              type: 'email'
            }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ 
              required: true, 
              message: 'Please input your password!' 
            }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
            />
          </Form.Item>
          
          <Form.Item
            name="role"
            rules={[{ 
              required: true, 
              message: 'Please select your role!' 
            }]}
          >
            <Select 
              placeholder="Select Role"
              prefix={<TeamOutlined />}
            >
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="trainer">Trainer</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: 16 
          }}>
            <Spin size="large" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
