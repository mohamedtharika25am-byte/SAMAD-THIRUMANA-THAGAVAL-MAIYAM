import React from 'react';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';

interface HowItWorksSectionProps {
  lang: Language;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  lang,
}) => {
  const t = getTranslation(lang).howItWorks;

  return (
    <section
      id="how-it-works"
      className="border-b border-[#E6DDD2] bg-[#F4EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
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
        </div>

        {/* 4-Step Editorial Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-7"
            >
              <div>
                <div className="flex items-baseline justify-between border-b border-[#EAE0D3] pb-4">
                  <span className="font-serif-display text-3xl font-bold text-[#7A1C2E] tabular-nums">
                    {step.number}
                  </span>
                  <span className="text-xs font-medium text-[#8C7768]">
                    {lang === 'ta' ? `படி ${step.number}` : `Step ${step.number}`}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-[#23181A]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5A484B]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Discretion & Mutual Interest Notice */}
        <div className="mt-10 rounded-2xl border border-[#D8C5B4] bg-[#FAF7F2] px-6 py-5 sm:px-8">
          <p className="text-sm leading-relaxed text-[#38272A]">
            {t.privacyNotice}
          </p>
        </div>
      </div>
    </section>
  );
};
