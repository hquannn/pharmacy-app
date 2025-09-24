import { Subject } from "@/hooks/useAbility"
import {
  CalendarOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  HddOutlined,
  InboxOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { ReactElement } from "react"

import Dashboard from "@/pages/dashboard/Dashboard"
import Supplier from "@/pages/supplier/Supplier"
import Medicine from "@/pages/medicine/MedicineContext"
import MedicineCategory from "@/pages/medicineCategory/MedicineCategoryContext"
import Employees from "@/pages/employee/EmployeesContext"
import LocationRack from "@/pages/locationRack/LocationRack"
import PharmacyPOS from "@/pages/pos/PharmacyPOS"
import Customer from "@/pages/customer/CustomerContext"
import Setting from "@/pages/setting/Setting"
import Purchase from "@/pages/purchase/PurchaseContext"
import Report from "@/pages/report/Report"
import Store from "@/pages/store/Store"
import Cart from "@/pages/cart/Cart"
import DM from "@/pages/dm/DM"


type TRouteData = {
  key: string
  subject?: Subject
  index?: boolean
  icon?: ReactElement
  label: string
  path?: string
  element: ReactElement
}

export const RouterData: TRouteData[] = [
  {
    key: "/",
    index: true,
    label: "Dashboard",
    icon: <DashboardOutlined />,
    element: <Dashboard />,
    subject: "report",
  },
  {
    key: "/store",
    path: "/store",
    label: "Store",
    subject: "store",
    icon: <UnorderedListOutlined />,
    element: <Store />,
  },

  {
    key: "/supplier",
    path: "/supplier",
    label: "Supplier",
    subject: "supplier",
    icon: <InboxOutlined />,
    element: <Supplier />,
  },
  {
    key: "/medicine",
    path: "/medicine",
    label: "Medicine",
    subject: "medicine",
    icon: <MedicineBoxOutlined />,
    element: <Medicine />,
  },
  {
    key: "/medicine-category",
    path: "/medicine-category",
    label: "Medicine Category",
    subject: "medicineCategory",
    icon: <MedicineBoxOutlined />,
    element: <MedicineCategory />,
  },
  {
    key:"/cart",
    path: "/cart",
    label: "Cart",
    subject: "cart",
    icon: <ShoppingCartOutlined />,
    element: <Cart />,
  },
  {
    key: "/pharmacy-pos",
    path: "/pharmacy-pos",
    label: "POS",
    subject: "pharmacy-pos",
    icon: <ShoppingCartOutlined />,
    element: <PharmacyPOS />,
  },
  {
    key: "/stock-purchase",
    path: "/stock-purchase",
    label: "Purchase",
    subject: "stockPurchase",
    icon: <FileDoneOutlined />,
    element: <Purchase />,
  },
  {
    key: "/customer",
    path: "/customer",
    label: "Customer",
    subject: "customer",
    icon: <UsergroupAddOutlined />,
    element: <Customer />,
  },
  {
    key: "/locationRack",
    path: "/locationRack",
    label: "Location Rack",
    subject: "locationRack",
    icon: <HddOutlined />,
    element: <LocationRack />,
  },
  {
    key: "/employee",
    path: "/employee",
    label: "Employee",
    subject: "employee",
    icon: <UserOutlined />,
    element: <Employees />,
  },
  {
    key: "/report",
    path: "/report",
    label: "Report",
    icon: <CalendarOutlined />,
    element: <Report />,
    subject: "report",
  },
  {
    key: "/message",
    path: "/message",
    label: "Message",
    icon: <MessageOutlined />,
    element: <DM />,
    subject: "message",
  },
  {
    key: "/setting",
    path: "/setting",
    label: "Setting",
    subject: "setting",
    icon: <SettingOutlined />,
    element: <Setting />,
  },
]
