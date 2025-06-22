# 🎟️ Ticketing Platform

Een inschrijf- en ticketingsysteem gebouwd met **React** en **Supabase**, waarin gebruikers zich kunnen registreren voor evenementen met beperkte capaciteit. De app toont live aftellingen, statusupdates en biedt een duidelijk overzicht van inschrijvingen.

---

## 🚀 Functionaliteiten

- ✅ Inschrijven voor evenementen op basis van beschikbaarheid  
- 🕒 Live countdowns tot sluitingsdatum van inschrijving of definitieve uitslag  
- 📍 Informatie per locatie, datum en artiest  
- 📩 Bevestiging en statusupdates per gebruiker (zie `selectionLogics` tests)  
- 🔒 Geïntegreerde authenticatie via Supabase  

---

## 🛠️ Technologieën

| Technologie     | Gebruik                            |
|-----------------|-------------------------------------|
| React           | Front-end framework                 |
| Supabase        | Database, authenticatie & API       |
| CSS Modules     | Styling van componenten             |
| Lucide-react    | Icons in UI                         |

---

## 📂 Componentoverzicht

### `Header.jsx`
- Regelt de header tijdens het gebruiksproces  
- Toont afhankelijk van inlogstatus  

### `MyInscriptions.jsx`
- Haalt inschrijvingen van de gebruiker op  
- Groepeert per artiest  
- Toont status + uiterste uitslagdatum  
- Bevat live countdown tot `final_result_date`  

### `EventDates.jsx`
- Toont alle inschrijfmomenten  
- Regelt inschrijfknoppen en disable status  
- Bevat een visuele timer  

### `EventSlider.jsx`
- Horizontale scrollbare rij evenementen  
- Bevat meerdere `EventBannerCards`  

### `EventBannerCard.jsx`
- Layout van één evenement  
- Toont concertfoto, artiestnaam en genre  

### `InscriptionSuccessComponent.jsx`
- Pagina na succesvolle inschrijving  
- Bevestigt gegevens en contactinformatie  

### `LoginForm.jsx` & `RegisterForm.jsx`
- Regelen login en registratie van gebruikers  

### `MyTickets.jsx`
- Overzicht van gekochte tickets  
- Links naar individuele tickets  

### `TicketWarningComponent.jsx`
- Toont waarschuwing over ticketpersonalisatie  
- Verschijnt na betaling  

### `Ticket.jsx`
- Toont tickets van de gebruiker  
- Toekomstige uitbreiding: slider bij meerdere tickets  

### `Profile.jsx`
- Toont profielgegevens  
- Uit te breiden met wijzigfunctionaliteit of statistieken  

### `src/components/routes`
- Wordt uitgebreid om toegang tot routes te regelen  

### `src/components/admin`
- Interne shortcuts voor event-, artiest- en ticketaanmaak  
- Alleen voor dev-doeleinden, geen onderdeel eindproduct  

---

## 🔧 Logica & Helpers

### `src/lib/supabaseClient.js`
- Beheert Supabase connectie  
- Leest `REACT_APP_SUPABASE_URL` en `REACT_APP_SUPABASE_ANON_KEY` uit `.env`  

### `src/lib/selectionLogics/selectInscriptionsFIFO.js`
- Selecteert inschrijvingen op volgorde (FIFO)  
- Houdt rekening met verwachte tickets (nog toe te voegen)  

### `src/lib/selectionLogics/selectInscriptionsRandom.js`
- Selecteert inschrijvingen willekeurig  
- Houdt rekening met verwachte tickets (nog toe te voegen)  

---

## 🧑‍💻 Installatie & Opstarten

Volg deze stappen om het project lokaal te draaien:

### 1. Clone de repository
```bash
git clone https://github.com/mikedegrassi/ticket-system
cd ticketing-platform
```

### 2. Installeer de dependecies
```bash
npm install
```

### 3. Configureer je .env bestand
```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start de app
```bash
npm run start
```