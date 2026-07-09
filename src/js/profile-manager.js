/**
 * @fileoverview ProfileManager — Speichern, Laden und Auflisten von Filterprofilen in localStorage.
 * localStorage-Schlüssel: `fba_profiles` (JSON-Array von SavedProfile)
 */

// ---------------------------------------------------------------------------
// Benutzerdefinierte Fehlerklassen
// ---------------------------------------------------------------------------

/**
 * Wird geworfen, wenn das Limit von 10 Profilen erreicht ist.
 */
export class ProfileLimitError extends Error {
  constructor(message = 'Limit von 10 Profilen erreicht') {
    super(message);
    this.name = 'ProfileLimitError';
  }
}

/**
 * Wird geworfen, wenn ein Profil mit demselben Namen bereits existiert.
 */
export class DuplicateNameError extends Error {
  /**
   * @param {string} name - Der doppelte Profilname
   */
  constructor(name) {
    super(`Ein Profil mit dem Namen „${name}" existiert bereits`);
    this.name = 'DuplicateNameError';
    this.profileName = name;
  }
}

/**
 * Wird geworfen, wenn ein localStorage-Vorgang fehlschlägt.
 */
export class StorageError extends Error {
  /**
   * @param {string} message
   * @param {Error} [cause]
   */
  constructor(message = 'Fehler beim Zugriff auf den Speicher', cause) {
    super(message);
    this.name = 'StorageError';
    if (cause) this.cause = cause;
  }
}

/**
 * Wird geworfen, wenn ein gespeichertes Profil korrupte oder unvollständige Daten enthält.
 */
export class ProfileLoadError extends Error {
  /**
   * @param {string} profileId
   * @param {string} [reason]
   */
  constructor(profileId, reason = 'Korrupte oder unvollständige Daten') {
    super(`Profil „${profileId}" konnte nicht geladen werden: ${reason}`);
    this.name = 'ProfileLoadError';
    this.profileId = profileId;
  }
}

/**
 * Wird geworfen, wenn ein Profilname ungültig ist (leer oder länger als 50 Zeichen).
 */
export class ValidationError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'Ungültiger Wert') {
    super(message);
    this.name = 'ValidationError';
  }
}

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'fba_profiles';

/**
 * Liest das rohe Profil-Array aus localStorage.
 * @returns {import('./bait-data.js').SavedProfile[]}
 * @throws {StorageError}
 */
function readProfiles() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    throw new StorageError('localStorage konnte nicht gelesen werden', err);
  }
  if (raw === null || raw === undefined) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    // Korrupter Speicher-Zustand: leer zurückgeben
    return [];
  }
}

/**
 * Schreibt das Profil-Array in localStorage.
 * @param {import('./bait-data.js').SavedProfile[]} profiles
 * @throws {StorageError}
 */
function writeProfiles(profiles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    throw new StorageError('Profil konnte nicht gespeichert werden (Speicher voll?)', err);
  }
}

/**
 * Prüft, ob ein SavedProfile-Objekt die Mindeststruktur aufweist.
 * @param {unknown} obj
 * @returns {obj is import('./bait-data.js').SavedProfile}
 */
function isValidSavedProfile(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' && obj.id.length > 0 &&
    typeof obj.name === 'string' && obj.name.length >= 1 && obj.name.length <= 50 &&
    typeof obj.filters === 'object' && obj.filters !== null &&
    typeof obj.savedAt === 'string' && obj.savedAt.length > 0
  );
}

// ---------------------------------------------------------------------------
// ProfileManager
// ---------------------------------------------------------------------------

/**
 * Verwaltet das Speichern, Laden und Auflisten von Filterprofilen in localStorage.
 */
export const ProfileManager = {
  /** Maximale Anzahl gespeicherter Profile */
  MAX_PROFILES: 10,

  /**
   * Speichert ein neues Filterprofil.
   *
   * @param {string} name - Profilname (1–50 Zeichen)
   * @param {import('./bait-data.js').FilterProfile} filterProfile - Aktives Filterprofil
   * @returns {import('./bait-data.js').SavedProfile} Das gespeicherte Profil
   * @throws {ProfileLimitError} Bei ≥ 10 vorhandenen Profilen
   * @throws {DuplicateNameError} Bei bereits existierendem Namen
   * @throws {StorageError} Bei localStorage-Fehler
   */
  save(name, filterProfile) {
    const profiles = readProfiles();

    if (profiles.length >= ProfileManager.MAX_PROFILES) {
      throw new ProfileLimitError();
    }

    const trimmedName = String(name).trim();
    if (profiles.some(p => p.name === trimmedName)) {
      throw new DuplicateNameError(trimmedName);
    }

    /** @type {import('./bait-data.js').SavedProfile} */
    const newProfile = {
      id: crypto.randomUUID(),
      name: trimmedName,
      filters: { ...filterProfile },
      savedAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    writeProfiles(profiles);

    return newProfile;
  },

  /**
   * Lädt ein gespeichertes Profil anhand seiner ID.
   *
   * @param {string} profileId - UUID des Profils
   * @returns {import('./bait-data.js').SavedProfile} Das geladene Profil
   * @throws {ProfileLoadError} Bei nicht gefundener ID oder korrupten Daten
   */
  load(profileId) {
    const profiles = readProfiles();
    const profile = profiles.find(p => p.id === profileId);

    if (!profile) {
      throw new ProfileLoadError(profileId, 'Profil nicht gefunden');
    }

    if (!isValidSavedProfile(profile)) {
      throw new ProfileLoadError(profileId, 'Korrupte oder unvollständige Daten');
    }

    return profile;
  },

  /**
   * Gibt alle gespeicherten Profile zurück.
   *
   * @returns {import('./bait-data.js').SavedProfile[]}
   */
  list() {
    return readProfiles();
  },

  /**
   * Benennt ein gespeichertes Profil um.
   *
   * @param {string} profileId - UUID des Profils
   * @param {string} newName - Neuer Name (1–50 Zeichen)
   * @returns {import('./bait-data.js').SavedProfile} Das aktualisierte Profil
   * @throws {ValidationError} Bei ungültigem Namen
   * @throws {DuplicateNameError} Bei bereits existierendem Namen
   * @throws {StorageError} Bei localStorage-Fehler
   */
  rename(profileId, newName) {
    const trimmedName = String(newName).trim();
    if (trimmedName.length === 0) {
      throw new ValidationError('Profilname darf nicht leer sein');
    }
    if (trimmedName.length > 50) {
      throw new ValidationError('Profilname darf maximal 50 Zeichen lang sein');
    }

    const profiles = readProfiles();

    const idx = profiles.findIndex(p => p.id === profileId);
    if (idx === -1) {
      throw new ProfileLoadError(profileId, 'Profil nicht gefunden');
    }

    if (profiles.some((p, i) => i !== idx && p.name === trimmedName)) {
      throw new DuplicateNameError(trimmedName);
    }

    profiles[idx] = { ...profiles[idx], name: trimmedName };
    writeProfiles(profiles);

    return profiles[idx];
  },

  /**
   * Löscht ein gespeichertes Profil.
   * Das aktive Filterprofil im Speicher bleibt unberührt.
   *
   * @param {string} profileId - UUID des Profils
   * @returns {void}
   * @throws {StorageError} Bei localStorage-Fehler
   */
  delete(profileId) {
    const profiles = readProfiles();
    const filtered = profiles.filter(p => p.id !== profileId);
    writeProfiles(filtered);
  },
};
