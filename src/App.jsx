import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import BeatGallery from './components/BeatGallery';
import BeatModal from './components/BeatModal';
import AudioPlayer from './components/AudioPlayer';
import LicensesSection from './components/LicensesSection';
import SponsorsSection from './components/SponsorsSection';
import ContactSection from './components/ContactSection';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { beatsData } from './data/beats';

function HomePage({ 
  selectedBeat, 
  isModalOpen, 
  currentBeat, 
  isPlaying, 
  handleSelectBeat,
  handleCloseModal,
  handleTogglePlay,
  handleNext,
  handlePrevious 
}) {
  return (
    <>
      <Header />
      
      <main className={currentBeat ? 'pb-32' : 'pb-12'}>
        <BeatGallery
          beats={beatsData}
          onSelectBeat={handleSelectBeat}
          currentBeat={currentBeat}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
        />
        
        <SponsorsSection />
        
        <LicensesSection />
        
        <ContactSection />
      </main>

      <BeatModal
        beat={selectedBeat}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />

      {currentBeat && (
        <AudioPlayer
          currentBeat={currentBeat}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onPrevious={handlePrevious}
          allBeats={beatsData}
        />
      )}
    </>
  );
}

function App() {
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectBeat = (beat) => {
    setSelectedBeat(beat);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTogglePlay = (beat) => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = beatsData.findIndex(beat => beat.id === currentBeat.id);
    const nextIndex = (currentIndex + 1) % beatsData.length;
    setCurrentBeat(beatsData[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const currentIndex = beatsData.findIndex(beat => beat.id === currentBeat.id);
    const previousIndex = currentIndex === 0 ? beatsData.length - 1 : currentIndex - 1;
    setCurrentBeat(beatsData[previousIndex]);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Routes */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={
            <HomePage
              selectedBeat={selectedBeat}
              isModalOpen={isModalOpen}
              currentBeat={currentBeat}
              isPlaying={isPlaying}
              handleSelectBeat={handleSelectBeat}
              handleCloseModal={handleCloseModal}
              handleTogglePlay={handleTogglePlay}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
