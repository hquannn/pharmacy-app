import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import { useContext, useEffect, useState } from "react"
import { columns, fields } from "./MedicineCategory.data"
import { TInfoMedicineCategory } from "./MedicineCategory.type"
import { MedicineCategoryContext } from "./MedicineCategoryContext"

const MedicineCategory = () => {
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
  } = useContext(MedicineCategoryContext)

  const [open, setOpen] = useState(false)
  const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
  const [initialValues, setInitialValues] = useState<TInfoMedicineCategory>()

  const handleOpen = (
    isOpen: boolean,
    typeForm: "add" | "edit",
    initialValues?: TInfoMedicineCategory
  ) => {
    setOpen(isOpen)
    setTypeForm(typeForm)
    setInitialValues(initialValues)
  }

  useEffect(() => {
    if (open) handleOpen(false, "add")
  }, [data])

  return (
    <ContentWrapper
      subjectCreate="medicineCategory"
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
        title={
          typeForm === "add"
            ? "Create Medicine Category"
            : "Edit Medicine Category"
        }
        open={open}
        fields={fields()}
        loading={loadingSubmit}
        initialValues={initialValues}
        setOpen={() => handleOpen(false, "add")}
        onSubmit={(values) => onSubmit(values, initialValues?.id)}
      />
    </ContentWrapper>
  )
}

export default MedicineCategory
