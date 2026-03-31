import { authService } from '../services/authService.js';

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               name:
 *                 type: string
 *                 example: Иван Петров
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Неверные данные или пользователь уже существует
 */
export const authController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password and name are required' });
      }

      const result = await authService.register(email, password, name);
      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'User already exists') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Вход в систему
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: Успешный вход
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 token:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *       401:
   *         description: Неверный email или пароль
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ error: error.message });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * @swagger
   * /me:
   *   get:
   *     summary: Получить профиль текущего пользователя
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Профиль пользователя
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 email:
   *                   type: string
   *                 name:
   *                   type: string
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Пользователь не найден
   */
  async getMe(req, res) {
    try {
      const user = await authService.getProfile(req.userId);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
