import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Filter } from "lucide-react";
import { getStatus, type ResidencyStatus } from "../../lib/residency-status";
import { VButton } from "../../components/ui/VButton";
import { SEOHead } from "../../components/SEOHead";
import { SkeletonCard } from "../../components/ui/skeleton";
import { ProgramCard } from "../../components/ProgramCard";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAllPrograms, useResidenciesPage, useSettings } from "../../hooks/useSanity";
import type { SanityProgram } from "../../lib/sanity";

type FilterStatus = 'all' | ResidencyStatus;

const FILTER_LABELS: Record<FilterStatus, string> = {
  all: 'All',
  upcoming: 'Upcoming',
  open_soon: 'Open Soon',
  open_call: 'Open Call',
  reviewing: 'Reviewing Applications',
  in_residence: 'In Residence',
  completed: 'Completed',
};

type CompletedItem = {
  program: SanityProgram;
  edition: NonNullable<SanityProgram['editions']>[0];
};

export default function Residencies() {
  const { language } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

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
      if (p.editions?.some(e => getStatus(e) === 'completed')) statuses.add('completed');
    });
    const order: ResidencyStatus[] = ['open_call', 'open_soon', 'in_residence', 'reviewing', 'upcoming', 'completed'];
    return ['all', ...order.filter(s => statuses.has(s))];
  }, [programs]);

  const completedItems = useMemo<CompletedItem[]>(() => {
    const items: CompletedItem[] = [];
    programs.forEach(p => {
      p.editions?.forEach(e => {
        if (getStatus(e) === 'completed') items.push({ program: p, edition: e });
      });
    });
    return items.sort((a, b) => {
      const aTime = a.edition.startDate ? new Date(a.edition.startDate).getTime() : 0;
      const bTime = b.edition.startDate ? new Date(b.edition.startDate).getTime() : 0;
      return bTime - aTime;
    });
  }, [programs]);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

      {/* 1. HEADER */}
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

        <div className="flex justify-center -mt-32 md:-mt-28">
          <VButton onClick={scrollToGrid} variant="outline-aqua" size="sm" arrow={false} aria-label="Scroll to programmes">
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
                  activeFilter === f ? 'text-volavan-cream' : 'text-volavan-cream/30 hover:text-volavan-cream/60'
                }`}
              >
                {FILTER_LABELS[f]}
                {activeFilter === f && (
                  <motion.div layoutId="filter-indicator" className="absolute bottom-0 left-0 right-0 h-px bg-volavan-cream" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. GRID */}
      <div ref={gridRef} className="w-full max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 w-full">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : activeFilter === 'completed' ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 w-full">
            <AnimatePresence>
              {completedItems.map(({ program, edition }, index) => (
                <ProgramCard
                  key={edition._id ?? edition.slug}
                  href={`/residencies/${edition.slug}`}
                  image={edition.coverImage ?? program.heroImage}
                  name={program.name}
                  year={edition.year}
                  tagline={program.tagline}
                  startDate={edition.startDate}
                  endDate={edition.endDate}
                  status="completed"
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 w-full">
            <AnimatePresence>
              {[...programs]
                .filter(p => {
                  if (activeFilter === 'all') return true;
                  const ed = p.editions?.find(e => getStatus(e) !== 'completed') ?? p.editions?.[0];
                  return getStatus(ed) === activeFilter;
                })
                .sort((a, b) => {
                  const relevant = (p: typeof a) =>
                    p.editions?.find(e => getStatus(e) !== 'completed') ?? p.editions?.[0];
                  const isCompleted = (p: typeof a) => {
                    const ed = relevant(p);
                    return !ed || getStatus(ed) === 'completed';
                  };
                  const aCompleted = isCompleted(a);
                  const bCompleted = isCompleted(b);
                  if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
                  const getTime = (p: typeof a) => {
                    const ed = relevant(p);
                    return ed?.startDate ? new Date(ed.startDate).getTime() : Infinity;
                  };
                  return aCompleted ? getTime(b) - getTime(a) : getTime(a) - getTime(b);
                })
                .map((program, index) => {
                  const targetEdition =
                    program.editions?.find(e => getStatus(e) !== 'completed') ?? program.editions?.[0];
                  const status = targetEdition ? getStatus(targetEdition) : 'upcoming';

                  return (
                    <ProgramCard
                      key={program._id}
                      href={targetEdition ? `/residencies/${targetEdition.slug}` : '/residencies'}
                      image={program.heroImage}
                      name={program.name}
                      tagline={program.tagline}
                      startDate={targetEdition?.startDate}
                      endDate={targetEdition?.endDate}
                      status={status}
                      callOpenDate={targetEdition?.callDates?.open}
                      callCloseDate={targetEdition?.callDates?.close}
                      index={index}
                    />
                  );
                })}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && activeFilter !== 'completed' && programs.filter(p => {
          if (activeFilter === 'all') return true;
          const ed = p.editions?.find(e => getStatus(e) !== 'completed') ?? p.editions?.[0];
          return getStatus(ed) === activeFilter;
        }).length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full py-32 flex flex-col items-center justify-center text-volavan-cream/40">
            <Filter size={32} className="mb-4 opacity-50" strokeWidth={1} />
            <p className="font-['Manrope'] text-sm uppercase tracking-[0.2em]">No programs found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
