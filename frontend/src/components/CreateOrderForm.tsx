import { useState, useEffect } from "react";
import { Order, Item } from "../shared/types";
import { ordersApi, itemsApi } from "../services/api";
import {
  Box,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import Loader from "./Loader";
import { toast } from "react-toastify";
import {
  validateCreateOrder,
  CreateOrderErrors,
} from "../utils/createOrderValidation";

interface CreateOrderFormProps {
  onCreated?: (order: Order) => void;
}

const orderTypes: ("delivery" | "pickup" | "dine_in")[] = [
  "delivery",
  "pickup",
  "dine_in",
];

export default function CreateOrderForm({ onCreated }: CreateOrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [items, setItems] = useState<
    { itemId: number; quantity: number; price: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingItems, setLoadingItems] = useState(false);

  const [errors, setErrors] = useState<CreateOrderErrors>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof CreateOrderErrors, boolean>>
  >({});

  const fetchItems = async (pageNum: number) => {
    if (loadingItems || pageNum > totalPages) return;
    setLoadingItems(true);
    try {
      const res = await itemsApi.getItems(pageNum, 10);
      setAvailableItems((prev) => [
        ...prev,
        ...res.data.filter((item) => !prev.some((i) => i.id === item.id)),
      ]);
      setPage(res.pagination.page);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, []);

  useEffect(() => {
    const item = availableItems.find((i) => i.id === selectedItemId);
    setItemPrice(item?.price || 0);
  }, [selectedItemId, availableItems]);

  const addItem = () => {
    if (!selectedItemId || itemQty <= 0 || itemPrice <= 0) return;

    if (items.some((i) => i.itemId === selectedItemId)) {
      toast.warning("Item already added.");
      return;
    }

    setItems([
      ...items,
      { itemId: selectedItemId, quantity: itemQty, price: itemPrice },
    ]);
    setSelectedItemId(0);
    setItemQty(1);
    setItemPrice(0);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.itemId !== id));
  };

  const handleBlur = (field: keyof CreateOrderErrors) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = validateCreateOrder({
      customerName,
      customerEmail,
      customerPhone,
    });
    setErrors(newErrors);
  };

  const handleChange = (field: keyof CreateOrderErrors, value: string) => {
    if (field === "customerName") setCustomerName(value);
    else if (field === "customerEmail") setCustomerEmail(value);
    else if (field === "customerPhone") setCustomerPhone(value);

    if (touched[field]) {
      const newErrors = validateCreateOrder({
        customerName: field === "customerName" ? value : customerName,
        customerEmail: field === "customerEmail" ? value : customerEmail,
        customerPhone: field === "customerPhone" ? value : customerPhone,
      });
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = validateCreateOrder({
      customerName,
      customerEmail,
      customerPhone,
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== "");
  };

  const handleSubmit = async () => {
    setTouched({
      customerName: true,
      customerEmail: true,
      customerPhone: true,
    });

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    if (items.length === 0) {
      toast.error("Add at least one item to create an order.");
      return;
    }

    setLoading(true);
    try {
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const newOrder = await ordersApi.createOrder({
        customerName,
        customerEmail,
        customerPhone,
        customerRewardPoints: 0,
        orderType,
        items,
        total,
      });
      onCreated?.(newOrder);

      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setOrderType("delivery");
      setItems([]);
      setErrors({ customerName: "", customerEmail: "", customerPhone: "" });
      setTouched({});
    } catch (err: any) {
      toast.error(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading && <Loader />}
      <Stack spacing={2}>
        <TextField
          label="Customer Name"
          value={customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
          onBlur={() => handleBlur("customerName")}
          fullWidth
          error={!!errors.customerName && !!touched.customerName}
          helperText={touched.customerName ? errors.customerName : ""}
        />
        <TextField
          label="Customer Email"
          value={customerEmail}
          onChange={(e) => handleChange("customerEmail", e.target.value)}
          onBlur={() => handleBlur("customerEmail")}
          fullWidth
          error={!!errors.customerEmail && !!touched.customerEmail}
          helperText={touched.customerEmail ? errors.customerEmail : ""}
        />
        <TextField
          label="Customer Phone"
          value={customerPhone}
          onChange={(e) => handleChange("customerPhone", e.target.value)}
          onBlur={() => handleBlur("customerPhone")}
          fullWidth
          error={!!errors.customerPhone && !!touched.customerPhone}
          helperText={touched.customerPhone ? errors.customerPhone : ""}
        />

        <TextField
          select
          label="Order Type"
          value={orderType}
          onChange={(e) =>
            setOrderType(e.target.value as "delivery" | "pickup")
          }
        >
          {orderTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <Divider />
        <Typography variant="subtitle1">Items</Typography>

        <Stack direction="row" spacing={1}>
          <TextField
            select
            label="Select Item"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(Number(e.target.value))}
            size="small"
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { maxHeight: 250 },
                  onScroll: (event: React.UIEvent<HTMLDivElement>) => {
                    const target = event.currentTarget;
                    if (
                      target.scrollTop + target.clientHeight >=
                        target.scrollHeight - 5 &&
                      page < totalPages &&
                      !loadingItems
                    ) {
                      fetchItems(page + 1);
                    }
                  },
                },
              },
            }}
          >
            <MenuItem value={0}>-- Select --</MenuItem>
            {availableItems.map((i) => (
              <MenuItem key={i.id} value={i.id}>
                {i.name} - ${i.price.toFixed(2)}
              </MenuItem>
            ))}
            {loadingItems && (
              <MenuItem disabled>
                <CircularProgress size={16} />
              </MenuItem>
            )}
          </TextField>

          <TextField
            label="Qty"
            type="number"
            value={itemQty}
            onChange={(e) => setItemQty(Number(e.target.value))}
            size="small"
          />
          <TextField
            label="Price"
            type="number"
            value={itemPrice}
            disabled
            size="small"
          />
          <Button variant="contained" sx={{ color: "#fff" }} onClick={addItem}>
            Add
          </Button>
        </Stack>

        {items.length > 0 && (
          <Stack spacing={1}>
            {items.map((i) => {
              const item = availableItems.find((it) => it.id === i.itemId);
              return (
                <Stack
                  key={i.itemId}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>
                    {item?.name || `Item #${i.itemId}`} x {i.quantity} ($
                    {i.price.toFixed(2)})
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeItem(i.itemId)}
                  >
                    Remove
                  </Button>
                </Stack>
              );
            })}
          </Stack>
        )}

        <Button
          variant="contained"
          sx={{ color: "#fff" }}
          onClick={handleSubmit}
        >
          Create Order
        </Button>
      </Stack>
    </Box>
  );
}
