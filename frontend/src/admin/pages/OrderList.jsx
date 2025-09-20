import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/global/Header";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OrderList() {

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [levels, setLevels] = useState([]);
  const [orderData, orderError] = useFetchData("/order/admin");
  const orders =orderData ?.orders || [];
  console.log(orders);
  function handleEditOrder(id){
    navigate(`/admin/order/${id}`)
  }
  
  return (
    <Box
      sx={{
        padding: 2,
        overflow: "auto",
        "& table": {
          borderCollapse: "separate",
          borderSpacing: "0 8px",
          width: "100%",
        },
        "& .MuiTableCell-root": {
          borderBottom: "none",
        },
        "& .MuiTableHead-root": {
          backgroundColor: colors.blueAccent[700],
          "& th": {
            color: colors.grey[100],
            fontWeight: "bold",
            fontSize: 14,
          },
        },
        "& .MuiTableBody-root": {
          backgroundColor: colors.primary[500],
        },
      }}
    >
     <Header title="Orders" subtitle="List of orders"/>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell>amount</TableCell>
            <TableCell>paymentMethod</TableCell>
            <TableCell>payment Status</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => {
            return (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.paymentInfo.payableAmount}</TableCell>
                <TableCell>{order.paymentInfo.method}</TableCell>
                <TableCell>{order.paymentInfo.paymentStatus}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, color: colors.grey[100], borderColor: colors.grey[100] }}
              onClick={() => handleEditOrder(order.id)}
            >
              view/Edit
            </Button>
              </TableCell>
              </TableRow>
            );
          })}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* <TablePagination
        component="div"
      /> */}
    </Box>
  );
}
