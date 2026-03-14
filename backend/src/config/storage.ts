// Cloudflare R2 storage client (S3-compatible)
// Zero egress fees — critical for document-heavy procurement platform

import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET = env.R2_BUCKET_NAME;

// File path conventions:
//   tenders/{tender_id}/{filename}
//   bids/{bid_id}/{filename}
//   contracts/{contract_id}/{filename}
//   profiles/{org_id}/{filename}
//   avatars/{user_id}/{filename}

// Allowed MIME types per context
export const ALLOWED_TYPES = {
  documents: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  avatars: ['image/png', 'image/jpeg', 'image/webp'],
} as const;

// Size limits
export const MAX_FILE_SIZE = {
  documents: 25 * 1024 * 1024,  // 25 MB
  avatars: 2 * 1024 * 1024,      // 2 MB
} as const;

// Helpers
export function buildStoragePath(
  entity: 'tenders' | 'bids' | 'contracts' | 'profiles' | 'avatars',
  entityId: string,
  fileName: string
): string {
  // Sanitize filename — remove path traversal, special chars
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${entity}/${entityId}/${Date.now()}-${safe}`;
}
