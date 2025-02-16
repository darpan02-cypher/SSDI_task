import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/employeesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  level: String,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Fetch employees with optional filtering
app.get('/employees', async (req, res) => {
  const { levels } = req.query;
  let query = {};
  
  if (levels) {
    query.level = { $in: levels.split(',') }; // Convert query string to an array
  }

  try {
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
