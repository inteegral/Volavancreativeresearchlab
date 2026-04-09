// Computed status based on dates
const STATUS = `"status": select(
  !defined(callDates.open) => "upcoming",
  dateTime(now()) < dateTime(callDates.open + "T00:00:00Z") => "upcoming",
  dateTime(now()) <= dateTime(callDates.close + "T00:00:00Z") => "open_call",
  !defined(residencyDates.start) => "registration_open",
  dateTime(now()) < dateTime(residencyDates.start + "T00:00:00Z") => "registration_open",
  dateTime(now()) <= dateTime(residencyDates.end + "T00:00:00Z") => "ongoing",
  "concluded"
)`

// Singletons
export const homeQuery = `*[_type == "home"][0]`
export const aboutQuery = `*[_type == "about"][0]`
export const settingsQuery = `*[_type == "settings"][0]`

// Artists
export const artistsQuery = `*[_type == "artist"] | order(name asc) {
  _id, name, slug, nationality, photo, disciplines, instruments
}`
export const artistBySlugQuery = `*[_type == "artist" && slug.current == $slug][0] {
  _id, name, slug, nationality, photo, bio, disciplines, instruments, links, whyVolavan,
  "residencies": *[_type == "residency" && references(^._id)] {
    _id, slug, year,
    ${STATUS},
    "program": program->{ name, slug, tagline }
  }
}`

// Residency Programs
export const programsQuery = `*[_type == "residencyProgram"] | order(name asc) {
  _id, name, slug, tagline, coverImage, disciplines
}`
export const programBySlugQuery = `*[_type == "residencyProgram" && slug.current == $slug][0] {
  _id, name, slug, tagline, coverImage, gallery,
  disciplines,
  feeAmount, feeIncludes,
  concept, structure, whatWeOffer, requirements, applicationIntro,
  seo,
  "editions": *[_type == "residency" && program._ref == ^._id] | order(year desc) {
    _id, slug, year, coverImage, capacity, residencyDates, callDates,
    ${STATUS},
    "location": location->{ name, city, country },
    "artists": artists[].artist->{ _id, name, slug, photo, nationality }
  }
}`

// Residency Editions
export const editionsQuery = `*[_type == "residency"] | order(year desc) {
  _id, slug, year, coverImage, capacity, residencyDates, callDates,
  ${STATUS},
  "location": location->{ name, city, country },
  "program": program->{ name, slug, tagline, coverImage }
}`
export const editionBySlugQuery = `*[_type == "residency" && slug.current == $slug][0] {
  _id, slug, year, coverImage, gallery, capacity, residencyDates, callDates,
  ${STATUS},
  "location": location->{ name, city, country, coverImage },
  "program": program->{
    _id, name, slug, tagline, coverImage,
    disciplines,
    feeAmount, feeIncludes,
    concept, structure, whatWeOffer, requirements, applicationIntro,
    seo
  },
  "artists": artists[].artist->{ _id, name, slug, photo, nationality, disciplines, bio },
  seo
}`

// Journal
export const journalQuery = `*[_type == "journal" && language == $lang] | order(publishedAt desc) {
  _id, title, slug, publishedAt, coverImage, categories,
  "author": author->{ name, slug, photo }
}`
export const journalBySlugQuery = `*[_type == "journal" && slug.current == $slug && language == $lang][0] {
  _id, title, slug, publishedAt, coverImage, videoUrl, categories, content,
  "author": author->{ name, slug, photo }
}`
