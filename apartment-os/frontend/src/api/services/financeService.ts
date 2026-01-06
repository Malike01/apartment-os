import type {
  CreateTransactionDto,
  FinanceStats,
  Transaction,
} from "@/types/finance";
import api from "../axios";

export const financeService = {
  getAll: async (propertyId: string) => {
    const response = await api.get<Transaction[]>(
      `/transactions?propertyId=${propertyId}`
    );
    return response.data;
  },

  getStats: async (propertyId: string) => {
    const response = await api.get<FinanceStats>(
      `/transactions/stats?propertyId=${propertyId}`
    );
    return response.data;
  },

  create: async (data: CreateTransactionDto) => {
    const response = await api.post<Transaction>("/transactions", data);
    return response.data;
  },
};
