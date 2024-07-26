const express = require('express');
const path = require('path');
const spaced = require('quantadb');

const app = express();
const port = 3000;

// Initialize the FileDatabase
const db = new spaced.FileDatabase(path.join(__dirname, '../db'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/users', async (req, res) => {
  try {
    const { name, age } = req.body;
    const user = await db.create('users', { name, age });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.read('users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, age } = req.body;
    const updatedUser = await db.update('users', id, { name, age });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.delete('users', id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
