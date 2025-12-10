import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
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

        {/* Clerk Sign In */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-white/20",
                headerTitle: "text-2xl font-display font-bold text-charcoal",
                headerSubtitle: "text-charcoal/60",
                formButtonPrimary: "bg-gradient-to-r from-coral to-coral-dark hover:opacity-90 text-white font-semibold py-3 rounded-xl",
                formFieldInput: "rounded-xl border-charcoal/20 focus:border-coral focus:ring-coral/20",
                footerActionLink: "text-coral hover:text-coral-dark font-semibold",
              },
            }}
            routing="path"
            path="/login"
            signUpUrl="/register"
            afterSignInUrl="/dashboard"
          />
        </div>

        <div className="mt-8 text-center">
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

        {/* Bottom tagline */}
        <p className="text-center mt-6 text-sm text-charcoal/50">
          Manage schedules, track wellness, find balance
        </p>
      </div>
    </div>
  );
};

export default Login;
