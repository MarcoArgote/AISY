import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import BeatModal from './components/BeatModal';
import AudioPlayer from './components/AudioPlayer';
import ProducersPage from './pages/ProducersPage';
import ProducerCatalogPage from './pages/ProducerCatalogPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeats, setCurrentBeats] = useState([]);

  const handleSelectBeat = (beat, beatsContext = []) => {
    setSelectedBeat(beat);
    setIsModalOpen(true);
    setCurrentBeats(beatsContext);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTogglePlay = (beat, beatsContext = []) => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBeat(beat);
      setCurrentBeats(beatsContext);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentBeats.length === 0) return;
    const currentIndex = currentBeats.findIndex(beat => beat.id === currentBeat.id);
    const nextIndex = (currentIndex + 1) % currentBeats.length;
    setCurrentBeat(currentBeats[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentBeats.length === 0) return;
    const currentIndex = currentBeats.findIndex(beat => beat.id === currentBeat.id);
    const previousIndex = currentIndex === 0 ? currentBeats.length - 1 : currentIndex - 1;
    setCurrentBeat(currentBeats[previousIndex]);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setCurrentBeat(null);
    setIsPlaying(false);
    setCurrentBeats([]);
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
        <Header />
        
        <Routes>
          <Route path="/" element={<ProducersPage />} />
          <Route 
            path="/producer/:producerId" 
            element={
              <ProducerCatalogPage 
                onSelectBeat={handleSelectBeat}
                onTogglePlay={handleTogglePlay}
                currentBeat={currentBeat}
                isPlaying={isPlaying}
              />
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>

        {/* Global Beat Modal */}
        <BeatModal
          beat={selectedBeat}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
        />

        {/* Global Audio Player */}
        {currentBeat && (
          <AudioPlayer
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={handleNext}
            onPrevious={handlePrevious}
            allBeats={currentBeats}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </div>
  );
}

export default App;
