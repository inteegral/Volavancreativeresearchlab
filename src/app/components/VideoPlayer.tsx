import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  videoId: string;
  startTime?: number; // in seconds
  endTime?: number; // in seconds
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
  playerId?: string;
  thumbnailUrl?: string; // Optional custom thumbnail
}

export function VideoPlayer({ 
  videoId, 
  startTime = 0, 
  endTime, 
  autoplay = true,
  muted = true,
  className = '',
  playerId = 'youtube-player',
  thumbnailUrl
}: VideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(muted);
  const [isEnded, setIsEnded] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(!autoplay && !muted);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const playerRef = useRef<any>(null);
  const isInitialized = useRef(false);
  const checkIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Check if API is already loaded
    // @ts-ignore
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      // Cleanup player on unmount
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log('Player cleanup error:', e);
        }
      }
    };
  }, []);

  const initPlayer = () => {
    // @ts-ignore
    if (!window.YT || !document.getElementById(playerId)) return;

    try {
      // @ts-ignore
      playerRef.current = new window.YT.Player(playerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: (autoplay && muted) ? 1 : 0, // Only autoplay if muted
          mute: muted ? 1 : 0,
          start: startTime,
          end: endTime,
          controls: 1,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 0,
          fs: 1,
          iv_load_policy: 3,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            if (muted) {
              event.target.mute();
              setIsMuted(true);
            } else {
              event.target.unMute();
              event.target.setVolume(100);
              setIsMuted(false);
            }
            
            if (autoplay && muted) {
              event.target.playVideo();
            }
            
            // Add safety wrappers for GTM compatibility
            if (!event.target.getDuration) {
              event.target.getDuration = () => 0;
            }
            if (!event.target.getCurrentTime) {
              event.target.getCurrentTime = () => 0;
            }
          },
          onStateChange: (event: any) => {
            // @ts-ignore
            // Hide overlay when video is playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              setShowPlayOverlay(false);
              
              // If user has interacted and muted=false, force unmute
              if (hasUserInteracted && !muted) {
                event.target.unMute();
                event.target.setVolume(100);
                setIsMuted(false);
              }
            }
            
            // @ts-ignore
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsEnded(true);
            }
          },
        },
      });
    } catch (e) {
      console.log('Player init error:', e);
    }
  };

  const handlePlayWithSound = () => {
    if (playerRef.current) {
      setHasUserInteracted(true);
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      playerRef.current.playVideo();
      setIsMuted(false);
      setShowPlayOverlay(false);
    }
  };

  const toggleMute = () => {
    if (playerRef.current && playerRef.current.isMuted !== undefined) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const replayVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(startTime);
      playerRef.current.playVideo();
      setIsEnded(false);
      
      // Restart interval checking for endTime
      if (endTime && checkIntervalRef.current === null) {
        checkIntervalRef.current = window.setInterval(() => {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            const currentTime = playerRef.current.getCurrentTime();
            if (currentTime >= endTime) {
              playerRef.current.pauseVideo();
              setIsEnded(true);
              if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
              }
            }
          }
        }, 100);
      }
    }
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Video */}
      <div 
        id={playerId}
        className="w-full h-full"
      />
      
      {/* Play with Sound Overlay */}
      <AnimatePresence>
        {showPlayOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40"
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayWithSound}
              className="group flex flex-col items-center gap-4 px-8 py-6 bg-[#B5DAD9]/95 hover:bg-[#B5DAD9] rounded-sm border border-[#F5F5F0]/20 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#6A746C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={28} className="text-[#F5F5F0] ml-1" fill="currentColor" />
              </div>
              <div className="text-center">
                <div className="font-['Cormorant_Garamond'] text-2xl italic text-[#6A746C] mb-1">
                  Play with Sound
                </div>
                <div className="font-['Manrope'] text-xs uppercase tracking-wider text-[#6A746C]/70">
                  Click to start
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-6 right-6 z-30 flex gap-3">
        {/* Mute/Unmute Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          className="w-11 h-11 rounded-full bg-[#6A746C]/80 backdrop-blur-sm border border-[#F5F5F0]/20 flex items-center justify-center text-[#F5F5F0] hover:bg-[#6A746C] hover:border-[#B5DAD9]/40 transition-all"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
        
        {/* Replay Button - Only shown when ended */}
        {isEnded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={replayVideo}
            className="w-11 h-11 rounded-full bg-[#B5DAD9]/90 backdrop-blur-sm border border-[#F5F5F0]/20 flex items-center justify-center text-[#6A746C] hover:bg-[#B5DAD9] transition-all"
            aria-label="Replay"
          >
            <Play size={18} fill="currentColor" />
          </motion.button>
        )}
      </div>
    </div>
  );
}