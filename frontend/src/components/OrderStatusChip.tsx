import Chip from "@mui/material/Chip";
import { OrderStatus } from "../shared/types";

const labelMap: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#f57c00" },
  preparing: { label: "Preparing", color: "#0288d1" },
  ready: { label: "Ready", color: "#7b1fa2" },
  completed: { label: "Completed", color: "#388e3c" },
  cancelled: { label: "Cancelled", color: "#d32f2f" },
};

export default function OrderStatusChip({ status }: { status: OrderStatus }) {
  const cfg = labelMap[status];
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        backgroundColor: cfg.color,
        color: "#fff",
      }}
    />
  );
}
