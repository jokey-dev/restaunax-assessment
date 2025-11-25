import React from "react";
import { NewOrderProvider } from "./NewOrderContext";

const providers = [NewOrderProvider];

export const CombinedProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
};
