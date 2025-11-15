import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import toast from 'react-hot-toast';
import { Sparkles, User, Mail, Lock, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    year: '',
    major: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Welcome to Student Balance! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="floating-blob w-96 h-96 bg-sage/20 -top-48 -right-48" style={{ animationDelay: '0s' }} />
      <div className="floating-blob w-80 h-80 bg-coral/20 top-1/3 -left-40" style={{ animationDelay: '5s' }} />
      <div className="floating-blob w-72 h-72 bg-lavender/20 bottom-0 right-1/4" style={{ animationDelay: '10s' }} />

      {/* Register Container */}
      <div className="max-w-2xl w-full relative z-10 animate-fade-in-up py-12">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-sage shadow-glow-sage mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-charcoal mb-2">
            Join Student Balance
          </h1>
          <p className="text-lg text-charcoal/70">
            Start your journey to a balanced student life
          </p>
        </div>

        {/* Register Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Essential Information */}
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-charcoal/40" size={18} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input pl-11"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-charcoal/40" size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-11"
                    placeholder="your.email@university.edu"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-charcoal mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-charcoal/40" size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-11"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>
            </div>

            {/* Optional Academic Information */}
            <div className="pt-4 border-t border-charcoal/10">
              <p className="text-sm font-semibold text-charcoal/70 mb-4">
                Academic Details (Optional)
              </p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="university" className="block text-sm font-semibold text-charcoal mb-2">
                    University
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <GraduationCap className="text-charcoal/40" size={18} />
                    </div>
                    <input
                      id="university"
                      name="university"
                      type="text"
                      value={formData.university}
                      onChange={handleChange}
                      className="input pl-11"
                      placeholder="Your University"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="year" className="block text-sm font-semibold text-charcoal mb-2">
                      Year
                    </label>
                    <input
                      id="year"
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
                    <label htmlFor="major" className="block text-sm font-semibold text-charcoal mb-2">
                      Major
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BookOpen className="text-charcoal/40" size={18} />
                      </div>
                      <input
                        id="major"
                        name="major"
                        type="text"
                        value={formData.major}
                        onChange={handleChange}
                        className="input pl-11"
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed group mt-8"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal/10 text-center">
            <p className="text-charcoal/60">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-sage-dark hover:text-sage font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                Sign in
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
