import React, { useState } from 'react';
import { 
  Wifi, Battery, Signal, Search, Heart, Star, ChevronLeft, 
  MapPin, Calendar, Check, Compass, User, Share2, Bookmark, 
  Clock, ArrowRight, Sparkles, CheckCircle2, Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TOURS_DATA } from '../data/toursData';

interface InteractiveTrioPhonesProps {
  onExploreTour?: (tourId: string) => void;
}

export const InteractiveTrioPhones: React.FC<InteractiveTrioPhonesProps> = ({
  onExploreTour
}) => {
  // State for Phone 1 (Explore)
  const [activeCategory, setActiveCategory] = useState<'tours' | 'hotels' | 'flights' | 'activities'>('tours');
  const [phone1Liked, setPhone1Liked] = useState<boolean>(true);

  // State for Phone 2 (Tour Detail & Selection)
  const [selectedAddon, setSelectedAddon] = useState<string>('secrets');
  const [phone2Booked, setPhone2Booked] = useState<boolean>(false);

  // State for Phone 3 (Itinerary Day by Day)
  const [activeDay, setActiveDay] = useState<number>(1);
  const [phone3Reserved, setPhone3Reserved] = useState<boolean>(false);

  const handlePhone2Book = () => {
    setPhone2Booked(true);
    if (onExploreTour) onExploreTour('paris-elegance');
    setTimeout(() => setPhone2Booked(false), 3000);
  };

  const handlePhone3Reserve = () => {
    setPhone3Reserved(true);
    if (onExploreTour) onExploreTour('paris-elegance');
    setTimeout(() => setPhone3Reserved(false), 3000);
  };

  return (
    <div className="w-full bg-[#e3e2f7] rounded-[32px] sm:rounded-[36px] p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-center border border-[#d2d1ee] overflow-hidden shadow-inner">
      {/* 3 Phones Flex Container - On mobile only show the first hero phone cleanly */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6 py-2">
        
        {/* ========================================================================= */}
        {/* PHONE 1: DISCOVERY & CITY OVERVIEW PAGE                                  */}
        {/* ========================================================================= */}
        <div className="w-[260px] sm:w-[270px] lg:w-[275px] h-[500px] sm:h-[520px] bg-white rounded-[38px] p-2 shadow-xl border-[4px] border-white flex flex-col overflow-hidden relative transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          
          {/* Notch / Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-30 flex items-center justify-end px-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
          </div>

          {/* Status Bar */}
          <div className="w-full px-4 pt-1.5 pb-1 flex justify-between items-center text-black text-[10px] font-bold z-20 bg-white">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-2.5 h-2.5 fill-current" />
              <Wifi className="w-2.5 h-2.5" />
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Inner Screen */}
          <div className="bg-[#fcfcfd] w-full flex-grow rounded-[28px] overflow-hidden flex flex-col text-black text-xs">
            
            {/* Header */}
            <div className="px-3 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block">Destination</span>
                <h4 className="text-xs font-black text-black leading-tight flex items-center gap-1">
                  Paris, France 🇫🇷
                </h4>
              </div>
              <span className="text-[9px] font-bold bg-[#e3e2f7] text-black px-2 py-0.5 rounded-full">
                May 10–17
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="px-2.5 py-2 flex gap-1 overflow-x-auto no-scrollbar bg-white">
              {[
                { id: 'tours', label: 'Tours' },
                { id: 'hotels', label: 'Hotels' },
                { id: 'flights', label: 'Flights' },
                { id: 'activities', label: 'Activities' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-2.5 space-y-2.5">
              {/* Featured Tour Card */}
              <div 
                onClick={() => onExploreTour && onExploreTour('paris-elegance')}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs cursor-pointer group"
              >
                <div className="relative h-24 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={TOURS_DATA[2].image} 
                    alt="Paris Louvre and Eiffel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                    Top Pick
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhone1Liked(!phone1Liked);
                    }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-black"
                  >
                    <Heart className={`w-3 h-3 ${phone1Liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="p-2">
                  <h5 className="text-[11px] font-black text-black leading-tight">The Heart of Paris</h5>
                  <p className="text-[9px] text-gray-500 mt-0.5">7 Days &bull; VIP Louvre &amp; Champagne Seine</p>
                  <div className="mt-1.5 flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-black">$1,999</span>
                    <span className="text-[8px] font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400 stroke-none" /> 4.95 (512)
                    </span>
                  </div>
                </div>
              </div>

              {/* Experiences Section */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Experiences</span>
                
                {/* Item 1 */}
                <div className="bg-white p-2 rounded-xl border border-gray-200 flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                    ⛵
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-bold text-black truncate">Seine Sunset Cruise</p>
                    <p className="text-[8px] text-gray-500">Sommelier wine tasting</p>
                  </div>
                  <span className="text-[9px] font-bold text-black">$120</span>
                </div>

                {/* Item 2 */}
                <div className="bg-white p-2 rounded-xl border border-gray-200 flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 font-bold text-xs flex items-center justify-center shrink-0">
                    🥐
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-bold text-black truncate">Montmartre Pastry Crawl</p>
                    <p className="text-[8px] text-gray-500">Artisan bakery tour</p>
                  </div>
                  <span className="text-[9px] font-bold text-black">$80</span>
                </div>
              </div>
            </div>

            {/* Bottom App Nav */}
            <div className="bg-white border-t border-gray-100 px-2 py-1.5 flex justify-around items-center text-[8px] text-gray-400">
              <span className="font-extrabold text-black flex flex-col items-center">
                <Compass className="w-3 h-3" /> Explore
              </span>
              <span className="flex flex-col items-center">
                <Heart className="w-3 h-3" /> Saved
              </span>
              <span className="flex flex-col items-center">
                <Ticket className="w-3 h-3" /> Trips
              </span>
              <span className="flex flex-col items-center">
                <User className="w-3 h-3" /> Profile
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PHONE 2: TOUR DETAIL & ATTRACTION EXPLORER (CENTER HERO PHONE)            */}
        {/* ========================================================================= */}
        <div className="w-[265px] sm:w-[275px] lg:w-[285px] h-[535px] bg-white rounded-[40px] p-2 shadow-2xl border-[4px] border-white flex flex-col overflow-hidden relative transition-all duration-300 md:-translate-y-2 hover:scale-[1.03] z-10">
          
          {/* Notch / Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-30 flex items-center justify-end px-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
          </div>

          {/* Status Bar */}
          <div className="w-full px-4 pt-1.5 pb-1 flex justify-between items-center text-black text-[10px] font-bold z-20 bg-white">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-2.5 h-2.5 fill-current" />
              <Wifi className="w-2.5 h-2.5" />
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Inner Screen */}
          <div className="bg-[#fcfcfd] w-full flex-grow rounded-[30px] overflow-hidden flex flex-col text-black text-xs">
            
            {/* Header with Search */}
            <div className="px-3 py-2 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> PARIS EXPLORER
                </span>
                <div className="flex gap-1.5 text-gray-500">
                  <Share2 className="w-3 h-3 cursor-pointer" />
                  <Bookmark className="w-3 h-3 cursor-pointer" />
                </div>
              </div>

              {/* Search Bar Input */}
              <div className="bg-gray-100 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[9px] text-gray-500">
                <Search className="w-2.5 h-2.5 text-gray-400" />
                <span>Search attractions, monuments...</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-2.5 space-y-2.5">
              
              {/* Landmark Monument Hero Card */}
              <div className="relative h-28 rounded-2xl overflow-hidden shadow-xs bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" 
                  alt="Arc de Triomphe and Paris skyline"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                  <span className="text-[8px] uppercase tracking-wider text-amber-300 font-bold">Iconic Landmark</span>
                  <h4 className="text-xs font-black leading-tight">Arc de Triomphe &bull; Twilight</h4>
                  <p className="text-[8px] text-gray-300">Champs-Élysées &bull; Rooftop Panoramic Views</p>
                </div>
              </div>

              {/* Package Add-on / Selection List */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Tour Selection</span>
                
                {/* Option 1 */}
                <div 
                  onClick={() => setSelectedAddon('secrets')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedAddon === 'secrets'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedAddon === 'secrets' ? 'border-white bg-white text-black' : 'border-gray-300'
                    }`}>
                      {selectedAddon === 'secrets' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold leading-tight">The Heart of Paris</p>
                      <p className={`text-[8px] ${selectedAddon === 'secrets' ? 'text-gray-300' : 'text-gray-500'}`}>
                        7 Days &bull; All-Inclusive Villa &amp; Dinners
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold">$1,999</span>
                </div>

                {/* Option 2 */}
                <div 
                  onClick={() => setSelectedAddon('cruise')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedAddon === 'cruise'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedAddon === 'cruise' ? 'border-white bg-white text-black' : 'border-gray-300'
                    }`}>
                      {selectedAddon === 'cruise' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold leading-tight">Seine River Yacht Cruise</p>
                      <p className={`text-[8px] ${selectedAddon === 'cruise' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Champagne sommelier tasting
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold">+$120</span>
                </div>
              </div>
            </div>

            {/* Bottom Booking Action Bar */}
            <div className="bg-white border-t border-gray-100 p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[8px] text-gray-400 block font-medium">Total Package</span>
                <span className="text-xs font-black text-black">$1,999</span>
              </div>

              <button
                onClick={handlePhone2Book}
                className="bg-black text-white hover:bg-gray-800 active:scale-95 px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
              >
                {phone2Booked ? 'Booked ✓' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PHONE 3: DAY-BY-DAY ITINERARY & RESERVATIONS PAGE                         */}
        {/* ========================================================================= */}
        <div className="w-[260px] sm:w-[270px] lg:w-[275px] h-[520px] bg-white rounded-[38px] p-2 shadow-xl border-[4px] border-white flex flex-col overflow-hidden relative transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          
          {/* Notch / Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-30 flex items-center justify-end px-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
          </div>

          {/* Status Bar */}
          <div className="w-full px-4 pt-1.5 pb-1 flex justify-between items-center text-black text-[10px] font-bold z-20 bg-white">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-2.5 h-2.5 fill-current" />
              <Wifi className="w-2.5 h-2.5" />
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Inner Screen */}
          <div className="bg-[#fcfcfd] w-full flex-grow rounded-[28px] overflow-hidden flex flex-col text-black text-xs">
            
            {/* Header */}
            <div className="px-3 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider block">Confirmed Itinerary</span>
                <h4 className="text-xs font-black text-black leading-tight">The Secrets of Paris</h4>
              </div>
              <span className="text-[8px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                7 Days
              </span>
            </div>

            {/* Day Selector Buttons */}
            <div className="px-2 py-1.5 flex gap-1 bg-gray-50 border-b border-gray-100 overflow-x-auto no-scrollbar">
              {[1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`px-2 py-0.5 rounded-md text-[8px] font-bold transition-colors cursor-pointer ${
                    activeDay === d ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  Day {d}
                </button>
              ))}
            </div>

            {/* Scrollable Timeline List */}
            <div className="flex-grow overflow-y-auto p-2.5 space-y-2">
              
              {/* Day 1 */}
              <div className={`p-2 rounded-xl border transition-all ${
                activeDay === 1 ? 'bg-white border-black shadow-xs' : 'bg-gray-50/70 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold bg-[#e3e2f7] text-black px-1.5 py-0.2 rounded">Day 1</span>
                  <span className="text-[8px] text-gray-400">Arrival</span>
                </div>
                <h6 className="text-[10px] font-bold text-black mt-1">Arrival &amp; Saint-Germain Reception</h6>
                <p className="text-[8px] text-gray-500 mt-0.5 leading-snug">
                  VIP airport transfer, luxury boutique hotel check-in, macaron &amp; champagne welcome.
                </p>
              </div>

              {/* Day 2 */}
              <div className={`p-2 rounded-xl border transition-all ${
                activeDay === 2 ? 'bg-white border-black shadow-xs' : 'bg-gray-50/70 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold bg-[#e3e2f7] text-black px-1.5 py-0.2 rounded">Day 2</span>
                  <span className="text-[8px] text-gray-400">Culture</span>
                </div>
                <h6 className="text-[10px] font-bold text-black mt-1">Louvre Museum Private After-Hours</h6>
                <p className="text-[8px] text-gray-500 mt-0.5 leading-snug">
                  Skip-the-line Mona Lisa viewing with resident art historian.
                </p>
              </div>

              {/* Day 3 */}
              <div className={`p-2 rounded-xl border transition-all ${
                activeDay === 3 ? 'bg-white border-black shadow-xs' : 'bg-gray-50/70 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold bg-[#e3e2f7] text-black px-1.5 py-0.2 rounded">Day 3</span>
                  <span className="text-[8px] text-gray-400">Dining</span>
                </div>
                <h6 className="text-[10px] font-bold text-black mt-1">Arc de Triomphe &amp; Eiffel Twilight</h6>
                <p className="text-[8px] text-gray-500 mt-0.5 leading-snug">
                  Champs-Élysées stroll and illuminated Eiffel Tower dinner.
                </p>
              </div>

              {/* Day 4 */}
              <div className={`p-2 rounded-xl border transition-all ${
                activeDay === 4 ? 'bg-white border-black shadow-xs' : 'bg-gray-50/70 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold bg-[#e3e2f7] text-black px-1.5 py-0.2 rounded">Day 4</span>
                  <span className="text-[8px] text-gray-400">Royalty</span>
                </div>
                <h6 className="text-[10px] font-bold text-black mt-1">Palace of Versailles Grand Tour</h6>
                <p className="text-[8px] text-gray-500 mt-0.5 leading-snug">
                  Hall of Mirrors and private King's gardens exploration.
                </p>
              </div>
            </div>

            {/* Bottom Reserve Button Bar */}
            <div className="bg-white border-t border-gray-100 p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[8px] text-gray-400 block font-medium">Pricing</span>
                <span className="text-xs font-black text-black">$1,999</span>
              </div>

              <button
                onClick={handlePhone3Reserve}
                className="bg-black text-white hover:bg-gray-800 active:scale-95 px-3 py-2 rounded-xl text-[9px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
              >
                {phone3Reserved ? 'Spot Reserved ✓' : 'Reserve Your Spot'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
