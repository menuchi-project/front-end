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
  // days: boolean[];
  days: {
    sat: boolean;
    sun: boolean;
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
  };
  menuCategories: MenuCategory[];
}

export interface MenuCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: string;
  cylinderId: string;
  positionInMenu: string;
  items: Item[];
}

export interface UpdateMenuRequest {
  name: string;
  favicon: string;
  isPublished: boolean;
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
