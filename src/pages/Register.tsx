import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('User One');
  const [email, setEmail] = useState('u2@example.com');
  const [password, setPassword] = useState('pass123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ctx) return;
    setIsLoading(true);
    setErr(null);
    try {
      await ctx.register(name, email, password);
      setOk(true);
      // small pause then go to login
      setTimeout(() => navigate('/login', { replace: true }), 800);
    } catch (error: any) {
      setErr(error?.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">CF</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Create your account</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Join CreditFlow in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {err && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                {err}
              </div>
            )}
            {ok && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-200">
                Registered! Redirecting to login…
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Full name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-900 dark:text-white"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-900 dark:text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-900 dark:text-white"
                  placeholder="Choose a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Already have an account? </span>
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
