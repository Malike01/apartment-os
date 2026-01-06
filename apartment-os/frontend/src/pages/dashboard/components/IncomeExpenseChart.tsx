import React from "react";
import { Bar } from "react-chartjs-2";
import { Card } from "antd";
import { COLORS } from "../../../constants";

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
    <Card title="Son 6 Aylık Finansal Durum" style={{ height: "100%" }}>
      <div style={{ height: 300 }}>
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};
