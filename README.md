# Student Balance - Time Management & Wellness Application

A comprehensive web application designed to help university students manage their daily schedules while maintaining a healthy balance between academic tasks, social activities, and mental health.

## Tech Stack

- **Backend**: [Convex](https://convex.dev) (serverless backend platform)
- **Authentication**: [Clerk](https://clerk.com)
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## Quick Start

### Prerequisites

- Node.js (v18+)
- npm
- A [Clerk](https://clerk.com) account
- A [Convex](https://convex.dev) account

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Set Up Clerk

1. Create a Clerk application at https://dashboard.clerk.com
2. Go to **JWT Templates** in the sidebar
3. Click **New Template** → Choose **Convex**
4. Name it exactly: `convex`
5. Save the template
6. Copy your **Publishable Key** from the API Keys section

### 3. Set Up Convex

```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex
- Create a new project (or link to existing)
- Generate your Convex URL

### 4. Configure Environment Variables

Create `frontend/.env.local`:

```env
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
```

### 5. Run the Application

```bash
npm run dev
```

This starts both Convex and the frontend. Open http://localhost:5173

## Project Structure

```
project-adam/
├── convex/               # Convex backend
│   ├── auth.config.ts    # Clerk authentication config
│   ├── auth.ts           # User authentication functions
│   ├── tasks.ts          # Task management
│   ├── schedules.ts      # Schedule management
│   ├── mood.ts           # Mood tracking
│   ├── activities.ts     # Wellness activities
│   ├── seed.ts           # Database seeding
│   └── schema.ts         # Database schema
│
├── frontend/             # React frontend
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       ├── hooks/        # Custom hooks
│       └── types/        # TypeScript types
│
├── .env.example          # Environment template
└── package.json
```

## Key Features

- **Automated Scheduling** - Calendar for classes, study sessions, breaks
- **Task Management** - Priority-based tasks with deadlines
- **Mood Tracker** - Daily mood, stress, and sleep logging
- **Wellness Activities** - Curated activities with personalized recommendations

## Detailed Setup

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for comprehensive setup instructions and troubleshooting.

## License

MIT License
