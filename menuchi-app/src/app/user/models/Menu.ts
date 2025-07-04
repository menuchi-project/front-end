import { Item } from './Item';

export interface Menu {
  id: string;
  branchId: string;
  name: string;
  favicon: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  restaurantId: string;
  cylinders: Cylinder[];
  cylindersCount: number;
  categoriesCount: number;
  itemsCount: number;
}

export interface CreateMenuRequest {
  name: string;
  favicon: string;
  isPublished: boolean;
  branchId: string;
}

export interface CreateMenuResponse {
  id: string;
  branchId: string;
  name: string;
  favicon: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: string | null;
  restaurantId: string;
}

export interface Cylinder {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  days: string[];
  menuCategories: MenuCategory[];
  positionInMenu: string;
  daysString: string;
}

export interface MenuCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: string;
  cylinderId: string;
  positionInCylinder: string;
  categoryName: string;
  items: Item[];
  icon: string | undefined;
}

export interface UpdateMenuRequest {
  name?: string;
  favicon?: string;
  isPublished?: boolean;
}

export interface CreateCylinder {
  sat: boolean;
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
}

export interface CreateCylinderResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  sat: boolean;
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
}

export const WeekDays = [
  { name: 'شنبه', value: 'sat' },
  { name: 'یکشنبه', value: 'sun' },
  { name: 'دوشنبه', value: 'mon' },
  { name: 'سه شنبه', value: 'tue' },
  { name: 'چهارشنبه', value: 'wed' },
  { name: 'پنج شنبه', value: 'thu' },
  { name: 'جمعه', value: 'fri' },
];

export interface BranchPreview {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  restaurantId: string;
  name: string;
  displayName: string;
  iOpen: string;
  status: string;
  rating: number;
  showRating: string;
  instagram: string;
  telegram: string;
  twitter: string;
  youtube: string;
  eitaa: string;
}

export interface MenuPreview {
  sat?: MenuCategory[];
  sun?: MenuCategory[];
  mon?: MenuCategory[];
  tue?: MenuCategory[];
  wed?: MenuCategory[];
  thu?: MenuCategory[];
  fri?: MenuCategory[];
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branchId: string;
  name: string;
  favicon: string;
  isPublished: boolean;
  restaurantId: string;
  currentDay?: string;
  branch?: BranchPreview;
  menuCategories?: MenuCategory[];
}

export interface DayMenuItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: string;
  categoryNameId: string;
  categoryName: string;
  name: string;
  ingredients: string;
  price: number;
  picUrl: string;
  positionInItemsList: number;
  positionInCategory: number;
  positionInMenuCategory: number;
  isActive: boolean;
  orderCount: number;
}
