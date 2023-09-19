import { Box, Button, Input } from "@mui/material";
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from '@mui/icons-material/Download';
import * as Yup from "yup";

export default function UploadProductForm({loadData, handleCloseModalParent}) {
  const handleFormSubmit = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("csv_file", values.csv_file);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/products/import-csv",
        formData
      ); // adjust the API endpoint
    } catch (e) {
      console.log(e);
    } finally {
      loadData();
      handleCloseModalParent();
    }
  };

  const productSchema = Yup.object().shape({
    csv_file: Yup.mixed()
      .required("CSV File is Required")
      .test(
        "fileFormat",
        "Unsupported Format",
        (value) =>
          value && ["text/csv", "application/vnd.ms-excel"].includes(value.type)
      )
      .test(
        "fileSize",
        "File too large",
        (value) => value && value.size <= 2097152 // 2MB
      ),
  });

  const initialValues = {
    csv_file: undefined,
  };

  return (
    <Box>
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
            <Input
              type={"file"}
              name="csv_file"
              accept=".csv.txt"
              onChange={(event) => {
                setFieldValue("csv_file", event.target.files[0]);
              }}
            />
            <Button type="submit" color="secondary" variant="contained">
              <PublishIcon />
            </Button>
            <a href="/assets/Template Add Product Bulk.csv" download>
            <Button type="button" color="primary" variant="contained">
              Download Template CSV
              <DownloadIcon />
            </Button>
            </a>
          </form>
        )}
      </Formik>
    </Box>
  );
}
