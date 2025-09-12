import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import {useContext, useEffect, useState} from "react"
import {PurchaseContext} from "./PurchaseContext.tsx"
import {PurchaseInterface} from "@/pages/purchase/Purchase.type.ts";
import {columns, fields} from "@/pages/purchase/Purchase.data.tsx";
import useApi from "@/hooks/useApi.tsx";
import {CREATE_MEDICINE, GET_MEDICINE_UNITS, GET_MEDICINES_PAGINATION} from "@/api/medicine.api.ts";
import {CREATE_SUPPLIER, GET_SUPPLIER} from "@/api/supplier.api.ts";
import {CREATE_LOCATION_RACK, GET_LOCATION_RACK} from "@/api/locationRack.api.ts";
import { fields as fieldsCate } from "../medicineCategory/MedicineCategory.data"
import { fields as fieldsMed } from "../medicine/Medicine.data"
import { fields as fieldsSuplier } from "../supplier/Supplier.data.tsx"
import { fields as fieldsLocationRack } from "../locationRack/LocationRack.data.tsx"
import ModalAdd from "@/components/ModalAdd";
import {useQuery} from "@tanstack/react-query";
import {TDataGetMedicineCategory} from "@/pages/medicineCategory/MedicineCategory.type.ts";
import {CREATE_MEDICINE_CATEGORY, GET_MEDICINE_CATEGORIES_PAGINATION} from "@/api/medicineCategory.api.ts";
import {TDataGetMedicineUnit} from "@/pages/medicine/Medicine.type.ts";
import {useAtom} from "jotai/index";
import {atomSelector} from "@/states/selector.ts";

const Purchase = () => {
  const {
    data,
    loading,
    loadingSubmit,
    total,
    page,
    setPage,
    onDelete,
    onSubmit,
    onSearch,
  } = useContext(PurchaseContext)

  const [_selectorState, setSelectorState] = useAtom(atomSelector)
  const { data: dataCategory, refetch: refetchCategory } = useQuery<TDataGetMedicineCategory[]>({
        queryKey: ["getMedicineCategoriesForPurchase"],
        queryFn: () => {
          return get(GET_MEDICINE_CATEGORIES_PAGINATION, { page: 0, size: 1000 }).then(
              resp => {
                return resp.content.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))
              }
          )
        },
      })
  const { data: dataUnit } = useQuery<
      TDataGetMedicineUnit[]
  >({
    queryKey: ["getMedicineUnit"],
    queryFn: () => {
      return get(GET_MEDICINE_UNITS).then(resp => resp?.map((item: any) => ({
        label: item.unit,
        value: item.id,
      })))
    },
  })

  const [units, setUnits] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [openAddCategory, setOpenAddCategory] = useState(false)
  const [submittingAddCategory, setSubmittingAddCategory] = useState(false)

  const [meds, setMeds] = useState<any>([])
  const [openAddMed, setOpenAddMed] = useState(false)
  const [submittingAddMed, setSubmittingAddMed] = useState(false)


  const [suppliers, setSuppliers] = useState<any>([])
  const [openAddSupplier, setOpenAddSupplier] = useState(false)
  const [submittingAddSupplier, setSubmittingAddSupplier] = useState(false)
  const [locationRacks, setLocationRacks] = useState<any>([])
  const [openAddRack, setOpenAddRack] = useState(false)
  const [submittingAddRack, setSubmittingAddRack] = useState(false)
  const [open, setOpen] = useState(false)
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
  const [initialValues, setInitialValues] = useState<PurchaseInterface>()
  const [updateValues, setUpdateValues] = useState<Partial<PurchaseInterface>>()
  const [updateFormMed, setUpdateFormMed] = useState<any>()
  const {get, post} = useApi()

  async function getMedList(keyword: string = '') {
    const params: any = {
      page: 0,
      size: 50,
      keyword: keyword || undefined,
    }
    const {content: listMeds} = await get(GET_MEDICINES_PAGINATION, params)
    const _meds = listMeds.map((x: any) => ({
      ...x,
      label: x.name,
      value: x.id,
    }))
    setMeds(_meds)
    setSelectorState((prev: any) => {
      return {
        ...prev,
        meds: _meds,
      }
    })
  }
  async function getSuplierList(keyword: string = '') {
    const params: any = {
      page: 0,
      size: 50,
      keyword: keyword || undefined,
    }
    const {content: listSup} = await get(GET_SUPPLIER, params)
    const _sups = listSup.map((x: any) => ({
      ...x,
      label: x.name,
      value: x.id,
    }))
    setSuppliers(_sups)
    setSelectorState((prev: any) => {
      return {
        ...prev,
        suppliers: _sups,
      }
    })
  }
  async function getLocationRack(keyword: string = '') {
    const params: any = {
      page: 0,
      size: 50,
      keyword: keyword || undefined,
    }
    const {content: listRacks} = await get(GET_LOCATION_RACK, params)
    const locationRacks = listRacks.map((x: any) => ({
      ...x,
      label: x.position,
      value: x.id,
    }))
    setLocationRacks(locationRacks)
    setSelectorState((prev: any) => {
      return {
        ...prev,
        locationRacks: locationRacks,
      }
    })
  }

  useEffect(() => {
    if (dataCategory) {
      setCategories(dataCategory)
      setSelectorState((prev: any) => {
        return {
          ...prev,
          categories: dataCategory,
        }
      })
    }
  }, [dataCategory])
  useEffect(() => {
    if (dataUnit) {
      setUnits(dataUnit)
    }
  }, [dataUnit])


  const handleOpen = async (
    isOpen: boolean,
    typeForm: "add" | "edit",
    initialValues?: PurchaseInterface
  ) => {
    if (isOpen) {
      await Promise.all([
        getMedList(),
        getSuplierList(),
        getLocationRack(),
      ])
    }
    setOpen(isOpen)
    setTypeForm(typeForm)
    setInitialValues(initialValues ? {
      ...initialValues,
      medicineId: initialValues?.medicine?.id || '',
      supplierId: initialValues?.supplier?.id || '',
      locationRack: initialValues?.locationRack?.id || ''
    } : initialValues)
  }

  const submitCategory = async (values: any) => {
    setSubmittingAddCategory(true)
    const cate = await post(CREATE_MEDICINE_CATEGORY, values)
    setSubmittingAddCategory(false)
    await refetchCategory()
    setOpenAddCategory(false)
    setUpdateFormMed({
      ...(updateFormMed || {}),
      categoryId: cate?.id || ''
    })
  }

  const submitMed = async (values: any) => {
    setSubmittingAddMed(true)
    const med = await post(CREATE_MEDICINE, values)
    setSubmittingAddMed(false)
    await getMedList()
    setOpenAddMed(false)
    setUpdateValues({
      ...(updateValues || {}),
      medicineId: med?.id || ''
    })
  }

  const submitSupplier = async (values: any) => {
    setSubmittingAddSupplier(true)
    const s = await post(CREATE_SUPPLIER, values)
    setSubmittingAddSupplier(false)
    await getSuplierList()
    setOpenAddSupplier(false)
    setUpdateValues({
      ...(updateValues || {}),
      supplierId: s?.id || ''
    })
  }

  const submitRack = async (values: any) => {
    setSubmittingAddRack(true)
    const r = await post(CREATE_LOCATION_RACK, values)
    setSubmittingAddRack(false)
    await getLocationRack()
    setOpenAddRack(false)
    setUpdateValues({
      ...(updateValues || {}),
      locationRackId: r?.id || ''
    })
  }

  useEffect(() => {
    if (open) handleOpen(false, "add")
  }, [data])

  return (
    <ContentWrapper
      subjectCreate="stockPurchase"
      onAdd={() => handleOpen(true, "add")}
      onSearch={(keyword) => onSearch("medicineName", keyword)}
    >
      <Table
        page={page}
        total={total}
        loading={loading}
        dataSource={data}
        columns={columns(
          (initialValues) => handleOpen(true, "edit", initialValues),
          onDelete
        )}
        setPage={setPage}
      />
      <DrawerForm
        title={
          typeForm === "add"
            ? "Create purchase"
            : "Edit purchase"
        }
        open={open}
        fields={fields(meds, suppliers, locationRacks, setOpenAddMed, setOpenAddSupplier, setOpenAddRack)}
        loading={loadingSubmit}
        patchValue={updateValues}
        initialValues={initialValues}
        setOpen={() => handleOpen(false, "add")}
        onSubmit={(values) => onSubmit(values, initialValues?.id)}
      />
      <ModalAdd
          width={500}
          loading={submittingAddCategory}
          title={"Create Category"}
          open={openAddCategory}
          fields={fieldsCate()}
          setOpen={(v) => setOpenAddCategory(v)}
          onSubmit={(values) => submitCategory(values)}
      />
      <ModalAdd
          width={500}
          loading={submittingAddMed}
          title={"Create Medicine"}
          open={openAddMed}
          patchValue={updateFormMed}
          fields={fieldsMed(categories || [], units || [], setOpenAddCategory)}
          setOpen={(v) => setOpenAddMed(v)}
          onSubmit={(values) => submitMed(values)}
      />
      <ModalAdd
          width={500}
          loading={submittingAddSupplier}
          title={"Create Supplier"}
          open={openAddSupplier}
          fields={fieldsSuplier}
          setOpen={(v) => setOpenAddSupplier(v)}
          onSubmit={(values) => submitSupplier(values)}
      />
      <ModalAdd
          width={500}
          loading={submittingAddRack}
          title={"Create Location Rack"}
          open={openAddRack}
          fields={fieldsLocationRack}
          setOpen={(v) => setOpenAddRack(v)}
          onSubmit={(values) => submitRack(values)}
      />
    </ContentWrapper>
  )
}

export default Purchase
