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

  // Auto-scale the hero title so long names never overflow.
  // Target: text fills ≈ 80 % of viewport width.
  // Cormorant Garamond italic uppercase average char-width ≈ 0.62 em.
  // fontSize × charCount × 0.62 ≤ 80vw  →  fontSize ≤ 129vw / charCount
  // Capped at 17 vw (short names) and floored at 5 vw (pathologically long names).
  const heroFontVw = Math.max(
    4,
    Math.min(13, parseFloat((98 / program.name.length).toFixed(1)))
  );

  // Find a current/upcoming edition to link to (for past editions)
  const currentEdition = isPastEdition
    ? program.otherEditions?.find((ed) => {
        if (!ed) return false;
        const s = getStatus(ed);
        return s === 'open_call' || s === 'ongoing' || s === 'upcoming' || s === 'open_call_soon';
      })
    : null;

  const formattedDates = (() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const sameYear = start.getFullYear() === end.getFullYear();
    const startStr =
      start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
      (!sameYear ? ` ${start.getFullYear()}` : '');
    const endStr = end.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `${startStr} — ${endStr}`;
  })();

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">

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

      {/* ── LAYOUT: three-zone flex column ─────────────────────────── */}
      <div className="relative z-20 flex flex-col w-full max-w-7xl mx-auto px-6 min-h-screen">

        {/* ZONE 1 – top spacer + status badge (accounts for fixed header) */}
        <div className="pt-32 flex justify-center">
          {statusBadge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`px-5 py-2 ${statusBadge.bgColor} ${statusBadge.borderColor} border rounded-full`}
            >
              <span
                className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] font-medium"
                style={{ color: statusBadge.color }}
              >
                {statusBadge.label}
              </span>
            </motion.div>
          )}
        </div>

        {/* ZONE 2 – program name + tagline, grows to fill available space */}
        <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 py-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ fontSize: `${heroFontVw}vw` }}
            className="font-['Cormorant_Garamond'] italic text-volavan-cream leading-[0.9] tracking-tight w-full overflow-hidden"
          >
            {program.name}
          </motion.h1>

          {program.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-['Manrope'] text-sm md:text-base text-volavan-cream/70 max-w-md md:max-w-xl leading-relaxed tracking-wide px-2"
            >
              {program.tagline}
            </motion.p>
          )}
        </div>

        {/* ZONE 3 – meta info + CTA, pinned to bottom with safe padding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-5 pb-10"
        >
          {/* Dates + Location */}
          {(formattedDates || (program.location && program.country)) && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-center text-volavan-cream/60 border-t border-volavan-cream/10 pt-6 w-full max-w-2xl justify-center">
              {formattedDates && (
                <span className="font-['Manrope'] text-[13px] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar size={13} className="opacity-50 shrink-0" />
                  {formattedDates}
                </span>
              )}
              {formattedDates && program.location && (
                <span className="hidden sm:inline w-px h-3 bg-volavan-cream/20" />
              )}
              {program.location && program.country && (
                <span className="font-['Manrope'] text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapPin size={13} className="opacity-50 shrink-0" />
                  {program.location}, {program.country}
                </span>
              )}
            </div>
          )}

          {/* Disciplines */}
          {program.disciplines && program.disciplines.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-5 max-w-sm md:max-w-xl">
              {program.disciplines.slice(0, 3).map((discipline, i) => (
                <span
                  key={i}
                  className="font-['Manrope'] text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-volavan-cream/40"
                >
                  {discipline}
                </span>
              ))}
            </div>
          )}

          {/* CTA or past-edition link */}
          {isOpenCall ? (
            <div className="w-full max-w-2xl border-t border-b border-volavan-cream/10 py-5 flex justify-center">
              <VLink
                to={`/apply/${residency.slug || ''}`}
                variant="ghost"
                size="sm"
              >
                Apply Now
              </VLink>
            </div>
          ) : isPastEdition && currentEdition?.slug ? (
            <div className="pt-2">
              <VLink
                to={`/residencies/${currentEdition.slug}`}
                variant="outline-aqua"
                size="sm"
              >
                View Current Edition
              </VLink>
            </div>
          ) : (
            /* Scroll indicator — only when no CTA competing for space */
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              onClick={() =>
                document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="flex flex-col items-center gap-2 text-volavan-cream/40 hover:text-volavan-aqua transition-colors cursor-pointer"
            >
              <span className="text-[8px] uppercase tracking-[0.2em] font-['Manrope']">Scroll</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ArrowDown size={16} strokeWidth={1} />
              </motion.div>
            </motion.button>
          )}
        </motion.div>

      </div>
    </section>
  );
}
