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

const AddUserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    console.log(values);
    try {
      await axios.post("http://127.0.0.1:8000/api/users", values);
    } catch (e) {
      console.log(e);
    }
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/roles"); // replace with your API endpoint
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

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
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact User"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact_user}
                name="contact_user"
                error={!!touched.contact_user && !!errors.contact_user}
                helperText={touched.contact_user && errors.contact_user}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address User"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address_user}
                name="address_user"
                error={!!touched.address_user && !!errors.address_user}
                helperText={touched.address_user && errors.address_user}
              />

              <Select
                fullWidth
                variant="filled"
                displayEmpty
                value={values.id_role}
                renderValue={
                  values.id_role !== "" ? undefined : () => "Select Role"
                }
                sx={{
                  ".MuiSelect-select": {
                    padding: "0.7rem",
                  },
                }}
                name="id_role"
                placeholder="Roles"
                onChange={(e) => {
                  setFieldValue("id_role", e.target.value);
                  handleChange(e);
                }}
                onBlur={handleBlur}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id_role} value={role.id_role}>
                    {role.nama_role}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup
    .string()
    .required("required")
    .min(6, "Password should be at least 6 characters"),
  contact_user: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address_user: yup.string().required("required"),
  id_role: yup.number().required("Select a role"),
});
const initialValues = {
  username: "",
  password: "",
  contact_user: "",
  address_user: "",
  id_role: "",
};

export default AddUserForm;
