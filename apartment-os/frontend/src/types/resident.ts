export const ResidentType = {
  Owner: "Owner",
  Tenant: "Tenant",
} as const;

export type ResidentType = (typeof ResidentType)[keyof typeof ResidentType];

export interface Resident {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  type: ResidentType;
  unitId: string;
  createdAt: string;
}

export interface CreateResidentDto {
  fullName: string;
  phone: string;
  email?: string;
  type: ResidentType;
  unitId: string;
}
