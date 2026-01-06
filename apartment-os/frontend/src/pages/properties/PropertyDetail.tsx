import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Breadcrumb, Tabs, Empty, Spin, Typography } from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { propertyService } from "../../api/services/propertyService";
import { inventoryService } from "../../api/services/inventoryService";
import { BlockFormModal } from "./components/BlockFormModal";
import { UnitList } from "./components/UnitList";
import type { Block, Property } from "@/types/property";
import { useFetch } from "@/hooks/useFetch";

const { Title, Text } = Typography;

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const { data, loading, refetch } = useFetch<[Property, Block[]]>(() => {
    if (!id) return Promise.reject("No ID");

    return Promise.all([
      propertyService.getById(id),
      inventoryService.getBlocksByProperty(id),
    ]);
  }, [id]);

  const [property, blocks] = data || [null, []];

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  if (!property) return null;

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate("/properties")}>Sitelerim</a> },
          { title: property.name },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/properties")}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {property.name}
            </Title>
            <Text type="secondary">
              {property.city} - {blocks.length} Blok
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsBlockModalOpen(true)}
        >
          Yeni Blok Ekle
        </Button>
      </div>

      <Card>
        {blocks.length === 0 ? (
          <Empty description="Henüz blok eklenmemiş. Sağ üstten ekleyebilirsiniz." />
        ) : (
          <Tabs
            tabPosition="left"
            items={blocks.map((block) => ({
              key: block.id,
              label: (
                <span>
                  <AppstoreOutlined /> {block.name}
                </span>
              ),
              children: (
                <div>
                  <Title level={5} style={{ marginBottom: 16 }}>
                    {block.name} Daire Listesi
                  </Title>
                  <UnitList blockId={block.id} />
                </div>
              ),
            }))}
          />
        )}
      </Card>

      {id && (
        <BlockFormModal
          open={isBlockModalOpen}
          onCancel={() => setIsBlockModalOpen(false)}
          onSuccess={refetch}
          propertyId={id}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
