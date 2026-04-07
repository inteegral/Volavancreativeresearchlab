import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export function SEOHead({
  title,
  description = "VOLAVAN is a creative research lab in rural Friuli. Artist residencies, workshops, and collaborative projects immersed in nature.",
  image,
  url,
  type = 'website',
  article
}: SEOHeadProps) {
  const { language } = useLanguage();
  const locale = language === 'es' ? 'es_ES' : 'en_GB';
  const siteName = "VOLAVAN";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Creative Research Lab`;
  const canonicalUrl = url ? `https://volavan.it${url}` : 'https://volavan.it';
  
  // Default OG image from Sanity CMS
  const ogImage = image || 'https://cdn.sanity.io/images/98dco624/production/ab09c55a4cfa1e5b871683d108314ca7f62ce5f9-1200x630.jpg';

  // Google Analytics 4 (GA4) configuration
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';

  return (
    <Helmet>
      {/* DNS Prefetch & Preconnect for Performance */}
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://cdn.sanity.io" />

      {/* Google Analytics 4 (GA4) */}
      {enableAnalytics && gaMeasurementId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_path: window.location.pathname,
                anonymize_ip: true
              });
            `}
          </script>
        </>
      )}

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Article specific tags */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Italian" />
      <meta name="author" content="VOLAVAN" />
    </Helmet>
  );
}