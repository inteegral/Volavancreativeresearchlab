# 📊 Analytics, Forms & Newsletter - Setup Guide

Guida completa alla configurazione di **Analytics**, **Form Candidature** e **Newsletter** per VOLAVAN.

---

## 📊 1. Analytics - Plausible

### Perché Plausible?

- ✅ **Privacy-friendly** - GDPR compliant, no cookies
- ✅ **Lightweight** - Script < 1KB
- ✅ **Open source** - Alternativa a Google Analytics
- ✅ **Real-time dashboard** - Metriche istantanee
- ✅ **No personal data** - Aggregati anonimi

### Setup Plausible

#### 1. Crea Account
1. Vai su [plausible.io](https://plausible.io/)
2. Crea account (€9/mese per 10k pageviews)
3. Aggiungi sito: `volavan.com`

#### 2. Configura Environment Variables

In `.env`:
```env
VITE_ENABLE_ANALYTICS=true
VITE_PLAUSIBLE_DOMAIN=volavan.com
```

#### 3. Verifica Installazione

Lo script Plausible è già integrato in `SEOHead.tsx`:
```tsx
{enableAnalytics && (
  <script
    defer
    data-domain={plausibleDomain}
    src="https://plausible.io/js/script.js"
  />
)}
```

#### 4. Tracking Automatico

Il hook `useAnalytics()` è già attivo in `PublicLayout.tsx`:
- ✅ **Pageviews** - Tracciati automaticamente su ogni route change
- ✅ **Eventi custom** - Candidature submit, newsletter signup, etc.

### Eventi Custom Disponibili

```typescript
import { trackEvent } from '../hooks/useAnalytics';

// Application submission
trackEvent('Application Submit', { 
  program: '+-SON 2025',
  discipline: 'Music' 
});

// Newsletter signup
trackEvent('Newsletter Signup', { source: 'footer' });

// Outbound links
trackEvent('Outbound Link', { url: 'https://instagram.com/volavan' });
```

### Dashboard Plausible

Dopo 24-48h vedrai metriche in tempo reale:
- **Pageviews** - Pagine più visitate
- **Sources** - Da dove arrivano i visitatori
- **Countries** - Geolocalizzazione aggregata
- **Devices** - Desktop/Mobile/Tablet
- **Custom Events** - Candidature, newsletter, etc.

### Alternative Self-Hosted (Opzionale)

Se vuoi hostare Plausible self-hosted (gratis):
1. [Plausible Self-Hosted](https://plausible.io/docs/self-hosting)
2. Docker compose setup
3. Cambia `src` script in `SEOHead.tsx` con tuo dominio

---

## 📝 2. Form Candidature - Formspree

### Perché Formspree?

- ✅ **No backend** - Form to email senza server
- ✅ **Spam protection** - Captcha integrato
- ✅ **File uploads** - Portfolio PDF, CV
- ✅ **Email notifiche** - Ricevi candidature via email
- ✅ **Free tier** - 50 submissions/mese gratis

### Setup Formspree

#### 1. Crea Account
1. Vai su [formspree.io](https://formspree.io/)
2. Signup (free tier disponibile)
3. Crea nuovo form: "VOLAVAN - Candidature"

#### 2. Ottieni Endpoint ID

Dopo creazione form, Formspree ti darà un ID tipo:
```
YOUR_FORM_ID (es: mbjvgzqr)
```

#### 3. Configura Environment Variable

In `.env`:
```env
VITE_FORMSPREE_ENDPOINT=mbjvgzqr
```

#### 4. Form già Integrato

Il form in `/candidature` è già configurato:
```tsx
const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const onSubmit = async (data) => {
  const response = await fetch(`https://formspree.io/f/${formspreeEndpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  // Success handling...
};
```

### Formspree Dashboard

Nel dashboard vedrai:
- **Submissions** - Tutte le candidature ricevute
- **Export CSV** - Scarica dati in Excel
- **Email forwarding** - Ricevi notifiche via email
- **Spam filter** - Blocco automatico spam

### Customizzazioni Formspree

#### Email Template (opzionale)
In Formspree Dashboard → Settings:
- Configura email di notifica personalizzata
- Aggiungi CC/BCC per team members
- Auto-responder per conferma candidatura

#### File Upload (opzionale)
Per abilitare upload PDF/CV:
```tsx
<input 
  type="file" 
  {...register("portfolio")} 
  accept=".pdf"
  className="..."
/>
```

### Alternative (Opzionale)

**Web3Forms** - Simile a Formspree, free tier più generoso:
1. [web3forms.com](https://web3forms.com/)
2. Free unlimited submissions
3. Cambia endpoint in `Candidature.tsx`

**Basin (Netlify)** - Se deployi su Netlify:
1. Form nativo Netlify
2. Attributo `data-netlify="true"`
3. Nessun setup API richiesto

---

## 📧 3. Newsletter - Mailchimp

### Perché Mailchimp?

- ✅ **Industry standard** - Tool email marketing più usato
- ✅ **Free tier** - 500 contatti / 1000 email mese gratis
- ✅ **Templates** - Email drag-and-drop builder
- ✅ **Automation** - Welcome email, sequences
- ✅ **Analytics** - Open rate, click rate

### Setup Mailchimp

#### 1. Crea Account
1. Vai su [mailchimp.com](https://mailchimp.com/)
2. Signup (free tier disponibile)
3. Verifica email

#### 2. Crea Audience (Lista)
1. Dashboard → Audience → Create Audience
2. Nome: "VOLAVAN Newsletter"
3. Default from email: `info@volavan.com`
4. Default from name: "VOLAVAN"

#### 3. Ottieni Embedded Form URL

**Opzione A - Embedded Form** (consigliata):
1. Audience → Signup Forms → Embedded Forms
2. Copia URL tipo:
   ```
   https://volavan.us1.list-manage.com/subscribe/post?u=xxx&id=xxx
   ```
3. Incolla in `.env`:
   ```env
   VITE_MAILCHIMP_URL=https://volavan.us1.list-manage.com/subscribe/post?u=xxx&id=xxx
   ```

**Opzione B - API** (avanzata):
1. Account → Extras → API Keys
2. Crea API key
3. Integra con server-side proxy (non consigliato per frontend)

#### 4. Form già Integrato

Il componente `<NewsletterForm />` è già nel footer:
```tsx
<NewsletterForm /> // Footer variant
<NewsletterForm variant="inline" /> // Inline variant
```

### Mailchimp Dashboard

Funzionalità disponibili:
- **Contacts** - Lista subscribers
- **Campaigns** - Crea email newsletter
- **Automations** - Welcome email flow
- **Reports** - Open rate, click analytics
- **Segments** - Filtra per interesse (artisti, residenze, etc.)

### Customizzazioni Mailchimp

#### Welcome Email Automation
1. Automations → Create → Welcome New Subscribers
2. Template email con:
   - Benvenuto VOLAVAN
   - Link ultime residenze
   - Link social media

#### Email Templates
1. Campaigns → Create Campaign → Email
2. Template suggerito:
   - **Header**: Logo VOLAVAN + colori brand
   - **Hero**: Immagine residenza del mese
   - **Content**: 2-3 notizie/articoli
   - **Footer**: Social links + unsubscribe

#### GDPR Compliance
Mailchimp è GDPR compliant di default:
- ✅ Checkbox consenso marketing
- ✅ Link unsubscribe obbligatorio
- ✅ Data export richiesta

---

## 📧 3bis. Newsletter - Brevo (Alternativa)

### Perché Brevo (ex Sendinblue)?

- ✅ **Free tier generoso** - 300 email/giorno gratis forever
- ✅ **Transactional email** - Anche conferme candidature
- ✅ **SMS** - Bonus SMS marketing
- ✅ **CRM integrato** - Gestisci contatti artisti
- ✅ **API migliore** - Più facile da integrare

### Setup Brevo

#### 1. Crea Account
1. Vai su [brevo.com](https://www.brevo.com/)
2. Signup (free tier disponibile)
3. Verifica email

#### 2. Crea API Key
1. Settings → API Keys
2. Crea v3 API key
3. Copia chiave (es: `xkeysib-xxx`)

#### 3. Crea Lista Contatti
1. Contacts → Lists → Create List
2. Nome: "VOLAVAN Newsletter"
3. Annota ID lista (es: `2`)

#### 4. Configura Environment Variables

In `.env`:
```env
VITE_BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxx
VITE_BREVO_LIST_ID=2
```

#### 5. Form già Integrato

`NewsletterForm` supporta automaticamente Brevo:
```tsx
// Se VITE_BREVO_API_KEY è configurato, usa Brevo
// Altrimenti usa Mailchimp
```

### Brevo Dashboard

Funzionalità disponibili:
- **Contacts** - CRM con info artisti
- **Campaigns** - Email drag-and-drop
- **Transactional** - Email conferma candidature
- **SMS** - (opzionale) campagne SMS
- **Analytics** - Real-time metrics

---

## 🔧 Testing Locale

### Test Analytics (Development)

Con `VITE_ENABLE_ANALYTICS=false`, gli eventi vengono loggati in console:
```bash
📊 Pageview: /residencies
📊 Analytics Event: Application Submit { program: '+-SON 2025' }
```

### Test Form Candidature

1. **Modalità Development**:
   ```env
   VITE_FORMSPREE_ENDPOINT=YOUR_FORMSPREE_ID
   ```
   Test su endpoint reale Formspree (controlla submissions in dashboard)

2. **Modalità Mock**:
   Rimuovi `VITE_FORMSPREE_ENDPOINT` → form mostra toast success senza inviare

### Test Newsletter

1. **Modalità Development**:
   - Senza `VITE_MAILCHIMP_URL` → toast success demo mode
   - Con `VITE_MAILCHIMP_URL` → subscription reale

2. **Verifica Subscription**:
   - Iscriviti con email test
   - Controlla Mailchimp/Brevo dashboard
   - Verifica email di conferma double opt-in

---

## 📈 Monitoraggio & KPI

### Metriche Analytics da Tracciare

**Traffico**:
- Pageviews totali
- Pagine più viste: `/residencies`, `/artists`, `/journal`
- Bounce rate per pagina

**Conversioni**:
- Application Submit rate
- Newsletter signup rate
- Outbound link clicks (social, external sites)

**Engagement**:
- Tempo medio sulla pagina
- Scroll depth (con Plausible custom event)
- Video play rate (YouTube embeds)

### Goal Setup Plausible

1. Dashboard → Settings → Goals
2. Aggiungi:
   - **Application Submit** (Custom Event)
   - **Newsletter Signup** (Custom Event)
   - **Outbound Link** (Outbound Link Click)

### Dashboard Mensile

Crea report mensile con:
- **Traffic**: Visitatori unici, pageviews
- **Sources**: Organic search, social, direct
- **Conversions**: Candidature inviate, newsletter iscritti
- **Top Content**: Residenze più viste, articoli più letti

---

## 🚀 Deploy Checklist

Antes del deploy production:

### Analytics
- [ ] Account Plausible attivato e configurato
- [ ] `VITE_PLAUSIBLE_DOMAIN` corretto in production env vars
- [ ] `VITE_ENABLE_ANALYTICS=true` in production
- [ ] Verifica script carica correttamente (Network tab)
- [ ] Test eventi custom funzionano

### Form Candidature
- [ ] Account Formspree attivato
- [ ] `VITE_FORMSPREE_ENDPOINT` corretto in production
- [ ] Email forwarding configurato (dove arrivano candidature?)
- [ ] Auto-responder configurato (opzionale)
- [ ] Test submission reale funziona

### Newsletter
- [ ] Account Mailchimp/Brevo attivato
- [ ] `VITE_MAILCHIMP_URL` o `VITE_BREVO_API_KEY` configurato
- [ ] Welcome email automation attiva
- [ ] Double opt-in abilitato (GDPR)
- [ ] Unsubscribe link presente
- [ ] Test iscrizione reale funziona

---

## 🆘 Troubleshooting

### Analytics non traccia pageviews

**Problema**: Script Plausible non carica

**Soluzioni**:
1. Verifica `VITE_ENABLE_ANALYTICS=true`
2. Controlla `VITE_PLAUSIBLE_DOMAIN` match con dominio Plausible dashboard
3. Disabilita AdBlock/uBlock (bloccano script analytics)
4. Verifica CSP headers non bloccano `plausible.io`

### Form candidature non invia

**Problema**: Fetch error o 404

**Soluzioni**:
1. Verifica `VITE_FORMSPREE_ENDPOINT` corretto (solo ID, no URL completo)
2. Controlla Formspree dashboard → Form è attivo?
3. CORS issue → Aggiungi dominio in Formspree settings
4. Network tab → Vedi response error dettagliato

### Newsletter subscription fallisce

**Problema**: Mailchimp embedded form no-cors issue

**Soluzioni**:
1. **Mailchimp**: Usa `mode: 'no-cors'` (già implementato)
   - Non puoi leggere response, assume success
   - Verifica subscription in Mailchimp dashboard manualmente
2. **Brevo**: Usa API diretta (già implementato)
   - Legge response JSON, gestisce errori
3. **Alternativa**: Implementa server-side proxy

---

## 💡 Best Practices

### Privacy & GDPR

1. **Cookie Banner** (opzionale con Plausible):
   - Plausible NO cookies → non serve banner
   - Se usi Google Analytics → serve banner

2. **Privacy Policy**:
   - Menziona Plausible analytics
   - Link Mailchimp/Brevo privacy policy
   - Right to access/delete data

3. **Data Retention**:
   - Plausible: 30 giorni default
   - Mailchimp: Indefinito (segmenta inactive dopo 6 mesi)

### UX Form Candidature

1. **Validazione client-side** - React Hook Form già implementato
2. **Loading states** - Spinner durante submit
3. **Success message** - Toast con conferma
4. **Error handling** - Retry su network error
5. **Autosave draft** (opzionale) - localStorage

### Email Marketing

1. **Frequenza**: Max 1-2 newsletter/mese
2. **Contenuti**:
   - Nuove residenze aperte
   - Spotlight artisti
   - Behind the scenes VOLAVAN
3. **A/B Testing**: Subject line con Mailchimp
4. **Segmentazione**: Artisti vs. Visitatori generici

---

## 📚 Risorse

### Documentazione Ufficiale

- **Plausible**: https://plausible.io/docs
- **Formspree**: https://formspree.io/docs
- **Mailchimp**: https://mailchimp.com/developer/
- **Brevo**: https://developers.brevo.com/

### Tools Utili

- **Email Template Builder**: https://beefree.io/ (free)
- **Plausible Self-Hosted**: https://plausible.io/docs/self-hosting
- **Mailchimp Template Gallery**: https://templates.mailchimp.com/

### Alternative Tools

**Analytics**:
- Fathom Analytics (privacy-friendly, $14/mese)
- Umami (open source, self-hosted)
- Simple Analytics (privacy-friendly, €19/mese)

**Forms**:
- Basin (Netlify Forms)
- Web3Forms (free unlimited)
- Google Forms (gratis ma no auto-email)

**Newsletter**:
- ConvertKit (per creators, $9/mese)
- Buttondown (minimalista, $9/mese)
- Listmonk (open source, self-hosted)

---

**Setup completato! 🎉 Ora VOLAVAN ha Analytics, Form Candidature e Newsletter funzionanti.**
