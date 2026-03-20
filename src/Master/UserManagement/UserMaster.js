import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import AddUsermaster from "./AddUsermaster";
import {useGetUserMasterQuery } from "../../features/api/usermasterApi";
import Loader from "../../component/Loader";
export default function ServiceMaster() {
const { data: users, isLoading, error } = useGetUserMasterQuery();
const [searchTerm, setSearchTerm] = useState("");
const [page, setPage] = useState(1);
const rowsPerPage = 5;
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true
  });
  const filteredUsers = users?.filter((user) =>
  `${user.LoginName} ${user.UserName} ${user.ShortName}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
const paginatedUsers = filteredUsers?.slice(
  (page - 1) * rowsPerPage,
  page * rowsPerPage
);

  const [editIndex, setEditIndex] = useState(null);

  // --------------------------
  // Save New OR Update Service
  // --------------------------
  const handleSave = () => {
    if (editIndex !== null) {
      // update existing row
      const updated = [...services];
      updated[editIndex] = form;
      setServices(updated);
    } else {
      // add new row
      setServices([...services, form]);
    }

    setOpen(false);
    setForm({ name: "", description: "", isActive: true });
    setEditIndex(null);
  };

  // --------------------------
  // Open Edit Popup
  // --------------------------
  const handleEdit = (index) => {
    setEditIndex(index);
     navigate("/UpdateUser");
    setOpen(true);
  };


  return (
    <Box sx={{ p: 2, mt: 4}}>

      {/* New Service Button */}
      <Button
        variant="contained"
        sx={{ mb: 2, textTransform: "none" }}
        onClick={() => navigate("/layout/AddUsermaster")}
      >
        + Add User
      </Button>
<TextField
  label="Search User"
  variant="outlined"
  size="small"
  sx={{ mb: 2,ml:2 }}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
<Button
        variant="contained"
        sx={{ mb: 2, textTransform: "none",ml:2 }}
        onClick={() => navigate("/layout/AddPermission")}
      >
        Report Permission
      </Button>

      {/* Table */}
     <TableContainer component={Paper} >
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#578EE5",color: "#fff" }}>
        <TableCell sx={{color: "#fff" }}><b>Login Name</b></TableCell>
        <TableCell sx={{color: "#fff" }}><b>User Name</b></TableCell>
        <TableCell sx={{color: "#fff" }}><b>Short Name</b></TableCell>
        <TableCell sx={{color: "#fff" }}><b>Password</b></TableCell>
        <TableCell sx={{color: "#fff" }}><b>FK_UsertypeId</b></TableCell>
        <TableCell sx={{color: "#fff" }}><b>UserType</b></TableCell>
        <TableCell sx={{color: "#fff" }}><b>FK_EmployeeId</b></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>

  {/* Loading */}
  {isLoading && (
    <TableRow>
      <TableCell colSpan={7} align="center">
          <Loader />
      </TableCell>
    </TableRow>
  )}

  {/* Error */}
  {error && (
    <TableRow>
      <TableCell colSpan={7} align="center">
        Error loading users
      </TableCell>
    </TableRow>
  )}

  {/* Data */}
{paginatedUsers?.map((user) => (
  <TableRow key={user.PK_UserId}>
    <TableCell>{user.LoginName}</TableCell>
    <TableCell>{user.UserName}</TableCell>
    <TableCell>{user.ShortName}</TableCell>
    <TableCell>{user.Password?.charAt(0)}</TableCell>
    <TableCell>{user.FK_UserTypeId}</TableCell>
    <TableCell>{user.UserType}</TableCell>
    <TableCell>{user.Fk_EmployeeId}</TableCell>
  </TableRow>
))}


  {/* No Data */}
  {!isLoading && !error && filteredUsers?.length === 0 && (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No users found
      </TableCell>
    </TableRow>
  )}

</TableBody>

  </Table>
</TableContainer>

{filteredUsers?.length > 0 && (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
    <Pagination
      count={Math.ceil(filteredUsers.length / rowsPerPage)}
      page={page}
      onChange={(e, value) => setPage(value)}
      color="primary"
    />
  </Box>
)}
      {/* Popup Form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editIndex !== null ? "Edit Service" : "Add New Service"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField
            label="Service Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Service Description"
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            Is Active
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
