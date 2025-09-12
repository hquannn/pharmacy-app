import ContentWrapper from "@/components/ContentWrapper"
import DrawerForm from "@/components/DrawerForm"
import Table from "@/components/Table"
import {useContext, useEffect, useState} from "react"
import {CustomerContext} from "@/pages/customer/CustomerContext.tsx";
import {CustomerInterface} from "@/pages/customer/Customer.type.ts";
import {columns, fields} from "@/pages/customer/Customer.data.tsx";

const Customer = () => {
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
    } = useContext(CustomerContext)

    const [open, setOpen] = useState(false)
    const [typeForm, setTypeForm] = useState<"add" | "edit">("add")
    const [initialValues, setInitialValues] = useState<CustomerInterface>()

    const handleOpen = (
        isOpen: boolean,
        typeForm: "add" | "edit",
        initialValues?: CustomerInterface
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
            subjectCreate="customer"
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
                        ? "Create Customer"
                        : "Edit Customer"
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

export default Customer
