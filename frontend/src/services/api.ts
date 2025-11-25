import { Order, OrderStatus, Item } from "../shared/types";

const API_BASE_URL = "http://localhost:3005/api";

export const ordersApi = {
  async getOrders(
    status?: OrderStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`);
    if (!response.ok)
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    const data = await response.json();
    return data;
  },

  async getStats(): Promise<{
    totalOrders: number;
    totalSales: number;
    stats: Record<
      "pending" | "preparing" | "ready" | "completed" | "cancelled",
      { count: number; totalAmount: number }
    >;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      console.error("getStats error:", error);
      throw error;
    }
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Order not found");
        }
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as Order;
    } catch (error: any) {
      console.error("getOrderById error:", error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as Order;
    } catch (error: any) {
      console.error("updateOrderStatus error:", error);
      throw error;
    }
  },

  async createOrder(order: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerRewardPoints: number;
    orderType: "delivery" | "pickup";
    total: number;
    items: { itemId: number; quantity: number; price: number }[];
  }): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create order: ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();
      return data.data as Order;
    } catch (error: any) {
      console.error("createOrder error:", error);
      throw error;
    }
  },
};

export const itemsApi = {
  async getItems(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Item[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await fetch(`${API_BASE_URL}/items?${queryParams}`);
    if (!response.ok)
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    const data = await response.json();
    return data;
  },

  async getItemById(id: string): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    if (!response.ok)
      throw new Error(`Failed to fetch item: ${response.statusText}`);
    const data = await response.json();
    return data.data as Item;
  },
};
