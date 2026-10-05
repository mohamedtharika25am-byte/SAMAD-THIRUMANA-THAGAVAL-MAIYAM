import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';
import { buildWhatsAppClickToChatUrl } from '../utils/whatsappFormatter';
import { Logo } from './Logo';

interface FooterProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onLanguageChange }) => {
  const t = getTranslation(lang).footer;
  const headerT = getTranslation(lang).header;
  const contactT = getTranslation(lang).contact;

  const whatsappUrl = buildWhatsAppClickToChatUrl(
    SITE_CONFIG.whatsappDestinationNumber,
    contactT.defaultInquiryMessage
  );

  return (
    <footer className="bg-[#1D0E12] pb-24 pt-14 text-[#E6D9CB] sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-[#FFFBF5]/10 pb-10 md:grid-cols-12">
          {/* Brand Column (6 Cols) */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-3.5">
              <Logo className="h-11 w-11" />
              <div>
                <p className="font-serif-display text-lg font-semibold text-[#F7E4B5] sm:text-xl">
                  {SITE_CONFIG.brandNameTamil}
                </p>
                <p className="font-serif-display text-sm font-bold tracking-wider text-[#FFFBF5]">
                  {SITE_CONFIG.brandNameEnglish}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm font-medium text-[#E7C888]">
              {t.tagline}
            </p>
            <p className="mt-1 text-xs text-[#C6B5A6]">{t.taglineTamil}</p>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-[#B29F91]">
              {t.privacySummary}
            </p>
          </div>

          {/* Navigation Links (3 Cols) */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-wider text-[#E7C888]">
              {t.quickLinks}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="#home"
                  className="text-[#D8C8B8] transition-colors hover:text-white"
                >
                  {headerT.nav.home}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-[#D8C8B8] transition-colors hover:text-white"
                >
                  {headerT.nav.about}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-[#D8C8B8] transition-colors hover:text-white"
                >
                  {headerT.nav.howItWorks}
                </a>
              </li>
              <li>
                <a
                  href="#registration"
                  className="text-[#D8C8B8] transition-colors hover:text-white"
                >
                  {headerT.nav.registration}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-[#D8C8B8] transition-colors hover:text-white"
                >
                  {headerT.nav.faq}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[#D8C8B8] transition-colors hover:text-white"
                >
                  {headerT.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Language Switch & Direct Contact (3 Cols) */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-wider text-[#E7C888]">
              {t.languageSwitchLabel}
            </p>
            <div className="mt-3 inline-flex items-center rounded-lg border border-[#FFFBF5]/20 bg-[#2C161C] p-1">
              <button
                type="button"
                onClick={() => onLanguageChange('ta')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  lang === 'ta'
                    ? 'bg-[#C59B27] text-[#1D0E12]'
                    : 'text-[#D8C8B8] hover:text-white'
                }`}
              >
                தமிழ்
              </button>
              <span aria-hidden="true" className="px-1 text-xs text-[#8C7768]">
                |
              </span>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  lang === 'en'
                    ? 'bg-[#C59B27] text-[#1D0E12]'
                    : 'text-[#D8C8B8] hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <div className="mt-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#4ADE80]/40 bg-[#15803D]/30 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#15803D]/50"
              >
                <MessageCircle className="h-4 w-4 text-[#4ADE80]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-xs text-[#9E8B7D] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.brandNameEnglish} (
            {SITE_CONFIG.brandNameTamil}). {t.copyright}
          </p>
          <a
            href="#contact"
            className="hover:text-[#E7C888] transition-colors"
          >
            {headerT.nav.contact}
          </a>
        </div>
      </div>

      {/* Compact Mobile Sticky Bottom Bar (Strictly <= 56px height to stay well within 15% mobile sticky cap) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DECFC2] bg-[#FAF7F2]/95 px-3 py-2 backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <a
            href="#registration"
            className="flex-1 truncate rounded-lg bg-[#7A1C2E] px-3 py-2.5 text-center text-xs font-bold text-white"
          >
            {lang === 'ta' ? 'வரன் பதிவு செய்க' : 'Register Details'}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#15803D] px-3.5 py-2.5 text-xs font-bold text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
