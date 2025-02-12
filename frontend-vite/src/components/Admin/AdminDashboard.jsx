import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, UnorderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import AddGymForm from './AddGymForm';
import GymList from './GymList';
import { useAuth } from '../../context/AuthContext';

const { Content, Sider } = Layout;

const AdminDashboard = () => {
  const [selectedKey, setSelectedKey] = useState('addGym');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'addGym',
      icon: <PlusOutlined />,
      label: 'Add Gym',
    },
    {
      key: 'manageGyms',
      icon: <UnorderedListOutlined />,
      label: 'Manage Gyms',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'addGym':
        return <AddGymForm onAddGym={() => setSelectedKey('manageGyms')} />;
      case 'manageGyms':
        return <GymList />;
      default:
        return <AddGymForm />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ padding: '16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>
          Admin Dashboard
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            if (key !== 'logout') {
              setSelectedKey(key);
            }
          }}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: '#fff',
            borderRadius: '4px',
            minHeight: 280,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;