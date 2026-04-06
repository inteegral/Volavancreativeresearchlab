import { useRef, useEffect } from "react";
import { Download } from "lucide-react";
import type { SocialPost } from "../lib/socialCampaignData";

interface InstagramPostTemplateProps {
  post: SocialPost;
  slideIndex?: number;
}

export function InstagramPostTemplate({ post, slideIndex }: InstagramPostTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions based on format
    const width = 1080;
    const height = post.format === 'reel' ? 1920 : 1080;
    
    canvas.width = width;
    canvas.height = height;

    // Base background
    ctx.fillStyle = '#6A746C';
    ctx.fillRect(0, 0, width, height);

    // Setup text rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Border frame
    const borderWidth = post.format === 'reel' ? 40 : 30;
    ctx.strokeStyle = 'rgba(245, 245, 240, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);

    if (post.format === 'carousel' && post.content.slides && slideIndex !== undefined) {
      drawCarouselSlide(ctx, width, height, post, slideIndex);
    } else if (post.format === 'single' && post.content.imageText) {
      drawSinglePost(ctx, width, height, post);
    } else if (post.format === 'reel') {
      drawReelCover(ctx, width, height, post);
    }

  }, [post, slideIndex]);

  const drawCarouselSlide = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    post: SocialPost,
    slideIndex: number
  ) => {
    const slide = post.content.slides![slideIndex];
    const isFirstSlide = slideIndex === 0;
    const isLastSlide = slideIndex === post.content.slides!.length - 1;

    // Slide indicator
    const indicatorY = 80;
    const indicatorSpacing = 25;
    const totalWidth = (post.content.slides!.length * 15) + ((post.content.slides!.length - 1) * indicatorSpacing);
    let indicatorX = (width - totalWidth) / 2;

    post.content.slides!.forEach((_, idx) => {
      ctx.fillStyle = idx === slideIndex ? '#B5DAD9' : 'rgba(245, 245, 240, 0.3)';
      ctx.beginPath();
      ctx.arc(indicatorX + 7.5, indicatorY, 7, 0, Math.PI * 2);
      ctx.fill();
      indicatorX += 15 + indicatorSpacing;
    });

    // Day number badge
    if (isFirstSlide) {
      const badgeY = 140;
      ctx.fillStyle = 'rgba(181, 218, 217, 0.15)';
      ctx.fillRect(width / 2 - 60, badgeY - 30, 120, 60);
      
      ctx.font = 'italic 42px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#B5DAD9';
      ctx.fillText(`Day ${post.day}`, width / 2, badgeY);
    }

    // Main content area
    const contentY = 250;
    const maxWidth = width - 160;
    const lineHeight = 65;

    // Wrap text
    ctx.font = '48px "Manrope", sans-serif';
    ctx.fillStyle = '#F5F5F0';
    
    const words = slide.split(' ');
    let line = '';
    const lines: string[] = [];
    let testWidth = 0;

    words.forEach((word) => {
      const testLine = line + word + ' ';
      testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && line !== '') {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line);

    const totalTextHeight = lines.length * lineHeight;
    let textY = height / 2 - totalTextHeight / 2;

    lines.forEach((l) => {
      // Check if line contains quotes to style differently
      if (l.includes("'") || l.includes('"')) {
        ctx.font = 'italic 44px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#B5DAD9';
      } else {
        ctx.font = '48px "Manrope", sans-serif';
        ctx.fillStyle = '#F5F5F0';
      }
      ctx.fillText(l.trim(), width / 2, textY);
      textY += lineHeight;
    });

    // Bottom branding
    const bottomY = height - 100;
    ctx.font = 'italic 28px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.8)';
    ctx.letterSpacing = '0.15em';
    ctx.fillText('VOLAVAN', width / 2, bottomY);
    
    ctx.font = '16px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.4)';
    ctx.letterSpacing = '0.2em';
    ctx.fillText('CREATIVE RESEARCH LAB', width / 2, bottomY + 30);
    ctx.letterSpacing = '0';
  };

  const drawSinglePost = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    post: SocialPost
  ) => {
    // Decorative elements
    const centerY = height / 2;

    // Top decorative line
    const lineY = centerY - 180;
    const lineLength = 120;
    ctx.strokeStyle = 'rgba(181, 218, 217, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - lineLength / 2, lineY);
    ctx.lineTo(width / 2 + lineLength / 2, lineY);
    ctx.stroke();

    // Diamond center
    const diamondSize = 8;
    ctx.fillStyle = '#B5DAD9';
    ctx.save();
    ctx.translate(width / 2, lineY);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-diamondSize / 2, -diamondSize / 2, diamondSize, diamondSize);
    ctx.restore();

    // Main quote
    const maxWidth = width - 180;
    ctx.font = 'italic 52px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#F5F5F0';
    
    const quote = post.content.imageText!;
    const words = quote.split(' ');
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

    const lineHeight = 70;
    const totalHeight = lines.length * lineHeight;
    let textY = centerY - totalHeight / 2;

    lines.forEach((l) => {
      ctx.fillText(l.trim(), width / 2, textY);
      textY += lineHeight;
    });

    // Bottom decorative line
    const bottomLineY = centerY + 180;
    ctx.beginPath();
    ctx.moveTo(width / 2 - lineLength / 2, bottomLineY);
    ctx.lineTo(width / 2 + lineLength / 2, bottomLineY);
    ctx.stroke();

    ctx.save();
    ctx.translate(width / 2, bottomLineY);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-diamondSize / 2, -diamondSize / 2, diamondSize, diamondSize);
    ctx.restore();

    // Day badge in corner
    const badgeSize = 80;
    const badgeX = width - 100;
    const badgeY = 100;
    
    ctx.fillStyle = 'rgba(181, 218, 217, 0.15)';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'italic 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#B5DAD9';
    ctx.fillText(post.day.toString(), badgeX, badgeY);

    // Bottom branding
    const bottomY = height - 100;
    ctx.font = 'italic 28px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.8)';
    ctx.fillText('VOLAVAN', width / 2, bottomY);
    
    ctx.font = '16px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.4)';
    ctx.fillText('CREATIVE RESEARCH LAB', width / 2, bottomY + 30);
  };

  const drawReelCover = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    post: SocialPost
  ) => {
    // height is already set to 1920 in useEffect
    const reelHeight = height;

    // Reel indicator (top)
    ctx.font = '22px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.6)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.15em';
    ctx.fillText('REEL', width / 2, 100);
    ctx.letterSpacing = '0';

    // Day badge
    const badgeY = 180;
    ctx.fillStyle = 'rgba(181, 218, 217, 0.15)';
    ctx.fillRect(width / 2 - 70, badgeY - 35, 140, 70);
    
    ctx.font = 'italic 48px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#B5DAD9';
    ctx.fillText(`Day ${post.day}`, width / 2, badgeY);

    // Hook text (main content)
    const hookY = 400;
    const maxWidth = width - 140;
    
    const hookText = post.hook || post.content.script?.[0]?.text || '';
    ctx.font = '56px "Manrope", sans-serif';
    ctx.fillStyle = '#F5F5F0';
    
    const words = hookText.split(' ');
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

    const lineHeight = 75;
    let textY = hookY;

    lines.forEach((l, i) => {
      if (i < 4) { // Limit to 4 lines for reel cover
        ctx.fillText(l.trim(), width / 2, textY);
        textY += lineHeight;
      }
    });

    // Play button indicator
    const playY = reelHeight / 2 + 200;
    ctx.strokeStyle = 'rgba(245, 245, 240, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, playY, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Play triangle
    ctx.fillStyle = 'rgba(245, 245, 240, 0.6)';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 15, playY - 22);
    ctx.lineTo(width / 2 - 15, playY + 22);
    ctx.lineTo(width / 2 + 20, playY);
    ctx.closePath();
    ctx.fill();

    // Duration indicator
    ctx.font = '18px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.5)';
    const lastScript = post.content.script?.[post.content.script.length - 1];
    const duration = lastScript ? lastScript.timestamp.split('–')[1] : '60 seg';
    ctx.fillText(duration, width / 2, playY + 90);

    // Bottom branding
    const bottomY = reelHeight - 120;
    ctx.font = 'italic 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.8)';
    ctx.fillText('VOLAVAN', width / 2, bottomY);
    
    ctx.font = '18px "Manrope", sans-serif';
    ctx.fillStyle = 'rgba(245, 245, 240, 0.4)';
    ctx.letterSpacing = '0.2em';
    ctx.fillText('CREATIVE RESEARCH LAB', width / 2, bottomY + 35);
    ctx.letterSpacing = '0';
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = slideIndex !== undefined 
        ? `volavan-day${post.day}-slide${slideIndex + 1}.png`
        : `volavan-day${post.day}-${post.format}.png`;
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const aspectRatio = post.format === 'reel' ? '9/16' : '1/1';

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-sm border border-[#F5F5F0]/10">
        <canvas 
          ref={canvasRef}
          className="w-full h-auto"
          style={{ aspectRatio }}
        />
        
        {/* Download overlay */}
        <div className="absolute inset-0 bg-[#6A746C]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-[#B5DAD9] text-[#6A746C] rounded-sm font-['Manrope'] text-sm uppercase tracking-wider hover:bg-[#F5F5F0] transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>
      
      {/* Slide info */}
      {slideIndex !== undefined && (
        <div className="mt-2 text-center text-xs text-[#F5F5F0]/60 font-['Manrope'] uppercase tracking-wider">
          Slide {slideIndex + 1} of {post.content.slides?.length}
        </div>
      )}
    </div>
  );
}