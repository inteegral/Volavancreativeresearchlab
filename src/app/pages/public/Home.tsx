import { useMemo } from "react";
import { SEOHead } from "../../components/SEOHead";
import { OrganizationSchema } from "../../components/StructuredData";
import { useHome, useAllPrograms, useJournalContent, useSettings } from "../../hooks/useSanity";
import { HomeHero } from "./home/HomeHero";
import { UpcomingResidenciesSection } from "./home/UpcomingResidenciesSection";
import { JournalSection } from "./home/JournalSection";

export default function Home() {
  const { home: homeData, isError: homeError } = useHome();
  const { programs, isLoading: programsLoading, isError: programsError } = useAllPrograms();
  const { content: journalContent, isLoading: journalLoading } = useJournalContent();
  const { settings } = useSettings();

  const journalPosts = useMemo(() => journalContent.slice(0, 3), [journalContent]);

  if (homeError || programsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-volavan-earth text-volavan-cream/40">
        <p className="font-['Manrope'] text-xs uppercase tracking-[0.2em]">
          Unable to load content — please try again later
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 py-12 text-center">
      <SEOHead
        url="/"
        description="VOLAVAN is a creative research lab in rural Friuli. Artist residencies, workshops, and collaborative projects immersed in nature."
        image={settings?.defaultSeo?.ogImage?.asset?.url}
      />
      <OrganizationSchema />

      <HomeHero homeData={homeData} />

      {/* Separator */}
      <div className="w-full max-w-md mx-auto my-[50px]">
        <div className="h-px bg-volavan-cream/20"></div>
      </div>

      <UpcomingResidenciesSection programs={programs} programsLoading={programsLoading} />

      {/* Visual Break */}
      <div className="w-full max-w-2xl mx-auto my-[30px] flex items-center justify-center gap-8 px-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-volavan-cream/20 to-transparent"></div>
        <div className="w-2 h-2 rounded-full bg-volavan-aqua/40"></div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-volavan-cream/20 to-transparent"></div>
      </div>

      <JournalSection
        journalPosts={journalPosts}
        journalLoading={journalLoading}
        homeData={homeData}
      />
    </div>
  );
}
