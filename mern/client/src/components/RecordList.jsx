import React, { useState, useEffect } from "react";

const RecordList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, [selectedLevels]);

  const fetchEmployees = async () => {
    try {
      let url = "/api/employees";
      if (selectedLevels.length > 0) {
        url += `?level=${selectedLevels.join(",")}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleLevelChange = (event) => {
    const value = event.target.value;
    setSelectedLevels((prev) =>
      prev.includes(value) ? prev.filter((l) => l !== value) : [...prev, value]
    );
  };

  return (
    <div>
      <h2>Employee Records</h2>
      <input type="text" placeholder="Search" />
      <select multiple onChange={handleLevelChange}>
        <option value="Intern">Intern</option>
        <option value="Junior">Junior</option>
        <option value="Senior">Senior</option>
      </select>
      <button onClick={fetchEmployees}>Filter</button>
      <table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Position</th>
      <th>Level</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {employees.map((employee) => (
      <tr key={employee._id}>
        <td>{employee.name}</td>
        <td>{employee.position}</td>
        <td>{employee.level}</td>
        <td>
          <button>Edit</button>
          <button>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default RecordList;
