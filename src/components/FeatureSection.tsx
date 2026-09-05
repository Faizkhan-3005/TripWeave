import React from 'react';
import { InteractiveTrioPhones } from './InteractiveTrioPhones';

interface FeatureSectionProps {
  onOpenReviews: () => void;
  onExploreTour: (tourId: string) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  onOpenReviews,
  onExploreTour
}) => {
  return (
    <section id="feature-highlight-section" className="max-w-[1360px] mx-auto px-4 sm:px-10 pb-16 sm:pb-24">
      <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border border-[#e5e5e5] shadow-sm">
        {/* Left Column: Headings & CTA */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight leading-[1.05]">
            IMMENSE TOURS SELECTION
          </h2>

          <p className="text-lg sm:text-2xl lg:text-3xl text-[#1a1c1c] font-normal italic font-serif leading-snug uppercase">
            WE TURN YOUR DREAMS INTO UNFORGETTABLE TRAVEL
          </p>

          <div className="pt-2">
            <button
              id="feature-view-reviews-btn"
              onClick={onOpenReviews}
              className="px-7 py-3.5 rounded-full border border-black text-black font-semibold text-sm hover:bg-black hover:text-white transition-all duration-200 cursor-pointer"
            >
              View reviews
            </button>
          </div>
        </div>

        {/* Right Column: 3 Distinct Side-by-Side Interactive Phone Screens */}
        <div className="lg:col-span-8 flex justify-center items-center w-full">
          <InteractiveTrioPhones onExploreTour={onExploreTour} />
        </div>
      </div>
    </section>
  );
};
