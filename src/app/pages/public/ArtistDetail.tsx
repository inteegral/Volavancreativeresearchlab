import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { getImageUrl } from "../../lib/sanity";
import { PortableTextRenderer } from "../../components/PortableTextRenderer";
import { SEOHead } from "../../components/SEOHead";
import { ArtistPersonSchema, BreadcrumbSchema } from "../../components/StructuredData";
import { useArtist } from "../../hooks/useSanity";

export default function ArtistDetail() {
  const { slug } = useParams();
  
  // Fetch data with SWR
  const { artist, isLoading: loading } = useArtist(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-volavan-earth flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-volavan-aqua/30 border-t-volavan-aqua rounded-full animate-spin" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-volavan-earth flex flex-col items-center justify-center gap-6">
        <div className="text-volavan-cream font-['Cormorant_Garamond'] text-3xl italic">Artist not found</div>
        <Link 
          to="/artists" 
          className="text-volavan-aqua hover:text-volavan-cream transition-colors font-['Manrope'] text-xs uppercase tracking-[0.25em] border-b border-volavan-aqua/30 pb-1"
        >
          Return to Artists
        </Link>
      </div>
    );
  }

  const bioText = artist.bio ? artist.bio[0]?.children?.[0]?.text || artist.name : artist.name;

  return (
    <div className="min-h-screen bg-volavan-earth text-volavan-cream pt-24 pb-16 px-6 md:px-12">
      <SEOHead
        title={artist.name}
        description={bioText}
        image={artist.photo ? getImageUrl(artist.photo, 1200, 630) : undefined}
        url={`/artists/${slug}`}
        type="profile"
      />
      <ArtistPersonSchema
        name={artist.name}
        bio={bioText}
        image={artist.photo ? getImageUrl(artist.photo, 800, 800) : undefined}
        url={`/artists/${slug}`}
        discipline={artist.disciplines?.[0]}
        nationality={artist.nationality}
        website={artist.links?.[0]?.url}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Artists', url: '/artists' },
          { name: artist.name, url: `/artists/${slug}` }
        ]}
      />
      
      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-9 max-w-5xl mx-auto"
      >
        <Link 
          to="/artists" 
          className="group inline-flex items-center gap-2 font-['Manrope'] text-xs uppercase tracking-[0.2em] text-volavan-cream/60 hover:text-volavan-aqua transition-colors"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Directory
        </Link>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        
        {/* Header: Image + Name */}
        <div className="flex flex-col items-center gap-6 mb-12">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[300px] aspect-[3/4] shrink-0 bg-volavan-earth-dark relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-volavan-earth/10 mix-blend-multiply z-10" />
            {artist.photo ? (
              <img 
                src={getImageUrl(artist.photo, 600, 800)} 
                alt={artist.name}
                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-1000 hover:grayscale-0 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-volavan-cream/20">
                <span className="font-['Cormorant_Garamond'] text-7xl italic">
                  {artist.name.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Name & Meta */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 text-center"
          >
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl italic text-volavan-cream leading-[0.9]">
              {artist.name}
            </h1>
            <div className="flex flex-col items-center gap-2 mt-3">
              {artist.disciplines && artist.disciplines.length > 0 && (
                <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] text-volavan-aqua/70">
                  {artist.disciplines.slice(0, 2).join(', ')}
                </span>
              )}
              <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] text-volavan-aqua">
                {artist.nationality}
              </span>
            </div>
          </motion.div>

        </div>

        {/* Bio Content */}
        {artist.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="border-t border-volavan-cream/10 pt-12 pb-9 mb-12"
          >
            {/* Small eyebrow title */}
            <div className="text-center mb-8">
              <span className="font-['Manrope'] text-xs uppercase tracking-[0.3em] text-volavan-aqua/60">
                Bio
              </span>
            </div>
            <div className="text-justify">
              <PortableTextRenderer value={artist.bio} />
            </div>
          </motion.div>
        )}

        {/* Why Volavan Section */}
        {artist.whyVolavan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.41, duration: 0.6 }}
            className="border-t border-volavan-cream/10 pt-12 pb-15 mb-12"
          >
            {/* Small eyebrow title */}
            <div className="text-center mb-9">
              <span className="font-['Manrope'] text-xs uppercase tracking-[0.3em] text-volavan-aqua/60">
                Why Volavan?
              </span>
            </div>

            {/* Quote - main focus */}
            <blockquote className="relative px-6 md:px-12">
              {/* Opening quote */}
              <div className="absolute -left-2 md:left-0 -top-6 text-[90px] md:text-[105px] text-volavan-aqua/15 font-['Cormorant_Garamond'] leading-none pointer-events-none select-none">
                "
              </div>
              
              {/* Quote text */}
              <p className="font-['Cormorant_Garamond'] text-xl md:text-3xl lg:text-4xl italic text-volavan-cream leading-[1.4] text-center relative z-10">
                {artist.whyVolavan}
              </p>
              
              {/* Closing quote */}
              <div className="absolute -right-2 md:right-0 -bottom-9 text-[90px] md:text-[105px] text-volavan-aqua/15 font-['Cormorant_Garamond'] leading-none pointer-events-none select-none">
                "
              </div>
            </blockquote>

            {/* Attribution */}
            <div className="text-center mt-9">
              <span className="font-['Manrope'] text-xs uppercase tracking-[0.25em] text-volavan-cream/40">
                — {artist.name}
              </span>
            </div>
          </motion.div>
        )}

        {/* Instruments Section */}
        {artist.instruments && artist.instruments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.6 }}
            className="max-w-3xl mx-auto border-t border-volavan-cream/10 pt-9 mb-12"
          >
            <h2 className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream mb-5 text-center">
              Instruments / Focus
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {artist.instruments.map((instrument, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 border border-volavan-cream/20 rounded-full font-['Manrope'] text-xs text-volavan-cream/80"
                >
                  {instrument}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Links Section */}
        {artist.links && artist.links.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-3xl mx-auto border-t border-volavan-cream/10 pt-9 mb-12"
          >
            <h2 className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream mb-5 text-center">
              Links
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {artist.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-3 py-1.5 border border-volavan-cream/20 rounded-full hover:border-volavan-aqua/50 hover:bg-volavan-aqua/5 transition-all"
                >
                  <span className="font-['Manrope'] text-xs text-volavan-cream/80 group-hover:text-volavan-aqua transition-colors">
                    {link.label}
                  </span>
                  <ExternalLink size={12} className="text-volavan-cream/60 group-hover:text-volavan-aqua transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Residencies Participated */}
        {artist.residencies && artist.residencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-3xl mx-auto border-t border-volavan-cream/10 pt-9"
          >
            <h2 className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream mb-6 text-center">
              Residencies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artist.residencies.map((residency) => (
                <Link
                  key={residency._id}
                  to={`/residencies/${residency.slug.current}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="aspect-square overflow-hidden bg-volavan-earth-dark relative border border-volavan-cream/10 group-hover:border-volavan-aqua/50 transition-colors">
                    {residency.coverImage ? (
                      <img
                        src={getImageUrl(residency.coverImage, 400, 400)}
                        alt={residency.program?.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-volavan-cream/20">
                        <span className="font-['Cormorant_Garamond'] text-3xl italic">V</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-['Manrope'] text-[10px] uppercase tracking-wider text-volavan-aqua">
                        {residency.year}
                      </span>
                      <span className="text-volavan-cream/30">•</span>
                      <span className="font-['Manrope'] text-[10px] text-volavan-cream/60">
                        {residency.location}, {residency.country}
                      </span>
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] text-lg italic text-volavan-cream group-hover:text-volavan-aqua transition-colors flex items-center gap-2">
                      {residency.program?.name}
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}