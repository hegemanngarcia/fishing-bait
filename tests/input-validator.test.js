// Feature: fishing-bait-advisor
// InputValidator tests — Task 2.14: validateWassertemperatur()
// Validates: Requirements 6.1, 6.5

import { describe, it, expect } from 'vitest';
import { InputValidator, ValidationError } from '../src/js/input-validator.js';

const { validateWassertemperatur } = InputValidator;

// ---------------------------------------------------------------------------
// Gültige Werte — innerhalb [0, 35]
// ---------------------------------------------------------------------------

describe('InputValidator.validateWassertemperatur() — gültige Werte', () => {
  it('0 ist gültig (untere Grenze, inklusive) → gibt 0 zurück', () => {
    expect(validateWassertemperatur(0)).toBe(0);
  });

  it('35 ist gültig (obere Grenze, inklusive) → gibt 35 zurück', () => {
    expect(validateWassertemperatur(35)).toBe(35);
  });

  it('15 ist ein gültiger Mittelwert → gibt 15 zurück', () => {
    expect(validateWassertemperatur(15)).toBe(15);
  });

  it('1 (direkt über der unteren Grenze) → gibt 1 zurück', () => {
    expect(validateWassertemperatur(1)).toBe(1);
  });

  it('34 (direkt unter der oberen Grenze) → gibt 34 zurück', () => {
    expect(validateWassertemperatur(34)).toBe(34);
  });

  it('gültiger Float innerhalb des Bereichs → gibt den Float zurück', () => {
    expect(validateWassertemperatur(12.5)).toBe(12.5);
  });

});

// ---------------------------------------------------------------------------
// Deaktivierter Filter — null / undefined
// ---------------------------------------------------------------------------

describe('InputValidator.validateWassertemperatur() — Filter deaktiviert', () => {
  it('null → gibt null zurück (Filter deaktiviert)', () => {
    expect(validateWassertemperatur(null)).toBeNull();
  });

  it('undefined → gibt null zurück (Filter deaktiviert)', () => {
    expect(validateWassertemperatur(undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Ungültige Werte — außerhalb [0, 35]
// ---------------------------------------------------------------------------

describe('InputValidator.validateWassertemperatur() — außerhalb des erlaubten Bereichs', () => {
  it('-1 (unter unterer Grenze) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur(-1)).toThrow(ValidationError);
  });

  it('36 (über oberer Grenze) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur(36)).toThrow(ValidationError);
  });

  it('-0.1 (knapp unter 0) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur(-0.1)).toThrow(ValidationError);
  });

  it('35.1 (knapp über 35) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur(35.1)).toThrow(ValidationError);
  });

  it('100 (weit außerhalb) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur(100)).toThrow(ValidationError);
  });

  it('-100 (weit außerhalb, negativ) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur(-100)).toThrow(ValidationError);
  });
});

// ---------------------------------------------------------------------------
// Ungültige Werte — nicht-numerisch
// ---------------------------------------------------------------------------

describe('InputValidator.validateWassertemperatur() — nicht-numerische Werte', () => {
  it('"abc" (nicht-numerischer String) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur('abc')).toThrow(ValidationError);
  });

  it('"" (leerer String) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur('')).toThrow(ValidationError);
  });

  it('NaN → wirft ValidationError', () => {
    expect(() => validateWassertemperatur(NaN)).toThrow(ValidationError);
  });

  it('Objekt {} → wirft ValidationError', () => {
    expect(() => validateWassertemperatur({})).toThrow(ValidationError);
  });

  it('Array [] → wirft ValidationError', () => {
    expect(() => validateWassertemperatur([])).toThrow(ValidationError);
  });

  it('"  " (nur Leerzeichen) → wirft ValidationError', () => {
    expect(() => validateWassertemperatur('  ')).toThrow(ValidationError);
  });
});

// ---------------------------------------------------------------------------
// Fehlerklasse prüfen — ValidationError hat den richtigen Namen
// ---------------------------------------------------------------------------

describe('InputValidator.validateWassertemperatur() — ValidationError-Struktur', () => {
  it('geworfener Fehler ist eine Instanz von Error', () => {
    try {
      validateWassertemperatur(-1);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('geworfener Fehler hat name === "ValidationError"', () => {
    try {
      validateWassertemperatur('abc');
    } catch (err) {
      expect(err.name).toBe('ValidationError');
    }
  });

  it('geworfener Fehler hat eine nicht-leere message', () => {
    try {
      validateWassertemperatur(36);
    } catch (err) {
      expect(typeof err.message).toBe('string');
      expect(err.message.length).toBeGreaterThan(0);
    }
  });
});
