import api from "../axios";
import { API_ROUTES } from "../../constants";
import type { CreatePropertyDto, Property } from "@/types/property";

export const propertyService = {
  getAll: async () => {
    const response = await api.get<Property[]>(API_ROUTES.PROPERTIES);
    return response.data;
  },

  create: async (data: CreatePropertyDto) => {
    const response = await api.post<Property>(API_ROUTES.PROPERTIES, data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Property>(`${API_ROUTES.PROPERTIES}/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePropertyDto>) => {
    const response = await api.patch<Property>(
      `${API_ROUTES.PROPERTIES}/${id}`,
      data
    );
    return response.data;
  },
};
