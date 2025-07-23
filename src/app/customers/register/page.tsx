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
    if (!customerGroupSelected) {
      setMessageError("Se debe seleccionar un grupo de cliente.");
    }

    const result = await saveCustomer({
      code: form.code,
      name: form.name,
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
            required
          />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <TextField
            label="Nombre del cliente"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
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
              required
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
