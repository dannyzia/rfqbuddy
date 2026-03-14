import { api } from '../api-client';

export const storageApi = {
  getUploadUrl(data: { entity: string; entity_id: string; file_name: string; content_type: string }) {
    return api.post<{ upload_url: string; storage_path: string }>('/api/storage/upload-url', data);
  },

  getDownloadUrl(key: string) {
    return api.get<{ download_url: string }>(`/api/storage/download/${encodeURIComponent(key)}`);
  },

  deleteFile(id: string) {
    return api.delete<{ success: true }>(`/api/storage/${id}`);
  },

  // Helper: upload a File to R2 via pre-signed URL
  async uploadFile(
    entity: string,
    entityId: string,
    file: File,
  ): Promise<{ storage_path: string }> {
    // 1. Get pre-signed upload URL from backend
    const { upload_url, storage_path } = await this.getUploadUrl({
      entity,
      entity_id: entityId,
      file_name: file.name,
      content_type: file.type,
    });

    // 2. Upload directly to R2
    await fetch(upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    return { storage_path };
  },
};
