import { FastifyRequest, FastifyReply } from 'fastify';
import { storageService } from '../services/storage.service';
import { buildStoragePath, ALLOWED_TYPES, MAX_FILE_SIZE } from '../config/storage';

export const storageController = {
  async getUploadUrl(req: FastifyRequest, reply: FastifyReply) {
    const { entity, entity_id, file_name, content_type } = req.body as any;

    // Validate
    if (!ALLOWED_TYPES.documents.includes(content_type)) {
      return reply.code(400).send({ error: `Invalid file type: ${content_type}` });
    }

    const key = buildStoragePath(entity, entity_id, file_name);
    const url = await storageService.getUploadUrl(key, content_type);

    return reply.send({ upload_url: url, storage_path: key });
  },

  async getDownloadUrl(req: FastifyRequest, reply: FastifyReply) {
    const { key } = req.params as { key: string };
    const url = await storageService.getDownloadUrl(decodeURIComponent(key));
    return reply.send({ download_url: url });
  },

  async deleteFile(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await storageService.deleteFile(id);
    return reply.send({ success: true });
  },
};
