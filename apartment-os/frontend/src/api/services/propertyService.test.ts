import { describe, it, expect, vi, afterEach } from "vitest";
import { propertyService } from "./propertyService";
import api from "../axios";
import { API_ROUTES } from "../../constants";

vi.mock("../axios");

describe("PropertyService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("getAll should fetch properties from correct endpoint", async () => {
    const mockData = [{ id: "1", name: "Test Site" }];
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await propertyService.getAll();

    expect(api.get).toHaveBeenCalledWith(API_ROUTES.PROPERTIES);
    expect(result).toEqual(mockData);
  });

  it("create should post data to correct endpoint", async () => {
    const newProperty = { name: "Yeni Site", city: "İzmir" };
    const mockResponse = { id: "2", ...newProperty };
    (api.post as any).mockResolvedValue({ data: mockResponse });

    const result = await propertyService.create(newProperty);

    expect(api.post).toHaveBeenCalledWith(API_ROUTES.PROPERTIES, newProperty);
    expect(result).toEqual(mockResponse);
  });
});
