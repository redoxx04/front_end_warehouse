import * as React from "react";
import  { useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        PT Warehouse
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

export default function LoginPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()
  useEffect(()=>{
   const token= localStorage.getItem('token')
    if(token){
      navigate('/')

    }
  },[])
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params={
      username:data?.get('username'),
      password:data?.get('password')
    }
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", params); // adjust the API endpoint
      console.log(res)
      localStorage.setItem('token',res?.data?.access_token)
      localStorage.setItem('user',JSON.stringify(res?.data))
      navigate('/')
      
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={[{ mt: 1 }]}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoComplete="username"
            autoFocus
            sx={  [ {
              '& .Mui-focused': {
                border:`1px solid ${colors.grey[500]}`,
                color:'white',
              },
            }]}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            sx={ [{
              '& .Mui-focused': {
                border:`1px solid ${colors.grey[800]}`,
                color:'white',
              },
            }]}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            sx={{ mt: 3, mb: 2 , backgroundColor:colors.greenAccent[500]}} 
          >
            Sign In
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
