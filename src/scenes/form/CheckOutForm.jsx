import {
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  TableFooter,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import * as yup from "yup";

const CheckOutForm = ({ loadData, handleCloseModalParent }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const TAX_RATE = 0.1;
  const user = JSON.parse(localStorage.getItem("user")).user;

  const loadCartServerSideData = async (id_user) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/${id_user}/cart`,
        {}
      );
      setCart(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartServerSideData(user?.id_user);
  }, []);

  const handleFormSubmit = async (values) => {
    console.log(values);

    const transformedCart = cart.map((item) => ({
      id_produk: item.products.id_produk,
      jumlah_produk_invoice: item.jumlah_produk_invoice,
      total_harga_produk:
        item.jumlah_produk_invoice * item.products.harga_produk,
    }));

    const params = {
      ...values,
      id_user: user?.id_user,
      total_transaksi: total_transaksi,
      cart: transformedCart,
    };

    console.log(params);
    try {
      await axios.post("http://127.0.0.1:8000/api/checkout", params); // adjust the API endpoint
    } catch (e) {
      console.log(e);
    } finally {
      loadData();
      handleCloseModalParent();
    }
  };

  function subtotal(data) {
    return data
      .map((d) => d.products.harga_produk * d.jumlah_produk_invoice)
      .reduce((sum, i) => sum + i, 0);
  }

  const handleEditProduct = async (action, id_cart, jumlah_produk_invoice) => {
    let temp = jumlah_produk_invoice;
    if (action == "+") {
      temp++;
    } else {
      temp--;
    }
    try {
      await axios.put(`http://127.0.0.1:8000/api/cart/${id_cart}`, {
        jumlah_produk_invoice: temp,
      });
    } catch (e) {
      console.log(e);
    } finally {
      loadCartServerSideData(user?.id_user);
    }
  };

  const invoiceSubtotal = subtotal(cart);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const total_transaksi = invoiceTaxes + invoiceSubtotal;

  function ccyFormat(num) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num);
  }

  return (
    <Box>
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
                  "& > div": {
                    gridColumn: isNonMobile ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Nomor Invoice"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nomor_invoice}
                  name="nomor_invoice"
                  error={!!touched.nomor_invoice && !!errors.nomor_invoice}
                  helperText={touched.nomor_invoice && errors.nomor_invoice}
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
                  value={values.contact_number}
                  name="contact_number"
                  error={!!touched.contact_number && !!errors.contact_number}
                  helperText={touched.contact_number && errors.contact_number}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Address Invoice"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address_invoice}
                  name="address_invoice"
                  error={!!touched.address_invoice && !!errors.address_invoice}
                  helperText={touched.address_invoice && errors.address_invoice}
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <TableContainer
                sx={{
                  overflow: "auto",
                  maxHeight: "30rem",
                  marginTop: "2rem",
                  position: "relative",
                }}
                component={Paper}
              >
                <Table
                  stickyHeader
                  stickyFooter
                  sx={{ minWidth: 700 }}
                  aria-label="spanning table"
                >
                  <TableHead
                    sx={{
                      background: (theme) => theme.palette.primary.main,
                      // borderTop :   (theme) => `2px solid ${theme.palette.secondary.main} !important`,
                    }}
                  >
                    <TableRow>
                      <TableCell>Nama Barang</TableCell>
                      <TableCell align="right">SKU</TableCell>
                      <TableCell align="right">Jumlah Barang</TableCell>
                      <TableCell align="right">Harga</TableCell>
                    </TableRow>
                  </TableHead>
                  {/* {console.log(errors)} */}
                  <TableBody>
                    {cart.map((data, i) => (
                      <TableRow key={i}>
                        <TableCell>{data.products.nama_produk}</TableCell>
                        <TableCell align="right">
                          {data.products.SKU_produk}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              handleEditProduct(
                                "-",
                                data?.id_cart,
                                data?.jumlah_produk_invoice
                              )
                            }
                          >
                            <RemoveIcon />
                          </IconButton>
                          {data.jumlah_produk_invoice}
                          <IconButton
                            onClick={() =>
                              handleEditProduct(
                                "+",
                                data?.id_cart,
                                data?.jumlah_produk_invoice
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="right">
                          {ccyFormat(
                            data.jumlah_produk_invoice *
                              data.products.harga_produk
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter
                    sx={{
                      left: 0,
                      bottom: 0,
                      zIndex: 2,
                      position: "sticky",
                      background: (theme) => theme.palette.primary.main,
                    }}
                  >
                    <TableRow>
                      <TableCell rowSpan={3} />
                      <TableCell colSpan={2}>Subtotal</TableCell>
                      <TableCell align="right">
                        {ccyFormat(invoiceSubtotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tax</TableCell>
                      <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
                        0
                      )} %`}</TableCell>
                      <TableCell align="right">
                        {ccyFormat(invoiceTaxes)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell align="right">
                        {ccyFormat(total_transaksi)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="end" mt="20px" spacing={1}>
                <Button
                  variant={"contained"}
                  onClick={handleCloseModalParent}
                  color="secondary"
                >
                  Cancel{" "}
                </Button>
                <Button type="submit" color="secondary" variant="contained">
                  Create New Invoice
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Typography>
    </Box>
  );
};

// Your Yup validation schema
const checkoutSchema = yup.object().shape({
  nomor_invoice: yup.string().required("Nomor Invoice is required."),
  asal_transaksi: yup.string().required("Asal Transaksi is required."),
  nama_invoice: yup.string().required("Nama Invoice is required."),
  contact_number: yup.string().required("Contact Number is required."),
  address_invoice: yup.string().required("Address Invoice is required."),
});

// Initial values for your form
const initialValues = {
  nomor_invoice: "",
  asal_transaksi: "",
  nama_invoice: "",
  contact_number: "",
  address_invoice: "",
};

export default CheckOutForm;
