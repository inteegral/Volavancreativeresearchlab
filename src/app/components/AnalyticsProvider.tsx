import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Google Analytics 4 Provider
 * Loads GA4 script and initializes tracking
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const measurementId = 'G-2KXXYREL2P';
    
    // Check if already loaded
    if (window.gtag) {
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;

    // Configure GA4 after script loads
    script.onload = () => {
      const gtag = window.gtag!;
      gtag('js', new Date());
      gtag('config', measurementId, {
        send_page_view: false, // Manual pageview tracking
        cookie_flags: 'SameSite=None;Secure',
        // Disable automatic video tracking to prevent conflicts with custom YouTube players
        allow_enhanced_conversions: false,
      });
      
      // Dispatch ready event
      window.dispatchEvent(new Event('analytics-ready'));
    };

    // Append script to head
    document.head.appendChild(script);
  }, []);

  return <>{children}</>;
}