
import useApi from "@/hooks/useApi"
import { TFilter } from "@/types/CommonTypes"
import { convertISODate, objectIsEmpty } from "@/utils/function"
import { useMutation, useQuery } from "@tanstack/react-query"
import { App } from "antd"
import { createContext, useEffect, useState } from "react"
import {InfoEmployeeContextInterface, ResponseListEmployeeInterface} from "@/pages/employee/Employees.type.ts";
import Employee from "@/pages/employee/Employees.tsx";

const defaultInfo: InfoEmployeeContextInterface = {
    data: [],
    total: 0,
    loading: true,
    loadingSubmit: false,
    page: 1,
    setPage: () => {},
    onDelete: () => {},
    onSubmit: () => {},
    onSearch: () => {},
}

export const EmployeesContext = createContext<InfoEmployeeContextInterface>(defaultInfo)

const EmployeesProvider = () => {
    const { notification } = App.useApp()

    const [typeMutate, setTypeMutate] = useState<
        "created" | "updated" | "deleted"
    >("created")
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState<TFilter>({})
    const [info, setInfo] = useState<InfoEmployeeContextInterface>(defaultInfo)

    const { get, post, put, del } = useApi()
    const { data, isPending, refetch } = useQuery<ResponseListEmployeeInterface>({
        queryKey: ["getEmployees", page, filter],
        queryFn: () => {
            const params: any = {
                page: page - 1,
                size: 20,
            }
            if (!objectIsEmpty(filter))
                Object.keys(filter).forEach((key) => (params[key] = filter[key]))
            return get('/employees', params)
        },
    })
    const { data: dataMutate, mutate } = useMutation({
        mutationFn: (values: any) => {
            if (values.id) return put('/employees', values.id, values)
            if (typeof values === "string")
                return del('/employees', values)
            return post('/employees', values)
        },
    })

    const onSearch = (key: string, value: any) => {
        if (page !== 1 || !value) setPage(1)
        if (value) setFilter({ [key]: value })
        else setFilter({})
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
        if (isPending) setInfo((prev) => ({ ...prev, loading: true }))
        else if (data) {
            const newData = data.content.map((item) => {
                if (item.updatedDate)
                    item.updatedDate = convertISODate(item.updatedDate)
                return {
                    ...item,
                    createdDate: convertISODate(item.createdDate),
                }
            })
            setInfo((prev) => ({
                ...prev,
                data: newData,
                total: data.totalElement,
                loading: false,
            }))
        }
    }, [data, isPending])

    return (
        <EmployeesContext.Provider
            value={{ ...info, page, setPage, onDelete, onSubmit, onSearch }}
        >
            <Employee />
        </EmployeesContext.Provider>
    )
}

export default EmployeesProvider
