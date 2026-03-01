import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base Skeleton component with VOLAVAN design system
 * Shimmer animation with earth tones
 */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#6A746C]/20 rounded-sm ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton Card for Residency/Journal grid items
 */
export function SkeletonCard() {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-[#F5F5F0]/10">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-[#6A746C]/20 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4 bg-[#6A746C]/30">
        {/* Title */}
        <div className="h-6 bg-[#6A746C]/30 rounded-sm w-3/4 animate-pulse" />
        
        {/* Subtitle */}
        <div className="h-4 bg-[#6A746C]/20 rounded-sm w-full animate-pulse" />
        
        {/* Meta info */}
        <div className="flex items-center gap-4">
          <div className="h-3 bg-[#6A746C]/20 rounded-sm w-24 animate-pulse" />
          <div className="h-3 bg-[#6A746C]/20 rounded-sm w-32 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Journal featured article
 */
export function SkeletonJournalFeatured() {
  return (
    <div className="md:col-span-2 relative overflow-hidden rounded-sm border border-[#F5F5F0]/10">
      {/* Image skeleton */}
      <div className="aspect-[16/9] bg-[#6A746C]/20 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-8 space-y-4 bg-[#6A746C]/30">
        {/* Date */}
        <div className="h-3 bg-[#6A746C]/20 rounded-sm w-32 animate-pulse" />
        
        {/* Title - larger */}
        <div className="space-y-2">
          <div className="h-8 bg-[#6A746C]/30 rounded-sm w-full animate-pulse" />
          <div className="h-8 bg-[#6A746C]/30 rounded-sm w-2/3 animate-pulse" />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-[#6A746C]/20 rounded-sm w-full animate-pulse" />
          <div className="h-4 bg-[#6A746C]/20 rounded-sm w-full animate-pulse" />
          <div className="h-4 bg-[#6A746C]/20 rounded-sm w-4/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Journal side article
 */
export function SkeletonJournalSide() {
  return (
    <div className="relative overflow-hidden rounded-sm border border-[#F5F5F0]/10 flex-1">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-[#6A746C]/20 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-5 space-y-3 bg-[#6A746C]/30">
        {/* Date */}
        <div className="h-3 bg-[#6A746C]/20 rounded-sm w-28 animate-pulse" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-[#6A746C]/30 rounded-sm w-full animate-pulse" />
          <div className="h-6 bg-[#6A746C]/30 rounded-sm w-3/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Grid - renders multiple skeleton cards
 */
export function SkeletonGrid({ 
  count = 6, 
  variant = "card" 
}: { 
  count?: number; 
  variant?: "card" | "journal-featured" | "journal-side";
}) {
  const SkeletonComponent = 
    variant === "journal-featured" ? SkeletonJournalFeatured :
    variant === "journal-side" ? SkeletonJournalSide :
    SkeletonCard;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  );
}
