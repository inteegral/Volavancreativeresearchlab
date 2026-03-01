import { useParams, Link } from "react-router";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { getImageUrl, formatDate, extractYouTubeId } from "../../lib/sanity";
import { PortableTextRenderer } from "../../components/PortableTextRenderer";
import { SEOHead } from "../../components/SEOHead";
import { ArticleSchema, BreadcrumbSchema } from "../../components/StructuredData";
import { VideoPlayer } from "../../components/VideoPlayer";
import { useJournalPost } from "../../hooks/useSanity";
import { trackEvent } from "../../hooks/useAnalytics";
import { useEffect } from "react";

export default function JournalDetail() {
  const { slug } = useParams();
  
  // Fetch data with SWR
  const { post, isLoading: loading } = useJournalPost(slug);

  // Track article view
  useEffect(() => {
    if (post) {
      trackEvent('view_article', {
        article_title: post.title,
        article_type: post._type,
        author: post.author?.name,
        categories: post.categories?.join(', '),
        published_date: post.publishedAt,
      });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#6A746C] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#B5DAD9]/30 border-t-[#B5DAD9] rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#6A746C] flex flex-col items-center justify-center gap-6 text-[#F5F5F0]">
        <h2 className="font-['Cormorant_Garamond'] text-4xl italic">Post not found</h2>
        <Link 
          to="/journal" 
          className="text-[#B5DAD9] hover:text-[#F5F5F0] transition-colors font-['Manrope'] text-xs uppercase tracking-[0.25em] border-b border-[#B5DAD9]/30 pb-1"
        >
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6A746C] text-[#F5F5F0] pt-32 pb-24 px-6 2xl:max-w-[1800px] 2xl:mx-auto">
      <SEOHead
        title={post.title}
        description={post.excerpt || post.title}
        image={post.coverImage ? getImageUrl(post.coverImage, 1200, 630) : undefined}
        url={`/journal/${slug}`}
        type="article"
        article={{
          publishedTime: post.publishedAt,
          author: post.author?.name,
          section: post.categories?.[0],
          tags: post.categories
        }}
      />
      <ArticleSchema
        title={post.title}
        description={post.excerpt || post.title}
        image={post.coverImage ? getImageUrl(post.coverImage, 1200, 630) : undefined}
        url={`/journal/${slug}`}
        datePublished={post.publishedAt}
        author={post.author?.name}
        category={post.categories?.[0]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Journal', url: '/journal' },
          { name: post.title, url: `/journal/${slug}` }
        ]}
      />
      
      {/* Back Link */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-5xl mx-auto mb-12"
      >
        <Link 
          to="/journal" 
          className="group inline-flex items-center gap-3 font-['Manrope'] text-sm uppercase tracking-[0.2em] text-[#F5F5F0]/60 hover:text-[#B5DAD9] transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Meta Info */}
          <div className="flex items-center justify-center gap-6 mb-8 text-[#B5DAD9]/80 text-xs uppercase tracking-[0.2em] font-['Manrope']">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(post.publishedAt)}
            </span>
            {post.author && (
              <>
                <span className="text-[#F5F5F0]/30">•</span>
                <span className="flex items-center gap-2">
                  <User size={14} />
                  {post.author.name}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-7xl italic text-[#F5F5F0] mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {post.categories.map((cat, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-[#B5DAD9]/10 border border-[#B5DAD9]/30 rounded-full font-['Manrope'] text-[10px] uppercase tracking-wider text-[#B5DAD9]"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-['Manrope'] text-xl text-[#F5F5F0]/80 font-light leading-relaxed max-w-3xl mx-auto italic">
              {post.excerpt}
            </p>
          )}
        </motion.div>

        {/* Cover Image */}
        {post.coverImage && !(post.videoUrl) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full aspect-[21/9] overflow-hidden mb-16 bg-[#5E6860] border border-[#F5F5F0]/10"
          >
            <img 
              src={getImageUrl(post.coverImage, 1600, 900)} 
              alt={post.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>
        )}

        {/* Video Player */}
        {post.videoUrl && (() => {
          const videoId = extractYouTubeId(post.videoUrl);
          if (!videoId) return null;
          
          // Get YouTube thumbnail
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-full aspect-video overflow-hidden mb-16 bg-[#000000] border border-[#F5F5F0]/10"
            >
              <VideoPlayer
                videoId={videoId}
                autoplay={false}
                muted={false}
                thumbnailUrl={thumbnailUrl}
                className="w-full h-full"
                playerId={`journal-video-${post._id}`}
              />
            </motion.div>
          );
        })()}

        {/* Content */}
        {post.content && (
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-3xl mx-auto mb-20"
          >
            <PortableTextRenderer value={post.content} />
          </motion.article>
        )}

        {/* Author Bio */}
        {post.author && post.author.bio && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-3xl mx-auto border-t border-[#F5F5F0]/10 pt-12 mb-20"
          >
            <div className="flex gap-6 items-start">
              {post.author.photo && (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[#5E6860] shrink-0">
                  <img 
                    src={getImageUrl(post.author.photo, 160, 160)} 
                    alt={post.author.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              )}
              <div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl italic text-[#F5F5F0] mb-3">
                  About {post.author.name}
                </h3>
                <PortableTextRenderer value={post.author.bio} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Related Residency */}
        {post.relatedResidency && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-3xl mx-auto border-t border-[#F5F5F0]/10 pt-12"
          >
            <h3 className="font-['Cormorant_Garamond'] text-3xl italic text-[#F5F5F0] mb-6">
              Related Residency
            </h3>
            <Link 
              to={`/residencies/${post.relatedResidency.slug}`}
              className="group flex items-center gap-4 p-6 border border-[#F5F5F0]/20 rounded-sm hover:border-[#B5DAD9]/50 hover:bg-[#B5DAD9]/5 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-['Manrope'] text-xs uppercase tracking-wider text-[#B5DAD9]">
                    {post.relatedResidency.year}
                  </span>
                </div>
                <h4 className="font-['Cormorant_Garamond'] text-2xl italic text-[#F5F5F0] group-hover:text-[#B5DAD9] transition-colors">
                  {post.relatedResidency.title}
                </h4>
              </div>
              <ArrowLeft size={20} className="text-[#F5F5F0]/40 group-hover:text-[#B5DAD9] rotate-180 transition-colors" />
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}