interface OrderStatusStats {
  count: number;
  totalAmount: number;
}

interface OrderStats {
  totalOrders: number;
  totalSales: number;
  stats: {
    preparing: OrderStatusStats;
    completed: OrderStatusStats;
    ready: OrderStatusStats;
    pending: OrderStatusStats;
    cancelled: OrderStatusStats;
  };
}
