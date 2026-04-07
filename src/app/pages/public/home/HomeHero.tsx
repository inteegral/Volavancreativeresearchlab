import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { SanityHome } from "../../../lib/sanity";

const logoImage = "/logo-footer.svg";

interface HomeHeroProps {
  homeData?: SanityHome | null;
}

export function HomeHero({ homeData }: HomeHeroProps) {
  const { language } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const playerRef = useRef<any>(null);
  const isInitialized = useRef(false);
  const isPlayerReady = useRef(false);

  // Handle video player reinitialization on language change
  useEffect(() => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
        playerRef.current = null;
        isPlayerReady.current = false;
      } catch (e) {
      }
    }
    isInitialized.current = false;

    setTimeout(() => {
      // @ts-ignore
      if (window.YT && window.YT.Player) {
        initPlayer();
      }
    }, 100);
  }, [language]);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // @ts-ignore
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

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
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
        }
      }
    };
  }, []);

  const initPlayer = () => {
    // @ts-ignore
    if (!window.YT || !document.getElementById('youtube-player')) return;

    try {
      const playerElement = document.getElementById('youtube-player');
      if (playerElement) {
        playerElement.setAttribute('data-gtm-vis-has-fired-', 'true');
        playerElement.setAttribute('data-gtm-youtube-paused-', 'true');
      }

      // @ts-ignore
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: 'Bx2g8jRQlns',
        playerVars: {
          autoplay: 1,
          mute: 1,
          start: 29,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          enablejsapi: 0,
          cc_load_policy: 1,
          cc_lang_pref: 'en',
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.mute();
              event.target.playVideo();
              isPlayerReady.current = true;
            } catch (e) {
            }
          },
          onStateChange: (event: any) => {
            if (!isPlayerReady.current) return;
            try {
              // @ts-ignore
              if (event.data === window.YT.PlayerState.ENDED) {
                setIsEnded(true);
              }
            } catch (e) {
            }
          },
          onError: (_event: any) => {
          }
        }
      });
    } catch (e) {
    }
  };

  const toggleMute = () => {
    if (playerRef.current && playerRef.current.isMuted !== undefined) {
      try {
        if (isMuted) {
          playerRef.current.unMute();
        } else {
          playerRef.current.mute();
        }
        setIsMuted(!isMuted);
      } catch (e) {
      }
    }
  };

  const replayVideo = () => {
    if (playerRef.current) {
      try {
        playerRef.current.seekTo(29);
        playerRef.current.playVideo();
        setIsEnded(false);
      } catch (e) {
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] md:max-w-xl gap-12">
      {/* Logo */}
      <div className="w-[45%]">
        <img src={logoImage} alt="VOLAVAN - Creative Research Lab" className="w-full h-auto" />
      </div>

      {/* Video Player */}
      <div className="w-full aspect-video bg-volavan-earth rounded-sm overflow-hidden relative shadow-lg group">
        <div
          id="youtube-player"
          className="absolute inset-0 z-0"
          style={{ filter: "grayscale(20%) opacity(0.9)" }}
        />

        {/* Grain/Texture Overlay */}
        <div className="absolute inset-0 bg-volavan-earth/10 mix-blend-multiply pointer-events-none z-10" />

        {/* Audio Control */}
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-volavan-earth/50 hover:bg-volavan-earth/80 text-volavan-cream transition-all backdrop-blur-sm border border-volavan-cream/10 cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {/* Replay Button */}
        {isEnded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={replayVideo}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center rounded-full bg-volavan-aqua/90 hover:bg-volavan-aqua text-volavan-earth transition-all backdrop-blur-sm border border-volavan-cream/20 cursor-pointer shadow-lg"
            aria-label="Replay"
          >
            <Play size={24} fill="currentColor" />
          </motion.button>
        )}
      </div>

      {/* Text */}
      <div className="space-y-8 w-full mt-4 max-w-4xl mx-auto">
        {homeData?.introText && (
          <p className="font-['Cormorant_Garamond'] text-xl md:text-3xl leading-tight text-volavan-cream italic text-right hyphens-auto whitespace-pre-line">
            {homeData.introText}
          </p>
        )}
        {homeData?.featureText && (
          <p className="font-['Cormorant_Garamond'] text-base md:text-xl leading-relaxed text-volavan-aqua text-right hyphens-auto whitespace-pre-line">
            {homeData.featureText}
          </p>
        )}
        {homeData?.closingText && (
          <p className="font-['Cormorant_Garamond'] text-xl md:text-3xl leading-tight text-volavan-cream italic text-right hyphens-auto whitespace-pre-line">
            {homeData.closingText}
          </p>
        )}
      </div>
    </div>
  );
}
