import api from "../axios";
import { API_ROUTES } from "../../constants";
import type { CreateResidentDto, Resident } from "@/types/resident";

export const residentService = {
  // GET /residents?unitId=...
  getByUnit: async (unitId: string) => {
    const response = await api.get<Resident[]>(
      `${API_ROUTES.RESIDENTS}?unitId=${unitId}`
    );
    return response.data;
  },

  create: async (data: CreateResidentDto) => {
    const response = await api.post<Resident>(API_ROUTES.RESIDENTS, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`${API_ROUTES.RESIDENTS}/${id}`);
  },
};
