import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input = req.body;
      const result = await authService.register(input);
      res.status(201).json({
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body;
      // #region agent log
      const logPayload = (loc: string, msg: string, data: Record<string, unknown>) =>
        fetch('http://127.0.0.1:7913/ingest/f2613068-5959-4e44-9e45-ee5298bee58d', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '2970bd' }, body: JSON.stringify({ sessionId: '2970bd', location: loc, message: msg, data, timestamp: Date.now(), hypothesisId: 'B' }) }).catch(() => {});
      logPayload('auth.controller.ts:login:entry', 'login request', { email: input?.email });
      // #endregion
      const result = await authService.login(input);
      // #region agent log
      logPayload('auth.controller.ts:login:success', 'login service returned', { hasUser: !!result?.user });
      // #endregion
      res.status(200).json({
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (err) {
      // #region agent log
      const e = err as { message?: string; statusCode?: number };
      fetch('http://127.0.0.1:7913/ingest/f2613068-5959-4e44-9e45-ee5298bee58d', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '2970bd' }, body: JSON.stringify({ sessionId: '2970bd', location: 'auth.controller.ts:login:catch', message: 'login error', data: { message: e?.message, statusCode: e?.statusCode }, timestamp: Date.now(), hypothesisId: 'C' }) }).catch(() => {});
      // #endregion
      next(err);
    }
  },

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input = req.body;
      const result = await authService.refreshToken(input);
      res.status(200).json({
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input = req.body;
      await authService.forgotPassword(input);
      res.status(200).json({
        data: { message: "Password reset email sent" },
      });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input = req.body;
      const result = await authService.resetPassword(input);
      res.status(200).json({
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Only invalidate a refresh token supplied explicitly in the request body.
      // The Authorization header contains the JWT *access* token, not the refresh
      // UUID — passing it to the service would cause a Postgres uuid type error.
      const refreshToken = req.body.refreshToken as string | undefined;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.status(200).json({
        data: { message: "Logged out successfully" },
      });
    } catch (err) {
      next(err);
    }
  },

  async getMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: "Authentication required",
            code: "AUTHENTICATION_REQUIRED",
            statusCode: 401,
          },
        });
        return;
      }
      const user = await authService.getMe(req.user.id);
      res.status(200).json({ data: { user } });
    } catch (err) {
      next(err);
    }
  },
};
