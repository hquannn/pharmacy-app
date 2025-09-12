import { GET_REPORT_SALE } from "@/api/report.api"
import ContentWrapper from "@/components/ContentWrapper"
import Table from "@/components/Table"
import useApi from "@/hooks/useApi"
import { cn, convertISODate, formatDate } from "@/utils/function"
import { EyeOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Button, Card, DatePicker, Drawer, Flex, Space, TableProps } from "antd"
import dayjs from "dayjs"
import { memo, useEffect, useState } from "react"
import { TGetData, TInfo } from "./Report.type"

const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss"

const getDefaultFilters = () => {
  const date = new Date()
  const defaultFilters: {
    dates: any
    page: number
  } = {
    dates: [
      dayjs(new Date(date.getFullYear(), date.getMonth(), 1)),
      dayjs(date),
    ],
    page: 0,
  }

  return defaultFilters
}

const Report = () => {
  const { get } = useApi()
  const [filters, setFilters] = useState(getDefaultFilters())
  const [data, setData] = useState<TGetData>()
  const [open, setOpen] = useState(false)
  const { data: getData, status: getStatus } = useQuery<TGetData>({
    queryKey: ["getReportSales", filters],
    queryFn: () => {
      const { page, dates } = filters
      const params: any = { page }

      if (dates) {
        const [from, to] = dates

        params.saleDateBegin = formatDate(from, DATE_FORMAT)
        params.saleDateEnd = formatDate(to, DATE_FORMAT)
      }

      return get(GET_REPORT_SALE, params)
    },
  })
  const [saleItems, setSaleItems] = useState([])

  useEffect(() => {
    if (getStatus == "success" && getData) {
      setData(getData)
    }
  }, [getData])

  let total = 0
  let dataSource: any[] = []
  const { page, dates } = filters

  if (data) {
    total = data.totalElement
    dataSource = data.content.map((record) => {
      if (typeof record.createdDate == "string")
        record.createdDate = convertISODate(record.createdDate)

      return record
    })
  }

  const setPage = (page: number) => {
    setFilters({
      ...filters,
      page: page - 1,
    })
  }

  const setDates = (values: any) => {
    let dates

    if (values) {
      dates = values
    }

    setFilters({
      ...getDefaultFilters(),
      dates,
    })
  }

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
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
      title: "Refund Medicine",
      dataIndex: "refundMedicineName",
      key: "refundMedicineName",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => {
        return (
          <p
            className={cn(
              Number(value) < 0 ? "text-red-600" : "text-green-600"
            )}
          >
            {value}$
          </p>
        )
      },
    },
    {
      key: "action",
      align: "center",
      width: 100,
      render: (record: TInfo) =>
        record.type == "SALE" ? (
          <Space>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setOpen(true)
                setSaleItems(record.saleItems)
              }}
            />
          </Space>
        ) : null,
    },
  ] satisfies TableProps["columns"]

  return (
    <ContentWrapper
      hideCreate
      hideSearch
      subjectCreate="report"
      filterElement={
        <DatePicker.RangePicker
          showTime
          allowEmpty
          value={dates}
          onChange={setDates}
        />
      }
    >
      <Table
        total={total}
        page={page + 1}
        setPage={setPage}
        columns={columns}
        dataSource={dataSource}
        loading={getStatus == "pending"}
      />
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false)
          setSaleItems([])
        }}
        width={600}
        title="Sale Items"
      >
        <Flex gap={16} vertical>
          {saleItems.map((item) => {
            const { medicineName, quantity, totalPrice } = item
            return (
              <Card hoverable title={medicineName}>
                <Flex justify="space-between">
                  <p>{quantity} items</p>
                  <p>${totalPrice}</p>
                </Flex>
              </Card>
            )
          })}
        </Flex>
      </Drawer>
    </ContentWrapper>
  )
}

export default memo(Report)