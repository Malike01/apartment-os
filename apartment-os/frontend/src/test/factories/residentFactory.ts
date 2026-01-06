import { faker } from "@faker-js/faker";
import { type Resident, ResidentType } from "../../src/types/resident";

export const createMockResident = (
  overrides: Partial<Resident> = {}
): Resident => ({
  id: faker.string.uuid(),
  fullName: faker.person.fullName(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  type: ResidentType.Tenant,
  unitId: faker.string.uuid(),
  createdAt: new Date().toISOString(),
  ...overrides,
});
