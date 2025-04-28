'use client';

import { Typography, Box, Paper, Container } from "@mui/material";
import { useState } from "react";
import CSVUploader from "../components/Uploader/CSVUploader.jsx";
import EditableTable from "../components/Table/EditableTable.jsx";
import Image from "next/image";

export default function HomePage() {
  const [csvData, setCsvData] = useState([]); // Holds parsed CSV data
  const [unexpected, setUnexpected] = useState([]); // Tracks unexpected column headers

  return (
    <main style={{ backgroundColor: "#FFF0A1", minHeight: "80vh", paddingBottom: "3rem" }}>
      {/* Title Section */}
      <Container maxWidth="md" sx={{ textAlign: "center", py: 3 }}>
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: "#FFFCE1" }}>
          <Image
            src="/daylight_health_logo.png"
            alt="Daylight Health Logo"
            width={80}
            height={80}
            style={{ marginBottom: 10 }}
          />
          <Typography variant="h3" fontWeight="bold" color="#2C2C2C">
            Daylight Health
          </Typography>
          <Typography>More • Good • Days</Typography>
          <Typography variant="subtitle1" color="#555" sx={{ mt: 1 }}>
            Upload your patient data to sync with our system.
          </Typography>
        </Paper>
      </Container>

      {/* CSV Upload component */}
      <Box mt={4}>
        <CSVUploader
          onDataParsed={setCsvData}
          onUnexpectedHeaders={setUnexpected}
        />
      </Box>

      {/* Display table only if there is data */}
      {csvData.length > 0 && (
        <EditableTable data={csvData} unexpectedHeaders={unexpected} />
      )}
    </main>
  );
}
