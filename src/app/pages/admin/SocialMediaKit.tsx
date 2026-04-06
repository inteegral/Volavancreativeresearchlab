import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Download, Copy, Check, Instagram, Facebook, Linkedin, Mail, Newspaper, FileText, Image as ImageIcon, Palette, ChevronDown, Lock, Calendar } from "lucide-react";
import { SEOHead } from "../../components/SEOHead";
import useSWR from "swr";
import { sanityService, getImageUrl, getLogoUrl, type SanityImage } from "../../lib/sanity";
import type { SanityProgram } from "../../lib/sanity";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router";

interface Format {
  id: string;
  name: string;
  dimensions: string;
  ratio: string;
  category: string;
  icon: React.ReactNode;
}

const formats: Format[] = [
  // Instagram
  { id: "ig-post", name: "Instagram Post", dimensions: "1080x1080", ratio: "1:1", category: "Instagram", icon: <Instagram size={20} /> },
  { id: "ig-story", name: "Instagram Story", dimensions: "1080x1920", ratio: "9:16", category: "Instagram", icon: <Instagram size={20} /> },
  { id: "ig-reel", name: "Instagram Reel", dimensions: "1080x1920", ratio: "9:16", category: "Instagram", icon: <Instagram size={20} /> },
  { id: "ig-carousel", name: "Instagram Carousel", dimensions: "1080x1080", ratio: "1:1", category: "Instagram", icon: <Instagram size={20} /> },
  
  // Facebook
  { id: "fb-post", name: "Facebook Post", dimensions: "1200x630", ratio: "1.91:1", category: "Facebook", icon: <Facebook size={20} /> },
  { id: "fb-cover", name: "Facebook Cover", dimensions: "820x312", ratio: "2.63:1", category: "Facebook", icon: <Facebook size={20} /> },
  { id: "fb-group-cover", name: "Facebook Group Cover", dimensions: "1640x856", ratio: "1.92:1", category: "Facebook", icon: <Facebook size={20} /> },
  
  // LinkedIn
  { id: "li-post", name: "LinkedIn Post", dimensions: "1200x627", ratio: "1.91:1", category: "LinkedIn", icon: <Linkedin size={20} /> },
  { id: "li-article", name: "LinkedIn Article", dimensions: "1200x627", ratio: "1.91:1", category: "LinkedIn", icon: <Linkedin size={20} /> },
  
  // Publishing
  { id: "medium-header", name: "Medium Header", dimensions: "1500x750", ratio: "2:1", category: "Publishing", icon: <Newspaper size={20} /> },
  { id: "newsletter-header", name: "Newsletter Header", dimensions: "600x200", ratio: "3:1", category: "Publishing", icon: <Mail size={20} /> },
  
  // Press
  { id: "logo-full", name: "Logo Full Color", dimensions: "2000x2000", ratio: "1:1", category: "Press Kit", icon: <ImageIcon size={20} /> },
  { id: "logo-mono", name: "Logo Monochrome", dimensions: "2000x2000", ratio: "1:1", category: "Press Kit", icon: <ImageIcon size={20} /> },
  { id: "logo-icon", name: "Logo Icon Only", dimensions: "1000x1000", ratio: "1:1", category: "Press Kit", icon: <ImageIcon size={20} /> },
  { id: "press-image", name: "Press Images", dimensions: "3000x2000", ratio: "3:2", category: "Press Kit", icon: <ImageIcon size={20} /> },
  
  // Brand
  { id: "brand-colors", name: "Brand Colors", dimensions: "N/A", ratio: "N/A", category: "Brand", icon: <Palette size={20} /> },
  { id: "brand-guidelines", name: "Brand Guidelines PDF", dimensions: "N/A", ratio: "N/A", category: "Brand", icon: <FileText size={20} /> },
];

const categories = ["All", "Instagram", "Facebook", "LinkedIn", "Publishing", "Press Kit", "Brand"];

const brandColors = [
  { name: "Primary Green", hex: "#6A746C", rgb: "106, 116, 108" },
  { name: "Accent Teal", hex: "#B5DAD9", rgb: "181, 218, 217" },
  { name: "Background Cream", hex: "#F5F5F0", rgb: "245, 245, 240" },
];

// Template Preview Component with real residency data
function TemplatePreview({ 
  format, 
  program, 
  programs,
  logoImage,
  onSelectProgram 
}: { 
  format: Format; 
  program: SanityProgram | null;
  programs: SanityProgram[];
  logoImage?: SanityImage;
  onSelectProgram: (programId: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !program) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const [width, height] = format.dimensions.split('x').map(Number);
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas and fill with base green color
    ctx.fillStyle = '#6A746C';
    ctx.fillRect(0, 0, width, height);
    
    // Get hero image from latest edition
    const heroImageUrl = program.heroImage 
      ? getImageUrl(program.heroImage, width, height, 90)
      : null;
    
    if (heroImageUrl) {
      // Load and draw background image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw image with 35% transparency and 75% desaturation
        ctx.filter = 'saturate(25%)';
        ctx.globalAlpha = 0.35;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.globalAlpha = 1.0;
        ctx.filter = 'none';
        
        // Add strong gradient overlay - from top to middle of image
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(106, 116, 108, 0.85)'); // Very strong at top
        gradient.addColorStop(0.3, 'rgba(106, 116, 108, 0.6)'); // Medium
        gradient.addColorStop(0.5, 'rgba(106, 116, 108, 0.3)'); // Lighter at middle
        gradient.addColorStop(0.7, 'rgba(106, 116, 108, 0.5)'); // Medium again
        gradient.addColorStop(1, 'rgba(106, 116, 108, 0.8)'); // Strong at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        drawContent(ctx, width, height, program);
      };
      img.src = heroImageUrl;
    } else {
      // No image: just use the green background already filled
      drawContent(ctx, width, height, program);
    }
    
  }, [format, program]);
  
  function drawContent(ctx: CanvasRenderingContext2D, width: number, height: number, program: SanityProgram) {
    // Setup text rendering with anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Determine safe areas based on format
    const isVertical = height > width; // Stories/Reels
    const safeTop = isVertical ? height * 0.12 : height * 0.08;
    const safeBottom = isVertical ? height * 0.12 : height * 0.08;
    
    // Calculate available vertical space
    const contentTop = safeTop;
    const contentBottom = height - safeBottom;
    const availableHeight = contentBottom - contentTop;
    
    // ===== PREMIUM BORDER FRAME =====
    const borderWidth = Math.min(width, height) * 0.02;
    ctx.strokeStyle = 'rgba(245, 245, 240, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);
    
    // Inner border for depth
    const innerBorder = borderWidth * 2;
    ctx.strokeStyle = 'rgba(245, 245, 240, 0.08)';
    ctx.strokeRect(innerBorder, innerBorder, width - innerBorder * 2, height - innerBorder * 2);
    
    // ===== TOP SECTION - Program Logo or Title =====
    const titleSize = Math.min(width, height) / 8;
    const lineHeight = titleSize * 1.15;
    const topSectionY = contentTop + availableHeight * 0.25;
    let titleEndY = topSectionY;
    const maxWidth = width * 0.75;
    
    if (program.logo) {
      // ===== PROGRAM LOGO - Premium Display =====
      const logoSize = Math.min(width, height) / 6;
      const logoUrl = getLogoUrl(program.logo, logoSize * 2, logoSize * 2);
      
      if (logoUrl) {
        const logoImg = new Image();
        logoImg.onload = () => {
          ctx.drawImage(
            logoImg, 
            width / 2 - logoSize / 2,
            topSectionY - logoSize / 2,
            logoSize,
            logoSize
          );
        };
        logoImg.onerror = () => {
          console.error('Failed to load program logo from:', logoUrl);
        };
        logoImg.src = logoUrl;
      }
      
      titleEndY = topSectionY + logoSize / 2 + lineHeight * 0.3;
      
      // Program name below logo (small text)
      const programNameSize = Math.min(width, height) / 35;
      ctx.font = `600 ${programNameSize}px "Manrope", sans-serif`;
      ctx.fillStyle = 'rgba(245, 245, 240, 0.75)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '0.1em';
      
      const programName = program.name.toUpperCase();
      ctx.fillText(programName, width / 2, titleEndY + programNameSize * 1.2);
      titleEndY = titleEndY + programNameSize * 2.5;
      ctx.letterSpacing = '0';
    } else {
      // ===== MAIN TITLE - Ultra Premium Typography =====
      ctx.font = `italic ${titleSize}px "Cormorant Garamond", Georgia, serif`;
      ctx.fillStyle = '#F5F5F0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add subtle text shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = titleSize * 0.2;
      ctx.shadowOffsetY = titleSize * 0.08;
      
      // Wrap text with premium spacing
      const words = program.name.split(' ');
      let line = '';
      const lines: string[] = [];
      
      words.forEach((word) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      lines.push(line);
      
      lines.forEach((l, i) => {
        ctx.fillText(l.trim(), width / 2, topSectionY + i * lineHeight);
      });
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      titleEndY = topSectionY + lines.length * lineHeight;
    }
    
    // ===== DECORATIVE DIVIDER =====
    const dividerY = titleEndY + lineHeight * 0.8;
    const dividerLength = Math.min(width * 0.15, 80);
    const gradient = ctx.createLinearGradient(
      width / 2 - dividerLength, dividerY,
      width / 2 + dividerLength, dividerY
    );
    gradient.addColorStop(0, 'rgba(181, 218, 217, 0)');
    gradient.addColorStop(0.5, 'rgba(181, 218, 217, 0.6)');
    gradient.addColorStop(1, 'rgba(181, 218, 217, 0)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - dividerLength, dividerY);
    ctx.lineTo(width / 2 + dividerLength, dividerY);
    ctx.stroke();
    
    // Small decorative diamond in center
    const diamondSize = 4;
    ctx.fillStyle = '#B5DAD9';
    ctx.save();
    ctx.translate(width / 2, dividerY);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-diamondSize / 2, -diamondSize / 2, diamondSize, diamondSize);
    ctx.restore();
    
    // ===== TAGLINE - Elegant Subtitle =====
    let taglineEndY = dividerY + lineHeight * 0.8;
    if (program.tagline) {
      const taglineSize = Math.min(width, height) / 24;
      ctx.font = `${taglineSize}px "Manrope", sans-serif`;
      ctx.fillStyle = 'rgba(245, 245, 240, 0.85)';
      ctx.letterSpacing = '0.05em';
      
      const taglineWords = program.tagline.split(' ');
      let taglineLine = '';
      const taglineLines: string[] = [];
      
      taglineWords.forEach((word) => {
        const testLine = taglineLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && taglineLine !== '') {
          taglineLines.push(taglineLine);
          taglineLine = word + ' ';
        } else {
          taglineLine = testLine;
        }
      });
      taglineLines.push(taglineLine);
      
      const taglineY = dividerY + taglineSize * 2.5;
      taglineLines.forEach((l, i) => {
        ctx.fillText(l.trim(), width / 2, taglineY + i * taglineSize * 1.4);
      });
      taglineEndY = taglineY + taglineLines.length * taglineSize * 1.4;
    }
    
    // ===== BOTTOM SECTION - Premium Layout =====
    const edition = program.editions?.[0];
    if (edition) {
      const infoSize = Math.min(width, height) / 35;
      const bottomSectionHeight = infoSize * 20;
      const bottomSectionStart = contentBottom - bottomSectionHeight;
      const minGap = availableHeight * 0.08;
      const actualBottomStart = Math.max(taglineEndY + minGap, bottomSectionStart);
      
      // Check if it's open call status
      const isOpenCall = edition.status === 'open_call' || edition.status === 'open_call_soon';
      
      // ===== PREMIUM CTA BUTTON =====
      const ctaText = isOpenCall ? 'OPEN CALL' : 'APPLY NOW';
      const buttonWidth = Math.min(width * 0.55, 350);
      const buttonHeight = infoSize * 4.2;
      const buttonX = width / 2 - buttonWidth / 2;
      const buttonY = actualBottomStart - infoSize * 1;
      const buttonRadius = 8;
      
      // Outer glow
      ctx.shadowColor = 'rgba(181, 218, 217, 0.4)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 0;
      
      // Button background with gradient
      const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
      buttonGradient.addColorStop(0, 'rgba(181, 218, 217, 0.2)');
      buttonGradient.addColorStop(1, 'rgba(181, 218, 217, 0.08)');
      ctx.fillStyle = buttonGradient;
      
      // Draw rounded rectangle for button background
      ctx.beginPath();
      ctx.moveTo(buttonX + buttonRadius, buttonY);
      ctx.lineTo(buttonX + buttonWidth - buttonRadius, buttonY);
      ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + buttonRadius);
      ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - buttonRadius);
      ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - buttonRadius, buttonY + buttonHeight);
      ctx.lineTo(buttonX + buttonRadius, buttonY + buttonHeight);
      ctx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - buttonRadius);
      ctx.lineTo(buttonX, buttonY + buttonRadius);
      ctx.quadraticCurveTo(buttonX, buttonY, buttonX + buttonRadius, buttonY);
      ctx.closePath();
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      
      // Premium border with gradient
      const borderGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
      borderGradient.addColorStop(0, 'rgba(181, 218, 217, 0.5)');
      borderGradient.addColorStop(0.5, 'rgba(181, 218, 217, 0.9)');
      borderGradient.addColorStop(1, 'rgba(181, 218, 217, 0.5)');
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      // Button text with letter spacing
      ctx.font = `600 ${infoSize * 1.45}px "Manrope", sans-serif`;
      ctx.fillStyle = '#B5DAD9';
      ctx.letterSpacing = '0.15em';
      ctx.fillText(ctaText, width / 2, buttonY + buttonHeight / 2);
      ctx.letterSpacing = '0';
      
      // ===== DATES - Premium Typography =====
      if (edition.startDate && edition.endDate) {
        const start = new Date(edition.startDate);
        const end = new Date(edition.endDate);
        const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        ctx.font = `${infoSize * 1.1}px "Manrope", sans-serif`;
        ctx.fillStyle = 'rgba(245, 245, 240, 0.95)';
        const datesY = buttonY + buttonHeight + infoSize * 3;
        ctx.fillText(`${startStr} — ${endStr}`, width / 2, datesY);
        
        // Decorative dots
        ctx.fillStyle = 'rgba(181, 218, 217, 0.4)';
        const dotSize = 2;
        ctx.beginPath();
        ctx.arc(width / 2 - ctx.measureText(`${startStr} — ${endStr}`).width / 2 - infoSize, datesY, dotSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width / 2 + ctx.measureText(`${startStr} — ${endStr}`).width / 2 + infoSize, datesY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // ===== LOCATION - Refined Typography =====
      ctx.font = `${infoSize * 0.95}px "Manrope", sans-serif`;
      ctx.fillStyle = 'rgba(245, 245, 240, 0.65)';
      ctx.letterSpacing = '0.08em';
      const location = `${program.location || 'Alentejo'}, ${program.country || 'Portugal'}`;
      const locationY = buttonY + buttonHeight + infoSize * 5.2;
      const locationText = location.toUpperCase();
      ctx.fillText(locationText, width / 2, locationY);
      ctx.letterSpacing = '0';
      
      // ===== DEADLINE - Highlighted =====
      if (edition.callClose) {
        const deadline = new Date(edition.callClose);
        const formattedDate = deadline.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        
        // Background highlight
        const deadlineY = buttonY + buttonHeight + infoSize * 7.5;
        const deadlineText = `Application Deadline: ${formattedDate}`;
        ctx.font = `${infoSize * 0.9}px "Manrope", sans-serif`;
        const deadlineWidth = ctx.measureText(deadlineText).width;
        
        ctx.fillStyle = 'rgba(181, 218, 217, 0.08)';
        ctx.fillRect(
          width / 2 - deadlineWidth / 2 - infoSize,
          deadlineY - infoSize * 0.9,
          deadlineWidth + infoSize * 2,
          infoSize * 1.8
        );
        
        // Deadline text
        ctx.fillStyle = 'rgba(245, 245, 240, 0.85)';
        ctx.fillText(deadlineText, width / 2, deadlineY);
      }
      
      // ===== VOLAVAN LOGO - Bottom signature =====
      const logoY = buttonY + buttonHeight + infoSize * 11;
      
      if (logoImage) {
        // Use general VOLAVAN logo from settings
        const logoSize = infoSize * 4;
        const logoUrl = getLogoUrl(logoImage, logoSize * 2, logoSize * 2);
        
        if (logoUrl) {
          const logoImg = new Image();
          logoImg.onload = () => {
            ctx.drawImage(
              logoImg, 
              width / 2 - logoSize / 2,
              logoY - logoSize / 2,
              logoSize,
              logoSize
            );
          };
          logoImg.onerror = () => {
            console.error('Failed to load general logo from:', logoUrl);
          };
          logoImg.src = logoUrl;
        }
      } else {
        // Fallback to VOLAVAN text
        const logoCircleRadius = infoSize * 2;
        ctx.fillStyle = 'rgba(245, 245, 240, 0.05)';
        ctx.beginPath();
        ctx.arc(width / 2, logoY - infoSize * 0.5, logoCircleRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = `italic ${infoSize * 1.3}px "Cormorant Garamond", Georgia, serif`;
        ctx.fillStyle = 'rgba(245, 245, 240, 0.9)';
        ctx.letterSpacing = '0.2em';
        ctx.fillText('VOLAVAN', width / 2, logoY);
        ctx.letterSpacing = '0';
        
        ctx.font = `${infoSize * 0.65}px "Manrope", sans-serif`;
        ctx.fillStyle = 'rgba(245, 245, 240, 0.35)';
        ctx.letterSpacing = '0.15em';
        ctx.fillText('CREATIVE RURAL RESIDENCIES', width / 2, logoY + infoSize * 1.8);
        ctx.letterSpacing = '0';
      }
    }
  }
  
  // Don't show dropdown for Brand category
  if (format.category === "Brand" || format.category === "Press Kit") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#6A746C]/5">
        <div className="scale-[2] text-[#6A746C]/20">{format.icon}</div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {/* Dropdown selector */}
      <div className="absolute top-2 right-2 z-10">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white/90 backdrop-blur-sm border border-[#6A746C]/20 rounded-sm px-3 py-1.5 text-xs font-['Manrope'] text-[#6A746C] hover:bg-white transition-colors flex items-center gap-2"
          >
            {program ? program.name.substring(0, 15) + (program.name.length > 15 ? '...' : '') : 'Select Program'}
            <ChevronDown size={14} />
          </button>
          
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-full right-0 mt-1 bg-white border border-[#6A746C]/20 rounded-sm shadow-lg overflow-hidden z-20 min-w-[200px] max-h-[300px] overflow-y-auto">
                {programs.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => {
                      onSelectProgram(p._id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-['Manrope'] text-[#6A746C] hover:bg-[#B5DAD9]/10 transition-colors border-b border-[#6A746C]/5 last:border-0"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Canvas preview */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-contain rounded-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}

export default function SocialMediaKit() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings (password) from Sanity
  const { data: settings } = useSWR(
    'settings',
    () => sanityService.getSettings()
  );

  // Fetch programs from Sanity
  const { data: programs = [] } = useSWR(
    ['programs', language],
    () => sanityService.getAllPrograms(language)
  );

  // Check sessionStorage for authentication on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('mediaKitAuth') === 'true';
    setIsAuthenticated(isAuth);
    setIsLoading(false);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔑 Password submit attempt');
    console.log('📦 Settings from Sanity:', settings);
    console.log('🔒 Expected password:', settings?.mediaKitPassword);
    console.log('✏️ User input:', passwordInput);
    
    if (!settings?.mediaKitPassword) {
      console.error('❌ No password configured in Sanity settings');
      setPasswordError(true);
      return;
    }

    if (passwordInput === settings.mediaKitPassword) {
      console.log('✅ Password correct!');
      setIsAuthenticated(true);
      sessionStorage.setItem('mediaKitAuth', 'true');
      setPasswordError(false);
    } else {
      console.error('❌ Password incorrect');
      console.log('Expected:', settings.mediaKitPassword);
      console.log('Received:', passwordInput);
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#6A746C] rounded-sm flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-[#F5F5F0] font-['Cormorant_Garamond'] text-2xl italic">V</span>
          </div>
          <p className="font-['Manrope'] text-sm text-[#6A746C]/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#F5F5F0] via-[#F5F5F0] to-[#B5DAD9]/10 flex items-center justify-center px-6">
        <SEOHead 
          title="Social Media Kit - Login"
          description="Access VOLAVAN brand assets and social media templates."
          url="/admin/social-media-kit"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-[#6A746C]/10 rounded-lg p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-20 h-20 bg-gradient-to-br from-[#6A746C] to-[#6A746C]/80 rounded-lg flex items-center justify-center shadow-lg"
              >
                <span className="text-[#F5F5F0] font-['Cormorant_Garamond'] text-3xl italic">V</span>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-['Cormorant_Garamond'] text-4xl italic text-[#6A746C] text-center mb-3 leading-tight">
                Social Media Kit
              </h1>
              <p className="font-['Manrope'] text-sm text-[#6A746C]/50 text-center mb-10 tracking-wide">
                Enter password to access brand assets
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handlePasswordSubmit} 
              className="space-y-6"
            >
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6A746C]/30" size={18} />
                  <input
                    type="password"
                    id="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder="Enter password"
                    className={`
                      w-full pl-12 pr-4 py-4 
                      bg-[#F5F5F0]/50 border rounded-lg
                      font-['Manrope'] text-sm text-[#6A746C]
                      placeholder:text-[#6A746C]/30
                      focus:outline-none focus:ring-2 focus:ring-[#B5DAD9]/50 focus:border-[#B5DAD9]
                      transition-all duration-300
                      ${passwordError ? 'border-red-300 bg-red-50/30' : 'border-[#6A746C]/10'}
                    `}
                    autoFocus
                  />
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs text-red-500 font-['Manrope'] ml-1"
                  >
                    Incorrect password. Please try again.
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-[#6A746C] to-[#6A746C]/90 text-[#F5F5F0] rounded-lg font-['Manrope'] text-sm uppercase tracking-[0.2em] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Access Media Kit
              </button>
            </motion.form>

            <p className="mt-8 text-center font-['Manrope'] text-xs text-[#6A746C]/30 tracking-wide">
              Contact <span className="text-[#6A746C]/60">ola@volavan.com</span> if you need access
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Media Kit Content
  const filteredFormats = selectedCategory === "All" 
    ? formats 
    : formats.filter(f => f.category === selectedCategory);

  const copyToClipboard = (text: string, id: string) => {
    // Fallback method that works without Clipboard API permissions
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, 99999); // For mobile devices
      const successful = document.execCommand('copy');
      
      if (successful) {
        setCopiedColor(id);
        setTimeout(() => setCopiedColor(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const getSelectedProgram = (formatId: string): SanityProgram | null => {
    const programId = selectedPrograms[formatId];
    if (!programId && programs.length > 0) {
      // Auto-select first program if none selected
      setSelectedPrograms(prev => ({ ...prev, [formatId]: programs[0]._id }));
      return programs[0];
    }
    return programs.find(p => p._id === programId) || programs[0] || null;
  };

  const downloadFormat = async (format: Format) => {
    // For brand items, just trigger info
    if (format.category === "Brand") {
      alert(`${format.name} - Contact ola@volavan.com for brand assets`);
      return;
    }
    
    if (format.category === "Press Kit") {
      alert(`${format.name} - High-resolution press images available on request`);
      return;
    }
    
    const program = getSelectedProgram(format.id);
    if (!program) {
      alert('Please select a residency program first');
      return;
    }
    
    // Create a temporary canvas for download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const [width, height] = format.dimensions.split('x').map(Number);
    canvas.width = width;
    canvas.height = height;
    
    // Get hero image
    const heroImageUrl = program.heroImage 
      ? getImageUrl(program.heroImage, width, height, 90)
      : null;
    
    const drawContent = () => {
      // Setup text rendering with anti-aliasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#F5F5F0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Determine safe areas based on format
      const isVertical = height > width;
      const safeTop = isVertical ? height * 0.12 : height * 0.08;
      const safeBottom = isVertical ? height * 0.12 : height * 0.08;
      
      // Calculate available vertical space
      const contentTop = safeTop;
      const contentBottom = height - safeBottom;
      const availableHeight = contentBottom - contentTop;
      
      // ===== PREMIUM BORDER FRAME =====
      const borderWidth = Math.min(width, height) * 0.02;
      ctx.strokeStyle = 'rgba(245, 245, 240, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);
      
      // Inner border for depth
      const innerBorder = borderWidth * 2;
      ctx.strokeStyle = 'rgba(245, 245, 240, 0.08)';
      ctx.strokeRect(innerBorder, innerBorder, width - innerBorder * 2, height - innerBorder * 2);
      
      // ===== TOP SECTION - Program Logo or Title =====
      const titleSize = Math.min(width, height) / 11;
      const lineHeight = titleSize * 1.15;
      const topSectionY = contentTop + availableHeight * 0.25;
      let titleEndY = topSectionY;
      const maxWidth = width * 0.75;
      
      const performDownload = () => {
        // Wait a bit for logo to render, then download
        setTimeout(() => {
          canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `volavan-${program.slug}-${format.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 'image/png');
        }, 100);
      };
      
      if (program.logo) {
        // ===== PROGRAM LOGO - Premium Display =====
        const logoSize = titleSize * 4;
        const logoUrl = getLogoUrl(program.logo, logoSize * 2, logoSize * 2);
        
        if (logoUrl) {
          const logoImg = new Image();
          logoImg.onload = () => {
            ctx.drawImage(
              logoImg, 
              width / 2 - logoSize / 2,
              topSectionY - logoSize / 2,
              logoSize,
              logoSize
            );
            performDownload();
          };
          logoImg.onerror = () => {
            console.error('Failed to load program logo from:', logoUrl);
            performDownload();
          };
          logoImg.src = logoUrl;
        } else {
          performDownload();
        }
        
        titleEndY = topSectionY + logoSize / 2 + lineHeight * 0.3;
        
        // Program name below logo (small text)
        const programNameSize = Math.min(width, height) / 35;
        ctx.font = `600 ${programNameSize}px sans-serif`;
        ctx.fillStyle = 'rgba(245, 245, 240, 0.75)';
        
        const programName = program.name.toUpperCase();
        ctx.fillText(programName, width / 2, titleEndY + programNameSize * 1.2);
        titleEndY = titleEndY + programNameSize * 2.5;
      } else {
        // ===== MAIN TITLE - Ultra Premium Typography =====
        ctx.font = `italic ${titleSize * 0.9}px Georgia, serif`;
        ctx.fillStyle = '#F5F5F0';
        
        // Add subtle text shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = titleSize * 0.15;
        ctx.shadowOffsetY = titleSize * 0.05;
        
        // Wrap text
        const words = program.name.split(' ');
        let line = '';
        const lines: string[] = [];
        
        words.forEach((word) => {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && line !== '') {
            lines.push(line);
            line = word + ' ';
          } else {
            line = testLine;
          }
        });
        lines.push(line);
        
        lines.forEach((l, i) => {
          ctx.fillText(l.trim(), width / 2, topSectionY + i * lineHeight);
        });
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        titleEndY = topSectionY + lines.length * lineHeight;
        
        performDownload();
      }
      
      // ===== DECORATIVE DIVIDER =====
      const dividerY = titleEndY + lineHeight * 0.8;
      const dividerLength = Math.min(width * 0.15, 80);
      const gradient = ctx.createLinearGradient(
        width / 2 - dividerLength, dividerY,
        width / 2 + dividerLength, dividerY
      );
      gradient.addColorStop(0, 'rgba(181, 218, 217, 0)');
      gradient.addColorStop(0.5, 'rgba(181, 218, 217, 0.6)');
      gradient.addColorStop(1, 'rgba(181, 218, 217, 0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - dividerLength, dividerY);
      ctx.lineTo(width / 2 + dividerLength, dividerY);
      ctx.stroke();
      
      // Small decorative diamond
      const diamondSize = 4;
      ctx.fillStyle = '#B5DAD9';
      ctx.save();
      ctx.translate(width / 2, dividerY);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-diamondSize / 2, -diamondSize / 2, diamondSize, diamondSize);
      ctx.restore();
      
      // Tagline - Elegant Subtitle
      let taglineEndY = dividerY + lineHeight * 0.8;
      if (program.tagline) {
        const taglineSize = Math.min(width, height) / 24;
        ctx.font = `${taglineSize}px "Manrope", sans-serif`;
        ctx.fillStyle = 'rgba(245, 245, 240, 0.85)';
        
        const taglineWords = program.tagline.split(' ');
        let taglineLine = '';
        const taglineLines: string[] = [];
        
        taglineWords.forEach((word) => {
          const testLine = taglineLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && taglineLine !== '') {
            taglineLines.push(taglineLine);
            taglineLine = word + ' ';
          } else {
            taglineLine = testLine;
          }
        });
        taglineLines.push(taglineLine);
        
        const taglineY = dividerY + taglineSize * 2.5;
        taglineLines.forEach((l, i) => {
          ctx.fillText(l.trim(), width / 2, taglineY + i * taglineSize * 1.4);
        });
        taglineEndY = taglineY + taglineLines.length * taglineSize * 1.4;
      }
      
      // ===== BOTTOM SECTION - Premium Layout =====
      const edition = program.editions?.[0];
      if (edition) {
        const infoSize = Math.min(width, height) / 35;
        const bottomSectionHeight = infoSize * 20;
        const bottomSectionStart = contentBottom - bottomSectionHeight;
        const minGap = availableHeight * 0.08;
        const actualBottomStart = Math.max(taglineEndY + minGap, bottomSectionStart);
        
        const isOpenCall = edition.status === 'open_call' || edition.status === 'open_call_soon';
        
        // ===== PREMIUM CTA BUTTON =====
        const ctaText = isOpenCall ? 'OPEN CALL' : 'APPLY NOW';
        const buttonWidth = Math.min(width * 0.55, 350);
        const buttonHeight = infoSize * 4.2;
        const buttonX = width / 2 - buttonWidth / 2;
        const buttonY = actualBottomStart - infoSize * 1;
        const buttonRadius = 8;
        
        // Outer glow
        ctx.shadowColor = 'rgba(181, 218, 217, 0.4)';
        ctx.shadowBlur = 25;
        
        // Button background with gradient
        const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
        buttonGradient.addColorStop(0, 'rgba(181, 218, 217, 0.2)');
        buttonGradient.addColorStop(1, 'rgba(181, 218, 217, 0.08)');
        ctx.fillStyle = buttonGradient;
        
        // Draw rounded rectangle for button background
        ctx.beginPath();
        ctx.moveTo(buttonX + buttonRadius, buttonY);
        ctx.lineTo(buttonX + buttonWidth - buttonRadius, buttonY);
        ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + buttonRadius);
        ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - buttonRadius);
        ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - buttonRadius, buttonY + buttonHeight);
        ctx.lineTo(buttonX + buttonRadius, buttonY + buttonHeight);
        ctx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - buttonRadius);
        ctx.lineTo(buttonX, buttonY + buttonRadius);
        ctx.quadraticCurveTo(buttonX, buttonY, buttonX + buttonRadius, buttonY);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Premium border with gradient
        const borderGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
        borderGradient.addColorStop(0, 'rgba(181, 218, 217, 0.5)');
        borderGradient.addColorStop(0.5, 'rgba(181, 218, 217, 0.9)');
        borderGradient.addColorStop(1, 'rgba(181, 218, 217, 0.5)');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        
        // Button text
        ctx.font = `600 ${infoSize * 1.45}px sans-serif`;
        ctx.fillStyle = '#B5DAD9';
        ctx.fillText(ctaText, width / 2, buttonY + buttonHeight / 2);
        
        // ===== DATES - Premium Typography =====
        if (edition.startDate && edition.endDate) {
          const start = new Date(edition.startDate);
          const end = new Date(edition.endDate);
          const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          ctx.font = `${infoSize * 1.1}px sans-serif`;
          ctx.fillStyle = 'rgba(245, 245, 240, 0.95)';
          const datesY = buttonY + buttonHeight + infoSize * 3;
          ctx.fillText(`${startStr} — ${endStr}`, width / 2, datesY);
          
          // Decorative dots
          ctx.fillStyle = 'rgba(181, 218, 217, 0.4)';
          const dotSize = 2;
          ctx.beginPath();
          ctx.arc(width / 2 - ctx.measureText(`${startStr} — ${endStr}`).width / 2 - infoSize, datesY, dotSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(width / 2 + ctx.measureText(`${startStr} — ${endStr}`).width / 2 + infoSize, datesY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // ===== LOCATION - Refined Typography =====
        ctx.font = `${infoSize * 0.95}px sans-serif`;
        ctx.fillStyle = 'rgba(245, 245, 240, 0.65)';
        const location = `${program.location || 'Alentejo'}, ${program.country || 'Portugal'}`;
        const locationY = buttonY + buttonHeight + infoSize * 5.2;
        ctx.fillText(location.toUpperCase(), width / 2, locationY);
        
        // ===== DEADLINE - Highlighted =====
        if (edition.callClose) {
          const deadline = new Date(edition.callClose);
          const formattedDate = deadline.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          });
          
          const deadlineY = buttonY + buttonHeight + infoSize * 7.5;
          const deadlineText = `Application Deadline: ${formattedDate}`;
          ctx.font = `${infoSize * 0.9}px sans-serif`;
          const deadlineWidth = ctx.measureText(deadlineText).width;
          
          ctx.fillStyle = 'rgba(181, 218, 217, 0.08)';
          ctx.fillRect(
            width / 2 - deadlineWidth / 2 - infoSize,
            deadlineY - infoSize * 0.9,
            deadlineWidth + infoSize * 2,
            infoSize * 1.8
          );
          
          ctx.fillStyle = 'rgba(245, 245, 240, 0.85)';
          ctx.fillText(deadlineText, width / 2, deadlineY);
        }
        
        // ===== VOLAVAN LOGO - Bottom signature =====
        const logoY = buttonY + buttonHeight + infoSize * 11;
        
        if (settings?.logo) {
          // Use general VOLAVAN logo from settings
          const logoSize = infoSize * 4;
          const logoUrl = getLogoUrl(settings.logo, logoSize * 2, logoSize * 2);
          
          if (logoUrl) {
            const logoImg = new Image();
            logoImg.onload = () => {
              ctx.drawImage(
                logoImg, 
                width / 2 - logoSize / 2,
                logoY - logoSize / 2,
                logoSize,
                logoSize
              );
            };
            logoImg.onerror = () => {
              console.error('Failed to load general logo from:', logoUrl);
            };
            logoImg.src = logoUrl;
          }
        } else {
          // Fallback to VOLAVAN text
          const logoCircleRadius = infoSize * 2;
          ctx.fillStyle = 'rgba(245, 245, 240, 0.05)';
          ctx.beginPath();
          ctx.arc(width / 2, logoY - infoSize * 0.5, logoCircleRadius, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.font = `italic ${infoSize * 1.3}px Georgia, serif`;
          ctx.fillStyle = 'rgba(245, 245, 240, 0.9)';
          ctx.fillText('VOLAVAN', width / 2, logoY);
          
          ctx.font = `${infoSize * 0.65}px sans-serif`;
          ctx.fillStyle = 'rgba(245, 245, 240, 0.35)';
          ctx.fillText('CREATIVE RURAL RESIDENCIES', width / 2, logoY + infoSize * 1.8);
        }
      }
    };
    
    // Fill with base green color
    ctx.fillStyle = '#6A746C';
    ctx.fillRect(0, 0, width, height);
    
    if (heroImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw image with 35% transparency and 75% desaturation
        ctx.filter = 'saturate(25%)';
        ctx.globalAlpha = 0.35;
        ctx.drawImage(img, 0, 0, width, height);
        ctx.globalAlpha = 1.0;
        ctx.filter = 'none';
        
        // Add strong gradient overlay - from top to middle of image
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(106, 116, 108, 0.85)'); // Very strong at top
        gradient.addColorStop(0.3, 'rgba(106, 116, 108, 0.6)'); // Medium
        gradient.addColorStop(0.5, 'rgba(106, 116, 108, 0.3)'); // Lighter at middle
        gradient.addColorStop(0.7, 'rgba(106, 116, 108, 0.5)'); // Medium again
        gradient.addColorStop(1, 'rgba(106, 116, 108, 0.8)'); // Strong at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        drawContent();
      };
      img.src = heroImageUrl;
    } else {
      // No image: just use the green background already filled
      drawContent();
    }
  };

  const downloadColorPalette = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 1200;
    canvas.height = 400;
    
    // Background
    ctx.fillStyle = '#F5F5F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = '#6A746C';
    ctx.font = 'italic 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('VOLAVAN Brand Colors', canvas.width / 2, 80);
    
    // Color swatches
    const swatchWidth = 300;
    const swatchHeight = 200;
    const startX = (canvas.width - (swatchWidth * 3)) / 2;
    const startY = 150;
    
    brandColors.forEach((color, index) => {
      const x = startX + (index * swatchWidth);
      
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, startY, swatchWidth - 20, swatchHeight - 80);
      
      ctx.fillStyle = '#6A746C';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(color.name, x + (swatchWidth - 20) / 2, startY + swatchHeight - 50);
      
      ctx.font = 'bold 16px monospace';
      ctx.fillText(color.hex, x + (swatchWidth - 20) / 2, startY + swatchHeight - 25);
      
      ctx.font = '14px monospace';
      ctx.fillStyle = '#6A746C99';
      ctx.fillText(`RGB: ${color.rgb}`, x + (swatchWidth - 20) / 2, startY + swatchHeight - 5);
    });
    
    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'volavan-brand-colors.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F5F5F0] via-[#F5F5F0] to-[#B5DAD9]/5 text-[#6A746C] px-6 py-32 md:py-40">
      <SEOHead 
        title="Social Media Kit"
        description="Download VOLAVAN brand assets and social media templates with real residency content."
        url="/admin/social-media-kit"
      />

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24 space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-6xl md:text-8xl italic text-[#6A746C] leading-[0.9] tracking-tight">
                Social Media Kit
              </h1>
              <p className="font-['Manrope'] text-base md:text-lg text-[#6A746C]/50 max-w-3xl leading-relaxed mt-4">
                Generate optimized social media graphics with real residency data from Sanity. 
                Select a program for each format and download ready-to-use images.
              </p>
            </div>
            
            <Link 
              to="/admin/social-campaign"
              className="shrink-0 px-6 py-4 bg-gradient-to-r from-[#B5DAD9] to-[#B5DAD9]/80 text-[#6A746C] rounded-xl font-['Manrope'] text-xs uppercase tracking-[0.2em] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-3"
            >
              <Calendar size={16} />
              30-Day Campaign
            </Link>
          </div>
        </motion.div>

        {/* Brand Colors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20 p-10 md:p-12 bg-white/60 backdrop-blur-sm border border-[#6A746C]/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl italic text-[#6A746C]">
              Brand Colors
            </h2>
            <button
              onClick={downloadColorPalette}
              className="px-6 py-3 bg-gradient-to-r from-[#6A746C] to-[#6A746C]/90 text-[#F5F5F0] rounded-xl font-['Manrope'] text-xs uppercase tracking-[0.2em] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-3"
            >
              <Download size={16} />
              Download Palette
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brandColors.map((color, idx) => (
              <motion.div 
                key={color.hex} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.05 }}
                className="space-y-5 group"
              >
                <div 
                  className="w-full h-40 rounded-xl border border-[#6A746C]/10 shadow-sm group-hover:shadow-md transition-all duration-300"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="space-y-3">
                  <p className="font-['Manrope'] text-sm font-semibold text-[#6A746C] tracking-wide">
                    {color.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="font-mono text-xs text-[#6A746C]/70 bg-[#6A746C]/5 px-3 py-2 rounded-lg border border-[#6A746C]/10">
                      {color.hex}
                    </code>
                    <button
                      onClick={() => copyToClipboard(color.hex, color.hex)}
                      className="p-2 hover:bg-[#B5DAD9]/10 rounded-lg transition-all duration-200 active:scale-95"
                      title="Copy HEX"
                    >
                      {copiedColor === color.hex ? (
                        <Check size={16} className="text-[#B5DAD9]" />
                      ) : (
                        <Copy size={16} className="text-[#6A746C]/40" />
                      )}
                    </button>
                  </div>
                  <code className="font-mono text-xs text-[#6A746C]/30 block tracking-wide">
                    RGB: {color.rgb}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 flex flex-wrap gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-2.5 rounded-xl font-['Manrope'] text-xs uppercase tracking-[0.2em] transition-all duration-300
                ${selectedCategory === category 
                  ? 'bg-gradient-to-r from-[#6A746C] to-[#6A746C]/90 text-[#F5F5F0] shadow-md scale-105' 
                  : 'bg-white/80 text-[#6A746C]/50 border border-[#6A746C]/10 hover:border-[#B5DAD9]/50 hover:bg-white hover:scale-[1.02]'
                }
              `}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {programs.length === 0 && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-[#6A746C]/20 border-t-[#B5DAD9] rounded-full mx-auto mb-4"
            />
            <p className="font-['Manrope'] text-sm text-[#6A746C]/40 tracking-wide">
              Loading programs from Sanity...
            </p>
          </div>
        )}

        {/* Formats Grid */}
        {programs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredFormats.map((format, index) => (
              <motion.div
                key={format.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="group bg-white/80 backdrop-blur-sm border border-[#6A746C]/5 rounded-2xl overflow-hidden hover:border-[#B5DAD9]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
              >
                {/* Preview Box */}
                <div 
                  className="w-full bg-gradient-to-br from-[#6A746C]/5 to-[#B5DAD9]/5 border-b border-[#6A746C]/5 overflow-hidden relative"
                  style={{
                    aspectRatio: format.ratio !== "N/A" ? format.ratio : "16/9",
                    minHeight: format.ratio === "N/A" ? "240px" : undefined
                  }}
                >
                  <TemplatePreview 
                    format={format} 
                    program={getSelectedProgram(format.id)}
                    programs={programs}
                    logoImage={settings?.logo}
                    onSelectProgram={(programId) => {
                      setSelectedPrograms(prev => ({ ...prev, [format.id]: programId }));
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-2.5 text-[#6A746C]/30">
                    {format.icon}
                    <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] font-medium">
                      {format.category}
                    </span>
                  </div>
                  
                  <h3 className="font-['Cormorant_Garamond'] text-2xl italic text-[#6A746C] leading-tight">
                    {format.name}
                  </h3>
                  
                  <p className="font-mono text-xs text-[#6A746C]/40 tracking-wide">
                    {format.dimensions}
                  </p>

                  {/* Download Button */}
                  <button
                    onClick={() => downloadFormat(format)}
                    className="w-full mt-6 px-5 py-3.5 bg-gradient-to-r from-[#6A746C] to-[#6A746C]/90 text-[#F5F5F0] rounded-xl font-['Manrope'] text-xs uppercase tracking-[0.2em] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Usage Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 p-10 md:p-12 bg-white/60 backdrop-blur-sm border border-[#6A746C]/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl italic text-[#6A746C] mb-8">
            Usage Guidelines
          </h2>
          <div className="space-y-6 font-['Manrope'] text-sm md:text-base text-[#6A746C]/60 leading-relaxed">
            <p>
              <strong className="text-[#6A746C] font-semibold">Content Generation:</strong> Each template uses real residency data 
              from Sanity CMS including program names, taglines, hero images, and dates. Select different programs 
              to see how they look across formats.
            </p>
            <p>
              <strong className="text-[#6A746C] font-semibold">Typography:</strong> Primary font is Cormorant Garamond (italic for headlines), 
              secondary font is Manrope (for body text and UI elements).
            </p>
            <p>
              <strong className="text-[#6A746C] font-semibold">Color Application:</strong> Use #6A746C as the primary color, #B5DAD9 for 
              accents and calls-to-action, and #F5F5F0 for backgrounds and light elements.
            </p>
            <p>
              <strong className="text-[#6A746C] font-semibold">Downloads:</strong> All images are generated in PNG format at optimal 
              resolution for each platform. Images include overlay gradients for text readability.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
