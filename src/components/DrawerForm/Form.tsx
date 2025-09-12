import { SearchApi } from "@/components/DrawerForm/SelectApi.tsx"
import { Field } from "@/types/FieldTypes"
import {
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
} from "antd"
import {FC, memo, useEffect} from 'react';

export type TCustomFormProps = {
  form: FormInstance
  fields: Field[]
  initialValues?: any
  patchValue?: any
  onSubmit: (values: any) => void
}

const CustomForm: FC<TCustomFormProps> = ({
  form,
  fields,
  initialValues,
  onSubmit, patchValue
}) => {
  useEffect(() => {
    if(patchValue) {
      form.setFieldsValue(patchValue)
    }
  }, [patchValue])
  const renderField = (field: Field) => {
    switch (field.type) {
      case "number":
        return (
          <InputNumber
            prefix={field.prefix}
            suffix={field.suffix}
            placeholder={field.placeholder}
            className="w-full"
            disabled={field.disable}
          />
        )
      case "textarea":
        return (
          <Input.TextArea
              disabled={field.disable}
            placeholder={field.placeholder}
            autoSize={{ minRows: 3 }}
          />
        )
      case "select":
        return (
          <Select placeholder={field.placeholder} options={field.options} disabled={field.disable} />
        )
      case "select-api":
        return (
            <SearchApi {...field} placeholder={field.placeholder}
                       onChange={(newValue) => {
                           form.setFieldValue(field.name, newValue);
                       }}
                       showSearch={true} disabled={field.disable}
                       value={form.getFieldValue(field.name)}
                       selectorState={field.selectorState}
                       fetchOptions={field.fetchOptions}/>
        )
      case "date":
        return (
          <DatePicker
            needConfirm
            placeholder={field.placeholder} disabled={field.disable}
            className="w-full"
          />
        )
      default:
        return (
          <Input
            prefix={field.prefix}
            suffix={field.suffix} disabled={field.disable}
            placeholder={field.placeholder}
            type={field.type}
          />
        )
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      {fields.filter(field => !field.hide).map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={field.rules}
        >
          {renderField(field)}
        </Form.Item>
      ))}
    </Form>
  )
}

export default memo(CustomForm)
