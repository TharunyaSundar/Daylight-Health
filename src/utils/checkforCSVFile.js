import Papa from "papaparse";
import toast from "react-hot-toast";



export function checkforCSVFile(file, onDataParsed) {
    const MAX_FILE_SIZE_MB = 5;
    // Validate file type and size
    if (!file || file.type !== "text/csv") {
        toast.error("Invalid file type. Please upload a .csv file.");
        return;
    }
    
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`CSV file too large. Max allowed size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
    }

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
            const data = result.data;

            if (!data || data.length === 0 || Object.keys(data[0]).length === 0) {
                toast.error("Empty or malformed CSV. Please upload a valid file.");
                return;
            }

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
}
