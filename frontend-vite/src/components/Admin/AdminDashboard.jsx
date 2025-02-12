import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AddGymForm from './AddGymForm';
import GymList from './GymList';
import { fetchGyms, deleteGym } from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../AdminDashboard.css";

const { Content, Sider } = Layout;

const AdminDashboard = () => {
  const [gyms, setGyms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState('addGym');
  const navigate = useNavigate();

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const response = await fetchGyms();
        setGyms(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        setError("Failed to fetch gyms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadGyms();
  }, []);

  const handleDeleteGym = async (gymId) => {
    try {
      await deleteGym(gymId);
      setGyms(prev => prev.filter(gym => gym._id !== gymId));
    } catch (error) {
      setError("Failed to delete gym");
      console.error("Error deleting gym", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
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
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'addGym':
        return <AddGymForm onAddGym={() => setSelectedKey('manageGyms')} />;
      case 'manageGyms':
        if (loading) {
          return <div className="loading">Loading gyms...</div>;
        }
        return (
          <div>
            {error && <p className="error-message">{error}</p>}
            {!gyms?.length ? (
              <p>No gyms found.</p>
            ) : (
              <GymList gyms={gyms} onDeleteGym={handleDeleteGym} />
            )}
          </div>
        );
      default:
        return <AddGymForm />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ height: '100%', borderRight: 0 }}
        />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: '#fff',
            borderRadius: '4px',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;