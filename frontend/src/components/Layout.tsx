import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Smile,
  Activity,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'coral' },
    { name: 'Schedule', href: '/schedule', icon: Calendar, color: 'lavender' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, color: 'sage' },
    { name: 'Mood Tracker', href: '/mood', icon: Smile, color: 'honey' },
    { name: 'Activities', href: '/activities', icon: Activity, color: 'coral' },
    { name: 'Profile', href: '/profile', icon: User, color: 'sage' },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="floating-blob w-96 h-96 bg-coral/20 -top-48 -left-48" style={{ animationDelay: '0s' }} />
      <div className="floating-blob w-80 h-80 bg-sage/20 top-1/3 -right-40" style={{ animationDelay: '7s' }} />
      <div className="floating-blob w-72 h-72 bg-lavender/20 bottom-0 left-1/4" style={{ animationDelay: '14s' }} />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white/70 backdrop-blur-xl shadow-2xl shadow-charcoal/10 border-r border-charcoal/5">
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8 pb-6 border-b border-charcoal/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-coral flex items-center justify-center shadow-lg shadow-coral/30">
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-display font-bold text-gradient">
                Student Balance
              </h1>
            </div>
            <div className="ml-13 pl-0.5">
              <p className="text-sm text-charcoal/60">Welcome back,</p>
              <p className="text-base font-semibold text-charcoal">{user?.name || 'Student'}!</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center gap-3 px-4 py-3.5 rounded-2xl
                    transition-all duration-300 relative overflow-hidden
                    ${isActive
                      ? 'bg-gradient-coral text-white shadow-lg shadow-coral/25'
                      : 'text-charcoal hover:bg-charcoal/5'
                    }
                  `}
                >
                  <item.icon
                    size={20}
                    className={`relative z-10 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-medium relative z-10">{item.name}</span>

                  {/* Hover effect background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-coral opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-charcoal/10">
            <button
              onClick={logout}
              className="group flex items-center gap-3 px-4 py-3.5 w-full text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 rounded-2xl transition-all duration-300"
            >
              <LogOut size={20} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-72 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
