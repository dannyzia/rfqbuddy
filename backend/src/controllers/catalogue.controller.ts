import { FastifyRequest, FastifyReply } from 'fastify';
import { catalogueService } from '../services/catalogue.service';

export const catalogueController = {
  // ── Categories ────────────────────────────────────────────────

  async getCategories(_req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await catalogueService.getCategoryTree());
  },

  // ── Items ─────────────────────────────────────────────────────

  async listItems(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    return reply.send(await catalogueService.listItems({
      category_id: query.category_id, vendor_org_id: query.vendor_org_id,
      search: query.search, page: parseInt(query.page ?? '1'), pageSize: parseInt(query.pageSize ?? '20'),
    }));
  },

  async createItem(req: FastifyRequest, reply: FastifyReply) {
    return reply.code(201).send(await catalogueService.createItem(req.body as any, req.user));
  },

  async updateItem(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    return reply.send(await catalogueService.updateItem(id, req.body as any));
  },

  async deleteItem(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await catalogueService.deleteItem(id);
    return reply.send({ success: true });
  },

  // ── Cart ──────────────────────────────────────────────────────

  async getCart(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(await catalogueService.getCart(req.user.id));
  },

  async addToCart(req: FastifyRequest, reply: FastifyReply) {
    const { item_id, quantity } = req.body as { item_id: string; quantity?: number };
    return reply.code(201).send(
      await catalogueService.addToCart(req.user.id, item_id, quantity ?? 1),
    );
  },

  async updateCartItem(req: FastifyRequest, reply: FastifyReply) {
    const { item_id } = req.params as { item_id: string };
    const { quantity } = req.body as { quantity: number };
    return reply.send(
      await catalogueService.updateCartItem(req.user.id, item_id, quantity),
    );
  },

  async clearCart(req: FastifyRequest, reply: FastifyReply) {
    await catalogueService.clearCart(req.user.id);
    return reply.send({ success: true });
  },

  // ── Checkout ──────────────────────────────────────────────────

  async checkout(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = req.body as { delivery_address?: string; notes?: string };
      const order = await catalogueService.checkout(req.user, body);
      return reply.code(201).send(order);
    } catch (err: any) {
      if (err.message === 'Cart is empty') {
        return reply.code(400).send({ error: 'Cart is empty' });
      }
      throw err;
    }
  },

  // ── Orders ────────────────────────────────────────────────────

  async listOrders(req: FastifyRequest, reply: FastifyReply) {
    const isAdmin = req.user.role === 'super_admin' || req.user.role === 'pe_admin';
    const orders = isAdmin
      ? await catalogueService.listAllOrders()
      : await catalogueService.listOrders(req.user.id);
    return reply.send(orders);
  },

  async getOrderById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = await catalogueService.getOrderById(id);
    if (!result) return reply.code(404).send({ error: 'Order not found' });
    return reply.send(result);
  },
};
