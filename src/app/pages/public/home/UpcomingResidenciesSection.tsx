import { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { getImageUrl, calculateResidencyStatus } from "../../../lib/sanity";
import { VLink } from "../../../components/ui/VButton";
import { SanityImage } from "../../../components/SanityImage";
import { SkeletonCard } from "../../../components/ui/skeleton";
import type { SanityProgram } from "../../../lib/sanity";

interface UpcomingResidenciesSectionProps {
  programs: SanityProgram[];
  programsLoading: boolean;
}

export function UpcomingResidenciesSection({ programs, programsLoading }: UpcomingResidenciesSectionProps) {
  const upcomingResidencies = useMemo(() => {
    return programs
      .filter(program => {
        if (!program.editions || program.editions.length === 0) return false;
        return program.editions.some(edition => {
          const calculatedStatus = calculateResidencyStatus(edition);
          return calculatedStatus === 'upcoming' || calculatedStatus === 'open_call' || calculatedStatus === 'open_call_soon';
        });
      })
      .slice(0, 2);
  }, [programs]);

  return (
    <div className="w-full max-w-5xl mx-auto mb-[150px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-16"
      >
        <div className="text-center space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-volavan-cream italic">
            Upcoming Residencies
          </h2>
        </div>

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
              const latestEdition = program.editions?.[0];
              if (!latestEdition) return null;

              const coverImage = latestEdition.coverImage;

              return (
                <Link
                  key={program._id}
                  to={`/residencies/${latestEdition.slug}`}
                  className="group relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <SanityImage
                      image={coverImage}
                      alt={program.name}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-full group-hover:scale-105 transition-transform duration-700 saturate-[0.45] opacity-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-volavan-earth/60 pointer-events-none"></div>
                  </div>

                  <div className="p-6 space-y-3 bg-volavan-earth/50 backdrop-blur-sm">
                    <h3 className="font-['Manrope'] text-xl uppercase tracking-[0.2em] text-volavan-cream text-left">
                      {program.name}
                    </h3>
                    {program.tagline && (
                      <p className="font-['Cormorant_Garamond'] text-lg italic text-volavan-aqua text-left">
                        {program.tagline}
                      </p>
                    )}
                    {latestEdition.startDate && latestEdition.endDate && (
                      <div className="flex items-center gap-2 text-xs text-volavan-aqua font-['Manrope'] uppercase tracking-wide">
                        <span>{new Date(latestEdition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>—</span>
                        <span>{new Date(latestEdition.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
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

        <div className="flex justify-center mt-12">
          <VLink to="/residencies" variant="outline">View All Residencies</VLink>
        </div>
      </motion.div>
    </div>
  );
}
