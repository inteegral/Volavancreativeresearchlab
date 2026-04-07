import { Link } from "react-router";
import { ArrowDown, Calendar, MapPin } from "lucide-react";
import { VLink } from "../../../components/ui/VButton";
import { motion } from "motion/react";
import { getImageUrl } from "../../../lib/sanity";
import type { SanityResidency, SanityProgram } from "../../../lib/sanity";

interface StatusBadge {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface ResidencyHeroProps {
  residency: SanityResidency;
  program: SanityProgram;
  currentStatus: string | null;
  statusBadge: StatusBadge | null;
  isOpenCall: boolean;
  isPastEdition: boolean;
  getStatus: (edition: any) => string | null;
}

export function ResidencyHero({
  residency,
  program,
  currentStatus,
  statusBadge,
  isOpenCall,
  isPastEdition,
  getStatus,
}: ResidencyHeroProps) {
  const heroImage = residency.coverImage;
  const startDate = residency.residencyDates?.start;
  const endDate = residency.residencyDates?.end;

  return (
    <section className="relative h-screen min-h-[800px] w-full flex flex-col items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-volavan-earth/70 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-volavan-earth via-transparent to-volavan-earth/30 z-10" />
        {heroImage ? (
          <img
            src={getImageUrl(heroImage, 1920, 1080)}
            alt={residency.title}
            className="w-full h-full object-cover opacity-20"
          />
        ) : (
          <div className="w-full h-full bg-volavan-earth-dark" />
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center justify-center w-full space-y-12"
        >
          {statusBadge && (
            <div className={`px-5 py-2 ${statusBadge.bgColor} ${statusBadge.borderColor} border rounded-full`}>
              <span
                className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] font-medium"
                style={{ color: statusBadge.color }}
              >
                {statusBadge.label}
              </span>
            </div>
          )}

          <div className="w-full flex flex-col items-center gap-6 py-8">
            <h1 className="font-['Cormorant_Garamond'] text-[20vw] md:text-[16vw] lg:text-[13.5vw] xl:text-[12vw] italic text-volavan-cream leading-[0.9] tracking-tight max-w-[95vw]">
              {program.name}
            </h1>

            {program.tagline && (
              <p className="font-['Manrope'] text-base md:text-lg lg:text-xl text-volavan-cream/70 max-w-3xl leading-relaxed tracking-wide px-4">
                {program.tagline}
              </p>
            )}

            <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-volavan-cream/10 w-full max-w-3xl">
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-volavan-cream/70 text-center">
                <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar size={14} className="opacity-50" />
                  {(() => {
                    if (!startDate || !endDate) return null;
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    const sameYear = start.getFullYear() === end.getFullYear();
                    const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + (!sameYear ? ` ${start.getFullYear()}` : '');
                    const endStr = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    return `${startStr} — ${endStr}`;
                  })()}
                </span>
                <span className="hidden md:inline w-px h-3 bg-volavan-cream/20"></span>
                <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapPin size={14} className="opacity-50" />
                  {program.location}, {program.country}
                </span>
              </div>
            </div>
          </div>

          {program.disciplines && program.disciplines.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {program.disciplines.slice(0, 3).map((discipline, i) => (
                <span key={i} className="font-['Manrope'] text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-volavan-cream/50 whitespace-nowrap">
                  {discipline}
                </span>
              ))}
            </div>
          )}

          {isPastEdition && (() => {
            const currentEdition = program.otherEditions?.find((ed) => {
              if (!ed) return false;
              const edStatus = getStatus(ed);
              return edStatus === 'open_call' || edStatus === 'ongoing' || edStatus === 'upcoming' || edStatus === 'open_call_soon';
            });
            if (currentEdition && currentEdition.slug) {
              return (
                <div className="pt-4">
                  <VLink to={`/residencies/${currentEdition.slug}`} variant="outline-aqua" size="sm">
                    View Current Edition
                  </VLink>
                </div>
              );
            }
            return null;
          })()}
        </motion.div>

        {isOpenCall && (
          <div className="absolute bottom-16 left-0 right-0 w-full max-w-5xl mx-auto px-6">
            <div className="border-t border-b border-volavan-cream/10 py-5 flex justify-center items-center">
              <VLink to={`/apply/${residency.slug || ''}`} variant="ghost" size="sm">Apply Now</VLink>
            </div>
          </div>
        )}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={() => document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-6 z-20 flex flex-col items-center gap-2 text-volavan-cream/40 hover:text-volavan-aqua transition-colors cursor-pointer"
      >
        <span className="text-[8px] uppercase tracking-[0.2em] font-['Manrope']">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={16} strokeWidth={1} />
        </motion.div>
      </motion.button>
    </section>
  );
}
