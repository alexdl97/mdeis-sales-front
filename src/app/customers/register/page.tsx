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
import { CustomerGroup } from "@/types";
import { useRouter } from "next/navigation";
import { getCustomersGroup, saveCustomer } from "@/app/services/customerService";

export default function CustomerRegister() {
  const router = useRouter();
  const [customerGroups, setCustomerGroup] = useState<CustomerGroup[]>([]);
  const [customerGroupSelected, setCustomerGroupSelected] =
    useState<CustomerGroup | null>(null);
  const [messageError, setMessageError] = useState<string>("");
  const [showFormError, setShowFormError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getListCustomerGroups();
  }, []);

  const getListCustomerGroups = async () => {
    setIsLoading(true);
    const data = await getCustomersGroup();
    setCustomerGroup(data);
    if (data.length) {
      setCustomerGroupSelected(data[0]);
    }
    setIsLoading(false);
  };

  const [form, setForm] = useState({
    code: "",
    name: "",
    taxId: "",
    email: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "taxId") {
      if (!/^\d*$/.test(value)) return;
    }
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const codeRegex = /^[A-Za-z0-9-]+$/;
    const taxIdRegex = /^\d{5,12}$/;

    return (
      emailRegex.test(form.email) &&
      nameRegex.test(form.name) &&
      codeRegex.test(form.code) &&
      taxIdRegex.test(form.taxId) &&
      customerGroupSelected
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessageError("");
    setShowFormError(false);
    if (!validateForm()) {
      setMessageError("Debes completar el formulario.");
      setShowFormError(true);
      return;
    }

    const result = await saveCustomer({
      code: form.code,
      name: form.name,
      dni: form.taxId,
      email: form.email,
      customerGroupId: customerGroupSelected?.id,
    });
    console.log('result ', result);
    if (!result) {
      router.replace("/customers");
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
        Registrar Cliente
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
            label="Código del cliente"
            name="code"
            value={form.code}
            onChange={handleChange}
            error={(!!form.code || showFormError) && !/^[A-Za-z0-9-]+$/.test(form.code)}
            helperText={
              (!!form.code || showFormError) && !/^[A-Za-z0-9-]+$/.test(form.code)
                ? "Código inválido (solo letras y números, 3-10 caracteres)"
                : ""
            }
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Nombre del cliente"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={(!!form.name || showFormError) && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(form.name)}
            helperText={
              (!!form.name || showFormError) && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(form.name)
                ? "Nombre inválido (solo letras y espacios)"
                : ""
            }
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Nro CI/NIT"
            name="taxId"
            value={form.taxId}
            onChange={handleChange}
            error={(!!form.taxId || showFormError) && !/^\d{5,12}$/.test(form.taxId)}
            helperText={
              (!!form.taxId || showFormError) && !/^\d{5,12}$/.test(form.taxId)
                ? "Número inválido (debe tener entre 5 y 12 dígitos)"
                : ""
            }
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={(!!form.email || showFormError) && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)}
            helperText={
              (!!form.email || showFormError) && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)
                ? "Correo no válido"
                : ""
            }
          />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Grupo de Clientes
            </InputLabel>
            <Select
              value={customerGroupSelected?.id ?? ""}
              onChange={(e) =>
                setCustomerGroupSelected(
                  customerGroups.find(
                    (c) => c.id === e.target?.value?.toString()
                  ) || customerGroups[0]
                )
              }
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
            >
              {customerGroups.map((c, i) => (
                <MenuItem key={`customerGroup-${i}`} value={c.id}>
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
