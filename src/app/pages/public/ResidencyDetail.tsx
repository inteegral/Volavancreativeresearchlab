import { useParams, Link } from "react-router";
import { useEffect } from "react";
import { getImageUrl } from "../../lib/sanity";
import { SEOHead } from "../../components/SEOHead";
import { ResidencyEventSchema, BreadcrumbSchema } from "../../components/StructuredData";
import { useResidency, useSettings } from "../../hooks/useSanity";
import { trackEvent } from "../../hooks/useAnalytics";
import { useLanguage } from "../../contexts/LanguageContext";
import { ResidencyHero } from "./residency/ResidencyHero";
import { ResidencyContent } from "./residency/ResidencyContent";
import { ResidencyCTA } from "./residency/ResidencyCTA";
import { getStatus, getStatusBadge } from "../../lib/residency-status";

export default function ResidencyDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { residency, isLoading } = useResidency(slug);
  const { settings } = useSettings();

  const currentStatus = getStatus(residency);
  const isPastEdition = currentStatus === 'completed';

  useEffect(() => {
    if (residency?.program) {
      trackEvent('view_residency', {
        program_name: residency.program.name,
        year: residency.year,
        status: currentStatus,
        location: residency.program.location,
        country: residency.program.country,
      });
    }
  }, [residency, currentStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-volavan-earth">
        <div className="w-12 h-12 border-2 border-volavan-aqua/30 border-t-volavan-aqua rounded-full animate-spin" />
      </div>
    );
  }

  if (!residency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-volavan-cream bg-volavan-earth">
        <h2 className="font-['Cormorant_Garamond'] text-4xl italic">Residency not found</h2>
        <Link to="/residencies" className="text-volavan-aqua hover:text-volavan-cream transition-colors font-['Manrope'] text-xs uppercase tracking-[0.25em] border-b border-volavan-aqua/30 pb-1">
          Return to Residencies
        </Link>
      </div>
    );
  }

  const program = residency.program;
  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-volavan-cream bg-volavan-earth">
        <h2 className="font-['Cormorant_Garamond'] text-4xl italic">Program data not found</h2>
        <Link to="/residencies" className="text-volavan-aqua hover:text-volavan-cream transition-colors font-['Manrope'] text-xs uppercase tracking-[0.25em] border-b border-volavan-aqua/30 pb-1">
          Return to Residencies
        </Link>
      </div>
    );
  }

  const isOpenCall = currentStatus === 'open_call';
  const isOpenSoon = currentStatus === 'open_soon';
  const statusBadge = getStatusBadge(currentStatus);
  const callOpenDate = residency.callDates?.open;
  const callCloseDate = residency.callDates?.close;

  return (
    <div className="w-full bg-volavan-earth text-volavan-cream -mt-24 overflow-x-hidden">
      <SEOHead
        title={residency.seo?.title || `${program.name} ${residency.year}`}
        description={residency.seo?.description || program.seo?.description}
        url={`/residencies/${slug}`}
        image={residency.coverImage ? getImageUrl(residency.coverImage, 1200, 630) : settings?.defaultSeo?.ogImage?.asset?.url}
      />
      <ResidencyEventSchema
        name={`${program.name} ${residency.year}`}
        description={residency.seo?.description || program.seo?.description || program.tagline || ''}
        startDate={residency.residencyDates?.start || ''}
        endDate={residency.residencyDates?.end || ''}
        location={program.location && program.country ? `${program.location}, ${program.country}` : undefined}
        image={residency.coverImage ? getImageUrl(residency.coverImage, 1200, 630) : undefined}
        url={`/residencies/${slug}`}
        applicationDeadline={residency.callDates?.close}
        capacity={residency.capacity}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Residencies", url: "/residencies" },
          { name: `${program.name} ${residency.year}`, url: `/residencies/${slug}` },
        ]}
      />

      <ResidencyHero
        residency={residency}
        program={program}
        currentStatus={currentStatus}
        statusBadge={statusBadge}
        isOpenCall={isOpenCall}
        isPastEdition={isPastEdition}
      />

      <ResidencyContent
        residency={residency}
        program={program}
        slug={slug!}
        isOpenCall={isOpenCall}
        isOpenSoon={isOpenSoon}
        callOpenDate={callOpenDate}
        callCloseDate={callCloseDate}
      />

      <ResidencyCTA
        residency={residency}
        program={program}
        isOpenCall={isOpenCall}
        isOpenSoon={isOpenSoon}
        callOpenDate={callOpenDate}
        callCloseDate={callCloseDate}
      />
    </div>
  );
}
