import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex/api';
import { Calendar, CheckSquare, Smile, Activity, ArrowRight, Clock, TrendingUp, Zap, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import confetti from 'canvas-confetti';
import { useAuthUser } from '../hooks/useAuthUser';

const Dashboard = () => {
  const { isSignedIn, loading: authLoading, user: convexUser, error: authError, retry: retryAuth } = useAuthUser();
  
  // Only query when user exists in Convex (not just when signed in)
  const shouldQuery = isSignedIn && convexUser !== undefined && convexUser !== null;
  
  const todaySchedule = useQuery(
    api.schedules.getToday,
    shouldQuery ? {} : "skip"
  ) ?? [];
  const upcomingTasks = useQuery(
    api.tasks.getUpcoming,
    shouldQuery ? {} : "skip"
  ) ?? [];
  const latestMood = useQuery(
    api.mood.getLatest,
    shouldQuery ? {} : "skip"
  );

  const [showQuickActions, setShowQuickActions] = useState(false);

  const loading = authLoading || (!authError && !shouldQuery) || todaySchedule === undefined || upcomingTasks === undefined;

  // Show error state if auth sync failed
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-terracotta/10 flex items-center justify-center">
            <AlertCircle className="text-terracotta" size={40} />
          </div>
          <h2 className="text-2xl font-display font-bold text-charcoal mb-3">
            Connection Error
          </h2>
          <p className="text-charcoal/60 mb-6">
            Unable to connect to the server. Please check your connection and try again.
          </p>
          <button
            onClick={retryAuth}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-teal to-soft-teal text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const stats = {
    events: todaySchedule?.length ?? 0,
    tasks: upcomingTasks?.length ?? 0,
    mood: latestMood?.moodLevel ?? 0,
    streak: 7,
  };

  const celebrateWithConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0A5F5F', '#D67B5C', '#6B5B8D', '#A8D5D5', '#E89879']
    });
  };

  // Mock data for charts
  const weeklyActivityData = [
    { day: 'Mon', tasks: 4, mood: 7, events: 3 },
    { day: 'Tue', tasks: 6, mood: 8, events: 5 },
    { day: 'Wed', tasks: 3, mood: 6, events: 4 },
    { day: 'Thu', tasks: 8, mood: 9, events: 6 },
    { day: 'Fri', tasks: 5, mood: 7, events: 4 },
    { day: 'Sat', tasks: 2, mood: 8, events: 2 },
    { day: 'Sun', tasks: 3, mood: 9, events: 3 },
  ];

  const taskDistribution = [
    { name: 'Completed', value: 65, color: '#0A5F5F' },
    { name: 'In Progress', value: 25, color: '#D67B5C' },
    { name: 'Pending', value: 10, color: '#6B5B8D' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Multi-layer spinner */}
          <div className="relative w-32 h-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-deep-teal/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-transparent border-t-deep-teal border-r-terracotta rounded-full"
            />
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-4 border-4 border-transparent border-t-rich-plum border-l-soft-teal rounded-full"
            />
          </div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-8 text-center text-charcoal/70 font-display text-xl font-semibold"
          >
            Loading your world...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-deep-teal/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -20, null],
              x: [null, Math.random() * 100 - 50, null],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10 relative z-10"
      >
        {/* Hero Header with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block text-xs font-accent uppercase tracking-widest text-deep-teal/60 mb-3"
              >
                Dashboard Overview
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl lg:text-7xl font-display font-bold text-charcoal mb-3 leading-none"
              >
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 w-32 bg-gradient-to-r from-deep-teal via-terracotta to-rich-plum rounded-full origin-left mb-4"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-charcoal/60 font-light max-w-2xl"
              >
                Your personalized wellness dashboard is ready. Let's make today extraordinary.
              </motion.p>
            </div>

            {/* Streak Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-3xl p-6 border border-white/30 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-warm-terracotta rounded-2xl flex items-center justify-center">
                <Zap className="text-white" size={32} />
              </div>
              <div>
                <p className="text-xs font-accent uppercase tracking-wider text-charcoal/50">Daily Streak</p>
                <p className="text-4xl font-display font-bold text-gradient">{stats.streak}</p>
                <p className="text-xs text-charcoal/50">Days in a row!</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Stats Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Calendar, label: "Today's Events", value: stats.events, color: 'deep-teal', link: '/schedule', delay: 0.1 },
            { icon: CheckSquare, label: 'Upcoming Tasks', value: stats.tasks, color: 'terracotta', link: '/tasks', delay: 0.2 },
            { icon: Smile, label: 'Current Mood', value: `${stats.mood}/10`, color: 'rich-plum', link: '/mood', delay: 0.3 },
            { icon: Activity, label: 'Wellness Score', value: '85%', color: 'soft-teal', link: '/activities', delay: 0.4 },
          ].map((stat, idx) => (
            <TiltCard key={idx} delay={stat.delay} href={stat.link}>
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-${stat.color} opacity-10 rounded-full -mr-20 -mt-20 blur-3xl`} />
              <div className="relative z-10 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-3xl bg-${stat.color}/10 flex items-center justify-center mb-4`}>
                  <stat.icon className={`text-${stat.color}`} size={28} />
                </div>
                <p className="text-xs font-accent uppercase tracking-wider text-charcoal/60 mb-2">{stat.label}</p>
                <AnimatedNumber value={typeof stat.value === 'string' ? stat.value : stat.value} />
                <div className="mt-auto pt-4">
                  <div className="flex items-center gap-2 text-sm text-deep-teal opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>View details</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 card shadow-float"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-charcoal mb-1">Weekly Activity</h2>
                <p className="text-sm text-charcoal/60">Your productivity at a glance</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-deep-teal" size={24} />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyActivityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A5F5F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0A5F5F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D67B5C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D67B5C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#8B8B8B" style={{ fontSize: '12px', fontFamily: 'Inter' }} />
                <YAxis stroke="#8B8B8B" style={{ fontSize: '12px', fontFamily: 'Inter' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow: '0 8px 32px rgba(10, 95, 95, 0.1)',
                  }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#0A5F5F" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                <Area type="monotone" dataKey="mood" stroke="#D67B5C" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Task Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card shadow-float"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-charcoal mb-1">Task Status</h2>
              <p className="text-sm text-charcoal/60">Current breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {taskDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-charcoal/70">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-charcoal">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Today's Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule with Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="card shadow-float"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-charcoal mb-1">Today's Schedule</h2>
                <p className="text-sm text-charcoal/60">Your timeline for success</p>
              </div>
              <Calendar className="text-deep-teal" size={28} />
            </div>
            {todaySchedule.length > 0 ? (
              <div className="space-y-4 mb-6">
                {todaySchedule.slice(0, 5).map((schedule: any, idx: number) => (
                  <motion.div
                    key={schedule._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    className="group relative pl-6 pb-6 last:pb-0"
                  >
                    {/* Timeline line */}
                    {idx !== todaySchedule.length - 1 && (
                      <div className="absolute left-2 top-8 bottom-0 w-px bg-gradient-to-b from-deep-teal/30 to-transparent" />
                    )}
                    {/* Timeline dot */}
                    <motion.div
                      whileHover={{ scale: 1.5 }}
                      className="absolute left-0 top-2 w-4 h-4 rounded-full bg-gradient-teal shadow-lg"
                    />
                    <div className="glass rounded-2xl p-4 border border-white/30 hover:shadow-elegant transition-all duration-500 group-hover:translate-x-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal mb-1">{schedule.title}</p>
                          <div className="flex items-center gap-2 text-sm text-charcoal/60">
                            <Clock size={14} />
                            {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <span className="badge bg-deep-teal/10 text-deep-teal border-deep-teal/30">
                          {schedule.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-deep-teal/10 to-terracotta/10 flex items-center justify-center">
                  <Calendar className="text-deep-teal" size={32} />
                </div>
                <p className="text-charcoal/60 mb-2 font-display text-xl">No events today</p>
                <p className="text-sm text-charcoal/40">Perfect day to rest or add something new!</p>
              </motion.div>
            )}
            <Link
              to="/schedule"
              className="group inline-flex items-center gap-2 text-deep-teal hover:text-soft-teal font-semibold transition-colors duration-300"
            >
              <span>View full schedule</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="card shadow-float"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-charcoal mb-1">Upcoming Deadlines</h2>
                <p className="text-sm text-charcoal/60">Stay on top of your work</p>
              </div>
              <CheckSquare className="text-terracotta" size={28} />
            </div>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3 mb-6">
                {upcomingTasks.slice(0, 5).map((task: any, idx: number) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="group glass rounded-2xl p-4 border border-white/30 hover:shadow-elegant transition-all duration-500 cursor-pointer"
                    onClick={celebrateWithConfetti}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal mb-1">{task.title}</p>
                        <p className="text-sm text-charcoal/60">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'No deadline'}
                        </p>
                      </div>
                      <span className={`badge ${
                        task.priority === 'URGENT' ? 'bg-terracotta/10 text-terracotta border-terracotta/30' :
                        task.priority === 'HIGH' ? 'bg-warm-terracotta/10 text-terracotta-600 border-warm-terracotta/30' :
                        'bg-deep-teal/10 text-deep-teal border-deep-teal/30'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-terracotta/10 to-warm-terracotta/10 flex items-center justify-center">
                  <CheckSquare className="text-terracotta" size={32} />
                </div>
                <p className="text-charcoal/60 mb-2 font-display text-xl">All clear!</p>
                <p className="text-sm text-charcoal/40">No pending tasks. Great work!</p>
              </motion.div>
            )}
            <Link
              to="/tasks"
              className="group inline-flex items-center gap-2 text-terracotta hover:text-warm-terracotta font-semibold transition-colors duration-300"
            >
              <span>View all tasks</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-16 h-16 rounded-full bg-gradient-teal shadow-float flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Plus className="text-white relative z-10" size={28} />
        </motion.button>

        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 right-0 glass rounded-2xl p-4 border border-white/30 shadow-float min-w-[200px]"
            >
              {[
                { label: 'Add Event', icon: Calendar, to: '/schedule' },
                { label: 'Create Task', icon: CheckSquare, to: '/tasks' },
                { label: 'Log Mood', icon: Smile, to: '/mood' },
              ].map((action, idx) => (
                <Link
                  key={idx}
                  to={action.to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors duration-300"
                >
                  <action.icon size={20} className="text-deep-teal" />
                  <span className="text-sm font-medium text-charcoal">{action.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children, delay, href }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  return (
    <Link to={href}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        onMouseMove={handleMouse}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="card group cursor-pointer h-full shadow-elegant hover:shadow-float transition-shadow duration-500 relative"
      >
        {children}
      </motion.div>
    </Link>
  );
};

// Animated Number Component
const AnimatedNumber = ({ value }: { value: string | number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <p className="text-5xl font-display font-bold text-gradient">
      {typeof value === 'number' ? displayValue : value}
    </p>
  );
};

export default Dashboard;
