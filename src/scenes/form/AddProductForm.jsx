import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
  } from "@mui/material";
  import { Formik } from "formik";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import Header from "../../components/Header";
  import { useEffect, useState } from "react";
  import axios from "axios";
  
  const AddProductForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
  
    const handleFormSubmit = async (values) => {
      console.log(values);
      try {
        await axios.post("http://127.0.0.1:8000/api/products", values); // adjust the API endpoint
      } catch (e) {
        console.log(e);
      }
    };
  
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
  
    useEffect(() => {
      // Fetch categories
      const fetchCategories = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/kategoris"); // replace with your API endpoint for categories
          setCategories(response.data);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };
  
      // Fetch subcategories
      const fetchSubCategories = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/sub_kategoris"); // replace with your API endpoint for subcategories
          setSubCategories(response.data);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        }
      };
  
      fetchCategories();
      fetchSubCategories();
    }, []);
  
    return (
      <Box m="20px">
        <Header title="CREATE PRODUCT" subtitle="Create a New Product" />
  
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={productSchema}
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
                  onChange={handleChange}
                  value={values.kode_produk}
                  error={!!touched.kode_produk && !!errors.kode_produk}
                  helperText={touched.kode_produk && errors.kode_produk}
                />
                <Select
                  fullWidth
                  variant="filled"
                  displayEmpty
                  value={values.kategori}
                  name="kategori"
                  placeholder="Kategori"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  fullWidth
                  variant="filled"
                  displayEmpty
                  value={values.sub_kategori}
                  name="sub_kategori"
                  placeholder="Sub Kategori"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {subCategories.map((subCategory) => (
                    <MenuItem key={subCategory.id} value={subCategory.name}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
                </Select>
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
      </Box>
    );
  };
  
  const productSchema = yup.object().shape({
    kode_produk: yup.string().required("required"),
    kategori: yup.string().required("Select a category"),
    sub_kategori: yup.string().required("Select a subcategory"),
    harga_produk: yup.number().required("required"),
    harga_modal: yup.number().required("required"),
    jumlah_produk: yup.number().required("required"),
    SKU_produk: yup.string().required("required"),
  });
  
  const initialValues = {
    kode_produk: "",
    kategori: "",
    sub_kategori: "",
    harga_produk: "",
    harga_modal: "",
    jumlah_produk: "",
    SKU_produk: "",
  };
  
  export default AddProductForm;
  