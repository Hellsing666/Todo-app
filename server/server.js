import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.PORT);

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the PERN Todo API");
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await db.query("SELECT * FROM todo");
    res.json(todos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/todos", async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO todo (description,completed) VALUES ($1,$2) RETURNING *",
      [req.body.description, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.patch("/todos/:id", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE todo SET description = $1, completed = $2 WHERE id = $3 RETURNING *",
      [req.body.description, req.body.completed, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM todo WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
