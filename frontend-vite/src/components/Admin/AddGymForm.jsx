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
      Object.keys(values).forEach(key => {
        if (key !== 'logo') {
          formData.append(key, values[key]);
        }
      });

      if (fileList.length > 0) {
        formData.append('logo', fileList[0].originFileObj);
      }

      const response = await addGymWithManager(formData);
      message.success('Gym added successfully!');
      form.resetFields();
      setFileList([]);
      if (onAddGym) {
        onAddGym(response.gym);
      }
    } catch (error) {
      message.error('Failed to add gym: ' + error.message);
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
        <Input type="number" />
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
        <Upload {...uploadProps} maxCount={1}>
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
