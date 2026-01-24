import { describe, it, expect } from 'vitest';
import { tokenLength } from '../main/constants';

describe('constants', () => {
  describe('tokenLength', () => {
    it('should be a positive number', () => {
      expect(tokenLength).toBeGreaterThan(0);
    });

    it('should be 20 characters', () => {
      expect(tokenLength).toBe(20);
    });
  });
});
