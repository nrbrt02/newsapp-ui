export interface Tag {
  id: number;
  name: string;
  articleCount: any;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

export interface TagFormData {
  name: string;
}

export interface TagRequest {
  name: string;
}