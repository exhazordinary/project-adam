import { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, GraduationCap, BookOpen, Calendar, Edit2, Check, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    university: user?.university || '',
    year: user?.year?.toString() || '',
    major: user?.major || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        university: user.university || '',
        year: user.year?.toString() || '',
        major: user.major || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile({
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
      });
      toast.success('Profile updated! ✓');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-charcoal mb-2">Profile</h1>
        <p className="text-charcoal/60">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="card">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between mb-8 pb-8 border-b border-charcoal/10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-coral flex items-center justify-center shadow-glow-coral">
              <span className="text-3xl font-display font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-charcoal mb-1">
                {user?.name}
              </h2>
              <p className="text-charcoal/60 flex items-center gap-2">
                <Mail size={16} />
                {user?.email}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Form / Display */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-charcoal/40" size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-11"
                  required
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                University
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className="text-charcoal/40" size={18} />
                </div>
                <input
                  name="university"
                  type="text"
                  value={formData.university}
                  onChange={handleChange}
                  className="input pl-11"
                  placeholder="Your university name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Year
                </label>
                <input
                  name="year"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.year}
                  onChange={handleChange}
                  className="input"
                  placeholder="1-6"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Major
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <BookOpen className="text-charcoal/40" size={18} />
                  </div>
                  <input
                    name="major"
                    type="text"
                    value={formData.major}
                    onChange={handleChange}
                    className="input pl-11"
                    placeholder="Your major"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 flex-1"
              >
                <Check size={18} />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  if (user) {
                    setFormData({
                      name: user.name,
                      university: user.university || '',
                      year: user.year?.toString() || '',
                      major: user.major || '',
                    });
                  }
                }}
                className="btn-ghost flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-coral/5 to-transparent border border-coral/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                    <User className="text-coral" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wide">Full Name</p>
                    <p className="font-semibold text-charcoal text-lg">{user?.name || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-sage/5 to-transparent border border-sage/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center">
                    <Mail className="text-sage-dark" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-charcoal text-lg">{user?.email}</p>
                  </div>
                </div>
              </div>

              {user?.university && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-lavender/5 to-transparent border border-lavender/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-lavender/10 flex items-center justify-center">
                      <GraduationCap className="text-lavender-dark" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wide">University</p>
                      <p className="font-semibold text-charcoal text-lg">{user.university}</p>
                    </div>
                  </div>
                </div>
              )}

              {user?.year && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-honey/5 to-transparent border border-honey/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-honey/10 flex items-center justify-center">
                      <Calendar className="text-honey-dark" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wide">Academic Year</p>
                      <p className="font-semibold text-charcoal text-lg">Year {user.year}</p>
                    </div>
                  </div>
                </div>
              )}

              {user?.major && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-coral/5 to-transparent border border-coral/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                      <BookOpen className="text-coral" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wide">Major</p>
                      <p className="font-semibold text-charcoal text-lg">{user.major}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-gradient-to-br from-sage/5 to-transparent border border-sage/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center">
                    <Calendar className="text-sage-dark" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wide">Member Since</p>
                    <p className="font-semibold text-charcoal text-lg">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString([], {
                        month: 'long',
                        year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
