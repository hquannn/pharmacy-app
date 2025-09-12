import { jwtDecode } from "jwt-decode"

type KeycloakToken = {
  realm_access?: {
    roles: string[]
  }
}

export const getRolesFromToken = (token: string | undefined): string[] => {
  if (!token) return []
  try {
    const decoded = jwtDecode<KeycloakToken>(token)
    return decoded?.realm_access?.roles || []
  } catch (err) {
    console.error("Failed to decode token", err)
    return []
  }
}