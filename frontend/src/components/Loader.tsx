import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader() {
  return (
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "center", p: 3 }}
    >
      <CircularProgress />
    </Box>
  );
}
