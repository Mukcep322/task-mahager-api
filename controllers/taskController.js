
import { taskService } from '../services/taskService.js';

export const taskController = {
  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Создать новую задачу
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 example: Изучить Node.js
   *               completed:
   *                 type: boolean
   *                 example: false
   *     responses:
   *       201:
   *         description: Задача создана
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 title:
   *                   type: string
   *                 completed:
   *                   type: boolean
   *                 userId:
   *                   type: integer
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Не указан заголовок
   *       401:
   *         description: Не авторизован
   */
  async create(req, res) {
    try {
      const { title, completed } = req.body;
      const task = await taskService.createTask(req.userId, title, completed);
      res.status(201).json(task);
    } catch (error) {
      if (error.message === 'Title is required') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: Получить все задачи пользователя
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список задач
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   title:
   *                     type: string
   *                   completed:
   *                     type: boolean
   *                   userId:
   *                     type: integer
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *       401:
   *         description: Не авторизован
   */
  async getAll(req, res) {
    try {
      const tasks = await taskService.getAllTasks(req.userId);
      res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /tasks/{id}:
   *   get:
   *     summary: Получить задачу по ID
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID задачи
   *     responses:
   *       200:
   *         description: Данные задачи
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 title:
   *                   type: string
   *                 completed:
   *                   type: boolean
   *                 userId:
   *                   type: integer
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       404:
   *         description: Задача не найдена
   *       401:
   *         description: Не авторизован
   */
  async getById(req, res) {
    try {
      const taskId = parseInt(req.params.id);
      const task = await taskService.getTaskById(req.userId, taskId);
      res.json(task);
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Get task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /tasks/{id}:
   *   put:
   *     summary: Обновить задачу
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID задачи
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 example: Обновленный заголовок
   *               completed:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Задача обновлена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 title:
   *                   type: string
   *                 completed:
   *                   type: boolean
   *                 userId:
   *                   type: integer
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       404:
   *         description: Задача не найдена
   *       401:
   *         description: Не авторизован
   */
  async update(req, res) {
    try {
      const taskId = parseInt(req.params.id);
      const { title, completed } = req.body;
      const updatedTask = await taskService.updateTask(req.userId, taskId, { title, completed });
      res.json(updatedTask);
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Удалить задачу
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID задачи
   *     responses:
   *       200:
   *         description: Задача удалена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Task deleted successfully
   *       404:
   *         description: Задача не найдена
   *       401:
   *         description: Не авторизован
   */
  async delete(req, res) {
    try {
      const taskId = parseInt(req.params.id);
      const result = await taskService.deleteTask(req.userId, taskId);
      res.json(result);
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
