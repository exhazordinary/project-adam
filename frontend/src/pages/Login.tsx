import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm relative overflow-hidden p-4">
      {/* Decorative background blobs */}
      <div className="floating-blob w-96 h-96 bg-coral/20 -top-48 -left-48" style={{ animationDelay: '0s' }} />
      <div className="floating-blob w-80 h-80 bg-sage/20 top-1/4 -right-40" style={{ animationDelay: '5s' }} />
      <div className="floating-blob w-72 h-72 bg-lavender/20 bottom-0 left-1/3" style={{ animationDelay: '10s' }} />

      {/* Login Container */}
      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-coral shadow-glow-coral mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-display font-bold text-gradient mb-3">
            Student Balance
          </h1>
          <p className="text-lg text-charcoal/70">
            Find harmony in your student life
          </p>
        </div>

        {/* Login Card */}
        <div className="card">
          <h2 className="text-2xl font-display font-bold text-charcoal mb-6">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11"
                  placeholder="Enter your password"
                />
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
                    Logging in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal/10 text-center">
            <p className="text-charcoal/60">
              New to Student Balance?{' '}
              <Link
                to="/register"
                className="text-coral hover:text-coral-dark font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                Create an account
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center mt-6 text-sm text-charcoal/50">
          Manage schedules, track wellness, find balance ✨
        </p>
      </div>
    </div>
  );
};

export default Login;
