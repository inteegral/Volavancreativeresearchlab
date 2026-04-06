import { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SEOHead } from "../../components/SEOHead";
import { OrganizationSchema } from "../../components/StructuredData";
import { SanityImage } from "../../components/SanityImage";
import { getImageUrl, calculateResidencyStatus } from "../../lib/sanity";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAbout, useAllPrograms, useJournalContent, useSettings } from "../../hooks/useSanity";

export default function About() {
  const { language } = useLanguage();
  
  // Fetch data with SWR
  const { about: aboutData, isLoading: aboutLoading } = useAbout();
  const { programs, isLoading: programsLoading } = useAllPrograms();
  const { content: journalContent, isLoading: journalLoading } = useJournalContent();
  const { settings } = useSettings();

  // Derived state with memoization
  const upcomingResidencies = useMemo(() => {
    
    return programs
      .filter(program => {
        if (!program.editions || program.editions.length === 0) return false;
        
        // Calculate dynamic status for each edition (same as Home)
        return program.editions.some(edition => {
          const calculatedStatus = calculateResidencyStatus(edition);
          return calculatedStatus === 'upcoming' || calculatedStatus === 'open_call' || calculatedStatus === 'open_call_soon';
        });
      })
      .slice(0, 2);
  }, [programs]);

  const journalPosts = useMemo(() => {
    return journalContent.slice(0, 3);
  }, [journalContent]);

  const loading = aboutLoading || programsLoading || journalLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-volavan-aqua/30 border-t-volavan-aqua rounded-full animate-spin" />
      </div>
    );
  }

  // Split mission text into paragraphs
  const missionText = aboutData?.mission || '';
  
  // Debug: log the mission text to see what we're getting
  
  const paragraphs = missionText
    .split(/\n+/) // Split on one or more newlines
    .map(p => p.trim())
    .filter(p => p.length > 0);
  

  return (
    <div className="min-h-screen flex flex-col px-6 pt-32 pb-20">
      <SEOHead 
        title={aboutData?.seo?.title || aboutData?.title || "About"}
        description={aboutData?.seo?.description || aboutData?.mission || "Learn more about Volavan"}
        url="/about"
        image={aboutData?.coverImage ? getImageUrl(aboutData.coverImage, 1200, 630) : settings?.defaultSeo?.ogImage?.asset?.url}
      />
      <OrganizationSchema />

      {/* Mission Text Section */}
      <div className="flex items-center justify-center mb-[150px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[300px] md:max-w-[614px] w-full text-right flex flex-col gap-8 md:gap-8"
        >
          {paragraphs.map((paragraph, index) => {
            // Apply alternating pattern: large italic white → smaller regular aqua → large italic white → smaller regular aqua
            const pattern = index % 2;
            
            if (pattern === 0) {
              // Large, Italic, White (F5F5F0)
              return (
                <p key={index} className="font-['Cormorant_Garamond'] text-2xl md:text-4xl leading-tight text-volavan-cream italic hyphens-auto">
                  {paragraph}
                </p>
              );
            } else {
              // Smaller, Regular, Aqua (B5DAD9)
              return (
                <p key={index} className="font-['Cormorant_Garamond'] text-lg md:text-2xl leading-relaxed text-volavan-aqua hyphens-auto">
                  {paragraph}
                </p>
              );
            }
          })}
        </motion.div>
      </div>

      {/* Separator Line */}
      <div className="w-full max-w-md mx-auto my-[50px]">
        <div className="h-px bg-volavan-cream/20"></div>
      </div>

      {/* Upcoming Residencies Section */}
      <div className="w-full max-w-[614px] mx-auto mb-[150px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-16"
        >
          {/* Section Title */}
          <div className="text-center space-y-4">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-volavan-cream italic">
              Upcoming Residencies
            </h2>
          </div>

          {/* Residencies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingResidencies.length === 0 ? (
              <div className="col-span-2 text-center">
                <p className="font-['Manrope'] text-sm md:text-lg leading-relaxed text-volavan-cream/60 max-w-lg mx-auto">
                  No upcoming residencies at the moment.
                </p>
              </div>
            ) : (
              upcomingResidencies.map((program) => {
                // Get the latest edition
                const latestEdition = program.editions?.[0];
                if (!latestEdition) return null;

                // Image: edition coverImage only (no fallback to program)
                const coverImage = latestEdition.coverImage;

                return (
                  <Link
                    key={program._id}
                    to={`/residencies/${latestEdition.slug}`}
                    className="group relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <SanityImage
                        image={coverImage}
                        alt={program.name}
                        width={800}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="w-full h-full group-hover:scale-105 transition-transform duration-700 saturate-[0.45] opacity-65"
                      />
                      
                      {/* Gradient overlay towards bottom */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-volavan-earth/60 pointer-events-none"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3 bg-volavan-earth/50 backdrop-blur-sm">
                      <h3 className="font-['Manrope'] text-xl uppercase tracking-[0.2em] text-volavan-cream text-left">
                        {program.name}
                      </h3>
                      
                      {/* Tagline */}
                      {program.tagline && (
                        <p className="font-['Cormorant_Garamond'] text-lg italic text-volavan-aqua text-left">
                          {program.tagline}
                        </p>
                      )}
                      
                      {/* Dates from latest edition */}
                      {latestEdition.startDate && latestEdition.endDate && (
                        <div className="flex items-center gap-2 text-xs text-volavan-aqua font-['Manrope'] uppercase tracking-wide">
                          <span>{new Date(latestEdition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>—</span>
                          <span>{new Date(latestEdition.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}

                      {/* Location */}
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

          {/* View All Button */}
          <div className="flex justify-center mt-12">
            <Link
              to="/residencies"
              className="group flex items-center justify-center gap-4 px-8 py-4 rounded-full border border-volavan-cream/30 hover:border-volavan-cream/80 hover:bg-volavan-cream/5 transition-all duration-500"
            >
              <span className="font-['Manrope'] text-xs uppercase tracking-[0.25em] text-volavan-cream opacity-90 group-hover:opacity-100 transition-opacity">
                View All Residencies
              </span>
              <ArrowUpRight size={16} className="text-volavan-cream opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Visual Break - Organic Divider */}
      <div className="w-full max-w-2xl mx-auto my-[30px] flex items-center justify-center gap-8 px-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-volavan-cream/20 to-transparent"></div>
        <div className="w-2 h-2 rounded-full bg-volavan-aqua/40"></div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-volavan-cream/20 to-transparent"></div>
      </div>

      {/* Journal Section */}
      {journalPosts.length > 0 && (
        <div className="w-full max-w-[922px] mx-auto mb-[100px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-16"
          >
            {/* Section Title */}
            <div className="text-center space-y-4">
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-volavan-cream italic">
                Latest from the Journal
              </h2>
              <p className="font-['Manrope'] text-xs md:text-sm text-volavan-cream/60 max-w-lg mx-auto">
                Reflections, documentation, and insights from our residencies
              </p>
            </div>

            {/* Asymmetric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Featured Article (2/3) */}
              {journalPosts[0] && (
                <Link
                  to={`/journal/${journalPosts[0].slug}`}
                  className="group md:col-span-2 relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500"
                >
                  {/* Image */}
                  {(() => {
                    const imageSource = journalPosts[0]._type === 'videoPost' ? journalPosts[0].thumbnail : journalPosts[0].coverImage;
                    const imageUrl = getImageUrl(imageSource, 1000, 600);
                    return imageUrl ? (
                      <div className="aspect-[16/9] overflow-hidden bg-volavan-earth">
                        <img
                          src={imageUrl}
                          alt={journalPosts[0].title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : null;
                  })()}

                  {/* Content */}
                  <div className="p-8 space-y-4 bg-volavan-earth/30 backdrop-blur-sm">
                    {/* Date */}
                    {journalPosts[0].publishedAt && (
                      <time className="font-['Manrope'] text-xs uppercase tracking-wider text-volavan-aqua/80">
                        {new Date(journalPosts[0].publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </time>
                    )}

                    {/* Title */}
                    <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl leading-tight text-volavan-cream group-hover:text-volavan-aqua transition-colors">
                      {journalPosts[0].title}
                    </h3>

                    {/* Excerpt */}
                    {journalPosts[0].excerpt && (
                      <p className="font-['Manrope'] text-sm md:text-base leading-relaxed text-volavan-cream/70 line-clamp-3">
                        {journalPosts[0].excerpt}
                      </p>
                    )}

                    {/* Type Badge */}
                    {journalPosts[0]._type === 'videoPost' && (
                      <div className="inline-block px-2 py-1 rounded-sm bg-volavan-aqua/10 border border-volavan-aqua/20 text-volavan-aqua text-xs font-['Manrope'] uppercase tracking-wider">
                        Video
                      </div>
                    )}
                  </div>
                </Link>
              )}

              {/* Side Articles (1/3) - Stacked */}
              <div className="md:col-span-1 flex flex-col gap-6">
                {journalPosts.slice(1, 3).map((post) => {
                  const imageSource = post._type === 'videoPost' ? post.thumbnail : post.coverImage;
                  const imageUrl = getImageUrl(imageSource, 400, 300);

                  return (
                    <Link
                      key={post._id}
                      to={`/journal/${post.slug}`}
                      className="group relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500 flex-1"
                    >
                      {/* Image */}
                      {imageUrl && (
                        <div className="aspect-[4/3] overflow-hidden bg-volavan-earth">
                          <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5 space-y-2 bg-volavan-earth/30 backdrop-blur-sm">
                        {/* Date */}
                        {post.publishedAt && (
                          <time className="font-['Manrope'] text-xs uppercase tracking-wider text-volavan-aqua/80">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </time>
                        )}

                        {/* Title */}
                        <h3 className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-tight text-volavan-cream group-hover:text-volavan-aqua transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Type Badge */}
                        {post._type === 'videoPost' && (
                          <div className="inline-block px-2 py-1 rounded-sm bg-volavan-aqua/10 border border-volavan-aqua/20 text-volavan-aqua text-xs font-['Manrope'] uppercase tracking-wider">
                            Video
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-12">
              <Link
                to="/journal"
                className="group flex items-center justify-center gap-4 px-8 py-4 rounded-full border border-volavan-cream/30 hover:border-volavan-cream/80 hover:bg-volavan-cream/5 transition-all duration-500"
              >
                <span className="font-['Manrope'] text-xs uppercase tracking-[0.25em] text-volavan-cream opacity-90 group-hover:opacity-100 transition-opacity">
                  View All Journal Entries
                </span>
                <ArrowUpRight size={16} className="text-volavan-cream opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}