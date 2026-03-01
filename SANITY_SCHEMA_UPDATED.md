# 📋 Schema Sanity Aggiornato per VOLAVAN

## ✅ Modifiche Richieste Applicate

1. **✅ Gallery su ENTRAMBI `residencyProgram` E `residency`** - Massima flessibilità
   - `residencyProgram.gallery` - Immagini generali del program (location, atmosphere, concept)
   - `residency.gallery` - Immagini specifiche dell'edizione (partecipanti, attività di quell'anno)
2. **✅ `feeIncludes` cambiato da `string` a `text`** (multi-line)
3. **✅ `applicationIntro` cambiato da `string` a `text`** (multi-line)

---

## 📦 Schema `residencyProgram`

```js
// schemas/residencyProgram.js

export default {
  name: 'residencyProgram',
  title: 'Residency Program',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Program Name',
      type: 'string',
      description: 'e.g. "+-SON"',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Artistic', value: 'artistic' },
          { title: 'Retreat', value: 'retreat' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Subtitle for the hero section (e.g. "Experimental Co-Creation Music Residency")'
    },
    {
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      description: 'Typical number of participants per edition'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Figueiró das Donas"'
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'e.g. "Portugal"'
    },
    {
      name: 'feeAmount',
      title: 'Fee Amount (€)',
      type: 'number',
      description: 'Leave empty if free'
    },
    {
      name: 'feeIncludes',
      title: 'Fee Includes',
      type: 'text', // ✅ Changed from string to text
      rows: 3,
      description: 'What is included in the fee (multi-line)'
    },
    {
      name: 'concept',
      title: 'Concept',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The "why" - philosophy and vision of the program'
    },
    {
      name: 'structure',
      title: 'Structure',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'How the program works - daily structure, activities, etc.'
    },
    {
      name: 'structureDetails',
      title: 'Structure Details',
      type: 'object',
      fields: [
        {
          name: 'format',
          title: 'Format',
          type: 'string',
          description: 'e.g. "Individual and collective creation, group dynamics, and final presentation"'
        }
      ]
    },
    {
      name: 'whatWeOffer',
      title: 'What We Offer',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Benefits and offerings for participants'
    },
    {
      name: 'requirements',
      title: 'Application Requirements',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What applicants need to submit'
    },
    {
      name: 'applicationIntro',
      title: 'Application Intro',
      type: 'text', // ✅ Changed from string to text
      rows: 2,
      description: 'Opening sentence for "How to Apply" section (multi-line)'
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Main hero image for the program'
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for this image'
            }
          ]
        }
      ],
      description: '✅ General photo gallery for the program (location, atmosphere, concept)'
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { 
          name: 'title', 
          title: 'SEO Title', 
          type: 'string' 
        },
        { 
          name: 'description', 
          title: 'SEO Description', 
          type: 'text',
          rows: 2
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
      media: 'coverImage'
    }
  }
}
```

---

## 📅 Schema `residency` (Edition)

```js
// schemas/residency.js

export default {
  name: 'residency',
  title: 'Residency Edition',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Edition Title',
      type: 'string',
      description: 'e.g. "+-SON 2025"',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'program',
      title: 'Program',
      type: 'reference',
      to: [{ type: 'residencyProgram' }],
      description: 'Which residency program this edition belongs to',
      validation: Rule => Rule.required()
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'e.g. 2025',
      validation: Rule => Rule.required().min(2020).max(2100)
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Open Call', value: 'open_call' },
          { title: 'Registration Open', value: 'registration_open' },
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Concluded', value: 'concluded' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'residencyDates',
      title: 'Residency Dates',
      type: 'object',
      fields: [
        {
          name: 'start',
          title: 'Start Date',
          type: 'date',
          validation: Rule => Rule.required()
        },
        {
          name: 'end',
          title: 'End Date',
          type: 'date',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'callDates',
      title: 'Call Dates',
      type: 'object',
      fields: [
        {
          name: 'open',
          title: 'Call Opens',
          type: 'date'
        },
        {
          name: 'close',
          title: 'Call Closes',
          type: 'date'
        }
      ]
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Edition-specific cover image (optional, falls back to program coverImage)'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Edition-specific location (optional, falls back to program location)'
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'Edition-specific country (optional, falls back to program country)'
    },
    {
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Edition-specific disciplines (optional, falls back to program disciplines)'
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for this image'
            }
          ]
        }
      ],
      description: '✅ Edition-specific photo gallery (atmosphere, activities, participants)'
    },
    {
      name: 'artists',
      title: 'Artists',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'artist',
              title: 'Artist',
              type: 'reference',
              to: [{ type: 'artist' }]
            },
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  { title: 'Applied', value: 'applied' },
                  { title: 'Selected', value: 'selected' },
                  { title: 'Not Selected', value: 'not_selected' }
                ]
              }
            }
          ],
          preview: {
            select: {
              title: 'artist.name',
              subtitle: 'status'
            }
          }
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO Override',
      type: 'object',
      description: 'Optional SEO override for this specific edition',
      fields: [
        { name: 'title', title: 'SEO Title', type: 'string' },
        { name: 'description', title: 'SEO Description', type: 'text', rows: 2 }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'coverImage',
      program: 'program.name'
    },
    prepare(selection) {
      const { title, year, media, program } = selection
      return {
        title: `${title} (${year})`,
        subtitle: program,
        media: media
      }
    }
  }
}
```

---

## 🔄 Data Mapping Frontend ↔ Sanity

| Frontend Field | Sanity Source | Notes |
|---|---|---|
| `hero.title` | `residencyProgram.name` | Program name |
| `hero.subtitle` | `residencyProgram.tagline` | Tagline |
| `hero.dates` | `residency.residencyDates.start/end` (latest edition) | From latest edition |
| `hero.location` | `residencyProgram.location + country` | General location |
| `hero.coverImage` | `residencyProgram.coverImage` | Hero background |
| `concept.content` | `residencyProgram.concept` | Portable Text |
| `concept.capacity` | `residencyProgram.capacity` | Number of participants |
| `structure.content` | `residencyProgram.structure` | Portable Text |
| `structure.details.format` | `residencyProgram.structureDetails.format` | Format string |
| `whatWeOffer` | `residencyProgram.whatWeOffer` | Portable Text |
| `application.intro` | `residencyProgram.applicationIntro` | ✅ Now `text` type |
| `application.requirements` | `residencyProgram.requirements` | Portable Text |
| `application.deadline` | `residency.callDates.close` (latest edition) | From latest edition |
| **Program Gallery** | `residencyProgram.gallery` | ✅ General program images (location, atmosphere) |
| **Edition Gallery** | `residency.gallery` | ✅ Edition-specific images (participants, activities) |
| `metadata.disciplines` | `residencyProgram.disciplines` | Array of strings |
| `metadata.capacity` | `residencyProgram.capacity` | Number |
| `metadata.year` | `residency.year` | From edition |
| `metadata.status` | `residency.status` | From edition |

---

## 🎯 Next Steps

1. **Copia questi schema** nel tuo progetto Sanity Studio
2. **Riavvia Sanity Studio** con `npm run dev`
3. **Crea il primo Program** (e.g. "+-SON") con tutti i campi compilati
4. **Crea le Editions** (2025, 2024, ecc.) collegandole al program
5. **Pubblica** i documenti
6. **Verifica il frontend** - i dati appariranno automaticamente! 🎉

---

## 📝 Note Importanti

- ✅ **Gallery è ora su ENTRAMBI `residencyProgram` E `residency`** - Massima flessibilità
- ✅ **`feeIncludes`** e **`applicationIntro`** sono ora di tipo `text` per multi-line
- Ogni `residency` (edition) DEVE avere un `program` di riferimento (campo required)
- Il frontend mostra i dati del **program** (contenuti editoriali stabili) combinati con i dati della **latest edition** (date, status, gallery)