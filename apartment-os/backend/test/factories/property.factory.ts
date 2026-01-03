import { faker } from '@faker-js/faker';
import { Property } from '@prisma/client';

export const createMockProperty = (
  overrides: Partial<Property> = {},
): Property => ({
  id: faker.string.uuid(),
  name: faker.company.name() + ' Sitesi',
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  managerId: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
