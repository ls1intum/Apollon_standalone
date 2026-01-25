import { describe, it, expect } from 'vitest';
import { DiagramDTO } from 'shared';
import type { UMLModel } from '@ls1intum/apollon';
import {
  isDiagramSaveRequest,
  isDiagramPatchRequest,
  DiagramSaveRequest,
  DiagramPatchRequest,
  DiagramPresistenceRequest,
} from '../../main/services/diagram-storage/diagram-storage-rate-limiter';

const buildDiagramDTO = (title: string) =>
  new DiagramDTO('test-id', title, {} as UMLModel, '2024-01-01T00:00:00.000Z', [], 'test-token');

describe('diagram-storage-rate-limiter', () => {
  describe('isDiagramSaveRequest', () => {
    it('should return true for a save request with diagramDTO', () => {
      const saveRequest: DiagramSaveRequest = {
        token: 'test-token',
        diagramDTO: buildDiagramDTO('Test Diagram'),
      };

      expect(isDiagramSaveRequest(saveRequest)).toBe(true);
    });

    it('should return false for a patch request', () => {
      const patchRequest: DiagramPatchRequest = {
        token: 'test-token',
        patch: [{ op: 'replace', path: '/title', value: 'New Title' }],
      };

      expect(isDiagramSaveRequest(patchRequest)).toBe(false);
    });

    it('should return false for a base persistence request', () => {
      const baseRequest: DiagramPresistenceRequest = {
        token: 'test-token',
      };

      expect(isDiagramSaveRequest(baseRequest)).toBe(false);
    });
  });

  describe('isDiagramPatchRequest', () => {
    it('should return true for a patch request with patch array', () => {
      const patchRequest: DiagramPatchRequest = {
        token: 'test-token',
        patch: [
          { op: 'replace', path: '/title', value: 'New Title' },
          { op: 'add', path: '/description', value: 'A description' },
        ],
      };

      expect(isDiagramPatchRequest(patchRequest)).toBe(true);
    });

    it('should return true for a patch request with empty patch array', () => {
      const patchRequest: DiagramPatchRequest = {
        token: 'test-token',
        patch: [],
      };

      expect(isDiagramPatchRequest(patchRequest)).toBe(true);
    });

    it('should return false for a save request', () => {
      const saveRequest: DiagramSaveRequest = {
        token: 'test-token',
        diagramDTO: buildDiagramDTO('Test Diagram'),
      };

      expect(isDiagramPatchRequest(saveRequest)).toBe(false);
    });

    it('should return false for a base persistence request', () => {
      const baseRequest: DiagramPresistenceRequest = {
        token: 'test-token',
      };

      expect(isDiagramPatchRequest(baseRequest)).toBe(false);
    });
  });

  describe('request type discrimination', () => {
    it('should correctly discriminate between save and patch requests', () => {
      const saveRequest: DiagramSaveRequest = {
        token: 'save-token',
        diagramDTO: buildDiagramDTO('Save'),
      };

      const patchRequest: DiagramPatchRequest = {
        token: 'patch-token',
        patch: [{ op: 'replace', path: '/title', value: 'Patched' }],
      };

      // Save request
      expect(isDiagramSaveRequest(saveRequest)).toBe(true);
      expect(isDiagramPatchRequest(saveRequest)).toBe(false);

      // Patch request
      expect(isDiagramSaveRequest(patchRequest)).toBe(false);
      expect(isDiagramPatchRequest(patchRequest)).toBe(true);
    });
  });
});
