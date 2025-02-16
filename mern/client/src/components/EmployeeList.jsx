import { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [selectedLevels]);

  const fetchEmployees = async () => {
    try {
      const query = selectedLevels.length > 0 ? `?levels=${selectedLevels.join(',')}` : '';
      const response = await fetch(`http://localhost:5000/employees${query}`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleLevelChange = (e) => {
    const value = e.target.value;
    setSelectedLevels((prev) =>
      prev.includes(value) ? prev.filter((level) => level !== value) : [...prev, value]
    );
  };

  return (
    <div>
      <h2>Employee Records</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>
              Level
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>▼</button>
              {dropdownOpen && (
                <div>
                  {['Intern', 'Junior', 'Senior'].map((level) => (
                    <label key={level}>
                      <input
                        type="checkbox"
                        value={level}
                        checked={selectedLevels.includes(level)}
                        onChange={handleLevelChange}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
