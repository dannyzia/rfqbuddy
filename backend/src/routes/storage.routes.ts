import { FastifyInstance } from 'fastify';
import { storageController } from '../controllers/storage.controller';
import { requireAuth } from '../middleware/requireAuth';

export async function storageRoutes(app: FastifyInstance) {
  const auth = [requireAuth];

  app.post('/upload-url', { preHandler: auth }, storageController.getUploadUrl);
  app.get('/download/:key', { preHandler: auth }, storageController.getDownloadUrl);
  app.delete('/:id', { preHandler: auth }, storageController.deleteFile);
}
