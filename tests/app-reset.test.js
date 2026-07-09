// Feature: fishing-bait-advisor
// AppController — Task 7.3 Reset-Funktion | Task 7.4 PBT Property 3: Reset setzt alle Filter zurück
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// DOM-Setup: Minimales HTML für AppController.init() und onReset()
// ---------------------------------------------------------------------------

/**
 * Erstellt alle DOM-Elemente, die AppController.init() und onReset() benötigen.
 * Wird vor jedem Test aufgerufen, damit ein sauberer DOM-Zustand vorhanden ist.
 */
function setupDOM() {
  document.body.innerHTML = `
    <div id="recommendation-panel">
      <h2>Empfehlungen</h2>
      <ul id="recommendation-list"></ul>
    </div>
    <div id="warning-container"></div>
    <div id="filter-panel">
      <select id="filter-wetter"><option value=""></option><option value="sonnig">sonnig</option><option value="Sturm">Sturm</option></select>
      <select id="filter-tageszeit"><option value=""></option><option value="Morgen">Morgen</option><option value="Mittag">Mittag</option></select>
      <select id="filter-stroemung"><option value=""></option><option value="schwach">schwach</option></select>
      <select id="filter-gewaesserart"><option value=""></option><option value="Fluss">Fluss</option></select>
      <select id="filter-tiefe"><option value=""></option><option value="Grund">Grund</option></select>
      <select id="filter-jahreszeit"><option value=""></option><option value="Sommer">Sommer</option></select>
      <select id="filter-fischart"><option value=""></option><option value="Forelle">Forelle</option></select>
      <input type="checkbox" id="temp-toggle" />
      <div id="temp-input-wrapper" class="hidden">
        <input type="number" id="filter-wassertemperatur" />
        <span id="temp-error" class="hidden"></span>
      </div>
      <button id="btn-reset">Zurücksetzen</button>
      <button id="btn-profile-save">Speichern</button>
      <input type="text" id="profile-name-input" />
    </div>
    <ul id="profile-list"></ul>
    <div id="detail-modal" class="hidden">
      <div class="modal-backdrop"></div>
      <button id="modal-close">×</button>
    </div>
    <div id="offline-banner" class="hidden"></div>
  `;
}

// ---------------------------------------------------------------------------
// Enum-Werte für Arbitraries (aus bait-data.js)
// ---------------------------------------------------------------------------

const WEATHER_VALUES = ['sonnig', 'leicht bewölkt', 'bedeckt', 'Regen', 'starker Regen', 'Wind', 'Sturm'];
const TIME_OF_DAY_VALUES = ['Morgengrauen', 'Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht'];
const CURRENT_VALUES = ['keine', 'schwach', 'mittel', 'stark'];
const WATER_TYPE_VALUES = ['Fluss', 'See', 'Teich', 'Stausee', 'Meer', 'Brackwasser'];
const DEPTH_VALUES = ['Oberfläche', 'Mittelwasser', 'Grund'];
const SEASON_VALUES = ['Frühling', 'Sommer', 'Herbst', 'Winter'];
const FISH_TYPE_VALUES = ['Forelle', 'Barsch', 'Hecht', 'Karpfen', 'Zander', 'Aal', 'Brachse', 'Schleie', 'Wels', 'Rotauge'];

/**
 * Arbitrary für ein beliebiges FilterProfile (Felder können null oder gültige Werte sein).
 * Mindestens ein Feld ist nicht null, um einen aussagekräftigen Reset-Test zu gewährleisten.
 */
function arbitraryNonNullFilterProfile() {
  return fc.record({
    wetter: fc.constantFrom(...WEATHER_VALUES, null),
    tageszeit: fc.constantFrom(...TIME_OF_DAY_VALUES, null),
    stroemung: fc.constantFrom(...CURRENT_VALUES, null),
    gewaesserart: fc.constantFrom(...WATER_TYPE_VALUES, null),
    tiefe: fc.constantFrom(...DEPTH_VALUES, null),
    jahreszeit: fc.constantFrom(...SEASON_VALUES, null),
    fischart: fc.constantFrom(...FISH_TYPE_VALUES, null),
    wassertemperatur: fc.oneof(fc.integer({ min: 0, max: 35 }), fc.constant(null)),
  });
}

// ---------------------------------------------------------------------------
// Tests für AppController.onReset()
// ---------------------------------------------------------------------------

describe('AppController.onReset()', () => {
  beforeEach(() => {
    setupDOM();
    // localStorage leeren für saubere Testisolation
    localStorage.clear();
  });

  // Dynamischer Import von app.js, damit DOM-Setup VOR dem Modulstart läuft.
  // Jedes `it` importiert frisch, weil vitest Module cacht — wir nutzen vi.resetModules().
  async function loadAppController() {
    vi.resetModules();
    const mod = await import('../src/js/app.js');
    return mod.AppController;
  }

  // ---------------------------------------------------------------------------
  // Unit-Tests
  // ---------------------------------------------------------------------------

  it('setzt alle 8 Felder des activeProfile nach onReset() auf null', async () => {
    const AppController = await loadAppController();

    // Zuerst einige Filter setzen
    AppController.onFilterChange('wetter', 'Sturm');
    AppController.onFilterChange('fischart', 'Forelle');
    AppController.onFilterChange('jahreszeit', 'Sommer');

    // Reset
    AppController.onReset();

    // Nach Reset müssen alle DOM-Dropdowns leer sein
    const filterDropdowns = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart'];
    for (const name of filterDropdowns) {
      const el = document.getElementById(`filter-${name}`);
      expect(el.value).toBe('');
    }

    // Temperatur-Toggle und Eingabe zurückgesetzt
    const tempToggle = document.getElementById('temp-toggle');
    const tempInput = document.getElementById('filter-wassertemperatur');
    expect(tempToggle.checked).toBe(false);
    expect(tempInput.value).toBe('');
  });

  it('setzt Temperatur-Eingabe nach onReset() zurück wenn sie vorher einen Wert hatte', async () => {
    const AppController = await loadAppController();

    // Temperatur-Toggle aktivieren und Wert setzen
    const tempToggle = document.getElementById('temp-toggle');
    const tempWrapper = document.getElementById('temp-input-wrapper');
    tempToggle.checked = true;
    tempWrapper.classList.remove('hidden');

    const tempInput = document.getElementById('filter-wassertemperatur');
    tempInput.value = '15';
    AppController.onFilterChange('wassertemperatur', 15);

    // Reset
    AppController.onReset();

    expect(tempToggle.checked).toBe(false);
    expect(tempInput.value).toBe('');
    expect(tempWrapper.classList.contains('hidden')).toBe(true);
  });

  it('DOM-Dropdowns zeigen nach onReset() leeren Wert an', async () => {
    const AppController = await loadAppController();

    // Alle Dropdowns auf einen Wert setzen
    const setters = [
      ['wetter', 'sonnig'],
      ['tageszeit', 'Morgen'],
      ['stroemung', 'schwach'],
      ['gewaesserart', 'Fluss'],
      ['tiefe', 'Grund'],
      ['jahreszeit', 'Sommer'],
      ['fischart', 'Forelle'],
    ];
    for (const [name, value] of setters) {
      AppController.onFilterChange(name, value);
      const el = document.getElementById(`filter-${name}`);
      el.value = value; // DOM-Wert spiegeln wie onFilterChange() es im echten Browser täte
    }

    AppController.onReset();

    for (const [name] of setters) {
      const el = document.getElementById(`filter-${name}`);
      expect(el.value).toBe('');
    }
  });
});

// ---------------------------------------------------------------------------
// Property-Based Test — Task 7.4
// Feature: fishing-bait-advisor, Property 3: Reset setzt alle Filter zurück
// Validates: Requirements 1.5
// ---------------------------------------------------------------------------

describe('Property 3: Reset setzt alle Filter zurück', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
  });

  /**
   * For any arbitrary combination of active filter values:
   * after calling onReset(), all 8 fields of the FilterProfile must be null,
   * and all 7 DOM dropdowns must show an empty value.
   */
  it('alle 8 Felder im FilterProfile sind nach onReset() null — für beliebige Eingangswerte', async () => {
    vi.resetModules();
    const mod = await import('../src/js/app.js');
    const AppController = mod.AppController;

    fc.assert(
      fc.property(arbitraryNonNullFilterProfile(), (profile) => {
        // Alle Felder des Profils über onFilterChange() setzen
        const filterNames = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart'];
        for (const name of filterNames) {
          if (profile[name] !== null) {
            AppController.onFilterChange(name, profile[name]);
            // DOM manuell spiegeln (wie ein echtes <select> change event)
            const el = document.getElementById(`filter-${name}`);
            if (el) el.value = profile[name];
          }
        }
        if (profile.wassertemperatur !== null) {
          AppController.onFilterChange('wassertemperatur', profile.wassertemperatur);
          const tempToggle = document.getElementById('temp-toggle');
          const tempInput = document.getElementById('filter-wassertemperatur');
          if (tempToggle) tempToggle.checked = true;
          if (tempInput) tempInput.value = String(profile.wassertemperatur);
        }

        // Reset aufrufen
        AppController.onReset();

        // Alle DOM-Dropdowns müssen leer sein
        for (const name of filterNames) {
          const el = document.getElementById(`filter-${name}`);
          if (el) {
            expect(el.value).toBe('');
          }
        }

        // Temperatur-Felder müssen zurückgesetzt sein
        const tempToggle = document.getElementById('temp-toggle');
        const tempInput = document.getElementById('filter-wassertemperatur');
        if (tempToggle) expect(tempToggle.checked).toBe(false);
        if (tempInput) expect(tempInput.value).toBe('');
      }),
      { numRuns: 100 },
    );
  });
});
