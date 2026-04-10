import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { getImageUrl, formatDate } from "../../../lib/sanity";
import { PortableTextRenderer } from "../../../components/PortableTextRenderer";
import { VideoPlayer } from "../../../components/VideoPlayer";
import type { SanityResidency, SanityProgram } from "../../../lib/sanity";

// Renders feeIncludes plain text with section headings and bullet-style items
function FeeIncludesText({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { key++; continue; }

    // ALL-CAPS heading (e.g. "APPLICATION & PAYMENT")
    if (/^[A-Z][A-Z &/]+$/.test(line)) {
      elements.push(
        <p key={key++} className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua/60 mt-8 mb-2">
          {line}
        </p>
      );
    // "Label: rest of text" line
    } else if (/^[A-Z][^.]+:\s/.test(line) || /^[A-Z][^.]+:$/.test(line)) {
      const colonIdx = line.indexOf(':');
      const label = line.slice(0, colonIdx);
      const rest = line.slice(colonIdx + 1).trim();
      elements.push(
        <p key={key++} className="font-['Manrope'] text-sm text-volavan-cream/80 leading-relaxed mt-3">
          <span className="text-volavan-cream font-medium">{label}:</span>
          {rest && ` ${rest}`}
        </p>
      );
    // Normal paragraph
    } else {
      elements.push(
        <p key={key++} className="font-['Manrope'] text-sm text-volavan-cream/60 leading-relaxed mt-2">
          {line}
        </p>
      );
    }
  }

  return <div className="space-y-0">{elements}</div>;
}

interface ResidencyContentProps {
  residency: SanityResidency;
  program: SanityProgram;
  slug: string;
  isOpenCall: boolean;
  isPastEdition: boolean;
  isCaTru: boolean;
  callCloseDate?: string;
}

type TabId = 'overview' | 'structure' | 'artists' | 'apply' | 'accommodation';

export function ResidencyContent({
  residency,
  program,
  slug,
  isOpenCall,
  isPastEdition,
  isCaTru,
  callCloseDate,
}: ResidencyContentProps) {
  const hasArtists = residency.artists && residency.artists.length > 0;
  const hasStructure = !!(residency as any).structure;
  const hasApply = isOpenCall && !!program.requirements;
  const hasAccommodation = !!residency.location;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    ...(hasStructure ? [{ id: 'structure' as TabId, label: 'Structure' }] : []),
    ...(hasArtists ? [{ id: 'artists' as TabId, label: 'Artists' }] : []),
    ...(hasAccommodation ? [{ id: 'accommodation' as TabId, label: 'Accommodation' }] : []),
    ...(hasApply ? [{ id: 'apply' as TabId, label: 'Apply' }] : []),
  ];

  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <section id="content-start" className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative overflow-x-hidden">

      {/* Sticky Sidebar */}
      <div className="hidden lg:block lg:col-span-3 relative">
        <div className="sticky top-32 flex flex-col gap-8 opacity-40">
          <Link to="/residencies" className="flex items-center gap-3 hover:opacity-100 transition-opacity group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em]">All Residencies</span>
          </Link>
          <div className="w-px h-24 bg-gradient-to-b from-volavan-cream to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-7">

        {/* Tab Nav */}
        {tabs.length > 1 && (
          <div className="flex gap-8 border-b border-volavan-cream/10 mb-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-['Manrope'] text-[12px] uppercase tracking-[0.25em] transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-volavan-cream'
                    : 'text-volavan-cream/30 hover:text-volavan-cream/60'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-volavan-cream"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-20">

            {/* VIDEO - Ca Tru only */}
            {isCaTru && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <div className="aspect-video w-full rounded-sm overflow-hidden max-w-3xl">
                  <VideoPlayer
                    videoId="41z5HiWIAOs"
                    startTime={227}
                    endTime={281}
                    autoplay={true}
                    playerId={`youtube-player-${slug}`}
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Concept */}
            {program.concept && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-volavan-cream mb-8">
                  Concept
                </h2>
                <PortableTextRenderer value={program.concept} />
              </motion.div>
            )}

            {/* What We Offer */}
            {program.whatWeOffer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={program.concept ? 'border-t border-volavan-cream/10 pt-16' : ''}
              >
                <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-aqua mb-8">
                  What We Offer
                </h2>
                <PortableTextRenderer value={program.whatWeOffer} />
              </motion.div>
            )}

            {/* Logistics & Fees */}
            {(residency.feeAmount !== null && residency.feeAmount !== undefined) || residency.feeIncludes ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="border-t border-volavan-cream/10 pt-16"
              >
                <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-aqua mb-8">
                  Logistics & Fees
                </h2>
                {residency.feeAmount !== null && residency.feeAmount !== undefined && (
                  <div className="mb-8 inline-flex items-baseline gap-3 px-6 py-4 bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm">
                    <span className="font-['Cormorant_Garamond'] text-3xl italic text-volavan-aqua">
                      €{residency.feeAmount}
                    </span>
                    <span className="font-['Manrope'] text-xs uppercase tracking-[0.15em] text-volavan-cream/40">
                      participation fee
                    </span>
                  </div>
                )}
                {residency.feeIncludes && (
                  <FeeIncludesText text={residency.feeIncludes} />
                )}
              </motion.div>
            ) : null}

            {/* Gallery */}
            {residency.gallery && residency.gallery.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {residency.gallery.map((image, i) => (
                    <div key={i} className="aspect-square overflow-hidden group/gal relative">
                      <div className="absolute inset-0 bg-volavan-earth/20 group-hover/gal:bg-transparent z-10 transition-colors duration-500" />
                      <img
                        src={getImageUrl(image, 400, 400)}
                        alt={image.caption || `Gallery image ${i + 1}`}
                        className="w-full h-full object-cover grayscale group-hover/gal:grayscale-0 transition-all duration-700 transform group-hover/gal:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Other Editions */}
            {program.otherEditions && program.otherEditions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="border-t border-volavan-cream/10 pt-16"
              >
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-volavan-cream mb-8">
                  Other Editions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {program.otherEditions.map((edition, i) => {
                    if (!edition || !edition.slug) return null;
                    return (
                      <Link
                        key={edition.slug || i}
                        to={`/residencies/${edition.slug}`}
                        className="group flex flex-col gap-3 hover:opacity-80 transition-opacity"
                      >
                        {edition.coverImage && (
                          <div className="aspect-[4/3] overflow-hidden rounded-sm">
                            <img
                              src={getImageUrl(edition.coverImage, 800, 600)}
                              alt={`${program.name} ${edition.year}`}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-['Cormorant_Garamond'] text-xl italic text-volavan-cream">
                              {edition.year}
                            </span>
                            {edition.artistsCount && (
                              <span className="font-['Manrope'] text-xs text-volavan-cream/50">
                                {edition.artistsCount} {edition.artistsCount === 1 ? 'artist' : 'artists'}
                              </span>
                            )}
                          </div>
                          {edition.startDate && edition.endDate && (
                            <span className="font-['Manrope'] text-xs text-volavan-aqua/70">
                              {new Date(edition.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — {new Date(edition.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Structure */}
        {activeTab === 'structure' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <PortableTextRenderer value={(residency as any).structure} />
          </motion.div>
        )}

        {/* Artists */}
        {activeTab === 'artists' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-aqua mb-12">
              {isPastEdition ? 'Selected Artists' : 'Meet the Artists'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {residency.artists?.map((item: any, i: number) => {
                const artist = item.artist || item;
                if (!artist) return null;
                return (
                  <Link
                    key={artist._id || i}
                    to={`/artists/${artist.slug}`}
                    className="group flex flex-col gap-4 transition-opacity"
                  >
                    <div className="aspect-square overflow-hidden rounded-sm bg-volavan-earth/20 relative">
                      {artist.photo ? (
                        <img
                          src={getImageUrl(artist.photo, 600, 600)}
                          alt={artist.name}
                          className="w-full h-full object-cover opacity-30 group-hover:opacity-70 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-['Cormorant_Garamond'] text-6xl italic text-volavan-cream/30">
                            {artist.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream">
                        {artist.name}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {artist.nationality && (
                          <p className="font-['Manrope'] text-xs uppercase tracking-[0.2em] text-volavan-cream/50">
                            {artist.nationality}
                          </p>
                        )}
                        {artist.disciplines && artist.disciplines.length > 0 && (
                          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] text-volavan-aqua/50">
                            {artist.disciplines.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Accommodation */}
        {activeTab === 'accommodation' && residency.location && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-12">

            {residency.location.description && (
              <PortableTextRenderer value={residency.location.description} />
            )}

            {residency.location.gallery && residency.location.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {residency.location.gallery.filter((img: any) => img?.asset?._ref).map((image, i) => (
                  <div key={i} className="aspect-square overflow-hidden group/loc relative">
                    <div className="absolute inset-0 bg-volavan-earth/20 group-hover/loc:bg-transparent z-10 transition-colors duration-500" />
                    <img
                      src={getImageUrl(image, 600, 600)}
                      alt={image.caption || `${residency.location!.name} ${i + 1}`}
                      className="w-full h-full object-cover grayscale group-hover/loc:grayscale-0 transition-all duration-700 transform group-hover/loc:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        )}

        {/* Apply */}
        {activeTab === 'apply' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-aqua mb-8">
              Application Requirements
            </h2>
            {program.applicationIntro && (
              <p className="font-['Manrope'] text-base text-volavan-cream/70 mb-8 leading-relaxed whitespace-pre-line">
                {program.applicationIntro}
              </p>
            )}
            <PortableTextRenderer value={program.requirements} />
          </motion.div>
        )}

      </div>
    </section>
  );
}
