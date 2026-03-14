// File storage hooks — upload, download, delete via Cloudflare R2

import { useState, useCallback } from 'react';
import { storageApi } from '../lib/api/storage.api';
import { useApiMutation } from '../lib/use-api';
import { toast } from 'sonner';

// ── Upload Hook (with progress tracking) ──────────────────────

interface UploadState {
  uploading: boolean;
  progress: number; // 0-100
  error: string | null;
}

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({ uploading: false, progress: 0, error: null });

  const upload = useCallback(async (
    entity: string,
    entityId: string,
    file: File,
  ): Promise<{ storage_path: string } | null> => {
    setState({ uploading: true, progress: 0, error: null });

    try {
      // Step 1: Get pre-signed upload URL
      setState(s => ({ ...s, progress: 10 }));
      const { upload_url, storage_path } = await storageApi.getUploadUrl({
        entity,
        entity_id: entityId,
        file_name: file.name,
        content_type: file.type,
      });

      // Step 2: Upload to R2 with XMLHttpRequest for progress tracking
      setState(s => ({ ...s, progress: 20 }));

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', upload_url);
        xhr.setRequestHeader('Content-Type', file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = 20 + Math.round((e.loaded / e.total) * 70); // 20-90%
            setState(s => ({ ...s, progress: pct }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      });

      setState({ uploading: false, progress: 100, error: null });
      toast.success(`"${file.name}" uploaded`);
      return { storage_path };
    } catch (err: any) {
      const msg = err.message ?? 'Upload failed';
      setState({ uploading: false, progress: 0, error: msg });
      toast.error(msg);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null });
  }, []);

  return { ...state, upload, reset };
}

// ── Download Hook ──────────────────────────────────────────────

export function useFileDownload() {
  return useApiMutation<void, string>(
    async (storageKey) => {
      const { download_url } = await storageApi.getDownloadUrl(storageKey);
      // Open in new tab
      window.open(download_url, '_blank');
    },
  );
}

// ── Delete Hook ────────────────────────────────────────────────

export function useFileDelete() {
  return useApiMutation<{ success: true }, string>(
    async (fileId) => {
      const result = await storageApi.deleteFile(fileId);
      toast.success('File deleted');
      return result;
    },
  );
}
