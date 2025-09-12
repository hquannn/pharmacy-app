import {
  CREATE_SUPPLIER,
  DELETE_SUPPLIER,
  GET_SUPPLIER,
  UPDATE_SUPPLIER,
} from "@/api/supplier.api"
import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import useApi from "@/hooks/useApi"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { App, Button, Popconfirm, Space, TableProps } from "antd"
import { memo, useEffect, useState } from "react"
import { TGetData, TInfo } from "./Supplier.type"
import {fields} from "@/pages/supplier/Supplier.data.tsx";

const defaultInitialValues: any = {
  id: null,
  name: "",
  address: "",
  phoneNo: "",
  mail: "",
}

const defaultFilters: any = {
  name: "",
  page: 0,
  size: 20,
}

const Supplier = () => {
  const { get, post, put, del } = useApi()
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] =
    useState<TInfo>(defaultInitialValues)
  const [filters, setFilters] = useState(defaultFilters)
  const [data, setData] = useState<TGetData>()
  const { notification } = App.useApp()
  const {
    data: getData,
    status: getStatus,
    refetch,
  } = useQuery<TGetData>({
    queryKey: ["getSuppliers", filters],
    queryFn: () => get(GET_SUPPLIER, filters),
  })
  const { mutate, status: mutationStatus } = useMutation({
    mutationFn: (values: any) => {
      if (values.id) return put(UPDATE_SUPPLIER, values.id, values)
      if (typeof values == "string") return del(DELETE_SUPPLIER, values)
      return post(CREATE_SUPPLIER, values)
    },
  })

  useEffect(() => {
    if (getStatus == "success" && getData) {
      setData(getData)
    }
  }, [getData])

  const hanldeMutate = (status: string, values: any) => {
    mutate(values, {
      onSuccess: (ok: any) => {
        if (ok) {
          if (["deleted", "created"].includes(status)) {
            if (
              Object.keys(filters).every(
                (key) => defaultFilters[key] == filters[key]
              )
            ) {
              refetch()
            } else {
              setFilters(defaultFilters)
            }
          }

          if (status == "updated" && ok && data) {
            if (
              Object.keys(filters).every(
                (key) => defaultFilters[key] == filters[key]
              )
            ) {
              const { content } = data

              setData({
                ...data,
                content: content.map((record: TInfo) =>
                  record.id == values.id ? values : record
                ),
              })
            } else {
              refetch()
            }
          }

          handleOpen(false)
          notification.success({
            message: "Success",
            description: `Data has been ${status} successfully`,
          })
        }
      },
    })
  }

  const onEdit = (record: TInfo) => {
    handleOpen(true, record)
  }

  const onDelete = (id: string | null) => {
    hanldeMutate("deleted", id)
  }

  const setPage = (page: number) => {
    setFilters({
      ...filters,
      page: page - 1,
    })
  }

  const onSearch = (keyword: string) => {
    setFilters({
      ...defaultFilters,
      name: keyword,
    })
  }

  const onAdd = () => {
    setOpen(true)
  }

  const onSubmit = (values: TInfo, id: string | null) => {
    values.id = id
    hanldeMutate(id ? "updated" : "created", values)
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },
    {
      title: "Email",
      dataIndex: "mail",
      key: "mail",
    },
    {
      key: "action",
      align: "center",
      width: 100,
      render: (record: TInfo) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Confirm delete"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ] satisfies TableProps["columns"]

  let total = 0
  let dataSource: TInfo[] = []
  const { page } = filters

  if (data) {
    total = data.totalElement
    dataSource = data.content
  }

  const handleOpen = (
    isOpen: boolean,
    initialValues = defaultInitialValues
  ) => {
    setOpen(isOpen)
    setInitialValues(initialValues)
  }

  return (
    <ContentWrapper subjectCreate="supplier" onAdd={onAdd} onSearch={onSearch}>
      <Table
        total={total}
        page={page + 1}
        setPage={setPage}
        columns={columns}
        dataSource={dataSource}
        loading={getStatus == "pending"}
      />
      <DrawerForm
        open={open}
        title={initialValues.id ? "Edit Supplier" : "Create Supplier"}
        fields={fields}
        setOpen={() => handleOpen(false)}
        onSubmit={(values) => onSubmit(values, initialValues.id)}
        initialValues={initialValues}
        loading={mutationStatus == "pending"}
      />
    </ContentWrapper>
  )
}

export default memo(Supplier)
