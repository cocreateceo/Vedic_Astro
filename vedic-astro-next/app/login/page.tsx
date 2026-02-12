'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';

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

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-text-primary">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const socialProviders = [
  { name: 'Google', icon: GoogleIcon },
  { name: 'Facebook', icon: FacebookIcon },
  { name: 'Apple', icon: AppleIcon },
  { name: 'GitHub', icon: GitHubIcon },
];

function SocialLoginButtons() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2.5">
        {socialProviders.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="relative flex items-center justify-center py-2.5 rounded-lg border border-sign-primary/10 bg-cosmic-bg/20 opacity-40 cursor-not-allowed group"
            title={`${name} — Coming Soon`}
          >
            <Icon />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-cosmic-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-[9px] text-sign-primary font-medium uppercase tracking-wider">Soon</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-text-muted/30 text-[10px] mt-2 mb-1">Social login coming soon</p>
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

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const result = login(email, password);
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    }
  }

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess('');
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

    if (!data.timezone) { setError('Please select your birth place timezone'); return; }

    try {
      const result = register(data);
      if (result.success) {
        setSuccess('Account created! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    }
  }

  function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSent(true);
    }
  }

  const inputClass = "w-full bg-cosmic-bg/50 border border-sign-primary/20 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-sign-primary/60 focus:shadow-[0_0_15px_rgba(var(--sign-glow-rgb),0.15)] transition-all duration-300";

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
            {/* Star dots */}
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

          {/* Om Symbol watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] text-sign-primary/[0.04] font-devanagari select-none pointer-events-none">
            ॐ
          </div>

          {/* Content */}
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
              || ज्योतिषां सूर्यश्चन्द्रमसौ ||
            </p>
            <h3 className="font-heading text-3xl text-text-primary leading-snug mb-4">
              Unlock Your <span className="text-sign-primary">Cosmic</span> Blueprint
            </h3>
            <p className="text-text-muted leading-relaxed text-sm">
              5,000 years of Vedic wisdom, decoded for your life journey. Discover your birth chart, planetary alignments, and personalized predictions rooted in ancient Indian astronomical science.
            </p>
          </div>

          {/* Features */}
          <div className="relative z-10 space-y-4 my-8">
            {[
              { icon: '♈', title: 'Personalized Kundli', desc: 'Detailed birth chart with Rashi, Navamsa & Dasha periods' },
              { icon: '🔮', title: 'Daily Horoscopes', desc: 'Predictions based on your Moon sign & Nakshatra' },
              { icon: '✦', title: 'Planetary Transits', desc: 'Real-time Graha positions & their impact on your life' },
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

          {/* Quote */}
          <div className="relative z-10 border-l-2 border-sign-primary/30 pl-4 py-1">
            <p className="text-text-muted/80 text-sm italic leading-relaxed">
              &ldquo;{quotes[0].text}&rdquo;
            </p>
            <p className="text-sign-primary/60 text-xs mt-1">— {quotes[0].source}</p>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="p-8 md:p-10 bg-gradient-to-b from-cosmic-surface/80 to-cosmic-bg/90 backdrop-blur-sm">
          <h1 className="font-heading text-2xl text-sign-primary text-center mb-2">
            {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-text-muted/70 text-sm text-center mb-8">
            {showForgotPassword
              ? 'Enter your email to receive a reset link'
              : activeTab === 'login'
                ? 'Sign in to explore your celestial journey'
                : 'Begin your journey through the stars'}
          </p>

          {/* Forgot Password View */}
          {showForgotPassword ? (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-sign-primary/10 border border-sign-primary/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sign-primary">
                      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </div>
                  <h3 className="text-text-primary font-medium">Check Your Email</h3>
                  <p className="text-text-muted/70 text-sm">
                    If an account exists for <span className="text-sign-primary">{forgotEmail}</span>, we&apos;ve sent password reset instructions.
                  </p>
                  <button
                    onClick={() => { setShowForgotPassword(false); setForgotSent(false); setForgotEmail(''); }}
                    className="text-sign-primary text-sm hover:underline underline-offset-4 transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
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
                  <button type="submit" className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)]">
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setForgotEmail(''); }}
                    className="w-full text-text-muted/70 text-sm hover:text-text-primary transition-colors py-2"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div className="flex mb-6 bg-cosmic-bg/40 rounded-lg p-1">
                {(['login', 'signup'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); setShowPassword(false); }}
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
                        onClick={() => setShowForgotPassword(true)}
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
                  <button type="submit" className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)]">
                    Sign In
                  </button>
                  <p className="text-center text-text-muted/50 text-xs mt-4">
                    Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }} className="text-sign-primary/80 hover:text-sign-primary transition-colors">
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
                      <input type="date" name="dob" required className={inputClass} />
                    </div>
                    <div>
                      <label className="text-text-muted text-sm block mb-1.5">Time of Birth</label>
                      <input type="time" name="tob" required className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="text-text-muted text-sm block mb-1.5">Place of Birth</label>
                    <input type="text" name="pob" required placeholder="City, Country" className={inputClass} />
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
                  <button type="submit" className="btn-premium w-full bg-gradient-to-r from-sign-primary to-sign-dark text-cosmic-bg py-3 rounded-lg font-medium transition-all hover:shadow-[0_0_25px_rgba(var(--sign-glow-rgb),0.3)]">
                    Create Account
                  </button>
                  <p className="text-center text-text-muted/50 text-xs mt-2">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }} className="text-sign-primary/80 hover:text-sign-primary transition-colors">
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
