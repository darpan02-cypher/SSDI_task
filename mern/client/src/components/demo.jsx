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
      const response = await axios.post("http://localhost:5000/upload", formData, {
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



const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/excelDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Define Mongoose Schema
const excelSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});
const ExcelData = mongoose.model("ExcelData", excelSchema);

// Multer Storage Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API Endpoint to Handle Excel Upload
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate Data (Basic)
    if (!jsonData.length) {
      return res.status(400).json({ error: "Empty file uploaded!" });
    }

    // Insert Data into MongoDB
    await ExcelData.insertMany(jsonData);
    res.status(200).json({ message: "File uploaded & data inserted!" });
  } catch (error) {
    res.status(500).json({ error: "Upload failed!", details: error.message });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));