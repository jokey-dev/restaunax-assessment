import * as yup from "yup";

const orderTypes = ["delivery", "dine_in", "pickup"];
const orderStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];

const itemSchema = yup.object({
  itemId: yup
    .number()
    .integer()
    .positive()
    .required("Item ID is required"),
  quantity: yup
    .number()
    .integer()
    .positive()
    .required("Quantity is required"),
  price: yup
    .number()
    .positive()
    .required("Price is required"),
});

export const createOrderSchema = yup.object({
  customerName: yup
    .string()
    .required("Customer name is required"),

  customerEmail: yup
    .string()
    .email("Invalid email")
    .required("Customer email is required"),

  customerPhone: yup
    .string()
    .required("Customer phone is required"),

  customerRewardPoints: yup
    .number()
    .min(0, "Reward points cannot be negative")
    .required("Customer reward points are required"),

  orderType: yup
    .string()
    .oneOf(orderTypes, `Order type must be one of: ${orderTypes.join(", ")}`)
    .required("Order type is required"),

  status: yup
    .string()
    .oneOf(orderStatuses, `Status must be one of: ${orderStatuses.join(", ")}`)
    .optional(),

  items: yup
    .array()
    .of(itemSchema)
    .min(1, "At least one item is required")
    .required("Items are required"),
});

export const updateOrderSchema = yup.object({
  status: yup
    .string()
    .oneOf(orderStatuses, `Status must be one of: ${orderStatuses.join(", ")}`)
    .required('Status is required'),
});
