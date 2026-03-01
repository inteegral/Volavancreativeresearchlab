import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Track custom events in Google Analytics
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Track pageviews automatically on route change
 */
export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    let hasTracked = false; // Prevent duplicate tracking

    const trackPageview = () => {
      // Prevent duplicate tracking in same cycle
      if (hasTracked) {
        return;
      }

      if (typeof window !== 'undefined' && window.gtag) {
        const pageData = {
          page_path: location.pathname + location.search,
          page_location: window.location.href,
        };
        window.gtag('event', 'page_view', pageData);
        hasTracked = true; // Mark as tracked
      }
    };

    // Try immediately
    trackPageview();

    // If gtag not ready, wait for it
    if (!window.gtag) {
      // Listen for custom event from AnalyticsProvider
      const handleAnalyticsReady = () => {
        if (!hasTracked) {
          trackPageview();
        }
      };
      
      window.addEventListener('analytics-ready', handleAnalyticsReady);
      
      // Retry after delay only if not tracked yet
      const retryTimer = setTimeout(() => {
        if (window.gtag && !hasTracked) {
          trackPageview();
        }
      }, 1000);

      return () => {
        window.removeEventListener('analytics-ready', handleAnalyticsReady);
        clearTimeout(retryTimer);
      };
    }
  }, [location.pathname, location.search]);
}