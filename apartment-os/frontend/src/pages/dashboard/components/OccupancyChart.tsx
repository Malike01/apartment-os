import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Card, Empty } from "antd";
import { COLORS } from "../../../constants";

interface OccupancyChartProps {
  data: { total: number; filled: number; empty: number } | null;
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  if (!data || data.total === 0)
    return (
      <Card title="Doluluk Oranı">
        <Empty description="Veri yok" />
      </Card>
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
    <Card title="Doluluk Oranı" style={{ height: "100%" }}>
      <div style={{ height: 250, display: "flex", justifyContent: "center" }}>
        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </Card>
  );
};
