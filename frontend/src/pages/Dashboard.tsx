import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckSquare, Smile, Activity } from 'lucide-react';
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
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/schedule" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Calendar className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Events</p>
              <p className="text-2xl font-bold">{todaySchedule.length}</p>
            </div>
          </div>
        </Link>

        <Link to="/tasks" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckSquare className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming Tasks</p>
              <p className="text-2xl font-bold">{upcomingTasks.length}</p>
            </div>
          </div>
        </Link>

        <Link to="/mood" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Smile className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Latest Mood</p>
              <p className="text-2xl font-bold">{latestMood ? `${latestMood.moodLevel}/10` : 'N/A'}</p>
            </div>
          </div>
        </Link>

        <Link to="/activities" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activities</p>
              <p className="text-2xl font-bold">Explore</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
          {todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.slice(0, 5).map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{schedule.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
                    {schedule.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No events scheduled for today</p>
          )}
          <Link to="/schedule" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block">
            View full schedule →
          </Link>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.priority === 'URGENT' ? 'bg-red-100 text-red-700' :
                    task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming tasks</p>
          )}
          <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 inline-block">
            View all tasks →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
