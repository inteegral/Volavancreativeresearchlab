import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "./utils";

/**
 * VOLAVAN Button System — minimal, editorial, centralized.
 *
 * Varianti:
 *  outline       — bordo crema sottile, hover visibile       (CTA generale)
 *  outline-aqua  — bordo aqua sottile, hover visibile        (CTA principale)
 *  ghost         — solo testo + freccia, nessun bordo        (navigazione inline)
 *  disabled      — attenuato, non interattivo               (no open call)
 *
 * Dimensioni:
 *  sm — compatta
 *  md — default
 *  lg — CTA di pagina
 *
 * Componenti esportati:
 *  VButton — <button>
 *  VLink   — <Link> (react-router) con stessa estetica
 */

export type VVariant = "outline" | "outline-aqua" | "ghost" | "disabled";
export type VSize    = "sm" | "md" | "lg";

// ─── Style maps ────────────────────────────────────────────────────────────

const base = "inline-flex items-center justify-center font-['Manrope'] uppercase";

export const variantClass: Record<VVariant, string> = {
  "outline": cn(
    "border border-volavan-cream/25 text-volavan-cream",
    "hover:border-volavan-cream/60 hover:bg-volavan-cream/[0.03]",
    "transition-all duration-300"
  ),
  "outline-aqua": cn(
    "border border-volavan-aqua/30 text-volavan-aqua",
    "hover:border-volavan-aqua/70 hover:bg-volavan-aqua/[0.04]",
    "transition-all duration-300"
  ),
  "ghost": cn(
    "text-volavan-cream/60 hover:text-volavan-cream",
    "transition-colors duration-300"
  ),
  "disabled": cn(
    "border border-volavan-cream/10 text-volavan-cream/25",
    "cursor-not-allowed pointer-events-none"
  ),
};

export const sizeClass: Record<VSize, string> = {
  sm:  "px-5 py-2 gap-3",
  md:  "px-7 py-3 gap-4",
  lg:  "px-10 py-4 gap-5",
};

export const labelClass: Record<VSize, string> = {
  sm:  "text-[10px] tracking-[0.2em]",
  md:  "text-[10px] tracking-[0.22em]",
  lg:  "text-xs tracking-[0.25em]",
};

const arrowSize: Record<VSize, number> = { sm: 12, md: 13, lg: 15 };

// ─── Arrow ─────────────────────────────────────────────────────────────────

function VArrow({ size }: { size: VSize }) {
  return (
    <ArrowUpRight
      size={arrowSize[size]}
      className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0"
    />
  );
}

// ─── VButton (<button>) ────────────────────────────────────────────────────

interface VButtonProps extends React.ComponentProps<"button"> {
  variant?: VVariant;
  size?: VSize;
  arrow?: boolean;
}

export const VButton = forwardRef<HTMLButtonElement, VButtonProps>(
  ({ variant = "outline", size = "md", arrow = true, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, "group", variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      <span className={labelClass[size]}>{children}</span>
      {arrow && variant !== "disabled" && <VArrow size={size} />}
    </button>
  )
);
VButton.displayName = "VButton";

// ─── VLink (<Link> react-router) ───────────────────────────────────────────

interface VLinkProps extends LinkProps {
  variant?: VVariant;
  size?: VSize;
  arrow?: boolean;
}

export function VLink({ variant = "outline", size = "md", arrow = true, children, className, ...props }: VLinkProps) {
  return (
    <Link
      className={cn(base, "group", variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      <span className={labelClass[size]}>{children}</span>
      {arrow && variant !== "disabled" && <VArrow size={size} />}
    </Link>
  );
}
