import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { StatsSection } from '../components/StatsSection';
import { FeatureSection } from '../components/FeatureSection';
import { DestinationsSection } from '../components/DestinationsSection';
import { ValuePropsSection } from '../components/ValuePropsSection';
import { Footer } from '../components/Footer';
import { OnboardingModal } from '../components/OnboardingModal';
import { TourDetailModal } from '../components/TourDetailModal';
import { ReviewsModal } from '../components/ReviewsModal';
import { MobileAppModal } from '../components/MobileAppModal';
import { InfoModals } from '../components/InfoModals';
import { Tour } from '../types';
import { TOURS_DATA } from '../data/toursData';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [savedTourIds, setSavedTourIds] = useState<string[]>(['bali-paradise', 'paris-elegance']);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Modal Open States
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const [reviewsOpen, setReviewsOpen] = useState<boolean>(false);
  const [appPreviewOpen, setAppPreviewOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<'about' | 'blog' | 'privacy' | 'terms' | 'contact' | null>(null);

  // Wishlist toggle
  const handleToggleSaveTour = (tourId: string) => {
    const isAlreadySaved = savedTourIds.includes(tourId);
    if (isAlreadySaved) {
      setSavedTourIds(savedTourIds.filter((id) => id !== tourId));
      toast('Removed from saved wishlist');
    } else {
      setSavedTourIds([...savedTourIds, tourId]);
      toast.success('Added to your travel wishlist! ❤️');
    }
  };

  const handleScrollToDestinations = () => {
    const el = document.getElementById('destinations-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreTour = (tourId: string) => {
    const found = TOURS_DATA.find((t) => t.id === tourId);
    if (found) {
      setSelectedTour(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c] font-sans selection:bg-[#dfdef3] selection:text-black">
      
      {/* Navigation Header */}
      <Header
        user={user as any}
        onOpenAuth={() => navigate('/login')}
        onLogout={logout}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onOpenAppPreview={() => setAppPreviewOpen(true)}
        onOpenReviews={() => setReviewsOpen(true)}
        onOpenAbout={() => setInfoModalType('about')}
        onOpenBlog={() => setInfoModalType('blog')}
        onOpenBookings={() => navigate('/app/trips')}
        onScrollToDestinations={handleScrollToDestinations}
        savedCount={savedTourIds.length}
      />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with Interactive Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <HeroSection
            onStartOnboarding={() => navigate('/app/trips/new')}
            onOpenAppPreview={() => setAppPreviewOpen(true)}
          />
        </motion.div>

        {/* 2. Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <StatsSection />
        </motion.div>

        {/* 3. Feature Section with 3 Side-by-Side Interactive Phones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <FeatureSection
            onOpenReviews={() => setReviewsOpen(true)}
            onExploreTour={handleExploreTour}
          />
        </motion.div>

        {/* 4. Curated Destinations Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <DestinationsSection
            tours={TOURS_DATA}
            savedTourIds={savedTourIds}
            onToggleSaveTour={handleToggleSaveTour}
            onExploreTour={handleExploreTour}
            onOpenAppPreview={() => setAppPreviewOpen(true)}
          />
        </motion.div>

        {/* 5. Bento Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ValuePropsSection
            onOpenAppPreview={() => setAppPreviewOpen(true)}
            onOpenOnboarding={() => navigate('/app/trips/new')}
            onScrollToDestinations={handleScrollToDestinations}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setInfoModalType('about')}
        onOpenReviews={() => setReviewsOpen(true)}
        onScrollToDestinations={handleScrollToDestinations}
        onOpenLegal={(type) => setInfoModalType(type)}
      />

      {/* Modals */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onCompleteOnboarding={() => {
          setOnboardingOpen(false);
          navigate('/app/trips/new');
        }}
        onExploreTour={(tourId) => {
          setOnboardingOpen(false);
          handleExploreTour(tourId);
        }}
      />

      <TourDetailModal
        tour={selectedTour}
        isOpen={!!selectedTour}
        onClose={() => setSelectedTour(null)}
        isSaved={selectedTour ? savedTourIds.includes(selectedTour.id) : false}
        onToggleSave={handleToggleSaveTour}
        user={user as any}
        onBookTourSuccess={() => navigate('/app/trips')}
        onOpenAuth={() => navigate('/login')}
      />

      <ReviewsModal
        isOpen={reviewsOpen}
        onClose={() => setReviewsOpen(false)}
      />

      <MobileAppModal
        isOpen={appPreviewOpen}
        onClose={() => setAppPreviewOpen(false)}
        onSelectTour={(tourId) => {
          setAppPreviewOpen(false);
          handleExploreTour(tourId);
        }}
      />

      <InfoModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onStartOnboarding={() => {
          setInfoModalType(null);
          navigate('/app/trips/new');
        }}
      />
    </div>
  );
};
