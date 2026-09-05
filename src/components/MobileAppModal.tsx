import React, { useState, useEffect } from 'react';
import { 
  X, Smartphone, QrCode, Compass, MapPin, Ticket, MessageSquare, 
  Send, CheckCircle, Search, Star, Download, Monitor, Check, ArrowRight, Share
} from 'lucide-react';
import { TOURS_DATA } from '../data/toursData';
import toast from 'react-hot-toast';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTour: (tourId: string) => void;
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({
  isOpen,
  onClose,
  onSelectTour
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'passes' | 'chat'>('feed');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am your 24/7 Tripweave Concierge. How can I assist your upcoming tour today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Listen for PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success('Tripweave App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast.success('Installing Tripweave Web App...');
      }
      setDeferredPrompt(null);
      setIsInstalling(false);
    } else {
      // Fallback instruction for iOS Safari / Chrome
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        toast('To install on iPhone/iPad: Tap Share (📤) then "Add to Home Screen"');
      } else {
        toast('To install on Chrome/Edge: Click the Install icon (💻) in the top-right address bar');
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      let botResponse = "I have confirmed that with your private tour guide and chauffeur. Can I arrange anything else for your itinerary?";
      if (userText.toLowerCase().includes('hotel') || userText.toLowerCase().includes('villa')) {
        botResponse = "Your 5-star partner hotel check-in is pre-arranged with complimentary room upgrade and late checkout at 2:00 PM.";
      } else if (userText.toLowerCase().includes('flight') || userText.toLowerCase().includes('airport')) {
        botResponse = "Your private airport VIP transfer is scheduled 3 hours prior to departure.";
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[36px] shadow-2xl border border-[#e5e5e5] overflow-hidden relative flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f3f3f4] text-[#5c5d6e] hover:text-black flex items-center justify-center hover:bg-[#e5e5e5] transition-colors z-30 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: App Download Information & Instant Install CTA */}
        <div className="md:w-1/2 bg-[#fafafa] p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e5e5e5]">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-5 shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-black bg-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Progressive Web App (PWA)
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mt-3 font-sans leading-tight">
              Download Tripweave Web App
            </h3>

            <p className="text-sm text-[#5c5d6e] mt-3 leading-relaxed font-normal">
              Install Tripweave directly to your phone, tablet, or desktop home screen without an app store login. Runs smoothly offline with zero storage footprint.
            </p>

            {/* Direct 1-Click Install Button */}
            <div className="mt-6">
              <button
                onClick={handleInstallApp}
                disabled={isInstalling}
                className="w-full bg-black hover:bg-gray-800 active:scale-[0.98] text-white px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isInstalled ? 'App Already Installed' : 'Install App to Home Screen'}</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* Feature bullets */}
            <div className="mt-6 flex flex-col gap-2.5">
              {[
                'Runs standalone on iPhone, Android, Mac & Windows',
                'Offline multi-city itinerary & audio guides',
                'Instant digital boarding passes & tickets',
                'Direct live concierge chat support'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-black">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Instructions & QR Code */}
          <div className="pt-6 mt-6 border-t border-[#e5e5e5] flex items-center gap-4">
            <div className="w-16 h-16 bg-white p-2 rounded-2xl border border-[#e5e5e5] flex items-center justify-center shadow-xs shrink-0">
              <QrCode className="w-12 h-12 text-black" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-black">Instant Browser Installation</span>
              <p className="text-[11px] text-[#5c5d6e] leading-snug">
                Chrome/Edge: Click Install icon in URL bar.<br />
                Safari iOS: Tap Share &rarr; "Add to Home Screen".
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Smartphone Simulator Screen */}
        <div className="md:w-1/2 p-6 sm:p-8 flex items-center justify-center bg-[#f3f3f7]">
          <div className="w-[300px] h-[540px] bg-[#1a1a1a] rounded-[44px] p-2.5 shadow-2xl border border-[#333] flex flex-col relative overflow-hidden">
            {/* Phone Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Simulated Phone Screen */}
            <div className="bg-[#f9f9f9] w-full h-full rounded-[36px] overflow-hidden flex flex-col text-black relative pt-7">
              {/* Phone Header */}
              <div className="px-4 py-2.5 flex justify-between items-center border-b border-[#e5e5e5] bg-white">
                <span className="text-xs font-black text-black font-sans tracking-tight">Tripweave</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-[#5c5d6e]">Installed PWA</span>
                </div>
              </div>

              {/* Simulated Screen Contents */}
              <div className="flex-grow overflow-y-auto p-3 text-xs">
                {/* 1. Explore Feed Screen */}
                {activeTab === 'feed' && (
                  <div className="flex flex-col gap-2.5">
                    <div className="bg-black text-white p-3.5 rounded-2xl">
                      <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">Today's Spotlight</span>
                      <h4 className="text-sm font-bold mt-0.5">Paris Grand Explorer</h4>
                      <p className="text-[10px] text-gray-300 mt-0.5">VIP Louvre access &amp; sunset Seine cruise</p>
                      <button
                        onClick={() => {
                          onSelectTour('paris-grand');
                          onClose();
                        }}
                        className="mt-3 w-full py-1.5 bg-white text-black font-bold text-[10px] rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Open In App
                      </button>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-[#e5e5e5]">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-gray-400">Offline Companion</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Ready</span>
                      </div>
                      <p className="text-xs font-bold mt-1">Multi-City Route Sync</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">All stops and scheduled activities synced offline.</p>
                    </div>
                  </div>
                )}

                {/* 2. Concierge Chat Screen */}
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full justify-between">
                    <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-black text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-[#e5e5e5] rounded-bl-none shadow-2xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="pt-2 flex gap-1.5 border-t border-gray-200 mt-2">
                      <input
                        type="text"
                        placeholder="Ask concierge..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-grow bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        className="w-7 h-7 bg-black text-white rounded-xl flex items-center justify-center shrink-0 hover:bg-gray-800"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Phone Bottom Tab Bar */}
              <div className="px-4 py-2 bg-white border-t border-[#e5e5e5] flex justify-around items-center">
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`flex flex-col items-center gap-0.5 ${activeTab === 'feed' ? 'text-black' : 'text-gray-400'}`}
                >
                  <Compass className="w-4 h-4" />
                  <span className="text-[8px] font-bold">Feed</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex flex-col items-center gap-0.5 ${activeTab === 'chat' ? 'text-black' : 'text-gray-400'}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[8px] font-bold">Concierge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
