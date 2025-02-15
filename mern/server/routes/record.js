import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This helps convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
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
// This section will help you create a new record.
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


// This section will help you update a record by id.
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

// This section will help you delete a record
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

export default router;