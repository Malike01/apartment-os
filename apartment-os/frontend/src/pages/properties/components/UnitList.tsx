import React, { useState } from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { inventoryService } from "../../../api/services/inventoryService";
import { UnitFormModal } from "./UnitFormModal";
import { useFetch } from "@/hooks/useFetch";

interface UnitListProps {
  blockId: string;
}

export const UnitList: React.FC<UnitListProps> = ({ blockId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: units,
    loading,
    refetch,
  } = useFetch(() => inventoryService.getUnitsByBlock(blockId), [blockId]);

  const columns = [
    {
      title: "Kapı No",
      dataIndex: "doorNumber",
      key: "doorNumber",
      width: 100,
    },
    { title: "Kat", dataIndex: "floor", key: "floor", width: 80 },
    {
      title: "Tip",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (type ? <Tag color="blue">{type}</Tag> : "-"),
    },
    {
      title: "Sakin Durumu",
      key: "resident",
      render: () => <Tag>Boş</Tag>,
    },
    {
      title: "İşlemler",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Popconfirm
            title="Silmek istediğine emin misin?"
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Daire Ekle
        </Button>
      </div>

      <Table
        dataSource={units || []}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
      />

      <UnitFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={refetch}
        blockId={blockId}
      />
    </>
  );
};
