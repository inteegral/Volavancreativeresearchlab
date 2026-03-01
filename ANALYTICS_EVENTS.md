# 📊 Google Analytics 4 - Eventi Tracciati

## 🎯 Eventi Implementati

### ✅ **Eventi Automatici (già attivi)**

#### 1. **`page_view`** - Visualizzazione Pagina
- **Quando**: Ogni cambio di rotta (automatico)
- **Parametri**:
  - `page_path`: `/residencies`, `/journal`, etc.
  - `page_location`: URL completo

#### 2. **`view_residency`** - Visualizzazione Residenza
- **Quando**: Apertura pagina dettaglio residenza
- **Parametri**:
  - `program_name`: "Contemporaneo", "Ca Tru", etc.
  - `year`: 2024, 2025, etc.
  - `status`: "open_call", "in_progress", "completed"
  - `location`: "Alentejo", "Hanoi"
  - `country`: "Portugal", "Vietnam"
- **File**: `/src/app/pages/public/ResidencyDetail.tsx`

#### 3. **`view_article`** - Lettura Articolo Journal
- **Quando**: Apertura pagina articolo/video
- **Parametri**:
  - `article_title`: Titolo dell'articolo
  - `article_type`: "journal" o "videoPost"
  - `author`: Nome autore
  - `categories`: Categorie separate da virgola
  - `published_date`: Data pubblicazione
- **File**: `/src/app/pages/public/JournalDetail.tsx`

#### 4. **`application_started`** - Inizio Candidatura
- **Quando**: Apertura form di candidatura
- **Parametri**:
  - `program_name`: Nome del programma
  - `year`: Anno della residenza
  - `timestamp`: Data/ora dell'evento
- **File**: `/src/app/pages/public/Candidature.tsx`

#### 5. **`application_submitted`** - Invio Candidatura
- **Quando**: Submit form candidatura con successo
- **Parametri**:
  - `program_name`: Nome del programma
  - `year`: Anno della residenza
  - `timestamp`: Data/ora dell'evento
- **File**: `/src/app/pages/public/Candidature.tsx`

---

### 🔜 **Eventi Pronti (da attivare quando i form saranno implementati)**

#### 6. **`newsletter_subscribe`** - Iscrizione Newsletter
- **Come usare**:
```typescript
import { trackNewsletterSubscribe } from '../lib/analytics-events';

// Nel componente newsletter (dopo invio a MailerLite)
trackNewsletterSubscribe('footer'); // o 'header', 'popup', etc.
```
- **Parametri**:
  - `form_location`: "footer", "header", "popup"
  - `timestamp`: Data/ora dell'evento

#### 7. **`contact_form_submit`** - Invio Form Contatto
- **Come usare**:
```typescript
import { trackContactFormSubmit } from '../lib/analytics-events';

// Nel componente contact form
trackContactFormSubmit('general'); // o 'booking', 'partnership', etc.
```
- **Parametri**:
  - `form_type`: "general", "booking", "partnership"
  - `timestamp`: Data/ora dell'evento

#### 8. **`download_brochure`** - Download File/Brochure
- **Come usare**:
```typescript
import { trackDownload } from '../lib/analytics-events';

// Nel link download
<a 
  href="/brochure.pdf" 
  onClick={() => trackDownload('volavan-brochure.pdf', 'pdf')}
>
  Download Brochure
</a>
```
- **Parametri**:
  - `file_name`: Nome del file
  - `file_type`: "pdf", "zip", etc.
  - `timestamp`: Data/ora dell'evento

#### 9. **`external_link_click`** - Click Link Esterni
- **Come usare**:
```typescript
import { trackExternalLinkClick } from '../lib/analytics-events';

// Nei link social/partner
<a 
  href="https://instagram.com/volavan" 
  onClick={() => trackExternalLinkClick('https://instagram.com/volavan', 'Instagram')}
>
  Follow on Instagram
</a>
```
- **Parametri**:
  - `link_url`: URL completo
  - `link_text`: Testo descrittivo
  - `timestamp`: Data/ora dell'evento

---

## 📈 **Come Configurare Conversioni in GA4**

### 1. Vai su Google Analytics
👉 https://analytics.google.com

### 2. Admin → Events
- Click **Admin** (⚙️ icona in basso a sinistra)
- Colonna **Property** → **Events**

### 3. Marca Eventi come Conversioni
Click sull'interruttore **"Mark as conversion"** per questi eventi:

#### **🎯 Conversioni Principali:**
- ✅ `application_submitted` ← **PRIORITÀ MASSIMA**
- ✅ `newsletter_subscribe`
- ✅ `contact_form_submit`

#### **📊 Conversioni Secondarie:**
- ⭕ `application_started` (per tracking funnel)
- ⭕ `view_residency` (per remarketing)
- ⭕ `download_brochure` (se implementato)

---

## 🔍 **Monitoraggio Eventi in Tempo Reale**

### **Realtime Reports**
👉 **Reports → Realtime → Event count by Event name**

Dovresti vedere:
- `page_view` → Ogni navigazione
- `view_residency` → Click su residenze
- `view_article` → Lettura articoli
- `application_started` → Aperture form
- `application_submitted` → Invii completati

### **Debug Mode (già attivo)**
Gli eventi appaiono anche nel **DebugView**:
👉 **Admin → DebugView**

---

## 📂 **File da Conoscere**

| File | Descrizione |
|------|-------------|
| `/src/app/hooks/useAnalytics.ts` | Hook principale per tracking pageview automatico |
| `/src/app/components/AnalyticsProvider.tsx` | Provider che carica GA4 script |
| `/src/app/lib/analytics-events.ts` | **Helper functions per tutti gli eventi custom** |
| `/src/app/pages/public/ResidencyDetail.tsx` | Tracking `view_residency` |
| `/src/app/pages/public/JournalDetail.tsx` | Tracking `view_article` |
| `/src/app/pages/public/Candidature.tsx` | Tracking `application_started` e `application_submitted` |

---

## 🧪 **Testing Eventi**

### **Test Manuale dalla Console:**

```javascript
// Test generico
window.gtag('event', 'test_event', {test_param: 'hello'})

// Test newsletter
window.gtag('event', 'newsletter_subscribe', {form_location: 'footer'})

// Test application
window.gtag('event', 'application_submitted', {program_name: 'Contemporaneo', year: 2025})
```

### **Verifica:**
1. **Network Tab** → Cerca `collect` (deve apparire petizione a Google)
2. **GA4 Realtime** → Vedi l'evento nei reports

---

## 📊 **Metriche Chiave da Monitorare**

### **Conversioni:**
- **Application Submission Rate** = `application_submitted` / `application_started`
- **Program Interest** = `view_residency` per programma
- **Newsletter Conversion** = `newsletter_subscribe` / visitatori

### **Funnel Candidature:**
1. `view_residency` → Interesse
2. Click "Apply Now" → Intent
3. `application_started` → Apertura form
4. `application_submitted` → Conversione ✅

---

## 🎯 **Best Practices**

✅ **DO:**
- Traccia solo eventi significativi (conversioni, engagement importante)
- Usa nomi eventi chiari e consistenti
- Includi parametri utili per segmentazione

❌ **DON'T:**
- Non tracciare troppi eventi (max 500 eventi unici/property)
- Non includere dati personali (email, nomi) negli eventi
- Non duplicare tracking dello stesso evento

---

## 📞 **Supporto**

Per domande su implementazione eventi:
1. Controlla `/src/app/lib/analytics-events.ts` per esempi
2. Vedi documentazione GA4: https://developers.google.com/analytics/devguides/collection/ga4/events

---

**🎉 Tutto configurato e funzionante!**
