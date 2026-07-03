'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login('student', 'password');
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
        setSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-center items-center p-6 overflow-hidden">
      {/* Decorative Blur Background Circles */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-secondary-container/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] glass-panel p-8 rounded-3xl glow-shadow relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-extrabold font-headline-md text-primary tracking-tight">Royal Group</h1>
            <p className="text-xs font-label-sm text-on-surface-variant/70 mt-1 uppercase tracking-wider">Islamabad Hostel City</p>
          </Link>
          <h2 className="text-xl font-bold mt-8 text-on-surface">Student Portal Sign In</h2>
          <p className="text-xs text-on-surface-variant mt-1">Click the button below to access your account.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container/20 border border-error-container text-error text-xs flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 mt-2 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Accessing Portal...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                Access Student Portal
              </>
            )}
          </button>
        </form>

        {/* Back to Home */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[16px] transform group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
