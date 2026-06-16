# CGI-oefenomgeving — Portfolio Oriënterende Stage

Een eenvoudige, lokale leer-/toetsomgeving om je **portfolioverdediging** voor te bereiden,
opgezet als een **Criterium Gericht Interview (CGI)**. Je oefent het gesprek dat je assessor met
je voert: realistische vragen per leeruitkomst, doorvragen, kritische vragen — met **modelpunten
uit je eigen portfolio** zodat je kunt checken of je antwoord compleet is.

Gemaakt voor: **Mika Hillenga** · Bedrijfskunde, Hanzehogeschool Groningen · stage Ommelander Ziekenhuis Groningen.

## Openen

Geen installatie nodig. Dubbelklik op **`index.html`** (of open het bestand in je browser).
Werkt offline. Je antwoorden en zelfbeoordelingen worden alleen lokaal in je browser bewaard
(`localStorage`) — er wordt niets verstuurd.

## Wat kun je doen?

| Onderdeel | Wat het doet |
|-----------|--------------|
| **Start** | Overzicht van de vijf leeruitkomsten + algemene CGI-tips. |
| **Oefenen** | Filter op leeruitkomst en vraagtype. Beantwoord (typ of hardop), klap de **modelpunten** uit en **vink aan** welke kernpunten je noemde. Beoordeel jezelf (onvoldoende / voldoende / goed). |
| **Flashcards** | Vraag op de voorkant, het **sterke antwoord** (kernpunten) op de achterkant. Beantwoord eerst zelf, klik om de kaart om te draaien, en markeer **Ken ik / Nog oefenen**. Met schudden, filteren en *Verberg gekende*. Sneltoetsen: **spatie** = omdraaien, **←/→** = bladeren. |
| **Meerkeuze** | Kennisquiz met **antwoordopties** (40 vragen): kies het juiste antwoord en krijg meteen feedback met toelichting. De **antwoordvolgorde wordt geschud** (het juiste antwoord staat dus niet steeds op plek A). Filter per leeruitkomst, schud, en oefen aan het eind gericht **de foute vragen opnieuw**. Houdt je score bij. |
| **CGI-simulatie** | Een reeks willekeurige vragen met een **lopende timer**, net als in een echt gesprek. Kies aantal vragen, zwaarte en eventueel één leeruitkomst. Zet **spreekmodus** aan om elke vraag automatisch te laten voorlezen. |
| **CGI-beoordeling** | **Twee losse beoordelingen**: (1) het CGI-oordeel op basis van de kernpunten die je bij de open vragen aanvinkte (per leeruitkomst, met sterke/zwakke punten en een vervolgvraag) en een eindoordeel langs de vier dimensies, en (2) een aparte **kennisquiz-beoordeling** op basis van je meerkeuze-score per leeruitkomst. Beide ook in de PDF. |
| **Spiekbriefje** | Kerncijfers en feiten uit je stage (organisatie, onderzoek, methoden, POP) om je geheugen te checken. |
| **Podcast** | Een gesproken samenvatting (~25-30 min) als **gesprek tussen twee hosts**, die in 17 hoofdstukken je hele stof doornemen. Wordt voorgelezen door de stem(men) van je browser; je kiest **per host een stem** (de mooiste Nederlandse stem wordt automatisch voorgeselecteerd), met hoofdstuknavigatie, snelheidsregeling en een meeleesbaar transcript. Je kunt het script ook downloaden en er een **MP3** van maken (zie hieronder). Werkt het best in Chrome/Edge. |
| **Voortgang** | Per leeruitkomst zie je je **zelfbeoordeling** van de open vragen én je **meerkeuze-quizscore** (goed/fout/nog niet gedaan). |

## Hoe werkt het oordeel?

De CGI-beoordelaar kijkt per leeruitkomst naar het **percentage modelpunten dat je aanvinkte** als “genoemd”, over de vragen die je hebt geoefend:

- **≥ 80%** → *Goed* &nbsp;•&nbsp; **≥ 60%** → *Voldoende* &nbsp;•&nbsp; **≥ 40%** → *Bijna voldoende* &nbsp;•&nbsp; **< 40%** → *Onvoldoende bewijs*
- Heb je nog te weinig vragen geoefend, dan kan het oordeel niet hoger dan *Voldoende* — een assessor wil immers genoeg bewijs zien.
- Wees eerlijk bij het aanvinken: alleen dan is het oordeel een nuttige spiegel. Het is een **oefenindicatie, geen officieel cijfer**.

## Vraagtypes

- **Openingsvraag** — brede startvraag; vertel je verhaal in STARR.
- **Doorvraag** — de assessor graaft dieper ("waarom", "hoe weet je dat", "geef een voorbeeld").
- **Kritische vraag** — advocaat van de duivel of een check op eigenaarschap.

## Spreekmodus (hardop oefenen)

Bij elke vraag staan twee knoppen:

- **🔊 Lees voor** — de assessor leest de vraag hardop voor (tekst-naar-spraak).
- **🎤 Spreek antwoord** — spreek je antwoord in; je woorden verschijnen live als tekst in het antwoordveld. Klik nogmaals om te stoppen.

> Spraak-naar-tekst werkt het best in **Chrome of Edge** (geef de microfoon toegang). In andere browsers
> kun je gewoon typen; voorlezen werkt vrijwel overal. In de CGI-simulatie kun je vragen ook automatisch
> laten voorlezen via het vinkje **spreekmodus**.

### Lokale Whisper gebruiken (nauwkeuriger)

Heb je **Whisper** op je laptop staan? Dan kun je dat model gebruiken voor de transcriptie in plaats van de
browser. Klik rechtsboven op **⚙ Whisper** en kies *Lokale Whisper*. De app neemt je antwoord op, zet het om
naar 16 kHz mono WAV en stuurt het naar je lokale Whisper-endpoint; de tekst komt terug in het antwoordveld.

**Snelste manier** — start het meegeleverde bruggetje (gebruikt jouw eigen Whisper-model, geen extra downloads):

```bash
# in de projectmap
python tools/whisper_server.py --model base --port 8000
```

Zet in de app het server-type op **OpenAI-compatible** en de URL op
`http://127.0.0.1:8000/v1/audio/transcriptions`, en klik op **Test verbinding**.

- Het bruggetje werkt met **`faster-whisper`** (aanbevolen) of het **`openai-whisper`**-pakket dat je al hebt.
  Het leest de WAV met de Python-standaardbibliotheek, dus **ffmpeg is niet nodig**.
- Open de pagina via **`http://localhost`** (bijv. `python -m http.server` in de projectmap) — de microfoon
  werkt alleen in een beveiligde context, en localhost telt als veilig.
- Heb je al een **`whisper.cpp`**-server (`/inference`) of **`whisper-asr-webservice`** (`/asr`) draaien? Kies dan
  dat server-type en vul de bijbehorende URL in. De app ondersteunt alle drie.

## Mooiere stemmen in de browser

In het **Podcast**-tabblad kies je per host (Noor en Mees) een stem uit de lijst; de app zet automatisch
de mooiste beschikbare Nederlandse stem voorop. De kwaliteit hangt af van je browser/systeem:

- **Edge** heeft de minst robotachtige stemmen (Microsoft/Azure neuraal): kies een **“Natural”/“Online”**-stem.
  Aanbevolen duo: **Colette** (host Noor) + **Maarten** (coach Mees); Vlaams alternatief **Dena** + **Arnaud**.
- **Chrome** heeft *Google Nederlands* (prima kwaliteit).
- Op **Windows/macOS** kun je in de systeeminstellingen extra Nederlandse stemmen bijinstalleren; die
  verschijnen dan vanzelf in de lijst.

Je keuze wordt onthouden in je browser. Wil je echt studiokwaliteit als **bestand**, gebruik dan de
MP3-export hieronder (Piper/edge-tts).

## Podcast als MP3

In het **Podcast**-tabblad kun je de samenvatting direct in de browser laten voorlezen. Wil je er een
echt **MP3-bestand** van (bijv. om in je telefoon te zetten), dan maakt het meegeleverde bruggetje dat:

1. Klik in de speler op **⬇ Download script (.txt)** — je krijgt `podcast-script.txt`.
2. Maak er een MP3 van. Tussen de hoofdstukken komen automatisch pauzes.

**Aanrader — mooie stem, volledig offline (Piper):**

```bash
pip install piper-tts lameenc
python tools/podcast_tts.py --download-voice            # haalt één keer een NL-stem op
python tools/podcast_tts.py podcast-script.txt --engine piper -o podcast.mp3
```

Piper is een neuraal tekst-naar-spraak-model dat je één keer downloadt (~30-60 MB) en daarna volledig
offline draait. `--download-voice` haalt standaard `nl_BE-nathalie-medium` op; met `--download-voice-m`
haal je ook een tweede (mannelijke) stem voor coach Mees. `lameenc` zorgt voor de MP3-export.

**Minst robotachtig — neurale stemmen (edge-tts, aanrader voor natuurlijke klank):**

```bash
pip install edge-tts
python tools/podcast_tts.py podcast-script.txt -o podcast.mp3
```

Het standaardduo is **`nl-NL-ColetteNeural`** (host Noor) + **`nl-NL-MaartenNeural`** (coach Mees) — de meest
natuurlijke gratis Nederlandse stemmen. Liever Vlaams? Voeg toe:
`--voice-n nl-BE-DenaNeural --voice-m nl-BE-ArnaudNeural`. Wil je studiokwaliteit en heb je een GPU? Dan
zijn **Coqui XTTS-v2** of **ElevenLabs** (betaald) nog natuurlijker, maar voor een studiepodcast is edge-tts
de beste prijs-kwaliteitskeuze.

- Geen internet en geen Piper? Gebruik `--engine pyttsx3` voor een volledig **offline** systeemstem
  (robotachtiger; schrijft WAV).
- Pauzes instellen: `--chapter-gap 1.0` (seconden tussen hoofdstukken) en `--line-gap 0.25` (tussen zinnen).
- `python tools/podcast_tts.py --list-voices` toont de beschikbare Nederlandse Piper-stemmen.

## PDF-rapport

Op **CGI-beoordeling** staat **🖨️ Download als PDF**. Die opent de printdialoog van je browser; kies daar
**“Opslaan als PDF”**. Je krijgt een net beoordelingsrapport met je naam, de datum, het eindoordeel, de vier
beoordelingsdimensies en per leeruitkomst je oordeel, sterke punten, aandachtspunten en een vervolgvraag.

## STARR

Beantwoord vragen in **S**ituatie → **T**aak → **A**ctie → **R**esultaat → **R**eflectie.
De assessor wil vooral je *Actie* (wat deed jíj?) en *Reflectie* (wat leerde je?) horen.

## Inhoud aanpassen

Alle vragen, modelpunten, feiten en de beoordelingsrubric staan in **`data.js`**. Je kunt daar
zonder programmeerkennis vragen toevoegen of modelpunten aanscherpen — volg gewoon het patroon van
de bestaande items. De modelpunten zijn afgeleid uit je portfolio én de bijlagen (verdiepende
opdracht A en de beschrijvende opdrachten I, J, K, L, M, N en T).

## Bestanden

```
index.html              structuur + navigatie
styles.css              vormgeving
data.js                 vragenbank, modelpunten, spiekbriefje en rubric (pas dit aan)
app.js                  logica (oefenen, simulatie, beoordeling, spraak, PDF)
tools/whisper_server.py  optioneel lokaal Whisper-bruggetje (spraak → tekst)
tools/podcast_tts.py     optioneel: maak een MP3 van het podcast-script (tekst → spraak)
```
