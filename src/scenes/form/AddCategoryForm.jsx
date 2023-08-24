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

const AddCategoryForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    console.log(values);
    try {
      await axios.post("http://127.0.0.1:8000/api/kategoris", values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Create New Category"
        subtitle="Create a New Product Category"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={categorySchema}
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
                label="Category"
                name="nama_kategori"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nama_kategori}
                error={!!touched.nama_kategori && !!errors.nama_kategori}
                helperText={touched.nama_kategori && errors.nama_kategori}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Category Code"
                name="kode_kategori"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.kode_kategori}
                error={!!touched.kode_kategori && !!errors.kode_kategori}
                helperText={touched.kode_kategori && errors.kode_kategori}
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

const categorySchema = yup.object().shape({
  nama_kategori: yup.string().required("required"),
  kode_kategori: yup.string().required("Select a category"),
});

const initialValues = {
  nama_kategori: "",
  kode_kategori: "",
};

export default AddCategoryForm;
