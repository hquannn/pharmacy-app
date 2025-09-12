import {
  AbilityBuilder,
  createMongoAbility,
  MongoQuery,
  PureAbility,
} from "@casl/ability"
import { useKeycloak } from "@react-keycloak/web"

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  CUSTOMER = "CUSTOMER",
}

export type CRUDAction = "create" | "read" | "update" | "delete" | "readOwn"

export type Subject =
  | "medicine"
  | "supplier"
  | "stockPurchase"
  | "employee"
  | "pharmacy-pos"
  | "customer"
  | "saleTransaction"
  | "report"
  | "locationRack"
  | "medicineCategory"
  | "setting"
  | "store"
  | "report"
  | "cart"
  | "message"

type Ability = [CRUDAction, Subject]

const useAbility = () => {
  const { can, build } = new AbilityBuilder<PureAbility<Ability, MongoQuery>>(
    createMongoAbility
  )
  const { keycloak, initialized } = useKeycloak()

  if (!initialized || !keycloak.authenticated) return null

  const roleList =
    (keycloak.tokenParsed?.resource_access as any)["pharmacy-management-system"]
      ?.roles || []
  let role: Role
  if (roleList.includes("ADMIN")) {
    role = Role.ADMIN
  } else if (roleList.includes("USER")) {
    role = Role.USER
  } else if (roleList.includes("CUSTOMER")) {
    role = Role.CUSTOMER
  } else {
    role = Role.USER
  }
  if (role === Role.ADMIN)
    can(
      ["create", "read", "update", "delete"],
      [
        "medicine",
        "supplier",
        "stockPurchase",
        "employee",
        "customer",
        "saleTransaction",
        "report",
        "locationRack",
        "medicineCategory",
        "pharmacy-pos",
        "setting",
        "report",
      ]
    )
  if (role === Role.USER) {
    can(["create", "read", "update", "delete"], "pharmacy-pos")
    can(["create", "read", "update", "delete"], "report")
    can("read", "medicine")
    can("read", "locationRack")
    can("read", "customer")
    can("readOwn", "saleTransaction")
    can("read", "message")
  }
  if (role === Role.CUSTOMER) {
    can("read", "cart")
    can("read", "message")
    can("read", "medicine")
  }

  return build()
}

export default useAbility
