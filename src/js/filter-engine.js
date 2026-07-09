/**
 * @fileoverview FilterEngine — Filterlogik und Score-Berechnung für den Fishing Bait Advisor.
 */

/**
 * Prüft, ob ein einzelner Filter übereinstimmt.
 * Ein Filter gilt als übereinstimmend, wenn:
 *   - der Profilwert null oder undefined ist (ungesetzt → alle Werte gültig), ODER
 *   - das entry-Array den Profilwert enthält.
 *
 * @param {string[]|undefined} entryValues - Array gültiger Werte des Eintrags
 * @param {string|null|undefined} profileValue - Aktiver Filterwert aus dem Profil
 * @returns {boolean}
 */
function filterMatches(entryValues, profileValue) {
  if (profileValue === null || profileValue === undefined) {
    return true; // ungesetzter Filter schränkt nicht ein
  }
  if (!Array.isArray(entryValues)) {
    return false;
  }
  return entryValues.includes(profileValue);
}

/**
 * Prüft, ob die Wassertemperatur des Profils im Temperaturbereich des Eintrags liegt.
 * Ein Temperaturfilter gilt als übereinstimmend, wenn:
 *   - profile.wassertemperatur null oder undefined ist, ODER
 *   - entry.tempMin null/undefined (keine Untergrenze) UND entry.tempMax null/undefined (keine Obergrenze), ODER
 *   - die Profiltemperatur innerhalb [tempMin, tempMax] liegt (inclusive, wobei null = keine Grenze)
 *
 * @param {number|null} tempMin - Minimaltemperatur des Eintrags (inklusiv), null = keine Untergrenze
 * @param {number|null} tempMax - Maximaltemperatur des Eintrags (inklusiv), null = keine Obergrenze
 * @param {number|null|undefined} wassertemperatur - Aktiver Temperaturwert aus dem Profil
 * @returns {boolean}
 */
function temperatureMatches(tempMin, tempMax, wassertemperatur) {
  if (wassertemperatur === null || wassertemperatur === undefined) {
    return true; // ungesetzter Filter schränkt nicht ein
  }
  const aboveMin = (tempMin === null || tempMin === undefined) ? true : wassertemperatur >= tempMin;
  const belowMax = (tempMax === null || tempMax === undefined) ? true : wassertemperatur <= tempMax;
  return aboveMin && belowMax;
}

/**
 * Berechnet den Relevanz-Score eines BaitEntry gegen ein FilterProfile.
 *
 * Score = basisScore
 *       + (wetter übereinstimmend ? 1 : 0)
 *       + (tageszeit übereinstimmend ? 1 : 0)
 *       + (stroemung übereinstimmend ? 1 : 0)
 *       + (gewaesserart übereinstimmend ? 1 : 0)
 *       + (tiefe übereinstimmend ? 1 : 0)
 *       + (jahreszeit übereinstimmend ? 1 : 0)
 *       + (fischart übereinstimmend ? 1 : 0)
 *       + (wassertemperatur in [tempMin, tempMax] ? 1 : 0)
 *
 * Ungesetzte Filter (null/undefined) zählen weder als Treffer (kein Bonus)
 * noch schränken sie das Ergebnis ein.
 *
 * @param {import('./bait-data.js').BaitEntry} entry
 * @param {import('./bait-data.js').FilterProfile} profile
 * @returns {number}
 */
function scoreEntry(entry, profile) {
  let score = entry.basisScore;

  if (filterMatches(entry.wetter, profile.wetter)) {
    if (profile.wetter !== null && profile.wetter !== undefined) score += 1;
  }
  if (filterMatches(entry.tageszeit, profile.tageszeit)) {
    if (profile.tageszeit !== null && profile.tageszeit !== undefined) score += 1;
  }
  if (filterMatches(entry.stroemung, profile.stroemung)) {
    if (profile.stroemung !== null && profile.stroemung !== undefined) score += 1;
  }
  if (filterMatches(entry.gewaesserart, profile.gewaesserart)) {
    if (profile.gewaesserart !== null && profile.gewaesserart !== undefined) score += 1;
  }
  if (filterMatches(entry.tiefe, profile.tiefe)) {
    if (profile.tiefe !== null && profile.tiefe !== undefined) score += 1;
  }
  if (filterMatches(entry.jahreszeit, profile.jahreszeit)) {
    if (profile.jahreszeit !== null && profile.jahreszeit !== undefined) score += 1;
  }
  if (filterMatches(entry.fischart, profile.fischart)) {
    if (profile.fischart !== null && profile.fischart !== undefined) score += 1;
  }
  if (temperatureMatches(entry.tempMin, entry.tempMax, profile.wassertemperatur)) {
    if (profile.wassertemperatur !== null && profile.wassertemperatur !== undefined) score += 1;
  }

  return score;
}

/**
 * Hilfsfunktion: Liefert die menschenlesbare Bezeichnung für einen aktiven Filter.
 * @param {string} filterName - interner Filtername
 * @param {string|number} value - aktiver Filterrwert
 * @returns {string}
 */
function filterLabel(filterName, value) {
  const labels = {
    wetter: `Wetter: ${value}`,
    tageszeit: `Tageszeit: ${value}`,
    stroemung: `Strömung: ${value}`,
    gewaesserart: `Gewässerart: ${value}`,
    tiefe: `Tiefe: ${value}`,
    jahreszeit: `Jahreszeit: ${value}`,
    fischart: `Fischart: ${value}`,
    wassertemperatur: `Wassertemperatur: ${value} °C`,
  };
  return labels[filterName] || `${filterName}: ${value}`;
}

/**
 * Generiert eine Kurzerkl­ärung für eine Empfehlung.
 * Nennt mindestens einen aktiven Filter, maximal 3 Sätze.
 *
 * @param {import('./bait-data.js').BaitEntry} entry
 * @param {import('./bait-data.js').FilterProfile} profile
 * @param {number} score
 * @returns {string}
 */
function generateKurzerklaerung(entry, profile, score) {
  const filterNames = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart', 'wassertemperatur'];
  const matchingFilters = [];

  for (const name of filterNames) {
    const profileValue = profile[name];
    if (profileValue === null || profileValue === undefined) continue;

    if (name === 'wassertemperatur') {
      if (temperatureMatches(entry.tempMin, entry.tempMax, profileValue)) {
        matchingFilters.push(filterLabel(name, profileValue));
      }
    } else {
      if (filterMatches(entry[name], profileValue)) {
        matchingFilters.push(filterLabel(name, profileValue));
      }
    }
  }

  // Mindestens ein Filter muss genannt werden – bei keinem Treffer (nur basisScore) den ersten
  // gesetzten aktiven Filter aus dem Profil nehmen
  if (matchingFilters.length === 0) {
    for (const name of filterNames) {
      const profileValue = profile[name];
      if (profileValue !== null && profileValue !== undefined) {
        matchingFilters.push(filterLabel(name, profileValue));
        break;
      }
    }
  }

  // Satzbau: Satz 1 – warum dieser Köder passt, Satz 2 – aktive Filter, Satz 3 – Tipp
  const filterAufzaehlung = matchingFilters.slice(0, 3).join(', ');
  let erklaerung = `${entry.typBezeichnung} eignet sich gut für die aktuellen Bedingungen (${filterAufzaehlung}).`;

  if (entry.angeltipp) {
    // Angeltipp ggf. kürzen auf einen Satz
    const tipp = entry.angeltipp.split('.')[0].trim();
    if (tipp) {
      erklaerung += ` ${tipp}.`;
    }
  }

  return erklaerung;
}

/**
 * Filtert den Datensatz gegen ein FilterProfile, berechnet Scores,
 * sortiert die Ergebnisse und gibt maximal 5 Empfehlungen zurück.
 *
 * Ausschlusskriterium: Einträge werden ausgeschlossen, wenn mindestens ein
 * aktiver Filter gesetzt ist, der NICHT mit dem Eintrag übereinstimmt.
 * (Einträge mit Score 0 und ohne jegliche Übereinstimmung werden ausgeschlossen.)
 *
 * @param {import('./bait-data.js').FilterProfile} profile - Aktive Filterwerte
 * @param {import('./bait-data.js').BaitEntry[]} dataset - Statischer Köder-Datensatz
 * @returns {import('./bait-data.js').Recommendation[]}
 */
function query(profile, dataset) {
  const filterNames = ['wetter', 'tageszeit', 'stroemung', 'gewaesserart', 'tiefe', 'jahreszeit', 'fischart'];

  // Schritt 1: Filtern — Einträge ausschließen, bei denen ein aktiver Filter NICHT übereinstimmt
  const filtered = dataset.filter((entry) => {
    for (const name of filterNames) {
      const profileValue = profile[name];
      if (profileValue === null || profileValue === undefined) continue;
      if (!filterMatches(entry[name], profileValue)) {
        return false; // mindestens ein aktiver Filter trifft nicht zu → ausschließen
      }
    }
    // Temperaturfilter prüfen
    const temp = profile.wassertemperatur;
    if (temp !== null && temp !== undefined) {
      if (!temperatureMatches(entry.tempMin, entry.tempMax, temp)) {
        return false;
      }
    }
    return true;
  });

  // Sonderregel: Hecht + Teich → nur Einträge mit typ in der erlaubten Liste
  const HECHT_TEICH_TYPEN = ['Wobbler', 'Gummifisch', 'Spinner', 'Blinker'];
  let filteredFinal = (profile.fischart === 'Hecht' && profile.gewaesserart === 'Teich')
    ? filtered.filter((entry) => HECHT_TEICH_TYPEN.includes(entry.typ))
    : filtered;

  // Temperatur-Sonderregeln: Vorfilterung bei [0, 8) → nur Grundmontage-Koeder
  const temp = profile.wassertemperatur;
  if (temp !== null && temp !== undefined && temp >= 0 && temp < 8) {
    filteredFinal = filteredFinal.filter((entry) => entry.klasse === 'Grundmontage-Koeder');
  }

  // Sonderregel Bergsee: Strömungsköder ausschliessen (Req. 8.4)
  // Köder mit stroemung: ['mittel', 'stark'] OHNE ['keine', 'schwach'] gelten als "Strömung erforderlich"
  if (profile.gewaesserart === 'Bergsee') {
    filteredFinal = filteredFinal.filter((entry) => {
      // Ausschluss: Köder, die ausschliesslich Strömung benötigen (keine 'keine'/'schwach' in ihrer Liste)
      const requiresFlow = entry.stroemung && entry.stroemung.length > 0 &&
        !entry.stroemung.includes('keine') && !entry.stroemung.includes('schwach');
      return !requiresFlow;
    });
  }

  // Sonderregel Bergsee + Sommer: nur Tiefen-Köder (>10 m) oder Flachwasser an Einläufen (≤2 m) (Req. 8.2)
  // Implementierung: Oberflächenköder und reine Mittelwasser-Köder ausschliessen,
  // sofern sie nicht explizit für 'Oberfläche' (Einläufe) AND Bergsee geeignet sind.
  // Da der Datensatz keine separate "Einlauf"-Kennzeichnung hat, erlauben wir Oberfläche
  // nur wenn der Köder auch 'keine'/'schwach' Strömung unterstützt (Einlauf-Charakteristik).
  if (profile.gewaesserart === 'Bergsee' && profile.jahreszeit === 'Sommer') {
    filteredFinal = filteredFinal.filter((entry) => {
      // Erlaubt: Köder für Grund (Tiefe >10 m) oder Köder für Oberfläche an ruhigen Stellen
      const forTiefe = entry.tiefe && entry.tiefe.includes('Grund');
      const forEinlauf = entry.tiefe && entry.tiefe.includes('Oberfläche') &&
        entry.stroemung && (entry.stroemung.includes('keine') || entry.stroemung.includes('schwach'));
      return forTiefe || forEinlauf;
    });
  }

  // Sonderregel Gebirgsbach: nur Salmoniden-Köder, keine Friedfisch-Köder (Req. 9.1)
  if (profile.gewaesserart === 'Gebirgsbach') {
    // Friedfische die NICHT für Gebirgsbach geeignet sind
    const FRIEDFISCHE = ['Karpfen', 'Brachse', 'Schleie', 'Wels'];
    filteredFinal = filteredFinal.filter((entry) => {
      // Ausschluss: Köder, die ausschliesslich Friedfische als Zielarten haben
      const onlyFriedfisch = entry.fischart && entry.fischart.length > 0 &&
        entry.fischart.every((f) => FRIEDFISCHE.includes(f));
      return !onlyFriedfisch;
    });

    // Erlaubte Köderklassen für Gebirgsbach (Req. 9.3):
    // Spinner Grösse 0-2 (klein), Mini-Wobbler (klein), Nymphen, Trockenfliegen
    // Ausschluss: grosse Köder (>8 cm, also groesse === 'groß') und Naturköder (Boilies, Pellets, Maden)
    const VERBOTENE_TYPEN_GEBIRGSBACH = ['Boilie', 'Pellet', 'Maden', 'Brot', 'Mais', 'Tigernuss'];
    filteredFinal = filteredFinal.filter((entry) => {
      if (entry.groesse === 'groß') return false;
      if (VERBOTENE_TYPEN_GEBIRGSBACH.includes(entry.typ)) return false;
      return true;
    });
  }

  // Schritt 2: Score berechnen
  const scored = filteredFinal.map((entry) => {
    const score = scoreEntry(entry, profile);
    return { entry, score };
  });

  // Schritt 3: Einträge mit Score 0 und ohne jegliche Übereinstimmung ausschließen.
  // (Nach dem Filtern in Schritt 1 sind alle verbliebenen Einträge bereits kompatibel.
  //  Score 0 kann nur auftreten, wenn alle Profil-Filter null sind und basisScore = 0.)
  const nonZero = scored.filter(({ score }) => score > 0);

  // Schritt 4: Sortieren — absteigend nach Score, bei Gleichstand aufsteigend nach typBezeichnung
  nonZero.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.typBezeichnung.localeCompare(b.entry.typBezeichnung, 'de');
  });

  // Schritt 5: Alle Einträge mit hohem Score ausgeben (kein hartes Limit mehr).
  // "Hoher Score" = maxScore - 2, damit nur wirklich passende Köder erscheinen.
  // Bei sehr wenigen Ergebnissen (≤3) werden alle zurückgegeben.
  let topResults;
  if (nonZero.length === 0) {
    topResults = [];
  } else {
    const maxScore = nonZero[0].score; // bereits absteigend sortiert
    const threshold = Math.max(maxScore - 2, nonZero[nonZero.length - 1].score);
    topResults = nonZero.filter(({ score }) => score >= threshold);
    // Mindestens 3, falls vorhanden
    if (topResults.length < 3 && nonZero.length >= 3) {
      topResults = nonZero.slice(0, 3);
    }
  }

  // Sonderregel Gebirgsbach + Frühling/Sommer → Nymphen/Trockenfliegen zuerst (Req. 9.2)
  // Mindestens eine Nymphe oder Trockenfliege unter den ersten 3 Empfehlungen
  const NYMPHEN_TYPEN = ['Nymphe', 'Trockenfliege'];
  if (
    profile.gewaesserart === 'Gebirgsbach' &&
    (profile.jahreszeit === 'Frühling' || profile.jahreszeit === 'Sommer')
  ) {
    const hasNympheInTop3 = topResults.slice(0, 3).some(({ entry }) => NYMPHEN_TYPEN.includes(entry.typ));
    if (!hasNympheInTop3) {
      // Suche erste Nymphe/Trockenfliege ausserhalb der Top-3
      const nympheIdx = topResults.findIndex(
        ({ entry }, idx) => idx >= 3 && NYMPHEN_TYPEN.includes(entry.typ)
      );
      if (nympheIdx !== -1) {
        // Verschiebe ans Ende der ersten 3
        const nympheEntry = topResults[nympheIdx];
        topResults = [
          ...topResults.slice(0, 2),
          nympheEntry,
          ...topResults.slice(2, nympheIdx),
          ...topResults.slice(nympheIdx + 1),
        ];
      }
    }
  }

  // Sonderregel Gebirgsbach + Herbst/Winter → Spinner/Mini-Wobbler zuerst (Req. 9.5)
  const SPINNER_WOBBLER_TYPEN = ['Spinner', 'Wobbler'];
  if (
    profile.gewaesserart === 'Gebirgsbach' &&
    (profile.jahreszeit === 'Herbst' || profile.jahreszeit === 'Winter')
  ) {
    const hasSpinnerInTop3 = topResults.slice(0, 3).some(({ entry }) => SPINNER_WOBBLER_TYPEN.includes(entry.typ));
    if (!hasSpinnerInTop3) {
      const spinnerIdx = topResults.findIndex(
        ({ entry }, idx) => idx >= 3 && SPINNER_WOBBLER_TYPEN.includes(entry.typ)
      );
      if (spinnerIdx !== -1) {
        const spinnerEntry = topResults[spinnerIdx];
        topResults = [
          ...topResults.slice(0, 2),
          spinnerEntry,
          ...topResults.slice(2, spinnerIdx),
          ...topResults.slice(spinnerIdx + 1),
        ];
      }
    }
  }

  // Temperatur-Sonderregeln (Post-Processing auf topResults):
  if (temp !== null && temp !== undefined) {
    // Regel 2: [8, 18] → mindestens ein Oberflaechenkoeder + ein Tiefenkoeder (sofern vorhanden)
    if (temp >= 8 && temp <= 18) {
      const hasOberflaeche = topResults.some(({ entry }) => entry.klasse === 'Oberflaechenkoeder');

      // Pool aller gefilterten Einträge nach Score sortiert (außerhalb der aktuellen topResults)
      const topResultsIds = new Set(topResults.map(({ entry }) => entry.id));
      const pool = nonZero.filter(({ entry }) => !topResultsIds.has(entry.id));

      if (!hasOberflaeche) {
        // Suche einen Oberflaechenkoeder im Pool
        const candidate = pool.find(({ entry }) => entry.klasse === 'Oberflaechenkoeder');
        if (candidate) {
          // Ersetze den letzten Nicht-Oberflächen-Eintrag in topResults
          const replaceIdx = [...topResults].reverse().findIndex(({ entry }) => entry.klasse !== 'Oberflaechenkoeder');
          if (replaceIdx !== -1) {
            const actualIdx = topResults.length - 1 - replaceIdx;
            topResults = [...topResults.slice(0, actualIdx), candidate, ...topResults.slice(actualIdx + 1)];
          }
        }
      }

      // Recompute hasTiefen after the Oberflaechenkoeder replacement above,
      // because that step may have inadvertently removed the only Tiefenkoeder.
      const hasTiefen = topResults.some(({ entry }) => entry.klasse === 'Tiefenkoeder');

      if (!hasTiefen) {
        // Suche einen Tiefenkoeder im Pool (neu berechnen nach möglicher Änderung oben)
        const topResultsIdsUpdated = new Set(topResults.map(({ entry }) => entry.id));
        const poolUpdated = nonZero.filter(({ entry }) => !topResultsIdsUpdated.has(entry.id));
        const candidate = poolUpdated.find(({ entry }) => entry.klasse === 'Tiefenkoeder');
        if (candidate) {
          const replaceIdx = [...topResults].reverse().findIndex(({ entry }) => entry.klasse !== 'Tiefenkoeder' && entry.klasse !== 'Oberflaechenkoeder');
          if (replaceIdx !== -1) {
            const actualIdx = topResults.length - 1 - replaceIdx;
            topResults = [...topResults.slice(0, actualIdx), candidate, ...topResults.slice(actualIdx + 1)];
          } else {
            // Als Fallback: letzten Eintrag ersetzen, sofern er kein Oberflaechenkoeder ist
            const lastNonSurface = [...topResults].reverse().findIndex(({ entry }) => entry.klasse !== 'Oberflaechenkoeder');
            if (lastNonSurface !== -1) {
              const actualIdx = topResults.length - 1 - lastNonSurface;
              topResults = [...topResults.slice(0, actualIdx), candidate, ...topResults.slice(actualIdx + 1)];
            }
          }
        }
      }
    }

    // Regel 3: (18, 35] → Anteil Oberflaechenkoeder >= 50 %
    else if (temp > 18 && temp <= 35) {
      const surfaceCount = topResults.filter(({ entry }) => entry.klasse === 'Oberflaechenkoeder').length;
      const required = Math.ceil(topResults.length / 2); // mindestens 50 %

      if (surfaceCount < required) {
        const topResultsIdsSet = new Set(topResults.map(({ entry }) => entry.id));
        // Pool der Oberflächenköder, die noch nicht in topResults sind
        const surfacePool = nonZero.filter(
          ({ entry }) => entry.klasse === 'Oberflaechenkoeder' && !topResultsIdsSet.has(entry.id)
        );

        let result = [...topResults];
        let added = surfaceCount;

        for (const candidate of surfacePool) {
          if (added >= Math.ceil(result.length / 2)) break;
          // Ersetze den letzten Nicht-Oberflächenköder (von hinten)
          const replaceIdx = [...result].reverse().findIndex(({ entry }) => entry.klasse !== 'Oberflaechenkoeder');
          if (replaceIdx === -1) break;
          const actualIdx = result.length - 1 - replaceIdx;
          result = [...result.slice(0, actualIdx), candidate, ...result.slice(actualIdx + 1)];
          added++;
        }

        // Fallback: wenn Pool erschöpft und Ratio noch nicht erreicht,
        // Nicht-Oberflächenköder von hinten entfernen bis Ratio stimmt
        while (result.length > 0) {
          const sc = result.filter(({ entry }) => entry.klasse === 'Oberflaechenkoeder').length;
          if (sc >= Math.ceil(result.length / 2)) break;
          // Letzten Nicht-Oberflächenköder entfernen
          const lastNonSurfaceIdx = [...result].reverse().findIndex(({ entry }) => entry.klasse !== 'Oberflaechenkoeder');
          if (lastNonSurfaceIdx === -1) break; // nur noch Oberflächenköder
          const actualIdx = result.length - 1 - lastNonSurfaceIdx;
          result = [...result.slice(0, actualIdx), ...result.slice(actualIdx + 1)];
        }

        topResults = result;
      }
    }
  }

  // Schritt 6: Recommendation-Objekte bauen
  return topResults.map(({ entry, score }) => ({
    bait: entry,
    score,
    kurzerklaerung: generateKurzerklaerung(entry, profile, score),
    charakteristika: {
      typBezeichnung: entry.typBezeichnung,
      typ: entry.typ,
      groesse: entry.groesse,
      farbe: entry.farbe,
      gewicht: entry.gewicht,
      aktion: entry.aktion,
      klasse: entry.klasse,
    },
  }));
}

/**
 * Liefert bis zu 3 generische Fallback-Empfehlungen, wenn `query()` 0 Ergebnisse
 * zurückgegeben hat. Die Fallback-Logik verwendet ausschließlich `gewaesserart`
 * und `jahreszeit` aus dem Profil (alle anderen Filter werden ignoriert).
 *
 * Sonderfall: Wenn beide `gewaesserart` und `jahreszeit` null sind, wird der
 * gesamte Datensatz absteigend nach `basisScore` sortiert verwendet.
 *
 * @param {import('./bait-data.js').FilterProfile} profile - Aktives Filterprofil
 * @param {import('./bait-data.js').BaitEntry[]} dataset - Statischer Köder-Datensatz
 * @returns {(import('./bait-data.js').Recommendation & { isFallback: true })[]}
 */
function getFallback(profile, dataset) {
  if (!dataset || dataset.length === 0) {
    return [];
  }

  const { gewaesserart, jahreszeit } = profile;
  const bothNull =
    (gewaesserart === null || gewaesserart === undefined) &&
    (jahreszeit === null || jahreszeit === undefined);

  // Eingeschränktes Fallback-Profil: nur gewaesserart + jahreszeit aus dem Originalprofil
  const fallbackProfile = {
    wetter: null,
    tageszeit: null,
    stroemung: null,
    gewaesserart: gewaesserart ?? null,
    tiefe: null,
    jahreszeit: jahreszeit ?? null,
    fischart: null,
    wassertemperatur: null,
  };

  let candidates;

  if (bothNull) {
    // Kein einschränkender Filter → gesamten Datensatz nach basisScore absteigend sortieren
    candidates = [...dataset].sort((a, b) => {
      if (b.basisScore !== a.basisScore) return b.basisScore - a.basisScore;
      return a.typBezeichnung.localeCompare(b.typBezeichnung, 'de');
    });
  } else {
    // Einträge filtern, die gewaesserart und/oder jahreszeit erfüllen
    const filtered = dataset.filter((entry) => {
      if (
        gewaesserart !== null &&
        gewaesserart !== undefined &&
        !filterMatches(entry.gewaesserart, gewaesserart)
      ) {
        return false;
      }
      if (
        jahreszeit !== null &&
        jahreszeit !== undefined &&
        !filterMatches(entry.jahreszeit, jahreszeit)
      ) {
        return false;
      }
      return true;
    });

    // Nach basisScore absteigend sortieren, bei Gleichstand nach typBezeichnung
    candidates = filtered.sort((a, b) => {
      if (b.basisScore !== a.basisScore) return b.basisScore - a.basisScore;
      return a.typBezeichnung.localeCompare(b.typBezeichnung, 'de');
    });
  }

  // Maximal 3 Fallback-Empfehlungen zurückgeben
  return candidates.slice(0, 3).map((entry) => ({
    bait: entry,
    score: entry.basisScore,
    kurzerklaerung: generateKurzerklaerung(entry, fallbackProfile, entry.basisScore),
    charakteristika: {
      typBezeichnung: entry.typBezeichnung,
      typ: entry.typ,
      groesse: entry.groesse,
      farbe: entry.farbe,
      gewicht: entry.gewicht,
      aktion: entry.aktion,
      klasse: entry.klasse,
    },
    isFallback: true,
  }));
}

export const FilterEngine = {
  scoreEntry,
  query,
  getFallback,
};
