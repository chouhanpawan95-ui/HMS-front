import React, { useState, useEffect } from "react";
import { Box, TextField, MenuItem } from "@mui/material";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Name", value: "name" },
  { label: "Patient ID", value: "id" },
  { label: "Date", value: "date" },
  { label: "Branch", value: "branch" },
  { label: "Status", value: "status" },
];

export default function SearchBar({ patients, onFilter }) {
  const [filterType, setFilterType] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    let filtered = [...patients];
    const term = searchValue.toLowerCase();

    if (!term) {
      onFilter(patients);
      return;
    }

    filtered = patients.filter((p) => {
      const fullName =
        `${p.firstName || ""} ${p.lastName || ""}`.trim().toLowerCase();
      const id = (p.patientId || p.id || "").toString().toLowerCase();
      const branch = (p.branch || "").toLowerCase();
      const status = (p.status || "").toLowerCase();

      const dateTime = p.dateTime ? new Date(p.dateTime) : null;
      const dateStr = dateTime ? dateTime.toISOString().slice(0, 10) : "";

      switch (filterType) {
        case "name":
          return fullName.includes(term);
        case "id":
          return id.includes(term);
        case "date":
          return dateStr.includes(term);
        case "branch":
          return branch.includes(term);
        case "status":
          return status.includes(term);
        default:
          return (
            fullName.includes(term) ||
            id.includes(term) ||
            dateStr.includes(term) ||
            branch.includes(term) ||
            status.includes(term)
          );
      }
    });

    onFilter(filtered);
  }, [searchValue, filterType, patients, onFilter]);

  return (
    <Box display="flex" gap={2} alignItems="center">
      {/* Dropdown filter */}
      <TextField
        select
        size="small"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        sx={{ width: 150 }}
      >
        {filterOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Input box */}
      <TextField
        type={filterType === "date" ? "date" : "text"}
        size="small"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={`Search by ${filterType === "all" ? "any field" : filterType}...`}
        sx={{ width: 250, background: "#fff" }}
      />
    </Box>
  );
}
