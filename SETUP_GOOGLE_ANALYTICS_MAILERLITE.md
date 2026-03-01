# 🚀 Setup Guide: Google Analytics 4 + MailerLite

Guida rapida per configurare **Google Analytics 4** (gratis) e **MailerLite** (newsletter) per VOLAVAN.

---

## 📊 Google Analytics 4 (GA4)

### Step 1: Crea Account Google Analytics

1. Vai su **[analytics.google.com](https://analytics.google.com)**
2. Accedi con account Google (o creane uno)
3. Clicca **"Inizia a misurare"** (Start measuring)

### Step 2: Crea Proprietà GA4

1. **Account name**: `VOLAVAN`
2. **Property name**: `VOLAVAN Website`
3. **Timezone**: `(GMT+01:00) Rome`
4. **Currency**: `Euro (EUR)`
5. Clicca **"Avanti"** (Next)

### Step 3: Configura Stream Dati

1. **Piattaforma**: Seleziona **"Web"**
2. **Website URL**: `https://volavan.com` (o tuo dominio)
3. **Stream name**: `VOLAVAN Production`
4. Clicca **"Crea stream"** (Create stream)

### Step 4: Ottieni Measurement ID

Dopo creazione stream, vedrai:

```
Measurement ID: G-XXXXXXXXXX
```

**Copia questo ID!** Lo userai nel `.env`

### Step 5: Configura Environment Variable

Nel file `.env`:

```env
VITE_ENABLE_ANALYTICS=true
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Sostituisci con il tuo ID
```

### Step 6: Verifica Funzionamento

1. Avvia dev server: `pnpm run dev`
2. Visita `http://localhost:5173`
3. Apri **Developer Tools** → **Network tab**
4. Cerca richieste a `google-analytics.com/g/collect`
5. In alternativa, vai su **GA4 Dashboard** → **Rapporti** → **Tempo reale**
6. Dovresti vedere la tua visita in tempo reale!

### Eventi Tracciati Automaticamente

✅ **Pageviews**: Ogni cambio route viene tracciato
✅ **Eventi Custom**:
- `application_submit` - Quando qualcuno invia candidatura
- `newsletter_signup` - Quando qualcuno si iscrive alla newsletter
- `click` (categoria: outbound) - Link esterni
- `file_download` - Download file

### Dashboard Google Analytics

Dopo 24-48 ore vedrai:

**Rapporti → Acquisizione**:
- Traffic sources (da dove arrivano gli utenti)
- Canali (Organic Search, Social, Direct)

**Rapporti → Coinvolgimento**:
- Pagine più visitate
- Eventi (candidature, newsletter, etc.)

**Rapporti → Dati demografici**:
- Paesi/città visitatori
- Lingue
- Dispositivi (Desktop/Mobile/Tablet)

### Impostazioni Consigliate

**Privacy**:
1. GA4 Dashboard → **Amministrazione** → **Impostazioni proprietà**
2. **Raccolta dati**:
   - ✅ Anonimizzazione IP (già attivo nel codice)
   - ❌ Disabilita "Google Signals" (GDPR compliance)
3. **Conservazione dati**: 14 mesi (default)

**Cookie Consent** (opzionale):
- Google Analytics usa cookie, quindi tecnicamente serve banner GDPR
- Alternativa: Usa **Plausible Analytics** (no cookie, privacy-friendly)

---

## 📧 MailerLite

### Step 1: Crea Account MailerLite

1. Vai su **[mailerlite.com](https://www.mailerlite.com)**
2. Clicca **"Sign up free"**
3. Inserisci email e password
4. Verifica email

**Piano Free**:
- ✅ Fino a 1.000 subscribers
- ✅ 12.000 email/mese
- ✅ Email builder drag-and-drop
- ✅ Automazioni base

### Step 2: Crea Gruppo (Lista)

1. Dashboard → **Subscribers** → **Groups**
2. Clicca **"Create group"**
3. Nome: `VOLAVAN Newsletter`
4. Salva

### Step 3: Ottieni API Key

1. Dashboard → **Settings** (icona ingranaggio)
2. Menu laterale → **Integrations** → **Developer API**
3. Clicca **"Generate new token"**
4. Nome token: `VOLAVAN Website`
5. **Copia la API key** (inizia con lettere maiuscole, tipo `eyJ0eXAiOiJKV1QiLCJh...`)

⚠️ **IMPORTANTE**: Salva subito la API key, non la potrai rivedere dopo!

### Step 4: Trova Group ID (Opzionale)

Se vuoi aggiungere subscriber a un gruppo specifico:

1. Subscribers → Groups
2. Clicca sul gruppo `VOLAVAN Newsletter`
3. Nell'URL vedrai: `mailerlite.com/subscribers/groups/12345`
4. Il numero `12345` è il **Group ID**

### Step 5: Configura Environment Variables

Nel file `.env`:

```env
VITE_MAILERLITE_API_KEY=eyJ0eXAiOiJKV1QiLCJh...  # La tua API key
VITE_MAILERLITE_GROUP_ID=12345  # (Opzionale) ID gruppo
```

### Step 6: Verifica Funzionamento

1. Avvia dev server: `pnpm run dev`
2. Scroll al footer
3. Inserisci email nel form newsletter
4. Clicca **"Subscribe"**
5. Dovresti vedere toast verde **"Successfully subscribed!"**

Verifica in MailerLite:
1. Dashboard → **Subscribers**
2. La tua email dovrebbe apparire nella lista!

### Double Opt-In (GDPR Compliance)

MailerLite di default usa **double opt-in** (conferma via email):

1. Subscriber inserisce email
2. MailerLite invia email di conferma
3. Subscriber clicca link → Confermato!

**Per disabilitare** (sconsigliato per GDPR):
1. Settings → Forms → **Turn off double opt-in**

### Welcome Email Automation

Crea email automatica di benvenuto:

1. Dashboard → **Automations**
2. Clicca **"Create workflow"**
3. Template: **"Welcome new subscriber"**
4. Trigger: **"Joins a group"** → Seleziona `VOLAVAN Newsletter`
5. **Edit email**:
   - Subject: `Benvenuto in VOLAVAN! 🌿`
   - Body: 
     ```
     Ciao {$name}!
     
     Grazie per esserti iscritto alla newsletter di VOLAVAN.
     
     Ogni mese riceverai:
     - Annunci nuove residenze artistiche
     - Open call e opportunità
     - Storie dai nostri artisti
     - Eventi e workshop
     
     A presto!
     Il team VOLAVAN
     
     ---
     Instagram: @volavan.rural
     Website: volavan.com
     ```
6. Salva e **attiva workflow**

### Email Campaigns (Newsletter Manuale)

Per inviare newsletter manualmente:

1. **Campaigns** → **Create campaign**
2. **Email type**: Newsletter
3. **Subject**: Es. "Nuove residenze aperte - Primavera 2025"
4. **From**: `info@volavan.com` (configura in Settings)
5. **Drag-and-drop editor**:
   - Aggiungi immagini residenze
   - Testo descrittivo
   - CTA button → "Scopri di più"
6. **Preview & test**: Invia email di prova a te stesso
7. **Send**: Invia a tutti i subscriber

### Segmentazione (Avanzato)

Filtra subscriber per interesse:

1. **Subscribers** → **Segments**
2. Crea segmento: `Interessati a Residenze Musicali`
3. Condizione: Es. "Ha cliccato link con `music` nell'URL"
4. Invia campagne mirate solo a quel segmento

### Unsubscribe Automatico

MailerLite aggiunge automaticamente link "Unsubscribe" a tutte le email (GDPR required).

---

## 🧪 Testing Completo

### Test Analytics

```bash
# 1. Avvia dev server
pnpm run dev

# 2. Apri browser in modalità incognito
# 3. Naviga tra le pagine
# 4. Invia candidatura
# 5. Iscriviti a newsletter

# 6. Controlla console browser
# Dovresti vedere log tipo:
# 📊 Pageview: /residencies
# 📊 Analytics Event: newsletter_signup { source: 'footer' }

# 7. Controlla GA4 Dashboard → Tempo reale
# Dovresti vedere eventi in tempo reale!
```

### Test Newsletter

```bash
# 1. Usa email reale (per ricevere conferma double opt-in)
# 2. Inserisci nel footer form
# 3. Clicca Subscribe
# 4. Controlla inbox → Email conferma MailerLite
# 5. Clicca link conferma
# 6. Se hai attivato welcome email → Riceverai benvenuto automatico
```

---

## 🚀 Deploy Production

### Vercel / Netlify

1. **Push codice** su Git
2. **Collega repository** a Vercel/Netlify
3. **Aggiungi Environment Variables**:
   ```
   VITE_SANITY_PROJECT_ID=98dco624
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-01-01
   VITE_ENABLE_ANALYTICS=true
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_MAILERLITE_API_KEY=eyJ0eXAiOiJKV1Qi...
   VITE_MAILERLITE_GROUP_ID=12345
   VITE_FORMSPREE_ENDPOINT=YOUR_FORMSPREE_ID
   ```
4. **Deploy!**

### Verifica Post-Deploy

1. Visita sito production (`https://volavan.com`)
2. Iscriviti alla newsletter con email test
3. Controlla GA4 Dashboard → Tempo reale
4. Controlla MailerLite → Subscribers

---

## 📊 KPI da Monitorare

### Google Analytics (Metriche Chiave)

**Settimanali**:
- Utenti totali
- Pageviews
- Pagine top: `/residencies`, `/journal`, `/artists`
- Bounce rate (ideale < 50%)

**Mensili**:
- Newsletter signup rate
- Application submit rate
- Traffic sources (Organic, Social, Direct)
- Top countries (per espandere marketing)

**Eventi Custom**:
- `newsletter_signup`: Quanti si iscrivono
- `application_submit`: Quante candidature

### MailerLite (Metriche Email)

**Dopo ogni campagna**:
- **Open rate**: % email aperte (ideale > 20%)
- **Click rate**: % clic su link (ideale > 2.5%)
- **Unsubscribe rate**: % disinscrizioni (ideale < 0.5%)

**Crescita lista**:
- Nuovi subscriber/mese
- Subscriber totali
- Tasso crescita %

---

## 🛠️ Troubleshooting

### Google Analytics

**❌ Eventi non appaiono in GA4**

Soluzioni:
1. Verifica `VITE_GA_MEASUREMENT_ID` corretto in `.env`
2. Controlla script carica in `<head>` (Inspect → Network tab)
3. AdBlock/uBlock blocca analytics → Disabilita per test
4. Attendi 24-48h per dati non real-time

**❌ Tracking duplicato**

Soluzioni:
1. Controlla di non aver aggiunto script GA due volte
2. Verifica solo una istanza di `useAnalytics()` hook

### MailerLite

**❌ Subscription fallisce (error 401)**

Soluzioni:
1. Verifica `VITE_MAILERLITE_API_KEY` corretto
2. API key deve iniziare con `eyJ...`
3. Controlla API key non sia scaduta (Settings → Developer API)

**❌ Subscriber non appare in lista**

Soluzioni:
1. Controlla status: "Unconfirmed" → Serve conferma double opt-in
2. Verifica email non sia già in lista (MailerLite blocca duplicati)
3. Controlla SPAM folder per email conferma

**❌ CORS error**

Soluzioni:
1. MailerLite API v2 supporta CORS, non dovrebbe dare problemi
2. Verifica URL API: `https://api.mailerlite.com/api/v2/subscribers`
3. Se persiste, usa server-side proxy (Netlify Functions/Vercel Serverless)

---

## 💡 Best Practices

### Analytics

1. **Non trackare PII** (Personally Identifiable Information)
   - ❌ Email, nomi, telefoni negli eventi
   - ✅ Dati aggregati (es. `discipline: 'Music'`)

2. **Cookie Banner** (GDPR)
   - Google Analytics usa cookie → Serve consenso EU
   - Opzioni:
     - Implementa banner cookie (CookieBot, Osano)
     - Oppure migra a **Plausible Analytics** (no cookie)

3. **Escludi traffico interno**
   - GA4 → Amministrazione → Stream dati → Filtri
   - Aggiungi filtro: Escludi IP tuo ufficio

### Newsletter

1. **Frequenza invii**: Max 1-2 email/mese
   - Troppi invii → Aumento unsubscribe

2. **Oggetto email**:
   - Breve (< 50 caratteri)
   - Chiaro e personale
   - Es: "3 nuove residenze aperte 🎨" > "Newsletter Marzo"

3. **Design email**:
   - Mobile-first (60% legge su smartphone)
   - CTA button chiaro
   - Immagini ottimizzate (< 500KB totale)

4. **A/B Testing**:
   - MailerLite permette test su oggetto email
   - Testa 2 varianti → Invia vincitrice a tutti

5. **Clean list**:
   - Ogni 6 mesi, rimuovi subscriber inattivi (mai aperto email)
   - Migliora deliverability e open rate

---

## 📚 Risorse

### Documentazione Ufficiale

- **Google Analytics 4**: https://support.google.com/analytics/answer/9304153
- **MailerLite API**: https://developers.mailerlite.com/docs
- **MailerLite Academy**: https://www.mailerlite.com/academy (guide email marketing)

### Tools Utili

- **GA4 Real-time Debugger**: Chrome extension "Google Analytics Debugger"
- **Email Preview**: litmus.com (vedi email in 90+ client)
- **GDPR Compliance**: iubenda.com (genera Privacy Policy)

---

## ✅ Checklist Finale

### Google Analytics 4

- [ ] Account GA4 creato
- [ ] Proprietà configurata per `volavan.com`
- [ ] Measurement ID copiato
- [ ] `VITE_GA_MEASUREMENT_ID` configurato in `.env`
- [ ] Script GA4 carica correttamente (Network tab)
- [ ] Eventi visibili in Tempo reale
- [ ] Privacy settings configurate (anonimizzazione IP)

### MailerLite

- [ ] Account MailerLite creato (piano free ok)
- [ ] Gruppo `VOLAVAN Newsletter` creato
- [ ] API key generata e copiata
- [ ] `VITE_MAILERLITE_API_KEY` configurato in `.env`
- [ ] Test subscription funziona
- [ ] Email conferma double opt-in ricevuta
- [ ] Welcome email automation configurata (opzionale)

### Production Deploy

- [ ] Environment variables configurate su Vercel/Netlify
- [ ] Sito deployed e accessibile
- [ ] Test newsletter su production
- [ ] Test analytics su production
- [ ] GA4 dashboard mostra traffico reale
- [ ] MailerLite riceve nuovi subscriber

---

**Setup completato! 🎉 VOLAVAN ora ha analytics e newsletter funzionanti.**
