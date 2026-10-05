import React, { useState } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const [imgError, setImgError] = useState(false);
  const t = getTranslation(lang).about;

  return (
    <section
      id="about"
      className="border-b border-[#E6DDD2] bg-[#FAF7F2] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Editorial Narrative (7 Columns) */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-wider text-[#7A1C2E]">
              {t.eyebrow}
            </p>
            <h2
              className="mt-2 font-serif-display text-3xl font-semibold text-[#23181A] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {t.title}
            </h2>

            <p className="mt-5 text-base font-medium leading-relaxed text-[#38272A] sm:text-lg">
              {t.lead}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#5A484B] sm:text-base">
              {t.description}
            </p>

            {/* 4 Key Pillars separated by hairline rules */}
            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#E6DDD2] pt-8 sm:grid-cols-2">
              {t.highlights.map((item, idx) => (
                <div key={item.title} className="flex flex-col">
                  <span className="text-xs font-semibold text-[#9B7418] tabular-nums">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-[#23181A]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#5A484B]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Frame (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-[#E2D6C8] bg-[#F3ECE2] shadow-xs">
              <div className="aspect-4/3 w-full overflow-hidden bg-[#2D141B]">
                {!imgError ? (
                  <img
                    src={SITE_CONFIG.images.aboutRings}
                    alt="Two traditional gold wedding rings with fresh jasmine flowers and brass lamp"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7A1C2E] to-[#3B1019] p-8 text-center text-[#F5E6C8]">
                    <div>
                      <p className="font-serif-display text-xl font-semibold">
                        {SITE_CONFIG.brandNameTamil}
                      </p>
                      <p className="mt-1 text-xs tracking-wider">
                        {SITE_CONFIG.brandNameEnglish}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="font-serif-display text-lg font-semibold text-[#7A1C2E]">
                  {SITE_CONFIG.brandNameTamil}
                </p>
                <p className="text-xs font-semibold tracking-wide text-[#6B5A5D]">
                  {SITE_CONFIG.brandNameEnglish}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#4B3B3E]">
                  {t.imageCaption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
