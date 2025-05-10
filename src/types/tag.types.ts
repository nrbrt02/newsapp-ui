export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagFormData {
  name: string;
}

export interface TagRequest {
  name: string;
}