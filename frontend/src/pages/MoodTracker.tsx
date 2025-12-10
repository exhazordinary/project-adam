import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/api';
import toast from 'react-hot-toast';
import { Smile, Heart, TrendingUp, X, Plus } from 'lucide-react';

const MoodTracker = () => {
  const moodEntries = useQuery(api.mood.list, { limit: 10 }) ?? [];
  const stats = useQuery(api.mood.getStats, { days: 7 });
  const createMood = useMutation(api.mood.create);

  const [showForm, setShowForm] = useState(false);
  const [moodLevel, setMoodLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMood({
        moodLevel,
        stressLevel,
        notes: notes || undefined,
      });
      toast.success('Mood logged! 💚');
      setShowForm(false);
      setNotes('');
      setMoodLevel(5);
      setStressLevel(5);
    } catch (error) {
      toast.error('Failed to save mood entry');
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 9) return '😄';
    if (mood >= 7) return '😊';
    if (mood >= 5) return '🙂';
    if (mood >= 3) return '😐';
    return '😔';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 7) return 'from-sage to-sage-light';
    if (mood >= 4) return 'from-honey to-honey-light';
    return 'from-coral to-coral-light';
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-charcoal mb-2">Mood Tracker</h1>
          <p className="text-charcoal/60">Track your emotional wellness</p>
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
              Log Mood
            </>
          )}
        </button>
      </div>

      {/* Mood Entry Form */}
      {showForm && (
        <div className="card mb-8 border-2 border-honey/20">
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
            How are you feeling today?
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-charcoal">
                  Mood Level
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getMoodEmoji(moodLevel)}</span>
                  <span className="text-3xl font-display font-bold text-gradient">
                    {moodLevel}/10
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodLevel}
                onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-charcoal/10 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-coral
                         [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-xs text-charcoal/40 mt-2">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-charcoal">
                  Stress Level
                </label>
                <span className="text-2xl font-display font-bold text-charcoal">
                  {stressLevel}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-charcoal/10 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-sage
                         [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-xs text-charcoal/40 mt-2">
                <span>Relaxed</span>
                <span>Stressed</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input"
                rows={3}
                placeholder="What's on your mind? How are you feeling?"
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-6">
              Save Mood Entry
            </button>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card group bg-gradient-to-br from-sage/10 to-sage/5">
            <div className="flex items-center justify-between mb-4">
              <Smile className="text-sage-dark" size={32} />
              <span className="badge bg-sage/20 text-sage-dark border-sage/30">7 days</span>
            </div>
            <p className="text-sm text-charcoal/60 mb-2 font-medium">Average Mood</p>
            <p className="text-4xl font-display font-bold text-charcoal mb-2">
              {stats.averageMood?.toFixed(1) || 'N/A'}/10
            </p>
            <p className="text-sm text-charcoal/50 capitalize">Trend: {stats.trend || 'stable'}</p>
          </div>

          <div className="stat-card group bg-gradient-to-br from-honey/10 to-honey/5">
            <div className="flex items-center justify-between mb-4">
              <Heart className="text-honey-dark" size={32} />
              <span className="badge bg-honey/20 text-honey-dark border-honey/30">7 days</span>
            </div>
            <p className="text-sm text-charcoal/60 mb-2 font-medium">Average Stress</p>
            <p className="text-4xl font-display font-bold text-charcoal mb-2">
              {stats.averageStress?.toFixed(1) || 'N/A'}/10
            </p>
            <p className="text-sm text-charcoal/50">
              {stats.averageStress < 5 ? 'Well managed' : 'Needs attention'}
            </p>
          </div>

          <div className="stat-card group bg-gradient-to-br from-lavender/10 to-lavender/5">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-lavender-dark" size={32} />
              <span className="badge bg-lavender/20 text-lavender-dark border-lavender/30">Total</span>
            </div>
            <p className="text-sm text-charcoal/60 mb-2 font-medium">Check-ins</p>
            <p className="text-4xl font-display font-bold text-charcoal mb-2">
              {stats.totalEntries || 0}
            </p>
            <p className="text-sm text-charcoal/50">Keep tracking!</p>
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="card">
        <h2 className="text-2xl font-display font-bold text-charcoal mb-6">Recent Check-ins</h2>
        {moodEntries.length > 0 ? (
          <div className="space-y-3">
            {moodEntries.map((entry, idx) => (
              <div
                key={entry._id}
                className="p-5 rounded-2xl bg-gradient-to-r from-charcoal/5 to-transparent border border-charcoal/5 hover:shadow-md transition-all"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getMoodColor(entry.moodLevel)} flex items-center justify-center text-3xl shadow-lg`}>
                      {getMoodEmoji(entry.moodLevel)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-display font-bold text-charcoal">
                          {entry.moodLevel}/10
                        </span>
                        {entry.stressLevel && (
                          <span className="badge bg-charcoal/10 text-charcoal border-charcoal/20">
                            Stress: {entry.stressLevel}/10
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-charcoal/60 mb-2">
                        {new Date(entry.timestamp).toLocaleString([], {
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {entry.notes && (
                        <p className="text-charcoal/70 italic">"{entry.notes}"</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-honey/10 flex items-center justify-center">
              <Smile className="text-honey-dark" size={24} />
            </div>
            <p className="text-charcoal/60 mb-2">No mood entries yet</p>
            <p className="text-sm text-charcoal/40">Start tracking to see your emotional journey</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
