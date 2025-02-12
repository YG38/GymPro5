import React, { useState, useEffect } from "react";
import { fetchGyms, deleteGym } from "../../api/api";
import { Table, Button, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const GymDashboard = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGyms = async () => {
    setLoading(true);
    try {
      const data = await fetchGyms();
      console.log('Fetched gyms:', data);
      setGyms(data);
    } catch (error) {
      console.error("Error fetching gyms:", error);
      message.error("Failed to load gyms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGyms();
  }, []);

  const handleDeleteGym = async (gymId) => {
    try {
      await deleteGym(gymId);
      message.success("Gym deleted successfully");
      loadGyms(); // Reload the list
    } catch (error) {
      console.error("Error deleting gym:", error);
      message.error("Failed to delete gym");
    }
  };

  const columns = [
    {
      title: 'Gym Name',
      dataIndex: 'gymName',
      key: 'gymName',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Manager',
      dataIndex: 'managerName',
      key: 'managerName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Delete this gym?"
          description="Are you sure you want to delete this gym? This action cannot be undone."
          onConfirm={() => handleDeleteGym(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>Manage Gyms</h2>
      <Table 
        columns={columns} 
        dataSource={gyms} 
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default GymDashboard;
