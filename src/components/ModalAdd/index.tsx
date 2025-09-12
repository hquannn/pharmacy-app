
import {Form, Modal} from "antd"
import {FC, memo, useEffect} from "react"
import CustomForm, { TCustomFormProps } from "../DrawerForm/Form"

type TModalAddProps = {
    open: boolean
    title: string
    width?: number
    loading?: boolean
    updateValues?: any
    setOpen: (v: boolean) => void
} & Omit<TCustomFormProps, "form">

const ModalAdd: FC<TModalAddProps> = ({
                                              open,
                                              title,
                                              loading,
                                              width = 600,
                                              setOpen,
                                              ...props
                                          }) => {
    const [form] = Form.useForm()

    const onSubmit = () => {
        form.submit()
    }

    useEffect(() => {
        if (open) form.resetFields()
    }, [open])

    return (
        <Modal
            closeIcon={false}
            destroyOnClose
            open={open}
            title={title}
            width={width}
            keyboard={true}
            maskClosable={true}
            onClose={() => setOpen(false)}
            okText={'Save'}
            confirmLoading={loading}
            loading={loading}
            onCancel={() => setOpen(false)}
            onOk={onSubmit}

        >
            <CustomForm form={form} {...props} />
        </Modal>
    )
}

export default memo(ModalAdd)
