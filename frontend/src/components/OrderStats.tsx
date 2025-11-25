import { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
import { ordersApi } from "../services/api";
import { toast } from "react-toastify";

interface StatBoxProps {
  title: string;
  count: number;
  totalAmount: number;
  color?: string;
}

function StatBox({ title, count, totalAmount, color }: StatBoxProps) {
  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "center",
        backgroundColor: color || "primary.main",
        color: "white",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{count}</Typography>
      <Typography variant="subtitle1">${totalAmount.toFixed(2)}</Typography>
    </Paper>
  );
}

export default function OrderStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      try {
        const data = await ordersApi.getStats();
        setStats(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <CircularProgress />;
  if (!stats) return null;

  const { totalOrders, totalSales, stats: statusStats } = stats;

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Order Stats
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatBox
            title="Total Orders"
            count={totalOrders}
            totalAmount={totalSales}
            color="#1976d2"
          />
        </Grid>

        {Object.entries(statusStats).map(([status, stat]: any) => (
          <Grid item xs={12} sm={6} md={4} key={status}>
            <StatBox
              title={status.charAt(0).toUpperCase() + status.slice(1)}
              count={stat.count}
              totalAmount={stat.totalAmount}
              color={
                status === "pending"
                  ? "#f57c00"
                  : status === "preparing"
                  ? "#0288d1"
                  : status === "ready"
                  ? "#7b1fa2"
                  : status === "completed"
                  ? "#388e3c"
                  : "#d32f2f"
              }
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
