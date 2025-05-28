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
<<<<<<< HEAD
  name?: string;
=======
>>>>>>> 60d8ec943c4d2377a25dde6dbc54d586c7b579dd
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