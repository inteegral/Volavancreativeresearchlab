import { useState } from "react";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { SEOHead } from "../../components/SEOHead";
import { VButton } from "../../components/ui/VButton";

// ─── Config per residency ───────────────────────────────────────────────────

const RESIDENCY_CONFIG: Record<string, {
  name: string;
  location: string;
  year: number;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  formspreeId: string;
}> = {
  "systema-26": {
    name: "SYSTEMA 26",
    location: "Riga, Latvia",
    year: 2026,
    deadline: "May 8, 2026",
    formspreeId: import.meta.env.VITE_FORMSPREE_ENDPOINT || "",
  },
  "phosphene": {
    name: "PHOS/PHANE",
    location: "Riga, Latvia",
    year: 2026,
    startDate: "2026-06-07",
    endDate: "2026-06-13",
    deadline: "May 8, 2026",
    formspreeId: "OiX6zdV28",
  },
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.getDate()} – ${e.toLocaleDateString('en-GB', { ...opts, year: 'numeric' })}`;
  }
  return `${s.toLocaleDateString('en-GB', opts)} – ${e.toLocaleDateString('en-GB', { ...opts, year: 'numeric' })}`;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  statement: string;
  workUrl: string;
}

// ─── Shared input styles ────────────────────────────────────────────────────

const inputClass = [
  "w-full bg-volavan-cream/5 border border-volavan-cream/20 rounded-sm",
  "focus:border-volavan-aqua/60 focus:bg-volavan-cream/8",
  "font-['Manrope'] text-sm text-volavan-cream placeholder:text-volavan-cream/35",
  "px-3 py-3 outline-none transition-all duration-300",
].join(" ");

function Field({ label, hint, error, children }: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-cream/60 font-medium">
        {label}
      </label>
      {hint && (
        <p className="font-['Manrope'] text-xs text-volavan-cream/40 -mt-1">{hint}</p>
      )}
      {children}
      {error && (
        <p className="font-['Manrope'] text-xs text-red-400/80 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Apply() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? RESIDENCY_CONFIG[slug] : undefined;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (!config) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`https://formspree.io/f/${config.formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residency: config.name, year: config.year, ...data }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-volavan-earth flex flex-col items-center justify-center gap-6 text-volavan-cream">
        <p className="font-['Cormorant_Garamond'] text-3xl italic">No open call found</p>
        <Link to="/residencies" className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-aqua border-b border-volavan-aqua/30 pb-1">
          Back to Residencies
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-volavan-earth flex flex-col items-center justify-center gap-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-5 max-w-sm"
        >
          <CheckCircle size={36} className="text-volavan-aqua" strokeWidth={1} />
          <h2 className="font-['Cormorant_Garamond'] text-4xl italic text-volavan-cream">
            Application received
          </h2>
          <p className="font-['Manrope'] text-xs text-volavan-cream/40 leading-relaxed">
            Selected participants will be notified within 10 days of the deadline.
          </p>
          <Link
            to={`/residencies/${slug}`}
            className="mt-4 font-['Manrope'] text-[9px] uppercase tracking-[0.22em] text-volavan-aqua/60 hover:text-volavan-aqua border-b border-volavan-aqua/20 hover:border-volavan-aqua/60 pb-1 transition-colors"
          >
            Back to {config.name}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-volavan-earth text-volavan-cream">
      <SEOHead
        title={`Apply — ${config.name} ${config.year}`}
        description={`Apply to ${config.name}, ${config.location}, ${config.year}.`}
        url={`/apply/${slug}`}
      />

      <div className="max-w-lg mx-auto px-6 pt-28 pb-24">

        {/* Back */}
        <Link
          to={`/residencies/${slug}`}
          className="group inline-flex items-center gap-2 font-['Manrope'] text-[9px] uppercase tracking-[0.2em] text-volavan-cream/25 hover:text-volavan-cream/60 transition-colors mb-10"
        >
          <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
          {config.name}
        </Link>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-volavan-cream/10">
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.3em] text-volavan-aqua/60 mb-3">
            Application
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl italic text-volavan-cream leading-tight">
            {config.name}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="font-['Manrope'] text-xs text-volavan-cream/50 bg-volavan-cream/5 border border-volavan-cream/15 rounded-sm px-3 py-1">
              {config.location}
            </span>
            {config.startDate && config.endDate && (
              <span className="font-['Manrope'] text-xs text-volavan-cream/60 bg-volavan-cream/5 border border-volavan-cream/15 rounded-sm px-3 py-1">
                {formatDateRange(config.startDate, config.endDate)}
              </span>
            )}
            {config.deadline && (
              <span className="font-['Manrope'] text-xs text-volavan-aqua/70 bg-volavan-aqua/5 border border-volavan-aqua/20 rounded-sm px-3 py-1">
                Deadline: {config.deadline}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Section: Personal info */}
          <div className="space-y-5">
            <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua/50">
              Personal information
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Field label="First name *" error={errors.firstName?.message}>
                <input
                  {...register("firstName", { required: "Required" })}
                  className={inputClass}
                  placeholder="Anna"
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Last name *" error={errors.lastName?.message}>
                <input
                  {...register("lastName", { required: "Required" })}
                  className={inputClass}
                  placeholder="Kovač"
                  autoComplete="family-name"
                />
              </Field>
            </div>

            <Field label="Email address *" error={errors.email?.message}>
              <input
                {...register("email", {
                  required: "Required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                })}
                type="email"
                className={inputClass}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Nationality / Where you are based *" error={errors.nationality?.message}>
              <input
                {...register("nationality", { required: "Required" })}
                className={inputClass}
                placeholder="e.g. Italian, based in Berlin"
              />
            </Field>
          </div>

          <div className="h-px bg-volavan-cream/10" />

          {/* Section: Artistic statement */}
          <div className="space-y-5">
            <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua/50">
              Artistic statement
            </p>

            <Field
              label="Why this residency, why now *"
              hint="Tell us about your practice and what draws you to this residency. Write freely."
              error={errors.statement?.message}
            >
              <textarea
                {...register("statement", { required: "Required" })}
                rows={7}
                className={`${inputClass} resize-none leading-relaxed`}
                placeholder="Share your thoughts, intentions, context…"
              />
            </Field>

            <Field
              label="Work samples"
              hint="A link to your portfolio, Vimeo, SoundCloud, Instagram, or any relevant work."
              error={errors.workUrl?.message}
            >
              <input
                {...register("workUrl")}
                className={inputClass}
                placeholder="https://…"
              />
            </Field>
          </div>

          <div className="h-px bg-volavan-cream/10" />

          <div className="flex flex-col gap-5 pt-2">
            <p className="font-['Manrope'] text-xs text-volavan-cream/40 leading-relaxed">
              We read every application carefully. Selected participants will be notified within 10 days of the deadline.
            </p>
            <VButton
              type="submit"
              variant="outline-aqua"
              size="md"
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-40 pointer-events-none" : ""}
            >
              {isSubmitting ? "Sending…" : "Submit application"}
            </VButton>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
