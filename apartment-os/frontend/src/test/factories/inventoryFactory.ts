import { faker } from "@faker-js/faker";
import type { Block, Unit } from "../../src/types/inventory";

export const createMockBlock = (overrides: Partial<Block> = {}): Block => ({
  id: faker.string.uuid(),
  name: `${faker.string.alpha({ length: 1 }).toUpperCase()} Blok`,
  propertyId: faker.string.uuid(),
  _count: { units: faker.number.int({ min: 0, max: 20 }) },
  ...overrides,
});

export const createMockUnit = (overrides: Partial<Unit> = {}): Unit => ({
  id: faker.string.uuid(),
  doorNumber: faker.number.int({ min: 1, max: 50 }).toString(),
  floor: faker.number.int({ min: 0, max: 15 }),
  type: "3+1",
  blockId: faker.string.uuid(),
  ...overrides,
});
