import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Filter, Download, Star, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { socialPosts, type PostFormat } from "../../lib/socialCampaignData";
import { InstagramPostTemplate } from "../../components/InstagramPostTemplate";
import { Link } from "react-router";

export default function SocialCampaign() {
  const [formatFilter, setFormatFilter] = useState<PostFormat | 'all'>('all');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return socialPosts.filter(post => {
      const matchesFormat = formatFilter === 'all' || post.format === formatFilter;
      return matchesFormat;
    });
  }, [formatFilter]);

  const getFormatBadge = (format: PostFormat) => {
    const colors = {
      carousel: 'bg-volavan-aqua/20 text-volavan-aqua',
      reel: 'bg-volavan-cream/20 text-volavan-cream',
      single: 'bg-volavan-earth/40 text-volavan-cream/80'
    };
    return (
      <span className={`px-2 py-1 rounded-sm text-xs uppercase tracking-wider font-['Manrope'] ${colors[format]}`}>
        {format}
      </span>
    );
  };

  const statsData = useMemo(() => {
    const carousels = socialPosts.filter(p => p.format === 'carousel').length;
    const reels = socialPosts.filter(p => p.format === 'reel').length;
    const singles = socialPosts.filter(p => p.format === 'single').length;
    const highlights = socialPosts.filter(p => p.isHighlight).length;
    
    return { 
      total: socialPosts.length,
      carousels, 
      reels, 
      singles,
      highlights,
      totalSlides: socialPosts.reduce((acc, p) => acc + (p.content.slides?.length || 1), 0)
    };
  }, []);

  const downloadAll = () => {
    // Trigger download for all posts sequentially with delays
    filteredPosts.forEach((post, index) => {
      setTimeout(() => {
        const button = document.querySelector(`[data-post-id="${post.id}"] button`) as HTMLButtonElement;
        button?.click();
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-volavan-earth text-volavan-cream py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl italic text-volavan-cream mb-4">
                Instagram Campaign
              </h1>
              <p className="font-['Manrope'] text-volavan-cream/70 text-sm uppercase tracking-widest">
                30 Days · 10 Posts · Visual Templates
              </p>
            </div>
            
            <Link
              to="/admin/social-media-kit"
              className="px-4 py-2 bg-volavan-cream/10 border border-volavan-cream/20 text-volavan-cream rounded-sm font-['Manrope'] text-xs uppercase tracking-wider hover:bg-volavan-cream/20 transition-colors"
            >
              ← Media Kit
            </Link>
          </div>

          <p className="font-['Manrope'] text-volavan-cream/60 text-base max-w-3xl leading-relaxed">
            Pre-designed Instagram templates ready to download. Each post includes carousel slides, reel covers, and single post graphics with VOLAVAN branding. Click any template to download high-resolution PNG files.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
        >
          <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-4">
            <div className="text-3xl font-['Cormorant_Garamond'] italic text-volavan-aqua">{statsData.total}</div>
            <div className="text-xs uppercase tracking-wider text-volavan-cream/60 mt-1 font-['Manrope']">Posts</div>
          </div>
          <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-4">
            <div className="text-3xl font-['Cormorant_Garamond'] italic text-volavan-aqua">{statsData.carousels}</div>
            <div className="text-xs uppercase tracking-wider text-volavan-cream/60 mt-1 font-['Manrope']">Carousels</div>
          </div>
          <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-4">
            <div className="text-3xl font-['Cormorant_Garamond'] italic text-volavan-aqua">{statsData.reels}</div>
            <div className="text-xs uppercase tracking-wider text-volavan-cream/60 mt-1 font-['Manrope']">Reels</div>
          </div>
          <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-4">
            <div className="text-3xl font-['Cormorant_Garamond'] italic text-volavan-aqua">{statsData.singles}</div>
            <div className="text-xs uppercase tracking-wider text-volavan-cream/60 mt-1 font-['Manrope']">Singles</div>
          </div>
          <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-4">
            <div className="text-3xl font-['Cormorant_Garamond'] italic text-volavan-aqua">{statsData.totalSlides}</div>
            <div className="text-xs uppercase tracking-wider text-volavan-cream/60 mt-1 font-['Manrope']">Total Images</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-volavan-cream/10"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-volavan-cream/60" />
              <span className="text-xs uppercase tracking-wider text-volavan-cream/60 font-['Manrope']">Format:</span>
            </div>
            
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value as PostFormat | 'all')}
              className="bg-volavan-cream/10 border border-volavan-cream/20 rounded-sm px-3 py-2 text-sm text-volavan-cream font-['Manrope'] focus:outline-none focus:border-volavan-aqua"
            >
              <option value="all">All Formats ({socialPosts.length})</option>
              <option value="carousel">Carousel ({statsData.carousels})</option>
              <option value="reel">Reel ({statsData.reels})</option>
              <option value="single">Single Post ({statsData.singles})</option>
            </select>
          </div>

          <button
            onClick={downloadAll}
            className="px-4 py-2 bg-volavan-aqua/20 border border-volavan-aqua/30 text-volavan-aqua rounded-sm font-['Manrope'] text-xs uppercase tracking-wider hover:bg-volavan-aqua/30 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Download All ({filteredPosts.length})
          </button>
        </motion.div>

        {/* Posts Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-12"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm overflow-hidden"
              data-post-id={post.id}
            >
              {/* Post Header */}
              <div className="p-6 border-b border-volavan-cream/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-14 h-14 rounded-sm bg-volavan-aqua/10 border border-volavan-aqua/30">
                      <span className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-aqua">{post.day}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream">
                          Day {post.day}
                        </h3>
                        {post.isHighlight && (
                          <Star className="w-5 h-5 text-volavan-aqua fill-volavan-aqua" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {getFormatBadge(post.format)}
                        <span className="text-xs text-volavan-cream/60 font-['Manrope']">•</span>
                        <span className="text-xs uppercase tracking-wider text-volavan-cream/60 font-['Manrope']">{post.type}</span>
                        <span className="text-xs text-volavan-cream/60 font-['Manrope']">•</span>
                        <span className="text-xs text-volavan-cream/50 font-['Manrope']">{post.angle}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="p-2 rounded-sm hover:bg-volavan-cream/5 transition-colors"
                  >
                    {expandedPost === post.id ? (
                      <ChevronUp className="w-5 h-5 text-volavan-cream/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-volavan-cream/60" />
                    )}
                  </button>
                </div>

                {post.hook && (
                  <p className="text-sm text-volavan-aqua/80 font-['Manrope'] italic">"{post.hook}"</p>
                )}
              </div>

              {/* Templates Gallery */}
              <div className="p-6">
                {post.format === 'carousel' && post.content.slides && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-volavan-aqua" />
                      <span className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope']">
                        {post.content.slides.length} Carousel Slides
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {post.content.slides.map((_, slideIndex) => (
                        <InstagramPostTemplate 
                          key={`${post.id}-slide-${slideIndex}`}
                          post={post}
                          slideIndex={slideIndex}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {post.format === 'single' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-volavan-aqua" />
                      <span className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope']">
                        Single Post Template
                      </span>
                    </div>
                    <div className="max-w-sm mx-auto">
                      <InstagramPostTemplate post={post} />
                    </div>
                  </div>
                )}

                {post.format === 'reel' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-volavan-aqua" />
                      <span className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope']">
                        Reel Cover Template
                      </span>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <InstagramPostTemplate post={post} />
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {expandedPost === post.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-volavan-cream/10 p-6 bg-volavan-cream/[0.02]"
                >
                  {/* Caption */}
                  <div className="mb-6">
                    <h4 className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope'] mb-3">
                      Caption
                    </h4>
                    <p className="text-volavan-cream/90 font-['Manrope'] leading-relaxed whitespace-pre-line">
                      {post.content.caption}
                    </p>
                  </div>

                  {/* Full Content */}
                  {post.content.slides && (
                    <div className="mb-6">
                      <h4 className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope'] mb-3">
                        Slide Content
                      </h4>
                      <div className="space-y-3">
                        {post.content.slides.map((slide, idx) => (
                          <div key={idx} className="bg-volavan-cream/5 rounded-sm p-3 border-l-2 border-volavan-aqua/40">
                            <div className="text-xs uppercase tracking-wider text-volavan-cream/40 mb-1 font-['Manrope']">
                              Slide {idx + 1}
                            </div>
                            <p className="text-sm text-volavan-cream/80 font-['Manrope']">{slide}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {post.content.script && (
                    <div className="mb-6">
                      <h4 className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope'] mb-3">
                        Reel Script
                      </h4>
                      <div className="space-y-3">
                        {post.content.script.map((segment, idx) => (
                          <div key={idx} className="bg-volavan-cream/5 rounded-sm p-3 border-l-2 border-volavan-aqua/40">
                            <div className="text-xs uppercase tracking-wider text-volavan-aqua/60 mb-1 font-['Manrope']">
                              {segment.timestamp}
                            </div>
                            <p className="text-sm text-volavan-cream/80 font-['Manrope']">{segment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Guidelines Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-12 border-t border-volavan-cream/10"
        >
          <h2 className="font-['Cormorant_Garamond'] text-3xl italic text-volavan-cream mb-6">
            Template Specifications
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-6">
              <h3 className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope'] mb-3">Carousel Posts</h3>
              <ul className="space-y-2 text-sm text-volavan-cream/70 font-['Manrope']">
                <li>• Format: 1080x1080px (1:1)</li>
                <li>• Multiple slides per post</li>
                <li>• Swipeable content</li>
                <li>• PNG format, high-res</li>
              </ul>
            </div>
            
            <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-6">
              <h3 className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope'] mb-3">Reels</h3>
              <ul className="space-y-2 text-sm text-volavan-cream/70 font-['Manrope']">
                <li>• Format: 1080x1920px (9:16)</li>
                <li>• Vertical video cover</li>
                <li>• 40-60 seconds duration</li>
                <li>• Script included</li>
              </ul>
            </div>
            
            <div className="bg-volavan-cream/5 border border-volavan-cream/10 rounded-sm p-6">
              <h3 className="text-xs uppercase tracking-wider text-volavan-aqua font-['Manrope'] mb-3">Single Posts</h3>
              <ul className="space-y-2 text-sm text-volavan-cream/70 font-['Manrope']">
                <li>• Format: 1080x1080px (1:1)</li>
                <li>• Quote-based design</li>
                <li>• Minimal layout</li>
                <li>• Ready for feed</li>
              </ul>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
