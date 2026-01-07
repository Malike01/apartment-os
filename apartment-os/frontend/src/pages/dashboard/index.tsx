import React from "react";
import { Col, Row, Spin } from "antd";
import {
  BankOutlined,
  TeamOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useFetch } from "../../hooks/useFetch";
import { dashboardService } from "../../api/services/dashboardService";
import { IncomeExpenseChart } from "./components/IncomeExpenseChart";
import { OccupancyChart } from "./components/OccupancyChart";
import styles from "./Dashboard.module.css";

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

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.modernCard} ${styles.gradientCardBlue}`}>
            <div className={styles.statHeader}>
              <div className={`${styles.iconWrapper} ${styles.blueIcon}`}>
                <BankOutlined />
              </div>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {data?.counts.properties || 0}
              </div>
              <div className={styles.statLabel}>Toplam Site</div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.modernCard} ${styles.gradientCardGreen}`}>
            <div className={styles.statHeader}>
              <div className={`${styles.iconWrapper} ${styles.greenIcon}`}>
                <TeamOutlined />
              </div>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {data?.counts.residents || 0}
              </div>
              <div className={styles.statLabel}>Toplam Sakin</div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.modernCard} ${styles.gradientCardPurple}`}>
            <div className={styles.statHeader}>
              <div className={`${styles.iconWrapper} ${styles.purpleIcon}`}>
                <AppstoreOutlined />
              </div>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {data?.occupancy.total || 0}
              </div>
              <div className={styles.statLabel}>Toplam Daire</div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.modernCard} ${styles.gradientCardOrange}`}>
            <div className={styles.statHeader}>
              <div className={`${styles.iconWrapper} ${styles.orangeIcon}`}>
                <HomeOutlined />
              </div>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>
                {data?.occupancy.filled || 0}
              </div>
              <div className={styles.statLabel}>Dolu Daire</div>
            </div>
          </div>
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
