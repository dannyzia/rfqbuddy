import { db } from '../config/database';
import { activityLogs } from '../schema';
import { eq, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

// Blockchain audit anchoring service.
// In production, this would write SHA-256 hashes to an immutable ledger (Hyperledger Fabric, Polygon, etc.).
// For MVP, we compute hashes and store anchor records in-memory, backed by activity_logs.

interface AnchorRecord {
  id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  payload_hash: string;
  block_number: number | null;
  tx_hash: string | null;
  anchored_at: string;
  verified: boolean;
}

const anchors: Map<string, AnchorRecord> = new Map();
let nextBlock = 1001;

export const blockchainAuditService = {
  async anchor(data: {
    event_type: string;
    entity_type: string;
    entity_id: string;
    payload: Record<string, any>;
    user_id: string;
  }) {
    const payloadStr = JSON.stringify(data.payload, Object.keys(data.payload).sort());
    const payloadHash = crypto.createHash('sha256').update(payloadStr).digest('hex');

    const id = crypto.randomUUID();
    const blockNumber = nextBlock++;
    const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;

    const record: AnchorRecord = {
      id,
      event_type: data.event_type,
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      payload_hash: payloadHash,
      block_number: blockNumber,
      tx_hash: txHash,
      anchored_at: new Date().toISOString(),
      verified: true,
    };
    anchors.set(id, record);

    // Also log to activity_logs for persistence
    await db.insert(activityLogs).values({
      user_id: data.user_id,
      action: 'BLOCKCHAIN_ANCHOR',
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      description: `Blockchain anchor: ${data.event_type}`,
      metadata: {
        anchor_id: id,
        payload_hash: payloadHash,
        block_number: blockNumber,
        tx_hash: txHash,
      },
    });

    return record;
  },

  async verify(anchorId: string) {
    const record = anchors.get(anchorId);
    if (!record) return null;
    // In production: re-read from blockchain and compare hashes
    return { ...record, verified: true, verified_at: new Date().toISOString() };
  },

  listAnchors(params?: { entity_type?: string; page?: number; pageSize?: number }) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    let items = Array.from(anchors.values());

    if (params?.entity_type) {
      items = items.filter(a => a.entity_type === params.entity_type);
    }

    items.sort((a, b) => new Date(b.anchored_at).getTime() - new Date(a.anchored_at).getTime());
    const total = items.length;
    const paged = items.slice((page - 1) * pageSize, page * pageSize);

    return { data: paged, total, page, pageSize };
  },
};
