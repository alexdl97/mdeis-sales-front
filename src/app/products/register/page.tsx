"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ProductGroup } from "@/types";
import { getProductsGroup, saveProduct } from "@/app/services/productService";
import { useRouter } from "next/navigation";

export default function ProductRegister() {
  const router = useRouter();
  const [productGroups, setProductGroup] = useState<ProductGroup[]>([]);
  const [productGroupSelected, setProductGroupSelected] =
    useState<ProductGroup | null>(null);
  const [messageError, setMessageError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getListProductGroups();
  }, []);

  const getListProductGroups = async () => {
    setIsLoading(true);
    const data = await getProductsGroup();
    setProductGroup(data);
    if (data.length) {
      setProductGroupSelected(data[0]);
    }
    setIsLoading(false);
  };

  const [form, setForm] = useState({
    code: "",
    name: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessageError("");
    if (!productGroupSelected) {
      setMessageError("Se debe seleccionar un grupo de producto.");
    }

    const result = await saveProduct({
      code: form.code,
      name: form.name,
      price: parseInt(form.price),
      productGroupId: productGroupSelected?.id,
    });
    console.log('result ', result);
    if (!result) {
      router.replace("/products");
    } else {
      setMessageError(result);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box
      bgcolor="#f5f5f5"
      // bgcolor="#eef2f6"
      // display="flex"
      // justifyContent="center"
      // alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" align="center">
        Registrar Producto
      </Typography>
      {
        messageError &&
        <Box display="flex" justifyContent="center">
            <Box width="70vw">
                <Alert severity="error">{messageError}</Alert>
            </Box>
        </Box>
      }
      <Grid
        width="70vw"
        component="form"
        onSubmit={handleSubmit}
        sx={{
          // display: "flex",
          // flexDirection: "column",
          // gap: 2,
          // width: "300px",
          margin: "20px auto",
        }}
        mt={2}
        container
        spacing={2}
      >
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Código del producto"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Nombre del producto"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Precio"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Grupo de Productos
            </InputLabel>
            <Select
              value={productGroupSelected?.id ?? ""}
              onChange={(e) =>
                setProductGroupSelected(
                  productGroups.find(
                    (c) => c.id === e.target?.value?.toString()
                  ) || productGroups[0]
                )
              }
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
              required
            >
              {productGroups.map((c, i) => (
                <MenuItem key={`productGroup-${i}`} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Button variant="contained" color="primary" type="submit">
          Registrar
        </Button>
      </Grid>
    </Box>
  );
}
