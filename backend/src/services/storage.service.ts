import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2, R2_BUCKET } from '../config/storage';
import { db } from '../config/database';
import { fileAttachments } from '../schema';
import { eq, and } from 'drizzle-orm';

export const storageService = {
  async upload(key: string, body: Buffer, contentType: string) {
    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }));
    return { key };
  },

  async getDownloadUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
    return getSignedUrl(r2, command, { expiresIn });
  },

  async getUploadUrl(key: string, contentType: string, expiresIn = 600) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(r2, command, { expiresIn });
  },

  async delete(key: string) {
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  },

  // Track file metadata in DB
  async trackFile(data: {
    entity_type: string;
    entity_id: string;
    file_name: string;
    file_type?: string;
    file_size?: number;
    storage_path: string;
    uploaded_by: string;
  }) {
    const [attachment] = await db.insert(fileAttachments).values(data).returning();
    return attachment;
  },

  async getFilesForEntity(entityType: string, entityId: string) {
    return db.select().from(fileAttachments)
      .where(and(
        eq(fileAttachments.entity_type, entityType),
        eq(fileAttachments.entity_id, entityId),
      ));
  },

  async deleteFile(fileId: string) {
    const [file] = await db.select().from(fileAttachments)
      .where(eq(fileAttachments.id, fileId)).limit(1);

    if (file) {
      await this.delete(file.storage_path);
      await db.delete(fileAttachments).where(eq(fileAttachments.id, fileId));
    }
  },
};
