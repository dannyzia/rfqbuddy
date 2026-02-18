import { Request, Response, NextFunction } from 'express';
import { authController } from '../auth.controller';
import { authService } from '../../services/auth.service';

jest.mock('../../services/auth.service');
jest.mock('../../config/logger');

describe('AuthController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {},
      user: undefined,
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const mockRegistration = {
        user: {
          id: 'user-001',
          email: 'user@example.com',
          name: 'Test User',
          roles: ['buyer'],
          organizationId: 'org-001',
        },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };

      (authService.register as jest.Mock).mockResolvedValue(mockRegistration);

      mockReq.body = {
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'Test User',
        organizationType: 'vendor',
      };

      await authController.register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user: mockRegistration.user,
          accessToken: mockRegistration.accessToken,
          refreshToken: mockRegistration.refreshToken,
        },
      });
    });

    it('should handle validation errors on registration', async () => {
      const error = new Error('Email already exists');
      (authService.register as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        email: 'existing@example.com',
        password: 'SecurePass123',
      };

      await authController.register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const error = new Error('Database connection failed');
      (authService.register as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        email: 'user@example.com',
        password: 'SecurePass123',
      };

      await authController.register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const mockLogin = {
        user: {
          id: 'user-001',
          email: 'user@example.com',
          name: 'Test User',
          roles: ['vendor'],
          organizationId: 'org-001',
        },
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-012',
      };

      (authService.login as jest.Mock).mockResolvedValue(mockLogin);

      mockReq.body = {
        email: 'user@example.com',
        password: 'SecurePass123',
      };

      await authController.login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user: mockLogin.user,
          accessToken: mockLogin.accessToken,
          refreshToken: mockLogin.refreshToken,
        },
      });
    });

    it('should handle invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      (authService.login as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        email: 'user@example.com',
        password: 'WrongPassword',
      };

      await authController.login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle missing email or password', async () => {
      const error = new Error('Email and password are required');
      (authService.login as jest.Mock).mockRejectedValue(error);

      mockReq.body = { email: 'user@example.com' };

      await authController.login(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const mockRefresh = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      (authService.refreshToken as jest.Mock).mockResolvedValue(mockRefresh);

      mockReq.body = {
        refreshToken: 'refresh-token-456',
      };

      await authController.refreshToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          accessToken: mockRefresh.accessToken,
          refreshToken: mockRefresh.refreshToken,
        },
      });
    });

    it('should handle invalid refresh token', async () => {
      const error = new Error('Invalid refresh token');
      (authService.refreshToken as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        refreshToken: 'invalid-token',
      };

      await authController.refreshToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle expired refresh token', async () => {
      const error = new Error('Refresh token expired');
      (authService.refreshToken as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        refreshToken: 'expired-token',
      };

      await authController.refreshToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      (authService.forgotPassword as jest.Mock).mockResolvedValue(undefined);

      mockReq.body = {
        email: 'user@example.com',
      };

      await authController.forgotPassword(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: { message: 'Password reset email sent' },
      });
    });

    it('should handle non-existent email gracefully', async () => {
      // The service should handle this silently for security
      (authService.forgotPassword as jest.Mock).mockResolvedValue(undefined);

      mockReq.body = {
        email: 'nonexistent@example.com',
      };

      await authController.forgotPassword(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle email service errors', async () => {
      const error = new Error('Email service unavailable');
      (authService.forgotPassword as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        email: 'user@example.com',
      };

      await authController.forgotPassword(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const mockReset = {
        user: {
          id: 'user-001',
          email: 'user@example.com',
        },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      (authService.resetPassword as jest.Mock).mockResolvedValue(mockReset);

      mockReq.body = {
        token: 'reset-token-123',
        password: 'NewPassword123',
      };

      await authController.resetPassword(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          user: mockReset.user,
          accessToken: mockReset.accessToken,
          refreshToken: mockReset.refreshToken,
        },
      });
    });

    it('should handle invalid reset token', async () => {
      const error = new Error('Invalid or expired reset token');
      (authService.resetPassword as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        token: 'invalid-token',
        password: 'NewPassword123',
      };

      await authController.resetPassword(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle weak password validation', async () => {
      const error = new Error('Password does not meet requirements');
      (authService.resetPassword as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        token: 'reset-token-123',
        password: 'weak',
      };

      await authController.resetPassword(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      mockReq.body = {
        refreshToken: 'refresh-token-456',
      };

      await authController.logout(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: { message: 'Logged out successfully' },
      });
    });

    it('should handle logout without refresh token', async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      mockReq.body = {};
      mockReq.headers = {};

      await authController.logout(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle service errors during logout', async () => {
      const error = new Error('Logout failed');
      (authService.logout as jest.Mock).mockRejectedValue(error);

      mockReq.body = {
        refreshToken: 'refresh-token-456',
      };

      await authController.logout(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getMe', () => {
    it('should return authenticated user profile', async () => {
      const mockUser = {
        id: 'user-001',
        email: 'user@example.com',
        name: 'Test User',
        roles: ['vendor'],
        organizationId: 'org-001',
        organizationName: 'Test Organization',
        organizationType: 'vendor',
      };

      (authService.getMe as jest.Mock).mockResolvedValue(mockUser);

      mockReq.user = { id: 'user-001', email: 'user@example.com', role: 'vendor', roles: ['vendor'], orgId: 'org-001' };

      await authController.getMe(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: { user: mockUser },
      });
    });

    it('should handle user not found error', async () => {
      const error = new Error('User not found');
      (authService.getMe as jest.Mock).mockRejectedValue(error);

      mockReq.user = { id: 'user-999', email: 'user@example.com', role: 'vendor', roles: ['vendor'], orgId: 'org-001' };

      await authController.getMe(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle missing authentication context', async () => {
      mockReq.user = undefined;

      await authController.getMe(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
          statusCode: 401,
        },
      });
    });
  });

});
