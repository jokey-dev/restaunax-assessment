import { useEffect, useState } from "react";
import { Order, OrderStatus } from "../shared/types";
import { ordersApi } from "../services/api";
import OrderCard from "./OrderCard";
import Loader from "./Loader";
import {
  Box,
  MenuItem,
  Select,
  Typography,
  Stack,
  Pagination,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";

interface OrderListProps {
  onOrderSelect?: (order: Order) => void;
  latestOrder?: Order | null;
}

const statuses: (OrderStatus | "all")[] = [
  "all",
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export default function OrderList({
  onOrderSelect,
  latestOrder,
}: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getOrders(
        filter === "all" ? undefined : filter,
        page,
        limit
      );
      setOrders(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [filter, page]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const newOrderIndex = latestOrder
    ? orders.findIndex((o) => o.id === latestOrder.id)
    : -1;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Orders</Typography>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as OrderStatus | "all")}
          size="small"
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {loading && <Loader />}
      {!loading && orders.length === 0 && (
        <Typography>No orders found.</Typography>
      )}

      {!loading &&
        orders.map((order, index) => {
          const isFirstNew = index === newOrderIndex;
          return (
            <Box key={order.id} sx={{ mb: 2 }}>
              {isFirstNew && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mt: 2,
                      mb: 1,
                      color: "primary.main",
                      fontWeight: "bold",
                    }}
                  >
                    New Orders
                  </Typography>
                  <Divider
                    sx={{
                      mb: 2,
                      borderBottomWidth: 2,
                      borderColor: "primary.main",
                    }}
                  />
                </>
              )}

              <OrderCard order={order} onClick={onOrderSelect} />
            </Box>
          );
        })}

      {!loading && totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
