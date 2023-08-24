import {
    Box,
    Button,
    TextField,
    MenuItem,
    InputLabel,
  } from "@mui/material";
  import { Formik } from "formik";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import Header from "../../components/Header";
  import { useEffect, useState } from "react";
  import axios from "axios";
  
  const AddSubCategoryForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
  
    const handleFormSubmit = async (values) => {
      console.log(values);
      try {
        await axios.post("http://127.0.0.1:8000/api/sub_kategoris", values);
      } catch (e) {
        console.log(e);
      }
    };
  
    return (
      <Box m="20px">
        <Header
          title="Create New Sub Category"
          subtitle="Create a New Product Sub Category"
        />
  
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={subCategorySchema}
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
                  label="Sub Category"
                  name="nama_sub_kategori"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nama_sub_kategori}
                  error={!!touched.nama_sub_kategori && !!errors.nama_sub_kategori}
                  helperText={touched.nama_sub_kategori && errors.nama_sub_kategori}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Sub Category Code"
                  name="kode_sub_kategori"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.kode_sub_kategori}
                  error={!!touched.kode_sub_kategori && !!errors.kode_sub_kategori}
                  helperText={touched.kode_sub_kategori && errors.kode_sub_kategori}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create New Category
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  const subCategorySchema = yup.object().shape({
    nama_sub_kategori: yup.string().required("required"),
    kode_sub_kategori: yup.string().required("required"),
  });
  
  const initialValues = {
    nama_sub_kategori: "",
    kode_sub_kategori: "",
  };
  
  export default AddSubCategoryForm;
  