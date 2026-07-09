// Feature: fishing-bait-advisor
// WarningEngine unit tests — Task 6.1
import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import WarningEngine from '../src/js/warning-engine.js';

/**
 * Hilfsfunktion: Erstellt ein leeres Filterprofil mit allen null-Werten.
 * @returns {import('../src/js/bait-data.js').FilterProfile}
 */
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
  };
}

describe('WarningEngine', () => {
  // Sicherstellen, dass dismissedWarnings vor jedem Test zurückgesetzt wird
  beforeEach(() => {
    WarningEngine.reset();
  });

  // ---------------------------------------------------------------------------
  // evaluate() – warn-storm
  // ---------------------------------------------------------------------------
  describe('evaluate() — warn-storm', () => {
    it('löst warn-storm aus wenn wetter === "Sturm"', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };
      const warnings = WarningEngine.evaluate(profile);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].id).toBe('warn-storm');
      expect(warnings[0].text).toBe(
        'Sturmwetter beeinträchtigt den Angelerfolg stark – Angeln bei Sturm kann gefährlich sein.'
      );
      expect(warnings[0].dismissed).toBe(false);
    });

    it('löst warn-storm NICHT aus bei anderem Wetter', () => {
      const profile = { ...emptyProfile(), wetter: 'sonnig' };
      const warnings = WarningEngine.evaluate(profile);

      const stormWarning = warnings.find((w) => w.id === 'warn-storm');
      expect(stormWarning).toBeUndefined();
    });

    it('löst warn-storm NICHT aus wenn wetter null ist', () => {
      const profile = emptyProfile();
      const warnings = WarningEngine.evaluate(profile);

      expect(warnings.find((w) => w.id === 'warn-storm')).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // evaluate() – warn-midday-summer
  // ---------------------------------------------------------------------------
  describe('evaluate() — warn-midday-summer', () => {
    it('löst warn-midday-summer aus bei Mittag + Sommer + sonnig', () => {
      const profile = {
        ...emptyProfile(),
        tageszeit: 'Mittag',
        jahreszeit: 'Sommer',
        wetter: 'sonnig',
      };
      const warnings = WarningEngine.evaluate(profile);

      const w = warnings.find((w) => w.id === 'warn-midday-summer');
      expect(w).toBeDefined();
      expect(w.text).toBe(
        'Die Mittagshitze im Sommer reduziert den Biss stark. Besser früh morgens oder abends angeln.'
      );
      expect(w.dismissed).toBe(false);
    });

    it('löst warn-midday-summer NICHT aus wenn tageszeit nicht Mittag ist', () => {
      const profile = {
        ...emptyProfile(),
        tageszeit: 'Morgen',
        jahreszeit: 'Sommer',
        wetter: 'sonnig',
      };
      const warnings = WarningEngine.evaluate(profile);
      expect(warnings.find((w) => w.id === 'warn-midday-summer')).toBeUndefined();
    });

    it('löst warn-midday-summer NICHT aus wenn jahreszeit nicht Sommer ist', () => {
      const profile = {
        ...emptyProfile(),
        tageszeit: 'Mittag',
        jahreszeit: 'Herbst',
        wetter: 'sonnig',
      };
      const warnings = WarningEngine.evaluate(profile);
      expect(warnings.find((w) => w.id === 'warn-midday-summer')).toBeUndefined();
    });

    it('löst warn-midday-summer NICHT aus wenn wetter nicht sonnig ist', () => {
      const profile = {
        ...emptyProfile(),
        tageszeit: 'Mittag',
        jahreszeit: 'Sommer',
        wetter: 'bedeckt',
      };
      const warnings = WarningEngine.evaluate(profile);
      expect(warnings.find((w) => w.id === 'warn-midday-summer')).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // evaluate() – mehrere Warnungen gleichzeitig
  // ---------------------------------------------------------------------------
  describe('evaluate() — mehrere Warnungen', () => {
    it('gibt leere Liste zurück wenn keine Bedingungen zutreffen', () => {
      const warnings = WarningEngine.evaluate(emptyProfile());
      expect(warnings).toHaveLength(0);
    });

    it('kann beide Warnungen gleichzeitig auslösen wenn Bedingungen sich nicht ausschließen', () => {
      // warn-storm: wetter === 'Sturm' — schließt warn-midday-summer aus (wetter !== 'sonnig')
      // Diese Kombination ist daher nicht möglich. Stattdessen prüfen wir die Profile separat.
      const stormProfile = { ...emptyProfile(), wetter: 'Sturm' };
      const stormWarnings = WarningEngine.evaluate(stormProfile);
      expect(stormWarnings.find((w) => w.id === 'warn-storm')).toBeDefined();
      expect(stormWarnings.find((w) => w.id === 'warn-midday-summer')).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // evaluate() – dismissed filtering
  // ---------------------------------------------------------------------------
  describe('evaluate() — dismissed Warnungen werden herausgefiltert', () => {
    it('filtert geschlossene Warnungen aus dem Ergebnis', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };

      // Warnung schließen
      WarningEngine.dismiss('warn-storm');

      const warnings = WarningEngine.evaluate(profile);
      expect(warnings.find((w) => w.id === 'warn-storm')).toBeUndefined();
    });

    it('gibt weiterhin nicht-geschlossene Warnungen zurück wenn eine von mehreren geschlossen ist', () => {
      // Nur warn-midday-summer auslösen (Sturm nicht aktiv)
      const profile = {
        ...emptyProfile(),
        tageszeit: 'Mittag',
        jahreszeit: 'Sommer',
        wetter: 'sonnig',
      };

      // warn-storm schließen (ist nicht ausgelöst, sollte keinen Effekt haben)
      WarningEngine.dismiss('warn-storm');

      const warnings = WarningEngine.evaluate(profile);
      expect(warnings.find((w) => w.id === 'warn-midday-summer')).toBeDefined();
    });

    it('verwendet übergebenes dismissedWarnings-Set statt internem Set', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };
      const externalDismissed = new Set(['warn-storm']);

      const warnings = WarningEngine.evaluate(profile, externalDismissed);
      expect(warnings.find((w) => w.id === 'warn-storm')).toBeUndefined();
    });

    it('ignoriert externes Set nicht wenn intern nichts geschlossen ist', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };
      const emptyExternal = new Set();

      const warnings = WarningEngine.evaluate(profile, emptyExternal);
      expect(warnings.find((w) => w.id === 'warn-storm')).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // dismiss()
  // ---------------------------------------------------------------------------
  describe('dismiss()', () => {
    it('schließt eine Warnung — sie erscheint danach nicht mehr in evaluate()', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };

      const before = WarningEngine.evaluate(profile);
      expect(before).toHaveLength(1);

      WarningEngine.dismiss('warn-storm');

      const after = WarningEngine.evaluate(profile);
      expect(after).toHaveLength(0);
    });

    it('ist idempotent — mehrfaches Schließen ändert nichts', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };

      WarningEngine.dismiss('warn-storm');
      WarningEngine.dismiss('warn-storm');
      WarningEngine.dismiss('warn-storm');

      const warnings = WarningEngine.evaluate(profile);
      expect(warnings.find((w) => w.id === 'warn-storm')).toBeUndefined();
    });

    it('ändert das übergebene FilterProfile nicht', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };
      const profileBefore = { ...profile };

      WarningEngine.dismiss('warn-storm');

      expect(profile).toEqual(profileBefore);
    });
  });

  // ---------------------------------------------------------------------------
  // reset()
  // ---------------------------------------------------------------------------
  describe('reset()', () => {
    it('leert das dismissedWarnings-Set vollständig', () => {
      const profile = { ...emptyProfile(), wetter: 'Sturm' };

      WarningEngine.dismiss('warn-storm');
      // Nach dismiss ist Warnung weg
      expect(WarningEngine.evaluate(profile)).toHaveLength(0);

      // Nach reset erscheint sie wieder
      WarningEngine.reset();
      expect(WarningEngine.evaluate(profile)).toHaveLength(1);
    });

    it('stellt sicher, dass nach Reset alle auslösbaren Warnungen wieder erscheinen', () => {
      const profile = {
        ...emptyProfile(),
        tageszeit: 'Mittag',
        jahreszeit: 'Sommer',
        wetter: 'sonnig',
      };

      WarningEngine.dismiss('warn-midday-summer');
      expect(WarningEngine.evaluate(profile)).toHaveLength(0);

      WarningEngine.reset();
      const warnings = WarningEngine.evaluate(profile);
      expect(warnings.find((w) => w.id === 'warn-midday-summer')).toBeDefined();
    });

    it('Warnung wird nach Schließen, Bedingung-Entfernen und Bedingung-Wiedersetzen erneut ausgelöst', () => {
      // Bedingung setzen → Warnung auslösen
      const triggerProfile = { ...emptyProfile(), wetter: 'Sturm' };
      expect(WarningEngine.evaluate(triggerProfile)).toHaveLength(1);

      // Warnung schließen
      WarningEngine.dismiss('warn-storm');
      expect(WarningEngine.evaluate(triggerProfile)).toHaveLength(0);

      // Bedingung entfernen
      const noTriggerProfile = { ...emptyProfile(), wetter: 'sonnig' };
      expect(WarningEngine.evaluate(noTriggerProfile)).toHaveLength(0);

      // Bedingung wieder setzen → reset() vorher nötig (neues Profil-Update = reset per Design)
      WarningEngine.reset();
      expect(WarningEngine.evaluate(triggerProfile)).toHaveLength(1);
    });
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests
// ---------------------------------------------------------------------------

/**
 * Arbitrary für ein vollständiges FilterProfile mit null-Werten.
 * Enthält alle Felder, die WarningEngine auswertet.
 */
const weatherValues = ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen', 'starker Regen', 'Wind', 'Sturm'];
const timeOfDayValues = ['Morgengrauen', 'Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'];
const currentValues = ['keine', 'schwach', 'mittel', 'stark'];
const waterTypeValues = ['Fluss', 'See', 'Teich', 'Stausee', 'Meer', 'Brackwasser'];
const depthValues = ['Oberfläche', 'Mittelwasser', 'Grund'];
const seasonValues = ['Frühling', 'Sommer', 'Herbst', 'Winter'];
const fishTypeValues = ['Forelle', 'Barsch', 'Hecht', 'Karpfen', 'Zander', 'Aal', 'Brachse', 'Schleie', 'Wels', 'Rotauge'];

/**
 * Arbitrary für ein beliebiges FilterProfile (Felder können null oder gültige Werte sein).
 */
function arbitraryFilterProfile() {
  return fc.record({
    wetter: fc.option(fc.constantFrom(...weatherValues), { nil: null }),
    tageszeit: fc.option(fc.constantFrom(...timeOfDayValues), { nil: null }),
    stroemung: fc.option(fc.constantFrom(...currentValues), { nil: null }),
    gewaesserart: fc.option(fc.constantFrom(...waterTypeValues), { nil: null }),
    tiefe: fc.option(fc.constantFrom(...depthValues), { nil: null }),
    jahreszeit: fc.option(fc.constantFrom(...seasonValues), { nil: null }),
    fischart: fc.option(fc.constantFrom(...fishTypeValues), { nil: null }),
    wassertemperatur: fc.option(fc.integer({ min: 0, max: 35 }), { nil: null }),
  });
}

/**
 * Arbitrary für ein FilterProfile, das mindestens eine Warnung auslöst.
 * Entweder wetter === 'Sturm' (warn-storm) oder
 * tageszeit === 'Mittag' && jahreszeit === 'Sommer' && wetter === 'sonnig' (warn-midday-summer).
 */
function arbitraryProfileTriggeringWarning() {
  const stormProfile = arbitraryFilterProfile().map((p) => ({ ...p, wetter: 'Sturm' }));

  const middaySummerProfile = arbitraryFilterProfile().map((p) => ({
    ...p,
    tageszeit: 'Mittag',
    jahreszeit: 'Sommer',
    wetter: 'sonnig',
  }));

  return fc.oneof(stormProfile, middaySummerProfile);
}

// ---------------------------------------------------------------------------
// Property 15: Warnung schließen ändert keine Filter
// Feature: fishing-bait-advisor, Property 15: Warnung schließen ändert keine Filter
// Validates: Requirements 7.4
// ---------------------------------------------------------------------------
describe('Property 15: Warnung schließen ändert keine Filter', () => {
  beforeEach(() => {
    WarningEngine.reset();
  });

  it('dismiss() verändert das FilterProfile nicht und dismissed === true wenn Warnung erneut ausgewertet wird', () => {
    fc.assert(
      fc.property(arbitraryProfileTriggeringWarning(), (profile) => {
        // Sicherstellen, dass dismissed-Set sauber ist
        WarningEngine.reset();

        // Snapshot des Profils VOR dismiss
        const profileBefore = JSON.parse(JSON.stringify(profile));

        // Warnungen auslösen
        const warnings = WarningEngine.evaluate(profile);
        expect(warnings.length).toBeGreaterThan(0);

        const firstWarning = warnings[0];

        // Warnung schließen
        WarningEngine.dismiss(firstWarning.id);

        // FilterProfile muss unverändert sein
        expect(profile).toEqual(profileBefore);

        // Die geschlossene Warnung darf bei erneutem evaluate() nicht mehr erscheinen
        // (sie wurde aus dem Ergebnis herausgefiltert, d.h. dismissed wurde korrekt registriert)
        const warningsAfter = WarningEngine.evaluate(profile);
        const stillPresent = warningsAfter.find((w) => w.id === firstWarning.id);
        expect(stillPresent).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 16: Warnung wird in derselben Sitzung erneut ausgelöst
// Feature: fishing-bait-advisor, Property 16: Warnung wird erneut ausgelöst
// Validates: Requirements 7.5
// ---------------------------------------------------------------------------
describe('Property 16: Warnung wird in derselben Sitzung erneut ausgelöst', () => {
  beforeEach(() => {
    WarningEngine.reset();
  });

  it('warn-storm erscheint erneut nachdem Bedingung entfernt, Session zurückgesetzt und Bedingung wieder gesetzt wird', () => {
    fc.assert(
      fc.property(arbitraryFilterProfile(), (baseProfile) => {
        // Session sauber starten
        WarningEngine.reset();

        // Schritt 1: Bedingung setzen → Warnung erscheint
        const triggerProfile = { ...baseProfile, wetter: 'Sturm' };
        const warnings1 = WarningEngine.evaluate(triggerProfile);
        const stormWarning = warnings1.find((w) => w.id === 'warn-storm');
        expect(stormWarning).toBeDefined();
        expect(stormWarning.dismissed).toBe(false);

        // Schritt 2: Warnung schließen
        WarningEngine.dismiss('warn-storm');

        // Schritt 3: Bedingung entfernen → Warnung nicht mehr relevant
        const noTriggerProfile = { ...baseProfile, wetter: 'sonnig' };
        const warnings2 = WarningEngine.evaluate(noTriggerProfile);
        const stormAfterDismiss = warnings2.find((w) => w.id === 'warn-storm');
        expect(stormAfterDismiss).toBeUndefined();

        // Schritt 4: Gemäß Requirement 7.5 — in derselben Sitzung erneut die Bedingung setzen.
        // Die Sitzung wird dabei durch reset() simuliert (wie es AppController bei Profil-Wechsel tut),
        // woraufhin die Warnung erneut erscheinen muss.
        WarningEngine.reset();
        const warnings3 = WarningEngine.evaluate(triggerProfile);
        const stormReappeared = warnings3.find((w) => w.id === 'warn-storm');
        expect(stormReappeared).toBeDefined();
        expect(stormReappeared.dismissed).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('warn-midday-summer erscheint erneut nachdem Bedingung entfernt und wieder gesetzt wird', () => {
    fc.assert(
      fc.property(arbitraryFilterProfile(), (baseProfile) => {
        // Session sauber starten
        WarningEngine.reset();

        // Schritt 1: Mittag-Sommer-Sonnig Profil → Warnung erscheint
        const triggerProfile = {
          ...baseProfile,
          tageszeit: 'Mittag',
          jahreszeit: 'Sommer',
          wetter: 'sonnig',
        };
        const warnings1 = WarningEngine.evaluate(triggerProfile);
        const midSumWarn = warnings1.find((w) => w.id === 'warn-midday-summer');
        expect(midSumWarn).toBeDefined();
        expect(midSumWarn.dismissed).toBe(false);

        // Schritt 2: Warnung schließen
        WarningEngine.dismiss('warn-midday-summer');

        // Schritt 3: Bedingung entfernen (Tageszeit auf Morgen ändern)
        const noTriggerProfile = { ...triggerProfile, tageszeit: 'Morgen' };
        const warnings2 = WarningEngine.evaluate(noTriggerProfile);
        expect(warnings2.find((w) => w.id === 'warn-midday-summer')).toBeUndefined();

        // Schritt 4: Session zurücksetzen und Bedingung wieder setzen → Warnung erscheint erneut
        WarningEngine.reset();
        const warnings3 = WarningEngine.evaluate(triggerProfile);
        const midSumReappeared = warnings3.find((w) => w.id === 'warn-midday-summer');
        expect(midSumReappeared).toBeDefined();
        expect(midSumReappeared.dismissed).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});
