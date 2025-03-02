import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addGymWithManager } from "../../api/api";

const { Option } = Select;

const AddGymForm = ({ onAddGym }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Comprehensive validation with detailed error tracking
      const errors = {};

      // Validate each field with more robust checks
      if (!values.gymName || values.gymName.trim().length < 2) {
        errors.gymName = 'Gym name must be at least 2 characters long';
      }

      if (!values.location || values.location.trim().length < 5) {
        errors.location = 'Location must be at least 5 characters long';
      }

      // Enhanced price validation
      const price = parseFloat(values.price);
      if (isNaN(price) || price <= 0) {
        errors.price = 'Price must be a positive number';
      }

      if (!values.managerName || values.managerName.trim().length < 2) {
        errors.managerName = 'Manager name must be at least 2 characters long';
      }

      // Strict email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!values.managerEmail || !emailRegex.test(values.managerEmail.trim())) {
        errors.managerEmail = 'Please enter a valid email address';
      }

      // Password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!values.managerPassword || !passwordRegex.test(values.managerPassword)) {
        errors.managerPassword = 'Password must be 8+ chars, with uppercase, lowercase, and number';
      }

      // If validation errors exist, throw comprehensive error
      if (Object.keys(errors).length > 0) {
        const errorMessage = Object.values(errors).join(', ');
        throw new Error(`Validation Error: ${errorMessage}`);
      }

      // Prepare FormData with explicit type conversions
      const formData = new FormData();
      formData.append('gymName', values.gymName.trim());
      formData.append('location', values.location.trim());
      formData.append('price', price.toFixed(2)); // Ensure consistent decimal representation
      formData.append('managerName', values.managerName.trim());
      formData.append('managerEmail', values.managerEmail.trim().toLowerCase());
      formData.append('managerPassword', values.managerPassword);

      // Handle logo upload
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('logo', fileList[0].originFileObj);
      }

      // Extensive logging before submission
      console.group('🏋️ Gym Submission Details');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${key === 'managerPassword' ? '********' : value}`);
      }
      console.groupEnd();

      // Attempt to add gym
      const response = await addGymWithManager(formData);
      
      // Success handling
      message.success('Gym added successfully!');
      form.resetFields();
      setFileList([]);
      
      // Optional callback if provided
      if (onAddGym) {
        onAddGym(response.gym);
      }

      return response;

    } catch (error) {
      // Comprehensive error handling
      console.group('❌ Gym Addition Error');
      console.error('Full Error Object:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Server Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      
      // User-friendly error messages
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Failed to add gym. Please check your input.';
      
      message.error(errorMessage);
      console.groupEnd();

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
      
      // Manually set the file
      setFileList([file]);
      return false; // Prevent default upload
    },
    onChange: ({ fileList }) => {
      // This is now handled in beforeUpload
      console.log('File List:', fileList);
    },
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
