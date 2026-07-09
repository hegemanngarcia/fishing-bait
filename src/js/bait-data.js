/**
 * @fileoverview Statischer Köder-Datensatz für den Fishing Bait Advisor.
 * Alle Köder werden ausschließlich über Charakteristika beschrieben – keine Marken- oder Produktnamen.
 */

// ---------------------------------------------------------------------------
// Gültige Aufzählungswerte (Enum-Konstanten)
// ---------------------------------------------------------------------------

/** @type {string[]} Gültige Wetterwerte */
export const WEATHER_VALUES = [
  'sonnig', 'leicht bewölkt', 'bedeckt', 'Regen', 'starker Regen', 'Wind', 'Sturm'
];

/** @type {string[]} Gültige Tageszeitwerte */
export const TIME_OF_DAY_VALUES = [
  'Morgengrauen', 'Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'
];

/** @type {string[]} Gültige Strömungswerte */
export const CURRENT_VALUES = ['keine', 'schwach', 'mittel', 'stark'];

/** @type {string[]} Gültige Gewässerart-Werte */
export const WATER_TYPE_VALUES = ['Fluss', 'See', 'Teich', 'Stausee', 'Meer', 'Brackwasser', 'Wehr', 'Bergsee', 'Gebirgsbach'];

/** @type {string[]} Gültige Tiefenwerte */
export const DEPTH_VALUES = ['Oberfläche', 'Mittelwasser', 'Grund'];

/** @type {string[]} Gültige Jahreszeiten-Werte */
export const SEASON_VALUES = ['Frühling', 'Sommer', 'Herbst', 'Winter'];

/** @type {string[]} Gültige Fischart-Werte */
export const FISH_TYPE_VALUES = [
  'Forelle', 'Barsch', 'Hecht', 'Karpfen', 'Zander', 'Aal',
  'Brachse', 'Schleie', 'Wels', 'Rotauge'
];

// ---------------------------------------------------------------------------
// JSDoc-Typdefinitionen
// ---------------------------------------------------------------------------

/**
 * @typedef {'sonnig'|'leicht bewölkt'|'bedeckt'|'Regen'|'starker Regen'|'Wind'|'Sturm'} WeatherValue
 */

/**
 * @typedef {'Morgengrauen'|'Morgen'|'Mittag'|'Nachmittag'|'Abend'|'Nacht'} TimeOfDayValue
 */

/**
 * @typedef {'keine'|'schwach'|'mittel'|'stark'} CurrentValue
 */

/**
 * @typedef {'Fluss'|'See'|'Teich'|'Stausee'|'Meer'|'Brackwasser'|'Wehr'|'Bergsee'|'Gebirgsbach'} WaterTypeValue
 */

/**
 * @typedef {'Oberfläche'|'Mittelwasser'|'Grund'} DepthValue
 */

/**
 * @typedef {'Frühling'|'Sommer'|'Herbst'|'Winter'} SeasonValue
 */

/**
 * @typedef {'Forelle'|'Barsch'|'Hecht'|'Karpfen'|'Zander'|'Aal'|'Brachse'|'Schleie'|'Wels'|'Rotauge'} FishTypeValue
 */

/**
 * @typedef {'hell'|'dunkel'|'naturfarben'|'auffällig'|'zweifarbig'} FarbeValue
 */

/**
 * @typedef {'langsam'|'mittel'|'schnell'|'taumelnd'|'pulsierend'|'sinkend-langsam'} AktionValue
 */

/**
 * Aktives Filterprofil mit allen wählbaren Bedingungen.
 * @typedef {Object} FilterProfile
 * @property {WeatherValue|null} wetter
 * @property {TimeOfDayValue|null} tageszeit
 * @property {CurrentValue|null} stroemung
 * @property {WaterTypeValue|null} gewaesserart
 * @property {DepthValue|null} tiefe
 * @property {SeasonValue|null} jahreszeit
 * @property {FishTypeValue|null} fischart
 * @property {number|null} wassertemperatur - 0–35 °C, null = deaktiviert
 */

/**
 * Fachbegriff mit Definition.
 * @typedef {Object} GlossaryTerm
 * @property {string} term
 * @property {string} definition - max. 2 Sätze
 */

/**
 * Statischer Datensatz-Eintrag für einen Ködertyp.
 * @typedef {Object} BaitEntry
 * @property {string} id
 * @property {string} typBezeichnung
 * @property {string} typ
 * @property {'klein'|'mittel'|'groß'} groesse
 * @property {FarbeValue} farbe
 * @property {'leicht'|'mittel'|'schwer'} gewicht
 * @property {AktionValue} aktion
 * @property {'Oberflaechenkoeder'|'Tiefenkoeder'|'Grundmontage-Koeder'|'Allrounder'} klasse
 * @property {string} montage
 * @property {string[]} montageSchritte
 * @property {string} beschreibung
 * @property {string} angeltipp
 * @property {GlossaryTerm[]} fachbegriffe
 * @property {WeatherValue[]} wetter
 * @property {TimeOfDayValue[]} tageszeit
 * @property {CurrentValue[]} stroemung
 * @property {WaterTypeValue[]} gewaesserart
 * @property {DepthValue[]} tiefe
 * @property {SeasonValue[]} jahreszeit
 * @property {FishTypeValue[]} fischart
 * @property {number|null} tempMin
 * @property {number|null} tempMax
 * @property {number} basisScore
 */

/**
 * Berechnete Empfehlung mit Score und Kurzerkl­ärung.
 * @typedef {Object} Recommendation
 * @property {BaitEntry} bait
 * @property {number} score
 * @property {string} kurzerklaerung
 * @property {{typBezeichnung:string, typ:string, groesse:string, farbe:FarbeValue, gewicht:string, aktion:AktionValue, klasse:string}} charakteristika
 */

/**
 * Im localStorage gespeichertes Filterprofil.
 * @typedef {Object} SavedProfile
 * @property {string} id - UUID
 * @property {string} name - 1–50 Zeichen
 * @property {FilterProfile} filters
 * @property {string} savedAt - ISO-8601
 */

/**
 * Warnhinweis mit Auslöser-ID und Text.
 * @typedef {Object} Warning
 * @property {string} id
 * @property {string} text
 * @property {boolean} dismissed
 */

// ---------------------------------------------------------------------------
// Statischer Köder-Datensatz
// ---------------------------------------------------------------------------

/**
 * Vollständiger statischer Köder-Datensatz.
 * Keine Marken- oder Produktnamen – ausschließlich Charakteristika-Beschreibungen.
 * @type {BaitEntry[]}
 */
export const BAIT_DATASET = [
  // =========================================================================
  // Oberflächenköder
  // =========================================================================
  {
    id: 'bait-001',
    typBezeichnung: 'Kleiner hellglänzender Oberflächenpopper',
    typ: 'Popper',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Oberflaechenkoeder',
    montage: 'Direkte Schnurmontage ohne Vorfach',
    montageSchritte: [
      'Hakensicherung am Popper prüfen.',
      'Köder mit einem Karabinerwirbel an die Hauptschnur klippen.',
      'Schnurführungsring auf Leichtigkeit testen.'
    ],
    beschreibung: 'Leichter Kunststoff-Popper mit konkavem Maul, der beim Einzug Wasserfontänen erzeugt. Ideal für ruhige Oberflächen an warmen Morgen.',
    angeltipp: 'Kurze, ruckartige Einzüge wechseln mit kurzen Pausen, um das Plätschern zu betonen.',
    fachbegriffe: [
      { term: 'Popper', definition: 'Oberflächenköder mit konkaver Front, der beim Einzug Geräusche und Wasserturbulenz erzeugt.' },
      { term: 'Walk-the-Dog', definition: 'Technik, bei der der Köder durch Rutenspitzenbewegungen zickzackartig über die Oberfläche geführt wird.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Teich', 'Stausee'],
    tiefe: ['Oberfläche'],
    jahreszeit: ['Sommer', 'Frühling'],
    fischart: ['Barsch', 'Hecht'],
    tempMin: 18,
    tempMax: 35,
    basisScore: 7
  },
  {
    id: 'bait-002',
    typBezeichnung: 'Mittlerer zweifarbiger Oberflächenwobbler',
    typ: 'Wobbler',
    groesse: 'mittel',
    farbe: 'zweifarbig',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Oberflaechenkoeder',
    montage: 'Schwebemontage mit Stahlvorfach',
    montageSchritte: [
      'Stahlvorfach (20–30 cm) mit Karabiner an der Hauptschnur befestigen.',
      'Wobbler über Schnappkarabiner einhängen.',
      'Lauftiefe durch Rutenstellung beim Einzug kontrollieren.'
    ],
    beschreibung: 'Schwimmender Wobbler mit zweifarbiger Lackierung, der dicht unter der Oberfläche schaukelt. Wird flach über Krautbänke geführt.',
    angeltipp: 'Sehr langsamer Einzug mit gelegentlichen Stopps lässt den Wobbler auf der Stelle taumeln – besonders effektiv für Hecht.',
    fachbegriffe: [
      { term: 'Schwebemontage', definition: 'Aufbau, bei dem der Köder knapp unter der Wasseroberfläche schwebt.' },
      { term: 'Stahlvorfach', definition: 'Biss-resistentes Vorfach aus dünnem Stahldraht oder Stahlseil zum Schutz vor scharfen Hechtgebissen.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Abend', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Teich', 'Stausee', 'Fluss'],
    tiefe: ['Oberfläche'],
    jahreszeit: ['Sommer', 'Frühling', 'Herbst'],
    fischart: ['Hecht', 'Barsch'],
    tempMin: 15,
    tempMax: 35,
    basisScore: 7
  },
  {
    id: 'bait-003',
    typBezeichnung: 'Großer auffälliger Oberflächenstick',
    typ: 'Stickbait',
    groesse: 'groß',
    farbe: 'auffällig',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Oberflaechenkoeder',
    montage: 'Stahlvorfach-Montage mit Drillinge',
    montageSchritte: [
      'Stickbait-Körper auf Drillinge prüfen.',
      'Karabiner an Öse schrauben.',
      'Stahlvorfach einhängen und auf Verdrehen kontrollieren.'
    ],
    beschreibung: 'Großer, torpedoförmiger Oberflächenköder in auffälliger Farbe. Durch Walk-the-Dog-Technik wird er seitlich über die Oberfläche gelenkt.',
    angeltipp: 'Rutenspitze beim Einzug nach unten halten und kleine rhythmische Zupfer ausführen, um die Zickzackbewegung zu aktivieren.',
    fachbegriffe: [
      { term: 'Stickbait', definition: 'Schlanker, stiftförmiger Oberflächenköder ohne eigene Aktion, der durch die Rutentechnik bewegt wird.' },
      { term: 'Drillinge', definition: 'Dreifachhaken, der an Front und Heck von Kunstködern befestigt wird, um die Hakquote zu erhöhen.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine'],
    gewaesserart: ['See', 'Stausee'],
    tiefe: ['Oberfläche'],
    jahreszeit: ['Sommer'],
    fischart: ['Hecht', 'Wels'],
    tempMin: 20,
    tempMax: 35,
    basisScore: 6
  },
  // =========================================================================
  // Tiefenköder
  // =========================================================================
  {
    id: 'bait-004',
    typBezeichnung: 'Kleiner silberner Spinner',
    typ: 'Spinner',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage',
    montageSchritte: [
      'Spinner mit Palstek-Knoten an die Hauptschnur knoten.',
      'Sicherungsöse auf festen Sitz prüfen.',
      'Kurz ins Wasser halten und Rotation der Blattschaufel kontrollieren.'
    ],
    beschreibung: 'Klassischer Rotor-Spinner mit kleiner Silberblattschaufel. Erzeugt starke Vibrationen und Lichtreflexe, ideal für klares Wasser.',
    angeltipp: 'Gleichmäßiger schneller Einzug im Mittelwasser; in Strömung quer zur Fließrichtung einwerfen.',
    fachbegriffe: [
      { term: 'Spinner', definition: 'Kunstköder mit rotierender Blattschaufel, die Lichtreflexe und Vibrationen erzeugt.' },
      { term: 'Palstek', definition: 'Fester, nicht zuziehender Knoten zur sicheren Verbindung von Schnur und Öse.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt', 'Wind'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See', 'Teich', 'Wehr'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Forelle', 'Barsch', 'Hecht'],
    tempMin: 8,
    tempMax: 25,
    basisScore: 8
  },
  {
    id: 'bait-005',
    typBezeichnung: 'Mittlerer naturgetreuer Tauchwobbler',
    typ: 'Wobbler',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Stahlvorfach-Montage mit Karabiner',
    montageSchritte: [
      'Stahlvorfach (25 cm) über Schlaufen-Knoten an Hauptschnur befestigen.',
      'Wobbler über Karabinerwirbel einhängen.',
      'Lauftiefe testen: Schaufelgröße und Einzugstempo bestimmen die Tiefe.'
    ],
    beschreibung: 'Naturgetreuer Wobbler mit tiefer Laufschaufel, der 2–4 m Tiefe erreicht. Nachbildung eines kleinen Weißfisches mit lebendigem Rollgang.',
    angeltipp: 'Einzugtempo variieren: kurze Pausen lassen den Wobbler auftreiben, was Raubfische zum Angriff provoziert.',
    fachbegriffe: [
      { term: 'Laufschaufel', definition: 'Plastik- oder Metalllippe am Köder, die Wasserwiderstand erzeugt und die Tauchtiefe bestimmt.' },
      { term: 'Rollgang', definition: 'Seitliches Schaukeln des Köders während der Führung, das einen verletzten Fisch imitiert.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen', 'Wind'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['See', 'Fluss', 'Stausee'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Herbst', 'Winter'],
    fischart: ['Hecht', 'Zander', 'Barsch'],
    tempMin: 5,
    tempMax: 20,
    basisScore: 8
  },
  {
    id: 'bait-006',
    typBezeichnung: 'Großer dunkler Gummifisch am Jighaken',
    typ: 'Gummifisch',
    groesse: 'groß',
    farbe: 'dunkel',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Texas-Rig oder Jig-Kopf-Montage',
    montageSchritte: [
      'Jig-Kopf (10–20 g) passend zur Wassertiefe wählen.',
      'Gummifisch mittig auf den Jighaken aufziehen.',
      'Hakenspitze leicht im Gummi verstecken (Texas-Rig) oder freilassen.'
    ],
    beschreibung: 'Großer dunkler Gummifisch, der am Jighaken eine realistische Schwanzbewegung ausführt. Effektiv in der Dämmerung und bei trübem Wasser.',
    angeltipp: 'Grundkontakt herstellen: Köder zum Grund fallen lassen, dann mit Rucken und Pausen nach oben führen.',
    fachbegriffe: [
      { term: 'Texas-Rig', definition: 'Fischhaken-Montage, bei der die Hakenspitze im Gummikörper verborgen wird, um hakenfrei durch Kraut zu führen.' },
      { term: 'Jig-Kopf', definition: 'Bleikopfhaken, der dem Köder Gewicht verleiht und eine pulsierende Auf-Ab-Bewegung ermöglicht.' }
    ],
    wetter: ['bedeckt', 'Regen', 'Wind', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Fluss', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter', 'Frühling'],
    fischart: ['Hecht', 'Zander', 'Wels'],
    tempMin: 4,
    tempMax: 18,
    basisScore: 8
  },
  {
    id: 'bait-007',
    typBezeichnung: 'Kleiner auffälliger Jig',
    typ: 'Jig',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Tiefenkoeder',
    montage: 'Drop-Shot-Montage',
    montageSchritte: [
      'Drop-Shot-Haken 30–50 cm über dem Blei mit Palomar-Knoten binden.',
      'Kleinen Gummiwurm oder Gummifisch waagerecht auf den Haken stecken.',
      'Bleigewicht (5–10 g) ans Schnurende knoten.'
    ],
    beschreibung: 'Kleiner auffälliger Jig für die Drop-Shot-Methode. Hängt waagerecht auf Grundnähe und verleitet Barsche durch minimale Bewegungen.',
    angeltipp: 'Rute senkrecht über dem Köder halten und nur leicht zucken – Bewegung ist minimal, der Köder bleibt quasi auf der Stelle.',
    fachbegriffe: [
      { term: 'Drop-Shot', definition: 'Montagetechnik, bei der der Haken mit Köder oberhalb des Bodenbleis hängt und nahezu ortsfest präsentiert wird.' },
      { term: 'Palomar-Knoten', definition: 'Sehr stabiler Knoten für die Verbindung von Haken oder Wirbel mit geflochtener Schnur.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Teich', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Sommer', 'Frühling', 'Herbst'],
    fischart: ['Barsch', 'Zander', 'Forelle'],
    tempMin: 8,
    tempMax: 28,
    basisScore: 7
  },
  {
    id: 'bait-008',
    typBezeichnung: 'Mittlerer silberner Blinker',
    typ: 'Blinker',
    groesse: 'mittel',
    farbe: 'hell',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage mit Wirbel',
    montageSchritte: [
      'Dreiwirbel an der Hauptschnur befestigen.',
      'Blinker über Karabiner einhängen.',
      'Schnurdrall nach dem Einwerfen durch kurzes Abtauchen kontrollieren.'
    ],
    beschreibung: 'Klassischer ovaler Blinker aus poliertem Metall. Taumelt beim Absinken und beim Einzug und löst durch Blitzreflexe Reflexbisse aus.',
    angeltipp: 'Blinker vertikal absinken lassen und beim Absinken leichte Rucke einbauen – effektiv bei Zander in der Tiefe.',
    fachbegriffe: [
      { term: 'Blinker', definition: 'Metallköder, der beim Absinken und Einzug taumelt und durch Lichtreflexe Raubfische anlockt.' },
      { term: 'Reflexbiss', definition: 'Spontaner Angriff eines Raubfisches auf einen Köder, ausgelöst durch Reiz ohne echten Hunger.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'Wind'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['See', 'Fluss', 'Stausee', 'Meer'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter', 'Frühling'],
    fischart: ['Zander', 'Hecht', 'Barsch', 'Forelle'],
    tempMin: 4,
    tempMax: 20,
    basisScore: 7
  },
  {
    id: 'bait-009',
    typBezeichnung: 'Großer naturgetreuer Wobbler für die Tiefe',
    typ: 'Wobbler',
    groesse: 'groß',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Stahlvorfach mit Karabinerwirbel',
    montageSchritte: [
      'Schweres Stahlvorfach (40 cm, 15 kg) befestigen.',
      'Tiefen-Wobbler über Karabiner einhängen.',
      'Tauchtiefe durch Variieren des Einzugstempos anpassen.'
    ],
    beschreibung: 'Großer, schwer bauender Tauch-Wobbler für Tiefen von 4–8 m. Ideal für Zander und Hecht in großen Seen und Stauseen.',
    angeltipp: 'Langsamer bis mittlerer Einzug mit langen Pausen, in denen der Wobbler auftreibt und langsam zur Seite kippt.',
    fachbegriffe: [
      { term: 'Tauchwobbler', definition: 'Wobbler mit ausgeprägter Laufschaufel, der beim Einzug große Tiefen erreicht.' },
      { term: 'Auftriebsphase', definition: 'Phase während einer Einzugspause, in der der Köder langsam zur Oberfläche aufsteigt.' }
    ],
    wetter: ['bedeckt', 'Regen', 'Wind', 'starker Regen'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter'],
    fischart: ['Zander', 'Hecht'],
    tempMin: null,
    tempMax: 15,
    basisScore: 7
  },
  // =========================================================================
  // Grundmontage-Köder
  // =========================================================================
  {
    id: 'bait-010',
    typBezeichnung: 'Naturwurm auf klassischer Grundmontage',
    typ: 'Wurm',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Einfache Grundmontage mit Laufblei',
    montageSchritte: [
      'Laufblei (20–50 g je Strömung) auf die Hauptschnur fädeln.',
      'Stopper-Perle hinter dem Blei aufziehen.',
      'Wirbel knoten, 50 cm Nylonvorfach (0,25 mm) anhängen.',
      'Hakenöse binden (Gr. 8–12), Wurm vollständig aufziehen.'
    ],
    beschreibung: 'Natürlicher Regenwurm auf einer einfachen Grundmontage. Der Köder liegt am Grund und wird durch Wasserbewegung lebendig präsentiert.',
    angeltipp: 'Schnur straff halten und auf leichte Zupfer achten; Karpfen und Brassen nehmen den Wurm oft sehr zögerlich.',
    fachbegriffe: [
      { term: 'Laufblei', definition: 'Blei, das auf der Schnur läuft, sodass der Fisch die Leine ziehen kann, ohne sofort Widerstand zu spüren.' },
      { term: 'Vorfach', definition: 'Kurzes Schnurstück zwischen Hauptschnur und Haken, oft dünner oder biss-resistenter.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt', 'sonnig'],
    tageszeit: ['Morgen', 'Morgengrauen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See', 'Teich', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
    fischart: ['Karpfen', 'Brachse', 'Schleie', 'Rotauge'],
    tempMin: null,
    tempMax: null,
    basisScore: 6
  },
  {
    id: 'bait-011',
    typBezeichnung: 'Großer Boilie auf Karpfenmontage',
    typ: 'Boilie',
    groesse: 'groß',
    farbe: 'auffällig',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Hair-Rig auf Karpfenmontage',
    montageSchritte: [
      'Karpfenhaken (Gr. 4–8) mit Hair-Rig-Knoten versehen.',
      'Boilie über eine Boilienadel auf das Hair auffädeln.',
      'Stopper durch das Hair schieben.',
      'Bleikorb (60–120 g) an die Hauptschnur, Sicherheitsklip verwenden.'
    ],
    beschreibung: 'Runder Kunststoff-Köder aus Teigmasse mit intensivem Lockstoff-Aroma. Liegt am Grund und lockt Karpfen über weite Distanzen.',
    angeltipp: 'Futterstelle mit gebrochenen Boilies vorher anfüttern, Köder-Boilie muss sich von Futterballs abheben.',
    fachbegriffe: [
      { term: 'Boilie', definition: 'Runder, gekochter Teigball aus Fischmehl, Eiern und Lockstoff-Aromen, klassischer Karpfenköder.' },
      { term: 'Hair-Rig', definition: 'Montage, bei der der Köder an einem kurzen Schnurstück hinter dem Hakenbogen hängt, statt direkt am Haken.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Teich', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Frühling', 'Herbst'],
    fischart: ['Karpfen', 'Schleie'],
    tempMin: 10,
    tempMax: 30,
    basisScore: 8
  },
  {
    id: 'bait-012',
    typBezeichnung: 'Kleines Pellet auf Grundmontage',
    typ: 'Pellet',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Einfache Posenmontage am Grund',
    montageSchritte: [
      'Pose mit Stopper auf die Schnur schieben.',
      'Tiefstopper 5 cm über dem Grund setzen.',
      'Kleines Blei (5 g) als Pendel darunter.',
      'Pellet auf Hair-Rig am feinen Haken (Gr. 14–16) montieren.'
    ],
    beschreibung: 'Kommerzielles Forellen- oder Karpfenpellet, das am Grund langsam aufweicht und Duftstoffe abgibt. Sehr effektiv bei langsam fressendem Fisch.',
    angeltipp: 'Pellet über Nacht wässern, damit es am Haken nicht sofort zerfällt. Kürzere Vorfachlängen an stärkerem Strömungen verwenden.',
    fachbegriffe: [
      { term: 'Pellet', definition: 'Gepresster Futterbrocken aus Fischmehl oder Getreideprodukten als Köder oder Futter.' },
      { term: 'Pendelmontage', definition: 'Montage mit Blei unterhalb des Hakens, die selbsthakendes Verhalten beim Anbeißen fördert.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Nachmittag', 'Nacht'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Grund'],
    jahreszeit: ['Winter', 'Frühling'],
    fischart: ['Karpfen', 'Rotauge', 'Brachse'],
    tempMin: null,
    tempMax: 12,
    basisScore: 5
  },
  {
    id: 'bait-013',
    typBezeichnung: 'Aalwurm auf Schleifmontage',
    typ: 'Wurm',
    groesse: 'groß',
    farbe: 'dunkel',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Schleifmontage mit festem Blei',
    montageSchritte: [
      'Festes Birnenblei (30–60 g) ans Schnurende knoten.',
      '50 cm starkes Nylon-Vorfach (0,35 mm) am Blei befestigen.',
      'Zwei-Haken-Rig aufbauen: Haken 1 am Kopf, Haken 2 in der Mitte des Wurms.',
      'Großen dunklen Wurm auf beide Haken aufziehen.'
    ],
    beschreibung: 'Dunkler, dicker Tauwurm auf einer Schleifmontage am Gewässergrund. Besonders effektiv für Aale, die nachtaktiv nach Beute suchen.',
    angeltipp: 'Am besten bei Einbruch der Dunkelheit auslegen. Schnur straff zum Bisssignal, Aale schlucken oft tief durch.',
    fachbegriffe: [
      { term: 'Schleifmontage', definition: 'Grundmontage mit fest montiertem Blei, bei der die Schnur am Grund liegt.' },
      { term: 'Zwei-Haken-Rig', definition: 'Hakenaufbau mit zwei Haken auf einem Vorfach, um lange Köder vollständig zu befestigen.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Aal'],
    tempMin: 14,
    tempMax: 28,
    basisScore: 8
  },
  {
    id: 'bait-014',
    typBezeichnung: 'Maden-Büschel auf Feedermontage',
    typ: 'Maden',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Feeder-Montage mit Futterbehälter',
    montageSchritte: [
      'Feeder-Korb mit Groundbait und Maden füllen.',
      'Feederkorb auf Laufmontage an die Hauptschnur.',
      'Kurzes Vorfach (15–30 cm, 0,16 mm) mit Hakenöse (Gr. 16–18) anhängen.',
      '3–5 Maden auf den Haken fädeln.'
    ],
    beschreibung: 'Lebende Schmeißfliegenlarven (Maden) auf einer Feeder-Montage. Der Futterbehälter lockt Weißfische an, die dann die Köder-Maden nehmen.',
    angeltipp: 'Lockfutter und Köder müssen zusammenpassen: gleiche Maden im Feeder wie am Haken. Bei Kälte die Maden vorher wärmen.',
    fachbegriffe: [
      { term: 'Feeder-Montage', definition: 'Grundmontage mit Futterbehälter (Feederkorb), der beim Aufprall Lockstoff und Futter abgibt.' },
      { term: 'Groundbait', definition: 'Eingemischtes Lockfutter, das durch Wasser zerfällt und Geruch und Partikel ins Wasser abgibt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen', 'sonnig'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See', 'Teich', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Rotauge', 'Brachse', 'Schleie', 'Karpfen', 'Aal'],
    tempMin: 8,
    tempMax: null,
    basisScore: 6
  },
  {
    id: 'bait-015',
    typBezeichnung: 'Käse-Teig-Kugel auf Grundhaken',
    typ: 'Teig',
    groesse: 'mittel',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Einfache Grundhaken-Montage',
    montageSchritte: [
      'Haken (Gr. 8–10) direkt an Nylon-Vorfach (0,25 mm) binden.',
      'Laufblei (30 g) mit Stopper auf Hauptschnur.',
      'Teigkugel (haselnussgroß) fest um Haken drücken.',
      'Haken-Spitze leicht aus dem Teig ragen lassen.'
    ],
    beschreibung: 'Selbst gemischter Teig aus Mehl, Käse und Wasser in intensiver gelber Farbe. Starkes Aroma lockt Schleien und Karpfen auch bei trübem Wasser.',
    angeltipp: 'Teig fest aber nicht zu hart formen – der Köder soll beim Anbeißen nachgeben. An fressaktiven Stellen wie Wasserpflanzen-Rändern auswerfen.',
    fachbegriffe: [
      { term: 'Pastenköder', definition: 'Köder aus einer Teig- oder Pastenmasse, der sich durch Duftstoffe langsam im Wasser auflöst.' },
      { term: 'Lokomotionshaken', definition: 'Einzel-Haken mit großer Öse, geeignet für weiche Köder wie Teig oder Mais.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Teich', 'See', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Schleie', 'Karpfen', 'Wels'],
    tempMin: 12,
    tempMax: 28,
    basisScore: 5
  },
  // =========================================================================
  // Allrounder
  // =========================================================================
  {
    id: 'bait-016',
    typBezeichnung: 'Mittlerer Gummiwurm auf Dropshot',
    typ: 'Gummiwurm',
    groesse: 'mittel',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'pulsierend',
    klasse: 'Allrounder',
    montage: 'Drop-Shot-Montage',
    montageSchritte: [
      'Haken (Gr. 4) über Palomar-Knoten 30 cm über Blei binden.',
      'Gummiwurm mittig durch den Haken stechen (Nose-Hook).',
      'Blei (7 g) am Schnurende befestigen.',
      'Rute senkrecht halten, minimal bewegen.'
    ],
    beschreibung: 'Farbig leuchtender Gummiwurm in der Drop-Shot-Montage. Funktioniert in allen Wassertiefen und für viele Zielfische – vom Barsch bis zur Schleie.',
    angeltipp: 'Absetzen lassen bis das Blei den Grund berührt, dann nur feine Zuckbewegungen mit der Rutenspitze.',
    fachbegriffe: [
      { term: 'Nose-Hook', definition: 'Hakmethode, bei der der Gummiköder am vorderen Ende waagerecht auf dem Haken sitzt.' },
      { term: 'Drop-Shot', definition: 'Montagetechnik, bei der der Haken mit Köder oberhalb des Bodenbleis hängt und nahezu ortsfest präsentiert wird.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['See', 'Teich', 'Fluss', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Barsch', 'Zander', 'Schleie', 'Forelle'],
    tempMin: 8,
    tempMax: null,
    basisScore: 7
  },
  {
    id: 'bait-017',
    typBezeichnung: 'Kleiner naturgetreuer Spinner-Bait',
    typ: 'Spinnerbait',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'mittel',
    klasse: 'Allrounder',
    montage: 'Direkte Schnurmontage',
    montageSchritte: [
      'Spinnerbait direkt an die Hauptschnur knoten (Improved Clinch Knot).',
      'Führungsgeschwindigkeit so wählen, dass die Blattschaufel dreht.',
      'Führungshöhe variieren zwischen Oberfläche und Mittelwasser.'
    ],
    beschreibung: 'Kompakter Spinnerbait mit Bleikörper und rotierender Blattschaufel über einem Gummirock. Hakfrei durch Kraut und Äste führbar.',
    angeltipp: 'Ideal für Bereiche mit Wasserpflanzen und Totholz – durch den nach oben zeigenden Haken bleiben weniger Hänger.',
    fachbegriffe: [
      { term: 'Spinnerbait', definition: 'Kunstköder mit einer oder mehreren Blattschaufeln, einem Bleikörper und einem Sicherheitsnadelrahmen.' },
      { term: 'Gummirock', definition: 'Gummi-Reifenstreifen am Hakenkörper, der eine Fischschuppen-ähnliche Silhouette erzeugt.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt', 'Wind'],
    tageszeit: ['Morgen', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['See', 'Teich', 'Fluss', 'Stausee'],
    tiefe: ['Oberfläche', 'Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Barsch', 'Hecht', 'Zander'],
    tempMin: 10,
    tempMax: 28,
    basisScore: 7
  },
  {
    id: 'bait-018',
    typBezeichnung: 'Mittlerer zweifarbiger Wobblerr für alle Tiefen',
    typ: 'Wobbler',
    groesse: 'mittel',
    farbe: 'zweifarbig',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Allrounder',
    montage: 'Wirbelmontage ohne Vorfach',
    montageSchritte: [
      'Dreiwirbel (Gr. 10) an die Hauptschnur knoten.',
      'Wobbler über Karabiner einhängen.',
      'Kein Stahl-Vorfach nötig – für alle Zielarten außer Hecht geeignet.'
    ],
    beschreibung: 'Vielseitiger Wobbler mit mittlerem Tiefgang (1–3 m) in zweifarbiger Lackierung. Geeignet für verschiedene Gewässertypen und Jahreszeiten.',
    angeltipp: 'Bei trübem Wasser intensivere zweifarbige Kontrast-Varianten wählen. In klarem Wasser gedecktere Farbtöne bevorzugen.',
    fachbegriffe: [
      { term: 'Dreiwirbel', definition: 'Dreifach-Verbindungswirbel, der Schnurverdrehungen verhindert und Spurwechsel beim Einzug ermöglicht.' },
      { term: 'Floatingwobbler', definition: 'Wobbler, der im Ruhezustand an der Oberfläche schwimmt und beim Einzug abtaucht.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen', 'Wind'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See', 'Teich', 'Stausee'],
    tiefe: ['Oberfläche', 'Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
    fischart: ['Forelle', 'Barsch', 'Zander', 'Rotauge'],
    tempMin: 6,
    tempMax: null,
    basisScore: 6
  },
  {
    id: 'bait-019',
    typBezeichnung: 'Kleiner roter Jig auf Pose',
    typ: 'Jig',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Allrounder',
    montage: 'Posenmontage mit Schiebpose',
    montageSchritte: [
      'Schiebpose mit Posenstopper auf die Hauptschnur fädeln.',
      'Tiefenstopper 40 cm über Gewässersohle setzen.',
      'Kleines Blei (3 g) als Balancer montieren.',
      'Kleinen Jig an feinem Hakenösen-Knoten befestigen.'
    ],
    beschreibung: 'Kleiner leuchtend roter Jig unter der Pose. Sinkt langsam ab und bietet Raubfischen ein einfaches Ziel. Für Barsch und Forelle ideal.',
    angeltipp: 'Pose ruhig treiben lassen, nur bei deutlichem Einzug anschlagen. Absenktempo des Jigs durch das Bleigewicht anpassen.',
    fachbegriffe: [
      { term: 'Schiebpose', definition: 'Pose, die auf der Schnur gleitet und durch einen Stopper auf die gewünschte Tiefe eingestellt wird.' },
      { term: 'Balancer', definition: 'Kleines Bleigewicht am Köder oder der Schnur, das die Balance und das Absinkverhalten reguliert.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Oberfläche', 'Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer'],
    fischart: ['Barsch', 'Forelle', 'Rotauge'],
    tempMin: 10,
    tempMax: null,
    basisScore: 6
  },
  {
    id: 'bait-020',
    typBezeichnung: 'Großer dunkler Gummifisch als Schwimmköder',
    typ: 'Gummifisch',
    groesse: 'groß',
    farbe: 'dunkel',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Allrounder',
    montage: 'Wacky-Rig',
    montageSchritte: [
      'Haken (Gr. 1–1/0) mittig durch den Gummifisch stechen.',
      'Optional: O-Ring um den Köder, Haken durch den O-Ring ziehen.',
      'Ohne Blei oder mit leichtem Offset-Jighaken verwenden.',
      'Führung: freies Absinken mit gelegentlichen Rucken.'
    ],
    beschreibung: 'Großer dunkler Gummifisch in der Wacky-Rig-Montage. Durch das mittlere Aufstecken wackeln beide Enden beim Absinken – verführerisch für größere Raubfische.',
    angeltipp: 'Köder möglichst natürlich frei absinken lassen ohne Einzug – der natürliche Fall ist die eigentliche Aktion.',
    fachbegriffe: [
      { term: 'Wacky-Rig', definition: 'Montage, bei der der Haken mittig durch den Köder gestochen wird, sodass beide Enden frei wackeln.' },
      { term: 'O-Ring', definition: 'Gummiring um den Köder, der beim Wacky-Rig das Reißen des Gummimaterials verhindert.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Teich', 'Stausee'],
    tiefe: ['Oberfläche', 'Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Hecht', 'Barsch', 'Wels', 'Zander'],
    tempMin: 12,
    tempMax: null,
    basisScore: 7
  },
  // =========================================================================
  // Weitere Einträge für vollständige Abdeckung aller Fischarten
  // =========================================================================
  {
    id: 'bait-021',
    typBezeichnung: 'Forellen-Powerbait auf Einhängemontage',
    typ: 'Kunstteig',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Schwebemontage mit Einhängehaken',
    montageSchritte: [
      'Einhängehaken (Gr. 12–14) mit Schnur verbinden.',
      'Kleines Laufblei (10 g) auf Hauptschnur, Stopper dahinter.',
      '20 cm Nylonvorfach (0,20 mm) anhängen.',
      'Kleine Kugel Kunstteig fest um den Haken drücken.'
    ],
    beschreibung: 'Schwimmfähiger Kunstteig in leuchtenden Farben, der durch sein geringeres spezifisches Gewicht kurz über dem Grund schwebt und Forellen anlockt.',
    angeltipp: 'An gut mit Sauerstoff versorgten Stellen einsetzen, z.B. unterhalb von Wehren oder an Zuflüssen.',
    fachbegriffe: [
      { term: 'Kunstteig', definition: 'Weicher Kunststoffköder mit Lockstoff-Aroma, der wie Teig geformt und an den Haken gedrückt wird.' },
      { term: 'Einhängehaken', definition: 'Haken mit langer Schenkelöse, speziell für weiche Köder wie Teig oder Pellets.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Grund'],
    jahreszeit: ['Frühling', 'Winter', 'Herbst'],
    fischart: ['Forelle'],
    tempMin: null,
    tempMax: 18,
    basisScore: 7
  },
  {
    id: 'bait-022',
    typBezeichnung: 'Mittlerer Gummikrabbe auf Carolina-Rig',
    typ: 'Gummikrabbe',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Carolina-Rig',
    montageSchritte: [
      'Bullet-Blei (14 g) auf die Hauptschnur.',
      'Perle und Wirbel dahinter knoten.',
      '40–60 cm Fluorocarbon-Vorfach (0,30 mm) anhängen.',
      'Gummikrabbe auf offset-Haken (Gr. 2/0) in Texas-Stil aufziehen.'
    ],
    beschreibung: 'Naturgetreue Gummikrabbe auf dem Carolina-Rig für Grundnähe. Das Blei liegt am Grund, der Köder bewegt sich frei darüber – ideal für Wels und Karpfen.',
    angeltipp: 'Langsam über den Grund schleifen und gelegentlich stoppen. Welse wittern die Krabbe durch Geruchssinn aus weiter Entfernung.',
    fachbegriffe: [
      { term: 'Carolina-Rig', definition: 'Grundmontage, bei der das Blei 40–60 cm vor dem Köder auf der Hauptschnur liegt.' },
      { term: 'Fluorocarbon', definition: 'Nahezu unsichtbares, abriebfestes Schnurmaterial mit ähnlichem Brechungsindex wie Wasser.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Wels', 'Karpfen'],
    tempMin: 16,
    tempMax: null,
    basisScore: 6
  },
  {
    id: 'bait-023',
    typBezeichnung: 'Großer heller Zanderstreamer',
    typ: 'Streamer',
    groesse: 'groß',
    farbe: 'hell',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Jig-Kopf mit Einzelhaken',
    montageSchritte: [
      'Schweren Jig-Kopf (20–30 g) passend zur Tiefe wählen.',
      'Streamer-Körper über den Haken schieben.',
      'Kopf und Körper mit einem Tropfen UV-Kleber sichern.',
      'Führung mit Rucken und langen Pausen.'
    ],
    beschreibung: 'Heller, langer Kunstfisch-Streamer auf Jig-Kopf für tiefes Wasser. Die pulsierende Ruttenaktion imitiert einen verletzten Kleinfisch.',
    angeltipp: 'In trübem Wasser oder nachts helle Farben einsetzen – Zander orientieren sich stark über das Seitenliniensystem.',
    fachbegriffe: [
      { term: 'Streamer', definition: 'Langer, schlanker Kunstköder aus Gummi oder Kunstfell, der einen Fisch oder ein Krebstier imitiert.' },
      { term: 'Seitenliniensystem', definition: 'Sensororgan bei Fischen, das Druckwellen und Vibrationen im Wasser wahrnimmt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter'],
    fischart: ['Zander', 'Wels'],
    tempMin: null,
    tempMax: 15,
    basisScore: 8
  },
  {
    id: 'bait-024',
    typBezeichnung: 'Kleiner Regenwurm auf Posenmontage',
    typ: 'Wurm',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Allrounder',
    montage: 'Steckpose auf festem Vorfach',
    montageSchritte: [
      'Steckpose auf die Hauptschnur stecken.',
      'Posentiefe auf 50 cm unter der Oberfläche einstellen.',
      'Kleines Schrotblei (2 g) 30 cm über dem Haken klemmen.',
      'Kleinen Wurm einmal auf Hakenöse (Gr. 10–12) fädeln.'
    ],
    beschreibung: 'Kleiner Regenwurm unter einer Steckpose für das Angeln in der Mitte. Spricht Rotauge, Barsch und Brachse gleichermaßen an.',
    angeltipp: 'Pose ruhig driften lassen, leichte Bewegungen durch Wind sind vorteilhaft. Ständiges Einwinden und Auswerfen vermeiden.',
    fachbegriffe: [
      { term: 'Steckpose', definition: 'Einfache Pose, die durch Gummischlauchstücke auf der Schnur arretiert wird.' },
      { term: 'Schrotblei', definition: 'Kleine, teilweise aufgeknickte Bleikügelchen, die auf der Schnur gequetscht werden.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Teich', 'Stausee'],
    tiefe: ['Oberfläche', 'Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Rotauge', 'Brachse', 'Barsch', 'Schleie'],
    tempMin: 8,
    tempMax: null,
    basisScore: 5
  },
  {
    id: 'bait-025',
    typBezeichnung: 'Mittlerer Meeresköder auf Pilker-Montage',
    typ: 'Pilker',
    groesse: 'mittel',
    farbe: 'hell',
    gewicht: 'schwer',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Pilker-Montage mit Drillhaken',
    montageSchritte: [
      'Pilker über Karabiner an der Hauptschnur befestigen.',
      'Drillhaken am unteren Ösenring des Pilkers einhängen.',
      'Optional: kleinen Gummifisch als Attractor am Drillhaken.',
      'Pilker auf den Grund absinken lassen, dann rhythmisch anheben.'
    ],
    beschreibung: 'Langesteckter Metallköder für Meeres- und Tiefwasserangeln. Durch vertikales Jigging in der richtigen Tiefe wird er aktiv bewegt.',
    angeltipp: 'Grundkontakt sicherstellen, dann den Pilker in kurzen Rucken 1–2 m anheben und fallen lassen.',
    fachbegriffe: [
      { term: 'Pilker', definition: 'Langgestreckter Metallköder für das Tiefwasserangeln, der durch vertikales Jigging geführt wird.' },
      { term: 'Jigging', definition: 'Angeltechnik, bei der der Köder durch auf- und abwärtsgerichtete Rutenbewegungen aktiv geführt wird.' }
    ],
    wetter: ['Wind', 'bedeckt', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Meer', 'Brackwasser'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter', 'Frühling'],
    fischart: ['Barsch'],
    tempMin: null,
    tempMax: null,
    basisScore: 6
  },
  {
    id: 'bait-026',
    typBezeichnung: 'Kleiner heller Zander-Twister',
    typ: 'Gummifisch',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Jig-Kopf Montage',
    montageSchritte: [
      'Jig-Kopf (5–10 g) passend zur Wassertiefe wählen.',
      'Twister mit dem Haken von der Unterseite aufziehen.',
      'Twister-Schwanz muss frei abstehen.',
      'Langsamen bis mittleren Einzug mit Stopps verwenden.'
    ],
    beschreibung: 'Kleiner Gummifisch mit gewundenem Twister-Schwanz. Erzeugt bei jedem Einzug eine intensive Vibration, die Zander aus der Tiefe lockt.',
    angeltipp: 'Beim Vertikalangeln von Boot sehr effektiv: Köder genau über dem Zanderstand positionieren und auf der Stelle pulsieren lassen.',
    fachbegriffe: [
      { term: 'Twister', definition: 'Gummiköder mit einem spiral-gewundenem Schwanzstück, das beim Einzug intensive Vibration erzeugt.' },
      { term: 'Vertikalangeln', definition: 'Technik, bei der der Köder senkrecht vom Boot aus präsentiert und bewegt wird.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Fluss', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Herbst'],
    fischart: ['Zander', 'Barsch', 'Forelle'],
    tempMin: 6,
    tempMax: 18,
    basisScore: 8
  },
  {
    id: 'bait-027',
    typBezeichnung: 'Großer Maiskörner-Büschel auf Karpfenhaken',
    typ: 'Mais',
    groesse: 'mittel',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Method-Feeder-Montage',
    montageSchritte: [
      'Method-Feeder mit feuchtem Grundfutter festdrücken.',
      'Kurzes Vorfach (8 cm) am Feeder-Ösenring befestigen.',
      'Haken (Gr. 8–10) mit 2–3 Maiskörnern auf den Haken spießen.',
      'Montage weit auswerfen und Schnur straff ankurbeln.'
    ],
    beschreibung: 'Gelbe Maiskörner als Köder auf einer Method-Feeder-Montage. Das Futter rund um den Köder lockt Karpfen und Brachsen gezielt an den Haken.',
    angeltipp: 'Mais vorher 24 Stunden einweichen für weichere Konsistenz. Sweetcorn-Aroma in das Grundfutter mischen.',
    fachbegriffe: [
      { term: 'Method-Feeder', definition: 'Pressform für Grundfutter, die um die Montage gedrückt wird und sich nach dem Aufprall auf dem Grund löst.' },
      { term: 'Sweetcorn', definition: 'Zuckermais als klassischer Döbel- und Karpfenköder mit intensivem Geruch und auffälliger Farbe.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Teich', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Frühling'],
    fischart: ['Karpfen', 'Brachse', 'Rotauge'],
    tempMin: 14,
    tempMax: null,
    basisScore: 7
  },
  // =========================================================================
  // Meer & Brackwasser (bait-028 – bait-031)
  // =========================================================================
  {
    id: 'bait-028',
    typBezeichnung: 'Sandwurm-Büschel auf Brandungsmontage',
    typ: 'Sandwurm',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Brandungsmontage mit schwerem Birnenblei',
    montageSchritte: [
      'Schweres Birnenblei (80–150 g) ans Schnurende knoten.',
      '2 Vorfachschenkel (je 40 cm, 0,40 mm) über Dreiwegwirbel anhängen.',
      'Auf jeden Schenkel einen Meeresvorfachhaken (Gr. 1–1/0) binden.',
      'Sandwurmstücke büschelartig auf beide Haken aufziehen.'
    ],
    beschreibung: 'Büschel frischer Sandwürmer auf einer zweischenkligen Brandungsmontage für rauhe Meeresbedingungen. Das schwere Blei hält den Köder auch bei starker Strömung sicher am Grund.',
    angeltipp: 'Köder weit auswerfen und die Schnur straff kurbeln, bis das Blei Bodenkontakt hat. Rute im Rutenhalter lassen und auf Anbisse warten.',
    fachbegriffe: [
      { term: 'Brandungsmontage', definition: 'Grundmontage für das Meeresangeln in der Brandungszone, mit schwerem Blei zum Halten gegen Strömung und Wellen.' },
      { term: 'Sandwurm', definition: 'Mariner Polychaetenwurm, der im Sandwatt lebt und ein klassischer Köder für Seefische ist.' }
    ],
    wetter: ['bedeckt', 'Wind', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Meer', 'Brackwasser'],
    tiefe: ['Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
    fischart: ['Barsch'],
    tempMin: null,
    tempMax: null,
    basisScore: 7
  },
  {
    id: 'bait-029',
    typBezeichnung: 'Meeres-Gummifisch an Jigkopf',
    typ: 'Gummifisch',
    groesse: 'mittel',
    farbe: 'auffällig',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Jig-Kopf-Montage für Salzwasser',
    montageSchritte: [
      'Salzwasser-tauglichen Jig-Kopf (20–40 g) wählen.',
      'Gummifisch von der Bauchseite auf den Haken aufziehen.',
      'Hakenspitze mittig aus dem Rücken führen.',
      'Köder mit gleichmäßig pulsierendem Einzug durch den Strom führen.'
    ],
    beschreibung: 'Leuchtend gefärbter Gummifisch für das Salzwasser-Jigging in Strömungsbereichen. Der schwere Jig-Kopf hält den Köder auch bei starker Meeresströmung auf Tiefe.',
    angeltipp: 'Quer zur Strömung einwerfen und den Köder langsam mit dem Strom abtreiben lassen, dabei gleichmäßig einwinden.',
    fachbegriffe: [
      { term: 'Salzwasser-Jigging', definition: 'Technik, bei der ein Jig-Köder durch vertikale oder schräge Rutenbewegungen im Meer aktiv geführt wird.' },
      { term: 'Jig-Kopf', definition: 'Bleikopfhaken, der dem Köder Gewicht verleiht und eine pulsierende Auf-Ab-Bewegung ermöglicht.' }
    ],
    wetter: ['bedeckt', 'Wind', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Meer', 'Brackwasser'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter'],
    fischart: ['Barsch'],
    tempMin: null,
    tempMax: 18,
    basisScore: 6
  },
  {
    id: 'bait-030',
    typBezeichnung: 'Heller Meeresstreamer an Jigkopf',
    typ: 'Streamer',
    groesse: 'groß',
    farbe: 'hell',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Jig-Kopf mit Einzelhaken für Tiefwasser',
    montageSchritte: [
      'Schweren Jig-Kopf (30–60 g) für Tiefwasser wählen.',
      'Hellen Streamer-Körper über den Haken schieben.',
      'Streamer mit UV-Kleber am Jig-Kopf fixieren.',
      'Langsamen Einzug mit regelmäßigen Rucken einsetzen.'
    ],
    beschreibung: 'Großer heller Streamer für das Tiefwasserangeln im Meer und Brackwasser. Helle Farben erhöhen die Sichtbarkeit in trübem Tiefenwasser und locken Barsche aus der Tiefe.',
    angeltipp: 'Im Winter bei kaltem Wasser besonders langsam führen – Fische sind träge und brauchen lange Präsentationsphasen.',
    fachbegriffe: [
      { term: 'Streamer', definition: 'Langer, schlanker Kunstköder aus Gummi oder Kunstfell, der einen Fisch oder ein Krebstier imitiert.' },
      { term: 'Tiefwasser-Jigging', definition: 'Angeln in tiefen Meeresbereichen mit schweren Jigs durch vertikale Bewegung vom Boot aus.' }
    ],
    wetter: ['bedeckt', 'Wind', 'starker Regen'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Meer', 'Brackwasser'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Winter', 'Frühling'],
    fischart: ['Barsch'],
    tempMin: null,
    tempMax: 14,
    basisScore: 6
  },
  {
    id: 'bait-031',
    typBezeichnung: 'Wattwurm-Büschel auf Brandungshaken',
    typ: 'Meereswurm',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Einfache Brandungsmontage',
    montageSchritte: [
      'Birnenblei (60–100 g) direkt ans Schnurende knoten.',
      '50 cm Nylon-Vorfach (0,40 mm) am Bleiöse befestigen.',
      'Langen Seehasenhaken (Gr. 1/0) binden.',
      'Wattwurmstücke büschelartig auf den Haken aufziehen.'
    ],
    beschreibung: 'Büschel saftiger Wattwürmer auf einem langen Seehasenhaken. Der intensive Geruch lockt Bodenfische aus weiter Entfernung an und funktioniert in allen Meeres-Jahreszeiten.',
    angeltipp: 'Frische Wattwürmer kurz vor dem Angeln stechen – sie geben mehr Geruchsstoffe ab als abgestorbene Würmer.',
    fachbegriffe: [
      { term: 'Wattwurm', definition: 'Im Meereswatt lebender Polychaetenwurm (Arenicola marina), der ein sehr effektiver Meeres-Naturköder ist.' },
      { term: 'Seehasenhaken', definition: 'Großer, extra-langer Haken für Meeresköder wie Würmer oder Fischstücke, der das Aufziehen langer Naturköder ermöglicht.' }
    ],
    wetter: ['bedeckt', 'Wind', 'Regen', 'leicht bewölkt', 'sonnig'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Meer'],
    tiefe: ['Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
    fischart: ['Barsch'],
    tempMin: null,
    tempMax: null,
    basisScore: 7
  },
  // =========================================================================
  // Winter & Kälte – Grundmontage-Köder (bait-032 – bait-033)
  // =========================================================================
  {
    id: 'bait-032',
    typBezeichnung: 'Winzige Madenrolle auf Feeder',
    typ: 'Maden',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Feeder-Montage mit Mini-Feederkorb',
    montageSchritte: [
      'Kleinen Feederkorb (15–20 g) mit Maden und Wintergroundbait füllen.',
      'Kurzes Vorfach (20 cm, 0,14 mm) mit Hakenöse (Gr. 18–20) anhängen.',
      '3–4 Maden auf den feinen Haken aufziehen.',
      'Köder präzise auswerfen und Schnur straff halten.'
    ],
    beschreibung: 'Winzige Madenrolle auf einer feinen Feeder-Montage für das Winterangeln. Kleine, subtile Präsentation für träge Weißfische im Kaltwasser.',
    angeltipp: 'Im Winter minimale Mengen anfüttern – zu viel Futter sättigt die trägen Fische. Feine Schnur und kleine Haken erhöhen die Bissquote erheblich.',
    fachbegriffe: [
      { term: 'Madenrolle', definition: 'Kompakte Gruppe lebender Schmeißfliegenlarven, die büschelartig auf den Haken aufgezogen werden.' },
      { term: 'Wintergroundbait', definition: 'Spezielles Lockfutter für kaltes Wasser mit wenig Füllstoffen und intensivem Geruch für inaktive Fische.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Grund'],
    jahreszeit: ['Winter'],
    fischart: ['Rotauge', 'Brachse'],
    tempMin: null,
    tempMax: 8,
    basisScore: 6
  },
  {
    id: 'bait-033',
    typBezeichnung: 'Kleiner Blutwurm auf Grundhaken',
    typ: 'Blutwurm',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Einfache Grundhaken-Montage mit Laufblei',
    montageSchritte: [
      'Laufblei (15–25 g) auf Hauptschnur fädeln und mit Stopper sichern.',
      'Feines Vorfach (0,12–0,14 mm, 30 cm) mit Hakenöse (Gr. 18–22) binden.',
      '2–3 Blutwürmer büschelartig auf den feinen Haken aufziehen.',
      'Köder subtil am Grund präsentieren, minimale Bewegung.'
    ],
    beschreibung: 'Leuchtend rote Chironomiden-Blutwürmer (Zuckmückenlarven) auf einer feinen Grundmontage. Spezialisierter Kaltwasserköder, der Rotauge, Brachse und Schleie auch bei niedrigsten Temperaturen anlockt.',
    angeltipp: 'Blutwürmer sind sehr zart – sparsam auf den Haken fädeln ohne sie zu beschädigen. In Wintermonaten sind sie kaum zu schlagen.',
    fachbegriffe: [
      { term: 'Blutwurm', definition: 'Larve der Zuckmücke (Chironomidae) mit leuchtend roter Farbe durch Hämoglobin; klassischer Feinstangel-Köder für Weißfische.' },
      { term: 'Feinstangel-Montage', definition: 'Sehr feine Grundmontage mit dünner Schnur und kleinen Haken für scheue und vorsichtige Winterfische.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Grund'],
    jahreszeit: ['Winter', 'Frühling'],
    fischart: ['Rotauge', 'Brachse', 'Schleie'],
    tempMin: null,
    tempMax: 10,
    basisScore: 7
  },
  // =========================================================================
  // Forelle – erweiterte Abdeckung (bait-034 – bait-037)
  // =========================================================================
  {
    id: 'bait-034',
    typBezeichnung: 'Kleiner Kupferspinner für Forellen',
    typ: 'Spinner',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage',
    montageSchritte: [
      'Kupferspinner mit Palstek-Knoten direkt an die Hauptschnur binden.',
      'Blattschaufelrotation im Wasser prüfen.',
      'Quer zur Strömung oder leicht bergauf einwerfen und gleichmäßig einwinden.'
    ],
    beschreibung: 'Kleiner Kupfer-Blattspinner, der durch seinen warmen Metallglanz Forellen in klarem Wasser gezielt anlockt. Die Kupferfarbe imitiert Insekten und kleine Krebstiere.',
    angeltipp: 'In klaren Flüssen und Seen sehr effektiv – Kupfer wirkt natürlicher als Silber und provoziert weniger scheue Forellen zum Angriff.',
    fachbegriffe: [
      { term: 'Kupferspinner', definition: 'Blattspinner mit kupferfarbener Schaufel, der besonders gut in klarem, sauerstoffreichem Wasser funktioniert.' },
      { term: 'Palstek', definition: 'Fester, nicht zuziehender Knoten zur sicheren Verbindung von Schnur und Öse.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Herbst'],
    fischart: ['Forelle'],
    tempMin: 8,
    tempMax: 18,
    basisScore: 7
  },
  {
    id: 'bait-035',
    typBezeichnung: 'Naturgetreue Fliegennymphe auf Posenmontage',
    typ: 'Nymphe',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Allrounder',
    montage: 'Posenmontage mit Indikatornymphe',
    montageSchritte: [
      'Leichte Pose als Biss-Indikator auf die Schnur schieben.',
      'Tiefenstopper 50–80 cm über Gewässersohle setzen.',
      'Kleines Schrotblei (1 g) 20 cm über dem Haken klemmen.',
      'Nymphe auf feinem Haken (Gr. 12–14) binden und langsam treiben lassen.'
    ],
    beschreibung: 'Naturgetreue Imitationen von Fliegenlarven unter der Pose. Sehr effektiv für Forellen und Rotaugen, die selektiv auf natürliche Insekten-Entwicklungsstadien fressen.',
    angeltipp: 'Nymphe mit der Strömung natürlich driften lassen, ohne künstliche Bewegungen. Bisse oft sehr subtil – auf kleinste Posenbewegungen achten.',
    fachbegriffe: [
      { term: 'Nymphe', definition: 'Fliegengebundene Imitation eines Wasser-Insektenlarven-Stadiums (Eintagsfliege, Steinfliege, Zuckmücke).' },
      { term: 'Drift', definition: 'Kontrolliertes Treiben des Köders mit der natürlichen Strömung ohne künstlichen Zug an der Schnur.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer'],
    fischart: ['Forelle', 'Rotauge'],
    tempMin: 8,
    tempMax: 20,
    basisScore: 7
  },
  {
    id: 'bait-036',
    typBezeichnung: 'Kleiner Gold-Blinker für Bachforellen',
    typ: 'Blinker',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage mit Wirbel',
    montageSchritte: [
      'Kleinen Dreiwirbel an Hauptschnur befestigen.',
      'Blinker über Karabiner einhängen.',
      'Quer zur Strömung einwerfen, Köder mit Strömung taumeln lassen.'
    ],
    beschreibung: 'Kleiner goldkupferfarbener Blinker, der beim Taumeln Goldreflexe erzeugt. Speziell für Bachforellen im seichten Fließwasser geeignet.',
    angeltipp: 'Im Fluss stromauf einwerfen und langsam mit der Strömung führen – das Taumeln imitiert einen verletzten Kleinfisch.',
    fachbegriffe: [
      { term: 'Blinker', definition: 'Metallköder, der beim Absinken und Einzug taumelt und durch Lichtreflexe Raubfische anlockt.' },
      { term: 'Stromauf-Angeln', definition: 'Technik, bei der der Köder stromauf geworfen und mit der Strömung natürlich zurückgeführt wird.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['schwach', 'mittel'],
    gewaesserart: ['Fluss'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Forelle'],
    tempMin: 6,
    tempMax: 20,
    basisScore: 7
  },
  {
    id: 'bait-037',
    typBezeichnung: 'Trockenfliege auf klassischer Fliegenmontage',
    typ: 'Trockenfliege',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Oberflaechenkoeder',
    montage: 'Klassische Fliegenmontage mit Fluorocarbon-Vorfach',
    montageSchritte: [
      'Langes Fluorocarbon-Vorfach (3–4 m, 0,14–0,18 mm) an Fliegenschnur binden.',
      'Trockenfliege (Gr. 14–18) am Vorfachende mit Davy-Knoten befestigen.',
      'Fliegenschnur trocken halten – Silikon-Fett auf Schnur und Fliege.',
      'Köder präzise stromauf über stehendem Fisch landen und natürlich driften lassen.'
    ],
    beschreibung: 'Klassische Trockenfliege, die auf der Wasseroberfläche treibend präsentiert wird. Imitiert schlüpfende oder landende Insekten und löst spektakuläre Oberflächenbisse von Forellen aus.',
    angeltipp: 'Forellen über ihren Fressringen beobachten und die Trockenfliege genau an die Stelle landen, wo die Fische regelmäßig steigen.',
    fachbegriffe: [
      { term: 'Trockenfliege', definition: 'Fliegengebundene Imitation eines Erwachsenen-Insekts, das auf der Wasseroberfläche treibt.' },
      { term: 'Steigen', definition: 'Verhalten von Forellen, bei dem sie gezielt Insekten von der Wasseroberfläche nehmen, erkennbar an Kreisringen.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss'],
    tiefe: ['Oberfläche'],
    jahreszeit: ['Frühling', 'Sommer'],
    fischart: ['Forelle'],
    tempMin: 12,
    tempMax: 22,
    basisScore: 6
  },
  // =========================================================================
  // Wels – erweiterte Abdeckung (bait-038 – bait-040)
  // =========================================================================
  {
    id: 'bait-038',
    typBezeichnung: 'Großer Tauwurm-Büschel auf Wels-Montage',
    typ: 'Wurm',
    groesse: 'groß',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Wels-Grundmontage mit mehreren Haken',
    montageSchritte: [
      'Starkes Vorfach (0,50–0,60 mm, 60 cm) an Hauptschnur binden.',
      '2 große Haken (Gr. 2/0–3/0) im Tandem-Abstand von 8 cm aufbauen.',
      'Büschel großer Tauwürmer auf beide Haken aufziehen.',
      'Schweres Blei (80–120 g) als Laufblei auf Hauptschnur montieren.'
    ],
    beschreibung: 'Mehrere große Tauwürmer büschelartig auf einer speziellen Wels-Grundmontage. Der intensive Geruch und die Bewegung der Würmer lockt Welse aus tiefen Löchern heraus.',
    angeltipp: 'In der Nacht auslegeen und die Rute im Ständer lassen. Welse schlucken Würmer oft langsam durch – erst nach deutlichem Schnurzug anschlagen.',
    fachbegriffe: [
      { term: 'Tandem-Rig', definition: 'Montage mit zwei hintereinander geschalteten Haken auf einem Vorfach, für lange oder voluminöse Naturköder.' },
      { term: 'Tauwurm', definition: 'Großer, nachtaktiv aktiver Regenwurm (Lumbricus terrestris), der nachts auf Wiesen gesammelt werden kann.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Wels'],
    tempMin: 16,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-039',
    typBezeichnung: 'Großer Gummifisch als Lebendköder-Imitat',
    typ: 'Gummifisch',
    groesse: 'groß',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Allrounder',
    montage: 'Swimbait-Montage mit gelenkigem Körper',
    montageSchritte: [
      'Großen Einzelhaken (Gr. 3/0–4/0) durch die Bauchseite des Gummifisches führen.',
      'Hakenspitze mittig am Rücken herausführen.',
      'Schweres Laufblei (40–80 g) auf Hauptschnur aufziehen.',
      'Langsamen, gleichmäßigen Einzug mit langen Pausen einsetzen.'
    ],
    beschreibung: 'Großer naturgetreuer Gummifisch, der einen lebenden Köder-Fisch imitiert. Die realistische Schwimmbewegung provoziert Welse und Hechte zu Angriffen aus dem Hinterhalt.',
    angeltipp: 'In warmen Nächten im Sommer entlang von Uferstrukturen führen. Lange Pausen lassen den Köder natürlich auf den Grund sinken.',
    fachbegriffe: [
      { term: 'Swimbait', definition: 'Großer, natürlich schwimmender Kunstköder mit täuschend echter Fischnachbildung und realistischer Schwimmbewegung.' },
      { term: 'Hinterhalt-Angriff', definition: 'Angriffsstrategie von Raubfischen aus einer gedeckten Position heraus, typisch für Wels und Hecht.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Wels', 'Hecht'],
    tempMin: 18,
    tempMax: 30,
    basisScore: 7
  },
  {
    id: 'bait-040',
    typBezeichnung: 'Klonkköder mit Gummifisch-Anhänger',
    typ: 'Klonkköder',
    groesse: 'groß',
    farbe: 'dunkel',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Tiefenkoeder',
    montage: 'Oberflächenmontage mit hängendem Gummifisch',
    montageSchritte: [
      'Klonkkörper mit starker Schnur (0,70 mm) an Hauptschnur befestigen.',
      'Kurzes Stahlvorfach (20 cm) mit Einzelhaken am Klonk-Anhänger.',
      'Großen dunklen Gummifisch am Haken als Trailer montieren.',
      'Köder mit rhythmischem Klonk-Klonk an der Oberfläche führen.'
    ],
    beschreibung: 'Klassischer Wels-Klonkköder, der durch Klopfen an der Wasseroberfläche Druckwellen erzeugt, auf die Welse instinktiv reagieren. Ein hängender Gummifisch fungiert als eigentlicher Köder.',
    angeltipp: 'Im Sommer nachts über bekannten Wels-Einständen einsetzen. Rhythmisches Klonken: drei Schläge, dann Pause.',
    fachbegriffe: [
      { term: 'Klonkköder', definition: 'Spezialköder für den Wels, der durch Schlagen auf die Wasseroberfläche intensive Druckwellen erzeugt, die Welse aus der Tiefe anlocks.' },
      { term: 'Trailer', definition: 'Zusätzlicher Köder oder Gummifisch, der als Anhänger am Hauptköder befestigt ist, um die Wirkung zu verstärken.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend'],
    stroemung: ['keine'],
    gewaesserart: ['See', 'Fluss', 'Stausee'],
    tiefe: ['Oberfläche'],
    jahreszeit: ['Sommer'],
    fischart: ['Wels'],
    tempMin: 20,
    tempMax: null,
    basisScore: 7
  },
  // =========================================================================
  // Aal – erweiterte Abdeckung (bait-041 – bait-042)
  // =========================================================================
  {
    id: 'bait-041',
    typBezeichnung: 'Fischfetzen auf Aalgrundmontage',
    typ: 'Fischstück',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Aalgrundmontage mit Doppelhaken',
    montageSchritte: [
      'Festes Blei (40–60 g) ans Schnurende knoten.',
      '60 cm starkes Vorfach (0,35 mm) am Bleiöse befestigen.',
      'Doppelhaken (Gr. 4–6) im Abstand von 5 cm auf Vorfach binden.',
      'Frischen Fischstreifen auf beide Haken aufziehen.'
    ],
    beschreibung: 'Frischer Fischstreifen oder Fischfetzen auf einer Aalgrundmontage. Der intensive Geruch frischer Fische lockt Aale und andere Raubfische aus dem Grund.',
    angeltipp: 'Fischfetzen von frisch gefangenem Rogen-Fisch verwenden – je frischer, desto mehr Geruch. Montage in der Dunkelheit auslegen.',
    fachbegriffe: [
      { term: 'Fischfetzen', definition: 'Stücke oder Streifen von frischem oder aufgetautem Fisch als Naturköder, der intensiven Geruch abgibt.' },
      { term: 'Doppelhaken', definition: 'Montage mit zwei Haken auf einem Vorfach, die eine sichere Befestigung langer oder gleitender Naturköder ermöglicht.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Aal'],
    tempMin: 14,
    tempMax: 28,
    basisScore: 7
  },
  {
    id: 'bait-042',
    typBezeichnung: 'Kleiner Tauwurm auf Aalpose',
    typ: 'Wurm',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Allrounder',
    montage: 'Posenmontage am Kanal',
    montageSchritte: [
      'Steckpose auf Hauptschnur schieben.',
      'Tiefenstopper 30–60 cm über dem Gewässergrund setzen.',
      'Schrotblei (3 g) 20 cm über dem Haken klemmen.',
      'Kleinen Tauwurm auf Haken (Gr. 8–10) aufziehen und Pose treiben lassen.'
    ],
    beschreibung: 'Kleiner Tauwurm unter der Pose für das Kanalangeln auf Aale im Sommerabend. Sehr vielseitige Methode, die auch Rotauge und andere Weißfische fängt.',
    angeltipp: 'Entlang von Kanalböschungen und Rohrwurzeln fischen, wo sich Aale gerne aufhalten. Einbruch der Dunkelheit abwarten.',
    fachbegriffe: [
      { term: 'Kanalangeln', definition: 'Angeln in künstlichen Wasserstraßen, die oft ruhiges Wasser und viele Einstandsstellen für Aale bieten.' },
      { term: 'Steckpose', definition: 'Einfache Pose, die durch Gummischlauchstücke auf der Schnur arretiert wird.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen', 'sonnig'],
    tageszeit: ['Abend', 'Nacht', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'Teich'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Aal', 'Rotauge'],
    tempMin: 14,
    tempMax: null,
    basisScore: 6
  },
  // =========================================================================
  // Herbst-Raubfisch (bait-043 – bait-045)
  // =========================================================================
  {
    id: 'bait-043',
    typBezeichnung: 'Großer Jerkbait für Herbst-Hecht',
    typ: 'Jerkbait',
    groesse: 'groß',
    farbe: 'zweifarbig',
    gewicht: 'schwer',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Stahlvorfach-Montage für Jerkbait',
    montageSchritte: [
      'Kurzes, starkes Stahlvorfach (20 cm) an Hauptschnur befestigen.',
      'Jerkbait über Karabiner einhängen, Drillinge auf festen Sitz prüfen.',
      'Rute senkrecht halten und kurze, ruckartige Ziehmontage ausführen.',
      'Pausen zwischen Rucken einbauen, damit Köder seitlich abtaucht.'
    ],
    beschreibung: 'Großer Hartkunststoff-Jerkbait in zweifarbiger Lackierung. Provoziert aggressiv fressende Herbst-Hechte durch unregelmäßige, verletzend wirkende Schwimmbewegungen.',
    angeltipp: 'Im Herbst bei sinkenden Temperaturen die Führungsgeschwindigkeit reduzieren – Hechte werden träger und brauchen mehr Zeit zum Angriff.',
    fachbegriffe: [
      { term: 'Jerkbait', definition: 'Kunstköder ohne eigene Aktion, der ausschließlich durch ruckartige Rutenbewegungen (Jerks) bewegt wird.' },
      { term: 'Herbst-Fressphase', definition: 'Intensive Fraßperiode von Raubfischen im Herbst vor dem Winter, bei der sie Energie für die Kälteperiode aufbauen.' }
    ],
    wetter: ['bedeckt', 'Regen', 'Wind'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Stausee', 'Fluss'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter'],
    fischart: ['Hecht', 'Zander'],
    tempMin: 6,
    tempMax: 15,
    basisScore: 8
  },
  {
    id: 'bait-044',
    typBezeichnung: 'Mittlerer Paddle-Tail-Shad',
    typ: 'Shad',
    groesse: 'mittel',
    farbe: 'zweifarbig',
    gewicht: 'mittel',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Jig-Kopf-Montage',
    montageSchritte: [
      'Jig-Kopf (10–18 g) passend zur Tiefe wählen.',
      'Shad-Köder gerade auf den Haken aufziehen.',
      'Paddle-Schwanz muss frei abstehen und bei Bewegung schlagen.',
      'Langsamer bis mittlerer Einzug mit regelmäßigen Stopps.'
    ],
    beschreibung: 'Mittlerer Gummiköder mit breitem Paddle-Schwanz, der bei jedem Einzug intensiv schlägt und Vibrationen erzeugt. Ideal für Zander und Hecht in der Herbst-Fressphase.',
    angeltipp: 'Im trüben Herbstwasser Farben mit mehr Kontrast wählen. Den Shad knapp über dem Grund führen, wo Zander auf Beute lauern.',
    fachbegriffe: [
      { term: 'Paddle-Tail', definition: 'Breiter, schaufelförmiger Schwanz eines Gummiköders, der beim Einzug stark schlägt und Druckwellen erzeugt.' },
      { term: 'Shad', definition: 'Gummiköder in der Form eines kleinen Fisches mit charakteristisch schlagendem Schwanz.' }
    ],
    wetter: ['bedeckt', 'Regen', 'Wind', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach', 'mittel'],
    gewaesserart: ['See', 'Fluss', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst'],
    fischart: ['Zander', 'Hecht', 'Barsch'],
    tempMin: 5,
    tempMax: 15,
    basisScore: 8
  },
  {
    id: 'bait-045',
    typBezeichnung: 'Großer Swimbait-Gummifisch für Herbst-Hecht',
    typ: 'Gummifisch',
    groesse: 'groß',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Swimbait-Haken mit Texas-Rig',
    montageSchritte: [
      'Großen Swimbait-Haken (Gr. 4/0–6/0) wählen.',
      'Gummifisch von der Bauchseite aufziehen, Körper gerade halten.',
      'Hakenspitze im Gummikörper verstecken (weedless).',
      'Langsam und gleichmäßig in Grundnähe führen.'
    ],
    beschreibung: 'Großer, natürlich gefärbter Gummifisch in der Swimbait-Montage. Täuschend echte Schwimmbewegung lockt große Herbst-Hechte aus tiefen Einstandsstellen.',
    angeltipp: 'An Tiefenwasserkanten und Unterwasserspitzen positionieren – dort stehen Hechte im Herbst auf der Jagd nach ziehenden Weißfischen.',
    fachbegriffe: [
      { term: 'Weedless-Montage', definition: 'Hakenaufbau, bei dem die Spitze im Köper versteckt ist, um beim Führen durch Kraut und Äste hängerfrei zu bleiben.' },
      { term: 'Tiefenkante', definition: 'Übergang zwischen flachem und tiefem Wasser, eine bevorzugte Jagdposition für Raubfische im Herbst.' }
    ],
    wetter: ['bedeckt', 'Regen', 'Wind'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst'],
    fischart: ['Hecht'],
    tempMin: 8,
    tempMax: 18,
    basisScore: 7
  },
  // =========================================================================
  // Starke Strömung (bait-046 – bait-047)
  // =========================================================================
  {
    id: 'bait-046',
    typBezeichnung: 'Schwerer Blinker für starke Strömung',
    typ: 'Blinker',
    groesse: 'mittel',
    farbe: 'hell',
    gewicht: 'schwer',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage mit starkem Wirbel',
    montageSchritte: [
      'Starken Dreiwegwirbel an Hauptschnur binden.',
      'Schweren Blinker über Karabiner einhängen.',
      'Quer zur Strömung einwerfen und mit der Strömung abtreiben lassen.',
      'Gleichmäßigen Gegendruck durch gemächliches Einwinden aufrechterhalten.'
    ],
    beschreibung: 'Schwerer Metallblinker, der speziell für das Angeln in starken Flussströmungen geeignet ist. Das höhere Gewicht hält den Köder im Tiefenwasser gegen den Strom.',
    angeltipp: 'Im Schnellwasser unterhalb von Hindernissen fischen, wo Forellen im strömungsberuhigten Bereich auf Beute warten.',
    fachbegriffe: [
      { term: 'Querwerfen', definition: 'Technik, bei der der Köder quer zur Strömungsrichtung eingeworfen und mit dem Wasser natürlich geführt wird.' },
      { term: 'Strömungsschatten', definition: 'Strömungsberuhigter Bereich hinter einem Hindernis, in dem Fische mit weniger Kraftaufwand auf Beute lauern.' }
    ],
    wetter: ['bedeckt', 'Regen', 'Wind', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Fluss'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Herbst'],
    fischart: ['Forelle', 'Barsch'],
    tempMin: 5,
    tempMax: 20,
    basisScore: 7
  },
  {
    id: 'bait-047',
    typBezeichnung: 'Grundmontage mit schwerem Strömungsblei',
    typ: 'Wurm',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Strömungsmontage mit Drachen-Blei',
    montageSchritte: [
      'Drachenblei (60–100 g) mit Winkeln in den Boden bohren lassen.',
      'Haken-Vorfach (0,30 mm, 60 cm) am Blei befestigen.',
      'Haken (Gr. 4–8) mit Wurm oder Teig versehen.',
      'Schnur straff halten und Bisssignal-Indicator verwenden.'
    ],
    beschreibung: 'Robuste Grundmontage mit speziellem Drachen-Blei, das sich im Kiesboden verankert und auch bei stärkster Strömung an der Position bleibt. Für Barsch, Karpfen und Brachse im Fluss.',
    angeltipp: 'Montage an strömungsberuhigten Uferbereichen auslegen – Fische halten sich im Schutz der Strömung auf und warten auf vorbeischwemmendes Futter.',
    fachbegriffe: [
      { term: 'Drachenblei', definition: 'Spezielle Bleigewicht-Form mit abstehenden Armen oder Stiften, die sich im Flussboden verankern und starker Strömung widerstehen.' },
      { term: 'Bisssignal-Indicator', definition: 'Visuelle oder akustische Anzeige für einen Biss an der Rute, z.B. Feeder-Tip, Glöckchen oder elektronischer Bissmelder.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt', 'Wind'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Fluss'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Barsch', 'Karpfen', 'Brachse'],
    tempMin: null,
    tempMax: null,
    basisScore: 6
  },
  // =========================================================================
  // Nacht-Angeln (bait-048 – bait-049)
  // =========================================================================
  {
    id: 'bait-048',
    typBezeichnung: 'Leuchtendes Gummi-Creature auf Jig',
    typ: 'Creature Bait',
    groesse: 'mittel',
    farbe: 'auffällig',
    gewicht: 'mittel',
    aktion: 'pulsierend',
    klasse: 'Allrounder',
    montage: 'Jig-Kopf-Montage für Nacht',
    montageSchritte: [
      'Jig-Kopf (15–25 g) mit Einzelhaken wählen.',
      'Glow-Creature-Bait auf den Haken aufziehen.',
      'Vor dem Einsatz den Köder mit Licht aufladen (UV-Lampe oder Taschenlampe).',
      'Langsam am Grund führen, lange Pausen einbauen.'
    ],
    beschreibung: 'Im Dunkeln leuchtender Gummi-Creature-Bait für das Nachtangeln auf Wels, Aal und Hecht. Das Phosphoreszieren lockt nachtaktive Raubfische aus der Tiefe.',
    angeltipp: 'Glow-Köder regelmäßig wieder mit Licht aufladen, da die Leuchtintensität nachlässt. Im Wechsel mit normalen Ködern einsetzen.',
    fachbegriffe: [
      { term: 'Creature Bait', definition: 'Gummiköder in Form eines fantasievollen Wassertiers mit vielen Anhängseln für maximale Bewegung und Vibrationen.' },
      { term: 'Phosphoreszenz', definition: 'Nachleuchten eines Materials nach Lichtbestrahlung, das in der Dunkelheit schwaches Licht abgibt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Fluss', 'Stausee'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Wels', 'Aal', 'Hecht'],
    tempMin: 16,
    tempMax: 30,
    basisScore: 7
  },
  {
    id: 'bait-049',
    typBezeichnung: 'Schwarzer Oberflächenstickbait für Nacht',
    typ: 'Stickbait',
    groesse: 'groß',
    farbe: 'dunkel',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Oberflaechenkoeder',
    montage: 'Stahlvorfach-Montage für Nacht',
    montageSchritte: [
      'Kurzes Stahlvorfach (20 cm) an Hauptschnur befestigen.',
      'Dunklen Stickbait über Karabiner einhängen.',
      'Rutenspitze nach unten halten und rhythmische Walk-the-Dog-Bewegungen ausführen.',
      'Lange Pausen zwischen den Aktionen lassen.'
    ],
    beschreibung: 'Großer schwarzer Oberflächenköder für das Nachtangeln. Das dunkle Profil ist für Raubfische aus der Tiefe gegen den Nachthimmel klar erkennbar und löst spektakuläre Oberflächenangriffe aus.',
    angeltipp: 'In warmen Sommernächten an stillen Seeufern oder über Pflanzenbetten einsetzen. Hechte und Welse jagen nachts aktiv an der Oberfläche.',
    fachbegriffe: [
      { term: 'Stickbait', definition: 'Schlanker, stiftförmiger Oberflächenköder ohne eigene Aktion, der durch die Rutentechnik bewegt wird.' },
      { term: 'Walk-the-Dog', definition: 'Technik, bei der der Köder durch Rutenspitzenbewegungen zickzackartig über die Oberfläche geführt wird.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend'],
    stroemung: ['keine'],
    gewaesserart: ['See', 'Teich', 'Stausee'],
    tiefe: ['Oberfläche'],
    jahreszeit: ['Sommer'],
    fischart: ['Hecht', 'Wels'],
    tempMin: 18,
    tempMax: null,
    basisScore: 7
  },
  // =========================================================================
  // Karpfen im Sommer (bait-050 – bait-051)
  // =========================================================================
  {
    id: 'bait-050',
    typBezeichnung: 'Fruchtaroma-Boilie auf Chod-Rig',
    typ: 'Boilie',
    groesse: 'mittel',
    farbe: 'auffällig',
    gewicht: 'mittel',
    aktion: 'sinkend-langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Chod-Rig für Krautgewässer',
    montageSchritte: [
      'Kurzen, gebogenen Chod-Haken (Gr. 6) mit Hair-Knoten versehen.',
      'Boilie auf Hair aufziehen und Stopper sichern.',
      'Chod-Rig-Perle auf Hauptschnur montieren.',
      'Bleikorb (80–120 g) über Sicherheitsklip befestigen.'
    ],
    beschreibung: 'Fruchtaroma-Boilie auf einem Chod-Rig, der über Kraut und Schlamm präsentiert wird. Der Haken steht senkrecht und verankert sich sofort beim Anbeißen.',
    angeltipp: 'Am gegenüberliegenden Ufer an krautreichen Bereichen auswerfen – Karpfen fressen bevorzugt in Krautbetten.',
    fachbegriffe: [
      { term: 'Chod-Rig', definition: 'Spezielle Karpfenmontage, bei der der Haken auf einer kurzen, steifen Schnur steht und über Schlamm oder Kraut präsentiert wird.' },
      { term: 'Hair-Rig', definition: 'Montage, bei der der Köder an einem kurzen Schnurstück hinter dem Hakenbogen hängt, statt direkt am Haken.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Karpfen', 'Schleie'],
    tempMin: 18,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-051',
    typBezeichnung: 'Pop-Up-Boilie auf Multi-Rig',
    typ: 'Pop-Up',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Multi-Rig für schwebende Präsentation',
    montageSchritte: [
      'Multi-Rig mit gebogenem Karpfenhaken (Gr. 4–8) aufbauen.',
      'Pop-Up-Boilie über Hair-Rig montieren.',
      'Bleikörper (60–100 g) über Sicherheitsklip befestigen.',
      'Schwimmkraft des Pop-Ups durch Schrotblei am Vorfach ausbalancieren.'
    ],
    beschreibung: 'Schwimmfähiger Pop-Up-Boilie, der auf dem Multi-Rig 2–5 cm über dem Grund präsentiert wird. Durch die erhöhte Position ist der Köder weithin sichtbar und leicht zu finden.',
    angeltipp: 'Helle oder fluoreszierende Pop-Ups in trübem Wasser oder auf dunklem Schlammgrund einsetzen, wo sie am besten sichtbar sind.',
    fachbegriffe: [
      { term: 'Pop-Up', definition: 'Auftriebsfähiger Boilie, der nicht am Grund liegt, sondern leicht darüber schwebt und so besser wahrnehmbar ist.' },
      { term: 'Multi-Rig', definition: 'Vielseitige Karpfenmontage, bei der der Haken leicht ausgetauscht werden kann und verschiedene Präsentationshöhen ermöglicht.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen', 'Morgen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Teich', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Frühling'],
    fischart: ['Karpfen'],
    tempMin: 14,
    tempMax: null,
    basisScore: 8
  },
  // =========================================================================
  // Schleie & Brachse spezifisch (bait-052 – bait-053)
  // =========================================================================
  {
    id: 'bait-052',
    typBezeichnung: 'Großer roter Dendrobena-Wurm auf Posenmontage',
    typ: 'Wurm',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Posenmontage am Gewässerrand',
    montageSchritte: [
      'Federkielpose auf Hauptschnur schieben.',
      'Tiefenstopper 30 cm über Gewässergrund setzen.',
      'Schrotblei (2 g) 20 cm über Haken klemmen.',
      'Großen roten Dendrobaena-Wurm vollständig auf Haken (Gr. 8–10) aufziehen.'
    ],
    beschreibung: 'Großer roter Dendrobaena-Wurm (Rotwurm) unter der Pose für Schleien und Karpfen im Flachwasser. Die intensive Bewegung der Würmer lockt Fische aus ihrer Deckung.',
    angeltipp: 'In der Morgendämmerung und am Abend an Schilfrändern und Wasserpflanzenbetten fischen, wo Schleien auf Nahrungssuche sind.',
    fachbegriffe: [
      { term: 'Dendrobaena', definition: 'Roter Kompostwurm (Dendrobaena veneta), der fester und widerstandsfähiger als der normale Regenwurm ist und länger am Haken bleibt.' },
      { term: 'Federkielpose', definition: 'Klassische, empfindliche Pose aus Federkiel, die auch schwache Bisse von Schleien und Fischchen anzeigt.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Teich', 'See'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Sommer', 'Frühling'],
    fischart: ['Schleie', 'Karpfen'],
    tempMin: 12,
    tempMax: null,
    basisScore: 7
  },
  {
    id: 'bait-053',
    typBezeichnung: 'Hartweizenkorn auf Haarmontage',
    typ: 'Hartweizen',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Haarmontage auf Grundrig',
    montageSchritte: [
      'Haken (Gr. 12–14) mit Hair-Rig-Schlaufe versehen.',
      'Gekochtes Hartweizenkorn auf die Schlaufe fädeln.',
      'Stopper einziehen, Korn sollte frei hinter dem Haken hängen.',
      'Laufblei (30–50 g) auf Hauptschnur, 50 cm Vorfach anhängen.'
    ],
    beschreibung: 'Abgehärtetes, gekochtes Weizenkorn auf einer Haarmontage. Natürlich aussehender Köder für selektiv fressende Brachsen, Karpfen und Rotaugen.',
    angeltipp: 'Weizenkörner 24 Stunden kochen, bis sie weich genug sind aber noch Halt bieten. Anfüttern mit gekochtem Weizen erhöht den Erfolg.',
    fachbegriffe: [
      { term: 'Hartweizen', definition: 'Spezielle Weizensorte mit hohem Glutenanteil, die beim Kochen eine feste Konsistenz behält und als Karpfenköder geeignet ist.' },
      { term: 'Hair-Rig', definition: 'Montage, bei der der Köder an einem kurzen Schnurstück hinter dem Hakenbogen hängt, statt direkt am Haken.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Fluss', 'Teich'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Brachse', 'Karpfen', 'Rotauge'],
    tempMin: 12,
    tempMax: 25,
    basisScore: 6
  },
  // =========================================================================
  // Zusätzliche Einträge für Vollständigkeit (bait-054 – bait-057)
  // =========================================================================
  {
    id: 'bait-054',
    typBezeichnung: 'Mittlerer naturgetreuer Wobbler für Teich-Hecht',
    typ: 'Wobbler',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Stahlvorfach mit Karabinerwirbel',
    montageSchritte: [
      'Stahlvorfach (25 cm, 10 kg) an Hauptschnur befestigen.',
      'Wobbler über Karabiner einhängen.',
      'Haken auf festen Sitz prüfen.',
      'Langsam und gleichmäßig über Krautbetten führen.'
    ],
    beschreibung: 'Mittelgroßer naturgetreuer Wobbler mit Tauchtiefe 1–2 m. Im Teich ideal für Hecht, der in Krautbänken auf Beute wartet. Das naturalistische Erscheinungsbild provoziert gezielte Angriffe.',
    angeltipp: 'Entlang von Krautbettkanten führen und gelegentlich pausieren, damit der Wobbler auftreibt und der Hecht zubeißen kann.',
    fachbegriffe: [
      { term: 'Krautbettkante', definition: 'Rand eines Wasserpflanzenbetts, bevorzugte Jagdposition für Hechte, die im Kraut auf Beute lauern.' },
      { term: 'Stahlvorfach', definition: 'Biss-resistentes Vorfach aus dünnem Stahldraht oder Stahlseil zum Schutz vor scharfen Hechtgebissen.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Teich', 'See'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Hecht'],
    tempMin: 8,
    tempMax: 22,
    basisScore: 7
  },
  {
    id: 'bait-055',
    typBezeichnung: 'Kleiner auffälliger Spinner für Teich-Hecht',
    typ: 'Spinner',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage mit Stahlvorfach',
    montageSchritte: [
      'Kurzes Stahlvorfach (20 cm) an Hauptschnur knoten.',
      'Spinner über Karabiner einhängen.',
      'Blattschaufel-Rotation im Wasser vor dem Einsatz prüfen.',
      'Gleichmäßigen schnellen Einzug in Mittelwasserhöhe wählen.'
    ],
    beschreibung: 'Leuchtend gefärbter kleiner Spinner mit intensiven Lichtreflexen und Vibrationen. Für Hecht in kleinen Teichen und Seen sehr effektiv, besonders bei trüberem Wasser.',
    angeltipp: 'In Teichen entlang der Uferzone fischen, wo Hechte in flachem Wasser auf Kleinf ische lauern. Schnelle Führung provoziert Reflexbisse.',
    fachbegriffe: [
      { term: 'Reflexbiss', definition: 'Spontaner Angriff eines Raubfisches auf einen Köder, ausgelöst durch Reiz ohne echten Hunger.' },
      { term: 'Spinner', definition: 'Kunstköder mit rotierender Blattschaufel, die Lichtreflexe und Vibrationen erzeugt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Morgen', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Teich', 'See'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Hecht', 'Barsch'],
    tempMin: 8,
    tempMax: 25,
    basisScore: 7
  },
  {
    id: 'bait-056',
    typBezeichnung: 'Kleiner Gummifisch für Teich-Hecht',
    typ: 'Gummifisch',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Leichter Jig-Kopf für Flachwasser',
    montageSchritte: [
      'Leichten Jig-Kopf (3–7 g) für das Flachwasser im Teich wählen.',
      'Kleinen Gummifisch aufziehen.',
      'Langsam und in Grundnähe führen.',
      'Kurze Pausen einbauen, damit der Köder absackt.'
    ],
    beschreibung: 'Kleiner heller Gummifisch auf leichtem Jig-Kopf für das Angeln auf Hecht in flachen Teichen. Helle Farbe und realistische Schwimmbewegung locken Hechte aus dem Kraut.',
    angeltipp: 'Im flachen Teichwasser sehr langsam führen, da Hechte bei warmem Wasser träger werden. Langsames Führen gibt ihnen Zeit zum Angriff.',
    fachbegriffe: [
      { term: 'Jig-Kopf', definition: 'Bleikopfhaken, der dem Köder Gewicht verleiht und eine pulsierende Auf-Ab-Bewegung ermöglicht.' },
      { term: 'Flachwasserfischen', definition: 'Angeln in seichten Bereichen bis 1,5 m Tiefe, oft mit leichteren Montagen und langsamerer Führung.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'sonnig'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine'],
    gewaesserart: ['Teich'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Sommer'],
    fischart: ['Hecht', 'Barsch'],
    tempMin: 10,
    tempMax: 25,
    basisScore: 6
  },
  {
    id: 'bait-057',
    typBezeichnung: 'Kleiner Blinker für Teich-Hecht',
    typ: 'Blinker',
    groesse: 'klein',
    farbe: 'zweifarbig',
    gewicht: 'leicht',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage mit Stahlvorfach',
    montageSchritte: [
      'Kurzes Stahlvorfach (20 cm) an Hauptschnur befestigen.',
      'Kleinen zweifarbigen Blinker über Karabiner einhängen.',
      'Blinker vertikal absinken lassen und dann gleichmäßig einwinden.',
      'Gelegentliche Stopps zum Absinken und Taumeln einbauen.'
    ],
    beschreibung: 'Kleiner zweifarbiger Blinker, der beim Taumeln Farbwechsel erzeugt. Für Hecht in Teichen sehr effektiv, da das Taumeln einen verletzten Kleinfisch imitiert.',
    angeltipp: 'Im Teich nahe am Grund fischen, wo Hechte auf eingetauchten Baumstämmen und Geröll auf Beute warten.',
    fachbegriffe: [
      { term: 'Blinker', definition: 'Metallköder, der beim Absinken und Einzug taumelt und durch Lichtreflexe Raubfische anlockt.' },
      { term: 'Taumelbewegung', definition: 'Charakteristische Schlingerbewegung eines Metallköders beim Absinken, die eine verletzte Beute imitiert.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Teich', 'See'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Herbst', 'Winter'],
    fischart: ['Hecht'],
    tempMin: 4,
    tempMax: 18,
    basisScore: 6
  },
  // =========================================================================
  // Wels – wissenschaftlich fundierte Naturköder (bait-058 – bait-063)
  // Quellen: PubMed 2024, FAO, MDPI, ResearchGate (S. glanis Diätstudien)
  // =========================================================================
  {
    id: 'bait-058',
    typBezeichnung: 'Toter Köderfisch auf Wels-Grundmontage',
    typ: 'Köderfisch',
    groesse: 'groß',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Wels-Grundmontage mit Totköder',
    montageSchritte: [
      'Starkes Vorfach (0,60–0,80 mm, 80 cm) mit Tandem-Doppelhaken aufbauen.',
      'Vorderer Haken (Gr. 2/0) hinter dem Kopf des toten Fisches platzieren.',
      'Hinterer Haken (Gr. 2/0) mittig am Körper befestigen.',
      'Schweres Laufblei (100–150 g) auf Hauptschnur – in Flussbiegungen mit wenig Strömung einsetzen.'
    ],
    beschreibung: 'Toter oder aufgetauter Köderfisch auf einer speziellen Wels-Grundmontage. Tote Fische geben intensive Duftfahnen aus Aminosäuren und Körperölen ab, die Welse über ihre Chemoreceptoren aus großer Distanz wahrnehmen. PubMed-Studie 2024 belegt: Lebend- und Totköder-Fisch erzielen vergleichbare Fangquoten bei Wels.',
    angeltipp: 'In Flussbiegungen und strömungsberuhigten Buchten einsetzen, wo sich die Duftfahne des Totköders stromabwärts ausbreitet. Welse orientieren sich hauptsächlich über Geruch und Vibration – nicht über Sicht.',
    fachbegriffe: [
      { term: 'Chemoreceptoren', definition: 'Geruchsorgane des Wels, die gelöste Aminosäuren und Körperflüssigkeiten aus toten oder verletzten Beutetieren auch aus großer Entfernung detektieren.' },
      { term: 'Totköder', definition: 'Toter Naturköder (Fisch, Fleisch), der durch intensiven Geruch nachtaktive Raubfische wie Welse anlockt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Wels'],
    tempMin: 15,
    tempMax: null,
    basisScore: 9
  },
  {
    id: 'bait-059',
    typBezeichnung: 'Lebendkrebs auf Wels-Montage',
    typ: 'Krebs',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Allrounder',
    montage: 'Krebsmontage mit Einzelhaken',
    montageSchritte: [
      'Starkes Vorfach (0,50 mm, 60 cm) mit großem Einzelhaken (Gr. 2/0–3/0) aufbauen.',
      'Haken von unten durch den Schwanzbereich des Krebses führen.',
      'Krebs bleibt beweglich – Beine und Scheren frei lassen.',
      'An felsigen Uferbereichen und Wurzeln einsetzen, wo Krebse natürlich vorkommen.'
    ],
    beschreibung: 'Lebender Flusskrebs auf einer Wels-Montage. MDPI-Studie belegt Flusskrebs als dominante Beuteart von Flusswelsen – in lотischen Gewässern (Flüssen) ist Krebs der stärkste Wels-Auslöser überhaupt. Welse lokalisieren Krebse über ihr Webersches Apparat (Vibrationssinn) und ihre Chemoreceptoren.',
    angeltipp: 'Entlang steiniger und verwurzelter Flussufer fischen, wo Krebse natürlich vorkommen. Das Kratzen und Bewegen des lebenden Krebses erzeugt Vibrationen, die Welse aus der Tiefe anziehen.',
    fachbegriffe: [
      { term: 'Webersches Apparat', definition: 'Spezialisiertes Hör- und Vibrationsorgan des Wels, das durch Knochen mit der Schwimmblase verbunden ist und niederfrequente Druckwellen aus großer Distanz wahrnimmt.' },
      { term: 'Lотisches Habitat', definition: 'Fließgewässer-Lebensraum (Flüsse, Bäche) im Gegensatz zu stehenden Gewässern; MDPI-Studien zeigen, dass Flusswelse bevorzugt Krebse und Barsche fressen.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See'],
    tiefe: ['Grund', 'Mittelwasser'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Wels'],
    tempMin: 16,
    tempMax: null,
    basisScore: 9
  },
  {
    id: 'bait-060',
    typBezeichnung: 'Froschschenkel auf Grundmontage',
    typ: 'Frosch',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Allrounder',
    montage: 'Grundmontage mit Einzelhaken',
    montageSchritte: [
      'Starkes Vorfach (0,50 mm, 50 cm) mit Einzelhaken (Gr. 2/0) aufbauen.',
      'Froschschenkel oder Frosch-Imitat am Haken befestigen.',
      'Mittleres Laufblei (50–80 g) auf Hauptschnur montieren.',
      'Ufernahe Bereiche mit Bewuchs und Schilf befischen.'
    ],
    beschreibung: 'Froschschenkel oder naturgetreues Frosch-Imitat als Wels-Köder. FAO- und ResearchGate-Quellen bestätigen Frösche und Kaulquappen als festen Bestandteil der Wels-Nahrung, besonders in flachen Uferbereichen mit Vegetation. Welse jagen aktiv in Ufernähe.',
    angeltipp: 'Im Hochsommer und Frühsommer an bewachsenen Ufern und Schilfflächen einsetzen, wo Frösche natürlich vorkommen. Abend- und Nachtansitz empfohlen.',
    fachbegriffe: [
      { term: 'Ufernähe-Jagd', definition: 'Verhalten von Welsen, die nachts entlang von Ufern und Flachwasserbereichen aktiv nach Amphibien und Kleinsäugern suchen.' },
      { term: 'Frosch-Imitat', definition: 'Kunststoff- oder Gummiköder in naturgetreuer Frosch-Form, der als legale Alternative zum lebenden Frosch eingesetzt werden kann.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend'],
    stroemung: ['keine'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Oberfläche', 'Mittelwasser', 'Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Wels'],
    tempMin: 18,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-061',
    typBezeichnung: 'Leber-Stück auf Wels-Grundhaken',
    typ: 'Leber',
    groesse: 'mittel',
    farbe: 'dunkel',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Wels-Grundmontage mit großem Einzelhaken',
    montageSchritte: [
      'Großen Einzelhaken (Gr. 3/0–4/0) an starkem Vorfach (0,60 mm, 60 cm) binden.',
      'Frisches Leberstück (5–8 cm, aus Rind oder Geflügel) auf den Haken aufziehen.',
      'Schweres Laufblei (80–120 g) auf Hauptschnur montieren.',
      'Stromabwärts von der eigenen Position einsetzen, damit Duftfahne flussabwärts zieht.'
    ],
    beschreibung: 'Frisches Leberstück auf einer Wels-Grundmontage. Leber gibt intensive Mengen an Blut, Aminosäuren und tierischen Fettsäuren ab, die Welse über ihre hochempfindlichen Chemoreceptoren aus weiter Distanz orten. Effektiv für Wels und Aal gleichermaßen.',
    angeltipp: 'Montage stromabwärts von bekannten Wels-Einständen auslegen, sodass die Duftfahne direkt zum Fisch zieht. Frische Leber wirkt besser als gefrorene – je mehr Blut, desto besser.',
    fachbegriffe: [
      { term: 'Duftfahne', definition: 'Im Wasser lösliche Geruchsstoffe (Aminosäuren, Blutproteine), die sich stromabwärts ausbreiten und Welse aus der Tiefe anlocken.' },
      { term: 'Aminosäure-Lockwirkung', definition: 'Chemisches Signal aus tierischen Proteinen, das Welse und Aale über ihre Geschmacks- und Geruchsorgane wahrnehmen und zur Nahrungsquelle führt.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Stausee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Wels', 'Aal'],
    tempMin: 14,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-062',
    typBezeichnung: 'Gänsefeder-Pose mit lebendem Köderfisch',
    typ: 'Köderfisch',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Allrounder',
    montage: 'Posenmontage mit lebendem Köderfisch',
    montageSchritte: [
      'Große Gänsefeder- oder Schluckpose auf Hauptschnur schieben.',
      'Posentiefe auf 40–80 cm unter der Oberfläche einstellen.',
      'Starkes Vorfach (0,50 mm, 40 cm) mit Einzelhaken (Gr. 1/0–2/0) anhängen.',
      'Lebenden Köderfisch (Döbel, Rotauge oder Barsch, 10–15 cm) hinter der Rückenflosse aufspießen.'
    ],
    beschreibung: 'Klassische Fluss-Wels-Methode mit lebendem Köderfisch unter einer großen Pose. Der lebende Fisch erzeugt kontinuierliche Bewegungen und Vibrationssignale, die Welse über ihr Webersches Apparat wahrnehmen. PubMed 2024: Lebendköder-Fisch ist der effektivste Welsköder ohne signifikante Unterschiede zwischen Köderarten.',
    angeltipp: 'In Flussbiegungen und unterhalb von Strukturen (Brückenpfeiler, eingestürzte Bäume) einsetzen. Die Pose zeigt durch Zittern und Eintauchen den Angriff des Wels an.',
    fachbegriffe: [
      { term: 'Gänsefeder-Pose', definition: 'Traditionelle, sehr empfindliche Pose aus einer Gänsefeder, die kleinste Bewegungen des Köders und Anbisse sichtbar macht.' },
      { term: 'Rückenflossenaufspießung', definition: 'Haken-Befestigung hinter der Rückenflosse des Köderfisches, die ihn am Leben lässt und natürlich schwimmen lässt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt'],
    tageszeit: ['Abend', 'Nacht', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See'],
    tiefe: ['Mittelwasser', 'Oberfläche'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Wels', 'Hecht', 'Zander'],
    tempMin: 14,
    tempMax: null,
    basisScore: 9
  },
  {
    id: 'bait-063',
    typBezeichnung: 'Großes Wurmbüschel auf Fluss-Wels-Montage',
    typ: 'Wurm',
    groesse: 'groß',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Schwere Strömungsmontage mit Büschel großer Würmer',
    montageSchritte: [
      'Schweres Drachenblei (100–150 g) ans Schnurende knoten – hält die Montage auch bei Strömung am Grund.',
      'Starkes Vorfach (0,60 mm, 60 cm) mit Tandem-Doppelhaken (Gr. 2/0) aufbauen.',
      'Büschel von 5–8 großen Tauwürmern dicht auf beide Haken aufziehen – maximale Geruchs- und Bewegungsreize.',
      'Im Strömungsschatten hinter Flussbiegungen, Baumstämmen oder Buhnen einsetzen.'
    ],
    beschreibung: 'Mehrere große Tauwürmer büschelartig auf einer schweren Fluss-Grundmontage. Das Büschel erzeugt eine massive Geruchswolke aus Aminosäuren und Körperflüssigkeiten, die Welse über ihre Chemoreceptoren aus großer Distanz anlockt. Bewährte Methode lokaler Flussangler – Welse fressen nachts gezielt Würmer am Flussgrund.',
    angeltipp: 'In Strömungsschatten (Flussbiegungen, hinter Baumstämmen und Buhnen) einsetzen, wo sich Welse bei Nacht auf Nahrungssuche befinden. Rute im Ständer lassen und auf Schnurzug warten.',
    fachbegriffe: [
      { term: 'Strömungsschatten', definition: 'Beruhigter Bereich direkt hinter einem Hindernis im Fließwasser, in dem Welse mit wenig Kraftaufwand auf Beute warten.' },
      { term: 'Büschel-Köder', definition: 'Mehrere Würmer oder Naturköder zu einem Bündel zusammengesteckt, das einen vielfach verstärkten Geruchs- und Bewegungsreiz erzeugt.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Wels', 'Aal'],
    tempMin: 15,
    tempMax: null,
    basisScore: 8
  },
  // =========================================================================
  // Zusätzliche fehlende Methoden (bait-064 – bait-067)
  // =========================================================================
  {
    id: 'bait-064',
    typBezeichnung: 'Lockstoff-Teig auf Schleien-Pose',
    typ: 'Teig',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Posenmontage mit Teigkugel am Grundhaken',
    montageSchritte: [
      'Empfindliche Pose auf Hauptschnur schieben, Tiefe auf 5 cm über Gewässergrund einstellen.',
      'Kleines Schrotblei (2–3 g) 25 cm über dem Haken klemmen.',
      'Feinen Haken (Gr. 10–12) an dünnem Vorfach (0,16 mm) binden.',
      'Kleine Teigkugel mit intensivem Aroma (Knoblauch, Erdbeere) fest um den Haken drücken.'
    ],
    beschreibung: 'Lockstoffreicher Teigköder auf einer feinen Posenmontage für Schleien und Karpfen. Schleien orientieren sich stark über Geruch (Chemoreception) – ein intensiv duftender Teig lockt sie auch bei trübem Wasser sicher an. Der langsam sinkende Teig bleibt im Schleien-Jagdbereich knapp über dem Grund.',
    angeltipp: 'In der Morgendämmerung und am Abend an Teich- und Seeufern mit Schilf und Wasserpflanzen einsetzen. Schleien fressen bodennah und sehr vorsichtig – feine Schnur und sensible Pose erhöhen die Bissquote.',
    fachbegriffe: [
      { term: 'Chemoreception', definition: 'Geruchsbasierte Beuteerkennung bei Bodenfischen wie Schleie und Karpfen, die Lockstoff-Köder aus mehreren Metern Entfernung wahrnehmen.' },
      { term: 'Lockstoff-Teig', definition: 'Weiche Teigmasse mit zugesetzten Aromastoffen und Duften, die sich im Wasser langsam auflöst und eine Geruchsfahne erzeugt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine'],
    gewaesserart: ['Teich', 'See'],
    tiefe: ['Grund', 'Mittelwasser'],
    jahreszeit: ['Sommer', 'Frühling'],
    fischart: ['Schleie', 'Karpfen'],
    tempMin: 14,
    tempMax: null,
    basisScore: 7
  },
  {
    id: 'bait-065',
    typBezeichnung: 'Schnecke auf Fluss-Grundmontage',
    typ: 'Schnecke',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Einfache Grundmontage mit Laufblei im Fluss',
    montageSchritte: [
      'Laufblei (30–50 g je nach Strömung) auf Hauptschnur fädeln.',
      'Stopper-Perle und Wirbel hinter dem Blei befestigen.',
      '40 cm Nylonvorfach (0,22 mm) anhängen, Haken (Gr. 8–10) binden.',
      'Kleine Schnecke (ohne Haus oder mit Haus geknackt) vollständig auf den Haken aufziehen.'
    ],
    beschreibung: 'Schnecke als Naturköder auf einer Fluss-Grundmontage. Karpfen, Rotaugen und Brachsen fressen natürlicherweise Weichtiere und Schnecken am Flussgrund. Der intensive Geruch der Schnecke und ihre schleimige Textur sind natürliche Auslöser für Bodenfische.',
    angeltipp: 'In ruhigeren Flussbereichen mit schwacher bis mittlerer Strömung nahe an bewachsenen Ufern einsetzen. Schnecken sind ortsspezifische Naturköder – besonders effektiv in Gewässern, wo sie natürlich vorkommen.',
    fachbegriffe: [
      { term: 'Weichtier-Köder', definition: 'Naturköder aus Schnecken oder Muscheln, die für Bodenfische wie Karpfen und Brachse natürliche Nahrungsquellen darstellen.' },
      { term: 'Bodenfische', definition: 'Fischarten, die bevorzugt am Gewässergrund nach Nahrung suchen, wie Karpfen, Brachse, Schleie und Rotauge.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['schwach', 'mittel'],
    gewaesserart: ['Fluss'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Karpfen', 'Rotauge', 'Brachse'],
    tempMin: 12,
    tempMax: null,
    basisScore: 5
  },
  {
    id: 'bait-066',
    typBezeichnung: 'Vertikaljig für Winter-Zander',
    typ: 'Jig',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'mittel',
    aktion: 'sinkend-langsam',
    klasse: 'Tiefenkoeder',
    montage: 'Vertikaljig vom Boot',
    montageSchritte: [
      'Leichten Jig-Kopf (8–15 g) mit kleinem Gummifisch oder Twister bestücken.',
      'Vom Boot senkrecht über dem Zanderstand positionieren.',
      'Köder bis auf Grund absinken lassen, dann sehr langsam 30–50 cm anheben.',
      'Lange Pausen von 5–10 Sekunden einbauen – Winterzander brauchen mehr Reaktionszeit.'
    ],
    beschreibung: 'Leichter Vertikaljig für das gezielte Befischen von Winter-Zanderständen vom Boot. Dank seines Tapetum lucidum (reflektierendes Augenpigment) bleibt Zander auch bei sehr schwachem Winterlicht und in tiefen, dunklen Gewässerbereichen aktiv und sehfähig. Helle Köderfarben erhöhen die Sichtbarkeit in der Tiefe.',
    angeltipp: 'Im Winter Echolot nutzen, um exakte Zanderstände in 6–12 m Tiefe zu lokalisieren. Sehr langsame Präsentation ist entscheidend – Zander im Kaltwasser sind träge und reagieren auf schnelle Köder nicht.',
    fachbegriffe: [
      { term: 'Tapetum lucidum', definition: 'Reflektierendes Pigment hinter der Netzhaut des Zanderauges, das einfallendes Licht verdoppelt und dem Zander hervorragendes Sehvermögen bei sehr wenig Licht verleiht.' },
      { term: 'Vertikalangeln', definition: 'Angeltechnik vom Boot, bei der der Köder senkrecht unter dem Boot präsentiert wird; ideal für winterliche Tiefenwasser-Raubfische.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['See', 'Stausee', 'Fluss'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Winter'],
    fischart: ['Zander', 'Barsch'],
    tempMin: null,
    tempMax: 10,
    basisScore: 8
  },
  {
    id: 'bait-067',
    typBezeichnung: 'Maden auf Posenmontage für Winter-Rotauge',
    typ: 'Maden',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Allrounder',
    montage: 'Feine Posenmontage mit Madenköder',
    montageSchritte: [
      'Empfindliche Schiebpose auf Hauptschnur fädeln.',
      'Posenstopper 50 cm über dem Gewässergrund setzen.',
      'Kleines Schrotblei (1–2 g) 25 cm über feinem Haken (Gr. 16–18) klemmen.',
      '2–3 lebende Maden büschelartig auf den kleinen Haken aufziehen.'
    ],
    beschreibung: 'Lebende Maden unter der Pose für Rotaugen und Weißfische im Winter. Maden sind für das Kaltwasserangeln nachgewiesen effektiv – sie bleiben auch bei niedrigen Temperaturen aktiv und erzeugen im Wasser Bewegungsreize. Rotauge ist ganzjährig aktiv und schlägt auf feine Madenpräsentationen besonders gut an.',
    angeltipp: 'Im Winter sehr fein angeln: dünne Schnur (0,12–0,14 mm), kleine Haken, minimale Anfütterung. Rotaugen im Kaltwasser fressen zögerlich – lange Bisswartezeiten einplanen.',
    fachbegriffe: [
      { term: 'Kaltwasser-Aktivität', definition: 'Fähigkeit von Rotauge und anderen Weißfischen, auch bei Wassertemperaturen unter 5°C aktiv zu fressen, im Gegensatz zu Warmwasserarten wie Karpfen oder Wels.' },
      { term: 'Feinstangel-Methode', definition: 'Fischerei mit sehr dünner Schnur, kleinen Haken und winzigen Ködern für scheue und träge Winterfische; erfordert höchste Sensibilität bei Bisserkennung und Drill.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Fluss', 'See', 'Teich'],
    tiefe: ['Mittelwasser', 'Oberfläche'],
    jahreszeit: ['Winter', 'Frühling'],
    fischart: ['Rotauge', 'Brachse', 'Schleie'],
    tempMin: null,
    tempMax: 10,
    basisScore: 6
  },


  // =========================================================================
  // Wehr – spezifische Einträge (bait-068 – bait-071)
  // =========================================================================
  {
    id: 'bait-068',
    typBezeichnung: 'Kleiner silberner Spinner für Strömungsschatten',
    typ: 'Spinner',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage',
    montageSchritte: [
      'Spinner mit Palstek-Knoten an die Hauptschnur binden.',
      'Blattschaufelrotation im Wasser prüfen.',
      'Unterhalb des Wehrs quer zur Strömung einwerfen.',
      'Köder mit gleichmäßigem schnellen Einzug durch den Strömungsschatten führen.'
    ],
    beschreibung: 'Kleiner Silberspinner für das Angeln direkt unterhalb von Wehren. Das gut belüftete, sauerstoffreiche Wasser unterhalb des Wehrsturzes zieht Forellen und Barsche in Scharen an – der Spinner imitiert dort treibende Kleinfische.',
    angeltipp: 'Köder vom Strömungsschatten aus ins turbulente Wasser direkt am Wehrsturz führen. Forellen stehen oft millimetergenau an der Grenze zwischen ruhigem und schnellem Wasser.',
    fachbegriffe: [
      { term: 'Wehrsturz', definition: 'Die Stelle, an der das Wasser über die Wehrkante fällt und durch Lufteintrag stark sauerstoffangereicht wird – ein bevorzugter Aufenthaltsort für Raubfische.' },
      { term: 'Strömungsschatten', definition: 'Strömungsberuhigter Bereich direkt hinter oder unterhalb eines Hindernisses, in dem Fische mit wenig Kraftaufwand auf Beute warten.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Forelle', 'Barsch'],
    tempMin: 8,
    tempMax: 22,
    basisScore: 8
  },
  {
    id: 'bait-069',
    typBezeichnung: 'Naturwurm auf schwerer Strömungs-Grundmontage',
    typ: 'Wurm',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Grundmontage mit Drachenblei am Wehr',
    montageSchritte: [
      'Schweres Drachenblei (60–100 g) ans Schnurende knoten – hält gegen die Wehrabströmung.',
      '50 cm starkes Vorfach (0,30 mm) am Blei befestigen.',
      'Haken (Gr. 6–8) mit einem großen Naturwurm vollständig aufziehen.',
      'Montage direkt im Strömungsschatten unterhalb des Wehrs einsetzen.'
    ],
    beschreibung: 'Naturwurm auf einer schweren Grundmontage für das Angeln im Strömungsschatten unterhalb von Wehren. Das turbulente Wasser schwemmt natürliche Beute heran – Barsch, Zander und Rotauge sammeln sich in diesen strömungsberuhigten Zonen.',
    angeltipp: 'Montage direkt hinter dem Wehrsturz einsetzen, wo die Strömung nachlässt. Kurze Vorfachlänge wählen, damit der Köder am Grund bleibt und nicht von der Strömung wegtreibt.',
    fachbegriffe: [
      { term: 'Drachenblei', definition: 'Spezielle Bleigewicht-Form mit abstehenden Armen, die sich im Flussboden verankert und starker Strömung widersteht.' },
      { term: 'Abströmung', definition: 'Der Bereich unterhalb eines Wehrs, in dem das abfallende Wasser Turbulenzen und strömungsberuhigte Zonen erzeugt.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr'],
    tiefe: ['Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
    fischart: ['Barsch', 'Zander', 'Rotauge', 'Brachse'],
    tempMin: null,
    tempMax: null,
    basisScore: 7
  },
  {
    id: 'bait-070',
    typBezeichnung: 'Mittlerer Tauchwobbler für Strömungskolk',
    typ: 'Wobbler',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Stahlvorfach-Montage mit Karabiner',
    montageSchritte: [
      'Stahlvorfach (25 cm) an Hauptschnur befestigen.',
      'Wobbler über Karabiner einhängen.',
      'Knapp oberhalb des Wehrsturzes einwerfen, Köder stromab treiben lassen.',
      'Einzugtempo der Strömungsstärke anpassen – langsam halten gegen die Strömung.'
    ],
    beschreibung: 'Naturgetreuer Tauchwobbler für Zander und Hecht, die sich im tiefen Wasser unterhalb von Wehren sammeln. Das sauerstoffreiche Wasser und die konzentrierten Weißfische machen Wehre zu Brennpunkten für Raubfische, besonders in den Übergangszeiten.',
    angeltipp: 'Wobbler stromauf über den Kolk (tiefe Mulde unterhalb des Wehrsturzes) einwerfen und mit der Strömung abtreiben lassen – natürlichere Köderführung als gegen die Strömung.',
    fachbegriffe: [
      { term: 'Kolk', definition: 'Tiefe Auskolkung im Flussbett direkt unterhalb eines Wehrsturzes, die durch die Energie des fallenden Wassers ausgespült wird und Raubfischen Deckung bietet.' },
      { term: 'Sauerstoffanreicherung', definition: 'Durch den Lufteintrag am Wehrsturz entsteht besonders sauerstoffreiches Wasser, das Fische, besonders Forellen und Barsche, anzieht.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Herbst'],
    fischart: ['Zander', 'Hecht', 'Barsch'],
    tempMin: 5,
    tempMax: 18,
    basisScore: 8
  },
  {
    id: 'bait-071',
    typBezeichnung: 'Maden-Büschel auf schwerem Feeder im Strömungsschatten',
    typ: 'Maden',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Feeder-Montage für Wehr-Weißfische',
    montageSchritte: [
      'Feederkorb (30–50 g, schwerer Modell) mit Maden und Lockfutter füllen.',
      'Im Strömungsschatten direkt hinter dem Wehrsturz einsetzen.',
      'Kurzes Vorfach (20 cm, 0,16 mm) mit feinem Haken (Gr. 16–18) anhängen.',
      '4–5 Maden auf den Haken aufziehen und warten.'
    ],
    beschreibung: 'Maden auf einer schweren Feeder-Montage für die ergiebigen Weißfischstände unterhalb von Wehren. Rotaugen, Brachsen und Döbel sammeln sich in Scharen im Strömungsschatten, um durch die Strömung herantransportiertes Futter aufzunehmen.',
    angeltipp: 'Das Lockfutter aus dem Feeder erzeugt eine Duftspur, die stromabwärts zieht und Weißfische anzieht. Im Wehr oft auch größere Barsche und Zander als Beifang möglich.',
    fachbegriffe: [
      { term: 'Weißfischstand', definition: 'Konzentration von Friedfischen (Rotauge, Brachse, Döbel) an einem strömungsgeschützten Bereich, der reich an Nahrung ist.' },
      { term: 'Feeder-Montage', definition: 'Grundmontage mit Futterbehälter (Feederkorb), der beim Aufprall Lockstoff und Futter abgibt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen', 'sonnig'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr'],
    tiefe: ['Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Rotauge', 'Brachse', 'Barsch'],
    tempMin: 8,
    tempMax: null,
    basisScore: 7
  },


  // =========================================================================
  // Wehr – spezifische Einträge (bait-072 – bait-081)
  // =========================================================================
  {
    id: 'bait-072',
    typBezeichnung: 'Treibende Stickpose mit Maden (Trotting-Methode)',
    typ: 'Maden',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Allrounder',
    montage: 'Stickpose-Trotting-Montage',
    montageSchritte: [
      'Stickpose so balancieren, dass sie aufrecht im Wasser steht.',
      'Tiefe auf 30–60 cm einstellen.',
      'Maden büschelartig auf feinen Haken (Gr. 16–18) aufziehen.',
      'Pose mit der Strömung natürlich driften lassen – keine aktive Führung.'
    ],
    beschreibung: 'Die klassische Trotting-Methode am Wehr: Eine Stickpose driftet mit der Strömungsnaht durch den Übergangsbereich zwischen ruhigem und schnellem Wasser. Rotaugen, Barsche und Brachsen stehen genau in diesem Grenzbereich und nehmen natürlich treibende Maden bereitwillig.',
    angeltipp: 'Pose entlang der Strömungsnaht treiben lassen – nicht bremsen. Rotaugen reagieren auf natürlich treibende Köder deutlich besser als auf gebremste oder aktiv geführte.',
    fachbegriffe: [
      { term: 'Trotting', definition: 'Englische Posenmethode, bei der die Pose mit der natürlichen Strömung driftet und den Köder ungebremst durch die Strömungsnaht trägt.' },
      { term: 'Strömungsnaht', definition: 'Grenzbereich zwischen schneller und langsamer Strömung, in dem sich Fische mit minimalem Kraftaufwand aufhalten und auf Nahrung warten.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr', 'Fluss'],
    tiefe: ['Mittelwasser', 'Oberfläche'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Rotauge', 'Barsch', 'Brachse'],
    tempMin: 8,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-073',
    typBezeichnung: 'Brotflocke auf Grundmontage im Strömungsschatten',
    typ: 'Brot',
    groesse: 'mittel',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Einfache Grundmontage mit Laufblei',
    montageSchritte: [
      'Laufblei (30–50 g) auf Hauptschnur fädeln, Stopper und Wirbel dahinter.',
      '50 cm Nylonvorfach (0,20 mm) mit Haken (Gr. 10–12) anhängen.',
      'Frische Brotflocke locker aber fest genug um den Haken drücken.',
      'Im Strömungsschatten unterhalb des Wehrs einsetzen.'
    ],
    beschreibung: 'Weißbrot-Flocke auf einer einfachen Grundmontage am Wehrpool. Brot gibt im Wasser eine weißliche Lockwolke ab, die Rotaugen, Brachsen und Karpfen aus der Strömung heranlockt. Besonders in der kühlen Jahreszeit ein verlässlicher Klassiker.',
    angeltipp: 'Brot gibt im Wasser eine weiße Lockwolke ab, die den Strom hinuntertreibt und Fische anzieht. Frisches Weißbrot vom Vortag verwenden – zu altes Brot löst sich zu schnell auf.',
    fachbegriffe: [
      { term: 'Brotflocke', definition: 'Stück Weißbrot, das locker um den Haken gedrückt wird und sich im Wasser langsam auflöst, dabei eine weißliche Wolke erzeugend.' },
      { term: 'Lockwolke', definition: 'Weißliche Trübung, die durch Brot oder andere weiche Köder im Wasser entsteht und Friedfische über den Sehsinn anlockt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr', 'Fluss'],
    tiefe: ['Grund'],
    jahreszeit: ['Herbst', 'Winter', 'Frühling'],
    fischart: ['Rotauge', 'Brachse', 'Karpfen'],
    tempMin: null,
    tempMax: null,
    basisScore: 6
  },
  {
    id: 'bait-074',
    typBezeichnung: 'Halibut-Pellet auf Feeder im Strömungsschatten',
    typ: 'Pellet',
    groesse: 'mittel',
    farbe: 'dunkel',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Feeder-Montage mit schwerem Futterkorb',
    montageSchritte: [
      'Schweren Feederkorb (40–60 g) mit eingeweichten Halibut-Pellets befüllen.',
      'Feederkorb auf Laufmontage an Hauptschnur befestigen.',
      'Kurzes Vorfach (20–25 cm, 0,22 mm) mit Haken (Gr. 10–12) anhängen.',
      'Halibut-Pellet auf Hair-Rig oder direkt auf Haken montieren.'
    ],
    beschreibung: 'Ölreiche Halibut-Pellets auf einer schweren Feeder-Montage für das Angeln im Wehrpool. Halibut-Pellets sind dicht und ölig und halten auch in starker Strömung am Haken. Das intensive Heilbutt-Ölaroma zieht Karpfen und Brachsen aus großer Entfernung an.',
    angeltipp: 'Halibut-Pellets bleiben wegen ihrer öligen Dichte auch in starker Strömung am Haken – kein Aufweichen notwendig. Im Wehr nahe dem Strömungsschatten einsetzen.',
    fachbegriffe: [
      { term: 'Halibut-Pellet', definition: 'Hochöl-Pellet aus Heilbutt-Mehl mit sehr hoher Öldichte, das strömungsfest ist und ein intensives Lockstoff-Aroma im Wasser freisetzt.' },
      { term: 'Offener Feeder', definition: 'Futterkorb mit offenen Enden, der Groundbait und Pellets langsam ins Wasser abgibt und eine anhaltende Lockwirkung erzeugt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'sonnig'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr', 'Fluss'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst', 'Frühling'],
    fischart: ['Karpfen', 'Brachse', 'Rotauge'],
    tempMin: 12,
    tempMax: null,
    basisScore: 7
  },
  {
    id: 'bait-075',
    typBezeichnung: 'Gummifisch im tiefen Strömungskolk',
    typ: 'Gummifisch',
    groesse: 'mittel',
    farbe: 'naturfarben',
    gewicht: 'schwer',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Schwere Jig-Kopf-Montage für Kolk',
    montageSchritte: [
      'Schweren Jig-Kopf (15–25 g) für die Kolktiefe wählen.',
      'Gummifisch mittig auf den Jighaken aufziehen, Hakenspitze freilassen.',
      'Montage direkt in den Kolk einwerfen und bis auf Grund absinken lassen.',
      'Sehr langsame Bodenführung mit langen Pausen – Zander und Hecht reagieren auf minimale Bewegung.'
    ],
    beschreibung: 'Mittlerer Gummifisch auf schwerem Jig-Kopf für die tiefe Kolkmulde direkt unterhalb des Wehrsturzes. Im Kolk warten Zander, Hecht und Barsch passiv auf abgeschwächte Beutefische – eine langsame Bodenpräsentation ist hier entscheidend.',
    angeltipp: 'Im Kolk warten Zander und Hecht passiv auf geschwächte Beute – langsame Bodenpräsentation mit Bodenkontakt ist hier der Schlüssel. Schnelle Führung wird oft ignoriert.',
    fachbegriffe: [
      { term: 'Kolk', definition: 'Tiefe, ausgekolkte Mulde direkt unterhalb des Wehrsturzes, die durch die Energie des fallenden Wassers entstanden ist und als Sammelbecken für Raubfische dient.' },
      { term: 'Bodenkontakt', definition: 'Führungstechnik, bei der der Köder den Grund regelmäßig berührt, um Beutefischen am Boden zu imitieren und Raubfische zum Angriff zu verleiten.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen', 'Wind'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend', 'Nacht'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Wehr'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Herbst', 'Winter', 'Frühling'],
    fischart: ['Zander', 'Barsch', 'Hecht'],
    tempMin: null,
    tempMax: 18,
    basisScore: 8
  },
  {
    id: 'bait-076',
    typBezeichnung: 'Großer Jerkbait für Hecht im Strömungskolk',
    typ: 'Jerkbait',
    groesse: 'groß',
    farbe: 'zweifarbig',
    gewicht: 'schwer',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Stahlvorfach-Montage für Jerkbait',
    montageSchritte: [
      'Stahlvorfach (30 cm, min. 20 kg) mit Schlaufenknoten an Hauptschnur befestigen.',
      'Jerkbait über stabilen Karabiner einhängen.',
      'Montage in den Kolk oder Strömungsschatten einwerfen.',
      'Ruckartige Rutenbewegungen mit langen Pausen – Hecht wartet auf die Pause.'
    ],
    beschreibung: 'Großer zweifarbiger Jerkbait für Hechte, die sich im kühlen, sauerstoffreichen Wasser unterhalb von Wehren sammeln. Im Sommer zieht sich der Hecht bevorzugt in diese gut belüfteten Wehrbereiche zurück – ein großer Köder provoziert hier Reflexangriffe.',
    angeltipp: 'Im Sommer zieht sich der Hecht in das kühle, sauerstoffreiche Wasser unterhalb des Wehrs zurück – ideal für Großköder. Lange Pausen nach jedem Ruck einbauen.',
    fachbegriffe: [
      { term: 'Sauerstoffreiches Wasser', definition: 'Durch den Lufteintrag am Wehrsturz entsteht O2-reiches Wasser, das Hechte im Sommer anzieht, da sie Kühlung und hohen Sauerstoffgehalt bevorzugen.' },
      { term: 'Jerkbait', definition: 'Kunstköder ohne Eigenaktion, der durch ruckartige Rutenbewegungen geführt wird und dabei unberechenbare Taumelbewegungen ausführt.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Wind'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Wehr'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Hecht'],
    tempMin: 14,
    tempMax: null,
    basisScore: 7
  },
  {
    id: 'bait-077',
    typBezeichnung: 'Aal-Grundmontage im Strömungspool',
    typ: 'Wurm',
    groesse: 'groß',
    farbe: 'dunkel',
    gewicht: 'schwer',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Wels/Aal-Grundmontage mit Tandem-Haken im Strömungsschatten',
    montageSchritte: [
      'Schweres Drachenblei (60–100 g) ans Schnurende knoten.',
      '60 cm starkes Nylonvorfach (0,35 mm) am Blei befestigen.',
      'Tandem-Haken-Rig aufbauen: Haken 1 am Kopf, Haken 2 in der Mitte des Wurms.',
      'Montage im Strömungsschatten am Rand des Wehrkessels auslegen.'
    ],
    beschreibung: 'Großer dunkler Wurm auf einer Tandem-Haken-Grundmontage für Aale und Welse im Strömungsschatten des Wehrkessels. Aale nutzen nachts die beruhigten Randzonen des Wehrpools und nehmen große Würmer bereitwillig.',
    angeltipp: 'Aale und Welse nutzen nachts die beruhigten Randzonen des Wehrkessels – Montage neben dem Hauptstrom im Strömungsschatten platzieren. Bei Einbruch der Dunkelheit auslegen.',
    fachbegriffe: [
      { term: 'Wehrkessel', definition: 'Beckenartiger Bereich unterhalb des Wehrsturzes mit turbulenter Mitte und beruhigten Rändern, in denen Aale und Welse nachts Nahrung suchen.' },
      { term: 'Tandem-Haken', definition: 'Montage mit zwei hintereinander geschalteten Haken auf einem Vorfach, um lange Würmer vollständig zu befestigen und die Hakquote zu erhöhen.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Wehr'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Aal', 'Wels'],
    tempMin: 14,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-078',
    typBezeichnung: 'Stinkköder (Leberstück) im Strömungsschatten für Wels',
    typ: 'Leber',
    groesse: 'mittel',
    farbe: 'dunkel',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Schwere Wels-Grundmontage im Strömungsschatten des Wehrs',
    montageSchritte: [
      'Schweres Blei (80–120 g) an starkes Monofilament (0,50 mm) knoten.',
      'Kurzes Stahlvorfach (20 cm) mit großem Einzelhaken (Gr. 2/0–4/0) anhängen.',
      'Frisches Leberstück fest auf den Haken aufziehen, Spitze freilassen.',
      'Montage im Strömungsschatten am Rand des Wehrkessels flach am Grund platzieren.'
    ],
    beschreibung: 'Frisches Leberstück als Stinkköder auf einer schweren Wels-Grundmontage im Randbereich des Wehrkessels. Welse sammeln sich unterhalb von Wehren wegen der hohen Beutefischdichte – frische Leber gibt eine intensive Duftfahne ab, die Welse über den Geruchssinn anlockt.',
    angeltipp: 'Frische Leber gibt im beruhigten Randbereich des Wehrkessels eine intensive Duftfahne ab – Welse sammeln sich im Wehr wegen der hohen Beutefischdichte. Nur nachts oder bei Einbruch der Dämmerung einsetzen.',
    fachbegriffe: [
      { term: 'Stinkköder', definition: 'Intensiv riechender Naturköder wie Leber, Käse oder Innereien, der Welse und Aale über den Geruchssinn aus großer Entfernung anlockt.' },
      { term: 'Beutefischdichte', definition: 'Hohe Konzentration von Weißfischen unterhalb von Wehren, die Raubfische wie Wels und Hecht als Nahrungsquelle anzieht.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Nacht', 'Abend', 'Morgengrauen'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Wehr'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Wels'],
    tempMin: 18,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-079',
    typBezeichnung: 'Kleiner Gummiwurm Drop-Shot im Strömungsschatten für Barsch',
    typ: 'Gummiwurm',
    groesse: 'klein',
    farbe: 'auffällig',
    gewicht: 'leicht',
    aktion: 'pulsierend',
    klasse: 'Tiefenkoeder',
    montage: 'Drop-Shot-Montage im Kolk',
    montageSchritte: [
      'Drop-Shot-Haken (Gr. 4–6) 30–40 cm über dem Blei mit Palomar-Knoten binden.',
      'Kleinen auffälligen Gummiwurm waagerecht auf den Haken montieren.',
      'Blei (8–12 g) ans Schnurende knoten.',
      'Montage in den Kolk einwerfen und senkrecht über dem Fischstand halten.'
    ],
    beschreibung: 'Kleiner auffälliger Gummiwurm in der Drop-Shot-Montage für Barschschwärme im Kolk unterhalb des Wehrs. Barsche sammeln sich in dieser tiefen Mulde und reagieren auf eine exakt in ihrer Aufenthaltszone präsentierte Drop-Shot-Montage sehr gut.',
    angeltipp: 'Barsche sammeln sich im Kolk unterhalb des Wehrsturzes – Drop-Shot präsentiert den Köder exakt in ihrer Aufenthaltszone. Köder minimal bewegen, nicht absetzen lassen.',
    fachbegriffe: [
      { term: 'Drop-Shot', definition: 'Montagetechnik bei der Haken und Köder oberhalb des Bodenbleis hängen und der Köder ortsfest und nahezu bewegungslos präsentiert wird.' },
      { term: 'Ansammlung', definition: 'Konzentration von Barschschwärmen in tieferen, strömungsberuhigten Bereichen wie dem Wehr-Kolk, wo sie passiv auf Beute warten.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Wehr'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Barsch', 'Zander'],
    tempMin: 8,
    tempMax: 25,
    basisScore: 7
  },
  {
    id: 'bait-080',
    typBezeichnung: 'Lebendköder-Pose (schwebender Köderfisch) an Strömungsgrenze',
    typ: 'Köderfisch',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Allrounder',
    montage: 'Posenmontage mit lebendem Köderfisch am Wehrrand',
    montageSchritte: [
      'Schwimmpose für das Gewicht des Köderfisches einstellen.',
      'Stahlvorfach (20 cm) mit Doppelhaken-Rig anhängen.',
      'Kleinen lebenden Köderfisch am Rücken oder durch die Lippe einhaken.',
      'Montage im Strömungsschatten nahe dem Wehrrand absetzen.'
    ],
    beschreibung: 'Lebender kleiner Köderfisch unter der Pose im ruhigen Randbereich des Wehrpools. Hecht und Zander lauern im Wehr auf durch den Strom geschwächte Weißfische – ein lebender Köderfisch ist die natürlichste Köderform und löst sofortige Angriffe aus.',
    angeltipp: 'Im Wehr lauern Hecht und Zander auf durch den Strom geschwächte Weißfische – ein lebender kleiner Rotauge oder Barsch ist der natürlichste Köder und löst sofortige Reaktionen aus.',
    fachbegriffe: [
      { term: 'Köderfisch', definition: 'Lebender kleiner Fisch (meist Rotauge oder Barsch), der als natürlicher Köder für Raubfische wie Hecht, Zander und Wels eingesetzt wird.' },
      { term: 'Wehrabströmung', definition: 'Bereich unterhalb des Wehrs, in dem Weißfische mit dem Strom angeschwemmt werden und geschwächt als leichte Beute für Raubfische zur Verfügung stehen.' }
    ],
    wetter: ['bedeckt', 'leicht bewölkt', 'Regen'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Wehr'],
    tiefe: ['Mittelwasser', 'Oberfläche'],
    jahreszeit: ['Herbst', 'Sommer'],
    fischart: ['Hecht', 'Zander', 'Wels'],
    tempMin: 12,
    tempMax: null,
    basisScore: 8
  },
  {
    id: 'bait-081',
    typBezeichnung: 'Trocken- und Nassfliege an Strömungsnaht für Forelle',
    typ: 'Nymphe',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Allrounder',
    montage: 'Posenmontage mit Nassfliegenimitat im Wehr-Strömungskanal',
    montageSchritte: [
      'Dünne Fliegenschnur oder feines Monofilament (0,14–0,16 mm) aufspulen.',
      'Nassfliegen-Imitat direkt ans Schnurende binden (kein Wirbel).',
      'Köder direkt oberhalb des Wehrsturzes in den Strömungskanal einwerfen.',
      'Fliege mit der Strömung natürlich durch die Strömungsnaht driften lassen.'
    ],
    beschreibung: 'Nassfliegen-Imitat auf feiner Schnur für Forellen, die direkt in der Strömungsnaht am Wehrsturz stehen und vorbeitreibende Insekten nehmen. Das sauerstoffreiche, kühle Wasser unterhalb von Wehren ist idealer Forellenlebensraum – eine natürlich driftende Nymphe ist hier besonders effektiv.',
    angeltipp: 'Forellen stehen direkt in der Strömungsnaht am Wehrsturz und nehmen vorbeitreibende Insekten – Nymphe oder Nassfliege direkt ins turbulente Wasser einwerfen und treiben lassen.',
    fachbegriffe: [
      { term: 'Nassfliege', definition: 'Fliegenmuster, das unter der Wasseroberfläche geführt wird und ertränkte oder tauchende Insekten imitiert, besonders effektiv in Strömungsbereichen.' },
      { term: 'Strömungsnaht', definition: 'Grenzbereich zwischen dem schnellen Hauptstrom und dem beruhigten Wasser dahinter, bevorzugter Aufenthaltsort für Forellen, die auf treibende Insekten warten.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Wehr'],
    tiefe: ['Mittelwasser', 'Oberfläche'],
    jahreszeit: ['Frühling', 'Sommer'],
    fischart: ['Forelle', 'Barsch'],
    tempMin: 8,
    tempMax: 22,
    basisScore: 7
  },

  // =========================================================================
  // Bergsee – spezifische Einträge (bait-082 – bait-089)
  // Wissenschaftliche Grundlage: FishBase (Salvelinus umbla Tiefenhabitat),
  // Nature.com (Salmo trutta Temperaturverhalten), Springer (alpine lake food webs)
  // =========================================================================
  {
    id: 'bait-082',
    typBezeichnung: 'Kleiner silberner Tiefenlöffel für Bergsee',
    typ: 'Löffel',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'schwer',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Schwere Grundmontage für Bergsee-Tiefen',
    montageSchritte: [
      'Hauptschnur (0,20 mm Mono oder PE 0,8) auf Rolle spulen.',
      'Dreiwegewirbel ans Schnurende knoten.',
      'Am unteren Öse: 30–50 cm Stahl- oder Fluorocarbon-Vorfach (0,22 mm) mit Löffel einhängen.',
      'Am seitlichen Öse: 20–30 cm Bleiabzug mit schwerem Blei (15–25 g) befestigen.',
      'Montage langsam auf Zieltiefe (10–30 m) ablassen und gelegentlich anheben.'
    ],
    beschreibung: 'Kleiner, stark glänzender Metalllöffel für die Tiefenzonen (10–30 m) von Bergseen. Seesaiblinge und Tiefenforellen halten sich im Sommer unter der Thermokline auf und reagieren gut auf langsam taumelnde Blinker, die Kleinfische imitieren.',
    angeltipp: 'Löffel langsam und gleichmässig durch die Tiefenzone führen. Bei Seesaiblingen empfiehlt sich eine Präsentation direkt über dem Grund in 15–25 m Tiefe.',
    fachbegriffe: [
      { term: 'Thermokline', definition: 'Temperatursprungschicht im stehenden Gewässer, unterhalb derer die Wassertemperatur abrupt abfällt. Seesaiblinge halten sich im Sommer bevorzugt in diesen kalten Tiefenzonen auf.' },
      { term: 'Löffel', definition: 'Metallköder mit konkaver Form, der beim Einzug eine taumelnde Bewegung ausführt und Kleinfische imitiert.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Bergsee'],
    tiefe: ['Grund', 'Mittelwasser'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Forelle'],
    tempMin: 4,
    tempMax: 14,
    basisScore: 8
  },
  {
    id: 'bait-083',
    typBezeichnung: 'Kleiner olivgrüner Spinner für Bergsee-Einläufe',
    typ: 'Spinner',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage ohne Vorfach',
    montageSchritte: [
      'Spinner mit Palstek-Knoten an Fluorocarbon-Hauptschnur (0,18 mm) binden.',
      'An Einläufen oder Flachwasserzonen (≤2 m) quer zum Ufer einwerfen.',
      'Gleichmässig mit mittlerem Tempo einrollen – Blattschaufel muss rotieren.',
      'Verschiedene Tiefen durch Zählen beim Absinken variieren.'
    ],
    beschreibung: 'Kleiner Spinner in gedeckten Naturtönen für Bachforellen an Bergsee-Einläufen und Flachwasserzonen. Das sehr klare Wasser der Bergseen erfordert natürliche Farben und kleine Ködergrößen – auffällige Farben schrecken scheue Forellen ab.',
    angeltipp: 'An Einläufen und Zuflüssen wirft die Forelle im Sommer bevorzugt auf kleine, naturgetreue Köder. Leise Bewegungen am Ufer sind entscheidend.',
    fachbegriffe: [
      { term: 'Oligotroph', definition: 'Nährstoffarm; Bergseen sind typischerweise oligotroph, was klares Wasser, wenig Plankton und scheue Fische bedeutet.' },
      { term: 'Einlauf', definition: 'Zufluss eines Bachs oder Baches in einen See; sauerstoffreiches, nahrungsreiches Wasser zieht Forellen an.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Bergsee'],
    tiefe: ['Oberfläche', 'Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Forelle'],
    tempMin: 4,
    tempMax: 16,
    basisScore: 8
  },
  {
    id: 'bait-084',
    typBezeichnung: 'Naturfarbene Nymphe für Bergsee',
    typ: 'Nymphe',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Tiefenkoeder',
    montage: 'Fliegenfischen-Montage mit sinkender Schnur',
    montageSchritte: [
      'Fliegenschnur (sinkend, Klasse 3–5) auf Fliegenrute aufsetzen.',
      'Fluorocarbon-Vorfach (1,5–2 m, 0,14 mm) mit Doppelknotentechnik befestigen.',
      'Nymphe (Hakengrösse 14–18) am Vorfach binden.',
      'Kurze, präzise Würfe an Einläufe und sichtbare Forellen.',
      'Nymphe langsam sinken lassen und Leinenbewegungen beobachten.'
    ],
    beschreibung: 'Naturgetreues Nymphenimitat für das Fliegenfischen in Bergseen. Forellen jagen in klaren, nährstoffarmen Bergseen bevorzugt an Einläufen und überfluteten Bereichen nach Wasserinsekten – eine Nymphe in natürlichen Farben ist hier besonders effektiv.',
    angeltipp: 'In Bergseen geben Forellen den Biss kaum preis – auf minimale Leinenbewegungen achten. Eine sinkende Fliegenschnur hilft, die Nymphe in die gewünschte Tiefe zu bringen.',
    fachbegriffe: [
      { term: 'Nymphe', definition: 'Fliegenmuster, das das Unterwasserstadium eines Wasserinsekts imitiert; sinkend präsentiert, direkt im oder unter dem Wasserspiegel.' },
      { term: 'Fluorocarbon', definition: 'Nahezu unsichtbares Schnurmaterial mit ähnlichem Brechungsindex wie Wasser, besonders wertvoll im klaren Wasser von Bergseen.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Bergsee'],
    tiefe: ['Oberfläche', 'Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Forelle'],
    tempMin: 4,
    tempMax: 18,
    basisScore: 7
  },
  {
    id: 'bait-085',
    typBezeichnung: 'Schwerer Pilker für Bergsee-Tiefensaiblinge',
    typ: 'Pilker',
    groesse: 'mittel',
    farbe: 'hell',
    gewicht: 'schwer',
    aktion: 'sinkend-langsam',
    klasse: 'Tiefenkoeder',
    montage: 'Pilker-Grundmontage für Tiefenzonen',
    montageSchritte: [
      'Hauptschnur (PE 0,6–0,8) durch Rutenringe führen.',
      'Pilker (15–25 g) direkt an die Hauptschnur klippen oder knoten.',
      'Auf Zieltiefe (15–25 m) absinken lassen.',
      'Pilker rhythmisch 30–50 cm anheben und wieder sinken lassen.',
      'Biss erfolgt oft beim Absinken.'
    ],
    beschreibung: 'Schlanker, schwerer Metalljig für die Tiefenzonen von Bergseen. Seesaiblinge (*Salvelinus umbla*) bevorzugen im Sommer die kalten Zonen unter der Thermokline in 15–30 m Tiefe und reagieren gut auf vertikal geführte, glänzende Köder.',
    angeltipp: 'Seesaiblinge stehen oft in Schwärmen. Wenn ein Biss erzielt wird, sofort wieder auf dieselbe Tiefe absenken für schnelle Folgefänge. Boot oder Belly-Boot empfohlen.',
    fachbegriffe: [
      { term: 'Pilker', definition: 'Schlanker, schwerer Metallköder für das Tiefenfischen; vertikal geführt, ahmt taumelnde Kleinfische nach.' },
      { term: 'Seesaibling', definition: 'Salmonide (*Salvelinus umbla*) der tiefen Alpenseen; hält sich im Sommer bevorzugt unter der Thermokline in 10–30 m Tiefe auf.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Bergsee'],
    tiefe: ['Grund'],
    jahreszeit: ['Sommer'],
    fischart: ['Forelle'],
    tempMin: 4,
    tempMax: 12,
    basisScore: 9
  },
  {
    id: 'bait-086',
    typBezeichnung: 'Kleiner Naturwurm auf leichter Bergsee-Grundmontage',
    typ: 'Wurm',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'mittel',
    aktion: 'langsam',
    klasse: 'Grundmontage-Koeder',
    montage: 'Leichte Grundmontage für Bergsee',
    montageSchritte: [
      'Fluorocarbon-Hauptschnur (0,18–0,20 mm) wählen.',
      'Laufendes Blei (10–15 g) auf die Schnur fädeln, Blei-Stopper setzen.',
      '60–80 cm Fluorocarbon-Vorfach (0,14–0,16 mm) mit kleinem Haken (Gr. 8–10) anhängen.',
      'Frischen Naturwurm vollständig aufziehen.',
      'Montage langsam auf Grund ablassen; gelegentlich leicht anheben.'
    ],
    beschreibung: 'Kleiner Naturwurm auf einer leichten Grundmontage für das Angeln in Bergseen. Forellen suchen im Frühjahr und Herbst aktiv nach Würmern und Bodenlebewesen an flachwasser Bereichen. Das sehr klare Wasser erfordert feine Vorfächer und kleine Haken.',
    angeltipp: 'Im Bergsee sind sehr feine Schnüre entscheidend – das klare Wasser macht dicke Vorfächer sofort sichtbar. Leise Bewegungen am Ufer verhindern, dass scheue Forellen aufgeschreckt werden.',
    fachbegriffe: [
      { term: 'Laufendes Blei', definition: 'Bleigewicht, das frei auf der Hauptschnur gleitet, damit der Fisch beim Aufnehmen des Köders keinen Widerstand spürt.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Abend'],
    stroemung: ['keine', 'schwach'],
    gewaesserart: ['Bergsee'],
    tiefe: ['Grund', 'Mittelwasser'],
    jahreszeit: ['Frühling', 'Herbst', 'Winter'],
    fischart: ['Forelle'],
    tempMin: 4,
    tempMax: 14,
    basisScore: 7
  },

  // =========================================================================
  // Gebirgsbach – spezifische Einträge (bait-087 – bait-094)
  // Wissenschaftliche Grundlage: MDPI (Salmo trutta Diätstudie in Kalkbach),
  // Orvis hatch-matching (Ephemeroptera/Trichoptera Schlüpfphasen),
  // troutnut.com (Insektenzyklen Alpenbach)
  // =========================================================================
  {
    id: 'bait-087',
    typBezeichnung: 'Braune Eintagsfliegen-Nymphe für Gebirgsbach',
    typ: 'Nymphe',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Tiefenkoeder',
    montage: 'Tschechische Nymphen-Montage (Tschech-Nymphing)',
    montageSchritte: [
      'Kurze Fliegenrute (3–4 m) mit leichter Fliegenschnur ausrüsten.',
      'Langes Mono-Vorfach (4–5 m, 0,14–0,16 mm) anhängen.',
      'Indikator (Biobead oder Sichtindikator) am Vorfach setzen.',
      'Nymphe (Hakengrösse 12–16) binden.',
      'Nymphe direkt in die Strömungsnaht oder hinter Steine werfen und mit der Strömung driften lassen.',
      'Beim leisesten Zucken des Indikators sofort anhaken.'
    ],
    beschreibung: 'Naturgetreues Imitat einer Eintagsfliegen-Nymphe (Ephemeroptera) für Gebirgsbäche. Im Frühling und Sommer dominieren Eintagsfliegen und Köcherfliegen die Bachforellen-Ernährung – Nymphen werden aktiv und häufig genommen. Die tschechische Nymphen-Technik ist besonders effektiv in schnellen Gebirgsbächen.',
    angeltipp: 'Nymphe dicht an Steinen und in Kolken (strömungsberuhigten Zonen hinter Steinen) führen. Bachforellen stehen stromaufwärts und nehmen vorbeitreibende Nymphen.',
    fachbegriffe: [
      { term: 'Ephemeroptera', definition: 'Eintagsfliegen; Wasserinsekten, deren Nymphenstadium im Bach lebt und als Hauptnahrungsquelle für Bachforellen gilt.' },
      { term: 'Tschech-Nymphing', definition: 'Technik des Nymphenfischens mit langer Rute und kurzem Vorfach in schneller Strömung, entwickelt für turbulente Gebirgsbäche.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Morgengrauen', 'Morgen', 'Mittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Gebirgsbach'],
    tiefe: ['Mittelwasser', 'Grund'],
    jahreszeit: ['Frühling', 'Sommer'],
    fischart: ['Forelle'],
    tempMin: 6,
    tempMax: 16,
    basisScore: 9
  },
  {
    id: 'bait-088',
    typBezeichnung: 'Köcherfliegenimitat (Sedge) für Gebirgsbach',
    typ: 'Trockenfliege',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'langsam',
    klasse: 'Oberflaechenkoeder',
    montage: 'Trockenfliegen-Montage mit flotierendem Vorfach',
    montageSchritte: [
      'Fliegenrute mit schwimmender Fliegenschnur (DT oder WF, Klasse 3–4) ausrüsten.',
      'Abgestuftes Vorfach (2,5–3 m, auf 0,12–0,14 mm abgestuft) anhängen.',
      'Sedge-Imitat (Hakengrösse 14–18) mit Trockenknotentechnik binden.',
      'Floatant (Fett) auf die Fliege auftragen.',
      'Upstream-Wurf: Fliege über den Haltestand werfen und natürlich driften lassen.',
      'Beim Steigen der Forelle sofort, aber weich anhaken.'
    ],
    beschreibung: 'Naturgetreues Köcherfliegenimitat (Trichoptera) als Trockenfliege für Gebirgsbäche. In den Abendstunden und bei Insektenhatches nehmen Bachforellen bevorzugt Trockenfliegen an der Oberfläche. Sedge-Muster sind besonders effektiv im Sommer während der Köcherfliegen-Schlüpfphase.',
    angeltipp: 'Abends und bei sichtbaren Steigern die Fliege so anbieten, dass sie exakt auf der natürlichen Driftlinie landet. Künstliche Führung erzeugt Schleppen und wird von erfahrenen Forellen abgelehnt.',
    fachbegriffe: [
      { term: 'Trichoptera', definition: 'Köcherfliegen; Wasserinsekten, deren Schlüpfphase im Gebirgsbach für Bachforellen zu den wichtigsten Nahrungsquellen zählt.' },
      { term: 'Schleppen', definition: 'Unnatürliches Querziehen der Trockenfliege über die Strömungslinien, das von Forellen erkannt und abgelehnt wird.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt'],
    tageszeit: ['Abend', 'Nachmittag'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Gebirgsbach'],
    tiefe: ['Oberfläche'],
    jahreszeit: ['Frühling', 'Sommer'],
    fischart: ['Forelle'],
    tempMin: 8,
    tempMax: 18,
    basisScore: 8
  },
  {
    id: 'bait-089',
    typBezeichnung: 'Kleiner silberner Spinner Grösse 1 für Gebirgsbach',
    typ: 'Spinner',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage für Fliessgewässer',
    montageSchritte: [
      'Fluorocarbon-Schnur (0,16–0,18 mm) wählen.',
      'Spinner mit kleinem Karabinerwirbel einhängen.',
      'Querwurf oder leichter Upstreamwurf in die Strömung.',
      'Spinner quer zur Strömung einrollen – Rotation kontrollieren.',
      'Hinter Steinen und in strömungsberuhigten Zonen besonders effektiv.'
    ],
    beschreibung: 'Kleiner Spinner (Grösse 1) für die schnellen Fliessgewässer des Gebirgsbaches. Bachforellen reagieren im Herbst und Winter besonders gut auf glänzende kleine Spinner, wenn Insektenhatches selten werden und Kleinfischimitate bevorzugt werden.',
    angeltipp: 'Spinner im Querwurf in die Strömung werfen und gleichmässig einholen. Die Blattschaufel muss von Anfang an rotieren – bei zu langsamer Führung sackt der Spinner zu tief.',
    fachbegriffe: [
      { term: 'Querwurf', definition: 'Wurf quer zur Strömung, sodass der Köder direkt durch den Fischbestand treibt. Besonders effektiv im Gebirgsbach.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Gebirgsbach'],
    tiefe: ['Mittelwasser', 'Oberfläche'],
    jahreszeit: ['Herbst', 'Winter', 'Frühling'],
    fischart: ['Forelle'],
    tempMin: 4,
    tempMax: 14,
    basisScore: 8
  },
  {
    id: 'bait-090',
    typBezeichnung: 'Mini-Wobbler natürlichbraun für Gebirgsbach',
    typ: 'Wobbler',
    groesse: 'klein',
    farbe: 'naturfarben',
    gewicht: 'leicht',
    aktion: 'taumelnd',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage leicht',
    montageSchritte: [
      'Fluorocarbon (0,16 mm) als Hauptschnur oder Vorfach wählen.',
      'Mini-Wobbler (3–5 cm) mit kleinem Karabiner einhängen.',
      'Upstream oder Querwurf in die Strömung werfen.',
      'Einrollgeschwindigkeit so wählen, dass der Wobbler leicht taumelt.',
      'Hinter grossen Steinen und in Tiefkolken einsetzen.'
    ],
    beschreibung: 'Kleiner Tauch-Wobbler (≤5 cm) in natürlichen Farbtönen für Gebirgsbäche. Im Herbst und Winter, wenn Insektenhatches ausbleiben, reagieren Bachforellen verstärkt auf kleine Kleinfischimitate. Naturgetreue Farben und kleine Grössen sind im klaren Gebirgswasser entscheidend.',
    angeltipp: 'Wobbler direkt hinter Steinen einsetzen, wo sich Forellen in strömungsberuhigten Zonen aufhalten. Zu schnelles Einrollen verhindert das natürliche Taumeln.',
    fachbegriffe: [
      { term: 'Kolk', definition: 'Strömungsberuhigte Tiefzone hinter einem Stein oder Hindernis, bevorzugter Aufenthaltsort für Bachforellen.' },
      { term: 'Mini-Wobbler', definition: 'Kleiner Kunstköder (≤5 cm) mit eingebautem Tauchteller, der beim Einzug eine taumelnde Bewegung ausführt.' }
    ],
    wetter: ['bedeckt', 'Regen', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Gebirgsbach'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Herbst', 'Winter'],
    fischart: ['Forelle'],
    tempMin: 4,
    tempMax: 12,
    basisScore: 7
  },
  {
    id: 'bait-091',
    typBezeichnung: 'Äschen-Nymphe dunkel für Gebirgsbach',
    typ: 'Nymphe',
    groesse: 'klein',
    farbe: 'dunkel',
    gewicht: 'leicht',
    aktion: 'sinkend-langsam',
    klasse: 'Tiefenkoeder',
    montage: 'Fliegenfischen-Montage für Äschen',
    montageSchritte: [
      'Fliegenrute (4–5 m) mit leichter schwimmender Fliegenschnur.',
      'Dünnes Fluorocarbon-Vorfach (3 m, 0,12 mm) anhängen.',
      'Dunkle Nymphe (Hakengrösse 14–16) binden.',
      'Kurze, präzise Würfe in die Hauptströmung.',
      'Nymphe frei driften lassen und Biss am Indikator abwarten.'
    ],
    beschreibung: 'Dunkle Nymphe für das Fliegenfischen auf Äschen in Gebirgsbächen. Äschen (*Thymallus thymallus*) sind typische Bewohner sauerstoffreicher Alpenbäche und reagieren besonders gut auf kleine dunkle Nymphen in der Hauptströmung. Als Indikatorart für sauberes Wasser sind sie ein Zeichen für intakte Bachökologie.',
    angeltipp: 'Äschen stehen in der Hauptströmung mit dem Kopf stromauf. Nymphe knapp vor dem Fisch in der Strömung platzieren und natürlich driften lassen.',
    fachbegriffe: [
      { term: 'Äsche', definition: 'Salmonide (*Thymallus thymallus*), typischer Bewohner sauerstoffreicher Gebirgsbäche. Indikatorart für unverschmutztes Wasser.' },
      { term: 'Hauptströmung', definition: 'Der schnellste Fliessbereich im Bachbett, bevorzugter Aufenthaltsort von Äschen und Bachforellen.' }
    ],
    wetter: ['sonnig', 'leicht bewölkt'],
    tageszeit: ['Morgen', 'Mittag', 'Nachmittag', 'Abend'],
    stroemung: ['mittel', 'stark'],
    gewaesserart: ['Gebirgsbach'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Frühling', 'Sommer', 'Herbst'],
    fischart: ['Forelle'],
    tempMin: 6,
    tempMax: 16,
    basisScore: 7
  }
];
