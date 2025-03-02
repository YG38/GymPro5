import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addGymWithManager } from "../../api/api";

const { Option } = Select;

const AddGymForm = ({ onAddGym }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Comprehensive validation
      const errors = {};

      // Gym Name validation
      if (!values.gymName || values.gymName.trim().length < 2) {
        errors.gymName = 'Gym name must be at least 2 characters long';
      }

      // Location validation
      if (!values.location || values.location.trim().length < 5) {
        errors.location = 'Location must be at least 5 characters long';
      }

      // Price validation
      const price = parseFloat(values.price);
      if (isNaN(price) || price <= 0) {
        errors.price = 'Price must be a positive number';
      }

      // Manager Name validation
      if (!values.managerName || values.managerName.trim().length < 2) {
        errors.managerName = 'Manager name must be at least 2 characters long';
      }

      // Email validation
      if (!values.managerEmail || !validateEmail(values.managerEmail)) {
        errors.managerEmail = 'Please enter a valid email address';
      }

      // Password validation
      if (!values.managerPassword || !validatePassword(values.managerPassword)) {
        errors.managerPassword = 'Password must be at least 8 characters, with uppercase, lowercase, and number';
      }

      // If any errors, throw validation error
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      const formData = new FormData();
      formData.append('gymName', values.gymName.trim());
      formData.append('location', values.location.trim());
      formData.append('price', price.toString());
      formData.append('managerName', values.managerName.trim());
      formData.append('managerEmail', values.managerEmail.trim().toLowerCase());
      formData.append('managerPassword', values.managerPassword);

      if (fileList.length > 0) {
        formData.append('logo', fileList[0].originFileObj);
      }

      // Detailed logging
      console.log('Submitting gym form with values:', {
        gymName: values.gymName,
        location: values.location,
        price: price,
        managerName: values.managerName,
        managerEmail: values.managerEmail,
        logoProvided: fileList.length > 0
      });

      const response = await addGymWithManager(formData);
      
      if (response && response.gym) {
        message.success('Gym added successfully!');
        form.resetFields();
        setFileList([]);
        if (onAddGym) {
          onAddGym(response.gym);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Full error object:', error);
      
      // Detailed error logging and user feedback
      if (error.response) {
        console.error('Server responded with error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // More specific error handling
        if (error.response.data.missingFields) {
          message.error(`Missing fields: ${error.response.data.missingFields.join(', ')}`);
        } else if (error.response.data.error) {
          message.error(error.response.data.error);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        message.error('No response received from the server. Please check your network connection.');
      } else {
        console.error('Error setting up request:', error.message);
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return false;
    },
    onChange: ({ fileList }) => setFileList(fileList),
    fileList,
    maxCount: 1,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        label="Gym Name"
        name="gymName"
        rules={[
          { required: true, message: 'Please input the gym name!' },
          { min: 2, message: 'Gym name must be at least 2 characters!' },
          { max: 50, message: 'Gym name cannot be longer than 50 characters!' }
        ]}
      >
        <Input placeholder="Enter gym name" />
      </Form.Item>

      <Form.Item
        label="Location"
        name="location"
        rules={[
          { required: true, message: 'Please input the gym location!' },
          { min: 5, message: 'Location must be at least 5 characters!' },
          { max: 100, message: 'Location cannot be longer than 100 characters!' }
        ]}
      >
        <Input placeholder="Enter full address (e.g., 123 Main St, City, Country)" />
      </Form.Item>

      <Form.Item
        label="Monthly Membership Price"
        name="price"
        rules={[
          { required: true, message: 'Please input the gym price!' },
          { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Price must be a valid number without symbols or letters' }
        ]}
      >
        <Input 
          type="text" 
          placeholder="Enter monthly membership price" 
        />
      </Form.Item>

      <Form.Item
        label="Manager Name"
        name="managerName"
        rules={[
          { required: true, message: 'Please input the manager name!' },
          { min: 2, message: 'Manager name must be at least 2 characters!' },
          { max: 50, message: 'Manager name cannot be longer than 50 characters!' }
        ]}
      >
        <Input placeholder="Enter manager's full name" />
      </Form.Item>

      <Form.Item
        label="Manager Email"
        name="managerEmail"
        rules={[
          { required: true, message: 'Please input the manager email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input placeholder="Enter manager's email address" />
      </Form.Item>

      <Form.Item
        label="Manager Password"
        name="managerPassword"
        rules={[
          { required: true, message: 'Please input the manager password!' },
          { min: 8, message: 'Password must be at least 8 characters!' },
          { 
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            message: 'Password must contain uppercase, lowercase, and number!'
          }
        ]}
      >
        <Input.Password placeholder="Enter manager's password" />
      </Form.Item>

      <Form.Item
        label="Gym Logo"
        name="logo"
        extra="Supported formats: JPG, PNG. Max size: 2MB"
      >
        <Upload {...uploadProps} listType="picture">
          <Button icon={<UploadOutlined />}>Upload Logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading} 
          block
          size="large"
        >
          Add Gym
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddGymForm;
