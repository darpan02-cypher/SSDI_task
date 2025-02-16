import express from "express";

const router = express.Router();

const employees = [
  { id: 1, name: "Charlie Lee", position: "Intern", level: "Intern" },
  { id: 2, name: "Diana Prince", position: "Designer", level: "Junior" },
  { id: 3, name: "Evan Wright", position: "Analyst", level: "Junior" },
  { id: 4, name: "Hannah King", position: "Designer", level: "Junior" },
  { id: 5, name: "Ian Carter", position: "Designer", level: "Junior" },
  { id: 6, name: "Jane Doe", position: "Analyst", level: "Junior" },
  { id: 7, name: "YP", position: "CEO", level: "Senior" },
];

// API to get employee records with filtering
router.get("/employees", (req, res) => {
  const { level } = req.query;
  if (level) {
    const filtered = employees.filter((emp) => emp.level === level);
    return res.json(filtered);
  }
  res.json(employees);
});

export default router;
