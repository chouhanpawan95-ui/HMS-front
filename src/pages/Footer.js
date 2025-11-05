import React from "react";
import { Box, Typography, Link } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f3fb", // soft lavender tone from your screenshot
        borderTop: "1px solid #e0e0e0",
        py: 2,
        px: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        color: "#6c7293", // muted purple-gray text like in the image
        fontSize: "0.875rem",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          textAlign: { xs: "center", sm: "left" },
          mb: { xs: 1, sm: 0 },
        }}
      >
        © 2023{" "}
        <Link
          href="https://www.bootstrapdash.com/"
          target="_blank"
          underline="hover"
          sx={{ color: "#6c63ff", fontWeight: 500 }}
        >
          BootstrapDash
        </Link>
        . All rights reserved.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          textAlign: { xs: "center", sm: "right" },
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-end" },
          gap: 0.5,
        }}
      >
        Hand-crafted & made with
        <FavoriteIcon sx={{ color: "error.main", fontSize: 16 }} />
      </Typography>
    </Box>
  );
}
