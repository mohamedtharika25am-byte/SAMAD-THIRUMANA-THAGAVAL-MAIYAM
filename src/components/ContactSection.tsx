import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';
import { buildWhatsAppClickToChatUrl } from '../utils/whatsappFormatter';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = getTranslation(lang).contact;

  const whatsappInquiryUrl = buildWhatsAppClickToChatUrl(
    SITE_CONFIG.whatsappDestinationNumber,
    t.defaultInquiryMessage
  );

  return (
    <section
      id="contact"
      className="border-b border-[#E6DDD2] bg-[#F4EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Header & Direct WhatsApp CTA (5 Columns) */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wider text-[#7A1C2E]">
              {t.eyebrow}
            </p>
            <h2
              className="mt-2 font-serif-display text-3xl font-semibold text-[#23181A] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {t.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5A484B] sm:text-base">
              {t.subtitle}
            </p>

            <div className="mt-7">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-[#15803D] px-6 py-4 text-sm font-bold text-white shadow-xs transition-colors duration-150 hover:bg-[#166534] sm:text-base"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                <span>{t.whatsappCta}</span>
              </a>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-[#7A685D]">
              {t.configNotice}
            </p>
          </div>

          {/* Right Contact Placeholder Cards (7 Columns) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6">
              <p className="text-xs font-semibold text-[#7A1C2E]">
                {t.phoneLabel}
              </p>
              <p className="mt-2 font-mono text-base font-semibold text-[#23181A] tabular-nums">
                {SITE_CONFIG.contactPlaceholders.phoneDisplay}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6">
              <p className="text-xs font-semibold text-[#7A1C2E]">
                {t.whatsappLabel}
              </p>
              <p className="mt-2 font-mono text-base font-semibold text-[#23181A] tabular-nums">
                {SITE_CONFIG.contactPlaceholders.whatsappDisplay}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6">
              <p className="text-xs font-semibold text-[#7A1C2E]">
                {t.addressLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#38272A]">
                {lang === 'ta'
                  ? SITE_CONFIG.contactPlaceholders.addressTamil
                  : SITE_CONFIG.contactPlaceholders.addressEnglish}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6">
              <p className="text-xs font-semibold text-[#7A1C2E]">
                {t.hoursLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#38272A]">
                {lang === 'ta'
                  ? SITE_CONFIG.contactPlaceholders.workingHoursTamil
                  : SITE_CONFIG.contactPlaceholders.workingHoursEnglish}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
