import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getImageUrl, type SanityArtist } from "../../lib/sanity";
import { SEOHead } from "../../components/SEOHead";
import { useAllArtists, useJournalContent } from "../../hooks/useSanity";

export default function Artists() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Fetch data with SWR
  const { residencies, isLoading: loading } = useAllArtists();
  const { content: journalPosts, isLoading: journalLoading } = useJournalContent();

  // Extract unique artists from all residencies
  const allArtists: (SanityArtist & { residencyTitles: string[] })[] = [];
  const artistMap = new Map<string, { artist: SanityArtist; residencyTitles: string[] }>();

  residencies.forEach(residency => {
    if (!residency.artists || residency.artists.length === 0) return;
    
    // Debug: log residency title
    
    residency.artists.forEach(item => {
      if (!item || !item.artist) return;
      
      const artist = item.artist;
      
      if (!artistMap.has(artist._id)) {
        artistMap.set(artist._id, {
          artist: artist,
          residencyTitles: residency.title ? [residency.title] : [],
        });
      } else {
        const existing = artistMap.get(artist._id)!;
        if (residency.title && !existing.residencyTitles.includes(residency.title)) {
          existing.residencyTitles.push(residency.title);
        }
      }
    });
  });

  artistMap.forEach(({ artist, residencyTitles }) => {
    allArtists.push({ ...artist, residencyTitles });
  });

  // Sort by name
  allArtists.sort((a, b) => a.name.localeCompare(b.name));

  // Create mixed grid with artists and journal posts
  const mixedGrid: Array<{ type: 'artist'; data: typeof allArtists[0] } | { type: 'journal'; data: typeof journalPosts[0] }> = [];
  let journalIndex = 0;
  
  allArtists.forEach((artist, index) => {
    // Insert a journal post at position 0, then every 8 artists after that
    if (index % 8 === 0 && journalIndex < journalPosts.length) {
      mixedGrid.push({ type: 'journal', data: journalPosts[journalIndex] });
      journalIndex++;
    }
    
    mixedGrid.push({ type: 'artist', data: artist });
  });

  return (
    <div className="min-h-screen bg-[#6A746C] text-[#F5F5F0] pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
      <SEOHead 
        title="Artisti"
        description="Scopri gli artisti che hanno partecipato alle residenze artistiche di VOLAVAN. Una comunità multidisciplinare di creatori da tutto il mondo."
        url="/artists"
      />
      
      {/* Header */}
      <div className="mb-12 md:mb-20 lg:mb-32">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="block font-['Manrope'] text-xs md:text-sm uppercase tracking-[0.25em] text-[#B5DAD9] mb-4 md:mb-6"
        >
          The Community
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-['Cormorant_Garamond'] text-4xl md:text-6xl lg:text-8xl italic leading-[0.9] text-[#F5F5F0] max-w-4xl"
        >
          Artists
        </motion.h1>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="w-full py-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#B5DAD9]/30 border-t-[#B5DAD9] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {mixedGrid.map((item, index) => (
            <motion.div
              key={item.type === 'artist' ? item.data._id : item.data._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.05) }}
              className={`group relative h-[350px] sm:h-[380px] md:h-[400px] overflow-hidden bg-[#6A746C] transition-colors duration-500 ${
                item.type === 'artist' 
                  ? 'border border-[#F5F5F0]/10 hover:border-[#B5DAD9]/50' 
                  : ''
              }`}
              onMouseEnter={() => setHoveredId(item.type === 'artist' ? item.data._id : null)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {item.type === 'artist' ? (
                <Link to={`/artists/${item.data.slug}`} className="block h-full w-full relative p-4 md:p-6 flex flex-col justify-between z-20">
                  
                  {/* Header of Card */}
                  <div className="flex justify-between items-start w-full mix-blend-difference z-20">
                    <div className="flex flex-col gap-2">
                      {item.data.residencyTitles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.data.residencyTitles.slice(0, 2).map((title, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-0.5 bg-[#B5DAD9]/20 border border-[#B5DAD9]/40 rounded-full font-['Manrope'] text-[8px] md:text-[9px] uppercase tracking-[0.15em] text-[#B5DAD9]"
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowUpRight className="text-[#F5F5F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={16} />
                  </div>

                  {/* Footer of Card */}
                  <div className="space-y-1.5 md:space-y-2 mix-blend-difference z-20">
                    <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-[#F5F5F0] leading-none group-hover:translate-x-2 transition-transform duration-500">
                      {item.data.name}
                    </h2>
                    <div className="flex items-center gap-2 font-['Manrope'] text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#B5DAD9] opacity-80 group-hover:translate-x-2 transition-transform duration-500 delay-75">
                      {item.data.disciplines?.[0] && (
                        <span>{item.data.disciplines[0]}</span>
                      )}
                      {item.data.disciplines?.[0] && item.data.nationality && (
                        <span className="text-[#F5F5F0]/40">·</span>
                      )}
                      {item.data.nationality && (
                        <span>{item.data.nationality}</span>
                      )}
                    </div>
                  </div>

                  {/* Hover Image Background */}
                  <div className="absolute inset-0 z-10 opacity-30 group-hover:opacity-70 transition-opacity duration-700 ease-out bg-[#5E6860]">
                    {item.data.photo ? (
                      <img 
                        src={getImageUrl(item.data.photo, 600, 600)} 
                        alt={item.data.name}
                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-['Cormorant_Garamond'] text-8xl italic text-[#F5F5F0]/20">
                          {item.data.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6A746C]/90 via-transparent to-[#6A746C]/10 mix-blend-multiply" />
                  </div>
                </Link>
              ) : (
                <Link to={`/journal/${item.data.slug}`} className="block h-full w-full relative overflow-hidden">
                  
                  {/* Static Image Background - Very Faded */}
                  <div className="absolute inset-0 opacity-20">
                    {(() => {
                      const imageSource = item.data._type === 'videoPost' ? item.data.thumbnail : item.data.coverImage;
                      const imageUrl = imageSource ? getImageUrl(imageSource, 600, 600) : null;
                      
                      return imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={item.data.title}
                          className="w-full h-full object-cover blur-sm grayscale-[0.3]"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#5E6860]" />
                      );
                    })()}
                  </div>

                  {/* Content Overlay - Static */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6A746C] via-[#6A746C]/90 to-[#6A746C]/70 p-6 md:p-8 flex flex-col justify-between">
                    <div className="flex-1 flex items-center">
                      <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl lg:text-4xl italic text-[#F5F5F0] leading-tight group-hover:translate-y-[-4px] transition-transform duration-300">
                        {item.data.title}
                      </h2>
                    </div>
                    
                    <div className="flex items-center justify-between group-hover:translate-y-[-4px] transition-transform duration-300">
                      {item.data.publishedAt && (
                        <div className="font-['Manrope'] text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#B5DAD9]">\n                          {new Date(item.data.publishedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      )}
                      <span className="font-['Manrope'] text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#F5F5F0] opacity-80 hover:opacity-100">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!loading && allArtists.length === 0 && (
        <div className="w-full py-32 flex flex-col items-center justify-center text-[#F5F5F0]/40">
          <p className="font-['Manrope'] text-sm uppercase tracking-[0.2em]">No artists found</p>
        </div>
      )}
    </div>
  );
}