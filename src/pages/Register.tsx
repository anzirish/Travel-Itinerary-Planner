import { useEffect, useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, UserPlus, AlertCircle, Loader2, Plane } from "lucide-react";

/**
 * Register Component - User registration page
 * Features animated background effects, airplane animation on success,
 * and dark glassmorphism design matching the travel adventure theme
 */
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  /**
   * Reset error message when inputs change
   */
  useEffect(() => {
    setError("");
  }, [email, password]);

  /**
   * Handle input focus - start particle animation
   */
  const handleInputFocus = () => {
    setIsTyping(true);
  };

  /**
   * Stop animation if both fields are empty
   */
  const handleInputBlur = () => {
    if (!email && !password) {
      setIsTyping(false);
    }
  };

  /**
   * Handle email input changes with animation control
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!isTyping) setIsTyping(true);
    if (!e.target.value && !password) {
      setIsTyping(false);
    }
  };

  /**
   * Handle password input changes with animation control
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!isTyping) setIsTyping(true);
    if (!e.target.value && !email) {
      setIsTyping(false);
    }
  };

  /**
   * Handle form submission with airplane animation and redirect
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");

    try {
      await register(email, password);
      // Redirect after airplane animation completes
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    } catch (err) {
      setIsRegistering(false);
      setError((err as Error).message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Animated background particles when typing */}
      <AnimatePresence>
        {isTyping && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(45)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-indigo-400/40 rounded-full shadow-lg shadow-indigo-400/25"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.3, 0.5],
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

      {/* Registration Card */}
      <div className="relative z-10 bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 w-full max-w-md hover:bg-slate-800/80 hover:border-slate-600/50 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg shadow-indigo-500/30">
            <UserPlus className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ✈️ Travel Itinerary Planner
          </h1>
          <p className="text-slate-300">Create your account to start planning amazing trips</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300 backdrop-blur-sm">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 bg-slate-700/50 backdrop-blur-sm text-white placeholder-slate-400 transition-all hover:border-slate-500/70 hover:bg-slate-700/70"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                disabled={isRegistering}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 bg-slate-700/50 backdrop-blur-sm text-white placeholder-slate-400 transition-all hover:border-slate-500/70 hover:bg-slate-700/70"
                placeholder="••••••••••"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                disabled={isRegistering}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Password should be at least 8 characters long
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl px-6 py-3 font-semibold transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border border-indigo-500/30 hover:border-indigo-400/50"
          >
            {isRegistering ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
              replace
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Terms Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            By creating an account, you agree to our{" "}
            <span className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors">Terms of Service</span>
            {" "}and{" "}
            <span className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>

        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Animated Airplane on Registration Success */}
      <AnimatePresence>
        {isRegistering && (
          <motion.div
            className="absolute z-20 pointer-events-none"
            initial={{
              x: "-15vw",
              y: "60vh",
              rotate: -45,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: [
                "-15vw", "10vw", "30vw", "50vw", "70vw", "85vw", "80vw",
                "65vw", "45vw", "25vw", "10vw", "30vw", "50vw", "70vw",
                "90vw", "110vw",
              ],
              y: [
                "60vh", "40vh", "25vh", "15vh", "25vh", "40vh", "55vh", "70vh",
                "80vh", "70vh", "55vh", "35vh", "20vh", "30vh", "45vh", "25vh",
              ],
              rotate: [
                -45, -20, 10, 30, 15, -15, -35, -50, -25, 0,
                20, 35, 25, 10, -10, 0,
              ],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
              scale: [
                0.5, 1, 1.2, 1, 0.8, 1.1, 1, 0.9,
                1.2, 1, 1.1, 1, 1.2, 1, 0.8, 0.5,
              ],
            }}
            transition={{
              duration: 3.5,
              ease: "easeInOut",
            }}
            exit={{ opacity: 0 }}
          >
            <Plane size={100} className="text-indigo-400 drop-shadow-2xl shadow-indigo-400/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-4 w-16 h-16 bg-pink-500/8 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-cyan-500/8 rounded-full blur-2xl pointer-events-none"></div>

      {/* Success Message Overlay */}
      <AnimatePresence>
        {isRegistering && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl border border-slate-700/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Welcome Aboard! ✈️</h3>
              <p className="text-slate-300">Your account has been created successfully.</p>
              <p className="text-sm text-slate-400 mt-2">Redirecting you to your dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}