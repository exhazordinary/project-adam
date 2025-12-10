import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Smile,
  Activity,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'coral' },
    { name: 'Schedule', href: '/schedule', icon: Calendar, color: 'lavender' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, color: 'sage' },
    { name: 'Mood Tracker', href: '/mood', icon: Smile, color: 'honey' },
    { name: 'Activities', href: '/activities', icon: Activity, color: 'coral' },
    { name: 'Profile', href: '/profile', icon: User, color: 'sage' },
  ];

  const handleLogout = () => {
    setIsOpen(false);
    signOut();
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass backdrop-blur-2xl shadow-elegant border-b border-white/20">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-deep-teal via-terracotta to-rich-plum opacity-60"></div>
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-teal flex items-center justify-center shadow-elegant relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Sparkles className="text-white relative z-10" size={18} />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-display font-bold text-gradient">
                Student
              </h1>
              <h1 className="text-base font-display font-bold text-gradient-warm">
                Balance
              </h1>
            </div>
          </div>

          {/* Hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-2xl glass border border-white/30 hover:shadow-glass transition-all duration-500 active-scale"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} className="text-charcoal" /> : <Menu size={22} className="text-charcoal" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-charcoal/50 backdrop-blur-md z-40 animate-fade-in-scale"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 w-80 glass backdrop-blur-2xl shadow-float border-r border-white/20
          z-50 transform transition-all duration-500 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-8 relative">
          {/* Decorative top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-deep-teal via-terracotta to-rich-plum opacity-60"></div>

          {/* Logo & User info */}
          <div className="mb-10 pb-8 border-b border-charcoal/10 animate-fade-in-scale">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-3xl bg-gradient-teal flex items-center justify-center shadow-elegant relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Sparkles className="text-white relative z-10" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-gradient leading-tight">
                  Student
                </h1>
                <h1 className="text-3xl font-display font-bold text-gradient-warm leading-tight">
                  Balance
                </h1>
              </div>
            </div>
            <div className="pl-1">
              <p className="text-xs font-accent uppercase tracking-wider text-charcoal/50 mb-1">Welcome back</p>
              <p className="text-lg font-semibold text-charcoal font-display">{user?.firstName || user?.fullName || 'Student'}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 animate-fade-in-up overflow-y-auto mobile-hide-scrollbar">
            {navigation.map((item, idx) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={`
                    group flex items-center gap-4 px-5 py-4 rounded-3xl
                    transition-all duration-500 relative overflow-hidden active-scale
                    ${isActive
                      ? 'bg-gradient-teal text-white shadow-elegant'
                      : 'text-charcoal hover:bg-white/40 hover:shadow-glass'
                    }
                  `}
                >
                  {/* Background glow on hover */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl
                    ${isActive ? 'bg-white/10' : 'bg-gradient-to-r from-deep-teal/5 to-terracotta/5'}
                  `}></div>

                  {/* Icon */}
                  <div className={`relative z-10 transition-all duration-500 ${
                    isActive ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:-rotate-3'
                  }`}>
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  {/* Text */}
                  <span className={`font-medium relative z-10 transition-all duration-500 ${
                    isActive ? 'font-semibold' : 'group-hover:translate-x-1'
                  }`}>
                    {item.name}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-5 w-2 h-2 rounded-full bg-white animate-breathe"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-charcoal/10 animate-fade-in-up">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-4 px-5 py-4 w-full text-charcoal/60 hover:text-charcoal hover:bg-white/40 rounded-3xl transition-all duration-500 relative overflow-hidden active-scale"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-terracotta/5 to-deep-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              <LogOut size={20} className="relative z-10 transition-transform duration-500 group-hover:-translate-x-1" />
              <span className="font-medium relative z-10">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
