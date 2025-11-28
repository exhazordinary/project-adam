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
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh relative overflow-hidden p-4">
      {/* Sophisticated floating gradient orbs */}
      <div className="floating-blob w-[500px] h-[500px] bg-gradient-teal -top-64 -right-64 opacity-20" style={{ animationDelay: '0s' }} />
      <div className="floating-blob w-[400px] h-[400px] bg-gradient-terracotta top-1/3 -left-48 opacity-15" style={{ animationDelay: '8s' }} />
      <div className="floating-blob w-[450px] h-[450px] bg-gradient-plum bottom-0 right-1/4 opacity-10" style={{ animationDelay: '16s' }} />

      {/* Register Container */}
      <div className="max-w-2xl w-full relative z-10 animate-fade-in-up py-12">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-teal shadow-elegant mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Sparkles className="text-white relative z-10" size={36} />
          </div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-charcoal mb-3 leading-none">
            Join Student Balance
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-deep-teal via-terracotta to-rich-plum rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-charcoal/60 font-light">
            Begin your journey to a thoughtfully balanced student life
          </p>
        </div>

        {/* Register Card */}
        <div className="card shadow-elegant border-2 border-deep-teal/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Essential Information */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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
                <label htmlFor="email" className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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
                <label htmlFor="password" className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
            </div>

            {/* Optional Academic Information */}
            <div className="pt-6 border-t border-charcoal/10">
              <p className="text-sm font-accent uppercase tracking-wider text-charcoal/60 mb-5">
                Academic Details <span className="text-charcoal/40">(Optional)</span>
              </p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="university" className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="year" className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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
                    <label htmlFor="major" className="block text-xs font-accent uppercase tracking-wider text-charcoal/70 mb-3">
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

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating your account</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-all duration-500" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-charcoal/10 text-center">
            <p className="text-charcoal/60">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-deep-teal hover:text-soft-teal font-semibold transition-colors duration-300 inline-flex items-center gap-1 group"
              >
                Sign in
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
