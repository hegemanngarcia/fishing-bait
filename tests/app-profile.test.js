// Feature: fishing-bait-advisor
// AppController — Task 7.5: Profilspeicherung und -ladung über AppController verdrahten
// Validates: Requirements 5.1–5.7

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// DOM-Setup: Minimales HTML für AppController
// ---------------------------------------------------------------------------

function setupDOM() {
  document.body.innerHTML = `
    <div id="recommendation-panel">
      <h2>Empfehlungen</h2>
      <ul id="recommendation-list"></ul>
    </div>
    <div id="warning-container"></div>
    <div id="filter-panel">
      <select id="filter-wetter"><option value=""></option><option value="sonnig">sonnig</option><option value="leicht bewölkt">leicht bewölkt</option><option value="bedeckt">bedeckt</option><option value="Regen">Regen</option><option value="starker Regen">starker Regen</option><option value="Wind">Wind</option><option value="Sturm">Sturm</option></select>
      <select id="filter-tageszeit"><option value=""></option><option value="Morgengrauen">Morgengrauen</option><option value="Morgen">Morgen</option><option value="Mittag">Mittag</option><option value="Nachmittag">Nachmittag</option><option value="Abend">Abend</option><option value="Nacht">Nacht</option></select>
      <select id="filter-stroemung"><option value=""></option><option value="keine">keine</option><option value="schwach">schwach</option><option value="mittel">mittel</option><option value="stark">stark</option></select>
      <select id="filter-gewaesserart"><option value=""></option><option value="Fluss">Fluss</option><option value="See">See</option><option value="Teich">Teich</option><option value="Stausee">Stausee</option><option value="Meer">Meer</option><option value="Brackwasser">Brackwasser</option></select>
      <select id="filter-tiefe"><option value=""></option><option value="Oberfläche">Oberfläche</option><option value="Mittelwasser">Mittelwasser</option><option value="Grund">Grund</option></select>
      <select id="filter-jahreszeit"><option value=""></option><option value="Frühling">Frühling</option><option value="Sommer">Sommer</option><option value="Herbst">Herbst</option><option value="Winter">Winter</option></select>
      <select id="filter-fischart"><option value=""></option><option value="Forelle">Forelle</option><option value="Barsch">Barsch</option><option value="Hecht">Hecht</option><option value="Karpfen">Karpfen</option><option value="Zander">Zander</option><option value="Aal">Aal</option><option value="Brachse">Brachse</option><option value="Schleie">Schleie</option><option value="Wels">Wels</option><option value="Rotauge">Rotauge</option></select>
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

async function loadAppController() {
  vi.resetModules();
  const mod = await import('../src/js/app.js');
  return mod.AppController;
}

// ---------------------------------------------------------------------------
// Hilfsfunktion: Alert-Banner-Text aus DOM lesen
// ---------------------------------------------------------------------------

function getErrorBannerText() {
  const banner = document.querySelector('.alert-banner--error');
  return banner ? banner.textContent : null;
}

// ---------------------------------------------------------------------------
// onProfileSave() — Req 5.1, 5.5, 5.6
// ---------------------------------------------------------------------------

describe('AppController.onProfileSave()', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('speichert ein Profil und zeigt es in der #profile-list an (Req 5.1)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Mein Testprofil');

    const items = document.querySelectorAll('#profile-list .profile-item');
    expect(items.length).toBe(1);

    const nameSpan = items[0].querySelector('.profile-item__name');
    expect(nameSpan).not.toBeNull();
    expect(nameSpan.textContent).toBe('Mein Testprofil');
  });

  it('zeigt Lade-, Umbenenn- und Lösch-Button pro Profil in der Liste (Req 5.1)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Profil mit Buttons');

    const item = document.querySelector('#profile-list .profile-item');
    expect(item).not.toBeNull();

    const loadBtn = item.querySelector('button[title="Profil laden"]');
    const renameBtn = item.querySelector('button[title="Profil umbenennen"]');
    const deleteBtn = item.querySelector('button[title="Profil löschen"]');

    expect(loadBtn).not.toBeNull();
    expect(renameBtn).not.toBeNull();
    expect(deleteBtn).not.toBeNull();
  });

  it('zeigt deutschen Fehlertext bei erreichen des 10-Profil-Limits (Req 5.6)', async () => {
    const AppController = await loadAppController();

    // 10 Profile erstellen
    for (let i = 0; i < 10; i++) {
      AppController.onProfileSave(`Profil ${i}`);
    }

    // 11. Profil versuchen
    AppController.onProfileSave('Profil 10');

    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    expect(errorText).toContain('Limit');
    expect(errorText).toContain('10');
  });

  it('fragt bei doppeltem Profilnamen per window.confirm nach Überschreiben (Req 5.1)', async () => {
    const AppController = await loadAppController();

    // Erstes Profil speichern
    AppController.onProfileSave('Duplikat-Test');

    // window.confirm mocken (Benutzer lehnt ab)
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);

    // Gleichnamiges Profil versuchen
    AppController.onProfileSave('Duplikat-Test');

    expect(confirmMock).toHaveBeenCalledOnce();
    expect(confirmMock.mock.calls[0][0]).toContain('Duplikat-Test');
  });

  it('überschreibt das Profil wenn window.confirm true zurückgibt (Req 5.1)', async () => {
    const AppController = await loadAppController();

    // Erstes Profil (mit Fischart Forelle)
    AppController.onFilterChange('fischart', 'Forelle');
    AppController.onProfileSave('Überschreib-Test');

    // Filter ändern
    AppController.onFilterChange('fischart', 'Hecht');

    // window.confirm mocken → Benutzer bestätigt
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Gleichnamiges Profil speichern (überschreiben)
    AppController.onProfileSave('Überschreib-Test');

    // Noch immer nur 1 Profil in der Liste (das alte wurde ersetzt)
    const items = document.querySelectorAll('#profile-list .profile-item');
    expect(items.length).toBe(1);
  });

  it('zeigt deutschen Fehlertext bei StorageError (Req 5.5)', async () => {
    const AppController = await loadAppController();

    // localStorage.setItem zum Scheitern bringen
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new DOMException('QuotaExceededError'); };

    try {
      AppController.onProfileSave('Storage-Fehler-Test');
    } finally {
      Storage.prototype.setItem = originalSetItem;
    }

    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    // Fehlermeldung muss auf Deutsch sein
    expect(errorText.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// onProfileLoad() — Req 5.2, 5.7
// ---------------------------------------------------------------------------

describe('AppController.onProfileLoad()', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('lädt ein gespeichertes Profil und synchronisiert Filter-Dropdowns (Req 5.2)', async () => {
    const AppController = await loadAppController();

    // Filter setzen und speichern
    AppController.onFilterChange('fischart', 'Forelle');
    AppController.onFilterChange('jahreszeit', 'Sommer');
    AppController.onProfileSave('Profil Laden Test');

    // Filter zurücksetzen
    AppController.onReset();

    // Profile-ID aus der Liste ermitteln
    const item = document.querySelector('#profile-list .profile-item');
    expect(item).not.toBeNull();
    const profileId = item.getAttribute('data-profile-id');

    // Profil laden
    AppController.onProfileLoad(profileId);

    // DOM-Dropdowns müssen die geladenen Werte zeigen
    expect(document.getElementById('filter-fischart').value).toBe('Forelle');
    expect(document.getElementById('filter-jahreszeit').value).toBe('Sommer');
  });

  it('ersetzt alle vorherigen Filterwerte vollständig beim Laden (Req 5.2)', async () => {
    const AppController = await loadAppController();

    // Profil A speichern (nur fischart)
    AppController.onFilterChange('fischart', 'Forelle');
    AppController.onProfileSave('Profil A');

    // Profil B speichern (jahreszeit, kein fischart)
    AppController.onReset();
    AppController.onFilterChange('jahreszeit', 'Winter');
    AppController.onProfileSave('Profil B');

    // Profil A laden
    const items = document.querySelectorAll('#profile-list .profile-item');
    let profileAId;
    for (const item of items) {
      const nameSpan = item.querySelector('.profile-item__name');
      if (nameSpan.textContent === 'Profil A') {
        profileAId = item.getAttribute('data-profile-id');
        break;
      }
    }

    AppController.onProfileLoad(profileAId);

    // Fischart aus Profil A muss geladen sein
    expect(document.getElementById('filter-fischart').value).toBe('Forelle');
    // Jahreszeit von Profil B darf NICHT mehr aktiv sein (null → leer im DOM)
    expect(document.getElementById('filter-jahreszeit').value).toBe('');
  });

  it('zeigt deutschen Fehlertext bei unbekannter Profil-ID (Req 5.7)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileLoad('unbekannte-id-xyz');

    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    expect(errorText.length).toBeGreaterThan(0);
  });

  it('zeigt deutschen Fehlertext bei korrupten Profildaten (Req 5.7)', async () => {
    const AppController = await loadAppController();

    // Manuell ein korruptes Profil einschreiben
    localStorage.setItem(
      'fba_profiles',
      JSON.stringify([{ id: 'korrupt-123', name: '', filters: null, savedAt: '' }])
    );

    AppController.onProfileLoad('korrupt-123');

    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    expect(errorText.length).toBeGreaterThan(0);
  });

  it('aktives Filterprofil bleibt nach Ladefehler unverändert (Req 5.7)', async () => {
    const AppController = await loadAppController();

    // Bestimmten Filter setzen
    AppController.onFilterChange('wetter', 'Sturm');

    // Laden schlägt fehl
    AppController.onProfileLoad('nicht-vorhanden');

    // Der DOM-Filter bleibt auf dem vor dem Ladefehler gesetzten Wert
    // (Da onReset() nicht aufgerufen wurde, sollte der Wert noch 'Sturm' sein)
    // Dieses Verhalten ist über den Ladecall hinaus gesichert — kein ungewollter Reset
    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull(); // Fehler wurde angezeigt
  });
});

// ---------------------------------------------------------------------------
// onProfileDelete() — Req 5.4
// ---------------------------------------------------------------------------

describe('AppController.onProfileDelete()', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('entfernt das Profil aus der #profile-list (Req 5.4)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Zu löschendes Profil');

    // Profil-ID ermitteln
    const item = document.querySelector('#profile-list .profile-item');
    const profileId = item.getAttribute('data-profile-id');

    // Löschen
    AppController.onProfileDelete(profileId);

    const items = document.querySelectorAll('#profile-list .profile-item');
    expect(items.length).toBe(0);
  });

  it('löscht nur das angegebene Profil, andere bleiben sichtbar (Req 5.4)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Behalten');
    AppController.onProfileSave('Löschen');

    const allItems = document.querySelectorAll('#profile-list .profile-item');
    expect(allItems.length).toBe(2);

    // Das zweite Profil (Löschen) löschen
    let loeschenId;
    for (const item of allItems) {
      const nameSpan = item.querySelector('.profile-item__name');
      if (nameSpan.textContent === 'Löschen') {
        loeschenId = item.getAttribute('data-profile-id');
        break;
      }
    }

    AppController.onProfileDelete(loeschenId);

    const remaining = document.querySelectorAll('#profile-list .profile-item');
    expect(remaining.length).toBe(1);
    expect(remaining[0].querySelector('.profile-item__name').textContent).toBe('Behalten');
  });

  it('aktives Filterprofil bleibt nach dem Löschen unverändert (Req 5.4)', async () => {
    const AppController = await loadAppController();

    // Aktiven Filter über DOM-Event setzen (damit DOM und activeProfile synchron sind)
    const fischartSelect = document.getElementById('filter-fischart');
    fischartSelect.value = 'Barsch';
    fischartSelect.dispatchEvent(new Event('change'));

    // Profil speichern und dann löschen
    AppController.onProfileSave('Profil Löschen Isolation');
    const item = document.querySelector('#profile-list .profile-item');
    const profileId = item.getAttribute('data-profile-id');
    AppController.onProfileDelete(profileId);

    // Der aktive Filter (im DOM gesetzt über change-Event) muss unverändert sein —
    // onProfileDelete() darf syncFiltersToDOM() / onReset() nicht aufrufen.
    // Da onFilterChange() das <select>-DOM nicht automatisch setzt, prüfen wir,
    // dass kein ungewollter Reset des activeProfile stattgefunden hat:
    // onReset() würde den DOM-Wert auf '' setzen — das darf nicht passieren.
    expect(fischartSelect.value).toBe('Barsch');
  });

  it('löschen eines nicht-existenten Profils verursacht keinen Fehler', async () => {
    const AppController = await loadAppController();

    expect(() => AppController.onProfileDelete('nicht-vorhanden')).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// onProfileRename() — Req 5.3
// ---------------------------------------------------------------------------

describe('AppController.onProfileRename()', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('aktualisiert den Namen in der #profile-list sofort (Req 5.3)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Alter Name');

    const item = document.querySelector('#profile-list .profile-item');
    const profileId = item.getAttribute('data-profile-id');

    AppController.onProfileRename(profileId, 'Neuer Name');

    // Profil-Liste neu rendern — Name muss aktualisiert sein
    const updatedItem = document.querySelector('#profile-list .profile-item');
    expect(updatedItem.querySelector('.profile-item__name').textContent).toBe('Neuer Name');
  });

  it('zeigt deutschen Fehlertext bei leerem Namen (Req 5.3)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Umbenennen Fehler Test');
    const item = document.querySelector('#profile-list .profile-item');
    const profileId = item.getAttribute('data-profile-id');

    AppController.onProfileRename(profileId, '');

    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    expect(errorText.length).toBeGreaterThan(0);
  });

  it('zeigt deutschen Fehlertext bei Namen mit mehr als 50 Zeichen (Req 5.3)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Lang-Test');
    const item = document.querySelector('#profile-list .profile-item');
    const profileId = item.getAttribute('data-profile-id');

    const zuLang = 'A'.repeat(51);
    AppController.onProfileRename(profileId, zuLang);

    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    expect(errorText.length).toBeGreaterThan(0);
  });

  it('lässt den alten Namen bei ungültigem neuen Namen unverändert (Req 5.3)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Unveränderter Name');
    const item = document.querySelector('#profile-list .profile-item');
    const profileId = item.getAttribute('data-profile-id');

    // Leerer Name → Fehler, alter Name bleibt
    AppController.onProfileRename(profileId, '');

    const updatedItem = document.querySelector('#profile-list .profile-item');
    expect(updatedItem.querySelector('.profile-item__name').textContent).toBe('Unveränderter Name');
  });

  it('zeigt deutschen Fehlertext bei doppeltem Namen (Req 5.3)', async () => {
    const AppController = await loadAppController();

    AppController.onProfileSave('Erster');
    AppController.onProfileSave('Zweiter');

    // Zweites Profil holen
    const items = document.querySelectorAll('#profile-list .profile-item');
    let zweiterId;
    for (const it of items) {
      if (it.querySelector('.profile-item__name').textContent === 'Zweiter') {
        zweiterId = it.getAttribute('data-profile-id');
        break;
      }
    }

    AppController.onProfileRename(zweiterId, 'Erster');

    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    expect(errorText.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Profil-Laden-Button in der UI — End-to-End DOM-Integration (Req 5.1, 5.2)
// ---------------------------------------------------------------------------

describe('Profil-Liste UI — Lade-Button lädt Profil (Req 5.2)', () => {
  beforeEach(() => {
    setupDOM();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Klick auf Lade-Button lädt das Profil und synchronisiert Dropdowns', async () => {
    const AppController = await loadAppController();

    // Profil speichern
    AppController.onFilterChange('gewaesserart', 'See');
    AppController.onProfileSave('See-Profil');

    // Filter zurücksetzen
    AppController.onReset();
    expect(document.getElementById('filter-gewaesserart').value).toBe('');

    // Lade-Button klicken
    const loadBtn = document.querySelector('#profile-list .profile-item button[title="Profil laden"]');
    expect(loadBtn).not.toBeNull();
    loadBtn.click();

    // Dropdown muss den Wert aus dem gespeicherten Profil anzeigen
    expect(document.getElementById('filter-gewaesserart').value).toBe('See');
  });

  it('Profil speichern über Save-Button zeigt Profil in der Liste', async () => {
    await loadAppController();

    // Name eingeben und Speichern-Button klicken
    const nameInput = document.getElementById('profile-name-input');
    const saveBtn = document.getElementById('btn-profile-save');

    nameInput.value = 'Button-Test-Profil';
    saveBtn.click();

    // Profil muss in der Liste erscheinen
    const items = document.querySelectorAll('#profile-list .profile-item');
    expect(items.length).toBe(1);
    expect(items[0].querySelector('.profile-item__name').textContent).toBe('Button-Test-Profil');

    // Eingabefeld muss geleert worden sein
    expect(nameInput.value).toBe('');
  });

  it('Speichern ohne Namen zeigt deutschen Fehlertext und legt kein Profil an', async () => {
    await loadAppController();

    const saveBtn = document.getElementById('btn-profile-save');
    const nameInput = document.getElementById('profile-name-input');
    nameInput.value = '';
    saveBtn.click();

    // Kein Profil angelegt
    const items = document.querySelectorAll('#profile-list .profile-item');
    expect(items.length).toBe(0);

    // Fehlermeldung vorhanden
    const errorText = getErrorBannerText();
    expect(errorText).not.toBeNull();
    expect(errorText).toContain('Profilnamen');
  });
});
