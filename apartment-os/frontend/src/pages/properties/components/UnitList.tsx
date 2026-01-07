import React, { useState } from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { inventoryService } from "../../../api/services/inventoryService";
import { UnitFormModal } from "./UnitFormModal";
import { useFetch } from "@/hooks/useFetch";
import { ResidentsDrawer } from "./ResidentsDrawer";
import type { Unit } from "@/types/inventory";

interface UnitListProps {
  blockId: string;
}

export const UnitList: React.FC<UnitListProps> = ({ blockId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: units,
    loading,
    refetch,
  } = useFetch(() => inventoryService.getUnitsByBlock(blockId), [blockId]);

  const handleOpenResidents = (unit: any) => {
    setSelectedUnit({
      id: unit.id,
      label: `Kapı No: ${unit.doorNumber}`,
    });
    setDrawerOpen(true);
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  const handleDelete = async (unitId: string) => {
    setDeleting(true);
    try {
      await inventoryService.deleteUnit(unitId);
      message.success("Daire silindi.");
      refetch();
    } catch (error) {
      message.error("Daire silinemedi.");
    } finally {
      setDeleting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
  };

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
      title: "Sakinler",
      key: "residents",
      render: (_: any, record: any) => (
        <Button
          size="small"
          type="default"
          icon={<TeamOutlined />}
          onClick={() => handleOpenResidents(record)}
        >
          Yönet
        </Button>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_: any, record: Unit) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Silmek istediğine emin misin?"
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleting}
            />
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
        onCancel={handleModalClose}
        onSuccess={refetch}
        blockId={blockId}
        editingUnit={editingUnit}
      />
      <ResidentsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        unitId={selectedUnit?.id || null}
        unitLabel={selectedUnit?.label || ""}
      />
    </>
  );
};
