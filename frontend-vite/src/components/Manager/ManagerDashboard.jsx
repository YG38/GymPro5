import React, { useState, useEffect } from "react";
import { Card, Tabs, message, Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddTrainerForm from './AddTrainerForm';
import LocationUpdate from './LocationUpdate';
import PriceManagement from './PriceManagement';
import TraineeList from './TraineeList';
import { fetchTrainees, deleteTrainee } from "../../api/api";

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title } = Typography;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Get gym data from session storage
        const gymData = sessionStorage.getItem('gymData');
        console.log('Retrieved gym data from session:', gymData);

        if (!gymData) {
          console.error('No gym data found in session storage');
          message.error('No gym data found');
          navigate('/login');
          return;
        }

        const parsedGym = JSON.parse(gymData);
        console.log('Parsed gym data:', parsedGym);
        
        if (!parsedGym || !parsedGym.id) {
          console.error('Invalid gym data:', parsedGym);
          message.error('Invalid gym data');
          navigate('/login');
          return;
        }

        setGym(parsedGym);
        await loadTrainees(parsedGym.id);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        message.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const loadTrainees = async (gymId) => {
    try {
      const response = await fetchTrainees(gymId);
      setTrainees(response.data);
    } catch (error) {
      console.error("Failed to fetch trainees:", error);
      message.error("Failed to load trainees");
    }
  };

  const handleDeleteTrainee = async (traineeId) => {
    try {
      await deleteTrainee(traineeId);
      setTrainees(trainees.filter((trainee) => trainee._id !== traineeId));
      message.success("Trainee deleted successfully");
    } catch (error) {
      console.error("Failed to delete trainee:", error);
      message.error("Failed to delete trainee");
    }
  };

  const handleAddTrainer = (trainer) => {
    message.success("Trainer added successfully");
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <Content style={{ background: '#fff', padding: '24px' }}>
          <Card loading={true}>
            <div style={{ height: '400px' }}></div>
          </Card>
        </Content>
      </Layout>
    );
  }

  if (!gym) {
    return (
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <Content style={{ background: '#fff', padding: '24px' }}>
          <Title level={4}>No gym data available. Please log in again.</Title>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <Content style={{ background: '#fff', padding: '24px' }}>
        <Title level={2}>{gym.name} Dashboard</Title>
        
        <Card style={{ marginBottom: '24px' }}>
          <p><strong>Location:</strong> {gym.location}</p>
          <p><strong>Current Price:</strong> ${gym.price}</p>
        </Card>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Manage Prices" key="1">
            <Card>
              <PriceManagement gymId={gym.id} />
            </Card>
          </TabPane>

          <TabPane tab="Update Location" key="2">
            <Card>
              <LocationUpdate gymId={gym.id} />
            </Card>
          </TabPane>

          <TabPane tab="Add Trainer" key="3">
            <Card>
              <AddTrainerForm gymId={gym.id} onAddTrainer={handleAddTrainer} />
            </Card>
          </TabPane>

          <TabPane tab="Manage Trainees" key="4">
            <Card>
              <TraineeList trainees={trainees} onDeleteTrainee={handleDeleteTrainee} />
            </Card>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default ManagerDashboard;
