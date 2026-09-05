import React from 'react';
import { ArrowDownToLine, Play } from 'lucide-react';
import { InteractivePhoneShowcase } from './InteractivePhoneShowcase';

interface HeroSectionProps {
  onStartOnboarding: () => void;
  onOpenAppPreview: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartOnboarding,
  onOpenAppPreview
}) => {
  return (
    <section id="hero-section" className="max-w-[1360px] mx-auto px-6 sm:px-10 pt-8 sm:pt-14 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Heading & Lavender Bento Card */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Main Hero Typography */}
          <h1 className="text-[60px] sm:text-[78px] lg:text-[96px] font-extrabold text-black tracking-[-0.04em] leading-[0.92] uppercase font-sans mb-8">
            PLAN YOUR <br />
            <span className="italic font-normal tracking-tight font-serif text-[#1a1c1c]">ESCAPE</span>
          </h1>

          {/* Lavender Feature Box */}
          <div className="bg-[#e3e2f7] rounded-[36px] p-8 sm:p-10 flex flex-col justify-between border border-[#d2d1ee]">
            <p className="text-base sm:text-lg text-[#1a1c1c] leading-relaxed font-normal mb-8 max-w-lg">
              We have the largest selection of unique tours. Try our easy and quick tour selection for any request. 24–hour support is always happy to answer all your questions.
            </p>

            <button
              id="hero-get-started-btn"
              onClick={onStartOnboarding}
              className="bg-black text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all w-fit mb-10 cursor-pointer shadow-sm"
            >
              Get Started
            </button>

            {/* Mobile App Download Info Row */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-8 pt-6 border-t border-black/10">
              <span className="text-sm sm:text-base text-[#1a1c1c] leading-snug font-medium">
                The mobile app<br />is available now
              </span>

              <div className="flex items-center gap-3">
                <button
                  id="hero-download-app-icon-btn"
                  onClick={onOpenAppPreview}
                  title="Download Mobile App"
                  className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <ArrowDownToLine className="w-5 h-5" />
                </button>
                <button
                  id="hero-play-preview-icon-btn"
                  onClick={onOpenAppPreview}
                  title="Preview App Simulator"
                  className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Interactive Smartphone Showcase (Image 2 design) */}
        <div className="lg:col-span-6 flex justify-center items-center w-full">
          <InteractivePhoneShowcase onOpenAppPreview={onOpenAppPreview} />
        </div>
      </div>
    </section>
  );
};
