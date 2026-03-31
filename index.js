import express from 'express';
import dotenv from 'dotenv';  
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config();  

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); 

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });  
});

app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.log('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },  
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tasks', auth, async (req, res) => {
  try {
    const { title, completed = false } = req.body; 

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });  
    }

    const task = await prisma.task.create({
      data: {
        title,
        completed,  
        userId: req.userId
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.log('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    console.log('Get tasks error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/tasks/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.userId
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);  
  } catch (error) {
    console.log('Get tasks error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/tasks/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const taskId = parseInt(id);  

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });  
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title !== undefined ? title : existingTask.title,
        completed: completed !== undefined ? completed : existingTask.completed
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.log('Update task error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});