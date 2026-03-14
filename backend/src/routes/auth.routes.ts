import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', authController.signUp);
  app.post('/sign-in', authController.signIn);
  app.post('/sign-out', { preHandler: [requireAuth] }, authController.signOut);
  app.get('/profile', { preHandler: [requireAuth] }, authController.getProfile);
}
