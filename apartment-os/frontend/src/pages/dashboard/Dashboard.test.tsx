import { screen, waitFor } from "@testing-library/react";
import { render } from "../../test/utils"; // Custom render
import { describe, it, expect, vi, beforeEach } from "vitest";
import { dashboardService } from "../../api/services/dashboardService";
import Dashboard from ".";

vi.mock("react-chartjs-2", () => ({
  Doughnut: () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>,
  Bar: () => <div data-testid="mock-bar-chart">Bar Chart</div>,
}));

vi.mock("../../api/services/dashboardService");

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render summary statistics and charts", async () => {
    // ARRANGE
    const mockData = {
      occupancy: { total: 100, filled: 80, empty: 20 },
      counts: { properties: 5, residents: 250 },
      chartData: [
        { month: "Ocak", income: 5000, expense: 2000 },
        { month: "Şubat", income: 6000, expense: 3000 },
      ],
    };

    (dashboardService.getSummary as any).mockResolvedValue(mockData);

    // ACT
    render(<Dashboard />);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText("Genel Bakış")).toBeInTheDocument();
    });

    expect(screen.getByText("Toplam Site")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("Toplam Sakin")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();

    expect(screen.getByText("Dolu Daire")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();

    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-doughnut-chart")).toBeInTheDocument();
  });
});
