import Papa from "papaparse";
import toast from "react-hot-toast";
import Button from '@mui/material/Button';
import styles from "./CSVUploader.module.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRef } from "react";
import Image from "next/image"; 
import Paper from "@mui/material/Paper";


//Component for uploading and parsing a CSV file.
export default function CSVUploader({ onDataParsed, onUnexpectedHeaders }) {
    const fileInputRef = useRef();
    const MAX_FILE_SIZE_MB = 5;

    const handleFileChange = (e) => {
        
        try {
            const file = e.target.files?.[0];

            //validate file type
            if (!file || file.type !== "text/csv") {
                toast.error("Invalid file type. Please upload a .csv file.");
                return;
            }

            //Validate file size
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                toast.error(`CSV file too large. Max allowed size is ${MAX_FILE_SIZE_MB}MB.`);
                return;
            }

            //parsing CSV using PapaParse
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const data = result.data;

                    if (!data || data.length === 0 || Object.keys(data[0]).length === 0) {
                        toast.error("Empty or malformed CSV. Please upload a valid file.");
                        return;
                    }

                    //extracting unexpected headers and sends them to parent
                    const expectedHeaders = ["EHR ID", "Patient Name", "Email", "Phone", "Referring Provider"];
                    const uploadedHeaders = Object.keys(data[0]);
                    const unknownHeaders = uploadedHeaders.filter(h => !expectedHeaders.includes(h));

                    onUnexpectedHeaders(unknownHeaders); 

                    if (unknownHeaders.length > 0) {
                        toast.error("Unexpected Columns: " + unknownHeaders.join(", "));
                    }


                    //send parsed data to parent component
                    if (data.length > 100) {
                        toast("Showing first 100 rows for performance.");
                        onDataParsed(data.slice(0, 100));
                    } else {
                        onDataParsed(data);
                    }

                    console.log("Parsed CSV:", data);
                },
                error: (err) => {
                    console.error("CSV Parse Error", err);
                    toast.error("Failed to parse CSV. Please try a different file.");
                }
            });

        } catch (err) {
            console.error("Unexpected error during file processing:", err);
            toast.error("Something went wrong. Please try a different CSV file.");
        }
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
        {/* Custom Upload Icon */}
      <Box display="flex" justifyContent="center" >
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
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </Paper>
    );
}
