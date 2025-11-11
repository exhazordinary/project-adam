import { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

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
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">University</label>
              <input
                name="university"
                type="text"
                value={formData.university}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  name="year"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.year}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Major</label>
                <input
                  name="major"
                  type="text"
                  value={formData.major}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>

            {user?.university && (
              <div>
                <p className="text-sm text-gray-600">University</p>
                <p className="font-medium">{user.university}</p>
              </div>
            )}

            {user?.year && (
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-medium">Year {user.year}</p>
              </div>
            )}

            {user?.major && (
              <div>
                <p className="text-sm text-gray-600">Major</p>
                <p className="font-medium">{user.major}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
