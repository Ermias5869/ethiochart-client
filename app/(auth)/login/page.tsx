'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore, getRolePath } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import FlagStripe from '@/components/layout/FlagStripe';

type LoginTab = 'admin' | 'doctor' | 'patient';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<LoginTab>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      switch (activeTab) {
        case 'admin':
          response = await api.adminLogin(email, password);
          break;
        case 'doctor':
          response = await api.doctorLogin(email, password);
          break;
        case 'patient':
          response = await api.patientLogin(email, password);
          break;
      }

      const { accessToken, user } = response.data;
      setAuth(user, accessToken);
      router.push(getRolePath(user.role));
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: LoginTab; label: string }[] = [
    { key: 'admin', label: 'Admin' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'patient', label: 'Patient' },
  ];

  return (
    <div className="bg-surface overflow-hidden">
      <FlagStripe />
      <main className="flex h-screen w-full">
        {/* LEFT: Institutional Authority */}
        <section className="hidden md:flex w-[45%] bg-primary-container relative flex-col items-center justify-between py-16 px-12 overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 ethiopian-pattern pointer-events-none opacity-20" />

          {/* Logo */}
          <div className="relative z-10 flex flex-col items-center text-center mt-auto">
            <div className="w-32 h-32 bg-on-primary-container rounded-lg flex items-center justify-center mb-8 shadow-2xl ring-4 ring-gold/20">
              <span className="material-symbols-outlined text-white text-7xl">
                shield_with_heart
              </span>
            </div>
            <h1 className="font-headline text-5xl font-extrabold text-white tracking-tight mb-4">
              EthioChart
            </h1>
            <p className="text-on-primary-container font-medium text-lg max-w-sm">
              Ethiopia&apos;s National Hospital Management System
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-auto">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-gold font-semibold">
              Federal Ministry of Health
            </p>
          </div>
        </section>

        {/* RIGHT: Authentication */}
        <section className="w-full md:w-[55%] bg-surface-container-lowest flex flex-col justify-center items-center px-6 lg:px-24">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <nav className="flex w-full mb-12 border-b border-outline-variant/30">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setError('');
                  }}
                  className={`flex-1 py-4 text-center font-headline font-semibold transition-colors ${
                    activeTab === tab.key
                      ? 'text-primary border-b-2 border-gold'
                      : 'text-outline hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-headline font-bold text-primary mb-2">
                Welcome Back
              </h2>
              <p className="text-on-surface-variant font-medium">
                Please enter your sovereign credentials.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-error-container text-error text-sm rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email */}
              <div className="space-y-2">
                <label
                  className="block font-mono text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider"
                  htmlFor="email"
                >
                  Government ID / Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-4 bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-medium placeholder:text-outline/50"
                    id="email"
                    name="email"
                    placeholder="name@health.gov.et"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label
                    className="block font-mono text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Secure Password
                  </label>
                  <a className="text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary-container transition-colors" href="#">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-12 py-4 bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-medium"
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-primary border-outline-variant rounded focus:ring-primary"
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="ml-3 block text-sm font-medium text-on-surface-variant" htmlFor="remember-me">
                  Stay authenticated for 8 hours
                </label>
              </div>

              {/* Submit */}
              <button
                className="w-full bg-primary text-white py-5 px-4 rounded-lg font-headline font-bold text-lg shadow-lg hover:bg-primary-container hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined text-xl">login</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10">
                <span className="material-symbols-outlined text-sm text-gold">
                  verified_user
                </span>
                <span className="font-mono text-[0.625rem] font-medium text-on-surface-variant tracking-wide">
                  Protected by EthioChart Secure Authentication
                </span>
              </div>
              <div className="mt-8 flex justify-center space-x-6 text-[0.75rem] font-medium text-outline">
                <a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
                <a className="hover:text-primary transition-colors" href="#">Access Policy</a>
                <a className="hover:text-primary transition-colors" href="#">System Status</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
