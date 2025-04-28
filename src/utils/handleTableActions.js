import toast from "react-hot-toast";
import validateRows from "../utils/validateRows.js";

/**
 * Handles updating a specific cell value.
 */
export function handleChange(rows, rowIdx, key, value) {
  const updated = [...rows];
  updated[rowIdx][key] = value;
  return updated; 
}

/**
 * Handles syncing rows to the CRM after validation.
 */
export async function handleSync(rows, setSyncedRows, setIsSyncing, setValidationErrors) {
  const error = validateRows(rows);
  if (error) {
    setValidationErrors(error);
    return;
  }
  setValidationErrors({});

  setIsSyncing(true);
  const syncToast = toast.loading("Syncing to CRM...");

  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows),
    });

    const result = await res.json();
    console.table(rows);

    if (!res.ok) throw new Error(result.error || "Sync failed");

    toast.success("Sync successful!", { id: syncToast });

    setSyncedRows(rows.map((_, idx) => idx)); 
  } catch (err) {
    if (err.name === "TypeError") {
      toast.error("Network error. Please check your connection.", { id: syncToast });
    } else {
      toast.error("Sync Failed. Try again.", { id: syncToast });
    }
    console.error("Sync failed", err);
  } finally {
    setIsSyncing(false);
  }
}

/**
 * Removes a row from the synced list (allows editing again).
 */
export function unsyncRow(prev, rowIdx) {
  return prev.filter((idx) => idx !== rowIdx);
}
