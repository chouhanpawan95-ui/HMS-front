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
import { useNavigate } from "react-router-dom";
import AddUsermaster from "./AddUsermaster";

export default function ServiceMaster() {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true
  });

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
    <Box sx={{ p: 2, mt: 10 }}>

      {/* New Service Button */}
      <Button
        variant="contained"
        sx={{ mb: 2, textTransform: "none" }}
        onClick={() => navigate("/AddUsermaster")}
      >
        + New Service
      </Button>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Service Name</b></TableCell>
              <TableCell><b>Service Description</b></TableCell>
              <TableCell><b>Is Active</b></TableCell>
              <TableCell><b>Action</b></TableCell>          
            </TableRow>
          </TableHead>

          <TableBody>
            {/* {services.map((s, index) => ( */}
              <TableRow>
                <TableCell>Consultation FEES</TableCell>
                <TableCell>COMFOCAL MICROSCOPY</TableCell>
                <TableCell>
                 YES
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    //onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            {/* ))} */}
            {/* {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No services added.
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>

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
