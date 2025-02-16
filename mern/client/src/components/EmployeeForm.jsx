import { useState } from 'react';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [level, setLevel] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !position || !level) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, level }),
      });

      if (response.ok) {
        setName('');
        setPosition('');
        setLevel('');
        onEmployeeAdded();
      } else {
        console.error('Error adding employee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Select Level</option>
        <option value="Intern">Intern</option>
        <option value="Junior">Junior</option>
        <option value="Senior">Senior</option>
      </select>
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default EmployeeForm;
