import { createContext, useContext, useState } from "react";
import { Order } from "../shared/types";

interface NewOrderContextType {
  count: number;
  latestOrder: Order | null;
  increment: (order: Order) => void;
  reset: () => void;
}

const NewOrderContext = createContext<NewOrderContextType | null>(null);

export const NewOrderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [count, setCount] = useState(0);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const increment = (order: Order) => {
    setCount((c) => c + 1);
    setLatestOrder(order);
  };

  const reset = () => {
    setCount(0);
    setLatestOrder(null);
  };

  return (
    <NewOrderContext.Provider value={{ count, latestOrder, increment, reset }}>
      {children}
    </NewOrderContext.Provider>
  );
};

export const useNewOrder = () => useContext(NewOrderContext)!;
