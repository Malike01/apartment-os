import api from "../axios";
import { saveAs } from "file-saver";
export const reportService = {
  downloadFinanceExcel: async (propertyId: string) => {
    const response = await api.get(
      `/reports/finance/excel?propertyId=${propertyId}`,
      {
        responseType: "blob",
      }
    );
    saveAs(
      new Blob([response.data]),
      `Finans_Raporu_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  },

  downloadFinancePdf: async (propertyId: string) => {
    const response = await api.get(
      `/reports/finance/pdf?propertyId=${propertyId}`,
      {
        responseType: "blob",
      }
    );
    saveAs(
      new Blob([response.data]),
      `Finans_Raporu_${new Date().toISOString().split("T")[0]}.pdf`
    );
  },
};
