import api from "../axios";
import { API_ROUTES } from "../../constants";
import type { Block } from "@/types/property";
import type { CreateBlockDto, CreateUnitDto, Unit } from "@/types/inventory";

export const inventoryService = {
  // --- BLOCKS ---
  getBlocksByProperty: async (propertyId: string) => {
    // Backend: GET /blocks?propertyId=...
    const response = await api.get<Block[]>(
      `${API_ROUTES.BLOCKS}?propertyId=${propertyId}`
    );
    return response.data;
  },

  createBlock: async (data: CreateBlockDto) => {
    const response = await api.post<Block>(API_ROUTES.BLOCKS, data);
    return response.data;
  },

  // --- UNITS ---
  getUnitsByBlock: async (blockId: string) => {
    const response = await api.get<Unit[]>(
      `${API_ROUTES.UNITS}?blockId=${blockId}`
    );
    return response.data;
  },

  createUnit: async (data: CreateUnitDto) => {
    const response = await api.post<Unit>(API_ROUTES.UNITS, data);
    return response.data;
  },

  updateUnit: async (unitId: string, data: Partial<CreateUnitDto>) => {
    const response = await api.patch<Unit>(
      `${API_ROUTES.UNITS}/${unitId}`,
      data
    );
    return response.data;
  },

  deleteUnit: async (unitId: string) => {
    await api.delete(`${API_ROUTES.UNITS}/${unitId}`);
  },
};
