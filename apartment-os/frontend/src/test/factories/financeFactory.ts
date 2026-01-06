import { faker } from "@faker-js/faker";
import {
  type Transaction,
  TransactionType,
  type FinanceStats,
} from "../../types/finance";

export const createMockTransaction = (
  overrides: Partial<Transaction> = {}
): Transaction => ({
  id: faker.string.uuid(),
  amount: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
  description: faker.finance.transactionDescription(),
  category: "Aidat",
  type: TransactionType.Income,
  date: new Date().toISOString(),
  propertyId: faker.string.uuid(),
  ...overrides,
});

export const createMockStats = (
  overrides: Partial<FinanceStats> = {}
): FinanceStats => ({
  income: 15000,
  expense: 5000,
  balance: 10000,
  ...overrides,
});
