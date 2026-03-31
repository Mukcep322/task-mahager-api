import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { auth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authController } from './controllers/authController.js';
import { taskController } from './controllers/taskController.js';

import {validateRegister, validateLogin} from './validators/authValidator.js'
import {validateCreateTask, validateTaskId, validateUpdateTask} from './validators/taskValidator.js'

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// ========== SWAGGER ==========
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'REST API для управления задачами',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== HEALTH CHECK ==========
app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// ========== AUTH ROUTES ==========
app.post('/register',validateRegister, authController.register);
app.post('/login',validateLogin, authController.login);
app.get('/me', auth, authController.getMe);

// ========== TASK ROUTES ==========
app.get('/tasks', auth, taskController.getAll);
app.get('/tasks/:id', auth, validateTaskId,taskController.getById);
app.post('/tasks', auth, validateCreateTask, taskController.create);
app.put('/tasks/:id', auth, validateUpdateTask, taskController.update);
app.delete('/tasks/:id', auth, validateTaskId, taskController.delete);

// ========== ERROR HANDLER ==========
app.use(errorHandler);

// ========== START SERVER ==========
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`Health check: http://localhost:${PORT}/ping`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n Shutting down...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});