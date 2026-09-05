import React from 'react';
import { Smartphone, HeartHandshake, Map } from 'lucide-react';

interface ValuePropsSectionProps {
  onOpenAppPreview: () => void;
  onOpenOnboarding: () => void;
  onScrollToDestinations: () => void;
}

export const ValuePropsSection: React.FC<ValuePropsSectionProps> = ({
  onOpenAppPreview,
  onOpenOnboarding,
  onScrollToDestinations
}) => {
  return (
    <section id="why-choose-us-section" className="max-w-[1360px] mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black uppercase tracking-tight max-w-xl leading-tight">
          WHY TRAVELERS CHOOSE US
        </h2>

        <div className="flex flex-col md:items-end gap-1 md:text-right">
          <h3 className="text-2xl sm:text-3xl text-black font-normal italic font-serif uppercase tracking-tight leading-tight">
            WE ARE THE<br />TOP MOBILE<br />TRAVEL APPS
          </h3>
          <p className="text-xs sm:text-sm text-[#5c5d6e] font-medium max-w-xs mt-2">
            According to the world rating list of tour apps in 2024
          </p>
        </div>
      </div>

      {/* 3 Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Card 1: Lavender Bento */}
        <div 
          onClick={onOpenAppPreview}
          className="bg-[#e3e2f7] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between h-[360px] sm:h-[380px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-[#d2d1ee] group"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 duration-200">
            <Smartphone className="w-8 h-8 text-black" />
          </div>

          <div>
            <h4 className="text-2xl font-bold text-black uppercase tracking-tight mb-2 font-sans leading-tight">
              CLEAR &amp; SIMPLE APP INTERFACE
            </h4>
            <p className="text-base text-[#1a1c1c]/80 leading-relaxed font-normal">
              Buy a tour in just two clicks.<br />
              It's possible with our app.
            </p>
          </div>
        </div>

        {/* Card 2: White Bento */}
        <div 
          onClick={onOpenOnboarding}
          className="bg-white rounded-[32px] p-8 sm:p-10 flex flex-col justify-between h-[360px] sm:h-[380px] border border-[#e5e5e5] shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
        >
          <div className="w-16 h-16 bg-[#f3f3f4] rounded-2xl flex items-center justify-center border border-[#e5e5e5] shadow-xs transition-transform group-hover:scale-105 duration-200">
            <HeartHandshake className="w-8 h-8 text-black" />
          </div>

          <div>
            <h4 className="text-2xl font-bold text-black uppercase tracking-tight mb-2 font-sans leading-tight">
              THE MOBILE APP IS FREE FOR YOU
            </h4>
            <p className="text-base text-[#5c5d6e] leading-relaxed font-normal">
              You can use the application without a paid subscription.
            </p>
          </div>
        </div>

        {/* Card 3: Sage Green Bento */}
        <div 
          onClick={onScrollToDestinations}
          className="bg-[#e4ebce] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between h-[360px] sm:h-[380px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-[#d2dac0] group"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 duration-200">
            <Map className="w-8 h-8 text-black" />
          </div>

          <div>
            <h4 className="text-2xl font-bold text-black uppercase tracking-tight mb-2 font-sans leading-tight">
              A LOT OF COOL TOURS &amp; ROUTES
            </h4>
            <p className="text-base text-[#1a1c1c]/80 leading-relaxed font-normal">
              You can choose the tour you are interested in with our app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
