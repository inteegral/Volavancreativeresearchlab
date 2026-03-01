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
    <div className="min-h-screen bg-[#6A746C] text-[#F5F5F0] pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
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
          className="block font-['Manrope'] text-sm uppercase tracking-[0.25em] text-[#B5DAD9] mb-6"
        >
          Stories & Reflections
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-['Cormorant_Garamond'] text-5xl md:text-8xl italic leading-[0.9] text-[#F5F5F0]"
        >
          Journal
        </motion.h1>
      </div>

      {/* Filter Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-center gap-12 mb-20"
      >
        <button
          onClick={() => setFilter('all')}
          className={`group relative font-['Cormorant_Garamond'] text-2xl md:text-3xl italic transition-all duration-500 ${
            filter === 'all' 
              ? 'text-[#F5F5F0]' 
              : 'text-[#F5F5F0]/30 hover:text-[#F5F5F0]/60'
          }`}
        >
          All
          {filter === 'all' && (
            <motion.div
              layoutId="activeFilterUnderline"
              className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#B5DAD9]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        
        <span className="text-[#F5F5F0]/20 font-['Cormorant_Garamond'] text-2xl">/</span>
        
        <button
          onClick={() => setFilter('articles')}
          className={`group relative font-['Cormorant_Garamond'] text-2xl md:text-3xl italic transition-all duration-500 ${
            filter === 'articles' 
              ? 'text-[#F5F5F0]' 
              : 'text-[#F5F5F0]/30 hover:text-[#F5F5F0]/60'
          }`}
        >
          Articles
          {filter === 'articles' && (
            <motion.div
              layoutId="activeFilterUnderline"
              className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#B5DAD9]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        
        <span className="text-[#F5F5F0]/20 font-['Cormorant_Garamond'] text-2xl">/</span>
        
        <button
          onClick={() => setFilter('videos')}
          className={`group relative font-['Cormorant_Garamond'] text-2xl md:text-3xl italic transition-all duration-500 ${
            filter === 'videos' 
              ? 'text-[#F5F5F0]' 
              : 'text-[#F5F5F0]/30 hover:text-[#F5F5F0]/60'
          }`}
        >
          Videos
          {filter === 'videos' && (
            <motion.div
              layoutId="activeFilterUnderline"
              className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#B5DAD9]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="w-full py-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#B5DAD9]/30 border-t-[#B5DAD9] rounded-full animate-spin" />
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
                    <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-[#5E6860] border border-[#F5F5F0]/10 group-hover:border-[#B5DAD9]/50 transition-colors">
                      {thumbnailUrl ? (
                        <img 
                          src={thumbnailUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#F5F5F0]/20">
                          <span className="font-['Cormorant_Garamond'] text-6xl italic">V</span>
                        </div>
                      )}
                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#6A746C]/40 group-hover:bg-[#6A746C]/20 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-[#B5DAD9]/90 group-hover:bg-[#B5DAD9] flex items-center justify-center transition-all transform group-hover:scale-110">
                          <Play size={28} className="text-[#6A746C] ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-4 text-[#B5DAD9]/80 text-xs uppercase tracking-widest">
                        <span>Video</span>
                        <span>—</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-['Cormorant_Garamond'] text-3xl italic text-[#F5F5F0] mb-4 group-hover:text-[#B5DAD9] transition-colors leading-tight">
                        {item.title}
                      </h3>
                      
                      {/* Excerpt */}
                      {item.excerpt && (
                        <p className="text-[#F5F5F0]/70 mb-4 line-clamp-3 text-sm font-['Manrope'] flex-grow leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
                      
                      {/* Categories */}
                      {item.categories && item.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.categories.slice(0, 2).map((cat, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-[#B5DAD9]/10 border border-[#B5DAD9]/30 rounded-full font-['Manrope'] text-[9px] uppercase tracking-wider text-[#B5DAD9]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Watch Now */}
                      <span className="text-[#B5DAD9] text-xs uppercase tracking-widest font-['Manrope'] inline-block border-b border-transparent group-hover:border-[#B5DAD9] w-fit mt-auto transition-colors">
                        Watch Video
                      </span>
                    </div>
                  </button>
                ) : (
                  // Article Card - Normal Link
                  <Link to={`/journal/${item.slug}`} className="group block h-full flex flex-col">
                    {/* Cover Image */}
                    <div className="aspect-[4/3] overflow-hidden mb-6 bg-[#5E6860] border border-[#F5F5F0]/10 group-hover:border-[#B5DAD9]/50 transition-colors">
                      {item.coverImage ? (
                        <img 
                          src={getImageUrl(item.coverImage, 800, 600)} 
                          alt={item.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#F5F5F0]/20">
                          <span className="font-['Cormorant_Garamond'] text-6xl italic">V</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-4 text-[#B5DAD9]/80 text-xs uppercase tracking-widest">
                        <span>{formatDate(item.publishedAt)}</span>
                        {item.author && (
                          <>
                            <span>—</span>
                            <span>{item.author.name}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-['Cormorant_Garamond'] text-3xl italic text-[#F5F5F0] mb-4 group-hover:text-[#B5DAD9] transition-colors leading-tight">
                        {item.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-[#F5F5F0]/70 mb-4 line-clamp-3 text-sm font-['Manrope'] flex-grow leading-relaxed">
                        {item.excerpt}
                      </p>
                      
                      {/* Categories */}
                      {item.categories && item.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.categories.slice(0, 2).map((cat, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-[#B5DAD9]/10 border border-[#B5DAD9]/30 rounded-full font-['Manrope'] text-[9px] uppercase tracking-wider text-[#B5DAD9]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Read More */}
                      <span className="text-[#B5DAD9] text-xs uppercase tracking-widest font-['Manrope'] inline-block border-b border-transparent group-hover:border-[#B5DAD9] w-fit mt-auto transition-colors">
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
        <div className="w-full py-32 flex flex-col items-center justify-center text-[#F5F5F0]/40">
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