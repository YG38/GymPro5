import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Spin, Card, Typography } from 'antd';
import { LogoutOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AddTrainerForm from './AddTrainerForm';
import { fetchTrainees, fetchTrainers } from '../../api/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// GymPro brand colors
const colors = {
  primary: '#1890ff',
  secondary: '#52c41a',
  background: '#f0f2f5',
  headerBg: '#001529'
};

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [gym, setGym] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      const gymData = sessionStorage.getItem('gymData');
      if (!gymData) {
        setLoading(false);
        return;
      }

      const parsedGym = JSON.parse(gymData);
      if (!parsedGym._id) {
        throw new Error('Invalid gym data');
      }

      setGym(parsedGym);
      await Promise.all([
        loadTrainees(parsedGym._id),
        loadTrainers(parsedGym._id)
      ]);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrainees = async (gymId) => {
    try {
      const response = await fetchTrainees(gymId);
      setTrainees(response.data || []);
    } catch (error) {
      console.error('Error loading trainees:', error);
    }
  };

  const loadTrainers = async (gymId) => {
    try {
      const response = await fetchTrainers(gymId);
      setTrainers(response.data || []);
    } catch (error) {
      console.error('Error loading trainers:', error);
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

  const handleAddTrainer = (newTrainer) => {
    setTrainers(prev => [...prev, newTrainer]);
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
            GymPro Manager Dashboard
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
        {gym ? (
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Card 
              title={<Title level={4}>Welcome to {gym.name || 'GymPro'}</Title>}
              style={{ marginBottom: '24px' }}
            >
              <Text>Managing your gym has never been easier with GymPro</Text>
            </Card>

            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <Card title={<><TeamOutlined /> Add New Trainer</>}>
                <AddTrainerForm 
                  gymId={gym._id} 
                  onAddTrainer={handleAddTrainer}
                />
              </Card>

              <Card 
                title={<><TeamOutlined /> Current Trainers</>}
                extra={<Text type="secondary">{trainers.length} trainers</Text>}
              >
                {trainers.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {trainers.map(trainer => (
                      <li key={trainer._id} style={{ 
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        {trainer.name} - {trainer.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text type="secondary">No trainers found</Text>
                )}
              </Card>

              <Card 
                title={<><TeamOutlined /> Current Trainees</>}
                extra={<Text type="secondary">{trainees.length} trainees</Text>}
              >
                {trainees.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {trainees.map(trainee => (
                      <li key={trainee._id} style={{ 
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        {trainee.name} - {trainee.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text type="secondary">No trainees found</Text>
                )}
              </Card>
            </div>
          </div>
        ) : (
          <Card style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <Title level={2}>Welcome to GymPro</Title>
            <Text>Please contact admin to assign you to a gym.</Text>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default ManagerDashboard;
