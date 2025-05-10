export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleImage {
  id: number;
  image: string;
  description: string;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleAuthor {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  description: string;
  featuredImage: string;
  status: ArticleStatus;
  views: number;
  author: ArticleAuthor;
  category: {
    id: number;
    name: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  images?: ArticleImage[];
}

export interface ArticlePreview {
  id: number;
  title: string;
  description: string;
  featuredImage: string;
  status: ArticleStatus;
  views: number;
  author: ArticleAuthor;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface ArticleCreateRequest {
  title: string;
  content: string;
  description: string;
  featuredImage: string;
  status: ArticleStatus;
  categoryId: number;
  tagIds: number[];
}

export interface ArticleUpdateRequest {
  title?: string;
  content?: string;
  description?: string;
  featuredImage?: string;
  status?: ArticleStatus;
  categoryId?: number;
  tagIds?: number[];
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ArticlesState {
  articles: PaginatedResponse<ArticlePreview> | null;
  article: Article | null;
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
}

export interface Comment {
  id: number;
  comment: string;
  likes: number;
  status: number;
  articleId: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  email: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
}

export interface Reply {
  id: number;
  content: string;
  likes: number;
  status: number;
  commentId: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  email: string;
  parentReplyId: number | null;
  createdAt: string;
  updatedAt: string;
}