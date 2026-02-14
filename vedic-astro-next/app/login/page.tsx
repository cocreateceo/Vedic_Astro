'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import BirthDatePicker from '@/components/ui/BirthDatePicker';
import BirthTimePicker from '@/components/ui/BirthTimePicker';
import CityAutocomplete from '@/components/ui/CityAutocomplete';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-text-primary">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.11 4.45-3.74 4.25z" />
    </svg>
  );
}

const socialProviders = [
  { name: 'Google', provider: 'google', icon: GoogleIcon },
  { name: 'Facebook', provider: 'facebook', icon: FacebookIcon },
  { name: 'Apple', provider: 'apple', icon: AppleIcon },
];

function SocialLoginButtons() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5">
        {socialProviders.map(({ name, provider, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => { window.location.href = `${apiUrl}/auth/oauth/authorize?provider=${provider}`; }}
            className="flex items-center justify-center py-2.5 rounded-lg border border-sign-primary/20 bg-cosmic-bg/20 hover:bg-sign-primary/10 hover:border-sign-primary/40 transition-all duration-200 group"
            title={`Continue with ${name}`}
          >
            <Icon />
            <span className="ml-2 text-text-muted text-xs group-hover:text-text-primary transition-colors">{name}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sign-primary/20 to-transparent" />
        <span className="text-text-muted/40 text-xs uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sign-primary/20 to-transparent" />
      </div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

const quotes = [
  { text: "The stars incline, they do not compel.", source: "Ancient Vedic Wisdom" },
  { text: "Jyotish is the eye of the Vedas — the light that illuminates the path of destiny.", source: "Brihat Parashara Hora Shastra" },
  { text: "As above, so below. As within, so without.", source: "Hermetic Principle" },
];

type AuthView = 'login' | 'signup' | 'verify' | 'forgot-email' | 'forgot-code' | 'forgot-success';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [view, setView] = useState<AuthView>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyEmail, setVerifyEmailAddr] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const { login, loginWithOAuthToken, register, verifyEmail: verifyEmailFn, resendVerification, forgotPassword, resetPassword } = useAuth();
  const router = useRouter();

  // Handle query params (OAuth callback + tab selection)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'signup') { setActiveTab('signup'); setView('signup'); }

    const oauthToken = params.get('oauth_token');
    const oauthError = params.get('error');
    const needsProfile = params.get('needs_profile');

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      // Clean URL
      window.history.replaceState({}, '', '/login/');
      return;
    }

    if (oauthToken) {
      setOauthLoading(true);
      setSuccess('Signing you in...');
      // Clean URL immediately
      window.history.replaceState({}, '', '/login/');

      loginWithOAuthToken(oauthToken).then((result) => {
        if (result.success) {
          if (result.needsProfile || needsProfile === '1') {
            router.push('/complete-profile');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(result.error || 'OAuth login failed');
          setSuccess('');
          setOauthLoading(false);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputClass = "w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-sign-primary/60 focus:shadow-[0_0_15px_rgba(var(--sign-glow-rgb),0.15)] transition-all duration-300";

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const result = await login(email, password);
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else if (result.needsVerification) {
        setVerifyEmailAddr(result.email || email);
        setView('verify');
        setError('');
        setSuccess('Please verify your email to continue.');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
      dob: (form.elements.namedItem('dob') as HTMLInputElement).value,
      tob: (form.elements.namedItem('tob') as HTMLInputElement).value,
      pob: (form.elements.namedItem('pob') as HTMLInputElement).value,
      timezone: (form.elements.namedItem('timezone') as HTMLSelectElement).value,
    };

    if (!data.timezone) { setError('Please select your birth place timezone'); setLoading(false); return; }

    try {
      const result = await register(data);
      if (result.success && result.autoLoggedIn) {
        setSuccess('Account created! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else if (result.success) {
        setVerifyEmailAddr(data.email);
        setView('verify');
        setError('');
        setSuccess('Account created! Please check your email for a verification code.');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const result = await verifyEmailFn(verifyEmail, verifyCode);
      if (result.success) {
        setSuccess('Email verified! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const result = await resendVerification(verifyEmail);
      if (result.success) {
        setSuccess('A new verification code has been sent to your email.');
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const result = await forgotPassword(forgotEmail);
      if (result.success) {
        setView('forgot-code');
        setSuccess('If an account exists with this email, a reset code has been sent.');
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const result = await resetPassword(forgotEmail, resetCode, newPassword);
      if (result.success) {
        setView('forgot-success');
        setSuccess('Password reset successfully!');
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendResetCode() {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const result = await forgotPassword(forgotEmail);
      if (result.success) {
        setSuccess('A new reset code has been sent to your email.');
      }
    } catch {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  }

  function goBackToLogin() {
    setView('login');
    setActiveTab('login');
    setError('');
    setSuccess('');
    setVerifyCode('');
    setResetCode('');
    setNewPassword('');
    setForgotEmail('');
    setLoading(false);
  }

  // ── Verification View ──────────────────────────────────────────────

  function renderVerifyView() {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-sign-primary/10 border border-sign-primary/20 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sign-primary">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h3 className="text-text-primary font-medium text-lg">Verify Your Email</h3>
          <p className="text-text-muted/70 text-sm mt-1">
            Enter the 6-digit code sent to <span className="text-sign-primary">{verifyEmail}</span>
          </p>
        </div>

        {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>{error}</div>}
        {success && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-lg text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>{success}</div>}

        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div>
            <label className="text-text-muted text-sm block mb-1.5">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className={`${inputClass} text-center text-2xl tracking-[0.5em] font-mono`}
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading || verifyCode.length !== 6} className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <button onClick={handleResendCode} disabled={loading} className="text-sign-primary/70 text-sm hover:text-sign-primary transition-colors disabled:opacity-50">
            Resend Code
          </button>
          <div>
            <button onClick={goBackToLogin} className="text-text-muted/70 text-sm hover:text-text-primary transition-colors">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Forgot Password Views ──────────────────────────────────────────

  function renderForgotEmailView() {
    return (
      <div className="space-y-4">
        {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>{error}</div>}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="text-text-muted text-sm block mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
          <button
            type="button"
            onClick={goBackToLogin}
            className="w-full text-text-muted/70 text-sm hover:text-text-primary transition-colors py-2"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  function renderForgotCodeView() {
    return (
      <div className="space-y-4">
        {error && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>{error}</div>}
        {success && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-lg text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>{success}</div>}

        <p className="text-text-muted/70 text-sm text-center">
          Enter the 6-digit code sent to <span className="text-sign-primary">{forgotEmail}</span> and your new password.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="text-text-muted text-sm block mb-1.5">Reset Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className={`${inputClass} text-center text-2xl tracking-[0.5em] font-mono`}
              autoFocus
            />
          </div>
          <div>
            <label className="text-text-muted text-sm block mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-muted transition-colors"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading || resetCode.length !== 6} className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <button onClick={handleResendResetCode} disabled={loading} className="text-sign-primary/70 text-sm hover:text-sign-primary transition-colors disabled:opacity-50">
            Resend Code
          </button>
          <div>
            <button onClick={goBackToLogin} className="text-text-muted/70 text-sm hover:text-text-primary transition-colors">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderForgotSuccessView() {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-text-primary font-medium text-lg">Password Reset Successfully</h3>
        <p className="text-text-muted/70 text-sm">
          You can now login with your new password.
        </p>
        <button
          onClick={goBackToLogin}
          className="btn-premium bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg px-8 py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)]"
        >
          Back to Login
        </button>
      </div>
    );
  }

  // ── Determine which view to show ──────────────────────────────────

  const isForgotView = view === 'forgot-email' || view === 'forgot-code' || view === 'forgot-success';
  const isVerifyView = view === 'verify';

  const headerTitle = isForgotView ? 'Reset Password' : isVerifyView ? 'Verify Email' : 'Welcome Back';
  const headerSubtitle = isForgotView
    ? (view === 'forgot-email' ? 'Enter your email to receive a reset code' : view === 'forgot-code' ? 'Enter your reset code and new password' : '')
    : isVerifyView
      ? 'Enter the verification code from your email'
      : activeTab === 'login'
        ? 'Sign in to explore your celestial journey'
        : 'Begin your journey through the stars';

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-sign-primary/15 shadow-[0_0_60px_rgba(var(--sign-glow-rgb),0.08)]">

        {/* Left Panel - Vedic Astro Content */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-cosmic-bg via-bg-light to-cosmic-surface overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 border border-sign-primary/15 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute top-16 right-16 w-20 h-20 border border-sign-secondary/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute bottom-20 left-10 w-24 h-24 border border-sign-primary/10 rounded-full animate-[spin_35s_linear_infinite]" />
            {[
              'top-[15%] left-[20%]', 'top-[30%] right-[25%]', 'top-[60%] left-[15%]',
              'top-[45%] right-[10%]', 'bottom-[25%] left-[35%]', 'top-[20%] left-[60%]',
              'bottom-[40%] right-[30%]', 'top-[75%] left-[50%]',
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-1 h-1 bg-sign-primary/40 rounded-full`}
                style={{ animation: `pulse ${2 + (i * 0.3)}s ease-in-out infinite alternate` }}
              />
            ))}
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] text-sign-primary/[0.04] font-devanagari select-none pointer-events-none">
            {'\u0950'}
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <Image
                src="/images/vedic-astro-logo.jpg"
                alt="Vedic Astro"
                width={50}
                height={50}
                className="rounded-full group-hover:drop-shadow-[0_0_15px_rgba(var(--sign-glow-rgb),0.4)] transition-all"
              />
              <h2 className="font-heading text-2xl text-sign-primary tracking-wider">Vedic Astro</h2>
            </Link>
            <p className="font-devanagari text-sign-primary/60 text-sm mb-6">
              || {'\u091C\u094D\u092F\u094B\u0924\u093F\u0937\u093E\u0902'} {'\u0938\u0942\u0930\u094D\u092F\u0936\u094D\u091A\u0928\u094D\u0926\u094D\u0930\u092E\u0938\u094C'} ||
            </p>
            <h3 className="font-heading text-3xl text-text-primary leading-snug mb-4">
              Unlock Your <span className="text-sign-primary">Cosmic</span> Blueprint
            </h3>
            <p className="text-text-muted leading-relaxed text-sm">
              5,000 years of Vedic wisdom, decoded for your life journey. Discover your birth chart, planetary alignments, and personalized predictions rooted in ancient Indian astronomical science.
            </p>
          </div>

          <div className="relative z-10 space-y-4 my-8">
            {[
              { icon: '\uD83D\uDC0F', title: 'Personalized Kundli', desc: 'Detailed birth chart with Rashi, Navamsa & Dasha periods' },
              { icon: '\uD83D\uDD2E', title: 'Daily Horoscopes', desc: 'Predictions based on your Moon sign & Nakshatra' },
              { icon: '\u2726', title: 'Planetary Transits', desc: 'Real-time Graha positions & their impact on your life' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 group">
                <span className="text-xl mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">{feature.icon}</span>
                <div>
                  <h4 className="text-text-primary text-sm font-medium">{feature.title}</h4>
                  <p className="text-text-muted/70 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 border-l-2 border-sign-primary/30 pl-4 py-1">
            <p className="text-text-muted/80 text-sm italic leading-relaxed">
              &ldquo;{quotes[0].text}&rdquo;
            </p>
            <p className="text-sign-primary/60 text-xs mt-1">&mdash; {quotes[0].source}</p>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="p-8 md:p-10 bg-gradient-to-b from-cosmic-surface/80 to-cosmic-bg/90 backdrop-blur-sm">
          <h1 className="font-heading text-2xl text-sign-primary text-center mb-2">
            {headerTitle}
          </h1>
          {headerSubtitle && (
            <p className="text-text-muted/70 text-sm text-center mb-8">
              {headerSubtitle}
            </p>
          )}

          {/* OAuth Loading */}
          {oauthLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-2 border-sign-primary/30 border-t-sign-primary rounded-full animate-spin" />
              <p className="text-sign-primary text-sm font-medium">Signing you in...</p>
            </div>
          )}

          {/* Verify Email View */}
          {!oauthLoading && isVerifyView && renderVerifyView()}

          {/* Forgot Password Views */}
          {!oauthLoading && view === 'forgot-email' && renderForgotEmailView()}
          {!oauthLoading && view === 'forgot-code' && renderForgotCodeView()}
          {!oauthLoading && view === 'forgot-success' && renderForgotSuccessView()}

          {/* Normal Login/Signup */}
          {!oauthLoading && !isVerifyView && !isForgotView && (
            <>
              {/* Tab Switcher */}
              <div className="flex mb-6 bg-cosmic-bg/40 rounded-lg p-1">
                {(['login', 'signup'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setView(tab); setError(''); setSuccess(''); setShowPassword(false); }}
                    className={`flex-1 py-2.5 text-center text-sm font-medium rounded-md transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-sign-primary/15 text-sign-primary shadow-sm'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {tab === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Error / Success */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg mb-4 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-lg mb-4 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {success}
                </div>
              )}

              {/* Social Login */}
              <SocialLoginButtons />

              {/* Login Form */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-text-muted text-sm block mb-1.5">Email</label>
                    <input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-text-muted text-sm">Password</label>
                      <button
                        type="button"
                        onClick={() => { setView('forgot-email'); setError(''); setSuccess(''); }}
                        className="text-sign-primary/70 text-xs hover:text-sign-primary transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        placeholder="Enter your password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-muted transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                  <p className="text-center text-text-muted/50 text-xs mt-4">
                    Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => { setActiveTab('signup'); setView('signup'); setError(''); setSuccess(''); }} className="text-sign-primary/80 hover:text-sign-primary transition-colors">
                      Create one
                    </button>
                  </p>
                </form>
              ) : (
                /* Signup Form */
                <form onSubmit={handleSignup} className="space-y-3.5">
                  <div>
                    <label className="text-text-muted text-sm block mb-1.5">Full Name</label>
                    <input type="text" name="name" required placeholder="Your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-text-muted text-sm block mb-1.5">Email</label>
                    <input type="email" name="email" required placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-text-muted text-sm block mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        minLength={6}
                        placeholder="Min. 6 characters"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-muted transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-text-muted text-sm block mb-1.5">Date of Birth</label>
                      <BirthDatePicker name="dob" required />
                    </div>
                    <div>
                      <label className="text-text-muted text-sm block mb-1.5">Time of Birth</label>
                      <BirthTimePicker name="tob" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-text-muted text-sm block mb-1.5">Place of Birth</label>
                    <CityAutocomplete name="pob" required />
                  </div>
                  <div>
                    <label className="text-text-muted text-sm block mb-1.5">Timezone</label>
                    <select name="timezone" required className={inputClass}>
                      <option value="">Select timezone</option>
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">US Eastern</option>
                      <option value="America/Chicago">US Central</option>
                      <option value="America/Denver">US Mountain</option>
                      <option value="America/Los_Angeles">US Pacific</option>
                      <option value="Europe/London">UK (GMT)</option>
                      <option value="Europe/Paris">Central Europe (CET)</option>
                      <option value="Asia/Dubai">UAE (GST)</option>
                      <option value="Asia/Singapore">Singapore (SGT)</option>
                      <option value="Australia/Sydney">Australia (AEST)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                  <p className="text-center text-text-muted/50 text-xs mt-2">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setActiveTab('login'); setView('login'); setError(''); setSuccess(''); }} className="text-sign-primary/80 hover:text-sign-primary transition-colors">
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
