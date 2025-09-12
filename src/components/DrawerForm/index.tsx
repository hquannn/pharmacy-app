import { SaveOutlined, ScanOutlined } from "@ant-design/icons"
import { Button, Drawer, Form, FormInstance, message, Upload } from "antd"
import { FC, memo, useContext, useEffect, useState } from "react"
import CustomForm, { TCustomFormProps } from "./Form"
import { MedicineContext } from "@/pages/medicine/MedicineContext"

type TDrawerFormProps = {
  open: boolean
  title: string
  width?: number
  loading?: boolean
  setOpen: () => void
  updateForm?: (form: FormInstance) => void
  showScanButton?: boolean
  //onScan?: (file: File, form: FormInstance) => void   // ✅ thêm props
} & Omit<TCustomFormProps, "form">

const DrawerForm: FC<TDrawerFormProps> = ({
  open,
  title,
  loading,
  width = 600,
  setOpen,
  updateForm,
  showScanButton = false,
  ...props
}) => {
  const [form] = Form.useForm()

  const { onScan } = useContext(MedicineContext)

  const { onExtract } = useContext(MedicineContext)

  const [patchValue, setPatchValue] = useState<any>(null)

  const onSubmit = () => {
    form.submit()
  }

  useEffect(() => {
    if (open) form.resetFields()
    setPatchValue(null)
  }, [open])

  return (
    <Drawer
      destroyOnClose
      open={open}
      title={title}
      width={width}
      keyboard={false}
      maskClosable={false}
      onClose={setOpen}
      extra={
        <>
          {/* {showScanButton && (
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={async (info) => {
                console.log("[Upload] onChange info:", info);
                console.log("[Upload] info.file:", info.file);
                console.log("[Upload] info.fileList:", info.fileList);
                
                let file = info.file as unknown as File;
                
                if (!file && info.file?.originFileObj) {
                  file = info.file.originFileObj;
                }
                
                if (!file && info.fileList?.length > 0) {
                  const lastFile = info.fileList[info.fileList.length - 1];
                  file = (lastFile?.originFileObj || lastFile) as File;
                }
                
                console.log("[Upload] final resolved file:", file);
                
                if (!file || !(file instanceof File)) {
                  console.error("[Upload] không thể resolve file");
                  message.error("Không lấy được file để scan");
                  return;
                }
                
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ chấp nhận file hình ảnh!');
                  return;
                }
                
                try {
                  console.log("[Upload] calling onScan with file:", file.name, file.size);
                  const data = await onScan(file);
                  console.log("[Upload] onScan result:", data);
                  
                  if (data) {
                    setPatchValue({
                      name: data.name ?? "",
                      price: data.price ?? "",
                      categoryId: data.categoryId ?? "",
                      medicineUnitId: data.medicineUnitId ?? "",
                    });
                    message.success("Scan thành công");
                  } else {
                    message.error("Scan thất bại");
                  }
                } catch (error) {
                  console.error("[Upload] onScan error:", error);
                  message.error("Có lỗi xảy ra khi scan");
                }
              }}
              accept="image/*" // ✅ Chỉ accept file hình ảnh
            >
              <Button type="primary" loading={loading} icon={<ScanOutlined />}>
                Scan
              </Button>
            </Upload>
          )} */}

          {showScanButton && (
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={async (info) => {
                console.log("[Upload] onChange info:", info);
                console.log("[Upload] info.file:", info.file);
                console.log("[Upload] info.fileList:", info.fileList);
                
                let file = info.file as unknown as File;
                
                if (!file && info.file?.originFileObj) {
                  file = info.file.originFileObj;
                }
                
                if (!file && info.fileList?.length > 0) {
                  const lastFile = info.fileList[info.fileList.length - 1];
                  file = (lastFile?.originFileObj || lastFile) as File;
                }
                
                console.log("[Upload] final resolved file:", file);
                
                if (!file || !(file instanceof File)) {
                  console.error("[Upload] không thể resolve file");
                  message.error("Không lấy được file để scan");
                  return;
                }
                
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ chấp nhận file hình ảnh!');
                  return;
                }
                
                try {
                  const data = await onExtract(file);
                  console.log("[Upload] onScan result:", data);
                  
                  if (data) {
                    // ✅ Map tất cả fields bao gồm ingredients và description
                    setPatchValue({
                      name: data.name ?? "",
                      price: data.price ?? "",
                      categoryId: data.categoryId ?? "",
                      medicineUnitId: data.medicineUnitId ?? "",
                      ingredients: data.ingredients ?? "",
                      description: data.description ?? "",
                    });
                    
                    // Show success message with extracted info
                    const extractedFields = [];
                    if (data.name) extractedFields.push("tên thuốc");
                    if (data.price) extractedFields.push("giá");
                    if (data.categoryId) extractedFields.push("danh mục");
                    if (data.medicineUnitId) extractedFields.push("đơn vị");
                    if (data.ingredients) extractedFields.push("thành phần");
                    if (data.description) extractedFields.push("mô tả");
                    
                    message.success(
                      `Scan thành công! Đã trích xuất: ${extractedFields.join(", ")}`
                    );
                  } else {
                    message.error("Scan thất bại - Không nhận diện được nội dung");
                  }
                } catch (error) {
                  console.error("[Upload] onScan error:", error);
                  message.error("Có lỗi xảy ra khi scan");
                }
              }}
              accept="image/*"
            >
              <Button type="primary" loading={loading} icon={<ScanOutlined />}>
                Scan
              </Button>
            </Upload>
          )}

          <Button
            type="primary"
            loading={loading}
            icon={<SaveOutlined />}
            onClick={onSubmit}
            style={{ marginLeft: 8 }}
          >
            Save
          </Button>
        </>
      }
    >
      <CustomForm form={form} {...props} patchValue={patchValue} />
    </Drawer>
  )
}

export default memo(DrawerForm)
