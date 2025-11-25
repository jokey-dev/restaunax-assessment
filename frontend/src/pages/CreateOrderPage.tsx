import { Container, Paper, Typography, Divider } from "@mui/material";
import CreateOrderForm from "../components/CreateOrderForm";
import { Order } from "../shared/types";
import { toast } from "react-toastify";

export default function CreateOrderPage() {
  const handleOrderCreated = (order: Order) => {
    toast.success(`Order "${order.customerName}" created successfully!`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Create New Order
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <CreateOrderForm onCreated={handleOrderCreated} />
      </Paper>
    </Container>
  );
}
