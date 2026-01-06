import { faker } from '@faker-js/faker';
import { Transaction, TransactionType } from '@prisma/client';

export const createMockTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => ({
  id: faker.string.uuid(),
  amount: faker.number.float({ min: 10, max: 5000, fractionDigits: 2 }) as any, // Decimal mock
  description: faker.finance.transactionDescription(),
  category: 'Aidat',
  type: TransactionType.INCOME,
  date: new Date(),
  propertyId: faker.string.uuid(),
  unitId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
