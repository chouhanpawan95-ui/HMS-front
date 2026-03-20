import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
} from "@mui/material";
import {useGetUserMasterQuery } from "../../features/api/usermasterApi";
const AddPermission = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
const { data: user, isLoading, error } = useGetUserMasterQuery();
console.log("User Data:", user);
  // Dummy API data
  const handleShowRecords = () => {
    const dummyData = [
      {
        id: 1,
        loginName: "john123",
        shortName: "John",
        selected: false,
        enablePrint: false,
        enabled: true,
      },
      {
        id: 2,
        loginName: "rahul456",
        shortName: "Rahul",
        selected: false,
        enablePrint: true,
        enabled: true,
      },
    ];

    const filtered = dummyData.filter(
      (item) =>
        item.loginName.toLowerCase().includes(search.toLowerCase()) ||
        item.shortName.toLowerCase().includes(search.toLowerCase())
    );

    setUsers(filtered);
  };

  // Handle checkbox change
  const handleCheckboxChange = (id, field) => {
    const updated = users.map((user) =>
      user.id === id ? { ...user, [field]: !user[field] } : user
    );
    setUsers(updated);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        User List
      </Typography>

      {/* Search */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search User"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="contained" onClick={handleShowRecords}>
          Show Records
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>          
              <TableCell><b>Login Name</b></TableCell>
              <TableCell><b>Short Name</b></TableCell>
              <TableCell><b>Select</b></TableCell>
              <TableCell><b>Enable Print</b></TableCell>
              <TableCell><b>Enabled</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  {/* Select Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={user.selected}
                      onChange={() =>
                        handleCheckboxChange(user.id, "selected")
                      }
                    />
                  </TableCell>

                  <TableCell>{user.loginName}</TableCell>
                  <TableCell>{user.shortName}</TableCell>

                  {/* Enable Print */}
                  <TableCell>
                    <Checkbox
                      checked={user.enablePrint}
                      onChange={() =>
                        handleCheckboxChange(user.id, "enablePrint")
                      }
                    />
                  </TableCell>

                  {/* Enabled */}
                  <TableCell>
                    <Checkbox
                      checked={user.enabled}
                      onChange={() =>
                        handleCheckboxChange(user.id, "enabled")
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddPermission;