import React from "react";
import { Box, Fab,Stack, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataProducts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from "@mui/icons-material/Edit";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";


export default function ProductPage() {
  const TAX_RATE = 0.07;
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }
  function priceRow(qty, unit) {
    return qty * unit;
  }

  function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
  }

  function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  const rows = [
    createRow("Paperclips (Box)", 100, 1.15),
    createRow("Paper (Case)", 10, 45.99),
    createRow("Waste Basket", 2, 17.99),
  ];

  const invoiceSubtotal = subtotal(rows);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  no_invoice: yup.string().required("required"),
  asal_transaksi: yup.string().required("required"),
  nama_invoice: yup.string().required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
});
const initialValues = {
  no_invoice: "",
  asal_transaksi: "",
  nama_invoice: "",
  contact: "",
  address1: "",
};

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "sku", headerName: "SKU" },
    {
      field: "namaProduk",
      headerName: "Nama Produk",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "jumlahProduk",
      headerName: "Jumlah Produk",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "hargaBarang",
      headerName: "Harga Barang",
      flex: 1,
    },
    {
      field: "hargaModal",
      headerName: "Harga Modal",
      flex: 1,
    },
    {
      field: "editProduk",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Stack direction={'row'} spacing={1}>
          <Fab size="small" color={colors.greenAccent[100]}>
            <EditIcon />
          </Fab>
          <Fab size="small" color={colors.greenAccent[100]}>
            <ShoppingCartIcon />
          </Fab>
        </Stack>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Product" subtitle="List Produk di Warehouse" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <div style={{width:"100%",position:'relative'}}>
          <Button
            variant={"contained"}
            onClick={handleOpen}
            sx={{ position: "absolute", right: "0" }}
          >
            <ShoppingCartIcon />
          </Button>
        </div>

        <DataGrid
          rows={mockDataProducts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Modal
        disable
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Check Out
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nomor Invoice"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.no_invoice}
                name="no_invoice"
                error={!!touched.no_invoice && !!errors.no_invoice}
                helperText={touched.no_invoice && errors.no_invoice}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Asal Transaksi"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.asal_transaksi}
                name="asal_transaksi"
                error={!!touched.asal_transaksi && !!errors.asal_transaksi}
                helperText={touched.asal_transaksi && errors.asal_transaksi}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nama Invoice"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nama_invoice}
                name="nama_invoice"
                error={!!touched.nama_invoice && !!errors.nama_invoice}
                helperText={touched.nama_invoice && errors.nama_invoice}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Nama Barang</TableCell>
            <TableCell align="right">SKU</TableCell>
            <TableCell align="right">Jumlah Barang</TableCell>
            <TableCell align="right">Harga</TableCell>
            {/* <TableCell align="right">Sum</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
          </Typography>
          
        </Box>
      </Modal>
    </Box>
  );
}
