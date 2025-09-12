import useAbility from "@/hooks/useAbility"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App, ConfigProvider, Spin } from "antd"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { RouterData } from "./App.data"
import AppLayout from "./layout/Layout"
import { useKeycloak } from "@react-keycloak/web"
import { useEffect } from "react"
import { getRolesFromToken } from "@/utils/auth"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error.status === 401) return failureCount < 10
        return false
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error.status === 401) return failureCount < 10
        return false
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

const AppProvider = () => {
  const ability = useAbility()
  const { keycloak } = useKeycloak()


    useEffect(() => {
    if (keycloak?.authenticated) {
      const roles = getRolesFromToken(keycloak.token)
      const isCustomer = roles.includes("CUSTOMER")
      if (isCustomer && location.pathname === "/") {
        <Navigate to="/shop" />
      }
    }
  }, [keycloak?.authenticated])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: RouterData.filter(({ subject }) => {
        if (!subject || !ability) return true
        return ability.can("read", subject)
      }),
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ])

  return (
    <ConfigProvider>
      <App
        notification={{
          duration: 3,
          maxCount: 3,
          pauseOnHover: true,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider
            router={router}
            fallbackElement={<Spin fullscreen size="large" />}
          />
        </QueryClientProvider>
      </App>
    </ConfigProvider>
  )
}

export default AppProvider
