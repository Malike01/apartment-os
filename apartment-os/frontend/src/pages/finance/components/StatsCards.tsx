import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { COLORS } from "../../../constants";
import type { FinanceStats } from "@/types/finance";

interface StatsCardsProps {
  stats: FinanceStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={8}>
        <Card
          loading={loading}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <Statistic
            title="Net Bakiye"
            value={stats?.balance || 0}
            precision={2}
            suffix="₺"
            valueStyle={{
              color: (stats?.balance || 0) >= 0 ? COLORS.SUCCESS : COLORS.ERROR,
            }}
            prefix={<WalletOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          loading={loading}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <Statistic
            title="Toplam Gelir"
            value={stats?.income || 0}
            precision={2}
            suffix="₺"
            valueStyle={{ color: COLORS.SUCCESS }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          loading={loading}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <Statistic
            title="Toplam Gider"
            value={stats?.expense || 0}
            precision={2}
            suffix="₺"
            valueStyle={{ color: COLORS.ERROR }}
            prefix={<ArrowDownOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};
