import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  Spin,
  Breadcrumb,
  Tabs,
  Empty,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { propertyService } from "../../api/services/propertyService";
import { inventoryService } from "../../api/services/inventoryService";
import type { Block, Property } from "@/types/property";

const { Title, Text } = Typography;

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [propData, blocksData] = await Promise.all([
          propertyService.getById(id),
          inventoryService.getBlocksByProperty(id),
        ]);
        setProperty(propData);
        setBlocks(blocksData);
      } catch (error) {
        message.error("Site detayları yüklenemedi.");
        navigate("/properties");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
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
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/properties")}
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {property.name}
            </Title>
            <Text type="secondary">
              {property.address || "Adres girilmemiş"} - {property.city}
            </Text>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Yeni Blok Ekle
        </Button>
      </div>

      <Card title="Blok Yönetimi">
        {blocks.length === 0 ? (
          <Empty description="Bu siteye henüz blok eklenmemiş." />
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <Title level={5}>{block.name} Daireleri</Title>
                    <Button size="small" icon={<PlusOutlined />}>
                      Daire Ekle
                    </Button>
                  </div>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Bu blokta henüz daire yok."
                  />
                </div>
              ),
            }))}
          />
        )}
      </Card>
    </div>
  );
};

export default PropertyDetail;
