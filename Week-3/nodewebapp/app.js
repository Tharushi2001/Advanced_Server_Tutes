const express = require('express');
const userService = require('./userService');

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/users', async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const id = await userService.addUser(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await userService.updateUser(req.params.id, req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await userService.deleteUser(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
