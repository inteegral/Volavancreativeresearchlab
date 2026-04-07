import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Play, FileText, Video } from "lucide-react";
import { getImageUrl, formatDate, extractYouTubeId, getYouTubeThumbnail } from "../../lib/sanity";
import { SEOHead } from "../../components/SEOHead";
import { SanityImage } from "../../components/SanityImage";
import { SkeletonCard } from "../../components/ui/skeleton";
import { VideoModal } from "../../components/VideoModal";
import { useLanguage } from "../../contexts/LanguageContext";
import { useJournalContent, useSettings } from "../../hooks/useSanity";

type FilterType = 'all' | 'articles' | 'videos';

export default function Journal() {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedVideo, setSelectedVideo] = useState<SanityJournalContent | null>(null);

  // Fetch data with SWR
  const { content, isLoading: loading } = useJournalContent();
  const { settings } = useSettings();

  // Filter content based on selected filter
  const filteredContent = useMemo(() => {
    return content.filter(item => {
      if (filter === 'all') return true;
      
      // Check if it's a video (either videoPost type OR journal with videoUrl)
      const hasVideo = item._type === 'videoPost' || (item._type === 'journal' && item.videoUrl);
      
      if (filter === 'articles') return item._type === 'journal' && !item.videoUrl;
      if (filter === 'videos') return hasVideo;
      return true;
    });
  }, [content, filter]);

  return (
    <div className="min-h-screen bg-volavan-earth text-volavan-cream pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      <SEOHead 
        title="Journal"
        description="Storie, riflessioni e ispirazioni dalle residenze artistiche di VOLAVAN. Scopri le esperienze degli artisti e i progetti realizzati."
        url="/journal"
        image={settings?.defaultSeo?.ogImage?.asset?.url}
      />
      
      {/* Header */}
      <div className="mb-20 md:mb-32">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="block font-['Manrope'] text-sm uppercase tracking-[0.25em] text-volavan-aqua mb-6"
        >
          Stories & Reflections
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-['Cormorant_Garamond'] text-4xl md:text-6xl italic leading-[0.9] text-volavan-cream"
        >
          Journal
        </motion.h1>
      </div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-center gap-4 md:gap-12 mb-20"
      >
        {([
          { key: 'all', label: 'All' },
          { key: 'articles', label: 'Articles' },
          { key: 'videos', label: 'Videos' },
        ] as { key: FilterType; label: string }[]).map((item, i, arr) => (
          <>
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`group relative font-['Cormorant_Garamond'] text-xl md:text-3xl italic transition-all duration-500 whitespace-nowrap ${
                filter === item.key
                  ? 'text-volavan-cream'
                  : 'text-volavan-cream/30 hover:text-volavan-cream/60'
              }`}
            >
              {item.label}
              {filter === item.key && (
                <motion.div
                  layoutId="activeFilterUnderline"
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-volavan-aqua"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
            {i < arr.length - 1 && (
              <span key={`sep-${i}`} className="text-volavan-cream/20 font-['Cormorant_Garamond'] text-xl md:text-2xl select-none">/</span>
            )}
          </>
        ))}
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="w-full py-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-volavan-aqua/30 border-t-volavan-aqua rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredContent.map((item, index) => {
            const isVideo = item._type === 'videoPost' || (item._type === 'journal' && item.videoUrl);
            
            // Get thumbnail: YouTube thumbnail if video, otherwise coverImage or custom thumbnail
            let thumbnailUrl = null;
            if (isVideo && item.videoUrl) {
              // Use helper function to get YouTube thumbnail
              thumbnailUrl = getYouTubeThumbnail(item.videoUrl);
            }
            // Fallback to custom thumbnail or coverImage
            if (!thumbnailUrl) {
              const fallbackImage = item.thumbnail || item.coverImage;
              if (fallbackImage) {
                thumbnailUrl = getImageUrl(fallbackImage, 800, 600);
              }
            }

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
              >
                {isVideo ? (
                  // Video Card - Opens Modal
                  <button 
                    onClick={() => setSelectedVideo(item)}
                    className="group block h-full flex flex-col w-full text-left"
                  >
                    {/* Video Thumbnail with Play Icon */}
                    <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-volavan-earth-dark border border-volavan-cream/10 group-hover:border-volavan-aqua/50 transition-colors">
                      {thumbnailUrl ? (
                        <img 
                          src={thumbnailUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-volavan-cream/20">
                          <span className="font-['Cormorant_Garamond'] text-6xl italic">V</span>
                        </div>
                      )}
                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-volavan-earth/40 group-hover:bg-volavan-earth/20 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-volavan-aqua/90 group-hover:bg-volavan-aqua flex items-center justify-center transition-all transform group-hover:scale-110">
                          <Play size={28} className="text-volavan-earth ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-4 text-volavan-aqua/80 text-xs uppercase tracking-widest">
                        <span>Video</span>
                        <span>—</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-['Cormorant_Garamond'] text-3xl italic text-volavan-cream mb-4 group-hover:text-volavan-aqua transition-colors leading-tight">
                        {item.title}
                      </h3>
                      
                      {/* Excerpt */}
                      {item.excerpt && (
                        <p className="text-volavan-cream/70 mb-4 line-clamp-3 text-sm font-['Manrope'] flex-grow leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
                      
                      {/* Categories */}
                      {item.categories && item.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.categories.slice(0, 2).map((cat, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-volavan-aqua/10 border border-volavan-aqua/30 rounded-full font-['Manrope'] text-[9px] uppercase tracking-wider text-volavan-aqua"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Watch Now */}
                      <span className="text-volavan-aqua text-xs uppercase tracking-widest font-['Manrope'] inline-block border-b border-transparent group-hover:border-volavan-aqua w-fit mt-auto transition-colors">
                        Watch Video
                      </span>
                    </div>
                  </button>
                ) : (
                  // Article Card - Normal Link
                  <Link to={`/journal/${item.slug}`} className="group block h-full flex flex-col">
                    {/* Cover Image */}
                    <div className="aspect-[4/3] overflow-hidden mb-6 bg-volavan-earth-dark border border-volavan-cream/10 group-hover:border-volavan-aqua/50 transition-colors">
                      {item.coverImage ? (
                        <img 
                          src={getImageUrl(item.coverImage, 800, 600)} 
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-volavan-cream/20">
                          <span className="font-['Cormorant_Garamond'] text-6xl italic">V</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-4 text-volavan-aqua/80 text-xs uppercase tracking-widest">
                        <span>{formatDate(item.publishedAt)}</span>
                        {item.author && (
                          <>
                            <span>—</span>
                            <span>{item.author.name}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-['Cormorant_Garamond'] text-3xl italic text-volavan-cream mb-4 group-hover:text-volavan-aqua transition-colors leading-tight">
                        {item.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-volavan-cream/70 mb-4 line-clamp-3 text-sm font-['Manrope'] flex-grow leading-relaxed">
                        {item.excerpt}
                      </p>
                      
                      {/* Categories */}
                      {item.categories && item.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.categories.slice(0, 2).map((cat, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-volavan-aqua/10 border border-volavan-aqua/30 rounded-full font-['Manrope'] text-[9px] uppercase tracking-wider text-volavan-aqua"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Read More */}
                      <span className="text-volavan-aqua text-xs uppercase tracking-widest font-['Manrope'] inline-block border-b border-transparent group-hover:border-volavan-aqua w-fit mt-auto transition-colors">
                        Read More
                      </span>
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filteredContent.length === 0 && (
        <div className="w-full py-32 flex flex-col items-center justify-center text-volavan-cream/40">
          <p className="font-['Manrope'] text-sm uppercase tracking-[0.2em]">No posts found</p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (selectedVideo.videoId || selectedVideo.videoUrl) && (() => {
        // Extract video ID from either videoId field or videoUrl field
        const videoId = selectedVideo.videoId 
          ? extractYouTubeId(selectedVideo.videoId) || selectedVideo.videoId
          : extractYouTubeId(selectedVideo.videoUrl || '');
        
        if (!videoId) return null;
        
        return (
          <VideoModal
            isOpen={true}
            videoId={videoId}
            title={selectedVideo.title}
            startTime={selectedVideo.startTime}
            endTime={selectedVideo.endTime}
            onClose={() => setSelectedVideo(null)}
          />
        );
      })()}
    </div>
  );
}