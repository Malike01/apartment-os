import { screen, waitFor, fireEvent } from "@testing-library/react";
import { render } from "../../../test/utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BulkDuesModal } from "./BulkDuesModal";
import { financeService } from "../../../api/services/financeService";

vi.mock("../../../api/services/financeService");

describe("BulkDuesModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call createBulk service when form is submitted", async () => {
    // 1. ARRANGE
    const handleSuccess = vi.fn();
    (financeService.createBulk as any).mockResolvedValue({
      message: "Success",
    });

    render(
      <BulkDuesModal
        open={true}
        onCancel={vi.fn()}
        onSuccess={handleSuccess}
        propertyId="prop-1"
        propertyName="Test Sitesi"
      />
    );

    // 2. ACT
    fireEvent.change(screen.getByLabelText(/Dönem Açıklaması/i), {
      target: { value: "Mart 2024" },
    });
    fireEvent.change(screen.getByLabelText(/Daire Başına Tutar/i), {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByText("Dağıt"));

    // 3. ASSERT
    await waitFor(() => {
      expect(financeService.createBulk).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyId: "prop-1",
          description: "Mart 2024",
          amount: 1000,
          category: "Aidat",
        })
      );
    });

    expect(handleSuccess).toHaveBeenCalled();
  });
});
