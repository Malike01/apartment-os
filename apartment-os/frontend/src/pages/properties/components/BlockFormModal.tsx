import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { inventoryService } from "../../../api/services/inventoryService";

interface BlockFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  propertyId: string;
}

export const BlockFormModal: React.FC<BlockFormModalProps> = ({
  open,
  onCancel,
  onSuccess,
  propertyId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { name: string }) => {
    setLoading(true);
    try {
      await inventoryService.createBlock({ ...values, propertyId });
      message.success("Blok eklendi.");
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("Blok eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Yeni Blok Ekle"
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={loading}
      okText="Kaydet"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Blok Adı"
          rules={[
            { required: true, message: "Blok adı giriniz (Örn: A Blok)" },
          ]}
        >
          <Input placeholder="A Blok" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
