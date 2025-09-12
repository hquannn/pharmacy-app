import { cn } from "@/utils/function"
import { useKeycloak } from "@react-keycloak/web"
import { Layout, Spin } from "antd"
import { useEffect } from "react"
import AppContent from "./Content"
import AppHeader from "./Header"
import AppSider from "./Sider"

const AppLayout = () => {
  const { keycloak, initialized } = useKeycloak()

  useEffect(() => {
    if (initialized) {
      keycloak.onAuthRefreshError = () => {
        keycloak.logout({
          redirectUri: window.location.origin,
        })
      }
    }
    return () => {
      keycloak.onAuthRefreshError = () => {}
    }
  }, [initialized])

  return (
    <>
      {(!initialized || !keycloak.authenticated) && (
        <>
          <div
            className={cn("w-screen h-screen fixed top-0 left-0 bg-white z-40")}
          />
          <Spin
            spinning
            size="large"
            className="fixed top-[calc(50%-16px)] left-[calc(50%-16px)] z-50"
          />
          `
        </>
      )}
      <Layout className={cn("w-screen h-screen")}>
        <AppSider />
        <Layout>
          <AppHeader />
          {initialized && keycloak.authenticated && <AppContent />}
        </Layout>
      </Layout>
    </>
  )
}
export default AppLayout
