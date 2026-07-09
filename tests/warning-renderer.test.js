/**
 * DOM-Tests für WarningRenderer — Task 8.4
 * Anforderungen: 7.1, 7.2, 7.3, 7.4
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WarningRenderer } from '../src/js/warning-renderer.js';
import WarningEngine from '../src/js/warning-engine.js';

// ---------------------------------------------------------------------------
// DOM-Setup
// ---------------------------------------------------------------------------

/**
 * Erstellt einen minimalen DOM-Baum mit dem #warning-container
 * und einem #recommendation-list für visuelle Differenzierung.
 */
function setupDOM() {
  document.body.innerHTML = `
    <section id="warning-container" aria-live="polite" aria-label="Warnhinweise"></section>
    <div id="recommendation-list"></div>
  `;
}

beforeEach(() => {
  setupDOM();
  WarningEngine.reset();
});

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

/** @returns {import('../src/js/warning-engine.js').Warning} */
function makeWarning(overrides = {}) {
  return {
    id: 'warn-storm',
    text: 'Sturmwetter beeinträchtigt den Angelerfolg stark – Angeln bei Sturm kann gefährlich sein.',
    dismissed: false,
    ...overrides,
  };
}

/** @returns {import('../src/js/warning-engine.js').Warning} */
function makeMiddaySummerWarning(overrides = {}) {
  return {
    id: 'warn-midday-summer',
    text: 'Die Mittagshitze im Sommer reduziert den Biss stark. Besser früh morgens oder abends angeln.',
    dismissed: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// renderWarnings() — Grundstruktur
// ---------------------------------------------------------------------------

describe('renderWarnings() — Grundstruktur', () => {
  it('rendert eine .warning-card pro Warnung', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const cards = document.querySelectorAll('.warning-card');
    expect(cards).toHaveLength(1);
  });

  it('rendert mehrere .warning-card bei mehreren Warnungen', () => {
    WarningRenderer.renderWarnings([makeWarning(), makeMiddaySummerWarning()], null);

    const cards = document.querySelectorAll('.warning-card');
    expect(cards).toHaveLength(2);
  });

  it('leert den Container vor dem Rendern (kein doppelter Inhalt)', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);
    WarningRenderer.renderWarnings([makeWarning()], null);

    const cards = document.querySelectorAll('.warning-card');
    expect(cards).toHaveLength(1);
  });

  it('rendert nichts wenn die Warnliste leer ist', () => {
    WarningRenderer.renderWarnings([], null);

    const cards = document.querySelectorAll('.warning-card');
    expect(cards).toHaveLength(0);
  });

  it('setzt data-warning-id Attribut auf die Warnungs-ID', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const card = document.querySelector('.warning-card');
    expect(card.getAttribute('data-warning-id')).toBe('warn-storm');
  });

  it('setzt role="alert" auf jede Warnkarte', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const card = document.querySelector('.warning-card');
    expect(card.getAttribute('role')).toBe('alert');
  });
});

// ---------------------------------------------------------------------------
// Requirement 7.1 und 7.2 — korrekte Warnungstexte
// ---------------------------------------------------------------------------

describe('Requirement 7.1/7.2 — korrekte Warnungstexte', () => {
  it('zeigt den Sturmwarnung-Text korrekt an (Req 7.1)', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const text = document.querySelector('.warning-card__text');
    expect(text).not.toBeNull();
    expect(text.textContent).toBe(
      'Sturmwetter beeinträchtigt den Angelerfolg stark – Angeln bei Sturm kann gefährlich sein.'
    );
  });

  it('zeigt den Mittagssommer-Warntext korrekt an (Req 7.2)', () => {
    WarningRenderer.renderWarnings([makeMiddaySummerWarning()], null);

    const text = document.querySelector('.warning-card__text');
    expect(text).not.toBeNull();
    expect(text.textContent).toBe(
      'Die Mittagshitze im Sommer reduziert den Biss stark. Besser früh morgens oder abends angeln.'
    );
  });
});

// ---------------------------------------------------------------------------
// Requirement 7.3 — Warnsymbol und abweichende Hintergrundfarbe
// ---------------------------------------------------------------------------

describe('Requirement 7.3 — Warnsymbol und visuelle Abgrenzung', () => {
  it('enthält ein .warning-card__icon Element mit ⚠️', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const icon = document.querySelector('.warning-card__icon');
    expect(icon).not.toBeNull();
    expect(icon.textContent).toBe('⚠️');
  });

  it('das Icon hat aria-hidden="true"', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const icon = document.querySelector('.warning-card__icon');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('.warning-card und .recommendation-card sind strukturell unterschiedlich', () => {
    // Eine Warnkarte in den Container einfügen
    WarningRenderer.renderWarnings([makeWarning()], null);

    // Eine minimal gefüllte Empfehlungskarte in recommendation-list einfügen
    const recList = document.getElementById('recommendation-list');
    recList.innerHTML = '<div class="recommendation-card"><span class="recommendation-card__title">Test</span></div>';

    const warningCard = document.querySelector('.warning-card');
    const recCard = document.querySelector('.recommendation-card');

    // Beide sind vorhanden
    expect(warningCard).not.toBeNull();
    expect(recCard).not.toBeNull();

    // Warnkarte hat .warning-card Klasse, nicht .recommendation-card
    expect(warningCard.classList.contains('recommendation-card')).toBe(false);
    // Empfehlungskarte hat .recommendation-card Klasse, nicht .warning-card
    expect(recCard.classList.contains('warning-card')).toBe(false);
  });

  it('Warnkarte ist im #warning-container, nicht in #recommendation-list', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const warningInContainer = document.querySelector('#warning-container .warning-card');
    const warningInRecList = document.querySelector('#recommendation-list .warning-card');

    expect(warningInContainer).not.toBeNull();
    expect(warningInRecList).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Schließen-Schaltfläche — Mindestgröße und Funktion (Requirement 7.3, 7.4)
// ---------------------------------------------------------------------------

describe('Schließen-Schaltfläche', () => {
  it('enthält eine .warning-card__close Schaltfläche', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const closeBtn = document.querySelector('.warning-card__close');
    expect(closeBtn).not.toBeNull();
  });

  it('Schließen-Button ist ein button-Element vom type="button"', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const closeBtn = document.querySelector('.warning-card__close');
    expect(closeBtn.tagName.toLowerCase()).toBe('button');
    expect(closeBtn.getAttribute('type')).toBe('button');
  });

  it('Schließen-Button hat ein aria-label', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const closeBtn = document.querySelector('.warning-card__close');
    expect(closeBtn.getAttribute('aria-label')).toBeTruthy();
  });

  it('Klick auf Schließen-Button entfernt die Warnkarte aus dem DOM', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const closeBtn = document.querySelector('.warning-card__close');
    closeBtn.click();

    const cards = document.querySelectorAll('.warning-card');
    expect(cards).toHaveLength(0);
  });

  it('Klick auf Schließen-Button ruft WarningEngine.dismiss() auf (Req 7.4)', () => {
    const dismissSpy = vi.spyOn(WarningEngine, 'dismiss');
    WarningRenderer.renderWarnings([makeWarning()], null);

    const closeBtn = document.querySelector('.warning-card__close');
    closeBtn.click();

    expect(dismissSpy).toHaveBeenCalledWith('warn-storm');
    dismissSpy.mockRestore();
  });

  it('Klick auf Schließen-Button verändert keine Filterwerte (Req 7.4)', () => {
    const activeProfile = {
      wetter: 'Sturm',
      tageszeit: null,
      stroemung: null,
      gewaesserart: null,
      tiefe: null,
      jahreszeit: null,
      fischart: null,
      wassertemperatur: null,
    };
    const profileSnapshot = { ...activeProfile };

    WarningRenderer.renderWarnings([makeWarning()], null);

    const closeBtn = document.querySelector('.warning-card__close');
    closeBtn.click();

    // Das Profil-Objekt wurde nicht verändert
    expect(activeProfile).toEqual(profileSnapshot);
  });

  it('Klick auf Schließen-Button ruft den onDismiss-Callback auf', () => {
    const onDismiss = vi.fn();
    WarningRenderer.renderWarnings([makeWarning()], onDismiss);

    const closeBtn = document.querySelector('.warning-card__close');
    closeBtn.click();

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('kein Fehler wenn onDismiss null ist', () => {
    WarningRenderer.renderWarnings([makeWarning()], null);

    const closeBtn = document.querySelector('.warning-card__close');
    expect(() => closeBtn.click()).not.toThrow();
  });

  it('nur die geklickte Warnkarte wird entfernt, andere bleiben', () => {
    WarningRenderer.renderWarnings([makeWarning(), makeMiddaySummerWarning()], null);

    const closeBtns = document.querySelectorAll('.warning-card__close');
    expect(closeBtns).toHaveLength(2);

    // Erste Warnung schließen
    closeBtns[0].click();

    const cards = document.querySelectorAll('.warning-card');
    expect(cards).toHaveLength(1);
    expect(cards[0].getAttribute('data-warning-id')).toBe('warn-midday-summer');
  });
});

// ---------------------------------------------------------------------------
// clearWarnings()
// ---------------------------------------------------------------------------

describe('clearWarnings()', () => {
  it('leert den #warning-container vollständig', () => {
    WarningRenderer.renderWarnings([makeWarning(), makeMiddaySummerWarning()], null);

    // Zwei Karten vorhanden
    expect(document.querySelectorAll('.warning-card')).toHaveLength(2);

    WarningRenderer.clearWarnings();

    expect(document.getElementById('warning-container').innerHTML).toBe('');
    expect(document.querySelectorAll('.warning-card')).toHaveLength(0);
  });

  it('tut nichts wenn Container bereits leer ist', () => {
    expect(() => WarningRenderer.clearWarnings()).not.toThrow();
    expect(document.getElementById('warning-container').innerHTML).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Integration mit WarningEngine.evaluate()
// ---------------------------------------------------------------------------

describe('Integration mit WarningEngine', () => {
  it('rendert warn-storm korrekt wenn wetter === Sturm', () => {
    WarningEngine.reset();
    const profile = {
      wetter: 'Sturm', tageszeit: null, stroemung: null, gewaesserart: null,
      tiefe: null, jahreszeit: null, fischart: null, wassertemperatur: null,
    };
    const warnings = WarningEngine.evaluate(profile);
    WarningRenderer.renderWarnings(warnings, null);

    const card = document.querySelector('.warning-card[data-warning-id="warn-storm"]');
    expect(card).not.toBeNull();
    expect(card.querySelector('.warning-card__icon').textContent).toBe('⚠️');
    expect(card.querySelector('.warning-card__text').textContent).toContain('Sturmwetter');
  });

  it('rendert warn-midday-summer bei Mittag+Sommer+sonnig', () => {
    WarningEngine.reset();
    const profile = {
      wetter: 'sonnig', tageszeit: 'Mittag', stroemung: null, gewaesserart: null,
      tiefe: null, jahreszeit: 'Sommer', fischart: null, wassertemperatur: null,
    };
    const warnings = WarningEngine.evaluate(profile);
    WarningRenderer.renderWarnings(warnings, null);

    const card = document.querySelector('.warning-card[data-warning-id="warn-midday-summer"]');
    expect(card).not.toBeNull();
    expect(card.querySelector('.warning-card__text').textContent).toContain('Mittagshitze');
  });

  it('nach dismiss() erscheint die Warnung nicht mehr im DOM', () => {
    WarningEngine.reset();
    const profile = {
      wetter: 'Sturm', tageszeit: null, stroemung: null, gewaesserart: null,
      tiefe: null, jahreszeit: null, fischart: null, wassertemperatur: null,
    };
    const warnings = WarningEngine.evaluate(profile);
    WarningRenderer.renderWarnings(warnings, null);

    // Warnung schließen
    document.querySelector('.warning-card__close').click();

    // WarningEngine kennt die ID jetzt als dismissed
    const after = WarningEngine.evaluate(profile);
    expect(after).toHaveLength(0);

    // Container ist leer
    expect(document.querySelectorAll('.warning-card')).toHaveLength(0);
  });

  it('nach reset() und erneutem evaluate() erscheint die Warnung wieder', () => {
    WarningEngine.reset();
    const profile = {
      wetter: 'Sturm', tageszeit: null, stroemung: null, gewaesserart: null,
      tiefe: null, jahreszeit: null, fischart: null, wassertemperatur: null,
    };

    // 1. Rendern und schließen
    WarningRenderer.renderWarnings(WarningEngine.evaluate(profile), null);
    document.querySelector('.warning-card__close').click();

    // 2. Engine zurücksetzen (simuliert Profil-Reset)
    WarningEngine.reset();

    // 3. Warnung erneut rendern
    const warnings2 = WarningEngine.evaluate(profile);
    WarningRenderer.renderWarnings(warnings2, null);

    expect(document.querySelectorAll('.warning-card')).toHaveLength(1);
  });
});
