import useSWR from 'swr';
import { useLanguage } from '../contexts/LanguageContext';
import { sanityService } from '../lib/sanity';
import type {
  SanityHome,
  SanityAbout,
  SanityArtResidencies,
  SanityResidency,
  SanityProgram,
  SanityArtist,
  SanityJournalContent,
  SanityJournalPost,
} from '../lib/sanity';

/**
 * SWR Hooks for Sanity CMS with automatic caching and revalidation
 */

export function useSettings() {
  const { data, error, isLoading } = useSWR(
    'settings',
    () => sanityService.getSettings(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    settings: data,
    isLoading,
    isError: error,
  };
}

export function useHome() {
  const { language } = useLanguage();
  const { data, error, isLoading } = useSWR(
    ['home', language],
    () => sanityService.getHome(language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    home: data,
    isLoading,
    isError: error,
  };
}

export function useAbout() {
  const { language } = useLanguage();
  const { data, error, isLoading } = useSWR(
    ['about', language],
    () => sanityService.getAbout(language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    about: data,
    isLoading,
    isError: error,
  };
}

export function useResidenciesPage() {
  const { language } = useLanguage();
  const { data, error, isLoading } = useSWR(
    ['residenciesPage', language],
    () => sanityService.getArtResidenciesPage(language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    page: data,
    isLoading,
    isError: error,
  };
}

export function useAllPrograms() {
  const { language } = useLanguage();
  const { data, error, isLoading } = useSWR(
    ['allPrograms', language],
    () => sanityService.getAllPrograms(language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    programs: data || [],
    isLoading,
    isError: error,
  };
}

export function useResidency(slug: string | undefined) {
  const { data, error, isLoading } = useSWR(
    slug ? ['residency', slug] : null,
    () => slug ? sanityService.getResidencyBySlug(slug) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    residency: data,
    isLoading,
    isError: error,
  };
}

export function useAllArtists() {
  const { data, error, isLoading } = useSWR(
    'allArtists',
    () => sanityService.getAllSelectedArtists(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    residencies: data || [],
    isLoading,
    isError: error,
  };
}

export function useArtist(slug: string | undefined) {
  const { data, error, isLoading } = useSWR(
    slug ? ['artist', slug] : null,
    () => slug ? sanityService.getArtistBySlug(slug) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    artist: data,
    isLoading,
    isError: error,
  };
}

export function useJournalContent() {
  const { language } = useLanguage();
  const { data, error, isLoading } = useSWR(
    ['journalContent', language],
    () => sanityService.getAllJournalContent(language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    content: data || [],
    isLoading,
    isError: error,
  };
}

export function useJournalPost(slug: string | undefined) {
  const { language } = useLanguage();
  const { data, error, isLoading } = useSWR(
    slug ? ['journalPost', slug, language] : null,
    () => slug ? sanityService.getJournalPostBySlug(slug, language) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    post: data,
    isLoading,
    isError: error,
  };
}