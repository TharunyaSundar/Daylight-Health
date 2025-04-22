import Papa from "papaparse";
import toast from "react-hot-toast";
//Component for uploading and parsing a CSV file.
export default function CSVUploader({ onDataParsed, onUnexpectedHeaders }) {

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
        <div style={{ marginBottom: 20 }}>
            <label htmlFor="csvInput">Upload CSV: </label>{" "}
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "14px",
                }}
            />
        </div>
    );
}
