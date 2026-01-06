import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, message, Alert } from "antd";
import { financeService } from "../../../api/services/financeService";

interface BulkDuesModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  propertyId: string;
  propertyName: string;
}

export const BulkDuesModal: React.FC<BulkDuesModalProps> = ({
  open,
  onCancel,
  onSuccess,
  propertyId,
  propertyName,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await financeService.createBulk({
        ...values,
        propertyId,
        category: "Aidat",
      });
      message.success(response.message || "Aidatlar dağıtıldı.");
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("İşlem başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Toplu Aidat Dağıtımı"
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={loading}
      okText="Dağıt"
      cancelText="İptal"
    >
      <Alert
        message={`${propertyName} sitesindeki TÜM dairelere borç eklenecektir.`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="description"
          label="Dönem Açıklaması"
          rules={[{ required: true, message: "Örn: Ocak 2024 Aidatı" }]}
        >
          <Input placeholder="Örn: Ocak 2024 Aidatı" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Daire Başına Tutar (₺)"
          rules={[{ required: true, message: "Tutar giriniz" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            formatter={(value) =>
              `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
