import express, { query } from "express";
import multer from "multer";
import xlsx from "xlsx";
import path from "path";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    let collection = await db.collection("records");
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet_name = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

    await collection.insertMany(jsonData);

    res.status(200).json({ message: "File uploaded & data inserted!" });
  } catch (error) {
    res.status(500).json({ error: "Upload failed!", details: error.message });
  }
});

router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/search", async (req, res) => {
  
  const { name, position } = req.query; // Retrieve name and position from query parameters

  try {
    if (!name && !position) {
      return res.status(400).json({ message: "Please provide a name or position to search." });
    }

    let query = [];

    // Add the name filter if it's provided (prefix match using `^`)
    if (name) {
      query.push({ name: { $regex: new RegExp(`^${name}`, 'i') } }); // Case-insensitive match at the beginning
    }

    // Add the position filter if it's provided (prefix match using `^`)
    if (position) {
      query.push({ position: { $regex: new RegExp(`^${position}`, 'i') } }); // Case-insensitive match at the beginning
    }

    let collection = await db.collection("records");
    let results = await collection.find({ $or: query }).toArray();

    if (results.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json(results); // Send the results as a JSON response
  } catch (err) {
    console.error("Error searching for employees:", err);
    res.status(500).json({ error: "Error searching records", details: err.message });
  }
});

// router.get("/:id", async (req, res) => {
//   let collection = await db.collection("records");
//   let query = { _id: new ObjectId(req.params.id) };
 
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

router.post("/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const collection = await db.collection("records");
    await collection.deleteMany({ _id: { $in: ids.map(id => new ObjectId(id)) } });

    res.status(200).json({ message: "Records deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



export default router;