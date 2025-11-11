import { useEffect, useState } from 'react';
import { scheduleAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const Schedule = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await scheduleAPI.getAll();
      setSchedules(response.data.schedules);
    } catch (error) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Event</span>
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No events scheduled yet</p>
          <button className="btn-primary">Create your first event</button>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{schedule.title}</h3>
                  <p className="text-gray-600 mt-1">{schedule.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{new Date(schedule.startTime).toLocaleString()}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                      {schedule.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
