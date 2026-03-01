# 📝 Esempio Contenuto per +-SON

Questo documento mostra come popolare Sanity con i contenuti reali di +-SON.

---

## 🎵 residencyProgram: "+-SON"

```js
{
  name: "+-SON",
  slug: { current: "son" },
  type: "artistic",
  tagline: "Experimental Co-Creation Music Residency",
  
  disciplines: ["Music", "Sound Art", "Experimental"],
  capacity: 8,
  location: "Figueiró das Donas",
  country: "Portugal",
  
  feeAmount: 350,
  feeIncludes: `Accommodation in shared rooms
All meals (breakfast, lunch, dinner)
Access to creative spaces
Final presentation venue`,

  // CONCEPT
  concept: [
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: 'This residency invites eight musicians to explore the encounter between heterogeneous sound languages, where diversity becomes fertile ground for experimentation. No academic training or professional background is required: what matters is the ability to explore, express oneself, and adapt to the creative process.'
      }]
    },
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: 'Participants will start working in pairs, through random combinations that will foster dialogue between different sensibilities and approaches. After an initial co-creation cycle, the groups will dissolve and reorganize in a sort of musical speed dating. Each new encounter will be an opportunity to redefine one's language and test the capacity for mutual listening.'
      }]
    }
  ],

  // STRUCTURE
  structure: [
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: 'The residency will be structured around collaborative work cycles, including:'
      }]
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{
        _type: 'span',
        text: 'Co-creation sessions in rotating ensembles.'
      }]
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{
        _type: 'span',
        text: 'Spaces for collective exploration.'
      }]
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{
        _type: 'span',
        text: 'Peer-to-peer feedback and listening dynamics.'
      }]
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{
        _type: 'span',
        text: 'Moments of improvisation and sound experimentation.'
      }]
    }
  ],

  structureDetails: {
    format: "Individual and collective creation, group dynamics, and final presentation"
  },

  // WHAT WE OFFER
  whatWeOffer: [
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: '01. A natural environment, ideal for focus and inspiration.'
      }]
    },
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: '02. Accommodation and meals throughout the residency.'
      }]
    },
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: '03. Opportunities for deep dialogue with other participants.'
      }]
    },
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: '04. A final presentation open to the community.'
      }]
    }
  ],

  // APPLICATION
  applicationIntro: `If this resonates with you, we invite you to submit your application by March 18, 2025 (extended March 22, 2025). Please include:`,

  requirements: [
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{
        _type: 'span',
        text: 'A brief statement of intent (max 300 words)'
      }]
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{
        _type: 'span',
        text: 'Portfolio or audio samples of your work'
      }]
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [{
        _type: 'span',
        text: 'CV or short biography'
      }]
    },
    {
      _type: 'block',
      children: [{
        _type: 'span',
        text: 'Full details in application package.'
      }]
    }
  ],

  // GALLERY (8 images of location, atmosphere, spaces)
  gallery: [
    { _type: 'image', caption: 'Creative workspace' },
    { _type: 'image', caption: 'Natural surroundings' },
    { _type: 'image', caption: 'Shared living space' },
    { _type: 'image', caption: 'Performance area' },
    { _type: 'image', caption: 'Outdoor common area' },
    { _type: 'image', caption: 'Recording setup' },
    { _type: 'image', caption: 'Community gathering' },
    { _type: 'image', caption: 'Sunset view' }
  ],

  // COVER IMAGE
  coverImage: {
    _type: 'image',
    // Upload your hero background image
  },

  // SEO
  seo: {
    title: "+-SON Experimental Music Residency | Volavan",
    description: "A 3-week experimental music residency for 8 musicians exploring co-creation and sound experimentation in rural Portugal."
  }
}
```

---

## 📅 residency (Edition): "+-SON 2025"

```js
{
  title: "+-SON 2025",
  slug: { current: "son-2025" },
  
  // REFERENCE TO PROGRAM
  program: {
    _type: 'reference',
    _ref: '[ID of +-SON program]'
  },
  
  year: 2025,
  status: "open_call", // or "upcoming", "ongoing", "concluded"
  
  // DATES
  residencyDates: {
    start: "2025-06-20",
    end: "2025-07-11"
  },
  
  callDates: {
    open: "2025-01-15",
    close: "2025-03-22" // Extended deadline
  },
  
  // EDITION-SPECIFIC GALLERY
  // (Photos from +-SON 2024 or promo images for 2025)
  gallery: [
    { _type: 'image', caption: 'Participants collaborating' },
    { _type: 'image', caption: 'Sound experimentation session' },
    { _type: 'image', caption: 'Group improvisation' },
    { _type: 'image', caption: 'Final presentation' },
    { _type: 'image', caption: 'Evening jam session' },
    { _type: 'image', caption: 'Recording moment' },
    { _type: 'image', caption: 'Community dinner' },
    { _type: 'image', caption: 'Listening circle' }
  ],
  
  // COVER IMAGE (optional, falls back to program coverImage)
  coverImage: {
    _type: 'image',
    // Edition-specific cover if different from program
  },
  
  // ARTISTS (if any selected)
  artists: [
    {
      artist: { _type: 'reference', _ref: '[Artist ID]' },
      status: "selected"
    },
    // ... more artists
  ],
  
  // SEO OVERRIDE (optional)
  seo: {
    title: "+-SON 2025 - Open Call | Volavan",
    description: "Join 8 musicians for a 3-week experimental co-creation residency in rural Portugal. June 20 - July 11, 2025. Application deadline: March 22, 2025."
  }
}
```

---

## 🎨 Come Appare sul Frontend

### Hero Section
```
[Background: coverImage from program]

Status Badge: "Open Call"
Title: "+-SON"
Tagline: "Experimental Co-Creation Music Residency"
Dates: "20 Jun — 11 Jul 2025" (from latest edition)
Location: "Figueiró das Donas (Portugal)"
CTA: "Apply Now" button
```

### Content Sections
```
1. CONCEPT
   - Portable Text content
   - Badge: "Intimate group of 8 artists"

2. STRUCTURE
   - Portable Text content with bullet list
   - Details box: "Format: Individual and collective creation..."

3. WHAT WE OFFER
   - Numbered list (01, 02, 03, 04)

4. ATMOSPHERE
   - Grid 2x3x4 of program.gallery images

5. HOW TO APPLY
   - Intro text
   - Requirements (bullet list)
   - Deadline box: "22 March 2025"
   - CTA: "Start Application"

6. EDITIONS
   - Grid of all editions (2025, 2024, etc.)
   - Filterable by status
```

---

## ✅ Checklist Popolamento Sanity

1. [ ] Crea il Program "+-SON" con tutti i campi compilati
2. [ ] Upload coverImage del program (hero background)
3. [ ] Upload 8 immagini nella program.gallery (location, spazi)
4. [ ] Crea l'Edition "+-SON 2025"
5. [ ] Collega l'edition al program
6. [ ] Imposta status = "open_call"
7. [ ] Aggiungi residencyDates (20 Jun - 11 Jul 2025)
8. [ ] Aggiungi callDates.close (22 Mar 2025)
9. [ ] Upload gallery dell'edition (se disponibile)
10. [ ] Pubblica entrambi i documenti
11. [ ] Verifica il frontend su `/programs/son` 🎉
