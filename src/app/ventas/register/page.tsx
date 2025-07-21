"use client";

import { useEffect, useState } from "react";
import ItemsTable from "@/components/ItemsTable";
import {
  Customer,
  PaymentCondition,
  Product,
  SaleInvoice,
  SaleInvoceDetail,
  Warehouse,
} from "@/types";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";
import { getWarehouses } from "../../services/wharehouseService";
import { getPaymentsConditions } from "../../services/paymentConditionService";
import { saveSaleInvoce } from "@/app/services/saleService";
import { useRouter } from "next/navigation";

export default function VentasPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [paymentConditions, setPaymentConditions] = useState<
    PaymentCondition[]
  >([]);

  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [warehouseSelected, setWarehouseSelected] = useState<Warehouse | null>(
    null
  );
  const [paymentConditionSelected, setPaymentConditionSelected] =
    useState<PaymentCondition | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerSelected, setCustomerSelected] = useState<Customer | null>(
    null
  );
  const [items, setItems] = useState<SaleInvoceDetail[]>([]);
  const [messageError, setMessageError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          listProducts(),
          listCustomers(),
          listWareHoueses(),
          listPaymentConditions(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const listProducts = async () => {
    const productsList = await getProducts();
    setProducts(productsList);
    if (productsList.length) {
      setProductSelected(productsList[0]);
    }
  };

  const listCustomers = async () => {
    const customersList = await getCustomers();
    setCustomers(customersList);
    if (customersList.length) {
      setCustomerSelected(customersList[0]);
    }
  };

  const listWareHoueses = async () => {
    const wareHousesList = await getWarehouses();
    setWarehouses(wareHousesList);
    if (wareHousesList.length) {
      setWarehouseSelected(wareHousesList[0]);
    }
  };

  const listPaymentConditions = async () => {
    const paymentConditionsList = await getPaymentsConditions();
    setPaymentConditions(paymentConditionsList);
    if (paymentConditionsList.length) {
      setPaymentConditionSelected(paymentConditionsList[0]);
    }
  };

  const addProduct = () => {
    setMessageError("");
    if (!productSelected) {
      setMessageError("Debe seleccionar un producto");
      return;
    }
    const disc =
      productSelected.productGroup.discountPercentage +
      (customerSelected?.customerGroup?.discountPercentage ?? 0)
    setItems([
      ...items,
      {
        productName: productSelected.name,
        productId: productSelected.id,
        quantity: 1,
        productPrice: productSelected.price,
        productDiscount: productSelected?.productGroup?.discountPercentage ?? 0,
        customerDiscount: customerSelected?.customerGroup?.discountPercentage ?? 0,
        totalPrice: productSelected.price * (1 - disc / 100),
      },
    ]);
  };

  const onChangeQuantity = (index: number, add: boolean) => {
    setItems((prev) => {
      const updated = [...prev];
      const current = updated[index];

      if (!current) return prev;

      const newQuantity = add
        ? current.quantity + 1
        : Math.max(1, current.quantity - 1);
      const totalDisc = current.customerDiscount + current.productDiscount;
      const totalPrice = (current.productPrice * newQuantity) * (1 - totalDisc / 100);
      updated[index] = {
        ...current,
        quantity: newQuantity,
        totalPrice: totalPrice
      };
      return updated;
    });
  };

  const removeProduct = (index: number) => {
    return setItems(items.filter((_e, i) => i !== index));
  };

  const saveSale = async () => {
    setMessageError("");
    if (!customerSelected) {
      setMessageError("Debe seleccionar un cliente");
      return;
    }
    if (!warehouseSelected) {
      setMessageError("Debe seleccionar un almacen");
      return;
    }
    if (!paymentConditionSelected) {
      setMessageError("Debe seleccionar una condicion de pago");
      return;
    }

    const body: SaleInvoice = {
      customerId: customerSelected.id,
      warehouseId: warehouseSelected.id,
      paymentConditionId: paymentConditionSelected.id,
      taxId: new Date().getMilliseconds().toString(),
      taxName: customerSelected.name,
      saleInvoiceItems: items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })),
    };

    const ok = await saveSaleInvoce(body);
    if (ok) {
      router.replace('/ventas');
    }
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  return (
    <Box
      bgcolor="#f5f5f5"
      // bgcolor="#eef2f6"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box width="70vw">
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Registrar Venta
        </h1>
        {messageError && <Alert severity="error">{messageError}</Alert>}
        <Box mt={8} display="flex" justifyContent="space-evenly">
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Clientes
              </InputLabel>
              <Select
                value={customerSelected?.id ?? 0}
                onChange={(e) =>
                  setCustomerSelected(
                    customers.find((c) => c.id === e.target.value.toString()) ||
                      customers[0]
                  )
                }
                inputProps={{
                  name: "age",
                  id: "uncontrolled-native",
                }}
              >
                {customers.map((c, i) => (
                  <MenuItem key={`customer-${i}`} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Almacenes
              </InputLabel>
              <Select
                value={warehouseSelected?.id ?? 0}
                onChange={(e) =>
                  setWarehouseSelected(
                    warehouses.find((c) => c.id == e.target.value.toString()) ||
                      warehouses[0]
                  )
                }
                inputProps={{
                  name: "age",
                  id: "uncontrolled-native",
                }}
              >
                {warehouses.map((c, i) => (
                  <MenuItem key={`warehouse-${i}`} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Condicion de Pago
              </InputLabel>
              <Select
                value={paymentConditionSelected?.id ?? 0}
                onChange={(e) =>
                  setPaymentConditionSelected(
                    paymentConditions.find(
                      (c) => c.id == e.target.value.toString()
                    ) || paymentConditions[0]
                  )
                }
                inputProps={{
                  name: "age",
                  id: "uncontrolled-native",
                }}
              >
                {paymentConditions.map((c, i) => (
                  <MenuItem key={`payment-condition-${i}`} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-evenly">
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Productos
              </InputLabel>
              <Select
                value={productSelected?.id ?? 0}
                onChange={(e) => {
                  const prod = products.find(
                    (p) => p.id === e.target.value.toString()
                  );
                  setProductSelected(prod ?? null);
                }}
                inputProps={{
                  name: "age",
                  id: "uncontrolled-native",
                }}
              >
                {products.map((p, i) => (
                  <MenuItem key={`product-${i}`} value={p.id}>
                    {p.name} - ${p.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              onClick={() => {
                addProduct();
              }}
            >
              Agregar Producto
            </Button>
          </Box>
        </Box>
        <Box my={2} height="40vh" overflow="auto">
          <h3>Detalle de la venta</h3>
          <ItemsTable
            items={items}
            onChangeQuantity={onChangeQuantity}
            removeProduct={removeProduct}
          />
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between" mt={2} mx={4}>
          <h3>Total</h3>
          <h3 style={{ color: "black", fontWeight: "normal" }}>{totalPrice}</h3>
        </Box>
        <Box
          mt={4}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={() => {
              saveSale();
            }}
          >
            Registrar Venta
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
