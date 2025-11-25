import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNewOrder } from "../context/NewOrderContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { count, reset } = useNewOrder();

  const goToDashboard = () => {
    reset();
    navigate("/dashboard");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer", color: "#fff" }}
          onClick={goToDashboard}
        >
          Restaunax
        </Typography>

        <Stack direction="row" spacing={1}>
          <Badge
            badgeContent={count}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#fff",
                color: "#000",
              },
            }}
          >
            <Button sx={{ color: "#fff" }} onClick={goToDashboard}>
              Dashboard
            </Button>
          </Badge>

          <Button sx={{ color: "#fff" }} onClick={() => navigate("/create")}>
            Create Order
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
