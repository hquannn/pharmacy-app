import { Field } from "@/types/FieldTypes"
import { Button, Popconfirm, Space, TableProps } from "antd"
import {maxDateByField, maxDateByValue, minByValue, minDateByField, minDateByValue} from "@/utils/validators.ts";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Ability from "@/components/Ability"
import { PurchaseInterface } from "./Purchase.type";

export const columns = (
  _onEdit: (record: any) => void,
  _onDelete: (id: string) => void
) =>
  [
    {
      key: "medicine",
      title: "Medicine",
      dataIndex: "medicine",
      render: (record) => {
        return record?.name
      }
    },
    {
      key: "supplier",
      title: "Supplier",
      dataIndex: "supplier",
      render: (record) => {
        return record?.name
      }
    },
    {
      key: "quantity",
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      key: "createdDate",
      title: "Created Date",
      dataIndex: "createdDate",
      width: 150,
    },
    {
      key: "updatedDate",
      title: "Updated Date",
      dataIndex: "updatedDate",
      width: 150,
    },
    {
      key: "action",
      align: "center",
      width: 100,
      render: (record: PurchaseInterface) => (
        <Space>
          <Ability action="update" subject="stockPurchase">
            <Button hidden
              type="primary"
              icon={<EditOutlined />}
              onClick={() => _onEdit(record)}
            />
          </Ability>
          <Ability action="delete" subject="stockPurchase">
            <Popconfirm
              title="Confirm delete"
              okText="Yes"
              cancelText="No"
              onConfirm={() => _onDelete(record.id as string)}
            >
                <Button danger type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Ability>
        </Space>
      ),
    },
  ] satisfies TableProps["columns"]

export const fields: (
  medicine: any[],
  supplier: any[],
  locationRack: any[],
  setOpenAddMed: (open: boolean) => void,
  setOpenAddSupplier: (open: boolean) => void,
  setOpenAddLocationRack: (open: boolean) => void,
) => Field[] = (
    medicine, supplier, locationRack,
    setOpenAddMed, setOpenAddSupplier, setOpenAddLocationRack
) => [
  {
    label: "medicine",
    name: "medicineId",
    type: "select-api",
    placeholder: "Medicine",
    options: medicine,
    selectorState: "meds",
    rules: [{ required: true, message: "Medicine is required" }],
    onAdd: () => setOpenAddMed(true),
    showButtonAdd: true
  },
  {
    label: "Supplier",
    name: "supplierId",
    type: "select-api",
    placeholder: "Supplier",
    options: supplier,
    rules: [{ required: true, message: "Supplier is required" }],
    selectorState: "suppliers",
    onAdd: () => setOpenAddSupplier(true),
    showButtonAdd: true
  },
  {
    label: "Location Rack",
    name: "locationRackId",
    type: "select-api",
    placeholder: "Location Rack",
    options: locationRack,
    rules: [{ required: true, message: "Location rack is required" }],
    selectorState: "locationRacks",
    onAdd: () => setOpenAddLocationRack(true),
    showButtonAdd: true
  },
  {
    label: "Quantity",
    name: "quantity",
    type: "number",
    placeholder: "Quantity",
    rules: [{ required: true, message: "Quantity is required" }, minByValue('quantity', 'Quantity', 1)],
  },
  {
    label: "Cost",
    name: "cost",
    type: "number",
    placeholder: "Cost",
    rules: [{ required: true, message: "Cost is required" }, minByValue('cost', 'Cost', 0)],
  },
  {
    label: "MFG date",
    name: "mfgDate",
    type: "date",
    placeholder: "MFG date",
    rules: [{ required: true, message: "MFG date is required" }, maxDateByValue('mfgDate', 'EXP date', new Date(), 'MFG date must be less than today!'), maxDateByField('mfgDate', 'MFG date', 'expDate')],
  },
  {
    label: "EXP date",
    name: "expDate",
    type: "date",
    placeholder: "EXP date",
    rules: [{ required: true, message: "EXP date is required" }, minDateByValue('expDate', 'EXP date', new Date(), 'EXP date must be greater than today!'), minDateByField('expDate', 'EXP date', 'mfgDate')],
  },
]
