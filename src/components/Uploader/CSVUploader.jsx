"use client";

import { useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import { checkforCSVFile } from "@/utils/checkforCSVFile";

export default function CSVUploader({ onDataParsed }) {
    const fileInputRef = useRef();

    const selectFile = (e) => {
        const file = e.target.files?.[0];
        checkforCSVFile(file, onDataParsed);
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 4,
                textAlign: "center",
                border: "2px dashed #ccc",
                backgroundColor: "#FFFCE1",
                maxWidth: 300,
                maxHeight: 200,
                mx: "auto",
                borderRadius: 3,
            }}
        >
            <Box display="flex" justifyContent="center">
                <Image src="/upload.png" alt="Upload Icon" width={50} height={50} />
            </Box>

            <Typography variant="h6" color="primary" fontWeight="500">
                Drop your CSV file here
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                or
            </Typography>

            <Button variant="contained" onClick={() => fileInputRef.current.click()}>
                Browse Files
            </Button>

            <input
                type="file"
                id="csvInput"
                accept=".csv"
                onChange={selectFile}
                ref={fileInputRef}
                style={{ display: "none" }}
            />
        </Paper>
    );
}
