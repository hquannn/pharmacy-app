import {InfoBaseContextInterface, ResponseListBaseInterface} from "@/types/CommonTypes.ts";

export interface PurchaseInterface {
  id?: string,
  medicineId: string,
  medicine?: any,
  supplierId: string,
  supplier?: any,
  locationRackId: string,
  locationRack?: any,
  quantity: number,
  cost: number,
  mfgDate: string,
  expDate: string
  updatedDate: string
  createdDate: string
}
export type InfoPurchaseContextInterface = InfoBaseContextInterface<PurchaseInterface>
export type ResponseListPurchaseInterface = ResponseListBaseInterface<PurchaseInterface>
