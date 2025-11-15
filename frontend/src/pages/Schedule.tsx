import { useEffect, useState } from 'react';
import { scheduleAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Calendar, Clock, MapPin, X, Edit } from 'lucide-react';

const Schedule = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'CLASS',
    location: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scheduleAPI.create(formData);
      toast.success('Event created! 📅');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: 'CLASS',
        location: '',
      });
      fetchSchedules();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: any = {
      CLASS: 'bg-coral/10 text-coral border-coral/20',
      STUDY: 'bg-sage/10 text-sage-dark border-sage/20',
      BREAK: 'bg-lavender/10 text-lavender-dark border-lavender/20',
      SOCIAL: 'bg-honey/10 text-honey-dark border-honey/20',
      EXERCISE: 'bg-coral/10 text-coral-dark border-coral/20',
      OTHER: 'bg-charcoal/10 text-charcoal border-charcoal/20',
    };
    return colors[type] || colors.OTHER;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-coral/20 border-t-coral rounded-full animate-spin"></div>
          <div className="mt-4 text-charcoal/60 text-center font-medium">Loading schedule...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-charcoal mb-2">Schedule</h1>
          <p className="text-charcoal/60">Manage your time and events</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'btn-ghost' : 'btn-primary'} flex items-center gap-2`}
        >
          {showForm ? (
            <>
              <X size={20} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Event
            </>
          )}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card mb-8 border-2 border-coral/20">
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Event Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="e.g., Computer Science 101"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Add any details about this event..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Event Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input"
                >
                  <option value="CLASS">Class</option>
                  <option value="STUDY">Study</option>
                  <option value="BREAK">Break</option>
                  <option value="SOCIAL">Social</option>
                  <option value="EXERCISE">Exercise</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  placeholder="Room 101"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-6">
              Create Event
            </button>
          </form>
        </div>
      )}

      {/* Events List */}
      {schedules.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-coral/10 flex items-center justify-center">
            <Calendar className="text-coral" size={32} />
          </div>
          <h3 className="text-2xl font-display font-bold text-charcoal mb-2">No events yet</h3>
          <p className="text-charcoal/60 mb-6">Create your first event to get started</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={20} className="inline mr-2" />
            Add Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule, idx) => (
            <div
              key={schedule.id}
              className="card group hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display font-bold text-charcoal">
                      {schedule.title}
                    </h3>
                    <span className={`badge ${getTypeColor(schedule.type)}`}>
                      {schedule.type}
                    </span>
                  </div>
                  {schedule.description && (
                    <p className="text-charcoal/70 mb-3">{schedule.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-charcoal/60">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        {new Date(schedule.startTime).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {schedule.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{schedule.location}</span>
                      </div>
                    )}
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
