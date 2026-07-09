/**
 * @fileoverview InputValidator — Validierungslogik für Benutzereingaben im Fishing Bait Advisor.
 */

import { ValidationError } from './profile-manager.js';

export { ValidationError };

/**
 * Validiert einen Wassertemperatur-Eingabewert.
 *
 * Verhalten:
 *   - null oder undefined → gibt null zurück (Filter deaktiviert, kein Fehler)
 *   - nicht-numerisch (z. B. 'abc', '', NaN, Objekte) → wirft ValidationError
 *   - numerisch, aber außerhalb [0, 35] → wirft ValidationError
 *   - numerisch und innerhalb [0, 35] (inklusive) → gibt den validierten Wert zurück
 *
 * @param {*} value - Der zu prüfende Eingabewert
 * @returns {number|null} Den validierten Wert oder null (deaktiviert)
 * @throws {ValidationError} Wenn der Wert nicht-numerisch oder außerhalb [0, 35] ist
 */
function validateWassertemperatur(value) {
  // null / undefined → Filter deaktiviert
  if (value === null || value === undefined) {
    return null;
  }

  // Nur echte Zahlen (number primitives) sind zulässig.
  // Strings (auch numerisch aussehende), Booleans, Objekte und Arrays
  // werden als nicht-numerisch abgelehnt — auch wenn Number() sie
  // in eine Zahl umwandeln könnte (z. B. '' → 0, [] → 0, '  ' → 0).
  // NaN (typeof === 'number') wird ebenfalls abgelehnt.
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new ValidationError(
      'Wassertemperatur muss eine Zahl zwischen 0 und 35 °C sein.'
    );
  }

  const num = value;

  // Bereich prüfen: [0, 35] inklusive
  if (num < 0 || num > 35) {
    throw new ValidationError(
      `Wassertemperatur muss zwischen 0 °C und 35 °C liegen (eingegeben: ${value}).`
    );
  }

  return num;
}

export const InputValidator = {
  validateWassertemperatur,
};
