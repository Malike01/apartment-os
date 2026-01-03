import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { propertyService } from "../../../api/services/propertyService";
import type { CreatePropertyDto } from "@/types/property";

interface PropertyFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const handleSubmit = async (values: CreatePropertyDto) => {
    setLoading(true);
    try {
      await propertyService.create(values);
      message.success("Site başarıyla oluşturuldu");
      onSuccess();
      onCancel();
    } catch (error) {
      console.error(error);
      message.error("Site oluşturulurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Yeni Site / Apartman Ekle"
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={loading}
      okText="Oluştur"
      cancelText="İptal"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Site Adı"
          rules={[{ required: true, message: "Lütfen site adını girin" }]}
        >
          <Input placeholder="Örn: Güneş Sitesi" />
        </Form.Item>

        <Form.Item name="city" label="Şehir">
          <Input placeholder="Örn: İstanbul" />
        </Form.Item>

        <Form.Item name="address" label="Adres">
          <Input.TextArea rows={3} placeholder="Açık adres" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
