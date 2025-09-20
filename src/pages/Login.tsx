import { useEffect, useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";

/**
 * Login Component - User authentication page
 * Features animated background effects and dark glassmorphism design
 * matching the main application travel adventure theme
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /**
   * Handle input focus - start stars animation
   */
  const handleInputFocus = () => {
    setIsTyping(true);
  };

  /**
   * Reset error message when inputs change
   */
  useEffect(() => {
    setError("");
  }, [email, password]);

  /**
   * Stop stars animation if both fields are empty
   */
  const handleInputBlur = () => {
    if (!email && !password) {
      setIsTyping(false);
    }
  };

  /**
   * Handle form submission with validation and error handling
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setIsLoggingIn(false);
      setError((err as Error).message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background particles when typing */}
      <AnimatePresence>
        {isTyping && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/40 rounded-full shadow-lg shadow-blue-400/25"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                }}
                exit={{ opacity: 0, scale: 0 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <div className="relative z-10 bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 w-full max-w-md hover:bg-slate-800/80 hover:border-slate-600/50 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg shadow-blue-500/30">
            <LogIn className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ✈️ Welcome Back
          </h1>
          <p className="text-slate-300">Sign in to continue your journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300 backdrop-blur-sm">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-slate-700/50 backdrop-blur-sm text-white placeholder-slate-400 transition-all hover:border-slate-500/70 hover:bg-slate-700/70"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                disabled={isLoggingIn}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-slate-700/50 backdrop-blur-sm text-white placeholder-slate-400 transition-all hover:border-slate-500/70 hover:bg-slate-700/70"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                disabled={isLoggingIn}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-6 py-3 font-semibold transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border border-blue-500/30 hover:border-blue-400/50"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-300">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              replace
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Additional Options */}
        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-10 right-1/3 w-24 h-24 bg-cyan-500/8 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}