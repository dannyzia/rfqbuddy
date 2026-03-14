import { db } from '../config/database';
import {
  catalogueItems, catalogueCategories, catalogueCartItems,
  catalogueOrders, catalogueOrderItems, organizations,
} from '../schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export const buyService = {
  async browseItems(params?: { categoryId?: string; search?: string; page?: number; pageSize?: number }) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;

    const data = await db.select({
      id: catalogueItems.id,
      name: catalogueItems.name,
      description: catalogueItems.description,
      sku: catalogueItems.sku,
      unit: catalogueItems.unit,
      unit_price: catalogueItems.unit_price,
      currency: catalogueItems.currency,
      image_url: catalogueItems.image_url,
      vendor_name: organizations.name,
      category_name: catalogueCategories.name,
    })
      .from(catalogueItems)
      .leftJoin(organizations, eq(catalogueItems.vendor_org_id, organizations.id))
      .leftJoin(catalogueCategories, eq(catalogueItems.category_id, catalogueCategories.id))
      .where(eq(catalogueItems.is_active, true))
      .orderBy(catalogueItems.name)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(catalogueItems).where(eq(catalogueItems.is_active, true));

    return { data, total: Number(count), page, pageSize };
  },

  async getCart(userId: string) {
    return db.select({
      id: catalogueCartItems.id,
      item_id: catalogueCartItems.item_id,
      quantity: catalogueCartItems.quantity,
      item_name: catalogueItems.name,
      unit_price: catalogueItems.unit_price,
      currency: catalogueItems.currency,
      vendor_name: organizations.name,
    })
      .from(catalogueCartItems)
      .innerJoin(catalogueItems, eq(catalogueCartItems.item_id, catalogueItems.id))
      .leftJoin(organizations, eq(catalogueItems.vendor_org_id, organizations.id))
      .where(eq(catalogueCartItems.user_id, userId));
  },

  async addToCart(userId: string, itemId: string, quantity: string) {
    const [item] = await db.insert(catalogueCartItems).values({
      user_id: userId,
      item_id: itemId,
      quantity,
    }).onConflictDoUpdate({
      target: [catalogueCartItems.user_id, catalogueCartItems.item_id],
      set: { quantity, updated_at: new Date() },
    }).returning();
    return item;
  },

  async removeFromCart(userId: string, itemId: string) {
    await db.delete(catalogueCartItems)
      .where(and(eq(catalogueCartItems.user_id, userId), eq(catalogueCartItems.item_id, itemId)));
  },

  async checkout(userId: string, orgId: string | null, deliveryAddress: string, notes?: string) {
    const cartItems = await db.select({
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
      .where(eq(catalogueCartItems.user_id, userId));

    if (!cartItems.length) throw new Error('Cart is empty');

    const totalAmount = cartItems.reduce(
      (sum, i) => sum + Number(i.unit_price) * Number(i.quantity), 0,
    ).toFixed(2);

    const [order] = await db.insert(catalogueOrders).values({
      order_number: `CO-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`,
      buyer_id: userId,
      buyer_org_id: orgId,
      total_amount: totalAmount,
      currency: cartItems[0].currency ?? 'BDT',
      delivery_address: deliveryAddress,
      notes,
    }).returning();

    for (const item of cartItems) {
      await db.insert(catalogueOrderItems).values({
        order_id: order.id,
        item_id: item.item_id,
        vendor_org_id: item.vendor_org_id,
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_price: (Number(item.unit_price) * Number(item.quantity)).toFixed(2),
        currency: item.currency ?? 'BDT',
      });
    }

    // Clear cart
    await db.delete(catalogueCartItems).where(eq(catalogueCartItems.user_id, userId));

    return order;
  },

  async listOrders(userId: string) {
    return db.select().from(catalogueOrders)
      .where(eq(catalogueOrders.buyer_id, userId))
      .orderBy(desc(catalogueOrders.created_at));
  },

  async getOrderById(orderId: string) {
    const [order] = await db.select().from(catalogueOrders)
      .where(eq(catalogueOrders.id, orderId)).limit(1);
    if (!order) return null;

    const items = await db.select().from(catalogueOrderItems)
      .where(eq(catalogueOrderItems.order_id, orderId));

    return { order, items };
  },
};
