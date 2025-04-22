'use client';

import { useState } from "react";
import CSVUploader from "../components/CSVUploader.js";
import EditableTable from "../components/EditableTable.js";

export default function HomePage(){
  const [csvData, setCsvData] = useState([]); //holds parsed CSV data
  const [unexpected, setUnexpected] = useState([]);//tracks unexpected column headers


  return(
    <main style={{padding:20, textAlign: "center"}}>
      <h1> DayLight Health - Patient CSV Uploader</h1>

      {/* CSV Upload component, sends parsed data and unexpected headers back */}
      <CSVUploader
      onDataParsed={setCsvData}
      onUnexpectedHeaders={setUnexpected}
      />
      <br/>
      {/* Display table only if there is data */}
      {csvData.length > 0 && <EditableTable data={csvData} unexpectedHeaders={unexpected} />}
    </main>
  )
}