/* =====================================================================
   CGI-oefenomgeving — Portfolio Oriënterende Stage
   Mika Hillenga — Ommelander Ziekenhuis Groningen — Hanzehogeschool
   ---------------------------------------------------------------------
   Alle inhoud (vragen, modelpunten, feiten) is afgeleid uit het
   ingeleverde portfolio. Pas dit bestand gerust aan: je kunt vragen
   toevoegen, modelpunten verfijnen of feiten bijwerken.
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
     De vijf leeruitkomsten (LOL's)
  ------------------------------------------------------------------ */
  lols: [
    {
      id: "lol1",
      nummer: 1,
      naam: "Bedrijfskundig handelen",
      kleur: "#2563eb",
      kern: "Een breed vraagstuk gestructureerd en methodisch aanpakken, van probleem tot onderbouwd advies.",
      sleutelmomenten: [
        "Keuze voor de A3-methode bij het vraagstuk verkeerde-bed patiënten",
        "Meelopen op de afdeling (Gemba walk) om het vraagstuk te begrijpen",
        "Verbeterpunten prioriteren met de PICK-matrix (OK-leeninstrumentarium)"
      ],
      bewijslast: "Verdiepende opdracht (bijlage A), organisatieanalyse (bijlage H), beschrijvende opdracht procesmanagement OK (bijlage L)",
      leerdoel: "Leerdoel 1: zelfstandige analyse"
    },
    {
      id: "lol2",
      nummer: 2,
      naam: "Onderzoeken",
      kleur: "#0d9488",
      kern: "Een vraagstuk methodisch onderzoeken: data verzamelen, ordenen, kritisch beoordelen en conclusies onderbouwen.",
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
      sleutelmomenten: [
        "Feedback op het concept omzetten in een betere definitieve versie",
        "Eigen grenzen herkennen en opzoeken (meelopen OK, patiëntveiligheid)"
      ],
      bewijslast: "Verdiepende opdracht (bijlage A), feedbackformulier (bijlage B), stage-POP (bijlage F), functionerings- en evaluatieformulier (bijlage O)",
      leerdoel: "Leerdoel 2 en 4: oorzaak en reflectie"
    }
  ],

  /* ------------------------------------------------------------------
     Vraagtypes (voor filteren)
  ------------------------------------------------------------------ */
  types: {
    open:      { label: "Openingsvraag",  uitleg: "Brede startvraag — vertel je verhaal in STARR." },
    doorvraag: { label: "Doorvraag",      uitleg: "De assessor graaft dieper: 'waarom', 'hoe weet je dat', 'geef een voorbeeld'." },
    kritisch:  { label: "Kritische vraag", uitleg: "De assessor speelt advocaat van de duivel of toetst eigenaarschap." }
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
        "Drie sporen: (1) procesonderzoek + plan van aanpak, (2) observatieonderzoek, (3) functieprofiel + medezeggenschap via P&O.",
        "Uitkomst: onderbouwd voorstel — clustering van 5 bedden, hybride personele inzet, werkafspraken met escalatiecriteria.",
        "Eerlijk over de stand: pilot moet nog starten, functieprofiel en OR-route nog in bewerking."
      ]
    },
    {
      id: "l1-q2", lol: "lol1", type: "open",
      vraag: "Je koos voor de A3-methode. Waarom juist die methode, en wat leverde dat jou op?",
      modelpunten: [
        "A3 dwingt je eerst probleem en huidige situatie scherp te krijgen vóór je een doel en maatregelen bepaalt.",
        "Past bij de complexiteit van het vraagstuk en voorkomt te snel naar een oplossing springen.",
        "Methode die het bureau aandraagt én die je op de opleiding (procesmanagement) hebt geleerd — dus onderbouwde keuze.",
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
        "Alternatieven die je elders gebruikte: PDCA-cyclus, DMAIC/Lean-denken, of direct een verbeterplan zonder diagnosefase.",
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
      vraag: "Je gebruikte de PICK-matrix bij het OK-proces. Wat zou je geadviseerd hebben zónder die matrix, en wat veranderde de matrix concreet aan je advies?",
      modelpunten: [
        "Context: OK-leeninstrumentarium, 5 overdrachtsmomenten, lange doorlooptijd die vooral uit wachttijd bestaat.",
        "PICK scoort verbeterpunten op impact vs. inspanning — dwingt tot onderbouwde prioritering.",
        "Uitkomst: aanvraagtermijn vastleggen als harde systeemeis levert de meeste winst met de minste inspanning.",
        "Zonder matrix: risico om op gevoel te prioriteren of het 'grootste' probleem te pakken i.p.v. het slimste.",
        "De onderbouwing maakte het advies overtuigender richting betrokkenen (bijlage L)."
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
        "Erken de grens: afdelingsspecifieke cijfers voor 3B ontbraken; je voorstel is een pilot, juist om het in de praktijk te toetsen.",
        "Verkeerde-bed patiënten zijn een structureel probleem op meerdere verpleegafdelingen (6–12 per dag OZG-breed).",
        "Schaalbaarheid is een vervolgvraag: eerst pilot evalueren met KATA, dan pas breder.",
        "Toont onderzoekshouding: claim niet meer dan je data dragen."
      ]
    },

    /* ===================== LOL 2 ===================== */
    {
      id: "l2-q1", lol: "lol2", type: "open",
      vraag: "Vertel eens over je observatieonderzoek. Hoe heb je het opgezet en waarom op die manier?",
      modelpunten: [
        "Aanleiding: het voorstel mocht niet op aannames leunen; er was geen harde data over wat deze groep echt nodig heeft.",
        "Doel: betrouwbaar in kaart brengen welke zorghandelingen, hoe complex, en of een verzorgende ze mag uitvoeren.",
        "Keuze: gestructureerde observatie, zodat data direct uit de praktijk komt.",
        "Uitvoering: meelopen op 3A, 3B, 2B; elke handeling in een observatieschema; coderen op zorgtype, risico, bevoegdheid.",
        "Meetlat: functiebeschrijvingen OZG (Verpleegkundige I en J + ziekenverzorgende) om bevoegdheid te beoordelen.",
        "Resultaat: 26 observaties, 215 handelingen; overwegend laagcomplex; slechts 9% voorbehouden aan verpleegkundige (bijlage C)."
      ],
      koppeling: "Leerdoel 2 — eerst de oorzaak, dan de oplossing"
    },
    {
      id: "l2-q2", lol: "lol2", type: "open",
      vraag: "Hoe heb je de functiebeschrijvingen gebruikt om te bepalen of een verzorgende een handeling mag uitvoeren?",
      modelpunten: [
        "Functiebeschrijvingen van Verpleegkundige I en J en van de ziekenverzorgende als objectieve meetlat.",
        "Per handeling beoordeeld of die binnen de bevoegdheid van een verzorgende valt.",
        "Daardoor werd je oordeel controleerbaar en geen mening.",
        "Belangrijk onderscheid: verzorgende niveau 3 vs. verzorgende IG niveau 3 — bepaalt wat je mag delegeren.",
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
        "Drie rollen: coördinator, medewerker en patiënt — organisatie, werkvloer én klant.",
        "Cijfers uit het jaardocument als aanvulling op de interviews.",
        "Belangrijkste bevinding: het ziekenhuis doet veel aan duurzaamheid, maar de patiënt merkt daar weinig van.",
        "Dat verschil zag je pas door de perspectieven naast elkaar te leggen (triangulatie).",
        "Les: meerdere bronnen/rollen geven een eerlijker beeld dan alleen de organisatie bevragen (bijlage I)."
      ]
    },

    /* ===================== LOL 3 ===================== */
    {
      id: "l3-q1", lol: "lol3", type: "open",
      vraag: "Hoe heb je het brede probleem van verkeerde-bed patiënten omgezet in iets concreets en uitvoerbaars?",
      modelpunten: [
        "Brede ontwikkeling (structureel probleem op veel afdelingen, herstelplan) gekoppeld aan de interne situatie van 3B.",
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
        "Value Proposition Canvas gebruikt om de waarde (pijnpunten die het oplost) te bepalen.",
        "De acht stappen van Kotter gebruikt om de verandering te analyseren.",
        "Liet zien dat het systeem concrete pijnpunten oplost en welke succesfactoren/risico's er zijn (bijlage K).",
        "Zelfde houding bij heropening Neurologie: plan om laagcomplexe huisartsverwijzingen terug te dringen (bijlage T).",
        "Les: met VPC en Kotter onderbouw je een verbeteridee i.p.v. het alleen 'een goed idee' te noemen — dat overtuigt anderen."
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
        "Eerlijk dat je het onderscheid (adviesrecht vs. instemmingsrecht van de OR) nog niet sluitend hebt — dat is een open punt.",
        "Het is wél een randvoorwaarde voordat een pilot structureel kan worden — je hebt het risico onderkend, niet genegeerd.",
        "Je hebt de vraag belegd via de P&O-werklijn (Corien Blokzijl) i.p.v. zelf buiten je mandaat te beslissen.",
        "Volgorde die je aanhoudt: taken → competenties/diploma's → functiebeschrijving → medezeggenschap.",
        "Toont organisatiesensitiviteit: weten wat je (nog) niet weet en het bij de juiste mensen neerleggen."
      ]
    },
    {
      id: "l4-q6", lol: "lol4", type: "open",
      vraag: "Bij de supply chain op de OK werkte je samen met anderen. Wat haalde die samenwerking op dat je alleen niet had gekund?",
      modelpunten: [
        "Je kon de keten niet vanaf papier doorgronden — je had kennis nodig van mensen die hem van binnenuit kennen.",
        "Samenwerking met Harmina Fischer-Danker en Sonja Tien (hoofd OK-complexen / procesverbeteraar P&P).",
        "Samen stappen, betrokken partijen en risico's in kaart gebracht (bijlage M).",
        "Je maakte de keten zichtbaar in een procesplaat (4 artikeltypen, stappen, 5 aandachtspunten, bijlage R).",
        "Sonja noemt jouw interactieve waardestroommapping als voorbeeld dat betrokkenen meer inzicht gaf — extern bevestigd resultaat."
      ]
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
        "Herstelplan sinds eind 2024; in 2024 klein verlies (~1 ton) bij omzet van 187,4 miljoen euro.",
        "~1.500 medewerkers, waaronder ruim 120 medisch specialisten; platte structuur, korte lijnen.",
        "Drie zorgclusters: Acuut, Snijdend, Beschouwend + stafclusters (ICT, P&O, Financiën)."
      ]
    },
    {
      titel: "Het verbetertraject (3B)",
      items: [
        "Verkeerde-bed patiënten: medisch uitbehandeld, wachten op verpleeghuis/revalidatie.",
        "OZG-breed dagelijks 6–12 verkeerde-bed patiënten, verspreid over afdelingen.",
        "Op 3B lagen ze tussen reguliere patiënten, zonder vaste zone en zonder aparte taakverdeling.",
        "Voorstel: clustering van 5 bedden + hybride personele inzet + werkafspraken met escalatiecriteria.",
        "Randvoorwaarden: verpleegkundige blijft achterwacht + escalatieprotocol; functieprofiel en OR-route nog in bewerking.",
        "Opdrachtgever: Mariska Bouwman (hoofd 3B). Collega: Joanne Oelen. P&O: Corien Blokzijl."
      ]
    },
    {
      titel: "Het onderzoek (cijfers)",
      items: [
        "26 observaties op de afdelingen 3A, 3B en 2B (feb–mrt 2026).",
        "215 geregistreerde zorghandelingen, gecodeerd op zorgtype, risico en bevoegdheid.",
        "Zorg overwegend laagcomplex; ADL-zorg en mobiliteit samen bijna de helft van alle handelingen.",
        "Slechts 9% van de handelingen is voorbehouden aan een verpleegkundige.",
        "Meetlat: functiebeschrijvingen Verpleegkundige I en J + ziekenverzorgende (verzorgende niv. 3 vs. IG niv. 3)."
      ]
    },
    {
      titel: "Methoden & modellen",
      items: [
        "A3-methode (7 stappen) — gestructureerd verbetertraject.",
        "Gemba walk — meelopen op de afdeling om het echte proces te zien.",
        "PICK-matrix — prioriteren op impact vs. inspanning (OK-leeninstrumentarium).",
        "Gestructureerde observatie — data direct uit de praktijk.",
        "DESTEP, 7S-model (McKinsey), SWOT — organisatieanalyse (bijlage H).",
        "Value Proposition Canvas + 8 stappen van Kotter — AFAS-haalbaarheidsstudie.",
        "(Interactieve) waardestroommapping — OK supply chain (door Sonja Tien geprezen).",
        "KATA-methode — wekelijkse evaluatieroutine voor stapsgewijs verbeteren (bijlage P)."
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
        "Voorbeeld dat begeleiders noemen: interactieve waardestroommapping voor de OK.",
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
    "Ken je cijfers uit je hoofd (26 observaties, 215 handelingen, 9%, 5 bedden, 6–12 patiënten). Zie het spiekbriefje.",
    "Weet je iets niet zeker? Zeg dat eerlijk en vertel hoe je het zou uitzoeken — dat is sterker dan bluffen."
  ]
};

// Maak beschikbaar voor app.js
window.CGI_DATA = CGI_DATA;
