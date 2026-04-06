import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoPlayer } from './VideoPlayer';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
  startTime?: number;
  endTime?: number;
}

export function VideoModal({ isOpen, onClose, videoId, title, startTime, endTime }: VideoModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-volavan-earth/95 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl bg-volavan-earth-dark rounded-sm overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-volavan-cream/10">
              <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-cream">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-volavan-cream/10 rounded-full transition-colors"
                aria-label="Close video"
              >
                <X size={24} className="text-volavan-cream/70 hover:text-volavan-cream" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <VideoPlayer
                videoId={videoId}
                startTime={startTime}
                endTime={endTime}
                autoplay={true}
                playerId={`modal-${videoId}`}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
