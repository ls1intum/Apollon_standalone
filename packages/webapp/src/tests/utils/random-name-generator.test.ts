import { describe, it, expect } from 'vitest';
import { generateRandomName } from '../../main/utils/random-name-generator/random-name-generator';

describe('generateRandomName', () => {
  it('should return a string with two words', () => {
    const name = generateRandomName();
    const words = name.split(' ');

    expect(words).toHaveLength(2);
  });

  it('should return title-cased adjective followed by lowercase animal', () => {
    const name = generateRandomName();
    const words = name.split(' ');

    // First word (adjective) should be title-cased
    const adjective = words[0];
    expect(adjective[0]).toBe(adjective[0].toUpperCase());
    expect(adjective.slice(1)).toBe(adjective.slice(1).toLowerCase());

    // Second word (animal) should be lowercase
    const animal = words[1];
    expect(animal).toBe(animal.toLowerCase());
  });

  it('should generate different names on subsequent calls', () => {
    const names = new Set<string>();

    // Generate 10 names and check that we get some variety
    for (let i = 0; i < 10; i++) {
      names.add(generateRandomName());
    }

    // With random generation, we should get at least 2 different names in 10 tries
    expect(names.size).toBeGreaterThan(1);
  });
});
