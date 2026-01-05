export interface Unit {
  id: string;
  doorNumber: string;
  floor: number;
  type?: string;
  blockId: string;
}

export interface Block {
  id: string;
  name: string;
  propertyId: string;
  _count?: {
    units: number;
  };
}

export interface CreateBlockDto {
  name: string;
  propertyId: string;
}

export interface CreateUnitDto {
  doorNumber: string;
  floor: number;
  type?: string;
  blockId: string;
}
