import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { propertyService } from "../../api/services/propertyService";
import { financeService } from "../../api/services/financeService";
import { createMockProperty } from "../../test/factories/propertyFactory";
import {
  createMockTransaction,
  createMockStats,
} from "../../test/factories/financeFactory";
import { TransactionType } from "../../types/finance";
import { render } from "@/test/utils";
import FinancePage from ".";

vi.mock("../../api/services/propertyService");
vi.mock("../../api/services/financeService");

describe("FinancePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should auto-select first property and load finance data", async () => {
    // 1. ARRANGE
    const mockProperties = [
      createMockProperty({ id: "prop-1", name: "Güneş Sitesi" }),
      createMockProperty({ id: "prop-2", name: "Ay Sitesi" }),
    ];

    const mockStats = createMockStats({
      income: 1000,
      expense: 400,
      balance: 600,
    });

    const mockTransactions = [
      createMockTransaction({
        amount: 1000,
        type: TransactionType.Income,
        description: "Ocak Aidatı",
      }),
      createMockTransaction({
        amount: 400,
        type: TransactionType.Expense,
        description: "Asansör Bakımı",
      }),
    ];

    (propertyService.getAll as any).mockResolvedValue(mockProperties);
    (financeService.getStats as any).mockResolvedValue(mockStats);
    (financeService.getAll as any).mockResolvedValue(mockTransactions);

    // 2. ACT
    render(<FinancePage />);

    // 3. ASSERT

    await waitFor(() => {
      expect(screen.getByText("Güneş Sitesi")).toBeInTheDocument();
    });

    expect(screen.getByText("Net Bakiye")).toBeInTheDocument();
    expect(screen.getByText("600")).toBeInTheDocument();

    expect(screen.getByText("Ocak Aidatı")).toBeInTheDocument();
    expect(screen.getByText("Asansör Bakımı")).toBeInTheDocument();
    expect(screen.getByText("+ 1000 ₺")).toBeInTheDocument();
    expect(screen.getByText("- 400 ₺")).toBeInTheDocument();

    expect(financeService.getStats).toHaveBeenCalledWith("prop-1");
    expect(financeService.getAll).toHaveBeenCalledWith("prop-1");
  });

  it('should open modal when "Yeni İşlem" button is clicked', async () => {
    // ARRANGE
    (propertyService.getAll as any).mockResolvedValue([createMockProperty()]);
    (financeService.getStats as any).mockResolvedValue(createMockStats());
    (financeService.getAll as any).mockResolvedValue([]);

    render(<FinancePage />);

    await waitFor(() => screen.getByText("Yeni İşlem"));

    // ACT
    fireEvent.click(screen.getByText("Yeni İşlem"));

    // ASSERT
    await waitFor(() => {
      expect(
        screen.getByText("Yeni Finansal İşlem", {
          selector: ".ant-modal-title",
        })
      ).toBeInTheDocument();
    });
  });
});
