export type ResidencyStatus =
  | 'upcoming'
  | 'open_soon'
  | 'open_call'
  | 'reviewing'
  | 'in_residence'
  | 'completed';

export interface StatusBadge {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;

export function getStatus(edition: {
  callDates?: { open?: string; close?: string };
  residencyDates?: { start?: string; end?: string };
} | null | undefined): ResidencyStatus {
  if (!edition) return 'upcoming';

  const now = new Date();
  const { callDates, residencyDates } = edition;

  // Completed
  if (residencyDates?.end && now > new Date(residencyDates.end)) return 'completed';

  // In residence
  if (residencyDates?.start && residencyDates?.end) {
    if (now >= new Date(residencyDates.start) && now <= new Date(residencyDates.end)) return 'in_residence';
  }

  // Reviewing (call closed, residency not yet started)
  if (callDates?.close && now > new Date(callDates.close)) {
    if (residencyDates?.start && now < new Date(residencyDates.start)) return 'reviewing';
    return 'completed';
  }

  // Open call
  if (callDates?.open && callDates?.close) {
    if (now >= new Date(callDates.open) && now <= new Date(callDates.close)) return 'open_call';
  }

  // Open soon (call opens within 30 days)
  if (callDates?.open) {
    const openDate = new Date(callDates.open);
    if (openDate > now && openDate.getTime() - now.getTime() <= DAYS_30_MS) return 'open_soon';
  }

  return 'upcoming';
}

export function getStatusBadge(status: ResidencyStatus): StatusBadge {
  switch (status) {
    case 'open_soon':
      return { label: 'Open Soon', color: '#B5DAD9', bgColor: 'bg-volavan-aqua/10', borderColor: 'border-volavan-aqua/30' };
    case 'open_call':
      return { label: 'Open Call', color: '#B5DAD9', bgColor: 'bg-volavan-aqua/15', borderColor: 'border-volavan-aqua/40' };
    case 'reviewing':
      return { label: 'Reviewing Applications', color: '#F5F5F0', bgColor: 'bg-volavan-cream/10', borderColor: 'border-volavan-cream/30' };
    case 'in_residence':
      return { label: 'In Residence', color: '#B5DAD9', bgColor: 'bg-volavan-aqua/15', borderColor: 'border-volavan-aqua/40' };
    case 'completed':
      return { label: 'Completed', color: '#F5F5F0', bgColor: 'bg-volavan-cream/5', borderColor: 'border-volavan-cream/20' };
    case 'upcoming':
    default:
      return { label: 'Upcoming', color: '#F5F5F0', bgColor: 'bg-volavan-cream/10', borderColor: 'border-volavan-cream/30' };
  }
}
