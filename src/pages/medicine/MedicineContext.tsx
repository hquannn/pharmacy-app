import {
  CREATE_MEDICINE,
  DELETE_MEDICINE,
  GET_MEDICINE_UNITS,
  GET_MEDICINES_PAGINATION,
  UPDATE_MEDICINE,
  SCAN_MEDICINE,
  EXTRACT_MEDICINE
} from "@/api/medicine.api"
import { GET_MEDICINE_CATEGORIES_PAGINATION } from "@/api/medicineCategory.api"
import useApi from "@/hooks/useApi"
import { TFilter } from "@/types/CommonTypes"
import { convertISODate, objectIsEmpty } from "@/utils/function"
import { useMutation, useQuery } from "@tanstack/react-query"
import { App, message } from "antd"
import { createContext, useEffect, useState } from "react"
import { TDataGetMedicineCategory } from "../medicineCategory/MedicineCategory.type"
import Medicine from "./Medicine"
import {
  TDataGetMedicine,
  TDataGetMedicineUnit,
  TInfoContext,
  TScanMedicineResponse,
  TMedicineExtractResponse,
} from "./Medicine.type"

const defaultInfo: TInfoContext = {
  data: [],
  dataCategory: [],
  dataUnit: [],
  page: 1,
  total: 0,
  loading: true,
  loadingSubmit: false,
  setPage: () => {},
  onDelete: () => {},
  onSubmit: () => {},
  onSearch: () => {},
  refetchCategory: () => {},
  onScan: async () => null,
  onExtract: async () => null,
}

export const MedicineContext = createContext<TInfoContext>(defaultInfo)

const MedicineProvider = () => {
  const { notification } = App.useApp()

  const [typeMutate, setTypeMutate] = useState<
    "created" | "updated" | "deleted"
  >("created")
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<TFilter>({})
  const [info, setInfo] = useState<TInfoContext>({ ...defaultInfo, setPage })
  const { get, post, put, del, postFormData } = useApi()
  const { data, isPending, refetch } = useQuery<TDataGetMedicine>({
    queryKey: ["getMedicines", page, filter],
    queryFn: () => {
      const params: any = {
        page: page - 1,
        size: 20,
      }
      if (!objectIsEmpty(filter))
        Object.keys(filter).forEach((key) => (params[key] = filter[key]))
      return get(GET_MEDICINES_PAGINATION, params)
    },
  })
  const { data: dataCategory, isPending: isPendingCategory, refetch: refetchCategory } =
    useQuery<TDataGetMedicineCategory>({
      queryKey: ["getMedicineCategoriesForMedicine"],
      queryFn: () => {
        return get(GET_MEDICINE_CATEGORIES_PAGINATION, { page: 0, size: 1000 })
      },
    })
  const { data: dataUnit, isPending: isPendingUnit } = useQuery<
    TDataGetMedicineUnit[]
  >({
    queryKey: ["getMedicineUnit"],
    queryFn: () => {
      return get(GET_MEDICINE_UNITS)
    },
  })

  const { data: dataMutate, mutate } = useMutation({
    mutationFn: (values: any) => {
      if (values.id) return put(UPDATE_MEDICINE, values.id, values)
      if (typeof values === "string") return del(DELETE_MEDICINE, values)
      return post(CREATE_MEDICINE, values)
    },
  })

  const onSearch = (key: string, value: any) => {
    if (page !== 1 || !value) setPage(1)
    if (value) setFilter({ [key]: value })
    else setFilter({})
  }


  const onScan = async (file: File) => {
    try {
      console.log("[onScan] sending file to backend", file.name, file.size);
      const fd = new FormData();
      fd.append("file", file);
      
      console.log("[onScan] FormData entries:");
      for (let [key, value] of fd.entries()) {
        console.log(key, value);
      }

      const resp = await postFormData(SCAN_MEDICINE, fd);
      console.log("[onScan] full backend response:", resp);

      if (!resp) {
        console.warn("[onScan] no response");
        return null;
      }

      const data: TScanMedicineResponse = resp.data;
      if (!data) {
        console.warn("[onScan] no data in response");
        return null;
      }

      return {
        name: data.name,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        categoryId: data.categoryId,
        medicineUnitId: data.medicineUnitId,
      };
    } catch (err) {
      console.error("[onScan] error:", err);
      return null;
    }
  }


  const onExtract = async (file: File) => {
    try {
      console.log("[onScan] Processing file:", file.name, file.size);
      
      const fd = new FormData();
      fd.append("file", file);
      
      const resp = await postFormData(EXTRACT_MEDICINE, fd);
      console.log("[onScan] Full response:", resp);

      if (!resp) {
        console.warn("[onScan] No response");
        return null;
      }

      // Handle ApiResponse<MedicineExtractResponse> structure
      const extractData: TMedicineExtractResponse = resp.data;
      if (!extractData) {
        console.warn("[onScan] No data in ApiResponse");
        if (resp.message) {
          message.error(`Backend error: ${resp.message}`);
        }
        return null;
      }

      console.log("[onScan] Extract data from backend:", extractData);

      // ✅ Map category name to categoryId
      const findCategoryId = (categoryName: string) => {
        if (!categoryName) return "";
        const found = info.dataCategory.find(cat => 
          cat.label.toLowerCase().includes(categoryName.toLowerCase()) ||
          categoryName.toLowerCase().includes(cat.label.toLowerCase())
        );
        return found?.value || "";
      };

      // ✅ Map unit name to medicineUnitId  
      const findUnitId = (unitName: string) => {
        if (!unitName) return "";
        const found = info.dataUnit.find(unit => 
          unit.label.toLowerCase().includes(unitName.toLowerCase()) ||
          unitName.toLowerCase().includes(unit.label.toLowerCase())
        );
        return found?.value || "";
      };

      const result = {
        name: extractData.name || "",
        price: extractData.price ? parseFloat(extractData.price.toString()) : undefined,
        categoryId: findCategoryId(extractData.category),
        medicineUnitId: findUnitId(extractData.unit),
        ingredients: extractData.ingredients || "",
        description: extractData.description || "",
      };
      
      console.log("[onScan] Mapped result:", result);
      
      // Log mapping results for debugging
      if (extractData.category && !result.categoryId) {
        console.warn(`[onScan] Could not map category: "${extractData.category}"`);
      }
      if (extractData.unit && !result.medicineUnitId) {
        console.warn(`[onScan] Could not map unit: "${extractData.unit}"`);
      }
      
      return result;
      
    } catch (err) {
      console.error("[onScan] Error:", err);
      message.error("Lỗi khi gọi API scan");
      return null;
    }
  }


  const onSubmit = (values: any, id?: string) => {
    setTypeMutate(id ? "updated" : "created")
    setInfo((prev) => ({ ...prev, loadingSubmit: true }))
    if (id) values.id = id
    mutate(values)
  }

  const onDelete = (id: string) => {
    setTypeMutate("deleted")
    setInfo((prev) => ({ ...prev, loading: true }))
    mutate(id)
  }

  useEffect(() => {
    setInfo((prev) => ({ ...prev, loadingSubmit: false }))
    if (dataMutate) {
      notification.success({
        message: "Success",
        description: `Data has been ${typeMutate} successfully`,
      })
      if (page === 1 && objectIsEmpty(filter)) refetch()
      else {
        setPage(1)
        setFilter({})
      }
    }
  }, [dataMutate])

  useEffect(() => {
    if (isPending || isPendingCategory || isPendingUnit)
      setInfo((prev) => ({ ...prev, loading: true }))
    else setInfo((prev) => ({ ...prev, loading: false }))
  }, [isPending, isPendingCategory, isPendingUnit])

  useEffect(() => {
    if (data) {
      const newData = data.content.map((item) => {
        if (item.updatedDate)
          item.updatedDate = convertISODate(item.updatedDate)
        return {
          ...item,
          unit: item.unit,
          medicineUnitId: item.unit.id,
          category: item.category,
          categoryId: item.category.id,
          createdDate: convertISODate(item.createdDate),
        }
      })
      setInfo((prev) => ({
        ...prev,
        data: newData,
        total: data.totalElement,
      }))
    }
  }, [data])

  useEffect(() => {
    if (dataCategory) {
      const newDataCategory = dataCategory.content.map((item) => ({
        label: item.name,
        value: item.id,
      }))
      setInfo((prev) => ({
        ...prev,
        dataCategory: newDataCategory,
      }))
    }
  }, [dataCategory])

  useEffect(() => {
    if (dataUnit) {
      const newDataUnit = dataUnit.map((item) => ({
        label: item.unit,
        value: item.id,
      }))
      setInfo((prev) => ({
        ...prev,
        dataUnit: newDataUnit,
      }))
    }
  }, [dataUnit])

  return (
    <MedicineContext.Provider
      value={{ ...info, page, setPage, onDelete, onSubmit, onSearch, onScan, refetchCategory, onExtract }}
    >
      <Medicine />
    </MedicineContext.Provider>
  )
}

export default MedicineProvider
