import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import MoodTracker from './pages/MoodTracker';
import Activities from './pages/Activities';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthUser } from './hooks/useAuthUser';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, loading: convexLoading, error } = useAuthUser();

  // Show loading while Clerk is loading or while syncing user to Convex
  if (!isLoaded || (isSignedIn && convexLoading && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-deep-teal/20 border-t-deep-teal rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // If there's an error, let the child component (Dashboard) handle it
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-deep-teal/20 border-t-deep-teal rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="mood" element={<MoodTracker />} />
          <Route path="activities" element={<Activities />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <AppRoutes />
          <Toaster position="top-right" />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
