import React, { useState, useEffect } from "react";
import { Card, Tabs, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddTrainerForm from './AddTrainerForm';
import LocationUpdate from './LocationUpdate';
import PriceManagement from './PriceManagement';
import TraineeList from './TraineeList';
import { fetchTrainees, deleteTrainee } from "../../api/api";

const { TabPane } = Tabs;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    // Get gym data from session storage
    const gymData = sessionStorage.getItem('gymData');
    console.log('Retrieved gym data from session:', gymData);

    if (!gymData) {
      console.error('No gym data found in session storage');
      message.error('No gym data found');
      navigate('/login');
      return;
    }

    try {
      const parsedGym = JSON.parse(gymData);
      console.log('Parsed gym data:', parsedGym);
      setGym(parsedGym);
      
      // Load trainees
      loadTrainees(parsedGym.id);
    } catch (error) {
      console.error('Error parsing gym data:', error);
      message.error('Error loading gym data');
    }
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

  if (!gym) {
    return <div>Loading gym data...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title={gym.name} style={{ marginBottom: '24px' }}>
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
    </div>
  );
};

export default ManagerDashboard;
