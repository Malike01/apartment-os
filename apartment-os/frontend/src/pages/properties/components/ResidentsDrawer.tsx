import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Typography,
  Divider,
  message,
  Popconfirm,
  Tag,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { residentService } from "../../../api/services/residentService";
import { RESIDENT_TYPE_OPTIONS } from "../../../constants";
import { ResidentType, type Resident } from "@/types/resident";

const { Text } = Typography;

interface ResidentsDrawerProps {
  open: boolean;
  onClose: () => void;
  unitId: string | null;
  unitLabel: string;
}

export const ResidentsDrawer: React.FC<ResidentsDrawerProps> = ({
  open,
  onClose,
  unitId,
  unitLabel,
}) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchResidents = async () => {
    if (!unitId) return;
    setLoading(true);
    try {
      const data = await residentService.getByUnit(unitId);
      setResidents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && unitId) {
      fetchResidents();
    } else {
      setResidents([]);
      form.resetFields();
    }
  }, [open, unitId]);

  const handleAddResident = async (values: any) => {
    if (!unitId) return;
    setLoading(true);
    try {
      await residentService.create({ ...values, unitId });
      message.success("Sakin eklendi");
      form.resetFields();
      fetchResidents();
    } catch (error) {
      message.error("Sakin eklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await residentService.delete(id);
      message.success("Sakin silindi");
      fetchResidents();
    } catch (error) {
      message.error("Silme işlemi başarısız");
    }
  };

  return (
    <Drawer
      title={`Sakinler - ${unitLabel}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={residents}
        locale={{ emptyText: "Bu dairede kayıtlı sakin yok." }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Silinsin mi?"
                onConfirm={() => handleDelete(item.id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor:
                      item.type === ResidentType.Owner ? "#87d068" : "#108ee9",
                  }}
                  icon={<UserOutlined />}
                />
              }
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{item.fullName}</span>
                  <Tag
                    color={item.type === ResidentType.Owner ? "green" : "blue"}
                  >
                    {item.type === ResidentType.Owner ? "Ev Sahibi" : "Kiracı"}
                  </Tag>
                </div>
              }
              description={
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <PhoneOutlined /> <Text type="secondary">{item.phone}</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Divider>Yeni Sakin Ekle</Divider>

      <Form form={form} layout="vertical" onFinish={handleAddResident}>
        <Form.Item
          name="type"
          initialValue={ResidentType.Tenant}
          rules={[{ required: true, message: "Seçiniz" }]}
        >
          <Select options={RESIDENT_TYPE_OPTIONS} />
        </Form.Item>

        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Ad Soyad giriniz" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Ad Soyad" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[{ required: true, message: "Telefon giriniz" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Telefon (555...)" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          icon={<PlusOutlined />}
          loading={loading}
        >
          Kaydet
        </Button>
      </Form>
    </Drawer>
  );
};
