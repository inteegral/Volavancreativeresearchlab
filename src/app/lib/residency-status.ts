export type ResidencyStatus =
  | 'upcoming'
  | 'open_call'
  | 'under_selection'
  | 'in_residence'
  | 'completed';

export interface StatusBadge {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

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

  // Under selection (call closed, residency not yet started)
  if (callDates?.close && now > new Date(callDates.close)) return 'under_selection';

  // Open call
  if (callDates?.open && callDates?.close) {
    if (now >= new Date(callDates.open) && now <= new Date(callDates.close)) return 'open_call';
  }

  // Default: upcoming
  return 'upcoming';
}

export function getStatusBadge(status: ResidencyStatus, year?: number): StatusBadge {
  switch (status) {
    case 'open_call':
      return { label: 'Open Call', color: '#B5DAD9', bgColor: 'bg-volavan-aqua/15', borderColor: 'border-volavan-aqua/40' };
    case 'under_selection':
      return { label: 'Under Selection', color: '#F5F5F0', bgColor: 'bg-volavan-cream/10', borderColor: 'border-volavan-cream/30' };
    case 'in_residence':
      return { label: 'In Residence', color: '#B5DAD9', bgColor: 'bg-volavan-aqua/15', borderColor: 'border-volavan-aqua/40' };
    case 'completed':
      return { label: year ? `Edition ${year}` : 'Completed', color: '#F5F5F0', bgColor: 'bg-volavan-cream/5', borderColor: 'border-volavan-cream/20' };
    case 'upcoming':
    default:
      return { label: 'Upcoming', color: '#F5F5F0', bgColor: 'bg-volavan-cream/10', borderColor: 'border-volavan-cream/30' };
  }
}
