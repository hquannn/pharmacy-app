import { Subject } from "@/hooks/useAbility"
import { cn } from "@/utils/function"
import { PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Input } from "antd"
import { FC, ReactNode, useState } from "react"
import Ability from "../Ability"

type TContentWrapper = FC<{
  hideCreate?: boolean
  hideSearch?: boolean
  subjectCreate: Subject
  children: ReactNode
  filterElement?: ReactNode
  onAdd?: () => void
  onSearch?: (keyword: string) => void
}>

const ContentWrapper: TContentWrapper = ({
  children,
  filterElement,
  subjectCreate,
  hideCreate,
  hideSearch,
  onAdd,
  onSearch,
}) => {
  const [isSearched, setIsSearched] = useState(false)

  const handleSearch = (value: string) => {
    if (value) setIsSearched(true)
    else setIsSearched(false)
    onSearch?.(value)
  }

  return (
    <Flex vertical gap={16} className="w-full">
      <Flex gap={16} justify="space-between">
        <Flex gap={16} wrap="wrap">
          <Input.Search
            allowClear
            enterButton
            size="large"
            onChange={(e) => !e.target.value && isSearched && handleSearch("")}
            onSearch={handleSearch}
            placeholder="Search..."
            className={cn("w-[350px]", { hidden: hideSearch })}
          />
          {filterElement}
        </Flex>
        <Ability action="create" subject={subjectCreate}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            onClick={onAdd}
            className={cn({ hidden: hideCreate })}
          >
            Create
          </Button>
        </Ability>
      </Flex>
      {children}
    </Flex>
  )
}

export default ContentWrapper
