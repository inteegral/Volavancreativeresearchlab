# Ottimizzazioni Immagini Sanity - Guida all'Uso

## Funzioni Helper Disponibili

### 1. `getImageUrl()` - URL ottimizzato con formato automatico
```typescript
getImageUrl(
  image: SanityImage | undefined,
  width?: number,
  height?: number,
  quality?: number = 80
): string | undefined

// Ora include automaticamente:
// - .auto('format') per WebP/AVIF
// - .quality(80) per compressione ottimale
```

**Esempio:**
```typescript
const url = getImageUrl(coverImage, 1200, 800, 85);
// URL con formato ottimale e quality 85
```

---

### 2. `getImageSrcSet()` - Responsive srcset
```typescript
getImageSrcSet(
  image: SanityImage | undefined,
  widths?: number[] = [320, 640, 960, 1280, 1920],
  quality?: number = 80
): string | undefined
```

**Esempio:**
```typescript
const srcSet = getImageSrcSet(heroImage, [640, 1280, 1920], 90);
// Output: "https://cdn.sanity.io/...&w=640 640w, ...&w=1280 1280w, ...&w=1920 1920w"
```

---

### 3. `getImageBlurUrl()` - Blur placeholder (LQIP)
```typescript
getImageBlurUrl(image: SanityImage | undefined): string | undefined

// Genera un'immagine 20px con blur, quality 20
```

**Esempio:**
```typescript
const blurUrl = getImageBlurUrl(image);
// Perfetto per placeholder durante il caricamento
```

---

## Componente `<SanityImage />` - Uso Consigliato

Il componente ottimizzato include **tutte le best practice**:

### Props
```typescript
interface SanityImageProps {
  image: SanityImage | undefined;
  alt: string;                          // Richiesto per accessibilità
  width?: number;                       // Larghezza target
  height?: number;                      // Altezza target
  quality?: number;                     // Default: 80
  sizes?: string;                       // Default: '100vw'
  className?: string;                   // Classi Tailwind
  priority?: boolean;                   // Per hero images
  widths?: number[];                    // Breakpoints custom
}
```

### Funzionalità Integrate
✅ **Auto WebP/AVIF** - Formato ottimale per ogni browser  
✅ **Responsive srcset** - 5 breakpoints di default (320, 640, 960, 1280, 1920)  
✅ **Blur placeholder** - LQIP per caricamento smooth  
✅ **Lazy loading** - Tranne se `priority={true}`  
✅ **Fade-in animation** - Transizione opacity 500ms  
✅ **Caption support** - Mostra caption se presente  
✅ **Fallback** - Box grigio se immagine mancante  

---

## Esempi Pratici

### 1. Hero Image (priorità alta)
```tsx
<SanityImage
  image={data.heroImage}
  alt="VOLAVAN residency space"
  width={1920}
  height={1080}
  quality={90}
  sizes="100vw"
  priority={true}
  className="w-full h-[600px]"
/>
```

### 2. Card Image (responsive)
```tsx
<SanityImage
  image={program.coverImage}
  alt={program.name}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-64 rounded-lg"
/>
```

### 3. Thumbnail (piccola)
```tsx
<SanityImage
  image={artist.photo}
  alt={artist.name}
  width={200}
  height={200}
  quality={75}
  widths={[200, 400]}
  sizes="200px"
  className="w-20 h-20 rounded-full"
/>
```

### 4. Gallery (grid)
```tsx
<div className="grid grid-cols-3 gap-4">
  {gallery.map((image, i) => (
    <SanityImage
      key={i}
      image={image}
      alt={`Gallery image ${i + 1}`}
      width={600}
      height={400}
      sizes="(max-width: 768px) 100vw, 33vw"
      className="w-full aspect-[3/2]"
    />
  ))}
</div>
```

---

## Migrazione dal Codice Esistente

### Prima (vecchio metodo):
```tsx
<img
  src={getImageUrl(coverImage, 800)}
  alt="Cover"
  className="w-full h-64"
/>
```

### Dopo (componente ottimizzato):
```tsx
<SanityImage
  image={coverImage}
  alt="Cover"
  width={800}
  sizes="(max-width: 768px) 100vw, 800px"
  className="w-full h-64"
/>
```

---

## Configurazione `sizes` per Responsive

Il parametro `sizes` indica al browser quale dimensione di immagine caricare:

### Layout a larghezza piena
```tsx
sizes="100vw"
```

### Layout a 2 colonne su desktop
```tsx
sizes="(max-width: 768px) 100vw, 50vw"
```

### Layout a 3 colonne con max-width
```tsx
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
```

### Sidebar fissa
```tsx
sizes="300px"
```

---

## Breakpoints Default

Il componente genera automaticamente 5 versioni:
- **320px** - Mobile portrait
- **640px** - Mobile landscape  
- **960px** - Tablet
- **1280px** - Desktop
- **1920px** - Desktop HD

Puoi personalizzarli con la prop `widths`:
```tsx
widths={[400, 800, 1200]} // Solo 3 breakpoints
```

---

## Performance Tips

### 1. Usa `priority={true}` solo per hero images
```tsx
<SanityImage priority={true} /> // Solo above-the-fold
```

### 2. Specifica sempre `sizes` accurato
```tsx
// ❌ Spreco di banda
sizes="100vw"

// ✅ Ottimale
sizes="(max-width: 768px) 100vw, 400px"
```

### 3. Riduci quality per thumbnails
```tsx
quality={70} // Thumbnails
quality={80} // Default
quality={90} // Hero images
```

### 4. Limita breakpoints se non necessari
```tsx
widths={[320, 640]} // Solo mobile/tablet
```

---

## DNS Preconnect (già configurato)

In `SEOHead.tsx` è già presente:
```tsx
<link rel="preconnect" href="https://cdn.sanity.io" />
<link rel="dns-prefetch" href="https://cdn.sanity.io" />
```

Questo riduce la latenza sulle richieste a Sanity CDN.

---

## Checklist Ottimizzazione

- [x] `.auto('format')` per WebP/AVIF
- [x] `.quality()` configurabile
- [x] `srcset` responsive
- [x] Blur placeholder (LQIP)
- [x] Lazy loading
- [x] Preconnect DNS
- [x] Componente React riutilizzabile
- [ ] Virtual scrolling (se liste lunghe)
- [ ] Skeleton loaders (opzionale)

---

## Prossimi Passi Opzionali

1. **Skeleton loaders** invece di blur placeholder
2. **Virtual scrolling** per Artists/Journal se +100 items
3. **Intersection Observer** per prefetch hover
4. **Code splitting** con React.lazy() per pagine
