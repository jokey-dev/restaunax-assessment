import { useEffect } from "react";
import { socketService } from "./services/socket";
import { useNewOrder } from "./context/NewOrderContext";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Order } from "./shared/types";

function App() {
  const { increment } = useNewOrder();

  useEffect(() => {
    socketService.connect();

    const handleNewOrder = (order: Order) => {
      increment(order);
    };

    socketService.onNewOrder(handleNewOrder);

    return () => {
      socketService.disconnect();
    };
  }, [increment]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create" element={<CreateOrderPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
