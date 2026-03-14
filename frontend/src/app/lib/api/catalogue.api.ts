import { api } from '../api-client';
import type { CatalogueCategory, CatalogueItem, CartItem, CatalogueOrder, CatalogueOrderItem } from '../api-types';

export const catalogueApi = {
  // ── Categories ────────────────────────────────────────────────

  getCategories() {
    return api.get<CatalogueCategory[]>('/api/catalogue/categories');
  },

  // ── Items ─────────────────────────────────────────────────────

  listItems(params?: { category_id?: string; vendor_org_id?: string; search?: string; page?: number; pageSize?: number }) {
    return api.get<CatalogueItem[]>('/api/catalogue/items', params);
  },

  createItem(data: Partial<CatalogueItem>) {
    return api.post<CatalogueItem>('/api/catalogue/items', data);
  },

  updateItem(id: string, data: Partial<CatalogueItem>) {
    return api.patch<CatalogueItem>(`/api/catalogue/items/${id}`, data);
  },

  deleteItem(id: string) {
    return api.delete<{ success: true }>(`/api/catalogue/items/${id}`);
  },

  // ── Cart ──────────────────────────────────────────────────────

  getCart() {
    return api.get<CartItem[]>('/api/catalogue/cart');
  },

  addToCart(item_id: string, quantity?: number) {
    return api.post<CartItem>('/api/catalogue/cart', { item_id, quantity: quantity ?? 1 });
  },

  updateCartItem(item_id: string, quantity: number) {
    return api.patch<CartItem | { removed: true }>(`/api/catalogue/cart/${item_id}`, { quantity });
  },

  clearCart() {
    return api.delete<{ success: true }>('/api/catalogue/cart');
  },

  // ── Checkout ──────────────────────────────────────────────────

  checkout(data?: { delivery_address?: string; notes?: string }) {
    return api.post<CatalogueOrder>('/api/catalogue/checkout', data ?? {});
  },

  // ── Orders ────────────────────────────────────────────────────

  listOrders() {
    return api.get<CatalogueOrder[]>('/api/catalogue/orders');
  },

  getOrderById(id: string) {
    return api.get<{ order: CatalogueOrder; items: CatalogueOrderItem[] }>(`/api/catalogue/orders/${id}`);
  },
};
