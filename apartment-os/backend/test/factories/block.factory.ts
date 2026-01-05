import { faker } from '@faker-js/faker';
import { Block } from '@prisma/client';

export const createMockBlock = (overrides: Partial<Block> = {}): Block => ({
  id: faker.string.uuid(),
  name: `${faker.string.alpha({ length: 1 }).toUpperCase()} Blok`,
  propertyId: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
