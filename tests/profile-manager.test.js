// Feature: fishing-bait-advisor
// ProfileManager unit tests — Tasks 4.1 (save, load, list) + custom error classes

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ProfileManager,
  ProfileLimitError,
  DuplicateNameError,
  StorageError,
  ProfileLoadError,
  ValidationError,
} from '../src/js/profile-manager.js';

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

/** Minimal gültiges FilterProfile */
const makeFilterProfile = (overrides = {}) => ({
  wetter: null,
  tageszeit: null,
  stroemung: null,
  gewaesserart: null,
  tiefe: null,
  jahreszeit: null,
  fischart: null,
  wassertemperatur: null,
  ...overrides,
});

// ---------------------------------------------------------------------------
// Setup: localStorage vor jedem Test zurücksetzen
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// ProfileManager.list()
// ---------------------------------------------------------------------------

describe('ProfileManager.list()', () => {
  it('gibt ein leeres Array zurück, wenn keine Profile gespeichert sind', () => {
    expect(ProfileManager.list()).toEqual([]);
  });

  it('gibt alle gespeicherten Profile zurück', () => {
    ProfileManager.save('Sommer-Barsch', makeFilterProfile({ jahreszeit: 'Sommer' }));
    ProfileManager.save('Winter-Zander', makeFilterProfile({ jahreszeit: 'Winter' }));

    const profiles = ProfileManager.list();
    expect(profiles).toHaveLength(2);
    expect(profiles.map(p => p.name)).toEqual(
      expect.arrayContaining(['Sommer-Barsch', 'Winter-Zander'])
    );
  });
});

// ---------------------------------------------------------------------------
// ProfileManager.save()
// ---------------------------------------------------------------------------

describe('ProfileManager.save()', () => {
  it('speichert ein Profil und gibt ein SavedProfile-Objekt zurück', () => {
    const filters = makeFilterProfile({ fischart: 'Barsch', jahreszeit: 'Sommer' });
    const saved = ProfileManager.save('Mein Profil', filters);

    expect(saved).toMatchObject({
      name: 'Mein Profil',
      filters: { fischart: 'Barsch', jahreszeit: 'Sommer' },
    });
    expect(typeof saved.id).toBe('string');
    expect(saved.id.length).toBeGreaterThan(0);
    expect(typeof saved.savedAt).toBe('string');
    // ISO-8601-Format prüfen
    expect(() => new Date(saved.savedAt)).not.toThrow();
    expect(new Date(saved.savedAt).toISOString()).toBe(saved.savedAt);
  });

  it('generiert für jedes Profil eine eindeutige UUID', () => {
    const p1 = ProfileManager.save('Profil A', makeFilterProfile());
    const p2 = ProfileManager.save('Profil B', makeFilterProfile());
    expect(p1.id).not.toBe(p2.id);
  });

  it('macht gespeicherte Profile über list() abrufbar', () => {
    ProfileManager.save('Test', makeFilterProfile());
    const list = ProfileManager.list();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Test');
  });

  it('trimmt führende und nachfolgende Leerzeichen im Namen', () => {
    const saved = ProfileManager.save('  Leerzeichen  ', makeFilterProfile());
    expect(saved.name).toBe('Leerzeichen');
  });

  it('wirft ProfileLimitError bei 10 vorhandenen Profilen', () => {
    for (let i = 0; i < ProfileManager.MAX_PROFILES; i++) {
      ProfileManager.save(`Profil ${i}`, makeFilterProfile());
    }
    expect(() => ProfileManager.save('Profil X', makeFilterProfile())).toThrow(ProfileLimitError);
  });

  it('wirft DuplicateNameError bei gleichem Namen', () => {
    ProfileManager.save('Doppelter Name', makeFilterProfile());
    expect(() => ProfileManager.save('Doppelter Name', makeFilterProfile())).toThrow(DuplicateNameError);
  });

  it('wirft DuplicateNameError mit dem korrekten Namen', () => {
    ProfileManager.save('Doppelt', makeFilterProfile());
    try {
      ProfileManager.save('Doppelt', makeFilterProfile());
      expect.fail('Sollte DuplicateNameError werfen');
    } catch (err) {
      expect(err).toBeInstanceOf(DuplicateNameError);
      expect(err.profileName).toBe('Doppelt');
    }
  });

  it('wirft StorageError, wenn localStorage.setItem fehlschlägt', () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('QuotaExceededError'); };
    try {
      expect(() => ProfileManager.save('Fehlertest', makeFilterProfile())).toThrow(StorageError);
    } finally {
      Storage.prototype.setItem = original;
    }
  });

  it('speichert die filters-Daten als Kopie (keine Referenz)', () => {
    const filters = makeFilterProfile({ fischart: 'Forelle' });
    ProfileManager.save('Kopiertest', filters);

    // Original-Objekt nach dem Speichern ändern
    filters.fischart = 'Hecht';

    const list = ProfileManager.list();
    expect(list[0].filters.fischart).toBe('Forelle');
  });
});

// ---------------------------------------------------------------------------
// ProfileManager.load()
// ---------------------------------------------------------------------------

describe('ProfileManager.load()', () => {
  it('lädt ein gespeichertes Profil anhand seiner ID', () => {
    const filters = makeFilterProfile({ wetter: 'sonnig', gewaesserart: 'See' });
    const saved = ProfileManager.save('Lade-Test', filters);

    const loaded = ProfileManager.load(saved.id);

    expect(loaded.id).toBe(saved.id);
    expect(loaded.name).toBe('Lade-Test');
    expect(loaded.filters).toEqual(filters);
  });

  it('wirft ProfileLoadError bei unbekannter ID', () => {
    expect(() => ProfileManager.load('unbekannte-id-123')).toThrow(ProfileLoadError);
  });

  it('wirft ProfileLoadError mit der korrekten Profil-ID', () => {
    try {
      ProfileManager.load('nicht-vorhanden');
      expect.fail('Sollte ProfileLoadError werfen');
    } catch (err) {
      expect(err).toBeInstanceOf(ProfileLoadError);
      expect(err.profileId).toBe('nicht-vorhanden');
    }
  });

  it('wirft ProfileLoadError bei korrupten Daten in localStorage', () => {
    // Manuell ein korruptes Profil einschreiben
    localStorage.setItem(
      'fba_profiles',
      JSON.stringify([{ id: 'korrupt-1', name: '', filters: null, savedAt: '' }])
    );
    expect(() => ProfileManager.load('korrupt-1')).toThrow(ProfileLoadError);
  });

  it('gibt das korrekte Profil zurück, auch wenn mehrere gespeichert sind', () => {
    const p1 = ProfileManager.save('Profil 1', makeFilterProfile({ fischart: 'Aal' }));
    const p2 = ProfileManager.save('Profil 2', makeFilterProfile({ fischart: 'Wels' }));

    const loaded = ProfileManager.load(p2.id);
    expect(loaded.id).toBe(p2.id);
    expect(loaded.filters.fischart).toBe('Wels');
  });
});

// ---------------------------------------------------------------------------
// ProfileManager.MAX_PROFILES
// ---------------------------------------------------------------------------

describe('ProfileManager.MAX_PROFILES', () => {
  it('ist 10', () => {
    expect(ProfileManager.MAX_PROFILES).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// ProfileManager.rename()
// ---------------------------------------------------------------------------

describe('ProfileManager.rename()', () => {
  it('benennt ein Profil um und gibt das aktualisierte Profil zurück', () => {
    const saved = ProfileManager.save('Alter Name', makeFilterProfile({ fischart: 'Barsch' }));
    const updated = ProfileManager.rename(saved.id, 'Neuer Name');

    expect(updated.id).toBe(saved.id);
    expect(updated.name).toBe('Neuer Name');
    // Filterdaten bleiben unverändert
    expect(updated.filters.fischart).toBe('Barsch');
  });

  it('aktualisiert den Namen in localStorage (über list() sichtbar)', () => {
    const saved = ProfileManager.save('Name Alt', makeFilterProfile());
    ProfileManager.rename(saved.id, 'Name Neu');

    const list = ProfileManager.list();
    expect(list.find(p => p.id === saved.id).name).toBe('Name Neu');
  });

  it('trimmt den neuen Namen', () => {
    const saved = ProfileManager.save('Trim-Test', makeFilterProfile());
    const updated = ProfileManager.rename(saved.id, '  Getrimmt  ');
    expect(updated.name).toBe('Getrimmt');
  });

  it('wirft ValidationError bei leerem Namen', () => {
    const saved = ProfileManager.save('Leer-Test', makeFilterProfile());
    expect(() => ProfileManager.rename(saved.id, '')).toThrow(ValidationError);
  });

  it('wirft ValidationError bei Namen mit nur Leerzeichen', () => {
    const saved = ProfileManager.save('Leerzeichen-Test', makeFilterProfile());
    expect(() => ProfileManager.rename(saved.id, '   ')).toThrow(ValidationError);
  });

  it('wirft ValidationError bei Namen mit mehr als 50 Zeichen', () => {
    const saved = ProfileManager.save('Lang-Test', makeFilterProfile());
    const zuLangerName = 'A'.repeat(51);
    expect(() => ProfileManager.rename(saved.id, zuLangerName)).toThrow(ValidationError);
  });

  it('akzeptiert einen Namen mit genau 50 Zeichen', () => {
    const saved = ProfileManager.save('Genau50-Test', makeFilterProfile());
    const name50 = 'A'.repeat(50);
    const updated = ProfileManager.rename(saved.id, name50);
    expect(updated.name).toBe(name50);
  });

  it('akzeptiert einen Namen mit genau 1 Zeichen', () => {
    const saved = ProfileManager.save('EinZeichen-Test', makeFilterProfile());
    const updated = ProfileManager.rename(saved.id, 'X');
    expect(updated.name).toBe('X');
  });

  it('wirft DuplicateNameError, wenn der neue Name bereits einem anderen Profil gehört', () => {
    ProfileManager.save('Profil Eins', makeFilterProfile());
    const saved2 = ProfileManager.save('Profil Zwei', makeFilterProfile());
    expect(() => ProfileManager.rename(saved2.id, 'Profil Eins')).toThrow(DuplicateNameError);
  });

  it('erlaubt das Umbenennen auf denselben Namen (kein DuplicateNameError)', () => {
    const saved = ProfileManager.save('Gleicher Name', makeFilterProfile());
    // Umbenennen auf denselben Namen (ggf. sinnvoll via UI)
    expect(() => ProfileManager.rename(saved.id, 'Gleicher Name')).not.toThrow();
  });

  it('lässt den filters-Inhalt nach dem Umbenennen unverändert', () => {
    const filters = makeFilterProfile({ wetter: 'Regen', fischart: 'Hecht', gewaesserart: 'Fluss' });
    const saved = ProfileManager.save('Filters-Test', filters);
    ProfileManager.rename(saved.id, 'Filters-Test Neu');

    const loaded = ProfileManager.load(saved.id);
    expect(loaded.filters).toEqual(filters);
  });
});

// ---------------------------------------------------------------------------
// ProfileManager.delete()
// ---------------------------------------------------------------------------

describe('ProfileManager.delete()', () => {
  it('entfernt ein Profil aus der Liste', () => {
    const saved = ProfileManager.save('Zu Löschen', makeFilterProfile());
    expect(ProfileManager.list()).toHaveLength(1);

    ProfileManager.delete(saved.id);

    expect(ProfileManager.list()).toHaveLength(0);
  });

  it('entfernt nur das angegebene Profil, andere bleiben erhalten', () => {
    const p1 = ProfileManager.save('Behalten', makeFilterProfile({ jahreszeit: 'Sommer' }));
    const p2 = ProfileManager.save('Löschen', makeFilterProfile({ jahreszeit: 'Winter' }));

    ProfileManager.delete(p2.id);

    const list = ProfileManager.list();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(p1.id);
    expect(list[0].name).toBe('Behalten');
  });

  it('tut nichts bei einer unbekannten profileId (kein Fehler)', () => {
    ProfileManager.save('Vorhanden', makeFilterProfile());
    // Löschen mit unbekannter ID wirft keinen Fehler
    expect(() => ProfileManager.delete('unbekannte-id-xyz')).not.toThrow();
    // Vorhandenes Profil bleibt erhalten
    expect(ProfileManager.list()).toHaveLength(1);
  });

  it('das gelöschte Profil ist nicht mehr über load() abrufbar', () => {
    const saved = ProfileManager.save('Gelöscht', makeFilterProfile());
    ProfileManager.delete(saved.id);

    expect(() => ProfileManager.load(saved.id)).toThrow();
  });

  it('aktives Filterprofil bleibt nach dem Löschen unberührt (localStorage fba_profiles Schlüssel getrennt)', () => {
    // Das aktive Filterprofil wird NICHT in fba_profiles gespeichert —
    // es ist eine separate Laufzeit-Struktur. Dieser Test stellt sicher,
    // dass delete() nur den fba_profiles-Eintrag berührt.
    const saved = ProfileManager.save('Lösch-Isolierung', makeFilterProfile({ fischart: 'Zander' }));

    // Simuliere ein aktives Profil in einem anderen localStorage-Schlüssel
    const activeProfile = makeFilterProfile({ fischart: 'Karpfen', jahreszeit: 'Herbst' });
    localStorage.setItem('fba_active_profile', JSON.stringify(activeProfile));

    ProfileManager.delete(saved.id);

    // fba_active_profile darf durch delete() nicht verändert worden sein
    const storedActive = JSON.parse(localStorage.getItem('fba_active_profile'));
    expect(storedActive).toEqual(activeProfile);
  });

  it('kann mehrere Profile nacheinander löschen', () => {
    const p1 = ProfileManager.save('P1', makeFilterProfile());
    const p2 = ProfileManager.save('P2', makeFilterProfile());
    const p3 = ProfileManager.save('P3', makeFilterProfile());

    ProfileManager.delete(p1.id);
    ProfileManager.delete(p3.id);

    const list = ProfileManager.list();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(p2.id);
  });
});

// ---------------------------------------------------------------------------
// Fehlerklassen — Instanzprüfung
// ---------------------------------------------------------------------------

describe('Fehlerklassen', () => {
  it('ProfileLimitError ist eine Instanz von Error', () => {
    const err = new ProfileLimitError();
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ProfileLimitError');
  });

  it('DuplicateNameError ist eine Instanz von Error', () => {
    const err = new DuplicateNameError('Test');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('DuplicateNameError');
    expect(err.profileName).toBe('Test');
  });

  it('StorageError ist eine Instanz von Error', () => {
    const err = new StorageError('Fehlermeldung');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('StorageError');
  });

  it('ProfileLoadError ist eine Instanz von Error', () => {
    const err = new ProfileLoadError('abc-123');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ProfileLoadError');
    expect(err.profileId).toBe('abc-123');
  });

  it('ValidationError ist eine Instanz von Error', () => {
    const err = new ValidationError('Ungültig');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ValidationError');
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests
// ---------------------------------------------------------------------------

import fc from 'fast-check';

// ---------------------------------------------------------------------------
// Property 9: Umbenennen mit gültigem Namen
// Feature: fishing-bait-advisor, Property 9: Umbenennen mit gültigem Namen
// Validates: Requirements 5.3
// ---------------------------------------------------------------------------

describe('Property 9: Umbenennen mit gültigem Namen', () => {
  // Counter für eindeutige Profilnamen, um DuplicateNameError zu vermeiden
  let nameCounter = 0;

  beforeEach(() => {
    localStorage.clear();
    nameCounter = 0;
  });

  it('neuer Name wird in list() gespeichert und filters-Inhalt bleibt unverändert', () => {
    // Feature: fishing-bait-advisor, Property 9: Umbenennen mit gültigem Namen
    fc.assert(
      fc.property(
        // Arbitrary für neuen Namen: 1–50 Zeichen, getrimmt nicht leer
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length >= 1),
        // Arbitrary für das Filterprofil
        fc.record({
          wetter: fc.constantFrom('sonnig', 'leicht bewölkt', 'bedeckt', 'Regen', 'starker Regen', 'Wind', 'Sturm', null),
          tageszeit: fc.constantFrom('Morgengrauen', 'Morgen', 'Mittag', 'Nachmittag', 'Abend', 'Nacht', null),
          stroemung: fc.constantFrom('keine', 'schwach', 'mittel', 'stark', null),
          gewaesserart: fc.constantFrom('Fluss', 'See', 'Teich', 'Stausee', 'Meer', 'Brackwasser', null),
          tiefe: fc.constantFrom('Oberfläche', 'Mittelwasser', 'Grund', null),
          jahreszeit: fc.constantFrom('Frühling', 'Sommer', 'Herbst', 'Winter', null),
          fischart: fc.constantFrom('Forelle', 'Barsch', 'Hecht', 'Karpfen', 'Zander', 'Aal', 'Brachse', 'Schleie', 'Wels', 'Rotauge', null),
          wassertemperatur: fc.oneof(fc.integer({ min: 0, max: 35 }), fc.constant(null)),
        }),
        (newName, filterProfile) => {
          // Eindeutigen Ausgangsnamen per Counter sicherstellen
          const originalName = `pbt9-original-${nameCounter++}`;
          // Sicherstellen, dass der neue Name (getrimmt) vom originalen verschieden ist,
          // um DuplicateNameError beim Umbenennen auf denselben (getrimmten) Namen zu vermeiden
          // (rename auf gleichen Namen ist erlaubt, aber zum Testen des rename-Verhaltens
          // wählen wir einen eindeutigen neuen Namen)
          const trimmedNew = newName.trim();
          const finalNewName = trimmedNew === originalName ? `${trimmedNew}-renamed` : trimmedNew;

          // Schritt 1: Profil speichern
          const saved = ProfileManager.save(originalName, filterProfile);

          // Schritt 2: Umbenennen
          ProfileManager.rename(saved.id, finalNewName);

          // Schritt 3: Neuer Name muss in list() für diese ID erscheinen
          const list = ProfileManager.list();
          const found = list.find(p => p.id === saved.id);
          expect(found).toBeDefined();
          expect(found.name).toBe(finalNewName.trim());

          // Schritt 4: filters-Inhalt muss unverändert sein
          expect(found.filters).toEqual({ ...filterProfile });

          // Aufräumen für nächste Iteration
          ProfileManager.delete(saved.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: fishing-bait-advisor, Property 10: Löschen entfernt Profil, Aktiv-Profil unberührt
// Validates: Requirements 5.4

import * as fc from 'fast-check';
import {
  WEATHER_VALUES,
  TIME_OF_DAY_VALUES,
  CURRENT_VALUES,
  WATER_TYPE_VALUES,
  DEPTH_VALUES,
  SEASON_VALUES,
  FISH_TYPE_VALUES,
} from '../src/js/bait-data.js';

describe('Property 10: Löschen entfernt Profil, Aktiv-Profil unberührt', () => {
  // Arbitrary für einen gültigen Profilnamen (1–50 Zeichen, getrimmt nicht leer)
  const profileNameArb = fc
    .string({ minLength: 1, maxLength: 50 })
    .filter(s => s.trim().length >= 1 && s.trim().length <= 50);

  // Arbitrary für einen nullable Enum-Wert aus einem gegebenen Array
  const nullableOf = arr =>
    fc.oneof(fc.constant(null), fc.constantFrom(...arr));

  // Arbitrary für ein beliebiges FilterProfile
  const filterProfileArb = fc.record({
    wetter: nullableOf(WEATHER_VALUES),
    tageszeit: nullableOf(TIME_OF_DAY_VALUES),
    stroemung: nullableOf(CURRENT_VALUES),
    gewaesserart: nullableOf(WATER_TYPE_VALUES),
    tiefe: nullableOf(DEPTH_VALUES),
    jahreszeit: nullableOf(SEASON_VALUES),
    fischart: nullableOf(FISH_TYPE_VALUES),
    wassertemperatur: fc.oneof(fc.constant(null), fc.integer({ min: 0, max: 35 })),
  });

  it('gelöschtes Profil ist nicht mehr in list(); aktives Profil (fba_active_profile) unverändert', () => {
    fc.assert(
      fc.property(profileNameArb, filterProfileArb, (name, activeFilters) => {
        // Voraussetzung: sauberer Zustand (beforeEach räumt auf, aber innerhalb der Property erneut sicherstellen)
        localStorage.clear();

        // 1. Profil speichern
        const savedProfile = ProfileManager.save(name, activeFilters);

        // 2. Aktives Profil separat in localStorage ablegen
        localStorage.setItem('fba_active_profile', JSON.stringify(activeFilters));

        // 3. Profil löschen
        ProfileManager.delete(savedProfile.id);

        // 4. Gelöschtes Profil darf nicht mehr in list() erscheinen
        const list = ProfileManager.list();
        const stillPresent = list.some(p => p.id === savedProfile.id);
        if (stillPresent) return false;

        // 5. Aktives Profil in localStorage muss unverändert sein
        const storedRaw = localStorage.getItem('fba_active_profile');
        if (storedRaw === null) return false;
        const storedActive = JSON.parse(storedRaw);

        // Tiefenvergleich
        return JSON.stringify(storedActive) === JSON.stringify(activeFilters);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: fishing-bait-advisor, Property 8: Profil-Rundreise (Speichern → Laden)
// Validates: Requirements 5.1, 5.2

describe('Property 8: Profil-Rundreise (Speichern → Laden)', () => {
  // Arbitrary für einen gültigen Profilnamen (1–50 Zeichen, getrimmt nicht leer)
  const profileNameArb = fc
    .string({ minLength: 1, maxLength: 50 })
    .filter(s => s.trim().length >= 1 && s.trim().length <= 50);

  // Nullable Enum-Helper
  const nullableOf = arr =>
    fc.oneof(fc.constant(null), fc.constantFrom(...arr));

  // Arbitrary für ein beliebiges FilterProfile
  const filterProfileArb = fc.record({
    wetter: nullableOf(WEATHER_VALUES),
    tageszeit: nullableOf(TIME_OF_DAY_VALUES),
    stroemung: nullableOf(CURRENT_VALUES),
    gewaesserart: nullableOf(WATER_TYPE_VALUES),
    tiefe: nullableOf(DEPTH_VALUES),
    jahreszeit: nullableOf(SEASON_VALUES),
    fischart: nullableOf(FISH_TYPE_VALUES),
    wassertemperatur: fc.oneof(fc.constant(null), fc.integer({ min: 0, max: 35 })),
  });

  it('geladenes Profil ist tief gleich dem gespeicherten Profil', () => {
    // **Validates: Requirements 5.1, 5.2**
    fc.assert(
      fc.property(profileNameArb, filterProfileArb, (name, filterProfile) => {
        // Sauberer Zustand für jede Property-Iteration
        localStorage.clear();

        // Schritt 1: Profil speichern
        const savedProfile = ProfileManager.save(name, filterProfile);

        // Schritt 2: Profil anhand der ID laden
        const loadedProfile = ProfileManager.load(savedProfile.id);

        // Schritt 3: Name muss übereinstimmen (gespeicherter Name ist bereits getrimmt)
        expect(loadedProfile.name).toBe(savedProfile.name);

        // Schritt 4: filters müssen tief gleich dem ursprünglichen filterProfile sein
        expect(loadedProfile.filters).toEqual(filterProfile);

        // Schritt 5: ID muss übereinstimmen
        expect(loadedProfile.id).toBe(savedProfile.id);
      }),
      { numRuns: 100 }
    );
  });
});
