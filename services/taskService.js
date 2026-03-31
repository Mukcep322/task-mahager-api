import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const taskService = {
  // Создание задачи
  async createTask(userId, title, completed = false) {
    if (!title) {
      throw new Error('Title is required');
    }

    const task = await prisma.task.create({
      data: {
        title,
        completed,
        userId
      }
    });

    return task;
  },

  // Получение всех задач пользователя
  async getAllTasks(userId) {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return tasks;
  },

  // Получение задачи по ID
  async getTaskById(userId, taskId) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  },

  // Обновление задачи
  async updateTask(userId, taskId, updates) {
    // Проверяем существование задачи
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Обновляем
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: updates.title !== undefined ? updates.title : existingTask.title,
        completed: updates.completed !== undefined ? updates.completed : existingTask.completed
      }
    });

    return updatedTask;
  },

  // Удаление задачи
  async deleteTask(userId, taskId) {
    // Проверяем существование задачи
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Удаляем
    await prisma.task.delete({
      where: { id: taskId }
    });

    return { message: 'Task deleted successfully' };
  }
};