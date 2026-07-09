/**
 * @fileoverview WarningRenderer — rendert Warnhinweise in den #warning-container des DOM.
 *
 * Jede aktive Warnung wird als `.warning-card` gerendert mit:
 * - Warnsymbol ⚠️ (.warning-card__icon)
 * - Warntext (.warning-card__text)
 * - Schließen-Schaltfläche 44×44 px (.warning-card__close), die WarningEngine.dismiss() aufruft
 *
 * Der Container (#warning-container) ist visuell klar von Empfehlungskarten getrennt
 * (gelber/oranger Hintergrund via CSS-Klasse .warning-card).
 */

import WarningEngine from './warning-engine.js';

/**
 * @typedef {import('./warning-engine.js').Warning} Warning
 */

/**
 * Rendert alle aktiven Warnungen in den #warning-container.
 * Bereits vorhandene Warnkarten werden zuvor geleert.
 *
 * @param {Warning[]} warnings - Liste der aktiven (nicht geschlossenen) Warnungen
 * @param {function(): void} onDismiss - Callback, der nach dem Schließen einer Warnung
 *   aufgerufen wird, damit AppController die Warnliste neu auswerten kann
 */
function renderWarnings(warnings, onDismiss) {
  const container = document.getElementById('warning-container');
  if (!container) return;

  // Bestehende Warnkarten entfernen
  container.innerHTML = '';

  for (const warning of warnings) {
    const card = createWarningCard(warning, onDismiss);
    container.appendChild(card);
  }
}

/**
 * Erstellt ein einzelnes Warnkarten-Element (.warning-card).
 *
 * @param {Warning} warning - Die darzustellende Warnung
 * @param {function(): void} onDismiss - Callback nach dem Schließen
 * @returns {HTMLElement}
 */
function createWarningCard(warning, onDismiss) {
  // Äußerer Container
  const card = document.createElement('div');
  card.classList.add('warning-card');
  card.setAttribute('role', 'alert');
  card.setAttribute('data-warning-id', warning.id);

  // Hinweise (hint-*) erhalten einen anderen visuellen Stil
  const isHint = warning.id.startsWith('hint-');
  if (isHint) {
    card.classList.add('warning-card--hint');
  }

  // Symbol: ℹ️ für Hinweise, ⚠️ für Warnungen
  const icon = document.createElement('span');
  icon.classList.add('warning-card__icon');
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = isHint ? 'ℹ️' : '⚠️';

  // Warntext
  const text = document.createElement('p');
  text.classList.add('warning-card__text');
  text.textContent = warning.text;

  // Schließen-Schaltfläche (mindestens 44×44 px per CSS-Klasse)
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('warning-card__close');
  closeBtn.setAttribute('type', 'button');
  closeBtn.setAttribute('aria-label', isHint ? 'Hinweis schließen' : 'Warnhinweis schließen');
  closeBtn.textContent = '✕';

  closeBtn.addEventListener('click', () => {
    // WarningEngine über Schließen informieren (aktive Filter bleiben unverändert)
    WarningEngine.dismiss(warning.id);

    // Karte aus dem DOM entfernen
    card.remove();

    // AppController benachrichtigen, damit er die Warnliste ggf. neu auswertet
    if (typeof onDismiss === 'function') {
      onDismiss();
    }
  });

  card.appendChild(icon);
  card.appendChild(text);
  card.appendChild(closeBtn);

  return card;
}

/**
 * Leert den #warning-container vollständig (z.B. beim Filter-Reset).
 */
function clearWarnings() {
  const container = document.getElementById('warning-container');
  if (container) {
    container.innerHTML = '';
  }
}

export const WarningRenderer = {
  renderWarnings,
  clearWarnings,
};
