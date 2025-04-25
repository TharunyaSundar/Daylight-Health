import { useState, useEffect } from "react";
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
    if(!rows || rows.length === 0) return <p>No data to show</p>

    const columns = Object.keys(rows[0]);

    return (
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className={isUnexpected(col)? styles.unexpectedHeaders: ""}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col) => (
                  //hightlights unexpected columns
                  <td key={col} className={isUnexpected(col)? styles.unexpectedCell: ""}>
                    <input
                      value={row[col]}
                      onChange={(e) => handleChange(rowIdx, col, e.target.value)}
                      className={validationErrors[rowIdx]?.[col] ? styles.inputError : ""}
                    />
                    {validationErrors[rowIdx]?.[col] && (
                    <div className={styles.errorMsg}>
                      {validationErrors[rowIdx][col]}
                    </div>
                )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        <button 
        onClick={handleSync} 
        className={styles.syncButton}
        disabled={isSyncing}
        >
          {isSyncing? "Syncing..." : "Sync to CRM"}
        </button>
      </div>
      );      
}