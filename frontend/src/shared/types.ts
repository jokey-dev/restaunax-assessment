export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
export type OrderType = "delivery" | "pickup" | "dine_in";

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  item: Item;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerRewardPoints: number;
  orderType: OrderType;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
}
