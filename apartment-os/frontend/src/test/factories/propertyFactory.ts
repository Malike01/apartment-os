import { faker } from "@faker-js/faker";

export const createMockProperty = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.location.street(),
  city: faker.location.city(),
  managerId: faker.string.uuid(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
