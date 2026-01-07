import React from "react";
import { Bar } from "react-chartjs-2";
import { COLORS } from "../../../constants";
import styles from "../Dashboard.module.css";
import { DollarOutlined } from "@ant-design/icons";

interface IncomeExpenseChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  data,
}) => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Gelir",
        data: data.map((d) => d.income),
        backgroundColor: COLORS.SUCCESS,
        borderRadius: 4,
      },
      {
        label: "Gider",
        data: data.map((d) => d.expense),
        backgroundColor: COLORS.ERROR,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className={`${styles.modernCard} ${styles.chartCard}`}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <div className={`${styles.iconWrapper} ${styles.blueIcon}`} style={{ width: 32, height: 32, fontSize: 16, borderRadius: 8 }}>
            <DollarOutlined />
          </div>
          Son 6 Aylık Finansal Durum
        </div>
      </div>
      <div style={{ height: 300 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
