import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  level: String,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;  // ✅ Export as an ES module
