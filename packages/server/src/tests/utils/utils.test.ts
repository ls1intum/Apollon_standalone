import { describe, it, expect } from 'vitest';
import { randomString } from '../../main/utils';

describe('randomString', () => {
  it('should generate a string of the specified length', () => {
    const lengths = [5, 10, 20, 50];

    lengths.forEach((length) => {
      const result = randomString(length);
      expect(result).toHaveLength(length);
    });
  });

  it('should only contain alphanumeric characters', () => {
    const result = randomString(100);
    const alphanumericRegex = /^[0-9a-zA-Z]+$/;

    expect(result).toMatch(alphanumericRegex);
  });

  it('should generate different strings on subsequent calls', () => {
    const strings = new Set<string>();

    // Generate 10 strings and check that we get variety
    for (let i = 0; i < 10; i++) {
      strings.add(randomString(20));
    }

    // With random generation, we should get different strings each time
    expect(strings.size).toBe(10);
  });

  it('should handle edge case of length 0', () => {
    const result = randomString(0);
    expect(result).toBe('');
  });

  it('should handle length 1', () => {
    const result = randomString(1);
    expect(result).toHaveLength(1);
    expect(result).toMatch(/^[0-9a-zA-Z]$/);
  });
});
