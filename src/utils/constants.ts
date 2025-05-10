// src/utils/constants.ts

export const ROLES = {
    ADMIN: 'ADMIN',
    WRITER: 'WRITER',
    READER: 'READER'
  };
  
  export const API_BASE_URL = 'http://localhost:8080/api';
  
  export const ITEMS_PER_PAGE = 10;
  
  export const ARTICLE_STATUS = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED'
  };
  
  export const SORT_OPTIONS = [
    { label: 'Newest First', value: 'createdAt,desc' },
    { label: 'Oldest First', value: 'createdAt,asc' },
    { label: 'Name A-Z', value: 'name,asc' },
    { label: 'Name Z-A', value: 'name,desc' }
  ];
  
  export const DEFAULT_PAGINATION = {
    page: 0,
    size: ITEMS_PER_PAGE,
    sort: 'createdAt,desc'
  };