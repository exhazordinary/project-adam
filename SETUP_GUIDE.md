# Student Balance - Setup Guide

Complete guide to set up and run the Student Balance application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Clerk Setup](#clerk-setup)
- [Convex Setup](#convex-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Seeding Data](#seeding-data)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js** v18 or higher - [Download](https://nodejs.org/)
- **npm** package manager (comes with Node.js)
- **Clerk account** - [Sign up](https://clerk.com)
- **Convex account** - [Sign up](https://convex.dev)

## Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/exhazordinary/project-adam.git
cd project-adam

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Clerk Setup

Clerk handles user authentication. You need to configure it to work with Convex.

### 1. Create a Clerk Application

1. Go to https://dashboard.clerk.com
2. Click **Create Application**
3. Name your application (e.g., "Student Balance")
4. Select sign-in methods (Email, Google, etc.)
5. Click **Create Application**

### 2. Create JWT Template for Convex

This is **critical** - without this, authentication won't work.

1. In Clerk Dashboard, go to **JWT Templates** (in the sidebar)
2. Click **New Template**
3. Select **Convex** from the list
4. The template name must be exactly: `convex`
5. Click **Apply Changes**

### 3. Get Your API Keys

1. Go to **API Keys** in the sidebar
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

## Convex Setup

Convex is the serverless backend platform.

### 1. Initialize Convex

```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex (opens browser)
- Ask you to create or select a project
- Deploy your backend functions
- Show you your Convex URL

Keep this terminal running during development.

### 2. Note Your Convex URL

After running `npx convex dev`, you'll see output like:
```
Convex functions ready!
```

Your Convex URL is shown in the Convex dashboard or in `.env.local` that gets created.

## Environment Variables

### Frontend Environment

Create `frontend/.env.local` (or copy from `.env.example`):

```env
# Convex URL - get this from `npx convex dev` or Convex dashboard
VITE_CONVEX_URL=https://your-project-name.convex.cloud

# Clerk Publishable Key - get this from Clerk dashboard
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Auth Config File

Ensure `convex/auth.config.ts` exists with your Clerk domain:

```typescript
export default {
  providers: [
    {
      domain: "https://your-clerk-domain.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
```

To find your Clerk domain:
1. Your Clerk publishable key is base64 encoded
2. Decode it to get the domain, or
3. Check the Clerk dashboard under your application settings

## Running the Application

### Development Mode

```bash
# From project root - runs both Convex and frontend
npm run dev
```

This starts:
- Convex backend on their cloud (watches for changes)
- Frontend on http://localhost:5173

### Run Separately

```bash
# Terminal 1: Convex backend
npm run dev:convex

# Terminal 2: Frontend
npm run dev:frontend
```

## Seeding Data

To populate the database with sample activities and relaxation techniques:

1. Open the Convex dashboard: https://dashboard.convex.dev
2. Select your project
3. Go to **Functions**
4. Find `seed:seedAll`
5. Click **Run** to seed the database

Or use the Convex CLI:
```bash
npx convex run seed:seedAll
```

## Project Structure

```
project-adam/
├── convex/                   # Backend (Convex)
│   ├── _generated/           # Auto-generated Convex files
│   ├── auth.config.ts        # Clerk authentication config
│   ├── auth.ts               # User auth functions
│   ├── schema.ts             # Database schema
│   ├── tasks.ts              # Task CRUD operations
│   ├── schedules.ts          # Schedule CRUD operations
│   ├── mood.ts               # Mood tracking
│   ├── activities.ts         # Wellness activities
│   └── seed.ts               # Database seeding
│
├── frontend/                 # Frontend (React)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript definitions
│   │   └── App.tsx           # Main app with routing
│   ├── .env.local            # Environment variables
│   └── package.json
│
├── .env.example              # Environment template
├── package.json              # Root package.json
├── README.md
└── SETUP_GUIDE.md
```

## Available Scripts

### Root Directory

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both Convex and frontend |
| `npm run dev:convex` | Start Convex backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build frontend for production |

### Convex CLI

| Command | Description |
|---------|-------------|
| `npx convex dev` | Start Convex in development mode |
| `npx convex deploy` | Deploy to production |
| `npx convex run <function>` | Run a Convex function |
| `npx convex logs` | View function logs |

## Troubleshooting

### "Not authenticated" errors in console

**Cause**: Missing or incorrect Clerk JWT template configuration.

**Solution**:
1. Go to Clerk Dashboard → JWT Templates
2. Create a template named exactly `convex`
3. Ensure `convex/auth.config.ts` exists with correct Clerk domain
4. Restart `npm run dev`

### Frontend shows endless loading

**Cause**: Convex isn't receiving auth tokens from Clerk.

**Solution**:
1. Check that `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
2. Verify JWT template exists in Clerk
3. Check browser console for errors

### "Convex URL not set" or connection errors

**Cause**: Missing or incorrect `VITE_CONVEX_URL`.

**Solution**:
1. Run `npx convex dev` and check output for URL
2. Update `frontend/.env.local` with correct URL
3. Restart the frontend

### Database is empty (no activities)

**Cause**: Database hasn't been seeded.

**Solution**:
```bash
npx convex run seed:seedAll
```

### Port 5173 already in use

**Solution**:
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
cd frontend && npm run dev -- --port 3000
```

### Changes not reflecting

**Solution**:
1. Check that `npx convex dev` is running (watches for backend changes)
2. Frontend has hot reload - changes should appear automatically
3. Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## API Reference

### Authentication (`convex/auth.ts`)

| Function | Type | Description |
|----------|------|-------------|
| `getCurrentUser` | Query | Get current authenticated user |
| `storeUser` | Mutation | Create/sync user from Clerk |
| `updateProfile` | Mutation | Update user profile |

### Tasks (`convex/tasks.ts`)

| Function | Type | Description |
|----------|------|-------------|
| `list` | Query | Get all user tasks |
| `getUpcoming` | Query | Get tasks due in 7 days |
| `create` | Mutation | Create new task |
| `update` | Mutation | Update task |
| `updateStatus` | Mutation | Change task status |
| `remove` | Mutation | Delete task |

### Schedules (`convex/schedules.ts`)

| Function | Type | Description |
|----------|------|-------------|
| `list` | Query | Get all schedules |
| `getToday` | Query | Get today's schedule |
| `create` | Mutation | Create schedule event |
| `update` | Mutation | Update schedule |
| `remove` | Mutation | Delete schedule |

### Mood (`convex/mood.ts`)

| Function | Type | Description |
|----------|------|-------------|
| `list` | Query | Get mood entries |
| `getLatest` | Query | Get most recent mood |
| `getStats` | Query | Get mood statistics |
| `create` | Mutation | Log mood entry |

### Activities (`convex/activities.ts`)

| Function | Type | Description |
|----------|------|-------------|
| `listAll` | Query | Get all activities |
| `getRecommended` | Query | Get stress-based recommendations |
| `logActivity` | Mutation | Log completed activity |
| `getStats` | Query | Get activity statistics |

## Support

For issues:
1. Check the troubleshooting section above
2. Review browser console and terminal for errors
3. Ensure all environment variables are set correctly
4. Open an issue on GitHub
