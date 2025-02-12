import React, { useState, useEffect } from "react";
import { Card, Tabs, message, Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddTrainerForm from './AddTrainerForm';
import LocationUpdate from './LocationUpdate';
import PriceManagement from './PriceManagement';
import TraineeList from './TraineeList';
import { fetchTrainees, deleteTrainee, fetchTrainers, deleteTrainer, addTrainer } from "../../api/api";

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title } = Typography;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const gymData = sessionStorage.getItem('gymData');
        if (!gymData) {
          message.error('No gym data found');
          navigate('/login');
          return;
        }

        const parsedGym = JSON.parse(gymData);
        setGym(parsedGym);
        await loadTrainees(parsedGym.id);
        await loadTrainers(parsedGym.id);
      } catch (error) {
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
      message.error("Failed to load trainees");
    }
  };

  const loadTrainers = async (gymId) => {
    try {
      const response = await fetchTrainers(gymId);
      setTrainers(response.data);
    } catch (error) {
      message.error("Failed to load trainers");
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    try {
      await deleteTrainer(trainerId);
      setTrainers(trainers.filter((trainer) => trainer._id !== trainerId));
      message.success("Trainer deleted successfully");
    } catch (error) {
      message.error("Failed to delete trainer");
    }
  };

  const handleAddTrainer = async (trainerData) => {
    try {
      const response = await addTrainer(gym.id, trainerData);
      setTrainers([...trainers, response.data]);
      message.success("Trainer added successfully");
    } catch (error) {
      message.error("Failed to add trainer");
    }
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

          <TabPane tab="Manage Trainers" key="5">
            <Card>
              <h3>Trainers List</h3>
              <ul>
                {trainers.map((trainer) => (
                  <li key={trainer._id}>
                    {trainer.name} - {trainer.email}
                    <button onClick={() => handleDeleteTrainer(trainer._id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </Card>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default ManagerDashboard;
