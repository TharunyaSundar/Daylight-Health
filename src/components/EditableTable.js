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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";

//EditableTable Component
export default function EditableTable({data, unexpectedHeaders=[]}){
    const [rows, setRows] = useState([]);
    const [syncedRows, setSyncedRows] = useState([]);
    
    //track syncing state
    const [isSyncing, setIsSyncing]= useState(false);

    //recalculate rows when new data is passed
    useEffect(() => {
      setRows(data);
      setSyncedRows([]);
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
        setSyncedRows(rows.map((_, idx) => idx));
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
    const unsyncRow = (rowIdx) => {
      setSyncedRows((prev) => prev.filter((i) => i !== rowIdx));
    };
    

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
               <TableCell
                  sx={{
                    backgroundColor: "#FFFFFF",
                    color: "#333",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Status
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {rows.map((row, rowIdx) => {
          const isSynced = syncedRows.includes(rowIdx);
          return (
            <TableRow
              key={rowIdx}
              sx={{
                backgroundColor: isSynced ? "#e8f5e9" : "inherit",
                "&:hover": { backgroundColor: "#FFFFFF" },
              }}
            >
              {columns.map((col) => (
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
              <TableCell align="center">
                {isSynced && (
                   <>
                   <Tooltip title="Synced">
                     <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                   </Tooltip>
                   <Button
                     size="small"
                     onClick={() => unsyncRow(rowIdx)}
                     variant="text"
                     sx={{ minWidth: "auto", padding: 0, fontSize: "0.75rem" }}
                   >
                     Edit
                   </Button>
                 </>
                )}
              </TableCell>
            </TableRow>
          );
        })}

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