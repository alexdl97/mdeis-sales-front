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
import { SaleInvoice } from "@/types";
import { getSales } from "../services/saleService";

export default function ListarVentas() {
  const router = useRouter();
  const [sales, setSales] = useState<SaleInvoice[]>([]);

  useEffect(() => {
    listSales();
  }, []);

  const listSales = async () => {
    const salesList = await getSales();
    setSales(salesList);
  }

  return (
    <Box>
      <Box py={2} display="flex" justifyContent="space-between">
        <h2>Lista de Ventas</h2>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            router.push("/ventas/register");
          }}
        >
          Registrar Venta
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Nro</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Nit/Ci</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Condicion de Pago</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Almacen</TableCell>
              <TableCell align="center" style={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((row, i) => (
              <TableRow
                key={`venta-${i}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">
                  {i + 1}
                </TableCell>
                <TableCell align="center">
                  {row.taxId}
                </TableCell>
                <TableCell align="center">
                  {row.customer?.name}
                </TableCell>
                <TableCell align="center">
                  {row.paymentCondition?.name}
                </TableCell>
                <TableCell align="center">{row.warehouse?.name}</TableCell>
                <TableCell align="center">{row.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
