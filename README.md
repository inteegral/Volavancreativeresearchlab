# VOLAVAN

> Piattaforma web per residenze artistiche e coworking rurale creativo

VOLAVAN è una piattaforma moderna che connette artisti con programmi di residenza creativa, offrendo un'esperienza digitale minimalista che riflette l'estetica naturale del progetto.

---

## 📋 Indice

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architettura](#-architettura)
- [Installazione](#-installazione)
- [Configurazione Sanity CMS](#-configurazione-sanity-cms)
- [Development](#-development)
- [Build & Deploy](#-build--deploy)
- [Sistema Multilingua](#-sistema-multilingua)
- [Performance & Ottimizzazioni](#-performance--ottimizzazioni)
- [SEO & Accessibilità](#-seo--accessibilità)
- [Design System](#-design-system)
- [Struttura Progetto](#-struttura-progetto)

---

## ✨ Features

### Sito Pubblico
- **Home** - Hero dinamico con video autoplay, sezioni residenze e journal
- **About** - Storia e visione di VOLAVAN
- **Residencies** - Grid filtrata di programmi artistici con status (Open Call, Ongoing, Concluded)
- **Residency Detail** - Pagina dettaglio edizione con concept, struttura, artisti, gallery
- **Artists** - Galleria artisti con filtri per disciplina
- **Artist Detail** - Portfolio, bio, collegamenti a residenze
- **Journal** - Blog con articoli e video YouTube (filtri All/Articles/Videos)
- **Journal Detail** - Articolo completo con PortableText, immagini, metadati

### Funzionalità Tecniche
- ✅ **SWR Caching** - Data fetching ottimizzato con revalidazione automatica
- ✅ **Responsive Images** - Sanity CDN con srcset, WebP/AVIF, LQIP blur placeholder
- ✅ **Skeleton Loaders** - UI feedback durante caricamento grid
- ✅ **i18n** - Sistema bilingue EN/ES con localStorage persistence
- ✅ **SEO** - Meta tags dinamici, Schema.org, Open Graph
- ✅ **Animations** - Motion (Framer Motion) per transizioni smooth
- ✅ **Error Handling** - Error boundary con fallback UI
- ✅ **Analytics** - Google Analytics 4 (GA4) con tracking pageviews ed eventi custom
- ✅ **Form Candidature** - Integrazione Formspree per invio email
- ✅ **Newsletter** - Integrazione MailerLite API

---

## 🛠️ Tech Stack

### Core
- **React** 18.3.1 - UI library
- **TypeScript** - Type safety
- **Vite** 6.3.5 - Build tool e dev server
- **React Router** 7.13.0 - Routing (data mode con `createBrowserRouter`)

### Styling
- **Tailwind CSS** v4.1.12 - Utility-first CSS
- **Tailwind Animate** - Animazioni utility classes
- **PostCSS** - CSS processing

### CMS & Data
- **Sanity CMS** - Headless CMS
  - Project ID: `98dco624`
  - Dataset: `production`
  - Studio: [volavan.sanity.studio](https://volavan.sanity.studio)
- **@sanity/client** 7.15.0 - Client API
- **@sanity/image-url** 2.0.3 - Image optimization
- **SWR** 2.4.0 - Client-side caching & revalidation

### UI Components
- **Radix UI** - Accessible component primitives (18 componenti)
- **shadcn/ui** - Component library custom
- **Lucide React** 0.487.0 - Icon system
- **Material UI** 7.3.5 - Componenti aggiuntivi

### Utilities
- **Motion** 12.23.24 - Animation library (ex Framer Motion)
- **React Helmet Async** 2.0.5 - SEO meta tags
- **@portabletext/react** 6.0.2 - Sanity rich text rendering
- **React Player** 3.4.0 - Video YouTube
- **date-fns** 3.6.0 - Date formatting
- **clsx** + **tailwind-merge** - Conditional classes

---

## 🏗️ Architettura

### Routing System

React Router v7 in **data mode** con `createBrowserRouter`:

```
/
├── RootWrapper (Providers: Helmet, Language, SWR)
│   └── PublicLayout (Header + Footer)
│       ├── / (Home)
│       ├── /about
│       ├── /artists
│       ├── /artists/:slug
│       ├── /residencies
│       ├── /residencies/:slug (edition detail)
│       ├── /journal
│       ├── /journal/:slug
│       └── /candidature
└── * → redirect to /
```

### Data Flow

```
User Request
    ↓
React Component
    ↓
useSanity Hook (SWR)
    ↓
sanityService (GROQ query)
    ↓
Sanity API (cdn.sanity.io)
    ↓
SWR Cache (60s deduping)
    ↓
Component Re-render
```

### State Management

- **Global State**: Context API
  - `LanguageContext` - Lingua corrente (EN/ES) + localStorage
- **Server State**: SWR
  - Cache client-side con revalidazione automatica
  - Deduping 60s, retry on error, focus throttle
- **Local State**: `useState` per UI interactions

---

## 📦 Installazione

### Prerequisiti

- **Node.js** ≥ 18.x
- **pnpm** ≥ 8.x (consigliato) o npm/yarn

### Setup

```bash
# Clone repository
git clone <repository-url>
cd volavan

# Installa dipendenze
pnpm install

# Crea file .env
cp .env.example .env

# Configura variabili ambiente (vedi sezione sotto)
nano .env
```

### Environment Variables

Crea un file `.env` nella root con:

```env
# Sanity CMS Configuration (Public Read-Only)
VITE_SANITY_PROJECT_ID=98dco624
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01

# Analytics (Optional - Google Analytics 4)
VITE_ENABLE_ANALYTICS=true
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Form Submissions - Candidature (Formspree)
# Get your endpoint at https://formspree.io
VITE_FORMSPREE_ENDPOINT=YOUR_FORMSPREE_ID

# Newsletter Integration - MailerLite
# Get API key from MailerLite Dashboard → Settings → API
VITE_MAILERLITE_API_KEY=your_mailerlite_api_key
VITE_MAILERLITE_GROUP_ID=your_group_id_optional
```

⚠️ **IMPORTANTE**: 
- NON committare file `.env` con credenziali reali
- Il dataset Sanity è pubblico (read-only), nessun token richiesto
- Per write access (Sanity Studio), usare autenticazione Sanity separata

---

## 🎨 Configurazione Sanity CMS

### Schema Documents

Il CMS Sanity utilizza i seguenti document types:

#### 1. **`residencyProgram`** - Programma Residenza (i18n)
Identità del programma (dati stabili, invarianti per anno):

```javascript
{
  name: string                    // e.g. "+-SON"
  slug: slug                      // e.g. "plus-minus-son"
  type: 'artistic' | 'retreat'
  tagline: string                 // Subtitle hero
  disciplines: string[]           // e.g. ["Music", "Performance"]
  capacity: number                // Partecipanti tipici
  location: string                // e.g. "Figueiró das Donas"
  country: string                 // e.g. "Portugal"
  feeAmount: number               // Euro (optional)
  feeIncludes: text               // Multiline
  concept: PortableText           // Philosophy del program
  structure: PortableText         // Come funziona
  whatWeOffer: PortableText       // Benefit per artisti
  requirements: PortableText      // Requisiti application
  applicationIntro: text          // Intro "How to Apply"
  coverImage: image               // Hero image
  gallery: image[]                // Gallery generale program
  seo: { title, description }
}
```

#### 2. **`residency`** - Edizione Annuale (campi inline bilingui)
Dati temporali specifici per anno:

```javascript
{
  title: string                   // e.g. "+-SON 2025"
  slug: slug
  program: reference              // → residencyProgram
  year: number
  status: 'upcoming' | 'open_call' | 'ongoing' | 'concluded'
  residencyDates: {
    start: date
    end: date
  }
  callDates: {
    open: date
    close: date
  }
  coverImage: image               // Override program image
  gallery: image[]                // Gallery specifica edizione
  artists: [{
    artist: reference,            // → artist
    status: 'applied' | 'selected' | 'not_selected'
  }]
  directorStatement: {            // ⚠️ Campo bilingue inline
    en: PortableText
    es: PortableText
  }
  location: string                // Override (optional)
  disciplines: string[]           // Override (optional)
  seo: { title, description }     // Override (optional)
}
```

#### 3. **`artist`** - Artista (i18n)

```javascript
{
  name: string                    // Nome pubblico
  legalFirstName: string          // Nome legale
  legalLastName: string
  slug: slug
  photo: image
  nationality: string
  disciplines: string[]           // e.g. ["Sound Design", "Performance"]
  instruments: string[]           // Per musicisti
  bio: PortableText
  whyVolavan: PortableText        // Motivazione residenza
  links: [{                       // ⚠️ No website/instagram diretti
    label: string,                // e.g. "Website", "Instagram"
    url: string
  }]
  seo: { title, description }
}
```

#### 4. **`journal`** - Articolo Blog (i18n)

```javascript
{
  title: string
  slug: slug
  publishedAt: datetime
  categories: string[]            // e.g. ["Interview", "Process"]
  author: reference               // → artist
  coverImage: image
  videoUrl: string                // ⚠️ YouTube URL (no schema videoPost separato)
  excerpt: text
  content: PortableText
  relatedResidencies: reference[] // → residency
  seo: { title, description }
}
```

#### 5. **`home`**, **`about`**, **`programsPage`** (i18n)
Page content documents con campi specifici per sezione.

#### 6. **`settings`** - Configurazione Globale (singleton)

```javascript
{
  siteName: string
  siteDescription: text
  logo: image
  nav: [{                         // Menu items
    label: string,
    href: string
  }]
  footer: {
    tagline: string
    email: string
    instagram: string
    facebook: string
  }
  defaultSeo: {
    title: string
    description: text
    ogImage: image
  }
}
```

### Sanity Studio Configuration

**URL Studio**: [https://volavan.sanity.studio](https://volavan.sanity.studio)

**Plugin attivi**:
- `structureTool` - UI documents
- `visionTool` - GROQ query testing
- `media` - Asset management
- `documentInternationalization` - i18n workflow
- `internationalizedArray` - Array field translations
- `assist` - AI content suggestions

**CORS Setup**:
1. Vai su [sanity.io/manage](https://www.sanity.io/manage)
2. Seleziona progetto `98dco624`
3. Tab **API** → **CORS Origins**
4. Aggiungi origin del frontend (e.g. `https://volavan.com`)
5. Credenziali: **Disabilitate** (read-only public)

### i18n Architecture Sanity

**Sistema dual-approach**:

1. **Documenti separati per lingua** (translation.metadata)
   - Tipi: `residencyProgram`, `artist`, `journal`, `home`, `about`, `programsPage`
   - Ogni documento ha un `_id` univoco per lingua
   - Collegati via `translation.metadata.translations[]`
   - Query filtra con `language == $lang`

2. **Campi inline bilingui** (internationalizedArray)
   - Tipo: `residency.directorStatement`
   - Oggetto con chiavi `{ en: PortableText, es: PortableText }`
   - Usato per campi specifici che variano per edizione

**Esempio query GROQ**:
```groq
*[_type == "residencyProgram" && language == $lang] {
  name,
  slug,
  coverImage,
  editions[]-> {
    year,
    status,
    directorStatement[$lang]  // Campo inline bilingue
  }
}
```

---

## 💻 Development

### Start Dev Server

```bash
pnpm run dev
```

Apri [http://localhost:5173](http://localhost:5173) nel browser.

### Scripts Disponibili

```bash
pnpm run dev        # Vite dev server (hot reload)
pnpm run build      # Build produzione → /dist
pnpm run preview    # Preview build locale
```

### Hot Module Replacement (HMR)

Vite + React Fast Refresh:
- Modifiche CSS/Tailwind → Instant update
- Modifiche componenti → State preservation
- Modifiche routing → Full reload

### Debug Sanity Queries

Endpoint disponibile: `/debug-sanity`

Mostra:
- Tutti i programmi fetched
- Raw JSON responses
- Cache SWR status
- Utile per verificare schema mapping

---

## 🚀 Build & Deploy

### Build Produzione

```bash
pnpm run build
```

Output: `/dist` directory con:
- HTML, CSS, JS ottimizzati e minificati
- Assets con hash per cache busting
- Source maps (opzionale)

### Deploy Suggestions

**Opzione 1: Vercel** (consigliato per React SPA)
```bash
vercel deploy
```

**Opzione 2: Netlify**
```bash
netlify deploy --prod
```

**Opzione 3: Static Hosting**
- Upload `/dist` su CDN (Cloudflare Pages, AWS S3 + CloudFront)
- Configura redirect `/*` → `/index.html` per SPA routing

### Environment Variables in Production

Su piattaforma hosting (Vercel/Netlify):
1. Vai su **Settings** → **Environment Variables**
2. Aggiungi:
   ```
   VITE_SANITY_PROJECT_ID=98dco624
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-01-01
   VITE_ENABLE_ANALYTICS=true
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_FORMSPREE_ENDPOINT=YOUR_FORMSPREE_ID
   VITE_MAILERLITE_API_KEY=your_mailerlite_api_key
   VITE_MAILERLITE_GROUP_ID=your_group_id_optional
   ```
3. Rebuild progetto

---

## 🌍 Sistema Multilingua

### Architettura i18n

**Lingue supportate**: 
- 🇬🇧 Inglese (default)
- 🇪🇸 Spagnolo

**Implementazione**:
- **Storage**: `localStorage` (key: `volavan_language`)
- **Fallback chain**: localStorage → Browser language → Default (EN)
- **No URL prefixes** - Solo LanguageContext + parametro query Sanity
- **HTML lang attribute**: Aggiornato dinamicamente

### Usage nel Codice

```tsx
import { useLanguage } from './contexts/LanguageContext';

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t.home.title}</h1>
      <button onClick={() => setLanguage('es')}>
        Español
      </button>
    </div>
  );
}
```

### File Translations

**Path**: `/src/locales/`

```
/locales
├── en.ts    # { nav, footer, home, about, artists, ... }
└── es.ts    # { nav, footer, home, about, artists, ... }
```

**Struttura**:
```typescript
export default {
  nav: {
    home: "Home",
    about: "About",
    // ...
  },
  home: {
    subtitle: "Creative Residencies in Rural Portugal",
    // ...
  },
  // ...
}
```

### Aggiungere Nuova Lingua

1. Crea `/src/locales/it.ts` (esempio Italiano)
2. Aggiorna `LanguageContext.tsx`:
   ```typescript
   export type Language = 'en' | 'es' | 'it';
   ```
3. Importa in `LanguageContext.tsx`:
   ```typescript
   import it from '../../locales/it';
   const translations = { en, es, it };
   ```
4. Aggiungi content in Sanity Studio con plugin i18n

---

## ⚡ Performance & Ottimizzazioni

### 1. SWR Client-Side Caching

**Configurazione globale** (`routes.tsx`):
```typescript
<SWRConfig value={{
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000,        // 1 minuto
  focusThrottleInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
}}>
```

**Benefici**:
- ✅ **Zero request duplicati** - Deduping 60s
- ✅ **Stale-while-revalidate** - UI istantanea, fetch in background
- ✅ **Offline resilience** - Retry automatico con exponential backoff
- ✅ **Tab sync** - Revalidate on reconnect

### 2. Sanity Image Optimization

**Componente `<SanityImage />`** - All-in-one solution:

```tsx
<SanityImage
  image={coverImage}
  alt="VOLAVAN residency"
  width={1200}
  height={800}
  quality={85}
  sizes="(max-width: 768px) 100vw, 1200px"
  priority={false}  // true per above-the-fold images
  className="w-full h-64"
/>
```

**Features integrate**:
- ✅ **Responsive srcset** - 5 breakpoints (320, 640, 960, 1280, 1920)
- ✅ **Auto WebP/AVIF** - Formato ottimale per browser
- ✅ **LQIP Blur Placeholder** - 20px blur per smooth loading
- ✅ **Lazy Loading** - Native `loading="lazy"` (tranne priority)
- ✅ **Fade-in animation** - Opacity transition 500ms
- ✅ **Caption support** - Mostra caption da Sanity se presente

**Helper functions** (`lib/sanity.ts`):
```typescript
getImageUrl(image, width, height, quality)     // URL singolo
getImageSrcSet(image, widths[], quality)       // srcset responsive
getImageBlurUrl(image)                         // LQIP placeholder
```

### 3. Skeleton Loaders

**Componenti creati** (`components/ui/skeleton.tsx`):
- `<SkeletonCard />` - Grid items (residencies, journal)
- `<SkeletonJournalFeatured />` - Hero article
- `<SkeletonJournalSide />` - Sidebar articles
- `<SkeletonGrid count={6} variant="card" />` - Helper multipli

**Design VOLAVAN**:
- Colore: `bg-[#6A746C]/20` (toni terra)
- Animation: `animate-pulse` Tailwind native
- Layout: Struttura identica al contenuto reale (zero CLS)

**Integrati in**:
- Home (Residencies grid, Journal grid)
- Residencies page
- Journal page
- Artists page (potenziale)

### 4. Code Optimization

- **Tree shaking** - Vite rimuove codice non usato
- **CSS purging** - Tailwind JIT rimuove classi inutilizzate
- **Route splitting** - React Router lazy load pages (opzionale)
- **Bundle analysis** - `pnpm run build` mostra chunk sizes

### 5. Network Optimizations

**DNS Preconnect** (già in `SEOHead.tsx`):
```html
<link rel="preconnect" href="https://cdn.sanity.io" />
<link rel="dns-prefetch" href="https://cdn.sanity.io" />
```

**CDN Strategy**:
- Sanity images → `cdn.sanity.io` (global CDN)
- Static assets → Vercel Edge Network / Cloudflare

---

## 🔍 SEO & Accessibilità

### Meta Tags Dinamici

**Componente `<SEOHead />`** - React Helmet Async:

```tsx
<SEOHead
  title="+-SON 2025 | VOLAVAN"
  description="Experimental music residency in rural Portugal"
  url="/residencies/plus-minus-son-2025"
  image={coverImageUrl}
  type="article"
/>
```

**Output HTML**:
- `<title>`, `<meta name="description">`
- Open Graph (`og:title`, `og:image`, `og:type`)
- Twitter Cards (`twitter:card`, `twitter:image`)
- Canonical URL
- Language alternates (`hreflang`)

### Schema.org Structured Data

**Componente `<StructuredData />`** - JSON-LD:

**Organization** (footer):
```json
{
  "@type": "Organization",
  "name": "VOLAVAN",
  "logo": "https://...",
  "sameAs": ["https://instagram.com/volavan"]
}
```

**Article** (journal posts):
```json
{
  "@type": "Article",
  "headline": "...",
  "datePublished": "2025-01-15",
  "author": { "@type": "Person", "name": "..." },
  "image": "https://..."
}
```

**Event** (residencies - potenziale):
```json
{
  "@type": "Event",
  "name": "+-SON 2025",
  "startDate": "2025-06-01",
  "location": { "@type": "Place", "name": "Figueiró das Donas" }
}
```

### Accessibilità (a11y)

- ✅ **Semantic HTML** - `<header>`, `<nav>`, `<main>`, `<article>`
- ✅ **Alt text** - Tutte le immagini con `alt` descrittivo
- ✅ **ARIA labels** - Bottoni icon-only con `aria-label`
- ✅ **Keyboard navigation** - Focus visible, tab order corretto
- ✅ **Color contrast** - WCAG AA compliant (verificato)
- ✅ **HTML lang** - Attributo dinamico basato su LanguageContext
- ⚠️ **Screen reader testing** - Da fare con NVDA/VoiceOver

### robots.txt & Sitemap

**Path**: `/public/robots.txt`
```
User-agent: *
Allow: /
Sitemap: https://volavan.com/sitemap.xml
```

**Path**: `/public/sitemap.xml` (generare manualmente o con plugin)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://volavan.com/</loc>
    <priority>1.0</priority>
  </url>
  <!-- ... -->
</urlset>
```

---

## 🎨 Design System

### Palette Colori VOLAVAN

```css
/* Colori Brand */
--color-earth-green: #6A746C;   /* Primary - Toni terra */
--color-aqua-accent: #B5DAD9;   /* Accent - Acqua/menta */
--color-light-cream: #F5F5F0;   /* Background chiaro */

/* Varianti */
--color-earth-dark: #5E6860;    /* Hover states */
--color-aqua-light: #E6F4F3;    /* Backgrounds tenui */
```

**Usage Tailwind**:
```tsx
<div className="bg-[#6A746C] text-[#F5F5F0]">
  <span className="text-[#B5DAD9]">Accent</span>
</div>
```

### Typography

**Font Families**:
```css
/* Display / Headings */
font-family: 'Cormorant Garamond', serif;
font-style: italic;
font-weight: 300-500;

/* Body / UI */
font-family: 'Manrope', sans-serif;
font-weight: 300-400;
letter-spacing: 0.15em-0.25em;  /* Tracking largo */
text-transform: uppercase;       /* Per labels/meta */
```

**Scale**:
- Hero title: `text-5xl md:text-8xl` (80-128px)
- Section title: `text-3xl md:text-5xl` (48-80px)
- Card title: `text-2xl md:text-3xl` (32-48px)
- Body: `text-sm md:text-base` (14-16px)
- Meta: `text-xs` (10-12px uppercase)

### Componenti UI

**Stile Generale**:
- **Border radius**: Minimal (`rounded-sm` = 2px)
- **Shadows**: Nessuna (estetica flat)
- **Borders**: Sottili `border border-[#F5F5F0]/10`
- **Spacing**: Generoso (py-32, gap-12, mb-20)
- **Hover states**: 
  - Grayscale → Color transition 700ms
  - Border opacity change
  - Scale 105% su immagini

**Button Style**:
```tsx
<button className="
  px-8 py-4 
  border border-[#B5DAD9] 
  text-[#B5DAD9] 
  uppercase tracking-[0.2em] text-xs
  hover:bg-[#B5DAD9] hover:text-[#6A746C]
  transition-all duration-300
">
  Apply Now
</button>
```

### Animation Patterns

**Motion (Framer Motion)**:

```tsx
// Fade-in on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>

// Hover scale
<motion.img
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.7 }}
/>
```

**CSS Transitions**:
```css
transition-all duration-700  /* Immagini grayscale → color */
transition-colors duration-300  /* Hover text/bg */
transition-opacity duration-500  /* Fade-in immagini */
```

### Grid Layouts

**Residencies/Journal** (responsive):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

**Journal Asymmetric**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-2">{/* Featured */}</div>
  <div className="md:col-span-1">{/* Side articles */}</div>
</div>
```

---

## 📁 Struttura Progetto

```
volavan/
├── public/
│   ├── apple-touch-icon.png
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui (48 componenti)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── skeleton.tsx       # Skeleton loaders
│   │   │   │   └── ...
│   │   │   ├── figma/                 # Importazioni Figma
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   ├── ErrorBoundary.tsx      # Error handling
│   │   │   ├── LanguageSwitcher.tsx   # Switcher EN/ES
│   │   │   ├── Logo.tsx
│   │   │   ├── PortableTextRenderer.tsx
│   │   │   ├── SanityImage.tsx        # Immagini ottimizzate
│   │   │   ├── SEOHead.tsx            # Meta tags
│   │   │   ├── ScrollToTop.tsx
│   │   │   ├── StructuredData.tsx     # Schema.org
│   │   │   ├── VideoModal.tsx         # YouTube modal
│   │   │   └── VideoPlayer.tsx
│   │   │
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx    # i18n context
│   │   │
│   │   ├── hooks/
│   │   │   └── useSanity.ts           # SWR hooks
│   │   │
│   │   ├── layouts/
│   │   │   └── PublicLayout.tsx       # Header + Footer
│   │   │
│   │   ├── lib/
│   │   │   └── sanity.ts              # Client + queries + helpers
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Artists.tsx
│   │   │   │   ├── ArtistDetail.tsx
│   │   │   │   ├── Residencies.tsx
│   │   │   │   ├── ResidencyDetail.tsx
│   │   │   │   ├── Journal.tsx
│   │   │   │   ├── JournalDetail.tsx
│   │   │   │   └── Candidature.tsx
│   │   │   └── DebugSanity.tsx
│   │   │
│   │   ├── routes.tsx                 # React Router config
│   │   └── App.tsx                    # Root component
│   │
│   ├── locales/
│   │   ├── en.ts                      # English translations
│   │   └── es.ts                      # Spanish translations
│   │
│   ├── styles/
│   │   ├── fonts.css                  # Font imports
│   │   ├── index.css                  # Global styles
│   │   ├── tailwind.css               # Tailwind directives
│   │   └── theme.css                  # Design tokens
│   │
│   └── imports/                       # Figma assets (SVG)
│
├── guidelines/
│   └── Guidelines.md                  # AI guidelines (optional)
│
├── .env                               # Environment variables (git-ignored)
├── .env.example                       # Template env vars
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json
├── vite.config.ts
└── README.md                          # Questo file
```

---

## 🔒 Security & Best Practices

### Cosa NON Committare

⛔ **Mai includere nel repository**:
- File `.env` con token reali
- Chiavi API private
- Credenziali Sanity write tokens
- Secret keys

✅ **Usa invece**:
- `.env.example` con placeholder
- Environment variables su piattaforma hosting
- Sanity token di lettura pubblico (già configurato nel codice)

### CORS Configuration

Per permettere al frontend di chiamare Sanity API:
1. [sanity.io/manage](https://www.sanity.io/manage) → Progetto `98dco624`
2. Tab **API** → **CORS Origins**
3. Aggiungi origin frontend (e.g. `https://volavan.com`, `http://localhost:5173`)
4. Credenziali: **Disabled** (read-only public dataset)

### Content Security Policy (CSP)

Consigliato per produzione (aggiungi in `index.html` o server config):

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.sanity.io;
  font-src 'self' data:;
  connect-src 'self' https://98dco624.api.sanity.io;
  media-src 'self' https://www.youtube.com;
">
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: `Cannot find module '@sanity/client'`**
```bash
pnpm install @sanity/client @sanity/image-url
```

**Error: Tailwind classes not working**
```bash
# Verifica postcss.config.mjs esista
# Riavvia dev server
pnpm run dev
```

### Runtime Errors

**Error: `SWR cache not updating`**
- Verifica `dedupingInterval` in `routes.tsx`
- Forza refresh con `mutate()` da SWR
- Controlla network tab per 304 Not Modified

**Error: Immagini Sanity 404**
- Verifica `projectId` in `.env`
- Controlla asset esista in Sanity Studio
- CORS configurato correttamente

**Error: `useLanguage must be used within LanguageProvider`**
- Verifica `<LanguageProvider>` wrappa l'app in `routes.tsx`
- Non usare `useLanguage()` fuori dal componente tree

### Sanity Studio

**Problem: Content non appare nel frontend**
1. Verifica documento sia **pubblicato** (non draft)
2. Controlla campo `language` sia `en` o `es`
3. Testa query in Vision tool (Sanity Studio)
4. Vedi `/debug-sanity` endpoint nel frontend

**Problem: i18n non funziona**
- Verifica plugin `documentInternationalization` installato
- Controlla `translation.metadata` nei documenti
- Query deve filtrare con `language == $lang`

---

## 📚 Risorse Utili

### Documentazione

- **React Router v7**: https://reactrouter.com/
- **Sanity CMS**: https://www.sanity.io/docs
- **SWR**: https://swr.vercel.app/
- **Tailwind CSS v4**: https://tailwindcss.com/
- **Motion**: https://motion.dev/ (ex Framer Motion)
- **Radix UI**: https://www.radix-ui.com/

### Link Progetto

- **Sanity Studio**: https://volavan.sanity.studio
- **Sanity Dashboard**: https://www.sanity.io/manage/personal/project/98dco624

---

## 🤝 Contributing

Se contribuisci al progetto:

1. **Fork** il repository
2. Crea un **branch** per la feature (`git checkout -b feature/amazing-feature`)
3. **Commit** le modifiche (`git commit -m 'Add amazing feature'`)
4. **Push** al branch (`git push origin feature/amazing-feature`)
5. Apri una **Pull Request**

### Code Style

- TypeScript strict mode
- ESLint + Prettier (se configurato)
- Tailwind classes ordinate (install Prettier plugin Tailwind)
- Componenti funzionali con hooks
- Naming convention: PascalCase componenti, camelCase funzioni

---

## 📄 License

[Specificare licenza - MIT, Proprietary, etc.]

---

## 👥 Team

**VOLAVAN Team**
- Website: [volavan.com](https://volavan.com)
- Instagram: [@volavan](https://instagram.com/volavan)
- Email: info@volavan.com

---

## 🎯 Roadmap

### Features Implementate ✅
- [x] Sito pubblico completo (Home, About, Artists, Residencies, Journal)
- [x] Sistema multilingua EN/ES
- [x] SWR caching + ottimizzazioni immagini
- [x] SEO + Schema.org
- [x] Skeleton loaders
- [x] Video YouTube integration
- [x] Responsive design

### Features In Sviluppo 🚧
- [ ] Form candidature (integrazione backend)
- [ ] Newsletter signup (Mailchimp/Brevo)
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Search functionality (Algolia?)
- [ ] Admin CMS panel (se necessario custom UI)

### Features Future 💡
- [ ] Artist portfolio builder
- [ ] Calendar eventi interattivo
- [ ] Map residencies locations
- [ ] Multi-currency pricing
- [ ] Application tracking system

---

**Made with ❤️ for creative communities in rural Portugal**