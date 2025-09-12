import Ability from "@/components/Ability"
import { Field } from "@/types/FieldTypes"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Space, TableProps } from "antd"
import { TInfoMedicine } from "./Medicine.type"

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
      key: "price",
      title: "Price",
      dataIndex: "price",
      render: (price: number) => (price ? `$${price}` : ""),
    },
    {
      key: "unit",
      title: "Unit",
      dataIndex: "unit",
      render: (unit: TInfoMedicine["unit"]) => unit?.unit,
    },
    {
      key: "category",
      title: "Category",
      dataIndex: "category",
      render: (category: TInfoMedicine["category"]) => category?.name,
    },
    {
      key: "ingredients",
      title: "Ingredients",
      dataIndex: "ingredients",
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
      render: (record: TInfoMedicine) => (
        <Space>
          <Ability action="update" subject="medicine">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Ability>
          <Ability action="delete" subject="medicine">
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

export const fields: (optionCategory: any[], optionUnit: any[], setOpenCategory: any) => Field[] = (
  optionCategory,
  optionUnit,
  setOpenCategory
) => [
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Medicine Name",
    rules: [{ required: true, message: "Name is required" }],
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "Medicine Price",
    prefix: "$",
    rules: [{ required: true, message: "Price is required" }],
  },
  {
    label: "Unit",
    name: "medicineUnitId",
    type: "select",
    placeholder: "Medicine Unit",
    rules: [{ required: true, message: "Unit is required" }],
    options: optionUnit,
  },
  {
    label: "Category",
    name: "categoryId",
    type: "select-api",
    placeholder: "Medicine Category",
    rules: [{ required: true, message: "Category is required" }],
    options: optionCategory,
    selectorState: "categories",
    onAdd: () => setOpenCategory(true),
    showButtonAdd: true
  },
  {
    label: "Ingredients",
    name: "ingredients",
    type: "text",
    placeholder: "Ingredients",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "Description",
  }
]
