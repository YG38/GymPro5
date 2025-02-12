import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchTrainees, deleteTrainee, fetchTrainers, deleteTrainer} from "../../api/api";
import TraineeList from "./TraineeList";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [trainees, setTrainees] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  useEffect(() => {
    // Get gym data from session storage
    const gymData = sessionStorage.getItem('gymData');
    if (!gymData) {
      message.error('No gym data found');
      navigate('/login');
      return;
    }

    try {
      const parsedGym = JSON.parse(gymData);
      setGym(parsedGym);
      form.setFieldsValue({
        location: parsedGym.location,
        price: parsedGym.price
      });
    } catch (error) {
      console.error('Error parsing gym data:', error);
      message.error('Error loading gym data');
    }

    const loadTrainees = async () => {
      try {
        const response = await fetchTrainees(parsedGym.id);
        setTrainees(response.data);
      } catch (error) {
        console.error("Failed to fetch trainees:", error);
      }
    };

    const loadWorkoutPlans = async () => {
      try {
        const response = await fetchWorkoutPlansByGym(parsedGym.id);
        setWorkoutPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch workout plans:", error);
      }
    };

    loadTrainees();
    loadWorkoutPlans();
  }, [form, navigate]);

  const handleUpdatePrice = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/web/manager/price/${gym.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ price: parseFloat(values.price) })
      });

      if (!response.ok) throw new Error('Failed to update price');
      
      const updatedGym = { ...gym, price: parseFloat(values.price) };
      setGym(updatedGym);
      sessionStorage.setItem('gymData', JSON.stringify(updatedGym));
      message.success('Price updated successfully');
    } catch (error) {
      console.error('Error updating price:', error);
      message.error('Failed to update price');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/web/manager/location/${gym.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ location: values.location })
      });

      if (!response.ok) throw new Error('Failed to update location');
      
      const updatedGym = { ...gym, location: values.location };
      setGym(updatedGym);
      sessionStorage.setItem('gymData', JSON.stringify(updatedGym));
      message.success('Location updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
      message.error('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLogo = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      setLoading(false);
      message.success('Logo updated successfully');
      // Update gym data with new logo path
      const updatedGym = { ...gym, logo: info.file.response.logo };
      setGym(updatedGym);
      sessionStorage.setItem('gymData', JSON.stringify(updatedGym));
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error('Failed to update logo');
    }
  };

  const handleDeleteTrainee = async (traineeId) => {
    try {
      await deleteTrainee(traineeId);
      setTrainees(trainees.filter((trainee) => trainee._id !== traineeId));
    } catch (error) {
      console.error("Failed to delete trainee:", error);
    }
  };

  const handleDeleteWorkoutPlan = async (planId) => {
    try {
      await deleteWorkoutPlan(planId);
      setWorkoutPlans(workoutPlans.filter((plan) => plan._id !== planId));
    } catch (error) {
      console.error("Failed to delete workout plan:", error);
    }
  };

  if (!gym) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Manage Your Gym</h1>
      <Card title={gym.name} style={{ marginBottom: '24px' }}>
        <p><strong>Location:</strong> {gym.location}</p>
        <p><strong>Current Price:</strong> ${gym.price}</p>
      </Card>

      <Card title="Update Gym Information" style={{ marginBottom: '24px' }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please input the gym location!' }]}
          >
            <Input placeholder="Enter new location" />
          </Form.Item>
          <Button 
            type="primary" 
            onClick={() => form.validateFields(['location']).then(values => handleUpdateLocation(values))}
            loading={loading}
            style={{ marginBottom: '16px' }}
          >
            Update Location
          </Button>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please input the gym price!' },
              { type: 'number', transform: value => Number(value), message: 'Please enter a valid number!' }
            ]}
          >
            <Input type="number" placeholder="Enter new price" />
          </Form.Item>
          <Button 
            type="primary" 
            onClick={() => form.validateFields(['price']).then(values => handleUpdatePrice(values))}
            loading={loading}
            style={{ marginBottom: '16px' }}
          >
            Update Price
          </Button>

          <Form.Item label="Logo">
            <Upload
              name="logo"
              action={`http://localhost:5000/api/web/manager/logo/${gym.id}`}
              headers={{
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
              }}
              onChange={handleUpdateLogo}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} loading={loading}>
                Update Logo
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Card>

      {/* Trainee Management Section */}
      <div className="trainee-management">
        <h2>Manage Trainees</h2>
        <TraineeList trainees={trainees} onDeleteTrainee={handleDeleteTrainee} />
      </div>

      {/* Workout Plan Management Section */}
      <div className="workout-plan-management">
        <h2>Manage Workout Plans</h2>
        <WorkoutPlanList workoutPlans={workoutPlans} onDeleteWorkout={handleDeleteWorkoutPlan} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
