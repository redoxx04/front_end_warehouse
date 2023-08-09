import { Box, Typography, useTheme, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from "axios";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TeamPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [user, setUser] = useState([]);
  useEffect(() => {
    console.log("masuk");
    axios
      .get("http://127.0.0.1:8000/api/users")
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);
  
  const columns = [
    { field: "id_user", headerName: "ID" },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "contact_user",
      headerName: "Contact User",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "address_user",
      headerName: "Address User",
      flex: 1,
    },
    {
      field: "id_role",
      headerName: "Access Level",
      flex: 1,
      renderCell: params => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
                colors.greenAccent[600]
            }
            borderRadius="4px"
          >
            {params.row.id_role === 1 && <AdminPanelSettingsOutlinedIcon />}
            {params.row.id_role === 2 && <SecurityOutlinedIcon />}
            {params.row.id_role === 3 && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {params.row.id_role === 1 && 'Owner'}
              {params.row.id_role === 2 && 'Manager'}
              {params.row.id_role === 3 && 'Admin'}
            </Typography>
          </Box>
        );
      },
    },
  ];



  return (
    <>
      <Box m="20px">
        <Header title="TEAM" subtitle="Managing the Team Members" />
        <Stack direction={"row"} justifyContent={"end"}>
        <Button
        component={Link}
        to={'add'}
            variant={"contained"}
            color={'secondary'}
            // onClick={handleOpen}
            sx={{float: 'right', gap: '1rem' }}
          >
            <GroupAddIcon /> Add New Team Member
          </Button>
        </Stack>
        
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            marginTop:'1rem',
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
          }}
        >
          <DataGrid
            getRowId={(row) => row.id_user}
            checkboxSelection
            rows={user}
            columns={columns}
          />
        </Box>
      </Box>
    </>
  );
};

export default TeamPage;
