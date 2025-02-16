import React from 'react';

const Record = ({ employee, onLevelChange }) => {
  return (
    <tr>
      <td className="border-b p-2">{employee.name}</td>
      <td className="border-b p-2">{employee.position}</td>
      <td className="border-b p-2">
        <select
          value={employee.level}
          onChange={(e) => onLevelChange(e, employee.id)}
          className="p-2"
        >
          <option value="Intern">Intern</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
      </td>
    </tr>
  );
};

export default Record;
