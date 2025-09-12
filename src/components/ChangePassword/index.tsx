import useApi from "@/hooks/useApi"
import { useMutation } from "@tanstack/react-query"
import { App, Form, Input, Modal } from "antd"
import { FC, memo, useEffect } from "react"

type TChangePasswordProps = {
  open: boolean
  onClose: () => void
}

const ChangePassword: FC<TChangePasswordProps> = ({ open, onClose }) => {
  const { notification } = App.useApp()
  const [form] = Form.useForm()
  const { post } = useApi()
  const { data, mutate, isPending } = useMutation({
    mutationFn: (values: any) => post("employees/changePassword", values),
  })

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  useEffect(() => {
    if (data) {
      notification.success({ message: "Password is changed successful!" })
      handleClose()
    }
  }, [data])

  return (
    <Modal
      title="Change Password"
      open={open}
      okText="Save"
      okButtonProps={{ loading: isPending }}
      onCancel={handleClose}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={mutate}>
        <Form.Item
          hasFeedback
          label="Old Password"
          name="oldPassword"
          rules={[
            {
              required: true,
              message: "Old password is required",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="New Password"
          name="newPassword"
          dependencies={["oldPassword"]}
          rules={[
            {
              required: true,
              message: "New password is required",
            },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue("oldPassword") === value)
                  return Promise.reject(
                    new Error(
                      "The new password cannot be the same as the old password!"
                    )
                  )
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Confirm New Password"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Confirm new password is required",
            },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue("newPassword") === value)
                  return Promise.resolve()
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                )
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default memo(ChangePassword)
