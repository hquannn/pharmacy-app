import { RouterData } from "@/app/App.data"
import useAbility from "@/hooks/useAbility"
import { atomApp } from "@/states/app"
import { cn } from "@/utils/function"
import { Flex, Layout, Menu, Typography } from "antd"
import { useSetAtom } from "jotai"
import { MacScrollbar } from "mac-scrollbar"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const AppSider = () => {
  const setAppState = useSetAtom(atomApp)
  const [collapsed, setCollapsed] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("/")

  const location = useLocation()
  const navigate = useNavigate()
  const ability = useAbility()

  const handleSelectMenu = (key: string) => {
    const label = RouterData.find((item) => item.key === key)?.label
    if (label) setAppState((prev) => ({ ...prev, headerText: label }))
    setCurrentLocation(key)
    navigate(key)
  }

  useEffect(() => {
    if (location.pathname !== currentLocation) {
      const label = RouterData.find(
        (item) => item.key === location.pathname
      )?.label
      if (label) setAppState((prev) => ({ ...prev, headerText: label }))
      setCurrentLocation(location.pathname)
    }
  }, [location])

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width="280px"
      className="leading-[120px]"
    >
      <Flex align="center" gap={16} className="px-4 py-3">
        <img src="/pharmacy.svg" width={40} height={40} />
        <Typography.Title
          level={2}
          className={cn(
            "text-white text-center uppercase m-0",
            collapsed && "hidden"
          )}
        >
          Pharmacy
        </Typography.Title>
      </Flex>
      <MacScrollbar skin="dark" className="h-[calc(100vh-114px)]">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentLocation]}
          onSelect={({ key }) => handleSelectMenu(key)}
          items={RouterData.filter(({ subject }) => {
            if (!subject || !ability) return true
            return ability.can("read", subject)
          }).map((item) => {
            const { index, ...rest } = item
            return rest
          })}
        />
      </MacScrollbar>
    </Layout.Sider>
  )
}

export default AppSider
