import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.readAsBinaryString(uploadedFile);
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setData(sheetData.slice(0, 10)); // Show preview of first 10 rows
    };
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5050/record/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .csv" onChange={handleFileUpload} />
      {data.length > 0 && (
        <div>
          <h3>Preview (First 10 Rows)</h3>
          <table border="1">
            <thead>
              <tr>{Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpload}>Confirm Upload</button>
        </div>
      )}
    </div>
  );
}

export default ExcelUploader;