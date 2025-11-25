export interface CreateOrderValues {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface CreateOrderErrors {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export const validateCreateOrder = (
  values: CreateOrderValues
): CreateOrderErrors => {
  const errors: CreateOrderErrors = {
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  };

  if (!values.customerName.trim()) {
    errors.customerName = "Customer Name is required";
  }

  if (!values.customerEmail.trim()) {
    errors.customerEmail = "Customer Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.customerEmail)
  ) {
    errors.customerEmail = "Invalid Email format";
  }

  if (!values.customerPhone.trim()) {
    errors.customerPhone = "Customer Phone is required";
  } else if (!/^\+?\d{7,15}$/.test(values.customerPhone)) {
    errors.customerPhone = "Invalid Phone Number (7-15 digits, optional +)";
  }

  return errors;
};
