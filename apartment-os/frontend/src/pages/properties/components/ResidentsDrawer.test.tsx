import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResidentsDrawer } from "./ResidentsDrawer";
import { residentService } from "../../../api/services/residentService";
import { createMockResident } from "../../../../test/factories/residentFactory";
import { ResidentType } from "../../../types/resident";
import { render } from "test/utils";

vi.mock("../../../api/services/residentService");

describe("ResidentsDrawer", () => {
  const unitId = "unit-1";
  const unitLabel = "Daire 5";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display residents when opened", async () => {
    // 1. ARRANGE
    const mockResidents = [
      createMockResident({
        fullName: "Mehmet Yılmaz",
        type: ResidentType.Owner,
      }),
      createMockResident({
        fullName: "Selin Demir",
        type: ResidentType.Tenant,
      }),
    ];
    (residentService.getByUnit as any).mockResolvedValue(mockResidents);

    // 2. ACT
    render(
      <ResidentsDrawer
        open={true}
        onClose={vi.fn()}
        unitId={unitId}
        unitLabel={unitLabel}
      />
    );

    // 3. ASSERT
    await waitFor(() => {
      expect(screen.getByText("Mehmet Yılmaz")).toBeInTheDocument();
      expect(screen.getByText("Selin Demir")).toBeInTheDocument();
      expect(screen.getByText("Ev Sahibi")).toBeInTheDocument();
    });

    expect(residentService.getByUnit).toHaveBeenCalledWith(unitId);
  });

  it("should show empty state message when no residents found", async () => {
    (residentService.getByUnit as any).mockResolvedValue([]);

    render(
      <ResidentsDrawer
        open={true}
        onClose={vi.fn()}
        unitId={unitId}
        unitLabel={unitLabel}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("Bu dairede kayıtlı sakin yok.")
      ).toBeInTheDocument();
    });
  });

  it("should call create service when form is submitted", async () => {
    (residentService.getByUnit as any).mockResolvedValue([]);
    (residentService.create as any).mockResolvedValue({});

    render(
      <ResidentsDrawer
        open={true}
        onClose={vi.fn()}
        unitId={unitId}
        unitLabel={unitLabel}
      />
    );

    const nameInput = screen.getByPlaceholderText("Ad Soyad");
    const phoneInput = screen.getByPlaceholderText("Telefon (555...)");

    fireEvent.change(nameInput, { target: { value: "Yeni Sakin" } });
    fireEvent.change(phoneInput, { target: { value: "5551234567" } });

    const saveButton = screen.getByText("Kaydet");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(residentService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "Yeni Sakin",
          phone: "5551234567",
          unitId: unitId,
          type: ResidentType.Tenant,
        })
      );
    });
  });
});
