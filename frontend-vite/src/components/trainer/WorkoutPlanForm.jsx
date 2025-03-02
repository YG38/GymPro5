// WorkoutPlanForm.js

import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Space, Typography, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { addWorkoutPlan } from "../../api/api";

const { TextArea } = Input;
const { Title } = Typography;

const WorkoutPlanForm = ({ trainerId, onAddWorkout, selectedCategory }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const formattedData = {
        ...values,
        category: selectedCategory,
        exercises: values.exercises || []
      };
      const response = await addWorkoutPlan(trainerId, formattedData);
      onAddWorkout(response.data);
      form.resetFields();
    } catch (error) {
      console.error("Failed to add workout plan:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        exercises: [{ name: "", sets: 1, reps: 1 }]
      }}
    >
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="name"
            label="Plan Name"
            rules={[{ required: true, message: 'Please enter plan name' }]}
          >
            <Input placeholder="Enter workout plan name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="duration"
            label="Duration (weeks)"
            rules={[{ required: true, message: 'Please enter duration' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter duration in weeks" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <TextArea rows={4} placeholder="Enter workout plan description" />
      </Form.Item>

      <Title level={5}>Exercises</Title>
      <Form.List name="exercises">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Missing exercise name' }]}
                >
                  <Input placeholder="Exercise name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'sets']}
                  rules={[{ required: true, message: 'Missing sets' }]}
                >
                  <InputNumber min={1} placeholder="Sets" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'reps']}
                  rules={[{ required: true, message: 'Missing reps' }]}
                >
                  <InputNumber min={1} placeholder="Reps" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Exercise
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Workout Plan
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WorkoutPlanForm;
