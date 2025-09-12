export type TInfoMedicine = {
  id: string
  name: string
  price: number
  categoryId: string
  medicineUnitId: string
  category: { id: string; name: string }
  unit: { id: string; unit: string }
  ingredients: string
  description: string
  locationRack: string
  createdDate: string
  updatedDate: string
  createdBy: string
  updatedBy: string
}

export type TInfoContext = {
  data: TInfoMedicine[]
  dataCategory: { label: string; value: string }[]
  dataUnit: { label: string; value: string }[]
  page: number
  total: number
  loading: boolean
  loadingSubmit: boolean
  setPage: (page: number) => void
  onDelete: (id: string) => void
  onSubmit: (values: any, id?: string) => void
  onSearch: (key: string, value: any) => void
  refetchCategory: () => void
  onScan: (file: File) => Promise<null | {
    name?: string
    price?: number
    categoryId?: string
    medicineUnitId?: string
  }>
  onExtract:(file: File) => Promise<null | {
    name?: string
    price?: number
    categoryId?: string
    medicineUnitId?: string
    ingredients?: string
    description?: string
  }>
}

export type TDataGetMedicine = {
  content: TInfoMedicine[]
  totalElement: number
  size: number
  number: number
}

export type TDataGetMedicineUnit = {
  id: string
  unit: string
}

export type TScanMedicineResponse = {
  name: string
  price: string | number
  categoryId: string
  medicineUnitId: string
}

export type TMedicineExtractResponse = {
  name: string
  price: string | number
  category: string
  unit: string
  ingredients: string
  description: string
}