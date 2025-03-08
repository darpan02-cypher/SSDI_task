
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const EmployeeSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", position: "", level: "" });

  const handleSearch = async () => {
    if (query.trim() === "") {
      setResults([]);
      setError("Please enter a search term.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5050/record/search?name=${query}&position=${query}`
      );
      console.log(response);

      if (response.data.length === 0) {
        setResults([]);
        setError("No employees found.");
      } else {
        setResults(response.data);
        setError("");
      }
    } catch (error) {
      console.error("Error searching for employees:", error);
      setResults([]);
      setError("Error retrieving data. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5050/record/${id}`);
      setResults(results.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting employee.");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee._id);
    setEditForm({ name: employee.name, position: employee.position, level: employee.level });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.patch(`http://localhost:5050/record/${id}`, editForm);
      setResults(
        results.map((employee) =>
          employee._id === id ? { ...employee, ...editForm } : employee
        )
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Error updating employee.");
    }
  };

  return (
    <div className="employee-search">
      {/* Search Bar (aligned left) */}
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or position"
          className="search-input"
        />
        <button onClick={handleSearch} className="button search-button">
          <FaSearch /> Search
        </button>
        {query && (
          <button onClick={handleClear} className="button clear-button">
            Clear
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((employee) => (
              <tr key={employee._id}>
                {editingEmployee === employee._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="position"
                        value={editForm.position}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <select
                        name="level"
                        value={editForm.level}
                        onChange={handleEditChange}
                      >
                        <option value="Senior">Senior</option>
                        <option value="Junior">Junior</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </td>
                    <td className="action-buttons">
                      <button className="button save" onClick={() => handleUpdate(employee._id)}>
                        Save
                      </button>
                      <button className="button cancel" onClick={() => setEditingEmployee(null)}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{employee.name || "N/A"}</td>
                    <td>{employee.position || "N/A"}</td>
                    <td>{employee.level || "N/A"}</td>
                    <td className="action-buttons">
                      <button className="button edit" onClick={() => handleEdit(employee)}>
                        Edit
                      </button>
                      <button className="button delete" onClick={() => handleDelete(employee._id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>
        {`
          .employee-search {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-top: 20px;
            padding: 0 20px;
          }

          .search-bar {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .search-input {
            width: 300px;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .button {
            padding: 10px 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            background: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .button:hover {
            background: #f1f1f1;
          }

          .results-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
          }

          .results-table th, .results-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }

          .results-table th {
            background-color: #4CAF50;
            color: white;
          }

          .action-buttons {
            display: flex;
            gap: 10px;
          }

          .button.edit, .button.delete {
            display: inline-block;
          }
        `}
      </style>
    </div>
  );
};
// DF004 changes reflected
export default EmployeeSearch;
