import { describe, it, expect, vi, afterEach } from "vitest";
import { financeService } from "./financeService";
import api from "../axios";

vi.mock("../axios");

describe("FinanceService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("getAll should fetch transactions for specific property", async () => {
    const propertyId = "prop-1";
    const mockData = [{ id: "1", amount: 100 }];
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await financeService.getAll(propertyId);

    expect(api.get).toHaveBeenCalledWith(
      `/transactions?propertyId=${propertyId}`
    );
    expect(result).toEqual(mockData);
  });

  it("getStats should fetch statistics", async () => {
    const propertyId = "prop-1";
    const mockStats = { income: 100, expense: 50, balance: 50 };
    (api.get as any).mockResolvedValue({ data: mockStats });

    const result = await financeService.getStats(propertyId);

    expect(api.get).toHaveBeenCalledWith(
      `/transactions/stats?propertyId=${propertyId}`
    );
    expect(result).toEqual(mockStats);
  });

  it("create should post new transaction", async () => {
    const payload = { amount: 500, description: "Test" } as any;
    (api.post as any).mockResolvedValue({ data: { id: "1", ...payload } });

    await financeService.create(payload);

    expect(api.post).toHaveBeenCalledWith("/transactions", payload);
  });
});
