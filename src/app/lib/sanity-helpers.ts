import type { SanityResidency } from './sanity-types';

// ============================================================================
// DATE & STATUS HELPERS
// ============================================================================

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getStatusLabel(status: SanityResidency['status']): string {
  const labels: Record<SanityResidency['status'], string> = {
    upcoming: 'Upcoming',
    open_call: 'Open Call',
    registration_open: 'Registration Open',
    ongoing: 'Ongoing',
    concluded: 'Concluded',
  };
  return labels[status] || status;
}

export function getStatusColor(status: SanityResidency['status']): string {
  const colors: Record<SanityResidency['status'], string> = {
    upcoming: '#B5DAD9',
    open_call: '#F5A623',
    registration_open: '#7ED321',
    ongoing: '#4A90E2',
    concluded: '#9B9B9B',
  };
  return colors[status] || '#9B9B9B';
}

export function calculateResidencyStatus(edition: {
  residencyDates?: { start: string; end: string };
  startDate?: string;
  endDate?: string;
  callDates?: { open?: string; close?: string; start?: string; end?: string };
}): 'ongoing' | 'open_call' | 'upcoming' | 'open_call_soon' | null {
  if (!edition) return null;

  const now = new Date();

  const residencyStart = edition.residencyDates?.start || edition.startDate;
  const residencyEnd = edition.residencyDates?.end || edition.endDate;
  const callOpen = edition.callDates?.open || edition.callDates?.start;
  const callClose = edition.callDates?.close || edition.callDates?.end;

  if (residencyStart && residencyEnd) {
    const start = new Date(residencyStart);
    const end = new Date(residencyEnd);
    if (now >= start && now <= end) return 'ongoing';
  }

  if (callOpen && callClose) {
    const open = new Date(callOpen);
    const close = new Date(callClose);
    if (now >= open && now <= close) return 'open_call';
  }

  if (callClose && residencyStart) {
    const callCloseDate = new Date(callClose);
    const residencyStartDate = new Date(residencyStart);
    if (callCloseDate < now && now < residencyStartDate) return 'upcoming';
  }

  if (callOpen && residencyStart) {
    const callOpenDate = new Date(callOpen);
    const residencyStartDate = new Date(residencyStart);
    if (now < callOpenDate && now < residencyStartDate) return 'upcoming';
  }

  if (!edition.callDates && residencyStart) {
    const residencyStartDate = new Date(residencyStart);
    if (now < residencyStartDate) return 'open_call_soon';
  }

  return null;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
}

export function getYouTubeThumbnail(videoUrl: string | undefined): string | null {
  if (!videoUrl) return null;
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
}
