# Schema Sanity per videoPost

Per abilitare l'archivio video nel Journal, è necessario creare un nuovo schema documento in Sanity CMS.

## Schema videoPost

Aggiungi questo schema nella tua configurazione Sanity:

```javascript
export default {
  name: 'videoPost',
  title: 'Video Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Breve descrizione del video (apparirà nella card)'
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required(),
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'videoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'ID del video YouTube (es: "41z5HiWIAOs" dall\'URL youtube.com/watch?v=41z5HiWIAOs)',
      validation: Rule => Rule.required()
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'Immagine di copertina del video (apparirà nella griglia)',
      options: {
        hotspot: true
      }
    },
    {
      name: 'startTime',
      title: 'Start Time (seconds)',
      type: 'number',
      description: 'Tempo di inizio del video in secondi (opzionale)',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'endTime',
      title: 'End Time (seconds)',
      type: 'number',
      description: 'Tempo di fine del video in secondi (opzionale)',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'relatedResidency',
      title: 'Related Residency',
      type: 'reference',
      to: [{ type: 'residency' }],
      description: 'Residenza collegata (opzionale)'
    }
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'thumbnail'
    },
    prepare({ title, publishedAt, media }) {
      return {
        title,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString('it-IT') : 'No date',
        media
      }
    }
  }
}
```

## Come usare

1. **Crea un nuovo video post** in Sanity Studio
2. **Compila i campi**:
   - **Title**: Titolo del video
   - **Slug**: Generato automaticamente dal titolo
   - **Excerpt**: Breve descrizione (max 2-3 righe)
   - **Published At**: Data di pubblicazione
   - **YouTube Video ID**: Solo l'ID del video (es: `41z5HiWIAOs`)
   - **Thumbnail**: Carica un'immagine di copertina
   - **Start Time** (opzionale): Tempo di inizio in secondi (es: 227 per 3:47)
   - **End Time** (opzionale): Tempo di fine in secondi (es: 281 per 4:41)
   - **Categories**: Tag per categorizzare il video
   - **Related Residency** (opzionale): Collega a una residenza specifica

3. **Pubblica** il documento

Il video apparirà automaticamente nella pagina Journal, mescolato con gli articoli in ordine cronologico.

## Funzionalità Frontend

- **Filtri**: Gli utenti possono filtrare tra "All", "Articles" e "Videos"
- **Play Icon**: I video mostrano un'icona play sull'immagine
- **Modal Player**: Cliccando sul video si apre un modal con il player YouTube
- **Controlli personalizzati**: Mute/unmute, replay quando finisce
- **Start/End Time**: Il video parte e finisce ai secondi specificati
- **Design coerente**: Stesso stile del resto del sito VOLAVAN

## Note

- I video vengono fetchati da Sanity insieme agli articoli
- Ordinamento cronologico per data di pubblicazione
- Thumbnail custom gestibile dal CMS
- Supporto per categorie condivise con gli articoli
