import { vendorService } from '../vendor.service';
import type {
  CreateVendorProfileInput,
  UpdateVendorProfileInput,
  VendorStatusInput,
  UploadDocumentInput,
  AddCategoryInput,
} from '../../schemas/vendor.schema';

jest.mock('../../config/database');
jest.mock('../../config/logger');
jest.mock('uuid');

import { v4 as uuidv4 } from 'uuid';

describe('VendorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue('vendor-uuid-1234');
  });

  describe('createProfile', () => {
    it('should create vendor profile', async () => {
      const mockDatabase = require('../../config/database');
      
      const mockProfile = {
        organization_id: 'org-vendor-001',
        legal_name: 'ABC Trading Co',
        tax_id: 'TAX123',
        contact_name: 'John Doe',
        contact_email: 'john@abc.com',
        contact_phone: '+1234567890',
        website: 'https://abc.com',
        status: 'pending',
        status_changed_at: new Date(),
        status_changed_by: null,
        rejection_reason: null,
        created_at: new Date(),
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockProfile] });

      const input: CreateVendorProfileInput = {
        legalName: 'ABC Trading Co',
        taxId: 'TAX123',
        contactName: 'John Doe',
        contactEmail: 'john@abc.com',
        contactPhone: '+1234567890',
        website: 'https://abc.com',
      };

      const result = await vendorService.createProfile('org-vendor-001', input);

      expect(result.status).toBe('pending');
      expect(result.legal_name).toBe('ABC Trading Co');
    });

    it('should create profile with minimal fields', async () => {
      const mockDatabase = require('../../config/database');
      
      const mockProfile = {
        organization_id: 'org-vendor-002',
        legal_name: 'Simple Vendor',
        tax_id: null,
        contact_name: null,
        contact_email: null,
        contact_phone: null,
        website: null,
        status: 'pending',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockProfile] });

      const input: CreateVendorProfileInput = {
        legalName: 'Simple Vendor',
      };

      const result = await vendorService.createProfile('org-vendor-002', input);

      expect(result.legal_name).toBe('Simple Vendor');
      expect(result.tax_id).toBeNull();
    });
  });

  describe('findProfileByOrgId', () => {
    it('should return vendor profile by org id', async () => {
      const mockDatabase = require('../../config/database');
      
      const mockProfile = {
        organization_id: 'org-vendor-001',
        legal_name: 'ABC Trading Co',
        status: 'approved',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockProfile] });

      const result = await vendorService.findProfileByOrgId('org-vendor-001');

      expect(result).toEqual(mockProfile);
    });

    it('should return null if profile not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await vendorService.findProfileByOrgId('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findAllProfiles', () => {
    it('should return all vendor profiles', async () => {
      const mockDatabase = require('../../config/database');
      
      const profiles = [
        { organization_id: 'org-001', legal_name: 'Vendor 1', status: 'approved' },
        { organization_id: 'org-002', legal_name: 'Vendor 2', status: 'pending' },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: profiles });

      const result = await vendorService.findAllProfiles();

      expect(result).toHaveLength(2);
    });

    it('should filter profiles by status', async () => {
      const mockDatabase = require('../../config/database');
      
      const profiles = [
        { organization_id: 'org-001', legal_name: 'Vendor 1', status: 'approved' },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: profiles });

      const result = await vendorService.findAllProfiles('approved');

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('approved');
    });

    it('should return empty array if no profiles found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await vendorService.findAllProfiles();

      expect(result).toHaveLength(0);
    });
  });

  describe('updateProfile', () => {
    it('should update vendor profile', async () => {
      const mockDatabase = require('../../config/database');
      
      const existingProfile = {
        organization_id: 'org-vendor-001',
        legal_name: 'ABC Trading Co',
        tax_id: 'TAX123',
      };

      const updatedProfile = {
        organization_id: 'org-vendor-001',
        legal_name: 'ABC Trading Company',
        tax_id: 'TAX456',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [existingProfile] })
        .mockResolvedValueOnce({ rows: [updatedProfile] });

      const input: UpdateVendorProfileInput = {
        legalName: 'ABC Trading Company',
        taxId: 'TAX456',
      };

      const result = await vendorService.updateProfile('org-vendor-001', input);

      expect(result.legal_name).toBe('ABC Trading Company');
    });

    it('should throw error if profile not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const input: UpdateVendorProfileInput = {};

      await expect(
        vendorService.updateProfile('nonexistent', input)
      ).rejects.toThrow('Vendor profile not found');
    });

    it('should return profile if no updates provided', async () => {
      const mockDatabase = require('../../config/database');
      
      const existingProfile = {
        organization_id: 'org-vendor-001',
        legal_name: 'ABC Trading Co',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [existingProfile] });

      const input: UpdateVendorProfileInput = {};

      const result = await vendorService.updateProfile('org-vendor-001', input);

      expect(result).toEqual(existingProfile);
    });
  });

  describe('changeStatus', () => {
    it('should change vendor status from pending to approved', async () => {
      const mockDatabase = require('../../config/database');
      
      const profile = {
        organization_id: 'org-vendor-001',
        status: 'pending',
      };

      const updatedProfile = {
        organization_id: 'org-vendor-001',
        status: 'approved',
        status_changed_at: new Date(),
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [profile] })
        .mockResolvedValueOnce({ rows: [updatedProfile] });

      const input: VendorStatusInput = {
        status: 'approved',
      };

      const result = await vendorService.changeStatus('org-vendor-001', input, 'user-001');

      expect(result.status).toBe('approved');
    });

    it('should throw error for invalid status transition', async () => {
      const mockDatabase = require('../../config/database');
      
      const profile = {
        organization_id: 'org-vendor-001',
        status: 'pending',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [profile] });

      const input: VendorStatusInput = {
        status: 'suspended',
      };

      await expect(
        vendorService.changeStatus('org-vendor-001', input, 'user-001')
      ).rejects.toThrow();
    });

    it('should include rejection reason when rejecting vendor', async () => {
      const mockDatabase = require('../../config/database');
      
      const profile = {
        organization_id: 'org-vendor-001',
        status: 'pending',
      };

      const rejectedProfile = {
        organization_id: 'org-vendor-001',
        status: 'rejected',
        rejection_reason: 'Documents incomplete',
      };

      mockDatabase.pool.query
        .mockResolvedValueOnce({ rows: [profile] })
        .mockResolvedValueOnce({ rows: [rejectedProfile] });

      const input: VendorStatusInput = {
        status: 'rejected',
        rejectionReason: 'Documents incomplete',
      };

      const result = await vendorService.changeStatus('org-vendor-001', input, 'user-001');

      expect(result.rejection_reason).toBe('Documents incomplete');
    });
  });

  describe('uploadDocument', () => {
    it('should upload vendor document with valid type', async () => {
      const mockDatabase = require('../../config/database');
      
      const mockDocument = {
        id: 'vendor-uuid-1234',
        vendor_org_id: 'org-vendor-001',
        document_type: 'trade_license',
        file_url: 'https://s3.example.com/doc.pdf',
        issued_date: '2024-01-01',
        expiry_date: '2025-01-01',
        uploaded_at: new Date(),
        uploaded_by: 'user-001',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockDocument] });

      const input: UploadDocumentInput = {
        documentType: 'trade_license',
        fileUrl: 'https://s3.example.com/doc.pdf',
        issuedDate: '2024-01-01',
        expiryDate: '2025-01-01',
      };

      const result = await vendorService.uploadDocument('org-vendor-001', input, 'user-001');

      expect(result.document_type).toBe('trade_license');
      expect(result.file_url).toBe('https://s3.example.com/doc.pdf');
    });

    it('should upload ISO certificate', async () => {
      const mockDatabase = require('../../config/database');
      
      const mockDocument = {
        id: 'vendor-uuid-1234',
        vendor_org_id: 'org-vendor-001',
        document_type: 'iso_cert',
        file_url: 'https://s3.example.com/iso.pdf',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockDocument] });

      const input: UploadDocumentInput = {
        documentType: 'iso_cert',
        fileUrl: 'https://s3.example.com/iso.pdf',
      };

      const result = await vendorService.uploadDocument('org-vendor-001', input, 'user-001');

      expect(result.document_type).toBe('iso_cert');
    });

    it('should upload vat certificate', async () => {
      const mockDatabase = require('../../config/database');
      
      const mockDocument = {
        id: 'vendor-uuid-1234',
        vendor_org_id: 'org-vendor-001',
        document_type: 'vat_certificate',
        file_url: 'https://s3.example.com/vat.pdf',
      };

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [mockDocument] });

      const input: UploadDocumentInput = {
        documentType: 'vat_certificate',
        fileUrl: 'https://s3.example.com/vat.pdf',
      };

      const result = await vendorService.uploadDocument('org-vendor-001', input, 'user-001');

      expect(result.document_type).toBe('vat_certificate');
    });
  });

  describe('findDocumentsByOrgId', () => {
    it('should return all documents for vendor', async () => {
      const mockDatabase = require('../../config/database');
      
      const documents = [
        { id: 'doc-001', vendor_org_id: 'org-001', document_type: 'trade_license' },
        { id: 'doc-002', vendor_org_id: 'org-001', document_type: 'vat_certificate' },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: documents });

      const result = await vendorService.findDocumentsByOrgId('org-001');

      expect(result).toHaveLength(2);
    });

    it('should return empty array if no documents', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await vendorService.findDocumentsByOrgId('org-001');

      expect(result).toHaveLength(0);
    });
  });

  describe('deleteDocument', () => {
    it('should delete document by ID', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rowCount: 1 });

      await vendorService.deleteDocument('org-001', 'doc-001');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });

    it('should throw error if document not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rowCount: 0 });

      await expect(
        vendorService.deleteDocument('org-001', 'nonexistent')
      ).rejects.toThrow();
    });
  });

  describe('addCategory', () => {
    it('should add category to vendor', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [{}] });

      const input: AddCategoryInput = {
        categoryId: 'cat-001',
      };

      await vendorService.addCategory('org-001', input);

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });
  });

  describe('findCategoriesByOrgId', () => {
    it('should return all categories for vendor', async () => {
      const mockDatabase = require('../../config/database');
      
      const categories = [
        { vendor_org_id: 'org-001', category_id: 'cat-001', added_at: new Date() },
        { vendor_org_id: 'org-001', category_id: 'cat-002', added_at: new Date() },
      ];

      mockDatabase.pool.query.mockResolvedValueOnce({ rows: categories });

      const result = await vendorService.findCategoriesByOrgId('org-001');

      expect(result).toHaveLength(2);
    });

    it('should return empty array if no categories', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await vendorService.findCategoriesByOrgId('org-001');

      expect(result).toHaveLength(0);
    });
  });

  describe('removeCategory', () => {
    it('should remove category from vendor', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rowCount: 1 });

      await vendorService.removeCategory('org-001', 'cat-001');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });

    it('should execute delete even if category not found', async () => {
      const mockDatabase = require('../../config/database');
      mockDatabase.pool.query.mockResolvedValueOnce({ rowCount: 0 });

      await vendorService.removeCategory('org-001', 'nonexistent');

      expect(mockDatabase.pool.query).toHaveBeenCalled();
    });
  });
});
