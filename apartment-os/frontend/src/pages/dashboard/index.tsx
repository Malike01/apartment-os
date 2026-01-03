import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { UserOutlined, HomeOutlined, BankOutlined } from "@ant-design/icons";

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>Genel Bakış</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Toplam Site"
              value={12}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Aktif Sakinler"
              value={148}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doluluk Oranı"
              value={93}
              suffix="%"
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
