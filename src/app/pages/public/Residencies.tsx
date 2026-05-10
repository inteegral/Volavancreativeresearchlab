import { useState, useMemo, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowUpRight, Filter, Calendar } from "lucide-react";
import { getStatus, getStatusBadge, type ResidencyStatus } from "../../lib/residency-status";
import { VButton } from "../../components/ui/VButton";

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
import { getImageUrl } from "../../lib/sanity";
import { SEOHead } from "../../components/SEOHead";
import { SanityImage } from "../../components/SanityImage";
import { SkeletonCard } from "../../components/ui/skeleton";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAllPrograms, useResidenciesPage, useSettings } from "../../hooks/useSanity";

type FilterStatus = 'all' | ResidencyStatus;

const FILTER_LABELS: Record<FilterStatus, string> = {
  all: 'All',
  upcoming: 'Upcoming',
  open_call: 'Open Call',
  under_selection: 'Reviewing Applications',
  in_residence: 'In Residence',
  completed: 'Closed',
};

export default function Residencies() {
  const { language } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // Fetch data with SWR
  const { programs, isLoading: programsLoading, isError: programsError } = useAllPrograms();
  const { page: pageContent, isLoading: pageLoading, isError: pageError } = useResidenciesPage();
  const { settings, isLoading: settingsLoading, isError: settingsError } = useSettings();


  const loading = programsLoading || pageLoading || settingsLoading;
  const error = programsError || pageError || settingsError;

  const availableFilters = useMemo<FilterStatus[]>(() => {
    const statuses = new Set<ResidencyStatus>();
    programs.forEach(p => {
      const ed = p.editions?.find(e => getStatus(e) !== 'completed') ?? p.editions?.[0];
      if (ed) statuses.add(getStatus(ed));
    });
    const order: ResidencyStatus[] = ['open_call', 'in_residence', 'under_selection', 'upcoming', 'completed'];
    return ['all', ...order.filter(s => statuses.has(s))];
  }, [programs]);

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
          <p className="text-sm text-volavan-cream/60">{error instanceof Error ? error.message : String(error)}</p>
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
                className="font-['Cormorant_Garamond'] text-4xl md:text-6xl italic text-volavan-cream leading-[0.9]"
              >
                {pageContent.title}
              </motion.h1>
            )}
            {pageContent?.introText && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-['Cormorant_Garamond'] text-base md:text-2xl text-volavan-cream leading-relaxed text-right hyphens-auto whitespace-pre-line italic"
              >
                {pageContent.introText}
              </motion.p>
            )}
            {pageContent?.callToAction && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Cormorant_Garamond'] text-sm md:text-xl text-volavan-aqua leading-relaxed text-right hyphens-auto"
              >
                {pageContent.callToAction}
              </motion.p>
            )}
          </div>

        </div>

        {/* Scroll Down Button */}
        <div className="flex justify-center -mt-32 md:-mt-28">
          <VButton
            onClick={scrollToGrid}
            variant="outline-aqua"
            size="sm"
            arrow={false}
            aria-label="Scroll to programmes"
          >
            Explore
            <ChevronDown size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-y-0.5" />
          </VButton>
        </div>
      </div>

      {/* 2. FILTER BAR */}
      {!loading && availableFilters.length > 2 && (
        <div className="w-full max-w-7xl mx-auto mb-16">
          <div className="flex gap-8 border-b border-volavan-cream/10 flex-wrap">
            {availableFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`pb-4 font-['Manrope'] text-[11px] uppercase tracking-[0.25em] transition-colors relative whitespace-nowrap ${
                  activeFilter === f
                    ? 'text-volavan-cream'
                    : 'text-volavan-cream/30 hover:text-volavan-cream/60'
                }`}
              >
                {FILTER_LABELS[f]}
                {activeFilter === f && (
                  <motion.div
                    layoutId="filter-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-volavan-cream"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. PROGRAMS GRID */}
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
              {[...programs]
                .filter(p => {
                  if (activeFilter === 'all') return true;
                  const ed = p.editions?.find(e => getStatus(e) !== 'completed') ?? p.editions?.[0];
                  return getStatus(ed) === activeFilter;
                })
                .sort((a, b) => {
                  // Pick the most relevant edition: first non-completed, else first
                  const getRelevantEdition = (p: typeof a) =>
                    p.editions?.find(e => getStatus(e) !== 'completed') ?? p.editions?.[0];

                  const isCompleted = (p: typeof a) => {
                    const ed = getRelevantEdition(p);
                    return !ed || getStatus(ed) === 'completed';
                  };

                  const aCompleted = isCompleted(a);
                  const bCompleted = isCompleted(b);

                  // Active/future first, completed last
                  if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;

                  const getTime = (p: typeof a) => {
                    const ed = getRelevantEdition(p);
                    return ed?.startDate ? new Date(ed.startDate).getTime() : Infinity;
                  };
                  return aCompleted
                    ? getTime(b) - getTime(a)   // completed: most recent first
                    : getTime(a) - getTime(b);  // active: earliest first
                })
                .map((program, index) => {
                // Pick the most relevant (non-completed) edition, fallback to latest
                const targetEdition =
                  program.editions?.find(e => getStatus(e) !== 'completed') ??
                  program.editions?.[0];

                const editionStatus = targetEdition ? getStatus(targetEdition) : 'upcoming';
                const statusBadge = getStatusBadge(editionStatus);
                const hasActiveOpenCall = editionStatus === 'open_call';
                // Show call dates only while open call is active
                const openCallOpen = hasActiveOpenCall ? targetEdition?.callDates?.open : undefined;
                const openCallDeadline = hasActiveOpenCall ? targetEdition?.callDates?.close : undefined;
                const hasCallDates = !!(openCallOpen || openCallDeadline);

                // Dates from the target edition
                const startDate = targetEdition?.startDate;
                const endDate = targetEdition?.endDate;

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

                        {/* Status badge — top-left inside image */}
                        {editionStatus !== 'upcoming' && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className={`absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-volavan-earth/70 backdrop-blur-sm border ${statusBadge.borderColor} rounded-sm`}
                          >
                            {hasActiveOpenCall && <div className="w-1.5 h-1.5 rounded-full bg-volavan-aqua animate-pulse" />}
                            <span
                              className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] font-light"
                              style={{ color: statusBadge.color }}
                            >
                              {statusBadge.label}
                            </span>
                          </motion.div>
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
                      <div className="space-y-3">
                        {/* Title */}
                        <div className="flex justify-between items-end gap-4">
                          <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-4xl italic text-volavan-cream leading-[0.95] tracking-tight group-hover:text-volavan-aqua transition-colors duration-500 hyphens-auto">
                            {program.name}
                          </h2>
                          <ArrowUpRight className="text-volavan-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1 flex-shrink-0" size={20} />
                        </div>

                        {/* Dates */}
                        {startDate && endDate && (
                          <p className="font-['Manrope'] text-[13px] uppercase tracking-[0.18em] text-volavan-cream/40 flex items-center gap-2">
                            <Calendar size={11} className="opacity-60 shrink-0" />
                            {formatShortDate(startDate)} — {formatShortDate(endDate)}
                          </p>
                        )}

                        {/* Open call dates */}
                        {hasCallDates && (
                          <div className="flex flex-col gap-1 mt-1 pl-3 border-l border-volavan-aqua/20">
                            {openCallOpen && (
                              <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.18em] text-volavan-aqua/50">
                                <span className="text-volavan-aqua/30">Open Call</span>
                                <span className="mx-1.5 opacity-30">·</span>
                                {formatShortDate(openCallOpen)}
                              </p>
                            )}
                            {openCallDeadline && (
                              <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.18em] text-volavan-aqua/70">
                                <span className="text-volavan-aqua/40">Deadline</span>
                                <span className="mx-1.5 opacity-30">·</span>
                                {formatShortDate(openCallDeadline)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && programs.filter(p => {
          if (activeFilter === 'all') return true;
          const ed = p.editions?.find(e => getStatus(e) !== 'completed') ?? p.editions?.[0];
          return getStatus(ed) === activeFilter;
        }).length === 0 && (
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