import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Radio, message } from "antd";
import { financeService } from "../../../api/services/financeService";
import {
  type CreateTransactionDto,
  TransactionType,
} from "../../../types/finance";
import { EXPENSE_CATEGORIES } from "../../../constants";

interface TransactionFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  propertyId: string;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  open,
  onCancel,
  onSuccess,
  propertyId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<TransactionType>(TransactionType.Expense); // Varsayılan Gider

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: CreateTransactionDto = {
        ...values,
        propertyId,
        amount: Number(values.amount),
      };

      await financeService.create(payload);
      message.success("İşlem kaydedildi.");
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("İşlem kaydedilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Yeni Finansal İşlem"
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={loading}
      okText="Kaydet"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: TransactionType.Expense }}
      >
        <Form.Item name="type" label="İşlem Tipi">
          <Radio.Group
            onChange={(e) => setType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={TransactionType.Expense}>
              Gider (Harcama)
            </Radio.Button>
            <Radio.Button value={TransactionType.Income}>
              Gelir (Tahsilat)
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Tutar (₺)"
          rules={[{ required: true, message: "Tutar giriniz" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} precision={2} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Kategori"
          rules={[{ required: true, message: "Kategori seçiniz" }]}
        >
          {type === TransactionType.Expense ? (
            <Select
              options={EXPENSE_CATEGORIES}
              placeholder="Örn: Elektrik, Su"
            />
          ) : (
            <Select
              options={[
                { label: "Aidat", value: "Dues" },
                { label: "Ek Gelir", value: "Other" },
              ]}
            />
          )}
        </Form.Item>

        <Form.Item
          name="description"
          label="Açıklama"
          rules={[{ required: true }]}
        >
          <Input placeholder="Örn: Ocak ayı asansör bakımı" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
