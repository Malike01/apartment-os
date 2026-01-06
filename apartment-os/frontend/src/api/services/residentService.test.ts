import { describe, it, expect, vi, afterEach } from "vitest";
import { residentService } from "./residentService";
import api from "../axios";
import { API_ROUTES } from "../../constants";

vi.mock("../axios");

describe("ResidentService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("getByUnit should fetch residents for specific unit", async () => {
    const unitId = "unit-123";
    const mockData = [{ id: "1", fullName: "Ali Veli" }];
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await residentService.getByUnit(unitId);

    expect(api.get).toHaveBeenCalledWith(
      `${API_ROUTES.RESIDENTS}?unitId=${unitId}`
    );
    expect(result).toEqual(mockData);
  });

  it("create should post data correctly", async () => {
    const newResident = { fullName: "Ayşe", unitId: "unit-1" } as any;
    (api.post as any).mockResolvedValue({ data: { id: "2", ...newResident } });

    await residentService.create(newResident);

    expect(api.post).toHaveBeenCalledWith(API_ROUTES.RESIDENTS, newResident);
  });

  it("delete should call delete endpoint", async () => {
    const residentId = "res-1";
    (api.delete as any).mockResolvedValue({});

    await residentService.delete(residentId);

    expect(api.delete).toHaveBeenCalledWith(
      `${API_ROUTES.RESIDENTS}/${residentId}`
    );
  });
});
