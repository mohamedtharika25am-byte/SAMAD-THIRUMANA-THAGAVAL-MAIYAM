import React, { useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';
import { buildWhatsAppClickToChatUrl } from '../utils/whatsappFormatter';

interface HeroProps {
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const [imgError, setImgError] = useState(false);
  const t = getTranslation(lang).hero;
  const contactT = getTranslation(lang).contact;

  const directWhatsAppUrl = buildWhatsAppClickToChatUrl(
    SITE_CONFIG.whatsappDestinationNumber,
    contactT.defaultInquiryMessage
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-[#E6DDD2] bg-[#221216]"
    >
      {/* Background Media with Measured Dark Scrim */}
      <div className="absolute inset-0 z-0">
        {!imgError ? (
          <img
            src={SITE_CONFIG.images.heroWedding}
            alt="Traditional South Indian Tamil matrimonial atmosphere with brass lamps and flowers"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center opacity-45"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#3B1019] via-[#261115] to-[#1A0C0E]" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1D0D10]/95 via-[#241015]/85 to-[#1D0D10]/70"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1D0D10] via-transparent to-[#1D0D10]/50"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          {/* Bilingual Identity Header */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-[#E7C888]">
            <span>{SITE_CONFIG.brandNameTamil}</span>
            <span aria-hidden="true">·</span>
            <span>{SITE_CONFIG.brandNameEnglish}</span>
          </div>

          <p className="mb-3 text-xs sm:text-sm font-medium text-[#E5D7C6]">
            {t.kicker}
          </p>

          {/* Main Display Heading */}
          <h1
            className="font-serif-display text-3xl font-semibold leading-tight text-[#FFFBF5] sm:text-5xl lg:text-[54px] lg:leading-[1.15]"
            style={{ textWrap: 'balance' }}
          >
            {t.title}
          </h1>

          {/* Secondary Language Subtitle Mirror for clarity */}
          <p className="mt-3 text-sm font-medium text-[#E7C888]/90 sm:text-base">
            {lang === 'ta'
              ? 'Finding the Right Life Partner Begins with the Right Connection'
              : 'சரியான வாழ்க்கைத் துணையை தேடும் பயணத்தில் சரியான இணைப்பு'}
          </p>

          {/* Supporting Text */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#EFE6DC] sm:text-lg">
            {t.subtitle}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <a
              href="#registration"
              className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-[#C59B27] px-6 py-4 text-sm font-bold text-[#1F1305] shadow-sm transition-colors duration-150 hover:bg-[#D4AC36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7C888] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D0D10] sm:text-base"
            >
              <span>{t.primaryCta}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </a>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border border-[#E7C888]/40 bg-[#FFFBF5]/10 px-6 py-4 text-sm font-semibold text-[#FFFBF5] backdrop-blur-xs transition-colors duration-150 hover:bg-[#FFFBF5]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7C888] sm:text-base"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[#4ADE80]" />
              <span>{t.secondaryCta}</span>
            </a>
          </div>

          {/* Unboxed Trust Metadata Line */}
          <div className="mt-10 border-t border-[#FFFBF5]/15 pt-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-[#D8C8B8]">
              {t.trustPoints.map((point, idx) => (
                <React.Fragment key={point}>
                  {idx > 0 && (
                    <span aria-hidden="true" className="text-[#C59B27]">
                      ·
                    </span>
                  )}
                  <span>{point}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
