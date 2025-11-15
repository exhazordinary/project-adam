import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckSquare, Smile, Activity, ArrowRight, Clock } from 'lucide-react';
import { scheduleAPI, taskAPI, moodAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [latestMood, setLatestMood] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scheduleRes, tasksRes, moodRes] = await Promise.allSettled([
          scheduleAPI.getToday(),
          taskAPI.getUpcoming(),
          moodAPI.getLatest(),
        ]);

        if (scheduleRes.status === 'fulfilled') {
          setTodaySchedule(scheduleRes.value.data.schedules || []);
        }

        if (tasksRes.status === 'fulfilled') {
          setUpcomingTasks(tasksRes.value.data.tasks || []);
        }

        if (moodRes.status === 'fulfilled') {
          setLatestMood(moodRes.value.data.moodEntry);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-coral/20 border-t-coral rounded-full animate-spin"></div>
          <div className="mt-4 text-charcoal/60 text-center font-medium">Loading your day...</div>
        </div>
      </div>
    );
  }

  const getMoodEmoji = (level: number) => {
    if (level >= 8) return '😊';
    if (level >= 6) return '🙂';
    if (level >= 4) return '😐';
    if (level >= 2) return '😕';
    return '😞';
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-charcoal mb-2">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
        </h1>
        <p className="text-charcoal/60">Here's your overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link
          to="/schedule"
          className="stat-card group"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-coral opacity-10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center">
                <Calendar className="text-coral" size={24} />
              </div>
              <ArrowRight className="text-coral opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <p className="text-sm text-charcoal/60 mb-1 font-medium">Today's Events</p>
            <p className="text-3xl font-display font-bold text-charcoal">{todaySchedule.length}</p>
          </div>
        </Link>

        <Link
          to="/tasks"
          className="stat-card group"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-sage opacity-10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center">
                <CheckSquare className="text-sage-dark" size={24} />
              </div>
              <ArrowRight className="text-sage-dark opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <p className="text-sm text-charcoal/60 mb-1 font-medium">Upcoming Tasks</p>
            <p className="text-3xl font-display font-bold text-charcoal">{upcomingTasks.length}</p>
          </div>
        </Link>

        <Link
          to="/mood"
          className="stat-card group"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-honey/30 opacity-20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-honey/10 flex items-center justify-center">
                <Smile className="text-honey-dark" size={24} />
              </div>
              <ArrowRight className="text-honey-dark opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <p className="text-sm text-charcoal/60 mb-1 font-medium">Latest Mood</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-display font-bold text-charcoal">
                {latestMood ? `${latestMood.moodLevel}/10` : 'N/A'}
              </p>
              {latestMood && <span className="text-2xl">{getMoodEmoji(latestMood.moodLevel)}</span>}
            </div>
          </div>
        </Link>

        <Link
          to="/activities"
          className="stat-card group"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/30 opacity-20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-lavender/10 flex items-center justify-center">
                <Activity className="text-lavender-dark" size={24} />
              </div>
              <ArrowRight className="text-lavender-dark opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <p className="text-sm text-charcoal/60 mb-1 font-medium">Wellness</p>
            <p className="text-2xl font-display font-bold text-charcoal">Explore</p>
          </div>
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-charcoal">Today's Schedule</h2>
            <Calendar className="text-coral" size={24} />
          </div>
          {todaySchedule.length > 0 ? (
            <div className="space-y-3 mb-6">
              {todaySchedule.slice(0, 5).map((schedule, idx) => (
                <div
                  key={schedule.id}
                  className="group p-4 bg-gradient-to-r from-charcoal/5 to-transparent rounded-2xl border border-charcoal/5 hover:border-coral/30 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-charcoal mb-1">{schedule.title}</p>
                      <div className="flex items-center gap-2 text-sm text-charcoal/60">
                        <Clock size={14} />
                        {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className="badge bg-coral/10 text-coral border border-coral/20">
                      {schedule.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-charcoal/5 flex items-center justify-center">
                <Calendar className="text-charcoal/30" size={24} />
              </div>
              <p className="text-charcoal/60 mb-2">No events scheduled for today</p>
              <p className="text-sm text-charcoal/40">Take it easy or add something new!</p>
            </div>
          )}
          <Link
            to="/schedule"
            className="group inline-flex items-center gap-2 text-coral hover:text-coral-dark font-medium transition-colors"
          >
            View full schedule
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-charcoal">Upcoming Deadlines</h2>
            <CheckSquare className="text-sage-dark" size={24} />
          </div>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3 mb-6">
              {upcomingTasks.slice(0, 5).map((task, idx) => (
                <div
                  key={task.id}
                  className="group p-4 bg-gradient-to-r from-charcoal/5 to-transparent rounded-2xl border border-charcoal/5 hover:border-sage/30 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal mb-1 truncate">{task.title}</p>
                      <p className="text-sm text-charcoal/60">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'No deadline'}
                      </p>
                    </div>
                    <span className={`badge flex-shrink-0 ${
                      task.priority === 'URGENT' ? 'bg-coral/10 text-coral border border-coral/20' :
                      task.priority === 'HIGH' ? 'bg-honey/10 text-honey-dark border border-honey/20' :
                      'bg-sage/10 text-sage-dark border border-sage/20'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-charcoal/5 flex items-center justify-center">
                <CheckSquare className="text-charcoal/30" size={24} />
              </div>
              <p className="text-charcoal/60 mb-2">No upcoming tasks</p>
              <p className="text-sm text-charcoal/40">You're all caught up!</p>
            </div>
          )}
          <Link
            to="/tasks"
            className="group inline-flex items-center gap-2 text-sage-dark hover:text-sage font-medium transition-colors"
          >
            View all tasks
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
