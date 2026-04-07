import { motion } from "motion/react";
import { formatDate } from "../../../lib/sanity";
import { trackEvent } from "../../../hooks/useAnalytics";
import { useLanguage } from "../../../contexts/LanguageContext";
import { VButton, VLink } from "../../../components/ui/VButton";
import type { SanityResidency, SanityProgram } from "../../../lib/sanity";

interface ResidencyCTAProps {
  residency: SanityResidency;
  program: SanityProgram;
  isOpenCall: boolean;
  callCloseDate?: string;
}

export function ResidencyCTA({ residency, program, isOpenCall, callCloseDate }: ResidencyCTAProps) {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-volavan-earth py-24 md:py-32">
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
  );
}
