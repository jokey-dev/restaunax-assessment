import { Order } from "../shared/types";
import { Card, CardContent, Typography, Stack, Divider } from "@mui/material";
import OrderStatusChip from "./OrderStatusChip";
import { formatDate } from "../utils/helper";

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ mb: 2, cursor: onClick ? "pointer" : "default" }}
      onClick={() => onClick?.(order)}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6">{order.customerName}</Typography>
          <OrderStatusChip status={order.status} />
        </Stack>
        <Typography variant="body2" color="textSecondary">
          {order.orderType.toUpperCase()} • {order.items.length} item(s) •
          Total: ${order.total.toFixed(2)}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="textSecondary">
          {formatDate(order.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  );
}
