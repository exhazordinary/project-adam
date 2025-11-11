# Student Balance - Time Management & Wellness Application

A comprehensive web application designed to help university students manage their daily schedules while maintaining a healthy balance between academic tasks, social activities, and mental health.

## Overview

Student Balance is a full-stack application that combines time management with wellness tracking to help students:
- Organize their schedules and academic tasks
- Track and improve their mental health
- Discover and engage in wellness activities
- Maintain a balanced student life

## Key Features

### 📅 Automated Scheduling
- Calendar integration for classes, study sessions, and breaks
- Support for recurring events
- Conflict detection
- Multiple event types (CLASS, STUDY, BREAK, SOCIAL, EXERCISE)

### ✅ Task Management
- Create and organize tasks with priorities
- Track deadlines and completion status
- View upcoming deadlines at a glance
- Estimated duration tracking

### 😊 Mood Tracker
- Daily mood and stress level logging
- Sleep tracking
- Activity correlation
- 7-day mood trends and analytics
- Visual mood statistics

### 🏃 Wellness Activities
- Curated library of wellness activities
- Personalized recommendations based on stress levels
- Multiple activity categories:
  - Exercise
  - Meditation
  - Social
  - Outdoor
  - Creative
  - Relaxation
- Activity logging and history

### 🧘 Relaxation Techniques
- Step-by-step relaxation guides
- Breathing exercises
- Meditation techniques
- Progressive muscle relaxation
- Categorized by difficulty level

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (for easy setup, production-ready)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

**Note:** No database setup required! SQLite is used for easy local development.

### Installation & Running

1. **Backend Setup**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npx ts-node src/server.ts
```

2. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

3. **Access Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- Database: SQLite file at `backend/dev.db`

## Detailed Documentation

For comprehensive setup instructions, troubleshooting, and API documentation, see:

📖 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

## Project Structure

```
project-adam/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.ts
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
├── frontend/         # React + Vite application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── App.tsx
│
└── SETUP_GUIDE.md   # Detailed setup instructions
```

## Screenshots & Features

### Dashboard
- Quick overview of today's events
- Upcoming task deadlines
- Current mood status
- Activity suggestions

### Schedule View
- Daily, weekly, and monthly views
- Color-coded event types
- Quick event creation
- Event editing and deletion

### Task Manager
- Priority-based task organization
- Status tracking
- Deadline visualization
- Quick completion toggle

### Mood Tracker
- Interactive mood logging
- Stress level monitoring
- Trend analysis with charts
- Historical mood data

### Activities Library
- Browse all wellness activities
- Personalized recommendations
- Activity completion tracking
- Category filtering

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/today` - Get today's schedule
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/upcoming` - Get upcoming deadlines
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Mood
- `GET /api/mood` - Get mood entries
- `GET /api/mood/stats` - Get mood statistics
- `POST /api/mood` - Create mood entry

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/recommended` - Get recommendations
- `POST /api/activities/log` - Log completed activity

## Development

### Backend Development
```bash
cd backend

# Start dev server (production-ready)
npx ts-node src/server.ts

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev

# Reseed database
npm run prisma:seed
```

### Frontend Development
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Future Enhancements

- [ ] Email/SMS notifications for reminders
- [ ] Calendar export (iCal format)
- [ ] Data visualization with advanced charts
- [ ] Mobile app (React Native)
- [ ] Social features (study groups, friend activities)
- [ ] Integration with university LMS
- [ ] AI-powered personalized recommendations
- [ ] Habit tracking and streaks
- [ ] Pomodoro timer integration
- [ ] Dark mode
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or personal use.

## Support

For issues, questions, or contributions:
1. Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
2. Review common issues in the troubleshooting section
3. Open an issue on GitHub

---

**Built with ❤️ for students who want to balance their academic life with wellness**

## Justification

This application addresses a critical need among university students who struggle with:
- **Time Management**: Heavy academic workload combined with social life and part-time jobs
- **Mental Health**: High stress and pressure requiring wellness intervention
- **Balance**: Need for tools that promote both productivity and well-being

By integrating schedule management with mood tracking and wellness activities, Student Balance provides a holistic approach to student life management, promoting not just academic success but overall health and happiness.
