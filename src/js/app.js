/**
 * @fileoverview AppController — Zentraler Koordinator der Fishing Bait Advisor App.
 *
 * Initialisiert alle Module (FilterEngine, ProfileManager, WarningEngine, WarningRenderer,
 * RecommendationRenderer), registriert Event-Listener und orchestriert den Datenfluss.
 */

import { FilterEngine } from './filter-engine.js';
import { ProfileManager } from './profile-manager.js';
import WarningEngine from './warning-engine.js';
import { WarningRenderer } from './warning-renderer.js';
import { RecommendationRenderer } from './recommendation-renderer.js';
import { BAIT_DATASET } from './bait-data.js';

// ---------------------------------------------------------------------------
// Aktives Filterprofil (In-Memory-State)
// ---------------------------------------------------------------------------

/** @type {import('./bait-data.js').FilterProfile} */
let activeProfile = {
  wetter: null,
  tageszeit: null,
  stroemung: null,
  gewaesserart: null,
  tiefe: null,
  jahreszeit: null,
  fischart: null,
  wassertemperatur: null,
};

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

/**
 * Rendert verbleibende aktive Warnungen nach dem Schließen einer Warnung.
 * Die Callback-Funktion, die WarningRenderer nach dismiss() aufruft.
 */
function rerenderWarnings() {
  const remaining = WarningEngine.evaluate(activeProfile);
  WarningRenderer.renderWarnings(remaining, rerenderWarnings);
}

/**
 * Aktualisiert Empfehlungen und Warnungen basierend auf dem aktuellen activeProfile.
 */
function updateUI() {
  // Warnungen auswerten und rendern
  const warnings = WarningEngine.evaluate(activeProfile);
  WarningRenderer.renderWarnings(warnings, rerenderWarnings);

  // Empfehlungen berechnen und rendern
  const recommendations = FilterEngine.query(activeProfile, BAIT_DATASET);
  if (recommendations.length === 0) {
    const fallbacks = FilterEngine.getFallback(activeProfile, BAIT_DATASET);
    RecommendationRenderer.renderEmpty(getSuggestedFilters());
    if (fallbacks.length > 0) {
      RecommendationRenderer.renderFallback(fallbacks);
    }
  } else {
    RecommendationRenderer.renderList(recommendations);
  }
}

/**
 * Ermittelt eine Liste von Filtern, die zur Lockerung empfohlen werden könnten.
 * @returns {string[]}
 */
function getSuggestedFilters() {
  const suggestions = [];
  const filterMap = {
    wetter: 'Wetter',
    tageszeit: 'Tageszeit',
    stroemung: 'Strömung',
    gewaesserart: 'Gewässerart',
    tiefe: 'Tiefe',
    jahreszeit: 'Jahreszeit',
    fischart: 'Fischart',
    wassertemperatur: 'Wassertemperatur',
  };
  for (const [key, label] of Object.entries(filterMap)) {
    if (activeProfile[key] !== null && activeProfile[key] !== undefined) {
      suggestions.push(label);
    }
  }
  return suggestions;
}

/**
 * Zeigt eine deutsche Fehlermeldung in einem Alert-Banner an.
 * @param {string} message - Fehlermeldungstext auf Deutsch
 */
function showError(message) {
  const container = document.getElementById('recommendation-panel');
  if (!container) return;

  const existing = container.querySelector('.alert-banner--error');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.classList.add('alert-banner', 'alert-banner--error');
  banner.setAttribute('role', 'alert');
  banner.textContent = message;

  const heading = container.querySelector('h2');
  if (heading) {
    heading.insertAdjacentElement('afterend', banner);
  } else {
    container.prepend(banner);
  }

  // Banner nach 5 Sekunden automatisch ausblenden
  setTimeout(() => banner.remove(), 5000);
}

// ---------------------------------------------------------------------------
// Filterwert-Validierung (Wassertemperatur)
// ---------------------------------------------------------------------------

import { InputValidator } from './input-validator.js';

/**
 * Verarbeitet die Wassertemperatur-Eingabe mit Validierung.
 * Bei Fehler: Feld markieren + Fehlermeldung; Wert nicht übernehmen.
 * @param {string} rawValue
 */
function handleTemperatureInput(rawValue) {
  const errorEl = document.getElementById('temp-error');
  const inputEl = document.getElementById('filter-wassertemperatur');

  // Leere Eingabe: Temperaturfilter deaktivieren
  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    if (inputEl) inputEl.classList.remove('field-error--active');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    activeProfile.wassertemperatur = null;
    updateUI();
    return;
  }

  const numericValue = Number(rawValue);

  try {
    // InputValidator erwartet eine Zahl oder null
    const validated = InputValidator.validateWassertemperatur(
      Number.isNaN(numericValue) ? rawValue : numericValue
    );
    // Fehlerdarstellung zurücksetzen
    if (inputEl) inputEl.classList.remove('field-error--active');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    activeProfile.wassertemperatur = validated;
    updateUI();
  } catch (err) {
    // Fehlerdarstellung aktivieren
    if (inputEl) inputEl.classList.add('field-error--active');
    if (errorEl) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
    // Wert NICHT ins Profil übernehmen
  }
}

// ---------------------------------------------------------------------------
// Profilverwaltung
// ---------------------------------------------------------------------------

/**
 * Rendert die Profilliste im DOM.
 */
function renderProfileList() {
  const list = document.getElementById('profile-list');
  if (!list) return;

  list.innerHTML = '';
  const profiles = ProfileManager.list();

  for (const profile of profiles) {
    const li = document.createElement('li');
    li.classList.add('profile-item');
    li.setAttribute('data-profile-id', profile.id);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('profile-item__name');
    nameSpan.textContent = profile.name;
    nameSpan.title = profile.name;

    const actions = document.createElement('div');
    actions.classList.add('profile-item__actions');

    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.classList.add('btn', 'btn--icon');
    loadBtn.title = 'Profil laden';
    loadBtn.setAttribute('aria-label', `Profil "${profile.name}" laden`);
    loadBtn.textContent = '▶';
    loadBtn.addEventListener('click', () => onProfileLoad(profile.id));

    const renameBtn = document.createElement('button');
    renameBtn.type = 'button';
    renameBtn.classList.add('btn', 'btn--icon');
    renameBtn.title = 'Profil umbenennen';
    renameBtn.setAttribute('aria-label', `Profil "${profile.name}" umbenennen`);
    renameBtn.textContent = '✏️';
    renameBtn.addEventListener('click', () => {
      const newName = prompt(`Neuer Name für "${profile.name}":`, profile.name);
      if (newName !== null) {
        onProfileRename(profile.id, newName);
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add('btn', 'btn--danger');
    deleteBtn.title = 'Profil löschen';
    deleteBtn.setAttribute('aria-label', `Profil "${profile.name}" löschen`);
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', () => onProfileDelete(profile.id));

    actions.appendChild(loadBtn);
    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(nameSpan);
    li.appendChild(actions);
    list.appendChild(li);
  }
}

/**
 * Synchronisiert die DOM-Filter-Elemente mit dem activeProfile.
 */
function syncFiltersToDOM() {
  const filterMap = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart'];

  for (const name of filterMap) {
    const el = document.getElementById(`filter-${name}`);
    if (el) {
      el.value = activeProfile[name] ?? '';
    }
  }

  // Temperatur-Toggle und Eingabe synchronisieren
  const tempToggle = document.getElementById('temp-toggle');
  const tempWrapper = document.getElementById('temp-input-wrapper');
  const tempInput = document.getElementById('filter-wassertemperatur');

  if (activeProfile.wassertemperatur !== null && activeProfile.wassertemperatur !== undefined) {
    if (tempToggle) tempToggle.checked = true;
    if (tempWrapper) tempWrapper.classList.remove('hidden');
    if (tempInput) tempInput.value = String(activeProfile.wassertemperatur);
  } else {
    if (tempToggle) tempToggle.checked = false;
    if (tempWrapper) tempWrapper.classList.add('hidden');
    if (tempInput) tempInput.value = '';
  }
}

// ---------------------------------------------------------------------------
// AppController-Methoden
// ---------------------------------------------------------------------------

/**
 * Behandelt eine Filteränderung: Profil aktualisieren und UI neu rendern.
 * @param {string} filterName - Name des geänderten Filters
 * @param {string|null} value - Neuer Wert (null oder leer = zurücksetzen)
 */
function onFilterChange(filterName, value) {
  activeProfile[filterName] = (value === '' || value === null) ? null : value;
  updateUI();
}

/**
 * Setzt alle Filter zurück auf null, leert WarningEngine und rendert neu.
 */
function onReset() {
  activeProfile = {
    wetter: null,
    tageszeit: null,
    stroemung: null,
    gewaesserart: null,
    tiefe: null,
    jahreszeit: null,
    fischart: null,
    wassertemperatur: null,
  };

  WarningEngine.reset();
  WarningRenderer.clearWarnings();
  syncFiltersToDOM();
  updateUI();
}

/**
 * Speichert das aktuelle Filterprofil unter dem gegebenen Namen.
 * @param {string} name - Profilname
 */
function onProfileSave(name) {
  try {
    ProfileManager.save(name, activeProfile);
    renderProfileList();
  } catch (err) {
    if (err.name === 'DuplicateNameError') {
      const confirmed = window.confirm(`Ein Profil mit dem Namen „${name}" existiert bereits. Überschreiben?`);
      if (confirmed) {
        try {
          const existing = ProfileManager.list().find((p) => p.name === name);
          if (existing) {
            ProfileManager.delete(existing.id);
            ProfileManager.save(name, activeProfile);
            renderProfileList();
          }
        } catch (e) {
          showError(`Fehler beim Überschreiben des Profils: ${e.message}`);
        }
      }
    } else if (err.name === 'ProfileLimitError') {
      showError('Limit von 10 Profilen erreicht. Bitte löschen Sie ein bestehendes Profil.');
    } else {
      showError(`Fehler beim Speichern des Profils: ${err.message}`);
    }
  }
}

/**
 * Lädt ein gespeichertes Profil und aktiviert es.
 * @param {string} profileId - ID des zu ladenden Profils
 */
function onProfileLoad(profileId) {
  try {
    const saved = ProfileManager.load(profileId);
    activeProfile = { ...saved.filters };
    WarningEngine.reset();
    syncFiltersToDOM();
    updateUI();
  } catch (err) {
    showError(`Fehler beim Laden des Profils: ${err.message}`);
  }
}

/**
 * Löscht ein gespeichertes Profil.
 * @param {string} profileId
 */
function onProfileDelete(profileId) {
  ProfileManager.delete(profileId);
  renderProfileList();
}

/**
 * Benennt ein gespeichertes Profil um.
 * @param {string} profileId
 * @param {string} newName
 */
function onProfileRename(profileId, newName) {
  try {
    ProfileManager.rename(profileId, newName);
    renderProfileList();
  } catch (err) {
    showError(`Fehler beim Umbenennen des Profils: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Initialisierung
// ---------------------------------------------------------------------------

/**
 * Initialisiert die App: Event-Listener registrieren, Service Worker anmelden,
 * Offline-Status überwachen und erste UI-Aktualisierung durchführen.
 */
function init() {
  // --- Filter-Dropdowns ---
  const filterNames = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart'];
  for (const name of filterNames) {
    const el = document.getElementById(`filter-${name}`);
    if (el) {
      el.addEventListener('change', (e) => onFilterChange(name, e.target.value));
    }
  }

  // --- Wassertemperatur-Toggle ---
  const tempToggle = document.getElementById('temp-toggle');
  const tempWrapper = document.getElementById('temp-input-wrapper');
  if (tempToggle && tempWrapper) {
    tempToggle.addEventListener('change', () => {
      if (tempToggle.checked) {
        tempWrapper.classList.remove('hidden');
      } else {
        tempWrapper.classList.add('hidden');
        activeProfile.wassertemperatur = null;
        const tempInput = document.getElementById('filter-wassertemperatur');
        const errorEl = document.getElementById('temp-error');
        if (tempInput) {
          tempInput.value = '';
          tempInput.classList.remove('field-error--active');
        }
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.add('hidden');
        }
        updateUI();
      }
    });
  }

  // --- Wassertemperatur-Eingabe ---
  const tempInput = document.getElementById('filter-wassertemperatur');
  if (tempInput) {
    tempInput.addEventListener('input', (e) => handleTemperatureInput(e.target.value));
  }

  // --- Reset-Button ---
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', onReset);
  }

  // --- Profil speichern ---
  const btnSave = document.getElementById('btn-profile-save');
  const nameInput = document.getElementById('profile-name-input');
  if (btnSave && nameInput) {
    btnSave.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) {
        showError('Bitte geben Sie einen Profilnamen ein.');
        return;
      }
      onProfileSave(name);
      nameInput.value = '';
    });
  }

  // --- Detail-Modal schließen ---
  const modalClose = document.getElementById('modal-close');
  const modal = document.getElementById('detail-modal');
  const backdrop = modal?.querySelector('.modal-backdrop');

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (backdrop && modal) {
    backdrop.addEventListener('click', () => modal.classList.add('hidden'));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });

  // --- Profilliste initialisieren ---
  renderProfileList();

  // --- Service Worker registrieren ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service Worker konnte nicht registriert werden – App funktioniert trotzdem
    });
  }

  // --- Offline-Erkennung ---
  /**
   * Aktualisiert den Offline-Banner und zeigt ggf. einen leeren Zustand an.
   *
   * Verhalten:
   * - Online:             Banner ausblenden; normale UI beibehalten.
   * - Offline + Cache:    Banner einblenden; Empfehlungen bleiben sichtbar.
   * - Offline + kein Cache: Banner einblenden; leeren Zustand mit Offline-Meldung anzeigen.
   */
  function updateOnlineStatus() {
    const banner = document.getElementById('offline-banner');

    if (!navigator.onLine) {
      // Offline-Banner immer einblenden
      if (banner) {
        banner.classList.remove('hidden');
      }

      // Prüfen, ob bereits Inhalte im Empfehlungsbereich vorhanden sind (Cache-Indikator).
      // Ein vorhandener Inhalt (z.B. Empfehlungskarten oder der Standard-Hinweistext) gilt
      // als „Cache vorhanden" — keine weiteren Netzwerkanfragen nötig, da die App statisch ist.
      const recommendationList = document.getElementById('recommendation-list');
      const hasContent = recommendationList && recommendationList.children.length > 0;

      if (!hasContent) {
        // Offline + kein Cache: leeren Zustand mit Offline-Meldung rendern
        if (recommendationList) {
          recommendationList.innerHTML = `<p class="empty-state offline-empty-state">Offline – keine gespeicherten Daten verfügbar</p>`;
        }
      }
    } else {
      // Wieder online: Banner ausblenden
      if (banner) {
        banner.classList.add('hidden');
      }
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // --- Erste UI-Aktualisierung ---
  updateUI();
}

// ---------------------------------------------------------------------------
// Öffentliche AppController-Schnittstelle
// ---------------------------------------------------------------------------

export const AppController = {
  init,
  onFilterChange,
  onReset,
  onProfileSave,
  onProfileLoad,
  onProfileDelete,
  onProfileRename,
};

// App starten sobald DOM bereit ist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
