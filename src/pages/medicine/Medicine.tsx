import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import { Select } from "antd"
import { memo, useContext, useEffect, useState } from "react"
import { columns, fields } from "./Medicine.data"
import { TInfoMedicine } from "./Medicine.type"
import { MedicineContext } from "./MedicineContext"
import useApi from "@/hooks/useApi"
import {CREATE_MEDICINE_CATEGORY} from "@/api/medicineCategory.api"
import {fields as fieldsCate} from "@/pages/medicineCategory/MedicineCategory.data";
import ModalAdd from "@/components/ModalAdd";
import {useAtom} from "jotai/index";
import {atomSelector} from "@/states/selector.ts";
// import { UploadOutlined, CameraOutlined } from "@ant-design/icons"

const Medicine = () => {
  const {
    data,
    dataCategory,
    dataUnit,
    loading,
    loadingSubmit,
    total,
    page,
    setPage,
    onDelete,
    onSubmit,
    onSearch,
    // onScan,
    refetchCategory
  } = useContext(MedicineContext)
  const [_selectorState, setSelectorState] = useAtom(atomSelector)
  const [categories, setCategories] = useState<any>([])
  const [openAddCategory, setOpenAddCategory] = useState(false)
  const [submittingAddCategory, setSubmittingAddCategory] = useState(false)
  const [updateFormMed, setUpdateFormMed] = useState<any>()

  const [open, setOpen] = useState(false)
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
  const [initialValues, setInitialValues] = useState<TInfoMedicine>()

  // const [openScan, setOpenScan] = useState(false)
  // const [loadingScan, setLoadingScan] = useState(false)

  const { post } = useApi()

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

  const handleOpen = (
    isOpen: boolean,
    typeForm: "add" | "edit",
    initialValues?: TInfoMedicine
  ) => {
    setUpdateFormMed({})
    setOpen(isOpen)
    setTypeForm(typeForm)
    setInitialValues(initialValues)
  }

  useEffect(() => {
    if (open) handleOpen(false, "add")
  }, [data])

  return (
    <ContentWrapper
      subjectCreate="medicine"
      filterElement={
        <>
          <Select
            allowClear
            showSearch
            size="large"
            placeholder="Category"
            options={dataCategory}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onSearch("categoryId", value)}
            className="w-[200px]"
          />
        </>
      }
      onAdd={() => handleOpen(true, "add")}
      onSearch={(keyword) => onSearch("name", keyword)}
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
        width={500}
        title={typeForm === "add" ? "Create Medicine" : "Edit Medicine"}
        open={open}
        fields={fields(categories, dataUnit, setOpenAddCategory)}
        loading={loadingSubmit}
        patchValue={updateFormMed}
        initialValues={initialValues}
        setOpen={() => handleOpen(false, "add")}
        onSubmit={(values) => onSubmit(values, initialValues?.id)}
        showScanButton={true}
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
    </ContentWrapper>
  )
}

export default memo(Medicine)
