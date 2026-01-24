import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { ConversionResource } from '../../main/resources/conversion-resource';

// Mock pdfmake
vi.mock('pdfmake/build/pdfmake', () => ({
  default: {
    vfs: {},
    createPdf: vi.fn(() => ({
      getStream: vi.fn(() => ({
        pipe: vi.fn(),
        end: vi.fn(),
      })),
    })),
  },
}));

vi.mock('pdfmake/build/vfs_fonts', () => ({
  default: {
    vfs: {},
  },
}));

// Mock the ConversionService as a class
vi.mock('../../main/services/conversion-service/conversion-service', () => {
  return {
    ConversionService: class MockConversionService {
      convertToSvg = vi.fn().mockResolvedValue({
        svg: '<svg><rect width="100" height="100"/></svg>',
        clip: { width: 100, height: 100 },
      });
    },
  };
});

describe('ConversionResource', () => {
  let conversionResource: ConversionResource;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    conversionResource = new ConversionResource();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      type: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      sendStatus: vi.fn().mockReturnThis(),
    };
  });

  describe('convert', () => {
    it('should return 400 when model is not provided', async () => {
      mockRequest.body = {};

      await conversionResource.convert(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Model must be defined!' });
    });

    it('should return 400 when body is undefined', async () => {
      mockRequest.body = undefined;

      await conversionResource.convert(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Model must be defined!' });
    });

    it('should process model and return PDF when model is provided as object', async () => {
      const testModel = {
        elements: {},
        relationships: {},
        assessments: {},
      };

      mockRequest.body = { model: testModel };

      await conversionResource.convert(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.type).toHaveBeenCalledWith('application/pdf');
    });

    it('should parse model when provided as JSON string', async () => {
      const testModel = {
        elements: {},
        relationships: {},
      };

      mockRequest.body = { model: JSON.stringify(testModel) };

      await conversionResource.convert(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.type).toHaveBeenCalledWith('application/pdf');
    });

    it('should call conversionService.convertToSvg with the model', async () => {
      const testModel = {
        elements: { '1': { type: 'Class', name: 'TestClass' } },
        relationships: {},
      };

      mockRequest.body = { model: testModel };

      await conversionResource.convert(mockRequest as Request, mockResponse as Response);

      expect(conversionResource.conversionService.convertToSvg).toHaveBeenCalledWith(testModel);
    });
  });

  describe('status', () => {
    it('should return 200 status', () => {
      conversionResource.status(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});
