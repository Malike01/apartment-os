export interface Block {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  name: string;
  address?: string;
  city?: string;
  createdAt: string;
  _count?: {
    blocks: number;
  };
}

export interface CreatePropertyDto {
  name: string;
  address?: string;
  city?: string;
}
