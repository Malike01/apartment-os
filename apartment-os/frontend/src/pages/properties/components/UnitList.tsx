import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { inventoryService } from "../../../api/services/inventoryService";
import { UnitFormModal } from "./UnitFormModal";
import type { Unit } from "@/types/inventory";

interface UnitListProps {
  blockId: string;
}

export const UnitList: React.FC<UnitListProps> = ({ blockId }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getUnitsByBlock(blockId);
      setUnits(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [blockId]);

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
        dataSource={units}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
      />

      <UnitFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={fetchUnits}
        blockId={blockId}
      />
    </>
  );
};
