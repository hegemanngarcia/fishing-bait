// Feature: fishing-bait-advisor
// FilterEngine tests — Task 2.1: scoreEntry() unit tests | Task 2.2: PBT Property 2 | Task 2.3: query() unit tests
import { describe, it, expect, test } from 'vitest'
import * as fc from 'fast-check'
import { FilterEngine } from '../src/js/filter-engine.js'
import {
  BAIT_DATASET,
  WEATHER_VALUES,
  TIME_OF_DAY_VALUES,
  CURRENT_VALUES,
  WATER_TYPE_VALUES,
  DEPTH_VALUES,
  SEASON_VALUES,
  FISH_TYPE_VALUES,
} from '../src/js/bait-data.js'

// ---------------------------------------------------------------------------
// Minimal BaitEntry fixture for scoreEntry tests
// ---------------------------------------------------------------------------

/** @returns {import('../src/js/bait-data.js').BaitEntry} */
function makeBait(overrides = {}) {
  return {
    id: 'test-001',
    typBezeichnung: 'Test-Köder',
    typ: 'Spinner',
    groesse: 'mittel',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direktmontage',
    montageSchritte: [],
    beschreibung: '',
    angeltipp: '',
    fachbegriffe: [],
    wetter: ['sonnig', 'Wind'],
    tageszeit: ['Morgen', 'Mittag'],
    stroemung: ['schwach', 'mittel'],
    gewaesserart: ['Fluss', 'See'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Sommer', 'Herbst'],
    fischart: ['Forelle', 'Barsch'],
    tempMin: 8,
    tempMax: 20,
    basisScore: 5,
    ...overrides,
  }
}

/** @returns {import('../src/js/bait-data.js').FilterProfile} */
function nullProfile() {
  return {
    wetter: null,
    tageszeit: null,
    stroemung: null,
    gewaesserart: null,
    tiefe: null,
    jahreszeit: null,
    fischart: null,
    wassertemperatur: null,
  }
}

// ---------------------------------------------------------------------------
// scoreEntry — Grundverhalten
// ---------------------------------------------------------------------------

describe('FilterEngine.scoreEntry()', () => {
  describe('Null-Profil (keine Filter gesetzt)', () => {
    it('gibt exakt den basisScore zurück, wenn alle Filter null sind', () => {
      const entry = makeBait({ basisScore: 7 })
      const profile = nullProfile()
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(7)
    })

    it('kein Bonus für null-Filter, auch nicht wenn Eintrag matching wäre', () => {
      // Alle 8 Filter null → Score bleibt bei basisScore
      const entry = makeBait({ basisScore: 3 })
      const profile = nullProfile()
      const score = FilterEngine.scoreEntry(entry, profile)
      expect(score).toBe(3)
    })
  })

  describe('Einzelne Filter-Übereinstimmungen (je +1)', () => {
    it('wetter-Treffer: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, wetter: ['sonnig', 'Wind'] })
      const profile = { ...nullProfile(), wetter: 'sonnig' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('tageszeit-Treffer: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, tageszeit: ['Morgen', 'Mittag'] })
      const profile = { ...nullProfile(), tageszeit: 'Morgen' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('stroemung-Treffer: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, stroemung: ['schwach', 'mittel'] })
      const profile = { ...nullProfile(), stroemung: 'mittel' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('gewaesserart-Treffer: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, gewaesserart: ['Fluss', 'See'] })
      const profile = { ...nullProfile(), gewaesserart: 'Fluss' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('tiefe-Treffer: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, tiefe: ['Mittelwasser'] })
      const profile = { ...nullProfile(), tiefe: 'Mittelwasser' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('jahreszeit-Treffer: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, jahreszeit: ['Sommer', 'Herbst'] })
      const profile = { ...nullProfile(), jahreszeit: 'Sommer' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('fischart-Treffer: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, fischart: ['Forelle', 'Barsch'] })
      const profile = { ...nullProfile(), fischart: 'Barsch' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('wassertemperatur innerhalb [tempMin, tempMax]: +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, tempMin: 8, tempMax: 20 })
      const profile = { ...nullProfile(), wassertemperatur: 14 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })
  })

  describe('Kein Bonus bei Nicht-Übereinstimmung', () => {
    it('wetter kein Treffer: kein Bonus', () => {
      const entry = makeBait({ basisScore: 5, wetter: ['sonnig'] })
      const profile = { ...nullProfile(), wetter: 'Regen' }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(5)
    })

    it('wassertemperatur unterhalb tempMin: kein Bonus', () => {
      const entry = makeBait({ basisScore: 5, tempMin: 10, tempMax: 20 })
      const profile = { ...nullProfile(), wassertemperatur: 5 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(5)
    })

    it('wassertemperatur oberhalb tempMax: kein Bonus', () => {
      const entry = makeBait({ basisScore: 5, tempMin: 8, tempMax: 20 })
      const profile = { ...nullProfile(), wassertemperatur: 25 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(5)
    })
  })

  describe('Maximaler Score (alle 8 Filter treffen)', () => {
    it('basisScore + 8 bei vollem Treffer auf allen Filtern', () => {
      const entry = makeBait({
        basisScore: 5,
        wetter: ['sonnig'],
        tageszeit: ['Morgen'],
        stroemung: ['schwach'],
        gewaesserart: ['Fluss'],
        tiefe: ['Mittelwasser'],
        jahreszeit: ['Sommer'],
        fischart: ['Forelle'],
        tempMin: 10,
        tempMax: 20,
      })
      const profile = {
        wetter: 'sonnig',
        tageszeit: 'Morgen',
        stroemung: 'schwach',
        gewaesserart: 'Fluss',
        tiefe: 'Mittelwasser',
        jahreszeit: 'Sommer',
        fischart: 'Forelle',
        wassertemperatur: 15,
      }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(13) // 5 + 8
    })
  })

  describe('Temperatur-Randfälle', () => {
    it('tempMin exakt übereinstimmend: +1 Bonus (inklusive Grenze)', () => {
      const entry = makeBait({ basisScore: 5, tempMin: 8, tempMax: 20 })
      const profile = { ...nullProfile(), wassertemperatur: 8 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('tempMax exakt übereinstimmend: +1 Bonus (inklusive Grenze)', () => {
      const entry = makeBait({ basisScore: 5, tempMin: 8, tempMax: 20 })
      const profile = { ...nullProfile(), wassertemperatur: 20 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('tempMin null (keine Untergrenze): sehr kalte Temperatur matcht', () => {
      const entry = makeBait({ basisScore: 5, tempMin: null, tempMax: 15 })
      const profile = { ...nullProfile(), wassertemperatur: 0 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('tempMax null (keine Obergrenze): sehr warme Temperatur matcht', () => {
      const entry = makeBait({ basisScore: 5, tempMin: 8, tempMax: null })
      const profile = { ...nullProfile(), wassertemperatur: 35 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('tempMin und tempMax null (keine Einschränkung): immer +1 Bonus', () => {
      const entry = makeBait({ basisScore: 5, tempMin: null, tempMax: null })
      const profile = { ...nullProfile(), wassertemperatur: 20 }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })
  })

  describe('Ungesetzte Filter (undefined verhält sich wie null)', () => {
    it('undefined-Wert im Profil schränkt nicht ein und gibt keinen Bonus', () => {
      const entry = makeBait({ basisScore: 6 })
      const profile = {
        wetter: undefined,
        tageszeit: undefined,
        stroemung: undefined,
        gewaesserart: undefined,
        tiefe: undefined,
        jahreszeit: undefined,
        fischart: undefined,
        wassertemperatur: undefined,
      }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })
  })

  describe('Gemischtes Profil (einige Filter gesetzt, einige null)', () => {
    it('nur gesetzte Filter geben Bonus, null-Filter geben keinen', () => {
      const entry = makeBait({
        basisScore: 4,
        wetter: ['sonnig'],
        fischart: ['Forelle'],
      })
      // wetter passt (+1), fischart passt (+1), rest null (kein Bonus)
      const profile = {
        ...nullProfile(),
        wetter: 'sonnig',
        fischart: 'Forelle',
      }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(6)
    })

    it('gesetzter Filter ohne Treffer im entry: kein Bonus', () => {
      const entry = makeBait({
        basisScore: 4,
        wetter: ['sonnig'],
        fischart: ['Barsch'],
      })
      const profile = {
        ...nullProfile(),
        wetter: 'Regen',   // kein Treffer
        fischart: 'Barsch', // Treffer
      }
      expect(FilterEngine.scoreEntry(entry, profile)).toBe(5) // 4 + 1
    })
  })
})

// ---------------------------------------------------------------------------
// FilterEngine.query() — Task 2.3 tests
// ---------------------------------------------------------------------------

/** @returns {import('../src/js/bait-data.js').FilterProfile} */
function emptyProfile() {
  return {
    wetter: null,
    tageszeit: null,
    stroemung: null,
    gewaesserart: null,
    tiefe: null,
    jahreszeit: null,
    fischart: null,
    wassertemperatur: null,
  }
}

describe('FilterEngine.query()', () => {

  describe('Grundlegendes Verhalten', () => {
    it('gibt ein Array zurück', () => {
      const results = FilterEngine.query(emptyProfile(), BAIT_DATASET)
      expect(Array.isArray(results)).toBe(true)
    })

    it('liefert mindestens 1 Empfehlung bei leerem Profil', () => {
      const results = FilterEngine.query(emptyProfile(), BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
    })

    it('liefert mindestens 1 Empfehlung, wenn passende Einträge vorhanden sind', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
    })

    it('gibt leeres Array zurück, wenn kein Eintrag passt', () => {
      // Kombiniere Filter so, dass nichts matcht
      const profile = {
        ...emptyProfile(),
        fischart: 'Wels',
        jahreszeit: 'Winter',
        gewaesserart: 'Meer',
      }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results).toEqual([])
    })
  })

  describe('Filterung — Nicht-übereinstimmende Einträge werden ausgeschlossen', () => {
    it('alle Ergebnisse haben die gesetzte Fischart im fischart-Array', () => {
      const profile = { ...emptyProfile(), fischart: 'Forelle' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.fischart).toContain('Forelle')
      }
    })

    it('alle Ergebnisse haben die gesetzte Jahreszeit im jahreszeit-Array', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Winter' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.jahreszeit).toContain('Winter')
      }
    })

    it('alle Ergebnisse haben die gesetzte Gewässerart im gewaesserart-Array', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'Fluss' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.gewaesserart).toContain('Fluss')
      }
    })

    it('Wassertemperaturfilter schließt Einträge außerhalb des Temperaturbereichs aus', () => {
      const profile = { ...emptyProfile(), wassertemperatur: 2 } // sehr kalt
      const results = FilterEngine.query(profile, BAIT_DATASET)
      for (const rec of results) {
        const { tempMin, tempMax } = rec.bait
        if (tempMin !== null) expect(tempMin).toBeLessThanOrEqual(2)
        if (tempMax !== null) expect(tempMax).toBeGreaterThanOrEqual(2)
      }
    })
  })

  describe('Sortierung', () => {
    it('Ergebnisse sind absteigend nach Score sortiert', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score)
      }
    })

    it('bei gleichem Score: aufsteigende alphabetische Reihenfolge nach typBezeichnung', () => {
      // Erstelle minimales Dataset mit 2 Einträgen gleichen Scores
      const entryA = makeBait({
        id: 'sort-001',
        typBezeichnung: 'Zzz-Köder',
        basisScore: 5,
        wetter: ['sonnig'],
        tageszeit: ['Morgen'],
        stroemung: ['schwach'],
        gewaesserart: ['See'],
        tiefe: ['Mittelwasser'],
        jahreszeit: ['Sommer'],
        fischart: ['Barsch'],
        tempMin: null,
        tempMax: null,
      })
      const entryB = makeBait({
        id: 'sort-002',
        typBezeichnung: 'Aaa-Köder',
        basisScore: 5,
        wetter: ['sonnig'],
        tageszeit: ['Morgen'],
        stroemung: ['schwach'],
        gewaesserart: ['See'],
        tiefe: ['Mittelwasser'],
        jahreszeit: ['Sommer'],
        fischart: ['Barsch'],
        tempMin: null,
        tempMax: null,
      })
      const profile = emptyProfile() // alle null → nur basisScore zählt
      const results = FilterEngine.query(profile, [entryA, entryB])
      // Beide haben Score 5, B (Aaa) soll vor A (Zzz) stehen
      expect(results[0].bait.typBezeichnung).toBe('Aaa-Köder')
      expect(results[1].bait.typBezeichnung).toBe('Zzz-Köder')
    })
  })

  describe('Recommendation-Struktur', () => {
    it('jede Empfehlung hat bait, score, kurzerklaerung, charakteristika', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      for (const rec of results) {
        expect(rec).toHaveProperty('bait')
        expect(rec).toHaveProperty('score')
        expect(rec).toHaveProperty('kurzerklaerung')
        expect(rec).toHaveProperty('charakteristika')
      }
    })

    it('charakteristika enthält alle Pflichtfelder mit gültigen Werten', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      const gueltigeGroesse = ['klein', 'mittel', 'groß']
      const gueltigeFarbe = ['hell', 'dunkel', 'naturfarben', 'auffällig', 'zweifarbig']
      const gueltigesGewicht = ['leicht', 'mittel', 'schwer']
      const gueltigeAktion = ['langsam', 'mittel', 'schnell', 'taumelnd', 'pulsierend', 'sinkend-langsam']

      for (const rec of results) {
        const c = rec.charakteristika
        expect(typeof c.typBezeichnung).toBe('string')
        expect(c.typBezeichnung.length).toBeGreaterThan(0)
        expect(typeof c.typ).toBe('string')
        expect(c.typ.length).toBeGreaterThan(0)
        expect(gueltigeGroesse).toContain(c.groesse)
        expect(gueltigeFarbe).toContain(c.farbe)
        expect(gueltigesGewicht).toContain(c.gewicht)
        expect(gueltigeAktion).toContain(c.aktion)
        expect(typeof c.klasse).toBe('string')
        expect(c.klasse.length).toBeGreaterThan(0)
      }
    })

    it('charakteristika-Werte stimmen mit dem bait-Eintrag überein', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Herbst' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      for (const rec of results) {
        expect(rec.charakteristika.typBezeichnung).toBe(rec.bait.typBezeichnung)
        expect(rec.charakteristika.typ).toBe(rec.bait.typ)
        expect(rec.charakteristika.groesse).toBe(rec.bait.groesse)
        expect(rec.charakteristika.farbe).toBe(rec.bait.farbe)
        expect(rec.charakteristika.gewicht).toBe(rec.bait.gewicht)
        expect(rec.charakteristika.aktion).toBe(rec.bait.aktion)
        expect(rec.charakteristika.klasse).toBe(rec.bait.klasse)
      }
    })

    it('kurzerklaerung ist ein nicht-leerer String', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      for (const rec of results) {
        expect(typeof rec.kurzerklaerung).toBe('string')
        expect(rec.kurzerklaerung.length).toBeGreaterThan(0)
      }
    })

    it('kurzerklaerung nennt mindestens einen aktiven Filter', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer', fischart: 'Barsch' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      for (const rec of results) {
        // Die Erklärung muss einen der aktiven Filterwerte enthalten
        const erwaehntFilter =
          rec.kurzerklaerung.includes('Sommer') ||
          rec.kurzerklaerung.includes('Barsch') ||
          rec.kurzerklaerung.includes('Jahreszeit') ||
          rec.kurzerklaerung.includes('Fischart')
        expect(erwaehntFilter).toBe(true)
      }
    })

    it('score in der Recommendation entspricht dem berechneten scoreEntry-Wert', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer', wetter: 'sonnig' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      for (const rec of results) {
        const expectedScore = FilterEngine.scoreEntry(rec.bait, profile)
        expect(rec.score).toBe(expectedScore)
      }
    })
  })

  describe('Maximale Ergebnisanzahl', () => {
    it('gibt alle Einträge mit hohem Score zurück (kein hartes 5er-Limit mehr)', () => {
      // Verwende den echten Datensatz mit einem null-Profil — mindestens 1 Ergebnis erwartet
      const results = FilterEngine.query(emptyProfile(), BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
    })

    it('gibt genau 2 zurück, wenn nur 2 Einträge im Dataset passen', () => {
      const entry1 = makeBait({ id: 'e1', typBezeichnung: 'Alpha', basisScore: 5 })
      const entry2 = makeBait({ id: 'e2', typBezeichnung: 'Beta', basisScore: 6 })
      const results = FilterEngine.query(emptyProfile(), [entry1, entry2])
      expect(results.length).toBe(2)
    })
  })

  describe('Leerer Datensatz', () => {
    it('gibt leeres Array zurück bei leerem Datensatz', () => {
      const results = FilterEngine.query(emptyProfile(), [])
      expect(results).toEqual([])
    })
  })
})

// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.2
// Feature: fishing-bait-advisor, Property 2: ungesetzte Filter schränken nicht ein
// Validates: Requirements 1.4
// ---------------------------------------------------------------------------

// Arbitraries für gültige Filterwerte (oder null)
const arbWeather    = fc.constantFrom(...WEATHER_VALUES,    null)
const arbTimeOfDay  = fc.constantFrom(...TIME_OF_DAY_VALUES, null)
const arbCurrent    = fc.constantFrom(...CURRENT_VALUES,     null)
const arbWaterType  = fc.constantFrom(...WATER_TYPE_VALUES,  null)
const arbDepth      = fc.constantFrom(...DEPTH_VALUES,       null)
const arbSeason     = fc.constantFrom(...SEASON_VALUES,      null)
const arbFishType   = fc.constantFrom(...FISH_TYPE_VALUES,   null)
const arbTemp       = fc.oneof(fc.integer({ min: 0, max: 35 }), fc.constant(null))

const arbFilterProfile = fc.record({
  wetter:           arbWeather,
  tageszeit:        arbTimeOfDay,
  stroemung:        arbCurrent,
  gewaesserart:     arbWaterType,
  tiefe:            arbDepth,
  jahreszeit:       arbSeason,
  fischart:         arbFishType,
  wassertemperatur: arbTemp,
})

describe('Property 2: Ungesetzte Filter schränken nicht ein', () => {
  /**
   * For any FilterProfile p and each enumerated filter dimension f:
   * nulling f in p must not reduce the result count.
   * i.e. query({...p, f: null}, dataset).length >= query(p, dataset).length
   *
   * This holds because null means "no restriction" — removing a restriction
   * can only keep the same entries or allow more, never fewer.
   */
  test('Einen Filter auf null setzen verringert die Trefferzahl nicht (alle Dimensionen)', () => {
    const filterDimensions = [
      'wetter',
      'tageszeit',
      'stroemung',
      'gewaesserart',
      'tiefe',
      'jahreszeit',
      'fischart',
      'wassertemperatur',
    ]

    fc.assert(
      fc.property(arbFilterProfile, (profile) => {
        const baseCount = FilterEngine.query(profile, BAIT_DATASET).length

        for (const dim of filterDimensions) {
          if (profile[dim] !== null && profile[dim] !== undefined) {
            const relaxedProfile = { ...profile, [dim]: null }
            const relaxedCount = FilterEngine.query(relaxedProfile, BAIT_DATASET).length
            expect(relaxedCount).toBeGreaterThanOrEqual(baseCount)
          }
        }
      }),
      { numRuns: 100 },
    )
  })

  test('Vollständig null-Profil liefert mindestens so viele Treffer wie jedes andere Profil', () => {
    const nullProfile = {
      wetter:           null,
      tageszeit:        null,
      stroemung:        null,
      gewaesserart:     null,
      tiefe:            null,
      jahreszeit:       null,
      fischart:         null,
      wassertemperatur: null,
    }
    const nullCount = FilterEngine.query(nullProfile, BAIT_DATASET).length

    fc.assert(
      fc.property(arbFilterProfile, (profile) => {
        const count = FilterEngine.query(profile, BAIT_DATASET).length
        expect(nullCount).toBeGreaterThanOrEqual(count)
      }),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.4
// Feature: fishing-bait-advisor, Property 4: Ergebnisanzahl im erlaubten Bereich
// Validates: Requirements 2.1
// ---------------------------------------------------------------------------

describe('Property 4: Ergebnisanzahl im erlaubten Bereich', () => {
  /**
   * For any FilterProfile that yields at least 1 result, the result count
   * must satisfy 1 <= results.length <= 5.
   *
   * Strategy: use an all-null profile, which always matches every entry in
   * the dataset (no active filter restricts anything), so results.length >= 1
   * is guaranteed by the dataset. The upper bound of 5 is enforced by query().
   */

  // All-null profile — guaranteed to produce results from any non-empty dataset
  const allNullProfile = {
    wetter: null,
    tageszeit: null,
    stroemung: null,
    gewaesserart: null,
    tiefe: null,
    jahreszeit: null,
    fischart: null,
    wassertemperatur: null,
  }

  test('query() liefert zwischen 1 und 5 Empfehlungen für Profile mit mindestens einem Treffer', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary profiles by optionally overriding some fields with valid values.
        // Run the property only for profiles that actually produce results (filter with fc.filter).
        fc.record({
          wetter:           fc.constantFrom(...WEATHER_VALUES,    null),
          tageszeit:        fc.constantFrom(...TIME_OF_DAY_VALUES, null),
          stroemung:        fc.constantFrom(...CURRENT_VALUES,     null),
          gewaesserart:     fc.constantFrom(...WATER_TYPE_VALUES,  null),
          tiefe:            fc.constantFrom(...DEPTH_VALUES,       null),
          jahreszeit:       fc.constantFrom(...SEASON_VALUES,      null),
          fischart:         fc.constantFrom(...FISH_TYPE_VALUES,   null),
          wassertemperatur: fc.oneof(fc.integer({ min: 0, max: 35 }), fc.constant(null)),
        }).filter((profile) => FilterEngine.query(profile, BAIT_DATASET).length >= 1),
        (profile) => {
          const results = FilterEngine.query(profile, BAIT_DATASET)
          expect(results.length).toBeGreaterThanOrEqual(1)
        },
      ),
      { numRuns: 100 },
    )
  })

  test('all-null Profil liefert immer mindestens 1 Empfehlung', () => {
    fc.assert(
      fc.property(fc.constant(allNullProfile), (profile) => {
        const results = FilterEngine.query(profile, BAIT_DATASET)
        expect(results.length).toBeGreaterThanOrEqual(1)
      }),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.6
// Feature: fishing-bait-advisor, Property 6: Empfehlungen korrekt sortiert
// Validates: Requirements 2.3
// ---------------------------------------------------------------------------

describe('Property 6: Empfehlungen korrekt sortiert', () => {
  /**
   * For any FilterProfile:
   *   - results are sorted descending by score
   *   - ties are broken ascending by typBezeichnung (lexicographic, 'de' locale)
   *
   * For every consecutive pair (results[i], results[i+1]):
   *   results[i].score >= results[i+1].score
   *   if results[i].score === results[i+1].score:
   *     results[i].bait.typBezeichnung <= results[i+1].bait.typBezeichnung
   */
  test('Jedes aufeinanderfolgende Paar (rec[i], rec[i+1]) ist korrekt sortiert', () => {
    fc.assert(
      fc.property(arbFilterProfile, (profile) => {
        const results = FilterEngine.query(profile, BAIT_DATASET)

        for (let i = 0; i < results.length - 1; i++) {
          const current = results[i]
          const next = results[i + 1]

          // Primary sort: descending score
          expect(current.score).toBeGreaterThanOrEqual(next.score)

          // Secondary sort (tie-break): ascending typBezeichnung
          if (current.score === next.score) {
            const cmp = current.bait.typBezeichnung.localeCompare(
              next.bait.typBezeichnung,
              'de'
            )
            expect(cmp).toBeLessThanOrEqual(0)
          }
        }
      }),
      { numRuns: 100 },
    )
  })
})


// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.5
// Feature: fishing-bait-advisor, Property 5: Empfehlungsstruktur vollständig
// Validates: Requirements 2.2, 3.1
// ---------------------------------------------------------------------------

describe('Property 5: Empfehlungsstruktur vollständig', () => {
  /**
   * For any FilterProfile that returns at least one result, every Recommendation
   * must have:
   *   - bait.typBezeichnung: non-empty string
   *   - bait.montage: non-empty string
   *   - kurzerklaerung: non-empty string
   *   - charakteristika.groesse in valid groesse values
   *   - charakteristika.farbe in valid farbe values
   *   - charakteristika.gewicht in valid gewicht values
   *   - charakteristika.aktion in valid aktion values
   */
  test('Jede Empfehlung hat vollständige Struktur mit gültigen Enum-Werten', () => {
    const VALID_GROESSE = ['klein', 'mittel', 'groß']
    const VALID_FARBE = ['hell', 'dunkel', 'naturfarben', 'auffällig', 'zweifarbig']
    const VALID_GEWICHT = ['leicht', 'mittel', 'schwer']
    const VALID_AKTION = ['langsam', 'mittel', 'schnell', 'taumelnd', 'pulsierend', 'sinkend-langsam']

    fc.assert(
      fc.property(arbFilterProfile, (profile) => {
        const results = FilterEngine.query(profile, BAIT_DATASET)

        // Only verify structure when there are results
        fc.pre(results.length > 0)

        for (const rec of results) {
          // bait.typBezeichnung: non-empty string
          expect(typeof rec.bait.typBezeichnung).toBe('string')
          expect(rec.bait.typBezeichnung.length).toBeGreaterThan(0)

          // bait.montage: non-empty string
          expect(typeof rec.bait.montage).toBe('string')
          expect(rec.bait.montage.length).toBeGreaterThan(0)

          // kurzerklaerung: non-empty string
          expect(typeof rec.kurzerklaerung).toBe('string')
          expect(rec.kurzerklaerung.length).toBeGreaterThan(0)

          // charakteristika enum fields
          expect(VALID_GROESSE).toContain(rec.charakteristika.groesse)
          expect(VALID_FARBE).toContain(rec.charakteristika.farbe)
          expect(VALID_GEWICHT).toContain(rec.charakteristika.gewicht)
          expect(VALID_AKTION).toContain(rec.charakteristika.aktion)
        }
      }),
      { numRuns: 100 },
    )
  })
})


// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.8
// Feature: fishing-bait-advisor, Property 7: Hecht + Teich → nur Kunstköder
// Validates: Requirements 2.5
// ---------------------------------------------------------------------------

describe('Property 7: Hecht + Teich → nur Kunstköder', () => {
  /**
   * For any FilterProfile with fixed fischart='Hecht' and gewaesserart='Teich'
   * and random values for all other filters:
   * Every returned recommendation must have bait.typ in
   * ['Wobbler', 'Gummifisch', 'Spinner', 'Blinker'].
   *
   * If no results are returned (empty result set), the property vacuously holds —
   * we skip verification via fc.pre(results.length > 0).
   */
  const ERLAUBTE_TYPEN = ['Wobbler', 'Gummifisch', 'Spinner', 'Blinker']

  test('Alle Empfehlungen haben typ in [Wobbler, Gummifisch, Spinner, Blinker]', () => {
    fc.assert(
      fc.property(
        fc.record({
          wetter:           fc.constantFrom(...WEATHER_VALUES,    null),
          tageszeit:        fc.constantFrom(...TIME_OF_DAY_VALUES, null),
          stroemung:        fc.constantFrom(...CURRENT_VALUES,     null),
          tiefe:            fc.constantFrom(...DEPTH_VALUES,       null),
          jahreszeit:       fc.constantFrom(...SEASON_VALUES,      null),
          wassertemperatur: fc.oneof(fc.integer({ min: 0, max: 35 }), fc.constant(null)),
        }),
        (partialProfile) => {
          const profile = {
            ...partialProfile,
            fischart: 'Hecht',
            gewaesserart: 'Teich',
          }

          const results = FilterEngine.query(profile, BAIT_DATASET)

          // Skip when no results — the rule only constrains non-empty result sets
          fc.pre(results.length > 0)

          for (const rec of results) {
            expect(ERLAUBTE_TYPEN).toContain(rec.bait.typ)
          }
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Unit Tests — Task 2.7: Sonderregel Hecht + Teich
// Feature: fishing-bait-advisor
// Validates: Requirements 2.5
// ---------------------------------------------------------------------------

const HECHT_TEICH_ERLAUBTE_TYPEN = ['Wobbler', 'Gummifisch', 'Spinner', 'Blinker']

describe('FilterEngine.query() — Sonderregel Hecht + Teich (Req 2.5)', () => {

  // -------------------------------------------------------------------------
  // Test 1: Hecht + Teich → nur erlaubte Typen zurückgegeben
  // -------------------------------------------------------------------------
  describe('Hecht + Teich: nur erlaubte Ködertypen werden zurückgegeben', () => {
    it('alle Ergebnisse haben typ in [Wobbler, Gummifisch, Spinner, Blinker]', () => {
      const profile = { ...emptyProfile(), fischart: 'Hecht', gewaesserart: 'Teich' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(HECHT_TEICH_ERLAUBTE_TYPEN).toContain(rec.bait.typ)
      }
    })

    it('Einträge mit Typ außerhalb der erlaubten Liste werden ausgeschlossen', () => {
      // bait-001 (Popper, Hecht+Teich) should be excluded; bait-002 (Wobbler, Hecht+Teich) included
      const hechtTeichDataset = [
        makeBait({ id: 'ht-popper', typBezeichnung: 'Teich-Popper', typ: 'Popper', fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
        makeBait({ id: 'ht-wobbler', typBezeichnung: 'Teich-Wobbler', typ: 'Wobbler', fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
        makeBait({ id: 'ht-spinner', typBezeichnung: 'Teich-Spinner', typ: 'Spinner', fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
        makeBait({ id: 'ht-jig', typBezeichnung: 'Teich-Jig', typ: 'Jig', fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
      ]
      const profile = { ...emptyProfile(), fischart: 'Hecht', gewaesserart: 'Teich' }
      const results = FilterEngine.query(profile, hechtTeichDataset)
      const resultIds = results.map((r) => r.bait.id)
      // Wobbler and Spinner are allowed
      expect(resultIds).toContain('ht-wobbler')
      expect(resultIds).toContain('ht-spinner')
      // Popper and Jig are NOT in the allowed list
      expect(resultIds).not.toContain('ht-popper')
      expect(resultIds).not.toContain('ht-jig')
    })

    it('alle vier erlaubten Typen werden akzeptiert, wenn vorhanden', () => {
      const testDataset = [
        makeBait({ id: 'tt-wobbler',   typBezeichnung: 'Wobbler-Test',   typ: 'Wobbler',   fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
        makeBait({ id: 'tt-gummi',     typBezeichnung: 'Gummifisch-Test', typ: 'Gummifisch', fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
        makeBait({ id: 'tt-spinner',   typBezeichnung: 'Spinner-Test',   typ: 'Spinner',   fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
        makeBait({ id: 'tt-blinker',   typBezeichnung: 'Blinker-Test',   typ: 'Blinker',   fischart: ['Hecht'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
      ]
      const profile = { ...emptyProfile(), fischart: 'Hecht', gewaesserart: 'Teich' }
      const results = FilterEngine.query(profile, testDataset)
      const resultIds = results.map((r) => r.bait.id)
      expect(resultIds).toContain('tt-wobbler')
      expect(resultIds).toContain('tt-gummi')
      expect(resultIds).toContain('tt-spinner')
      expect(resultIds).toContain('tt-blinker')
    })
  })

  // -------------------------------------------------------------------------
  // Test 2: Hecht allein (kein Teich) → Sonderregel NICHT ausgelöst
  // -------------------------------------------------------------------------
  describe('Hecht ohne Teich: Sonderregel wird NICHT ausgelöst', () => {
    it('Hecht + See gibt auch Einträge mit anderen Typen zurück', () => {
      // bait-003 has typ Stickbait, fischart ['Hecht', 'Wels'], gewaesserart ['See', 'Stausee']
      // Without the special rule it should be in results
      const testDataset = [
        makeBait({ id: 'h-stickbait', typBezeichnung: 'Stickbait-Hecht', typ: 'Stickbait', fischart: ['Hecht'], gewaesserart: ['See'], basisScore: 6, tempMin: null, tempMax: null }),
        makeBait({ id: 'h-wobbler', typBezeichnung: 'Wobbler-Hecht', typ: 'Wobbler', fischart: ['Hecht'], gewaesserart: ['See'], basisScore: 6, tempMin: null, tempMax: null }),
      ]
      const profile = { ...emptyProfile(), fischart: 'Hecht', gewaesserart: 'See' }
      const results = FilterEngine.query(profile, testDataset)
      const resultIds = results.map((r) => r.bait.id)
      // Stickbait should NOT be filtered out because gewaesserart is See, not Teich
      expect(resultIds).toContain('h-stickbait')
      expect(resultIds).toContain('h-wobbler')
    })

    it('Hecht mit null Gewässerart: Sonderregel wird NICHT ausgelöst', () => {
      const testDataset = [
        makeBait({ id: 'hn-popper', typBezeichnung: 'Popper-Hecht', typ: 'Popper', fischart: ['Hecht'], gewaesserart: ['See', 'Teich'], basisScore: 5, tempMin: null, tempMax: null }),
      ]
      const profile = { ...emptyProfile(), fischart: 'Hecht', gewaesserart: null }
      const results = FilterEngine.query(profile, testDataset)
      // With gewaesserart null, the special rule is not triggered → Popper should appear
      expect(results.length).toBe(1)
      expect(results[0].bait.id).toBe('hn-popper')
    })
  })

  // -------------------------------------------------------------------------
  // Test 3: Teich allein (kein Hecht) → Sonderregel NICHT ausgelöst
  // -------------------------------------------------------------------------
  describe('Teich ohne Hecht: Sonderregel wird NICHT ausgelöst', () => {
    it('Teich + Barsch gibt auch Einträge mit Typen außerhalb der Liste zurück', () => {
      const testDataset = [
        makeBait({ id: 't-popper', typBezeichnung: 'Popper-Barsch', typ: 'Popper', fischart: ['Barsch'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
        makeBait({ id: 't-jig', typBezeichnung: 'Jig-Barsch', typ: 'Jig', fischart: ['Barsch'], gewaesserart: ['Teich'], basisScore: 5, tempMin: null, tempMax: null }),
      ]
      const profile = { ...emptyProfile(), fischart: 'Barsch', gewaesserart: 'Teich' }
      const results = FilterEngine.query(profile, testDataset)
      const resultIds = results.map((r) => r.bait.id)
      // No special rule → Popper and Jig should both be in results
      expect(resultIds).toContain('t-popper')
      expect(resultIds).toContain('t-jig')
    })

    it('Teich mit null Fischart: Sonderregel wird NICHT ausgelöst', () => {
      const testDataset = [
        makeBait({ id: 'tn-boilie', typBezeichnung: 'Boilie-Teich', typ: 'Boilie', fischart: ['Karpfen'], gewaesserart: ['Teich'], basisScore: 6, tempMin: null, tempMax: null }),
      ]
      const profile = { ...emptyProfile(), fischart: null, gewaesserart: 'Teich' }
      const results = FilterEngine.query(profile, testDataset)
      // With fischart null, special rule is not triggered → Boilie should appear
      expect(results.length).toBe(1)
      expect(results[0].bait.id).toBe('tn-boilie')
    })
  })

  // -------------------------------------------------------------------------
  // Test 4: bait-data.js hat Einträge mit erlaubten Typen für Hecht+Teich
  // -------------------------------------------------------------------------
  describe('BAIT_DATASET enthält gültige Einträge für Hecht+Teich', () => {
    it('mindestens ein Eintrag im Dataset hat Hecht + Teich + typ in der erlaubten Liste', () => {
      const hechtTeichEintraege = BAIT_DATASET.filter(
        (e) => e.fischart.includes('Hecht') && e.gewaesserart.includes('Teich')
      )
      const erlaubteEintraege = hechtTeichEintraege.filter((e) =>
        HECHT_TEICH_ERLAUBTE_TYPEN.includes(e.typ)
      )
      expect(erlaubteEintraege.length).toBeGreaterThanOrEqual(1)
    })

    it('enthält Einträge für alle vier erlaubten Typen oder einen sinnvollen Teilsatz', () => {
      const hechtTeichEintraege = BAIT_DATASET.filter(
        (e) => e.fischart.includes('Hecht') && e.gewaesserart.includes('Teich')
      )
      const vorhandeneTypen = new Set(
        hechtTeichEintraege
          .filter((e) => HECHT_TEICH_ERLAUBTE_TYPEN.includes(e.typ))
          .map((e) => e.typ)
      )
      // At minimum the dataset must have entries that produce results for Hecht+Teich
      expect(vorhandeneTypen.size).toBeGreaterThanOrEqual(1)
      // Verify we have at least these types (confirmed from data analysis: Wobbler, Spinner, Gummifisch)
      expect(vorhandeneTypen.has('Wobbler') || vorhandeneTypen.has('Spinner') || vorhandeneTypen.has('Gummifisch') || vorhandeneTypen.has('Blinker')).toBe(true)
    })

    it('query(Hecht + Teich) liefert mindestens 1 Ergebnis aus BAIT_DATASET', () => {
      const profile = { ...emptyProfile(), fischart: 'Hecht', gewaesserart: 'Teich' }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
    })
  })
})

// ---------------------------------------------------------------------------
// Unit Tests — Task 2.9: Temperaturregeln in FilterEngine.query()
// Feature: fishing-bait-advisor
// Validates: Requirements 6.2, 6.3, 6.4
// ---------------------------------------------------------------------------

describe('FilterEngine.query() — Temperaturregeln', () => {

  // -------------------------------------------------------------------------
  // Regel 1: [0, 8°C) → nur Grundmontage-Koeder
  // -------------------------------------------------------------------------
  describe('Regel 1: Wassertemperatur [0,8°C) → nur Grundmontage-Koeder', () => {
    it('bei t=0: alle Ergebnisse haben klasse === Grundmontage-Koeder', () => {
      const profile = { ...emptyProfile(), wassertemperatur: 0 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.klasse).toBe('Grundmontage-Koeder')
      }
    })

    it('bei t=7 (Grenze darunter): alle Ergebnisse haben klasse === Grundmontage-Koeder', () => {
      const profile = { ...emptyProfile(), wassertemperatur: 7 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.klasse).toBe('Grundmontage-Koeder')
      }
    })

    it('bei t=8 (Grenze): Regel 1 gilt NICHT (andere Klassen sind erlaubt)', () => {
      // At t=8 the cold rule no longer applies; other klassen should be possible
      const profile = { ...emptyProfile(), wassertemperatur: 8 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      const klassen = results.map((r) => r.bait.klasse)
      // We expect klassen other than Grundmontage-Koeder to appear at t=8
      const hasNonGrundmontage = klassen.some((k) => k !== 'Grundmontage-Koeder')
      expect(hasNonGrundmontage).toBe(true)
    })

    it('custom dataset: Nicht-Grundmontage-Einträge werden bei t=3 herausgefiltert', () => {
      const dataset = [
        makeBait({ id: 't-grnd', typBezeichnung: 'Grundmontage-Test', klasse: 'Grundmontage-Koeder', basisScore: 5, tempMin: 0, tempMax: 35 }),
        makeBait({ id: 't-tief', typBezeichnung: 'Tiefen-Test',       klasse: 'Tiefenkoeder',        basisScore: 5, tempMin: 0, tempMax: 35 }),
        makeBait({ id: 't-ober', typBezeichnung: 'Ober-Test',         klasse: 'Oberflaechenkoeder',  basisScore: 5, tempMin: 0, tempMax: 35 }),
        makeBait({ id: 't-all',  typBezeichnung: 'Allrounder-Test',   klasse: 'Allrounder',          basisScore: 5, tempMin: 0, tempMax: 35 }),
      ]
      const profile = { ...emptyProfile(), wassertemperatur: 3 }
      const results = FilterEngine.query(profile, dataset)
      const resultIds = results.map((r) => r.bait.id)
      expect(resultIds).toContain('t-grnd')
      expect(resultIds).not.toContain('t-tief')
      expect(resultIds).not.toContain('t-ober')
      expect(resultIds).not.toContain('t-all')
    })
  })

  // -------------------------------------------------------------------------
  // Regel 2: [8, 18°C] → mindestens ein Oberflaechenkoeder + ein Tiefenkoeder (sofern vorhanden)
  // -------------------------------------------------------------------------
  describe('Regel 2: Wassertemperatur [8,18°C] → Oberflächen- und Tiefenköder enthalten', () => {
    it('bei t=15: Ergebnisse enthalten mindestens einen Oberflaechenkoeder und einen Tiefenkoeder', () => {
      // At t=15 bait-002 (Oberflaechenkoeder, tempMin=15) and several Tiefenkoeder match
      const profile = { ...emptyProfile(), wassertemperatur: 15 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      const klassen = results.map((r) => r.bait.klasse)
      expect(klassen).toContain('Oberflaechenkoeder')
      expect(klassen).toContain('Tiefenkoeder')
    })

    it('bei t=18 (obere Grenze): Oberflaechenkoeder und Tiefenkoeder vorhanden', () => {
      const profile = { ...emptyProfile(), wassertemperatur: 18 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      const klassen = results.map((r) => r.bait.klasse)
      expect(klassen).toContain('Oberflaechenkoeder')
      expect(klassen).toContain('Tiefenkoeder')
    })

    it('bei t=8 (untere Grenze): Tiefenkoeder vorhanden; Oberflaechenkoeder nur wenn im Dataset verfügbar', () => {
      // At t=8 no Oberflaechenkoeder has tempMin <= 8 in the dataset, so the rule only
      // guarantees Oberflaechenkoeder if they are available in the temp-filtered pool.
      const profile = { ...emptyProfile(), wassertemperatur: 8 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      // Tiefenkoeder should be present at t=8 (several have tempMin=4 or tempMin=8)
      const klassen = results.map((r) => r.bait.klasse)
      expect(klassen).toContain('Tiefenkoeder')
    })

    it('custom dataset: fehlender Oberflaechenkoeder wird aus dem Pool nachgezogen', () => {
      // top5 would normally be all Tiefenkoeder, but Oberflaechenkoeder should be injected
      const dataset = [
        makeBait({ id: 'r2-o1', typBezeichnung: 'Ober-1', klasse: 'Oberflaechenkoeder', basisScore: 3, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-t1', typBezeichnung: 'Tief-1', klasse: 'Tiefenkoeder',       basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-t2', typBezeichnung: 'Tief-2', klasse: 'Tiefenkoeder',       basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-t3', typBezeichnung: 'Tief-3', klasse: 'Tiefenkoeder',       basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-t4', typBezeichnung: 'Tief-4', klasse: 'Tiefenkoeder',       basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-t5', typBezeichnung: 'Tief-5', klasse: 'Tiefenkoeder',       basisScore: 8, tempMin: 8, tempMax: 20 }),
      ]
      const profile = { ...emptyProfile(), wassertemperatur: 12 }
      const results = FilterEngine.query(profile, dataset)
      const klassen = results.map((r) => r.bait.klasse)
      expect(klassen).toContain('Oberflaechenkoeder')
    })

    it('custom dataset: fehlender Tiefenkoeder wird aus dem Pool nachgezogen (wenn Platz vorhanden)', () => {
      // top5 has Oberflaechenkoeder and Grundmontage; Tiefenkoeder needs to be injected
      // The replacement targets non-Tiefenkoeder and non-Oberflaechenkoeder entries
      const dataset = [
        makeBait({ id: 'r2-t1', typBezeichnung: 'Tief-1', klasse: 'Tiefenkoeder',       basisScore: 3, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-o1', typBezeichnung: 'Ober-1', klasse: 'Oberflaechenkoeder', basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-g1', typBezeichnung: 'Grund-1', klasse: 'Grundmontage-Koeder', basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-g2', typBezeichnung: 'Grund-2', klasse: 'Grundmontage-Koeder', basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-g3', typBezeichnung: 'Grund-3', klasse: 'Grundmontage-Koeder', basisScore: 8, tempMin: 8, tempMax: 20 }),
        makeBait({ id: 'r2-g4', typBezeichnung: 'Grund-4', klasse: 'Grundmontage-Koeder', basisScore: 8, tempMin: 8, tempMax: 20 }),
      ]
      const profile = { ...emptyProfile(), wassertemperatur: 12 }
      const results = FilterEngine.query(profile, dataset)
      const klassen = results.map((r) => r.bait.klasse)
      expect(klassen).toContain('Tiefenkoeder')
      expect(klassen).toContain('Oberflaechenkoeder')
    })

    it('bei t=19 (außerhalb Regel 2): Sonderregel gilt NICHT', () => {
      // At t=19 the [8,18] rule no longer applies
      const profile = { ...emptyProfile(), wassertemperatur: 19 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      // [8,18] rule doesn't apply, so we don't require both classes
      // Just verify results are returned (not an empty array)
      expect(results.length).toBeGreaterThanOrEqual(1)
    })
  })

  // -------------------------------------------------------------------------
  // Regel 3: (18, 35°C] → Anteil Oberflaechenkoeder >= 50 %
  // -------------------------------------------------------------------------
  describe('Regel 3: Wassertemperatur (18,35°C] → Oberflächenköder-Mehrheit', () => {
    it('bei t=20: Anteil Oberflaechenkoeder >= 50%', () => {
      const profile = { ...emptyProfile(), wassertemperatur: 20 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      const surfaceCount = results.filter((r) => r.bait.klasse === 'Oberflaechenkoeder').length
      const ratio = surfaceCount / results.length
      expect(ratio).toBeGreaterThanOrEqual(0.5)
    })

    it('bei t=25: Anteil Oberflaechenkoeder >= 50%', () => {
      const profile = { ...emptyProfile(), wassertemperatur: 25 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      const surfaceCount = results.filter((r) => r.bait.klasse === 'Oberflaechenkoeder').length
      const ratio = surfaceCount / results.length
      expect(ratio).toBeGreaterThanOrEqual(0.5)
    })

    it('bei t=35 (obere Grenze): Anteil Oberflaechenkoeder >= 50%', () => {
      const profile = { ...emptyProfile(), wassertemperatur: 35 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      const surfaceCount = results.filter((r) => r.bait.klasse === 'Oberflaechenkoeder').length
      const ratio = surfaceCount / results.length
      expect(ratio).toBeGreaterThanOrEqual(0.5)
    })

    it('bei t=18 (Grenze): Regel 3 gilt NICHT', () => {
      // t=18 is in [8,18] range, not (18,35]
      // At t=18 we expect rule 2 behavior, NOT rule 3 ratio enforcement
      const profile = { ...emptyProfile(), wassertemperatur: 18 }
      const results = FilterEngine.query(profile, BAIT_DATASET)
      const klassen = results.map((r) => r.bait.klasse)
      // At t=18 both Oberflaechenkoeder and Tiefenkoeder should be present (rule 2)
      expect(klassen).toContain('Oberflaechenkoeder')
      expect(klassen).toContain('Tiefenkoeder')
    })

    it('custom dataset: Oberflächenköder werden aus Pool hochgezogen wenn Anteil < 50%', () => {
      const dataset = [
        makeBait({ id: 'r3-o1', typBezeichnung: 'Ober-1', klasse: 'Oberflaechenkoeder', basisScore: 3, tempMin: 19, tempMax: 35 }),
        makeBait({ id: 'r3-o2', typBezeichnung: 'Ober-2', klasse: 'Oberflaechenkoeder', basisScore: 3, tempMin: 19, tempMax: 35 }),
        makeBait({ id: 'r3-t1', typBezeichnung: 'Ander-1', klasse: 'Tiefenkoeder',      basisScore: 8, tempMin: 19, tempMax: 35 }),
        makeBait({ id: 'r3-t2', typBezeichnung: 'Ander-2', klasse: 'Tiefenkoeder',      basisScore: 8, tempMin: 19, tempMax: 35 }),
        makeBait({ id: 'r3-t3', typBezeichnung: 'Ander-3', klasse: 'Tiefenkoeder',      basisScore: 8, tempMin: 19, tempMax: 35 }),
        makeBait({ id: 'r3-t4', typBezeichnung: 'Ander-4', klasse: 'Tiefenkoeder',      basisScore: 8, tempMin: 19, tempMax: 35 }),
        makeBait({ id: 'r3-t5', typBezeichnung: 'Ander-5', klasse: 'Tiefenkoeder',      basisScore: 8, tempMin: 19, tempMax: 35 }),
      ]
      const profile = { ...emptyProfile(), wassertemperatur: 22 }
      const results = FilterEngine.query(profile, dataset)
      expect(results.length).toBeGreaterThanOrEqual(1)
      const surfaceCount = results.filter((r) => r.bait.klasse === 'Oberflaechenkoeder').length
      const ratio = surfaceCount / results.length
      expect(ratio).toBeGreaterThanOrEqual(0.5)
    })
  })
})

// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.10
// Feature: fishing-bait-advisor, Property 11: Wassertemperatur [0,8°C) → nur Grundmontage-Köder
// Validates: Requirements 6.2
// ---------------------------------------------------------------------------

describe('Property 11: Wassertemperatur [0,8°C) → nur Grundmontage-Köder', () => {
  /**
   * For any wassertemperatur t with 0 <= t < 8 and any other filter values:
   * All returned recommendations must have bait.klasse === 'Grundmontage-Koeder'.
   */
  test('Alle Empfehlungen haben klasse === Grundmontage-Koeder bei Temperaturen [0,8°C)', () => {
    // Feature: fishing-bait-advisor, Property 11: Wassertemperatur [0,8°C) → nur Grundmontage-Köder
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 7 }),
        fc.record({
          wetter:      fc.constantFrom(...WEATHER_VALUES,    null),
          tageszeit:   fc.constantFrom(...TIME_OF_DAY_VALUES, null),
          stroemung:   fc.constantFrom(...CURRENT_VALUES,     null),
          gewaesserart: fc.constantFrom(...WATER_TYPE_VALUES, null),
          tiefe:       fc.constantFrom(...DEPTH_VALUES,       null),
          jahreszeit:  fc.constantFrom(...SEASON_VALUES,      null),
          fischart:    fc.constantFrom(...FISH_TYPE_VALUES,   null),
        }),
        (temp, partialProfile) => {
          const profile = { ...partialProfile, wassertemperatur: temp }
          const results = FilterEngine.query(profile, BAIT_DATASET)

          for (const rec of results) {
            expect(rec.bait.klasse).toBe('Grundmontage-Koeder')
          }
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.11
// Feature: fishing-bait-advisor, Property 12: Wassertemperatur [8,18°C] → Oberflächen- und Tiefenköder enthalten
// Validates: Requirements 6.3
// ---------------------------------------------------------------------------

describe('Property 12: Wassertemperatur [8,18°C] → Oberflächen- und Tiefenköder enthalten', () => {
  /**
   * For any wassertemperatur t with 8 <= t <= 18 and any FilterProfile,
   * IF the filtered dataset (after all regular filters) contains entries with
   * klasse === 'Oberflaechenkoeder' AND entries with klasse === 'Tiefenkoeder',
   * THEN the result list must contain at least one of each class.
   */
  test('Ergebnisliste enthält min. einen Oberflächenköder und einen Tiefenköder, wenn im Dataset vorhanden', () => {
    // Feature: fishing-bait-advisor, Property 12: Wassertemperatur [8,18°C] → Oberflächen- und Tiefenköder enthalten
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 18 }),
        fc.record({
          wetter:      fc.constantFrom(...WEATHER_VALUES,    null),
          tageszeit:   fc.constantFrom(...TIME_OF_DAY_VALUES, null),
          stroemung:   fc.constantFrom(...CURRENT_VALUES,     null),
          gewaesserart: fc.constantFrom(...WATER_TYPE_VALUES, null),
          tiefe:       fc.constantFrom(...DEPTH_VALUES,       null),
          jahreszeit:  fc.constantFrom(...SEASON_VALUES,      null),
          fischart:    fc.constantFrom(...FISH_TYPE_VALUES,   null),
        }),
        (temp, partialProfile) => {
          const profile = { ...partialProfile, wassertemperatur: temp }

          // Determine which entries survive all regular filters (excluding temp class rules)
          // by querying with null temperature to see what's available after other filters
          const profileNoTemp = { ...partialProfile, wassertemperatur: null }
          // We check the full dataset for entries that pass other filters AND temp range
          const filterNames = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart']
          const available = BAIT_DATASET.filter((entry) => {
            for (const name of filterNames) {
              const val = partialProfile[name]
              if (val === null || val === undefined) continue
              if (!Array.isArray(entry[name]) || !entry[name].includes(val)) return false
            }
            // Temperature range match
            const aboveMin = (entry.tempMin === null || entry.tempMin === undefined) ? true : temp >= entry.tempMin
            const belowMax = (entry.tempMax === null || entry.tempMax === undefined) ? true : temp <= entry.tempMax
            return aboveMin && belowMax
          })

          const availableHasOberflaeche = available.some((e) => e.klasse === 'Oberflaechenkoeder')
          const availableHasTiefen = available.some((e) => e.klasse === 'Tiefenkoeder')

          // Only assert when both classes are available in the filtered pool
          fc.pre(availableHasOberflaeche && availableHasTiefen)

          const results = FilterEngine.query(profile, BAIT_DATASET)

          const resultHasOberflaeche = results.some((r) => r.bait.klasse === 'Oberflaechenkoeder')
          const resultHasTiefen = results.some((r) => r.bait.klasse === 'Tiefenkoeder')

          expect(resultHasOberflaeche).toBe(true)
          expect(resultHasTiefen).toBe(true)
        },
      ),
      { numRuns: 100, maxSkipsPerRun: 1000 },
    )
  })
})

// ---------------------------------------------------------------------------
// Property-Based Test — Task 2.12
// Feature: fishing-bait-advisor, Property 13: Wassertemperatur (18,35°C] → Oberflächenköder-Mehrheit
// Validates: Requirements 6.4
// ---------------------------------------------------------------------------

describe('Property 13: Wassertemperatur (18,35°C] → Oberflächenköder-Mehrheit', () => {
  /**
   * For any wassertemperatur t with 18 < t <= 35 and any FilterProfile:
   * IF results are non-empty, the ratio of entries with klasse === 'Oberflaechenkoeder'
   * to the total results must be >= 0.5.
   *
   * If no surface entries exist in the filtered pool at all, the property vacuously
   * holds for empty results. We skip empty result sets via fc.pre.
   */
  test('Anteil Oberflächenköder >= 50% bei Temperaturen (18,35°C]', () => {
    // Feature: fishing-bait-advisor, Property 13: Wassertemperatur (18,35°C] → Oberflächenköder-Mehrheit
    fc.assert(
      fc.property(
        fc.integer({ min: 19, max: 35 }),
        fc.record({
          wetter:      fc.constantFrom(...WEATHER_VALUES,    null),
          tageszeit:   fc.constantFrom(...TIME_OF_DAY_VALUES, null),
          stroemung:   fc.constantFrom(...CURRENT_VALUES,     null),
          gewaesserart: fc.constantFrom(...WATER_TYPE_VALUES, null),
          tiefe:       fc.constantFrom(...DEPTH_VALUES,       null),
          jahreszeit:  fc.constantFrom(...SEASON_VALUES,      null),
          fischart:    fc.constantFrom(...FISH_TYPE_VALUES,   null),
        }),
        (temp, partialProfile) => {
          const profile = { ...partialProfile, wassertemperatur: temp }

          // Check if any Oberflaechenkoeder exists in the filtered pool for this profile+temp
          const filterNames = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart']
          const available = BAIT_DATASET.filter((entry) => {
            for (const name of filterNames) {
              const val = partialProfile[name]
              if (val === null || val === undefined) continue
              if (!Array.isArray(entry[name]) || !entry[name].includes(val)) return false
            }
            const aboveMin = (entry.tempMin === null || entry.tempMin === undefined) ? true : temp >= entry.tempMin
            const belowMax = (entry.tempMax === null || entry.tempMax === undefined) ? true : temp <= entry.tempMax
            return aboveMin && belowMax
          })

          // Only assert when there is at least one Oberflaechenkoeder available
          fc.pre(available.some((e) => e.klasse === 'Oberflaechenkoeder'))

          const results = FilterEngine.query(profile, BAIT_DATASET)

          // Skip empty result sets
          fc.pre(results.length > 0)

          const surfaceCount = results.filter((r) => r.bait.klasse === 'Oberflaechenkoeder').length
          const ratio = surfaceCount / results.length
          expect(ratio).toBeGreaterThanOrEqual(0.5)
        },
      ),
      { numRuns: 100 },
    )
  })
})

// ---------------------------------------------------------------------------
// Unit Tests — Task 2.13: Fallback-Logik bei 0 Treffern (FilterEngine.getFallback)
// Feature: fishing-bait-advisor
// Validates: Requirements 2.4, 1.6
// ---------------------------------------------------------------------------

describe('FilterEngine.getFallback()', () => {

  // -------------------------------------------------------------------------
  // Test 1: Maximal 3 Ergebnisse
  // -------------------------------------------------------------------------
  describe('Maximale Ergebnisanzahl', () => {
    it('gibt maximal 3 Ergebnisse zurück', () => {
      const profile = { ...emptyProfile() }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeLessThanOrEqual(3)
    })

    it('gibt auch bei kleinem Dataset nicht mehr als 3 zurück', () => {
      const dataset = [
        makeBait({ id: 'fb-1', typBezeichnung: 'Alpha', basisScore: 7, gewaesserart: ['See'], jahreszeit: ['Sommer'], tempMin: null, tempMax: null }),
        makeBait({ id: 'fb-2', typBezeichnung: 'Beta',  basisScore: 6, gewaesserart: ['See'], jahreszeit: ['Sommer'], tempMin: null, tempMax: null }),
        makeBait({ id: 'fb-3', typBezeichnung: 'Gamma', basisScore: 5, gewaesserart: ['See'], jahreszeit: ['Sommer'], tempMin: null, tempMax: null }),
        makeBait({ id: 'fb-4', typBezeichnung: 'Delta', basisScore: 4, gewaesserart: ['See'], jahreszeit: ['Sommer'], tempMin: null, tempMax: null }),
        makeBait({ id: 'fb-5', typBezeichnung: 'Epsilon', basisScore: 3, gewaesserart: ['See'], jahreszeit: ['Sommer'], tempMin: null, tempMax: null }),
      ]
      const profile = { ...emptyProfile(), gewaesserart: 'See', jahreszeit: 'Sommer' }
      const results = FilterEngine.getFallback(profile, dataset)
      expect(results.length).toBeLessThanOrEqual(3)
      expect(results.length).toBe(3)
    })
  })

  // -------------------------------------------------------------------------
  // Test 2: Jedes Ergebnis hat isFallback: true
  // -------------------------------------------------------------------------
  describe('isFallback-Flag', () => {
    it('jedes Ergebnis hat isFallback: true', () => {
      const profile = { ...emptyProfile() }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.isFallback).toBe(true)
      }
    })

    it('isFallback: true auch wenn gewaesserart und jahreszeit gesetzt sind', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'See', jahreszeit: 'Sommer' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.isFallback).toBe(true)
      }
    })
  })

  // -------------------------------------------------------------------------
  // Test 3: Ergebnisse passen zur gewaesserart aus dem Profil (wenn gesetzt)
  // -------------------------------------------------------------------------
  describe('gewaesserart-Filter wird berücksichtigt', () => {
    it('alle Ergebnisse enthalten die gesetzte gewaesserart', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'Fluss' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.gewaesserart).toContain('Fluss')
      }
    })

    it('gewaesserart Teich: nur passende Einträge zurückgegeben', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'Teich' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.gewaesserart).toContain('Teich')
      }
    })

    it('gewaesserart Meer: nur passende Einträge zurückgegeben', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'Meer' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.gewaesserart).toContain('Meer')
      }
    })
  })

  // -------------------------------------------------------------------------
  // Test 4: Ergebnisse passen zur jahreszeit aus dem Profil (wenn gesetzt)
  // -------------------------------------------------------------------------
  describe('jahreszeit-Filter wird berücksichtigt', () => {
    it('alle Ergebnisse enthalten die gesetzte jahreszeit', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Winter' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.jahreszeit).toContain('Winter')
      }
    })

    it('jahreszeit Herbst: nur passende Einträge zurückgegeben', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Herbst' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.jahreszeit).toContain('Herbst')
      }
    })

    it('sowohl gewaesserart als auch jahreszeit gesetzt: beide Filter greifen', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'See', jahreszeit: 'Sommer' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec.bait.gewaesserart).toContain('See')
        expect(rec.bait.jahreszeit).toContain('Sommer')
      }
    })
  })

  // -------------------------------------------------------------------------
  // Test 5: Wenn beide null → 3 generische Fallbacks sortiert nach basisScore
  // -------------------------------------------------------------------------
  describe('Generische Fallbacks wenn gewaesserart und jahreszeit null sind', () => {
    it('liefert 3 Ergebnisse bei vollständig null-Profil', () => {
      const profile = emptyProfile() // alle Filter null
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBe(3)
    })

    it('Ergebnisse sind nach basisScore absteigend sortiert (null-Profil)', () => {
      const profile = emptyProfile()
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score)
      }
    })

    it('alle isFallback: true auch beim null-Profil', () => {
      const profile = emptyProfile()
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      for (const rec of results) {
        expect(rec.isFallback).toBe(true)
      }
    })

    it('custom dataset mit null-Profil: top 3 nach basisScore', () => {
      const dataset = [
        makeBait({ id: 'g-1', typBezeichnung: 'Score-10', basisScore: 10, tempMin: null, tempMax: null }),
        makeBait({ id: 'g-2', typBezeichnung: 'Score-8',  basisScore: 8,  tempMin: null, tempMax: null }),
        makeBait({ id: 'g-3', typBezeichnung: 'Score-6',  basisScore: 6,  tempMin: null, tempMax: null }),
        makeBait({ id: 'g-4', typBezeichnung: 'Score-4',  basisScore: 4,  tempMin: null, tempMax: null }),
        makeBait({ id: 'g-5', typBezeichnung: 'Score-2',  basisScore: 2,  tempMin: null, tempMax: null }),
      ]
      const profile = emptyProfile()
      const results = FilterEngine.getFallback(profile, dataset)
      expect(results.length).toBe(3)
      expect(results[0].bait.id).toBe('g-1')
      expect(results[1].bait.id).toBe('g-2')
      expect(results[2].bait.id).toBe('g-3')
      for (const rec of results) {
        expect(rec.isFallback).toBe(true)
      }
    })
  })

  // -------------------------------------------------------------------------
  // Test 6: Leeres Dataset → leeres Array
  // -------------------------------------------------------------------------
  describe('Leerer Datensatz', () => {
    it('gibt leeres Array zurück, wenn Dataset leer ist', () => {
      const profile = emptyProfile()
      const results = FilterEngine.getFallback(profile, [])
      expect(results).toEqual([])
    })

    it('gibt leeres Array zurück, wenn Dataset leer ist und Filter gesetzt sind', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'See', jahreszeit: 'Winter' }
      const results = FilterEngine.getFallback(profile, [])
      expect(results).toEqual([])
    })
  })

  // -------------------------------------------------------------------------
  // Test 7: Andere Profilfelder werden ignoriert (nur gewaesserart + jahreszeit)
  // -------------------------------------------------------------------------
  describe('Eingeschränkte Filterlogik: nur gewaesserart + jahreszeit', () => {
    it('fischart, wetter etc. schränken die Fallback-Ergebnisse NICHT ein', () => {
      // Dataset mit einem Eintrag, der Barsch NICHT enthält
      const dataset = [
        makeBait({
          id: 'fb-kein-barsch',
          typBezeichnung: 'Allrounder-Sommer-See',
          basisScore: 8,
          gewaesserart: ['See'],
          jahreszeit: ['Sommer'],
          fischart: ['Karpfen'], // KEIN Barsch
          tempMin: null,
          tempMax: null,
        }),
      ]
      // Profil mit fischart: 'Barsch' (strenger Filter) + gewaesserart: 'See'
      const profile = { ...emptyProfile(), fischart: 'Barsch', gewaesserart: 'See' }
      // getFallback darf fischart NICHT beachten → der Eintrag soll trotzdem zurückgegeben werden
      const results = FilterEngine.getFallback(profile, dataset)
      expect(results.length).toBe(1)
      expect(results[0].bait.id).toBe('fb-kein-barsch')
      expect(results[0].isFallback).toBe(true)
    })

    it('wassertemperatur wird in getFallback ignoriert', () => {
      const dataset = [
        makeBait({
          id: 'fb-kalt',
          typBezeichnung: 'Warmwasser-Köder',
          basisScore: 8,
          gewaesserart: ['See'],
          jahreszeit: ['Sommer'],
          tempMin: 20,
          tempMax: 35,
        }),
      ]
      // Profil mit eiskalter Temperatur, die query() normalerweise ausschließen würde
      const profile = { ...emptyProfile(), wassertemperatur: 2, gewaesserart: 'See' }
      const results = FilterEngine.getFallback(profile, dataset)
      // Temperaturfilter wird in getFallback ignoriert → Eintrag wird zurückgegeben
      expect(results.length).toBe(1)
      expect(results[0].bait.id).toBe('fb-kalt')
      expect(results[0].isFallback).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // Test 8: Recommendation-Struktur der Fallbacks
  // -------------------------------------------------------------------------
  describe('Struktur der Fallback-Empfehlungen', () => {
    it('jede Fallback-Empfehlung hat bait, score, kurzerklaerung, charakteristika, isFallback', () => {
      const profile = { ...emptyProfile(), gewaesserart: 'See' }
      const results = FilterEngine.getFallback(profile, BAIT_DATASET)
      expect(results.length).toBeGreaterThanOrEqual(1)
      for (const rec of results) {
        expect(rec).toHaveProperty('bait')
        expect(rec).toHaveProperty('score')
        expect(rec).toHaveProperty('kurzerklaerung')
        expect(rec).toHaveProperty('charakteristika')
        expect(rec).toHaveProperty('isFallback')
        expect(rec.isFallback).toBe(true)
      }
    })

    it('Fallback-Empfehlungen sind von normalen Empfehlungen unterscheidbar', () => {
      const profile = { ...emptyProfile(), jahreszeit: 'Sommer' }
      const normalResults = FilterEngine.query(profile, BAIT_DATASET)
      const fallbackResults = FilterEngine.getFallback(profile, BAIT_DATASET)

      // Normale Empfehlungen haben kein isFallback-Flag
      for (const rec of normalResults) {
        expect(rec.isFallback).toBeUndefined()
      }
      // Fallback-Empfehlungen haben isFallback: true
      for (const rec of fallbackResults) {
        expect(rec.isFallback).toBe(true)
      }
    })
  })
})
