import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Typography, Empty, Spin, Tooltip } from "antd";
import {
  PlusOutlined,
  BankOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { propertyService } from "../../api/services/propertyService";
import { PropertyFormModal } from "./components/PropertyFormModal";
import { COLORS } from "../../constants";
import type { Property } from "@/types/property";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

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
            Sitelerim
          </Title>
          <Text type="secondary">Yönettiğiniz mülklerin listesi</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Yeni Site Ekle
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : properties.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Henüz kayıtlı bir siteniz yok."
        >
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            İlk Siteni Ekle
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {properties.map((property) => (
            <Col xs={24} sm={12} md={8} lg={6} key={property.id}>
              <Card
                hoverable
                actions={[
                  <Tooltip title="Detaylar">
                    <Button
                      type="link"
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      Yönet
                    </Button>
                  </Tooltip>,
                  <Tooltip title="Ayarlar">
                    <Button type="link">Düzenle</Button>
                  </Tooltip>,
                ]}
              >
                <Card.Meta
                  avatar={
                    <div
                      style={{
                        background: COLORS.BACKGROUND.BODY,
                        padding: 10,
                        borderRadius: 8,
                        color: COLORS.PRIMARY,
                      }}
                    >
                      <BankOutlined style={{ fontSize: 24 }} />
                    </div>
                  }
                  title={property.name}
                  description={
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          marginBottom: 4,
                        }}
                      >
                        <EnvironmentOutlined />
                        <Text
                          type="secondary"
                          ellipsis
                          style={{ maxWidth: 150 }}
                        >
                          {property.city || "Şehir belirtilmedi"}
                        </Text>
                      </div>
                      <Text strong>{property._count?.blocks || 0} Blok</Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <PropertyFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={fetchProperties}
      />
    </div>
  );
};

export default Properties;
