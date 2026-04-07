import { sanityClient } from './sanity-client';
import { QUERIES } from './sanity-queries';
import type {
  SanityHome,
  SanityAbout,
  SanityArtResidencies,
  SanityResidency,
  SanityProgram,
  SanityArtist,
  SanityJournalPost,
  SanityVideoPost,
  SanityJournalContent,
  SanityImage,
} from './sanity-types';

export const sanityService = {
  async getHome(lang: string = 'en'): Promise<SanityHome | null> {
    try {
      const data = await sanityClient.fetch<SanityHome>(QUERIES.home, { lang });
      return data || null;
    } catch (error) {
      console.error('❌ Error fetching home page from Sanity:', error);
      return null;
    }
  },

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

  async getAbout(lang: string = 'en'): Promise<SanityAbout | null> {
    try {
      const data = await sanityClient.fetch<SanityAbout>(QUERIES.about, { lang });
      return data || null;
    } catch (error) {
      console.error('❌ Error fetching about page from Sanity:', error);
      return null;
    }
  },

  async getArtResidenciesPage(lang: string = 'en'): Promise<SanityArtResidencies | null> {
    try {
      const data = await sanityClient.fetch<SanityArtResidencies>(QUERIES.residenciesPage, { lang });
      if (!data && lang !== 'en') {
        const fallbackData = await sanityClient.fetch<SanityArtResidencies>(QUERIES.residenciesPage, { lang: 'en' });
        return fallbackData || null;
      }
      return data || null;
    } catch (error) {
      console.error('❌ Error fetching art residencies page from Sanity:', error);
      return null;
    }
  },

  async getAllResidencies(): Promise<SanityResidency[]> {
    try {
      const residencies = await sanityClient.fetch<SanityResidency[]>(QUERIES.allResidencies);
      return residencies || [];
    } catch (error) {
      console.error('❌ Error fetching residencies from Sanity:', error);
      return [];
    }
  },

  async getResidencyBySlug(slug: string): Promise<SanityResidency | null> {
    try {
      const residency = await sanityClient.fetch<SanityResidency>(QUERIES.residencyBySlug(slug));
      return residency || null;
    } catch (error) {
      console.error(`❌ Error fetching residency "${slug}" from Sanity:`, error);
      return null;
    }
  },

  async getAllSelectedArtists(): Promise<SanityResidency[]> {
    try {
      const residencies = await sanityClient.fetch<SanityResidency[]>(QUERIES.allArtists);
      return residencies || [];
    } catch (error) {
      console.error('❌ Error fetching artists from Sanity:', error);
      return [];
    }
  },

  async getArtistBySlug(slug: string): Promise<SanityArtist | null> {
    try {
      const artist = await sanityClient.fetch<SanityArtist>(QUERIES.artistBySlug(slug));
      return artist || null;
    } catch (error) {
      console.error(`❌ Error fetching artist "${slug}" from Sanity:`, error);
      return null;
    }
  },

  getAllPrograms: async (lang: string = 'en'): Promise<SanityProgram[]> => {
    const programs = await sanityClient.fetch<any[]>(
      `*[_type == "residencyProgram" && (!defined(language) || language == $lang)] | order(name asc) {
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
          language == "en" || !defined(language) => *[_type == "residency" && program._ref == ^._id] | order(year desc) {
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

    if (!programs || programs.length === 0) return [];

    return programs.map(program => ({
      ...program,
      heroImage: program.editions?.find((e: any) => e.coverImage)?.coverImage,
    }));
  },

  getProgramBySlug: async (slug: string, lang: string = 'en'): Promise<SanityProgram | null> => {
    const result = await sanityClient.fetch<SanityProgram>(
      (QUERIES as any).programBySlug?.(slug),
      { lang }
    );
    return result;
  },

  async getAllJournalPosts(lang: string = 'en'): Promise<SanityJournalPost[]> {
    try {
      const posts = await sanityClient.fetch<SanityJournalPost[]>(QUERIES.allJournalPosts, { lang });
      return posts || [];
    } catch (error) {
      console.error('❌ Error fetching journal posts from Sanity:', error);
      return [];
    }
  },

  async getJournalPostBySlug(slug: string, lang: string = 'en'): Promise<SanityJournalPost | null> {
    try {
      const post = await sanityClient.fetch<SanityJournalPost>(QUERIES.journalPostBySlug(slug), { lang });
      return post || null;
    } catch (error) {
      console.error(`❌ Error fetching journal post "${slug}" from Sanity:`, error);
      return null;
    }
  },

  async getAllVideoPosts(lang: string = 'en'): Promise<SanityVideoPost[]> {
    try {
      const posts = await sanityClient.fetch<SanityVideoPost[]>(QUERIES.allVideoPosts, { lang });
      return posts || [];
    } catch (error) {
      console.error('❌ Error fetching video posts from Sanity:', error);
      return [];
    }
  },

  async getAllJournalContent(lang: string = 'en'): Promise<SanityJournalContent[]> {
    try {
      const content = await sanityClient.fetch<SanityJournalContent[]>(QUERIES.allJournalContent, { lang });

      if ((!content || content.length === 0) && lang !== 'en') {
        const fallback = await sanityClient.fetch<SanityJournalContent[]>(QUERIES.allJournalContent, { lang: 'en' });
        return fallback || [];
      }

      return content || [];
    } catch (error) {
      console.error('❌ Error fetching journal content from Sanity:', error);
      return [];
    }
  },
};
