import { db } from '../config/database';
import {
  catalogueCategories, catalogueItems, catalogueCartItems,
  catalogueOrders, catalogueOrderItems,
} from '../schema';
import { eq, ilike, and, isNull, desc, sql } from 'drizzle-orm';
import type { RequestUser } from '../types';

export const catalogueService = {
  // ── Categories ────────────────────────────────────────────────

  async getCategories(parentId?: string) {
    if (parentId) {
      return db.select().from(catalogueCategories)
        .where(eq(catalogueCategories.parent_id, parentId))
        .orderBy(catalogueCategories.sort_order);
    }
    return db.select().from(catalogueCategories)
      .where(isNull(catalogueCategories.parent_id))
      .orderBy(catalogueCategories.sort_order);
  },

  async getCategoryTree() {
    const all = await db.select().from(catalogueCategories)
      .where(eq(catalogueCategories.is_active, true))
      .orderBy(catalogueCategories.sort_order);

    const map = new Map<string | null, typeof all>();
    for (const cat of all) {
      const parentId = cat.parent_id;
      if (!map.has(parentId)) map.set(parentId, []);
      map.get(parentId)!.push(cat);
    }

    function buildTree(parentId: string | null): any[] {
      const children = map.get(parentId) ?? [];
      return children.map(cat => ({
        ...cat,
        children: buildTree(cat.id),
      }));
    }

    return buildTree(null);
  },

  // ── Items ─────────────────────────────────────────────────────

  async listItems(filters: {
    category_id?: string;
    vendor_org_id?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    let query = db.select().from(catalogueItems)
      .where(eq(catalogueItems.is_active, true))
      .$dynamic();

    if (filters.category_id) {
      query = query.where(eq(catalogueItems.category_id, filters.category_id));
    }
    if (filters.vendor_org_id) {
      query = query.where(eq(catalogueItems.vendor_org_id, filters.vendor_org_id));
    }
    if (filters.search) {
      query = query.where(ilike(catalogueItems.name, `%${filters.search}%`));
    }

    return query.orderBy(desc(catalogueItems.created_at)).limit(pageSize).offset(offset);
  },

  async createItem(data: typeof catalogueItems.$inferInsert, user: RequestUser) {
    const [item] = await db.insert(catalogueItems).values({
      ...data,
      vendor_org_id: user.org_id!,
    }).returning();
    return item;
  },

  async updateItem(id: string, data: Partial<typeof catalogueItems.$inferInsert>) {
    const [updated] = await db.update(catalogueItems)
      .set({ ...data, updated_at: new Date() })
      .where(eq(catalogueItems.id, id))
      .returning();
    return updated;
  },

  async deleteItem(id: string) {
    await db.update(catalogueItems)
      .set({ is_active: false, updated_at: new Date() })
      .where(eq(catalogueItems.id, id));
  },

  // ── Cart ──────────────────────────────────────────────────────

  async getCart(userId: string) {
    const rows = await db
      .select({
        cart_id: catalogueCartItems.id,
        item_id: catalogueCartItems.item_id,
        quantity: catalogueCartItems.quantity,
        created_at: catalogueCartItems.created_at,
        updated_at: catalogueCartItems.updated_at,
        item_name: catalogueItems.name,
        item_sku: catalogueItems.sku,
        item_unit: catalogueItems.unit,
        item_unit_price: catalogueItems.unit_price,
        item_currency: catalogueItems.currency,
        item_image_url: catalogueItems.image_url,
        vendor_org_id: catalogueItems.vendor_org_id,
      })
      .from(catalogueCartItems)
      .innerJoin(catalogueItems, eq(catalogueCartItems.item_id, catalogueItems.id))
      .where(eq(catalogueCartItems.user_id, userId))
      .orderBy(desc(catalogueCartItems.created_at));

    return rows;
  },

  async addToCart(userId: string, itemId: string, quantity: number) {
    // Upsert: if item already in cart, increment quantity
    const [existing] = await db.select().from(catalogueCartItems)
      .where(and(
        eq(catalogueCartItems.user_id, userId),
        eq(catalogueCartItems.item_id, itemId),
      )).limit(1);

    if (existing) {
      const newQty = parseFloat(existing.quantity) + quantity;
      const [updated] = await db.update(catalogueCartItems)
        .set({ quantity: String(newQty), updated_at: new Date() })
        .where(eq(catalogueCartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [inserted] = await db.insert(catalogueCartItems).values({
      user_id: userId,
      item_id: itemId,
      quantity: String(quantity),
    }).returning();
    return inserted;
  },

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      await db.delete(catalogueCartItems)
        .where(and(
          eq(catalogueCartItems.user_id, userId),
          eq(catalogueCartItems.item_id, itemId),
        ));
      return { removed: true };
    }

    const [updated] = await db.update(catalogueCartItems)
      .set({ quantity: String(quantity), updated_at: new Date() })
      .where(and(
        eq(catalogueCartItems.user_id, userId),
        eq(catalogueCartItems.item_id, itemId),
      ))
      .returning();
    return updated;
  },

  async clearCart(userId: string) {
    await db.delete(catalogueCartItems)
      .where(eq(catalogueCartItems.user_id, userId));
  },

  // ── Checkout ──────────────────────────────────────────────────

  async checkout(user: RequestUser, data: { delivery_address?: string; notes?: string }) {
    // Fetch cart with item details
    const cartRows = await db
      .select({
        item_id: catalogueCartItems.item_id,
        quantity: catalogueCartItems.quantity,
        name: catalogueItems.name,
        sku: catalogueItems.sku,
        unit: catalogueItems.unit,
        unit_price: catalogueItems.unit_price,
        currency: catalogueItems.currency,
        vendor_org_id: catalogueItems.vendor_org_id,
      })
      .from(catalogueCartItems)
      .innerJoin(catalogueItems, eq(catalogueCartItems.item_id, catalogueItems.id))
      .where(eq(catalogueCartItems.user_id, user.id));

    if (cartRows.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate totals
    const orderItems = cartRows.map(row => ({
      item_id: row.item_id,
      vendor_org_id: row.vendor_org_id,
      name: row.name,
      sku: row.sku,
      unit: row.unit,
      unit_price: row.unit_price,
      quantity: row.quantity,
      total_price: String(parseFloat(row.unit_price) * parseFloat(row.quantity)),
      currency: row.currency ?? 'BDT',
    }));

    const totalAmount = orderItems.reduce((sum, oi) => sum + parseFloat(oi.total_price), 0);

    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    // Create order
    const [order] = await db.insert(catalogueOrders).values({
      order_number: orderNumber,
      buyer_id: user.id,
      buyer_org_id: user.org_id ?? null,
      total_amount: String(totalAmount),
      currency: 'BDT',
      delivery_address: data.delivery_address ?? null,
      notes: data.notes ?? null,
    }).returning();

    // Create order items
    await db.insert(catalogueOrderItems).values(
      orderItems.map(oi => ({
        order_id: order.id,
        ...oi,
      })),
    );

    // Clear cart
    await db.delete(catalogueCartItems)
      .where(eq(catalogueCartItems.user_id, user.id));

    return order;
  },

  // ── Orders ────────────────────────────────────────────────────

  async listOrders(userId: string) {
    return db.select().from(catalogueOrders)
      .where(eq(catalogueOrders.buyer_id, userId))
      .orderBy(desc(catalogueOrders.created_at));
  },

  async listAllOrders() {
    return db.select().from(catalogueOrders)
      .orderBy(desc(catalogueOrders.created_at));
  },

  async getOrderById(id: string) {
    const [order] = await db.select().from(catalogueOrders)
      .where(eq(catalogueOrders.id, id)).limit(1);
    if (!order) return null;

    const items = await db.select().from(catalogueOrderItems)
      .where(eq(catalogueOrderItems.order_id, id))
      .orderBy(catalogueOrderItems.created_at);

    return { order, items };
  },
};
