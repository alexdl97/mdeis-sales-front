"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { getProducts } from "../services/productService";

export default function ProductsList() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    listProducts();
  }, []);

  const listProducts = async () => {
    const products = await getProducts();
    setProducts(products);
  }

  return (
    <Box>
      <Box py={2} display="flex" justifyContent="space-between">
        <h2>Lista de Productos</h2>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            router.push("/products/register");
          }}
        >
          Registrar Producto
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Nro</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Código</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Grupo</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Grupo Descuento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row, i) => (
              <TableRow
                key={`venta-${i}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">
                  {i + 1}
                </TableCell>
                <TableCell align="center">
                  {row.code}
                </TableCell>
                <TableCell align="center">
                  {row.name}
                </TableCell>
                <TableCell align="center">
                  {row.price}
                </TableCell>
                <TableCell align="center">
                  {row.productGroup?.name}
                </TableCell>
                <TableCell align="center">{row.productGroup?.discountPercentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
