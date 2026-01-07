import React, { useState } from "react";
import {
  Table,
  Card,
  Input,
  Tag,
  Avatar,
  Typography,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PhoneOutlined,
  HomeOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useFetch } from "../../hooks/useFetch";
import { residentService } from "../../api/services/residentService";
import { ResidentType } from "../../types/resident";

const { Title } = Typography;

const ResidentsPage: React.FC = () => {
  const { data: residents, loading } = useFetch(residentService.getAll, []);
  const [searchText, setSearchText] = useState("");

  const filteredData = residents?.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      r.phone.includes(searchText) ||
      r.unit?.block?.property?.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Sakin",
      key: "fullName",
      render: (_: any, record: any) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            src={null}
            style={{
              backgroundColor: record.type === "OWNER" ? "#87d068" : "#1890ff",
            }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{record.fullName}</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.email || "-"}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Durum",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === ResidentType.Owner ? "green" : "blue"}>
          {type === ResidentType.Owner ? "Ev Sahibi" : "Kiracı"}
        </Tag>
      ),
    },
    {
      title: "Konum",
      key: "location",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            <HomeOutlined /> {record.unit?.block?.property?.name}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.unit?.block?.name} - Daire: {record.unit?.doorNumber}
          </Text>
        </Space>
      ),
    },
    {
      title: "İletişim",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span>
          <PhoneOutlined /> {phone}
        </span>
      ),
    },
    {
      title: "Bakiye",
      key: "balance",
      render: () => <Text type="secondary">0.00 ₺</Text>,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Sakinler Rehberi
        </Title>
        <Button icon={<ExportOutlined />}>Excel İndir</Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, maxWidth: 400 }}>
          <Input
            placeholder="İsim, Telefon veya Site ara..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

const { Text } = Typography;

export default ResidentsPage;
