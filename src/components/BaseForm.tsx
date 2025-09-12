// BaseForm.tsx
import React from 'react';
import {Form, Input, Button, Select, DatePicker} from 'antd';
import {Field} from "@/types/FieldTypes.ts";

interface BaseFormProps {
  fields: Field[];
  onFinish: (values: any) => void;
  initialValues?: any;
  isSubmitting?: boolean;
}

const { Option } = Select;

const BaseForm: React.FC<BaseFormProps> = ({ fields, onFinish, initialValues, isSubmitting }) => {
  const [form] = Form.useForm();

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return <Input placeholder={field.placeholder} type={field.type} />;
      case 'number':
        return <Input placeholder={field.placeholder} type="number" />;
      case 'textarea':
        return <Input.TextArea placeholder={field.placeholder} />;
      case 'date':
        return <DatePicker  style={{ width: '100%' }} defaultValue={field.placeholder} />
      case 'select':
        return (
          <Select placeholder={field.placeholder}>
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      default:
        return <Input placeholder={field.placeholder} />;
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={field.rules}
        >
          {renderField(field)}
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={isSubmitting} loading={isSubmitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BaseForm;
