import React, { useEffect, useState } from "react";
import { Box, Fab, Stack, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import ModalComponent from "../modal/ModalComponent";
import AddProductForm from "../form/AddProductForm";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EditIcon from "@mui/icons-material/Edit";
import PublishIcon from "@mui/icons-material/Publish";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import CheckOutForm from "../form/CheckOutForm";
import UploadProductForm from "../form/UploadProductForm";
import { useSearchParams } from "react-router-dom";

export default function ProductPage() {
  const [product, setProduct] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalUploadOpen, setModalUploadOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")).user;
  const [isModalCheckOutOpen, setModalCheckOutOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 100,
    page: 1,
    rowCount: 0,
  });
  useEffect(() => {
    loadServerSideData(pagination.page - 1, pagination.pageSize); // Load initial data
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setModalOpen(true);
    }
  }, [searchParams]);

  const addToCart = async (id_produk, id_user = user?.id_user) => {
    const params = {
      id_produk: id_produk,
      id_user: id_user,
      jumlah_produk_invoice: 1,
    };
    try {
      await axios.post("http://127.0.0.1:8000/api/cart/add", params); // adjust the API endpoint
    } catch (e) {
      console.log(e);
    }
  };
  const handleEditItem = (id) => {
    searchParams.delete("id");
    searchParams.append("id", id);
    setSearchParams(searchParams);
  };

  const handlePageChange = (params) => {
    loadServerSideData(params, pagination.pageSize);
  };

  const loadServerSideData = async (
    page = pagination?.page,
    pageSize = pagination?.pageSize
  ) => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products", {
        params: {
          page: page + 1, // API uses 1-based indexing
          pageSize: pageSize,
        },
      });
      setProduct(response.data.data);
      setPagination({
        ...pagination,
        pageSize: pageSize,
        page: page,
        rowCount: response.data.total,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id_produk) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/products/${id_produk}`
      );
      console.log(response.data.message); // Should print "Product deleted successfully"
      loadServerSideData(); // Refresh the grid data
    } catch (error) {
      console.error("An error occurred while deleting the product:", error);
    }
  };

  function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  const rows = [];

  const invoiceSubtotal = subtotal(rows);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "kode_produk", headerName: "Kode Produk" },
    {
      field: "nama_kategori",
      headerName: "Kategori",
      flex: 1,
      renderCell: (params) => {
        return params.row.sub_kategori.kategori.nama_kategori;
      },
      valueGetter: (params) => {
        return params.row.sub_kategori.kategori.nama_kategori;
      },
    },
    {
      field: "nama_sub_kategori",
      headerName: "Sub Kategori",
      type: "number",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        return params.row.sub_kategori.nama_sub_kategori;
      },
      valueGetter: (params) => {
        return params.row.sub_kategori.nama_sub_kategori;
      },
    },
    {
      field: "nama_produk",
      headerName: "Nama Produk",
      flex: 1,
    },
    {
      field: "harga_produk",
      headerName: "Harga Produk",
      flex: 1,
    },
    {
      field: "harga_modal",
      headerName: "Harga Modal",
      flex: 1,
    },
    {
      field: "jumlah_produk",
      headerName: "Jumlah Produk",
      flex: 1,
    },
    {
      field: "SKU_produk",
      headerName: "SKU Produk",
      flex: 1,
    },
    {
      field: "editProduk",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Stack direction={"row"} spacing={1}>
          <Fab
            size="small"
            onClick={() => handleEditItem(params.row.id_produk)}
            color={colors.greenAccent[100]}
          >
            <EditIcon />
          </Fab>
          <Fab
            size="small"
            color={colors.greenAccent[100]}
            onClick={() => addToCart(params.row.id_produk)}
          >
            <ShoppingCartIcon />
          </Fab>
          <Fab size="small" color={colors.greenAccent[100]}  onClick={() => handleDeleteProduct(params.row.id_produk)}>
            <DeleteIcon /> {}
          </Fab>
        </Stack>
      ),
    },
  ];

  const handleAddProductOpen = () => {
    console.log("Add product button clicked!");
    // setActiveModal("ADD_PRODUCT");
    setModalOpen(true);
  };

  const handleUploadProductOpen = () => {
    console.log("Upload product button clicked!");
    // setActiveModal("ADD_PRODUCT");
    setModalUploadOpen(true);
  };

  const handleCheckOutOpen = () => {
    console.log("Cart button clicked!");
    // setActiveModal("CART_CHECKOUT");
    setModalCheckOutOpen(true);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setModalOpen(false);
    setModalCheckOutOpen(false);
    setModalUploadOpen(false);
  };

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
        <div
          style={{ width: "100%", position: "relative", paddingBottom: "1rem" }}
        >
          <Button
            variant={"contained"}
            onClick={handleCheckOutOpen}
            sx={{ position: "absolute", right: "0", zIndex: "2" }}
          >
            <ShoppingCartIcon />
          </Button>
          <Button
            variant={"contained"}
            onClick={handleUploadProductOpen}
            sx={{ position: "absolute", right: "80px", zIndex: "2" }}
          >
            <PublishIcon />
          </Button>
          <Button
            variant={"contained"}
            onClick={handleAddProductOpen}
            sx={{ position: "absolute", right: "160px", zIndex: "2" }}
          >
            <PlaylistAddIcon />
          </Button>
        </div>
        <ModalComponent isOpen={isModalOpen} handleClose={handleCloseModal}>
          <AddProductForm
            loadData={() => loadServerSideData()}
            handleCloseModalParent={handleCloseModal}
          />
        </ModalComponent>
        <ModalComponent
          isOpen={isModalCheckOutOpen}
          handleClose={handleCloseModal}
        >
          <CheckOutForm loadData={() => loadServerSideData()} handleCloseModalParent={handleCloseModal}/>
        </ModalComponent>
        <ModalComponent
          isOpen={isModalUploadOpen}
          handleClose={handleCloseModal}
        >
          <UploadProductForm
            loadData={() => loadServerSideData()}
            handleCloseModalParent={handleCloseModal}
          />
        </ModalComponent>
        <DataGrid
          // getRowId={(row) => row.id_produk}
          rows={product.map((item, index) => ({ id: index + 1, ...item }))}
          columns={columns}
          pageSize={pagination.pageSize}
          rowCount={pagination.rowCount}
          pagination
          rowsPerPageOptions={[10, 25, 100]}
          onPageSizeChange={(data) => {
            loadServerSideData(0, data);
          }}
          paginationMode="server"
          onPageChange={handlePageChange}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
}
