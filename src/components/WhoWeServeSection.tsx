import React, { useState } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';

interface WhoWeServeSectionProps {
  lang: Language;
}

export const WhoWeServeSection: React.FC<WhoWeServeSectionProps> = ({
  lang,
}) => {
  const [imgError, setImgError] = useState(false);
  const t = getTranslation(lang).whoWeServe;

  return (
    <section className="border-b border-[#E6DDD2] bg-[#FAF7F2] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Header & Floral Visual (4 Columns) */}
          <div className="lg:col-span-4">
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

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2D6C8] bg-[#F3ECE2]">
              <div className="aspect-4/3 w-full overflow-hidden">
                {!imgError ? (
                  <img
                    src={SITE_CONFIG.images.traditionFloral}
                    alt="Traditional South Indian wedding flowers and silk details"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#7A1C2E] p-6 text-center text-[#F5E6C8]">
                    <span className="font-serif-display text-lg">
                      {SITE_CONFIG.brandNameTamil}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right 4 Community Cards (8 Columns) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
            {t.communities.map((community, index) => (
              <div
                key={community.name}
                className="flex flex-col justify-between rounded-2xl border border-[#E2D6C8] bg-[#F6F1E8] p-6 sm:p-7"
              >
                <div>
                  <span className="text-xs font-semibold text-[#9B7418] tabular-nums">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-serif-display text-2xl font-semibold text-[#23181A]">
                    {community.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A484B]">
                    {community.description}
                  </p>
                </div>
                <div className="mt-6 border-t border-[#E5DBC9] pt-4">
                  <a
                    href="#registration"
                    className="inline-flex items-center text-xs font-semibold text-[#7A1C2E] hover:underline hover:underline-offset-4"
                  >
                    {lang === 'ta'
                      ? 'வரன் விவரம் பதிவு செய்ய →'
                      : 'Register matrimonial details →'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
