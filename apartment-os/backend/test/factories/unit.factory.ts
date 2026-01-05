import { faker } from '@faker-js/faker';
import { Unit } from '@prisma/client';

export const createMockUnit = (overrides: Partial<Unit> = {}): Unit => ({
  id: faker.string.uuid(),
  doorNumber: faker.number.int({ min: 1, max: 50 }).toString(),
  floor: faker.number.int({ min: 1, max: 10 }),
  type: '3+1',
  blockId: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
