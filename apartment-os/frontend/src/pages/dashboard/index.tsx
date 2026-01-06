import React from "react";
import { Col, Row, Statistic, Card, Spin } from "antd";
import { BankOutlined, TeamOutlined } from "@ant-design/icons";
import { useFetch } from "../../hooks/useFetch";
import { dashboardService } from "../../api/services/dashboardService";
import { IncomeExpenseChart } from "./components/IncomeExpenseChart";
import { OccupancyChart } from "./components/OccupancyChart";

const Dashboard: React.FC = () => {
  const { data, loading } = useFetch(dashboardService.getSummary, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Genel Bakış</h2>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Site"
              value={data?.counts.properties}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Sakin"
              value={data?.counts.residents}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Toplam Daire" value={data?.occupancy.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Dolu Daire"
              value={data?.occupancy.filled}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <IncomeExpenseChart data={data?.chartData || []} />
        </Col>
        <Col xs={24} lg={8}>
          <OccupancyChart data={data?.occupancy || null} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
