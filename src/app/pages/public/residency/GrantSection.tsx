import { motion } from "motion/react";

interface Grant {
  enabled?: boolean;
  provider?: string;
  intro?: string;
  paymentNote?: string;
  dailyAllowance?: number;
  days?: number;
  travelShort?: number;
  travelLong?: number;
  distanceThresholdKm?: number;
  topups?: { label: string; amount: number }[];
  accessibilityNote?: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-volavan-cream/8">
      <span className="font-['Manrope'] text-sm text-volavan-cream/60">{label}</span>
      <span className="font-['Manrope'] text-sm text-volavan-cream">{value}</span>
    </div>
  );
}

function TableRow({ cells }: { cells: string[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 py-3 border-b border-volavan-cream/8">
      {cells.map((cell, i) => (
        <span key={i} className={`font-['Manrope'] text-xs ${i === 0 ? 'text-volavan-cream/60' : 'text-volavan-cream text-right'}`}>
          {cell}
        </span>
      ))}
    </div>
  );
}

export function GrantSection({ grant }: { grant: Grant }) {
  const {
    provider, intro, paymentNote,
    dailyAllowance, days, travelShort, travelLong,
    distanceThresholdKm = 5000, topups, accessibilityNote,
  } = grant;

  const total = (dailyAllowance ?? 0) * (days ?? 0);
  const totalShort = total + (travelShort ?? 0);
  const totalLong = total + (travelLong ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-16"
    >
      {/* Header */}
      <div>
        {provider && (
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua/50 mb-3">
            {provider}
          </p>
        )}
        <h2 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-cream mb-6">
          Financial Support for Residents
        </h2>
        {intro && (
          <p className="font-['Manrope'] text-sm text-volavan-cream/60 leading-relaxed">
            {intro}
          </p>
        )}
        {paymentNote && (
          <p className="font-['Manrope'] text-xs text-volavan-aqua/60 mt-4 leading-relaxed border-l border-volavan-aqua/20 pl-4">
            {paymentNote}
          </p>
        )}
      </div>

      {/* Daily Allowance */}
      {dailyAllowance != null && days != null && (
        <div>
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-cream/30 mb-4">
            Daily Allowance
          </p>
          <Row label={`€${dailyAllowance} per day`} value={`Total for ${days} days: €${total}`} />
        </div>
      )}

      {/* Travel Allowance */}
      {(travelShort != null || travelLong != null) && (
        <div>
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-cream/30 mb-4">
            Travel Allowance
          </p>
          {travelShort != null && (
            <Row label={`Distances under ${distanceThresholdKm.toLocaleString()} km`} value={`€${travelShort}`} />
          )}
          {travelLong != null && (
            <Row label={`Distances over ${distanceThresholdKm.toLocaleString()} km`} value={`€${travelLong}`} />
          )}
          <p className="font-['Manrope'] text-xs text-volavan-cream/35 mt-3 leading-relaxed">
            Distance is calculated automatically in the application form, based on a one-way straight line between your city of residence and the residency location.
          </p>
        </div>
      )}

      {/* Estimated Total */}
      {dailyAllowance != null && days != null && (travelShort != null || travelLong != null) && (
        <div>
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-cream/30 mb-4">
            Estimated Total ({days} days)
          </p>
          <div className="grid grid-cols-4 gap-2 pb-2 border-b border-volavan-cream/20">
            {['Distance', 'Daily', 'Travel', 'Total'].map((h) => (
              <span key={h} className="font-['Manrope'] text-[9px] uppercase tracking-[0.15em] text-volavan-cream/30">{h}</span>
            ))}
          </div>
          {travelShort != null && (
            <TableRow cells={[`Under ${distanceThresholdKm.toLocaleString()} km`, `€${total}`, `€${travelShort}`, `€${totalShort}`]} />
          )}
          {travelLong != null && (
            <TableRow cells={[`Over ${distanceThresholdKm.toLocaleString()} km`, `€${total}`, `€${travelLong}`, `€${totalLong}`]} />
          )}
        </div>
      )}

      {/* Top-ups */}
      {topups && topups.length > 0 && (
        <div>
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-cream/30 mb-4">
            Additional Top-ups (if applicable)
          </p>
          <div className="space-y-0">
            {topups.map((t, i) => (
              <Row key={i} label={t.label} value={`€${t.amount}`} />
            ))}
          </div>
        </div>
      )}

      {/* Accessibility */}
      {accessibilityNote && (
        <div>
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-cream/30 mb-4">
            Accessibility Support
          </p>
          <p className="font-['Manrope'] text-sm text-volavan-cream/60 leading-relaxed whitespace-pre-line">
            {accessibilityNote}
          </p>
        </div>
      )}
    </motion.div>
  );
}
