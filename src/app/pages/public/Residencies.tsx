import { useState, useMemo, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Filter, ChevronDown } from "lucide-react";
import { getImageUrl } from "../../lib/sanity";
import { SEOHead } from "../../components/SEOHead";
import { SanityImage } from "../../components/SanityImage";
import { SkeletonCard } from "../../components/ui/skeleton";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAllPrograms, useResidenciesPage, useSettings } from "../../hooks/useSanity";

export default function Residencies() {
  const { language } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch data with SWR
  const { programs, isLoading: programsLoading, isError: programsError } = useAllPrograms();
  const { page: pageContent, isLoading: pageLoading, isError: pageError } = useResidenciesPage();
  const { settings, isLoading: settingsLoading, isError: settingsError } = useSettings();


  const loading = programsLoading || pageLoading || settingsLoading;
  const error = programsError || pageError || settingsError;

  // Smooth scroll to grid
  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-volavan-earth text-volavan-cream px-6 py-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading residencies</p>
          <p className="text-sm text-volavan-cream/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-volavan-earth text-volavan-cream px-6 py-24 md:py-32 max-w-7xl mx-auto">
      <SEOHead 
        title={pageContent?.seo?.title || "Art Residencies"}
        description={pageContent?.seo?.description || "Discover our artistic residency programs at VOLAVAN."}
        url="/residencies"
        image={settings?.defaultSeo?.ogImage?.asset?.url}
      />
      
      {/* 1. HEADER SECTION */}
      <div className="w-full mb-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          
          <div className="space-y-6 max-w-2xl">
            {pageContent?.supertitle && (
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block font-['Manrope'] text-sm uppercase tracking-[0.25em] text-volavan-aqua"
              >
                {pageContent.supertitle}
              </motion.span>
            )}
            {pageContent?.title && (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-['Cormorant_Garamond'] text-5xl md:text-8xl italic text-volavan-cream leading-[0.9]"
              >
                {pageContent.title}
              </motion.h1>
            )}
            {pageContent?.introText && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-['Cormorant_Garamond'] text-xl md:text-3xl text-volavan-cream leading-relaxed text-right hyphens-auto whitespace-pre-line italic"
              >
                {pageContent.introText}
              </motion.p>
            )}
            {pageContent?.callToAction && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Cormorant_Garamond'] text-lg md:text-2xl text-volavan-aqua leading-relaxed text-right hyphens-auto"
              >
                {pageContent.callToAction}
              </motion.p>
            )}
          </div>

        </div>

        {/* Scroll Down Button */}
        <div className="flex justify-center -mt-32 md:-mt-28">
          <motion.button
            onClick={scrollToGrid}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-volavan-aqua/10 border border-volavan-aqua/30 rounded-full text-volavan-aqua font-['Manrope'] text-xs uppercase tracking-[0.15em] hover:bg-volavan-aqua/20 hover:border-volavan-aqua/50 transition-all cursor-pointer"
            aria-label="Scroll to programmes"
          >
            <span>Explore</span>
            <ChevronDown 
              size={14}
              strokeWidth={1.5}
              className="transition-transform group-hover:translate-y-0.5"
            />
          </motion.button>
        </div>
      </div>

      {/* 2. PROGRAMS GRID */}
      <div ref={gridRef} className="w-full max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 w-full">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 w-full"
          >
            <AnimatePresence>
              {programs.map((program, index) => {
                const editionsCount = program.editions?.length || 0;
                
                // Prioritize active editions (open_call or ongoing), otherwise take latest by year
                const activeEdition = program.editions?.find(e => 
                  e.status === 'open_call' || e.status === 'ongoing'
                );
                const targetEdition = activeEdition || program.editions?.[0]; // Fallback to latest by year
                
                // Check for different statuses in editions
                const hasOpenCall = program.editions?.some(e => e.status === 'open_call');
                const hasOngoing = program.editions?.some(e => e.status === 'ongoing');

                return (
                  <motion.div
                    layout
                    key={program._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group flex flex-col justify-between h-full pt-6 cursor-pointer min-w-0"
                  >
                    <Link to={targetEdition ? `/residencies/${targetEdition.slug}` : `/residencies`} className="flex flex-col h-full gap-8">
                      
                      {/* STATUS BADGES - Above Image with fixed height */}
                      <div className="flex flex-wrap gap-2 min-h-[44px]">
                        {hasOpenCall && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center gap-2.5 px-3 py-1.5 border border-volavan-aqua/40 rounded-sm h-fit"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-volavan-aqua" />
                            <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] text-volavan-aqua font-light">
                              Open Call
                            </span>
                          </motion.div>
                        )}
                        
                        {hasOngoing && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center gap-2.5 px-3 py-1.5 border border-volavan-cream/30 rounded-sm h-fit"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-volavan-cream" />
                            <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] text-volavan-cream/80 font-light">
                              In Progress
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* Card Image */}
                      <div className="w-full aspect-square overflow-hidden bg-volavan-earth-dark relative border border-volavan-cream/10 group-hover:border-volavan-aqua/50 transition-colors duration-500">
                        <div className="absolute inset-0 bg-volavan-earth/20 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
                        {program.heroImage ? (
                          <img
                            src={getImageUrl(program.heroImage, 800, 800)}
                            alt={program.name}
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full bg-volavan-earth-dark" />
                        )}
                        
                        {/* Tagline Overlay */}
                        {program.tagline && (
                          <div className="absolute inset-0 z-20 flex items-end">
                            <div className="absolute inset-0 bg-gradient-to-t from-volavan-earth via-volavan-earth/55 to-transparent" />
                            <p className="relative font-['Cormorant_Garamond'] text-lg md:text-xl text-volavan-cream italic leading-tight p-6" style={{ textShadow: '0 2px 8px rgba(106, 116, 108, 0.8)' }}>
                              {program.tagline}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Text Content */}
                      <div className="space-y-4">
                        {/* Title */}
                        <div className="flex justify-between items-end gap-4">
                          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl italic text-volavan-cream leading-[0.95] tracking-tight group-hover:text-volavan-aqua transition-colors duration-500 hyphens-auto">
                            {program.name}
                          </h2>
                          <ArrowUpRight className="text-volavan-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1 flex-shrink-0" size={20} />
                        </div>
                        
                        {/* Description Preview (if available) */}
                        {program.description && program.description[0] && (
                          <p className="font-['Manrope'] text-sm text-volavan-cream/60 line-clamp-2 leading-relaxed">
                            {program.description[0].children[0]?.text}
                          </p>
                        )}
                      </div>

                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && programs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="w-full py-32 flex flex-col items-center justify-center text-volavan-cream/40"
          >
            <Filter size={32} className="mb-4 opacity-50" strokeWidth={1} />
            <p className="font-['Manrope'] text-sm uppercase tracking-[0.2em]">No programs found</p>
          </motion.div>
        )}
      </div>

    </div>
  );
}