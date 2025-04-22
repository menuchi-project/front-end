export interface Item {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: string;
  subCategoryId: string;
  categoryName: string;
  name: string;
  ingredients: string;
  price: number;
  picUrl: string;
  positionInItemsList: number;
  positionInCategory: number;
}

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  categoryNameId: string;
  categoryName: string;
  positionInBacklog: number;
  items: Item[];
}

export interface CategoryName {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
}

export interface CategoryWithItemsResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  branchId: string;
  categories: Category[];
}

export interface CreateItemRequest {
  categoryNameId: string;
  name: string;
  ingredients: string;
  price: number;
  picKey: string;
}
