import React, { useState } from 'react';
import { 
  Lock, Gift, Star, SlidersHorizontal, ShoppingBag, 
  Wifi, Battery, Signal, Home, User, Check, Sparkles, 
  Filter, Clock, Plus, CheckCircle2, ArrowRight, Compass,
  MapPin, Ticket, Plane, ShieldCheck, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TOURS_DATA } from '../data/toursData';

interface InteractivePhoneShowcaseProps {
  onOpenAppPreview?: () => void;
  onSelectTour?: (tourId: string) => void;
}

type DockTab = 'membership' | 'rewards' | 'deals' | 'configure';
type PhoneSubTab = 'tours' | 'passports';

export const InteractivePhoneShowcase: React.FC<InteractivePhoneShowcaseProps> = ({
  onOpenAppPreview,
  onSelectTour
}) => {
  const [activeDockTab, setActiveDockTab] = useState<DockTab>('membership');
  const [phoneSubTab, setPhoneSubTab] = useState<PhoneSubTab>('tours');
  const [cartCount, setCartCount] = useState<number>(2);
  const [claimedDeals, setClaimedDeals] = useState<string[]>(['lounge-pass']);
  const [selectedRegion, setSelectedRegion] = useState<string>('Tropical Bali');
  const [budgetSlider, setBudgetSlider] = useState<number>(1999);
  const [durationDays, setDurationDays] = useState<number>(8);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [filterContinent, setFilterContinent] = useState<string>('all');
  const [likedTours, setLikedTours] = useState<string[]>(['bali-paradise']);
  const [bookedTourName, setBookedTourName] = useState<string | null>(null);

  const handleBookTour = (title: string, tourId?: string) => {
    setCartCount(prev => prev + 1);
    setBookedTourName(title);
    setTimeout(() => {
      setBookedTourName(null);
    }, 2800);
  };

  const handleToggleLike = (tourId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTours(prev => 
      prev.includes(tourId) ? prev.filter(id => id !== tourId) : [...prev, tourId]
    );
  };

  const handleClaimReward = (dealId: string) => {
    if (!claimedDeals.includes(dealId)) {
      setClaimedDeals(prev => [...prev, dealId]);
    }
  };

  // Filtered tours for the in-app view
  const displayedTours = filterContinent === 'all' 
    ? TOURS_DATA 
    : TOURS_DATA.filter(t => t.continent.toLowerCase() === filterContinent.toLowerCase());

  return (
    <div className="w-full relative rounded-[32px] sm:rounded-[44px] overflow-hidden p-3 sm:p-8 lg:p-10 shadow-2xl border border-white/40 flex flex-col items-center justify-center select-none bg-gradient-to-br from-[#3b82f6] via-[#60a5fa] to-[#93c5fd]">
      {/* Background Decorative Mesh Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0,transparent_70%)] pointer-events-none" />

      {/* Main Interactive Showcase Container */}
      <div className="relative w-full max-w-[540px] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 z-10 pt-2 sm:pt-4">
        
        {/* Left Floating Dock Menu */}
        <div className="relative flex flex-col items-center sm:items-end self-center">
          
          {/* Floating Dock Capsule */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-[32px] p-1.5 sm:p-2.5 shadow-xl border border-white flex sm:flex-col items-center gap-1.5 sm:gap-3 transition-all duration-300">
            
            {/* 1. Membership Tab */}
            <button
              id="demo-dock-membership-btn"
              onClick={() => {
                setActiveDockTab('membership');
                setPhoneSubTab('tours');
              }}
              className={`px-3 py-1.5 sm:px-0 sm:w-20 sm:py-3 rounded-xl sm:rounded-[22px] flex sm:flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                activeDockTab === 'membership'
                  ? 'bg-[#1c1c1e] text-white shadow-md scale-[1.02]'
                  : 'text-[#71717a] hover:text-black hover:bg-black/5'
              }`}
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">Tours</span>
            </button>

            {/* 2. Rewards Tab */}
            <button
              id="demo-dock-rewards-btn"
              onClick={() => setActiveDockTab('rewards')}
              className={`px-3 py-1.5 sm:px-0 sm:w-20 sm:py-3 rounded-xl sm:rounded-[22px] flex sm:flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                activeDockTab === 'rewards'
                  ? 'bg-[#1c1c1e] text-white shadow-md scale-[1.02]'
                  : 'text-[#71717a] hover:text-black hover:bg-black/5'
              }`}
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">Perks</span>
            </button>

            {/* 3. Smart Deals Tab */}
            <button
              id="demo-dock-deals-btn"
              onClick={() => setActiveDockTab('deals')}
              className={`px-3 py-1.5 sm:px-0 sm:w-20 sm:py-3 rounded-xl sm:rounded-[22px] flex sm:flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                activeDockTab === 'deals'
                  ? 'bg-[#1c1c1e] text-white shadow-md scale-[1.02]'
                  : 'text-[#71717a] hover:text-black hover:bg-black/5'
              }`}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight text-center leading-tight">Deals</span>
            </button>

            {/* 4. Configure Tab */}
            <button
              id="demo-dock-configure-btn"
              onClick={() => setActiveDockTab('configure')}
              className={`px-3 py-1.5 sm:px-0 sm:w-20 sm:py-3 rounded-xl sm:rounded-[22px] flex sm:flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                activeDockTab === 'configure'
                  ? 'bg-[#1c1c1e] text-white shadow-md scale-[1.02]'
                  : 'text-[#71717a] hover:text-black hover:bg-black/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight">Plan</span>
            </button>
          </div>
        </div>

        {/* Right Side: Realistic iPhone Mockup with Live Interactive Tripweave App */}
        <div className="w-[305px] sm:w-[325px] h-[585px] bg-white rounded-[46px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-[5px] border-white relative flex flex-col overflow-hidden">
          
          {/* Interactive Success Toast inside Phone */}
          <AnimatePresence>
            {bookedTourName && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-12 left-3 right-3 z-50 bg-[#1c1c1e] text-white px-3 py-2 rounded-xl text-[11px] font-medium shadow-xl flex items-center gap-2 border border-white/20"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Saved {bookedTourName} to Passes!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phone Top Notch / Dynamic Island */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-40 flex items-center justify-end px-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#18181b] border border-gray-800" />
          </div>

          {/* Status Bar: 9:41 & Icons */}
          <div className="w-full px-5 pt-1.5 pb-1 flex justify-between items-center text-black text-[11px] font-bold z-30 bg-white">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-black">
              <Signal className="w-3 h-3 fill-current stroke-none" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* Inner Phone Screen Content */}
          <div className="bg-[#fcfcfd] w-full flex-grow rounded-[34px] overflow-hidden flex flex-col relative text-black">
            
            {/* App Brand Header Bar (Tripweave) */}
            <div className="px-4 py-2.5 flex items-center justify-between bg-white border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  <Plane className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-tight text-[#1c1c1e] block leading-none">Tripweave</span>
                  <span className="text-[8px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block mr-0.5" />
                    24/7 Live Concierge
                  </span>
                </div>
              </div>

              {/* Saved Passports / Wishlist Bag */}
              <button 
                onClick={() => {
                  setActiveDockTab('membership');
                  setPhoneSubTab('passports');
                }}
                className="relative p-1.5 text-[#1c1c1e] hover:text-blue-600 transition-colors cursor-pointer"
                title="View Bookings & Saved"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-black text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sub-Tabs & Filter Pill Bar */}
            <div className="px-4 pt-2.5 pb-1.5 flex items-center justify-between bg-white border-b border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setActiveDockTab('membership');
                    setPhoneSubTab('tours');
                  }}
                  className={`text-xs font-bold transition-all relative pb-1 cursor-pointer ${
                    phoneSubTab === 'tours' && activeDockTab === 'membership'
                      ? 'text-black font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black after:rounded-full'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Escapes
                </button>

                <button
                  onClick={() => {
                    setActiveDockTab('membership');
                    setPhoneSubTab('passports');
                  }}
                  className={`text-xs font-bold transition-all relative pb-1 cursor-pointer ${
                    phoneSubTab === 'passports' && activeDockTab === 'membership'
                      ? 'text-black font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black after:rounded-full'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  VIP Passes
                </button>
              </div>

              {/* Filter Button with Toggle Dropdown */}
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  showFilterMenu 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                }`}
              >
                <Filter className="w-2.5 h-2.5" />
                <span>Filter</span>
              </button>
            </div>

            {/* Filter Dropdown Tray */}
            {showFilterMenu && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex flex-wrap gap-1.5 text-[9px] font-semibold"
              >
                {[
                  { label: 'All Regions', val: 'all' },
                  { label: 'Asia', val: 'asia' },
                  { label: 'Europe', val: 'europe' }
                ].map((cat) => (
                  <button
                    key={cat.val}
                    onClick={() => {
                      setFilterContinent(cat.val);
                      setShowFilterMenu(false);
                    }}
                    className={`px-2 py-0.5 rounded-full capitalize cursor-pointer transition-colors ${
                      filterContinent === cat.val ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Scrollable Screen Body */}
            <div className="flex-grow overflow-y-auto p-3 space-y-3">
              
              {/* VIEW 1: MEMBERSHIP / TOURS CATALOG & PASSES */}
              {activeDockTab === 'membership' && phoneSubTab === 'tours' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  
                  {/* Card 1: Bali Paradise & Private Villa */}
                  <div className="bg-white rounded-[22px] border border-gray-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                      <img 
                        src={TOURS_DATA[0].image} 
                        alt="Bali Paradise and oceanfront cliff villas"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Featured Escape
                      </span>
                      <button 
                        onClick={(e) => handleToggleLike(TOURS_DATA[0].id, e)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedTours.includes(TOURS_DATA[0].id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                      </button>
                    </div>

                    <div className="p-3">
                      {/* Tag Badges */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-[9px] font-bold text-black bg-[#e3e2f7] px-2 py-0.5 rounded-md">Bali, Indonesia</span>
                        <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">8 Days</span>
                        <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">5★ Villas</span>
                      </div>

                      <h4 className="text-xs font-black text-[#1c1c1e] tracking-tight leading-snug">
                        Bali Island &amp; Clifftop Sanctuary
                      </h4>

                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        Lush emerald rice terraces, sacred ancient water temples, and private infinity pool oceanfront villas in Uluwatu...
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-gray-400 block font-medium">All-Inclusive</span>
                          <span className="text-xs font-extrabold text-black">$1,999</span>
                        </div>

                        <button
                          onClick={() => handleBookTour('Bali Escape', TOURS_DATA[0].id)}
                          className="bg-black text-white hover:bg-gray-800 active:scale-95 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Book Tour
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Paris Grand Elegance */}
                  <div className="bg-white rounded-[22px] border border-gray-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                      <img 
                        src={TOURS_DATA[2].image} 
                        alt="Paris Seine cruise and Eiffel elegance"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        onClick={(e) => handleToggleLike(TOURS_DATA[2].id, e)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedTours.includes(TOURS_DATA[2].id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                      </button>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-[9px] font-bold text-black bg-[#ffe6d8] px-2 py-0.5 rounded-md">Paris, France</span>
                        <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">VIP Louvre</span>
                        <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">7 Days</span>
                      </div>

                      <h4 className="text-xs font-black text-[#1c1c1e] tracking-tight leading-snug">
                        Paris Elegance &amp; Gourmet Seine Cruise
                      </h4>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-black">From $1,999</span>
                        <button
                          onClick={() => handleBookTour('Paris Tour', TOURS_DATA[2].id)}
                          className="bg-[#f3f3f4] text-black hover:bg-black hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Italy Renaissance */}
                  <div className="bg-white rounded-[22px] border border-gray-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                      <img 
                        src={TOURS_DATA[3].image} 
                        alt="Italy Rome and Venice canals"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-[9px] font-bold text-black bg-[#e2f0d9] px-2 py-0.5 rounded-md">Italy (Rome &amp; Venice)</span>
                        <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">10 Days</span>
                      </div>

                      <h4 className="text-xs font-black text-[#1c1c1e] tracking-tight leading-snug">
                        Grand Italy Renaissance &amp; Tuscan Hills
                      </h4>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-black">From $1,099</span>
                        <button
                          onClick={() => handleBookTour('Italy Tour', TOURS_DATA[3].id)}
                          className="bg-[#f3f3f4] text-black hover:bg-black hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 1b: VIP PASSES / DIGITAL WALLET */}
              {activeDockTab === 'membership' && phoneSubTab === 'passports' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="bg-[#e3e2f7] p-3.5 rounded-[22px] border border-[#d2d1ee]">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-black bg-white/70 px-2 py-0.5 rounded-full">
                        Active Passport
                      </span>
                      <Ticket className="w-4 h-4 text-black" />
                    </div>
                    <h5 className="font-extrabold text-xs mt-2 text-black">Louvre Museum Fast-Track VIP</h5>
                    <p className="text-[10px] text-gray-700 mt-0.5">Includes after-hours masterworks tour &amp; private guide.</p>
                    <div className="mt-2.5 pt-2 border-t border-black/10 flex justify-between items-center text-[10px] font-bold">
                      <span>Pass: #GT-8842</span>
                      <span className="text-emerald-700">Valid on Trip</span>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-[22px] border border-gray-200">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Private Chauffeur Pass
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h5 className="font-bold text-xs mt-2 text-black">Bali DPS Airport VIP Chauffeur</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Toyota Alphard Luxury Transfer &bull; Oct 12, 2026</p>
                  </div>
                </div>
              )}

              {/* VIEW 2: REWARDS / VOYAGER MILES & VIP PERKS */}
              {activeDockTab === 'rewards' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  {/* Voyager Club Tier Status */}
                  <div className="bg-gradient-to-br from-[#1c1c1e] to-[#3f3f46] text-white p-3.5 rounded-[22px] shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">Tripweave Club</span>
                        <h4 className="text-sm font-extrabold mt-0.5">Gold Nomad Status</h4>
                      </div>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-gray-300 mb-1">
                        <span>12,450 Travel Miles</span>
                        <span>15,000 pts to Platinum</span>
                      </div>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-200 h-full w-[83%]" />
                      </div>
                    </div>
                  </div>

                  {/* Claimable Perks */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Claimable Club Perks</span>
                    
                    {/* Perk 1: $200 Off Coupon */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          $200
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-black">$200 Off Any Escape</p>
                          <p className="text-[9px] text-gray-500">Code: ESCAPE2026</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleClaimReward('escape200')}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-colors cursor-pointer ${
                          claimedDeals.includes('escape200')
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {claimedDeals.includes('escape200') ? 'Applied ✓' : 'Claim'}
                      </button>
                    </div>

                    {/* Perk 2: Airport Lounge Pass */}
                    <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          ✈️
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-black">VIP Airport Lounge Access</p>
                          <p className="text-[9px] text-gray-500">Complimentary Global Entry</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleClaimReward('lounge-pass')}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-colors cursor-pointer ${
                          claimedDeals.includes('lounge-pass')
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {claimedDeals.includes('lounge-pass') ? 'Unlocked ✓' : 'Claim'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: SMART DEALS & FLASH ESCAPES */}
              {activeDockTab === 'deals' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  {/* Flash Deal Banner */}
                  <div className="bg-[#e0e7ff] border border-[#c7d2fe] p-3 rounded-[20px]">
                    <div className="flex items-center justify-between text-[10px] font-bold text-blue-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Flash Escape Deal
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-full text-blue-900 shadow-xs">04:18:22</span>
                    </div>
                    <h4 className="text-xs font-black text-blue-950 mt-1.5">30% OFF Paris &amp; Versailles VIP</h4>
                    <p className="text-[10px] text-blue-800/80 mt-0.5">Includes 5-star Saint-Germain boutique hotel &amp; private Seine yacht.</p>
                    
                    <div className="mt-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-gray-500 line-through mr-1.5">$2,850</span>
                        <span className="text-xs font-black text-blue-950">$1,999</span>
                      </div>
                      <button
                        onClick={() => handleBookTour('Paris Flash Deal', 'paris-elegance')}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-xl text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Grab Deal
                      </button>
                    </div>
                  </div>

                  {/* Deal 2 */}
                  <div className="bg-white p-3 rounded-[20px] border border-gray-200 shadow-xs">
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Early Bird 2027</span>
                    <h5 className="text-xs font-bold text-black mt-1">China Dynasty &amp; Great Wall</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Pre-register now &amp; receive free first-class bullet train upgrade.</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs font-bold text-black">$3,199 total</span>
                      <button 
                        onClick={() => handleBookTour('China Early Bird', 'china-heritage')}
                        className="bg-black text-white px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: CONFIGURE / CUSTOM ITINERARY BUILDER */}
              {activeDockTab === 'configure' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="bg-white p-3 rounded-[20px] border border-gray-200 shadow-xs space-y-2.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Custom Trip Planner</span>
                    
                    {/* Destination Selection */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-700 block mb-1">Target Escape</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Tropical Bali', 'Paris & Seine', 'Rome & Venice', 'Great Wall China'].map((dest) => (
                          <button
                            key={dest}
                            onClick={() => setSelectedRegion(dest)}
                            className={`px-2 py-1.5 rounded-lg text-[9px] font-bold border transition-colors cursor-pointer text-left truncate ${
                              selectedRegion === dest
                                ? 'bg-black text-white border-black'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {dest}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget & Duration Sliders */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-700 mb-1">
                        <span>Max Budget</span>
                        <span className="text-blue-600 font-extrabold">${budgetSlider}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1000" 
                        max="4000" 
                        step="100"
                        value={budgetSlider}
                        onChange={(e) => setBudgetSlider(Number(e.target.value))}
                        className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-700 mb-1">
                        <span>Duration</span>
                        <span className="text-black font-extrabold">{durationDays} Days</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="14" 
                        step="1"
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                        className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Matching Output Card */}
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-[20px]">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800">Matched Tour Plan</span>
                    <h5 className="text-xs font-black text-emerald-950 mt-0.5">{selectedRegion} Itinerary</h5>
                    <p className="text-[10px] text-emerald-800 mt-0.5">{durationDays} days private guided package tailored to ${budgetSlider} budget.</p>
                    <button
                      onClick={() => handleBookTour(`${selectedRegion} Plan`)}
                      className="mt-2 w-full py-1.5 bg-emerald-700 text-white font-bold rounded-xl text-[10px] hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Lock In Escape (${budgetSlider}) <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Phone Navigation Bar (Tripweave App) */}
            <div className="bg-white border-t border-gray-100 px-3 py-2 flex justify-around items-center">
              <button 
                onClick={() => {
                  setActiveDockTab('membership');
                  setPhoneSubTab('tours');
                }}
                className="flex flex-col items-center gap-0.5 text-[9px] text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore</span>
              </button>

              <button 
                onClick={() => {
                  setActiveDockTab('membership');
                  setPhoneSubTab('tours');
                }}
                className="flex flex-col items-center gap-0.5 text-[9px] font-extrabold text-black cursor-pointer relative"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Tours</span>
                <span className="w-4 h-[2px] bg-black rounded-full mt-0.5" />
              </button>

              <button 
                onClick={() => setActiveDockTab('rewards')}
                className="flex flex-col items-center gap-0.5 text-[9px] text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Rewards</span>
              </button>

              <button 
                onClick={() => {
                  setActiveDockTab('membership');
                  setPhoneSubTab('passports');
                }}
                className="flex flex-col items-center gap-0.5 text-[9px] text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Passes</span>
              </button>
            </div>

            {/* iOS Bottom Home Indicator Bar */}
            <div className="w-full py-1 bg-white flex justify-center items-center">
              <div className="w-24 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Centered Caption Note at the Bottom (Tripweave Specific) */}
      <p className="text-[11px] sm:text-xs text-white/90 text-center font-medium mt-6 max-w-lg leading-relaxed z-10">
        * Interactive demo preview. The actual mobile app features complete booking, offline itineraries &amp; live tour management.
      </p>
    </div>
  );
};
