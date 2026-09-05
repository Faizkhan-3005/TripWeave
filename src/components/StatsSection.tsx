import React from 'react';

export const StatsSection: React.FC = () => {
  return (
    <section id="stats-section" className="max-w-[1360px] mx-auto px-6 sm:px-10 pb-16 sm:pb-24 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left">
        {/* Stat 1 */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-none font-sans">
            1K+
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-[#1a1c1c] font-normal italic uppercase tracking-normal font-serif leading-tight">
            UNIQUE<br />TOURS
          </p>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-none font-sans">
            10K+
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-[#1a1c1c] font-normal italic uppercase tracking-normal font-serif leading-tight">
            HAPPY<br />TRAVELERS
          </p>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight leading-none font-sans">
            4.8+
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl text-[#1a1c1c] font-normal italic uppercase tracking-normal font-serif leading-tight">
            APP STORE<br />RATING
          </p>
        </div>
      </div>
    </section>
  );
};
