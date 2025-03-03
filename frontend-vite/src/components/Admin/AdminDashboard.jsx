import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Spin, Statistic, Row, Col, message, Popconfirm } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  BankOutlined, 
  TeamOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AddGymForm from './AddGymForm';
import { 
  fetchGyms, 
  fetchManagers, 
  fetchTrainees, 
  deleteManager, 
  deleteTrainee,
  fetchRegisteredUsers
} from '../../api/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

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
  const [trainees, setTrainees] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [gymsResponse, managersResponse, traineesResponse] = await Promise.all([
        fetchGyms(),
        fetchManagers(),
        fetchTrainees()
      ]);
      
      setGyms(gymsResponse.data || []);
      setManagers(managersResponse.data || []);
      setTrainees(traineesResponse.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManager = async (managerId) => {
    try {
      await deleteManager(managerId);
      setManagers(managers.filter(m => m.id !== managerId));
      message.success('Manager deleted successfully');
    } catch (error) {
      console.error('Error deleting manager:', error);
      message.error('Failed to delete manager');
    }
  };

  const handleDeleteTrainee = async (traineeId) => {
    try {
      await deleteTrainee(traineeId);
      setTrainees(trainees.filter(t => t.id !== traineeId));
      message.success('Trainee deleted successfully');
    } catch (error) {
      console.error('Error deleting trainee:', error);
      message.error('Failed to delete trainee');
    }
  };

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      sessionStorage.clear();
      navigate('/login', { replace: true });
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
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          GymPro Admin Dashboard
        </Title>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
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
                title="Total Trainees"
                value={trainees.length}
                prefix={<UserOutlined />}
              />
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            {/* Gyms Card */}
            <Col xs={24} md={8}>
              <Card 
                title={<><BankOutlined /> GymPro Locations</>}
                extra={<Text type="secondary">{gyms.length} gyms</Text>}
              >
                {gyms.map(gym => (
                  <div 
                    key={gym.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <span>
                      <BankOutlined style={{ marginRight: '8px' }} />
                      {gym.gymName} - {gym.location}
                    </span>
                  </div>
                ))}
              </Card>
            </Col>

            {/* Managers Card */}
            <Col xs={24} md={8}>
              <Card 
                title={<><TeamOutlined /> Managers</>}
                extra={<Text type="secondary">{managers.length} managers</Text>}
              >
                {managers.map(manager => (
                  <div 
                    key={manager.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <span>
                      <UserOutlined style={{ marginRight: '8px' }} />
                      {manager.name} - {manager.email}
                    </span>
                    <Popconfirm
                      title="Are you sure to delete this manager?"
                      onConfirm={() => handleDeleteManager(manager.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small" 
                      />
                    </Popconfirm>
                  </div>
                ))}
              </Card>
            </Col>

            {/* Trainees Card */}
            <Col xs={24} md={8}>
              <Card 
                title={<><UserOutlined /> Trainees</>}
                extra={<Text type="secondary">{trainees.length} trainees</Text>}
              >
                {trainees.map(trainee => (
                  <div 
                    key={trainee.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <span>
                      <UserOutlined style={{ marginRight: '8px' }} />
                      {trainee.name} - {trainee.email}
                    </span>
                    <Popconfirm
                      title="Are you sure to delete this trainee?"
                      onConfirm={() => handleDeleteTrainee(trainee.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small" 
                      />
                    </Popconfirm>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>

          {/* Add Gym Form */}
          <Card 
            title={<><BankOutlined /> Add New Gym</>} 
            style={{ marginTop: '24px' }}
          >
            <AddGymForm onAddGym={(newGym) => setGyms([...gyms, newGym])} />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;