import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { CombinedProviders } from "./context/CombinedProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6B35",
    },
    secondary: {
      main: "#004E89",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CombinedProviders>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CombinedProviders>
    </ThemeProvider>
  </React.StrictMode>
);
