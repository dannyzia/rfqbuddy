import { api } from '../api-client';
import type { BuyItem, CartItemBuy, BuyOrder, PaginatedResponse } from '../api-types';

export const buyApi = {
  browseItems(params?: { categoryId?: string; search?: string; page?: number; pageSize?: number }) {
    return api.get<PaginatedResponse<BuyItem>>('/api/buy/items', params);
  },

  getCart() {
    return api.get<CartItemBuy[]>('/api/buy/cart');
  },

  addToCart(itemId: string, quantity?: number) {
    return api.post<CartItemBuy>('/api/buy/cart', { item_id: itemId, quantity });
  },

  updateCartItem(itemId: string, quantity: number) {
    return api.patch<CartItemBuy>(`/api/buy/cart/${itemId}`, { quantity });
  },

  removeFromCart(itemId: string) {
    return api.delete<{ success: true }>(`/api/buy/cart/${itemId}`);
  },

  checkout(data: { delivery_address: string; cost_center?: string; notes?: string }) {
    return api.post<BuyOrder>('/api/buy/checkout', data);
  },

  listOrders(params?: { page?: number; pageSize?: number; status?: string }) {
    return api.get<BuyOrder[]>('/api/buy/orders', params);
  },

  getOrder(id: string) {
    return api.get<BuyOrder>(`/api/buy/orders/${id}`);
  },
};
