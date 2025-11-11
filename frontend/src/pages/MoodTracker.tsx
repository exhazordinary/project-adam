import { useEffect, useState } from 'react';
import { moodAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Smile, Frown, Meh } from 'lucide-react';

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [moodLevel, setMoodLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      const [entriesRes, statsRes] = await Promise.all([
        moodAPI.getAll({ limit: 10 }),
        moodAPI.getStats({ days: 7 }),
      ]);
      setMoodEntries(entriesRes.data.moodEntries);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error('Failed to load mood data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await moodAPI.create({
        moodLevel,
        stressLevel,
        notes,
      });
      toast.success('Mood entry saved!');
      setShowForm(false);
      setNotes('');
      fetchMoodData();
    } catch (error) {
      toast.error('Failed to save mood entry');
    }
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="text-green-600" size={24} />;
    if (mood >= 4) return <Meh className="text-yellow-600" size={24} />;
    return <Frown className="text-red-600" size={24} />;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mood Tracker</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Log Mood'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Mood Level: {moodLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodLevel}
                onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stress Level: {stressLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input"
                rows={3}
                placeholder="How are you feeling? What's on your mind?"
              />
            </div>

            <button type="submit" className="btn-primary">
              Save Entry
            </button>
          </form>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600">Average Mood (7 days)</p>
            <p className="text-3xl font-bold text-primary-600">{stats.averageMood}/10</p>
            <p className="text-sm text-gray-500 mt-1">Trend: {stats.trend}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Average Stress</p>
            <p className="text-3xl font-bold text-orange-600">{stats.averageStress}/10</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="text-3xl font-bold text-green-600">{stats.totalEntries}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <div className="space-y-4">
          {moodEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                {getMoodIcon(entry.moodLevel)}
                <div>
                  <p className="font-medium">Mood: {entry.moodLevel}/10</p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-gray-700 mt-1">{entry.notes}</p>
                  )}
                </div>
              </div>
              {entry.stressLevel && (
                <span className="text-sm text-gray-600">
                  Stress: {entry.stressLevel}/10
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
