import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5050/record")
      .then(response => setRecords(response.data))
      .catch(error => console.error("Error fetching records:", error));
  }, []);

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? records.map(record => record._id) : []);
  };

  const handleSelect = (e, id) => {
    setSelectedIds(e.target.checked ? [...selectedIds, id] : selectedIds.filter(selectedId => selectedId !== id));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5050/record/${id}`)
      .then(() => setRecords(records.filter(record => record._id !== id)))
      .catch(error => console.error("Error deleting record:", error));
  };

  const handleBulkDelete = () => {
    axios.post("http://localhost:5050/record/bulk-delete", { ids: selectedIds })
      .then(() => {
        setRecords(records.filter(record => !selectedIds.includes(record._id)));
        setSelectedIds([]);
      })
      .catch(error => console.error("Error deleting records:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "15px", textAlign: "center" }}>Employee Records</h3>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button 
          onClick={handleBulkDelete} 
          disabled={selectedIds.length === 0} 
          style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", cursor: "pointer", borderRadius: "5px" }}
        >
          Delete
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "5%", border: "1px solid #ddd", padding: "12px", backgroundColor: "#f2f2f2", textAlign: "center" }}>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th style={{ width: "25%", border: "1px solid #ddd", padding: "12px", backgroundColor: "#f2f2f2" }}>Name</th>
            <th style={{ width: "25%", border: "1px solid #ddd", padding: "12px", backgroundColor: "#f2f2f2" }}>Position</th>
            <th style={{ width: "20%", border: "1px solid #ddd", padding: "12px", backgroundColor: "#f2f2f2" }}>Level</th>
            <th style={{ width: "25%", border: "1px solid #ddd", padding: "12px", backgroundColor: "#f2f2f2", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
                <input type="checkbox" checked={selectedIds.includes(record._id)} onChange={(e) => handleSelect(e, record._id)} />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{record.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{record.position}</td>
              <td style={{ border: "1px solid #ddd", padding: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{record.level}</td>
              <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button 
                    onClick={() => navigate(`/edit/${record._id}`)} 
                    style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", backgroundColor: "#007bff", color: "white", border: "none" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(record._id)} 
                    style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", backgroundColor: "#dc3545", color: "white", border: "none" }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
