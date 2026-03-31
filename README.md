# 📝 Task Manager API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6.x-blue?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?style=for-the-badge&logo=docker)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge&logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-Documentation-green?style=for-the-badge&logo=swagger)

**REST API для управления задачами с аутентификацией JWT**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

### 🔐 Аутентификация
- Регистрация и вход пользователей
- JWT токены для защиты API
- Хеширование паролей (bcrypt)

### 📋 Управление задачами
- Создание, чтение, обновление, удаление задач
- Каждый пользователь видит только свои задачи
- Валидация входных данных

### 📚 Документация
- Интерактивная Swagger документация
- Полное описание всех эндпоинтов
- Возможность тестировать API прямо в браузере

### 🐳 DevOps
- Полная контейнеризация с Docker
- Автоматические миграции Prisma
- Health check для сервисов
- Graceful shutdown

---

## 🛠 Tech Stack

| Категория | Технологии |
|-----------|------------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js |
| **Database** | PostgreSQL 15 |
| **ORM** | Prisma |
| **Authentication** | JWT + bcrypt |
| **Validation** | express-validator |
| **Documentation** | Swagger (OpenAPI 3.0) |
| **Containerization** | Docker, Docker Compose |

---

## 🚀 Quick Start

### Требования

- [Docker](https://www.docker.com/products/docker-desktop/) и Docker Compose
- [Node.js](https://nodejs.org/) 20+ (для локальной разработки)
- [Git](https://git-scm.com/)

### Установка и запуск

```bash
# Клонируем репозиторий
git clone https://github.com/YOUR_USERNAME/task-manager-api.git
cd task-manager-api

# Создаем .env файл
cp .env.example .env

# Запускаем через Docker
docker compose up -d
```

### Режим разработки (с горячей перезагрузкой)

```bash
# Устанавливаем зависимости
npm install

# Запускаем PostgreSQL в Docker
docker compose up -d postgres

# Выполняем миграции
npx prisma migrate dev

# Запускаем сервер в режиме разработки
npm run dev
```

### Проверка установки

```bash
# Проверяем health check
curl http://localhost:3000/ping

# Открываем Swagger в браузере
open http://localhost:3000/api-docs
```

---

## 📚 API Documentation

### Эндпоинты аутентификации

| Метод | Эндпоинт | Описание | Требуется токен |
|-------|----------|----------|-----------------|
| POST | `/register` | Регистрация нового пользователя | ❌ |
| POST | `/login` | Вход пользователя | ❌ |
| GET | `/me` | Получить профиль текущего пользователя | ✅ |

### Эндпоинты задач

| Метод | Эндпоинт | Описание | Требуется токен |
|-------|----------|----------|-----------------|
| GET | `/tasks` | Получить все задачи пользователя | ✅ |
| GET | `/tasks/:id` | Получить задачу по ID | ✅ |
| POST | `/tasks` | Создать новую задачу | ✅ |
| PUT | `/tasks/:id` | Обновить задачу | ✅ |
| DELETE | `/tasks/:id` | Удалить задачу | ✅ |

### Примеры запросов

#### Регистрация пользователя

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456",
    "name": "Иван Петров"
  }'
```

**Ответ:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван Петров"
  }
}
```

#### Вход в систему

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456"
  }'
```

**Ответ:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван Петров"
  }
}
```

#### Создание задачи (с JWT токеном)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Изучить Docker",
    "completed": false
  }'
```

**Ответ:**
```json
{
  "id": 1,
  "title": "Изучить Docker",
  "completed": false,
  "userId": 1,
  "createdAt": "2026-03-31T20:35:07.000Z",
  "updatedAt": "2026-03-31T20:35:07.000Z"
}
```

#### Получение всех задач

```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 Project Structure

```
task-manager-api/
├── controllers/           # Обработчики запросов
│   ├── authController.js
│   └── taskController.js
├── services/              # Бизнес-логика
│   ├── authService.js
│   └── taskService.js
├── middleware/            # Промежуточные обработчики
│   ├── auth.js
│   └── errorHandler.js
├── validators/            # Валидация входных данных
│   ├── authValidator.js
│   └── taskValidator.js
├── prisma/                # Схема БД и миграции
│   ├── schema.prisma
│   └── migrations/
├── index.js               # Точка входа приложения
├── Dockerfile             # Конфигурация Docker образа
├── docker-compose.yml     # Оркестрация контейнеров
├── .env.example           # Шаблон переменных окружения
└── package.json           # Зависимости и скрипты
```

---

## 🐳 Docker Commands

```bash
# Запуск всех сервисов
docker compose up -d

# Просмотр логов
docker compose logs -f

# Просмотр логов конкретного сервиса
docker compose logs -f app
docker compose logs -f postgres

# Остановка всех сервисов
docker compose down

# Полная очистка (с удалением данных БД)
docker compose down -v

# Перезапуск приложения
docker compose restart app

# Вход в контейнер приложения
docker exec -it task-manager-app sh

# Вход в контейнер PostgreSQL
docker exec -it task-manager-postgres psql -U postgres -d taskmanager
```

---

## 📊 Database Schema

### Модель User

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  tasks     Task[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}
```

### Модель Task

```prisma
model Task {
  id        Int       @id @default(autoincrement())
  title     String
  completed Boolean   @default(false)
  userId    Int       @map("user_id")
  user      User      @relation(fields: [userId], references: [id])
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  
  @@map("tasks")
}
```

### ER Диаграмма

```
┌─────────────┐         ┌─────────────┐
│    User     │         │    Task     │
├─────────────┤         ├─────────────┤
│ id (PK)     │◄───────│ userId (FK) │
│ email       │         │ id (PK)     │
│ password    │         │ title       │
│ name        │         │ completed   │
│ created_at  │         │ created_at  │
│ updated_at  │         │ updated_at  │
└─────────────┘         └─────────────┘
```

---

## 🔒 Environment Variables

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `PORT` | Порт сервера | `3000` |
| `DATABASE_URL` | Строка подключения к PostgreSQL | `postgresql://postgres:postgres@postgres:5432/taskmanager` |
| `JWT_SECRET` | Секретный ключ для JWT | `super_secret_key_change_me` |

---

## 🚀 Deployment

### Деплой на VPS с Docker

```bash
# На сервере
git clone https://github.com/YOUR_USERNAME/task-manager-api.git
cd task-manager-api
cp .env.example .env

# Редактируем .env с production значениями
nano .env

# Запускаем
docker compose up -d

# Настраиваем Nginx (опционально)
sudo nano /etc/nginx/sites-available/task-manager
```

### Деплой на Railway

1. Запушьте код на GitHub
2. На [Railway.app](https://railway.app) создайте новый проект
3. Выберите "Deploy from GitHub repo"
4. Добавьте переменные окружения
5. Готово!

### Деплой на Render

1. Запушьте код на GitHub
2. На [Render.com](https://render.com) создайте новый Web Service
3. Подключите репозиторий
4. Укажите команду запуска: `npm start`
5. Добавьте переменные окружения

---

## 🧪 Testing

```bash
# Запуск E2E тестов
npm run test:e2e

# Запуск с покрытием
npm run test:coverage
```

---

## 📄 License

MIT © [Mukcep322](https://github.com/Mukcep322)

---

## 📞 Contact

- **GitHub**: [@Mukcep322](https://github.com/Mukcep322)
- **Email**: tldver2@gmail.com

---

<div align="center">
  Made with ❤️ using Node.js
</div>
