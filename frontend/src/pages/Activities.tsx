import { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';
import toast from 'react-hot-toast';

const Activities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const [activitiesRes, recommendedRes] = await Promise.all([
        activityAPI.getAll(),
        activityAPI.getRecommended({ limit: 5 }),
      ]);
      setActivities(activitiesRes.data.activities || []);
      setRecommended(recommendedRes.data.recommendedActivities || []);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleLogActivity = async (activityId: string) => {
    try {
      await activityAPI.log({ activityId });
      toast.success('Activity logged!');
      fetchActivities();
    } catch (error) {
      toast.error('Failed to log activity');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Wellness Activities</h1>

      {recommended.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((activity) => (
              <div key={activity.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{activity.name}</h3>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                    {activity.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{activity.duration} min</span>
                  <span>Relief Score: {activity.stressReliefScore}/10</span>
                </div>
                <button
                  onClick={() => handleLogActivity(activity.id)}
                  className="btn-primary w-full"
                >
                  Start Activity
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold">{activity.name}</h3>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {activity.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{activity.duration} min</span>
                <span>Relief: {activity.stressReliefScore}/10</span>
              </div>
              <button
                onClick={() => handleLogActivity(activity.id)}
                className="btn-secondary w-full"
              >
                Log Activity
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
