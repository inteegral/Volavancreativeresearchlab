// ============================================================================
// SANITY TYPE DEFINITIONS
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
  whyVolavan?: string;
  photo?: SanityImage;
  links?: ArtistLink[];
  residencies?: SanityResidency[];
}

export interface SanityLocation {
  name: string;
  city?: string;
  country?: string;
  description?: PortableTextBlock[];
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

export interface SanityResidency {
  _id?: string;
  title?: string;
  slug?: string;
  year: number;
  status: 'upcoming' | 'open_call' | 'registration_open' | 'ongoing' | 'concluded';
  disciplines?: string[];
  capacity?: number;
  location?: SanityLocation;
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
  program?: SanityProgram;
  location?: SanityLocation;
  artists?: SanityArtist[] | {
    artist: SanityArtist;
  }[];
}

export interface SanityProgram {
  _id: string;
  name: string;
  slug: string;
  type: 'artistic' | 'retreat';
  tagline?: string;
  disciplines?: string[];
  capacity?: number;
  logo?: SanityImage;
  feeAmount?: number | null;
  feeIncludes?: string;
  concept?: PortableTextBlock[];
  whatWeOffer?: PortableTextBlock[];
  requirements?: PortableTextBlock[];
  applicationIntro?: string;
  heroImage?: SanityImage;
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  seo?: {
    title?: string;
    description?: string;
  };
  editions?: SanityResidency[];
  otherEditions?: {
    year: number;
    status: string;
    slug: string;
    coverImage?: SanityImage;
    startDate?: string;
    endDate?: string;
    artistsCount?: number;
  }[];
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
