import { ReactKeycloakProvider } from "@react-keycloak/web"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import Keycloak from "keycloak-js"
import "mac-scrollbar/dist/mac-scrollbar.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import AppProvider from "./app/App"
import "./index.css"

dayjs.extend(utc)

const keycloak = new Keycloak({
  url: "http://localhost:9090",
  realm: "pharmacy-management",
  clientId: "pharmacy-management-system",
})

createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "check-sso",
    }}
    autoRefreshToken={false}
    onEvent={(e) => {
      if (e === "onReady" && !keycloak.authenticated) keycloak.login()
    }}
  >
    <StrictMode>
      <AppProvider />
    </StrictMode>
  </ReactKeycloakProvider>
)
