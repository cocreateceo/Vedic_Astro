'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSignTheme } from '@/hooks/useSignTheme';
import { VISUAL_THEME_KEYS, VISUAL_THEMES, SIGN_PALETTES, isVisualThemeKey, isSignKey } from '@/lib/sign-themes';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const { user, isLoggedIn, logout } = useAuth();
  const { overrideKey, userSignKey, setOverride } = useSignTheme();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('vedic-profile-photo');
    if (saved) setProfilePhoto(saved);
  }, []);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfilePhoto(dataUrl);
      localStorage.setItem('vedic-profile-photo', dataUrl);
      window.dispatchEvent(new Event('profile-photo-updated'));
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const isActive = (path: string) => path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(path + '/');
  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';


  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-sign-primary/20"
      style={{
        background: scrolled ? 'var(--sign-nav-scroll)' : 'var(--sign-nav-bg)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sign-primary to-transparent animate-[headerShimmer_3s_ease-in-out_infinite]" style={{ opacity: 0.8 }} />
      <nav className="max-w-[1400px] mx-auto flex items-center px-6 py-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <Image
            src="/images/vedic-astro-logo.jpg"
            alt="Vedic Astro"
            width={40}
            height={40}
            className="rounded-full group-hover:drop-shadow-[0_0_12px_rgba(var(--sign-glow-rgb),0.5)] transition-all"
          />
          <span className="font-heading text-xl brass-metallic font-semibold group-hover:drop-shadow-[0_0_15px_rgba(var(--sign-glow-rgb),0.6)] transition-all hidden sm:inline">
            Vedic_Astro
          </span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden bg-transparent border-none cursor-pointer p-2 ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <div className={`w-6 h-0.5 bg-sign-primary relative transition-all ${menuOpen ? 'rotate-45' : ''}`}>
            <span className={`absolute w-full h-full bg-sign-primary left-0 transition-all ${menuOpen ? 'top-0 rotate-90' : 'top-[-8px]'}`} />
            <span className={`absolute w-full h-full bg-sign-primary left-0 transition-all ${menuOpen ? 'opacity-0' : 'top-[8px]'}`} />
          </div>
        </button>

        {/* Center: Nav links */}
        <ul className={`lg:flex flex-1 items-center justify-center gap-5 mx-8 ${menuOpen ? 'flex flex-col absolute top-full left-0 right-0 bg-cosmic-bg/98 p-4 border-b border-sign-primary/20 z-40' : 'hidden'}`}>
          {[
            { href: '/', label: 'Home' },
            { href: '/horoscopes', label: 'Horoscopes' },
            { href: '/kundli', label: 'Free Kundli' },
            { href: '/zodiac', label: 'Zodiac Signs' },
            { href: '/compatibility', label: 'Compatibility' },
            { href: '/panchang', label: 'Panchang' },
            { href: '/articles', label: 'Learn' },
          ].map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                prefetch={false}
                className={`text-[0.95rem] relative px-3 py-1.5 border border-sign-primary/30 rounded-lg transition-all hover:text-sign-primary hover:border-sign-primary/60 hover:bg-sign-primary/5 whitespace-nowrap ${isActive(link.href) ? 'text-sign-primary border-sign-primary/60 bg-sign-primary/10 nav-diya' : 'text-text-primary'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* Mobile auth links */}
          {menuOpen && !isLoggedIn && (
            <li className="flex pt-2 border-t border-sign-primary/10 mt-2 w-full justify-center">
              <Link href="/login" className="text-[0.95rem] bg-gradient-to-br from-sign-primary to-sign-dark text-cosmic-bg px-5 py-1.5 rounded-lg font-medium transition-all" onClick={() => setMenuOpen(false)}>Login / Sign Up</Link>
            </li>
          )}
          {menuOpen && isLoggedIn && (
            <li className="flex gap-3 pt-2 border-t border-sign-primary/10 mt-2 w-full justify-center">
              <Link href="/dashboard" className="text-[0.95rem] text-text-primary hover:text-sign-primary transition-colors px-3 py-1.5" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/profile" className="text-[0.95rem] text-text-primary hover:text-sign-primary transition-colors px-3 py-1.5" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-[0.95rem] text-red-400 hover:text-red-300 transition-colors px-3 py-1.5">Logout</button>
            </li>
          )}
        </ul>

        {/* Right: Actions (language, theme, login) */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <LanguageSelector />

          {/* Theme Selector */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="flex items-center gap-1.5 text-[0.95rem] py-2 transition-colors hover:text-sign-primary text-text-primary"
              title="Change theme"
            >
              <span className="w-4 h-4 rounded-full border-2 border-sign-primary" style={{ background: `var(--sign-primary)` }} />
              <span className="hidden md:inline text-xs truncate max-w-[90px] notranslate" translate="no">
                {overrideKey
                  ? isVisualThemeKey(overrideKey)
                    ? VISUAL_THEMES[overrideKey].name
                    : isSignKey(overrideKey)
                      ? SIGN_PALETTES[overrideKey].name
                      : 'Theme'
                  : userSignKey
                    ? SIGN_PALETTES[userSignKey].name
                    : VISUAL_THEMES['vedic-ember'].name}
              </span>
            </button>
            {themeOpen && (
              <div className="absolute right-0 top-full mt-2 bg-bg-card rounded-lg py-2 min-w-[220px] shadow-lg border border-sign-primary/10 z-50 max-h-[400px] overflow-y-auto">
                <div className="px-3 py-1.5 text-text-muted text-xs uppercase tracking-wider border-b border-sign-primary/10 mb-1">Themes</div>
                {VISUAL_THEME_KEYS.map(key => {
                  const theme = VISUAL_THEMES[key];
                  const isActive = overrideKey === key || (!overrideKey && !userSignKey && key === 'vedic-ember');
                  return (
                    <button
                      key={key}
                      onClick={() => { setOverride(key); setThemeOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors hover:bg-sign-primary/10 ${isActive ? 'bg-sign-primary/5' : ''}`}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white"
                        style={{ background: theme.primary }}
                      >
                        {isActive ? '\u2713' : ''}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-text-primary text-sm">{theme.name}</span>
                        <span className="text-text-muted text-[10px] leading-tight">{theme.description}</span>
                      </div>
                    </button>
                  );
                })}
                {userSignKey && (
                  <>
                    <div className="border-t border-sign-primary/10 my-1" />
                    <div className="px-3 py-1.5 text-text-muted text-xs uppercase tracking-wider">Your Sign</div>
                    <button
                      onClick={() => { setOverride(null); setThemeOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors hover:bg-sign-primary/10 ${!overrideKey ? 'bg-sign-primary/5' : ''}`}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white"
                        style={{ background: SIGN_PALETTES[userSignKey].primary }}
                      >
                        {!overrideKey ? '\u2713' : ''}
                      </span>
                      <span className="text-text-primary text-sm">{SIGN_PALETTES[userSignKey].name} ({SIGN_PALETTES[userSignKey].hindi})</span>
                    </button>
                  </>
                )}
                {overrideKey && (
                  <>
                    <div className="border-t border-sign-primary/10 my-1" />
                    <button
                      onClick={() => { setOverride(null); setThemeOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-text-muted text-xs hover:bg-sign-primary/10 transition-colors"
                    >
                      {userSignKey ? 'Reset to Sign Theme' : 'Reset to Default'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Login / Profile */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-sign-primary to-sign-dark text-cosmic-bg font-bold text-sm flex items-center justify-center cursor-pointer border-2 border-sign-primary/40"
                >
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={initials} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); photoInputRef.current?.click(); }}
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-sign-primary flex items-center justify-center cursor-pointer border border-cosmic-bg hover:scale-110 transition-transform"
                  title="Upload photo"
                >
                  <svg className="w-2.5 h-2.5 text-cosmic-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-cosmic-card rounded-xl py-2 min-w-[200px] shadow-xl border border-sign-primary/20 z-50 backdrop-blur-sm">
                  <Link href="/dashboard" prefetch={false} className="flex items-center gap-2.5 px-4 py-2.5 text-text-primary hover:bg-sign-primary/10 hover:text-sign-primary transition-colors text-sm" onClick={() => setDropdownOpen(false)}>
                    <span className="text-base notranslate" translate="no">&#x1F3DB;&#xFE0F;</span> My Dashboard
                  </Link>
                  <Link href="/profile" prefetch={false} className="flex items-center gap-2.5 px-4 py-2.5 text-text-primary hover:bg-sign-primary/10 hover:text-sign-primary transition-colors text-sm" onClick={() => setDropdownOpen(false)}>
                    <span className="text-base notranslate" translate="no">&#x1F464;</span> My Profile
                  </Link>
                  <div className="border-t border-sign-primary/10 my-1" />
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm">
                    <span className="text-base notranslate" translate="no">&#x1F6AA;</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-premium bg-gradient-to-br from-sign-primary to-sign-dark text-cosmic-bg px-6 py-2 rounded-lg font-medium transition-all inline-block"
              onClick={() => setMenuOpen(false)}
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
