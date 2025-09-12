
export type TFilter = {
  [key: string]: string
}
export interface InfoBaseContextInterface<T> {
  data: T[]
  page: number
  total: number
  loading: boolean
  loadingSubmit: boolean
  setPage: (page: number) => void
  onDelete: (id: string) => void
  onSubmit: (values: any, id?: string) => void
  onSearch: (key: string, value: any) => void
}
export interface ResponseListBaseInterface <T>{
  content: T[]
  totalElement: number
  size: number
  number: number
}
export interface ParamsGenerateBillModel {
  orderCode: string,
  orderPayTime: string,
  listItems: any[],
  amount: string,
  totalAmount: string
}
