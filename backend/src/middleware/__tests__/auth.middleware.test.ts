import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  authenticate,
  optionalAuthenticate,
  authorize,
  authorizeOwnership,
  authorizeCompany,
  authenticatedRateLimit,
} from '../auth.middleware';
import { AuthenticationError, AuthorizationError } from '../error.middleware';

jest.mock('jsonwebtoken');
jest.mock('../../config/database');
jest.mock('../../config/redis');
jest.mock('../../config');

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      headers: {},
      params: {},
      body: {},
      user: undefined,
    };
    mockRes = {
      setHeader: jest.fn(),
    };
    mockNext = jest.fn();

    // Setup Redis mock
    const mockRedis = require('../../config/redis').redisClient;
    mockRedis.get = jest.fn();
    mockRedis.incr = jest.fn();
    mockRedis.expire = jest.fn();
  });

  describe('authenticate middleware', () => {
    it('should authenticate user with valid token', async () => {
      const mockPool = require('../../config/database').pool;
      const mockRedis = require('../../config/redis').redisClient;

      const token = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: 'user-001',
        email: 'user@example.com',
      });

      mockRedis.get.mockResolvedValue(null);
      mockPool.query.mockResolvedValue({
        rows: [
          {
            id: 'user-001',
            email: 'user@example.com',
            roles: ['buyer'],
            organization_id: 'org-001',
            is_active: true,
            organization_type: 'government',
          },
        ],
      });

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect((mockReq as any).user).toEqual(
        expect.objectContaining({
          id: 'user-001',
          email: 'user@example.com',
          role: 'buyer',
        })
      );
    });

    it('should reject request without token', async () => {
      mockReq.headers = {};

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should reject request with malformed Authorization header', async () => {
      mockReq.headers = { authorization: 'InvalidFormat' };

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should reject blacklisted token', async () => {
      const mockRedis = require('../../config/redis').redisClient;
      const token = 'blacklisted.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: 'user-001',
        email: 'user@example.com',
      });

      mockRedis.get.mockResolvedValue('true');

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should reject invalid JWT token', async () => {
      const token = 'invalid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should reject expired JWT token', async () => {
      const token = 'expired.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should reject if user not found in database', async () => {
      const mockPool = require('../../config/database').pool;
      const mockRedis = require('../../config/redis').redisClient;

      const token = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: 'nonexistent-user',
        email: 'nonexistent@example.com',
      });

      mockRedis.get.mockResolvedValue(null);
      mockPool.query.mockResolvedValue({ rows: [] });

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should reject inactive user', async () => {
      const mockPool = require('../../config/database').pool;
      const mockRedis = require('../../config/redis').redisClient;

      const token = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: 'user-001',
        email: 'user@example.com',
      });

      mockRedis.get.mockResolvedValue(null);
      mockPool.query.mockResolvedValue({
        rows: [
          {
            id: 'user-001',
            email: 'user@example.com',
            roles: ['buyer'],
            organization_id: 'org-001',
            is_active: false,
          },
        ],
      });

      await authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });
  });

  describe('optionalAuthenticate middleware', () => {
    it('should pass if no token provided', async () => {
      mockReq.headers = {};

      await optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect((mockReq as any).user).toBeUndefined();
    });

    it('should authenticate if valid token provided', async () => {
      const mockPool = require('../../config/database').pool;

      const token = 'valid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: 'user-001',
        email: 'user@example.com',
      });

      mockPool.query.mockResolvedValue({
        rows: [
          {
            id: 'user-001',
            email: 'user@example.com',
            roles: ['buyer'],
            organization_id: 'org-001',
            is_active: true,
          },
        ],
      });

      await optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect((mockReq as any).user).toBeDefined();
    });

    it('should silently fail with invalid token', async () => {
      const token = 'invalid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect((mockReq as any).user).toBeUndefined();
    });
  });

  describe('authorize middleware', () => {
    it('should allow user with allowed role', () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'buyer',
      };

      const middleware = authorize('buyer', 'admin');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject user without allowed role', () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'vendor',
      };

      const middleware = authorize('buyer', 'admin');
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AuthorizationError);
    });

    it('should reject request without user', () => {
      mockReq.user = undefined;

      const middleware = authorize('buyer');
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AuthenticationError);
    });
  });

  describe('authorizeOwnership middleware', () => {
    it('should allow user to access their own resource', () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'vendor',
      };
      mockReq.params = { userId: 'user-001' };

      const middleware = authorizeOwnership('userId');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow admin to access any resource', () => {
      (mockReq as any).user = {
        id: 'admin-001',
        role: 'admin',
      };
      mockReq.params = { userId: 'user-001' };

      const middleware = authorizeOwnership('userId');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow super_admin to access any resource', () => {
      (mockReq as any).user = {
        id: 'super-admin-001',
        role: 'super_admin',
      };
      mockReq.params = { userId: 'user-001' };

      const middleware = authorizeOwnership('userId');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject user accessing other user resource', () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'vendor',
      };
      mockReq.params = { userId: 'user-002' };

      const middleware = authorizeOwnership('userId');
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AuthorizationError);
    });

    it('should reject request without resource ID', () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'vendor',
      };
      mockReq.params = {};

      const middleware = authorizeOwnership('userId');
      
      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AuthorizationError);
    });
  });

  describe('authorizeCompany middleware', () => {
    it('should allow user to access their company', async () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'buyer',
        companyId: 'org-001',
        orgId: 'org-001',
      };
      mockReq.params = { companyId: 'org-001' };

      await authorizeCompany(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow super_admin to access any company', async () => {
      (mockReq as any).user = {
        id: 'admin-001',
        role: 'super_admin',
        companyId: 'org-001',
      };
      mockReq.params = { companyId: 'org-999' };

      await authorizeCompany(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject user accessing other company', async () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'buyer',
        companyId: 'org-001',
        orgId: 'org-001',
      };
      mockReq.params = { companyId: 'org-002' };

      await authorizeCompany(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthorizationError));
    });

    it('should reject request without authentication', async () => {
      mockReq.user = undefined;
      mockReq.params = { companyId: 'org-001' };

      await authorizeCompany(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it('should reject request without company ID', async () => {
      (mockReq as any).user = {
        id: 'user-001',
        role: 'buyer',
        companyId: 'org-001',
      };
      mockReq.params = {};

      await authorizeCompany(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthorizationError));
    });
  });

  describe('authenticatedRateLimit middleware', () => {
    it('should allow requests within rate limit', async () => {
      const mockRedis = require('../../config/redis').redisClient;

      (mockReq as any).user = {
        id: 'user-001',
        role: 'buyer',
      };

      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      mockRes.setHeader = jest.fn();

      await authenticatedRateLimit(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '1000');
    });

    it('should reject requests exceeding rate limit', async () => {
      const mockRedis = require('../../config/redis').redisClient;

      (mockReq as any).user = {
        id: 'user-001',
        role: 'buyer',
      };

      mockRedis.incr.mockResolvedValue(1001);

      await authenticatedRateLimit(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthorizationError));
    });

    it('should pass through if user not authenticated', async () => {
      mockReq.user = undefined;

      await authenticatedRateLimit(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should set rate limit headers', async () => {
      const mockRedis = require('../../config/redis').redisClient;

      (mockReq as any).user = {
        id: 'user-001',
        role: 'buyer',
      };

      mockRedis.incr.mockResolvedValue(500);
      mockRedis.expire.mockResolvedValue(1);

      mockRes.setHeader = jest.fn();

      await authenticatedRateLimit(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '1000');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '500');
    });
  });
});
