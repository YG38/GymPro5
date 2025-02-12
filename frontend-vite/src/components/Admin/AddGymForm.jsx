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
      const formData = new FormData();
      
      // Add all form values to FormData
      formData.append('gymName', values.gymName);
      formData.append('location', values.location);
      formData.append('price', values.price);
      formData.append('managerName', values.managerName);
      formData.append('managerEmail', values.managerEmail);
      formData.append('managerPassword', values.managerPassword);

      // Add logo if present
      if (fileList.length > 0) {
        formData.append('logo', fileList[0].originFileObj);
      }

      const response = await addGymWithManager(formData);
      
      if (response.gym) {
        message.success('Gym added successfully!');
        form.resetFields();
        setFileList([]);
        if (onAddGym) {
          onAddGym(response.gym);
        }
      } else {
        throw new Error('Failed to add gym: Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding gym:', error);
      message.error(error.response?.data?.error || error.message || 'Failed to add gym');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
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
        rules={[{ required: true, message: 'Please input the gym name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Location"
        name="location"
        rules={[{ required: true, message: 'Please input the gym location!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Please input the gym price!' }]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item
        label="Manager Name"
        name="managerName"
        rules={[{ required: true, message: 'Please input the manager name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Manager Email"
        name="managerEmail"
        rules={[
          { required: true, message: 'Please input the manager email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Manager Password"
        name="managerPassword"
        rules={[
          { required: true, message: 'Please input the manager password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Gym Logo"
        name="logo"
      >
        <Upload {...uploadProps} listType="picture">
          <Button icon={<UploadOutlined />}>Upload Logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Add Gym
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddGymForm;
