import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Sanity Client Configuration (Read-only, public access)
export const sanityClient = createClient({
  projectId: '98dco624',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // ⚠️ TEMPORARILY DISABLED - Testing fresh data without cache
  withCredentials: false, // Disable credentials for public access
  perspective: 'published', // Only fetch published documents (no drafts)
});

// Image URL builder
const builder = createImageUrlBuilder(sanityClient);

/**
 * Helper to generate optimized image URLs from Sanity image references
 * @param source - Sanity image object
 * @returns Image URL builder
 */
export const urlFor = (source: SanityImageSource) => builder.image(source);

/**
 * Get optimized image URL with automatic format and quality
 * @param image - Sanity image object
 * @param width - Optional width
 * @param height - Optional height
 * @param quality - Optional quality (default: 80)
 * @returns Optimized image URL or undefined
 */
export function getImageUrl(
  image: SanityImage | undefined,
  width?: number,
  height?: number,
  quality: number = 80
): string | undefined {
  if (!image) return undefined;
  
  let builder = urlFor(image).auto('format').quality(quality);
  
  if (width) builder = builder.width(width);
  if (height) builder = builder.height(height);
  
  return builder.url();
}

/**
 * Get logo image URL optimized for canvas (forces PNG format)
 * @param image - Sanity image object
 * @param width - Optional width
 * @param height - Optional height
 * @returns PNG image URL or undefined
 */
export function getLogoUrl(
  image: SanityImage | undefined,
  width?: number,
  height?: number
): string | undefined {
  if (!image) return undefined;
  
  let builder = urlFor(image).format('png').quality(100);
  
  // Round dimensions to integers to avoid Sanity CDN issues
  if (width) builder = builder.width(Math.round(width));
  if (height) builder = builder.height(Math.round(height));
  
  return builder.url();
}

/**
 * Generate responsive srcset for Sanity images
 * @param image - Sanity image object
 * @param widths - Array of widths for srcset (default: [320, 640, 960, 1280, 1920])
 * @param quality - Optional quality (default: 80)
 * @returns srcset string
 */
export function getImageSrcSet(
  image: SanityImage | undefined,
  widths: number[] = [320, 640, 960, 1280, 1920],
  quality: number = 80
): string | undefined {
  if (!image) return undefined;
  
  return widths
    .map(width => {
      const url = urlFor(image).auto('format').quality(quality).width(width).url();
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get blur placeholder (LQIP) for Sanity images
 * @param image - Sanity image object
 * @returns Low quality placeholder URL
 */
export function getImageBlurUrl(image: SanityImage | undefined): string | undefined {
  if (!image) return undefined;
  
  return urlFor(image)
    .auto('format')
    .width(20)
    .quality(20)
    .blur(50)
    .url();
}

// ============================================================================
// GROQ QUERIES
// ============================================================================

export const QUERIES = {
  /**
   * Get home page content
   */
  home: `*[_type == "home" && language == $lang][0] {
    heroTitle,
    heroSubtitle,
    introText,
    featureText,
    closingText,
    journalSectionTitle,
    journalSectionSubtitle,
    featuredResidencies[]-> {
      _id,
      year,
      status,
      "slug": slug.current,
      coverImage,
      "startDate": residencyDates.start,
      "endDate": residencyDates.end,
      "program": program-> {
        name,
        tagline,
        location,
        country
      }
    },
    seo
  }`,

  /**
   * Get settings (including media kit password)
   */
  settings: `*[_type == "settings"][0] {
    mediaKitPassword,
    logo,
    defaultSeo {
      ogImage {
        asset-> {
          url
        }
      }
    }
  }`,

  /**
   * Get about page content
   */
  about: `*[_type == "about" && (!defined(language) || language == $lang)][0] {
    title,
    mission,
    history,
    coverImage,
    team[] {
      name,
      role,
      photo,
      bio
    },
    location {
      address,
      city,
      country,
      mapUrl
    },
    seo
  }`,

  /**
   * Get art residencies page content
   */
  residenciesPage: `*[_type == "programsPage" && language == $lang][0] {
    supertitle,
    title,
    introText,
    callToAction,
    seo
  }`,

  /**
   * Get all artistic residency programs (listing page)
   * Returns programs with their editions
   */
  allPrograms: `*[_type == "residencyProgram" && (!defined(language) || language == $lang)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    language,
    tagline,
    disciplines,
    location,
    country,
    logo,
    "allResidencies": *[_type == "residency"] | order(year desc) {
      year,
      status,
      language,
      coverImage,
      "slug": slug.current,
      "startDate": residencyDates.start,
      "endDate": residencyDates.end,
      "programRef": program._ref,
      callDates {
        start,
        end
      }
    }
  }`,

  /**
   * Get single residency edition by slug (NEW - main detail page)
   * @param slug - Edition slug
   */
  residencyBySlug: (slug: string) => `*[_type == "residency" && slug.current == "${slug}"][0] {
    year,
    status,
    capacity,
    coverImage,
    residencyDates,
    callDates,
    gallery,
    seo,
    "slug": slug.current,
    "artists": artists[].artist-> {
      _id,
      name,
      "slug": slug.current,
      photo,
      nationality,
      disciplines,
      instruments,
      bio,
      whyVolavan,
      links[] {
        label,
        url
      }
    },
    "program": program-> {
      _id,
      name,
      "slug": slug.current,
      tagline,
      concept,
      structure,
      structureDetails,
      whatWeOffer,
      requirements,
      applicationIntro,
      disciplines,
      location,
      country,
      feeAmount,
      feeIncludes,
      gallery,
      seo,
      "otherEditions": *[_type == "residency" && program._ref == ^._id && slug.current != "${slug}" && defined(slug.current) && defined(year)] | order(year desc) {
        year,
        status,
        "slug": slug.current,
        coverImage,
        "startDate": residencyDates.start,
        "endDate": residencyDates.end,
        "artistsCount": count(artists[])
      }
    }
  }`,

  /**
   * Get all artistic residencies (legacy - for direct access if needed)
   * Note: program is now always present (required field)
   */
  allResidencies: `*[_type == "residency" && defined(program) && program->type == "artistic"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    year,
    status,
    disciplines,
    location,
    country,
    "startDate": residencyDates.start,
    "endDate": residencyDates.end,
    coverImage,
    "artistsCount": count(artists[]),
    program-> { 
      _id,
      name, 
      "slug": slug.current 
    }
  }`,

  /**
   * Get single residency by slug with artists
   * Note: program is now always present (required field)
   * @param slug - Residency slug
   */
  residencyBySlugLegacy: (slug: string) => `*[_type == "residency" && slug.current == "${slug}" && defined(program) && program->type == "artistic"][0] {
    _id,
    title,
    "slug": slug.current,
    year,
    status,
    disciplines,
    capacity,
    location,
    country,
    "startDate": residencyDates.start,
    "endDate": residencyDates.end,
    "callOpen": callDates.open,
    "callClose": callDates.close,
    feeAmount,
    feeIncludes,
    description,
    whatWeOffer,
    requirements,
    coverImage,
    gallery,
    program-> { 
      _id, 
      name, 
      "slug": slug.current, 
      description
    },
    "artists": artists[] {
      "artist": artist-> {
        _id,
        name,
        "slug": slug.current,
        nationality,
        disciplines,
        instruments,
        bio,
        whyVolavan,
        photo,
        links[] {
          label,
          url
        }
      }
    }
  }`,

  /**
   * Get all artists across all residencies
   * Returns residencies with their artists
   */
  allArtists: `*[_type == "residency" && defined(program)] | order(year desc) {
    _id,
    "title": program->name,
    year,
    "slug": slug.current,
    "artists": artists[defined(artist)] {
      "artist": artist-> {
        _id,
        name,
        "slug": slug.current,
        nationality,
        disciplines,
        instruments,
        bio,
        whyVolavan,
        photo,
        links[] {
          label,
          url
        }
      }
    }
  }`,

  /**
   * Get single artist by slug
   * @param slug - Artist slug
   */
  artistBySlug: (slug: string) => `*[_type == "artist" && slug.current == "${slug}"][0] {
    _id,
    name,
    legalName,
    "slug": slug.current,
    nationality,
    disciplines,
    instruments,
    bio,
    whyVolavan,
    photo,
    links[] {
      label,
      url
    },
    "residencies": *[_type == "residency" && ^._id in artists[].artist._ref] {
      _id,
      slug,
      year,
      status,
      location,
      country,
      coverImage,
      program-> {
        name,
        slug,
        tagline
      }
    }
  }`,

  /**
   * Get all journal posts
   */
  allJournalPosts: `*[_type == "journal" && language == $lang] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    author-> {
      name,
      "slug": slug.current
    },
    categories
  }`,

  /**
   * Get single journal post by slug
   */
  journalPostBySlug: (slug: string) => `*[_type in ["journal", "videoPost"] && slug.current == "${slug}"][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    content,
    coverImage,
    videoUrl,
    author-> {
      _id,
      name,
      "slug": slug.current,
      bio,
      photo
    },
    categories,
    relatedResidency-> {
      _id,
      title,
      "slug": slug.current,
      year
    }
  }`,

  /**
   * Get all video posts
   */
  allVideoPosts: `*[_type == "videoPost" && (!defined(language) || language == $lang)] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    videoId,
    thumbnail,
    startTime,
    endTime,
    categories
  }`,

  /**
   * Get all journal content (articles + videos mixed)
   */
  allJournalContent: `*[_type in ["journal", "videoPost"] && (!defined(language) || language == $lang)] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    videoUrl,
    videoId,
    thumbnail,
    startTime,
    endTime,
    author-> {
      name,
      "slug": slug.current
    },
    categories
  }`,
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  caption?: string;
}

export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: string;
  children: {
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }[];
  markDefs?: any[];
}

export interface ArtistLink {
  label: string;
  url: string;
}

export interface SanityHome {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  featureText?: string;
  closingText?: string;
  journalSectionTitle?: string;
  journalSectionSubtitle?: string;
  featuredResidencies?: Array<{
    _id: string;
    year: number;
    status: string;
    slug: string;
    coverImage?: SanityImage;
    startDate?: string;
    endDate?: string;
    program?: {
      name: string;
      tagline?: string;
      location?: string;
      country?: string;
    };
  }>;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface SanityAbout {
  title: string;
  mission: string;
  history: PortableTextBlock[];
  coverImage?: SanityImage;
  team?: Array<{
    name: string;
    role: string;
    photo?: SanityImage;
    bio?: string;
  }>;
  location?: {
    address?: string;
    city?: string;
    country?: string;
    mapUrl?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface SanityArtResidencies {
  supertitle?: string;
  title?: string;
  introText?: string;
  callToAction?: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface SanityArtist {
  _id: string;
  name: string;
  legalName: string;
  slug: string;
  nationality: string;
  disciplines: string[];
  instruments?: string[];
  bio?: PortableTextBlock[];
  whyVolavan?: string; // Text field in Sanity (not Portable Text)
  photo?: SanityImage;
  links?: ArtistLink[];
  residencies?: SanityResidency[];
}

export interface SanityResidency {
  _id?: string;
  title?: string;
  slug?: string;
  year: number;
  status: 'upcoming' | 'open_call' | 'registration_open' | 'ongoing' | 'concluded';
  disciplines?: string[];
  capacity?: number;
  location?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  residencyDates?: {
    start: string;
    end: string;
  };
  callDates?: {
    open?: string;
    close?: string;
    start?: string;
    end?: string;
  };
  callOpen?: string;
  callClose?: string;
  feeAmount?: number;
  feeIncludes?: string;
  description?: PortableTextBlock[];
  whatWeOffer?: PortableTextBlock[];
  requirements?: PortableTextBlock[];
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  seo?: {
    title?: string;
    description?: string;
  };
  selectedCount?: number;
  program?: SanityProgram; // Can be full program object via reference
  artists?: SanityArtist[] | {
    artist: SanityArtist;
  }[];
}

export interface SanityProgram {
  _id: string;
  name: string;
  slug: string;
  type: 'artistic' | 'retreat';
  tagline?: string; // Hero subtitle
  disciplines?: string[]; // May be empty - fallback to ["Music"] in UI if needed
  capacity?: number; // Typical participants per edition
  location?: string;
  country?: string;
  logo?: SanityImage; // Program-specific logo
  feeAmount?: number | null;
  feeIncludes?: string; // Changed to text in Sanity (multi-line)
  concept?: PortableTextBlock[]; // The "why"
  structure?: PortableTextBlock[]; // How it works
  structureDetails?: {
    format?: string;
  };
  whatWeOffer?: PortableTextBlock[];
  requirements?: PortableTextBlock[]; // What to submit
  applicationIntro?: string; // Changed to text in Sanity (multi-line)
  heroImage?: SanityImage; // Hero image from latest edition's coverImage
  coverImage?: SanityImage; // @deprecated - Use heroImage instead. Will be removed.
  gallery?: SanityImage[]; // ✅ Program-level gallery (general, conceptual images)
  seo?: {
    title?: string;
    description?: string;
  };
  editions?: SanityResidency[]; // All editions of this program
  otherEditions?: {
    year: number;
    status: string;
    slug: string;
    coverImage?: SanityImage;
    startDate?: string;
    endDate?: string;
    artistsCount?: number;
  }[]; // Other editions (excluding current)
  latestEdition?: {
    year: number;
    status: string;
    startDate: string;
    endDate: string;
    callClose?: string;
    gallery?: SanityImage[];
    selectedArtists?: SanityArtist[];
  };
}

export interface SanityJournalPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  content?: PortableTextBlock[];
  coverImage?: SanityImage;
  videoUrl?: string;
  author?: {
    _id: string;
    name: string;
    slug: string;
    bio?: PortableTextBlock[];
    photo?: SanityImage;
  };
  categories?: string[];
  relatedResidency?: {
    _id: string;
    title: string;
    slug: string;
    year: number;
  };
}

export interface SanityVideoPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  videoId: string;
  thumbnail: SanityImage;
  startTime: number;
  endTime: number;
  categories?: string[];
  relatedResidency?: {
    _id: string;
    title: string;
    slug: string;
    year: number;
  };
}

export interface SanityJournalContent {
  _id: string;
  _type: 'journal' | 'videoPost';
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  coverImage?: SanityImage;
  videoUrl?: string;
  videoId?: string;
  thumbnail?: SanityImage;
  startTime?: number;
  endTime?: number;
  author?: {
    _id: string;
    name: string;
    slug: string;
    bio?: PortableTextBlock[];
    photo?: SanityImage;
  };
  categories?: string[];
  relatedResidency?: {
    _id: string;
    title: string;
    slug: string;
    year: number;
  };
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

export const sanityService = {
  /**
   * Fetch home page content
   */
  async getHome(lang: string = 'en'): Promise<SanityHome | null> {
    try {
      const data = await sanityClient.fetch<SanityHome>(
        QUERIES.home,
        { lang }
      );
      return data || null;
    } catch (error) {
      console.error('❌ Error fetching home page from Sanity:', error);
      return null;
    }
  },

  /**
   * Fetch settings (including media kit password)
   */
  async getSettings(): Promise<{ mediaKitPassword: string; logo?: SanityImage; defaultSeo?: { ogImage?: { asset?: { url?: string } } } } | null> {
    try {
      const data = await sanityClient.fetch<{ mediaKitPassword: string; logo?: SanityImage; defaultSeo?: { ogImage?: { asset?: { url?: string } } } }>(
        QUERIES.settings
      );
      return data || null;
    } catch (error) {
      console.error('❌ Error fetching settings from Sanity:', error);
      return null;
    }
  },

  /**
   * Fetch about page content
   */
  async getAbout(lang: string = 'en'): Promise<SanityAbout | null> {
    try {
      const data = await sanityClient.fetch<SanityAbout>(
        QUERIES.about,
        { lang }
      );
      return data || null;
    } catch (error) {
      console.error('❌ Error fetching about page from Sanity:', error);
      return null;
    }
  },

  /**
   * Fetch art residencies page content
   */
  async getArtResidenciesPage(lang: string = 'en'): Promise<SanityArtResidencies | null> {
    try {
      
      const data = await sanityClient.fetch<SanityArtResidencies>(
        QUERIES.residenciesPage,
        { lang }
      );

      // Fallback to English if no data in requested language
      if (!data && lang !== 'en') {
        const fallbackData = await sanityClient.fetch<SanityArtResidencies>(
          QUERIES.residenciesPage,
          { lang: 'en' }
        );
        return fallbackData || null;
      }
      
      return data || null;
    } catch (error) {
      console.error('❌ Error fetching art residencies page from Sanity:', error);
      return null;
    }
  },

  /**
   * Fetch all artistic residencies
   */
  async getAllResidencies(): Promise<SanityResidency[]> {
    try {
      const residencies = await sanityClient.fetch<SanityResidency[]>(QUERIES.allResidencies);
      return residencies || [];
    } catch (error) {
      console.error('❌ Error fetching residencies from Sanity:', error);
      return [];
    }
  },

  /**
   * Fetch single residency by slug
   */
  async getResidencyBySlug(slug: string): Promise<SanityResidency | null> {
    try {
      const residency = await sanityClient.fetch<SanityResidency>(
        QUERIES.residencyBySlug(slug)
      );
      return residency || null;
    } catch (error) {
      console.error(`❌ Error fetching residency "${slug}" from Sanity:`, error);
      return null;
    }
  },

  /**
   * Fetch all selected artists across all residencies
   */
  async getAllSelectedArtists(): Promise<SanityResidency[]> {
    try {
      const residencies = await sanityClient.fetch<SanityResidency[]>(
        QUERIES.allArtists
      );
      return residencies || [];
    } catch (error) {
      console.error('❌ Error fetching artists from Sanity:', error);
      return [];
    }
  },

  /**
   * Fetch single artist by slug
   */
  async getArtistBySlug(slug: string): Promise<SanityArtist | null> {
    try {
      const artist = await sanityClient.fetch<SanityArtist>(
        QUERIES.artistBySlug(slug)
      );
      return artist || null;
    } catch (error) {
      console.error(`❌ Error fetching artist "${slug}" from Sanity:`, error);
      return null;
    }
  },

  /**
   * Get all artistic programs
   */
  getAllPrograms: async (lang: string = 'en'): Promise<SanityProgram[]> => {
    
    // Single GROQ query with select() to handle both EN and ES
    const programs = await sanityClient.fetch<any[]>(
      `*[_type == "residencyProgram" && language == $lang] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        language,
        tagline,
        disciplines,
        location,
        country,
        logo,
        "editions": select(
          language == "en" => *[_type == "residency" && program._ref == ^._id] | order(year desc) {
            _id,
            year,
            "slug": slug.current,
            coverImage,
            "startDate": residencyDates.start,
            "endDate": residencyDates.end,
            callDates
          },
          *[_type == "translation.metadata" && references(^._id)][0]
            .translations[_key == "en"][0]
            .value-> {
              "e": *[_type == "residency" && program._ref == ^._id] | order(year desc) {
                _id,
                year,
                "slug": slug.current,
                coverImage,
                "startDate": residencyDates.start,
                "endDate": residencyDates.end,
                callDates
              }
            }.e
        )
      }`,
      { lang }
    );
    
    if (!programs || programs.length === 0) {
      return [];
    }
    
    
    // Add heroImage from latest edition
    const processedPrograms = programs.map(program => {
      const heroImage = program.editions?.find((e: any) => e.coverImage)?.coverImage;
      
      return {
        ...program,
        heroImage,
      };
    });
    
    return processedPrograms;
  },

  /**
   * Get single program by slug with all editions
   */
  getProgramBySlug: async (slug: string, lang: string = 'en'): Promise<SanityProgram | null> => {
    const result = await sanityClient.fetch<SanityProgram>(
      QUERIES.programBySlug(slug),
      { lang }
    );
    return result;
  },

  /**
   * Fetch all journal posts
   */
  async getAllJournalPosts(lang: string = 'en'): Promise<SanityJournalPost[]> {
    try {
      const posts = await sanityClient.fetch<SanityJournalPost[]>(
        QUERIES.allJournalPosts,
        { lang }
      );
      if (posts && posts.length > 0) {
      } else {
      }
      return posts || [];
    } catch (error) {
      console.error('❌ Error fetching journal posts from Sanity:', error);
      return [];
    }
  },

  /**
   * Fetch single journal post by slug
   */
  async getJournalPostBySlug(slug: string, lang: string = 'en'): Promise<SanityJournalPost | null> {
    try {
      const post = await sanityClient.fetch<SanityJournalPost>(
        QUERIES.journalPostBySlug(slug),
        { lang }
      );
      return post || null;
    } catch (error) {
      console.error(`❌ Error fetching journal post "${slug}" from Sanity:`, error);
      return null;
    }
  },

  /**
   * Fetch all video posts
   */
  async getAllVideoPosts(lang: string = 'en'): Promise<SanityVideoPost[]> {
    try {
      const posts = await sanityClient.fetch<SanityVideoPost[]>(
        QUERIES.allVideoPosts,
        { lang }
      );
      if (posts && posts.length > 0) {
      } else {
      }
      return posts || [];
    } catch (error) {
      console.error('❌ Error fetching video posts from Sanity:', error);
      return [];
    }
  },

  /**
   * Fetch all journal content (articles + videos mixed)
   */
  async getAllJournalContent(lang: string = 'en'): Promise<SanityJournalContent[]> {
    try {
      const content = await sanityClient.fetch<SanityJournalContent[]>(
        QUERIES.allJournalContent,
        { lang }
      );
      
      // Fallback to English if no content in requested language
      if ((!content || content.length === 0) && lang !== 'en') {
        const fallbackContent = await sanityClient.fetch<SanityJournalContent[]>(
          QUERIES.allJournalContent,
          { lang: 'en' }
        );
        return fallbackContent || [];
      }
      
      if (content && content.length > 0) {
      }
      if (content && content.length > 0) {
      }
      return content || [];
    } catch (error) {
      console.error('❌ Error fetching journal content from Sanity:', error);
      return [];
    }
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date to readable string
 * @param dateString - ISO date string
 * @returns Formatted date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get status label for residency
 */
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

/**
 * Get status color for residency
 */
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

/**
 * Calculate dynamic status from dates
 * @param edition - Residency edition with dates
 * @returns Calculated status
 */
export function calculateResidencyStatus(edition: {
  residencyDates?: { start: string; end: string };
  startDate?: string;
  endDate?: string;
  callDates?: { open?: string; close?: string; start?: string; end?: string };
}): 'ongoing' | 'open_call' | 'upcoming' | 'open_call_soon' | null {
  if (!edition) return null;
  
  const now = new Date();
  
  // Normalize dates from both possible structures
  const residencyStart = edition.residencyDates?.start || edition.startDate;
  const residencyEnd = edition.residencyDates?.end || edition.endDate;
  // Support both old (open/close) and new (start/end) callDates structure
  const callOpen = edition.callDates?.open || edition.callDates?.start;
  const callClose = edition.callDates?.close || edition.callDates?.end;

  // 1. Check if residency is ongoing (NOW)
  if (residencyStart && residencyEnd) {
    const start = new Date(residencyStart);
    const end = new Date(residencyEnd);
    if (now >= start && now <= end) {
      return 'ongoing';
    }
  }

  // 2. Check if open call is active (NOW) - only if callDates exist
  if (callOpen && callClose) {
    const open = new Date(callOpen);
    const close = new Date(callClose);
    if (now >= open && now <= close) {
      return 'open_call';
    }
  }

  // 3. Check if upcoming (call closed, residency in future)
  if (callClose && residencyStart) {
    const callCloseDate = new Date(callClose);
    const residencyStartDate = new Date(residencyStart);
    if (callCloseDate < now && now < residencyStartDate) {
      return 'upcoming';
    }
  }

  // 3b. Check if upcoming (call not yet open, residency in future)
  if (callOpen && residencyStart) {
    const callOpenDate = new Date(callOpen);
    const residencyStartDate = new Date(residencyStart);
    if (now < callOpenDate && now < residencyStartDate) {
      return 'upcoming';
    }
  }

  // 4. Check if open call soon (no callDates, residency in future)
  if (!edition.callDates && residencyStart) {
    const residencyStartDate = new Date(residencyStart);
    if (now < residencyStartDate) {
      return 'open_call_soon';
    }
  }

  return null;
}

/**
 * Extracts YouTube video ID from various URL formats
 * Supported formats:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * @param url - YouTube URL
 * @returns Video ID or null
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // Match youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];
  
  // Match youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];
  
  // Match youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) return embedMatch[1];
  
  return null;
}

/**
 * Gets YouTube video thumbnail URL from video URL
 * Returns high quality thumbnail that is guaranteed to exist
 * @param videoUrl - YouTube video URL
 * @returns Thumbnail URL or null
 */
export function getYouTubeThumbnail(videoUrl: string | undefined): string | null {
  if (!videoUrl) return null;
  
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;
  
  // Use sddefault (640x480) for better quality while maintaining compatibility
  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
}