import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/api';
import { Id } from '@convex/dataModel';
import toast from 'react-hot-toast';
import { Dumbbell, Brain, Users, Leaf, Palette, Coffee, Sparkles, Clock, Star } from 'lucide-react';

const Activities = () => {
  const activitiesData = useQuery(api.activities.listAll, {});
  const activities = activitiesData ?? [];
  const recommendedData = useQuery(api.activities.getRecommended, { limit: 3 });
  const recommended = recommendedData ?? [];
  const loading = activitiesData === undefined;

  const logActivityMutation = useMutation(api.activities.logActivity);

  const [filter, setFilter] = useState('ALL');

  const handleLogActivity = async (activityId: Id<"activities">) => {
    try {
      await logActivityMutation({ activityId });
      toast.success('Activity logged! 🎉');
    } catch (error) {
      toast.error('Failed to log activity');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      EXERCISE: <Dumbbell size={20} />,
      MEDITATION: <Brain size={20} />,
      SOCIAL: <Users size={20} />,
      OUTDOOR: <Leaf size={20} />,
      CREATIVE: <Palette size={20} />,
      RELAXATION: <Coffee size={20} />,
      LEARNING: <Sparkles size={20} />,
    };
    return icons[category] || <Sparkles size={20} />;
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      EXERCISE: 'bg-coral/10 text-coral border-coral/20',
      MEDITATION: 'bg-lavender/10 text-lavender-dark border-lavender/20',
      SOCIAL: 'bg-honey/10 text-honey-dark border-honey/20',
      OUTDOOR: 'bg-sage/10 text-sage-dark border-sage/20',
      CREATIVE: 'bg-lavender/10 text-lavender-dark border-lavender/20',
      RELAXATION: 'bg-sage/10 text-sage-dark border-sage/20',
      LEARNING: 'bg-coral/10 text-coral border-coral/20',
    };
    return colors[category] || 'bg-charcoal/10 text-charcoal border-charcoal/20';
  };

  const categories = ['ALL', 'EXERCISE', 'MEDITATION', 'SOCIAL', 'OUTDOOR', 'CREATIVE', 'RELAXATION', 'LEARNING'];
  const filteredActivities = filter === 'ALL'
    ? activities
    : activities.filter(a => a.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-lavender/20 border-t-lavender rounded-full animate-spin"></div>
          <div className="mt-4 text-charcoal/60 text-center font-medium">Loading activities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-charcoal mb-2">Wellness Activities</h1>
        <p className="text-charcoal/60">Discover activities to improve your wellbeing</p>
      </div>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-coral" size={24} />
            <h2 className="text-2xl font-display font-bold text-charcoal">
              Recommended for You
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((activity, idx) => (
              <div
                key={activity._id}
                className="card bg-gradient-to-br from-coral/5 to-transparent border-2 border-coral/20 group hover:border-coral/40"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`badge ${getCategoryColor(activity.category)} flex items-center gap-1.5`}>
                    {getCategoryIcon(activity.category)}
                    {activity.category}
                  </span>
                  <div className="flex items-center gap-1 text-coral">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-semibold">{activity.stressReliefScore}/10</span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-charcoal mb-2">
                  {activity.name}
                </h3>
                <p className="text-charcoal/70 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-charcoal/60">
                    <Clock size={16} />
                    <span>{activity.duration} min</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLogActivity(activity._id)}
                  className="btn-primary w-full"
                >
                  Start Activity
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === cat
                  ? 'bg-gradient-coral text-white shadow-lg shadow-coral/25'
                  : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'
              }`}
            >
              {cat === 'ALL' ? 'All Activities' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* All Activities Grid */}
      <div>
        <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
          {filter === 'ALL' ? 'All Activities' : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Activities`}
          <span className="text-base font-normal text-charcoal/50 ml-2">
            ({filteredActivities.length})
          </span>
        </h2>

        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, idx) => (
              <div
                key={activity._id}
                className="card group"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`badge ${getCategoryColor(activity.category)} flex items-center gap-1.5`}>
                    {getCategoryIcon(activity.category)}
                    {activity.category}
                  </span>
                  <div className="flex items-center gap-1 text-sage-dark">
                    <Star size={16} />
                    <span className="text-sm font-semibold">{activity.stressReliefScore}/10</span>
                  </div>
                </div>

                <h3 className="text-lg font-display font-bold text-charcoal mb-2">
                  {activity.name}
                </h3>
                <p className="text-charcoal/70 text-sm mb-4 line-clamp-3">
                  {activity.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-4">
                  <Clock size={16} />
                  <span>{activity.duration} minutes</span>
                </div>

                <button
                  onClick={() => handleLogActivity(activity._id)}
                  className="btn-secondary w-full group-hover:bg-sage/20"
                >
                  Log Activity
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-charcoal/5 flex items-center justify-center">
              <Sparkles className="text-charcoal/30" size={24} />
            </div>
            <p className="text-charcoal/60">No activities found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
