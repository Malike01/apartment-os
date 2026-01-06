import { faker } from '@faker-js/faker';
import { Resident, ResidentType } from '@prisma/client';

export const createMockResident = (
  overrides: Partial<Resident> = {},
): Resident => ({
  id: faker.string.uuid(),
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  type: ResidentType.OWNER,
  isActive: true,
  unitId: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
