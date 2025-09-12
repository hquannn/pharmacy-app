import ChangePassword from "@/components/ChangePassword"
import { atomApp } from "@/states/app"
import { LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { useKeycloak } from "@react-keycloak/web"
import { Dropdown, Flex, Layout, Typography } from "antd"
import { useAtomValue } from "jotai"
import { useState } from "react"

const AppHeader = () => {
  const appState = useAtomValue(atomApp)
  const { keycloak } = useKeycloak()

  const [openChangePassword, setOpenChangePassword] = useState(false)

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    })
  }

  return (
    <Layout.Header className="h-[64px] bg-[#4096ff] px-6">
      <Flex align="center" justify="space-between" className="h-full">
        <Typography.Title level={3} className="text-white m-0">
          {appState.headerText}
        </Typography.Title>
        <Dropdown
          menu={{
            items: [
              {
                key: "email",
                label: keycloak.tokenParsed?.preferred_username || "Anonymous",
                className: "pointer-events-none",
              },
              {
                type: "divider",
              },
              {
                key: "change-password",
                label: "Change Password",
                icon: <LockOutlined />,
                onClick: () => setOpenChangePassword(true),
              },
              {
                key: "logout",
                label: "Logout",
                icon: <LogoutOutlined />,
                onClick: handleLogout,
              },
            ],
          }}
        >
          <UserOutlined className="text-[28px] text-white" />
        </Dropdown>
      </Flex>
      <ChangePassword
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </Layout.Header>
  )
}

export default AppHeader
