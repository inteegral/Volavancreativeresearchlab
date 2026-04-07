import { Helmet } from 'react-helmet-async';

// Organization Schema for VOLAVAN
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VOLAVAN",
    "url": "https://volavan.it",
    "logo": "https://volavan.it/favicon.svg",
    "description": "Spazio di coliving e coworking rurale creativo in Friuli. Residenze artistiche, workshop e progetti collaborativi immersi nella natura.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IT",
      "addressRegion": "Friuli Venezia Giulia"
    },
    "sameAs": []
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Event Schema for Residency Editions
interface ResidencyEventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  image?: string;
  url: string;
  applicationDeadline?: string;
  capacity?: number;
}

export function ResidencyEventSchema({
  name,
  description,
  startDate,
  endDate,
  location = "Friuli Venezia Giulia, Italia",
  image,
  url,
  applicationDeadline,
  capacity
}: ResidencyEventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    "endDate": endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "VOLAVAN",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IT",
        "addressRegion": "Friuli Venezia Giulia"
      }
    },
    "image": image || `${typeof window !== 'undefined' ? window.location.origin : 'https://volavan.it'}/og-image.png`,
    "organizer": {
      "@type": "Organization",
      "name": "VOLAVAN",
      "url": "https://volavan.it"
    },
    "url": `https://volavan.it${url}`,
    ...(applicationDeadline && {
      "offers": {
        "@type": "Offer",
        "url": `https://volavan.it${url}`,
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "validThrough": applicationDeadline
      }
    }),
    ...(capacity && {
      "maximumAttendeeCapacity": capacity
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Person Schema for Artists
interface ArtistPersonSchemaProps {
  name: string;
  bio?: string;
  image?: string;
  url: string;
  discipline?: string;
  website?: string;
  nationality?: string;
}

export function ArtistPersonSchema({
  name,
  bio,
  image,
  url,
  discipline,
  website,
  nationality
}: ArtistPersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    ...(bio && { "description": bio }),
    ...(image && { "image": image }),
    "url": `https://volavan.it${url}`,
    ...(discipline && { "jobTitle": discipline }),
    ...(website && { "sameAs": [website] }),
    ...(nationality && { "nationality": nationality })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Article Schema for Journal Posts
interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  category?: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author = "VOLAVAN",
  category
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    ...(image && { "image": image }),
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "VOLAVAN",
      "logo": {
        "@type": "ImageObject",
        "url": "https://volavan.it/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://volavan.it${url}`
    },
    ...(category && { "articleSection": category })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://volavan.it${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}