import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { SEOHead } from "../../components/SEOHead";
import { VButton } from "../../components/ui/VButton";

const FORMSPARK_ID = "3o27Gbgx4";

const PROTOCOL_STEPS = [
  {
    label: "The Concept",
    text: `Submit a concise proposition articulating your artistic praxis and the "speculative seed" of your residency. What is the specific lens or operative mode you intend to probe?`,
  },
  {
    label: "The Dialogue",
    text: "Proposals that align with Volavan's aesthetic and intellectual rigor will enter a co-design phase. We collaborate to translate your idiosyncratic methodology into a structured, high-end professional experience.",
  },
  {
    label: "The Synthesis",
    text: "Together, we refine the temporal rhythm, the logistical parameters, and the conceptual output, ensuring the format is both radical and executable.",
  },
  {
    label: "The Manifestation",
    text: "Your vision is integrated into the Volavan calendar. You guide the residency as the Guest Curator, supported by our institutional scaffolding and international community of peers.",
  },
];

const WHO_WE_SEEK = [
  {
    role: "Artists & Researchers",
    description: "To deconstruct their investigative processes into a 7-day intensive laboratory.",
  },
  {
    role: "Spatial & Sonic Visionaries",
    description: "To engage with the phenomenology of site-specific voids and acoustic environments.",
  },
  {
    role: "Theorists of the Contemporary",
    description: "To manifest abstract conceptual frameworks through situated, collective action.",
  },
  {
    role: "Curatorial Agents",
    description: "To design radical protocols of coexistence and communal knowledge-production.",
  },
];

const WHAT_WE_PROVIDE = [
  {
    label: "The Site",
    text: "Exclusive access to raw, non-neutral environments designed for deep research and immersion.",
  },
  {
    label: "Institutional Scaffolding",
    text: "Comprehensive management of participant curation, production logistics, and technical mediation.",
  },
  {
    label: "Curatorial Symbiosis",
    text: "Intellectual partnership in distilling your practice into a coherent pedagogical format.",
  },
  {
    label: "Discursive Reach",
    text: "Connection to a global network of artists, critics, and research-led institutions.",
  },
];

// ── Shared form primitives ────────────────────────────────────────

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
        <p className="font-['Manrope'] text-xs text-volavan-cream/40 -mt-1 leading-relaxed">{hint}</p>
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

// ── Layout helpers ────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-['Manrope'] text-[9px] uppercase tracking-[0.35em] text-volavan-aqua/60">
      {children}
    </span>
  );
}

function Divider() {
  return <div className="w-full h-px bg-volavan-cream/8" />;
}

// ── Form types ────────────────────────────────────────────────────

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  website?: string;
  corePraxis: string;
  formatSeed: string;
  theTrace: string;
}

// ── Page ─────────────────────────────────────────────────────────

export default function GuestCurators() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`https://submit-form.com/${FORMSPARK_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-volavan-earth text-volavan-cream">
      <SEOHead
        title="Call for Guest Curators — VOLAVAN"
        description="Situating Praxis. Architecting Experience. An open call for artists, researchers, and creative catalysts to co-design a residency with Volavan."
        url="/curators"
      />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-volavan-earth-dark/60 via-transparent to-volavan-earth pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-['Manrope'] text-[10px] uppercase tracking-[0.4em] text-volavan-aqua"
          >
            Call for Guest Curators
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic text-volavan-cream leading-[0.92] tracking-tight"
          >
            Situating Praxis.{" "}
            <span className="text-volavan-cream/60">Architecting Experience.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-['Cormorant_Garamond'] text-lg md:text-xl italic text-volavan-cream/50 max-w-xl leading-relaxed"
          >
            An open invitation to co-design a pedagogical experiment with Volavan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-col items-center gap-2 text-volavan-cream/30 mt-8"
          >
            <span className="font-['Manrope'] text-[9px] uppercase tracking-[0.25em]">Read</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ArrowDown size={20} strokeWidth={1} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-32 flex flex-col gap-0">

        {/* The Vision */}
        <section className="py-20 md:py-28 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20">
          <div className="pt-1"><SectionLabel>The Vision</SectionLabel></div>
          <div className="flex flex-col gap-6">
            <p className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-cream leading-[1.3]">
              Volavan functions as a porous infrastructure for collective inquiry and transdisciplinary research.
            </p>
            <p className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-[1.85] text-volavan-cream/65">
              We perceive the residency not merely as a space of hosting, but as a performative medium in itself. We invite visionary thinkers—artists, researchers, and creative catalysts—to transpose their private investigative methodologies into rigorous, one-week residency formats.
            </p>
            <p className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-[1.85] text-volavan-cream/65">
              This is a call to co-design a pedagogical experiment. We are looking for those who wish to externalize their internal creative logic, transforming a singular gaze into a shared, discursive professional framework.
            </p>
          </div>
        </section>

        <Divider />

        {/* Who We Seek */}
        <section className="py-20 md:py-28 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20">
          <div className="pt-1"><SectionLabel>Who We Seek</SectionLabel></div>
          <div className="flex flex-col gap-8">
            <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl italic text-volavan-cream/80 leading-snug">
              We seek collaborators whose work resides in the interstitial spaces between artistic production and theoretical rigor, ready to curate a collective immersion.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              {WHO_WE_SEEK.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="border border-volavan-cream/10 p-6 flex flex-col gap-3 hover:border-volavan-aqua/30 transition-colors duration-500"
                >
                  <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-aqua/70">
                    {item.role}
                  </span>
                  <p className="font-['Cormorant_Garamond'] text-base md:text-lg italic text-volavan-cream/60 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* The Protocol */}
        <section className="py-20 md:py-28 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20">
          <div className="pt-1"><SectionLabel>The Protocol</SectionLabel></div>
          <div className="flex flex-col gap-0">
            <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl italic text-volavan-cream/80 leading-snug mb-10">
              From Intuition to Residency. We prioritize the evolution of an idea over a finished syllabus.
            </p>
            {PROTOCOL_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-8 py-8 border-t border-volavan-cream/8 last:border-b"
              >
                <span className="font-['Manrope'] text-[9px] uppercase tracking-[0.2em] text-volavan-aqua/40 pt-1 w-6 shrink-0 text-right">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-cream/50">
                    {step.label}
                  </span>
                  <p className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-[1.75] text-volavan-cream/65">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Divider />

        {/* What We Provide */}
        <section className="py-20 md:py-28 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20">
          <div className="pt-1"><SectionLabel>What We Provide</SectionLabel></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {WHAT_WE_PROVIDE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-px bg-volavan-aqua/40" />
                  <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-aqua/70">
                    {item.label}
                  </span>
                </div>
                <p className="font-['Cormorant_Garamond'] text-lg italic text-volavan-cream/60 leading-relaxed pl-7">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Submission + Form */}
        <section className="py-20 md:py-28 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20">
          <div className="pt-1"><SectionLabel>Submission</SectionLabel></div>
          <div className="flex flex-col gap-10">

            <div className="flex flex-col gap-3">
              <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-cream leading-snug">
                A Statement of Intent
              </h2>
              <p className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-[1.8] text-volavan-cream/60">
                We are interested in the criticality of your gaze rather than the linear narrative of a CV.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-start gap-5 py-10 border-t border-volavan-cream/10"
                >
                  <CheckCircle size={28} className="text-volavan-aqua" strokeWidth={1} />
                  <p className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream">
                    Proposal received.
                  </p>
                  <p className="font-['Manrope'] text-xs text-volavan-cream/40 leading-relaxed">
                    We read every proposal carefully and respond personally. You'll hear from us soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-8 border-t border-volavan-cream/10 pt-10"
                >
                  {/* Identity */}
                  <div className="flex flex-col gap-5">
                    <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua/50">
                      Identity
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
                    <Field
                      label="Website / Portfolio"
                      hint="A link to your practice, portfolio, or relevant work."
                    >
                      <input
                        {...register("website")}
                        className={inputClass}
                        placeholder="https://…"
                      />
                    </Field>
                  </div>

                  <div className="h-px bg-volavan-cream/10" />

                  {/* Statement */}
                  <div className="flex flex-col gap-5">
                    <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua/50">
                      Statement of Intent
                    </p>

                    <Field
                      label="01 — The Core Praxis *"
                      hint="What is the fundamental inquiry driving your current work?"
                      error={errors.corePraxis?.message}
                    >
                      <textarea
                        {...register("corePraxis", { required: "Required" })}
                        rows={5}
                        className={`${inputClass} resize-none leading-relaxed`}
                        placeholder="Describe the core inquiry of your practice…"
                      />
                    </Field>

                    <Field
                      label="02 — The Format Seed *"
                      hint={`What specific "experimental protocol" would you like to facilitate?`}
                      error={errors.formatSeed?.message}
                    >
                      <textarea
                        {...register("formatSeed", { required: "Required" })}
                        rows={5}
                        className={`${inputClass} resize-none leading-relaxed`}
                        placeholder="Describe the residency format you envision…"
                      />
                    </Field>

                    <Field
                      label="03 — The Trace *"
                      hint="What form of collective output or semiotic residue do you anticipate?"
                      error={errors.theTrace?.message}
                    >
                      <textarea
                        {...register("theTrace", { required: "Required" })}
                        rows={5}
                        className={`${inputClass} resize-none leading-relaxed`}
                        placeholder="What will remain after the residency ends…"
                      />
                    </Field>
                  </div>

                  <div className="h-px bg-volavan-cream/10" />

                  <div className="flex flex-col gap-4 pt-2">
                    <p className="font-['Manrope'] text-xs text-volavan-cream/40 leading-relaxed">
                      We read every proposal carefully and respond personally. There is no deadline — this is an ongoing call.
                    </p>
                    <VButton
                      type="submit"
                      variant="outline-aqua"
                      size="md"
                      disabled={isSubmitting}
                      className={isSubmitting ? "opacity-40 pointer-events-none" : ""}
                    >
                      {isSubmitting ? "Sending…" : "Submit proposal"}
                    </VButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </section>

      </div>
    </div>
  );
}
