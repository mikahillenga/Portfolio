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
| **Oefenen** | Filter op leeruitkomst en vraagtype. Beantwoord (typ of hardop), klap de **modelpunten** uit en beoordeel jezelf (onvoldoende / voldoende / goed). |
| **CGI-simulatie** | Een reeks willekeurige vragen met een **lopende timer**, net als in een echt gesprek. Kies aantal vragen, zwaarte en eventueel één leeruitkomst. |
| **Spiekbriefje** | Kerncijfers en feiten uit je stage (organisatie, onderzoek, methoden, POP) om je geheugen te checken. |
| **Voortgang** | Per leeruitkomst zie je hoeveel vragen je oefende en hoe je jezelf beoordeelde. |

## Vraagtypes

- **Openingsvraag** — brede startvraag; vertel je verhaal in STARR.
- **Doorvraag** — de assessor graaft dieper ("waarom", "hoe weet je dat", "geef een voorbeeld").
- **Kritische vraag** — advocaat van de duivel of een check op eigenaarschap.

## STARR

Beantwoord vragen in **S**ituatie → **T**aak → **A**ctie → **R**esultaat → **R**eflectie.
De assessor wil vooral je *Actie* (wat deed jíj?) en *Reflectie* (wat leerde je?) horen.

## Inhoud aanpassen

Alle vragen, modelpunten en feiten staan in **`data.js`**. Je kunt daar zonder programmeerkennis
vragen toevoegen of modelpunten aanscherpen — volg gewoon het patroon van de bestaande items.

## Bestanden

```
index.html   structuur + navigatie
styles.css   vormgeving
data.js      vragenbank, modelpunten en spiekbriefje (pas dit aan)
app.js       logica (oefenen, simulatie, voortgang)
```
