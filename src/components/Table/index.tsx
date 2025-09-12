import { Table, TableProps } from "antd"
import { FC, memo } from "react"

type TTableCustomProps = {
  total: number
  page: number
  setPage: (page: number) => void
} & Omit<TableProps, "rowKey">

const TableCustom: FC<TTableCustomProps> = ({
  total,
  page,
  setPage,
  ...props
}) => {
  return (
    <Table
      {...props}
      rowKey={({ id }) => id}
      scroll={{ scrollToFirstRowOnChange: true, y: "calc(100vh - 265px)" }}
      pagination={{
        total,
        showSizeChanger: false,
        showQuickJumper: false,
        pageSize: 20,
        current: page,
        showTotal: (total) => `Total ${total} items`,
        onChange: setPage,
      }}
    />
  )
}

export default memo(TableCustom)
