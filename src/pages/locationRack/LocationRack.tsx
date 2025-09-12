import {
  CREATE_LOCATION_RACK,
  DELETE_LOCATION_RACK,
  GET_LOCATION_RACK,
  UPDATE_LOCATION_RACK,
} from "@/api/locationRack.api"
import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import useApi from "@/hooks/useApi"
import { convertISODate } from "@/utils/function"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { App, Button, Popconfirm, Space, TableProps } from "antd"
import { memo, useEffect, useState } from "react"
import { TGetData, TInfo } from "./LocationRack.type"
import {fields} from "@/pages/locationRack/LocationRack.data.tsx";

const defaultInitialValues: any = {
  id: null,
  position: "",
}

const defaultFilters: any = {
  position: "",
  page: 0,
  size: 20,
}

const LocationRack = () => {
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
    queryKey: ["getLocationRacks", filters],
    queryFn: () => get(GET_LOCATION_RACK, filters),
  })
  const { mutate, status: mutationStatus } = useMutation({
    mutationFn: (values: any) => {
      if (values.id) return put(UPDATE_LOCATION_RACK, values.id, values)
      if (typeof values == "string") return del(DELETE_LOCATION_RACK, values)
      return post(CREATE_LOCATION_RACK, values)
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
            refetch()
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
      position: keyword,
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
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: "25%",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
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
    dataSource = data.content.map((record) => {
      if (typeof record.createdDate == "string")
        record.createdDate = convertISODate(record.createdDate)

      if (typeof record.updatedDate == "string")
        record.updatedDate = convertISODate(record.updatedDate)

      return record
    })
  }

  const handleOpen = (
    isOpen: boolean,
    initialValues = defaultInitialValues
  ) => {
    setOpen(isOpen)
    setInitialValues(initialValues)
  }

  return (
    <ContentWrapper
      subjectCreate="locationRack"
      onAdd={onAdd}
      onSearch={onSearch}
    >
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
        title={initialValues.id ? "Edit Location Rack" : "Create Location Rack"}
        fields={fields}
        setOpen={() => handleOpen(false)}
        onSubmit={(values) => onSubmit(values, initialValues.id)}
        initialValues={initialValues}
        loading={mutationStatus == "pending"}
      />
    </ContentWrapper>
  )
}

export default memo(LocationRack)
