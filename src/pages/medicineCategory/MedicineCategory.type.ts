export type TInfoMedicineCategory = {
  id: string
  name: string
  description: string
  createdDate: string
  updatedDate: string
  createdBy: string
  updatedBy: string
}

export type TInfoContext = {
  data: TInfoMedicineCategory[]
  page: number
  total: number
  loading: boolean
  loadingSubmit: boolean
  setPage: (page: number) => void
  onDelete: (id: string) => void
  onSubmit: (values: any, id?: string) => void
  onSearch: (key: string, value: any) => void
}

export type TDataGetMedicineCategory = {
  content: TInfoMedicineCategory[]
  totalElement: number
  size: number
  number: number
}
