import FallBack from "@/components/Fallback"
import { Layout } from "antd"
import { MacScrollbar } from "mac-scrollbar"
import { Suspense } from "react"
import { Outlet } from "react-router-dom"

const AppContent = () => {
  return (
    <Layout.Content>
      <MacScrollbar className="h-[calc(100vh-64px)] px-4 py-3">
        <Suspense fallback={<FallBack />}>
          <Outlet />
        </Suspense>
      </MacScrollbar>
    </Layout.Content>
  )
}

export default AppContent
