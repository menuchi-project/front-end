export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  menuId: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  pikUrl: string;
  price: number;
  amount: string;
}