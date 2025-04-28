import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Paper, Typography, Box } from "@mui/material";
import styles from "./EditableTable.module.css";
import { handleChange, handleSync, unsyncRow } from "../../utils/handleTableActions.js";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function EditableTable({ data }) {
  const [rows, setRows] = useState([]);
  const [syncedRows, setSyncedRows] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setRows(data);
    setSyncedRows([]);
  }, [data]);

  if (!rows.length) return <Typography>No data to show.</Typography>;

  const columns = Object.keys(rows[0]);

  return (
    <div className={styles.tableWrapper}>
      <Paper elevation={3} sx={{ marginTop: 4, padding: 3, borderRadius: 2, backgroundColor: "#FFFCE1", maxWidth: "1100px", mx: "auto" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col} sx={{ backgroundColor: "#FFFFFF", fontWeight: "bold" }}>
                    {col}
                  </TableCell>
                ))}
                <TableCell sx={{ backgroundColor: "#FFFFFF", fontWeight: "bold", textAlign: "center" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  sx={{
                    backgroundColor: syncedRows.includes(rowIdx) ? "#e8f5e9" : "inherit",
                    "&:hover": { backgroundColor: "#FFFFFF" },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col}>
                      <TextField
                        fullWidth
                        value={row[col]}
                        onChange={(e) => {
                          const updated = handleChange(rows, rowIdx, col, e.target.value);
                          setRows(updated);
                        }}
                        error={!!validationErrors[rowIdx]?.[col]}
                        helperText={validationErrors[rowIdx]?.[col]}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    {syncedRows.includes(rowIdx) && (
                      <>
                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                        <Button
                          size="small"
                          onClick={() => setSyncedRows((prev) => unsyncRow(prev, rowIdx))}
                          variant="text"
                          sx={{ minWidth: "auto", padding: 0, fontSize: "0.75rem" }}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Button
          variant="contained"
          sx={{ marginTop: 3, backgroundColor: "#1976d2", fontWeight: "bold", mx: "auto", display: "block" }}
          onClick={() => handleSync(rows, setSyncedRows, setIsSyncing, setValidationErrors)}
          disabled={isSyncing || rows.length === 0}
        >
          {isSyncing ? "Syncing..." : "Sync to CRM"}
        </Button>
      </Paper>
    </div>
  );
}
