# Student Balance Application - Setup Guide

Complete guide to set up and run the Time Management and Student Life Balance Application.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager

**That's it!** No database setup required - we use SQLite which is file-based and comes bundled with Prisma.

## Installation

### 1. Clone the Repository
```bash
cd project-adam
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Database Setup

**Good news!** The database is already configured and ready to use with SQLite.

### 1. Initialize Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma migrate dev --name init

# Seed with sample activities
npm run prisma:seed
```

This creates a `dev.db` file in the backend folder with all tables and sample data.

### 2. Verify Database Setup (Optional)

Open Prisma Studio to view your database:
```bash
npm run prisma:studio
```

This will open a browser window at `http://localhost:5555` where you can view your database tables and data.

## Running the Application

You'll need two terminal windows - one for backend, one for frontend.

### Terminal 1: Start Backend Server

```bash
cd backend
npx ts-node src/server.ts
```

The backend API will start on `http://localhost:3001`

You should see:
```
Database connected successfully
Server is running on port 3001
Environment: development
```

### Terminal 2: Start Frontend Application

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

You should see:
```
  VITE v5.4.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the login page. Click "Register here" to create a new account.

## Project Structure

```
project-adam/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth & error handling
│   │   ├── services/         # Business logic
│   │   ├── config/           # Configuration files
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Sample data
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API & auth services
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Available Scripts

### Backend Scripts

```bash
npx ts-node src/server.ts    # Start development server
npm run build                # Build for production
npm run start                # Start production server
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Run database migrations
npm run prisma:studio        # Open Prisma Studio
npm run prisma:seed          # Seed database with sample data
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securepassword",
  "name": "John Doe",
  "university": "University Name",
  "year": 2,
  "major": "Computer Science"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "jwt-token",
  "user": { ... }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Schedule Endpoints

```http
GET    /api/schedules              # Get all schedules
GET    /api/schedules/today        # Get today's schedule
GET    /api/schedules/:id          # Get specific schedule
POST   /api/schedules              # Create schedule
PUT    /api/schedules/:id          # Update schedule
DELETE /api/schedules/:id          # Delete schedule
```

### Task Endpoints

```http
GET    /api/tasks                  # Get all tasks
GET    /api/tasks/upcoming         # Get upcoming deadlines
POST   /api/tasks                  # Create task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
```

### Mood Endpoints

```http
GET    /api/mood                   # Get mood entries
GET    /api/mood/latest            # Get latest entry
GET    /api/mood/stats             # Get mood statistics
POST   /api/mood                   # Create mood entry
```

### Activity Endpoints

```http
GET    /api/activities             # Get all activities
GET    /api/activities/recommended # Get recommended activities
GET    /api/activities/stats       # Get activity statistics
GET    /api/activities/user        # Get user's activity history
POST   /api/activities/log         # Log completed activity
```

## Features Implemented

### ✅ Core Features

1. **User Authentication**
   - Registration and login
   - JWT-based authentication
   - Profile management

2. **Schedule Management**
   - Create, read, update, delete schedules
   - Support for different event types (CLASS, STUDY, BREAK, SOCIAL, EXERCISE)
   - Recurring events
   - Today's schedule view

3. **Task Management**
   - Create and manage tasks
   - Priority levels (LOW, MEDIUM, HIGH, URGENT)
   - Status tracking (TODO, IN_PROGRESS, COMPLETED)
   - Upcoming deadlines view

4. **Mood Tracking**
   - Log daily mood and stress levels
   - Add notes and activities
   - Track sleep hours
   - View mood statistics and trends
   - 7-day mood analysis

5. **Activity Recommendations**
   - Pre-seeded wellness activities
   - Personalized recommendations based on stress levels
   - Activity logging and tracking
   - Multiple categories (EXERCISE, MEDITATION, SOCIAL, etc.)

6. **Relaxation Techniques**
   - Database of relaxation techniques
   - Step-by-step instructions
   - Categorized by type and difficulty

### 🎨 User Interface

- Clean, modern design with Tailwind CSS
- Responsive layout
- Dashboard with quick statistics
- Intuitive navigation
- Real-time notifications

## Common Issues & Solutions

### Issue: Port Already in Use (Port 3001 or 5173)

**Solution**: Kill the process using the port:
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

Or change the port in `.env` files and restart.

### Issue: Prisma Client Not Generated

**Solution**: Generate the Prisma Client:
```bash
cd backend
npx prisma generate
```

### Issue: Database File Locked

**Solution**: Close all connections to the database:
```bash
cd backend
rm dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

### Issue: Module Not Found Errors

**Solution**: Reinstall dependencies:
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

## Development Tips

1. **Prisma Studio**: Use `npm run prisma:studio` to visually inspect and edit database records at `http://localhost:5555`

2. **Database Location**: The SQLite database file is at `backend/dev.db` - you can back it up or delete it to start fresh

3. **Hot Reload**: Frontend supports hot reload. Backend requires manual restart (Ctrl+C and restart)

4. **Database Changes**: After modifying `schema.prisma`, run:
   ```bash
   npx prisma migrate dev --name your_migration_name
   npx prisma generate
   ```

5. **Testing API**: Use tools like Postman, Thunder Client, or curl to test API endpoints

6. **Logs**: Check terminal output for errors and debugging information

7. **Reset Database**: To start with a fresh database:
   ```bash
   cd backend
   rm dev.db
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

## Next Steps

After successfully running the application:

1. Register a new account
2. Explore the dashboard
3. Create some schedules and tasks
4. Log your mood
5. Try recommended activities
6. Customize your profile

## Support

For issues or questions:
- Check the error messages in terminal
- Review the console in browser DevTools
- Ensure all prerequisites are installed
- Verify database connection
- Check that both servers are running

## Future Enhancements

Potential features to add:
- Email notifications for reminders
- Calendar export/import (iCal format)
- Data visualization with charts
- Mobile app version
- Social features (study groups)
- Integration with university systems
- AI-powered activity recommendations
- Habit tracking
- Pomodoro timer integration

---

**Happy Coding! 🚀**
