export interface OpeningTimes {
  id: string;
  branchId: string;
  sat: string;
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Branch {
  id: string;
  address?: {
    country: string;
    region: string;
    city: string;
    area: string;
    street: string;
    description: string;
  };
  openingTimes?: OpeningTimes;
}

export interface Restaurant {
  id: string;
  name: string;
  displayName?: string;
  imageUrl: string;
  branches: Branch[];
  openingHours: string;
  openingHoursTooltip: string;
}