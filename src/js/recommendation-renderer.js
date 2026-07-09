/**
 * @fileoverview RecommendationRenderer — rendert Empfehlungskarten, No-Results-Zustand
 * und Fallback-Empfehlungen in das DOM.
 *
 * Ziel-Elemente:
 *   #recommendation-list  — Hauptcontainer für Empfehlungskarten
 *   #detail-modal         — Modal für Detailansicht (renderDetail)
 */

// -------------------------------------------------------------------------------
// Hilfsfunktionen
// -------------------------------------------------------------------------------

/**
 * Gibt eine menschenlesbare deutsche Bezeichnung für eine Köderklasse zurück.
 * @param {string} klasse
 * @returns {string}
 */
function klasseLabel(klasse) {
  const labels = {
    'Oberflaechenkoeder': 'Oberflächenköder',
    'Tiefenkoeder': 'Tiefenköder',
    'Grundmontage-Koeder': 'Grundmontage-Köder',
    'Allrounder': 'Allrounder',
  };
  return labels[klasse] || klasse;
}

/**
 * Erstellt ein Badge-Element.
 * @param {string} text
 * @param {string} [extraClass]
 * @returns {HTMLSpanElement}
 */
function createBadge(text, extraClass) {
  const badge = document.createElement('span');
  badge.className = extraClass ? `badge ${extraClass}` : 'badge';
  badge.textContent = text;
  return badge;
}

/**
 * Baut eine Empfehlungskarte als DOM-Element auf.
 *
 * @param {import('./bait-data.js').Recommendation & { isFallback?: boolean }} recommendation
 * @returns {HTMLElement}
 */
function buildCard(recommendation) {
  const { bait, score, kurzerklaerung, charakteristika, isFallback } = recommendation;

  // Äußere Karte
  const card = document.createElement('article');
  card.className = isFallback
    ? 'recommendation-card recommendation-card--fallback'
    : 'recommendation-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute(
    'aria-label',
    `Empfehlung: ${charakteristika.typBezeichnung}. Klicken für Details.`
  );

  // --- Header (Titel + Score) ---
  const header = document.createElement('div');
  header.className = 'recommendation-card__header';

  const title = document.createElement('h3');
  title.className = 'recommendation-card__title';
  title.textContent = charakteristika.typBezeichnung;

  const scoreBadge = document.createElement('span');
  scoreBadge.className = 'recommendation-card__score';
  scoreBadge.setAttribute('aria-label', `Score: ${score}`);
  scoreBadge.textContent = `Score ${score}`;

  header.appendChild(title);
  header.appendChild(scoreBadge);

  // --- Montage ---
  const montage = document.createElement('p');
  montage.className = 'recommendation-card__montage';
  montage.style.fontSize = '0.8rem';
  montage.style.color = 'var(--color-text-muted)';
  montage.style.marginBottom = '0.35rem';
  montage.innerHTML = `<strong>Montage:</strong> ${bait.montage}`;

  // --- Kurzerkl­ärung ---
  const explanation = document.createElement('p');
  explanation.className = 'recommendation-card__explanation';
  explanation.textContent = kurzerklaerung;

  // --- Charakteristika-Badges ---
  const badges = document.createElement('div');
  badges.className = 'recommendation-card__characteristics';

  // Klasse-Badge (hervorgehoben)
  badges.appendChild(createBadge(klasseLabel(charakteristika.klasse), 'badge--class'));

  // Typ
  badges.appendChild(createBadge(charakteristika.typ));

  // Größe
  const groesseMap = { 'klein': 'Klein', 'mittel': 'Mittel', 'groß': 'Groß' };
  badges.appendChild(createBadge(groesseMap[charakteristika.groesse] || charakteristika.groesse));

  // Farbe
  const farbeMap = {
    'hell': 'Hell',
    'dunkel': 'Dunkel',
    'naturfarben': 'Naturfarben',
    'auffällig': 'Auffällig',
    'zweifarbig': 'Zweifarbig',
  };
  badges.appendChild(createBadge(farbeMap[charakteristika.farbe] || charakteristika.farbe));

  // Gewicht
  const gewichtMap = { 'leicht': 'Leicht', 'mittel': 'Mittel', 'schwer': 'Schwer' };
  badges.appendChild(createBadge(gewichtMap[charakteristika.gewicht] || charakteristika.gewicht));

  // Aktion
  const aktionMap = {
    'langsam': 'Langsam',
    'mittel': 'Mittel',
    'schnell': 'Schnell',
    'taumelnd': 'Taumelnd',
    'pulsierend': 'Pulsierend',
    'sinkend-langsam': 'Sinkend-langsam',
  };
  badges.appendChild(createBadge(aktionMap[charakteristika.aktion] || charakteristika.aktion));

  // Karte zusammenbauen
  card.appendChild(header);
  card.appendChild(montage);
  card.appendChild(explanation);
  card.appendChild(badges);

  // Klick + Enter öffnen Detailansicht
  function openDetail() {
    renderDetail(recommendation);
  }
  card.addEventListener('click', openDetail);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail();
    }
  });

  return card;
}

// -------------------------------------------------------------------------------
// Modal-Verwaltung
// -------------------------------------------------------------------------------

/** @type {HTMLElement|null} Zuletzt fokussiertes Element vor dem Modal-Öffnen. */
let _lastFocusedElement = null;

/**
 * Registriert die Close-Handler für das Detail-Modal.
 * Verwendet ein data-Attribut als Guard gegen doppelte Registrierung auf demselben Element,
 * sodass nach einem DOM-Reset (z. B. in Tests) die Handler korrekt neu registriert werden.
 */
function _initModalHandlers() {
  const modal = document.getElementById('detail-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  // Guard: bereits für dieses konkrete Element initialisiert?
  if (modal.dataset.fbaModalInit === '1') return;
  modal.dataset.fbaModalInit = '1';

  const backdrop = modal.querySelector('.modal-backdrop');

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (_lastFocusedElement) {
      _lastFocusedElement.focus();
      _lastFocusedElement = null;
    }
  }

  // Schließen-Button
  closeBtn.addEventListener('click', closeModal);

  // Klick auf Backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  // Escape-Taste (auf document — einmalig pro Modal-Instanz)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// -------------------------------------------------------------------------------
// Öffentliche API
// -------------------------------------------------------------------------------

/**
 * Leert #recommendation-list und rendert die übergebenen Empfehlungen als Karten.
 * Bei leerer Liste wird `renderEmpty()` aufgerufen.
 *
 * @param {import('./bait-data.js').Recommendation[]} recommendations
 * @param {{ suggestedFilters?: string[], fallbacks?: (import('./bait-data.js').Recommendation & { isFallback: true })[] }} [options]
 */
function renderList(recommendations, options = {}) {
  const list = document.getElementById('recommendation-list');
  if (!list) return;

  // Container leeren
  list.innerHTML = '';

  if (!recommendations || recommendations.length === 0) {
    renderEmpty(options.suggestedFilters || [], options.fallbacks || []);
    return;
  }

  // Karten einfügen
  for (const rec of recommendations) {
    list.appendChild(buildCard(rec));
  }
}

/**
 * Zeigt eine No-Results-Meldung mit Hinweis auf zu lockernde Filter an
 * und rendert anschließend bis zu 3 Fallback-Empfehlungen.
 *
 * @param {string[]} [suggestedFilters] - Namen der Filter, die gelockert werden könnten
 * @param {(import('./bait-data.js').Recommendation & { isFallback: true })[]} [fallbacks]
 */
function renderEmpty(suggestedFilters = [], fallbacks = []) {
  const list = document.getElementById('recommendation-list');
  if (!list) return;

  list.innerHTML = '';

  // No-Results-Block
  const noResults = document.createElement('div');
  noResults.className = 'no-results';
  noResults.setAttribute('role', 'status');
  noResults.setAttribute('aria-live', 'polite');

  const icon = document.createElement('div');
  icon.className = 'no-results__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '🎣';

  const title = document.createElement('p');
  title.className = 'no-results__title';
  title.textContent = 'Keine passenden Köder gefunden';

  const hint = document.createElement('p');
  hint.className = 'no-results__hint';

  if (suggestedFilters && suggestedFilters.length > 0) {
    hint.textContent = `Versuche folgende Filter zu lockern oder zurückzusetzen: ${suggestedFilters.join(', ')}.`;
  } else {
    hint.textContent =
      'Versuche einige Filter zurückzusetzen, um mehr Ergebnisse zu erhalten.';
  }

  noResults.appendChild(icon);
  noResults.appendChild(title);
  noResults.appendChild(hint);
  list.appendChild(noResults);

  // Fallback-Empfehlungen (wenn vorhanden)
  if (fallbacks && fallbacks.length > 0) {
    const fallbackHeader = document.createElement('p');
    fallbackHeader.style.fontSize = '0.85rem';
    fallbackHeader.style.fontWeight = '600';
    fallbackHeader.style.color = 'var(--color-text-muted)';
    fallbackHeader.style.marginTop = '1rem';
    fallbackHeader.style.marginBottom = '0.25rem';
    fallbackHeader.textContent = 'Allgemeine Empfehlungen für dein Gewässer:';
    list.appendChild(fallbackHeader);

    renderFallback(fallbacks);
  }
}

/**
 * Rendert bis zu 3 Fallback-Empfehlungen mit visuellem Fallback-Stil
 * (gestrichelter Rahmen, leicht transparent) in #recommendation-list.
 * Hängt Karten an den bestehenden Listeninhalt an (löscht nicht).
 *
 * @param {(import('./bait-data.js').Recommendation & { isFallback: true })[]} fallbacks
 */
function renderFallback(fallbacks) {
  const list = document.getElementById('recommendation-list');
  if (!list || !fallbacks || fallbacks.length === 0) return;

  const limited = fallbacks.slice(0, 3);
  for (const rec of limited) {
    list.appendChild(buildCard({ ...rec, isFallback: true }));
  }
}

/**
 * Öffnet die Detailansicht für eine Empfehlung im Modal.
 *
 * Zeigt:
 *  - Köder-Name (bait.typBezeichnung) und Montagebezeichnung
 *  - Vollständige Beschreibung (bait.beschreibung)
 *  - Schritt-für-Schritt-Montage (bait.montageSchritte)
 *  - Angeltipp (bait.angeltipp)
 *  - Fachbegriffe mit Definitionen (bait.fachbegriffe)
 *
 * Requirements: 3.2, 3.3
 *
 * @param {import('./bait-data.js').Recommendation} recommendation
 */
function renderDetail(recommendation) {
  // Einmalig Close-Handler registrieren
  _initModalHandlers();

  const modal = document.getElementById('detail-modal');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalBody) return;

  const { bait } = recommendation;

  // ---- Modal-Inhalt aufbauen ----

  // Titel
  const heading = document.createElement('h2');
  heading.id = 'modal-title';
  heading.textContent = bait.typBezeichnung;

  // Montagebezeichnung (unter dem Titel)
  const montageLabel = document.createElement('p');
  montageLabel.style.fontSize = '0.85rem';
  montageLabel.style.color = 'var(--color-text-muted)';
  montageLabel.style.marginBottom = '0.75rem';
  montageLabel.innerHTML = `<strong>Montage:</strong> ${bait.montage}`;

  // Beschreibung
  const beschSection = document.createElement('h3');
  beschSection.textContent = 'Beschreibung';
  const beschText = document.createElement('p');
  beschText.textContent = bait.beschreibung || '';

  // Montage-Schritte
  const montageSection = document.createElement('h3');
  montageSection.textContent = 'Schritt-für-Schritt-Montage';

  let montageContent;
  if (bait.montageSchritte && bait.montageSchritte.length > 0) {
    montageContent = document.createElement('ol');
    montageContent.className = 'montage-steps';
    montageContent.setAttribute('aria-label', 'Montageschritte');
    for (const step of bait.montageSchritte) {
      const li = document.createElement('li');
      li.textContent = step;
      montageContent.appendChild(li);
    }
  } else {
    montageContent = document.createElement('p');
    montageContent.textContent = 'Keine Montageschritte verfügbar.';
  }

  // Angeltipp
  const tippSection = document.createElement('h3');
  tippSection.textContent = 'Angeltipp';
  const tippText = document.createElement('p');
  tippText.textContent = bait.angeltipp || '';

  // Fachbegriffe
  const fachSection = document.createElement('h3');
  fachSection.textContent = 'Fachbegriffe';

  const glossaryList = document.createElement('ul');
  glossaryList.className = 'glossary-list';
  glossaryList.setAttribute('aria-label', 'Fachbegriffe und Definitionen');

  if (bait.fachbegriffe && bait.fachbegriffe.length > 0) {
    for (const { term, definition } of bait.fachbegriffe) {
      const li = document.createElement('li');
      li.className = 'glossary-item';

      const termEl = document.createElement('span');
      termEl.className = 'glossary-item__term';
      termEl.textContent = term;

      const defEl = document.createElement('p');
      defEl.className = 'glossary-item__definition';
      defEl.textContent = definition;

      li.appendChild(termEl);
      li.appendChild(defEl);
      glossaryList.appendChild(li);
    }
  } else {
    const noTerms = document.createElement('li');
    noTerms.style.color = 'var(--color-text-muted)';
    noTerms.style.fontSize = '0.85rem';
    noTerms.textContent = 'Keine Fachbegriffe für diesen Köder hinterlegt.';
    glossaryList.appendChild(noTerms);
  }

  // Alles zusammensetzen
  modalBody.innerHTML = '';
  modalBody.appendChild(heading);
  modalBody.appendChild(montageLabel);
  modalBody.appendChild(beschSection);
  modalBody.appendChild(beschText);
  modalBody.appendChild(montageSection);
  modalBody.appendChild(montageContent);
  modalBody.appendChild(tippSection);
  modalBody.appendChild(tippText);
  modalBody.appendChild(fachSection);
  modalBody.appendChild(glossaryList);

  // Modal öffnen
  modal.setAttribute('aria-labelledby', 'modal-title');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Hintergrund-Scrollen verhindern

  // Fokus merken und auf Schließen-Button setzen (Accessibility)
  _lastFocusedElement = document.activeElement;
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) {
    closeBtn.focus();
  }
}

export const RecommendationRenderer = {
  renderList,
  renderEmpty,
  renderDetail,
  renderFallback,
};
