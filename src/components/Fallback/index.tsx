import { Flex, Skeleton } from "antd"

const FallBack = () => {
  return (
    <Flex vertical gap={16} className="w-full">
      <Flex gap={16} justify="space-between">
        <Skeleton.Input active />
        <Skeleton.Button active />
      </Flex>
      <Skeleton.Node active className="w-full h-[calc(100vh-140px)]" />
    </Flex>
  )
}

export default FallBack
