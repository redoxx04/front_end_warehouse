import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState ,useMemo} from "react";
import axios from "axios";
import ModalComponent from "../modal/ModalComponent";
import AddCategoryForm from "./AddCategoryForm";
import AddSubCategoryForm from "./AddSubCategoryForm";
import { useSearchParams } from "react-router-dom";

const AddProductForm = ({ loadData, handleCloseModalParent }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [productData, setProductData] = useState(null);

  const [kodeProduk, setKodeProduk] = useState();
  const [kategoriProduk, setKategoriProduk] = useState();
  const [subKategoriProduk, setSubKategoriProduk] = useState();
  const dropDown_height = 48;
  const dropDown_padding_top = 8;
  const [isModalKategoriOpen, setModalKategoriOpen] = useState(false);
  const [isModalSubKategoriOpen, setModalSubKategoriOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);
  const fetchProductData = async (productId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/${productId}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  const DropdownListProps = {
    PaperProps: {
      style: {
        maxHeight: dropDown_height * 3.5 + dropDown_padding_top,
        width: 100,
      },
    },
  };

  const handleAddKategori = () => {
    // setActiveModal("ADD_PRODUCT");
    setModalKategoriOpen(true);
  };

  const handleAddSubKategori = () => {
    setModalSubKategoriOpen(true);
  };

  const handleCloseModal = () => {
    // setActiveModal(null);
    setModalOpen(false);
    setModalKategoriOpen(false);
    setModalSubKategoriOpen(false);
  };

  const handleFormSubmit = async (values) => {
    console.log(values);
    const params = {
      ...values,
      SKU_produk: id
        ? productData?.SKU_produk
        : `${kodeProduk}-${kategoriProduk?.value}-${subKategoriProduk?.value}`,
    };
    try {
      id
        ? await axios.put(`http://127.0.0.1:8000/api/products/${id}`, params)
        : await axios.post(`http://127.0.0.1:8000/api/products`, params);
      // await axios.post(`http://127.0.0.1:8000/api/products`, params); // adjust the API endpoint
    } catch (e) {
      console.log(e);
    } finally {
      searchParams.delete("id");
      setSearchParams(searchParams);
      loadData();
      handleCloseModalParent();
    }
  };

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    // Fetch categories

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch categories

    fetchSubCategories();
  }, [kategoriProduk]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/kategoris"); // replace with your API endpoint for categories
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
    // finally {
    //   // loadCategoryData();
    //   handleCloseModal();
    // }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/sub_kategoris",
        {
          params: {
            id_kategori: kategoriProduk?.id,
          },
        }
      ); // replace with your API endpoint for subcategories
      setSubCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    }
  };

  const [initialValues, setInitialValues] = useState({
    kode_produk: "",
    kategori: "",
    id_sub_kategori: "",
    harga_produk: "",
    harga_modal: "",
    jumlah_produk: "",
    SKU_produk: "--",
  });

  useEffect(() => {
    if (productData) {
      setInitialValues((prev) => {
        return {
          ...prev,
          kode_produk: productData?.kode_produk,
          kategori: productData?.sub_kategori.kategori.nama_kategori,
          id_sub_kategori: productData?.id_sub_kategori,
          harga_produk: productData?.harga_produk,
          harga_modal: productData?.harga_modal,
          jumlah_produk: productData?.jumlah_produk,
          SKU_produk: productData?.SKU_produk,
          nama_produk: productData?.nama_produk,
        };
      });
      // Set other state variables if needed
      setKodeProduk(productData?.kode_produk);
      setKategoriProduk({
        id: productData?.sub_kategori.kategori.id_produk,
        value: productData?.sub_kategori.kategori.kode_produk,
      });
      setSubKategoriProduk(productData?.id_sub_kategori);
    }
  }, [productData]);

  const RenderSubCatForm = useMemo(()=>{
    console.log(kategoriProduk)
    return(
      <AddSubCategoryForm
      idCategory={kategoriProduk?.id}
      loadSubCategoryData={fetchSubCategories}
      handleCloseSubCategoryFormModal={handleCloseModal}
    />
    )
  },[kategoriProduk])
  console.log(kategoriProduk);

  const RenderCategoryForm = useMemo(()=>{
    console.log(kategoriProduk)
    return(
      <AddCategoryForm
      loadCategoryData={fetchCategories}
      handleCloseCategoryFormModal={handleCloseModal}
    />
    )
  })

  return (
    <Box m="20px">
      <Header title="CREATE PRODUCT" subtitle="Create a New Product" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={productSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            {console.log(errors)}
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Product Code"
                name="kode_produk"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  setKodeProduk(e.target.value);
                  setFieldValue(
                    "SKU_produk",
                    `${e.target.value}-${
                      kategoriProduk?.value ? kategoriProduk?.value : ""
                    }-${
                      subKategoriProduk?.value ? subKategoriProduk?.value : ""
                    }`
                  );
                }}
                value={values.kode_produk}
                error={!!touched.kode_produk && !!errors.kode_produk}
                helperText={touched.kode_produk && errors.kode_produk}
              />
              <FormControl>
                <Select
                  fullWidth
                  variant="filled"
                  displayEmpty
                  value={values.kategori}
                  name="kategori"
                  placeholder="Kategori"
                  onChange={(e, child) => {
                    handleChange(e);
                    setKategoriProduk({
                      id: child.props.id,
                      value: e.target.value,
                    });
                    setFieldValue(
                      "SKU_produk",
                      `${kodeProduk ? kodeProduk : ""}-${e.target.value}-${
                        subKategoriProduk?.value ? subKategoriProduk?.value : ""
                      }`
                    );
                  }}
                  onBlur={handleBlur}
                  renderValue={
                    values.kategori !== "" ? undefined : () => "Select Category"
                  }
                  MenuProps={DropdownListProps}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    ".MuiSelect-select": {
                      padding: "0.7rem",
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem
                      id={category.id_kategori}
                      key={category.id_kategori}
                      value={category.kode_kategori}
                    >
                      {category.nama_kategori}
                    </MenuItem>
                  ))}
                  <div>
                    <button onClick={handleAddKategori}>
                      Add New Category
                    </button>
                  </div>
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  disabled={!kategoriProduk}
                  fullWidth
                  variant="filled"
                  displayEmpty
                  value={values.id_sub_kategori}
                  name="id_sub_kategori"
                  placeholder="Sub Kategori"
                  onChange={(e, child) => {
                    handleChange(e);
                    setSubKategoriProduk({
                      id: e.target.value,
                      value: child.props.id,
                    });
                    setFieldValue(
                      "SKU_produk",
                      `${kodeProduk ? kodeProduk : ""}-${
                        kategoriProduk?.value ? kategoriProduk?.value : ""
                      }-${child.props.id}`
                    );
                  }}
                  onBlur={handleBlur}
                  renderValue={
                    values.id_sub_kategori !== ""
                      ? undefined
                      : () => "Select Sub Category"
                  }
                  MenuProps={DropdownListProps}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    ".MuiSelect-select": {
                      padding: "0.7rem",
                    },
                  }}
                >
                  {subCategories.map((subCategory) => (
                    <MenuItem
                      key={subCategory.id_sub_kategori}
                      id={subCategory.kode_sub_kategori}
                      value={subCategory.id_sub_kategori}
                    >
                      {subCategory.nama_sub_kategori}
                    </MenuItem>
                  ))}
                  <div>
                    <button onClick={handleAddSubKategori}>
                      Add New Sub Category
                    </button>
                  </div>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Product Name"
                name="nama_produk"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nama_produk}
                error={!!touched.nama_produk && !!errors.nama_produk}
                helperText={touched.nama_produk && errors.nama_produk}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Product Price"
                name="harga_produk"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.harga_produk}
                error={!!touched.harga_produk && !!errors.harga_produk}
                helperText={touched.harga_produk && errors.harga_produk}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Cost Price"
                name="harga_modal"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.harga_modal}
                error={!!touched.harga_modal && !!errors.harga_modal}
                helperText={touched.harga_modal && errors.harga_modal}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Product Quantity"
                name="jumlah_produk"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.jumlah_produk}
                error={!!touched.jumlah_produk && !!errors.jumlah_produk}
                helperText={touched.jumlah_produk && errors.jumlah_produk}
              />
              <TextField
                disabled
                fullWidth
                variant="filled"
                type="text"
                label="SKU"
                name="SKU_produk"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.SKU_produk}
                error={!!touched.SKU_produk && !!errors.SKU_produk}
                helperText={touched.SKU_produk && errors.SKU_produk}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Product
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ModalComponent
        isOpen={isModalKategoriOpen}
        handleClose={handleCloseModal}
        width={400}
      >
        {RenderCategoryForm}
      </ModalComponent>
      <ModalComponent
        isOpen={isModalSubKategoriOpen}
        handleClose={handleCloseModal}
        width={400}
      >
      {RenderSubCatForm}
      </ModalComponent>
    </Box>
  );
};

const productSchema = yup.object().shape({
  kode_produk: yup.string().required("required"),
  kategori: yup.string().required("Select a category"),
  id_sub_kategori: yup.number().required("Select a subcategory"),
  harga_produk: yup.number().required("required"),
  harga_modal: yup.number().required("required"),
  jumlah_produk: yup.number().required("required"),
  SKU_produk: yup.string(),
});

export default AddProductForm;
