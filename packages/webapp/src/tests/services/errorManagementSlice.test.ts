import { describe, it, expect, vi } from 'vitest';
import {
  errorReducer,
  displayError,
  dismissError,
  ApollonError,
} from '../../main/services/error-management/errorManagementSlice';

// Mock uuid to return predictable values
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-123'),
}));

describe('errorManagementSlice', () => {
  const initialState: ApollonError[] = [];

  describe('displayError', () => {
    it('should add an error to the state', () => {
      const result = errorReducer(initialState, displayError('Error Title', 'Error description'));

      expect(result).toHaveLength(1);
      expect(result[0].headerText).toBe('Error Title');
      expect(result[0].bodyText).toBe('Error description');
      expect(result[0].id).toBe('test-uuid-123');
    });

    it('should append errors to existing ones', () => {
      const stateWithError: ApollonError[] = [
        { id: 'existing-id', headerText: 'Existing Error', bodyText: 'Existing body' },
      ];

      const result = errorReducer(stateWithError, displayError('New Error', 'New body'));

      expect(result).toHaveLength(2);
      expect(result[0].headerText).toBe('Existing Error');
      expect(result[1].headerText).toBe('New Error');
    });
  });

  describe('dismissError', () => {
    it('should remove an error by id', () => {
      const stateWithErrors: ApollonError[] = [
        { id: 'error-1', headerText: 'Error 1', bodyText: 'Body 1' },
        { id: 'error-2', headerText: 'Error 2', bodyText: 'Body 2' },
      ];

      const result = errorReducer(stateWithErrors, dismissError('error-1'));

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('error-2');
    });

    it('should not change state when dismissing non-existent error', () => {
      const stateWithError: ApollonError[] = [{ id: 'error-1', headerText: 'Error 1', bodyText: 'Body 1' }];

      const result = errorReducer(stateWithError, dismissError('non-existent'));

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('error-1');
    });

    it('should return empty array when dismissing last error', () => {
      const stateWithError: ApollonError[] = [{ id: 'error-1', headerText: 'Error 1', bodyText: 'Body 1' }];

      const result = errorReducer(stateWithError, dismissError('error-1'));

      expect(result).toHaveLength(0);
    });
  });
});
