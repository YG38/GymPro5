import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addGymWithManager } from "../../api/api";

const AddGymForm = ({ onAddGym }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!values.gymName || !values.location || !values.price || 
          !values.managerName || !values.managerEmail || !values.managerPassword) {
        throw new Error('Please fill in all required fields');
      }

      // Validate price is a valid number
      const price = values.price;
      if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(price)) {
        throw new Error('Price must be a valid number without symbols or letters');
      }

      const formData = new FormData();
      formData.append('gymName', values.gymName.trim());
      formData.append('location', values.location.trim());
      formData.append('price', price);
      formData.append('managerName', values.managerName.trim());
      formData.append('managerEmail', values.managerEmail.trim().toLowerCase());
      formData.append('managerPassword', values.managerPassword);

      if (fileList.length > 0) {
        formData.append('logo', fileList[0].originFileObj);
      }

      console.log('Submitting form with values:', {
        gymName: values.gymName,
        location: values.location,
        price: price,
        managerName: values.managerName,
        managerEmail: values.managerEmail,
        // password omitted for security
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
      console.error('Error adding gym:', error);
      message.error(
        error.response?.data?.error || 
        error.message || 
        'Failed to add gym. Please check your input and try again.'
      );
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
          { min: 6, message: 'Password must be at least 6 characters!' },
          { 
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
            message: 'Password must contain at least one letter and one number!'
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
