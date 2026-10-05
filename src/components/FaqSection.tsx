import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getTranslation } from '../i18n/translations';
import { Language } from '../types/registration';

interface FaqSectionProps {
  lang: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = getTranslation(lang).faq;

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="border-b border-[#E6DDD2] bg-[#FAF7F2] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#7A1C2E]">
            {t.eyebrow}
          </p>
          <h2
            className="mt-2 font-serif-display text-3xl font-semibold text-[#23181A] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {t.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5A484B] sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 divide-y divide-[#E4D9C8] rounded-2xl border border-[#E0D5C7] bg-[#F6F1E8]">
          {t.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 text-left focus:outline-none"
                >
                  <span className="text-base font-semibold text-[#23181A] sm:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`mt-1 h-5 w-5 shrink-0 text-[#7A1C2E] transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 pr-6 text-sm leading-relaxed text-[#4F3E41] sm:text-base">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
