import React, { useState, useEffect } from "react";
import { Select, Table, Button, Tag, Typography, Card, Empty } from "antd";
import { PlusOutlined, BankOutlined } from "@ant-design/icons";
import { propertyService } from "../../api/services/propertyService";
import { financeService } from "../../api/services/financeService";
import { useFetch } from "../../hooks/useFetch";
import { StatsCards } from "./components/StatsCards";
import { TransactionFormModal } from "./components/TransactionFormModal";
import { type Transaction, TransactionType } from "../../types/finance";
import { COLORS } from "../../constants";
import { BulkDuesModal } from "./components/BulkDuesModal";

const { Title, Text } = Typography;

const FinancePage: React.FC = () => {
  const { data: properties, loading: loadingProps } = useFetch(
    propertyService.getAll,
    []
  );

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const selectedProperty = properties?.find((p) => p.id === selectedPropertyId);

  useEffect(() => {
    if (properties && properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties]);

  const {
    data: transactions,
    loading: loadingTrans,
    refetch: refetchTrans,
  } = useFetch(
    () =>
      selectedPropertyId
        ? financeService.getAll(selectedPropertyId)
        : Promise.resolve([]),
    [selectedPropertyId]
  );

  const {
    data: stats,
    loading: loadingStats,
    refetch: refetchStats,
  } = useFetch(
    () =>
      selectedPropertyId
        ? financeService.getStats(selectedPropertyId)
        : Promise.resolve(null),
    [selectedPropertyId]
  );

  const refreshData = () => {
    refetchTrans();
    refetchStats();
  };

  const columns = [
    {
      title: "Tarih",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString("tr-TR"),
    },
    {
      title: "Tip",
      dataIndex: "type",
      key: "type",
      render: (type: TransactionType) => (
        <Tag color={type === TransactionType.Income ? "green" : "red"}>
          {type === TransactionType.Income ? "Gelir" : "Gider"}
        </Tag>
      ),
    },
    { title: "Kategori", dataIndex: "category", key: "category" },
    { title: "Açıklama", dataIndex: "description", key: "description" },
    {
      title: "Tutar",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      render: (amount: number, record: Transaction) => (
        <Text
          strong
          style={{
            color:
              record.type === TransactionType.Income
                ? COLORS.SUCCESS
                : COLORS.ERROR,
          }}
        >
          {record.type === TransactionType.Income ? "+" : "-"} {amount} ₺
        </Text>
      ),
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
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Kasa & Finans
          </Title>
          <Text type="secondary">Gelir ve giderlerinizi yönetin</Text>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Select
            style={{ width: 250 }}
            placeholder="Site Seçiniz"
            loading={loadingProps}
            value={selectedPropertyId}
            onChange={setSelectedPropertyId}
            options={properties?.map((p) => ({ label: p.name, value: p.id }))}
            suffixIcon={<BankOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!selectedPropertyId}
            onClick={() => setIsModalOpen(true)}
          >
            Yeni İşlem
          </Button>
        </div>
      </div>
      {!selectedPropertyId ? (
        <Empty
          description="Lütfen işlem yapmak istediğiniz siteyi seçiniz."
          style={{ marginTop: 50 }}
        />
      ) : (
        <>
          <StatsCards stats={stats} loading={loadingStats} />
          <Card title="Son İşlemler" bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={transactions || []}
              columns={columns}
              rowKey="id"
              loading={loadingTrans}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </>
      )}
      {selectedPropertyId && (
        <TransactionFormModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSuccess={refreshData}
          propertyId={selectedPropertyId}
        />
      )}
      {selectedPropertyId && (
        <BulkDuesModal
          open={isBulkModalOpen}
          onCancel={() => setIsBulkModalOpen(false)}
          onSuccess={refreshData}
          propertyId={selectedPropertyId}
          propertyName={selectedProperty?.name || ""}
        />
      )}
    </div>
  );
};

export default FinancePage;
