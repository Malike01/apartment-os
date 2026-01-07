import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Empty } from "antd";
import { COLORS } from "../../../constants";
import styles from "../Dashboard.module.css";
import { PieChartOutlined } from "@ant-design/icons";

interface OccupancyChartProps {
  data: { total: number; filled: number; empty: number } | null;
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  if (!data || data.total === 0)
    return (
      <div className={styles.modernCard}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <div className={`${styles.iconWrapper} ${styles.purpleIcon}`} style={{ width: 32, height: 32, fontSize: 16, borderRadius: 8 }}>
              <PieChartOutlined />
            </div>
            Doluluk Oranı
          </div>
        </div>
        <Empty description="Veri yok" />
      </div>
    );

  const chartData = {
    labels: ["Dolu", "Boş"],
    datasets: [
      {
        data: [data.filled, data.empty],
        backgroundColor: [COLORS.SUCCESS, "#f0f0f0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`${styles.modernCard} ${styles.chartCard}`}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <div className={`${styles.iconWrapper} ${styles.purpleIcon}`} style={{ width: 32, height: 32, fontSize: 16, borderRadius: 8 }}>
            <PieChartOutlined />
          </div>
          Doluluk Oranı
        </div>
      </div>
      <div style={{ height: 250, display: "flex", justifyContent: "center" }}>
        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};
