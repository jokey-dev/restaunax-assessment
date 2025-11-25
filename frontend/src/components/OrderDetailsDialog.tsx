import React, { useState } from "react";
import { Order, OrderStatus } from "../shared/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  MenuItem,
  Select,
  Divider,
} from "@mui/material";
import { ordersApi } from "../services/api";
import OrderStatusChip from "./OrderStatusChip";
import Loader from "./Loader";
import { toast } from "react-toastify";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdated?: (updatedOrder: Order) => void;
}

const statuses: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export default function OrderDetailsDialog({
  order,
  open,
  onClose,
  onUpdated,
}: OrderDetailsDialogProps) {
  const [status, setStatus] = useState<OrderStatus>(order?.status || "pending");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const handleUpdate = async () => {
    if (!order) return;

    setLoading(true);

    try {
      const updated = await ordersApi.updateOrderStatus(order.id, status);

      toast.success(`Order status updated to "${status}"`);

      onUpdated?.(updated);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Order Details</DialogTitle>

      <DialogContent>
        {loading && <Loader />}

        <Stack spacing={1}>
          <Typography>
            <strong>Customer:</strong> {order.customerName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {order.customerEmail}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {order.customerPhone}
          </Typography>
          <Typography>
            <strong>Order Type:</strong> {order.orderType}
          </Typography>
          <Typography>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </Typography>
          <Typography>
            <strong>Status:</strong> <OrderStatusChip status={status} />
          </Typography>
          <Typography>
            <strong>Items:</strong>
          </Typography>

          <Stack pl={2}>
            {order.items.map((item) => (
              <Typography key={item.id}>
                {item.item.name} x {item.quantity} (${item.price.toFixed(2)})
              </Typography>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Status:</Typography>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            size="small"
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          sx={{
            color: "#FFF",
          }}
          disabled={loading}
        >
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
}
