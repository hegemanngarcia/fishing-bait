/**
 * @fileoverview WarningEngine – wertet das aktive Filterprofil aus und gibt relevante Warnungen zurück.
 * Der "geschlossen"-Zustand wird in einer In-Memory-Set pro Sitzung gehalten.
 */

/**
 * @typedef {import('./bait-data.js').FilterProfile} FilterProfile
 */

/**
 * @typedef {Object} Warning
 * @property {string} id      - Eindeutige Warnungs-ID, z.B. "warn-storm"
 * @property {string} text    - Vollständiger Warntext auf Deutsch
 * @property {boolean} dismissed - Ob die Warnung geschlossen wurde
 */

/**
 * Alle definierten Warnungen (Definitionen ohne dismissed-Status).
 * @type {Array<{id: string, text: string, condition: function(FilterProfile): boolean}>}
 */
const WARNING_DEFINITIONS = [
  {
    id: 'warn-storm',
    text: 'Sturmwetter beeinträchtigt den Angelerfolg stark – Angeln bei Sturm kann gefährlich sein.',
    condition: (profile) => profile.wetter === 'Sturm',
  },
  {
    id: 'warn-midday-summer',
    text: 'Die Mittagshitze im Sommer reduziert den Biss stark. Besser früh morgens oder abends angeln.',
    condition: (profile) =>
      profile.tageszeit === 'Mittag' &&
      profile.jahreszeit === 'Sommer' &&
      profile.wetter === 'sonnig',
  },
  {
    id: 'warn-gebirgsbach-stroemung',
    text: 'Gebirgsbäche haben typischerweise starke bis mittlere Strömung. Bitte prüfe, ob der Filter „Strömung" auf „stark" oder „mittel" angepasst werden soll.',
    condition: (profile) =>
      profile.gewaesserart === 'Gebirgsbach' &&
      (profile.stroemung === 'keine' || profile.stroemung === 'schwach'),
  },
];

/**
 * In-Memory-Set der bereits geschlossenen Warnungs-IDs (pro Sitzung).
 * @type {Set<string>}
 */
const dismissedWarnings = new Set();

/**
 * WarningEngine – wertet Warnbedingungen gegen ein Filterprofil aus.
 */
const WarningEngine = {
  /**
   * Wertet das aktive Filterprofil aus und gibt alle zutreffenden, nicht-geschlossenen Warnungen zurück.
   *
   * @param {FilterProfile} profile - Das aktive Filterprofil
   * @param {Set<string>} [dismissed=dismissedWarnings] - Set der bereits geschlossenen Warnungs-IDs
   * @returns {Warning[]} Liste der aktiven, nicht-geschlossenen Warnungen
   */
  evaluate(profile, dismissed = dismissedWarnings) {
    const active = [];

    for (const def of WARNING_DEFINITIONS) {
      if (def.condition(profile)) {
        const isDismissed = dismissed.has(def.id);
        if (!isDismissed) {
          active.push({
            id: def.id,
            text: def.text,
            dismissed: false,
          });
        }
      }
    }

    return active;
  },

  /**
   * Schließt eine Warnung: Fügt die ID zum internen dismissedWarnings-Set hinzu.
   *
   * @param {string} warningId - Die ID der zu schließenden Warnung
   */
  dismiss(warningId) {
    dismissedWarnings.add(warningId);
  },

  /**
   * Setzt das dismissedWarnings-Set zurück (z.B. bei Filter-Reset).
   */
  reset() {
    dismissedWarnings.clear();
  },
};

export default WarningEngine;
export { WARNING_DEFINITIONS, dismissedWarnings };
