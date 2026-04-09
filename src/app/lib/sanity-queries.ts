// ============================================================================
// GROQ QUERIES
// ============================================================================

export const QUERIES = {
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

  residenciesPage: `*[_type == "programsPage" && language == $lang][0] {
    supertitle,
    title,
    introText,
    callToAction,
    seo
  }`,

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

  allProgramsWithEditions: `*[_type == "residencyProgram" && (!defined(language) || language == $lang)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    language,
    tagline,
    disciplines,
    location,
    country,
    logo,
    "editions": *[_type == "residency" && program._ref == ^._id] | order(year desc) {
      _id,
      year,
      "slug": slug.current,
      coverImage,
      "startDate": residencyDates.start,
      "endDate": residencyDates.end,
      callDates
    }
  }`,

  programBySlug: (slug: string) => `*[_type == "residencyProgram" && slug.current == "${slug}"][0] {
    _id,
    name,
    "slug": slug.current,
    language,
    tagline,
    disciplines,
    location,
    country,
    logo,
    "editions": *[_type == "residency" && program._ref == ^._id] | order(year desc) {
      _id,
      year,
      "slug": slug.current,
      coverImage,
      "startDate": residencyDates.start,
      "endDate": residencyDates.end,
      callDates
    }
  }`,

  residencyBySlug: (slug: string) => `*[_type == "residency" && slug.current == "${slug}"][0] {
    year,
    status,
    capacity,
    coverImage,
    residencyDates,
    callDates,
    gallery,
    seo,
    structure,
    "slug": slug.current,
    "location": location-> {
      name,
      description,
      gallery
    },
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
