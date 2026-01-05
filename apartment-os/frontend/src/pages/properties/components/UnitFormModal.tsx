import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { inventoryService } from "../../../api/services/inventoryService";
import { UNIT_TYPES } from "../../../constants";

interface UnitFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  blockId: string | null;
}

export const UnitFormModal: React.FC<UnitFormModalProps> = ({
  open,
  onCancel,
  onSuccess,
  blockId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!blockId) return;

    setLoading(true);
    try {
      await inventoryService.createUnit({ ...values, blockId });
      message.success("Daire oluşturuldu.");
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("Daire oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Yeni Daire Ekle"
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={loading}
      okText="Ekle"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            name="doorNumber"
            label="Kapı No"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Gerekli" }]}
          >
            <Input placeholder="Örn: 5" />
          </Form.Item>

          <Form.Item
            name="floor"
            label="Kat"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Gerekli" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Örn: 1" />
          </Form.Item>
        </div>

        <Form.Item name="type" label="Daire Tipi">
          <Select options={UNIT_TYPES} placeholder="Seçiniz (Opsiyonel)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
