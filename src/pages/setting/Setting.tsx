import Ability from "@/components/Ability"
import useApi from "@/hooks/useApi"
import { useMutation, useQuery } from "@tanstack/react-query"
import { App, Button, Form, InputNumber } from "antd"
import { useEffect } from "react"

const Setting = () => {
  const [form] = Form.useForm()
  const { notification } = App.useApp()
  const { get, put } = useApi()
  const { data, refetch } = useQuery({
    queryKey: ["pointConfig"],
    queryFn: () => get("/customerPointConfigs"),
  })
  const {
    data: dataMutatePointConfig,
    mutate,
    isPending,
  } = useMutation({
    mutationFn: (value: any) => put("/customerPointConfigs", data.id, value),
  })

  useEffect(() => {
    if (dataMutatePointConfig) {
      notification.success({ message: "Successfully updated" })
      refetch()
    }
  }, [dataMutatePointConfig])

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ ratio: data.ratio })
    }
  }, [data])

  return (
    <Form form={form} onFinish={mutate}>
      <Form.Item
        label="Customer Point Config"
        name="ratio"
        rules={[{ required: true, message: "Point config is required" }]}
      >
        <InputNumber suffix="%" className="w-[120px]" />
      </Form.Item>
      <Ability action="update" subject="setting">
        <Button type="primary" htmlType="submit" loading={isPending}>
          Save
        </Button>
      </Ability>
    </Form>
  )
}

export default Setting
