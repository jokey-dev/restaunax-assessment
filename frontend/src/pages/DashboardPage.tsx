import { useState } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import OrderList from "../components/OrderList";
import OrderStats from "../components/OrderStats";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import { Order } from "../shared/types";
import { useNewOrder } from "../context/NewOrderContext";

export default function DashboardPage() {
  const { latestOrder } = useNewOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (latestOrder) {
    if (refreshKey === 0 || refreshKey !== Number(latestOrder.id)) {
      setRefreshKey(Number(latestOrder.id));
    }
  }

  const handleOrderSelect = (order: Order) => setSelectedOrder(order);
  const handleOrderUpdated = () => setRefreshKey((prev) => prev + 1);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>
        Restaunax - Order Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <OrderStats key={refreshKey} />{" "}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <OrderList
              key={refreshKey}
              onOrderSelect={handleOrderSelect}
              latestOrder={latestOrder}
            />
          </Paper>
        </Grid>
      </Grid>

      <OrderDetailsDialog
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdated={handleOrderUpdated}
      />
    </Container>
  );
}
