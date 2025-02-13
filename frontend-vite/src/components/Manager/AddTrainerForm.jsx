import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { UserAddOutlined } from '@ant-design/icons';
import { addTrainer } from "../../api/api";

const { Text } = Typography;

const AddTrainerForm = ({ gymId, onAddTrainer }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      if (!gymId) {
        throw new Error('Gym ID is required');
      }

      const trainerData = {
        ...values,
        role: 'trainer',
        gymId: gymId
      };

      const response = await addTrainer(trainerData);
      
      if (response && response.trainer) {
        message.success('GymPro™ trainer added successfully');
        onAddTrainer(response.trainer);
        form.resetFields();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Failed to add trainer:", error, "Request Body:", trainerData);
      message.error(error.message || 'Failed to add trainer');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: '100%' }}
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        Add a new trainer to your GymPro™ team
      </Text>
      
      <Form.Item
        name="name"
        label="Trainer Name"
        rules={[{ required: true, message: 'Please enter trainer name' }]}
      >
        <Input 
          prefix={<UserAddOutlined />} 
          placeholder="Enter trainer name"
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email Address"
        rules={[
          { required: true, message: 'Please enter trainer email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          prefix={<UserAddOutlined />} 
          placeholder="Enter trainer email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter password' },
          { min: 6, message: 'Password must be at least 6 characters' }
        ]}
      >
        <Input.Password 
          placeholder="Enter password"
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit"
          icon={<UserAddOutlined />}
          block
        >
          Add GymPro™ Trainer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddTrainerForm;