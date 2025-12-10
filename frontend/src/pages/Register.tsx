import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const Register = () => {
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

        {/* Clerk Sign Up */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full max-w-md",
                card: "bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border-2 border-deep-teal/20",
                headerTitle: "text-2xl font-display font-bold text-charcoal",
                headerSubtitle: "text-charcoal/60",
                formButtonPrimary: "bg-gradient-to-r from-deep-teal to-soft-teal hover:opacity-90 text-white font-semibold py-3 rounded-xl",
                formFieldInput: "rounded-xl border-charcoal/20 focus:border-deep-teal focus:ring-deep-teal/20",
                footerActionLink: "text-deep-teal hover:text-soft-teal font-semibold",
              },
            }}
            signInUrl="/login"
            afterSignUpUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

        <div className="mt-8 text-center">
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
  );
};

export default Register;
