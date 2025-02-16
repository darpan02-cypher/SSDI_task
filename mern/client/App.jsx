import { useState } from 'react';
import './App.css';  // Ensure this file includes necessary styles
import mongodbLogo from './assets/mongodb.svg';  // Import the MongoDB logo

const App = () => {
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const employees = [
    { name: 'Charlie Lee', position: 'Intern', level: 'Intern' },
    { name: 'Diana Prince', position: 'Designer', level: 'Junior' },
    { name: 'Evan Wright', position: 'Analyst', level: 'Junior' },
    { name: 'YP', position: 'CEO', level: 'Senior' },
    // Add more employees here
  ];

  // Filter employees based on selected levels
  const filteredEmployees = employees.filter(emp =>
    selectedLevels.length === 0 || selectedLevels.includes(emp.level)
  );

  // Handle checkbox change for dropdown
  const handleLevelChange = (e) => {
    const value = e.target.value;
    setSelectedLevels((prevSelectedLevels) =>
      prevSelectedLevels.includes(value)
        ? prevSelectedLevels.filter((level) => level !== value)
        : [...prevSelectedLevels, value]
    );
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="App">
      {/* MongoDB Logo */}
      <img src={mongodbLogo} alt="MongoDB Logo" className="mongodb-logo" />

      {/* Button for creating a new employee */}
      <button className="create-employee-button">Create Employee</button>

      {/* Table and other content here */}
      <div className="employee-actions-container">
        <button className="delete-employee-button">Delete</button>
      </div>

      {/* Employee Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>
              Level
              {/* Down arrow to toggle dropdown with checkboxes */}
              <button className="dropdown-button" onClick={toggleDropdown}>
                ▼
              </button>

              {/* Dropdown with checkboxes */}
              <div className={`dropdown-content ${dropdownOpen ? 'dropdown-active' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    value="Intern"
                    checked={selectedLevels.includes('Intern')}
                    onChange={handleLevelChange}
                  />
                  Intern
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Junior"
                    checked={selectedLevels.includes('Junior')}
                    onChange={handleLevelChange}
                  />
                  Junior
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Senior"
                    checked={selectedLevels.includes('Senior')}
                    onChange={handleLevelChange}
                  />
                  Senior
                </label>
              </div>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={index}>
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

export default App;
