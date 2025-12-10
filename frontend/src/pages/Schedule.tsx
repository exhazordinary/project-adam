import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/api';
import toast from 'react-hot-toast';
import { Plus, Calendar, Clock, MapPin, X } from 'lucide-react';

type ScheduleType = "CLASS" | "STUDY" | "BREAK" | "SOCIAL" | "EXERCISE" | "OTHER";

const Schedule = () => {
  const schedules = useQuery(api.schedules.list, {}) ?? [];
  const createSchedule = useMutation(api.schedules.create);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'CLASS' as ScheduleType,
    location: '',
  });

  const loading = schedules === undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSchedule({
        title: formData.title,
        description: formData.description || undefined,
        startTime: new Date(formData.startTime).getTime(),
        endTime: new Date(formData.endTime).getTime(),
        type: formData.type,
        location: formData.location || undefined,
      });
      toast.success('Event created!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        type: 'CLASS',
        location: '',
      });
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: any = {
      CLASS: 'bg-deep-teal/10 text-deep-teal border-deep-teal/30',
      STUDY: 'bg-terracotta/10 text-terracotta-700 border-terracotta/30',
      BREAK: 'bg-plum/10 text-rich-plum border-plum/30',
      SOCIAL: 'bg-warm-terracotta/15 text-terracotta-600 border-warm-terracotta/30',
      EXERCISE: 'bg-soft-teal/15 text-teal-700 border-soft-teal/30',
      OTHER: 'bg-charcoal/10 text-charcoal border-charcoal/20',
    };
    return colors[type] || colors.OTHER;
  };

  const getTypeGradient = (type: string) => {
    const gradients: any = {
      CLASS: 'from-deep-teal/20 to-soft-teal/20',
      STUDY: 'from-terracotta/20 to-warm-terracotta/20',
      BREAK: 'from-rich-plum/20 to-soft-lavender/20',
      SOCIAL: 'from-warm-terracotta/20 to-terracotta/20',
      EXERCISE: 'from-soft-teal/20 to-muted-teal/20',
      OTHER: 'from-charcoal/10 to-charcoal/5',
    };
    return gradients[type] || gradients.OTHER;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative animate-fade-in-scale">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-deep-teal/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-deep-teal border-r-terracotta rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-rich-plum border-l-soft-teal rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-charcoal/70 font-display text-lg font-semibold">Loading your schedule</p>
            <div className="flex gap-1 justify-center mt-2">
              <div className="w-2 h-2 bg-deep-teal rounded-full animate-breathe" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-terracotta rounded-full animate-breathe" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-rich-plum rounded-full animate-breathe" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-10">
      {/* Editorial Header */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-8">
          <div className="space-y-4">
            <div className="inline-block">
              <span className="text-xs font-accent uppercase tracking-widest text-deep-teal/60 mb-2 block">
                Time Management
              </span>
              <h1 className="text-6xl lg:text-7xl font-display font-bold text-charcoal mb-3 leading-none">
                Your Schedule
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-deep-teal via-terracotta to-rich-plum rounded-full"></div>
            </div>
            <p className="text-lg text-charcoal/60 max-w-xl font-light">
              Orchestrate your time with intention. Every moment thoughtfully planned.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${showForm ? 'btn-secondary' : 'btn-primary'} flex items-center gap-3 self-start lg:self-auto`}
          >
            {showForm ? (
              <>
                <X size={20} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Create Event</span>
              </>
            )}
          </button>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="glass rounded-3xl p-6 border border-white/30 hover:shadow-elegant transition-all duration-500">
            <p className="text-xs font-accent uppercase tracking-wider text-charcoal/50 mb-2">Total Events</p>
            <p className="text-3xl font-display font-bold text-gradient">{schedules.length}</p>
          </div>
          <div className="glass rounded-3xl p-6 border border-white/30 hover:shadow-elegant transition-all duration-500">
            <p className="text-xs font-accent uppercase tracking-wider text-charcoal/50 mb-2">This Week</p>
            <p className="text-3xl font-display font-bold text-gradient-warm">
              {schedules.filter((s: any) => s.startTime > Date.now()).length}
            </p>
          </div>
          <div className="glass rounded-3xl p-6 border border-white/30 hover:shadow-elegant transition-all duration-500">
            <p className="text-xs font-accent uppercase tracking-wider text-charcoal/50 mb-2">Upcoming</p>
            <p className="text-3xl font-display font-bold text-deep-teal">
              {schedules.filter((s: any) => s.startTime > Date.now() && s.startTime < Date.now() + 7 * 24 * 60 * 60 * 1000).length}
            </p>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card animate-fade-in-scale border-2 border-deep-teal/20 shadow-elegant">
          <div className="mb-8">
            <h2 className="text-4xl font-display font-bold text-charcoal mb-2">Create New Event</h2>
            <p className="text-charcoal/60">Add a new entry to your schedule</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
                Event Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="e.g., Advanced Mathematics"
              />
            </div>

            <div>
              <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input resize-none"
                rows={4}
                placeholder="Share details about this event..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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
                <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
                  Event Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ScheduleType })}
                  className="input cursor-pointer"
                >
                  <option value="CLASS">Class</option>
                  <option value="STUDY">Study Session</option>
                  <option value="BREAK">Break Time</option>
                  <option value="SOCIAL">Social Event</option>
                  <option value="EXERCISE">Exercise</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
                  Location <span className="text-charcoal/40">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  placeholder="Building A, Room 301"
                />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="btn-primary w-full">
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {schedules.length === 0 ? (
        <div className="card text-center py-20 animate-fade-in-scale">
          <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-deep-teal/10 to-terracotta/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/20 to-terracotta/20 animate-breathe"></div>
            <Calendar className="text-deep-teal relative z-10" size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-4xl font-display font-bold text-charcoal mb-3">No events yet</h3>
          <p className="text-lg text-charcoal/60 mb-8 max-w-md mx-auto">
            Begin your journey to balanced time management
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={20} />
            <span>Create Your First Event</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {schedules.map((schedule: any, idx: number) => (
            <div
              key={schedule._id}
              className="card group hover:shadow-float transition-all duration-500 cursor-pointer relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Decorative gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeGradient(schedule.type)}`}></div>

              {/* Background pattern on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getTypeGradient(schedule.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1 space-y-4">
                  {/* Title and Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl lg:text-3xl font-display font-bold text-charcoal group-hover:text-deep-teal transition-colors duration-500">
                      {schedule.title}
                    </h3>
                    <span className={`badge ${getTypeColor(schedule.type)} transition-all duration-500`}>
                      {schedule.type.toLowerCase()}
                    </span>
                  </div>

                  {/* Description */}
                  {schedule.description && (
                    <p className="text-charcoal/70 text-base leading-relaxed max-w-2xl">
                      {schedule.description}
                    </p>
                  )}

                  {/* Meta information */}
                  <div className="flex flex-wrap gap-6 text-sm text-charcoal/60">
                    <div className="flex items-center gap-2 group/time">
                      <Clock size={18} className="group-hover/time:text-deep-teal transition-colors" />
                      <span className="font-medium">
                        {new Date(schedule.startTime).toLocaleString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {schedule.location && (
                      <div className="flex items-center gap-2 group/location">
                        <MapPin size={18} className="group-hover/location:text-terracotta transition-colors" />
                        <span className="font-medium">{schedule.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date display (editorial style) */}
                <div className="flex-shrink-0 text-center p-4 glass rounded-2xl border border-white/30 group-hover:shadow-glass transition-all duration-500">
                  <p className="text-xs font-accent uppercase tracking-wider text-charcoal/50 mb-1">
                    {new Date(schedule.startTime).toLocaleDateString([], { month: 'short' })}
                  </p>
                  <p className="text-4xl font-display font-bold text-gradient">
                    {new Date(schedule.startTime).getDate()}
                  </p>
                  <p className="text-xs font-accent uppercase tracking-wider text-charcoal/50 mt-1">
                    {new Date(schedule.startTime).toLocaleDateString([], { year: 'numeric' })}
                  </p>
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
