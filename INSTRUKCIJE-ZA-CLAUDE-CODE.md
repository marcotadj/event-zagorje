# INSTRUKCIJE ZA CLAUDE CODE — izrada web stranice Event.zagorje

Ovo je kompletan brief s materijalima za izradu web stranice firme **Event.zagorje**
(najam opreme i organizacija evenata, Hrvatsko zagorje). Svi podaci su povučeni s
Instagrama @event_zagorje. Tekst i slike su u ovoj mapi.

---

## 🎯 CILJ
Napravi modernu, responzivnu **one-page (landing) web stranicu** na hrvatskom jeziku
koja prezentira firmu, njihove usluge, reference i kontakt. Cilj stranice: posjetitelj
brzo shvati što firma nudi i **nazove / pošalje upit** (telefon, WhatsApp, e-mail).

## 🧰 PREPORUČENI STACK
- Čisti **HTML + CSS + malo JS-a** (bez teškog frameworka) ILI Astro/Vite ako želiš build.
- Mora raditi otvaranjem `index.html` lokalno i biti spremno za deploy (Netlify/Vercel/GitHub Pages).
- Bez backenda. Forma za upit neka koristi `mailto:` ili linka na WhatsApp.
- Responzivno (mobile-first) — većina prometa dolazi s Instagrama → mobitel.

---

## 📁 ŠTO JE U OVOJ MAPI
```
event_zagorje_web/
├── INSTRUKCIJE-ZA-CLAUDE-CODE.md   ← ovaj fajl (brief)
├── SADRZAJ.md                      ← sav tekstualni sadržaj (čitljivo)
├── podaci.json                     ← isti podaci strukturirano (parsiraj ovo)
├── images/
│   ├── profile/profile.jpg         ← logo / profilna (mala, 320px)
│   ├── posts/                      ← 10 foto s evenata (galerija, hero)
│   └── highlights/                 ← 11 ikonica kategorija (150px, male)
└── _scrape_log/                    ← radne datoteke izvora (ignoriraj)
```
> **Prvo pročitaj `podaci.json` i `SADRZAJ.md`** — tamo je sav tekst, kontakti, opisi i mapiranje slika.

---

## 🗺️ STRUKTURA STRANICE (sekcije)

1. **Header / Navigacija**
   - Logo „Event.zagorje" + linkovi: Usluge · Reference · Galerija · Kontakt
   - CTA gumb gore desno: „Zatraži ponudu" → scroll na kontakt
   - Sticky na scroll.

2. **Hero**
   - Velika pozadinska foto (preporuka: `post_02`, `post_03` ili `post_04`).
   - Naslov: **Event.zagorje** / podnaslov: „Najam opreme i organizacija za sve vrste evenata u Zagorju"
   - Dva gumba: „📞 Nazovi 099 399 2222" i „💬 WhatsApp upit"

3. **O nama / Zašto mi**
   - Kratak tekst: lokalna zagorska firma, kompletna oprema + produkcija, rade i s
     poznatim izvođačima. Tim Marcota & Lorenzo.
   - 3–4 „istaknuto" kartice: Kompletna oprema · Profesionalna produkcija · Lokalno (Zagorje) · Iskustvo s velikim koncertima.

4. **Usluge** (najvažnija sekcija)
   - Grid kartica (po jedna kartica = kategorija usluge iz `podaci.json` → `usluge`):
     Manifestacije, Club eventi, Najam opreme, Vjenčanja, Momačke/djevojačke,
     Korporativni eventi, Domjenci, Rođendani, Maturalne zabave, Marketing.
   - Svaka kartica: ikona/sličica + naziv + kratki opis (1 rečenica, slobodno napiši).
   - Highlight cover slike su male (150px) → koristi ih kao male ikonice ILI zamijeni
     lijepim ikonama (npr. Lucide/Font Awesome) i foto iz `posts/`.

5. **Reference / Projekti** (gradi povjerenje!)
   - Istakni stvarne projekte iz `podaci.json` → `portfolio_objave`:
     - Koncert Jelene Rozge (Pregrada)
     - Advent u Bedekovčini — Psihomodo Pop, To Ma, Mia Dimšić
     - BadlFest 2025 — Hiljson & Miach
     - After Norijada Party 2026
   - Logo-traka / tekst: „Radili smo s: Jelena Rozga · Psihomodo Pop · To Ma · Mia Dimšić · Hiljson & Miach".

6. **Galerija**
   - Grid svih 10 slika iz `images/posts/`. Lightbox na klik (lazy-load).

7. **Kontakt (CTA)**
   - Telefon: **099 399 2222** (klikabilan `tel:`)
   - WhatsApp: link `https://wa.me/385993992222`
   - E-mail: **marko.kantolic@gmail.com** (`mailto:`)
   - Instagram: https://www.instagram.com/event_zagorje/
   - Jednostavna forma (Ime, Tip eventa, Datum, Poruka) → šalje preko `mailto:`.
   - Područje rada: Hrvatsko zagorje (Bedekovčina, Pregrada, Zabok…).

8. **Footer**
   - © Event.zagorje, kontakt, IG link, „powered by Lorenzo".

---

## 🎨 DIZAJN SMJERNICE
- **Vibe:** moderan, energičan nightlife/event — tamna tema s naglaskom.
  Disko kugla 🪩 iz bija je dobar motiv.
- **Boje:** tamna pozadina (#0d0d12 / crna), bijeli tekst, jedan jak akcent
  (npr. ljubičasta/magenta #C026D3 ili električno plava — „party" osjećaj).
  Suptilni gradijenti i glow efekti.
- **Tipografija:** moderni sans-serif (Inter / Poppins / Montserrat). Veliki, hrabri naslovi.
- **Detalji:** zaobljeni rubovi, hover animacije na karticama, smooth scroll, blagi parallax na hero.
- **NE pretjeruj** s emojijima u UI-u; koristi prave ikone.

---

## 🔎 SEO (hrvatski)
- `<title>`: „Event.zagorje — najam opreme i organizacija evenata | Hrvatsko zagorje"
- Meta description s ključnim riječima: *najam opreme za evente, ozvučenje, rasvjeta,
  organizacija vjenčanja, koncerti, maturalne, Zagorje, Bedekovčina*.
- Semantički HTML, alt tekstovi na slikama (vidi opise u `podaci.json`).
- Open Graph tagovi (koristi `post_02` kao OG sliku).
- `lang="hr"`.

---

## ✅ ŠTO ISPORUČITI
- `index.html`, `style.css`, `script.js` (ili build) — funkcionalno lokalno.
- Slike povezane iz `images/` (ne mijenjaj nazive bez ažuriranja putanja).
- Čist, komentiran kod, spreman za deploy.

## ⚠️ NAPOMENE
- Svi materijali pripadaju vlasniku profila (Marko Kantolić) — radi se njegova službena stranica.
- Telefon se na profilu piše „099 3992 222" a u objavi „099 399 22 22" — **isti broj: 099 399 2222**. Provjeri s vlasnikom ako treba.
- Highlight cover slike su niske rezolucije (150px). Za finalnu stranicu preporuči
  vlasniku da pošalje par kvalitetnijih fotki, ili koristi slike iz `posts/`.
- Tekstove usluga slobodno doradi/proširi — na Instagramu su kratki.
