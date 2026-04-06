import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Logo } from "../../components/Logo";
import { SEOHead } from "../../components/SEOHead";
import { OrganizationSchema } from "../../components/StructuredData";
import { SanityImage } from "../../components/SanityImage";
import { SkeletonCard, SkeletonJournalFeatured, SkeletonJournalSide } from "../../components/ui/skeleton";
import { ArrowUpRight, Volume2, VolumeX, Play } from "lucide-react";
import { getImageUrl, getYouTubeThumbnail } from "../../lib/sanity";
import { useLanguage } from "../../contexts/LanguageContext";
import { useHome, useAllPrograms, useJournalContent, useSettings } from "../../hooks/useSanity";
import { calculateResidencyStatus } from "../../lib/sanity";
import logoImage from "figma:asset/cf7144aebca76b64acb2a250bc18d06d1718b486.png";

export default function Home() {
  const { language } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const playerRef = useRef<any>(null);
  const isInitialized = useRef(false);
  const isPlayerReady = useRef(false);

  // Fetch data with SWR
  const { home: homeData, isLoading: homeLoading } = useHome();
  const { programs, isLoading: programsLoading } = useAllPrograms();
  const { content: journalContent, isLoading: journalLoading } = useJournalContent();
  const { settings } = useSettings();

  // Derived state with memoization
  const upcomingResidencies = useMemo(() => {
    
    return programs
      .filter(program => {
        
        if (!program.editions || program.editions.length === 0) return false;
        
        // Calculate dynamic status for each edition
        return program.editions.some(edition => {
          const calculatedStatus = calculateResidencyStatus(edition);
          return calculatedStatus === 'upcoming' || calculatedStatus === 'open_call' || calculatedStatus === 'open_call_soon';
        });
      })
      .slice(0, 2);
  }, [programs]);

  const journalPosts = useMemo(() => {
    return journalContent.slice(0, 3);
  }, [journalContent]);

  const loading = homeLoading || programsLoading || journalLoading;

  // Handle video player reinitialization on language change
  useEffect(() => {
    // Reset video initialization flag when language changes to ensure player reinits
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
        playerRef.current = null;
        isPlayerReady.current = false;
      } catch (e) {
      }
    }
    isInitialized.current = false;
    
    // Reinitialize player after short delay
    setTimeout(() => {
      // @ts-ignore
      if (window.YT && window.YT.Player) {
        initPlayer();
      }
    }, 100);
  }, [language]);

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
      // Disable GTM tracking for this player by setting data attribute
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
            // Guard against GTM trying to access player before it's ready
            if (!isPlayerReady.current) return;
            
            try {
              // @ts-ignore
              if (event.data === window.YT.PlayerState.ENDED) {
                setIsEnded(true);
              }
            } catch (e) {
            }
          },
          onError: (event: any) => {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 py-12 text-center">
      <SEOHead 
        url="/"
        description="VOLAVAN is a creative research lab in rural Friuli. Artist residencies, workshops, and collaborative projects immersed in nature."
        image={settings?.defaultSeo?.ogImage?.asset?.url}
      />
      <OrganizationSchema />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center w-full max-w-[340px] md:max-w-xl gap-12"
      >
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

          {/* Replay Button - Center */}
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
          {/* Intro Text - Large Cormorant Italic */}
          {homeData?.introText && (
            <p className="font-['Cormorant_Garamond'] text-2xl md:text-4xl leading-tight text-volavan-cream italic text-right hyphens-auto whitespace-pre-line">
              {homeData.introText}
            </p>
          )}

          {/* Feature Text - Medium Cormorant Regular (smaller, different color) */}
          {homeData?.featureText && (
            <p className="font-['Cormorant_Garamond'] text-lg md:text-2xl leading-relaxed text-volavan-aqua text-right hyphens-auto whitespace-pre-line">
              {homeData.featureText}
            </p>
          )}

          {/* Closing Text - Large Cormorant Italic (same as intro) */}
          {homeData?.closingText && (
            <p className="font-['Cormorant_Garamond'] text-2xl md:text-4xl leading-tight text-volavan-cream italic text-right hyphens-auto whitespace-pre-line">
              {homeData.closingText}
            </p>
          )}
        </div>

        {/* Separator Line */}
        <div className="w-full max-w-md mx-auto my-[50px]">
          <div className="h-px bg-volavan-cream/20"></div>
        </div>

        {/* Upcoming Residencies Section */}
        <div className="w-full max-w-5xl mx-auto mb-[150px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-16"
          >
            {/* Section Title */}
            <div className="text-center space-y-4">
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-volavan-cream italic">
                Upcoming Residencies
              </h2>
              
            </div>

            {/* Residencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programsLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : upcomingResidencies.length === 0 ? (
                <div className="col-span-2 text-center">
                  <p className="font-['Manrope'] text-sm md:text-lg leading-relaxed text-volavan-cream/60 max-w-lg mx-auto">
                    No upcoming residencies at the moment.
                  </p>
                </div>
              ) : (
                upcomingResidencies.map((program) => {
                  // Get the latest edition
                  const latestEdition = program.editions?.[0];
                  if (!latestEdition) return null;

                  // Image: edition coverImage only (no fallback to program)
                  const coverImage = latestEdition.coverImage;
                  const imageUrl = coverImage ? getImageUrl(coverImage, 800, 600) : undefined;

                  return (
                    <Link
                      key={program._id}
                      to={`/residencies/${latestEdition.slug}`}
                      className="group relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <SanityImage
                          image={coverImage}
                          alt={program.name}
                          width={800}
                          height={600}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700 saturate-[0.45] opacity-65"
                        />
                        
                        {/* Gradient overlay towards bottom */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-volavan-earth/60 pointer-events-none"></div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3 bg-volavan-earth/50 backdrop-blur-sm">
                        <h3 className="font-['Manrope'] text-xl uppercase tracking-[0.2em] text-volavan-cream text-left">
                          {program.name}
                        </h3>
                        
                        {/* Tagline */}
                        {program.tagline && (
                          <p className="font-['Cormorant_Garamond'] text-lg italic text-volavan-aqua text-left">
                            {program.tagline}
                          </p>
                        )}
                        
                        {/* Dates from latest edition */}
                        {latestEdition.startDate && latestEdition.endDate && (
                          <div className="flex items-center gap-2 text-xs text-volavan-aqua font-['Manrope'] uppercase tracking-wide">
                            <span>{new Date(latestEdition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span>—</span>
                            <span>{new Date(latestEdition.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        )}

                        {/* Location */}
                        {program.location && program.country && (
                          <p className="font-['Manrope'] text-sm text-volavan-cream/70 text-left">
                            {program.location}, {program.country}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-12">
              <Link
                to="/residencies"
                className="group flex items-center justify-center gap-4 px-8 py-4 rounded-full border border-volavan-cream/30 hover:border-volavan-cream/80 hover:bg-volavan-cream/5 transition-all duration-500"
              >
                <span className="font-['Manrope'] text-xs uppercase tracking-[0.25em] text-volavan-cream opacity-90 group-hover:opacity-100 transition-opacity">
                  View All Residencies
                </span>
                <ArrowUpRight size={16} className="text-volavan-cream opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Visual Break - Organic Divider */}
      <div className="w-full max-w-2xl mx-auto my-[30px] flex items-center justify-center gap-8 px-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-volavan-cream/20 to-transparent"></div>
        <div className="w-2 h-2 rounded-full bg-volavan-aqua/40"></div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-volavan-cream/20 to-transparent"></div>
      </div>

      {/* Journal Section */}
      {journalPosts.length > 0 && (
        <div className="w-full max-w-6xl mx-auto mb-[100px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-16"
          >
              {/* Section Title */}
              <div className="text-center space-y-4">
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-volavan-cream italic">
                  {homeData?.journalSectionTitle || 'Latest from the Journal'}
                </h2>
                <p className="font-['Manrope'] text-xs md:text-sm text-volavan-cream/60 max-w-lg mx-auto">
                  {homeData?.journalSectionSubtitle || 'Reflections, documentation, and insights from our residencies'}
                </p>
              </div>

              {/* Asymmetric Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {journalLoading ? (
                  <>
                    <SkeletonJournalFeatured />
                    <div className="md:col-span-1 flex flex-col gap-6">
                      <SkeletonJournalSide />
                      <SkeletonJournalSide />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Main Featured Article (2/3) */}
                    {journalPosts[0] && (() => {
                      // Get image: YouTube thumbnail for videos, coverImage for articles
                      const isVideo = journalPosts[0]._type === 'videoPost' || journalPosts[0].videoUrl;
                      const thumbnailUrl = isVideo && journalPosts[0].videoUrl 
                        ? getYouTubeThumbnail(journalPosts[0].videoUrl)
                        : null;
                      const imageSource = journalPosts[0]._type === 'videoPost' ? journalPosts[0].thumbnail : journalPosts[0].coverImage;

                      return (
                        <Link
                          to={`/journal/${journalPosts[0].slug}`}
                          className="group md:col-span-2 relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500"
                        >
                          {/* Image */}
                          <div className="aspect-[16/9] overflow-hidden">
                            {thumbnailUrl ? (
                              <img 
                                src={thumbnailUrl}
                                alt={journalPosts[0].title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                              />
                            ) : (
                              <SanityImage
                                image={imageSource}
                                alt={journalPosts[0].title}
                                width={1000}
                                height={600}
                                sizes="(max-width: 768px) 100vw, 66vw"
                                className="w-full h-full group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-8 space-y-4 bg-volavan-earth/30 backdrop-blur-sm">
                            {/* Date */}
                            {journalPosts[0].publishedAt && (
                              <time className="font-['Manrope'] text-xs uppercase tracking-wider text-volavan-aqua/80">
                                {new Date(journalPosts[0].publishedAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </time>
                            )}

                            {/* Title */}
                            <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl leading-tight text-volavan-cream group-hover:text-volavan-aqua transition-colors">
                              {journalPosts[0].title}
                            </h3>

                            {/* Excerpt */}
                            {journalPosts[0].excerpt && (
                              <p className="font-['Manrope'] text-sm md:text-base leading-relaxed text-volavan-cream/70 line-clamp-3">
                                {journalPosts[0].excerpt}
                              </p>
                            )}

                            {/* Type Badge */}
                            {isVideo && (
                              <div className="inline-block px-2 py-1 rounded-sm bg-volavan-aqua/10 border border-volavan-aqua/20 text-volavan-aqua text-xs font-['Manrope'] uppercase tracking-wider">
                                Video
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })()}

                    {/* Side Articles (1/3) - Stacked */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                      {journalPosts.slice(1, 3).map((post) => {
                        const isVideo = post._type === 'videoPost' || post.videoUrl;
                        const thumbnailUrl = isVideo && post.videoUrl 
                          ? getYouTubeThumbnail(post.videoUrl)
                          : null;
                        const imageSource = post._type === 'videoPost' ? post.thumbnail : post.coverImage;

                        return (
                          <Link
                            key={post._id}
                            to={`/journal/${post.slug}`}
                            className="group relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500 flex-1"
                          >
                            {/* Image */}
                            <div className="aspect-[4/3] overflow-hidden">
                              {thumbnailUrl ? (
                                <img 
                                  src={thumbnailUrl}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                                />
                              ) : (
                                <SanityImage
                                  image={imageSource}
                                  alt={post.title}
                                  width={400}
                                  height={300}
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="w-full h-full group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-2 bg-volavan-earth/30 backdrop-blur-sm">
                              {/* Date */}
                              {post.publishedAt && (
                                <time className="font-['Manrope'] text-xs uppercase tracking-wider text-volavan-aqua/80">
                                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </time>
                              )}

                              {/* Title */}
                              <h3 className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-tight text-volavan-cream group-hover:text-volavan-aqua transition-colors line-clamp-2">
                                {post.title}
                              </h3>

                              {/* Type Badge */}
                              {isVideo && (
                                <div className="inline-block px-2 py-1 rounded-sm bg-volavan-aqua/10 border border-volavan-aqua/20 text-volavan-aqua text-xs font-['Manrope'] uppercase tracking-wider">
                                  Video
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* View All Journal Button */}
              <div className="flex justify-center mt-12">
                <Link
                  to="/journal"
                  className="group flex items-center justify-center gap-4 px-8 py-4 rounded-full border border-volavan-cream/30 hover:border-volavan-cream/80 hover:bg-volavan-cream/5 transition-all duration-500"
                >
                  <span className="font-['Manrope'] text-xs uppercase tracking-[0.25em] text-volavan-cream opacity-90 group-hover:opacity-100 transition-opacity">
                    Explore Journal
                  </span>
                  <ArrowUpRight size={16} className="text-volavan-cream opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  );
}