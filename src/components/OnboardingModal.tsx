import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Compass, Sparkles, MapPin, Tag, Heart, Shield } from 'lucide-react';
import { OnboardingPreferences, Tour } from '../types';
import { TOURS_DATA } from '../data/toursData';
import { api } from '../services/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (preferences: OnboardingPreferences, matchedTourId: string) => void;
  onExploreTour: (tourId: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
  onExploreTour
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Cultural Immersion']);
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Historic Cities & Wine']);
  const [duration, setDuration] = useState<string>('8-10 Days');
  const [budget, setBudget] = useState<string>('Premium ($1,500 - $3,000)');
  const [groupType, setGroupType] = useState<string>('Romantic Couple');
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchedTour, setMatchedTour] = useState<Tour | null>(null);

  if (!isOpen) return null;

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleCalculateMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      // Pick matching tour based on vibe
      let match = TOURS_DATA[0]; // Bali
      if (selectedVibes.includes('Historic Cities & Wine') || selectedStyles.includes('Romantic City Break')) {
        match = TOURS_DATA[2]; // Paris
      } else if (selectedVibes.includes('Ancient Civilizations') || selectedStyles.includes('Epic History')) {
        match = TOURS_DATA[1]; // China
      } else if (selectedVibes.includes('Renaissance & Vineyards')) {
        match = TOURS_DATA[3]; // Italy
      }
      setMatchedTour(match);
      setIsMatching(false);
      setStep(5);
    }, 900);
  };

  const handleFinish = async () => {
    const preferences: OnboardingPreferences = {
      travelStyle: selectedStyles,
      climateVibe: selectedVibes,
      duration,
      budget,
      groupType
    };

    // Persist to backend database for logged-in user if available
    try {
      await api.preferences.save({
        travelStyles: selectedStyles,
        budgetRange: budget,
        climatePreference: selectedVibes.join(', '),
        interests: selectedStyles,
      });
    } catch {
      // Graceful fallback if user is guest or token is expired
    }

    if (matchedTour) {
      onCompleteOnboarding(preferences, matchedTour.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[36px] shadow-2xl border border-[#dadada] overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f3f3f4] text-[#5c5d6e] hover:text-black flex items-center justify-center hover:bg-[#e2e2e2] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Progress bar */}
        <div className="bg-[#f9f9f9] border-b border-[#dadada]/60 px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5c5d6e] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-black" />
              <span>Step {step} of 5 &bull; Personalize Your Escape</span>
            </span>
            <span className="text-xs font-bold text-black">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-[#e8e8e8] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-black h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-sans">
                  What kind of travel style inspires you?
                </h3>
                <p className="text-sm text-[#5c5d6e] mt-1">
                  Select one or more styles so we can curate matching itineraries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { name: 'Cultural Immersion', desc: 'Ancient temples, museums & local traditions' },
                  { name: 'Island & Tropical Escape', desc: 'Private villas, cliff lagoons & snorkeling' },
                  { name: 'Romantic City Break', desc: 'Gastronomy, boutique hotels & river sunsets' },
                  { name: 'Epic History & Dynasties', desc: 'Monumental landmarks & archeological wonders' },
                  { name: 'Wine & Countryside Living', desc: 'Vineyard estates, olive presses & scenic drives' },
                  { name: 'Solo Discovery', desc: 'Offbeat paths, safe guides & seamless transit' }
                ].map((item) => {
                  const selected = selectedStyles.includes(item.name);
                  return (
                    <button
                      key={item.name}
                      onClick={() => toggleStyle(item.name)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        selected
                          ? 'bg-[#e3e2f7] border-black text-black shadow-xs'
                          : 'bg-[#f3f3f4] border-transparent text-[#1a1c1c] hover:bg-[#e8e8e8]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm">{item.name}</span>
                        {selected && <Check className="w-4 h-4 text-black shrink-0 ml-1" />}
                      </div>
                      <span className="text-xs text-[#5c5d6e]">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-sans">
                  Choose your dream destination atmosphere
                </h3>
                <p className="text-sm text-[#5c5d6e] mt-1">
                  Where would you love to wake up on your first morning?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { name: 'Tropical Beaches & Temples', region: 'Southeast Asia (Bali, Thailand)', icon: '🌴' },
                  { name: 'Historic Cities & Wine', region: 'Western Europe (Paris, France)', icon: '🍷' },
                  { name: 'Ancient Civilizations', region: 'East Asia (China, Silk Road)', icon: '🏯' },
                  { name: 'Renaissance & Vineyards', region: 'Southern Europe (Italy, Tuscany)', icon: '🏛️' }
                ].map((vibe) => {
                  const selected = selectedVibes.includes(vibe.name);
                  return (
                    <button
                      key={vibe.name}
                      onClick={() => toggleVibe(vibe.name)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        selected
                          ? 'bg-[#e3e2f7] border-black text-black shadow-xs'
                          : 'bg-[#f3f3f4] border-transparent text-[#1a1c1c] hover:bg-[#e8e8e8]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{vibe.icon}</span>
                        <span className="font-bold text-sm leading-tight">{vibe.name}</span>
                      </div>
                      <span className="text-xs text-[#5c5d6e]">{vibe.region}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-sans">
                  Trip Duration &amp; Budget Preference
                </h3>
                <p className="text-sm text-[#5c5d6e] mt-1">
                  We customize the length and luxury tier for your comfort.
                </p>
              </div>

              {/* Duration Options */}
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                  Trip Length
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['7-8 Days', '8-10 Days', '12+ Days'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        duration === d
                          ? 'bg-black text-white border-black'
                          : 'bg-[#f3f3f4] border-transparent text-[#5c5d6e] hover:bg-[#e8e8e8] hover:text-black'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Options */}
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                  Target Investment Per Person
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Essential', range: '$1,000 - $1,800' },
                    { label: 'Premium', range: '$1,800 - $3,200' },
                    { label: 'Ultra Luxe', range: '$3,200+' }
                  ].map((b) => {
                    const val = `${b.label} (${b.range})`;
                    return (
                      <button
                        key={b.label}
                        onClick={() => setBudget(val)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col ${
                          budget.includes(b.label)
                            ? 'bg-[#e3e2f7] border-black text-black'
                            : 'bg-[#f3f3f4] border-transparent text-[#5c5d6e] hover:bg-[#e8e8e8]'
                        }`}
                      >
                        <span className="font-bold text-xs text-black">{b.label}</span>
                        <span className="text-[11px] text-[#5c5d6e] mt-0.5">{b.range}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight font-sans">
                  Who will be joining you on this journey?
                </h3>
                <p className="text-sm text-[#5c5d6e] mt-1">
                  We customize room arrangements, private guides, and transport accordingly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Solo Traveler', desc: 'Single room & vetted local companions' },
                  { title: 'Romantic Couple', desc: 'Luxury king suites & private dining' },
                  { title: 'Family with Kids', desc: 'Kid-friendly pace & interconnecting rooms' },
                  { title: 'Group of Friends', desc: 'Multi-bedroom villas & group excursions' }
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setGroupType(item.title)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      groupType === item.title
                        ? 'bg-[#e3e2f7] border-black text-black shadow-xs'
                        : 'bg-[#f3f3f4] border-transparent text-[#1a1c1c] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    <span className="font-bold text-sm mb-1">{item.title}</span>
                    <span className="text-xs text-[#5c5d6e]">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: MATCH RESULTS */}
          {step === 5 && matchedTour && (
            <div className="flex flex-col gap-5 animate-in zoom-in-95 duration-200">
              <div className="bg-[#e3e2f7] p-5 rounded-2xl flex items-center gap-3 border border-[#c5c5d9]/60">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black uppercase tracking-wider">
                    Your Personalized Escape Match Found!
                  </h4>
                  <p className="text-xs text-[#5c5d6e]">
                    Based on your travel preferences, we selected this signature itinerary.
                  </p>
                </div>
              </div>

              {/* Matched Tour Card */}
              <div className="border border-[#dadada] rounded-2xl overflow-hidden bg-white shadow-md">
                <div className="relative h-48">
                  <img
                    src={matchedTour.image}
                    alt={matchedTour.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{matchedTour.country}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[#e3e2f7] text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-black/10">
                    <Tag className="w-3 h-3" />
                    <span>$200 Off with ESCAPE2026</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-bold text-black font-sans">{matchedTour.title}</h4>
                      <p className="text-xs text-[#5c5d6e] mt-0.5">
                        {matchedTour.durationDays} Days &bull; {matchedTour.hotelCount} Partner Stays &bull; 4.9 Rating
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#5c5d6e] block">Special Partner Rate</span>
                      <span className="text-xl font-bold text-black">
                        ${matchedTour.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5c5d6e] leading-relaxed">
                    {matchedTour.description}
                  </p>

                  <div className="pt-3 border-t border-[#dadada]/60 flex flex-wrap gap-2">
                    {matchedTour.highlights.slice(0, 3).map((h, i) => (
                      <span key={i} className="text-[11px] bg-[#f3f3f4] text-black px-2.5 py-1 rounded-md font-medium">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="bg-[#f9f9f9] border-t border-[#dadada]/60 p-5 sm:px-8 flex justify-between items-center">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#5c5d6e] hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all ml-auto cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleCalculateMatch}
              disabled={isMatching}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all ml-auto cursor-pointer"
            >
              {isMatching ? (
                <span>Finding Best Escape...</span>
              ) : (
                <>
                  <span>Find My Escape</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          )}

          {step === 5 && matchedTour && (
            <div className="flex items-center gap-3 w-full justify-between">
              <button
                onClick={handleFinish}
                className="px-5 py-2.5 rounded-full border border-black text-black text-xs font-bold hover:bg-[#f3f3f4] transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
              <button
                onClick={() => {
                  handleFinish();
                  onExploreTour(matchedTour.id);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span>Explore {matchedTour.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
