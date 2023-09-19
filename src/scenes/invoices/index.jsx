import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Fab,
  Stack,
  useMediaQuery,
  Button,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import "jspdf-autotable";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import Papa from "papaparse";
import axios from "axios";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [invoice, setInvoice] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  // const [row, setRow] = useState(mockDataInvoices);

  const loadInvoiceServerSideData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/log_invoices`,
        {}
      );
      setInvoice(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // function Row(props) {
  // const { row } = props;
  // }

  useEffect(() => {
    // Get fresh data from the server every 30 seconds.
    loadInvoiceServerSideData();
    const interval = setInterval(() => {
      // setRow(loadInvoiceServerSideData());
      loadInvoiceServerSideData();
    }, 30000);
    console.log("asd asds");

    return () => {
      clearInterval(interval);
    };
  }, []);

  function flattenObject(obj) {
    const result = [];

    if (obj.log_transactions && Array.isArray(obj.log_transactions)) {
      obj.log_transactions.forEach((item) => {
        const flattened = {
          ...obj,
          log_transactions: { ...flattenTransactionObject(item) },
        };
        result.push(flattened);
      });
    } else {
      result.push(obj);
    }

    return result;
  }

  function flattenTransactionObject(obj, prefix = "") {
    let result = {};

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (Array.isArray(obj[key])) {
          result[newKey] = obj[key];
        } else if (typeof obj[key] === "object") {
          const nested = flattenObject(obj[key], newKey);
          result = { ...result, ...nested };
        } else {
          result[newKey] = obj[key];
        }
      }
    }

    return result;
  }

  function formatAndFlattenData(data) {
    const formattedData = [];

    data.forEach((entry) => {
      const formattedEntry = {
        id_invoice: entry.id_invoice,
        nomor_invoice: entry.nomor_invoice,
        nama_invoice: entry.nama_invoice,
        asal_transaksi: entry.asal_transaksi,
        contact_number: entry.contact_number,
        address_invoice: entry.address_invoice,
        total_transaksi: entry.total_transaksi,
        id_user: entry.id_user,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      };

      entry.log_transactions.forEach((logTransaction) => {
        const flattenedLog = {
          id_log_transaction: logTransaction.id_log_transaction,
          id_produk: logTransaction.id_produk,
          jumlah_produk_invoice: logTransaction.jumlah_produk_invoice,
          total_harga_produk: logTransaction.total_harga_produk,
          nameProduk: logTransaction.produk.nama_produk,
        };
        formattedData.push({ ...formattedEntry, ...flattenedLog });
      });
    });

    return formattedData;
  }

  const exportData = (data, fileName, type) => {
    // Create a link and download the file
    const flattenedData = formatAndFlattenData(data);

    console.log(flattenedData);

    // Convert the flattened data to CSV
    const csvData = Papa.unparse(flattenedData);

    const blob = new Blob([csvData], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="Data Transaksi di dalam Warehouse" />
      <div
        style={{ width: "100%", position: "relative", paddingBottom: "1rem" }}
      >
        <Button
          variant={"contained"}
          onClick={() =>
            exportData(invoice, "data.csv", "text/csv;charset=utf-8")
          }
        >
          <FileDownloadIcon />
          Download CSV
        </Button>
      </div>
      <React.Fragment>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* Header jangan lupa ganti */}
                <TableCell></TableCell>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Invoice</TableCell>
                <TableCell align="center">Nama Invoice</TableCell>
                <TableCell align="center">Asal Transaksi</TableCell>
                <TableCell align="center">Kontak Invoice</TableCell>
                <TableCell align="center">Alamat Invoice</TableCell>
                <TableCell align="center">Total Transaksi</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.map((row, index) => (
                <Row row={row} rowIndex={index + 1} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    </Box>
  );
};

function ccyFormat(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);
}

const generatePDF = (row) => {
  const doc = new jsPDF();
  doc.text(
    `Invoice No: INV-${row.nomor_invoice}-${formatDate(row.created_at)}`,
    10,
    10
  );
  doc.text(`Nama Invoice: ${row.nama_invoice}`, 10, 20);
  doc.text(`Asal Transaksi: ${row.asal_transaksi}`, 10, 30);
  doc.text(`Contact Number: ${row.contact_number}`, 10, 40);
  doc.text(`Alamat Invoice: ${row.address_invoice}`, 10, 50);
  doc.text(`Total Transaksi: ${ccyFormat(row.total_transaksi)}`, 10, 60);

  // Add more details and formatting as per your requirement
   // Define the table columns
   const columns = ["Product Name", "Product Quantity", "Total Price"];

   // Prepare the table rows based on log_transactions
   const rows = row.log_transactions.map((transaksi) => [
     transaksi.produk.nama_produk,
     transaksi.jumlah_produk_invoice,
     ccyFormat(transaksi.total_harga_produk),
   ]);
 
   // Add a table to the pdf
   doc.autoTable({
     startY: 70, // Where the table should start in the Y-axis
     head: [columns],
     body: rows,
   });

  // Save the PDF
  doc.save(`Invoice-${row.nomor_invoice}-${formatDate(row.created_at)}.pdf`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Row = ({ row, rowIndex }) => {
  const [open, setOpen] = React.useState(false);
  const deleteInvoice = async (id, loadInvoiceServerSideData) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/log_invoices/${id}`
      );
      if (response.status === 200) {
        console.log("Deleted successfully");
        loadInvoiceServerSideData(); // Reload the data
      } else {
        console.log(
          "Failed to delete the invoice, status code: ",
          response.status
        );
      }
    } catch (error) {
      console.error("An error occurred while deleting the invoice:", error);
    }
  };
  console.log(row);
  return (
    <>
      {/* Row data invoice */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {rowIndex}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {`INV-${row.nomor_invoice}-${formatDate(row.created_at)}`}
        </TableCell>
        <TableCell align="center">{row.nama_invoice}</TableCell>
        <TableCell align="center">{row.asal_transaksi}</TableCell>
        <TableCell align="center">{row.contact_number}</TableCell>
        <TableCell align="center">{row.address_invoice}</TableCell>
        <TableCell align="center">{ccyFormat(row.total_transaksi)}</TableCell>
        <TableCell align="center">
          <Fab size="small" onClick={() => deleteInvoice(row.id_invoice)}>
            <DeleteIcon /> {}
          </Fab>
          <Fab size="small" onClick={() => generatePDF(row)}>
            <PictureAsPdfIcon /> {}
          </Fab>
        </TableCell>
      </TableRow>
      {/* Row data transaksi */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detail Transaksi
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Nama Produk</TableCell>
                    <TableCell>Jumlah Produk</TableCell>
                    <TableCell align="right">Total Harga</TableCell>
                    {/* <TableCell align="right">Total price ($)</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Looping data transaksi */}
                  {row?.log_transactions?.map((transaksi, index) => (
                    // isi log
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {transaksi.produk.nama_produk}
                      </TableCell>
                      <TableCell>{transaksi.jumlah_produk_invoice}</TableCell>
                      <TableCell align="right">
                        {ccyFormat(transaksi.total_harga_produk)}
                      </TableCell>
                      {/* <TableCell align="right">
                                {Math.round(row.amount) / 100}
                              </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
export default Invoices;
