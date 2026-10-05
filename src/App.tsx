/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorksSection } from './components/HowItWorksSection';
import { RegistrationForm } from './components/RegistrationForm';
import { WhoWeServeSection } from './components/WhoWeServeSection';
import { Language } from './types/registration';

export default function App() {
  const [lang, setLang] = useState<Language>('ta');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#23181A]">
      <Header lang={lang} onLanguageChange={setLang} />
      <main className="flex-1">
        <Hero lang={lang} />
        <AboutSection lang={lang} />
        <HowItWorksSection lang={lang} />
        <WhoWeServeSection lang={lang} />
        <RegistrationForm lang={lang} />
        <FaqSection lang={lang} />
        <ContactSection lang={lang} />
      </main>
      <Footer lang={lang} onLanguageChange={setLang} />
    </div>
  );
}
