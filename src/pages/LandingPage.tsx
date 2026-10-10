import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { AboutSection } from '../components/landing/AboutSection';
import { Footer } from '../components/layout/Footer';
import { LoginModal } from '../components/landing/LoginModal';

export const LandingPage: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FBF7] text-[#37474F] flex flex-col selection:bg-[#E8F5E9] selection:text-[#2E7D32]">
      {/* 1. Navbar */}
      <Navbar onOpenLogin={() => setLoginModalOpen(true)} />

      {/* 2. Main Sections */}
      <main className="flex-1">
        <HeroSection onExploreFeatures={scrollToFeatures} />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
};
