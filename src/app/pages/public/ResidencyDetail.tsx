import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowDown, Users, ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { getImageUrl, getStatusLabel, formatDate } from "../../lib/sanity";
import { PortableTextRenderer } from "../../components/PortableTextRenderer";
import { SEOHead } from "../../components/SEOHead";
import { ResidencyEventSchema, BreadcrumbSchema } from "../../components/StructuredData";
import { VideoPlayer } from "../../components/VideoPlayer";
import { useResidency, useSettings } from "../../hooks/useSanity";
import { trackEvent } from "../../hooks/useAnalytics";
import { useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ResidencyDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  
  // Fetch data with SWR
  const { residency, isLoading: loading } = useResidency(slug);
  const { settings } = useSettings();

  // Calculate status from dates (not from Sanity field)
  const getStatus = (edition: any) => {
    if (!edition) return null;
    
    const now = new Date();
    const { callDates, residencyDates } = edition;

    // 1. Check if residency is ongoing (NOW)
    if (residencyDates?.start && residencyDates?.end) {
      const start = new Date(residencyDates.start);
      const end = new Date(residencyDates.end);
      if (now >= start && now <= end) {
        return 'ongoing';
      }
    }

    // 2. Check if open call is active (NOW)
    if (callDates?.open && callDates?.close) {
      const open = new Date(callDates.open);
      const close = new Date(callDates.close);
      if (now >= open && now <= close) {
        return 'open_call';
      }
    }

    // 3. Check if upcoming (call closed, residency in future)
    if (callDates?.close && residencyDates?.start) {
      const callClose = new Date(callDates.close);
      const residencyStart = new Date(residencyDates.start);
      if (callClose < now && now < residencyStart) {
        return 'upcoming';
      }
    }

    // 4. Check if open call soon (no callDates, residency in future)
    if (!callDates && residencyDates?.start) {
      const residencyStart = new Date(residencyDates.start);
      if (now < residencyStart) {
        return 'open_call_soon';
      }
    }

    // 5. All other cases: no status
    return null;
  };

  const currentStatus = getStatus(residency);

  // Track residency view
  useEffect(() => {
    if (residency && residency.program) {
      trackEvent('view_residency', {
        program_name: residency.program.name,
        year: residency.year,
        status: currentStatus,
        location: residency.program.location,
        country: residency.program.country,
      });
    }
  }, [residency, currentStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#6A746C]">
        <div className="w-12 h-12 border-2 border-[#B5DAD9]/30 border-t-[#B5DAD9] rounded-full animate-spin" />
      </div>
    );
  }

  if (!residency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-[#F5F5F0] bg-[#6A746C]">
        <h2 className="font-['Cormorant_Garamond'] text-4xl italic">Residency not found</h2>
        <Link 
          to="/residencies" 
          className="text-[#B5DAD9] hover:text-[#F5F5F0] transition-colors font-['Manrope'] text-xs uppercase tracking-[0.25em] border-b border-[#B5DAD9]/30 pb-1"
        >
          Return to Residencies
        </Link>
      </div>
    );
  }

  const isOpenCall = currentStatus === 'open_call';
  const hasArtists = residency.artists && residency.artists.length > 0;
  
  // Determine if this is a past edition (archive) or current/future
  const isPastEdition = residency.residencyDates?.end ? new Date(residency.residencyDates.end) < new Date() : false;
  
  // Determine current status for badge display - ONLY "Happening Now" for ongoing
  const getStatusBadge = () => {
    if (currentStatus === 'ongoing') {
      return {
        label: 'Happening Now',
        color: '#B5DAD9',
        bgColor: 'bg-[#B5DAD9]/15',
        borderColor: 'border-[#B5DAD9]/40',
      };
    }
    
    if (currentStatus === 'upcoming') {
      return {
        label: 'Upcoming',
        color: '#F5F5F0',
        bgColor: 'bg-[#F5F5F0]/10',
        borderColor: 'border-[#F5F5F0]/30',
      };
    }
    
    if (currentStatus === 'open_call_soon') {
      return {
        label: 'Open Call Soon',
        color: '#B5DAD9',
        bgColor: 'bg-[#B5DAD9]/10',
        borderColor: 'border-[#B5DAD9]/30',
      };
    }
    
    // Past editions: show year badge
    if (isPastEdition && residency.year) {
      return {
        label: `Edition ${residency.year}`,
        color: '#F5F5F0',
        bgColor: 'bg-[#F5F5F0]/5',
        borderColor: 'border-[#F5F5F0]/20',
      };
    }
    
    // No badge for open_call (gets CTA instead) or null
    return null;
  };
  
  const statusBadge = getStatusBadge();
  
  // Extract data from program (content) and edition (dates, status, artists)
  const program = residency.program;
  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-[#F5F5F0] bg-[#6A746C]">
        <h2 className="font-['Cormorant_Garamond'] text-4xl italic">Program data not found</h2>
        <Link 
          to="/residencies" 
          className="text-[#B5DAD9] hover:text-[#F5F5F0] transition-colors font-['Manrope'] text-xs uppercase tracking-[0.25em] border-b border-[#B5DAD9]/30 pb-1"
        >
          Return to Residencies
        </Link>
      </div>
    );
  }

  // Image: edition coverImage (program.coverImage no longer exists in schema)
  const heroImage = residency.coverImage;
  
  // Dates from edition
  const startDate = residency.residencyDates?.start;
  const endDate = residency.residencyDates?.end;
  const callCloseDate = residency.callDates?.close;

  // Check if this is Ca Tru residency (adjust slug as needed)
  const isCaTru = slug?.toLowerCase().includes('ca-tru');

  return (
    <div className="w-full bg-[#6A746C] text-[#F5F5F0] -mt-24">
      
      <SEOHead 
        title={residency.seo?.title || `${program.name} ${residency.year}`}
        description={residency.seo?.description || program.seo?.description}
        url={`/residencies/${slug}`}
        image={residency.coverImage ? getImageUrl(residency.coverImage, 1200, 630) : settings?.defaultSeo?.ogImage?.asset?.url}
      />
      
      <ResidencyEventSchema residency={residency} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Residencies", url: "/residencies" },
          { name: `${program.name} ${residency.year}`, url: `/residencies/${slug}` },
        ]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen min-h-[800px] w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#6A746C]/70 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#6A746C] via-transparent to-[#6A746C]/30 z-10" />
          {heroImage ? (
            <img 
              src={getImageUrl(heroImage, 1920, 1080)} 
              alt={residency.title} 
              className="w-full h-full object-cover opacity-20"
            />
          ) : (
            <div className="w-full h-full bg-[#5E6860]" />
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
            {/* Status Badge - Shows current status (not for completed) */}
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

            {/* Main Title - MASSIVE and centered */}
            <div className="w-full flex flex-col items-center gap-6 py-8">
              <h1 className="font-['Cormorant_Garamond'] text-[20vw] md:text-[16vw] lg:text-[13.5vw] xl:text-[12vw] italic text-[#F5F5F0] leading-[0.9] tracking-tight max-w-[95vw]">
                {program.name}
              </h1>

              {/* Tagline - Right under title */}
              {program.tagline && (
                <p className="font-['Manrope'] text-base md:text-lg lg:text-xl text-[#F5F5F0]/70 max-w-3xl leading-relaxed tracking-wide px-4">
                  {program.tagline}
                </p>
              )}

              {/* Dates + Location - Unified block under tagline */}
              <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-[#F5F5F0]/10 w-full max-w-3xl">
                {/* Dates and Location */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-[#F5F5F0]/70 text-center">
                  <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <Calendar size={14} className="opacity-50" />
                    {(() => {
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      const sameYear = start.getFullYear() === end.getFullYear();
                      
                      const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + (!sameYear ? ` ${start.getFullYear()}` : '');
                      const endStr = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                      
                      return `${startStr} — ${endStr}`;
                    })()}
                  </span>
                  <span className="hidden md:inline w-px h-3 bg-[#F5F5F0]/20"></span>
                  <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <MapPin size={14} className="opacity-50" />
                    {program.location}, {program.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Disciplines - Subtle */}
            {program.disciplines && program.disciplines.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                {program.disciplines.slice(0, 3).map((discipline, i) => (
                  <span key={i} className="font-['Manrope'] text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] text-[#F5F5F0]/50 whitespace-nowrap">
                    {discipline}
                  </span>
                ))}
              </div>
            )}

            {/* Current Edition Button - Only for past editions */}
            {isPastEdition && (() => {
              const currentEdition = program.otherEditions?.find((ed) => {
                if (!ed) return false;
                const edStatus = getStatus(ed);
                return edStatus === 'open_call' || edStatus === 'ongoing' || edStatus === 'upcoming' || edStatus === 'open_call_soon';
              });
              
              if (currentEdition && currentEdition.slug) {
                return (
                  <div className="pt-4">
                    <Link
                      to={`/residencies/${currentEdition.slug}`}
                      className="group inline-flex items-center gap-2 px-5 py-2 bg-[#B5DAD9]/10 hover:bg-[#B5DAD9]/20 border border-[#B5DAD9]/30 hover:border-[#B5DAD9]/60 rounded-full transition-all duration-300"
                    >
                      <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] text-[#B5DAD9]">
                        View Current Edition
                      </span>
                      <ArrowUpRight size={14} className="text-[#B5DAD9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                );
              }
              return null;
            })()}

          </motion.div>

          {/* INFO BLOCK - At bottom of hero, clean horizontal bar - Only Apply Button if open */}
          {isOpenCall && (
            <div className="absolute bottom-16 left-0 right-0 w-full max-w-5xl mx-auto px-6">
              <div className="border-t border-b border-[#F5F5F0]/10 py-5 flex justify-center items-center">
                <Link 
                  to="/candidature"
                  className="group flex items-center gap-2 text-[#B5DAD9] hover:text-[#F5F5F0] transition-colors"
                >
                  <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em]">Apply Now</span>
                  <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => {
            const element = document.getElementById('content-start');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="absolute bottom-6 z-20 flex flex-col items-center gap-2 text-[#F5F5F0]/40 hover:text-[#B5DAD9] transition-colors cursor-pointer"
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

      {/* 3. NARRATIVE SECTION */}
      <section id="content-start" className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
        
        {/* Sticky Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-3 relative">
          <div className="sticky top-32 flex flex-col gap-8 opacity-40">
            <Link to="/residencies" className="flex items-center gap-3 hover:opacity-100 transition-opacity group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em]">All Residencies</span>
            </Link>
            <div className="w-px h-24 bg-gradient-to-b from-[#F5F5F0] to-transparent" />
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-7 space-y-20">
          
          {/* VIDEO SECTION - Only for Ca Tru */}
          {isCaTru && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
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

          {/* 1. DESCRIPTION SECTION - Only for current/future editions */}
          {!isPastEdition && program.concept && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl italic text-[#F5F5F0] mb-8 pt-12 md:pt-16">
                Concept
              </h2>
              <PortableTextRenderer value={program.concept} />
            </motion.div>
          )}

          {/* 2. WHAT WE OFFER SECTION - Only for current/future editions */}
          {!isPastEdition && program.whatWeOffer && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`${!isPastEdition && program.concept ? 'border-t border-[#F5F5F0]/10 pt-16' : ''}`}
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-[#B5DAD9] mb-8">
                What We Offer
              </h2>
              <PortableTextRenderer value={program.whatWeOffer} />
              
              {program.feeAmount !== null && program.feeAmount !== undefined && (
                <div className="mt-8 p-6 bg-[#F5F5F0]/5 border border-[#F5F5F0]/10 rounded-sm">
                  <div className="flex items-baseline gap-4">
                    <span className="font-['Cormorant_Garamond'] text-3xl italic text-[#B5DAD9]">
                      €{program.feeAmount}
                    </span>
                    {program.feeIncludes && (
                      <span className="font-['Manrope'] text-sm text-[#F5F5F0]/60">
                        {program.feeIncludes}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. GALLERY */}
          {residency.gallery && residency.gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {residency.gallery.map((image, i) => (
                <div key={i} className="aspect-square overflow-hidden group/gal relative">
                  <div className="absolute inset-0 bg-[#6A746C]/20 group-hover/gal:bg-transparent z-10 transition-colors duration-500" />
                  <img 
                    src={getImageUrl(image, 400, 400)} 
                    alt={image.caption || `Gallery image ${i + 1}`}
                    className="w-full h-full object-cover grayscale group-hover/gal:grayscale-0 transition-all duration-700 transform group-hover/gal:scale-105" 
                  />
                </div>
              ))}
            </div>
          )}

          {/* 4. STRUCTURE SECTION - Only for current/future editions */}
          {!isPastEdition && program.structure && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t border-[#F5F5F0]/10 pt-16"
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-[#F5F5F0] mb-8">
                How It Works
              </h2>
              <PortableTextRenderer value={program.structure} />
            </motion.div>
          )}

          {/* 5. ARTISTS SECTION - Always show if artists exist */}
          {hasArtists && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t border-[#F5F5F0]/10 pt-16"
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-[#B5DAD9] mb-12">
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
                      <div className="aspect-square overflow-hidden rounded-sm bg-[#6A746C]/20 relative">
                        {artist.photo ? (
                          <img 
                            src={getImageUrl(artist.photo, 600, 600)} 
                            alt={artist.name}
                            className="w-full h-full object-cover opacity-30 group-hover:opacity-70 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-['Cormorant_Garamond'] text-6xl italic text-[#F5F5F0]/30">
                              {artist.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-['Cormorant_Garamond'] text-2xl italic text-[#F5F5F0]">
                          {artist.name}
                        </h3>
                        <div className="flex flex-col gap-1">
                          {artist.nationality && (
                            <p className="font-['Manrope'] text-xs uppercase tracking-[0.2em] text-[#F5F5F0]/50">
                              {artist.nationality}
                            </p>
                          )}
                          {artist.disciplines && artist.disciplines.length > 0 && (
                            <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.15em] text-[#B5DAD9]/50">
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

          {/* 6. APPLICATION SECTION - Only for open calls */}
          {isOpenCall && program.requirements && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t border-[#F5F5F0]/10 pt-16"
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-[#B5DAD9] mb-8">
                Application Requirements
              </h2>
              {program.applicationIntro && (
                <p className="font-['Manrope'] text-base text-[#F5F5F0]/70 mb-8 leading-relaxed whitespace-pre-line">
                  {program.applicationIntro}
                </p>
              )}
              <PortableTextRenderer value={program.requirements} />
              
              {callCloseDate && (
                <div className="mt-8 p-6 bg-[#B5DAD9]/5 border border-[#B5DAD9]/20 rounded-sm">
                  <p className="font-['Manrope'] text-sm text-[#F5F5F0]/70">
                    <span className="text-[#B5DAD9]">Deadline: </span>
                    {formatDate(callCloseDate)}
                  </p>
                </div>
              )}
              
              <div className="mt-12 flex justify-center">
                <Link 
                  to="/candidature"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#B5DAD9] hover:bg-[#F5F5F0] text-[#6A746C] rounded-sm transition-all duration-300 font-['Manrope'] text-sm uppercase tracking-[0.2em]"
                >
                  Apply Now
                  <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* 7. OTHER EDITIONS */}
          {program.otherEditions && program.otherEditions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t border-[#F5F5F0]/10 pt-16"
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-[#F5F5F0] mb-8">
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
                          <span className="font-['Cormorant_Garamond'] text-xl italic text-[#F5F5F0]">
                            {edition.year}
                          </span>
                          {edition.artistsCount && (
                            <span className="font-['Manrope'] text-xs text-[#F5F5F0]/50">
                              {edition.artistsCount} {edition.artistsCount === 1 ? 'artist' : 'artists'}
                            </span>
                          )}
                        </div>
                        {edition.startDate && edition.endDate && (
                          <span className="font-['Manrope'] text-xs text-[#B5DAD9]/70">
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
      </section>

      {/* FINAL CTA SECTION - Always visible at the end */}
      <section className="w-full bg-[#6A746C] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center gap-8"
          >
            {isOpenCall ? (
              <>
                {/* Open Call CTA */}
                <Link
                  to="/candidature"
                  onClick={() => {
                    trackEvent('cta_apply_bottom', {
                      program_name: program.name,
                      year: residency.year,
                      location: 'residency_detail_bottom'
                    });
                  }}
                  className="group w-full max-w-md px-12 py-6 bg-[#B5DAD9] hover:bg-[#F5F5F0] text-[#6A746C] rounded-sm transition-all duration-300 flex items-center justify-center gap-4"
                >
                  <span className="font-['Manrope'] text-base md:text-lg uppercase tracking-[0.25em] font-semibold">
                    {t.residencies.applyNow}
                  </span>
                  <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>
                {callCloseDate && (
                  <p className="font-['Manrope'] text-sm text-[#F5F5F0]/60 text-center">
                    <span className="text-[#B5DAD9]">Deadline: </span>
                    {formatDate(callCloseDate)}
                  </p>
                )}
              </>
            ) : (
              <>
                {/* No Open Call */}
                <div className="w-full max-w-md px-12 py-6 bg-[#F5F5F0]/5 border-2 border-[#F5F5F0]/20 text-[#F5F5F0]/50 rounded-sm flex items-center justify-center cursor-not-allowed">
                  <span className="font-['Manrope'] text-base md:text-lg uppercase tracking-[0.25em] font-semibold text-center">
                    {t.residencies.noOpenCall}
                  </span>
                </div>
                <p className="font-['Manrope'] text-sm text-[#F5F5F0]/40 text-center max-w-md">
                  Stay tuned for future opportunities
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}