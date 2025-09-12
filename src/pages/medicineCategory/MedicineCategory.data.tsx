import Ability from "@/components/Ability"
import { Field } from "@/types/FieldTypes"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Space, TableProps } from "antd"
import { TInfoMedicineCategory } from "./MedicineCategory.type"

export const columns = (
  onEdit: (record: any) => void,
  onDelete: (id: string) => void
) =>
  [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "createdDate",
      title: "Created Date",
      dataIndex: "createdDate",
      width: 150,
    },
    {
      key: "createdBy",
      title: "Created By",
      dataIndex: "createdBy",
      width: 120,
    },
    {
      key: "updatedDate",
      title: "Updated Date",
      dataIndex: "updatedDate",
      width: 150,
    },
    {
      key: "updatedBy",
      title: "Updated By",
      dataIndex: "updatedBy",
      width: 120,
    },
    {
      key: "action",
      align: "center",
      width: 100,
      render: (record: TInfoMedicineCategory) => (
        <Space>
          <Ability action="update" subject="medicineCategory">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Ability>
          <Ability action="delete" subject="medicineCategory">
            <Popconfirm
              title="Confirm delete"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(record.id)}
            >
              <Button danger type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Ability>
        </Space>
      ),
    },
  ] satisfies TableProps["columns"]

export const fields: () => Field[] = () => [
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Medicine Category Name",
    rules: [{ required: true, message: "Name is required" }],
  },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    placeholder: "Medicine Category Description",
    rules: [{ required: true, message: "Description is required" }],
  },
]
