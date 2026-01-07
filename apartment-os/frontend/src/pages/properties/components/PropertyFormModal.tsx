import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { propertyService } from "../../../api/services/propertyService";
import type { CreatePropertyDto, Property } from "@/types/property";

interface PropertyFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingProperty?: Property | null;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  open,
  onCancel,
  onSuccess,
  editingProperty,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (editingProperty) {
      form.setFieldsValue({
        name: editingProperty.name,
        city: editingProperty.city,
        address: editingProperty.address,
      });
    } else {
      form.resetFields();
    }
  }, [editingProperty, open, form]);

  const handleSubmit = async (values: CreatePropertyDto) => {
    setLoading(true);
    try {
      if (editingProperty) {
        await propertyService.update(editingProperty.id, values);
        message.success("Site başarıyla güncellendi");
      } else {
        await propertyService.create(values);
        message.success("Site başarıyla oluşturuldu");
      }
      onSuccess();
      onCancel();
    } catch (error) {
      console.error(error);
      message.error(
        editingProperty
          ? "Site güncellenirken bir hata oluştu"
          : "Site oluşturulurken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingProperty ? "Siteyi Düzenle" : "Yeni Site / Apartman Ekle"}
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={loading}
      okText={editingProperty ? "Güncelle" : "Oluştur"}
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
