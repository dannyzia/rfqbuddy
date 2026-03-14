import { FastifyRequest, FastifyReply } from 'fastify';
import { buyService } from '../services/buy.service';

export const buyController = {
  async browse(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as any;
    const result = await buyService.browseItems({
      categoryId: query.categoryId,
      search: query.search,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
    });
    return reply.send(result);
  },

  async getCart(req: FastifyRequest, reply: FastifyReply) {
    const cart = await buyService.getCart(req.user.id);
    return reply.send(cart);
  },

  async addToCart(req: FastifyRequest, reply: FastifyReply) {
    const { item_id, quantity } = req.body as { item_id: string; quantity?: string };
    const item = await buyService.addToCart(req.user.id, item_id, quantity ?? '1');
    return reply.send(item);
  },

  async removeFromCart(req: FastifyRequest, reply: FastifyReply) {
    const { itemId } = req.params as { itemId: string };
    await buyService.removeFromCart(req.user.id, itemId);
    return reply.send({ success: true });
  },

  async checkout(req: FastifyRequest, reply: FastifyReply) {
    const { delivery_address, notes } = req.body as { delivery_address: string; notes?: string };
    const order = await buyService.checkout(req.user.id, req.user.org_id, delivery_address, notes);
    return reply.code(201).send(order);
  },

  async listOrders(req: FastifyRequest, reply: FastifyReply) {
    const orders = await buyService.listOrders(req.user.id);
    return reply.send(orders);
  },

  async getOrder(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = await buyService.getOrderById(id);
    if (!result) return reply.code(404).send({ error: 'Order not found' });
    return reply.send(result);
  },
};
