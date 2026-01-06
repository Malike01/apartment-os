import { screen, waitFor, fireEvent, render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UnitList } from "./UnitList";
import { inventoryService } from "../../../api/services/inventoryService";
import { createMockUnit } from "@/test/factories/inventoryFactory";

vi.mock("../../../api/services/inventoryService");

describe("UnitList Component", () => {
  const blockId = "block-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render units table correctly", async () => {
    // 1. ARRANGE
    const mockUnits = [
      createMockUnit({ doorNumber: "1", floor: 1, type: "2+1", blockId }),
      createMockUnit({ doorNumber: "2", floor: 1, type: "3+1", blockId }),
    ];

    (inventoryService.getUnitsByBlock as any).mockResolvedValue(mockUnits);

    // 2. ACT
    render(<UnitList blockId={blockId} />);

    // 3. ASSERT
    await waitFor(() => {
      expect(screen.getByText("Kapı No")).toBeInTheDocument();
      expect(screen.getByText("Kat")).toBeInTheDocument();

      expect(screen.getByText("2+1")).toBeInTheDocument();
      expect(screen.getByText("3+1")).toBeInTheDocument();
    });
  });

  it('should open "New Unit" modal when add button clicked', async () => {
    (inventoryService.getUnitsByBlock as any).mockResolvedValue([]);

    render(<UnitList blockId={blockId} />);

    const addButton = screen.getByText("Daire Ekle");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText("Yeni Daire Ekle", { selector: ".ant-modal-title" })
      ).toBeInTheDocument();
    });
  });
});
