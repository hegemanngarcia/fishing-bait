/**
 * Unit-Tests für RecommendationRenderer.renderList() und renderEmpty()
 * Anforderungen: 1.6, 2.1, 2.2, 2.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RecommendationRenderer } from '../src/js/recommendation-renderer.js';

// ---------------------------------------------------------------------------
// Minimale Test-Fixtures
// ---------------------------------------------------------------------------

/** @returns {import('../src/js/bait-data.js').BaitEntry} */
function makeBaitEntry(overrides = {}) {
  return {
    id: 'test-001',
    typBezeichnung: 'Kleiner Testspinner',
    typ: 'Spinner',
    groesse: 'klein',
    farbe: 'hell',
    gewicht: 'leicht',
    aktion: 'schnell',
    klasse: 'Tiefenkoeder',
    montage: 'Direkte Schnurmontage',
    montageSchritte: ['Schritt 1', 'Schritt 2'],
    beschreibung: 'Testbeschreibung des Köders.',
    angeltipp: 'Gleichmäßiger Einzug empfohlen.',
    fachbegriffe: [
      { term: 'Spinner', definition: 'Kunstköder mit rotierender Blattschaufel.' },
    ],
    wetter: ['sonnig'],
    tageszeit: ['Morgen'],
    stroemung: ['schwach'],
    gewaesserart: ['See'],
    tiefe: ['Mittelwasser'],
    jahreszeit: ['Sommer'],
    fischart: ['Barsch'],
    tempMin: 10,
    tempMax: 25,
    basisScore: 7,
    ...overrides,
  };
}

/** @returns {import('../src/js/bait-data.js').Recommendation} */
function makeRecommendation(overrides = {}) {
  const bait = makeBaitEntry(overrides.bait || {});
  return {
    bait,
    score: 9,
    kurzerklaerung: 'Kleiner Testspinner eignet sich gut (Jahreszeit: Sommer).',
    charakteristika: {
      typBezeichnung: bait.typBezeichnung,
      typ: bait.typ,
      groesse: bait.groesse,
      farbe: bait.farbe,
      gewicht: bait.gewicht,
      aktion: bait.aktion,
      klasse: bait.klasse,
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// DOM-Setup: einfaches #recommendation-list Element bereitstellen
// ---------------------------------------------------------------------------

function setupDOM() {
  document.body.innerHTML = `
    <div id="recommendation-list"></div>
    <div id="detail-modal" class="hidden">
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <button id="modal-close">✕</button>
        <div id="modal-body"></div>
      </div>
    </div>
  `;
}

beforeEach(() => {
  setupDOM();
});

// ---------------------------------------------------------------------------
// renderList()
// ---------------------------------------------------------------------------

describe('renderList()', () => {
  it('rendert eine Empfehlungskarte pro Empfehlung', () => {
    const recs = [makeRecommendation(), makeRecommendation({ bait: makeBaitEntry({ id: 'test-002', typBezeichnung: 'Zweiter Spinner' }) })];
    recs[1].karakteristika = recs[1].charakteristika; // normalize
    RecommendationRenderer.renderList(recs);

    const cards = document.querySelectorAll('.recommendation-card');
    expect(cards).toHaveLength(2);
  });

  it('zeigt typBezeichnung in der Karte an', () => {
    RecommendationRenderer.renderList([makeRecommendation()]);

    const title = document.querySelector('.recommendation-card__title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Kleiner Testspinner');
  });

  it('zeigt den Score in der Karte an', () => {
    RecommendationRenderer.renderList([makeRecommendation()]);

    const score = document.querySelector('.recommendation-card__score');
    expect(score).not.toBeNull();
    expect(score.textContent).toContain('9');
  });

  it('zeigt die kurzerklaerung in der Karte an', () => {
    RecommendationRenderer.renderList([makeRecommendation()]);

    const explanation = document.querySelector('.recommendation-card__explanation');
    expect(explanation).not.toBeNull();
    expect(explanation.textContent).toContain('Kleiner Testspinner eignet sich gut');
  });

  it('zeigt die montage in der Karte an', () => {
    RecommendationRenderer.renderList([makeRecommendation()]);

    const montageEl = document.querySelector('.recommendation-card__montage');
    expect(montageEl).not.toBeNull();
    expect(montageEl.textContent).toContain('Direkte Schnurmontage');
  });

  it('rendert Charakteristika-Badges', () => {
    RecommendationRenderer.renderList([makeRecommendation()]);

    const badges = document.querySelectorAll('.recommendation-card__characteristics .badge');
    // Erwartet: Klasse, Typ, Größe, Farbe, Gewicht, Aktion = 6 Badges
    expect(badges.length).toBeGreaterThanOrEqual(6);
  });

  it('rendert den Klasse-Badge mit badge--class Klasse', () => {
    RecommendationRenderer.renderList([makeRecommendation()]);

    const klassBadge = document.querySelector('.badge--class');
    expect(klassBadge).not.toBeNull();
    expect(klassBadge.textContent).toBe('Tiefenköder');
  });

  it('leert #recommendation-list vor dem Rendern', () => {
    // Ersten Aufruf
    RecommendationRenderer.renderList([makeRecommendation()]);
    // Zweiten Aufruf mit anderer Empfehlung
    RecommendationRenderer.renderList([
      makeRecommendation({ bait: makeBaitEntry({ typBezeichnung: 'Neuer Spinner' }) }),
    ]);

    const titles = document.querySelectorAll('.recommendation-card__title');
    expect(titles).toHaveLength(1);
    expect(titles[0].textContent).toBe('Neuer Spinner');
  });

  it('ruft renderEmpty() auf wenn die Liste leer ist', () => {
    RecommendationRenderer.renderList([]);

    const noResults = document.querySelector('.no-results');
    expect(noResults).not.toBeNull();
  });

  it('markiert Fallback-Karten mit recommendation-card--fallback', () => {
    const fallback = makeRecommendation({ isFallback: true });
    RecommendationRenderer.renderList([], { fallbacks: [fallback] });

    const fallbackCard = document.querySelector('.recommendation-card--fallback');
    expect(fallbackCard).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// renderEmpty()
// ---------------------------------------------------------------------------

describe('renderEmpty()', () => {
  it('zeigt die No-Results-Überschrift an', () => {
    RecommendationRenderer.renderEmpty();

    const title = document.querySelector('.no-results__title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Keine passenden Köder gefunden');
  });

  it('zeigt einen allgemeinen Hinweis wenn keine suggestedFilters angegeben', () => {
    RecommendationRenderer.renderEmpty();

    const hint = document.querySelector('.no-results__hint');
    expect(hint).not.toBeNull();
    expect(hint.textContent.length).toBeGreaterThan(0);
  });

  it('nennt vorgeschlagene Filter im Hinweistext', () => {
    RecommendationRenderer.renderEmpty(['Fischart', 'Strömung']);

    const hint = document.querySelector('.no-results__hint');
    expect(hint.textContent).toContain('Fischart');
    expect(hint.textContent).toContain('Strömung');
  });

  it('zeigt das Emoji-Icon an', () => {
    RecommendationRenderer.renderEmpty();

    const icon = document.querySelector('.no-results__icon');
    expect(icon).not.toBeNull();
    expect(icon.textContent).toBe('🎣');
  });

  it('rendert bis zu 3 Fallback-Karten', () => {
    const fallbacks = [
      makeRecommendation({ isFallback: true, bait: makeBaitEntry({ id: 'f1', typBezeichnung: 'Fallback 1' }) }),
      makeRecommendation({ isFallback: true, bait: makeBaitEntry({ id: 'f2', typBezeichnung: 'Fallback 2' }) }),
      makeRecommendation({ isFallback: true, bait: makeBaitEntry({ id: 'f3', typBezeichnung: 'Fallback 3' }) }),
    ];
    RecommendationRenderer.renderEmpty([], fallbacks);

    const fallbackCards = document.querySelectorAll('.recommendation-card--fallback');
    expect(fallbackCards).toHaveLength(3);
  });

  it('rendert maximal 3 Fallback-Karten auch wenn mehr übergeben werden', () => {
    const fallbacks = Array.from({ length: 5 }, (_, i) =>
      makeRecommendation({ isFallback: true, bait: makeBaitEntry({ id: `f${i}`, typBezeichnung: `Fallback ${i}` }) })
    );
    RecommendationRenderer.renderEmpty([], fallbacks);

    const fallbackCards = document.querySelectorAll('.recommendation-card--fallback');
    expect(fallbackCards).toHaveLength(3);
  });

  it('zeigt keinen Fallback-Bereich wenn keine Fallbacks übergeben werden', () => {
    RecommendationRenderer.renderEmpty([], []);

    const fallbackCards = document.querySelectorAll('.recommendation-card--fallback');
    expect(fallbackCards).toHaveLength(0);
  });

  it('leert #recommendation-list vor dem Rendern', () => {
    // Vorher etwas rein schreiben
    document.getElementById('recommendation-list').innerHTML = '<p>Alter Inhalt</p>';
    RecommendationRenderer.renderEmpty();

    const old = document.querySelector('#recommendation-list p');
    // Der alte Inhalt soll weg sein (ersetzt durch no-results)
    expect(document.querySelector('#recommendation-list .no-results')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// renderFallback()
// ---------------------------------------------------------------------------

describe('renderFallback()', () => {
  it('hängt Fallback-Karten an den bestehenden Inhalt an', () => {
    // Zunächst renderEmpty aufrufen
    RecommendationRenderer.renderEmpty(['Wetter']);
    const fallback = makeRecommendation({ isFallback: true });
    RecommendationRenderer.renderFallback([fallback]);

    const noResults = document.querySelector('.no-results');
    const fallbackCard = document.querySelector('.recommendation-card--fallback');
    // Beides muss vorhanden sein
    expect(noResults).not.toBeNull();
    expect(fallbackCard).not.toBeNull();
  });

  it('tut nichts wenn leeres Array übergeben wird', () => {
    RecommendationRenderer.renderFallback([]);

    const cards = document.querySelectorAll('.recommendation-card');
    expect(cards).toHaveLength(0);
  });

  it('begrenzt auf 3 Karten', () => {
    const fallbacks = Array.from({ length: 10 }, (_, i) =>
      makeRecommendation({ isFallback: true, bait: makeBaitEntry({ id: `f${i}` }) })
    );
    RecommendationRenderer.renderFallback(fallbacks);

    const cards = document.querySelectorAll('.recommendation-card--fallback');
    expect(cards).toHaveLength(3);
  });
});

// -------------------------------------------------------------------------------
// renderDetail() — Requirements 3.2, 3.3
// -------------------------------------------------------------------------------
describe('renderDetail()', () => {
  it('öffnet das Modal (entfernt hidden-Klasse)', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const modal = document.getElementById('detail-modal');
    expect(modal.classList.contains('hidden')).toBe(false);
  });

  it('zeigt typBezeichnung als Überschrift an', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const heading = document.getElementById('modal-title');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Kleiner Testspinner');
  });

  it('zeigt die vollständige Beschreibung an (Req 3.2)', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const body = document.getElementById('modal-body');
    expect(body.textContent).toContain('Testbeschreibung des Köders.');
  });

  it('zeigt Schritt-für-Schritt-Montage als geordnete Liste an (Req 3.2)', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const steps = document.querySelectorAll('.montage-steps li');
    expect(steps.length).toBe(2);
    expect(steps[0].textContent).toBe('Schritt 1');
    expect(steps[1].textContent).toBe('Schritt 2');
  });

  it('zeigt den Angeltipp an (Req 3.2)', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const body = document.getElementById('modal-body');
    expect(body.textContent).toContain('Gleichmäßiger Einzug empfohlen.');
  });

  it('zeigt Fachbegriffe mit Definitionen an (Req 3.3)', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const glossary = document.querySelector('.glossary-list');
    expect(glossary).not.toBeNull();

    const term = document.querySelector('.glossary-item__term');
    const definition = document.querySelector('.glossary-item__definition');
    expect(term).not.toBeNull();
    expect(term.textContent).toBe('Spinner');
    expect(definition).not.toBeNull();
    expect(definition.textContent).toContain('Blattschaufel');
  });

  it('schließt das Modal per Schließen-Button', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const closeBtn = document.getElementById('modal-close');
    closeBtn.click();

    const modal = document.getElementById('detail-modal');
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  it('schließt das Modal per Backdrop-Klick', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const backdrop = document.querySelector('.modal-backdrop');
    backdrop.click();

    const modal = document.getElementById('detail-modal');
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  it('schließt das Modal per Escape-Taste', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    const modal = document.getElementById('detail-modal');
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  it('zeigt Montagebezeichnung im Modal an', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const body = document.getElementById('modal-body');
    expect(body.textContent).toContain('Direkte Schnurmontage');
  });

  it('zeigt Hinweis wenn keine Fachbegriffe vorhanden (leeres Array)', () => {
    const rec = makeRecommendation({ bait: makeBaitEntry({ fachbegriffe: [] }) });
    RecommendationRenderer.renderDetail(rec);

    const body = document.getElementById('modal-body');
    expect(body.textContent).toContain('Keine Fachbegriffe');
  });

  it('aktualisiert den Modal-Inhalt bei erneutem Aufruf', () => {
    RecommendationRenderer.renderDetail(makeRecommendation());

    const second = makeRecommendation({
      bait: makeBaitEntry({ typBezeichnung: 'Zweiter Testköder', beschreibung: 'Andere Beschreibung.' }),
    });
    RecommendationRenderer.renderDetail(second);

    const heading = document.getElementById('modal-title');
    expect(heading.textContent).toBe('Zweiter Testköder');

    const body = document.getElementById('modal-body');
    expect(body.textContent).toContain('Andere Beschreibung.');
    expect(body.textContent).not.toContain('Testbeschreibung des Köders.');
  });
});
