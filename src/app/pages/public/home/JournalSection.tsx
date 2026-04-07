import { Link } from "react-router";
import { motion } from "motion/react";
import { getYouTubeThumbnail } from "../../../lib/sanity";
import { VLink } from "../../../components/ui/VButton";
import { SanityImage } from "../../../components/SanityImage";
import { SkeletonJournalFeatured, SkeletonJournalSide } from "../../../components/ui/skeleton";
import type { SanityJournalContent, SanityHome } from "../../../lib/sanity";

interface JournalSectionProps {
  journalPosts: SanityJournalContent[];
  journalLoading: boolean;
  homeData?: SanityHome | null;
}

export function JournalSection({ journalPosts, journalLoading, homeData }: JournalSectionProps) {
  if (journalPosts.length === 0 && !journalLoading) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mb-[100px] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="space-y-16"
      >
        <div className="text-center space-y-4">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-volavan-cream italic">
            {homeData?.journalSectionTitle || 'Latest from the Journal'}
          </h2>
          <p className="font-['Manrope'] text-xs md:text-sm text-volavan-cream/60 max-w-lg mx-auto">
            {homeData?.journalSectionSubtitle || 'Reflections, documentation, and insights from our residencies'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journalLoading ? (
            <>
              <SkeletonJournalFeatured />
              <div className="md:col-span-1 flex flex-col gap-6">
                <SkeletonJournalSide />
                <SkeletonJournalSide />
              </div>
            </>
          ) : (
            <>
              {/* Featured Article (2/3) */}
              {journalPosts[0] && (() => {
                const isVideo = journalPosts[0]._type === 'videoPost' || journalPosts[0].videoUrl;
                const thumbnailUrl = isVideo && journalPosts[0].videoUrl
                  ? getYouTubeThumbnail(journalPosts[0].videoUrl)
                  : null;
                const imageSource = journalPosts[0]._type === 'videoPost' ? journalPosts[0].thumbnail : journalPosts[0].coverImage;

                return (
                  <Link
                    to={`/journal/${journalPosts[0].slug}`}
                    className="group md:col-span-2 relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={journalPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                        />
                      ) : (
                        <SanityImage
                          image={imageSource}
                          alt={journalPosts[0].title}
                          width={1000}
                          height={600}
                          sizes="(max-width: 768px) 100vw, 66vw"
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                        />
                      )}
                    </div>

                    <div className="p-8 space-y-4 bg-volavan-earth/30 backdrop-blur-sm">
                      {journalPosts[0].publishedAt && (
                        <time className="font-['Manrope'] text-xs uppercase tracking-wider text-volavan-aqua/80">
                          {new Date(journalPosts[0].publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      )}
                      <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl leading-tight text-volavan-cream group-hover:text-volavan-aqua transition-colors">
                        {journalPosts[0].title}
                      </h3>
                      {journalPosts[0].excerpt && (
                        <p className="font-['Manrope'] text-sm md:text-base leading-relaxed text-volavan-cream/70 line-clamp-3">
                          {journalPosts[0].excerpt}
                        </p>
                      )}
                      {isVideo && (
                        <div className="inline-block px-2 py-1 rounded-sm bg-volavan-aqua/10 border border-volavan-aqua/20 text-volavan-aqua text-xs font-['Manrope'] uppercase tracking-wider">
                          Video
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })()}

              {/* Side Articles (1/3) */}
              <div className="md:col-span-1 flex flex-col gap-6">
                {journalPosts.slice(1, 3).map((post) => {
                  const isVideo = post._type === 'videoPost' || post.videoUrl;
                  const thumbnailUrl = isVideo && post.videoUrl
                    ? getYouTubeThumbnail(post.videoUrl)
                    : null;
                  const imageSource = post._type === 'videoPost' ? post.thumbnail : post.coverImage;

                  return (
                    <Link
                      key={post._id}
                      to={`/journal/${post.slug}`}
                      className="group relative overflow-hidden rounded-sm border border-volavan-cream/10 hover:border-volavan-cream/30 transition-all duration-500 flex-1"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                          />
                        ) : (
                          <SanityImage
                            image={imageSource}
                            alt={post.title}
                            width={400}
                            height={300}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="w-full h-full group-hover:scale-105 transition-transform duration-700 saturate-[0.7] contrast-[1.1] brightness-[0.9]"
                          />
                        )}
                      </div>

                      <div className="p-5 space-y-2 bg-volavan-earth/30 backdrop-blur-sm">
                        {post.publishedAt && (
                          <time className="font-['Manrope'] text-xs uppercase tracking-wider text-volavan-aqua/80">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        )}
                        <h3 className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-tight text-volavan-cream group-hover:text-volavan-aqua transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {isVideo && (
                          <div className="inline-block px-2 py-1 rounded-sm bg-volavan-aqua/10 border border-volavan-aqua/20 text-volavan-aqua text-xs font-['Manrope'] uppercase tracking-wider">
                            Video
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center mt-12">
          <VLink to="/journal" variant="outline">Explore Journal</VLink>
        </div>
      </motion.div>
    </div>
  );
}
