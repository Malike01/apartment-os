export const TransactionType = {
  Income: "INCOME",
  Expense: "EXPENSE",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: string;
  date: string;
  propertyId: string;
  unitId?: string;
  unit?: {
    doorNumber: string;
    block: { name: string };
  };
}

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  propertyId: string;
  unitId?: string;
}

export interface FinanceStats {
  income: number;
  expense: number;
  balance: number;
}
export interface CreateBulkTransactionDto {
  propertyId: string;
  amount: number;
  description: string;
  category: string;
}
