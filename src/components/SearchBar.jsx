import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ patients, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!patients || patients.length === 0) return;

    const filtered = term === "" 
      ? patients
      : patients.filter((p) => {
          const fullName = `${p.firstName || ""} ${p.lastName || ""} ${p.name || ""}`
            .toLowerCase()
            .trim();

          const id = (p.patientId || p.id || "").toString().toLowerCase();
          const dateTime = p.dateTime ? new Date(p.dateTime) : null;

          const dateStr = dateTime ? dateTime.toISOString().slice(0, 10) : "";
          const timeStr = dateTime ? dateTime.toTimeString().slice(0, 5) : "";

          const branch = (p.branch || "").toLowerCase();
          const status = (p.status || "").toLowerCase();

          return (
            fullName.includes(term) ||
            id.includes(term) ||
            dateStr.includes(term) ||
            timeStr.includes(term) ||
            branch.includes(term) ||
            status.includes(term)
          );
        });

    onFilter(filtered);
  }, [searchTerm, patients]);

  return (
    <TextField
      size="small"
      placeholder="Search by Name, ID, Date, Time, Branch, Status"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ backgroundColor: "white", width: "300px" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
