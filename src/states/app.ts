import { atom } from "jotai"

export const atomApp = atom<{headerText: string, customerSelected: any, noteRefund: string, typeOrder: string, usePoint: boolean}>({
  headerText: "Dashboard",
  customerSelected: null,
  noteRefund: "",
  typeOrder: "order",
  usePoint: false
})
