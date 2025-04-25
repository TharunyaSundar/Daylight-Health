import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Typography,
  Box
} from "@mui/material";
import styles from "./EditableTable.module.css"
import toast from "react-hot-toast";
import validateRows from "../utils/validateRows.js";

//EditableTable Component
export default function EditableTable({data, unexpectedHeaders=[]}){
    const [rows, setRows] = useState([]);
    
    //track syncing state
    const [isSyncing, setIsSyncing]= useState(false);

    //recalculate rows when new data is passed
    useEffect(() => {
      setRows(data);
    }, [data]);

    // Highlight unexpected columns
    const isUnexpected = (col) => unexpectedHeaders.includes(col);

    const handleChange = (rowIdx, key, value) => {
        const updated = [...rows];
        updated[rowIdx][key] = value;
        setRows(updated);
    };

    const [validationErrors, setValidationErrors] = useState({});

    //Sync data to CRM
    const handleSync = async () => {

      const error = validateRows(data);
      if(error){
        setValidationErrors(error);
        return;
      }

      setValidationErrors({});

      setIsSyncing(true); //Disable button
      const syncToast = toast.loading("Syncing to CRM...");

      try{
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rows),
        });

        const result = await res.json();
        console.table(rows);
        toast.success("Sync successful!", { id: syncToast });

      }catch(err){
        if(err.name === "TypeError"){
          toast.error("Network error. Please check your connection.",{id: syncToast});
        } else{
          toast.error("Sync Failed. Try again.",{id: syncToast});
        }
        console.log("Sync failed", err);
      } finally{
        setIsSyncing(false); //Re-enable button
      }
    };

    //display parsed CSV data in an editable table format
    if(!rows || rows.length === 0) return <Typography>No data to show.</Typography>

    const columns = Object.keys(rows[0]);

    return (
      <div className={styles.tableWrapper}>
        <Paper 
        elevation={3}
        sx={{ marginTop: 4, 
        padding: 3,
        borderRadius: 2,
        backgroundColor: "#FFFCE1",
        fontFamily: "Roboto, sans-serif",
        maxWidth: "1100px",      
        mx: "auto"  
        }}>
          <Box sx={{ overflowX: "auto" }}>
          <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                key={col} 
                sx={{
                  backgroundColor: "#FFFFFF",
                  color: "#333",               
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "capitalize"
                }}
              >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}
              sx={{
                "&:hover": { backgroundColor: "#FFFFFF" }
              }}
              >
                {columns.map((col) => (
                  //hightlights unexpected columns
                  <TableCell key={col}>
                    <TextField
                     fullWidth
                      value={row[col]}
                      onChange={(e) => handleChange(rowIdx, col, e.target.value)}
                      error={!!validationErrors[rowIdx]?.[col]}
                      helperText={validationErrors[rowIdx]?.[col]}
                      variant="outlined"
                      size="small"
                  />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>        
      <Button
        variant="contained"
        sx={{ 
          marginTop: 3,
          backgroundColor: "#1976d2",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#1565c0"
          },
          display: "block",
          mx: "auto"
        }}
        onClick={handleSync}
        disabled={isSyncing}
      >
        {isSyncing ? "Syncing..." : "Sync to CRM"}
      </Button>
      </Paper>
      </div>
      );      
}