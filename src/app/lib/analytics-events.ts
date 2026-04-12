/**
 * Google Analytics 4 Event Tracking Helper
 * 
 * This file contains helper functions for tracking custom events in GA4.
 * Events are automatically sent to Google Analytics when called.
 */

import { trackEvent } from '../hooks/useAnalytics';

/**
 * Track when user starts an application for a residency
 * Call this when user clicks "Apply Now" or opens application form
 */
export function trackApplicationStarted(programName: string, year?: number) {
  trackEvent('application_started', {
    program_name: programName,
    year: year,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when user submits a completed application
 * Call this after successful form submission
 */
export function trackApplicationSubmitted(programName: string, year?: number) {
  trackEvent('application_submitted', {
    program_name: programName,
    year: year,
    timestamp: new Date().toISOString(),
  });
}


/**
 * Track contact form submission
 * Call this after successful contact form submission
 */
export function trackContactFormSubmit(formType: string = 'general') {
  trackEvent('contact_form_submit', {
    form_type: formType,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track file/brochure downloads
 * Call this when user clicks download links
 */
export function trackDownload(fileName: string, fileType: string) {
  trackEvent('download_brochure', {
    file_name: fileName,
    file_type: fileType,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track external link clicks (social media, partner sites)
 * Call this when user clicks important external links
 */
export function trackExternalLinkClick(linkUrl: string, linkText: string) {
  trackEvent('external_link_click', {
    link_url: linkUrl,
    link_text: linkText,
    timestamp: new Date().toISOString(),
  });
}

/**
 * EXAMPLE USAGE:
 * 
 * // In application form component:
 * import { trackApplicationStarted, trackApplicationSubmitted } from '../lib/analytics-events';
 * 
 * function ApplicationForm() {
 *   useEffect(() => {
 *     trackApplicationStarted('Contemporaneo', 2025);
 *   }, []);
 * 
 *   const handleSubmit = async (data) => {
 *     await submitToAPI(data);
 *     trackApplicationSubmitted('Contemporaneo', 2025);
 *   };
 * }
 * 
 * // In download button:
 * import { trackDownload } from '../lib/analytics-events';
 * 
 * <a 
 *   href="/brochure.pdf" 
 *   download
 *   onClick={() => trackDownload('volavan-brochure.pdf', 'pdf')}
 * >
 *   Download Brochure
 * </a>
 * 
 * // In social media links:
 * import { trackExternalLinkClick } from '../lib/analytics-events';
 * 
 * <a 
 *   href="https://instagram.com/volavan" 
 *   target="_blank"
 *   onClick={() => trackExternalLinkClick('https://instagram.com/volavan', 'Instagram')}
 * >
 *   Follow us on Instagram
 * </a>
 */
