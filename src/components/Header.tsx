import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';
import { Logo } from './Logo';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onLanguageChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslation(lang).header;

  const navItems = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#how-it-works', label: t.nav.howItWorks },
    { href: '#registration', label: t.nav.registration },
    { href: '#faq', label: t.nav.faq },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E6DDD2] bg-[#FAF7F2]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Title */}
        <a
          href="#home"
          className="group flex min-w-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1C2E] rounded-lg"
        >
          <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="truncate font-serif-display text-sm font-bold tracking-wide text-[#23181A] sm:text-base lg:text-lg">
            {SITE_CONFIG.brandNameEnglish}
          </span>
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex lg:items-center lg:gap-7"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-[#524144] transition-colors duration-150 hover:text-[#7A1C2E] hover:underline hover:underline-offset-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1C2E] rounded-xs"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-lg border border-[#DECFC2] bg-[#F2EBE1] p-0.5"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('ta')}
              aria-pressed={lang === 'ta'}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 sm:px-3 ${
                lang === 'ta'
                  ? 'bg-[#7A1C2E] text-white shadow-2xs'
                  : 'text-[#524144] hover:text-[#23181A]'
              }`}
            >
              தமிழ்
            </button>
            <span aria-hidden="true" className="px-0.5 text-xs text-[#B5A192]">
              |
            </span>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              aria-pressed={lang === 'en'}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 sm:px-3 ${
                lang === 'en'
                  ? 'bg-[#7A1C2E] text-white shadow-2xs'
                  : 'text-[#524144] hover:text-[#23181A]'
              }`}
            >
              English
            </button>
          </div>

          <a
            href="#registration"
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[#7A1C2E] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#611524] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1C2E] focus-visible:ring-offset-2"
          >
            {t.registerBtn}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DECFC2] text-[#23181A] transition-colors hover:bg-[#F2EBE1] lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E6DDD2] bg-[#FAF7F2] px-4 pt-3 pb-5 lg:hidden">
          <div className="mb-3 border-b border-[#EFE7DC] pb-2.5">
            <p className="text-xs font-medium text-[#7A1C2E]">
              {SITE_CONFIG.brandNameTamil}
            </p>
            <p className="text-xs text-[#6B5A5D]">
              {SITE_CONFIG.brandNameEnglish}
            </p>
          </div>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#23181A] transition-colors hover:bg-[#F2EBE1] hover:text-[#7A1C2E]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 pt-2">
            <a
              href="#registration"
              onClick={handleNavClick}
              className="flex w-full items-center justify-center rounded-lg bg-[#7A1C2E] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#611524]"
            >
              {t.registerBtn}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
