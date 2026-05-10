import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar } from "lucide-react";
import { getStatusBadge, type ResidencyStatus } from "../lib/residency-status";
import { getImageUrl, type SanityImage } from "../lib/sanity";

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface ProgramCardProps {
  href: string;
  image?: SanityImage;
  name: string;
  year?: number;
  tagline?: string;
  startDate?: string;
  endDate?: string;
  status: ResidencyStatus;
  callOpenDate?: string;
  callCloseDate?: string;
  index?: number;
}

export function ProgramCard({
  href,
  image,
  name,
  year,
  tagline,
  startDate,
  endDate,
  status,
  callOpenDate,
  callCloseDate,
  index = 0,
}: ProgramCardProps) {
  const statusBadge = getStatusBadge(status);
  const showBadge = status !== 'upcoming';
  const showCallDates = true;
  const isOpenCall = status === 'open_call';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex flex-col justify-between h-full pt-6 cursor-pointer min-w-0"
    >
      <Link to={href} className="flex flex-col h-full gap-8">
        {/* Image */}
        <div className="w-full aspect-square overflow-hidden bg-volavan-earth-dark relative border border-volavan-cream/10 group-hover:border-volavan-aqua/50 transition-colors duration-500">
          <div className="absolute inset-0 bg-volavan-earth/20 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
          {image ? (
            <img
              src={getImageUrl(image, 800, 800)}
              alt={name}
              className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full bg-volavan-earth-dark" />
          )}

          {/* Status badge */}
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-volavan-earth/70 backdrop-blur-sm border ${statusBadge.borderColor} rounded-sm`}
            >
              {isOpenCall && <div className="w-1.5 h-1.5 rounded-full bg-volavan-aqua animate-pulse" />}
              <span
                className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] font-light"
                style={{ color: statusBadge.color }}
              >
                {statusBadge.label}
              </span>
            </motion.div>
          )}

          {/* Tagline overlay */}
          {tagline && (
            <div className="absolute inset-0 z-20 flex items-end">
              <div className="absolute inset-0 bg-gradient-to-t from-volavan-earth via-volavan-earth/55 to-transparent" />
              <p
                className="relative font-['Cormorant_Garamond'] text-lg md:text-xl text-volavan-cream italic leading-tight p-6"
                style={{ textShadow: '0 2px 8px rgba(106, 116, 108, 0.8)' }}
              >
                {tagline}
              </p>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <div className="flex justify-between items-end gap-4">
            <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-4xl italic text-volavan-cream leading-[0.95] tracking-tight group-hover:text-volavan-aqua transition-colors duration-500 hyphens-auto">
              {name}
              {year && <span className="text-volavan-cream/40"> {year}</span>}
            </h2>
            <ArrowUpRight
              className="text-volavan-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1 flex-shrink-0"
              size={20}
            />
          </div>

          <p className="font-['Manrope'] text-[13px] uppercase tracking-[0.18em] text-volavan-cream/40 flex items-center gap-2">
            <Calendar size={11} className="opacity-60 shrink-0" />
            {startDate && endDate ? `${formatShortDate(startDate)} — ${formatShortDate(endDate)}` : ''}
          </p>

          {showCallDates && (
            <div className="flex flex-col gap-1 mt-1 pl-3 border-l border-volavan-aqua/20">
              <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.18em] text-volavan-aqua/50">
                <span className="text-volavan-aqua/30">Open Call</span>
                {callOpenDate && (
                  <><span className="mx-1.5 opacity-30">·</span>{formatShortDate(callOpenDate)}</>
                )}
              </p>
              <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.18em] text-volavan-aqua/70">
                <span className="text-volavan-aqua/40">Deadline</span>
                {callCloseDate && (
                  <><span className="mx-1.5 opacity-30">·</span>{formatShortDate(callCloseDate)}</>
                )}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
