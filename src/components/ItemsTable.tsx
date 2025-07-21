import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from '@mui/material';
import { SaleInvoceDetail } from '@/types';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

type CallbackOnchange = (pos: number, add: boolean) => void;
type CallbackRemove = (pos: number) => void;

export default function CustomizedTables({
  items, onChangeQuantity, removeProduct
}: {
  items: SaleInvoceDetail[],
  onChangeQuantity: CallbackOnchange,
  removeProduct: CallbackRemove
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Producto</StyledTableCell>
            <StyledTableCell align="center">Precio</StyledTableCell>
            <StyledTableCell align="center">Cantidad</StyledTableCell>
            <StyledTableCell align="center">Descuento Producto</StyledTableCell>
            <StyledTableCell align="center">Descuento Cliente</StyledTableCell>
            <StyledTableCell align="center">Total</StyledTableCell>
            <StyledTableCell align="center">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell component="th" scope="row">
                {row.productName}
              </StyledTableCell>
              <StyledTableCell align="center">{row.productPrice}</StyledTableCell>
              <StyledTableCell align="center">
                <Button onClick={() => onChangeQuantity(i, false)}><RemoveIcon /></Button>
                {row.quantity}
                <Button onClick={() => onChangeQuantity(i, true)}><AddIcon /></Button>
              </StyledTableCell>
              <StyledTableCell align="center">{row.productDiscount}%</StyledTableCell>
              <StyledTableCell align="center">{row.customerDiscount}%</StyledTableCell>
              <StyledTableCell align="center">{row.totalPrice}</StyledTableCell>
              <StyledTableCell color="secondary" align="center">
                <Button onClick={() => removeProduct(i)} ><DeleteForeverIcon /></Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
