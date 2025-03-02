import React, { useEffect, useState } from "react";
import { Layout, Card, Button, Typography, Spin, Row, Col } from 'antd';
import { LogoutOutlined, UserOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WorkoutPlanForm from "./WorkoutPlanForm";
import { fetchWorkoutPlansByGym, addWorkoutPlan, deleteWorkoutPlan } from "../../api/api";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// GymPro brand colors
const colors = {
  primary: '#1890ff',
  secondary: '#52c41a',
  background: '#f0f2f5',
  headerBg: '#001529'
};

const TrainerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [categories] = useState(["Strength", "Cardio", "Flexibility", "Endurance"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
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

      const response = await fetchWorkoutPlansByGym(parsedGym._id);
      setWorkouts(response.data || []);
    } catch (error) {
      console.error('Error loading workouts:', error);
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

  const handleAddWorkout = async (planData) => {
    try {
      const gymData = sessionStorage.getItem('gymData');
      const parsedGym = JSON.parse(gymData);
      const response = await addWorkoutPlan({
        ...planData,
        gymId: parsedGym._id,
        category: selectedCategory
      });
      setWorkouts([...workouts, response.data]);
    } catch (error) {
      console.error("Failed to add workout plan:", error);
    }
  };

  const handleDeleteWorkout = async (planId) => {
    try {
      await deleteWorkoutPlan(planId);
      setWorkouts(workouts.filter((workout) => workout._id !== planId));
    } catch (error) {
      console.error("Failed to delete workout plan:", error);
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
            GymPro Trainer Dashboard
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
              <Col xs={24} sm={12}>
                <Title level={4}>Category Selection</Title>
                <select
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9'
                  }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Choose Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Col>
              <Col xs={24} sm={12}>
                <Title level={4}>Total Workout Plans</Title>
                <Text>{workouts.length}</Text>
              </Col>
            </Row>
          </Card>

          {selectedCategory && (
            <Card title="Add New Workout Plan" style={{ marginBottom: '24px' }}>
              <WorkoutPlanForm onAddWorkout={handleAddWorkout} selectedCategory={selectedCategory} />
            </Card>
          )}

          <Card title="My Workout Plans">
            {workouts.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {workouts.map(workout => (
                  <li key={workout._id} style={{ 
                    padding: '16px',
                    marginBottom: '8px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <FileOutlined style={{ marginRight: '8px' }} />
                      <Text strong>{workout.name}</Text>
                      <Text type="secondary" style={{ marginLeft: '16px' }}>
                        {workout.category}
                      </Text>
                    </div>
                    <Button 
                      type="text" 
                      danger
                      onClick={() => handleDeleteWorkout(workout._id)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="secondary">No workout plans created yet</Text>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default TrainerDashboard;
