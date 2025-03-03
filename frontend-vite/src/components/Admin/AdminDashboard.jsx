import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Spin, Statistic, Row, Col } from 'antd';
import { LogoutOutlined, UserOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AddGymForm from './AddGymForm';
import { fetchGyms, fetchManagers } from '../../api/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// GymPro brand colors
const colors = {
  primary: '#1890ff',
  secondary: '#52c41a',
  background: '#f0f2f5',
  headerBg: '#001529'
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState([]);
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [gymsResponse, managersResponse] = await Promise.all([
        fetchGyms(),
        fetchManagers()
      ]);
      console.log('Gyms response:', gymsResponse);
      console.log('Managers response:', managersResponse);
      setGyms(gymsResponse.data || []);
      setManagers(managersResponse.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  const handleGymAdded = (newGym) => {
    setGyms(prev => [...prev, newGym]);
    // If the gym comes with a manager, update managers list
    if (newGym.manager) {
      setManagers(prev => [...prev, newGym.manager]);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: colors.background 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colors.background }}>
      <Header style={{ 
        background: colors.headerBg,
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            GymPro Admin Dashboard
          </Title>
        </div>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ marginLeft: '16px' }}
        >
          Logout
        </Button>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="Total Gyms"
                  value={gyms.length}
                  prefix={<BankOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="Total Managers"
                  value={managers.length}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="System Status"
                  value="Active"
                  valueStyle={{ color: colors.secondary }}
                />
              </Col>
            </Row>
          </Card>

          <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card title={<><BankOutlined /> Add New Gym</>}>
              <AddGymForm onGymAdded={handleGymAdded} />
            </Card>

            <Card 
              title={<><BankOutlined /> GymPro Locations</>}
              extra={<Text type="secondary">{gyms.length} gyms</Text>}
            >
              {gyms.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {gyms.map(gym => (
                    <li key={gym._id} style={{ 
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <BankOutlined style={{ marginRight: '8px' }} />
                      {gym.name} - {gym.location}
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">No gyms registered yet</Text>
              )}
            </Card>

            <Card 
              title={<><TeamOutlined /> GymPro Managers</>}
              extra={<Text type="secondary">{managers.length} managers</Text>}
            >
              {managers.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {managers.map(manager => (
                    <li key={manager._id} style={{ 
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <UserOutlined style={{ marginRight: '8px' }} />
                      {manager.name} - {manager.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <Text type="secondary">No managers registered yet</Text>
              )}
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;