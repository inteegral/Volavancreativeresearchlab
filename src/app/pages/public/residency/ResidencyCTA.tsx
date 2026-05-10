import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { formatDate } from "../../../lib/sanity";
import { trackEvent } from "../../../hooks/useAnalytics";
import { useLanguage } from "../../../contexts/LanguageContext";
import { VButton, VLink } from "../../../components/ui/VButton";
import type { SanityResidency, SanityProgram } from "../../../lib/sanity";

const NOTIFY_FORM_ID = "XVwKGY1dG";

interface ResidencyCTAProps {
  residency: SanityResidency;
  program: SanityProgram;
  isOpenCall: boolean;
  isOpenSoon?: boolean;
  callOpenDate?: string;
  callCloseDate?: string;
}

function NotifyModal({
  programName,
  onClose,
}: {
  programName: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch(`https://submit-form.com/${NOTIFY_FORM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, program: programName }),
      });
      setStatus("success");
      trackEvent("notify_me_submit", { program_name: programName });
    } catch {
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-volavan-earth/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-volavan-earth border border-volavan-cream/15 p-10 flex flex-col gap-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-volavan-cream/30 hover:text-volavan-cream transition-colors"
          aria-label="Close"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        {status === "success" ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream">
              You're on the list.
            </p>
            <p className="font-['Manrope'] text-xs text-volavan-cream/50 leading-relaxed">
              We'll let you know as soon as the open call for {programName} is live.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua">
                Notify me
              </span>
              <p className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream leading-snug">
                Be the first to know when the open call for {programName} opens.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-volavan-cream/20 focus:border-volavan-aqua/60 outline-none py-2 font-['Manrope'] text-sm text-volavan-cream placeholder:text-volavan-cream/30 transition-colors"
              />
              {status === "error" && (
                <p className="font-['Manrope'] text-[10px] text-red-400/70">
                  Something went wrong. Please try again.
                </p>
              )}
              <VButton
                type="submit"
                variant="outline-aqua"
                size="sm"
                arrow={false}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending…" : "Notify me"}
              </VButton>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export function ResidencyCTA({ residency, program, isOpenCall, isOpenSoon, callOpenDate, callCloseDate }: ResidencyCTAProps) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="w-full bg-volavan-earth py-16 md:py-20 border-t border-volavan-cream/10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center gap-6"
          >
            {isOpenCall ? (
              <>
                <VLink
                  to={`/apply/${residency.slug || ''}`}
                  variant="outline-aqua"
                  size="lg"
                  onClick={() => trackEvent('cta_apply_bottom', {
                    program_name: program.name,
                    year: residency.year,
                    location: 'residency_detail_bottom',
                  })}
                >
                  {t.residencies.applyNow}
                </VLink>
                {callCloseDate && (
                  <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-cream/40">
                    Deadline — {formatDate(callCloseDate)}
                  </p>
                )}
              </>
            ) : isOpenSoon ? (
              <>
                <VButton variant="outline" size="lg" arrow={false} onClick={() => setShowModal(true)}>
                  Notify me when it opens
                </VButton>
                {callOpenDate && (
                  <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-cream/40">
                    Open Call opens — {formatDate(callOpenDate)}
                  </p>
                )}
                {callCloseDate && (
                  <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-cream/30">
                    Deadline — {formatDate(callCloseDate)}
                  </p>
                )}
              </>
            ) : (
              <>
                <VButton variant="disabled" size="lg">
                  {t.residencies.noOpenCall}
                </VButton>
                <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-cream/30">
                  Stay tuned for future opportunities
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <NotifyModal
            programName={program.name}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
