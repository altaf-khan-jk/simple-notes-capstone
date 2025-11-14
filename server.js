
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// GET all notes
app.get("/api/notes", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM notes ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a note
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: "Missing title" });
    await db.run("INSERT INTO notes (title, content) VALUES (?,?)", [title, content || ""]);
    res.status(201).json({ message: "Note added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a note
app.put("/api/notes/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const id = req.params.id;
    await db.run("UPDATE notes SET title=?, content=? WHERE id=?", [title, content, id]);
    res.json({ message: "Note updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove a note
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.run("DELETE FROM notes WHERE id=?", [id]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
