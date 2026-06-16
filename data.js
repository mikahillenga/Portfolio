/* =====================================================================
   CGI-oefenomgeving — Portfolio Oriënterende Stage
   Mika Hillenga — Ommelander Ziekenhuis Groningen — Hanzehogeschool
   ---------------------------------------------------------------------
   Alle inhoud (vragen, modelpunten, feiten) is afgeleid uit het
   ingeleverde portfolio en de bijlagen (verdiepende opdracht +
   beschrijvende opdrachten). Pas dit bestand gerust aan.
   ===================================================================== */

const CGI_DATA = {

  meta: {
    student: "Mika Hillenga",
    studentnummer: "474089",
    opleiding: "Bedrijfskunde — Hanzehogeschool Groningen",
    organisatie: "Ommelander Ziekenhuis Groningen",
    afdeling: "Bureau Procesverbetering en Projecten",
    stagedocent: "Robert de Wit",
    begeleidersOZG: "Joukje Punter-Boonstra en Judith Geut",
    niveau: "Niveau 2 (oriënterende stage)"
  },

  /* ------------------------------------------------------------------
     De vijf leeruitkomsten (LOL's) + beoordelingscriteria
  ------------------------------------------------------------------ */
  lols: [
    {
      id: "lol1",
      nummer: 1,
      naam: "Bedrijfskundig handelen",
      kleur: "#2563eb",
      kern: "Een breed vraagstuk gestructureerd en methodisch aanpakken, van probleem tot onderbouwd advies.",
      criteria: "Op niveau 2 laat je zien dat je een breed vraagstuk methodisch aanpakt: je kiest bewust een model, doet eerst diagnose vóór oplossing en onderbouwt je prioriteiten met data.",
      vervolgvraag: "Noem één concreet moment waarop je methode (A3 of de PICK-matrix) je oorspronkelijke ingeving heeft veranderd.",
      sleutelmomenten: [
        "Keuze voor de A3-methode bij het vraagstuk verkeerde-bed patiënten",
        "Meelopen op de afdeling (Gemba walk) om het vraagstuk te begrijpen",
        "Verbeterpunten prioriteren met de PICK-matrix (OK-leeninstrumentarium)"
      ],
      bewijslast: "Verdiepende opdracht (bijlage A), organisatieanalyse (bijlage H), beschrijvende opdracht procesmanagement OK (bijlage L), financiële data-analist (bijlage N)",
      leerdoel: "Leerdoel 1: zelfstandige analyse"
    },
    {
      id: "lol2",
      nummer: 2,
      naam: "Onderzoeken",
      kleur: "#0d9488",
      kern: "Een vraagstuk methodisch onderzoeken: data verzamelen, ordenen, kritisch beoordelen en conclusies onderbouwen.",
      criteria: "Je laat een betrouwbare onderzoekslijn zien: heldere vraag, verantwoorde methode, data ordenen en de grenzen van je onderzoek eerlijk benoemen.",
      vervolgvraag: "Als je dit onderzoek opnieuw deed met meer tijd, welke bron of methode zou je toevoegen en waarom?",
      sleutelmomenten: [
        "Opzet van het observatieonderzoek (26 observaties, 215 handelingen)",
        "Data opschonen en kritisch naar de eigen methode kijken",
        "Duurzaamheidsnulmeting vanuit drie perspectieven (people/planet/profit)"
      ],
      bewijslast: "Observatieschema (bijlage C), functiebeschrijvingen Verpleegkundige I en J (bijlage D en E), organisatieanalyse (bijlage H), duurzaamheidsnulmeting (bijlage I), financiële data-analist (bijlage N)",
      leerdoel: "Leerdoel 1 en 2: analyse en eerst de oorzaak"
    },
    {
      id: "lol3",
      nummer: 3,
      naam: "Innoverende en ondernemende houding tonen",
      kleur: "#7c3aed",
      kern: "Verbeterkansen signaleren, een breed probleem vertalen naar een uitvoerbaar voorstel en de waarde daarvan onderbouwen.",
      criteria: "Je signaleert verbeterkansen en vertaalt een breed probleem naar een uitvoerbaar, onderbouwd voorstel binnen de ruimte die er is.",
      vervolgvraag: "Wat maakt jouw voorstel niet alleen een goed idee, maar ook uitvoerbaar voor de afdeling?",
      sleutelmomenten: [
        "Breed probleem vertalen naar een concreet pilotontwerp (5 geclusterde bedden)",
        "Doorpakken waar informatie of bevoegdheid ontbrak (zelf data, P&O-lijn)",
        "Waarde van een businessidee onderbouwen (AFAS ERP: VPC + Kotter)"
      ],
      bewijslast: "Verdiepende opdracht stap 5 en 6 (bijlage A), haalbaarheidsstudie AFAS (bijlage K), verbeterplan verwijzingen Neurologie (bijlage T)",
      leerdoel: "Leerdoel 3: verbeterkansen signaleren"
    },
    {
      id: "lol4",
      nummer: 4,
      naam: "Verbinden",
      kleur: "#ea580c",
      kern: "Schakelen tussen niveaus en mensen, een gevoelig onderwerp bespreekbaar houden en samenwerken om kennis op te halen.",
      criteria: "Je schakelt tussen niveaus en mensen, houdt een gevoelig onderwerp bespreekbaar en haalt kennis op door samen te werken.",
      vervolgvraag: "Beschrijf een moment waarop je merkte dat je boodschap niet aankwam — wat deed je toen anders?",
      sleutelmomenten: [
        "Schakelen tussen werkvloer (verpleegkundigen) en leiding (Mariska/Joanne)",
        "Een gevoelig onderwerp bespreekbaar houden (verzorgende i.p.v. verpleegkundige)",
        "Samenwerken om een keten in kaart te brengen (supply chain OK)"
      ],
      bewijslast: "Verdiepende opdracht (bijlage A), stage-POP (bijlage F), supply chain OK (bijlage M), verandermanagement (bijlage J), procesplaat OK (bijlage R)",
      leerdoel: "Leerdoel 3: doorvragen en schakelen"
    },
    {
      id: "lol5",
      nummer: 5,
      naam: "Persoonlijk leiderschap tonen",
      kleur: "#db2777",
      kern: "Verantwoordelijkheid nemen, feedback echt verwerken, eigen grenzen herkennen en reflecteren op het eigen handelen.",
      criteria: "Je neemt verantwoordelijkheid, verwerkt feedback zichtbaar en reflecteert eerlijk op je eigen handelen en grenzen.",
      vervolgvraag: "Welke feedback heeft je deze stage het meest veranderd, en wat doe je nu structureel anders?",
      sleutelmomenten: [
        "Feedback op het concept omzetten in een betere definitieve versie",
        "Eigen grenzen herkennen en opzoeken (meelopen OK, patiëntveiligheid)"
      ],
      bewijslast: "Verdiepende opdracht (bijlage A), feedbackformulier (bijlage B), stage-POP (bijlage F), functionerings- en evaluatieformulier (bijlage O)",
      leerdoel: "Leerdoel 2 en 4: oorzaak en reflectie"
    }
  ],

  /* Portfolio-brede groep (geen formele LOL) */
  algGroep: {
    id: "alg",
    naam: "Portfolio-breed",
    kleur: "#475569",
    criteria: "Je overziet je eigen portfolio: je kent je rode draad, je eigen aandeel en je ontwikkelrichting.",
    vervolgvraag: "Als ik één bijlage zou openslaan om jouw groei te zien, welke moet dat zijn en waarom?"
  },

  /* ------------------------------------------------------------------
     Vraagtypes (voor filteren)
  ------------------------------------------------------------------ */
  types: {
    open:      { label: "Openingsvraag",  uitleg: "Brede startvraag — vertel je verhaal in STARR." },
    doorvraag: { label: "Doorvraag",      uitleg: "De assessor graaft dieper: 'waarom', 'hoe weet je dat', 'geef een voorbeeld'." },
    kritisch:  { label: "Kritische vraag", uitleg: "De assessor speelt advocaat van de duivel of toetst eigenaarschap." }
  },

  /* ------------------------------------------------------------------
     Rubric voor de CGI-beoordelaar
  ------------------------------------------------------------------ */
  rubric: {
    dimensies: [
      { naam: "Meewerken aan de werkwijzen", toelichting: "Kennismaken met en meewerken aan de operationele processen en procedures van de afdeling." },
      { naam: "Beroepsvaardigheden", toelichting: "Planmatig werken, samenwerken, overtuigend communiceren en gedrag van collega's beïnvloeden." },
      { naam: "Beroepshouding", toelichting: "Proactief, onderzoekend, kritisch, klantgericht en organisatiesensitief handelen." },
      { naam: "Reflectief en lerend", toelichting: "Bewust van eigen ontwikkeling, feedback toepassen en het eigen handelen blijven toetsen." }
    ],
    banden: {
      goed:        { key: "goed",        label: "Goed — overtuigend op niveau 2",      kleur: "#16a34a", advies: "Sterk en concreet onderbouwd. Houd je voorbeelden en cijfers paraat en blijf koppelen aan je POP." },
      voldoende:   { key: "voldoende",   label: "Voldoende — niveau 2 aangetoond",     kleur: "#0d9488", advies: "Je toont de leeruitkomst aan. Scherp de gemiste kernpunten aan om steviger te staan tijdens doorvragen." },
      bijna:       { key: "bijna",       label: "Bijna voldoende — aanscherpen",       kleur: "#d97706", advies: "De basis staat, maar je laat nog kernpunten liggen. Oefen gericht de gemiste punten en onderbouw met je bijlagen." },
      onvoldoende: { key: "onvoldoende", label: "Onvoldoende bewijs — meer nodig",     kleur: "#dc2626", advies: "Je raakt de kern nog te weinig. Werk de modelpunten door, oefen opnieuw en koppel aan concrete bewijslast." },
      none:        { key: "none",        label: "Nog niet geoefend",                   kleur: "#94a3b8", advies: "Oefen de vragen van deze leeruitkomst en vink per vraag aan welke kernpunten je noemde." }
    }
  },

  /* ------------------------------------------------------------------
     Vragenbank
  ------------------------------------------------------------------ */
  vragen: [

    /* ===================== LOL 1 ===================== */
    {
      id: "l1-q1", lol: "lol1", type: "open",
      vraag: "Je kreeg de opdracht om de zorg rond verkeerde-bed patiënten op 3B beter te organiseren. Neem me eens mee: hoe heb je dat vraagstuk aangepakt, van begin tot eind?",
      modelpunten: [
        "Breed vraagstuk: raakte taakverdeling, afdelingsindeling, personele inzet, bevoegdheden én medezeggenschap tegelijk.",
        "Bewuste keuze voor de A3-methode (7 stappen): eerst probleem en huidige situatie scherp, dan pas doel en maatregelen.",
        "5x-waarom leidde naar de grondoorzaak: het ontbreken van een formeel functieprofiel voor een verzorgende op een verpleegafdeling.",
        "Onderbouwd verbeterdoel: aandeel verpleegkundige tijd aan laagcomplexe zorg terug van 49% naar maximaal 20% per dienst.",
        "Voorstel: clustering van 5 bedden (Gang 251), hybride personele inzet (verzorgende/IG), werkafspraken met escalatiecriteria.",
        "Eerlijk over de stand: pilot van 6 weken moet nog starten; functieprofiel en OR-route nog in bewerking."
      ]
    },
    {
      id: "l1-q2", lol: "lol1", type: "open",
      vraag: "Je koos voor de A3-methode. Waarom juist die methode, en wat leverde dat jou op?",
      modelpunten: [
        "A3 dwingt je eerst probleem en huidige situatie scherp te krijgen vóór je een doel en maatregelen bepaalt.",
        "Past bij de complexiteit van het vraagstuk en voorkomt te snel naar een oplossing springen.",
        "Methode die het bureau aandraagt én die je op de opleiding (procesmanagement) hebt geleerd — onderbouwde keuze.",
        "Sluit aan op het organisatiedoel: slimmer werken, basis op orde, herstelplan.",
        "Resultaat: gestructureerd traject waarin probleem → oorzaken → doel → maatregelen logisch op elkaar volgen (bijlage A).",
        "Reflectie: de methode 'remde je af', en dat had je nodig (rode draad POP)."
      ],
      koppeling: "Leerdoel 1 — zelfstandige analyse"
    },
    {
      id: "l1-q3", lol: "lol1", type: "doorvraag",
      vraag: "Je schrijft dat de A3-methode je 'afremde' omdat je te snel naar een oplossing wilde. Kun je een concreet moment noemen waarop je dat bij jezelf merkte?",
      modelpunten: [
        "Eerste neiging was meteen naar clustering toewerken omdat dat logisch leek.",
        "Achteraf besef: je legde je doel te vroeg vast (oplossing als uitgangspunt i.p.v. uitkomst).",
        "Concreet bijgestuurd: probleemfase langer openhouden, eerst oorzaken onderbouwen.",
        "Koppeling aan feedback op de verdiepende opdracht: doelstelling was te veel een oplossingsrichting.",
        "Laat groei zien: nu een bewuste gewoonte, niet meer 'zwakte'."
      ],
      koppeling: "POP — rode draad: niet te snel naar de oplossing"
    },
    {
      id: "l1-q4", lol: "lol1", type: "doorvraag",
      vraag: "Welke andere aanpak of methode had je kunnen kiezen in plaats van A3, en waarom paste die minder goed?",
      modelpunten: [
        "Toon dat je een afweging maakte en niet zomaar de eerste methode pakte.",
        "Alternatieven die je elders gebruikte: PDCA/PDSA-cyclus, DMAIC/Lean-denken, of direct een verbeterplan zonder diagnosefase.",
        "Waarom A3 paste: combineert probleemanalyse, doel en maatregelen op één gestructureerde plaat — geschikt voor een breed, gevoelig vraagstuk.",
        "Een aanpak zonder grondige diagnosefase zou jouw valkuil (te snel naar oplossing) juist versterken.",
        "Laat zien dat methodekeuze afhangt van het type vraagstuk, niet van gewoonte."
      ]
    },
    {
      id: "l1-q5", lol: "lol1", type: "doorvraag",
      vraag: "Je liep mee op de afdeling (Gemba walk). Wat zag of begreep je daar, dat je vanachter je bureau op papier had gemist?",
      modelpunten: [
        "Kennis over 'hoe het echt werkt' zit bij de verpleegkundigen en mensen op 3B, niet in documenten.",
        "Je toetste je aannames over oorzaken en oplossingen aan de praktijk i.p.v. op eigen aannames te vertrouwen.",
        "Je zag waar de drukte echt vandaan kwam; oorzakenanalyse werd onderbouwd met de praktijk.",
        "Je bleef afstemmen met Mariska en Joanne — hun blik haalde je weg bij je eigen aannames.",
        "Les: eerst kijken en luisteren vóór je een oordeel vormt."
      ]
    },
    {
      id: "l1-q6", lol: "lol1", type: "doorvraag",
      vraag: "Je gebruikte de PICK-matrix bij het OK-leeninstrumentariumproces. Wat waren de kwetsbaarheden in dat proces, en wat veranderde de matrix concreet aan je advies?",
      modelpunten: [
        "Context: OK-leeninstrumentarium; doorlooptijd van 2–3 weken die vooral uit wáchttijd bestaat (Hendriks, 2021).",
        "Vijf overdrachtsmomenten, elk met een eigen foutkans; eigenaarschap over de héle keten ontbreekt; 48-uurs buffer voor de CSA.",
        "PICK-matrix scoort verbeterpunten op impact vs. inspanning — dwingt tot onderbouwde prioritering.",
        "Uitkomst: aanvraagtermijn standaardiseren + duidelijke leveranciersafspraken = meeste winst, minste inspanning.",
        "Digitale statustracking en een beter telprotocol als versterking voor de langere termijn.",
        "Zonder matrix: risico om op gevoel te prioriteren of het 'grootste' i.p.v. het slimste probleem te pakken (bijlage L)."
      ]
    },
    {
      id: "l1-q7", lol: "lol1", type: "kritisch",
      vraag: "Wat maakt jouw aanpak nou eigenlijk 'bedrijfskundig'? Een verpleegkundige met gezond verstand had toch ook kunnen zeggen: cluster die bedden?",
      modelpunten: [
        "Verschil zit in methodisch onderbouwen: feiten boven indrukken (215 geregistreerde handelingen, codering op type/risico/bevoegdheid).",
        "Je koppelde het afdelingsprobleem aan de bredere context (herstelplan, personeelstekort, doelmatigheid) via DESTEP/7S/SWOT.",
        "Je hield rekening met randvoorwaarden: bevoegdheden, functieprofiel, medezeggenschap, escalatieprotocol, achterwacht.",
        "Je prioriteerde en onderbouwde keuzes (A3, PICK) i.p.v. één oplossing te poneren.",
        "Bedrijfskundig = de samenhang tussen proces, mensen en geld expliciet maken — niet alleen 'het idee'."
      ]
    },
    {
      id: "l1-q8", lol: "lol1", type: "kritisch",
      vraag: "Je analyse gaat over één afdeling (3B). Hoe weet je dat je conclusie niet toevallig alleen voor die afdeling geldt?",
      modelpunten: [
        "Eerlijk: de observaties liepen over 3A, 3B én 2B, dus niet alleen 3B — dat versterkt de generaliseerbaarheid iets.",
        "Erken de grens: afdelingsspecifieke cijfers voor 3B ontbraken (privacygevoelig); je voorstel is daarom een pilot om het te toetsen.",
        "Verkeerde-bed patiënten zijn een structureel probleem op meerdere verpleegafdelingen (6–12 per dag OZG-breed).",
        "Schaalbaarheid is een vervolgvraag: eerst pilot evalueren met KATA/PDCA, dan pas breder.",
        "Toont onderzoekshouding: claim niet meer dan je data dragen."
      ]
    },
    {
      id: "l1-q9", lol: "lol1", type: "doorvraag",
      vraag: "Hoe draagt Bureau Procesverbetering en Projecten bij aan de strategie van het OZG? Je legde dat uit met kritische succesfactoren en KPI's.",
      modelpunten: [
        "Strategie volgt uit het Herstelplan 2025–2027 (verlies 2024 ≈ €1,9 mln; verwacht 2025 ≈ €4 mln).",
        "Drie KSF's: financieel duurzaam herstel (EBITDA ~7%), productiviteit (+2% in 2026) en van reactief naar proactief (continu verbeteren).",
        "BPP draagt indirect bij: het realiseert zelf geen zorgproductie, maar faciliteert afdelingen die dat wel doen.",
        "BPP-KPI's: projectvoortgang (charters, planning, scope) + outcome-KPI's ligduur 3A/3B en OK-benutting.",
        "Sturing via de PDSA-cyclus, verbeterborden/dagstarts en maandelijkse resultaatgesprekken op drie niveaus.",
        "Eerlijke nuance: 'kwaliteit op orde' is voor BPP het minst concreet meetbaar (bijlage N)."
      ],
      koppeling: "Leerdoel 1 — zelfstandige analyse"
    },

    /* ===================== LOL 2 ===================== */
    {
      id: "l2-q1", lol: "lol2", type: "open",
      vraag: "Vertel eens over je observatieonderzoek. Hoe heb je het opgezet en waarom op die manier?",
      modelpunten: [
        "Aanleiding: het voorstel mocht niet op aannames leunen; er was geen harde data over wat deze groep echt nodig heeft.",
        "Doel: betrouwbaar in kaart brengen welke zorghandelingen, hoe complex, en of een verzorgende ze mag uitvoeren.",
        "Keuze: gestructureerde observatie, zodat data direct uit de praktijk komt; meelopen op 3A, 3B en 2B (dagdiensten).",
        "Codering op zorgtype: ADL, mobiliteit, observatie, medicatie, technische handelingen, wondzorg, overleg, logistiek, overige.",
        "Meetlat: functiebeschrijvingen OZG (Verpleegkundige I en J + ziekenverzorgende) om bevoegdheid te beoordelen.",
        "Resultaat: 26 observaties, 215 handelingen; ADL 31% + mobiliteit 18% = 49% laagcomplex; slechts 9% voorbehouden (bijlage C)."
      ],
      koppeling: "Leerdoel 2 — eerst de oorzaak, dan de oplossing"
    },
    {
      id: "l2-q2", lol: "lol2", type: "open",
      vraag: "Hoe heb je de functiebeschrijvingen gebruikt om te bepalen of een verzorgende een handeling mag uitvoeren?",
      modelpunten: [
        "Functiebeschrijvingen van Verpleegkundige I en J en van de ziekenverzorgende als objectieve meetlat.",
        "Per handeling beoordeeld of die binnen de bevoegdheid van een verzorgende valt — oordeel controleerbaar, geen mening.",
        "Belangrijk onderscheid: verzorgende niveau 3 vs. verzorgende IG niveau 3 — bepaalt wat je mag delegeren.",
        "Voorbehouden gebleven: katheteriseren, blaasspoelen, wondzorg, insuline, klinische beoordeling, escalatie.",
        "Conclusie onderbouwd: het grootste deel laagcomplex, 9% voorbehouden."
      ]
    },
    {
      id: "l2-q3", lol: "lol2", type: "doorvraag",
      vraag: "Je zegt dat dezelfde handeling soms op vier manieren genoteerd stond. Hoe heb je die data opgeschoond zónder de inhoud te veranderen?",
      modelpunten: [
        "Probleem: ruwe data gaf een vertekend beeld door inconsistente notatie.",
        "Aanpak: varianten samengevoegd tot eenduidige categorieën en de verdeling herberekend.",
        "Bewust de inhoud niet veranderd — alleen logisch groeperen.",
        "Resultaat: betrouwbaardere cijfers en beter onderbouwde conclusies.",
        "Laat methodisch bewustzijn zien: ordenen ≠ data 'mooier maken'."
      ]
    },
    {
      id: "l2-q4", lol: "lol2", type: "doorvraag",
      vraag: "Je benoemt zelf de beperkingen van je onderzoek. Welke waren dat, en waarom is het belangrijk die te noemen?",
      modelpunten: [
        "Beperking 1: alleen dagdiensten geobserveerd — avond/nacht kunnen anders zijn.",
        "Beperking 2: de geplande interviews met verpleegkundigen waren nog niet uitgevoerd.",
        "Door beperkingen zelf te benoemen, zet je de uitkomsten in het juiste licht (geen overclaiming).",
        "Inzicht: observatie alleen is op de lange termijn niet genoeg — je hebt het verhaal van de verpleegkundigen ook op papier nodig.",
        "Houding: pas een conclusie trekken als de oorzaak echt is aangetoond, niet op basis van één bron."
      ],
      koppeling: "Leerdoel 2 — eerst de oorzaak; bijstelling POP: interviews nog afmaken"
    },
    {
      id: "l2-q5", lol: "lol2", type: "kritisch",
      vraag: "Je conclusie leunt op die 9% voorbehouden handelingen. Hoe zeker ben je dat dat klopt? Je codeerde toch alleen?",
      modelpunten: [
        "Erken het: je was de enige codeur — geen tweede beoordelaar, dus geen interbeoordelaarsbetrouwbaarheid.",
        "Wat je wél deed om het objectief te houden: coderen tegen de formele functiebeschrijvingen i.p.v. eigen inschatting.",
        "215 handelingen geeft een redelijke basis, maar het is een steekproef in een afgebakende periode.",
        "Mitigatie in het voorstel: verpleegkundige blijft achterwacht + escalatieprotocol, dus zelfs bij codeerruis blijft het veilig.",
        "Vervolg: een tweede codeur of interviews zouden de betrouwbaarheid verhogen — eerlijk over de grens."
      ]
    },
    {
      id: "l2-q6", lol: "lol2", type: "kritisch",
      vraag: "Mensen gedragen zich anders als er iemand meekijkt. Hoe weet je dat je observaties de normale werkdag laten zien en geen 'voorstelling'?",
      modelpunten: [
        "Herken het fenomeen (waarnemerseffect / Hawthorne) — sterk dat je dit zelf benoemt.",
        "Mitigatie: 26 observaties verspreid over meerdere diensten/afdelingen verkleint het effect van eenmalig 'netter' werken.",
        "Je registreerde concrete, feitelijke handelingen (wat gebeurt er), niet meningen — minder gevoelig voor sociaal wenselijk gedrag.",
        "Combinatie met Gemba walks en afstemming gaf een consistent beeld.",
        "Vervolg: triangulatie met interviews en registratiedata zou het beeld verder bevestigen."
      ]
    },
    {
      id: "l2-q7", lol: "lol2", type: "doorvraag",
      vraag: "Bij de duurzaamheidsnulmeting koos je drie perspectieven. Waarom juist die drie rollen, en wat leverde dat op?",
      modelpunten: [
        "Kader: Triple Bottom Line / people-planet-profit (Marcus & Van Dam, 2019).",
        "Drie rollen: coördinator KCC, medewerker KCC en een (oudere) patiënt — organisatie, werkvloer én klant.",
        "Cijfers uit het Jaardocument 2024 als objectieve aanvulling op de interviews (triangulatie).",
        "Belangrijkste bevinding: het ziekenhuis doet veel aan duurzaamheid, maar de patiënt merkt daar weinig van.",
        "Dat verschil zag je pas door de perspectieven naast elkaar te leggen.",
        "Les: meerdere bronnen/rollen geven een eerlijker beeld dan alleen de organisatie bevragen (bijlage I)."
      ]
    },
    {
      id: "l2-q8", lol: "lol2", type: "kritisch",
      vraag: "Twee van je drie respondenten in de duurzaamheidsnulmeting waren familieleden. Hoe betrouwbaar en objectief is dat?",
      modelpunten: [
        "Erken de beperking eerlijk: familie als respondent geeft risico op bias en sociaal wenselijke antwoorden.",
        "Wat het wél opleverde: snelle toegang tot drie verschillende rollen (organisatie, werkvloer, patiënt) voor een eerste nulmeting.",
        "Je leunde niet alleen op interviews: cijfers uit het Jaardocument 2024 als objectieve aanvulling.",
        "Het doel was een nulmeting/oefening met perspectieven, geen representatief eindonderzoek.",
        "Verbeterpunt: voor een betrouwbaarder beeld onafhankelijke respondenten en een grotere steekproef kiezen."
      ]
    },
    {
      id: "l2-q9", lol: "lol2", type: "doorvraag",
      vraag: "Je verbeterdoel is om het aandeel verpleegkundige tijd aan laagcomplexe zorg terug te brengen van 49% naar maximaal 20%. Hoe kwam je aan die 49%, en waarom is dit een goed geformuleerd doel?",
      modelpunten: [
        "De 49% komt uit je eigen observatiedata: ADL 31% + mobiliteit 18%.",
        "Het doel beschrijft een gewenste uitkomst, niet een oplossingsrichting (les uit de feedback).",
        "Het is SMART: meetbaar (max 20% per dienst) en tijdgebonden (vier opeenvolgende weken vanaf pilotstart).",
        "Twee subdoelen: ≥80% van de verkeerde-bed patiënten ligt in het cluster; taakverdeling-duidelijkheid ≥4 op schaal 1–5.",
        "Aansluiting op organisatiedoel: juiste medewerker op de juiste taak, kwaliteit behouden (herstelplan)."
      ],
      koppeling: "Leerdoel 2 — eerst de oorzaak, dan de oplossing"
    },

    /* ===================== LOL 3 ===================== */
    {
      id: "l3-q1", lol: "lol3", type: "open",
      vraag: "Hoe heb je het brede probleem van verkeerde-bed patiënten omgezet in iets concreets en uitvoerbaars?",
      modelpunten: [
        "Brede ontwikkeling (structureel probleem op veel afdelingen, herstelplan) gekoppeld aan de interne situatie van 3B.",
        "Onderbouwd met de grondoorzaak (5x-waarom) en een meetbaar doel (49% → max. 20%).",
        "Concreet ontwerp: pilot met 5 geclusterde bedden, hybride personele inzet, werkafspraken met escalatiecriteria.",
        "Resultaat: een voorstel dat het ziekenhuis in de praktijk kan toetsen (stap 5 en 6, bijlage A).",
        "Inzicht: een goed idee is nog geen goed voorstel — waarde ontstaat pas binnen de ruimte van bevoegdheden en draagvlak.",
        "Daarom: verbeterkansen klein en praktisch houden, zodat anderen er meteen mee verder kunnen."
      ],
      koppeling: "Leerdoel 3 — verbeterkansen signaleren"
    },
    {
      id: "l3-q2", lol: "lol3", type: "doorvraag",
      vraag: "Je liep tegen blokkades aan: geen cijfers voor 3B en vragen over bevoegdheden. Hoe heb je voorkomen dat het traject stil kwam te liggen?",
      modelpunten: [
        "Blokkade 1 (ontbrekende cijfers): zelf data verzameld via het observatieonderzoek.",
        "Blokkade 2 (juridisch/bevoegdheid): de P&O-werklijn gestart met Corien Blokzijl.",
        "Medezeggenschap in beeld gebracht: advies- vs. instemmingsrecht van de OR als randvoorwaarde.",
        "Resultaat: traject bleef in beweging; functieprofiel en OR-route zijn nu een aparte werklijn.",
        "Inzicht: initiatief nemen betekende óók hulp inschakelen toen het vraagstuk groter werd dan je mandaat — de juiste mensen op tijd aanhaken."
      ]
    },
    {
      id: "l3-q3", lol: "lol3", type: "open",
      vraag: "Bij de AFAS-haalbaarheidsstudie moest je de waarde van een idee onderbouwen. Hoe heb je dat aangepakt?",
      modelpunten: [
        "AFAS ERP integreert P&O, Payroll, Financiën, Inkoop, Logistiek en de OK in één platform met gedeelde data.",
        "Value Proposition Canvas: klanttaken (bestellen, facturen, personeelsdata); pijnpunten (handmatige fouten, dubbele invoer, geen totaaloverzicht); gains (sneller werken, data-inzicht, minder repetitief).",
        "De acht stappen van Kotter als kapstok voor succesfactoren en uitdagingen.",
        "Risico dat je signaleerde: in de overgangsperiode dubbel bijhouden (oud systeem + AFAS) verhoogt tijdelijk de foutkans.",
        "Aanbeveling: Fase 2-optimalisaties borgen via een ontwikkelkalender met kwartaalreviews (bijlage K).",
        "Zelfde houding bij Neurologie: laagcomplexe huisartsverwijzingen terugdringen (bijlage T)."
      ]
    },
    {
      id: "l3-q4", lol: "lol3", type: "kritisch",
      vraag: "Wat is er nou eigenlijk innovatief aan jouw voorstel? Bedden clusteren en een verzorgende inzetten gebeurt elders toch al?",
      modelpunten: [
        "Eerlijk: het concept is niet wereldschokkend nieuw — innovatie zit hier in de toepassing en onderbouwing voor déze context.",
        "Nieuw voor 3B: van 'verspreid, geen zone, geen taakverdeling' naar een onderbouwd, getoetst ontwerp.",
        "De combinatie maakt het: clustering + hybride inzet + escalatiecriteria + data-onderbouwing + medezeggenschapsroute.",
        "Ondernemend: je signaleerde de kans, vertaalde een externe ontwikkeling naar de afdeling en maakte het uitvoerbaar.",
        "Innovatie op niveau 2 = verbeterkansen signaleren en concreet maken, niet per se iets unieks uitvinden."
      ]
    },
    {
      id: "l3-q5", lol: "lol3", type: "kritisch",
      vraag: "Ondernemend zijn betekent ook risico durven nemen. Welk echt risico heb jíj genomen in dit traject?",
      modelpunten: [
        "Reëel: als stagiair op niveau 2 nam je geen groot financieel/strategisch risico — wees daar eerlijk over.",
        "Wel: je pakte een gevoelig onderwerp op (verzorgende i.p.v. verpleegkundige) dat weerstand kón oproepen.",
        "Je nam initiatief buiten je comfortzone: zelf data verzamelen, P&O en medezeggenschap aankaarten.",
        "Je durfde een onderbouwd voorstel neer te leggen dat getoetst (en mogelijk afgewezen) kan worden.",
        "Risicobeheersing hoort erbij: je hield het als 'onderzoek onder voorbehoud', niet als vaststaand besluit."
      ]
    },
    {
      id: "l3-q6", lol: "lol3", type: "doorvraag",
      vraag: "Vertel over je conceptplan voor de heropening van de Neurologie. Wat stelde je voor, en waarom is het uiteindelijk blijven liggen?",
      modelpunten: [
        "Probleem: patiëntenstop door beperkte capaciteit en hoge instroom (~350 nieuwe patiënten per maand), oplopende wachttijden.",
        "Kern van je idee: sturen op verwijzingen — laagcomplexe klachten (aspecifieke lage rugpijn, hoofdpijn zonder alarmsymptomen) terug naar de eerste lijn.",
        "Concreet: digitale filtering/screening van verwijzingen (ZorgDomein) en mogelijke ondersteuning door het secretariaat.",
        "Bevinding: verwijzingssturing was nog geen expliciet strategisch speerpunt; organisatie ervoor klaar, maar moet in strategie/systemen/communicatie.",
        "Eerlijk: het bleef concept — er is niet op doorgepakt; deels je eigen werkaantekeningen (bijlage T)."
      ]
    },

    /* ===================== LOL 4 ===================== */
    {
      id: "l4-q1", lol: "lol4", type: "open",
      vraag: "Je werkte met twee werelden: de werkvloer en de leiding. Hoe schakelde je daartussen?",
      modelpunten: [
        "Werkvloer (verpleegkundigen): concrete, praktische vragen tijdens het meelopen; aan het eind samenvatten om te checken of je het goed begreep.",
        "Leiding (Mariska Bouwman, Joanne Oelen): op hoger niveau over afbakening, randvoorwaarden en risico's van de pilot.",
        "Je hield de lijn tussen afdeling en Bureau P&P kort door open te staan voor feedback.",
        "Resultaat: bruikbare info van de werkvloer én scherpe richting met de leiding; diagnose en voorstel sloten op beide niveaus aan.",
        "Inzicht: taal echt aanpassen aan wie je voor je hebt (flexibel zijn) — en dit zichtbaarder op papier maken."
      ],
      koppeling: "Leerdoel 3 — doorvragen en schakelen"
    },
    {
      id: "l4-q2", lol: "lol4", type: "doorvraag",
      vraag: "Geef eens een concreet voorbeeld waarin je je taal of boodschap bewust hebt aangepast aan je gesprekspartner.",
      modelpunten: [
        "Bij verpleegkundigen: concrete, praktische vragen over de dagelijkse zorg; geen beleidsjargon.",
        "Bij Mariska/Joanne: praten over scope, haalbaarheid, randvoorwaarden, risico's — tactisch niveau.",
        "Bij P&O (Corien Blokzijl): formele insteek — taken, competenties, diploma's, functiebeschrijving.",
        "Techniek die hielp: aan het eind van een gesprek samenvatten wat je hoorde, om misverstanden te voorkomen.",
        "Reflectie: je merkte dat het werkt, maar wilt het ook zichtbaarder vastleggen op papier."
      ]
    },
    {
      id: "l4-q3", lol: "lol4", type: "open",
      vraag: "De inzet van een verzorgende in plaats van een verpleegkundige ligt gevoelig. Hoe heb je dat onderwerp bespreekbaar gehouden?",
      modelpunten: [
        "Risico: raakt aan functies, werkdruk en de positie van het team — verkeerd gebracht ontstaat snel weerstand.",
        "Aanpak (met Mariska en Joukje): duidelijk en open zijn richting de verpleegafdeling, verpleegkundigen steeds bijpraten als je er was.",
        "Framing: de inzet van een verzorgende als 'mogelijkheid onder onderzoek' presenteren, niet als vaststaand besluit.",
        "Resultaat: betrokkenen zijn aangehaakt i.p.v. overvallen; medezeggenschap werd randvoorwaarde vooraf i.p.v. struikelblok achteraf.",
        "Inzicht: hóe je een gevoelig voorstel brengt weegt net zo zwaar als de inhoud — mensen meenemen, niet doordrukken (POP)."
      ],
      koppeling: "POP — niet doordrukken, mensen meenemen"
    },
    {
      id: "l4-q4", lol: "lol4", type: "kritisch",
      vraag: "Je 'framede' de verzorgende als mogelijkheid onder onderzoek. Is dat geen slimme manier om weerstand uit te stellen in plaats van echt aan te gaan?",
      modelpunten: [
        "Onderscheid: framing als onderzoek was eerlijk — de richting lág ook nog niet vast, betrokkenen hadden zich nog niet verbonden.",
        "Het tegenovergestelde (besluit poneren) zou de discussie juist sluiten en weerstand oproepen.",
        "Je stelde betrokkenen actief op de hoogte en hing de juiste partijen aan (P&O, OR) — niet wegduwen maar aankoppelen.",
        "Medezeggenschap als randvoorwaarde vooraf = het conflict niet uitstellen maar netjes beleggen.",
        "Erken de grens: de échte test (pilot + reacties van het team) moet nog komen; dan blijkt of het draagvlak houdt."
      ]
    },
    {
      id: "l4-q5", lol: "lol4", type: "doorvraag",
      vraag: "Je noemt medezeggenschap een randvoorwaarde, maar schrijft ook dat je advies- versus instemmingsrecht nog niet sluitend in beeld hebt. Leg eens uit.",
      modelpunten: [
        "Adviesrecht kan spelen bij een wijziging in de organisatie van werkzaamheden als die belangrijk genoeg is.",
        "Instemmingsrecht kan spelen bij personele regelingen (functiebeoordeling, scholing, inzet van personeel) en functiewaardering.",
        "Eerlijk dat je het precieze onderscheid voor déze casus nog niet sluitend hebt — dat is een open punt.",
        "Het is wél een randvoorwaarde voordat een pilot structureel wordt — je hebt het risico onderkend, niet genegeerd.",
        "Je hebt de vraag belegd via de P&O-werklijn (Corien Blokzijl) i.p.v. zelf buiten je mandaat te beslissen.",
        "Volgorde die je aanhoudt: taken → competenties/diploma's → functiebeschrijving → medezeggenschap."
      ]
    },
    {
      id: "l4-q6", lol: "lol4", type: "open",
      vraag: "Bij de supply chain op de OK werkte je samen met anderen. Wat haalde die samenwerking op dat je alleen niet had gekund?",
      modelpunten: [
        "Je kon de keten niet vanaf papier doorgronden — je had kennis nodig van mensen die hem van binnenuit kennen.",
        "Samenwerking met Harmina Fischer-Danker (hoofd beide OK-complexen) en Sonja Tien (procesverbeteraar P&P).",
        "Leeninstrumentarium staat niet op voorraad: per ingreep aanvragen, daarna direct retour — géén vaste buffer.",
        "Je maakte de keten zichtbaar in een procesplaat met 4 artikeltypen, de stappen en 5 aandachtspunten (bijlage R).",
        "Sonja noemt jouw interactieve waardestroommapping als voorbeeld dat betrokkenen meer inzicht gaf — extern bevestigd resultaat."
      ]
    },
    {
      id: "l4-q7", lol: "lol4", type: "doorvraag",
      vraag: "In je verandermanagement-opdracht analyseerde je hoe het OZG van ad-hoc verbeteren naar continu verbeteren wil. Waarom is dat vooral een 'groen' vraagstuk, en wat betekent dat voor hoe je mensen meeneemt?",
      modelpunten: [
        "Kader: kleurenmodel van De Caluwé & Vermaak + professionele bureaucratie van Mintzberg.",
        "Het herstelplan is 'blauw' ingestoken (top-down, rationeel gepland); de gewenste verandering vraagt 'groen' gedrag (leren, eigenaarschap).",
        "GAP-analyse op drie dimensies: structuur (middelgroot), competenties (middelgroot) en cultuur/gedrag (grootste gap).",
        "Kernconclusie: structuur en competenties zijn met formats/training te overbruggen; de cultuuromslag kost tijd en consistent voorbeeldgedrag.",
        "Verbinding: in een professionele bureaucratie met autonome professionals moet je mensen meenemen, niet opleggen (rode draad POP)."
      ],
      koppeling: "Leerdoel 3 — doorvragen en schakelen"
    },

    /* ===================== LOL 5 ===================== */
    {
      id: "l5-q1", lol: "lol5", type: "open",
      vraag: "Je kreeg stevige feedback op je conceptversie. Wat was die feedback en wat heb je ermee gedaan?",
      modelpunten: [
        "Feedback: doelstelling te veel een oplossingsrichting; stappen 3–7 te globaal; 5x-waarom meer opsomming dan doorredenering; documentatie incompleet.",
        "Aanpak: stappen verder uitgewerkt, maatregelen concreter ontworpen, documentatie aangevuld.",
        "Tussentijds feedback gevraagd aan Joanne en Mariska om te toetsen of je de goede kant op ging.",
        "Bewijs: feedbackformulier (bijlage B) + definitieve versie (bijlage A) laten zien wat je met de feedback deed.",
        "Reflectie: je had tussendoor meer contact met school en de bedrijfskundigen in het bedrijf kunnen zoeken — leerpunt voor de afstudeerstage."
      ],
      koppeling: "Leerdoel 4 — verantwoordelijkheid en reflectie"
    },
    {
      id: "l5-q2", lol: "lol5", type: "doorvraag",
      vraag: "Welk deel van die feedback was voor jou het lastigst om te accepteren, en waarom?",
      modelpunten: [
        "Persoonlijk en eerlijk antwoorden — bijv. dat de doelstelling 'te veel een oplossingsrichting' was, want dat raakt je rode draad (te snel naar oplossing).",
        "Spanning: het was 'jouw aanpak deze stage', maar de feedback raakte juist je grootste valkuil.",
        "Hoe je ermee omging: niet de kern overboord gooien, maar gericht aanscherpen.",
        "Laat reflectie zien: feedback op je zwakke punt voelt vervelend, maar bevestigde je ontwikkeldoel.",
        "Groei: van 'zwakte' naar een bewust onderhouden gewoonte."
      ]
    },
    {
      id: "l5-q3", lol: "lol5", type: "open",
      vraag: "Vertel over een moment waarop je je eigen grenzen herkende. Wat gebeurde er en wat leerde je?",
      modelpunten: [
        "Context: meelopen bij operaties op de OK om naar het logistieke deel te kijken.",
        "Je lette scherp op, stelde vragen aan OK-assistenten, liep er bijna een hele dag rond.",
        "Grens: je schreef niet mee tijdens de operaties, omdat je niet wist of pen/papier mocht terwijl een operatie bezig was.",
        "Reflectie: achteraf had je dat gewoon moeten vragen — daar had je meer persoonlijk leiderschap kunnen tonen.",
        "Patiëntveiligheid en organisatiesensitiviteit speelden mee in je terughoudendheid."
      ]
    },
    {
      id: "l5-q4", lol: "lol5", type: "kritisch",
      vraag: "Bij persoonlijk leiderschap noem je vooral wat je beter had moeten doen. Waar liet je écht leiderschap zien — wat ging er juist goed?",
      modelpunten: [
        "Goed: je nam zelf initiatief om data te verzamelen toen cijfers ontbraken (eigenaarschap).",
        "Goed: je startte zelf de P&O- en medezeggenschapslijn — verantwoordelijkheid pakken buiten je comfortzone.",
        "Goed: je vroeg actief en herhaald om feedback en verwerkte die zichtbaar (Joanne, Mariska, begeleiders).",
        "Extern bevestigd: Sonja/Judith noemen actief luisteren, eigen initiatief en de interactieve waardestroommapping.",
        "Balans tonen: reflectie op verbeterpunten is sterk, maar durf ook je sterke kanten te claimen — dat is óók leiderschap."
      ]
    },
    {
      id: "l5-q5", lol: "lol5", type: "doorvraag",
      vraag: "Hoe vroeg je concreet om feedback tijdens je stage, en wat deed je ermee?",
      modelpunten: [
        "POP-afspraak: minimaal 3x gericht feedback vragen en zichtbaar verwerken; maandelijks reflectiemoment met Joukje.",
        "Gerichte vragen over houding, geduld bij weerstand en zelfstandigheid — niet 'vond je het goed?'.",
        "Tussentijds getoetst bij Joanne en Mariska of je de goede kant op ging met de verdiepende opdracht.",
        "Verwerking zichtbaar gemaakt: feedbackformulier (bijlage B) + concept → definitieve versie (bijlage A).",
        "Functionerings- en evaluatieformulier (bijlage O) bevestigt groei in zelfstandigheid en reflectie."
      ]
    },
    {
      id: "l5-q6", lol: "lol5", type: "kritisch",
      vraag: "Je had geen formele leidinggevende rol. Waar nam jíj dan de leiding, in plaats van mee te lopen met wat anderen bepaalden?",
      modelpunten: [
        "Je pakte een eigen verbetertraject van begin tot (bijna) eind — niet alleen meedraaien.",
        "Je bepaalde zelf de aanpak (A3), de onderzoeksopzet en de framing van een gevoelig onderwerp.",
        "Je escaleerde en belegde zaken proactief (P&O, OR) toen het je mandaat oversteeg.",
        "Je nam regie over je eigen leerproces: feedback vragen, POP bijstellen, vakkenkeuze maken.",
        "Leiderschap op niveau 2 = verantwoordelijkheid nemen en sturen binnen je rol, niet anderen aansturen."
      ]
    },
    {
      id: "l5-q7", lol: "lol5", type: "doorvraag",
      vraag: "De feedback zei dat je 5x-waarom-analyse meer een opsomming was dan een echte doorredenering. Hoe heb je dat concreet verbeterd?",
      modelpunten: [
        "Je redeneerde de oorzaken echt door tot de grondoorzaak: het ontbreken van een formeel functieprofiel voor een verzorgende.",
        "Elke 'waarom' bouwt logisch op de vorige (laagcomplexe zorg → geen onderscheid → geen vaste werkwijze → andere personele samenstelling nodig → functieprofiel ontbreekt).",
        "Je verbond de grondoorzaak aan de maatregelen: clustering alléén is niet genoeg, ook functieprofiel + medezeggenschap.",
        "Andere feedbackpunten ook verwerkt: doel als uitkomst i.p.v. oplossing, stappen 3–7 concreter, documentatie aangevuld.",
        "Bewijs: concept → definitieve versie (bijlage A) + feedbackformulier (bijlage B)."
      ],
      koppeling: "Leerdoel 4 — verantwoordelijkheid en reflectie"
    },

    /* ===================== Portfolio-breed / algemeen ===================== */
    {
      id: "alg-q1", lol: "alg", type: "open",
      vraag: "Stel je voor in twee minuten: wie ben je, wat heb je tijdens je stage gedaan, en wat heb je geleerd? (elevator pitch)",
      modelpunten: [
        "Kort: oriënterende stage bij Bureau Procesverbetering en Projecten, OZG, vanaf februari 2026.",
        "Kern: verbetertraject verkeerde-bed patiënten op 3B — A3-methode, observatieonderzoek, onderbouwd voorstel.",
        "Resultaat: clustering 5 bedden + hybride inzet + escalatiecriteria; pilot en functieprofiel nog in bewerking.",
        "Geleerd: niet te snel naar de oplossing, eerst de oorzaak; schakelen tussen werkvloer en leiding; gevoelig onderwerp bespreekbaar houden.",
        "Profiel: planmatige, analytische doener — richting procesadvies/organisatieadvies."
      ]
    },
    {
      id: "alg-q2", lol: "alg", type: "kritisch",
      vraag: "Je werkte samen met je collega Joanne Oelen. Wat was nou precies jóuw aandeel en wat deed zij?",
      modelpunten: [
        "Wees concreet over eigenaarschap — dit is een typische CGI-check op 'is het jouw werk?'.",
        "Jouw aandeel: A3-traject uitwerken, procesonderzoek, het observatieonderzoek (26 observaties, 215 handelingen), het verbetervoorstel en de verdiepende opdracht.",
        "Joanne als collega van Bureau P&P: meedenken, afstemmen over scope/haalbaarheid, samen de framing bepalen (verzorgende als mogelijkheid onder onderzoek).",
        "Mariska Bouwman (hoofd 3B) was opdrachtgever; P&O (Corien Blokzijl) een aparte werklijn.",
        "Laat zien dat je samenwerkte maar de analyse en het onderzoek zelf droeg."
      ]
    },
    {
      id: "alg-q3", lol: "alg", type: "doorvraag",
      vraag: "Je POP-rode draad was 'te snel naar de oplossing springen'. Overtuig me dat je daarop écht gegroeid bent — met bewijs.",
      modelpunten: [
        "Bewijs 1: bewuste keuze voor A3 om de probleemfase langer open te houden.",
        "Bewijs 2: zelf data verzameld (observatie) i.p.v. op aannames een oplossing baseren.",
        "Bewijs 3: feedback op de te oplossingsgerichte doelstelling verwerkt in de definitieve versie.",
        "Bewijs 4: gevoelig onderwerp als 'onderzoek' gebracht i.p.v. besluit — niet doordrukken.",
        "Eerlijk: het blijft een aandachtspunt; je houdt het staan als bewuste gewoonte, niet meer als zwakte."
      ],
      koppeling: "POP-bijstelling (hoofdstuk 4.2)"
    },
    {
      id: "alg-q4", lol: "alg", type: "kritisch",
      vraag: "Als je één ding van deze stage echt anders zou doen, wat is dat en waarom?",
      modelpunten: [
        "Eerlijk en concreet — geen 'niets' of een verkapte kwaliteit.",
        "Sterke kandidaat: de geplande formele interviews met verpleegkundigen wél uitvoeren (nu blijven conclusies op één bron leunen).",
        "Alternatief: eerder en vaker school/de bedrijfskundigen in huis betrekken bij het schrijven.",
        "Alternatief: tijdens het OK-meelopen direct vragen of je mocht meeschrijven (persoonlijk leiderschap).",
        "Koppel terug aan je POP en aan je afstudeerstage als concreet verbeterpunt."
      ]
    },
    {
      id: "alg-q5", lol: "alg", type: "doorvraag",
      vraag: "Je toont dit portfolio op niveau 2. Wat betekent niveau 2 voor jou, en waaraan zie je dat je daar zit?",
      modelpunten: [
        "Niveau 2 (oriënterend): zelfstandig meewerken aan een echt vraagstuk in een complexe context, onder begeleiding.",
        "Zelfstandige analyse van begin tot eind doorlopen (probleem → onderzoek → onderbouwd voorstel).",
        "Methoden bewust kiezen en verantwoorden (A3, PICK, VPC/Kotter, DESTEP/7S/SWOT, observatie).",
        "Organisatiesensitiviteit: bevoegdheden, medezeggenschap en draagvlak meewegen.",
        "Reflectie en feedback zichtbaar gebruiken; beoordeling 'ruim voldoende' op alle vier onderdelen (bijlage O)."
      ]
    },
    {
      id: "alg-q6", lol: "alg", type: "open",
      vraag: "Wat zijn je doelen voor de langere termijn, en hoe sluit je vakkenkeuze voor volgend jaar daarop aan?",
      modelpunten: [
        "Energie van procesverbetering in complexe organisaties; snijvlak van analyse en uitvoering.",
        "Beroepsperspectief: procesadviseur, organisatieadviseur of projectmedewerker (zorg, maar ook consultancy/grotere organisatie).",
        "Eerste halfjaar: semester 'Organiseren voor de Toekomst' — Diagnose en Ontwerp wendbaarheid.",
        "Tweede halfjaar: minor 'Veranderen van Organisaties' (bijlage Q).",
        "Aansluiting: verandermanagement en omgaan met weerstand + diepgaander onderzoek en sterkere datavaardigheden."
      ]
    },
    {
      id: "alg-q7", lol: "alg", type: "doorvraag",
      vraag: "Hoe neem je wat je hier geleerd hebt mee naar je afstudeerstage? Wat doe je dan anders of beter?",
      modelpunten: [
        "Onderzoek completer maken: formele interviews/triangulatie wél afronden, niet alleen observatie.",
        "Eerder hulp en sparring zoeken (school, bedrijfskundigen in huis) bij opbouw en schrijven.",
        "Rode draad bewust onderhouden: probleemfase openhouden vóór oplossing.",
        "Zelfstandige analyse opschalen naar een groter/complexer project.",
        "Persoonlijk leiderschap: eerder vragen om wat je nodig hebt (bijv. meeschrijven, toegang, data)."
      ]
    },
    {
      id: "alg-q8", lol: "alg", type: "kritisch",
      vraag: "Op een paar plekken verwijs je naar het gebruik van een AI-tool voor je bronnenlijst. Hoe heb je AI-hulpmiddelen ingezet, en hoe borg je dat de analyse en conclusies van jou zijn?",
      modelpunten: [
        "Wees open en concreet over waarvoor je AI gebruikte (bijv. APA-bronvermelding opmaken), niet voor de analyse zelf.",
        "De inhoud is van jou: de observaties, codering, 5x-waarom, het verbetervoorstel en de reflecties heb jij gemaakt.",
        "Je controleerde de AI-output (bronnen verifiëren) i.p.v. blind overnemen.",
        "Transparantie: je benoemt het gebruik eerlijk in het document.",
        "Laat zien dat je de afweging kent: AI als hulpmiddel voor vorm/efficiëntie, jouw eigen oordeel voor de inhoud."
      ]
    }
  ],

  /* ------------------------------------------------------------------
     Meerkeuzevragen (kennischeck) — één juist antwoord per vraag
  ------------------------------------------------------------------ */
  mcVragen: [

    /* ---- LOL 1 ---- */
    {
      id: "mc-l1-1", lol: "lol1",
      vraag: "Welke methode gebruikte je als leidende structuur voor het verbetertraject op afdeling 3B?",
      opties: ["De A3-methode (7 stappen)", "De DMAIC-cyclus", "Een SWOT-analyse", "De watervalmethode"],
      correct: 0,
      uitleg: "De A3-methode dwingt je eerst het probleem en de huidige situatie scherp te krijgen, vóór je een doel en maatregelen bepaalt."
    },
    {
      id: "mc-l1-2", lol: "lol1",
      vraag: "Waarvoor gebruikte je de PICK-matrix bij het OK-leeninstrumentariumproces?",
      opties: ["Verbeterpunten prioriteren op impact vs. inspanning", "De financiële haalbaarheid berekenen", "De afdelingscultuur in kaart brengen", "De patiëntveiligheid scoren"],
      correct: 0,
      uitleg: "Met de PICK-matrix onderbouwde je dat het vastleggen van de aanvraagtermijn de meeste winst oplevert met de minste inspanning."
    },
    {
      id: "mc-l1-3", lol: "lol1",
      vraag: "Welke combinatie van modellen gebruikte je voor de organisatieanalyse (bijlage H)?",
      opties: ["DESTEP, het 7S-model en SWOT", "Porter's Five Forces, BCG en Ansoff", "Kotter, ADKAR en Lewin", "PDCA, KATA en Six Sigma"],
      correct: 0,
      uitleg: "DESTEP voor de externe omgeving, het 7S-model van McKinsey voor de interne organisatie, samengebracht in een SWOT."
    },
    {
      id: "mc-l1-4", lol: "lol1",
      vraag: "Welke KPI's zijn voor Bureau Procesverbetering en Projecten relevant (bijlage N)?",
      opties: ["Projectvoortgang, plus ligduur op 3A/3B en OK-benutting", "Omzet per medisch specialist", "Het aantal parkeerplaatsen", "Patiënttevredenheid over het eten"],
      correct: 0,
      uitleg: "BPP draagt indirect bij: het stuurt op projectvoortgang, met outcome-KPI's ligduur en OK-benutting gekoppeld aan de KSF's."
    },

    /* ---- LOL 2 ---- */
    {
      id: "mc-l2-1", lol: "lol2",
      vraag: "Hoeveel zorghandelingen registreerde je tijdens je observatieonderzoek?",
      opties: ["215 handelingen", "26 handelingen", "49 handelingen", "120 handelingen"],
      correct: 0,
      uitleg: "In 26 observaties (op 3A, 3B en 2B) registreerde je in totaal 215 zorghandelingen."
    },
    {
      id: "mc-l2-2", lol: "lol2",
      vraag: "Welk deel van de zorg bij verkeerde-bed patiënten was voorbehouden aan een verpleegkundige?",
      opties: ["Ongeveer 9%", "Ongeveer 31%", "Ongeveer 49%", "Ongeveer 80%"],
      correct: 0,
      uitleg: "Slechts 9% was voorbehouden (zoals katheteriseren, blaasspoelen, wondzorg, insuline); de rest was grotendeels laagcomplex."
    },
    {
      id: "mc-l2-3", lol: "lol2",
      vraag: "Hoe kwam je aan het cijfer van 49% laagcomplexe zorg?",
      opties: ["ADL (31%) en mobiliteit (18%) samen", "Het aantal patiënten gedeeld door het aantal bedden", "Een schatting van de afdelingsmanager", "Een getal uit het jaardocument"],
      correct: 0,
      uitleg: "ADL-zorg (31%) en mobiliteitsondersteuning (18%) vormden samen bijna de helft van alle geregistreerde handelingen."
    },
    {
      id: "mc-l2-4", lol: "lol2",
      vraag: "Welke beperking van je observatieonderzoek benoemde je zelf eerlijk?",
      opties: ["Alleen dagdiensten, en de geplande interviews waren nog niet uitgevoerd", "Er waren te veel observatoren", "De data kwam van een ander ziekenhuis", "Er werd alleen 's nachts geobserveerd"],
      correct: 0,
      uitleg: "Door beperkingen zelf te benoemen, zet je de uitkomsten in het juiste licht (geen overclaiming)."
    },
    {
      id: "mc-l2-5", lol: "lol2",
      vraag: "Welke meetlat gebruikte je om te bepalen of een verzorgende een handeling mag uitvoeren?",
      opties: ["De OZG-functiebeschrijvingen (Verpleegkundige I/J en ziekenverzorgende)", "Je eigen inschatting", "Een enquête onder patiënten", "De landelijke CAO ziekenhuizen"],
      correct: 0,
      uitleg: "Door de functiebeschrijvingen als meetlat te gebruiken, werd je oordeel controleerbaar in plaats van een mening."
    },

    /* ---- LOL 3 ---- */
    {
      id: "mc-l3-1", lol: "lol3",
      vraag: "Welke modellen gebruikte je in de AFAS-haalbaarheidsstudie?",
      opties: ["Value Proposition Canvas en de 8 stappen van Kotter", "SWOT en DESTEP", "PICK-matrix en A3", "Belbin en de Big Five"],
      correct: 0,
      uitleg: "Het Value Proposition Canvas voor de waardebepaling en de acht stappen van Kotter als kapstok voor succesfactoren en uitdagingen."
    },
    {
      id: "mc-l3-2", lol: "lol3",
      vraag: "Wat hield je concrete pilotvoorstel voor afdeling 3B in?",
      opties: ["Clustering van 5 bedden, hybride inzet en escalatiecriteria", "Volledige nieuwbouw van de afdeling", "Het ontslaan van verpleegkundigen", "Alleen extra bedden bijplaatsen"],
      correct: 0,
      uitleg: "Een pilot met 5 geclusterde bedden, een hybride personele inzet en vaste werkafspraken met escalatiecriteria."
    },
    {
      id: "mc-l3-3", lol: "lol3",
      vraag: "Welk pijnpunt loste AFAS ERP op volgens de waardepropositie?",
      opties: ["Handmatige fouten, dubbele invoer en geen totaaloverzicht", "Te weinig parkeerplaatsen", "Een tekort aan operatiekamers", "Te hoge inkoopprijzen van medicijnen"],
      correct: 0,
      uitleg: "AFAS koppelt processen aan elkaar en geeft via één gedeeld platform het gewenste overzicht."
    },
    {
      id: "mc-l3-4", lol: "lol3",
      vraag: "Wat was de kern van je conceptidee bij de heropening van de Neurologie?",
      opties: ["Laagcomplexe huisartsverwijzingen terugdringen/filteren", "Meer neurologen aannemen", "De afdeling sluiten", "Alle patiënten doorsturen naar het UMCG"],
      correct: 0,
      uitleg: "Laagcomplexe klachten (zoals aspecifieke lage rugpijn) kunnen vaak in de eerste lijn, wat de druk op de specialistische zorg verlaagt."
    },

    /* ---- LOL 4 ---- */
    {
      id: "mc-l4-1", lol: "lol4",
      vraag: "Hoe bracht je het gevoelige idee om een verzorgende in te zetten?",
      opties: ["Als 'mogelijkheid onder onderzoek', niet als vaststaand besluit", "Als een al genomen besluit van de directie", "Door het niet met het team te bespreken", "Via een anonieme memo"],
      correct: 0,
      uitleg: "Door het als onderzoek te framen bleef het gesprek open en raakten betrokkenen aangehaakt in plaats van overvallen."
    },
    {
      id: "mc-l4-2", lol: "lol4",
      vraag: "Welk model gebruikte je in de verandermanagement-opdracht (bijlage J)?",
      opties: ["Het kleurenmodel van De Caluwé & Vermaak", "De BCG-matrix", "Het INK-managementmodel", "SERVQUAL"],
      correct: 0,
      uitleg: "Het herstelplan is 'blauw' ingestoken, terwijl de gewenste verandering vooral 'groen' gedrag vraagt."
    },
    {
      id: "mc-l4-3", lol: "lol4",
      vraag: "Wat is volgens je verandermanagement-analyse de grootste 'gap' bij het OZG?",
      opties: ["Cultuur en gedrag", "Structuur", "Competenties", "De financiële positie"],
      correct: 0,
      uitleg: "Structuur en competenties zijn met formats en training te overbruggen; de cultuuromslag kost tijd en consistent voorbeeldgedrag."
    },
    {
      id: "mc-l4-4", lol: "lol4",
      vraag: "Met wie bracht je de supply chain van leeninstrumentarium op de OK in kaart?",
      opties: ["Harmina Fischer-Danker en Sonja Tien", "Mariska Bouwman en Joanne Oelen", "Corien Blokzijl van P&O", "Joukje Punter-Boonstra"],
      correct: 0,
      uitleg: "Met hun kennis van binnenuit bracht je de stappen, partijen en risico's in kaart; Sonja prees je interactieve waardestroommapping."
    },

    /* ---- LOL 5 ---- */
    {
      id: "mc-l5-1", lol: "lol5",
      vraag: "Wat was de kern van de feedback op je conceptverdiepende opdracht?",
      opties: ["Doel te oplossingsgericht, stappen te globaal, 5x-waarom een opsomming", "Het stuk was te lang en te gedetailleerd", "Vooral spelling- en taalfouten", "Er was geen bronvermelding nodig"],
      correct: 0,
      uitleg: "Je verwerkte deze feedback in de definitieve versie (bijlage A), zichtbaar via het feedbackformulier (bijlage B)."
    },
    {
      id: "mc-l5-2", lol: "lol5",
      vraag: "Wat herkende je als je rode draad en belangrijkste ontwikkelpunt?",
      opties: ["Te snel naar een oplossing willen springen", "Te weinig zelfvertrouwen", "Moeite met cijfers en data", "Te weinig initiatief nemen"],
      correct: 0,
      uitleg: "Dit liep als rode draad door al je leerdoelen; je houdt het nu staan als een bewust onderhouden gewoonte."
    },
    {
      id: "mc-l5-3", lol: "lol5",
      vraag: "Welk leermoment had je tijdens het meelopen op de OK?",
      opties: ["Je had moeten vragen of je mocht meeschrijven", "Je had de operatie zelf moeten uitvoeren", "Je had helemaal niet moeten meelopen", "Je had de chirurg moeten corrigeren"],
      correct: 0,
      uitleg: "Daar had je meer persoonlijk leiderschap kunnen tonen door gewoon te vragen wat wel en niet mocht."
    },

    /* ---- Portfolio-breed ---- */
    {
      id: "mc-alg-1", lol: "alg",
      vraag: "Wat is een 'verkeerde-bed patiënt'?",
      opties: [
        "Iemand die medisch is uitbehandeld maar wacht op een plek in een verpleeghuis of revalidatiecentrum",
        "Een patiënt die per ongeluk in een ander bed is gelegd",
        "Een patiënt die te lang op de operatiewachtlijst staat",
        "Een patiënt die in het verkeerde ziekenhuis ligt"
      ],
      correct: 0,
      uitleg: "Het OZG heeft er dagelijks 6 tot 12, verspreid over meerdere afdelingen."
    },
    {
      id: "mc-alg-2", lol: "alg",
      vraag: "Wat was volgens je 5x-waarom-analyse de grondoorzaak van de inefficiëntie?",
      opties: [
        "Het ontbreken van een formeel functieprofiel voor een verzorgende op een verpleegafdeling",
        "Een tekort aan bedden op 3B",
        "Onvoldoende inzet van de verpleegkundigen",
        "Een tekort aan artsen"
      ],
      correct: 0,
      uitleg: "Daardoor blijft de personele inzet hetzelfde en wordt de zorg georganiseerd alsof het gewone klinische patiënten zijn."
    },
    {
      id: "mc-alg-3", lol: "alg",
      vraag: "Welk onderscheid bepaalt welke taken je aan een verzorgende mag delegeren?",
      opties: ["Verzorgende niveau 3 versus verzorgende IG niveau 3", "Leeftijd van de verzorgende", "Vast versus tijdelijk contract", "Dag- versus nachtdienst"],
      correct: 0,
      uitleg: "Een verzorgende IG heeft in de praktijk een ruimer deskundigheidsgebied; de inzet hangt af van diploma, bevoegdheid en beleid."
    },
    {
      id: "mc-alg-4", lol: "alg",
      vraag: "Wanneer kan de ondernemingsraad instemmingsrecht hebben bij de inzet van een verzorgende?",
      opties: [
        "Bij personele regelingen of een (gewijzigd) functiewaarderingssysteem",
        "Bij de aankoop van kantoorbenodigdheden",
        "Nooit, de OR heeft hierin geen enkele rol",
        "Alleen bij het ontslag van de raad van bestuur"
      ],
      correct: 0,
      uitleg: "Daarom is medezeggenschap een randvoorwaarde vooraf, belegd via de P&O-werklijn, niet een struikelblok achteraf."
    },
    {
      id: "mc-alg-5", lol: "alg",
      vraag: "Welke vakken/minor koos je voor volgend studiejaar (bijlage Q)?",
      opties: [
        "Semester 'Organiseren voor de Toekomst' + minor 'Veranderen van Organisaties'",
        "Een minor Financial Management",
        "Een uitwisseling in het buitenland",
        "De minor Data Science & AI"
      ],
      correct: 0,
      uitleg: "Die keuze past bij je richting: verandermanagement en omgaan met weerstand, plus diepgaander onderzoek en datavaardigheden."
    },

    /* ---- Uitbreiding ---- */
    {
      id: "mc-l1-5", lol: "lol1",
      vraag: "Wat leverde de Gemba walk (meelopen op de afdeling) je op?",
      opties: [
        "Je toetste je aannames aan de praktijk en zag waar de drukte echt vandaan kwam",
        "Je kon vanaf je bureau alle cijfers verzamelen",
        "Je hoefde niet meer met verpleegkundigen te praten",
        "Het leverde de financiële begroting op"
      ],
      correct: 0,
      uitleg: "De kennis over hoe het echt werkt zit bij de mensen op de afdeling; daardoor werd je oorzakenanalyse sterker."
    },
    {
      id: "mc-l1-6", lol: "lol1",
      vraag: "Wat is het kenmerkende eerste deel van de A3-methode dat paste bij jouw valkuil?",
      opties: [
        "Eerst probleem en huidige situatie scherp krijgen, vóór doel en maatregelen",
        "Direct beginnen met de oplossing implementeren",
        "Eerst de begroting rond krijgen",
        "Eerst draagvlak bij de raad van bestuur regelen"
      ],
      correct: 0,
      uitleg: "Juist die volgorde remde je af, zodat je niet te snel naar de oplossing sprong (je POP-rode draad)."
    },
    {
      id: "mc-l2-6", lol: "lol2",
      vraag: "Hoeveel observaties voerde je in totaal uit?",
      opties: ["26 observaties", "215 observaties", "9 observaties", "49 observaties"],
      correct: 0,
      uitleg: "In die 26 observaties registreerde je samen 215 zorghandelingen."
    },
    {
      id: "mc-l2-7", lol: "lol2",
      vraag: "Op welke afdelingen voerde je de observaties uit?",
      opties: ["3A, 3B en 2B", "Alleen op 3B", "Op de OK en de SEH", "Op alle verpleegafdelingen tegelijk"],
      correct: 0,
      uitleg: "Door op meerdere afdelingen te observeren werd het beeld iets breder dan alleen 3B."
    },
    {
      id: "mc-l2-8", lol: "lol2",
      vraag: "Welk model lag onder je duurzaamheidsnulmeting (bijlage I)?",
      opties: ["Triple Bottom Line: people, planet, profit", "Het 7S-model", "De 8 stappen van Kotter", "De PICK-matrix"],
      correct: 0,
      uitleg: "Je bekeek de duurzaamheid vanuit drie rollen (organisatie, werkvloer en patiënt) plus cijfers uit het jaardocument."
    },
    {
      id: "mc-l2-9", lol: "lol2",
      vraag: "Wat was je belangrijkste bevinding in de duurzaamheidsnulmeting?",
      opties: [
        "Het ziekenhuis doet veel aan duurzaamheid, maar de patiënt merkt er weinig van",
        "Het ziekenhuis doet helemaal niets aan duurzaamheid",
        "Duurzaamheid kost te veel geld",
        "De patiënt is juist het meest tevreden over de duurzaamheid"
      ],
      correct: 0,
      uitleg: "Dat verschil zag je pas door de drie perspectieven naast elkaar te leggen."
    },
    {
      id: "mc-l3-5", lol: "lol3",
      vraag: "Welke methode gebruik je voor de wekelijkse evaluatie van het verbetertraject?",
      opties: ["De KATA-methode", "De BCG-matrix", "Een SWOT-analyse", "De Big Five-test"],
      correct: 0,
      uitleg: "KATA is een vaste routine om stap voor stap te blijven verbeteren (bijlage P)."
    },
    {
      id: "mc-l3-6", lol: "lol3",
      vraag: "Hoe ging je om met het ontbreken van afdelingscijfers voor 3B?",
      opties: [
        "Je verzamelde zelf data via observatie",
        "Je legde het traject stil",
        "Je gebruikte cijfers van een ander ziekenhuis",
        "Je schatte ze in zonder onderbouwing"
      ],
      correct: 0,
      uitleg: "Doorpakken waar info ontbrak: zelf observeren in plaats van het traject te laten stilvallen."
    },
    {
      id: "mc-l4-5", lol: "lol4",
      vraag: "Welke techniek hielp je bij het schakelen tussen werkvloer en leiding?",
      opties: [
        "Aan het eind van een gesprek samenvatten om te checken of je het goed begreep",
        "Vooral lange e-mails sturen",
        "Alleen met de leiding praten",
        "Beslissingen zo snel mogelijk doordrukken"
      ],
      correct: 0,
      uitleg: "Samenvatten voorkwam misverstanden en hielp je je taal aan te passen aan je gesprekspartner."
    },
    {
      id: "mc-l4-6", lol: "lol4",
      vraag: "Welke organisatievorm typeert het OZG volgens Mintzberg?",
      opties: ["Een professionele bureaucratie", "Een machinebureaucratie", "Een adhocratie", "Een eenvoudige structuur"],
      correct: 0,
      uitleg: "Veel autonome, hoogopgeleide professionals — wat een cultuuromslag (groen gedrag) extra tijd kost."
    },
    {
      id: "mc-l5-4", lol: "lol5",
      vraag: "Hoe vaak wilde je volgens je POP gericht feedback vragen en zichtbaar verwerken?",
      opties: ["Minimaal 3 keer", "1 keer", "10 keer", "Nooit, alleen aan het eind"],
      correct: 0,
      uitleg: "Onderdeel van leerdoel 4: verantwoordelijkheid en reflectie, met maandelijkse reflectiemomenten met Joukje."
    },
    {
      id: "mc-l5-5", lol: "lol5",
      vraag: "Wat deed je nadat je feedback op je conceptverdiepende opdracht kreeg?",
      opties: [
        "Stappen uitgewerkt, maatregelen concreter, en tussentijds getoetst bij Joanne en Mariska",
        "De feedback genegeerd",
        "Helemaal opnieuw begonnen met een ander onderwerp",
        "Alleen de spelling aangepast"
      ],
      correct: 0,
      uitleg: "Je gooide de kern niet overboord, maar scherpte gericht aan — zichtbaar via concept → definitieve versie."
    },
    {
      id: "mc-alg-6", lol: "alg",
      vraag: "Welke beroepsrol spreekt je aan voor de langere termijn?",
      opties: [
        "Procesadviseur, organisatieadviseur of projectmedewerker",
        "Chirurg",
        "Verpleegkundige",
        "Financieel controller bij een bank"
      ],
      correct: 0,
      uitleg: "Je werkt graag op het snijvlak van analyse en uitvoering, bij voorkeur in een complexe organisatie."
    },
    {
      id: "mc-alg-7", lol: "alg",
      vraag: "Wat is het financiële beeld van het OZG (bijlage J/N)?",
      opties: [
        "Een verlies in 2024 (~€1,9 mln) en een verwacht verlies in 2025 (~€4 mln)",
        "Een recordwinst in 2024",
        "Een sluitende begroting zonder zorgen",
        "Er zijn geen financiële gegevens beschikbaar"
      ],
      correct: 0,
      uitleg: "Daarom voert het ziekenhuis het Herstelplan 2025–2027 uit; financieel herstel is een randvoorwaarde voor de missie."
    },
    {
      id: "mc-alg-8", lol: "alg",
      vraag: "Wat is een randvoorwaarde voordat de pilot structureel kan worden?",
      opties: [
        "Duidelijkheid over het functieprofiel en de medezeggenschapsroute (OR)",
        "Eerst een nieuwe afdeling bouwen",
        "Meer artsen aannemen",
        "Toestemming van de zorgverzekeraar voor elk bed"
      ],
      correct: 0,
      uitleg: "Volgorde: taken → competenties/diploma's → functiebeschrijving → medezeggenschap, belegd via P&O."
    }
  ],

  /* ------------------------------------------------------------------
     Spiekbriefje — kernfeiten uit je stage (om je geheugen te checken)
  ------------------------------------------------------------------ */
  feiten: [
    {
      titel: "De organisatie (OZG)",
      items: [
        "Enige algemene 24-uursziekenhuis voor Noord- en Oost-Groningen; missie: 'Samen. De beste zorg. Dichtbij.'",
        "Juridisch zelfstandig, maar volledig eigendom van het UMCG (beperkt eigen speelruimte).",
        "Herstelplan 2025–2027; verlies 2024 ≈ €1,9 mln, verwacht verlies 2025 ≈ €4 mln; omzet ≈ 187,4 mln.",
        "~1.500 medewerkers, waaronder ruim 120 medisch specialisten; platte structuur, korte lijnen.",
        "Professionele bureaucratie (Mintzberg): veel autonome, hoogopgeleide zorgprofessionals.",
        "Drie zorgclusters: Acuut, Snijdend, Beschouwend + stafclusters (ICT, P&O, Financiën)."
      ]
    },
    {
      titel: "Het verbetertraject (3B)",
      items: [
        "Verkeerde-bed patiënten: medisch uitbehandeld, wachten op verpleeghuis/revalidatie.",
        "OZG-breed dagelijks 6–12 verkeerde-bed patiënten, verspreid over afdelingen.",
        "Op 3B lagen ze tussen reguliere patiënten, zonder vaste zone en zonder aparte taakverdeling.",
        "Grondoorzaak (5x-waarom): geen formeel functieprofiel voor een verzorgende op een verpleegafdeling.",
        "Voorstel: clustering van 5 bedden (Gang 251) + hybride inzet + werkafspraken met escalatiecriteria.",
        "Randvoorwaarden: verpleegkundige blijft achterwacht + escalatieprotocol; functieprofiel en OR-route nog in bewerking.",
        "Opdrachtgever: Mariska Bouwman (hoofd 3B). Collega: Joanne Oelen. P&O: Corien Blokzijl. Pilot 6 weken, start medio juni 2026."
      ]
    },
    {
      titel: "Het onderzoek (cijfers)",
      items: [
        "26 observaties op de afdelingen 3A, 3B en 2B (feb–mrt 2026), alleen dagdiensten.",
        "215 geregistreerde zorghandelingen, gecodeerd op zorgtype, risico en bevoegdheid.",
        "ADL 31% + mobiliteit 18% = 49% laagcomplex; slechts 9% voorbehouden aan een verpleegkundige.",
        "Voorbehouden o.a.: katheteriseren, blaasspoelen, wondzorg, insuline-injecties.",
        "Meetlat: functiebeschrijvingen Verpleegkundige I en J + ziekenverzorgende (verzorgende niv. 3 vs. IG niv. 3)."
      ]
    },
    {
      titel: "Verbeterdoel (SMART) & evaluatie",
      items: [
        "Hoofddoel: aandeel verpleegkundige tijd aan laagcomplexe zorg van 49% → max. 20% per dienst (4 weken).",
        "Subdoel 1: ≥80% van de verkeerde-bed patiënten ligt in het cluster (4 weken).",
        "Subdoel 2: verpleegkundigen scoren de taakverdeling-duidelijkheid ≥4 op schaal 1–5.",
        "Evaluatie op 3 niveaus: procesindicatoren, ervaringsindicatoren, veiligheidsindicatoren (o.a. escalaties, VIM-meldingen).",
        "Escalatiecriteria: verpleegkundige binnen 5 min bij o.a. bewustzijnsverandering, benauwdheid, koorts >38,5, valincident."
      ]
    },
    {
      titel: "Methoden & modellen",
      items: [
        "A3-methode (7 stappen) + 5x-waarom voor de oorzakenanalyse.",
        "Gemba walk — meelopen op de afdeling om het echte proces te zien.",
        "PICK-matrix — prioriteren op impact vs. inspanning (OK-leeninstrumentarium).",
        "Gestructureerde observatie — data direct uit de praktijk.",
        "DESTEP, 7S-model (McKinsey), SWOT — organisatieanalyse (bijlage H).",
        "Value Proposition Canvas + 8 stappen van Kotter — AFAS-haalbaarheidsstudie (bijlage K).",
        "Kleurenmodel De Caluwé & Vermaak (blauw vs. groen) + GAP-analyse — verandermanagement (bijlage J).",
        "KSF/KPI + PDSA-cyclus — financiële data-analist (bijlage N).",
        "(Interactieve) waardestroommapping — OK supply chain (door Sonja Tien geprezen)."
      ]
    },
    {
      titel: "POP — leerdoelen & rode draad",
      items: [
        "Rode draad: niet te snel naar de oplossing springen; eerst luisteren, doorvragen, draagvlak opbouwen.",
        "Leerdoel 1 — Zelfstandige analyse (grotendeels behaald; volgende stap: groter/complexer project).",
        "Leerdoel 2 — Eerst de oorzaak, dan de oplossing.",
        "Leerdoel 3 — Doorvragen en schakelen (aangescherpt: formele interviews nog afmaken).",
        "Leerdoel 4 — Verantwoordelijkheid en reflectie (3x gericht feedback vragen en verwerken)."
      ]
    },
    {
      titel: "Beoordeling & vervolg",
      items: [
        "Eindevaluatie (bijlage O): ruim voldoende op alle vier onderdelen (meewerken, beroepsvaardigheden, beroepshouding, reflectie).",
        "Genoemd: planmatig werken, actief luisteren, eigen initiatief, werken met verschillende analysemethoden.",
        "Voorbeeld dat begeleiders noemen: interactieve waardestroommapping voor de OK (Sonja Tien).",
        "Vervolg: semester 'Organiseren voor de Toekomst' + minor 'Veranderen van Organisaties' (bijlage Q).",
        "Beroepsperspectief: procesadviseur, organisatieadviseur of projectmedewerker."
      ]
    }
  ],

  /* ------------------------------------------------------------------
     Algemene CGI-tips
  ------------------------------------------------------------------ */
  cgiTips: [
    "Antwoord in STARR: Situatie → Taak → Actie → Resultaat → Reflectie. De assessor wil vooral je Actie en Reflectie horen.",
    "Wees concreet: één duidelijk voorbeeld met 'ik deed…' is sterker dan algemene uitspraken met 'we/je doet meestal…'.",
    "Claim eigenaarschap: maak duidelijk wat jíj deed versus wat anderen (Joanne, Mariska, P&O) deden.",
    "Bij een doorvraag: neem even de tijd, denk hardop. 'Goede vraag, even denken' mag.",
    "Bij een kritische vraag: geef de assessor gelijk waar dat terecht is, benoem de grens eerlijk, en laat zien hoe je het mitigeerde.",
    "Onderbouw met je bewijslast: verwijs naar de bijlage (A t/m T) waar het bewijs staat.",
    "Koppel terug aan je POP en je groei — een CGI op niveau 2 draait sterk om reflectie en leervermogen.",
    "Ken je cijfers uit je hoofd (26 observaties, 215 handelingen, 49% laagcomplex, 9% voorbehouden, 5 bedden, 6–12 patiënten). Zie het spiekbriefje.",
    "Weet je iets niet zeker? Zeg dat eerlijk en vertel hoe je het zou uitzoeken — dat is sterker dan bluffen."
  ]
};

// Maak beschikbaar voor app.js
window.CGI_DATA = CGI_DATA;
